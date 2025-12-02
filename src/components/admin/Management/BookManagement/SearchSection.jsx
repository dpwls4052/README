import BookItem from "./BookItem";

const SearchSection = ({
  aladinBookList,
  hasNext,
  loadMore,
  handleAddBook,
  addedBookList,
}) => {
  return (
    <div className="w-full rounded-md h-full flex flex-col bg-(--bg-color) overflow-hidden">
      <p className="flex items-center justify-center h-40 text-center shrink-0 bg-(--sub-color) text-white font-normal">
        검색 결과
      </p>
      <ul className="flex flex-col w-full h-full overflow-y-auto">
        {aladinBookList.length === 0 && (
          <div className="flex items-center justify-center h-full">
            도서를 검색해보세요.
          </div>
        )}
        {aladinBookList.map((book, i) => (
          <BookItem key={`${i}-${book.isbn}`} book={book}>
            <div className="text-end">
              <button
                onClick={() => handleAddBook(book)}
                disabled={addedBookList.find(
                  (addedBook) => addedBook.isbn === book.isbn
                )}
                className="bg-(--main-color) text-white py-10 px-16 rounded h-40 font-normal hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
