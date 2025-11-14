"use client";

import { useState } from "react";

export function useWishlist(userId, bookId) {
  const [isWished, setIsWished] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleWishlist = async () => {
    if (!userId || !bookId) return;

    setLoading(true);

    try {
      const res = await fetch("/api/member/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, book_id: bookId }),
      });

      const data = await res.json();

      console.log("Wishlist POST response:", data);

      if (res.ok) {
        setIsWished(data.status); // DB 반영 결과로 상태 업데이트
      } else {
        console.error("Wishlist POST failed:", data);
      }
    } catch (err) {
      console.error("Wishlist fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return { isWished, toggleWishlist, loading };
}
