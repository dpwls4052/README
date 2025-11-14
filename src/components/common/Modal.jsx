"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

export default function Modal({
  title,
  children,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  maxSize,
  bodyClassName,
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onConfirm]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-[oklch(0.54_0_0_/_0.1)]" />

        {/* content center wrapper */}
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <Dialog.Content
            className={`flex flex-col gap-20 relative w-full p-50 bg-white shadow-sm rounded-md ${maxSize}`}
          >
            {/* title */}
            {title && (
              <Dialog.Title className="text-xl font-semibold text-center">
                {title}
              </Dialog.Title>
            )}

            {/* body */}
            <div className={`flex-1 ${bodyClassName || ""}`}>{children}</div>

            <div className="flex justify-center gap-10 mt-20">
              {/* cancel */}
              {cancelText && (
                <button
                  onClick={onCancel}
                  className="px-16 py-12 font-normal text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 hover:cursor-pointer"
                >
                  {cancelText}
                </button>
              )}

              {/* confirm */}
              {confirmText && (
                <button
                  onClick={onConfirm}
                  className="px-16 py-12 rounded-md bg-(--main-color) font-normal text-white rounded-sm hover:opacity-90 hover:cursor-pointer"
                >
                  {confirmText}
                </button>
              )}
            </div>

            {/* close button(우측 상단) */}
            <Dialog.Close asChild>
              <button className="absolute text-gray-500 top-20 right-20 hover:text-black hover:cursor-pointer">
                <IoClose size={25} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
