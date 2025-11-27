import { auth } from "@/lib/firebase";
import axios from "axios";

export async function getBook(id) {
  const res = await axios.get(`/api/books/${id}`);
  return res.data;
}

export async function getBooks({
  page = 1,
  pageSize,
  category, // ["국내도서", "소설"] 형태의 배열
  search,
  orderField,
  orderDirection,
} = {}) {
  const params = { page };

  if (pageSize) params.pageSize = pageSize;
  if (category) params.category = JSON.stringify(category);
  if (search) params.search = search;
  if (orderField) params.orderField = orderField;
  if (orderDirection) params.orderDirection = orderDirection;

  const res = await axios.get("/api/books", { params });

  return res.data;
}

export async function createBook(books) {
  const idToken = await auth.currentUser.getIdToken();

  try {
    const res = await axios.post("/api/books", books, {
      headers: {
        "Authorization": `Bearer ${idToken}`,
      },
    });

    return res.data;
  } catch (error) {
    const err = error.response?.data;

    const customError = new Error(err?.error || "책 등록 실패");
    customError.message = err?.message || "UNKNOWN_ERROR";
    throw customError;
  }
}

export async function updateBook(bookId, updatedData) {
  if (!bookId) throw new Error("bookId가 필요합니다.");

  const idToken = await auth.currentUser.getIdToken();

  try {
    const res = await axios.patch(`/api/books/${bookId}`, updatedData, {
      headers: {
        "Authorization": `Bearer ${idToken}`,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "책 편집 실패");
  }
}

export const deleteBook = async (bookId) => {
  return updateBook(bookId, { stock: 0 });
};
