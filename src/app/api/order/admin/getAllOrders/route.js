import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

/**
 * 관리자 전체 주문 내역 조회 API
 * POST /api/admin/orders/getAllOrders
 * Body: { user_id: string }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id } = body;

    // 1. user_id 필수 검증
    if (!user_id) {
      return NextResponse.json(
        { error: "user_id가 필요합니다." },
        { status: 400 }
      );
    }

    // 2. 관리자 권한 확인 (roles 테이블에서 role_name이 'admin'인지 확인)
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("role_name")
      .eq("user_id", user_id)
      .single();

    if (roleError || !roleData) {
      console.error("❌ 권한 조회 실패:", roleError);
      return NextResponse.json(
        { error: "권한을 확인할 수 없습니다." },
        { status: 403 }
      );
    }

    if (roleData.role_name !== "admin") {
      console.log(`⚠️ 관리자 권한 없음: ${user_id}`);
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
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

    console.log(`✅ 관리자 ${user_id}가 전체 주문 ${orders.length}건 조회 완료`);

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