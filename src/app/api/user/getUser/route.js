// app/api/user/getUser/route.js
import { authenticate } from "@/lib/authenticate";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const auth = await authenticate(req);

    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { user_id } = auth;
    if (!user_id)
      return NextResponse.json(
        { errorMessage: "userId 필요" },
        { status: 400 }
      );

    const { data: user, error } = await supabase
      .from("users")
      .select("user_id, name, email, phone_number, address_id_default")
      .eq("user_id", user_id)
      .eq("status", true)
      .maybeSingle();

    if (error) throw error;
    if (!user)
      return NextResponse.json(
        { errorMessage: "존재하지 않는 회원입니다." },
        { status: 404 }
      );

    // 주소 조회
    let address = null;
    if (user.address_id_default) {
      const { data: addrData } = await supabase
        .from("address")
        .select("address_detail")
        .eq("id", user.address_id_default)
        .maybeSingle();
      address = addrData?.address_detail || null;
    }

    return NextResponse.json({ user: { ...user, address } });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { errorMessage: err.message || "서버 에러" },
      { status: 500 }
    );
  }
}
