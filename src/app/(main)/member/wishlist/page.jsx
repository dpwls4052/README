import React, { useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

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

  const handleToggleHeart = (id, name) => {
    setItems(items.filter((item) => item.id !== id));
    alert(`${name}이(가) 위시리스트에서 제거되었습니다`);
  };

  const handleAddToCart = (name) => {
    alert(`${name}이(가) 장바구니에 추가되었습니다`);
    // TODO: 실제 장바구니 추가 로직
  };

  const itemsTotal = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* 왼쪽 영역 - 위시리스트 목록 */}
          <div className="flex-2 bg-[var(--bg-color)] p-5 rounded-2xl shadow-sm flex-1">
            <h2 className="text-2xl font-bold mb-5 text-black">위시리스트</h2>

            {items.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">위시리스트가 비어 있습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-200">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex flex-col">
                        <p className="text-base font-medium text-black">{item.name}</p>
                        <p className="text-lg font-bold text-[var(--main-color)]">
                          {item.price.toLocaleString()}원
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        aria-label="위시리스트에서 제거"
                        onClick={() => handleToggleHeart(item.id, item.name)}
                        className="p-2 rounded-md text-[#e63946] hover:bg-[#e6394620] transition"
                      >
                        <FaHeart size={22} />
                      </button>
                      <button
                        aria-label="장바구니에 추가"
                        onClick={() => handleAddToCart(item.name)}
                        className="p-2 rounded-md bg-[var(--sub-color)] text-white hover:bg-[#6d7a58] transition"
                      >
                        <FiShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 오른쪽 영역 - 요약 정보 */}
          <div className="flex-1 bg-[var(--bg-color)] p-5 rounded-2xl shadow-sm h-fit lg:sticky top-5">
            <h2 className="text-2xl font-bold mb-5 text-black">위시리스트 정보</h2>

            <div className="flex flex-col gap-3 mb-4">
              <div className="flex justify-between">
                <p className="text-black">상품 수</p>
                <p className="font-bold text-black">{items.length}개</p>
              </div>
              <div className="flex justify-between">
                <p className="text-black">총 금액</p>
                <p className="font-bold text-[var(--main-color)]">
                  {itemsTotal.toLocaleString()}원
                </p>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-4" />

            <button
              className="w-full py-3 bg-[var(--main-color)] text-[var(--bg-color)] text-lg font-semibold rounded-lg hover:bg-[var(--sub-color)] transition"
              onClick={() =>
                (window.location.href = "/kt_3team_project_2025/cart")
              }
            >
              장바구니로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
