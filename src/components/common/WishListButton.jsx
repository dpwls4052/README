"use client";

import React from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useWishlist } from "@/hooks/common/useWishlist";

export default function WishListButton({ userId, bookId, stock }) {
  const { isWished, toggleWishlist, loading } = useWishlist(userId, bookId);

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading || stock === 0}
      className={`p-2 border-2 rounded-lg transition-colors ${
        isWished
          ? "border-red-500 text-red-500 bg-red-50"
          : "border-gray-300 text-gray-500 hover:bg-gray-100"
      } ${stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isWished ? <IoIosHeart size={28} /> : <IoIosHeartEmpty size={28} />}
    </button>
  );
}
