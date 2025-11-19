import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

/**
 * 배송 상태 변경 API
 * POST /api/admin/orders/updateShippingStatus
 * Body: { user_id: string, order_id: string, shipping_status: string }
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { user_id, order_id, shipping_status } = body;

    // 1. 필수 필드 검증
    if (!user_id || !order_id || !shipping_status) {
      return NextResponse.json(
        { error: "user_id, order_id, shipping_status가 필요합니다." },
        { status: 400 }
      );
    }

    // 2. 관리자 권한 확인
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

    // 3. 배송 상태 유효성 검증
    const validStatuses = ["결제완료", "배송준비", "배송중", "배송완료", "주문취소"];
    if (!validStatuses.includes(shipping_status)) {
      return NextResponse.json(
        { error: "유효하지 않은 배송 상태입니다." },
        { status: 400 }
      );
    }

    // 4. 같은 order_id를 가진 모든 주문의 배송 상태 업데이트
    const { data: updatedOrders, error: updateError } = await supabase
      .from("orders")
      .update({ shipping_status })
      .eq("order_id", order_id)
      .select();

    if (updateError) {
      console.error("❌ 배송 상태 업데이트 실패:", updateError);
      throw updateError;
    }

    console.log(`✅ 주문 ${order_id}의 배송 상태를 ${shipping_status}(으)로 변경 완료 (${updatedOrders.length}건)`);

    // 5. 성공 응답
    return NextResponse.json(
      { 
        message: "배송 상태가 변경되었습니다.",
        updatedCount: updatedOrders.length,
        shipping_status 
      }, 
      { status: 200 }
    );
    
  } catch (error) {
    console.error("💥 배송 상태 변경 API 오류:", error);
    return NextResponse.json(
      { error: error.message || "배송 상태 변경 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}