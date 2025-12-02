// WishListButton.jsx
"use client";

import React, { useEffect, useState } from "react";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { toast } from "sonner";
import { useWishlistCount } from "@/hooks/common/useWishlistCount"; // 추가
import { auth } from "@/lib/firebase";
import Modal from "./Modal";
import { useRouter } from "next/navigation";

export default function WishListButton({ userId, bookId, wishlist }) {
  const router = useRouter();
  const [isWished, setIsWished] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setCount } = useWishlistCount(); // Context에서 setCount 가져오기
  useEffect(() => {
    setIsWished(wishlist);
  }, [wishlist]);

  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  const toggleWishlist = async () => {
    if (!userId || !bookId) {
      setLoginModalOpen(true);
      return;
    }

    try {
      setLoading(true);

      // UI 즉시 반응
      const newIsWished = !isWished;
      setIsWished(newIsWished);

      const idToken = await auth.currentUser.getIdToken();

      // DB 요청
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          book_id: bookId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Wishlist API error:", data);
        // 실패 시 UI 되돌리기
        setIsWished((prev) => !prev);
      } else {
        // 서버에서 받은 실제 status로 업데이트
        setIsWished(data.status);

        // 🌟 여기가 핵심! Context의 count 실시간 업데이트 🌟
        setCount((prevCount) => (data.status ? prevCount + 1 : prevCount - 1));

        toast.success(
          data.status
            ? "위시리스트에 추가했습니다."
            : "위시리스트에서 제거했습니다."
        );
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      // 실패 시 UI 되돌리기
      setIsWished((prev) => !prev);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLogin = () => {
    router.push("/login");
    setLoginModalOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleWishlist}
        disabled={loading}
        className="p-4 text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
      >
        {isWished ? <IoIosHeart size={28} /> : <IoIosHeartEmpty size={28} />}
      </button>

      {/* 로그인 필요 모달 */}
      <Modal
        title="로그인이 필요한 서비스입니다."
        open={isLoginModalOpen}
        onOpenChange={setLoginModalOpen}
        confirmText="로그인 페이지로 이동"
        cancelText="취소"
        onConfirm={handleConfirmLogin}
        onCancel={() => setLoginModalOpen(false)}
        maxSize="max-w-md"
        bodyClassName="text-center text-16 font-normal"
      >
        로그인 페이지로 이동하시겠습니까?
      </Modal>
    </>
  );
}
