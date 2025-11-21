import { supabase } from "@/lib/supabaseClient";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return new Response(JSON.stringify({ error: "book id가 필요합니다." }), {
        status: 400,
      });
    }

    // 전체 카테고리 조회
    const { data: allCategories, error: categoryError } = await supabase
      .from("category")
      .select("category_id, name, parent_id, depth");

    if (categoryError) throw categoryError;

    // 카테고리 경로 찾기 함수
    const getCategoryPath = (categoryId) => {
      const path = [];
      let currentId = categoryId;

      while (currentId) {
        const cat = allCategories.find((c) => c.category_id === currentId);
        if (!cat) break;

        path.unshift({
          category_id: cat.category_id,
          name: cat.name,
          depth: cat.depth,
        });
        currentId = cat.parent_id;
      }

      return path;
    };

    const { data, error } = await supabase
      .from("book")
      .select("*")
      .eq("book_id", id)
      .eq("status", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return new Response(
          JSON.stringify({ error: "책을 찾을 수 없습니다." }),
          { status: 404 }
        );
      }
      throw error;
    }

    const book = {
      bookId: data.book_id,
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      pubDate: data.pub_date,
      priceStandard: data.price_standard,
      cover: data.cover,
      description: data.description,
      category: getCategoryPath(data.category_id),
      link: data.link,
      stock: data.stock,
      salesCount: data.sales_count,
      isbn: data.isbn,
    };

    return new Response(JSON.stringify({ book }), { status: 200 });
  } catch (err) {
    console.error("Book detail API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
