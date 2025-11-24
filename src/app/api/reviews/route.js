// app/api/reviews/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// -------------------------------------------
// POST /api/reviews  → 리뷰 생성
// -------------------------------------------
export async function POST(req) {
  try {
    const body = await req.json();
    const { bookId, userId, rate, review } = body;

    if (!bookId || !userId || !rate || !review) {
      return NextResponse.json(
        { message: "bookId, userId, rate, review는 필수입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("review") // 테이블 이름 그대로 review
      .insert({
        book_id: bookId,
        user_id: userId,
        rate,
        review,
        status: true,
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: "리뷰 생성 중 오류", detail: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "서버 오류", detail: e.message },
      { status: 500 }
    );
  }
}

// -------------------------------------------
// GET /api/reviews?bookId=&userId=
// -------------------------------------------
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const bookIdParam = searchParams.get("bookId");
  const userId = searchParams.get("userId");

  let query = supabase
    .from("review")
    .select("review_id, book_id, user_id, rate, review, status, created_at")
    .order("created_at", { ascending: false });

  // bookId 필터
  if (bookIdParam) {
    const bookId = Number(bookIdParam);
    if (!Number.isNaN(bookId)) {
      query = query.eq("book_id", bookId);
    }
  }

  // userId 필터
  if (userId) {
    query = query.eq("user_id", userId);
  }

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
