import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderItems } = body;

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json(
        { success: false, message: "검증할 상품이 없습니다." },
        { status: 400 }
      );
    }

    const stockIssues = [];

    // 각 상품의 재고 확인
    for (const item of orderItems) {
      const bookId = item.book_id || item.id || item.bookId;
      
      if (!bookId) {
        stockIssues.push({
          title: item.title,
          issue: "상품 ID를 찾을 수 없습니다.",
        });
        continue;
      }

      const { data: bookData, error } = await supabase
        .from("book")
        .select("stock, title")
        .eq("book_id", bookId)
        .single();

      if (error || !bookData) {
        stockIssues.push({
          title: item.title,
          issue: "상품 정보를 찾을 수 없습니다.",
        });
        continue;
      }

      const currentStock = bookData.stock || 0;
      const requestedQuantity = item.quantity || 1;

      if (currentStock < requestedQuantity) {
        stockIssues.push({
          title: bookData.title,
          requestedQuantity,
          availableStock: currentStock,
          issue: `재고 부족 (요청: ${requestedQuantity}개, 재고: ${currentStock}개)`,
        });
      }
    }

    if (stockIssues.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "일부 상품의 재고가 부족합니다.",
          stockIssues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "모든 상품의 재고가 충분합니다.",
    });
  } catch (error) {
    console.error("재고 검증 중 오류:", error);
    return NextResponse.json(
      { success: false, message: `서버 오류: ${error.message}` },
      { status: 500 }
    );
  }
}