"use client";

import { useState } from "react";
import Link from "next/link";

export default function FindPasswordForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState({ message: "", isError: false });
  const [loading, setLoading] = useState(false);

  const handleFindPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult({ message: "", isError: false });

    try {
      const res = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone_number: phone }),
      });

      const data = await res.json();
      console.log("📥 응답:", data);

      if (data.success) {
        setResult({
          message: data.message || "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
          isError: false,
        });
        // 성공 시 입력 필드 초기화
        setEmail("");
        setPhone("");
      } else {
        setResult({
          message: data.message || "입력한 정보와 일치하는 계정을 찾을 수 없습니다.",
          isError: true,
        });
      }
    } catch (error) {
      console.error("❌ 요청 실패:", error);
      setResult({
        message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleFindPassword}
      className="w-full max-w-[600px] min-h-[350px] mx-auto flex flex-col bg-white p-6 md:p-25 rounded-sm shadow-md"
    >
      <div className="flex flex-col gap-6 flex-1 justify-center">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="password-reset-title"
            className="font-semibold text-gray-700 text-2xl md:text-3xl text-center"
          >
            비밀번호 찾기
          </label>
        </div>
        
        {/* 이메일 입력 */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="font-semibold text-gray-700 py-2 md:py-8 text-sm md:text-base"
          >
            이메일
          </label>
          <input
            id="email"
            type="email"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 md:py-8 border rounded-sm outline-none focus:ring-2 focus:ring-green-700 text-sm md:text-base"
          />
        </div>

        {/* 전화번호 입력 */}
        <div className="w-full pb-4 md:pb-20">
          <label className="font-semibold text-gray-700 py-2 md:py-8 text-sm md:text-base block">
            전화번호
          </label>
          <input
            type="text"
            placeholder="01000000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
            maxLength={11}
            required
            className="w-full px-4 py-3 md:py-8 border rounded-sm outline-none focus:ring-2 focus:ring-green-700 text-sm md:text-base"
          />
        </div>
      </div>

      {/* 결과 출력 */}
      {result.message && (
        <p
          className={`text-center font-medium mt-2 mb-4 p-3 rounded ${
            result.isError
              ? "text-red-700 bg-red-50 border border-red-200"
              : "text-green-700 bg-green-50 border border-green-200"
          }`}
        >
          {result.message}
        </p>
      )}

      {/* 아래 링크 */}
      <div className="flex justify-between text-xs md:text-sm text-green-800 font-medium mt-4 pb-4 md:pb-20">
        <Link href="/login" className="hover:underline">
          로그인
        </Link>
        <Link href="/findId" className="hover:underline">
          아이디 찾기
        </Link>
        <Link href="/signUp" className="hover:underline">
          회원가입
        </Link>
      </div>

      {/* 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full h-[40px] md:h-[50px] py-2 rounded-sm font-bold text-white transition text-sm md:text-base
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-800 hover:bg-green-700"}`}
      >
        {loading ? "처리 중..." : "비밀번호 찾기"}
      </button>
    </form>
  );
}