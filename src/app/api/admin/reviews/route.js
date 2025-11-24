import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // 쿼리 파라미터
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const pageSize = Number(searchParams.get("pageSize")) || 10;
    const userEmail = searchParams.get("userEmail");
    const bookId = searchParams.get("bookId");
    const minRating = searchParams.get("minRating");
    const maxRating = searchParams.get("maxRating");
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

    let userId = null;
    if (userEmail) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_id")
        .eq("email", userEmail)
        .single();

      if (userError && userError.code !== "PGRST116") {
        console.error("User lookup error:", userError);
        throw userError;
      }

      userId = userData?.user_id;

      // userEmail은 입력했는데 userId를 찾지 못한 경우
      if (!userId) {
        return new Response(
          JSON.stringify({
            error: "입력하신 이메일에 해당하는 사용자를 찾을 수 없습니다.",
            reviews: [],
            page,
            pageSize,
            totalCount: 0,
            totalPages: 0,
            hasNext: false,
          }),
          { status: 200 }
        );
      }
    }

    // 기본 쿼리
    let query = supabase
      .from("review")
      .select(
        `
        *,
        user:user_id (
          user_id,
          name,
          email
        ),
        book:book_id (
          book_id,
          title,
          author,
          cover
        )
      `,
        { count: "exact" }
      )
      .order(orderField, { ascending: orderDirection })
      .order("review_id", { ascending: false });

    // user_id 필터
    if (userId) {
      query = query.eq("user_id", userId);
    }

    // book_id 필터
    if (bookId) {
      query = query.eq("book_id", bookId);
    }

    // 평점 범위 필터
    if (minRating) {
      query = query.gte("rate", parseInt(minRating, 10));
    }
    if (maxRating) {
      query = query.lte("rate", parseInt(maxRating, 10));
    }

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error("Review list fetch error:", error);
      throw error;
    }

    const mappedReviews = data.map((review) => ({
      reviewId: review.review_id,
      bookId: review.book_id,
      userId: review.user_id,
      rate: review.rate,
      review: review.review,
      createdAt: review.created_at,
      status: review.status,
      user: review.user
        ? {
            userId: review.user.user_id,
            name: review.user.name,
            email: review.user.email,
          }
        : null,
      book: review.book
        ? {
            bookId: review.book.book_id,
            title: review.book.title,
            author: review.book.author,
            cover: review.book.cover,
          }
        : null,
    }));

    return new Response(
      JSON.stringify({
        reviews: mappedReviews,
        page,
        pageSize,
        totalCount: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / pageSize),
        hasNext: page < Math.ceil((count ?? 0) / pageSize),
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Review list API error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
