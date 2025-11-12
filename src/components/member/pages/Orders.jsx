"use client";

import { useState } from "react";
import { FaSearch, FaDownload } from "react-icons/fa";

export default function Orders() {
  const [activeTab, setActiveTab] = useState("전체");
  const books = [
    {
      id: 1,
      title: "왜 지금 드론인가",
      author: "편석준, 이정훈 외 1명",
      cover: "https://placehold.co/150x210?text=WHY+DRONES",
    },
    {
      id: 2,
      title: "마흔 넘어 창업",
      author: "린 빌버렛 스톤링",
      cover: "https://placehold.co/150x210?text=마흔+넘어+창업",
    },
    {
      id: 3,
      title: "1만 시간의 재발견",
      author: "로버트 폴, 앤더슨",
      cover: "https://placehold.co/150x210?text=1만+시간의+재발견",
    },
    {
      id: 4,
      title: "여덟 단어: 인생을 대하는 우리의 자세",
      author: "박웅현",
      cover: "https://placehold.co/150x210?text=여덟+단어",
    },
  ];

  return (
    <div className="w-full bg-gray-50 min-h-screen py-10 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-sm p-8">
        {/* 🏷️ 헤더 */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            구매목록 <span className="text-green-600 text-lg"></span>
          </h1>
        </div>

        {/* 🧭 탭 */}
        <div className="flex gap-6 mb-6">
          {["구매"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 font-medium ${
                activeTab === tab
                  ? "border-b-2 border-green-700 text-green-700"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="flex ml-auto border rounded px-3 items-center bg-gray-50">
            <input
              placeholder="책 제목 또는 저자명"
              className="outline-none bg-gray-50 text-sm px-2 py-1 w-40"
            />
            <FaSearch className="text-gray-500" />
          </div>
        </div>

        {/* ⚙️ 상단 컨트롤 */}
        <div className="flex justify-between items-center mb-5 text-sm">
          <label className="flex items-center gap-2">
            
          </label>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              영구삭제
            </button>
          </div>
        </div>

        {/* 📚 도서 목록 */}
        <div className="grid grid-cols-5 gap-6">
          {books.map((book) => (
            <div
              key={book.id}
              className="relative border rounded-lg p-2 hover:shadow-md transition"
            >
              <input
                type="checkbox"
                className="absolute top-2 left-2 w-4 h-4 accent-green-600"
              />
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-52 object-cover rounded mb-3"
              />
              <p className="font-medium text-sm line-clamp-2">{book.title}</p>
              <p className="text-xs text-gray-500">{book.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
