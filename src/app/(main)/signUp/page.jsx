import React from "react";
import SignupForm from "@/components/auth/SignupForm";
import logo from "@/assets/logo.png";
import Image from "next/image";
import PublicOnlyRoute from "@/components/common/PublicOnlyRoute";

const SignupPage = () => {
  return (
    <PublicOnlyRoute>
      <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#FFFAE5]">
        <Image
          src={logo}
          alt="README Logo"
          width={200}
          height={200}
          className="object-contain mb-8 py-25"
        />

        {/* 회원가입 폼을 감싸는 카드 */}
        <SignupForm />
      </div>
    </PublicOnlyRoute>
  );
};

export default SignupPage;
