'use client'

// src/app/layout.jsx 파일 예시
import { Toaster } from 'sonner';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        {/* sonner의 Toaster 컴포넌트 추가 */}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
import { toast as sonnerToast } from 'sonner'

/**
 * sonner 라이브러리를 사용하여 toast 알림을 생성합니다.
 * 기존 toaster.create 인터페이스를 유지하여 다른 컴포넌트의 수정을 최소화합니다.
 */
export const toaster = {
  create: ({ title, description, type = 'info', duration }) => {
    // sonner는 title과 description을 하나의 메시지로 처리합니다.
    const message = (
      <>
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm">{description}</div>}
      </>
    );

    switch (type) {
      case 'success':
        sonnerToast.success(message, { duration });
        break;
      case 'error':
        sonnerToast.error(message, { duration });
        break;
      case 'loading':
        sonnerToast.loading(message, { duration });
        break;
      default:
        sonnerToast.info(message, { duration });
        break;
    }
  },
};

// Toaster 컴포넌트는 이제 app/layout.jsx에서 직접 'sonner'의 Toaster를 사용합니다.
// 이 파일은 더 이상 Toaster 컴포넌트를 export하지 않습니다.
// 만약 이 파일에서 Toaster를 export해야 한다면, sonner의 Toaster를 그대로 export 할 수 있습니다.
// export { Toaster } from 'sonner';
