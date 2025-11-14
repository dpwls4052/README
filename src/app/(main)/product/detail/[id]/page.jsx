"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import WishListButton from "@/components/common/WishListButton";

const userId = 4;

// Mock 리뷰 및 FAQ 데이터
const MOCK_DETAIL_TABS_DATA = {
  reviews: [
    {
      id: 1,
      author: "독서광123",
      rating: 5,
      date: "2025-01-15",
      content: "정말 감동적인 책이었습니다. 강력 추천합니다!",
      avatar: "https://bit.ly/dan-abramov",
    },
    {
      id: 2,
      author: "책벌레",
      rating: 4,
      date: "2025-01-10",
      content: "내용이 알차고 좋았어요. 다만 중반부가 조금 지루했습니다.",
      avatar: "https://bit.ly/kent-c-dodds",
    },
    {
      id: 3,
      author: "리더777",
      rating: 5,
      date: "2025-01-05",
      content: "인생 책으로 등극! 여러 번 읽고 싶네요.",
      avatar: "https://bit.ly/ryan-florence",
    },
  ],
  faqs: [
    {
      id: 1,
      question: "배송은 얼마나 걸리나요?",
      answer: "일반적으로 주문 후 2-3일 내에 배송됩니다.",
    },
    {
      id: 2,
      question: "반품/교환이 가능한가요?",
      answer:
        "상품 수령 후 7일 이내 미개봉 상태에 한해 반품/교환이 가능합니다.",
    },
  ],
};

const ProductDetail = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params?.id;

  const [activeTab, setActiveTab] = useState("description");
  const [isWished, setIsWished] = useState(false);
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      if (!bookId) return;

      try {
        setLoading(true);
        const docRef = doc(db, "books", bookId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBookData({
            id: docSnap.id,
            ...docSnap.data(),
            ...MOCK_DETAIL_TABS_DATA,
          });
        } else {
          setError("책 정보를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("Error fetching book:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [bookId]);

  const toggleWishlist = () => setIsWished(!isWished);

  const handleAddToCart = () => {
    alert(`${bookData.title}이(가) 장바구니에 담겼습니다.`);
  };

  const handleBuyNow = () => {
    alert(`${bookData.title} 결제가 완료되었습니다.`);
    router.push("/kt_3team_project_2025/success");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-xl text-(--main-color)">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !bookData) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="text-xl text-red-500 mb-6">
            {error || "책을 찾을 수 없습니다."}
          </div>
          <button
            onClick={() => router.back()}
            style={{ borderRadius: "var(--radius-15)" }}
            className="px-8 py-3 bg-(--main-color) text-white font-medium hover:opacity-90 transition-opacity"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  const totalReviews = bookData.reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? (
          bookData.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;

  const highResCover = bookData.cover.replace(/coversum/gi, "cover500");

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 mt-50">
      {/* 상품 정보 영역 */}
      <div className="flex mb-80 gap-80">
        {/* 이미지 */}
        <div className="w-400 h-auto rounded-md overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <Image
            src={highResCover}
            alt={bookData.title}
            width={600}
            height={600}
            className="object-contain"
          />
        </div>

        {/* 정보 */}
        <div className="flex flex-col space-y-6 py-20 flex-[2]">
          <div>
            <p className="text-16 text-gray-500 font-normal mb-2">
              {bookData.categoryName}
            </p>
            <h1 className="text-3xl font-bold text-black my-25">
              {bookData.title}
            </h1>
            <p className="text-18 font-normal text-gray-700">
              {bookData.author} | {bookData.publisher} | {bookData.pubDate}
            </p>
          </div>

          <div className=" py-20  border-b border-gray-200 text-right">
            <p className="text-4xl font-bold text-(--main-color)">
              {bookData.priceStandard?.toLocaleString()}원
            </p>
          </div>

          <div className="flex justify-between items-center py-15 my-0 border-b border-gray-200">
            <span className="font-semibold text-black text-20">재고량</span>
            <span
              style={{ borderRadius: "var(--radius-5)" }}
              className={`px-10 py-6 font-medium text-20 ${
                bookData.stock > 10
                  ? "bg-(--sub-color)/20 text-(--main-color)"
                  : bookData.stock > 0
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {bookData.stock > 0 ? `${bookData.stock}권` : "품절"}
            </span>
          </div>

          {bookData.salesCount && (
            <div className="flex justify-between items-center py-15 my-0 border-b border-gray-200">
              <span className="font-semibold text-black text-20">판매량</span>
              <span className="text-(--main-color) font-medium text-20">
                {bookData.salesCount?.toLocaleString()}권
              </span>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-6 py-20">
            <button
              onClick={async () => {
                if (!bookData || !userId) return;

                try {
                  // UI 즉시 반응
                  setIsWished((prev) => !prev);

                  console.log(userId, bookData.id, "값");

                  // DB 요청
                  const res = await fetch("/api/member/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      user_id: userId,
                      book_id: bookData.id,
                    }),
                  });

                  const data = await res.json();

                  if (!res.ok) {
                    console.error("Wishlist API error:", data);
                    // 실패 시 UI 되돌리기
                    setIsWished((prev) => !prev);
                  }
                } catch (err) {
                  console.error("Wishlist toggle failed:", err);
                  // 실패 시 UI 되돌리기
                  setIsWished((prev) => !prev);
                }
              }}
              disabled={bookData.stock === 0}
              className="p-4  text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWished ? (
                <IoIosHeart size={28} />
              ) : (
                <IoIosHeartEmpty size={28} />
              )}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={bookData.stock === 0}
              className="flex-1 bg-(--sub-color) text-white px-6 py-15 rounded font-semibold text-20 flex items-center justify-center gap-3 hover:opacity-90 hover:cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AiOutlineShoppingCart size={24} />
              장바구니
            </button>

            <button
              onClick={handleBuyNow}
              disabled={bookData.stock === 0}
              className="flex-1 bg-(--main-color) text-white px-6 py-15 rounded font-semibold text-20 hover:opacity-90 hover:cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed "
            >
              바로구매
            </button>
          </div>

          {bookData.link && (
            <a
              href={bookData.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--text-14) text-(--sub-color) hover:text-(--main-color) font-medium hover:underline transition-colors text-right"
            >
              알라딘에서 보기 →
            </a>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className=" pt-12">
        <div className="flex gap-30 border-b-2 border-gray-200">
          {["description", "reviews", "faq"].map((tab) => (
            <button
              key={tab}
              className={`pb-10 px-2 font-normal text-20 transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-(--main-color) text-(--main-color) -mb-[2px]"
                  : "text-gray-600 hover:text-(--main-color)"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "description"
                ? "상품설명"
                : tab === "reviews"
                ? `리뷰 (${bookData.reviews.length})`
                : `FAQ (${bookData.faqs.length})`}
            </button>
          ))}
        </div>

        {/* 탭 내용 */}
        <div className="mt-15">
          {activeTab === "description" && (
            <div
              style={{ borderRadius: "var(--radius-15)" }}
              className="bg-(--bg-color) p-15"
            >
              <p className="text-18 leading-relaxed font-light text-black whitespace-pre-line">
                {bookData.description}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-10">
              <div
                style={{ borderRadius: "var(--radius-15)" }}
                className="flex gap-12 items-center  p-15"
              >
                <span className="font-semibold text-16 text-black">
                  전체 리뷰 {totalReviews}개
                </span>
                <span className="text-(--main-color) font-semibold text-20">
                  평균 ⭐ {averageRating}
                </span>
              </div>

              {bookData.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-25 rounded-sm bg-(--bg-color) "
                >
                  <div className="flex gap-10">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-30 h-30 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-10">
                        <span className="font-semibold text-black text-20">
                          {review.author}
                        </span>
                        <span className="text-16 font-normal text-gray-500">
                          {review.date}
                        </span>
                      </div>
                      <div className=" text-16">
                        {"⭐".repeat(review.rating)}
                      </div>
                      <p className="text-18 mt-20 font-light text-black leading-relaxed">
                        {review.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-10">
              {bookData.faqs.map((faq) => (
                <div key={faq.id} className="p-25 rounded-sm  bg-(--bg-color)">
                  <p className="font-bold text-(--main-color) mb-20 text-20">
                    Q. {faq.question}
                  </p>
                  <p className="pl-20 font-light text-black text-18 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
