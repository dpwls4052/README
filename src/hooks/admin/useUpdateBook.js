import { useState, useCallback } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase"; // firebase 설정을 불러오는 경로는 기존 코드와 동일하게 유지

/**
 * Firestore의 'books' 컬렉션에서 특정 도서를 수정하는 커스텀 훅
 * @returns {{
 * updateStock: (bookId: string, newStock: number) => Promise<void>,
 * loading: boolean,
 * error: Error | null
 * }}
 */
export const useUpdateBook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 특정 책을 업데이트하는 비동기 함수
   * @param {string} bookId - 업데이트할 책 ID
   * @param {object} updatedFields - 업데이트할 책 정보
   */
  const updateBook = useCallback(async (bookId, updatedFields) => {
    // 입력 유효성 검사
    if (!bookId) {
      setError(new Error("Book ID is required for update."));
      return;
    }
    if (!updatedFields.stock || updatedFields.stock < 0) {
      setError(
        new Error("Invalid stock value. Stock must be a non-negative number.")
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. 문서 참조 생성
      // doc(db, 컬렉션 이름, 문서 ID)
      const bookDocRef = doc(db, "books", bookId);

      // 2. 업데이트할 데이터 객체
      const updateData = {
        ...updatedFields,
        updatedAt: serverTimestamp(),
      };

      // 3. Firestore 문서 업데이트
      // updateDoc 함수를 사용하여 해당 문서의 필드만 부분적으로 수정
      await updateDoc(bookDocRef, updateData);
    } catch (err) {
      console.error("Error updating document:", err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateBook, loading, error };
};
