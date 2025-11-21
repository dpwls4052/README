"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import Navigation from "@/components/main/Navigation";
import { useRouter } from "next/navigation";
import BookListItem from "@/components/books/BookListItem";
import { useBooks } from "@/hooks/book/useBooks";
import { useCategories } from "@/hooks/book/useCategories";

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

  // TODO 국내/해외 도서와 계절/이달의추천 도서는 결이 약간 달라서 분리 시키는 것이 좋을 것 같습니다.
  // 국내/해외 도서는 아래 카테고리가 있지만, 나머지 두 항목에 대해서는 카테고리가 필요 없기 때문입니다.
  // 또한 books/[category]로 경로를 잡으셨는데, 그렇게 되면 카테고리의 의미가 헷갈리게 됩니다.
  // 국내 도서, 해외 도서 -> books/[rootCategory]
  // 게절 도서, 이달의 도서 -> books/[event]
  // 정도로 분리하면 좋을 것 같습니다.

  const { categories } = useCategories({ rootCategory: config.prefix });
  console.log(categories);
  // TODO 현재 useCategories 내부에 rootCategory 값을 주면서 해당 값의 하위에 위치한 카테고리 목록을 가져옵니다.
  // rootCategory : "국내도서"라면 "국내도서"에 속한 카테고리들을 배열 형태로 가져옵니다.
  // 개발자 도구에서 배열을 확인할 수 있습니다.
  // ex)
  // [
  //   {category_id: 41, name: '경제경영', parent_id: 1, depth: 2}
  //   {category_id: 7, name: '과학', parent_id: 1, depth: 2}
  //   ...
  // ]
  // 이 name들을 화면에 선택할 수 있게 보여주면 될 것 같습니다.
  // 물론 사용자가 "국내 도서"에 들어오게되면 가장 첫 카테고리를 디폴트로 선택하면 될 것 같습니다.
  // 단순 [국내도서]가 아닌 [국내도서 > 경제경영]과 같은 식으로 데이터를 가져오게 됩니다.

  const { books, fetchMoreBooks, loading, hasNext } = useBooks({
    category: !wantRandom ? [config.prefix] : null,
  });
  // TODO 지금 현재 카테고리 선택 nav를 만들지 않아서 category 인자에 ["국내도서"]만 준 상황입니다.
  // 이제 이 값을 ["국내도서", "${선택된 카테고리}"]라고 전달하면 해당 카테고리에 있는 도서만 books에 담기게 됩니다.
  // visibleBooks가 필요 없어집니다.

  // const visibleBooks = useMemo(() => {
  //   let list = Array.isArray(books) ? books : [];

  //   // 접두사 필터 (prefix가 있을 때만)
  //   if (config.prefix) {
  //     list = list.filter((b) =>
  //       (b.categoryName ?? "").startsWith(config.prefix)
  //     );
  //   }

  //   if (!list.length) return [];

  //   if (wantRandom) {
  //     const pool = [...list];
  //     for (let i = pool.length - 1; i > 0; i--) {
  //       const j = Math.floor(Math.random() * (i + 1));
  //       [pool[i], pool[j]] = [pool[j], pool[i]];
  //     }
  //     return pool.slice(0, 10);
  //   }

  //   return list;
  // }, [books, config.prefix, wantRandom]);

  return (
    <>
      <Navigation />

      <div className="mx-auto py-80 max-w-1200">
        <p className="mb-10 text-2xl font-bold">{config.title}</p>

        {loading ? (
          <div className="flex items-center justify-center h-300">
            <p>Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {books.map((book) => (
              <BookListItem
                key={book.id ?? book.bookId}
                book={book}
                goDetail={() => goDetail(book.bookId)}
              />
            ))}
            {!wantRandom && hasNext && (
              <div className="p-20 mt-20 text-center">
                <button
                  className="bg-(--main-color) w-200 font-medium text-white p-16 rounded-sm hover:cursor-pointer"
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
