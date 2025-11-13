"use client";

import Image from "next/image";
import { IoIosHeartEmpty } from "react-icons/io";
import noimg from "@/assets/no_image.png";

const BookListItem = ({ book, goDetail }) => {
  return (
    <div
      key={book.id}
      className="flex w-full justify-between border-b border-solid border-[#ccc] py-8 gap-14"
    >
      <div
        className="flex items-start gap-20 hover:cursor-pointer"
        onClick={() => goDetail(book.id)}
      >
        <Image
          src={book.highResCover || book.cover || noimg}
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
        <button aria-label="찜" className="p-2">
          <IoIosHeartEmpty className="w-25 h-25 text-red-500" />
        </button>
        <div className="flex flex-col gap-10 w-200 h-100">
          <button className="bg-[var(--sub-color)] font-medium flex-1 text-white rounded-sm">
            장바구니
          </button>
          <button className="bg-[var(--main-color)] font-medium flex-1 text-white rounded-sm">
            바로구매
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookListItem;