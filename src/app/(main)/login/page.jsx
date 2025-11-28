"use client";

import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import logo from "@/assets/logo.png";
import PublicOnlyRoute from "@/components/common/PublicOnlyRoute";

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <div className="flex flex-col items-center justify-center h-screen bg-[#FEFAE0]">
        <Image
          src={logo}
          alt="README Logo"
          width={200}
          height={200}
          className="object-contain mb-8 py-25"
        />
        <LoginForm />
      </div>
    </PublicOnlyRoute>
  );
}
