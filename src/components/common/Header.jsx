"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SlBasket, SlSettings } from "react-icons/sl";
import { IoIosHeartEmpty, IoIosSearch } from "react-icons/io";
import { FiUser, FiLogOut } from "react-icons/fi";
import Image from "next/image";
import Logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/common/useAuth";
import SearchBar from "./SearchBar";
import { HiOutlineDocumentText } from "react-icons/hi";
import { useCartCount } from "@/hooks/common/useCartCount";
import { useWishlistCount } from "@/hooks/common/useWishlistCount";

export default function Header() {
  const { user, loading, logout } = useAuth();
  const { userId } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userInfo, setUserInfo] = useState(null);
  
  // 사용자 정보 조회
  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      try {
        const res = await fetch("/api/user/getUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) throw new Error("사용자 정보 불러오기 실패");
        const data = await res.json();
        setUserInfo(data.user);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, [userId]);

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

  const { count: cartCount } = useCartCount(); // 🌟 수정
  const { count: wishlistCount } = useWishlistCount(); 

  // console.log("Header 렌더링: cartCount =", cartCount, ", wishlistCount =", wishlistCount);
  // console.log('user', user)
  return (
    <header className="sticky top-0 z-40 px-100 shadow-[0_4px_10px_rgba(153,153,153,0.25)] header-blur">
      <div className="flex items-center justify-between gap-8 px-6 py-15 mx-auto max-w-1200">
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
        <SearchBar />

        {/* 아이콘 버튼 */}
        <div className="flex items-center gap-20">
          {/* 카트 */}
          <div className="relative">
            <Link
              href="/cart"
              className="w-25 h-25 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              <SlBasket className="text-3xl" />
            </Link>

            {cartCount > 0 && (
              <span className="absolute -top-2 left-20 bg-gray-500 text-white text-xs w-10 h-10 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>

          {/* 위시리스트 */}
          <div className="relative">
            <Link
              href="/member/wishlist"
              className="w-25 h-25 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
            >
              <IoIosHeartEmpty className="text-3xl text-red-500" />
            </Link>

            {wishlistCount > 0 && (
              <span className="absolute -top-2 left-17 bg-red-500 text-white text-xs w-10 h-10 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </div>

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
                        {userInfo.name || "사용자"} 님
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
                      <IoIosHeartEmpty className="text-xl text-red-500" />{" "}
                      위시리스트
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