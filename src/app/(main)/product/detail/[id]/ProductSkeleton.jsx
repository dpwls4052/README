const ProductSkeleton = () => {
  return (
    <div className="mx-auto max-w-full min-[900px]:max-w-1200 mt-8 min-[900px]:mt-50 px-4 min-[900px]:px-60">
      {/* 상품 정보 영역 */}
      <div className="flex flex-col min-[900px]:flex-row mb-12 min-[900px]:mb-80 gap-8 min-[900px]:gap-80">
        {/* 이미지 스켈레톤 */}
        <div className="w-full min-[900px]:w-400 h-auto mx-auto min-[900px]:mx-0">
          <div className="w-full h-300 min-[900px]:h-600 skeletonUI" />
        </div>

        {/* 정보 스켈레톤 */}
        <div className="flex flex-col py-4 min-[900px]:py-20 space-y-4 min-[900px]:space-y-6 flex-1 min-[900px]:flex-2">
          <div className="space-y-3 min-[900px]:space-y-6 w-full">
            {/* 카테고리 */}
            <p className="w-200 h-20 skeletonUI" />
            {/* 제목 */}
            <p className="w-full min-[900px]:w-500 h-30 skeletonUI" />
            {/* 저자 | 출판사 | 발행일 */}
            <p className="w-300 h-20 skeletonUI" />
          </div>

          {/* 가격 영역 */}
          <div className="py-4 min-[900px]:py-20 text-right">
            <p className="w-150 h-30 ml-auto skeletonUI" />
          </div>

          {/* 재고량 영역 */}
          <div className="flex items-center justify-between my-0 py-3 min-[900px]:py-15">
            <span className="w-80 h-20 skeletonUI" />
            <span className="w-80 h-30 skeletonUI" />
          </div>

          {/* 판매량 영역 */}
          <div className="flex items-center justify-between my-0 py-3 min-[900px]:py-15">
            <span className="w-80 h-20 skeletonUI" />
            <span className="w-80 h-20 skeletonUI" />
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row gap-3 min-[900px]:gap-6 py-4 min-[900px]:py-20">
            <div className="w-40 h-40 skeletonUI" />
            <div className="flex-1 h-40 min-[900px]:h-50 skeletonUI" />
            <div className="flex-1 h-40 min-[900px]:h-50 skeletonUI" />
          </div>

          {/* 알라딘 링크 자리 */}
          <div className="flex justify-end">
            <p className="w-150 h-20 skeletonUI" />
          </div>
        </div>
      </div>

      {/* 탭 영역 */}
      <div className="pt-6 min-[900px]:pt-12">
        {/* 탭 버튼 스켈레톤 */}
        <div className="flex border-b-2 border-gray-200 gap-4 min-[900px]:gap-30 pb-2 min-[900px]:pb-10">
          <div className="w-80 h-25 skeletonUI" />
          <div className="w-100 h-25 skeletonUI" />
          <div className="w-140 h-25 skeletonUI" />
        </div>

        {/* 탭 내용 스켈레톤 */}
        <div className="mt-4 min-[900px]:mt-15">
          {/* 설명 탭 내용 형태 기준 */}
          <div
            style={{ borderRadius: "var(--radius-15)" }}
            className="bg-(--bg-color) p-4 min-[900px]:p-15"
          >
            <div className="flex flex-col gap-2 min-[900px]:gap-10">
              <p className="w-full h-20 skeletonUI" />
              <p className="w-full h-20 skeletonUI" />
              <p className="w-4/5 h-20 skeletonUI" />
              <p className="w-3/5 h-20 skeletonUI" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
