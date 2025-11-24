"use client";
import { getBooks } from "@/service/booksService";
import { useEffect, useRef, useState, useCallback } from "react";

export const useBooks = ({
  pageSize,
  category,
  search,
  orderField,
  orderDirection,
  coverResolution,
} = {}) => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  // 이전 요청 취소용
  const abortRef = useRef(null);

  const fetchBooks = useCallback(
    async (targetPage = 1, append = false) => {
      if (loading) return;

      // 이전 요청 취소
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        const { books: fetchedBooks, hasNext: nextHasNext } = await getBooks({
          page: targetPage,
          pageSize,
          category,
          search,
          orderField,
          orderDirection,
          coverResolution,
          signal: controller.signal,
        });

        setBooks((prev) =>
          append ? [...prev, ...fetchedBooks] : fetchedBooks
        );

        setHasNext(nextHasNext);
        setPage(targetPage);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    },
    [pageSize, category, search, orderField, orderDirection, coverResolution]
  );

  // 옵션(category, search 등)이 바뀌면 첫 페이지부터 다시 로딩
  useEffect(() => {
    fetchBooks(1, false);
  }, [pageSize, category, search, orderField, orderDirection, coverResolution]);


  const fetchMoreBooks = useCallback(() => {
    if (hasNext && !loading) {
      fetchBooks(page + 1, true);
    }
  }, [hasNext, loading, page, fetchBooks]);

  return {
    books,
    setBooks,
    fetchBooks,
    fetchMoreBooks,
    loading,
    hasNext,
    page,
  };
};
