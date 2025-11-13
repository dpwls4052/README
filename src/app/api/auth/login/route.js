import { NextResponse } from "next/server";
import { loginFirebase } from "@/service/authService";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 1️⃣ Firebase 로그인 시도
    // 실패하면 catch로 넘어감
    const firebaseUser = await loginFirebase(email, password);

    // 2️⃣ Supabase에서 사용자 데이터 조회 (비밀번호 체크는 Firebase가 처리)
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) throw new Error("사용자 정보를 불러오는 중 오류가 발생했습니다.");

    // 3️⃣ 성공 시 사용자 정보 반환
    return NextResponse.json({ success: true, user: data });
  } catch (err) {
    // Firebase 인증 실패, Supabase 조회 실패 모두 catch됨
    return NextResponse.json({ success: false, error: err.message });
  }
}
