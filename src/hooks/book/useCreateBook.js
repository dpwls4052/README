"use client";
import { createBook } from "@/service/booksService";

export const useCreateBook = () => {
  const addBook = async (bookList) => {
    try {
      await createBook(bookList);
      alert("등록 완료되었습니다.");
    } catch (err) {
      if (err.message === "NO_BOOK_LIST") {
        alert("추가된 책이 없습니다.");
      } else if (err.messgae === "NO_TITLE") {
        alert("제목이 없는 책이 있습니다.");
      } else {
        console.error(err);
        alert("등록 중 오류가 발생했습니다.");
      }
    }
  };

  return { addBook };
};
