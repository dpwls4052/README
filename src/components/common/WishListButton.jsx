"use client";

import React, { useState, useEffect } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";

export default function WishListButton({ userId, bookId, stock }) {
  const [isWished, setIsWished] = useState(false);
  const [loading, setLoading] = useState(false);

  // 초기 wishlist 상태 확인
  useEffect(() => {
    if (!userId || !bookId) return;

    const checkWishlistStatus = async () => {
      try {
        const res = await fetch(
          `/api/user/wishlist?user_id=${userId}&book_id=${bookId}`
        );
        const data = await res.json();
        if (res.ok) {
          setIsWished(data.status || false);
        } else {
          console.error("Wishlist status check error:", data);
        }
      } catch (err) {
        console.error("Wishlist status check failed:", err);
      }
    };

    checkWishlistStatus();
  }, [userId, bookId]);

  const toggleWishlist = async () => {
    if (!userId || !bookId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setLoading(true);

      // UI 즉시 반응
      setIsWished((prev) => !prev);

      // DB 요청
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          book_id: bookId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Wishlist API error:", data);
        // 실패 시 UI 되돌리기
        setIsWished((prev) => !prev);
      } else {
        // 서버에서 받은 실제 status로 업데이트
        setIsWished(data.status);
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      // 실패 시 UI 되돌리기
      setIsWished((prev) => !prev);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading || stock === 0}
      className="p-4 text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
    >
      {isWished ? <IoIosHeart size={28} /> : <IoIosHeartEmpty size={28} />}
    </button>
  );
}
