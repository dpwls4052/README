import { authenticate } from "@/lib/authenticate";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

/**
 * 관리자 전체 주문 내역 조회 API
 * POST /api/admin/orders/getAllOrders
 * Body: { user_id: string }
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

    const { data: roleData } = await supabase
      .from("roles")
      .select("role_name")
      .eq("user_id", user_id)
      .single();

    if (roleData?.role_name !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. 전체 주문 내역 조회 (최신순 정렬)
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .order("date", { ascending: false });

    if (ordersError) {
      console.error("❌ 주문 조회 실패:", ordersError);
      throw ordersError;
    }

    // 4. 성공 응답
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("💥 관리자 주문 조회 API 오류:", error);
    return NextResponse.json(
      { error: error.message || "주문 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
