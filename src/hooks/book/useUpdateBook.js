import { updateBook } from "@/service/booksService";

export const useUpdateBook = () => {
  const changeBook = async (bookId, updatedFields) => {
    try {
      const { book } = await updateBook(bookId, updatedFields);
      return book;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { changeBook };
};
