// API (Supabase)

import { supabase } from '@/lib/supabaseClient';

// GET: 활성 장바구니 + book 정보 조회
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
      .order('created_at', { ascending: false }); 
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
        cartId: c.cart_id,
      };
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error("Cart GET error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: 장바구니 추가 / 재추가
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
      // 재추가
      const { error: updateError } = await supabase
        .from('cart')
        .update({ status: true, amount: 1 })
        .eq('cart_id', existing.cart_id);
      if (updateError) throw updateError;

      return new Response(JSON.stringify({ message: "Cart re-added", amount: 1 }), { status: 200 });
    } else {
      // 새로 추가
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
    const { cartIds } = await req.json(); // array of cart_id
    if (!cartIds || cartIds.length === 0) return new Response(JSON.stringify({ error: "cartIds required" }), { status: 400 });

    const { error } = await supabase
      .from('cart')
      .update({ status: false, amount: 0 })
      .in('cart_id', cartIds);

    if (error) throw error;
    return new Response(JSON.stringify({ message: "Cart items removed" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
