import Image from "next/image";
import { useRouter } from "next/navigation";
import AddToCartButton from "../common/AddToCartButton";
import BuyNowButton from "../common/BuyNowButton";
import WishListButton from "../common/WishListButton";
import noimg from "@/assets/no_image.png";

const BestsellerItemSkeleton = ({ book, userId }) => {
  return (
    <div className="bg-(--bg-color) p-8 flex flex-col justify-between gap-15 w-266 mx-auto">
      {/* 도서 이미지 */}
      <div className="w-full overflow-hidden border border-gray-300 rounded-md h-320 skeletonUI"></div>

      {/* 제목 + 버튼 영역 */}
      <div className="flex items-start justify-between">
        <p className="w-full h-40 skeletonUI"></p>
      </div>

      {/* 작가, 가격 */}
      <div className="flex items-center justify-between gap-10">
        <p className="w-full h-16 skeletonUI"></p>
        <p className="h-16 skeletonUI w-60 shrink-0"></p>
      </div>

      {/* ✅ 장바구니 & 바로구매 버튼 */}
      <div className="flex items-center justify-between gap-2">
        {/* 장바구니 버튼 - stock 전달 */}
        <div className="w-full h-40 skeletonUI"></div>

        {/* 바로구매 버튼 - 컴포넌트로 교체 */}
        <div className="w-full h-40 skeletonUI"></div>
      </div>
    </div>
  );
};

export default BestsellerItemSkeleton;
