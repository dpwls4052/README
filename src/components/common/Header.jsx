"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SlBasket, SlSettings } from "react-icons/sl";
import { IoIosHeartEmpty, IoIosSearch } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/common/useAuth";
import { HiOutlineDocumentText } from "react-icons/hi";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between gap-8 px-6 py-15 mx-auto max-w-[1400px]">

        {/* 로고 */}
        <Link href="/" className="cursor-pointer">
          <Image
            src={Logo}
            alt="사이트 로고"
            width={100}
            height={50}
            style={{ objectFit: "contain" }}
          />
        </Link>

        {/* 검색창 */}
        <div className="relative flex-1 max-w-[600px]">
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            className="w-full h-40 pl-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--main-color)]"
          />
          <IoIosSearch className="absolute text-2xl text-gray-400 right-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* 아이콘 버튼 */}
        <div className="flex items-center gap-6">
          {/* 카트 */}
          <Link
            href="/cart"
            className="w-20 h-20 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <SlBasket className="text-3xl" />
          </Link>

          {/* 위시리스트 */}
          <Link
            href="/member/wishlist"
            className="w-20 h-20 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
          >
            <IoIosHeartEmpty className="text-3xl text-red-500" />
          </Link>

          {/* 로그인/프로필 */}
          {loading ? (
            <div className="w-20 h-20"></div>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              {/* 프로필 버튼 */}
              <button
                onClick={toggleDropdown}
                className="w-25 h-25 flex cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[var(--sub-color)] hover:opacity-90 transition-opacity"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="프로필"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-white text-4xl" />
                )}
              </button>

              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-[300px] h-auto bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-50">
                  {/* 사용자 정보 */}
                  <div className="p-6 bg-[var(--bg-color)] border-b border-gray-200 flex items-center gap-4">
                    <div className="w-25 h-25 mr-15 ml-10 flex items-center justify-center rounded-full bg-[var(--sub-color)] overflow-hidden">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="프로필"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="text-white text-5xl" />
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-lg text-black truncate">
                        {user.displayName || "사용자"}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* 메뉴 아이템 */}
                  <div className="flex flex-col gap-6 p-4">
                    <Link
                      href="/member?MemberTab=profile"
                      className="flex items-center gap-2 ml-10 gap-15 px-4 py-3 text-black text-base hover:bg-[var(--bg-color)] rounded transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <FiUser className="text-xl" /> 내 정보
                    </Link>
                    <Link
                      href="/member?MemberTab=orders"
                      className="flex items-center gap-2 ml-10 gap-15 px-4 py-3 text-black text-base hover:bg-[var(--bg-color)] rounded transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <SlBasket className="text-xl" /> 주문 내역
                    </Link>
                    <Link
                      href="/member/wishlist"
                      className="flex items-center gap-2 ml-10 gap-15 px-4 py-3 text-black text-base hover:bg-[var(--bg-color)] rounded transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <IoIosHeartEmpty className="text-xl text-red-500" /> 위시리스트
                    </Link>
                    <Link
                      href="/member?MemberTab=reviews"
                      className="flex items-center gap-2 ml-10 gap-15 px-4 py-3 text-black text-base hover:bg-[var(--bg-color)] rounded transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <HiOutlineDocumentText className="text-xl" /> 리뷰 관리
                    </Link>
                  </div>

                  {/* 로그아웃 버튼 */}
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center cursor-pointer justify-center gap-2 px-4 py-3 bg-[var(--main-color)] text-white text-base font-semibold rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <FiLogOut className="text-xl" /> 로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-6 py-3 bg-[var(--main-color)] text-white text-base font-medium rounded-xl hover:opacity-90 transition-opacity"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
