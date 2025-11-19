"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/hooks/common/useAuth";

const Plus = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Minus = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Cart = () => {
  const router = useRouter();
  const { userId } = useAuth();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 장바구니 불러오기
  const fetchCart = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/cart?user_id=${userId}`);
      if (!res.ok) throw new Error("장바구니 조회 실패");
      const data = await res.json();
      const mappedItems = data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // 최신순 정렬
        .map((item) => ({
          id: item.book_id,
          cartId: item.cart_id,
          name: item.title,
          price: item.price_standard,
          count: item.amount,
          image: item.cover,
          selected: true,
        }));
      setItems(mappedItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const selectedItems = items.filter((item) => item.selected);
  const itemsTotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );
  const shippingFee = itemsTotal > 0 && itemsTotal < 30000 ? 3000 : 0;
  const totalAmount = itemsTotal + shippingFee;

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

  const handleCountChange = async (item, delta) => {
    try {
      await fetch("/api/user/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: item.cartId, delta }),
      });
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("수량 변경 실패");
    }
  };

  const handleDeleteSelected = async () => {
    const selected = items.filter((item) => item.selected);
    if (selected.length === 0) return alert("선택된 상품이 없습니다");

    try {
      await fetch("/api/user/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartIds: selected.map((i) => i.cartId) }),
      });
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  const handleDeleteAll = async () => {
    if (items.length === 0) return;
    try {
      await fetch("/api/user/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartIds: items.map((i) => i.cartId) }),
      });
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("전체 삭제 실패");
    }
  };

const handlePay = () => {
    if (selectedItems.length === 0) return alert("상품을 선택해주세요");

    const orderItems = selectedItems.map((item) => ({
      // 🚨 수정: 서버 API가 장바구니 삭제를 위해 요구하는 필드명(book_id)으로 변경
      book_id: item.id, 
      
      title: item.name,
      image: item.image,
      quantity: item.count,
      price: item.price,
    }));

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "cartData",
        JSON.stringify({
          orderItems,
          totalItemPrice: itemsTotal,
          deliveryFee: shippingFee,
          finalPrice: totalAmount,
        })
      );
    }

    router.push("/pay");
  };
  return (
    <ProtectedRoute>
      <div className="min-h-screen py-10 bg-white">
        <div className="max-w-1200 mx-auto px-5 pt-50">
          <h1 className="text-3xl font-bold mb-20">장바구니</h1>

          {loading ? (
            <div className="text-center py-10">
              <p className="font-normal text-gray-500">
                장바구니 불러오는 중...
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">장바구니가 비어 있습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-20">
              {/* 좌측 - 아이템 */}
              <div className="flex-[2] flex flex-col gap-4">
                <div className="flex justify-between items-center mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === items.length}
                      onChange={handleSelectAll}
                      className="w-20 h-20"
                    />
                    <span className="font-medium text-black ml-10">
                      전체선택 ({selectedItems.length}/{items.length})
                    </span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={handleDeleteSelected}
                      className="px-12 py-6 font-normal text-sm bg-[var(--sub-color)] text-white rounded-sm hover:opacity-90"
                    >
                      선택삭제
                    </button>
                    <button
                      onClick={handleDeleteAll}
                      className="px-12 py-6 font-normal text-sm bg-[var(--sub-color)] text-white rounded-sm hover:opacity-90"
                    >
                      전체삭제
                    </button>
                  </div>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-15 px-4 gap-15 border-b border-gray-200"
                  >
                    <div className="flex items-start gap-20 flex-1">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleSelect(item.id)}
                        className="w-20 h-20"
                      />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-100 h-140 object-cover rounded-md border border-gray-300"
                      />
                      <div className="flex flex-col gap-1 flex-1">
                        <p className="text-base font-medium text-black ">
                          {item.name}
                        </p>
                        <p className="text-lg font-bold text-[var(--main-color)]">
                          {item.price.toLocaleString()}원
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCountChange(item, -1)}
                        disabled={item.count <= 1}
                        className="p-4 bg-[var(--sub-color)] text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:cursor-pointer"
                      >
                        <Minus />
                      </button>
                      <span className="font-medium min-w-[40px] text-center text-black">
                        {item.count}
                      </span>
                      <button
                        onClick={() => handleCountChange(item, 1)}
                        className="p-4 bg-[var(--sub-color)] text-white rounded-sm hover:opacity-90 hover:cursor-pointer"
                      >
                        <Plus />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 우측 - 결제 정보 */}
              <div className="flex-[1] lg:sticky lg:top-100 h-fit">
                <div className="bg-[var(--bg-color)] p-20 rounded-md shadow-sm">
                  <h2 className="text-xl font-bold mb-30 text-black">
                    결제 정보
                  </h2>
                  <div className="flex flex-col gap-25 mb-4">
                    <div className="flex font-normal justify-between text-black">
                      <span>상품 금액</span>
                      <span className="font-medium">
                        {itemsTotal.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex font-normal justify-between text-black">
                      <span>배송비</span>
                      <span className="font-medium">
                        {shippingFee === 0
                          ? "무료"
                          : `${shippingFee.toLocaleString()}원`}
                      </span>
                    </div>
                    <div className="border-b border-gray-300 my-2" />
                    <div className="flex justify-between text-lg font-bold text-black">
                      <span>결제 예정 금액</span>
                      <span className="text-[var(--main-color)]">
                        {totalAmount.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handlePay}
                    className="w-full mt-20 py-16 bg-[var(--main-color)] text-white rounded-sm font-semibold text-18 hover:opacity-90 transition hover:cursor-pointer"
                  >
                    주문하기
                  </button>
                  <p className="text-sm font-light text-gray-500 mt-10 text-center">
                    30,000원 이상 구매 시 배송비 무료
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Cart;
