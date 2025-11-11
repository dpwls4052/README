import BookItem from "./BookItem";

const SearchSection = ({
  aladinBookList,
  hasNext,
  loadMore,
  handleAddBook,
}) => {
  return (
    <div className="w-full border border-(--main-color) rounded-md h-full flex flex-col">
      <p className="flex items-center justify-center h-40 text-center border-b border-black shrink-0">
        검색 결과
      </p>
      <ul className="flex flex-col w-full overflow-y-auto">
        {aladinBookList.map((book) => (
          <BookItem key={book.isbn} book={book}>
            <div className="text-end">
              <button
                onClick={() => handleAddBook(book)}
                className="bg-(--main-color) text-white py-10 px-16 rounded h-40 font-normal hover:cursor-pointer"
              >
                추가
              </button>
            </div>
          </BookItem>
        ))}
        {hasNext && (
          <div className="p-20 text-center">
            <button
              className="bg-(--main-color) rounded-full text-white px-16 py-10 hover:cursor-pointer text-14"
              onClick={loadMore}
            >
              더보기
            </button>
          </div>
        )}
      </ul>
    </div>
  );
};

export default SearchSection;
