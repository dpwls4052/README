import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../lib/firebase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(() => {
    // 초기값으로 localStorage에 저장된 값 가져오기
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId") || null;
    }
    return null;
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        fetchUserId(currentUser.uid, currentUser.email);
      } else {
        setUserId(null);
        localStorage.removeItem("userId");
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
        if (typeof window !== "undefined") localStorage.setItem("userId", data.user_id);
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
      await fetchUserId(userCredential.user.uid, userCredential.user.email); // 로그인 직후 Supabase user_id 가져오기
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password, phone, address) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      return true;
    } catch (err) {
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
    if (typeof window !== "undefined") localStorage.removeItem("userId");
  };

  return { user, userId, loading, error, login, signup, logout };
}
