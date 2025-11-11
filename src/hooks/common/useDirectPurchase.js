"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export const useDirectPurchase = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const purchase = (book) => {
    if (user) {
      const orderItem = {
        id: book.id,
        title: book.title,
        price: book.price,
        quantity: 1,
        image: book.image,
      };

      const cartData = {
        orderItems: [orderItem],
        totalItemPrice: book.price,
        deliveryFee: 0,
      };

      const cartDataString = encodeURIComponent(JSON.stringify(cartData));
      router.push(`/pay?cartData=${cartDataString}`);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const confirmLoginModal = () => {
    router.push("/login");
    setIsLoginModalOpen(false);
  };

  return { purchase, isLoginModalOpen, closeLoginModal, confirmLoginModal };
};
