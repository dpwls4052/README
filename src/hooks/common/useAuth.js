import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { auth } from "../../lib/firebase";
import { useState, useEffect } from "react";



import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔥 로그인
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔥🔥 회원가입 (Firestore 저장 포함)
  const signup = async (name, email, password, phone, address) => {
    setLoading(true);
    setError(null);

    try {
      // 1) Firebase Auth 사용자 생성
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
      console.error("회원가입 에러:", err);
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
  };

  return { user, loading, error, login, signup, logout };
}