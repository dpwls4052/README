// src/hooks/common/useWishlistCount.js
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";

// 1. Context 생성
const WishlistCountContext = createContext(null);

// 2. Custom Hook: 위시리스트 개수를 가져오고 변경 함수를 제공
export function useWishlistCount() {
  const context = useContext(WishlistCountContext);
  if (context === null) {
    throw new Error("useWishlistCount must be used within a WishlistCountProvider");
  }
  return context; 
}

/**
 * Provider Component: 위시리스트 개수 상태를 관리하고 하위 컴포넌트에 제공합니다.
 */
export function WishlistCountProvider({ children }) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setCount(0);
      return;
    }

    let userId = null;
    let channel = null;

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
        setCount(0);
        return;
      }

      // 🌟 초기 1회 조회 (status: true만)
      const { data } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", userId)
        .eq("status", true); // 🔥 추가!

      setCount(data?.length || 0);

      // 🌟 실시간 구독
      channel = supabase
        .channel(`wishlist-changes-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "wishlist",
            filter: `user_id=eq.${userId}`,
          },
          async () => {
            // 변화 생기면 자동으로 다시 조회 (status: true만)
            const { data } = await supabase
              .from("wishlist")
              .select("*")
              .eq("user_id", userId)
              .eq("status", true); // 🔥 추가!

            setCount(data?.length || 0);
          }
        )
        .subscribe();
    }

    init();

    // cleanup 함수
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id, user?.uid]);

  return (
    <WishlistCountContext.Provider value={{ count, setCount }}>
      {children}
    </WishlistCountContext.Provider>
  );
}