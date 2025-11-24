import { useAdminReviews } from "@/hooks/review/useAdminReviews";
import ReviewItem from "./ReviewItem";

const ReviewManagement = () => {
  const { reviews, fetchReviews, fetchMoreReviews, loading, hasNext } =
    useAdminReviews();

  return (
    <section className="flex flex-col w-full h-full gap-20 ">
      <div className="flex items-center justify-between h-40">
        <h1 className="text-32 text-(--main-color)">리뷰 관리</h1>
      </div>
      <div className="overflow-y-auto bg-(--bg-color) scrollbar-hide rounded-lg">
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
