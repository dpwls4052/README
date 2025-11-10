import { Box } from "@chakra-ui/react";
import SideBar from "./components/SideBar";
import { useTab } from "@/hooks/useTab";
import { ADMIN_TAB } from "@/constants/adminMenu";
import {
  BookManagement,
  ReviewManagement,
  DeliveryManagement,
  FAQManagement,
} from "./components/Management";

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
  const ActiveComponent =
    TAB_COMPONENTS[tabValues[tabIndex]] ?? (() => <Box>준비 중(스켈레톤)</Box>);

  return (
    <Box as="main" p="20px" h="100dvh" display="flex" gap="20px">
      <SideBar tabIndex={tabIndex} handleClickTab={handleClickTab} />
      <Box flex="1">
        <ActiveComponent />
      </Box>
    </Box>
  );
};

export default Admin;
