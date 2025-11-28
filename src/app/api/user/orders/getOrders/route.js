import { authenticate } from "@/lib/authenticate";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

/**
 * 사용자의 주문 내역 조회 API
 * GET /api/user/orders/getOrders
 */
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

    // 2. user_id 필수 검증
    if (!user_id) {
      return NextResponse.json(
        { error: "user_id가 필요합니다." },
        { status: 400 }
      );
    }

    // 3. 해당 사용자의 모든 주문 조회 (최신순 정렬)
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user_id)
      .order("date", { ascending: false });

    if (ordersError) {
      console.error("❌ 주문 조회 실패:", ordersError);
      throw ordersError;
    }

    // 4. 성공 응답
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("💥 주문 조회 API 오류:", error);
    return NextResponse.json(
      { error: error.message || "주문 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
