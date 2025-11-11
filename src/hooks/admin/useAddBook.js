"use client";
import { useState, useCallback } from "react";
import { doc, serverTimestamp, addDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Firestore의 'books' 컬렉션에서 특정 도서를 저장하는 커스텀 훅
 * @returns {{
 * addBook: (book: object) => Promise<void>,
 * loading: boolean,
 * error: Error | null
 * }}
 */
export const useAddBook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 특정 책을 저장하는 비동기 함수
   * @param {object} addedBookList - 추가할 책 정보 배열
   */
  const addBook = useCallback(async (addedBookList) => {
    // 입력 유효성 검사
    if (!addedBookList.every((book) => book.stock >= 0)) {
      setError(
        new Error("Invalid stock value. Stock must be a non-negative number.")
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const batch = writeBatch(db);

      addedBookList.forEach((book) => {
        // 1. 문서 참조 생성
        // doc(db, 컬렉션 이름, 문서 ID)
        const bookRef = doc(db, "books", book.isbn);

        // 2. 추가할 데이터 객체
        const addedData = {
          ...book,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        batch.set(bookRef, addedData);
      });

      // 3. Firestore 문서 업데이트
      // batch.commit 함수를 사용하여 해당 문서 추가
      await batch.commit();
    } catch (err) {
      console.error("저장 실패:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { addBook, loading, error };
};
