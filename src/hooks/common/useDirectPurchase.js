"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "./useAuth";

export const useDirectPurchase = () => {
  const { user } = useAuth();
  const router = useRouter();

  const purchase = (book) => {
    if (user) {
      const orderItem = {
        id: book.id,
        title: book.title,
        price: book.priceStandard,
        quantity: 1,
        image: book.cover,
      };

      const cartData = {
        orderItems: [orderItem],
        totalItemPrice: book.priceStandard,
        deliveryFee: 3000,
      };

      const cartDataString = encodeURIComponent(JSON.stringify(cartData));
      router.push(`/pay?cartData=${cartDataString}`);
      return true;
    } else {
      return false;
    }
  };

  return { purchase };
};
