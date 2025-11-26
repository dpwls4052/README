"use client";
import { useEffect } from "react";
import SideBar from "@/components/admin/SideBar";
import { useTab } from "@/hooks/common/useTab";
import { ADMIN_TAB } from "@/constants/adminMenu";
import {
  BookManagement,
  ReviewManagement,
  DeliveryManagement,
} from "@/components/admin/Management";
import { useAuth } from "@/hooks/common/useAuth";

const NotReady = () => <div>준비 중(스켈레톤)</div>;

const Admin = () => {
  const { isAdmin, userId, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAdmin) {
      alert("관리자 권한이 필요합니다.");
      if (userId) {
        window.location.href = "/";
      } else {
        window.location.href = "/login";
      }
    }
  }, [loading, isAdmin, userId]);

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
  if (loading) return <div>로딩 중...</div>;
  if (!isAdmin) return <div>권한을 확인하는 중...</div>;
  return (
    <div className="flex gap-20 p-20 h-dvh">
      <SideBar tabIndex={tabIndex} handleClickTab={handleClickTab} />
      <ActiveComponent />
    </div>
  );
};

export default Admin;
