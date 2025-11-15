"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import WishListButton from "@/components/common/WishListButton";
import Modal from "@/components/common/Modal";
import { useDirectPurchase } from "@/hooks/common/useDirectPurchase";
import { useCart } from "@/hooks/common/useCart";
import { useModal } from "@/hooks/common/useModal";
import { useAuth } from "@/hooks/common/useAuth";
import noimg from "@/assets/no_image.png";
import AddToCartButton from "../common/AddToCartButton";

const Bestseller = () => {
  const router = useRouter();
  const { userId } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 베스트셀러 데이터 가져오기
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/books/bestseller?limit=8");
        const data = await res.json();

        if (res.ok) {
          const mappedBooks = data.map(book => ({
            id: book.book_id,
            bookId: book.book_id,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            priceStandard: book.price_standard,
            cover: book.cover,
            highResCover: book.cover?.replace(/coversum/gi, "cover500"),
            stock: book.stock,
            salesCount: book.sales_count,
          }));
          setBooks(mappedBooks);
        } else {
          console.error("Failed to fetch bestsellers:", data);
        }
      } catch (err) {
        console.error("Bestseller fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  const goDetail = (id) => {
    router.push(`/product/detail/${id}`);
  };

  const { purchase } = useDirectPurchase();
  const { addToCart, goToCart } = useCart();
  
  // 기존 모달 훅 재사용
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

  const handleAddToCart = async (book) => {
    if (!userId) {
      openLoginModal();
      return;
    }
    try {
      const res = await fetch("/api/user/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, book_id: book.bookId, amount: 1 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "장바구니 추가 실패");
      // 모달 열기
      openCartModal();
    } catch (err) {
      console.error(err);
      alert(err.message); // 에러만 alert
    }
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

  if (loading) {
    return (
      <div className="p-0 mx-auto text-center my-100 max-w-1200">
        <p className="text-[32px] font-semibold">베스트셀러</p>
        <div className="flex justify-center items-center h-400">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 mx-auto text-center my-100 max-w-1200">
      <p className="text-[32px] font-semibold">베스트셀러</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-40 my-80">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-[var(--bg-color)] p-8 flex flex-col justify-between gap-15"
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

            {/* 제목 + 버튼 영역 */}
            <div className="flex items-start justify-between">
              <p className="font-semibold text-left text-16/20 w-180 line-clamp-2">
                {book.title}
              </p>

              <div className="flex gap-2 items-center">
                <WishListButton 
                  userId={userId} 
                  bookId={book.bookId} 
                  stock={book.stock} 
                />
                
              </div>
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

            {/* 바로구매 버튼 */}
            <div className="flex items-center justify-between gap-2">
              {/* 장바구니 모달 */}
              {/* <Modal
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
              </Modal> */}

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
              
              <AddToCartButton book={book} />
              {/* <button
                  className="flex-1 bg-(--sub-color) text-white py-2 h-40 rounded hover:cursor-pointer"
                  onClick={() => handleAddToCart(book)}
                >
                  장바구니
              </button> */}

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
