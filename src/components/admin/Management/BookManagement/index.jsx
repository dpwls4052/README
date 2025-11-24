import EditBookModal from "./EditBookModal";
import Image from "next/image";
import DeleteBookModal from "./DeleteBookModal";
import AddBookModal from "./AddBookModal";
import { useBooks } from "@/hooks/book/useBooks";
import { useDeleteBook } from "@/hooks/book/useDeleteBook";
import { useUpdateBook } from "@/hooks/book/useUpdateBook";

const BookManagement = () => {
  const { books, fetchBooks, fetchMoreBooks, loading, hasNext, setBooks } =
    useBooks();

  const { changeBook } = useUpdateBook();
  const handleUpdateBook = async (bookId, updatedFields) => {
    const changedBook = await changeBook(bookId, updatedFields);
    setBooks((prev) =>
      prev.map((book) =>
        book.bookId === changedBook.bookId ? changedBook : book
      )
    );
  };

  const { removeBook } = useDeleteBook();
  const handleDeleteBook = async (bookId) => {
    const removedBook = await removeBook(bookId);
    setBooks((prev) =>
      prev.filter((book) => book.bookId !== removedBook.bookId)
    );
  };

  return (
    <section className="flex flex-col w-full h-full gap-20">
      <div className="flex items-center justify-between">
        <h1 className="text-32 text-(--main-color)">도서 관리</h1>
        <AddBookModal fetchBooks={fetchBooks} />
      </div>
      <article className="flex-1 rounded-xl bg-(--bg-color) overflow-y-scroll scrollbar-hide">
        <div className="pe-3">
          {books.map((book) => (
            <div
              key={book.bookId}
              className="flex items-center justify-between gap-10 px-20 py-10 border-b h-120 border-b-gray-200"
            >
              <Image
                src={book.cover || "/no-image.png"}
                alt={book.title}
                width={62.5}
                height={100}
                className="rounded-md shrink-0"
              />
              <div className="flex-1">
                <p className="font-semibold line-clamp-2 leading-24">
                  {book.title}
                </p>
                <p className="line-clamp-2 text-14">{book.author}</p>
              </div>
              <div className="flex items-center gap-10 shrink-0">
                <p className="text-14">재고 : {book.stock}</p>
                <DeleteBookModal
                  book={book}
                  handleDeleteBook={handleDeleteBook}
                />
                <EditBookModal
                  book={book}
                  handleUpdateBook={handleUpdateBook}
                />
              </div>
            </div>
          ))}
          {hasNext && (
            <div className="p-20 text-center">
              <button
                className="bg-(--main-color) rounded-full text-white px-16 py-10 hover:cursor-pointer text-14"
                onClick={fetchMoreBooks}
              >
                더보기
              </button>
            </div>
          )}
        </div>
      </article>
    </section>
  );
};

export default BookManagement;
