"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import WishListButton from "@/components/common/WishListButton";
import AddToCartButton from "@/components/common/AddToCartButton";
import BuyNowButton from "@/components/common/BuyNowButton";
import { useAuth } from "@/hooks/common/useAuth";
import { useBook } from "@/hooks/book/useBook";
import useBookReviews from "@/hooks/review/useBookReviews";

// Mock 리뷰 및 FAQ 데이터
const MOCK_DETAIL_TABS_DATA = {
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
    {
      id: 3,
      question: "중고 도서도 판매하나요?",
      answer:
        "현재는 신품 도서만 판매하고 있으며, 중고 도서는 지원하지 않습니다.",
    },
    {
      id: 4,
      question: "주문한 책은 어떻게 포장되나요?",
      answer:
        "모든 도서는 배송 중 손상이 없도록 에어캡으로 안전하게 포장됩니다.",
    },
    {
      id: 5,
      question: "주문 후 배송지를 변경할 수 있나요?",
      answer:
        "상품 준비 이전 단계라면 고객센터를 통해 배송지 변경이 가능합니다.",
    },
    {
      id: 6,
      question: "결제 수단은 어떤 것이 있나요?",
      answer:
        "신용카드, 체크카드, 카카오페이, 네이버페이 등 다양한 결제 수단을 지원합니다.",
    },
    {
      id: 7,
      question: "품절된 도서는 재입고 되나요?",
      answer:
        "일부 도서는 재입고 예정이 있으나, 출판사 사정에 따라 달라질 수 있습니다.",
    },
    {
      id: 8,
      question: "영수증이나 구매 내역은 어디서 확인하나요?",
      answer:
        "마이페이지 내 '주문 내역'에서 영수증 및 구매 내역을 확인할 수 있습니다.",
    },
    {
      id: 9,
      question: "도서에 하자가 있을 경우 어떻게 하나요?",
      answer:
        "파본이나 인쇄 오류가 있을 경우 무료로 교환해드립니다. 고객센터로 문의해주세요.",
    },
    {
      id: 10,
      question: "선물 포장 서비스가 있나요?",
      answer: "현재는 선물 포장 서비스는 지원하지 않습니다.",
    },
  ],
};

const ProductDetail = () => {
  const router = useRouter();
  const params = useParams();
  const bookId = params?.id;
  const { userId } = useAuth();
  const {
    reviews,
    loading: reviewLoading,
    error: reviewError,
  } = useBookReviews(bookId);
  
  const [activeTab, setActiveTab] = useState("description");
  const { book, loading, error } = useBook(bookId);

  // 배경색 생성 함수 (첫 글자 기반으로 일관된 색상)
  const getAvatarColor = (char) => {
    if (!char) return "#4ECDC4";
    const colors = [
      "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A",
      "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2",
      "#F8B739", "#52B788", "#E76F51", "#2A9D8F"
    ];
    const charCode = char.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  // 텍스트 안 이미지 URL을 <img> 태그로 변환
  const renderDescriptionWithImages = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif))/gi;
    const parts = text.split(urlRegex);

    return parts.map((part, idx) => {
      if (part.match(urlRegex)) {
        return (
          <img
            key={idx}
            src={part}
            alt="description image"
            className="my-4 w-auto max-w-full rounded-md"
          />
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const bookInfo = book
    ? {
        ...book,
        faqs: MOCK_DETAIL_TABS_DATA.faqs,
      }
    : null;

  // 최근 본 도서 저장 기능 추가
  useEffect(() => {
    if (!bookInfo) return;

    const stored = JSON.parse(localStorage.getItem("recentBooks")) || [];

    const newBook = {
      id: bookInfo.bookId,
      title: bookInfo.title,
      author: bookInfo.author,
      image: bookInfo.cover,
    };

    const filtered = stored.filter((b) => b.id !== newBook.id);
    const updated = [newBook, ...filtered].slice(0, 10);

    localStorage.setItem("recentBooks", JSON.stringify(updated));
  }, [bookInfo]);

  // Supabase 최근 본 도서 저장 (API 사용)
  useEffect(() => {
    if (!bookInfo || !userId) return;

    const saveRecentBook = async () => {
      try {
        await fetch("/api/user/recentBooks/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            bookId: bookInfo.bookId,
            title: bookInfo.title,
            author: bookInfo.author,
            image: bookInfo.cover,
          }),
        });
      } catch (err) {
        console.error("최근 본 도서 저장 실패:", err);
      }
    };

    saveRecentBook();
  }, [bookInfo, userId]);

  if (loading) {
    return (
      <div className="px-4 md:px-6 py-8 mx-auto mt-8 md:mt-20 max-w-7xl">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-lg md:text-xl text-(--main-color)">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (error || !bookInfo) {
    return (
      <div className="px-4 md:px-6 py-8 mx-auto mt-8 md:mt-20 max-w-7xl">
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="mb-6 text-lg md:text-xl text-red-500">
            {error || "책을 찾을 수 없습니다."}
          </div>
          <button
            onClick={() => router.back()}
            style={{ borderRadius: "var(--radius-15)" }}
            className="px-6 md:px-8 py-2 md:py-3 bg-(--main-color) text-white font-medium hover:opacity-90 transition-opacity"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  const totalReviews = reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;

  const highResCover =
    bookInfo.cover?.replace(/coversum/gi, "cover500") || bookInfo.cover;

  return (
    <div className="mx-auto max-w-full min-[900px]:max-w-1200 mt-8 min-[900px]:mt-50 px-4 min-[900px]:px-60">
      {/* 상품 정보 영역 */}
      <div className="flex flex-col min-[900px]:flex-row mb-12 min-[900px]:mb-80 gap-8 min-[900px]:gap-80">
        {/* 이미지 */}
        <div className="w-full min-[900px]:w-400 h-auto rounded-md overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] mx-auto min-[900px]:mx-0">
          <Image
            src={highResCover}
            alt={bookInfo.title}
            width={600}
            height={600}
            className="object-contain w-full"
          />
        </div>

        {/* 정보 */}
        <div className="flex flex-col py-4 min-[900px]:py-20 space-y-4 min-[900px]:space-y-6 flex-1 min-[900px]:flex-2">
          <div>
            <p className="mb-2 font-normal text-gray-500 text-sm min-[900px]:text-16">
              {bookInfo.category.map((c) => c.name).join(" > ")}
            </p>
            <h1 className="text-xl min-[900px]:text-3xl font-bold text-black my-3 min-[900px]:my-25">
              {bookInfo.title}
            </h1>
            <p className="font-normal text-gray-700 text-sm min-[900px]:text-18">
              {bookInfo.author} | {bookInfo.publisher} | {bookInfo.pubDate}
            </p>
          </div>

          <div className="py-4 min-[900px]:py-20 text-right border-b border-gray-200">
            <p className="text-2xl min-[900px]:text-4xl font-bold text-(--main-color)">
              {bookInfo.priceStandard?.toLocaleString()}원
            </p>
          </div>

          <div className="flex items-center justify-between my-0 border-b border-gray-200 py-3 min-[900px]:py-15">
            <span className="font-semibold text-black text-base min-[900px]:text-20">재고량</span>
            <span
              style={{ borderRadius: "var(--radius-5)" }}
              className={`px-3 min-[900px]:px-10 py-2 min-[900px]:py-6 font-medium text-base min-[900px]:text-20 ${
                bookInfo.stock > 10
                  ? "bg-(--sub-color)/20 text-(--main-color)"
                  : bookInfo.stock > 0
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {bookInfo.stock > 0 ? `${bookInfo.stock}권` : "품절"}
            </span>
          </div>

          {bookInfo.salesCount !== undefined && bookInfo.salesCount !== null && (
            <div className="flex items-center justify-between my-0 border-b border-gray-200 py-3 min-[900px]:py-15">
              <span className="font-semibold text-black text-base min-[900px]:text-20">판매량</span>
              <span className="text-(--main-color) font-medium text-base min-[900px]:text-20">
                {bookInfo.salesCount.toLocaleString()}권
              </span>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row gap-3 min-[900px]:gap-6 py-4 min-[900px]:py-20">
            <WishListButton userId={userId} bookId={bookInfo.bookId} />
            <AddToCartButton
              book={{ bookId: bookInfo.bookId }}
              iconMode={false}
              className="h-12 min-[900px]:h-50 flex-1 bg-(--sub-color) text-white px-4 min-[900px]:px-6 py-3 min-[900px]:py-15 rounded font-semibold text-base min-[900px]:text-20 hover:opacity-90 hover:cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <BuyNowButton
              book={{
                bookId: bookInfo.bookId,
                title: bookInfo.title,
                cover: bookInfo.cover,
                priceStandard: bookInfo.priceStandard,
                stock: bookInfo.stock,
              }}
              className="h-12 min-[900px]:h-50 flex-1 bg-(--sub-color) text-white px-4 min-[900px]:px-6 py-3 min-[900px]:py-15 rounded font-semibold text-base min-[900px]:text-20 hover:opacity-90 hover:cursor-pointer transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {bookInfo.link && (
            <a
              href={bookInfo.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs min-[900px]:text-14 text-(--sub-color) hover:text-(--main-color) font-medium hover:underline transition-colors text-right"
            >
              알라딘에서 보기 →
            </a>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="pt-6 min-[900px]:pt-12">
        <div className="flex border-b-2 border-gray-200 gap-4 min-[900px]:gap-30 overflow-x-auto">
          {["description", "reviews", "faq"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 min-[900px]:pb-10 px-2 font-normal text-sm min-[900px]:text-20 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "border-b-2 border-(--main-color) text-(--main-color) -mb-2"
                  : "text-gray-600 hover:text-(--main-color)"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "description"
                ? "상품설명"
                : tab === "reviews"
                ? `리뷰 (${reviews?.length || 0})`
                : `자주 묻는 질문 (${bookInfo.faqs?.length})`}
            </button>
          ))}
        </div>

        {/* 탭 내용 */}
        <div className="mt-4 min-[900px]:mt-15">
          {activeTab === "description" && (
            <div
              style={{ borderRadius: "var(--radius-15)" }}
              className="bg-(--bg-color) p-4 min-[900px]:p-15"
            >
              <div className="font-light leading-relaxed text-black whitespace-pre-line text-sm min-[900px]:text-18 flex flex-col items-center">
                {renderDescriptionWithImages(bookInfo.description)}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-3 min-[900px]:space-y-10">
              <div
                style={{ borderRadius: "var(--radius-15)" }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 min-[900px]:gap-12 p-4 min-[900px]:p-15"
              >
                <span className="font-semibold text-black text-sm min-[900px]:text-16">
                  전체 리뷰 {totalReviews}개
                </span>
                <span className="text-(--main-color) font-semibold text-base min-[900px]:text-20">
                  평균 ⭐ {averageRating}
                </span>
              </div>

              {/* 로딩 상태 */}
              {reviewLoading && (
                <div className="p-4 min-[900px]:p-25 rounded-sm bg-(--bg-color)">
                  <p className="text-sm min-[900px]:text-18 text-gray-600">
                    리뷰를 불러오는 중입니다...
                  </p>
                </div>
              )}

              {/* 에러 상태 */}
              {reviewError && (
                <div className="p-4 min-[900px]:p-25 rounded-sm bg-(--bg-color)">
                  <p className="text-sm min-[900px]:text-18 text-red-500">{reviewError}</p>
                </div>
              )}

              {/* 리뷰 없음 */}
              {!reviewLoading && !reviewError && reviews.length === 0 && (
                <div className="p-4 min-[900px]:p-25 rounded-sm bg-(--bg-color)">
                  <p className="text-sm min-[900px]:text-18 text-gray-600">
                    아직 등록된 리뷰가 없습니다.
                  </p>
                </div>
              )}

              {reviews.map((item) => (
                <div key={item.id} className="p-4 min-[900px]:p-25 rounded-sm bg-(--bg-color)">
                  <div className="flex gap-3 min-[900px]:gap-10">
                    {/* 원형 아바타 - 첫 글자 표시 */}
                    <div 
                      className="flex items-center justify-center rounded-full w-10 h-10 min-[900px]:w-40 min-[900px]:h-40 font-bold text-white text-base min-[900px]:text-18 flex-shrink-0"
                      style={{ backgroundColor: getAvatarColor(item.firstChar || "익") }}
                    >
                      {item.firstChar || "익"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2 min-[900px]:mb-10">
                        {/* 마스킹된 이름 */}
                        <span className="font-semibold text-black text-base min-[900px]:text-20">
                          {item.author || "익**"}
                        </span>
                        <span className="font-normal text-gray-500 text-xs min-[900px]:text-16 whitespace-nowrap ml-2">
                          {item.date}
                        </span>
                      </div>
                      <div className="text-sm min-[900px]:text-16">{"⭐".repeat(item.rating)}</div>
                      <p className="mt-3 min-[900px]:mt-20 font-light leading-relaxed text-black text-sm min-[900px]:text-18">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-3 min-[900px]:space-y-10">
              {bookInfo.faqs.map((faq) => (
                <div key={faq.id} className="p-4 min-[900px]:p-25 rounded-sm bg-(--bg-color)">
                  <p className="font-bold text-(--main-color) mb-3 min-[900px]:mb-20 text-base min-[900px]:text-20">
                    Q. {faq.question}
                  </p>
                  <p className="pl-4 min-[900px]:pl-20 font-light leading-relaxed text-black text-sm min-[900px]:text-18">
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