import { supabase } from '@/lib/supabaseClient';

// POST: wishlist 추가/토글
export async function POST(req) {
  try {
    const body = await req.json();
    const { uid, book_id } = body;

    if (!uid || !book_id) {
      return new Response(JSON.stringify({ error: "uid and book_id required" }), { status: 400 });
    }

    // uid -> user_id 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id')
      .eq('uid', uid)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    const user_id = user.user_id;

    // 기존 wishlist 조회
    const { data: existing, error: selectError } = await supabase
      .from('wishlist')
      .select('*')
      .eq('user_id', user_id)
      .eq('book_id', book_id)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      // status 토글
      const { error: updateError } = await supabase
        .from('wishlist')
        .update({ status: !existing.status, updatedat: new Date().toISOString() })
        .eq('wishlist_id', existing.wishlist_id);

      if (updateError) throw updateError;

      return new Response(JSON.stringify({ message: "Wishlist status toggled", status: !existing.status }), { status: 200 });
    } else {
      // 새로 추가
      const { error: insertError } = await supabase
        .from('wishlist')
        .insert({
          user_id,
          book_id,
          status: true,
          createdat: new Date().toISOString(),
          updatedat: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      return new Response(JSON.stringify({ message: "Wishlist created", status: true }), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// GET: 활성 wishlist + book 정보 조회
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) return new Response(JSON.stringify({ error: "uid required" }), { status: 400 });

    // uid -> user_id 조회
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('user_id')
      .eq('uid', uid)
      .maybeSingle();

    if (userError) throw userError;
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    const user_id = user.user_id;

    // wishlist 조회
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlist')
      .select('book_id, status')
      .eq('user_id', user_id)
      .eq('status', true);

    if (wishlistError) throw wishlistError;

    // book 정보 조회
    const bookIds = wishlist.map((w) => w.book_id);
    const { data: books, error: booksError } = await supabase
      .from('book')
      .select('*')
      .in('book_id', bookIds);

    if (booksError) throw booksError;

    // 최종 mapping
    const result = wishlist.map((w) => {
      const book = books.find((b) => b.book_id === w.book_id);
      return {
        ...book,
        status: w.status,
      };
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
