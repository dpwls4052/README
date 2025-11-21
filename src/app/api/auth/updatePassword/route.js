import { NextResponse } from "next/server";
import admin from "@/lib/firebaseAdmin"; 
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { email, newPassword } = await req.json();

    if (!email || !newPassword) {
      return NextResponse.json({
        success: false,
        error: "email, newPassword 모두 필요합니다."
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("uid") 
      .eq("email", email)
      .maybeSingle();

    if (error || !user) {
      return NextResponse.json({
        success: false,
        error: "해당 이메일의 사용자를 찾지 못했습니다."
      });
    }

    const uid = user.uid;

    await admin.auth().updateUser(uid, {
      password: newPassword,
    });

    return NextResponse.json({
      success: true,
      message: "비밀번호 업데이트 성공!",
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
