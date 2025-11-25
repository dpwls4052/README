import Image from "next/image";
import { useRouter } from "next/navigation";
import AddToCartButton from "../common/AddToCartButton";
import BuyNowButton from "../common/BuyNowButton";
import WishListButton from "../common/WishListButton";
import noimg from "@/assets/no_image.png";

const BestsellerItem = ({ book, userId }) => {
  const router = useRouter();
  const goDetail = (id) => {
    router.push(`/product/detail/${id}`);
  };

  return (
    <div className="bg-(--bg-color) p-8 flex flex-col justify-between gap-15 w-266 mx-auto">
      {/* 도서 이미지 */}
      <div
        className="overflow-hidden border border-gray-300 rounded-md w-250 h-320 hover:cursor-pointer"
        onClick={() => goDetail(book.id)}
      >
        <Image
          src={book.highResCover || noimg}
          alt={book.title}
          width={300}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>

      {/* 제목 + 버튼 영역 */}
      <div className="flex items-start justify-between">
        <p className="font-semibold text-left text-16/20 w-180 line-clamp-2">
          {book.title}
        </p>

        <div className="flex items-center gap-2">
          <WishListButton userId={userId} bookId={book.bookId} />
        </div>
      </div>

      {/* 작가, 가격 */}
      <div className="flex items-center justify-between">
        <p className="font-normal text-left truncate text-14 w-140">
          {book.author}
        </p>
        <p className="font-normal text-16">
          {(book.priceStandard ?? 0).toLocaleString()}원
        </p>
      </div>

      {/* ✅ 장바구니 & 바로구매 버튼 */}
      <div className="flex items-center justify-between gap-2">
        {/* 장바구니 버튼 - stock 전달 */}
        <AddToCartButton
          book={{
            bookId: book.bookId,
            stock: book.stock, // ✅ stock 추가
          }}
          iconMode={false}
          className="h-40"
        />

        {/* 바로구매 버튼 - 컴포넌트로 교체 */}
        <BuyNowButton
          book={{
            bookId: book.bookId,
            title: book.title,
            cover: book.cover,
            priceStandard: book.priceStandard,
            stock: book.stock,
          }}
          className="h-40"
        />
      </div>
    </div>
  );
};

export default BestsellerItem;
