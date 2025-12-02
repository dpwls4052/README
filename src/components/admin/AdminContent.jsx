"use client";
import { useEffect, useState } from "react";
import SideBar from "@/components/admin/SideBar";
import { useTab } from "@/hooks/common/useTab";
import { ADMIN_TAB } from "@/constants/adminMenu";
import {
  BookManagement,
  ReviewManagement,
  DeliveryManagement,
} from "@/components/admin/Management";
import { useAuth } from "@/hooks/common/useAuth";
import { toast } from "sonner";

const NotReady = () => <div>준비 중(스켈레톤)</div>;

const AdminContent = () => {
  const { user, loading: authLoading } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (authLoading) return;

      if (!user) {
        // 로그인 안 됨
        window.location.href = "/login";
        return;
      }

      try {
        const idToken = await user.getIdToken();

        const res = await fetch("/api/auth/verify-admin", {
          headers: { Authorization: `Bearer ${idToken}` },
        });

        const data = await res.json();

        if (!data.isAdmin) {
          toast.error("관리자 권한이 필요합니다.");
          window.location.href = "/";
          return;
        }

        setIsAuthorized(true);
      } catch (err) {
        console.error("Admin verification failed:", err);
        window.location.href = "/";
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdminAccess();
  }, [authLoading, user]);

  // 탭 상태
  const tabValues = ADMIN_TAB.map((tab) => tab.value);
  const { tabIndex, handleClickTab } = useTab("aTab", tabValues);

  const TAB_COMPONENTS = {
    book: BookManagement,
    review: ReviewManagement,
    delivery: DeliveryManagement,
  };

  // TODO 스켈레톤 만들기
  const ActiveComponent = TAB_COMPONENTS[tabValues[tabIndex]] ?? NotReady;

  if (isVerifying) {
    return <div>권한을 확인하는 중...</div>;
  }

  if (!isAuthorized) {
    return null; // 리다이렉트 중
  }

  return (
    <div className="flex flex-col gap-20 p-20 md:flex-row h-dvh">
      <SideBar tabIndex={tabIndex} handleClickTab={handleClickTab} />
      <div className="flex-1 overflow-y-hidden">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default AdminContent;
