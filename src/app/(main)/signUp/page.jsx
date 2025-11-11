import React from "react";
import SignupForm from "@/components/auth/SignupForm";
import logo from "@/assets/logo.png";
import Image from "next/image";

const SignupPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#FFFAE5]">
      <Image
        src={logo}
        alt="README Logo"
        width={200}
        height={200}
        className="mb-8 object-contain"
      />

      {/* 회원가입 폼을 감싸는 카드 */}
      <div className="bg-white p-12 rounded-lg shadow-md max-w-[90%]">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;
