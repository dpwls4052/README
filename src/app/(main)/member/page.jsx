import { Suspense } from "react";
import MemberContent from "@/components/member/MemberContent";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const MyPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProtectedRoute>
        <MemberContent />
      </ProtectedRoute>
    </Suspense>
  );
};

export default MyPage;
