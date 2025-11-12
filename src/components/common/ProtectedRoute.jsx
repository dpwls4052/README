"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/common/useAuth";

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // 로딩이 끝났고 사용자가 없으면 로그인 페이지로 리다이렉트
        if (!loading && !user) {
        alert("로그인이 필요한 페이지입니다.");
        router.push("/login");
        }
    }, [user, loading, router]);

    // 로딩 중일 때 로딩 화면 표시
    if (loading) {
        return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl text-[var(--main-color)]">로딩 중...</div>
        </div>
        );
    }

    // 사용자가 없으면 아무것도 렌더링하지 않음 (리다이렉트 처리 중)
    if (!user) {
        return null;
    }

    // 사용자가 있으면 자식 컴포넌트 렌더링
    return <>{children}</>;
};

export default ProtectedRoute;