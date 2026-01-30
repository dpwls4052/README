"use client";
import { auth } from "@/lib/firebase";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export const useWishlistAll = () => {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchAllWishlist = useCallback(async () => {
    try {
      if (!user) return {};
      setLoading(true);
      setError(null);
      const idToken = await auth.currentUser.getIdToken();
      const res = await fetch(`/api/user/wishlist/all`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      setBooks([...data.map(Number)]);
      if (!res.ok) {
        console.error("Wishlist status check error:", data);
        setError(data);
      }
    } catch (err) {
      console.error("Wishlist status check failed:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAllWishlist();
  }, [fetchAllWishlist]);

  return { books, loading, error };
};
