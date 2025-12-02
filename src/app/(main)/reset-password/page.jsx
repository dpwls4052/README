"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [token, setToken] = useState(null);   // ★ 여기 중요
  const [status, setStatus] = useState("loading");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // ⭐ token을 안전하게 state에 저장
  useEffect(() => {
    const t = searchParams.get("token");
    setToken(t);
  }, [searchParams]);

  // ⭐ token이 준비되면 검증 실행
  useEffect(() => {
    if (!token) return;

    const checkToken = async () => {
      const res = await fetch("/api/auth/checkResetToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.valid) {
        setStatus("ready");
      } else {
        setStatus("invalid");
        setMessage(data.message || "유효하지 않은 링크입니다.");
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      setMessage("비밀번호를 입력해주세요.");
      return;
    }

    const res = await fetch("/api/auth/updatePassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    const data = await res.json();

    if (data.success) {
      setStatus("done");
      setMessage("비밀번호가 성공적으로 변경되었습니다.");
    } else {
      setMessage(data.message || "비밀번호 변경 실패");
    }
  };

  if (status === "loading") return <p className="text-center mt-20">링크 확인 중...</p>;

  if (status === "invalid")
    return (
      <div className="text-center mt-20">
        <p className="text-red-600 font-semibold mb-4">{message}</p>
        <button onClick={() => router.push("/login")} className="bg-green-700 p-3 text-white rounded">
          로그인 이동
        </button>
      </div>
    );

  if (status === "done")
    return (
      <div className="text-center mt-20">
        <p className="text-green-700 font-semibold mb-4">{message}</p>
        <button onClick={() => router.push("/login")} className="bg-green-700 p-3 text-white rounded">
          로그인 이동
        </button>
      </div>
    );

  // status === "ready"
  return (
    <div className="w-full max-w-[400px] mx-auto mt-20">
      <h1 className="text-2xl font-bold text-center mb-4">새 비밀번호 설정</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="새 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded"
        />

        {message && <p className="text-red-600 text-sm">{message}</p>}

        <button className="w-full bg-green-700 text-white py-3 rounded">비밀번호 변경하기</button>
      </form>
    </div>
  );
}
