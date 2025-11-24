"use client";

import Image from "next/image";
import { IoIosHeartEmpty } from "react-icons/io";
import noimg from "@/assets/no_image.png";
import WishListButton from "../common/WishListButton";
import BuyNowButton from "../common/BuyNowButton"; // 🌟 추가
import { useAuth } from "@/hooks/common/useAuth";
import AddToCartButton from "../common/AddToCartButton";

const BookListItem = ({ book, goDetail }) => {
  const { userId } = useAuth();

  return (
    <div className="flex w-full justify-between border-b border-solid border-[#ccc] py-15 gap-14">
      <div
        className="flex items-start gap-20 hover:cursor-pointer"
        onClick={() => goDetail(book.bookId)}
      >
        <Image
          src={
            book.highResCover || 
            book.cover?.replace(/coversum/gi, "cover500") || 
            noimg
          }
          alt={book.title || "제목 미상"}
          width={160}
          height={220}
          className="w-140 h-200 object-cover rounded-md border border-gray-300"
        />
        <div className="flex flex-col items-start gap-6">
          <p className="mt-3 font-bold text-lg line-clamp-2 max-w-700">
            {book.title || "제목 미상"}
          </p>
          <div className="flex items-center gap-10">
            <p className="text-sm font-bold text-gray-600 line-clamp-1 min-w-0">
              {book.author || "저자 미상"}
            </p>
            <p className="text-sm font-bold text-gray-600 line-clamp-1 min-w-0">
              {book.pubDate}
            </p>
          </div>
          <p className="mt-1 text-lg font-bold">
            {(book.priceStandard ?? 0).toLocaleString()}원
          </p>
        </div>
      </div>
      <div className="flex items-end flex-col justify-start gap-16">
        <WishListButton
          userId={userId}
          bookId={book.bookId}
        />
        <div className="flex flex-col gap-10 w-200 h-100">
          <AddToCartButton 
            book={{
              bookId: book.bookId,
              stock: book.stock
            }} 
            iconMode={false} 
          />
          {/* 🌟 바로구매 버튼 컴포넌트로 교체 */}
          <BuyNowButton
            book={{
              bookId: book.bookId,
              title: book.title,
              cover: book.cover,
              priceStandard: book.priceStandard,
              stock: book.stock,
            }}
            className="h-auto flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default BookListItem;