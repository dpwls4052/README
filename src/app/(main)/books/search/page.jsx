"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import Navigation from "@/components/main/Navigation";
import BookListItem from "@/components/books/BookListItem";
import { useBooks } from "@/hooks/book/useBooks";

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const { books, loading, fetchMoreBooks, hasNext } = useBooks({
    pageSize: 10,
    category: null,
    search: q,
    orderField: "title",
    orderDirection: "asc",
  });

  const filtered = useMemo(() => {
    if (!q) return [];
    const list = Array.isArray(books) ? books : [];
    return list.filter((b) => {
      const t = (b.title || "").toLowerCase();
      const a = (b.author || "").toLowerCase();
      return t.includes(q) || a.includes(q);
    });
  }, [books, q]);

  const goDetail = (id) => router.push(`/product/detail/${id}`);

  return (
    <>
      <Navigation />
      <div className="mx-auto py-80 max-w-1200">
        <p className="mb-10 text-2xl font-bold">
          검색 결과: <span className="text-(--main-color)">“{q}”</span>
        </p>

        {loading && filtered.length === 0 ? (
          <div className="flex items-center justify-center h-300">
            <p>Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-40 text-center text-gray-500">
            해당 검색어에 대한 결과가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((book) => (
              <BookListItem key={book.bookId} book={book} goDetail={goDetail} />
            ))}

            {/* 더보기 버튼 */}
            {hasNext && (
              <div className="p-20 mt-20 text-center">
                <button
                  className="bg-(--main-color) w-200 font-medium text-white p-16 rounded-sm hover:cursor-pointer"
                  onClick={fetchMoreBooks}
                >
                  더보기 +
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
