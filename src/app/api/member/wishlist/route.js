import { supabase } from '@/lib/supabaseClient';

// http://localhost:3000/api/member/wishlist

//{
//   "user_id": 4,
//   "book_id": 1
// }

// POST: 위시리스트 추가 / 토글 (논리 삭제)
export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, book_id } = body;

    if (!user_id || !book_id)
      return new Response(JSON.stringify({ error: "user_id and book_id required" }), { status: 400 });

    // 기존 데이터 조회
    const { data: existing, error: selectError } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user_id)
      .eq("book_id", book_id)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      // status 토글 (논리 삭제)
      const { data, error } = await supabase
        .from("wishlist")
        .update({
          status: !existing.status,
          updatedat: new Date().toISOString(),
        })
        .eq("wishlist_id", existing.wishlist_id);

      if (error) throw error;

      return new Response(
        JSON.stringify({ message: "Wishlist status toggled", status: !existing.status }),
        { status: 200 }
      );
    } else {
      // 새로 추가
      const { data, error } = await supabase
        .from("wishlist")
        .insert({
          user_id,
          book_id,
          status: true,
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString(),
        });

      if (error) throw error;

      return new Response(JSON.stringify({ message: "Wishlist created", status: true }), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// http://localhost:3000/api/member/wishlist?user_id={user_id}


// GET: 활성화된 위시리스트 조회
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id)
      return new Response(JSON.stringify({ error: "user_id required" }), { status: 400 });

    const { data: items, error } = await supabase
      .from("wishlist")
      .select("*")
      .eq("user_id", user_id)
      .eq("status", true);

    if (error) throw error;

    return new Response(JSON.stringify(items), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
