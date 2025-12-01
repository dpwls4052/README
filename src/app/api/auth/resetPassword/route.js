import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 👉 SMTP 설정 (Gmail or Naver 등 사용 가능)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // smtp.gmail.com / smtp.naver.com 등
  port: Number(process.env.SMTP_PORT), 
  secure: true,                     // 465이면 true
  auth: {
    user: process.env.EMAIL_USER,         // 발송 이메일
    pass: process.env.EMAIL_PASSWORD,     // 앱 비밀번호(SMTP 비번)
  },
});

export async function POST(req) {
  try {
    const { email, phone_number } = await req.json();

    if (!email || !phone_number) {
      return NextResponse.json({
        success: false,
        message: "이메일과 전화번호를 모두 입력해주세요.",
      });
    }

    const cleanPhone = phone_number.replace(/[^0-9]/g, "");

    // 1) 사용자 조회
    const { data: user, error: dbError } = await supabase
      .from("users")
      .select("id, email, phone_number")
      .eq("email", email)
      .maybeSingle();

    if (dbError || !user) {
      return NextResponse.json({
        success: false,
        message: "입력한 정보와 일치하는 계정을 찾을 수 없습니다.",
      });
    }

    const dbPhone = (user.phone_number ?? "").replace(/[^0-9]/g, "");
    if (dbPhone !== cleanPhone) {
      return NextResponse.json({
        success: false,
        message: "입력한 정보와 일치하는 계정을 찾을 수 없습니다.",
      });
    }

    // 2) 토큰 생성
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3) 10분 유효기간
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    // 4) 이전 토큰 삭제 후 새 토큰 저장
    await supabase
      .from("password_reset_tokens")
      .delete()
      .eq("user_id", user.id);

    await supabase.from("password_reset_tokens").insert({
      user_id: user.id,
      token: resetToken,
      expires_at: expiresAt,
    });

    // 5) 사용자에게 보낼 URL
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, '');
    const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

    // 6) 이메일 전송
    await transporter.sendMail({
      from: `"README 비밀번호 재설정" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "비밀번호 재설정 링크",
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: auto;">
          <h2 style="color: #2d6a4f;">비밀번호 재설정 요청</h2>
          <p>안녕하세요.</p>
          <p>아래 버튼을 클릭하여 비밀번호를 재설정해주세요.</p>

          <div style="margin: 30px 0; text-align: center;">
            <a href="${resetLink}"
               style="background: #2d6a4f; color: white; padding: 12px 24px;
                      border-radius: 5px; text-decoration: none;">
              비밀번호 재설정하기
            </a>
          </div>

          <p style="color: #666; font-size: 14px;">
            * 이 링크는 10분 동안 유효합니다.<br>
            * 요청하지 않으셨다면 이 이메일을 무시하세요.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
    });

  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: `서버 오류: ${err.message}`,
      },
      { status: 500 }
    );
  }
}
