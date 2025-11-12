"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function useSearchForm() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/books/search?q=${encodeURIComponent(q)}`);
  };

  return { query, setQuery, handleSearch };
}
