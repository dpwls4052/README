import { useTab } from "@/hooks/useTab";
import SideBar from "@/components/member/SideBar";
import { USER_TAB } from "@/constants/userMenu";

// ✅ 각 탭 페이지 import
import Profile from "@/components/member/pages/Profile";
import Orders from "@/components/member/pages/Orders";
import Reviews from "@/components/member/pages/Reviews";
import Settings from "@/components/member/pages/Settings";

const MyPage = () => {
  // 🔹 탭 value 목록 생성 (['profile', 'orders', 'reviews', 'settings'])
  const tabValues = USER_TAB.map((tab) => tab.value);
  const { tabIndex, handleClickTab } = useTab("MemberTab", tabValues);

  // 🔹 탭 value에 따라 컴포넌트 매핑
  const TAB_COMPONENTS = {
    profile: Profile,
    orders: Orders,
    reviews: Reviews,
    settings: Settings,
  };

  // 🔹 현재 활성화된 탭 컴포넌트 선택
  const ActiveComponent =
    TAB_COMPONENTS[tabValues[tabIndex]] ?? (() => <div>준비 중</div>);

  return (
    <main className="flex p-5 h-screen bg-white gap-5">
      {/* 🔹 사이드바 */}
      <SideBar tabIndex={tabIndex} handleClickTab={handleClickTab} />

      {/* 🔹 오른쪽 본문 */}
      <div className="flex-1 bg-gray-50 rounded-xl shadow-sm p-6">
        <ActiveComponent />
      </div>
    </main>
  );
};

export default MyPage;
