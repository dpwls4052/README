// src/hooks/review/useDeleteReview.js
"use client";

import { useState } from "react";

export default function useDeleteReview() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteReview = async (reviewId) => {
    if (!reviewId) {
      throw new Error("reviewId가 없습니다.");
    }

    try {
      setDeleting(true);
      setError(null);

      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId,
          status: false, // soft delete
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "리뷰 삭제 실패");
        throw new Error(data.message || "리뷰 삭제 실패");
      }

      return data;
    } finally {
      setDeleting(false);
    }
  };

  return { deleteReview, deleting, error };
}
