"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useBookList } from "@/hooks/common/useBookList";
import { useMemo } from "react";
import { IoIosHeartEmpty } from "react-icons/io";
import Navigation from "@/components/main/Navigation";
import { useRouter } from "next/navigation";

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

  const { books, loading, fetchBooks, hasNext } = useBookList({
    pageSize: 10,
    category: null,
    orderField: wantRandom ? "createdAt" : "salesCount",
    orderDirection: "desc",
  });

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
              <div
                key={book.id}
                className="py-20 flex w-full justify-between border-b border-solid border-[#ccc] py-8 gap-14"
              >
                <div
                  className="flex items-start gap-20 hover:cursor-pointer"
                  onClick={() => goDetail(book.id)}
                >
                  <Image
                    src={book.cover || "/no-image.png"}
                    alt={book.title || "제목 미상"}
                    width={160}
                    height={220}
                    className="rounded-md w-140 h-200 object-cover border border-solid border-[#eee]"
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
                    <button
                      className="bg-[var(--sub-color)] font-medium flex-1 text-white rounded-sm"
                      // onClick={() => setOpenCart(true)} // ← 클릭 시 열기
                    >
                      장바구니
                    </button>

                    <button
                      className="bg-[var(--main-color)] font-medium flex-1 text-white rounded-sm"
                      // onClick={handleBuyNow}
                    >
                      바로구매
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {hasNext && (
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
};

export default BookList;
