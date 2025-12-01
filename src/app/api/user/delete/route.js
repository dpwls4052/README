import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { authenticate } from "@/lib/authenticate";

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

    if (!user_id) {
      return NextResponse.json({ success: false, error: "userId is required" });
    }

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
