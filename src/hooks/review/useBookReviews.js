"use client";

import { useState, useEffect } from "react";

export default function useBookReviews(bookId) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookId) return;

    const controller = new AbortController();

    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/reviews?bookId=${bookId}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          setError("리뷰 조회 실패");
          return;
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          // API에서 이미 author, firstChar가 포함되어 있음
          const mapped = data.map((r) => ({
            id: r.review_id,
            author: r.author || "익**",
            firstChar: r.firstChar || "익",
            rating: r.rate,
            content: r.review,
            date: r.created_at ? r.created_at.slice(0, 10) : "",
            avatar: "",
          }));
          setReviews(mapped);
        } else {
          setReviews([]);
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("리뷰 fetch 오류:", err);
        setError("리뷰를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();

    return () => controller.abort();
  }, [bookId]);

  return { reviews, loading, error };
}