"use client";

import { useState, useCallback } from "react";

// POST /api/review
// payload: { bookId, userId, rate, review }
export default function useCreateReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // createReview 함수는 컴포넌트에서 호출
  const createReview = useCallback(async ({ bookId, userId, rate, review }) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          userId,
          rate,
          review,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 백엔드에서 보낸 에러 메시지 사용
        const message = data?.message || "리뷰 생성에 실패했습니다.";
        throw new Error(message);
      }

      // 성공 시 생성된 리뷰 데이터 반환
      return data;
    } catch (err) {
      console.error("리뷰 생성 오류:", err);
      setError(err.message || "리뷰 생성 중 오류가 발생했습니다.");
      throw err; // 필요하면 컴포넌트에서 catch해서 토스트 띄우게
    } finally {
      setLoading(false);
    }
  }, []);

  return { createReview, loading, error };
}
