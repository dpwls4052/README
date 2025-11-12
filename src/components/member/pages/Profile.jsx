"use client";

import { useState } from "react";
import { FaBookOpen, FaGift, FaRegHeart, FaUserEdit, FaSun, FaMoon } from "react-icons/fa";

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`w-full min-h-fit py-10 flex justify-center ${darkMode ? "bg-green-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      <div className={`w-full max-w-5xl ${darkMode ? "bg-green-950" : "bg-white"} rounded-xl shadow-md p-10 space-y-12 transition-all duration-300`}>

        {/* 🎯 1. 상단 회원 정보 */}
        <section className="flex justify-between items-center border-b pb-6">
          <div className="flex items-center gap-6">
            <div>
              <h2 className="text-2xl font-semibold text-green-800 dark:text-green-100">jhapoy106님</h2>
              <p className="text-gray-600 dark:text-gray-300">
                나만의 서재를 채워보세요. 좋아하는 책을 발견해보세요!
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 border border-green-600 text-green-700 px-4 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-800 dark:text-green-100">
            <FaUserEdit />
            프로필 수정
          </button>
        </section>

        {/* 🧾 3. 기본 정보 */}
        <section className="grid grid-cols-3 gap-6 text-center">
          <div className="border rounded-lg py-5 hover:bg-green-50 dark:hover:bg-green-800 transition">
            <h3 className="text-xl font-semibold mb-4">기본 정보</h3>
            <div className="space-y-3">
              <p><b>이메일:</b> jhapoy106@naver.com</p>
              <p><b>휴대폰:</b> 인증 완료 (010-****-1234)</p>
              <p><b>가입일:</b> 2024-09-15</p>
              <p><b>최근 로그인:</b> 2025-11-10</p>
            </div>
          </div>
        </section>

        {/* 📦 4. 나의 활동 */}
        <section>
          <h3 className="text-xl font-semibold mb-4">나의 활동</h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="bg-green-50 dark:bg-green-800 p-5 rounded-lg hover:shadow-md cursor-pointer">
              <FaBookOpen className="mx-auto text-2xl text-green-700 dark:text-green-200 mb-2" />
              <p className="text-lg font-semibold">5</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">주문 내역</p>
            </div>
            <div className="bg-green-50 dark:bg-green-800 p-5 rounded-lg hover:shadow-md cursor-pointer">
              <FaRegHeart className="mx-auto text-2xl text-pink-600 dark:text-pink-300 mb-2" />
              <p className="text-lg font-semibold">8</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">찜한 도서</p>
            </div>
            <div className="bg-green-50 dark:bg-green-800 p-5 rounded-lg hover:shadow-md cursor-pointer">
              <FaGift className="mx-auto text-2xl text-yellow-600 dark:text-yellow-300 mb-2" />
              <p className="text-lg font-semibold">3</p>
              <p className="text-sm text-gray-500 dark:text-gray-300">리뷰 작성</p>
            </div>
          </div>
        </section>

        {/* 📚 5. 최근 본 도서 */}
        <section>
          <h3 className="text-xl font-semibold mb-4">최근 본 도서</h3>
          <div className="grid grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded-lg overflow-hidden hover:shadow-md transition">
                <img src={`https://placehold.co/200x250?text=Book+${i}`} alt={`Book ${i}`} />
                <div className="p-3 text-sm">
                  <p className="font-medium">인기 도서 {i}</p>
                  <p className="text-gray-500 dark:text-gray-300">저자 이름</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ⚙️ 6. 개인 설정 */}
        <section>
          <h3 className="text-xl font-semibold mb-4">개인 설정</h3>
          <button className="mt-6 text-sm text-red-500 hover:underline">
            회원 탈퇴하기
          </button>
        </section>
      </div>
    </div>
  );
}
