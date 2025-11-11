import { useBookList } from "@/hooks/common/useBookList";
import EditBookModal from "../EditBookModal";
import { useUpdateBook } from "@/hooks/admin/useUpdateBook";
import { useDeleteBook } from "@/hooks/admin/useDeleteBook";
import Image from "next/image";
import DeleteBookModal from "../DeleteBookModal";

const BookManagement = () => {
  const { books, fetchBooks, hasNext, setBooks } = useBookList({
    pageSize: 20,
  });
  const {
    updateBook,
    loading: updateLoading,
    error: updateError,
  } = useUpdateBook();
  const {
    deleteBook,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteBook();

  const handleUpdateBook = (bookId, updatedFields) => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, ...updatedFields } : book
      )
    );
    updateBook(bookId, updatedFields);
  };
  const handleDeleteBook = (bookId) => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId));
    deleteBook(bookId);
  };

  return (
    <section className="flex flex-col w-full h-full gap-20">
      <h1 className="text-32 text-(--main-color)">도서 관리</h1>
      <article className="flex-1 rounded-xl bg-(--bg-color) overflow-y-scroll scrollbar-hide">
        <div className="pe-3">
          {books.map((book) => (
            <div
              key={book.id}
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
                onClick={() => fetchBooks()}
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
