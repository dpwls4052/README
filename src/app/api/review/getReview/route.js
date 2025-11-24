// app/api/review/getReview/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// GET /api/review/getReview?bookId=&userId=
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const bookIdParam = searchParams.get("bookId");
  const userId = searchParams.get("userId");

  let query = supabase
    .from("review")
    .select("review_id, book_id, user_id, rate, review, status, created_at")
    .order("created_at", { ascending: false });

  // 상품 상세: bookId로 필터
  if (bookIdParam) {
    const bookId = Number(bookIdParam);
    if (!Number.isNaN(bookId)) {
      query = query.eq("book_id", bookId);
    }
  }

  // 마이페이지: userId로 필터
  if (userId) {
    query = query.eq("user_id", userId);
  }

  // 관리자 페이지: 둘 다 없으면 전체 조회
  const { data, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "리뷰 조회 중 오류", detail: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
