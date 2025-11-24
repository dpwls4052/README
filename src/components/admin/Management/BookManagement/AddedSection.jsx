import BookItem from "./BookItem";

const AddedSection = ({ addedBookList, handleDeleteBook }) => {
  return (
    <div className="w-full border border-(--main-color) rounded-md h-full flex flex-col">
      <p className="flex items-center justify-center h-40 text-center border-b border-black shrink-0">
        추가할 도서
      </p>
      <ul className="flex flex-col w-full overflow-y-auto">
        {addedBookList.map((book) => (
          <BookItem key={book.isbn} book={book}>
            <div className="flex items-center justify-end gap-10">
              <p className="text-14">재고</p>
              <p>1</p>
              <button
                onClick={() => handleDeleteBook(book)}
                className="bg-(--sub-color) text-white py-10 px-16 rounded h-40 font-normal hover:cursor-pointer"
              >
                제거
              </button>
            </div>
          </BookItem>
        ))}
      </ul>
    </div>
  );
};

export default AddedSection;
