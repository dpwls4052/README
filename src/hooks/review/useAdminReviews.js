"use client";
import { getAdminReviews } from "@/service/reviewsService";
import { useEffect, useState, useCallback } from "react";

export const useAdminReviews = ({
  pageSize = 10,
  userEmail,
  bookId,
  minRating,
  maxRating,
  orderField = "created_at",
  orderDirection = "desc",
} = {}) => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchReviews = useCallback(
    async (targetPage = 1, append = false) => {
      if (loading) return;

      setLoading(true);

      try {
        const { reviews: fetchedReviews, hasNext: nextHasNext } =
          await getAdminReviews({
            page: targetPage,
            pageSize,
            userEmail,
            bookId,
            minRating,
            maxRating,
            orderField,
            orderDirection,
          });

        setReviews((prev) =>
          append ? [...prev, ...fetchedReviews] : fetchedReviews
        );

        setHasNext(nextHasNext);
        setPage(targetPage);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("리뷰 조회 오류:", err);
        }
      } finally {
        setLoading(false);
      }
    },
    [
      pageSize,
      userEmail,
      bookId,
      minRating,
      maxRating,
      orderField,
      orderDirection,
    ]
  );

  // 옵션이 바뀌면 첫 페이지부터 다시 로딩
  useEffect(() => {
    fetchReviews(1, false);
  }, [fetchReviews]);

  const fetchMoreReviews = useCallback(() => {
    if (hasNext && !loading) {
      fetchReviews(page + 1, true);
    }
  }, [hasNext, loading, page, fetchReviews]);

  return {
    reviews,
    setReviews,
    setReviews,
    fetchReviews,
    fetchMoreReviews,
    loading,
    hasNext,
    page,
  };
};
