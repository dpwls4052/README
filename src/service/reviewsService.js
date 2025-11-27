import { auth } from "@/lib/firebase";
import axios from "axios";

export const getAdminReviews = async ({
  page = 1,
  pageSize = 10,
  userEmail,
  bookId,
  minRating,
  maxRating,
  orderField = "created_at",
  orderDirection = "desc",
} = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    orderField,
    orderDirection,
  });

  if (userEmail) params.append("userEmail", userEmail.toString());
  if (bookId) params.append("bookId", bookId.toString());
  if (minRating) params.append("minRating", minRating.toString());
  if (maxRating) params.append("maxRating", maxRating.toString());

  const idToken = await auth.currentUser.getIdToken();

  const response = await axios.get(`/api/admin/reviews?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${idToken}`,
    },
  });

  return response.data;
};
