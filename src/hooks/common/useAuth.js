import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../../lib/firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await fetchUserId(currentUser.uid, currentUser.email);
      } else {
        setUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserId = async (uid, email) => {
    try {
      const res = await fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, email }),
      });

      const data = await res.json();
      if (res.ok && data.user_id) {
        setUserId(data.user_id);
      }
    } catch (err) {
      console.error("userId fetch error:", err);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Firebase에서 이메일 인증 확인
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setError("이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.");
        return false;
      }

      await fetchUserId(userCredential.user.uid, userCredential.user.email);
      return true;
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("비밀번호가 올바르지 않습니다.");
      } else if (err.code === "auth/user-not-found") {
        setError("존재하지 않는 이메일입니다.");
      } else if (err.code === "auth/too-many-requests") {
        setError("너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError(err.message);
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ 이메일 인증 포함 회원가입
  const signup = async (name, email, password, phone) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "회원가입에 실패했습니다.");
      }

      if (data.success) {
        // 이메일 인증 발송 성공
        return { success: true, emailVerificationSent: true };
      }

      return { success: false };
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserId(null);
  };

  return { user, userId, loading, error, login, signup, logout };
}
