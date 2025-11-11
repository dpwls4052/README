"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/common/useAuth";
import { toaster } from "@/components/ui/toaster";

const LoginForm = () => {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await login(email, password);
    if (isSuccess) {
      toaster.create({
        title: "로그인 성공",
        description: "환영합니다!",
        type: "success",
        duration: 2000,
      });
      router.push("/"); // 로그인 성공 시 메인으로 이동
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[400px] mx-auto flex flex-col gap-6 bg-white p-8 rounded-xl shadow-md"
    >
      {/* 이메일 입력 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold text-gray-700">
          이메일
        </label>
        <input
          id="email"
          type="email"
          placeholder="이메일 주소를 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-700"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-semibold text-gray-700">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-700"
        />
      </div>

      {/* 링크들 */}
      <div className="flex justify-between text-sm text-green-800 font-medium">
        <Link href="/find-id" className="hover:underline">
          아이디 찾기
        </Link>
        <Link href="/find-password" className="hover:underline">
          비밀번호 찾기
        </Link>
        <Link href="/signup" className="hover:underline">
          회원가입
        </Link>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-bold text-white transition 
          ${loading ? "bg-gray-400" : "bg-green-800 hover:bg-green-700"}`}
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-red-500 text-center text-sm mt-2">{error}</p>
      )}
    </form>
  );
};

export default LoginForm;
