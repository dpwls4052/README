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
  const res = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(books),
  });

  if (!res.ok) {
    const err = await res.json();

    const error = new Error(err.error || "책 등록 실패");
    error.message = err.message || "UNKNOWN_ERROR";
    throw error;
  }
}

export async function updateBook(bookId, updatedData) {
  if (!bookId) throw new Error("bookId가 필요합니다.");

  const res = await fetch(`/api/books/${bookId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "책 편집 실패");
  }

  return await res.json();
}

export const deleteBook = async (bookId) => {
  return updateBook(bookId, { stock: 0 });
};
