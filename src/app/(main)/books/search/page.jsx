"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import Navigation from "@/components/main/Navigation";
import { useBookList } from "@/hooks/common/useBookList";
import noimg from "@/assets/no_image.png";

export default function SearchResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  // Firestore의 prefix 검색 한계로 인해 클라이언트에서 필터링
  const { books, loading, fetchBooks, hasNext } = useBookList({
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
      <div className="py-80 max-w-1200 mx-auto">
        <p className="text-2xl font-bold mb-10">
          검색 결과: <span className="text-[var(--main-color)]">“{q}”</span>
        </p>

        {loading && filtered.length === 0 ? (
          <div className="flex justify-center items-center h-300">
            <p>Loading...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-40">
            해당 검색어에 대한 결과가 없습니다.
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map((book) => (
              <div
                key={book.id}
                className="flex w-full justify-between border-b border-solid border-[#ccc] py-8 gap-14"
              >
                <div
                  className="flex items-start gap-20 hover:cursor-pointer"
                  onClick={() => goDetail(book.id)}
                >
                  <Image
                    src={book.highResCover || book.cover || noimg}
                    alt={book.title || "제목 미상"}
                    width={160}
                    height={220}
                    className="w-140 h-200 object-cover rounded-md border border-gray-300"
                  />
                  <div className="flex flex-col items-start gap-6">
                    <p className="mt-3 font-bold text-lg line-clamp-2 max-w-700">
                      {book.title || "제목 미상"}
                    </p>
                    <div className="flex items-center gap-10">
                      <p className="text-sm font-bold text-gray-600 line-clamp-1 min-w-0">
                        {book.author || "저자 미상"}
                      </p>
                      <p className="text-sm font-bold text-gray-600 line-clamp-1 min-w-0">
                        {book.pubDate}
                      </p>
                    </div>
                    <p className="mt-1 text-lg font-bold">
                      {(book.priceStandard ?? 0).toLocaleString()}원
                    </p>
                  </div>
                </div>
                <div className="flex items-end flex-col justify-start gap-16">
                  <button aria-label="찜" className="p-2">
                    <IoIosHeartEmpty className="w-25 h-25 text-red-500" />
                  </button>
                  <div className="flex flex-col gap-10 w-200 h-100">
                    <button className="bg-[var(--sub-color)] font-medium flex-1 text-white rounded-sm">
                      장바구니
                    </button>
                    <button className="bg-[var(--main-color)] font-medium flex-1 text-white rounded-sm">
                      바로구매
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* 더보기 버튼 */}
            {(visibleCount < filtered.length || hasNext) && (
              <div className="p-20 text-center mt-20">
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
