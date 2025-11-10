import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toaster } from "@/components/ui/toaster";

const SignupForm = () => {
  const { signup, loading, error } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

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

    const isSuccess = await signup(name, email, password);
    if (isSuccess) {
      toaster.create({
        title: "회원가입 완료",
        description: "로그인 페이지로 이동합니다.",
        type: "success",
        duration: 1500,
      });
      setTimeout(() => navigate("/kt_3team_project_2025/login"), 1500);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[500px] h-[400px] mx-auto flex flex-col justify-center items-center gap-6"
    >
      <div className="w-full space-y-6">
        {/* 이름 입력 */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1">이름</label>
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* 이메일 입력 */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1">이메일</label>
          <input
            type="email"
            placeholder="이메일 주소를 입력하세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="w-full">
          <label className="block text-sm font-semibold mb-1">비밀번호 확인</label>
          <input
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full h-[45px] bg-[#0A400C] text-white font-bold rounded-md transition-colors ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#13661A]"
          }`}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>

        {/* 에러 메시지 */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        {/* 로그인 이동 */}
        <div className="flex justify-center items-center gap-2 text-sm mt-2">
          <span>이미 계정이 있으신가요?</span>
          <button
            type="button"
            onClick={() => navigate("/kt_3team_project_2025/login")}
            className="text-[#0A400C] font-medium hover:underline"
          >
            로그인
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
