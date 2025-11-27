import { Suspense } from "react";
import MemberContent from "@/components/member/MemberContent";

const MyPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MemberContent />
    </Suspense>
  );
};

export default MyPage;
