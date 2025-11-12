"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
      answer: "상품 수령 후 7일 이내 미개봉 상태에 한해 반품/교환이 가능합니다.",
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
          <div className="text-xl text-red-500 mb-6">{error || "책을 찾을 수 없습니다."}</div>
          <button
            onClick={() => router.back()}
            style={{ borderRadius: 'var(--radius-15)' }}
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
      ? (bookData.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : 0;

  const highResCover = bookData.cover.replace(/coversum/gi, 'cover500');

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 mt-20">

      {/* 상품 정보 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* 이미지 */}
        <div
          style={{ borderRadius: 'var(--radius-15)' }}
          className="bg-(--bg-color) p-8 border border-(--sub-color)/20 flex justify-center items-center min-h-[600px]"
        >
          <Image
            src={highResCover}
            alt={bookData.title}
            width={400}
            height={600}
            className="object-contain"
          />
        </div>

        {/* 정보 */}
        <div className="flex flex-col space-y-6">
          <div>
            <p className="text-(--text-14) text-gray-600 mb-2">{bookData.categoryName}</p>
            <h1 className="text-(--text-32) font-bold text-black mb-3">{bookData.title}</h1>
            <p className="text-(--text-16) text-gray-700">
              {bookData.author} | {bookData.publisher} | {bookData.pubDate}
            </p>
          </div>

          <div className="pt-4 pb-4 border-t border-b border-gray-200">
            <p className="text-4xl font-bold text-(--main-color)">
              {bookData.priceStandard?.toLocaleString()}원
            </p>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="font-semibold text-black text-(--text-18)">재고</span>
            <span
              style={{ borderRadius: 'var(--radius-5)' }}
              className={`px-4 py-1 font-medium text-(--text-14) ${
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
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="font-semibold text-black text-(--text-18)">판매량</span>
              <span className="text-(--main-color) font-medium text-(--text-18)">
                {bookData.salesCount?.toLocaleString()}권
              </span>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={toggleWishlist}
              disabled={bookData.stock === 0}
              style={{ borderRadius: 'var(--radius-15)' }}
              className="p-4 border-2 border-(--sub-color) text-red-500 hover:bg-(--bg-color) transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWished ? <IoIosHeart size={28} /> : <IoIosHeartEmpty size={28} />}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={bookData.stock === 0}
              style={{ borderRadius: 'var(--radius-15)' }}
              className="flex-1 bg-(--sub-color) text-white px-6 py-4 font-semibold text-(--text-18) flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <AiOutlineShoppingCart size={24} />
              장바구니
            </button>

            <button
              onClick={handleBuyNow}
              disabled={bookData.stock === 0}
              style={{ borderRadius: 'var(--radius-15)' }}
              className="flex-1 bg-(--main-color) text-white px-6 py-4 font-semibold text-(--text-18) hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              바로구매
            </button>
          </div>

          {bookData.link && (
            <a
              href={bookData.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--text-14) text-(--sub-color) hover:text-(--main-color) font-medium hover:underline transition-colors"
            >
              알라딘에서 보기 →
            </a>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="mt-20 pt-12 border-t-4 border-(--main-color)">
        <div className="flex gap-6 border-b-2 border-gray-200">
          {["description", "reviews", "faq"].map((tab) => (
            <button
              key={tab}
              className={`pb-4 px-2 font-semibold text-(--text-18) transition-colors ${
                activeTab === tab
                  ? "border-b-4 border-(--main-color) text-(--main-color) -mb-[2px]"
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
        <div className="mt-12">
          {activeTab === "description" && (
            <div
              style={{ borderRadius: 'var(--radius-15)' }}
              className="bg-(--bg-color) p-8"
            >
              <p className="text-(--text-16) leading-relaxed text-black whitespace-pre-line">
                {bookData.description}
              </p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div
                style={{ borderRadius: 'var(--radius-15)' }}
                className="flex justify-between items-center bg-(--bg-color) p-6"
              >
                <span className="font-bold text-(--text-18) text-black">
                  전체 리뷰 {totalReviews}개
                </span>
                <span className="text-(--main-color) font-semibold text-(--text-18)">
                  평균 ⭐ {averageRating}
                </span>
              </div>

              {bookData.reviews.map((review) => (
                <div
                  key={review.id}
                  style={{ borderRadius: 'var(--radius-15)' }}
                  className="p-6 border-2 border-(--sub-color)/20 bg-(--bg-color) hover:border-(--sub-color)/40 transition-colors"
                >
                  <div className="flex gap-4">
                    <img
                      src={review.avatar}
                      alt={review.author}
                      style={{ borderRadius: 'var(--radius-15)' }}
                      className="w-14 h-14 object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-black text-(--text-18)">
                          {review.author}
                        </span>
                        <span className="text-(--text-12) text-gray-500">{review.date}</span>
                      </div>
                      <div className="text-(--main-color) mb-3 text-(--text-18)">
                        {"⭐".repeat(review.rating)}
                      </div>
                      <p className="text-(--text-16) text-black leading-relaxed">
                        {review.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-5">
              {bookData.faqs.map((faq) => (
                <div
                  key={faq.id}
                  style={{ borderRadius: 'var(--radius-15)' }}
                  className="p-6 border-2 border-(--sub-color)/20 bg-(--bg-color) hover:border-(--sub-color)/40 transition-colors"
                >
                  <p className="font-bold text-(--main-color) mb-3 text-(--text-18)">
                    Q. {faq.question}
                  </p>
                  <p className="pl-6 text-black text-(--text-16) leading-relaxed">
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