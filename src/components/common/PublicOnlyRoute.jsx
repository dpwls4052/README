"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/common/useAuth";

const PublicOnlyRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 로딩이 끝났고 사용자가 있으면 메인 페이지로 리다이렉트
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  // 로딩 중이거나 사용자가 있으면 로딩 화면 표시
  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FEFAE0]">
        <div className="text-xl text-(--main-color)">로딩 중...</div>
      </div>
    );
  }

  // 사용자가 없으면 자식 컴포넌트 렌더링 (로그인/회원가입 페이지)
  return <>{children}</>;
};

export default PublicOnlyRoute;
