import { supabase } from '@/lib/supabaseClient';

// GET: 장바구니 조회 (최신순)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    if (!user_id) return new Response(JSON.stringify({ error: "user_id required" }), { status: 400 });

    const { data: cartItems, error: cartError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', true)
      .order('created_at', { ascending: false }); // 최신순 정렬
    if (cartError) throw cartError;

    if (!cartItems || cartItems.length === 0) return new Response(JSON.stringify([]), { status: 200 });

    const bookIds = cartItems.map(c => c.book_id);
    const { data: books, error: booksError } = await supabase
      .from('book')
      .select('*')
      .in('book_id', bookIds)
      .eq('status', true);
    if (booksError) throw booksError;

    const result = cartItems.map(c => {
      const book = books.find(b => b.book_id === c.book_id);
      return {
        ...book,
        amount: c.amount,
        cart_id: c.cart_id,
        created_at: c.created_at,
      };
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("Cart GET error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: 장바구니 추가 / 수량 증가
export async function POST(req) {
  try {
    const { user_id, book_id } = await req.json();
    if (!user_id || !book_id) return new Response(JSON.stringify({ error: "user_id, book_id required" }), { status: 400 });

    const { data: existing, error: selectError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user_id)
      .eq('book_id', book_id)
      .maybeSingle();
    if (selectError) throw selectError;

    if (existing) {
      // 이미 존재하면 amount 1 증가
      const { error: updateError } = await supabase
        .from('cart')
        .update({ amount: existing.amount + 1, status: true })
        .eq('cart_id', existing.cart_id);
      if (updateError) throw updateError;

      return new Response(JSON.stringify({ message: "Cart amount increased", amount: existing.amount + 1 }), { status: 200 });
    } else {
      const { error: insertError } = await supabase
        .from('cart')
        .insert({ user_id, book_id, amount: 1, status: true, created_at: new Date().toISOString() });
      if (insertError) throw insertError;

      return new Response(JSON.stringify({ message: "Cart created", amount: 1 }), { status: 200 });
    }
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// PATCH: 수량 변경
export async function PATCH(req) {
  try {
    const { cartId, delta } = await req.json();
    if (!cartId || delta === 0) return new Response(JSON.stringify({ message: "No change" }), { status: 200 });

    const { data: cartItem, error: cartError } = await supabase
      .from('cart')
      .select('*')
      .eq('cart_id', cartId)
      .maybeSingle();
    if (cartError) throw cartError;
    if (!cartItem) return new Response(JSON.stringify({ error: "Cart item not found" }), { status: 404 });

    const newAmount = cartItem.amount + delta;
    if (newAmount < 1) {
      return new Response(JSON.stringify({ message: "Minimum 1개 유지", amount: cartItem.amount }), { status: 200 });
    }

    const { error: updateError } = await supabase
      .from('cart')
      .update({ amount: newAmount })
      .eq('cart_id', cartId);
    if (updateError) throw updateError;

    return new Response(JSON.stringify({ message: "Amount updated", amount: newAmount }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// DELETE: 선택 삭제 / 전체 삭제
export async function DELETE(req) {
  try {
    const { cartIds } = await req.json();
    if (!cartIds || cartIds.length === 0) 
      return new Response(JSON.stringify({ error: "cartIds required" }), { status: 400 });

    const { error: deleteError } = await supabase
      .from('cart')
      .delete()
      .in('cart_id', cartIds);

    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({ message: "삭제 완료" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
