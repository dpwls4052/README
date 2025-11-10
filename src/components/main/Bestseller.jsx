"use client";

import Image from "next/image";
import { IoIosHeartEmpty } from "react-icons/io";
import Modal from "@/components/Modal";
import { useBookList } from "@/hooks/common/useBookList";
import { useDirectPurchase } from "@/hooks/common/useDirectPurchase";
import { useCart } from "@/hooks/common/useCart";

const Bestseller = () => {
  const { books } = useBookList({
    pageSize: 10,
    orderField: "salesCount",
    orderDirection: "desc",
  });

  const { purchase, isLoginModalOpen, closeLoginModal, confirmLoginModal } =
    useDirectPurchase();
  const { openCart, handleAddToCart, onConfirmCart, onCloseCart } = useCart();

  return (
    <div className="p-0 my-100 max-w-1200 mx-auto text-center">
      <p className="text-[32px] font-semibold">베스트셀러</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-30 my-80">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-[var(--bg-color)] p-8 flex flex-col justify-between gap-8"
          >
            {/* 도서 이미지 */}
            <div className="w-full h-250 overflow-hidden border border-gray-200">
              <Image
                src={book.cover}
                alt={book.title}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 제목 + 찜버튼 */}
            <div className="flex items-start justify-between">
              <p className="text-14 font-bold text-left w-180 line-clamp-2">
                {book.title}
              </p>

              <button className="p-2">
                <IoIosHeartEmpty size={20} className="text-red-500" />
              </button>
            </div>

            {/* 작가, 가격 */}
            <div className="flex items-center justify-between">
              <p className="text-12 font-semibold text-left w-140 truncate">
                {book.author}
              </p>
              <p className="text-14">
                {(book.priceStandard ?? 0).toLocaleString()}원
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex items-center justify-between gap-2">
              <button
                className="flex-1 bg-[var(--sub-color)] text-white py-2 rounded h-40 font-normal"
                onClick={() => handleAddToCart(book)}
              >
                장바구니
              </button>

              <button
                className="flex-1 bg-[var(--main-color)] text-white py-2 rounded h-40 font-normal"
                onClick={() => purchase(book)}
              >
                바로구매
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* 장바구니 모달 */}
      <Modal
        title="선택한 상품을 장바구니에 담았어요."
        open={openCart}
        onOpenChange={onCloseCart}
        confirmText="장바구니 이동"
        cancelText="취소"
        onConfirm={onConfirmCart}
        size="xl"
      >
        장바구니 페이지로 이동하시겠습니까?
      </Modal>

      {/* 로그인 모달 */}
      <Modal
        title="로그인이 필요한 서비스입니다."
        open={isLoginModalOpen}
        onOpenChange={closeLoginModal}
        confirmText="로그인 페이지로 이동"
        cancelText="취소"
        onConfirm={confirmLoginModal}
        size="md"
      >
        로그인 페이지로 이동하시겠습니까?
      </Modal>
    </div>
  );
};

export default Bestseller;
