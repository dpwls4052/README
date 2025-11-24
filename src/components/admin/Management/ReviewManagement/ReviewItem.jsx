import Image from "next/image";

const ReviewItem = ({ review }) => {
  const utcString = review.createdAt.replace(" ", "T") + "Z";
  const koreaTime = new Date(utcString).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  return (
    <li className="flex items-center justify-between px-20 py-10 border-b border-b-gray-200 shrink-0">
      <div>
        <p className="text-12">{koreaTime}</p>
        <p className="mt-10 mb-20">
          <span className="font-bold">&quot;{review.user.name}&quot;</span> 님(
          {review.user.email})
        </p>
        <div className="flex items-start justify-start gap-10 h-100">
          <Image
            src={review.book.cover || "/no-image.png"}
            alt={review.book.title}
            width={62.5}
            height={100}
            className="rounded-md shrink-0"
          />
          <div className="flex-1 text-start">
            <p className="text-14">도서ID : {review.book.bookId}</p>
            <a
              href={`/product/detail/${review.book.bookId}`}
              className="font-semibold line-clamp-2 leading-24 hover:underline"
            >
              {review.book.title}
            </a>
            <p className="line-clamp-2 text-14">{review.book.author}</p>
          </div>
        </div>
        <p>{Array.from({ length: review.rate }).map(() => "⭐")}</p>
        <p className="my-10">{review.review}</p>
      </div>

      <button className="shrink-0 bg-(--main-color) text-white py-10 px-16 rounded h-40 font-normal hover:cursor-pointer">
        {review.status ? "숨기기" : "해제"}
      </button>
    </li>
  );
};

export default ReviewItem;
