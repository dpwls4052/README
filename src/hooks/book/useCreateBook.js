"use client";
import { createBook } from "@/service/booksService";

export const useCreateBook = () => {
  const addBook = async (bookList) => {
    try {
      await createBook(bookList);
      alert("등록 완료되었습니다.");
    } catch (err) {
      console.error(err);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return { addBook };
};
