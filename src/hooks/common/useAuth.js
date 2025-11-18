import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../lib/firebase";
import { supabase } from "@/lib/supabaseClient";

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

  const signup = async (name, email, password, phone, address) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const createdUser = userCredential.user;

      // 2) Firebase displayName 업데이트
      await updateProfile(createdUser, { displayName: name });

      // 3) Supabase users 테이블에 저장
const { data, error: supabaseError } = await supabase.from("users").insert({
  user_id: createdUser.uid,
  email,
  name,
  phone_number: phone,
  address_id_default: null,
  cart_count: 0,
});

if (supabaseError) {
  console.error("🔥 Supabase Insert Error:", supabaseError.message);
  console.error("📌 Supabase Details:", supabaseError.details);
  console.error("📌 Supabase Hint:", supabaseError.hint);
  console.error("📌 Supabase Code:", supabaseError.code);
  throw new Error("Supabase 저장 실패");
}


      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };


  // 🔥 로그아웃
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserId(null);
  };

  return { user, userId, loading, error, login, signup, logout };
}