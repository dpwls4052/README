"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/common/Modal";
import { useAuth } from "@/hooks/common/useAuth";

/**
 * 바로구매 버튼 컴포넌트
 * @param {Object} book - 책 정보 객체
 * @param {number} book.bookId - 책 ID
 * @param {string} book.title - 책 제목
 * @param {string} book.cover - 책 표지 이미지 URL
 * @param {number} book.priceStandard - 책 가격
 * @param {number} book.stock - 재고 수량
 * @param {string} className - 추가 CSS 클래스
 */
const BuyNowButton = ({ book, className = "" }) => {
  const router = useRouter();
  const { userId } = useAuth();

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isStockModalOpen, setStockModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBuyNow = () => {
    // 1. 로그인 체크
    if (!userId) {
      setLoginModalOpen(true);
      return;
    }

    // 2. 재고 체크
    if (!book || book.stock === 0 || book.stock < 1) {
      setStockModalOpen(true);
      return;
    }

    // 3. 필수 정보 체크
    if (!book.bookId || !book.title || !book.priceStandard) {
      alert("상품 정보가 올바르지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      // 4. 바로구매 데이터 생성 (장바구니와 동일한 형식)
      const buyNowData = {
        orderItems: [
          {
            book_id: book.bookId,
            title: book.title,
            image: book.cover,
            quantity: 1,  // 바로구매는 항상 1개
            price: book.priceStandard,
          }
        ],
        totalItemPrice: book.priceStandard,
        deliveryFee: book.priceStandard >= 30000 ? 0 : 3000,
        finalPrice: book.priceStandard >= 30000 
          ? book.priceStandard 
          : book.priceStandard + 3000
      };

      // 5. localStorage에 저장
      localStorage.setItem("cartData", JSON.stringify(buyNowData));
      
      // 6. 결제 페이지로 이동
      router.push("/pay");
    } catch (error) {
      console.error("바로구매 처리 중 오류:", error);
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLogin = () => {
    router.push("/login");
    setLoginModalOpen(false);
  };

  // 재고가 0일 때 버튼 비활성화
  const isOutOfStock = !book || book.stock === 0 || book.stock < 1;

  return (
    <>
      <button
        className={`
          flex-1 bg-[var(--main-color)]
          text-white font-normal
          h-40 py-2
          rounded hover:cursor-pointer 
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        onClick={handleBuyNow}
        disabled={loading || isOutOfStock}
      >
        {loading ? "처리중..." : isOutOfStock ? "바로구매" : "바로구매"}
      </button>

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

      {/* 재고 부족 모달 */}
      <Modal
        title="재고가 부족합니다."
        open={isStockModalOpen}
        onOpenChange={setStockModalOpen}
        confirmText="확인"
        onConfirm={() => setStockModalOpen(false)}
        maxSize="max-w-md"
        bodyClassName="text-center text-16 font-normal"
        hideCancel
      >
        현재 이 상품은 품절되었습니다.
      </Modal>
    </>
  );
};

export default BuyNowButton;