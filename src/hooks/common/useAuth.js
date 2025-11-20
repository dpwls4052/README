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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        fetchUserId(currentUser.uid, currentUser.email);
      } else {
        setUserId(null);
      }
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
        console.log("유저아이디 (fetchUserId):", data.user_id);
      } else {
        console.error("user_id fetch failed:", data);
      }
    } catch (err) {
      console.error("user_id fetch error:", err);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserId(userCredential.user.uid, userCredential.user.email);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ API 라우트를 통한 회원가입
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
        // 회원가입 성공 후 자동 로그인
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await fetchUserId(userCredential.user.uid, userCredential.user.email);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
      return false;
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