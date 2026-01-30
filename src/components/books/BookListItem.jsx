"use client";

import Image from "next/image";
import noimg from "@/assets/no_image.png";
import WishListButton from "../common/WishListButton";
import BuyNowButton from "../common/BuyNowButton";
import { useAuth } from "@/hooks/common/useAuth";
import AddToCartButton from "../common/AddToCartButton";

const BookListItem = ({ book, goDetail, wishlist }) => {
  const { userId } = useAuth();

  return (
    <div className="flex flex-col md:flex-row w-full justify-between border-b border-solid border-[#ccc] py-4 md:py-15 gap-4 md:gap-14">
      <div
        className="flex flex-col items-start flex-1 gap-4 sm:flex-row sm:gap-20 hover:cursor-pointer"
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
          className="w-full w-130 h-auto sm:h-200 max-w-[160px] mx-auto sm:mx-0 object-cover rounded-md border border-gray-300"
        />
        <div className="flex flex-col items-start w-full gap-2 md:gap-6">
          <p className="max-w-full mt-1 text-base font-bold md:mt-3 md:text-lg line-clamp-2 md:max-w-700">
            {book.title || "제목 미상"}
          </p>
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-10">
            <p className="min-w-0 text-xs font-bold text-gray-600 md:text-sm line-clamp-1">
              {book.author || "저자 미상"}
            </p>
            <p className="min-w-0 text-xs font-bold text-gray-600 md:text-sm line-clamp-1">
              {book.pubDate}
            </p>
          </div>
          <p className="mt-1 text-base font-bold md:text-lg">
            {(book.priceStandard ?? 0).toLocaleString()}원
          </p>
        </div>
      </div>
      <div className="flex flex-row justify-between gap-4 mt-4 md:items-end md:flex-col md:justify-start md:gap-16 md:mt-0">
        <WishListButton
          userId={userId}
          bookId={book.bookId}
          wishlist={wishlist}
        />
        <div className="flex flex-row w-full h-auto gap-2 md:flex-col md:gap-10 md:w-200 md:h-100">
          <AddToCartButton
            book={{
              bookId: book.bookId,
              stock: book.stock,
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
            className="flex-1 h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default BookListItem;
