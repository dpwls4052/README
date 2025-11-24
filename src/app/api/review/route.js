// app/api/review/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

// POST /api/review
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
      .from("review")
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
