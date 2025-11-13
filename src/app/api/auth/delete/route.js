// @/app/api/auth/deleteUser/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// POST /api/auth/delete
// 구조 ** 필수값
// {
//   "email": "test@gmail.com",
//   "phone_number": "01011112222",
//   "name": "이름"
// }

export async function POST(req) {
  try {
    const { email, phone_number, name } = await req.json();

    if (!email || !phone_number || !name) {
      return NextResponse.json({ error: "이메일, 전화번호, 이름을 모두 입력해주세요." }, { status: 400 });
    }

    // Supabase에서 세 가지 조건 일치 계정 찾기
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("user_id")
      .eq("email", email)
      .eq("phone_number", phone_number)
      .eq("name", name)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!user) return NextResponse.json({ error: "입력하신 정보와 일치하는 계정이 없습니다." }, { status: 404 });

    // status 컬럼을 false로 변경 (삭제 X)
    const { error: updateError } = await supabase
      .from("users")
      .update({ status: false })
      .eq("user_id", user.user_id);

    if (updateError) {
      console.error("회원 탈퇴 오류:", updateError);
      return NextResponse.json({ error: "탈퇴 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "회원 탈퇴 완료" }, { status: 200 });
  } catch (err) {
    console.error("서버 에러:", err);
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
