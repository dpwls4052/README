"use client";
import { getBooks } from "@/service/booksService";
import { useEffect, useState } from "react";

export const useBooks = () => {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async (targetPage = 1, append = false) => {
    if (loading) return;

    setLoading(true);
    try {
      const { books: fetchedBooks, hasNext: nextHasNext } = await getBooks({
        page: targetPage,
      });

      setBooks((prev) => (append ? [...prev, ...fetchedBooks] : fetchedBooks));
      setHasNext(nextHasNext);
      setPage(targetPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchBooks(1, false);
  }, []);

  // 다음 페이지 불러오기
  const fetchMoreBooks = () => {
    if (hasNext) fetchBooks(page + 1, true);
  };

  return { books, fetchBooks, fetchMoreBooks, loading, hasNext };
};
