"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "@/components/common/ProtectedRoute";

export default function FailContent() {
  const searchParams = useSearchParams();

  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  return (
    <ProtectedRoute>
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-800 mx-auto px-20">
          <div className="flex flex-col gap-8 items-center">

            {/* 실패 이미지 및 타이틀 */}
            <div className="bg-(--bg-color) p-10 rounded-15 w-full text-center">
              <div className="text-64 mb-6">
                ❌
              </div>
              <h1 className="text-28 font-bold text-red-600 mb-4">
                결제에 실패했습니다
              </h1>
              <p className="text-16 text-gray-600">
                결제 처리 중 문제가 발생했습니다.
              </p>
            </div>

            {/* 에러 정보 */}
            <div className="bg-(--bg-color) p-8 rounded-15 w-full">
              <h2 className="text-24 font-bold mb-6 text-black">
                오류 정보
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between py-3 border-b border-gray-300">
                  <span className="text-16 font-bold text-black">
                    에러 코드
                  </span>
                  <span className="text-16 text-red-600 font-bold">
                    {errorCode || "알 수 없음"}
                  </span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-300">
                  <span className="text-16 font-bold text-black">
                    에러 메시지
                  </span>
                  <span className="text-16 text-gray-600 text-right max-w-500">
                    {errorMessage || "알 수 없는 오류가 발생했습니다."}
                  </span>
                </div>
                {orderId && (
                  <div className="flex justify-between py-3">
                    <span className="text-16 font-bold text-black">
                      주문번호
                    </span>
                    <span className="text-16 text-gray-600">
                      {orderId}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 안내 메시지 */}
            <div className="bg-red-50 p-6 rounded-15 w-full">
              <p className="text-16 text-gray-600 mb-3">
                💡 결제 실패 시 확인사항
              </p>
              <div className="flex flex-col gap-2 text-14 text-gray-600">
                <p>• 카드 한도 또는 잔액을 확인해주세요</p>
                <p>• 카드 정보가 정확한지 확인해주세요</p>
                <p>• 결제 비밀번호를 다시 확인해주세요</p>
                <p>• 문제가 지속되면 카드사에 문의해주세요</p>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <Link
                href="/cart"
                className="bg-(--main-color) text-white text-18 h-60 rounded-15 hover:bg-(--sub-color) flex-1 flex items-center justify-center transition"
              >
                다시 결제하기
              </Link>
              <Link
                href="/"
                className="bg-white text-(--main-color) text-18 h-60 rounded-15 border-2 border-(--main-color) hover:bg-(--bg-color) flex-1 flex items-center justify-center transition"
              >
                홈으로 가기
              </Link>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>

  );
}
