"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Navigation from "@/components/main/Navigation";
import { useRouter } from "next/navigation";
import BookListItem from "@/components/books/BookListItem";
import { useBooks } from "@/hooks/book/useBooks";

const CATEGORY_MAP = {
  domestic: { title: "국내도서", prefix: "국내도서" },
  foreign: { title: "해외도서", prefix: "외국도서" },
  season: { title: "계절도서", prefix: null }, //랜덤처리
  recommend: { title: "이달의 추천도서", prefix: null }, //랜덤처리
};

const BookList = () => {
  const router = useRouter();
  const goDetail = (id) => {
    router.push(`/product/detail/${id}`);
  };
  const { category } = useParams();
  const config = CATEGORY_MAP[category] ?? { title: "전체도서", prefix: null };

  const wantRandom = category === "recommend" || category === "season";

  const { books, fetchMoreBooks, loading, hasNext } = useBooks();

  const visibleBooks = useMemo(() => {
    let list = Array.isArray(books) ? books : [];

    // 접두사 필터 (prefix가 있을 때만)
    if (config.prefix) {
      list = list.filter((b) =>
        (b.categoryName ?? "").startsWith(config.prefix)
      );
    }

    if (!list.length) return [];

    if (wantRandom) {
      const pool = [...list];
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, 10);
    }

    return list;
  }, [books, config.prefix, wantRandom]);

  return (
    <>
      <Navigation />

      <div className="py-80 max-w-1200 mx-auto">
        <p className="text-2xl font-bold mb-10">{config.title}</p>

        {loading ? (
          <div className="flex justify-center items-center h-300">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {visibleBooks.map((book) => (
              <BookListItem
                key={book.id ?? book.bookId}
                book={book}
                goDetail={goDetail}
              />
            ))}
            {!wantRandom && hasNext && (
              <div className="p-20 text-center mt-20">
                <button
                  className="bg-[var(--main-color)] w-200 font-medium text-white p-16 rounded-sm hover:cursor-pointer"
                  onClick={() => fetchMoreBooks()}
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
};

export default BookList;
