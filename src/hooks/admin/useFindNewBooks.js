"use client";
import { useState } from "react";
import { fetchAladinBooks } from "@/service/aladin";

export const useFindNewBooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooks = async (query, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAladinBooks(query, page);
      return data;
    } catch (err) {
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, searchBooks };
};
