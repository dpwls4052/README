import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email, phone_number } = await req.json();

    const cleanPhone = phone_number.replace(/[^0-9]/g, "");

    // 1) DB에서 email로 사용자 조회
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!user || error) {
      return NextResponse.json({ success: false, message: "not-found" });
    }

    // 2) DB 전화번호 포맷 정리 후 비교
    const dbPhone = user.phone_number.replace(/[^0-9]/g, "");
    if (dbPhone !== cleanPhone) {
      return NextResponse.json({ success: false, message: "not-found" });
    }

    // 3) 비밀번호 재설정 링크 만들기
    const resetLink = `http://localhost:3000/reset-password?email=${email}`;

    // 4) 실제 이메일 전송
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "비밀번호 재설정 링크",
      html: `
        <h2>비밀번호 재설정 요청</h2>
        <p>아래 링크를 눌러 비밀번호를 재설정해주세요:</p>
        <a href="${resetLink}">비밀번호 재설정하기</a>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "email-sent",
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
