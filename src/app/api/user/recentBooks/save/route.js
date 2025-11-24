import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { userId, bookId, title, author, image } = await req.json();

    const { error } = await supabase
      .from("user_recent_books")
      .upsert(
        {
          user_id: userId,
          book_id: bookId,
          title,
          author,
          image,
          viewed_at: new Date(),
        },
        { onConflict: "user_id,book_id" }
      );

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
