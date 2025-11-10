"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export const useCart = () => {
  const [openCart, setOpenCart] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const router = useRouter();

  const handleAddToCart = (book) => {
    setSelectedBook(book);
    setOpenCart(true);
  };
  const onConfirmCart = () => {
    router.push("/cart");
    setOpenCart(false);
  };
  const onCloseCart = () => {
    setOpenCart(false);
  };
  return {
    openCart,
    selectedBook,
    handleAddToCart,
    onConfirmCart,
    onCloseCart,
  };
};
