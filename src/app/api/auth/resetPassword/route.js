// @/app/api/auth/resetPassword/route.js
import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { supabase } from "@/lib/supabaseClient";

// POST /api/auth/resetPassword
// 구조 ** 필수값
// {
//   "email": "test@example.com",
//   "phone_number": "010-1111-2222",
//   "name": "홍길동"
// }

export async function POST(req) {
  try {
    const { email, phone_number, name } = await req.json();

    if (!email || !phone_number || !name) {
      throw new Error("이메일, 전화번호, 이름을 모두 입력해주세요.");
    }

    // Supabase에서 세 가지 조건 일치 확인
    const { data: user, error } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .eq("phone_number", phone_number)
      .eq("name", name)
      .maybeSingle();

    if (error) throw error;
    if (!user) throw new Error("입력하신 정보와 일치하는 계정이 없습니다.");

    // Firebase 비밀번호 재설정 메일 발송
    await sendPasswordResetEmail(auth, user.email);

    return NextResponse.json({
      success: true,
      message: "비밀번호 재설정 메일을 발송했습니다.",
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
