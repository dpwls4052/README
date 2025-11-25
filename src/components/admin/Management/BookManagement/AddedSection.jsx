import QuantityStepper from "@/components/common/QuantityStepper";
import BookItem from "./BookItem";

const AddedSection = ({
  addedBookList,
  setAddedBookList,
  handleDeleteBook,
}) => {
  const handleStockChange = (isbn, newStock) => {
    setAddedBookList((prevList) =>
      prevList.map((book) =>
        book.isbn === isbn ? { ...book, stock: newStock } : book
      )
    );
  };
  return (
    <div className="w-full rounded-md h-full flex flex-col bg-(--bg-color) overflow-hidden">
      <p className="flex items-center justify-center h-40 text-center shrink-0 bg-(--sub-color) text-white font-normal">
        추가할 도서
      </p>
      <ul className="flex flex-col w-full h-full overflow-y-auto">
        {addedBookList.length === 0 && (
          <div className="flex items-center justify-center h-full">
            도서를 추가해보세요.
          </div>
        )}
        {addedBookList.map((book) => (
          <BookItem key={book.isbn} book={book}>
            <div className="flex items-center justify-end gap-10">
              <QuantityStepper
                value={book.stock}
                onChange={(newStock) => handleStockChange(book.isbn, newStock)}
              />
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
