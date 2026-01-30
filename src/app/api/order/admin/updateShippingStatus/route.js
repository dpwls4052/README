import { authenticate } from "@/lib/authenticate";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

/**
 * 배송 상태 변경 API
 * PATCH /api/admin/orders/updateShippingStatus
 * Body: { order_number: string, shipping_status: string }
 */
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

    const { data: roleData } = await supabase
      .from("roles")
      .select("role_name")
      .eq("user_id", user_id)
      .single();

    if (roleData?.role_name !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { order_number, shipping_status } = body;

    // 1. 필수 필드 검증
    if (!order_number || !shipping_status) {
      return NextResponse.json(
        { error: "order_number, shipping_status가 필요합니다." },
        { status: 400 }
      );
    }

    // 3. 배송 상태 유효성 검증
    const validStatuses = [
      "결제완료",
      "배송준비",
      "배송중",
      "배송완료",
      "주문취소",
    ];
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
      .eq("order_number", order_number)
      .select();

    if (updateError) {
      console.error("❌ 배송 상태 업데이트 실패:", updateError);
      throw updateError;
    }

    // 5. 성공 응답
    return NextResponse.json(
      {
        message: "배송 상태가 변경되었습니다.",
        updatedCount: updatedOrders.length,
        shipping_status,
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
