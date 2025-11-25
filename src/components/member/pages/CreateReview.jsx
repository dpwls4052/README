// member/pages/CreateReview.jsx
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/common/useAuth";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { toast } from "sonner";
import useReviewForm from "@/hooks/review/useReviewForm";

const CreateReview = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId } = useAuth();

  const bookId = searchParams.get("bookId");
  const reviewId = searchParams.get("reviewId"); // 수정일 때만 존재

  const {
    isEdit,
    rate,
    setRate,
    content,
    setContent,
    loading,
    submitting,
    error,
    submit,
  } = useReviewForm({ bookId, userId, reviewId });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (!bookId) {
      toast.error("도서 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    try {
      await submit();

      toast.success(isEdit ? "리뷰를 수정했습니다." : "리뷰를 등록했습니다.");
      // 성공 후 이동
      router.push("/member?MemberTab=reviews");
    } catch (err) {
      console.error("리뷰 생성 실패:", err);
      // useCreateReview 안에서 에러 관리하면 여기서 alert는 선택
      toast.error(err.message || "리뷰 저장 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    router.push("/member?MemberTab=reviews");
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col py-50 px-8 w-full min-h-screen">
        <h2 className="text-3xl font-semibold text-[#0A400C] mb-15">
          {isEdit ? "리뷰 수정" : "리뷰 작성"}
        </h2>
        {error && <p className="text-red-500 text-sm mb-10">{error}</p>}
        {/* 폼 시작 */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-20 max-w-2xl"
        >
          {/* 평점 선택 */}
          <div className="flex gap-8 items-center">
            <label className="text-16 font-medium text-black">평점 ⭐</label>
            <select
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="border border-gray-300 rounded  py-8 w-40 text-black font-normal"
              disabled={submitting}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* 리뷰 내용 */}
          <div className="flex flex-col gap-8">
            <label className="text-16 font-medium text-black">리뷰 내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="리뷰 내용을 입력해주세요"
              className="border rounded text-black font-normal px-10 py-8 min-h-[200px]"
              disabled={submitting}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-10 mt-10">
            <button
              type="submit"
              disabled={submitting}
              className="self-end px-15 py-8 bg-[var(--main-color)] text-white rounded text-sm hover:opacity-90 transition cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? isEdit
                  ? "수정 중..."
                  : "등록 중..."
                : isEdit
                ? "리뷰 수정"
                : "리뷰 등록"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-15 py-8 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-100 transition cursor-pointer"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default CreateReview;
