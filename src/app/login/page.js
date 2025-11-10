import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import logo from "@/assets/logo.png";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#FEFAE0]">
      {/* 로고 */}
      <img
        src={logo}
        alt="README Logo"
        className="w-[250px] mb-8 object-contain"
      />

      {/* 로그인 박스 */}
      <div className="p-12 rounded-xl shadow-md bg-white">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
