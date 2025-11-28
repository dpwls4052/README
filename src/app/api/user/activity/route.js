import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { authenticate } from "@/lib/authenticate";

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

    // 주문 내역 개수
    const { count: orderCount } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id);

    // 찜한 도서 개수
    const { count: wishlistCount } = await supabase
      .from("wishlist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id);

    // 작성한 리뷰 개수
    const { count: reviewCount } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user_id);

    return NextResponse.json({
      success: true,
      orders: orderCount || 0,
      wishlist: wishlistCount || 0,
      reviews: reviewCount || 0,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
