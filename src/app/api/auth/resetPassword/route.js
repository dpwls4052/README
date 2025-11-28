import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Gmail 전송 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(req) {
  try {
    const { email, phone_number } = await req.json();

    // console.log("📧 비밀번호 재설정 요청:", { email, phone_number });

    if (!email || !phone_number) {
      // console.error("❌ 필수 필드 누락");
      return NextResponse.json({ 
        success: false, 
        message: "이메일과 전화번호를 모두 입력해주세요." 
      });
    }

    const cleanPhone = phone_number.replace(/[^0-9]/g, "");
    // console.log("🔍 정리된 전화번호:", cleanPhone);

    const { data: user, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (dbError) {
      // console.error("❌ DB 조회 오류:", dbError);
      return NextResponse.json({ 
        success: false, 
        message: "데이터베이스 오류가 발생했습니다." 
      });
    }

    if (!user) {
      // console.log("⚠️ 사용자를 찾을 수 없음");
      return NextResponse.json({ 
        success: false, 
        message: "입력한 정보와 일치하는 계정을 찾을 수 없습니다." 
      });
    }

    const dbPhone = (user.phone_number ?? "").replace(/[^0-9]/g, "");
    // console.log("📱 DB 전화번호:", dbPhone);
    
    if (dbPhone !== cleanPhone) {
      // console.log("⚠️ 전화번호 불일치");
      return NextResponse.json({ 
        success: false, 
        message: "입력한 정보와 일치하는 계정을 찾을 수 없습니다." 
      });
    }

    // console.log("✅ 사용자 인증 완료");

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, '');
    const resetLink = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}`;
    // console.log("🔗 재설정 링크:", resetLink);

    // console.log("📤 이메일 전송 시도...");
    
    await transporter.sendMail({
      from: `"README 비밀번호 재설정" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "비밀번호 재설정 링크",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d6a4f;">비밀번호 재설정 요청</h2>
          <p>안녕하세요,</p>
          <p>비밀번호 재설정을 요청하셨습니다. 아래 버튼을 클릭하여 새 비밀번호를 설정해주세요:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #2d6a4f; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              비밀번호 재설정하기
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            이 링크는 24시간 동안 유효합니다.<br>
            요청하지 않으셨다면 이 이메일을 무시하셔도 됩니다.
          </p>
        </div>
      `,
    });

    // console.log("✅ 이메일 전송 성공");

    return NextResponse.json({
      success: true,
      message: "비밀번호 재설정 링크가 이메일로 전송되었습니다.",
    });

  } catch (err) {
    // console.error("💥 POST /api/auth/resetPassword error:", err);
    return NextResponse.json({
      success: false,
      message: `서버 오류: ${err.message}`,
    }, { status: 500 });
  }
}