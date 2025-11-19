"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import WishListButton from "@/components/common/WishListButton";
import AddToCartButton from "@/components/common/AddToCartButton";
import BuyNowButton from "@/components/common/BuyNowButton"; // ✅ 추가
import { useAuth } from "@/hooks/common/useAuth";
import noimg from "@/assets/no_image.png";

const Bestseller = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 베스트셀러 데이터 가져오기
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/books/bestseller?limit=8");
        const data = await res.json();

        if (res.ok) {
          const mappedBooks = data.map((book) => ({
            id: book.book_id,
            bookId: book.book_id,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            priceStandard: book.price_standard,
            cover: book.cover,
            highResCover: book.cover?.replace(/coversum/gi, "cover500"),
            stock: book.stock,
            salesCount: book.sales_count,
          }));
          setBooks(mappedBooks);
        } else {
          console.error("Failed to fetch bestsellers:", data);
        }
      } catch (err) {
        console.error("Bestseller fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  const goDetail = (id) => {
    router.push(`/product/detail/${id}`);
  };

  if (loading) {
    return (
      <div className="p-0 mx-auto text-center my-100 max-w-1200">
        <p className="text-[32px] font-semibold">베스트셀러</p>
        <div className="flex justify-center items-center h-400">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 mx-auto text-center my-100 max-w-1200">
      <p className="text-[32px] font-semibold">베스트셀러</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-40 my-80">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-[var(--bg-color)] p-8 flex flex-col justify-between gap-15"
          >
            {/* 도서 이미지 */}
            <div
              className="w-250 h-320 overflow-hidden rounded-md border border-gray-300 hover:cursor-pointer"
              onClick={() => goDetail(book.id)}
            >
              <Image
                src={book.highResCover || noimg}
                alt={book.title}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>

            {/* 제목 + 버튼 영역 */}
            <div className="flex items-start justify-between">
              <p className="font-semibold text-left text-16/20 w-180 line-clamp-2">
                {book.title}
              </p>

              <div className="flex gap-2 items-center">
                <WishListButton
                  userId={userId}
                  bookId={book.bookId}
                  stock={book.stock}
                />
              </div>
            </div>

            {/* 작가, 가격 */}
            <div className="flex items-center justify-between">
              <p className="font-normal text-left truncate text-14 w-140">
                {book.author}
              </p>
              <p className="text-16 font-normal">
                {(book.priceStandard ?? 0).toLocaleString()}원
              </p>
            </div>

            {/* ✅ 장바구니 & 바로구매 버튼 */}
            <div className="flex items-center justify-between gap-2">
              {/* 장바구니 버튼 - stock 전달 */}
              <AddToCartButton 
                book={{ 
                  bookId: book.bookId,
                  stock: book.stock  // ✅ stock 추가
                }} 
                iconMode={false}
                className="h-40"
              />

              {/* 바로구매 버튼 - 컴포넌트로 교체 */}
              <BuyNowButton
                book={{
                  bookId: book.bookId,
                  title: book.title,
                  cover: book.cover,
                  priceStandard: book.priceStandard,
                  stock: book.stock,
                }}
                className="h-40"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestseller;