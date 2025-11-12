"use client";

import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";

export default function Reviews() {
  const [tab, setTab] = useState("available");
  const [subTab, setSubTab] = useState("purchase");

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-sm p-8">

        {/* 🏷️ 헤더 */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">리뷰</h1>
        </div>

        {/* 🧭 상단 탭 */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setTab("available")}
            className={`flex-1 py-3 font-medium ${
              tab === "available"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            작성 가능한 리뷰
          </button>
          <button
            onClick={() => setTab("written")}
            className={`flex-1 py-3 font-medium ${
              tab === "written"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-black"
            }`}
          >
            작성한 리뷰(0)
          </button>
        </div>

        {/* 📁 하위 탭 */}
        <div className="flex bg-gray-100 rounded-t-md">
          <button
            onClick={() => setSubTab("purchase")}
            className={`flex-1 py-3 text-sm ${
              subTab === "purchase"
                ? "bg-white border-t border-l border-r border-gray-200 font-medium"
                : "text-gray-500"
            }`}
          >
            구매 리뷰
          </button>
        </div>

        {/* 📋 안내 영역 */}
        <div className="p-8 border rounded-b-md">
          <p className="text-gray-700 mb-3">
            구매하신 상품의 리뷰를 남겨주세요.
          </p>

          {/* 🔽 정렬 옵션 */}
          <div className="flex justify-end mb-8">
            <select className="border border-gray-300 rounded px-3 py-2 text-sm">
              <option>결제 완료 순</option>
              <option>리뷰 작성일 순</option>
            </select>
          </div>

          {/* 🚫 리뷰 없음 상태 */}
          <div className="flex flex-col items-center justify-center text-center py-20">
            <FaExclamationCircle size={40} className="text-gray-400 mb-3" />

            <p className="text-sm text-gray-500 mb-6">
              감명깊게 읽은 책을 골라 리뷰를 작성해 보세요!
            </p>
            <button className="border border-gray-300 px-5 py-2 rounded text-sm hover:bg-gray-100">
              리뷰 작성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
