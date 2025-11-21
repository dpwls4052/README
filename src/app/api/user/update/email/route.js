// app/api/user/updateEmail/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { userId, newEmail } = await req.json();

    if (!userId || !newEmail) {
      return NextResponse.json(
        { errorMessage: "userId와 newEmail은 필수입니다." },
        { status: 400 }
      );
    }

    // 사용자 존재 여부 체크
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", userId)
      .eq("status", true)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!user) {
      return NextResponse.json(
        { errorMessage: "탈퇴했거나 존재하지 않는 회원입니다." },
        { status: 404 }
      );
    }

    // 이메일 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({ email: newEmail })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    return NextResponse.json({ message: "emailUpdateSuccess" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { errorMessage: err.message || "서버 에러" },
      { status: 500 }
    );
  }
}
