import axios from "axios";

export const getAdminReviews = async ({
  page = 1,
  pageSize = 10,
  bookId,
  userId,
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

  if (bookId) params.append("bookId", bookId.toString());
  if (userId) params.append("userId", userId.toString());
  if (minRating) params.append("minRating", minRating.toString());
  if (maxRating) params.append("maxRating", maxRating.toString());

  const response = await axios.get(`/api/admin/reviews?${params.toString()}`);

  return response.data;
};
