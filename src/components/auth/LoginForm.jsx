import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toaster } from "@/components/ui/toaster";

const LoginForm = () => {
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
      navigate("/kt_3team_project_2025");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[500px] h-[300px] mx-auto flex flex-col justify-center items-center gap-6"
    >
      {/* 이메일 입력 */}
      <div className="w-full">
        <label className="block text-sm font-semibold mb-1">이메일</label>
        <input
          type="email"
          placeholder="이메일 주소를 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
        />
      </div>

      {/* 비밀번호 입력 */}
      <div className="w-full">
        <label className="block text-sm font-semibold mb-1">비밀번호</label>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
        />
      </div>

      {/* 링크 섹션 */}
      <div className="flex justify-between w-full text-sm text-[#0A400C]">
        <a href="#" className="hover:underline">
          아이디 찾기
        </a>
        <a href="#" className="hover:underline">
          비밀번호 찾기
        </a>
        <RouterLink
          to="/kt_3team_project_2025/signup"
          className="hover:underline"
        >
          회원가입
        </RouterLink>
      </div>

      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full h-[45px] bg-[#0A400C] text-white font-bold rounded-md transition-colors ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#13661A]"
        }`}
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-red-500 text-sm mt-2">
          {error}
        </p>
      )}
    </form>
  );
};

export default LoginForm;
