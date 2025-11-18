// services/booksService.ts

export async function getBooks({ page = 1, category, keyword }) {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  if (category) params.append("category", category);
  if (keyword) params.append("keyword", keyword);

  const res = await fetch(`/api/books?${params.toString()}`, {
    method: "GET",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "책 목록 조회 실패");
  }

  const data = await res.json();
  return data;
}

export async function createBook(books) {
  const res = await fetch("/api/books", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(books),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "책 등록 실패");
  }
}

export async function updateBook(bookId, updatedData) {
  if (!bookId) throw new Error("bookId가 필요합니다.");

  const res = await fetch(`/api/books/${bookId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "책 편집 실패");
  }

  return await res.json();
}
