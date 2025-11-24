import { useAdminReviews } from "@/hooks/review/useAdminReviews";
import ReviewItem from "./ReviewItem";
import { useState } from "react";

const ReviewManagement = () => {
  const [userEmail, setUserEmail] = useState("");
  const [bookId, setBookId] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    userEmail: undefined,
    bookId: undefined,
    orderField: "created_at",
    orderDirection: "desc",
  });
  const { reviews, fetchReviews, fetchMoreReviews, loading, hasNext } =
    useAdminReviews(appliedFilters);

  const handleReviewSearch = () => {
    setAppliedFilters({
      userEmail,
      bookId,
    });
  };
  const handleReset = () => {
    setAppliedFilters({});
    setUserEmail("");
    setBookId("");
  };

  return (
    <section className="flex flex-col w-full h-full gap-20 ">
      <div className="flex items-center justify-between h-40">
        <h1 className="text-32 text-(--main-color)">리뷰 관리</h1>
      </div>
      <div className="overflow-y-auto bg-(--bg-color) scrollbar-hide rounded-lg">
        <div className="flex flex-wrap gap-10 p-20">
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
            className="px-10 py-20 border border-black rounded-full h-30 w-250"
          />
          <div className="flex gap-10">
            <button
              onClick={handleReviewSearch}
              className="bg-(--main-color) rounded-full text-white px-26 py-10 hover:cursor-pointer text-14"
            >
              검색
            </button>
            <button
              onClick={handleReset}
              className="text-(--main-color) rounded-full border border-(--main-color) px-26 py-10 hover:cursor-pointer text-14"
            >
              초기화
            </button>
          </div>
        </div>
        {reviews &&
          reviews.map((review) => (
            <ReviewItem review={review} key={review.reviewId} />
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
