"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("paymentData");
      if (saved) {
        setPaymentData(JSON.parse(saved));
        localStorage.removeItem("paymentData");
      }
    }
  }, []);

  // 실제 결제 승인이 필요한 경우 아래 주석을 해제하세요
  // useEffect(() => {
  //   setIsLoading(true);
  //   async function confirm() {
  //     const requestData = {
  //       orderId: searchParams.get("orderId"),
  //       amount: searchParams.get("amount"),
  //       paymentKey: searchParams.get("paymentKey"),
  //     };

  //     const response = await fetch("/api/confirm/payment", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(requestData),
  //     });

  //     const json = await response.json();

  //     if (!response.ok) {
  //       throw { message: json.message, code: json.code };
  //     }

  //     return json;
  //   }

  //   confirm()
  //     .then((data) => {
  //       setResponseData(data);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       router.push(`/fail?code=${error.code}&message=${error.message}`);
  //     });
  // }, [searchParams, router]);

  if (!paymentData) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-[800px] mx-auto px-5">
          <p className="text-center text-gray-500 text-[18px]">
            결제 정보가 없습니다. 홈으로 돌아가주세요.
          </p>
          <div className="flex justify-center mt-6">
            <Link
              href="/"
              className="bg-[var(--main-color)] text-white text-[18px] h-[50px] px-8 rounded-[15px] hover:bg-[#0d5010] flex items-center justify-center transition"
            >
              홈으로 가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-[800px] mx-auto px-5">
          <div className="flex justify-center items-center min-h-[400px]">
            <p className="text-[20px] text-gray-600">
              결제 승인 처리 중...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-[800px] mx-auto px-5">
        <div className="flex flex-col gap-8 items-center">
          {/* 성공 이미지 및 타이틀 */}
          <div className="bg-[var(--bg-color)] p-10 rounded-[15px] w-full text-center">
            <img
              src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
              alt="success"
              className="w-[100px] mx-auto mb-6"
            />
            <h1 className="text-[28px] font-bold text-[var(--main-color)] mb-4">
              결제가 완료되었습니다
            </h1>
            <p className="text-[16px] text-gray-600">
              주문이 정상적으로 처리되었습니다.
            </p>
          </div>

          {/* 결제 정보 */}
          <div className="bg-[var(--bg-color)] p-8 rounded-[15px] w-full">
            <h2 className="text-[24px] font-bold mb-6 text-black">
              결제 정보
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between py-3 border-b border-gray-300">
                <span className="text-[16px] font-bold text-black">
                  결제금액
                </span>
                <span className="text-[18px] font-bold text-[var(--main-color)]">
                  {paymentData.finalPrice.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-300">
                <span className="text-[16px] font-bold text-black">
                  주문상품
                </span>
                <span className="text-[16px] text-gray-600">
                  {paymentData.orderName}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-300">
                <span className="text-[16px] font-bold text-black">
                  주문번호
                </span>
                <span className="text-[16px] text-gray-600 font-mono">
                  {searchParams.get("orderId")}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-[16px] font-bold text-black">
                  결제수단
                </span>
                <span className="text-[16px] text-gray-600">
                  {searchParams.get("paymentType") === "NORMAL"
                    ? "일반결제"
                    : searchParams.get("paymentType")}
                </span>
              </div>
            </div>
          </div>

          {/* 응답 데이터 (개발용) */}
          {responseData && (
            <div className="bg-[var(--bg-color)] p-8 rounded-[15px] w-full">
              <h2 className="text-[24px] font-bold mb-4 text-black">
                Response Data
              </h2>
              <div className="bg-white p-4 rounded-lg text-[14px] font-mono overflow-x-auto">
                <pre>{JSON.stringify(responseData, null, 2)}</pre>
              </div>
            </div>
          )}

          {/* 버튼 영역 */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <Link
              href="/"
              className="bg-[var(--main-color)] text-white text-[18px] h-[60px] rounded-[15px] hover:bg-[#0d5010] flex-1 flex items-center justify-center transition"
            >
              홈으로 가기
            </Link>
            <Link
              href="/mypage/orders"
              className="bg-white text-[var(--main-color)] text-[18px] h-[60px] rounded-[15px] border-2 border-[var(--main-color)] hover:bg-[var(--bg-color)] flex-1 flex items-center justify-center transition"
            >
              주문 내역 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}