export const dynamic = "force-dynamic";

import { Suspense } from "react";
import ResetPasswordPage from "@/components/auth/ResetPassword";

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center mt-20">링크 확인 중...</p>}>
      <ResetPasswordPage/>
    </Suspense>
  );
}