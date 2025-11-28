import { NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const auth = await authenticate(req);

    if (auth.error) {
      return NextResponse.json(
        { isAdmin: false, message: auth.error },
        { status: auth.status }
      );
    }

    const { user_id } = auth;

    const { data: roleData, error } = await supabase
      .from("roles")
      .select("role_name")
      .eq("user_id", user_id)
      .single();

    if (error) {
      return NextResponse.json(
        { isAdmin: false, message: "Role not found" },
        { status: 404 }
      );
    }

    if (roleData?.role_name !== "admin") {
      return NextResponse.json(
        { isAdmin: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // ✅ admin 권한 확인 성공
    return NextResponse.json({ isAdmin: true }, { status: 200 });
  } catch (err) {
    console.error("Verify admin error:", err);
    return NextResponse.json(
      { isAdmin: false, message: err.message },
      { status: 500 }
    );
  }
}
