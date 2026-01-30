// src/services/authService.js
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification 
} from 'firebase/auth';

export async function signupFirebase(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function loginFirebase(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * 이메일 인증이 포함된 Firebase 회원가입
 * @param {string} email - 사용자 이메일
 * @param {string} password - 사용자 비밀번호
 * @returns {Promise<Object>} Firebase 사용자 객체
 */
export async function signupFirebaseWithVerification(email, password) {
  try {
    // 1. Firebase 계정 생성
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. 인증 이메일 발송
    // ✅ 환경에 따라 올바른 URL 설정
    const verificationUrl = process.env.NODE_ENV === 'production'
      ? 'https://readme-kt-2025.vercel.app/login'
      : 'http://localhost:3000/login';

    await sendEmailVerification(user, {
      url: verificationUrl,
      handleCodeInApp: false, // Firebase 기본 핸들러 사용
    });

    // console.log("✅ 인증 이메일 발송 완료:", email);
    // console.log("✅ 리디렉션 URL:", verificationUrl);

    // 3. 자동 로그아웃 (이메일 인증 전까지 로그인 불가)
    await auth.signOut();

    return user;
  } catch (error) {
    console.error("❌ Firebase 회원가입 오류:", error);
    throw error;
  }
}