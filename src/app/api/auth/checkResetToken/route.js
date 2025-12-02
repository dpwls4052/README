import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ valid: false, message: "토큰이 없습니다." });
    }

    const { data, error } = await supabase
      .from("password_reset_tokens")
      .select("email, expires_at")
      .eq("token", token)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ valid: false, message: "토큰이 유효하지 않습니다." });
    }

    const now = new Date();
    const expiresAt = new Date(data.expires_at);

    if (expiresAt < now) {
      // 만료된 토큰은 삭제
      await supabase.from("password_reset_tokens").delete().eq("token", token);
      return NextResponse.json({ valid: false, message: "토큰이 만료되었습니다." });
    }

    return NextResponse.json({ valid: true });
  } catch (err) {
    return NextResponse.json(
      { valid: false, message: `서버 오류: ${err.message}` },
      { status: 500 }
    );
  }
}
