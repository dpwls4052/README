import Image from "next/image";

const ReviewItem = ({ review }) => {
  const utcString = review.createdAt.replace(" ", "T") + "Z";
  const koreaTime = new Date(utcString).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
  return (
    <li className="flex flex-col px-20 py-10 border-b border-b-gray-200 shrink-0">
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
          <p className="font-semibold line-clamp-2 leading-24">
            {review.book.title}
          </p>
          <p className="line-clamp-2 text-14">{review.book.author}</p>
        </div>
      </div>
      <p className="my-10">{review.review}</p>
    </li>
  );
};

export default ReviewItem;
