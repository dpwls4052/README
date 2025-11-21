"use client";
import { getCategories } from "@/service/categoriesService";
import { useEffect, useState } from "react";

export const useCategories = ({ mainCategory = "국내도서" } = {}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);

      try {
        const fetchedCategories = await getCategories({ mainCategory });
        setCategories(fetchedCategories);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [mainCategory]);

  return {
    categories,
    loading,
    error,
  };
};
