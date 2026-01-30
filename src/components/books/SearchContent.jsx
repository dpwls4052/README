"use client";

import { useSearchParams, useRouter } from "next/navigation";
import BookListItem from "@/components/books/BookListItem";
import { useBooks } from "@/hooks/book/useBooks";
import { useWishlistAll } from "@/hooks/common/useWishlistAll";

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const { books, loading, fetchMoreBooks, hasNext } = useBooks({
    pageSize: 10,
    category: null,
    search: q || null,
    orderField: "title",
    orderDirection: "asc",
  });

  const goDetail = (id) => {
    router.push(`/product/detail/${id}`);
  };

  const hasResult = Array.isArray(books) && books.length > 0;

  const { books: allWishlists } = useWishlistAll();

  return (
    <div className="max-w-full px-4 py-8 mx-auto md:py-16 lg:py-80 md:px-6 lg:px-8 lg:max-w-1200">
      <p className="mb-6 text-xl font-bold md:mb-8 lg:mb-10 md:text-2xl">
        검색 결과: <span className="text-(--main-color)">"{q}"</span>
      </p>

      {loading && !hasResult ? (
        <div className="flex items-center justify-center h-[200px] md:h-[250px] lg:h-300">
          <p className="text-base md:text-lg">Loading...</p>
        </div>
      ) : !hasResult ? (
        <div className="py-10 text-sm text-center text-gray-500 md:py-20 lg:py-40 md:text-base">
          해당 검색어에 대한 결과가 없습니다.
        </div>
      ) : (
        <div className="flex flex-col">
          {books.map((book) => (
            <BookListItem
              key={book.bookId}
              book={book}
              goDetail={goDetail}
              wishlist={allWishlists?.includes(book.bookId)}
            />
          ))}

          {hasNext && (
            <div className="p-4 mt-6 text-center md:p-8 lg:p-20 md:mt-12 lg:mt-20">
              <button
                className="bg-(--main-color) w-full max-w-[200px] md:w-200 font-medium text-white p-3 md:p-4 lg:p-16 rounded-sm hover:cursor-pointer text-sm md:text-base"
                onClick={fetchMoreBooks}
              >
                더보기 +
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
