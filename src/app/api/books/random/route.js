import { supabase } from "@/lib/supabaseClient";

/**
 * GET /api/books/random
 *
 * 지금 버전은 "랜덤 로직 X"
 * - 단순히 status=true 인 모든 도서를 book_id 순으로 돌려준다.
 * - 랜덤/셔플은 프론트(useRandomBooks)에서 처리할 거라
 *   여기서는 최대한 단순하게 두는 게 포인트.
 */
export async function GET() {
  try {
    // 1) Supabase에서 판매 중인 도서 전체 가져오기
    const { data, error } = await supabase
      .from("book")
      .select("*")
      .eq("status", true) // 판매 중인 도서만
      .order("book_id", { ascending: true }); // 기본 순서를 고정하기 위해 정렬

    if (error) {
      console.error("Random books query error:", error);
      throw error;
    }

    const rows = data ?? [];

    // 2) 프론트에서 쓰기 좋은 형태로 매핑
    const books = rows.map((row) => ({
      id: row.book_id, // 리스트 key
      bookId: row.book_id,
      title: row.title,
      author: row.author,
      publisher: row.publisher,
      pubDate: row.pub_date,
      priceStandard: row.price_standard,
      cover: row.cover,
      stock: row.stock,
      salesCount: row.sales_count,
      // 필요하면 description, link, isbn 등도 추가 가능
    }));

    // 3) 응답 반환
    return new Response(JSON.stringify({ books }), { status: 200 });
  } catch (err) {
    console.error("Random books API error:", err);
    return new Response(
      JSON.stringify({
        error: err.message ?? "랜덤 도서 조회 중 오류가 발생했습니다.",
      }),
      { status: 500 }
    );
  }
}
