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
      className="w-[600px] min-h-[350px] mx-auto flex flex-col bg-white p-25 rounded-xl shadow-md"
    >
      <div className="flex flex-col gap-6 flex-1 justify-center">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-semibold text-gray-700 text-3xl text-center">
            아이디 찾기
          </label>
        </div>
      {/* 이름 입력 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-semibold text-gray-700 py-8 text-base">
            이름
          </label>
        <input
          id="name"
          type="name"
          placeholder="홍길동"
          className="w-full px-4 py-8 border rounded-lg outline-none focus:ring-2 focus:ring-green-700 text-base"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* 전화번호 입력 */}
        <div className="w-full py-8 pb-20">
          <label className="font-semibold text-gray-700 py-8 text-base ">전화번호</label>
          <input
            type="text"
            placeholder="01000000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full px-4 py-8 border rounded-lg outline-none focus:ring-2 focus:ring-green-700 text-base"
          />
        </div>
    </div>

      {/* 결과 */}
      {result && (
        <p className="text-center text-green-700 font-medium mt-2">{result}</p>
      )}

      {/* 아래 링크 - 로그인 페이지와 스타일 동일 */}
      <div className="flex justify-between text-sm text-green-800 font-medium pb-10">
        <Link href="/login" className="hover:underline">
          로그인
        </Link>
        <Link href="/findpw" className="hover:underline">
          비밀번호 찾기
        </Link>
        <Link href="/signUp" className="hover:underline">
          회원가입
        </Link>
      </div>

      {/* 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full h-[40px] py-2 rounded-3xl font-bold text-white transition 
            ${loading ? "bg-gray-400" : "bg-green-800 hover:bg-green-700"}`}
        >
        {loading ? "조회 중..." : "아이디 찾기"}
      </button>

    </form>
  );
}
