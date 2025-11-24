// member/pages/CreateReview.jsx
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/common/useAuth";
import useCreateReview from "@/hooks/review/useCreateReview";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { toast } from "sonner";

const CreateReview = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { userId } = useAuth();
  const { createReview, loading, error } = useCreateReview();

  const bookId = searchParams.get("bookId");

  const [rate, setRate] = useState(5);
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!bookId) {
      alert("도서 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      await createReview({
        bookId: Number(bookId),
        userId,
        rate,
        review: content,
      });
      toast.success(
        data.status ? "리뷰를 등록했습니다." : "리뷰 등록을 실패했습니다."
      );
      // 성공 후 이동
      router.push("/member?MemberTab=reviews");
    } catch (err) {
      console.error("리뷰 생성 실패:", err);
      // useCreateReview 안에서 에러 관리하면 여기서 alert는 선택
      alert("리뷰 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col py-50 px-8 w-full min-h-screen">
        <h2 className="text-3xl font-semibold text-[#0A400C] mb-15">
          리뷰 작성
        </h2>

        {/* bookId 없으면 안내 */}
        {!bookId && (
          <p className="mb-20 text-red-500">
            도서 정보가 없어 리뷰를 작성할 수 없습니다.
          </p>
        )}

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
              disabled={loading}
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
              disabled={loading}
            />
          </div>

          {/* 에러 표시 */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* 버튼 */}
          <button
            type="submit"
            disabled={loading || !bookId}
            className="self-end px-15 py-8 bg-[var(--main-color)] text-white rounded text-sm hover:opacity-90 transition cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "저장 중..." : "리뷰 등록"}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default CreateReview;
