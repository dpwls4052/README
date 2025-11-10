import React from "react";
import { SlBasket } from "react-icons/sl";
import { IoIosHeartEmpty, IoIosSearch } from "react-icons/io";
import Image from "next/image";
import Logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* 로고 */}
        <div className="cursor-pointer">
          <Image src={Logo} alt="사이트 로고" width={80} height={40} objectFit="contain" />
        </div>

        {/* 검색창 */}
        <div className="flex-1 max-w-[600px] relative">
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            className="w-full h-[50px] pl-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
          />
          <IoIosSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
        </div>

        {/* 아이콘 버튼 */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <SlBasket className="text-xl" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition">
            <IoIosHeartEmpty className="text-xl text-red-500" />
          </button>
        </div>
      </div>
    </header>
  );
}
