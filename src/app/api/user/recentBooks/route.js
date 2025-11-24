import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { userId } = await req.json();

    console.log("✅ recentBooks API userId:", userId);

    const { data, error } = await supabase
      .from("user_recent_books")
      .select("*")
      .eq("user_id", userId)
      .order("viewed_at", { ascending: false })
      .limit(10);

    console.log("✅ recentBooks result:", data, error);

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
