// app/api/user/updatePhone/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { userId, newPhone } = await req.json();

    // 필수 값 체크
    if (!userId || !newPhone) {
      return NextResponse.json(
        { errorMessage: "userId와 newPhone은 필수입니다." },
        { status: 400 }
      );
    }

    // status가 true인 사용자만 조회
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

    // 전화번호 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({ phone_number: newPhone })
      .eq("user_id", userId);

    if (updateError) throw updateError;

    return NextResponse.json({ message: "phoneUpdateSuccess" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { errorMessage: err.message || "서버 에러" },
      { status: 500 }
    );
  }
}
