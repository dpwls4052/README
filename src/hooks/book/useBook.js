"use client";
import { getBook } from "@/service/booksService";
import { useEffect, useRef, useState, useCallback } from "react";

export const useBook = (id) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBook = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const { book: fetchedBook } = await getBook(id);
      setBook(fetchedBook);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBook();
  }, [fetchBook]);

  return {
    book,
    setBook,
    loading,
    error,
    fetchBook,
  };
};
