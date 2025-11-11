"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { IoClose } from "react-icons/io5";

export default function Modal({
  title,
  children,
  trigger,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  footer,
  open,
  onOpenChange,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        {/* ✅ BACKDROP */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-fadeIn" />

        {/* ✅ CONTENT CENTER WRAPPER */}
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <Dialog.Content className="relative w-full max-w-sm p-10 bg-white shadow-lg  rounded-xl animate-scaleIn">
            {/* ✅ TITLE */}
            {title && (
              <div className="mb-6 text-center">
                <Dialog.Title className="text-xl font-semibold">
                  {title}
                </Dialog.Title>
              </div>
            )}

            {/* ✅ BODY */}
            <div className="mb-6 text-base text-center">{children}</div>

            {/* ✅ FOOTER */}
            {footer ? (
              <div>{footer}</div>
            ) : (
              <div className="flex justify-center gap-3">
                {/* cancel */}
                <Dialog.Close asChild>
                  <button className="px-4 py-2 text-gray-700 transition bg-white border border-gray-300 rounded-md  hover:bg-gray-100">
                    {cancelText}
                  </button>
                </Dialog.Close>

                {/* confirm */}
                <button
                  onClick={onConfirm}
                  className="
                    px-4 py-2 rounded-md 
                    bg-[var(--main-color,#3d5afe)] text-white
                    hover:opacity-90 transition
                  "
                >
                  {confirmText}
                </button>
              </div>
            )}

            {/* ✅ CLOSE BUTTON (우측 상단 X) */}
            <Dialog.Close asChild>
              <button className="absolute text-gray-500  top-4 right-4 hover:text-black">
                <IoClose size={22} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
