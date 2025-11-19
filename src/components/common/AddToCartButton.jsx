"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import { useAuth } from "@/hooks/common/useAuth";
import { useCart } from "@/hooks/common/useCart";
import { FiShoppingCart } from "react-icons/fi";

export default function AddToCartButton({ book, iconMode = false, className = "" }) {
  const router = useRouter();
  const { userId } = useAuth();
  const { goToCart } = useCart();

  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isStockModalOpen, setStockModalOpen] = useState(false); // ✅ 재고 부족 모달 추가
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    // 1. 로그인 체크
    if (!userId) {
      setLoginModalOpen(true);
      return;
    }

    // 2. 재고 체크 ✅
    if (!book || book.stock === 0 || book.stock < 1) {
      setStockModalOpen(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, book_id: book.bookId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "장바구니 추가 실패");

      setCartModalOpen(true);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToCart = () => {
    setCartModalOpen(false);
    goToCart();
  };

  const handleConfirmLogin = () => {
    router.push("/login");
    setLoginModalOpen(false);
  };

  // ✅ 재고가 0일 때 버튼 비활성화
  const isOutOfStock = !book || book.stock === 0 || book.stock < 1;

  return (
    <>
      <button
        className={
          iconMode
            ? `p-2 text-white bg-(--sub-color) rounded hover:bg-green-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`
            : `
                flex-1 bg-[var(--sub-color)]
                text-white font-normal
                h-40 py-2
                rounded hover:cursor-pointer 
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
              `
        }
        onClick={handleAddToCart}
        disabled={loading || isOutOfStock} // ✅ 재고 없으면 비활성화
      >
        {loading ? (
          iconMode ? <FiShoppingCart /> : "추가중..."
        ) : isOutOfStock ? (
          iconMode ? <FiShoppingCart /> : "장바구니"
        ) : iconMode ? (
          <FiShoppingCart />
        ) : (
          "장바구니"
        )}
      </button>

      {/* 장바구니 추가 완료 모달 */}
      <Modal
        title="선택한 상품을 장바구니에 담았어요."
        open={isCartModalOpen}
        onOpenChange={setCartModalOpen}
        confirmText="장바구니 이동"
        cancelText="취소"
        onConfirm={handleGoToCart}
        onCancel={() => setCartModalOpen(false)}
        maxSize="max-w-md"
        bodyClassName="text-center text-16 font-normal"
      >
        장바구니 페이지로 이동하시겠습니까?
      </Modal>

      {/* 로그인 필요 모달 */}
      <Modal
        title="로그인이 필요한 서비스입니다."
        open={isLoginModalOpen}
        onOpenChange={setLoginModalOpen}
        confirmText="로그인 페이지로 이동"
        cancelText="취소"
        onConfirm={handleConfirmLogin}
        onCancel={() => setLoginModalOpen(false)}
        maxSize="max-w-md"
        bodyClassName="text-center text-16 font-normal"
      >
        로그인 페이지로 이동하시겠습니까?
      </Modal>

      {/* ✅ 재고 부족 모달 (신규) */}
      <Modal
        title="재고가 부족합니다."
        open={isStockModalOpen}
        onOpenChange={setStockModalOpen}
        confirmText="확인"
        onConfirm={() => setStockModalOpen(false)}
        maxSize="max-w-md"
        bodyClassName="text-center text-16 font-normal"
        hideCancel // 확인 버튼만 표시
      >
        현재 이 상품은 품절되었습니다.
      </Modal>
    </>
  );
}