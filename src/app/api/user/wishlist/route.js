import { supabase } from '@/lib/supabaseClient';

// POST: wishlist 추가/토글
export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, book_id } = body;

    if (!user_id || !book_id) {
      return new Response(JSON.stringify({ error: "user_id and book_id required" }), { status: 400 });
    }

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

// GET: 활성 wishlist + book 정보 조회 OR 특정 book의 wishlist 상태 확인
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    const book_id = searchParams.get('book_id');

    if (!user_id) return new Response(JSON.stringify({ error: "user_id required" }), { status: 400 });

    // 특정 book의 wishlist 상태만 확인
    if (book_id) {
      const { data: wishlist, error: wishlistError } = await supabase
        .from('wishlist')
        .select('status')
        .eq('user_id', user_id)
        .eq('book_id', book_id)
        .maybeSingle();

      if (wishlistError) throw wishlistError;

      return new Response(JSON.stringify({ status: wishlist?.status || false }), { status: 200 });
    }

    // 전체 wishlist 조회 (status true)
    const { data: wishlist, error: wishlistError } = await supabase
      .from('wishlist')
      .select('book_id, status')
      .eq('user_id', user_id)
      .eq('status', true);

    if (wishlistError) throw wishlistError;

    const bookIds = wishlist.map((w) => w.book_id);
    if (bookIds.length === 0) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // ✅ book 테이블에서 명시적으로 필요한 필드 선택 (stock 포함)
    const { data: books, error: booksError } = await supabase
      .from('book')
      .select('book_id, title, author, publisher, cover, price_standard, price_sales, stock, sales_count, status')
      .in('book_id', bookIds)
      .eq('status', true);

    if (booksError) throw booksError;

    console.log('📚 위시리스트 책 데이터:', books); // ✅ 디버깅용 로그

    // 최종 mapping (wishlist와 book 매칭)
    const result = wishlist
      .map((w) => {
        const book = books.find((b) => b.book_id === w.book_id);
        if (!book) return null; // status false인 책은 제외
        
        console.log(`📖 책 ID ${book.book_id}: stock = ${book.stock}`); // ✅ 각 책의 재고 확인
        
        return {
          ...book,
          status: w.status,
        };
      })
      .filter(Boolean); // null 제거

    console.log('✅ 최종 반환 데이터:', result); // ✅ 최종 결과 확인

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("GET wishlist error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}