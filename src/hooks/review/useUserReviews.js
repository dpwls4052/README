"use client";

import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";

// 마이페이지용: userId 기준으로 리뷰 가져오기
export default function useUserReviews(userId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    async function fetchReviews() {
      try {
        const idToken = await auth.currentUser.getIdToken();
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/reviews?userId=${encodeURIComponent(userId)}`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!res.ok) {
          setError("리뷰 조회 실패");
          return;
        }

        const data = await res.json();
        console.log("유저 리뷰 data:", data);
        console.log(res.status);
        // 서버에서 배열을 보내줬을 때만 처리
        if (Array.isArray(data)) {
          const mapped = data.map((r) => ({
            id: r.review_id,
            author: r.user_id ? r.user_id.slice(0, 8) : "익명",
            rating: r.rate,
            content: r.review,
            date: r.created_at ? r.created_at.slice(0, 10) : "",
            bookId: r.book_id,
          }));

          // 상태에 저장
          setReviews(mapped);
        } else {
          setReviews([]);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("유저 리뷰 fetch 오류:", err);
        setError("리뷰를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();

    return () => controller.abort();
  }, [userId]);

  return { reviews, loading, error };
}
