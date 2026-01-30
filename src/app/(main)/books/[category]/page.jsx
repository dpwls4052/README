"use client";

import { useParams } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import Navigation from "@/components/main/Navigation";
import { useRouter } from "next/navigation";
import BookListItem from "@/components/books/BookListItem";
import { useBooks } from "@/hooks/book/useBooks";
import { useCategories } from "@/hooks/book/useCategories";
import BookListItemSkeleton from "@/components/books/BookListItemSkeleton";
import { useRandomBooks } from "@/hooks/book/useRandomBooks";

const CATEGORY_MAP = {
  domestic: { title: "국내도서", prefix: "국내도서", id: 1 },
  foreign: { title: "해외도서", prefix: "외국도서", id: 93 },
  season: { title: "계절도서", prefix: null, id: null },
  recommend: { title: "이달의 추천도서", prefix: null, id: null },
};

const BookList = () => {
  const router = useRouter();
  const goDetail = (id) => {
    router.push(`/product/detail/${id}`);
  };

  const { category } = useParams();
  const config = CATEGORY_MAP[category] ?? {
    title: "전체도서",
    prefix: null,
    id: null,
  };

  const wantRandom = category === "recommend" || category === "season";

  // 선택된 하위 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  // 카테고리 변경 시 선택 초기화
  useEffect(() => {
    setSelectedCategory(null);
    setHasFetched(false);
  }, [category]);

  // rootCategory(prefix)가 있을 때 하위 카테고리 목록 조회
  const { categories } = useCategories({ rootCategory: config.prefix });

  // "기타" 카테고리 여부 확인용 - 모든 2depth 카테고리 이름 배열
  const allSubCategoryNames = useMemo(() => {
    return categories.map((c) => c.name);
  }, [categories]);

  // useBooks에 전달할 category 배열 생성
  const categoryArray = useMemo(() => {
    // 랜덤 카테고리(추천/계절)면 null -> 전체 도서 조회
    if (wantRandom) return null;

    // prefix가 없으면 null
    if (!config.prefix) return null;

    // "기타" 선택 시 - root만 전달하고, 필터링은 컴포넌트에서 처리
    if (selectedCategory === "기타") {
      return [config.prefix];
    }

    // 하위 카테고리가 선택되지 않았으면 root만
    if (!selectedCategory) {
      return [config.prefix];
    }

    // root + 선택된 하위 카테고리
    return [config.prefix, selectedCategory];
  }, [selectedCategory, wantRandom, config.prefix]);

  // console.log("Current category array:", categoryArray);
  // console.log("All sub category names:", allSubCategoryNames);

  // 카테고리 기반 책 조회
  const {
    books: normalBooks,
    fetchMoreBooks,
    loading: normalLoading,
    hasNext,
  } = useBooks({
    category: categoryArray,
  });

  const {
    books: randomBooks,
    loading: randomLoading,
    error: randomError,
  } = useRandomBooks({
    enabled: wantRandom, // 추천/계절 페이지일 때만 호출
    type: category, // "recommend" | "season" (추후 확장용)
  });

  //  화면에서 사용할 loading / books는 모드에 따라 선택
  const loading = wantRandom ? randomLoading : normalLoading;
  const books = wantRandom ? randomBooks : normalBooks;

  // books 로딩 상태 변할 때
  useEffect(() => {
    if (!normalLoading) {
      setHasFetched(true);
    }
  }, [normalLoading]);
  // "기타" 선택 시 필터링 + 랜덤 처리
  const displayBooks = useMemo(() => {
    let result = books;

    // "기타" 선택 시: 18개 카테고리에 속하지 않은 책들만 필터링
    if (!wantRandom && selectedCategory === "기타") {
      result = books.filter((book) => {
        const bookCategories = book.category || [];

        // book.category 배열에서 name 추출
        const bookCategoryNames = bookCategories.map((cat) => cat.name);

        // 18개 카테고리 중 하나라도 포함되어 있으면 제외
        const hasDefinedCategory = bookCategoryNames.some((name) =>
          allSubCategoryNames.includes(name)
        );

        // 18개 카테고리에 속하지 않으면 기타에 포함
        return !hasDefinedCategory;
      });

      // console.log(`'기타' 카테고리: ${result.length}개 책 표시`);
    }

    //  추천/계절(wantRandom)은 이미 서버에서 랜덤 10개만 받았으므로 그대로 반환
    return result;
  }, [books, selectedCategory, allSubCategoryNames, wantRandom]);

  return (
    <div className="w-full px-20 mx-auto max-w-1200">
      <Navigation />

      <div className="py-40 mx-auto">
        <p className="mb-10 text-2xl font-bold">{config.title}</p>

        {/* 하위 카테고리 선택 UI */}
        {!wantRandom && categories.length > 0 && (
          <div className="flex flex-wrap gap-12 mb-20">
            {/* 전체 버튼 추가 */}
            <button
              className={`px-12 py-6 border rounded 
                ${
                  selectedCategory === null
                    ? "bg-(--main-color) text-white"
                    : "hover:bg-gray-100"
                }`}
              onClick={() => setSelectedCategory(null)}
            >
              전체
            </button>

            {categories.map((c) => (
              <button
                key={c.category_id}
                className={`px-12 py-6 border rounded 
                  ${
                    selectedCategory === c.name
                      ? "bg-(--main-color) text-white"
                      : "hover:bg-gray-100"
                  }`}
                onClick={() => setSelectedCategory(c.name)}
              >
                {c.name}
              </button>
            ))}

            {/* 기타 버튼 추가 */}
            {/* <button
              className={`px-12 py-6 border rounded 
                ${selectedCategory === "기타" ? "bg-[var(--main-color)] text-white" : "hover:bg-gray-100"}`}
              onClick={() => setSelectedCategory("기타")}
            >
              기타
            </button> */}
          </div>
        )}

        {loading && displayBooks.length === 0 ? (
          // 첫 로딩 때: 스켈레톤 5개 정도 보여주기
          <div className="flex flex-col gap-4">
            {Array.from({ length: 10 }, (_, i) => (
              <BookListItemSkeleton key={i} />
            ))}
          </div>
        ) : !loading && hasFetched && displayBooks.length === 0 ? (
          // 로딩 끝났는데 도서가 없을 때
          <div className="flex items-center justify-center h-300">
            <p className="text-gray-500">해당 카테고리에 도서가 없습니다.</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {displayBooks.map((book) => (
              <BookListItem
                key={book.id ?? book.bookId}
                book={book}
                goDetail={() => goDetail(book.bookId)}
              />
            ))}

            {!wantRandom && hasNext && (
              <div className="p-20 mt-20 text-center">
                <button
                  className="bg-(--main-color) w-200 font-medium text-white p-16 rounded-sm hover:cursor-pointer hover:opacity-90 disabled:bg-gray-400"
                  onClick={fetchMoreBooks}
                  disabled={normalLoading}
                >
                  {loading ? "로딩 중..." : "더보기 +"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;
