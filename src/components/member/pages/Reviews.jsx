"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaExclamationCircle } from "react-icons/fa";
import { useAuth } from "@/hooks/common/useAuth";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import useUserReviews from "@/hooks/review/useUserReviews";

export default function Reviews() {
  const router = useRouter();
  const { userId } = useAuth();

  const [tab, setTab] = useState("available"); // 'available' | 'written'
  const [subTab, setSubTab] = useState("purchase"); // 현재는 'purchase'만 사용
  const [sortOption, setSortOption] = useState("order"); // 'order' | 'review'

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // ✅ 내 리뷰 가져오기 (userId 기준)
  const {
    reviews: userReviews,
    loading: userReviewLoading,
    error: userReviewError,
  } = useUserReviews(userId);

  // ✅ bookId 기준 내 리뷰 맵
  const userReviewMap = userReviews.reduce((acc, r) => {
    acc[r.bookId] = r; // 한 책당 하나라고 가정
    return acc;
  }, {});

  // ✅ 날짜 포맷 함수 (UTC → 한국 시간)
  const convertToKoreaTime = (dateString) => {
    if (!dateString) return "";

    try {
      let date;

      if (dateString.includes("T")) {
        date = new Date(dateString);
      } else if (dateString.includes(" ")) {
        const utcString = dateString.replace(" ", "T") + "Z";
        date = new Date(utcString);
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return dateString;
      }

      return date.toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch (err) {
      console.error("Date conversion error:", err, dateString);
      return dateString;
    }
  };

  // ✅ 주문 내역 조회 (Orders 페이지와 동일 API)
  useEffect(() => {
    if (!userId) {
      setOrdersLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError(null);

        const res = await fetch(`/api/user/orders/getOrders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            "서버 응답이 올바르지 않습니다. API 경로를 확인하세요."
          );
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "주문 내역 조회 실패");

        setOrders(data);
      } catch (err) {
        console.error("주문 조회 에러:", err);
        setOrdersError(err.message);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // ✅ 배송완료 주문만 대상으로 사용
  const deliveredItems = orders.filter(
    (order) => order.shipping_status === "배송완료"
  );

  // ✅ 분류: 작성 가능한 리뷰 / 작성한 리뷰
  const availableItems = deliveredItems.filter(
    (item) => !userReviewMap[item.book_id]
  );
  const writtenItemsRaw = deliveredItems.filter(
    (item) => !!userReviewMap[item.book_id]
  );

  // ✅ writtenItems에 리뷰 정보까지 합쳐서 사용
  const writtenItems = writtenItemsRaw.map((item) => ({
    ...item,
    review: userReviewMap[item.book_id],
  }));

  // ✅ 정렬 (간단 버전)
  const sortItems = (items) => {
    if (sortOption === "order") {
      // 결제/주문일 기준 내림차순
      return [...items].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }

    if (sortOption === "review") {
      // 리뷰 작성일 기준 내림차순 (written 탭에서만 의미 있음)
      return [...items].sort((a, b) => {
        const aDate = a.review?.date || a.review?.createdAt || a.date;
        const bDate = b.review?.date || b.review?.createdAt || b.date;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
    }

    return items;
  };

  const sortedAvailableItems = sortItems(availableItems);
  const sortedWrittenItems = sortItems(writtenItems);

  const totalWrittenCount = writtenItems.length;

  const handleCreateReview = (bookId) => {
    router.push(`/member?MemberTab=createreview&bookId=${bookId}`);
  };

  const handleEditReview = (bookId, reviewId) => {
    router.push(
      `/member?MemberTab=createreview&bookId=${bookId}&reviewId=${reviewId}`
    );
  };

  if (!userId) {
    return (
      <ProtectedRoute>
        <div className="w-full bg-gray-50 min-h-screen py-10 flex justify-center">
          <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm p-8">
            <p className="text-center mt-10">로그인이 필요합니다.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const isLoading = ordersLoading || userReviewLoading;

  return (
    <ProtectedRoute>
      <div className="w-full bg-gray-50 min-h-screen py-10 flex justify-center">
        <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm p-8">
          {/* 🏷️ 헤더 */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">리뷰</h1>
          </div>

          {/* 🧭 상단 탭 */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setTab("available")}
              className={`flex-1 py-3 font-medium ${
                tab === "available"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              작성 가능한 리뷰
            </button>
            <button
              onClick={() => setTab("written")}
              className={`flex-1 py-3 font-medium ${
                tab === "written"
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              작성한 리뷰({totalWrittenCount})
            </button>
          </div>

          {/* 📁 하위 탭 (지금은 구매 리뷰만) */}
          <div className="flex bg-gray-100 rounded-t-md">
            <button
              onClick={() => setSubTab("purchase")}
              className={`flex-1 py-3 text-sm ${
                subTab === "purchase"
                  ? "bg-white border-t border-l border-r border-gray-200 font-medium"
                  : "text-gray-500"
              }`}
            >
              구매 리뷰
            </button>
          </div>

          {/* 📋 내용 영역 */}
          <div className="p-8 border rounded-b-md min-h-[300px]">
            {/* 안내 문구 */}
            <p className="text-gray-700 mb-3">
              {tab === "available"
                ? "구매하신 상품 중 리뷰를 작성할 수 있는 도서 목록입니다."
                : "작성하신 리뷰를 확인하고 관리할 수 있습니다."}
            </p>

            {/* 정렬 옵션 */}
            <div className="flex justify-end mb-6">
              <select
                className="border border-gray-300 rounded px-3 py-2 text-sm"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="order">결제 완료 순</option>
                <option value="review">리뷰 작성일 순</option>
              </select>
            </div>

            {/* 로딩 / 에러 처리 */}
            {isLoading && (
              <div className="flex justify-center items-center py-16">
                <p className="text-gray-500">
                  리뷰 정보를 불러오는 중입니다...
                </p>
              </div>
            )}

            {!isLoading && (ordersError || userReviewError) && (
              <div className="flex flex-col items-center justify-center text-center py-16">
                <FaExclamationCircle size={40} className="text-red-400 mb-3" />
                <p className="text-sm text-red-500 mb-2">
                  리뷰 또는 주문 정보를 불러오는 중 오류가 발생했습니다.
                </p>
                <p className="text-xs text-gray-500">
                  {ordersError || userReviewError}
                </p>
              </div>
            )}

            {/* 실제 리스트 렌더링 */}
            {!isLoading && !ordersError && !userReviewError && (
              <>
                {tab === "available" && (
                  <>
                    {sortedAvailableItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-20">
                        <FaExclamationCircle
                          size={40}
                          className="text-gray-400 mb-3"
                        />
                        <p className="text-sm text-gray-500 mb-4">
                          배송완료된 주문 중, 아직 작성 가능한 리뷰가 없습니다.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {sortedAvailableItems.map((item) => (
                          <div
                            key={`${item.order_number}-${item.book_id}`}
                            className="flex gap-4 items-center border rounded-lg p-4 bg-[var(--bg-color)]"
                          >
                            <img
                              src={item.cover || "https://placehold.co/80x110"}
                              alt={item.title}
                              className="w-80 h-110 object-cover rounded border"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-16 mb-2">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500 mb-1">
                                주문번호: {item.order_number}
                              </p>
                              <p className="text-xs text-gray-500 mb-3">
                                주문일: {convertToKoreaTime(item.date)}
                              </p>
                            </div>
                            <button
                              onClick={() => handleCreateReview(item.book_id)}
                              className="px-15 py-8 bg-[var(--main-color)] text-white rounded text-sm hover:opacity-90 transition cursor-pointer whitespace-nowrap"
                            >
                              리뷰 작성
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {tab === "written" && (
                  <>
                    {sortedWrittenItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-20">
                        <FaExclamationCircle
                          size={40}
                          className="text-gray-400 mb-3"
                        />
                        <p className="text-sm text-gray-500 mb-4">
                          아직 작성한 리뷰가 없습니다.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {sortedWrittenItems.map((item) => (
                          <div
                            key={`${item.order_number}-${item.book_id}`}
                            className="border rounded-lg p-4 bg-[var(--bg-color)]"
                          >
                            <div className="flex gap-4">
                              <img
                                src={
                                  item.cover || "https://placehold.co/80x110"
                                }
                                alt={item.title}
                                className="w-80 h-110 object-cover rounded border"
                              />
                              <div className="flex-1">
                                <div className="flex justify-between mb-2">
                                  <div>
                                    <p className="font-medium text-16 mb-1">
                                      {item.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      주문일: {convertToKoreaTime(item.date)}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm text-gray-500">
                                    <p>
                                      리뷰 작성일:{" "}
                                      {item.review?.date ||
                                        item.review?.createdAt}
                                    </p>
                                  </div>
                                </div>

                                {/* 평점 */}
                                <div className="text-yellow-500 text-sm mb-2">
                                  {"⭐".repeat(item.review?.rating || 0)}
                                </div>

                                {/* 리뷰 내용 */}
                                <p className="text-sm text-gray-800 whitespace-pre-line mb-3">
                                  {item.review?.content}
                                </p>

                                <div className="flex gap-3 justify-end">
                                  <button
                                    onClick={() =>
                                      handleEditReview(
                                        item.book_id,
                                        item.review?.id
                                      )
                                    }
                                    className="px-12 py-6 border border-[var(--main-color)] text-[var(--main-color)] rounded text-xs hover:bg-[var(--main-color)] hover:text-white transition cursor-pointer"
                                  >
                                    리뷰 수정
                                  </button>
                                  {/* 삭제는 나중에 API 붙일 때 구현 */}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
