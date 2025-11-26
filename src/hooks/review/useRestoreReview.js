// src/hooks/review/useRestoreReview.js
"use client";

import { useState } from "react";

export default function useRestoreReview() {
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState(null);

  const restoreReview = async (reviewId) => {
    if (!reviewId) {
      throw new Error("reviewId가 없습니다.");
    }

    try {
      setRestoring(true);
      setError(null);

      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewId,
          status: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "리뷰 삭제 실패");
        throw new Error(data.message || "리뷰 삭제 실패");
      }

      return data;
    } finally {
      setRestoring(false);
    }
  };

  return { restoreReview, restoring, error };
}
