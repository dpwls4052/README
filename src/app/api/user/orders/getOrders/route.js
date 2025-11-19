import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

/**
 * 사용자의 주문 내역 조회 API
 * POST /api/user/orders/getOrders
 * Body: { user_id: string }
 */
export async function POST(req) {
  try {
    // 1. body에서 user_id 추출
    const body = await req.json();
    const { user_id } = body;

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

    console.log(`✅ ${user_id} 사용자의 주문 ${orders.length}건 조회 완료`);

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