import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // 쿼리 파라미터
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = Number(searchParams.get("pageSize")) || 20;
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const orderField = searchParams.get("orderField") || "created_at";
    const orderDirection =
      searchParams.get("orderDirection") === "asc" ? true : false;

    if (page < 1) {
      return new Response(
        JSON.stringify({ error: "page는 1 이상의 정수여야 합니다." }),
        { status: 400 }
      );
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from("book")
      .select("*", { count: "exact" })
      .eq("status", true)
      .order(orderField, { ascending: orderDirection })
      .order("book_id", { ascending: false });

    // 카테고리 필터
    if (category) {
      query = query.eq("category", category);
    }

    // 제목 검색 (부분 일치)
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("Book list fetch error:", error);
      throw error;
    }

    const mappedBooks = data.map((book) => ({
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
      isbn: book.isbn,
    }));

    return new Response(
      JSON.stringify({
        books: mappedBooks,
        page,
        pageSize,
        totalCount: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
        hasNext: page < Math.ceil((count ?? 0) / pageSize),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Book list API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!Array.isArray(body) || body.length === 0) {
      return new Response(
        JSON.stringify({ error: "책 정보 배열을 전달해야 합니다." }),
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // 필수값 검사
    for (const item of body) {
      if (!item.title || !item.author) {
        return new Response(
          JSON.stringify({ error: "각 책은 title과 author가 필요합니다." }),
          { status: 400 }
        );
      }
    }

    // Supabase insert용 매핑
    const booksToInsert = body.map((b) => ({
      title: b.title,
      author: b.author,
      publisher: b.publisher,
      pub_date: b.pubDate,
      price_standard: b.priceStandard,
      price_sales: b.priceSales,
      cover: b.cover,
      description: b.description,
      category: b.categoryName,
      link: b.link,
      stock: b.stock ?? 0,
      status: true,
      sales_count: b.salesCount,
      created_at: now,
      updated_at: now,
      isbn: b.isbn,
    }));

    const { error } = await supabase
      .from("book")
      .upsert(booksToInsert, { onConflict: "isbn" });

    if (error) {
      console.error("Books insert error:", error);
      throw error;
    }

    // 반환 없음
    return new Response(null, { status: 201 });
  } catch (err) {
    console.error("Books create API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
