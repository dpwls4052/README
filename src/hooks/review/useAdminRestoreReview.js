"use client";

import { auth } from "@/lib/firebase";
import axios from "axios";
import { useState } from "react";

export default function useAdminRestoreReview() {
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState(null);

  const restoreReview = async (reviewId) => {
    if (!reviewId) {
      throw new Error("reviewId가 없습니다.");
    }

    try {
      setRestoring(true);
      setError(null);

      const idToken = await auth.currentUser.getIdToken();

      const { data } = await axios.patch(
        "/api/admin/reviews",
        {
          reviewId,
          status: true,
        },
        {
          headers: { "Authorization": `Bearer ${idToken}` },
        }
      );

      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "리뷰 복구 실패";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setRestoring(false);
    }
  };

  return { restoreReview, restoring, error };
}
