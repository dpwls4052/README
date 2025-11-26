import { useAdminReviews } from "@/hooks/review/useAdminReviews";
import ReviewItem from "./ReviewItem";
import { useEffect, useState } from "react";
import useDeleteReview from "@/hooks/review/useDeleteReview";
import useRestoreReview from "@/hooks/review/useRestoreReview";

const sorting = [
  { label: "최신순", orderField: "created_at", orderDirection: "desc" },
  { label: "오래된순", orderField: "created_at", orderDirection: "asc" },
  { label: "별점높은순", orderField: "rate", orderDirection: "desc" },
  { label: "별점낮은순", orderField: "rate", orderDirection: "asc" },
];

const ReviewManagement = () => {
  const [userEmail, setUserEmail] = useState("");
  const [bookId, setBookId] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    userEmail: undefined,
    bookId: undefined,
    orderField: "created_at",
    orderDirection: "desc",
  });
  const {
    reviews,
    setReviews,
    fetchReviews,
    fetchMoreReviews,
    loading,
    hasNext,
  } = useAdminReviews(appliedFilters);

  const handleReviewSearch = () => {
    setAppliedFilters({
      ...appliedFilters,
      userEmail,
      bookId,
    });
  };
  const handleReset = () => {
    setAppliedFilters({
      userEmail: undefined,
      bookId: undefined,
      orderField: "created_at",
      orderDirection: "desc",
    });
    setUserEmail("");
    setBookId("");
  };
  const handleSorting = (e) => {
    const selectedSort = sorting[e.target.value];
    setAppliedFilters({
      ...appliedFilters,
      orderField: selectedSort.orderField,
      orderDirection: selectedSort.orderDirection,
    });
  };
  const { deleteReview } = useDeleteReview();
  const handleDelete = async (reviewId) => {
    const data = await deleteReview(reviewId);
    setReviews((reviews) =>
      reviews.map((r) =>
        r.reviewId === data.review_id ? { ...r, status: false } : r
      )
    );
  };
  const { restoreReview } = useRestoreReview();
  const handleRestore = async (reviewId) => {
    const data = await restoreReview(reviewId);
    setReviews((reviews) =>
      reviews.map((r) =>
        r.reviewId === data.review_id ? { ...r, status: true } : r
      )
    );
  };

  return (
    <section className="flex flex-col w-full h-full gap-20 ">
      <div className="flex items-center justify-between h-40">
        <h1 className="text-32 text-(--main-color)">리뷰 관리</h1>
      </div>
      <div className="overflow-y-auto bg-(--bg-color) scrollbar-hide rounded-lg flex-1">
        <div className="flex items-start justify-between p-20">
          <div className="flex flex-wrap gap-10">
            <input
              type="text"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="사용자 이메일을 입력하세요."
              className="px-10 py-20 border border-black rounded-full h-30 w-250"
            />
            <input
              type="text"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              placeholder="도서 ID를 입력하세요."
              className="px-10 py-20 border border-black rounded-full h-30 w-200"
            />
            <div className="flex gap-10">
              <button
                onClick={handleReviewSearch}
                className="bg-(--main-color) rounded-full text-white w-80 py-10 hover:cursor-pointer text-14"
              >
                검색
              </button>
              <button
                onClick={handleReset}
                className="text-(--main-color) rounded-full border border-(--main-color) w-80 py-10 hover:cursor-pointer text-14"
              >
                초기화
              </button>
            </div>
          </div>
          <div>
            <select
              className="h-40 outline-none hover:cursor-pointer text-14 text-end"
              onChange={handleSorting}
              defaultValue="0"
            >
              {sorting.map((sort, index) => (
                <option key={sort.label} value={index}>
                  {sort.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {reviews &&
          reviews.map((review) => (
            <ReviewItem
              review={review}
              key={review.reviewId}
              handleDelete={handleDelete}
              handleRestore={handleRestore}
            />
          ))}
        {hasNext && (
          <div className="p-20 text-center">
            <button
              className="bg-(--main-color) rounded-full text-white px-16 py-10 hover:cursor-pointer text-14"
              onClick={fetchMoreReviews}
            >
              더보기
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewManagement;
