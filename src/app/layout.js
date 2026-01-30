import ScrollTopBtn from "@/components/common/ScrollTopBtn";
import "./globals.css";
import ScrollProviderWrapper from "@/components/common/ScrollProviderWrapper";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "README | 온라인 서점 플랫폼",
  description: "Next.js 기반 온라인 서점 프로젝트 README 페이지입니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <ScrollProviderWrapper>
          {children}
          <ScrollTopBtn />
        </ScrollProviderWrapper>
        <Toaster />
      </body>
    </html>
  );
}
