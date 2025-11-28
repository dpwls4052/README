// src/app/api/books/random/route.js

import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // recommend | season | null
    const type = searchParams.get("type");

    const LIMIT = 10;

    // 기본: 앞에서 10권 (0~9)
    let from = 0;
    let to = LIMIT - 1;

    // type === "season" 이면 10~19
    if (type === "season") {
      from = LIMIT; // 10
      to = LIMIT * 2 - 1; // 19
    }
    // 필요하면 type 더 늘릴 수 있음
    // else if (type === "something") { ... }

    // 1) 판매 중(status = true) 도서를 book_id 오름차순으로 정렬
    const { data, error } = await supabase
      .from("book")
      .select("*")
      .eq("status", true)
      .order("book_id", { ascending: true })
      .range(from, to); // from~to 구간만 잘라서 가져옴

    if (error) {
      console.error("Random books query error:", error);
      throw error;
    }

    const rows = data ?? [];

    // 2) 프론트에서 쓰기 편하게 매핑
    const books = rows.map((row) => ({
      id: row.book_id,
      bookId: row.book_id,
      title: row.title,
      author: row.author,
      publisher: row.publisher,
      pubDate: row.pub_date,
      priceStandard: row.price_standard,
      cover: row.cover,
      stock: row.stock,
      salesCount: row.sales_count,
    }));

    return new Response(JSON.stringify({ books }), { status: 200 });
  } catch (err) {
    console.error("Random books API error:", err);
    return new Response(
      JSON.stringify({
        error: err.message ?? "특수 도서 조회 중 오류가 발생했습니다.",
      }),
      { status: 500 }
    );
  }
}
