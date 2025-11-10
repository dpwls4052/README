import { useState, useCallback } from "react";

const API_KEY = import.meta.env.ALADIN_KEY;

export const useBookSearch = ({ pageSize = 20 } = {}) => {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasNext, setHasNext] = useState(true);

    const searchBooks = useCallback(
        async (keyword, reset = false) => {
        if (loading) return;
        setLoading(true);

        try {
            // reset 시 페이지 초기화
            const nextPage = reset ? 1 : page;

            const url = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?TTBKey=${API_KEY}&Query=${encodeURIComponent(
            keyword
            )}&QueryType=Title&MaxResults=${pageSize}&start=${nextPage}&SearchTarget=Book&output=js`;

            const res = await fetch(url);
            const data = await res.json();

            const items = data.item || [];

            // 다음 페이지 있는지 체크
            setHasNext(items.length === pageSize);

            // 상태 업데이트
            if (reset) {
            setBooks(items);
            } else {
            setBooks((prev) => [...prev, ...items]);
            }

            setPage((prev) => prev + 1);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
        },
        [page, pageSize, loading]
    );

    return {
        books,
        searchBooks,
        loading,
        hasNext,
        reset: () => {
        setBooks([]);
        setPage(1);
        setHasNext(true);
        },
    };
};
