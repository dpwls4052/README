import { NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";
import { supabase } from "@/lib/supabaseClient";

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

    const { data, error } = await supabase
      .from("user_recent_books")
      .select("*")
      .eq("user_id", user_id)
      .order("viewed_at", { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      books: data,
    });
  } catch (err) {
    console.error("🔥 recentBooks API Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
