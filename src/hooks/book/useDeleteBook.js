import { deleteBook } from "@/service/booksService";

export const useDeleteBook = () => {
  const removeBook = async (bookId) => {
    try {
      const { book } = await deleteBook(bookId);
      return book;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { removeBook };
};
