import { supabase } from '@/lib/supabaseClient';

export async function GET(req, { params }) {
  try {
    // Next.js 15+ 에서는 params를 await 해야 함
    const { id } = await params;

    console.log("Received book_id:", id);

    if (!id) {
      return new Response(JSON.stringify({ error: "book_id required" }), { status: 400 });
    }

    // book_id로 책 정보 조회
    const { data: book, error } = await supabase
      .from('book')
      .select('*')
      .eq('book_id', id)
      .eq('status', true) 
      .single();

    if (error) {
      console.error("Book fetch error:", error);
      throw error;
    }

    if (!book) {
      return new Response(JSON.stringify({ error: "Book not found" }), { status: 404 });
    }

    console.log("Found book:", book.title);

    // 필드명 매핑 (Firebase 형식으로)
    const mappedBook = {
      id: book.book_id,
      bookId: book.book_id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      pubDate: book.pub_date,
      priceStandard: book.price_standard,
      cover: book.cover,
      description: book.description,
      categoryName: book.category,
      link: book.link,
      stock: book.stock,
      salesCount: book.sales_count,
    };

    return new Response(JSON.stringify(mappedBook), { status: 200 });
  } catch (err) {
    console.error("Book detail API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}