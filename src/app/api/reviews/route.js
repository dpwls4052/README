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
    .eq("status", true)
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

// PATCH /api/reviews  → 리뷰 수정
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { reviewId, rate, review, status } = body;

    console.log("PATCH /api/reviews body:", body);

    if (!reviewId) {
      return NextResponse.json(
        { message: "reviewId는 필수입니다." },
        { status: 400 }
      );
    }

    // ✅ 1) 삭제/복구 (status가 boolean으로 온 경우)
    if (typeof status === "boolean") {
      const { data, error } = await supabase
        .from("review") // ⚠️ 테이블명 꼭 확인
        .update({
          status,
        })
        .eq("review_id", reviewId)
        .select();

      console.log("status update result:", { data, error });

      if (error) {
        console.error("리뷰 상태 변경 supabase 오류:", error);
        return NextResponse.json(
          { message: "리뷰 상태 변경 중 오류", detail: error.message },
          { status: 500 }
        );
      }

      if (!data || data.length === 0) {
        return NextResponse.json(
          {
            message: "해당 리뷰를 찾을 수 없습니다.",
            detail: "no row updated",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(data[0], { status: 200 });
    }

    // ✅ 2) 내용/평점 수정 (status 안 보낼 때)
    if (!rate || !review) {
      return NextResponse.json(
        { message: "rate, review는 필수입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("review")
      .update({
        rate,
        review,
      })
      .eq("review_id", reviewId)
      .select();

    console.log("review update result:", { data, error });

    if (error) {
      console.error("리뷰 수정 오류:", error);
      return NextResponse.json(
        { message: "리뷰 수정 중 오류", detail: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { message: "해당 리뷰를 찾을 수 없습니다.", detail: "no row updated" },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (e) {
    console.error("리뷰 PATCH 서버 오류:", e);
    return NextResponse.json(
      { message: "리뷰 수정 중 오류", detail: e.message },
      { status: 500 }
    );
  }
}
