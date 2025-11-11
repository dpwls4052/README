"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";

// Mock 데이터
const MOCK_DETAIL_TABS_DATA = {
  description: `이 책은 독자들에게 깊은 감동과 인사이트를 제공하는 훌륭한 작품입니다. 
저자의 독특한 시각과 섬세한 문체가 돋보이며, 현대 사회의 다양한 이슈들을 
예리하게 통찰합니다. 페이지를 넘길 때마다 새로운 발견과 깨달음이 있어 
독서의 즐거움을 만끽할 수 있습니다.`,
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
      answer: "상품 수령 후 7일 이내 미개봉 상태에 한해 반품/교환이 가능합니다.",
    },
  ],
};

// Mock 책 데이터
const DEFAULT_BOOK_DATA = {
  author: "조 내버로, 마빈 칼린스 (지은이), 박정길 (옮긴이)",
  categoryName: "국내도서>자기계발>인간관계>교양심리학",
  cover: "https://image.aladin.co.kr/product/772/58/coversum/8901110806_1.jpg",
  description:
    "전직 FBI요원이자 행동전문가인 조 내버로가 상대방의 몸짓과 표정을 읽음으로써 사람의 마음을 간파해 효과적인 커뮤니케이션을 할 수 있는 기술을 담은 책이다.",
  id: "9788901110806",
  priceStandard: 14000,
  pubDate: "2010-09-13",
  publisher: "리더스북",
  title: "FBI 행동의 심리학 - 말보다 정직한 7가지 몸의 단서",
  stock: 7,
  ...MOCK_DETAIL_TABS_DATA,
};

const ProductDetail = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState("description");
  const [isWished, setIsWished] = useState(false);

  const detailData = DEFAULT_BOOK_DATA;

  const totalReviews = detailData.reviews?.length || 0;
  const averageRating =
    totalReviews > 0
      ? (
          detailData.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;

  const toggleWishlist = () => setIsWished(!isWished);

  const handleAddToCart = () => {
    alert(`${detailData.title}이(가) 장바구니에 담겼습니다.`);
  };

  const handleBuyNow = () => {
    alert(`${detailData.title} 결제가 완료되었습니다.`);
    router.push("/kt_3team_project_2025/success");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 mt-20">
      {/* 상품 정보 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* 이미지 */}
        <div className="bg-[var(--bg-color)] p-4 border rounded-lg flex justify-center items-center h-[600px]">
          <Image
            src={detailData.cover}
            alt={detailData.title}
            width={400}
            height={600}
            className="object-contain"
          />
        </div>

        {/* 정보 */}
        <div className="flex flex-col space-y-6">
          <div>
            <p className="text-sm text-gray-600">{detailData.categoryName}</p>
            <h1 className="text-2xl font-bold mt-1">{detailData.title}</h1>
            <p className="text-gray-600 mt-1">
              {detailData.author} | {detailData.publisher} | {detailData.pubDate}
            </p>
          </div>

          <div>
            <p className="text-3xl font-bold text-[var(--main-color)]">
              {detailData.priceStandard.toLocaleString()}원
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold">재고</span>
            <span
              className={`px-3 py-1 rounded ${
                detailData.stock > 10
                  ? "bg-[var(--sub-color)]/30 text-[var(--main-color)]"
                  : "bg-orange-200 text-[var(--main-color)]"
              }`}
            >
              {detailData.stock > 0 ? `${detailData.stock}권 남음` : "품절"}
            </span>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-4 pt-4">
            <button
              onClick={toggleWishlist}
              disabled={detailData.stock === 0}
              className="p-3 border rounded text-red-500 hover:bg-[var(--sub-color)]/20"
            >
              {isWished ? <IoIosHeart size={24} /> : <IoIosHeartEmpty size={24} />}
            </button>
            <button
              onClick={handleAddToCart}
              disabled={detailData.stock === 0}
              className="flex-1 bg-[var(--sub-color)] text-white px-4 py-3 rounded flex items-center justify-center gap-2 hover:bg-[var(--main-color)]"
            >
              <AiOutlineShoppingCart size={20} />
              장바구니
            </button>
            <button
              onClick={handleBuyNow}
              disabled={detailData.stock === 0}
              className="flex-1 bg-[var(--main-color)] text-white px-4 py-3 rounded hover:bg-[var(--sub-color)]"
            >
              바로구매
            </button>
          </div>
        </div>
      </div>

      {/* 탭 */}
      <div className="mt-16 border-t-4 border-[var(--main-color)] pt-10">
        <div className="flex space-x-5 border-b">
          {["description", "reviews", "faq"].map((tab) => (
            <button
              key={tab}
              className={`pb-3 font-medium ${
                activeTab === tab
                  ? "font-bold border-b-4 border-[var(--main-color)] text-[var(--main-color)]"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "description"
                ? "상품설명"
                : tab === "reviews"
                ? `리뷰 (${detailData.reviews.length})`
                : `FAQ (${detailData.faqs.length})`}
            </button>
          ))}
        </div>

        {/* 탭 내용 */}
        <div className="mt-10 space-y-8">
          {activeTab === "description" && (
            <p className="text-base whitespace-pre-line">{detailData.description}</p>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex justify-between">
                <span className="font-semibold">전체 리뷰 {totalReviews}개</span>
                <span className="text-[var(--main-color)]">평균 ⭐ {averageRating}</span>
              </div>
              {detailData.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 border rounded-lg bg-[var(--bg-color)]"
                >
                  <div className="flex gap-4 mb-4">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{review.author}</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <span className="text-[var(--main-color)] mb-2">
                        {"⭐".repeat(review.rating)}
                      </span>
                      <p className="text-base">{review.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-6">
              {detailData.faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="p-6 border rounded-lg bg-[var(--bg-color)]"
                >
                  <p className="font-semibold text-[var(--main-color)] mb-2">
                    Q. {faq.question}
                  </p>
                  <p className="pl-4">{faq.answer}</p>
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
