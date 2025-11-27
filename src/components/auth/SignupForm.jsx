"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/common/useAuth";
import { toaster } from "@/components/ui/toaster";

const SignupForm = () => {
  const { signup, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toaster.create({
        title: "비밀번호 불일치",
        description: "비밀번호가 일치하지 않습니다.",
        type: "error",
      });
      return;
    }

    const result = await signup(name, email, password, phone);

    if (result.success) {
      setEmailSent(true);
      toaster.create({
        title: "인증 이메일 발송",
        description: "이메일을 확인하여 인증을 완료해주세요.",
        type: "success",
        duration: 3000,
      });
    }
  };

  if (emailSent) {
    return (
      <div className="w-[600px] mx-auto flex flex-col justify-center items-center gap-6 p-8 bg-white rounded-sm shadow-md">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            이메일을 확인해주세요
          </h2>

          <p className="text-gray-600">
            <strong>{email}</strong>로 인증 이메일을 발송했습니다.
          </p>

          <p className="text-sm text-gray-500">
            이메일의 인증 링크를 클릭하여 회원가입을 완료해주세요.
          </p>

          <div className="pt-4 space-y-3">
            <button
              onClick={() => router.push("/login")}
              className="w-full h-[45px] bg-[#0A400C] text-white font-bold rounded-md hover:bg-[#13661A] transition-colors"
            >
              로그인 페이지로 이동
            </button>

            <button
              onClick={() => setEmailSent(false)}
              className="w-full h-[45px] border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              다시 가입하기
            </button>
          </div>

          <p className="text-xs text-gray-500 pt-4">
            이메일이 오지 않나요? 스팸 메일함을 확인해보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[600px] min-h-[350px] mx-auto flex flex-col bg-white p-30 rounded-sm shadow-md"
    >
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="font-semibold text-gray-700 text-3xl text-center"
          >
            회원가입
          </label>
        </div>
        {/* 이름 입력 */}
        <div className="w-full">
          <label className="block text-base font-semibold mb-1 py-8">
            이름
          </label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 text-base rounded-sm shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* 이메일 입력 */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1 py-8 text-base">
            이메일
          </label>
          <input
            type="email"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-sm text-base shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1 py-8 text-base">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-sm text-base shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1 py-8 text-base">
            비밀번호 확인
          </label>
          <input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-sm text-base shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* 전화번호 입력 */}
        <div className="w-full py-8 pb-20">
          <label className="block text-sm font-semibold mb-1 pb-10 text-base">
            전화번호
          </label>
          <input
            type="text"
            placeholder="01000000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-sm text-base shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-[40px] py-2 rounded-sm font-bold text-white transition 
            ${loading ? "bg-gray-400" : "bg-green-800 hover:bg-green-700"}`}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>

        {/* 에러 메시지 */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        {/* 로그인 이동 */}
        <div className="flex justify-center font-light items-center gap-2 text-sm mt-2 pt-8">
          <span>이미 계정이 있으신가요?</span>
          <Link
            href="/login"
            className="text-[#0A400C] font-medium hover:underline"
          >
            로그인
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
