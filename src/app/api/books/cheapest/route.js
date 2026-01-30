import { supabase } from '@/lib/supabaseClient';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit')) || 8;

    // status가 true인 책만 조회, price_sales 기준 오름차순
    const { data: books, error } = await supabase
      .from('book')
      .select('*')
      .eq('status', true) 
      .order('price_sales', { ascending: true })
      .limit(limit);

    if (error) throw error;

    // Firebase 형식으로 필드명 매핑
    const mappedBooks = books.map(book => ({
      bookId: book.book_id,
      title: book.title,
      cover: book.cover,
      description: book.description,
      author: book.author,
      priceStandard: book.price_standard,
      priceSales: book.price_sales,
      publisher: book.publisher,
      stock: book.stock,
      pubDate: book.pub_date,
      link: book.link,
      detailImg: book.detail_img,
      createdAt: book.created_at,
      updatedAt: book.updated_at,
      categoryName: book.category,
    }));

    return new Response(JSON.stringify(mappedBooks), { status: 200 });
  } catch (err) {
    console.error("Cheapest books API error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
