import { supabase } from '@/lib/supabaseClient';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 8;

    // salesCount 기준 내림차순 정렬하여 베스트셀러 조회
    const { data: books, error } = await supabase
      .from('book')
      .select('*')
      .eq('status', true) // status true인 것만 조회
      .order('sales_count', { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (!books || books.length === 0) {
      return new Response(JSON.stringify({ message: "활성화된 책이 없습니다." }), { status: 200 });
    }

    return new Response(JSON.stringify(books), { status: 200 });
  } catch (err) {
    console.error("Bestseller API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
