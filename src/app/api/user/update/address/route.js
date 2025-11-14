// TODO 주소록 여러개 등록하는거 / 유저 default 에 추가하는거

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    // query parameter에서 user_id와 address_id 받기
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    const address_id = searchParams.get("address_id");

    if (!user_id || !address_id) {
      return NextResponse.json({ error: "user_id와 address_id가 필요합니다." }, { status: 400 });
    }

    // status: true인 회원인지 먼저 확인
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", user_id)
      .eq("status", true)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) {
      return NextResponse.json({ error: "탈퇴한 회원이거나 존재하지 않는 회원입니다." }, { status: 404 });
    }

    // address 테이블에서 해당 user_id + address_id 조회
    const { data: address, error: addressError } = await supabase
      .from("address")
      .select("*")
      .eq("user_id", user_id)
      .eq("id", address_id)
      .maybeSingle();

    if (addressError) throw addressError;
    if (!address) {
      return NextResponse.json({ error: "해당 주소를 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ address });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
