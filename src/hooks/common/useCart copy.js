"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export const useCart = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const router = useRouter();

  // 장바구니에 담을 책 선택
  const addToCart = (book) => {
    setSelectedBook(book);
  };

  // 장바구니 페이지 이동
  const goToCart = () => {
    router.push("/cart");
  };

  return {
    selectedBook,
    addToCart,
    goToCart,
  };
};
