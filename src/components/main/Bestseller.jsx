"use client";

import Image from "next/image";
import { IoIosHeartEmpty } from "react-icons/io";
import Modal from "@/components/common/Modal";
import { useBookList } from "@/hooks/common/useBookList";
import { useDirectPurchase } from "@/hooks/common/useDirectPurchase";
import { useCart } from "@/hooks/common/useCart";
import { useModal } from "@/hooks/common/useModal";
import { useRouter } from "next/navigation";
import noimg from "@/assets/no_image.png";

const Bestseller = () => {
  const router = useRouter();
  const goDetail = (id) => {
    router.push(`/product/detail/${id}`);
  };
  const { books } = useBookList({
    pageSize: 8,
    orderField: "salesCount",
    orderDirection: "desc",
  });

  const { purchase } = useDirectPurchase();
  const {
    isModalOpen: isCartModalOpen,
    openModal: openCartModal,
    closeModal: closeCartModal,
    toggleModal: toggleCartModal,
  } = useModal();
  const {
    isModalOpen: isLoginModalOpen,
    openModal: openLoginModal,
    closeModal: closeLoginModal,
    toggleModal: toggleLoginModal,
  } = useModal();
  const { selectedBook, addToCart, goToCart } = useCart();

  const handleAddToCart = (book) => {
    addToCart(book);
    openCartModal();
  };
  const handleGoToCart = () => {
    closeCartModal();
    goToCart();
  };
  const handlePurchase = (book) => {
    if (!purchase(book)) {
      openLoginModal();
    }
  };
  const confirmLoginModal = () => {
    router.push("/login");
    closeLoginModal();
  };
  return (
    <div className="p-0 mx-auto text-center my-100 max-w-1200">
      <p className="text-[32px] font-semibold">베스트셀러</p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-40 my-80">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-[var(--bg-color)] p-8 flex flex-col justify-between gap-15 "
          >
            {/* 도서 이미지 */}
            <div
              className="w-250 h-320 overflow-hidden rounded-md border border-gray-300 hover:cursor-pointer"
              onClick={() => goDetail(book.id)}
            >
              <Image
                src={book.highResCover || noimg}
                alt={book.title}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>

            {/* 제목 + 찜버튼 */}
            <div className="flex items-start justify-between">
              <p className="font-semibold text-left text-16/20 w-180 line-clamp-2">
                {book.title}
              </p>

              <button className="p-2">
                <IoIosHeartEmpty size={20} className="text-red-500" />
              </button>
            </div>

            {/* 작가, 가격 */}
            <div className="flex items-center justify-between">
              <p className="font-normal text-left truncate text-14 w-140">
                {book.author}
              </p>
              <p className="text-16 font-normal">
                {(book.priceStandard ?? 0).toLocaleString()}원
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex items-center justify-between gap-2">
              {/* 장바구니 모달 */}
              <Modal
                title="선택한 상품을 장바구니에 담았어요."
                open={isCartModalOpen}
                onOpenChange={toggleCartModal}
                confirmText="장바구니 이동"
                cancelText="취소"
                onConfirm={handleGoToCart}
                onCancel={closeCartModal}
                maxSize="max-w-md"
                bodyClassName="text-center text-16 font-normal"
              >
                장바구니 페이지로 이동하시겠습니까?
              </Modal>
              <button
                className="flex-1 bg-(--sub-color) text-white py-2 rounded h-40 font-normal hover:cursor-pointer"
                onClick={() => handleAddToCart(book)}
              >
                장바구니
              </button>

              {/* 로그인 모달 */}
              <Modal
                title="로그인이 필요한 서비스입니다."
                open={isLoginModalOpen}
                onOpenChange={toggleLoginModal}
                confirmText="로그인 페이지로 이동"
                cancelText="취소"
                onConfirm={confirmLoginModal}
                onCancel={closeLoginModal}
                maxSize="max-w-md"
                bodyClassName="text-center text-16 font-normal"
              >
                로그인 페이지로 이동하시겠습니까?
              </Modal>
              <button
                className="flex-1 bg-(--main-color) text-white py-2 rounded h-40 font-normal hover:cursor-pointer"
                onClick={() => handlePurchase(book)}
              >
                바로구매
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bestseller;
