"use client";

import Image from "next/image";
import { IoIosHeartEmpty } from "react-icons/io";
import noimg from "@/assets/no_image.png";
import WishListButton from "../common/WishListButton";
import BuyNowButton from "../common/BuyNowButton";
import { useAuth } from "@/hooks/common/useAuth";
import AddToCartButton from "../common/AddToCartButton";

const BookListItem = ({ book, goDetail }) => {
  const { userId } = useAuth();

  return (
    <div className="flex flex-col md:flex-row w-full justify-between border-b border-solid border-[#ccc] py-4 md:py-15 gap-4 md:gap-14">
      <div
        className="flex flex-col sm:flex-row items-start gap-4 sm:gap-20 hover:cursor-pointer flex-1"
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
          className="w-full sm:w-140 h-auto sm:h-200 max-w-[160px] mx-auto sm:mx-0 object-cover rounded-md border border-gray-300"
        />
        <div className="flex flex-col items-start gap-2 md:gap-6 w-full">
          <p className="mt-1 md:mt-3 font-bold text-base md:text-lg line-clamp-2 max-w-full md:max-w-700">
            {book.title || "제목 미상"}
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-10">
            <p className="text-xs md:text-sm font-bold text-gray-600 line-clamp-1 min-w-0">
              {book.author || "저자 미상"}
            </p>
            <p className="text-xs md:text-sm font-bold text-gray-600 line-clamp-1 min-w-0">
              {book.pubDate}
            </p>
          </div>
          <p className="mt-1 text-base md:text-lg font-bold">
            {(book.priceStandard ?? 0).toLocaleString()}원
          </p>
        </div>
      </div>
      <div className="flex md:items-end flex-row md:flex-col justify-between md:justify-start gap-4 md:gap-16 mt-4 md:mt-0">
        <WishListButton
          userId={userId}
          bookId={book.bookId}
        />
        <div className="flex flex-row md:flex-col gap-2 md:gap-10 w-full md:w-200 h-auto md:h-100">
          <AddToCartButton 
            book={{
              bookId: book.bookId,
              stock: book.stock
            }} 
            iconMode={false} 
          />
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