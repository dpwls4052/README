"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useAuth } from "@/hooks/common/useAuth";
import { useCartCount } from "@/hooks/common/useCartCount";
import { auth } from "@/lib/firebase";

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
  const { userId, user } = useAuth();
  const { removeFromCart } = useCartCount();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Authorization 헤더 생성 함수
  const getAuthHeaders = async () => {
    if (!auth.currentUser) return {};
    const token = await auth.currentUser.getIdToken();
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  };

  // 장바구니 불러오기
  const fetchCart = async () => {
    if (!userId || !user) return;
    setLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/user/cart`, {
        method: "GET",
        headers,
      });
      
      if (!res.ok) throw new Error("장바구니 조회 실패");
      const data = await res.json();

      const mappedItems = data
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((item) => ({
          id: item.book_id,
          cartId: item.cart_id,
          name: item.title,
          price: item.price_standard,
          count: item.amount,
          stock: item.stock,
          image: item.cover,
          selected: item.stock > 0,
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
  }, [userId, user]);

  // 선택 가능한 상품들 (재고가 있는 상품들)
  const availableItems = items.filter((item) => item.stock > 0);
  // 실제 선택된 상품들
  const selectedItems = items.filter((item) => item.selected);
  
  const itemsTotal = selectedItems.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );
  const shippingFee = itemsTotal > 0 && itemsTotal < 30000 ? 3000 : 0;
  const totalAmount = itemsTotal + shippingFee;

  // 전체선택 체크 상태: 선택 가능한 상품이 있고, 선택 가능한 상품 모두가 선택된 경우
  const isAllSelected = availableItems.length > 0 && 
                        availableItems.every(item => item.selected);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setItems(
      items.map((item) =>
        item.stock > 0 ? { ...item, selected: checked } : item
      )
    );
  };

  const handleSelect = (id) => {
    setItems(
      items.map((item) =>
        item.id === id && item.stock > 0
          ? { ...item, selected: !item.selected }
          : item
      )
    );
  };

  const handleCountChange = async (item, delta) => {
    const newCount = item.count + delta;
    if (newCount < 1) return;
    if (newCount > item.stock) return alert("재고가 부족합니다.");

    try {
      const headers = await getAuthHeaders();
      await fetch("/api/user/cart", {
        method: "PATCH",
        headers,
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
      const headers = await getAuthHeaders();
      await fetch("/api/user/cart", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ cartIds: selected.map((i) => i.cartId) }),
      });

      selected.forEach((item) => removeFromCart(item.id));
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  const handleDeleteAll = async () => {
    if (items.length === 0) return;
    try {
      const headers = await getAuthHeaders();
      await fetch("/api/user/cart", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ cartIds: items.map((i) => i.cartId) }),
      });

      items.forEach((item) => removeFromCart(item.id));
      fetchCart();
    } catch (err) {
      console.error(err);
      alert("전체 삭제 실패");
    }
  };

  const handlePay = () => {
    if (selectedItems.length === 0) return alert("상품을 선택해주세요");

    let hasAdjusted = false;

    const orderItems = selectedItems.map((item) => {
      if (item.count > item.stock) {
        hasAdjusted = true;
        item.count = item.stock;
      }
      return {
        book_id: item.id,
        title: item.name,
        image: item.image,
        quantity: item.count,
        price: item.price,
      };
    });

    if (hasAdjusted) {
      alert(
        "재고가 부족한 상품이 있어 최대 구매 가능한 수량으로 조정되었습니다."
      );
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "cartData",
        JSON.stringify({
          orderItems,
          totalItemPrice: orderItems.reduce(
            (acc, i) => acc + i.price * i.quantity,
            0
          ),
          deliveryFee: shippingFee,
          finalPrice:
            orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0) +
            shippingFee,
        })
      );
    }

    router.push("/pay");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen py-10 bg-white">
        <div className="max-w-full min-[900px]:max-w-1200 mx-auto px-4 md:px-5 pt-8 md:pt-50">
          <h1 className="text-2xl md:text-3xl font-bold mb-8 md:mb-20">장바구니</h1>

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
            <div className="flex flex-col lg:flex-row gap-8 md:gap-20">
              {/* 좌측 - 아이템 */}
              <div className="flex-[2] flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 md:w-20 md:h-20"
                    />
                    <span className="font-medium text-black text-sm md:text-base ml-2 md:ml-10">
                      전체선택 ({selectedItems.length}/{availableItems.length})
                    </span>
                  </label>
                  <div className="flex gap-2 md:gap-4">
                    <button
                      onClick={handleDeleteSelected}
                      className="px-3 md:px-12 py-2 md:py-6 font-normal text-xs md:text-sm bg-[var(--sub-color)] text-white rounded-sm hover:opacity-90"
                    >
                      선택삭제
                    </button>
                    <button
                      onClick={handleDeleteAll}
                      className="px-3 md:px-12 py-2 md:py-6 font-normal text-xs md:text-sm bg-[var(--sub-color)] text-white rounded-sm hover:opacity-90"
                    >
                      전체삭제
                    </button>
                  </div>
                </div>

                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 md:py-15 px-2 md:px-4 gap-3 md:gap-15 border-b border-gray-200"
                  >
                    <div className="flex items-start gap-3 md:gap-20 flex-1 w-full">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={() => handleSelect(item.id)}
                        className="w-4 h-4 md:w-20 md:h-20 mt-1 flex-shrink-0"
                        disabled={item.stock === 0}
                      />
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 md:w-100 h-24 md:h-140 object-cover rounded-md border border-gray-300 cursor-pointer flex-shrink-0"
                        onClick={() =>
                          router.push(`/product/detail/${item.id}`)
                        }
                      />
                      <div
                        className="flex flex-col gap-1 flex-1 cursor-pointer min-w-0"
                        onClick={() => router.push(`/product/detail/${item.id}`)}
                      >
                        <p className="text-sm md:text-base font-medium text-black line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-base md:text-lg font-bold text-[var(--main-color)]">
                          {item.price.toLocaleString()}원
                        </p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 font-medium text-xs md:text-14 whitespace-nowrap ${
                              item.stock > 10
                                ? "bg-[var(--sub-color)]/20 text-[var(--main-color)]"
                                : item.stock > 0
                                ? "bg-orange-100 text-orange-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                            style={{ width: "auto", display: "inline-block" }}
                          >
                            {item.stock > 0 ? `재고 ${item.stock}권` : "품절"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-auto sm:ml-0">
                      <button
                        onClick={() => handleCountChange(item, -1)}
                        disabled={item.count <= 1}
                        className="p-2 md:p-4 bg-[var(--sub-color)] text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 hover:cursor-pointer"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-medium min-w-[30px] md:min-w-[40px] text-center text-black text-sm md:text-base">
                        {item.count}
                      </span>
                      <button
                        onClick={() => handleCountChange(item, 1)}
                        className="p-2 md:p-4 bg-[var(--sub-color)] text-white rounded-sm hover:opacity-90 hover:cursor-pointer"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 우측 - 결제 정보 */}
              <div className="flex-[1] lg:sticky lg:top-100 h-fit">
                <div className="bg-[var(--bg-color)] p-4 md:p-20 rounded-md shadow-sm">
                  <h2 className="text-lg md:text-xl font-bold mb-6 md:mb-30 text-black">
                    결제 정보
                  </h2>
                  <div className="flex flex-col gap-4 md:gap-25 mb-4">
                    <div className="flex font-normal justify-between text-black text-sm md:text-base">
                      <span>상품 금액</span>
                      <span className="font-medium">
                        {itemsTotal.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex font-normal justify-between text-black text-sm md:text-base">
                      <span>배송비</span>
                      <span className="font-medium">
                        {shippingFee === 0
                          ? "무료"
                          : `${shippingFee.toLocaleString()}원`}
                      </span>
                    </div>
                    <div className="border-b border-gray-300 my-2" />
                    <div className="flex justify-between text-base md:text-lg font-bold text-black">
                      <span>결제 예정 금액</span>
                      <span className="text-[var(--main-color)]">
                        {totalAmount.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handlePay}
                    className="w-full mt-4 md:mt-20 py-3 md:py-16 bg-[var(--main-color)] text-white rounded-sm font-semibold text-base md:text-18 hover:opacity-90 transition hover:cursor-pointer"
                  >
                    주문하기
                  </button>
                  <p className="text-xs md:text-sm font-light text-gray-500 mt-2 md:mt-10 text-center">
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