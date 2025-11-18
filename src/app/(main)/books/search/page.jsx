"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Navigation from "@/components/main/Navigation";
import BookListItem from "@/components/books/BookListItem";
import { useBooks } from "@/hooks/book/useBooks";

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  // Firestore의 prefix 검색 한계로 인해 클라이언트에서 필터링
  const { books, loading, fetchBooks, hasNext } = useBooks({
    pageSize: 50, // 넉넉히
    category: null,
    search: null, // ✅ 추가: 서버에서 prefix 검색
    orderField: "title", // ✅ 검색 시 정렬 기준 통일
    orderDirection: "desc",
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

  const [visibleCount, setVisibleCount] = useState(10);
  const visibleBooks = filtered.slice(0, visibleCount);

  const goDetail = (id) => router.push(`/product/detail/${id}`);

  const handleLoadMore = () => {
    if (visibleCount < filtered.length) {
      setVisibleCount((prev) => prev + 10);
    } else if (hasNext) {
      // 이미 불러온 것 다 봤고 서버에 더 있을 때 → Firestore에서 추가 로드
      fetchBooks();
    }
  };

  return (
    <>
      <Navigation />
      <div className="mx-auto py-80 max-w-1200">
        <p className="mb-10 text-2xl font-bold">
          검색 결과: <span className="text-[var(--main-color)]">“{q}”</span>
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
              <BookListItem key={book.id} book={book} goDetail={goDetail} />
            ))}

            {/* 더보기 버튼 */}
            {(visibleCount < filtered.length || hasNext) && (
              <div className="p-20 mt-20 text-center">
                <button
                  className="bg-[var(--main-color)] w-200 font-medium text-white p-16 rounded-sm hover:cursor-pointer"
                  onClick={() => fetchBooks()}
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
