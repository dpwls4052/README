"use client";
import SideBar from "@/components/admin/SideBar";
import { useTab } from "@/hooks/common/useTab";
import { ADMIN_TAB } from "@/constants/adminMenu";
import {
  BookManagement,
  ReviewManagement,
  DeliveryManagement,
  FAQManagement,
} from "@/components/admin/Management";

const NotReady = () => <div>준비 중(스켈레톤)</div>;

const Admin = () => {
  // 탭 상태
  const tabValues = ADMIN_TAB.map((tab) => tab.value);
  const { tabIndex, handleClickTab } = useTab("aTab", tabValues);

  const TAB_COMPONENTS = {
    book: BookManagement,
    review: ReviewManagement,
    delivery: DeliveryManagement,
    faq: FAQManagement,
  };

  // TODO 스켈레톤 만들기
  const ActiveComponent = TAB_COMPONENTS[tabValues[tabIndex]] ?? NotReady;

  return (
    <div className="flex gap-20 p-20 h-dvh">
      <SideBar tabIndex={tabIndex} handleClickTab={handleClickTab} />
      <ActiveComponent />
    </div>
  );
};

export default Admin;
