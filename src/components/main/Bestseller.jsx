"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/common/useAuth";
import BestsellerItem from "./BestsellerItem";
import BestsellerItemSkeleton from "./BestsellerItemSkeleton";

const Bestseller = () => {
  const { userId } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 베스트셀러 데이터 가져오기
  useEffect(() => {
    const fetchBestsellers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/books/bestseller?limit=8");
        const data = await res.json();

        if (res.ok) {
          const mappedBooks = data.map((book) => ({
            id: book.book_id,
            bookId: book.book_id,
            title: book.title,
            author: book.author,
            publisher: book.publisher,
            priceStandard: book.price_standard,
            cover: book.cover,
            highResCover: book.cover?.replace(/coversum/gi, "cover500"),
            stock: book.stock,
            salesCount: book.sales_count,
          }));
          setBooks(mappedBooks);
        } else {
          console.error("Failed to fetch bestsellers:", data);
        }
      } catch (err) {
        console.error("Bestseller fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBestsellers();
  }, []);

  return (
    <div className="w-full p-0 mx-auto text-center my-100 max-w-1200">
      <p className="font-semibold text-32">베스트셀러</p>

      <div className="grid w-full grid-cols-1 gap-40 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-80">
        {loading ? (
          Array.from({ length: 8 }, (_, i) => (
            <BestsellerItemSkeleton key={i} />
          ))
        ) : (
          <>
            {books.map((book) => (
              <BestsellerItem key={book.id} book={book} userId={userId} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Bestseller;
