"use client";

import Image from "next/image";
import { useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { useAuth } from "@/hooks/common/useAuth";
import { useBookList } from "@/hooks/common/useBookList";

const Bestseller = () => {
  const { books, loading } = useBookList({
    pageSize: 10,
    orderField: "salesCount",
    orderDirection: "desc",
  });

  const [openCart, setOpenCart] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleBuyNow = () => {
    if (user) {
      router.push("/pay");
    } else {
      setOpenLogin(true);
    }
  };

  return (
    <div className="p-0 my-[100px] max-w-[1200px] mx-auto text-center">
      <p className="text-[24px] font-semibold">베스트셀러</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-[30px] my-[80px]">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-[var(--bg-color)] p-4 flex flex-col justify-between gap-3"
          >
            {/* 도서 이미지 */}
            <div className="w-full h-[300px] overflow-hidden border border-gray-200">
              <Image
                src={book.cover || "/no-image.png"}
                alt={book.title}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 제목 + 찜버튼 */}
            <div className="flex items-start justify-between">
              <p
                className="text-[18px] font-bold text-left w-[180px] line-clamp-2"
              >
                {book.title}
              </p>

              <button className="p-2">
                <IoIosHeartEmpty size={20} className="text-red-500" />
              </button>
            </div>

            {/* 작가, 가격 */}
            <div className="flex items-center justify-between">
              <p className="text-[14px] text-left w-[150px] truncate">
                {book.author}
              </p>
              <p className="text-[14px]">
                {(book.priceStandard ?? 0).toLocaleString()}원
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex items-center justify-between gap-2">
              <button
                className="flex-1 bg-[var(--sub-color)] text-white py-2 rounded"
                onClick={() => setOpenCart(true)}
              >
                장바구니
              </button>

              <button
                className="flex-1 bg-[var(--main-color)] text-white py-2 rounded"
                onClick={handleBuyNow}
              >
                바로구매
              </button>

              {/* 장바구니 모달 */}
              <Modal
                title="선택한 상품을 장바구니에 담았어요."
                open={openCart}
                onOpenChange={(e) => setOpenCart(e.open)}
                confirmText="장바구니 이동"
                cancelText="취소"
                onConfirm={() => {
                  router.push("/cart");
                  setOpenCart(false);
                }}
                size="xl"
              >
                장바구니 페이지로 이동하시겠습니까?
              </Modal>

              {/* 로그인 모달 */}
              <Modal
                title="로그인이 필요한 서비스입니다."
                open={openLogin}
                onOpenChange={(e) => setOpenLogin(e.open)}
                confirmText="로그인 페이지로 이동"
                cancelText="취소"
                onConfirm={() => {
                  router.push("/login");
                  setOpenLogin(false);
                }}
                size="md"
              >
                로그인 페이지로 이동하시겠습니까?
              </Modal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestseller;
