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

async function resolveCategoryId(fullCategoryName) {
  if (!fullCategoryName) return null;
  const parts = fullCategoryName.split(">");
  let parent_id = null;

  for (let i = 0; i < parts.length; i++) {
    const name = parts[i];
    const depth = i + 1; // depth 계산

    let query = supabase
      .from("category")
      .select("category_id")
      .eq("name", name);

    if (parent_id === null) {
      query = query.is("parent_id", null);
    } else {
      query = query.eq("parent_id", parent_id);
    }

    const { data: existing, error: selectError } = await query.maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      parent_id = existing.category_id;
    } else {
      const { data, error } = await supabase
        .from("category")
        .insert({ name, parent_id, depth }) // depth 추가
        .select("category_id")
        .single();

      if (error) {
        if (error.code === "23505") {
          let retryQuery = supabase
            .from("category")
            .select("category_id")
            .eq("name", name);

          if (parent_id === null) {
            retryQuery = retryQuery.is("parent_id", null);
          } else {
            retryQuery = retryQuery.eq("parent_id", parent_id);
          }

          const { data: retryData, error: retryError } =
            await retryQuery.maybeSingle();
          if (retryError) throw retryError;
          if (!retryData) throw new Error(`Category not found: ${name}`);
          parent_id = retryData.category_id;
        } else {
          throw error;
        }
      } else {
        parent_id = data.category_id;
      }
    }
  }

  return parent_id;
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
      if (!item.title) {
        return new Response(
          JSON.stringify({ error: "각 책은 title가 필요합니다." }),
          { status: 400 }
        );
      }
    }

    // 카테고리 중복 방지를 위한 캐시
    const categoryCache = new Map();

    // 각 책의 category를 category_id로 변환
    const booksToInsert = await Promise.all(
      body.map(async (b) => {
        let category_id = null;

        if (b.categoryName) {
          // 캐시에 있으면 재사용
          if (categoryCache.has(b.categoryName)) {
            category_id = categoryCache.get(b.categoryName);
          } else {
            // 없으면 조회/생성 후 캐시에 저장
            category_id = await resolveCategoryId(b.categoryName);
            categoryCache.set(b.categoryName, category_id);
          }
        }

        return {
          title: b.title,
          author: b.author,
          publisher: b.publisher,
          pub_date: b.pubDate,
          price_standard: b.priceStandard,
          price_sales: b.priceSales,
          cover: b.cover,
          description: b.description,
          category_id: category_id,
          link: b.link,
          stock: b.stock ?? 0,
          status: true,
          sales_count: b.salesCount,
          created_at: now,
          updated_at: now,
          isbn: b.isbn,
          mallType: b.mallType,
        };
      })
    );

    const { error } = await supabase
      .from("book")
      .upsert(booksToInsert, { onConflict: "isbn" });

    if (error) {
      console.error("Books insert error:", error);
      throw error;
    }

    return new Response(null, { status: 201 });
  } catch (err) {
    console.error("Books create API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
