import { authenticate } from "@/lib/authenticate";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
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
      return new Response(JSON.stringify({ error: "user_id required" }), {
        status: 400,
      });
    }

    // 전체 wishlist 조회 (status true)
    const { data: wishlist, error: wishlistError } = await supabase
      .from("wishlist")
      .select("book_id")
      .eq("user_id", user_id)
      .eq("status", true);

    if (wishlistError) throw wishlistError;

    // 책 ID만 배열로 반환
    const bookIds = wishlist.map((w) => w.book_id);

    return new Response(JSON.stringify(bookIds), { status: 200 });
  } catch (err) {
    console.error("GET wishlist error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
