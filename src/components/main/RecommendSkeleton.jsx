const RecommendSkeleton = () => {
  return (
    <>
      <div className="w-full max-w-[200px] mx-auto h-[280px] rounded-md overflow-hidden">
        {/* 도서 이미지 */}
        <div className=" w-full h-full skeletonUI"></div>
      </div>
      <div className="flex flex-col items-start mt-4 text-left max-w-[200px] mx-auto gap-3">
        {/* 제목 */}
        <p className="w-full h-16 skeletonUI"></p>
        {/* 작가 */}
        <p className="w-full h-16 skeletonUI"></p>
      </div>
    </>
  );
};

export default RecommendSkeleton;
