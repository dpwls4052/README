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
    const { bookId, title, author, image } = await req.json();

    const { error } = await supabase.from("user_recent_books").upsert(
      {
        user_id: user_id,
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
