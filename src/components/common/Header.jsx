import React from "react";
import Link from "next/link";
import { SlBasket } from "react-icons/sl";
import { IoIosHeartEmpty, IoIosSearch } from "react-icons/io";
import Image from "next/image";
import Logo from "@/assets/logo.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between gap-4 px-4 py-4 mx-auto max-w-1200">
        
        {/* 로고 */}
        <Link href="/" className="cursor-pointer">
          <Image
            src={Logo}
            alt="사이트 로고"
            width={80}
            height={40}
            style={{ objectFit: "contain" }}
          />
        </Link>

        {/* 검색창 */}
        <div className="relative flex-1 max-w-600">
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            className="w-full h-50 pl-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
          />
          <IoIosSearch className="absolute text-xl text-gray-400 -translate-y-1/2 right-4 top-1/2" />
        </div>

        {/* 아이콘 버튼 */}
        <div className="flex items-center gap-4">
          
          {/* 카트 */}
          <Link
            href="/cart"
            className="p-2 transition rounded-full hover:bg-gray-100"
          >
            <SlBasket className="text-xl" />
          </Link>

          {/* 위시리스트 */}
          <Link
            href="/member/wishlist"
            className="p-2 transition rounded-full hover:bg-gray-100"
          >
            <IoIosHeartEmpty className="text-xl text-red-500" />
          </Link>

        </div>
      </div>
    </header>
  );
}
