"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  getAuth,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = getAuth();

  const oobCode = searchParams.get("oobCode");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("validating"); 
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function checkCode() {
      try {
        await verifyPasswordResetCode(auth, oobCode);
        setStatus("ready");
      } catch (error) {
        console.error(error);
        setMessage("유효하지 않거나 만료된 링크입니다.");
        setStatus("error");
      }
    }

    if (oobCode) checkCode();
  }, [oobCode]);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      console.error("RESET FAIL:", error);
      setMessage("비밀번호 재설정에 실패했습니다.");
    }
  };

  if (status === "validating") {
    return <p className="text-center mt-10">링크 확인 중...</p>;
  }

  if (status === "error") {
    return (
      <p className="text-center mt-10 text-red-700">{message}</p>
    );
  }

  return (
    <div className="max-w-[500px] mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">새 비밀번호 설정</h1>

      <div className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="새 비밀번호"
          className="border p-3 rounded"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="새 비밀번호 확인"
          className="border p-3 rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {message && (
          <p className="text-center text-sm text-red-700">{message}</p>
        )}

        <button
          onClick={handleReset}
          className="w-full py-3 bg-green-800 text-white rounded hover:bg-green-700"
        >
          비밀번호 변경
        </button>
      </div>
    </div>
  );
}
