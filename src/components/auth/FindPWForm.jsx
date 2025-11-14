"use client";

import { useState } from "react";
import Link from "next/link";

export default function FindIdForm() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFindId = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const res = await fetch("/api/auth/findId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phone }),
    });

    const data = await res.json();

    if (data.success) {
      setResult(`가입된 아이디는 ${data.email} 입니다.`);
    } else {
      setResult("등록된 정보가 없습니다.");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleFindId}
      className="w-[400px] mx-auto flex flex-col gap-6 bg-white p-8 rounded-xl shadow-md"
    >
      {/* 제목 */}
      <h2 className="text-2xl font-bold text-center">비밀번호 찾기</h2>

      {/* 이름 입력 */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">이메일</label>
        <input
          type="email"
          placeholder="test@test.com"
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-700"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
        {loading ? "조회 중..." : "비밀번호 찾기"}
      </button>

      {/* 결과 */}
      {result && (
        <p className="text-center text-green-700 font-medium mt-2">{result}</p>
      )}

      {/* 아래 링크 - 로그인 페이지와 스타일 동일 */}
      <div className="flex justify-between text-sm text-green-800 font-medium">
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
