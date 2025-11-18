import React from "react";
import { FaInstagram, FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-color)] mt-[120px] py-[60px] border-t border-gray-200">
      <div className="max-w-1200 mx-auto px-4 flex flex-col lg:flex-row gap-10 justify-between">
        {/* 왼쪽 영역 - 사이트 정보 */}
        <div className="flex-1 flex flex-col gap-15">
          <h2 className="text-[28px] font-bold text-[var(--main-color)]">
            README
          </h2>
          <p className="text-14 font-light text-gray-600 leading-[1.6]">
            당신의 독서 생활을 함께하는 도서 쇼핑몰
          </p>
          <div className="flex flex-col gap-10 text-14 font-light text-gray-600">
            <span>대표: 정원준</span>
            <span>사업자등록번호: 123-45-67890</span>
            <span>통신판매업신고: 2025-서울강남-12345</span>
            <span>주소: 서울특별시 강남구 테헤란로 123</span>
            <span>이메일: contact@readme.com</span>
            <span>고객센터: 1234-5678 (평일 09:00-18:00)</span>
          </div>
        </div>

        {/* 중앙 영역 - 링크 */}
        <div className="flex-1 flex flex-col gap-15">
          <h3 className="text-18 font-bold text-[var(--main-color)]">
            고객지원
          </h3>
          <div className="flex flex-col gap-10 text-14 font-light  text-gray-600">
            <span className="cursor-pointer hover:text-[var(--main-color)] hover:underline">
              이용약관
            </span>
            <span className="cursor-pointer hover:text-[var(--main-color)] hover:underline">
              개인정보 처리방침
            </span>
            <span className="cursor-pointer hover:text-[var(--main-color)] hover:underline">
              고객센터
            </span>
          </div>
        </div>

        {/* 오른쪽 영역 - SNS & 팀원 */}
        <div className="flex-1 flex flex-col gap-15">
          <h3 className="text-18 font-bold text-[var(--main-color)]">
            Follow Us
          </h3>
          <div className="flex gap-15">
            <FaInstagram
              className="text-[var(--sub-color)] cursor-pointer hover:text-[var(--main-color)] hover:scale-110 transition-transform duration-200"
              size={24}
            />
            <FaFacebook
              className="text-[var(--sub-color)] cursor-pointer hover:text-[var(--main-color)] hover:scale-110 transition-transform duration-200"
              size={24}
            />
            <FaTwitter
              className="text-[var(--sub-color)] cursor-pointer hover:text-[var(--main-color)] hover:scale-110 transition-transform duration-200"
              size={24}
            />
            <FaYoutube
              className="text-[var(--sub-color)] cursor-pointer hover:text-[var(--main-color)] hover:scale-110 transition-transform duration-200"
              size={24}
            />
          </div>

          <div className="flex flex-col gap-10 mt-4 text-14">
            <span className="font-bold text-[var(--main-color)]">Team</span>
            <span className="text-gray-600 font-light">
              강두연 · 김근영 · 배예진 · 이주형
            </span>
          </div>
        </div>
      </div>

      {/* 하단 저작권 */}
      <div className="border-t border-gray-200 mt-40 pt-15 text-center">
        <p className="text-14 font-light text-gray-400">
          © 2025 README. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
