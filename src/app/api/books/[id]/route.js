import { supabase } from "@/lib/supabaseClient";

export async function GET(req, { params }) {
  try {
    // Next.js 15+ 에서는 params를 await 해야 함
    const { id } = await params;

    console.log("Received book_id:", id);

    if (!id) {
      return new Response(JSON.stringify({ error: "book_id required" }), {
        status: 400,
      });
    }

    // book_id로 책 정보 조회
    const { data: book, error } = await supabase
      .from("book")
      .select("*")
      .eq("book_id", id)
      .eq("status", true)
      .single();

    if (error) {
      console.error("Book fetch error:", error);
      throw error;
    }

    if (!book) {
      return new Response(JSON.stringify({ error: "Book not found" }), {
        status: 404,
      });
    }

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
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return new Response(JSON.stringify({ error: "bookId가 필요합니다." }), {
        status: 400,
      });
    }

    const updatedData = await req.json();
    if (!updatedData || typeof updatedData !== "object") {
      return new Response(
        JSON.stringify({ error: "수정할 데이터가 필요합니다." }),
        { status: 400 }
      );
    }

    // updated_at 자동 갱신
    const now = new Date().toISOString();
    const { error, data } = await supabase
      .from("book")
      .update({ ...updatedData, updated_at: now })
      .eq("book_id", id)
      .select() // select를 붙이면 업데이트 후 결과 반환 가능
      .single();

    const updatedBook = {
      id: data.book_id,
      bookId: data.book_id,
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      pubDate: data.pub_date,
      priceStandard: data.price_standard,
      cover: data.cover,
      description: data.description,
      categoryName: data.category,
      link: data.link,
      stock: data.stock,
      salesCount: data.sales_count,
    };

    if (error) {
      console.error("Book update error:", error);
      throw error;
    }

    return new Response(JSON.stringify({ book: updatedBook }), { status: 200 });
  } catch (err) {
    console.error("Book update API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
