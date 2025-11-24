// src/hooks/common/useCartCount.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";

const CartCountContext = createContext(null);

export function useCartCount() {
  const context = useContext(CartCountContext);
  if (context === null) {
    throw new Error("useCartCount must be used within a CartCountProvider");
  }
  return context;
}

export function CartCountProvider({ children }) {
  const { user } = useAuth();
  const [bookIds, setBookIds] = useState([]); // 🌟 book_id 배열로 관리
  const count = bookIds.length; // 🌟 배열 길이가 곧 개수

  useEffect(() => {
    if (!user) {
      setBookIds([]);
      return;
    }

    let userId = null;

    async function init() {
      // user_id 확인
      if (user.id) {
        userId = user.id;
      } else if (user.uid) {
        const { data } = await supabase
          .from("users")
          .select("user_id")
          .eq("uid", user.uid)
          .single();
        userId = data?.user_id;
      }

      if (!userId) {
        setBookIds([]);
        return;
      }

      // 🌟 초기 1회 조회 - book_id만 가져오기
      const { data } = await supabase
        .from("cart")
        .select("book_id")
        .eq("user_id", userId)
        .eq("status", true);

      const ids = data?.map(item => item.book_id) || [];
      setBookIds(ids);
    }

    init();
  }, [user?.id, user?.uid]);

  // 🌟 장바구니에 추가
  const addToCart = (bookId) => {
    setBookIds((prev) => {
      // 이미 있으면 추가 안함
      if (prev.includes(bookId)) {
        return prev;
      }
      // 없으면 추가
      return [...prev, bookId];
    });
  };

  // 🌟 장바구니에서 제거
  const removeFromCart = (bookId) => {
    setBookIds((prev) => prev.filter(id => id !== bookId));
  };

  return (
    <CartCountContext.Provider value={{ count, bookIds, addToCart, removeFromCart }}>
      {children}
    </CartCountContext.Provider>
  );
}