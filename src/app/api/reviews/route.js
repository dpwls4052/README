// app/api/reviews/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { authenticate } from "@/lib/authenticate";

// -------------------------------------------
// POST /api/reviews  → 리뷰 생성
// -------------------------------------------
export async function POST(req) {
  try {
    const body = await req.json();
    const { bookId, rate, review } = body;

    const auth = await authenticate(req);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }
    const { user_id } = auth;

    if (!bookId || !user_id || !rate || !review) {
      return NextResponse.json(
        { message: "bookId, userId, rate, review는 필수입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("review")
      .insert({
        book_id: bookId,
        user_id: user_id,
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
  const userIdParam = searchParams.get("userId");

  let user_id = null;
  if (userIdParam) {
    const auth = await authenticate(req);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }
    user_id = auth.user_id;
  }
  let query = supabase
    .from("review")
    .select(
      `
      review_id, 
      book_id, 
      user_id, 
      rate, 
      review, 
      status, 
      created_at,
      users (name)
    `
    )
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
  if (user_id) {
    query = query.eq("user_id", user_id);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error);
    return NextResponse.json(
      { message: "리뷰 조회 중 오류", detail: error.message },
      { status: 500 }
    );
  }

  // 사용자 이름 마스킹 처리
  const maskedData = data.map((review) => {
    const fullName = review.users?.name || "익명";
    const firstChar = fullName.charAt(0);
    const maskedName = firstChar + "**";

    // users 객체 제거하고 필드 추가
    const { users, ...reviewData } = review;

    return {
      ...reviewData,
      author: maskedName,
      firstChar: firstChar,
    };
  });

  return NextResponse.json(maskedData, { status: 200 });
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

    // 인증: 로그인한 유저만 수정/삭제 가능
    const auth = await authenticate(req);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }
    const { user_id } = auth;

    // 1) 삭제/복구 (status가 boolean으로 온 경우)
    if (typeof status === "boolean") {
      const { data, error } = await supabase
        .from("review")
        .update({
          status,
        })
        .eq("review_id", reviewId)
        .eq("user_id", user_id)
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
      .eq("user_id", user_id)
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
