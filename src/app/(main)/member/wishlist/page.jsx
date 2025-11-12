"use client";

import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const Wishlist = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "자바스크립트 완벽 가이드",
      price: 45000,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      name: "리액트를 다루는 기술",
      price: 36000,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 3,
      name: "클린 코드",
      price: 29000,
      image: "https://via.placeholder.com/80",
    },
  ]);

  // 하트 클릭 시 위시리스트에서 제거
  const handleToggleHeart = (id, name) => {
    setItems(items.filter((item) => item.id !== id));
    alert(`${name}이(가) 위시리스트에서 제거되었습니다`);
  };

  // 장바구니에 추가
  const handleAddToCart = (name) => {
    alert(`${name}이(가) 장바구니에 추가되었습니다`);
    // TODO: 실제 장바구니 추가 로직
  };

  const itemsTotal = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-10 bg-white">
        <div className="max-w-1200 mx-auto px-5">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* 왼쪽 영역 - 위시리스트 목록 */}
            <div className="flex-2 bg-gray-50 p-5 rounded-15 shadow-sm">
              <h2 className="text-2xl font-bold mb-5 text-black">위시리스트</h2>

              {items.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">위시리스트가 비어 있습니다.</p>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-gray-200">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex flex-col">
                          <span className="text-black font-medium">{item.name}</span>
                          <span className="text-(--main-color) font-bold">
                            {item.price.toLocaleString()}원
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleHeart(item.id, item.name)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded"
                        >
                          <FaHeart size={20} />
                        </button>
                        <button
                          onClick={() => handleAddToCart(item.name)}
                          className="bg-(--sub-color) text-white p-2 rounded hover:bg-green-700"
                        >
                          <FiShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 오른쪽 영역 - 요약 정보 */}
            <div className="flex-1 bg-gray-50 p-5 rounded-15 shadow-sm h-fit lg:sticky lg:top-5">
              <h2 className="text-2xl font-bold mb-5 text-black">위시리스트 정보</h2>

              <div className="flex flex-col gap-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-black">상품 수</span>
                  <span className="font-bold text-black">{items.length}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">총 금액</span>
                  <span className="font-bold text-(--main-color)">
                    {itemsTotal.toLocaleString()}원
                  </span>
                </div>
              </div>

              <div className="border-b border-gray-200 mb-4" />

              <Link
                href="/cart"
                className="block w-full text-center py-3 bg-(--main-color) text-white rounded-lg hover:bg-(--sub-color) transition"
              >
                장바구니로 이동
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Wishlist;
