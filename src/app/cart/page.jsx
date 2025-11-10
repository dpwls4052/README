import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

// Cart Page Component
export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "자바스크립트",
      price: 150,
      count: 1,
      image: "https://via.placeholder.com/80",
      selected: true,
    },
    {
      id: 2,
      name: "리액트",
      price: 180,
      count: 1,
      image: "https://via.placeholder.com/80",
      selected: true,
    },
  ]);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setItems(items.map((item) => ({ ...item, selected: checked })));
  };

  const handleSelect = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleCountChange = (id, delta) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, count: Math.max(1, item.count + delta) }
          : item
      )
    );
  };

  const handleDeleteSelected = () => {
    const selectedCount = items.filter((item) => item.selected).length;
    if (selectedCount === 0) {
      alert("선택된 상품이 없습니다");
      return;
    }
    setItems(items.filter((item) => !item.selected));
    alert("선택한 상품을 삭제했습니다");
  };

  const handleDeleteAll = () => {
    if (items.length === 0) return;
    setItems([]);
    alert("모든 상품을 삭제했습니다");
  };

  const handlePay = () => {
    if (selectedItems.length === 0) {
      alert("상품을 선택해주세요");
      return;
    }
    
    // Next.js router를 사용하여 결제 페이지로 이동
    // router.push({
    //   pathname: '/payment',
    //   query: {
    //     orderItems: JSON.stringify(orderItems),
    //     totalItemPrice: itemsTotal,
    //     deliveryFee: shippingFee,
    //     finalPrice: totalAmount
    //   }
    // });
    
    alert("결제 페이지로 이동합니다");
  };

  const selectedItems = items.filter((item) => item.selected);
  const itemsTotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );
  let shippingFee = 0;
  if (itemsTotal > 0 && itemsTotal < 30000) {
    shippingFee = 30;
  }
  const totalAmount = itemsTotal + shippingFee;

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* 왼쪽 영역 - 장바구니 목록 */}
          <div className="flex-[2] bg-[#f5f5f5] p-5 rounded-2xl shadow-sm">
            <h1 className="text-2xl font-bold mb-5 text-black">장바구니</h1>

            <div className="flex justify-between items-center mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={items.length > 0 && selectedItems.length === items.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4"
                />
                <span className="font-medium text-black">
                  전체선택 ({selectedItems.length}/{items.length})
                </span>
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 text-sm bg-[#8b9670] text-white rounded-lg hover:bg-[#6d7a58] transition-colors"
                >
                  선택삭제
                </button>
                <button
                  onClick={handleDeleteAll}
                  className="px-4 py-2 text-sm bg-[#8b9670] text-white rounded-lg hover:bg-[#6d7a58] transition-colors"
                >
                  전체삭제
                </button>
              </div>
            </div>

            <div className="border-b border-gray-200 mb-4" />

            {items.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">
                  장바구니가 비어 있습니다.
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-center py-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => handleSelect(item.id)}
                          className="w-4 h-4"
                        />
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-base font-medium text-black">
                            {item.name}
                          </p>
                          <p className="text-lg font-bold text-[#8b9670]">
                            {item.price.toLocaleString()}원
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCountChange(item.id, -1)}
                          disabled={item.count <= 1}
                          className="w-8 h-8 flex items-center justify-center bg-[#8b9670] text-white rounded hover:bg-[#6d7a58] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-medium min-w-[30px] text-center text-black">
                          {item.count}
                        </span>
                        <button
                          onClick={() => handleCountChange(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-[#8b9670] text-white rounded hover:bg-[#6d7a58]"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    {index < items.length - 1 && <div className="border-b border-gray-200" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 오른쪽 영역 - 결제정보 */}
          <div className="flex-1 bg-[#f5f5f5] p-5 rounded-2xl shadow-sm h-fit lg:sticky lg:top-5">
            <h2 className="text-2xl font-bold mb-5 text-black">결제정보</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-black">상품 금액</span>
                <span className="font-bold text-black">{itemsTotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-black">배송비</span>
                <span className={`font-bold ${shippingFee === 0 ? 'text-[#8b9670]' : 'text-black'}`}>
                  {shippingFee === 0 ? "무료" : `${shippingFee.toLocaleString()}원`}
                </span>
              </div>
              <div className="border-b border-gray-200" />
              <div className="flex justify-between text-lg">
                <span className="font-bold text-black">결제 예정 금액</span>
                <span className="font-bold text-[#8b9670]">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>

            {itemsTotal > 0 && itemsTotal < 30000 && (
              <div className="bg-[#f5f5f5] p-3 rounded-lg mb-4 border border-[#8b9670]">
                <p className="text-sm text-[#8b9670]">
                  💡 30,000원 이상 구매 시 배송비 무료
                </p>
              </div>
            )}

            <button
              onClick={handlePay}
              disabled={selectedItems.length === 0}
              className="w-full py-3 text-lg font-medium bg-[#8b9670] text-[#f5f5f5] rounded-lg hover:bg-[#6d7a58] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              주문하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}