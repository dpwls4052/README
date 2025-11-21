"use client";

import { useState } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const email =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("email")
      : "";

  const handleSubmit = async () => {
    if (!password) {
      alert("비밀번호를 입력하세요.");
      return;
    }

    const res = await fetch("/api/auth/updatePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        newPassword: password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("비밀번호가 성공적으로 변경되었습니다. 로그인 해주세요!");
    } else {
      setMessage("오류 발생: " + data.error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">비밀번호 재설정</h2>

      <input
        type="password"
        placeholder="새 비밀번호"
        className="w-full p-2 border rounded mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-green-700 text-white py-2 rounded"
        onClick={handleSubmit}
      >
        비밀번호 변경하기
      </button>

      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
