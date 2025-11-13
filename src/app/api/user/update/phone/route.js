import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { user_id, newPhone } = await req.json();

    if (!user_id || !newPhone) {
      return NextResponse.json({ error: "user_id와 newPhone이 필요합니다." }, { status: 400 });
    }

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", user_id)
      .eq("status", true)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!user) return NextResponse.json({ error: "탈퇴한 회원이거나 존재하지 않는 회원입니다." }, { status: 404 });

    const { error: updateError } = await supabase
      .from("users")
      .update({ phone_number: newPhone })
      .eq("user_id", user_id);

    if (updateError) throw updateError;

    return NextResponse.json({ message: "전화번호 변경 완료" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
