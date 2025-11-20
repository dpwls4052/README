"use client";

import { useState } from "react";
import Link from "next/link";

export default function FindPasswordForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFindPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const res = await fetch("/api/auth/resetPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone_number: phone, name: "temp" }),
    });

    const data = await res.json();

    if (data.success) {
      setResult("비밀번호 재설정 링크가 이메일로 전송되었습니다.");
    } else {
      setResult("입력한 정보와 일치하는 계정을 찾을 수 없습니다.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleFindPassword}
      className="w-[400px] mx-auto flex flex-col gap-6 bg-white p-8 rounded-xl shadow-md"
    >
      {/* 제목 */}
      <h2 className="text-2xl font-bold text-center">비밀번호 찾기</h2>

      {/* 이메일 입력 */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">이메일</label>
        <input
          type="email"
          placeholder="test@test.com"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* 전화번호 입력 */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">전화번호</label>
        <input
          type="text"
          placeholder="01012345678"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-700"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>

      {/* 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-bold text-white transition
          ${loading ? "bg-gray-400" : "bg-green-800 hover:bg-green-700"}`}
      >
        {loading ? "처리 중..." : "비밀번호 찾기"}
      </button>

      {/* 결과 출력 */}
      {result && (
        <p className="text-center text-green-700 font-medium mt-2">{result}</p>
      )}

      {/* 아래 링크 */}
      <div className="flex justify-between text-sm text-green-800 font-medium mt-4">
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
    </form>
  );
}
