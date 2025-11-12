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
        <Dialog.Overlay className="fixed inset-0 z-40 bg-white/5 backdrop-blur-sm" />

        {/* content center wrapper */}
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <Dialog.Content
            className={`relative w-full p-20 bg-white shadow-lg rounded-xl ${maxSize}`}
          >
            {/* title */}
            {title && (
              <Dialog.Title className="text-xl font-semibold text-center">
                {title}
              </Dialog.Title>
            )}

            {/* body */}
            {children}

            <div className="flex justify-center gap-10 mt-20">
              {/* cancel */}
              {cancelText && (
                <button
                  onClick={onCancel}
                  className="px-16 py-10 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 hover:cursor-pointer"
                >
                  {cancelText}
                </button>
              )}

              {/* confirm */}
              {confirmText && (
                <button
                  onClick={onConfirm}
                  className="px-16 py-10 rounded-md bg-(--main-color) text-white hover:opacity-90 hover:cursor-pointer"
                >
                  {confirmText}
                </button>
              )}
            </div>

            {/* close button(우측 상단) */}
            <Dialog.Close asChild>
              <button className="absolute text-gray-500 top-10 right-10 hover:text-black hover:cursor-pointer">
                <IoClose size={25} />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
