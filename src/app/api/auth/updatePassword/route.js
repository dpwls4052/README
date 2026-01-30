import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { success: false, message: "token, newPassword 모두 필요합니다." },
        { status: 400 }
      );
    }

    // 1) 토큰으로 user_id 조회
    const { data: tokenRow, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("email, expires_at")
      .eq("token", token)
      .single();

    if (tokenError || !tokenRow) {
      return NextResponse.json({
        success: false,
        message: "유효하지 않은 토큰입니다.",
      });
    }

    // 2) 만료 확인
    if (new Date(tokenRow.expires_at) < new Date()) {
      return NextResponse.json({
        success: false,
        message: "토큰이 만료되었습니다.",
      });
    }

    // 3) 새 비밀번호 해시
    const hashed = await bcrypt.hash(newPassword, 10);

    // 4) Supabase users 테이블 비밀번호 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashed })
      .eq("email", tokenRow.email);

    if (updateError) {
      return NextResponse.json({
        success: false,
        message: "비밀번호 변경 실패: " + updateError.message,
      });
    }

    // 5) 토큰 삭제
    await supabase.from("password_reset_tokens").delete().eq("token", token);

    return NextResponse.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "서버 오류: " + err.message },
      { status: 500 }
    );
  }
}
