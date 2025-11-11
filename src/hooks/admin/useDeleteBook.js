"use client";
import { useState, useCallback } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Firestore 'books' 컬렉션에서 특정 도서를 삭제하는 커스텀 훅
 * @returns {{
 *   deleteBook: (bookId: string) => Promise<void>,
 *   loading: boolean,
 *   error: Error | null
 * }}
 */
export const useDeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 특정 책을 삭제하는 비동기 함수
   * @param {string} bookId - 삭제할 책 ID
   */
  const deleteBook = useCallback(async (bookId) => {
    if (!bookId) {
      setError(new Error("Book ID is required for delete."));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. 문서 참조 생성
      // doc(db, 컬렉션 이름, 문서 ID)
      const bookDocRef = doc(db, "books", bookId);

      // 2. Firestore 문서 업데이트
      // deleteDoc 함수를 사용하여 해당 문서의 필드만 삭제
      await deleteDoc(bookDocRef);
    } catch (err) {
      console.error("Error deleting document:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteBook, loading, error };
};
