// src/hooks/book/useRandomBooks.js
"use client";

import { useEffect, useState } from "react";

/**
 * 추천/계절 도서용 훅
 *
 * 예)
 *   useRandomBooks({ enabled: true, type: "recommend" })
 *   useRandomBooks({ enabled: true, type: "season" })
 *
 * - /api/books/random?type=... 을 호출해서
 *   서버에서 잘라준 10권을 그대로 받는다.
 */
export function useRandomBooks({ enabled = true, type } = {}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;

    const fetchRandomBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (type) {
          params.set("type", type); // recommend | season
        }

        const res = await fetch(`/api/books/random?${params.toString()}`);

        if (!res.ok) {
          const text = await res.text();
          console.error("Random books API response:", res.status, text);
          throw new Error("추천/계절 도서 조회에 실패했습니다.");
        }

        const data = await res.json();
        setBooks(data.books || []);
      } catch (err) {
        console.error("useRandomBooks error:", err);
        setError(err.message ?? "추천/계절 도서 조회 중 오류가 발생했습니다.");
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomBooks();
  }, [enabled, type]);

  return { books, loading, error };
}
