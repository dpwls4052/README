import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabaseClient';
import { authenticate } from "@/lib/authenticate";

// GET: 장바구니 조회 (최신순)
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

    const { data: cartItems, error: cartError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', true)
      .order('created_at', { ascending: false });

    if (cartError) throw cartError;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

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

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("Cart GET error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// POST: 장바구니 추가 / 수량 증가
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
    const { book_id } = await req.json();

    if (!book_id) {
      return NextResponse.json(
        { error: "book_id required" },
        { status: 400 }
      );
    }

    const { data: existing, error: selectError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', user_id)
      .eq('book_id', book_id)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      const { error: updateError } = await supabase
        .from('cart')
        .update({ amount: existing.amount + 1, status: true })
        .eq('cart_id', existing.cart_id);

      if (updateError) throw updateError;

      return NextResponse.json(
        { message: "Cart amount increased", amount: existing.amount + 1 },
        { status: 200 }
      );
    } else {
      const { error: insertError } = await supabase
        .from('cart')
        .insert({
          user_id,
          book_id,
          amount: 1,
          status: true,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      return NextResponse.json(
        { message: "Cart created", amount: 1 },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("Cart POST error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// PATCH: 수량 변경
export async function PATCH(req) {
  try {
    const auth = await authenticate(req);

    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { user_id } = auth;
    const { cartId, delta } = await req.json();

    if (!cartId || delta === 0) {
      return NextResponse.json(
        { message: "No change" },
        { status: 200 }
      );
    }

    // 본인 장바구니 항목인지 확인
    const { data: cartItem, error: cartError } = await supabase
      .from('cart')
      .select('*')
      .eq('cart_id', cartId)
      .eq('user_id', user_id)
      .maybeSingle();

    if (cartError) throw cartError;

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found or unauthorized" },
        { status: 404 }
      );
    }

    const newAmount = cartItem.amount + delta;

    if (newAmount < 1) {
      return NextResponse.json(
        { message: "Minimum 1개 유지", amount: cartItem.amount },
        { status: 200 }
      );
    }

    const { error: updateError } = await supabase
      .from('cart')
      .update({ amount: newAmount })
      .eq('cart_id', cartId);

    if (updateError) throw updateError;

    return NextResponse.json(
      { message: "Amount updated", amount: newAmount },
      { status: 200 }
    );
  } catch (err) {
    console.error("Cart PATCH error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// DELETE: 선택 삭제 / 전체 삭제
export async function DELETE(req) {
  try {
    const auth = await authenticate(req);

    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { user_id } = auth;
    const { cartIds } = await req.json();

    if (!cartIds || cartIds.length === 0) {
      return NextResponse.json(
        { error: "cartIds required" },
        { status: 400 }
      );
    }

    // 본인 장바구니 항목만 삭제
    const { error: deleteError } = await supabase
      .from('cart')
      .delete()
      .in('cart_id', cartIds)
      .eq('user_id', user_id);

    if (deleteError) throw deleteError;

    return NextResponse.json(
      { message: "삭제 완료" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Cart DELETE error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}