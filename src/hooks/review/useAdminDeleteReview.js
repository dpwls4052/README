"use client";

import { auth } from "@/lib/firebase";
import axios from "axios";
import { useState } from "react";

export default function useAdminDeleteReview() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const deleteReview = async (reviewId) => {
    const idToken = await auth.currentUser.getIdToken();
    if (!reviewId) {
      throw new Error("reviewId가 없습니다.");
    }

    try {
      setDeleting(true);
      setError(null);

      const res = await axios.patch(
        "/api/admin/reviews",
        {
          reviewId,
          status: false,
        },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "리뷰 삭제 실패";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  return { deleteReview, deleting, error };
}
