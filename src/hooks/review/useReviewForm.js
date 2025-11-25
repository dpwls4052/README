// hooks/review/useReviewForm.js
"use client";

import { useEffect, useState } from "react";

export default function useReviewForm({ bookId, userId, reviewId }) {
  const [rate, setRate] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false); // 데이터 로딩용
  const [submitting, setSubmitting] = useState(false); // 저장 중
  const [error, setError] = useState(null);

  const isEdit = !!reviewId;

  // 수정 모드일 때: 기존 리뷰 불러오기
  useEffect(() => {
    if (!isEdit || !bookId || !userId) return;

    const controller = new AbortController();

    async function fetchExistingReview() {
      try {
        setLoading(true);
        setError(null);

        // userId + bookId 기준으로 이 유저가 이 책에 쓴 리뷰 불러오기
        const res = await fetch(
          `/api/reviews?userId=${encodeURIComponent(userId)}&bookId=${Number(
            bookId
          )}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          setError("기존 리뷰를 불러오지 못했습니다.");
          return;
        }

        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          // reviewId가 있으면 우선 그걸 찾고, 없으면 첫 번째 사용
          const target = reviewId
            ? data.find((r) => r.review_id === Number(reviewId)) || data[0]
            : data[0];

          setRate(target.rate ?? 5);
          setContent(target.review ?? "");
        } else {
          // 리뷰가 없으면 그냥 생성 모드처럼 둠
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("기존 리뷰 fetch 오류:", err);
        setError("기존 리뷰를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchExistingReview();

    return () => controller.abort();
  }, [isEdit, bookId, userId, reviewId]);

  // 저장 (생성 or 수정)
  const submit = async () => {
    if (!bookId || !userId) {
      throw new Error("bookId 또는 userId가 없습니다.");
    }
    if (!content.trim()) {
      throw new Error("리뷰 내용을 입력해주세요.");
    }

    try {
      setSubmitting(true);
      setError(null);

      if (isEdit) {
        // 수정
        const res = await fetch("/api/reviews", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reviewId: Number(reviewId),
            rate,
            review: content.trim(),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "리뷰 수정 실패");
          throw new Error(data.message || "리뷰 수정 실패");
        }

        return data;
      } else {
        // 🆕 생성
        const res = await fetch("/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookId: Number(bookId),
            userId,
            rate,
            review: content.trim(),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "리뷰 생성 실패");
          throw new Error(data.message || "리뷰 생성 실패");
        }

        return data;
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isEdit,
    rate,
    setRate,
    content,
    setContent,
    loading,
    submitting,
    error,
    submit,
  };
}
