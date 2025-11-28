const BookListItemSkeleton = () => {
  return (
    <div className="flex flex-col md:flex-row w-full justify-betweenpy-4 md:py-15 gap-4 md:gap-14">
      {/* 왼쪽 영역 */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-20 flex-1">
        {/* 이미지 영역 스켈레톤 */}
        <div className="w-full sm:w-140 h-auto sm:h-200 max-w-[160px] mx-auto sm:mx-0 skeletonUI"></div>

        {/* 텍스트 영역 스켈레톤 */}
        <div className="flex flex-col items-start gap-2 md:gap-6 w-full">
          {/* 제목 */}
          <p className="w-500 h-30 mt-1 md:mt-3 max-w-full md:max-w-700 skeletonUI"></p>
          {/* 저자 & 발행일 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-10 w-full">
            <p className="w-200 h-30 skeletonUI"></p>
            <p className="w-200 h-30 skeletonUI"></p>
          </div>
          {/* 가격 */}
          <p className="w-100 h-30 mt-1 skeletonUI"></p>
        </div>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex md:items-end flex-row md:flex-col justify-between md:justify-start gap-4 md:gap-16 mt-4 md:mt-0">
        {/* 위시리스트 버튼 자리 */}
        <div className="w-40 h-40 skeletonUI"></div>

        {/* 장바구니 + 바로구매 버튼 영역 */}
        <div className="flex flex-row md:flex-col gap-2 md:gap-10 w-full md:w-200 h-auto md:h-100">
          <div className="h-40 flex-1 skeletonUI"></div>
          <div className="h-40 flex-1 skeletonUI"></div>
        </div>
      </div>
    </div>
  );
};

export default BookListItemSkeleton;
