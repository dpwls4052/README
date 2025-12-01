import { authenticate } from "@/lib/authenticate";
import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const auth = await authenticate(req);

    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { user_id } = auth;
    const { bookId, title, author, image } = await req.json();

    // 1. 해당 유저의 최근 본 도서 개수 조회
    const { data: existingBooks, error: countError } = await supabase
      .from("user_recent_books")
      .select("book_id, viewed_at")
      .eq("user_id", user_id)
      .order("viewed_at", { ascending: false });

    if (countError) throw countError;

    // 2. 현재 bookId가 이미 존재하는지 확인
    const existingBookIndex = existingBooks?.findIndex(
      (book) => Number(book.book_id) === bookId
    );

    if (existingBookIndex !== -1) {
      // 이미 존재하는 경우: viewed_at만 업데이트
      const { error: updateError } = await supabase
        .from("user_recent_books")
        .update({ viewed_at: new Date() })
        .eq("user_id", user_id)
        .eq("book_id", bookId);

      if (updateError) throw updateError;
    } else {
      // 3. 11개 이상이면 가장 오래된 것 삭제
      if (existingBooks && existingBooks.length > 10) {
        const oldestBook = existingBooks[existingBooks.length - 1];
        const { error: deleteError } = await supabase
          .from("user_recent_books")
          .delete()
          .eq("user_id", user_id)
          .eq("book_id", oldestBook.book_id);

        if (deleteError) throw deleteError;
      }

      // 4. 새로운 도서 추가
      const { error: insertError } = await supabase
        .from("user_recent_books")
        .insert({
          user_id: user_id,
          book_id: bookId,
          title,
          author,
          image,
          viewed_at: new Date(),
        });

      if (insertError) throw insertError;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    // console.error("최근 본 도서 저장 실패:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
