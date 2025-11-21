import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mainCategory = searchParams.get("mainCategory") || "국내도서";

    // 1. mainCategory(국내도서 || 외국도서)카테고리의 category_id 조회
    const { data: parent, error: parentError } = await supabase
      .from("category")
      .select("category_id")
      .eq("name", mainCategory)
      .single();

    if (parentError) throw parentError;

    // 2. 해당 category_id를 parent_id로 가진 카테고리들 조회
    const { data, error } = await supabase
      .from("category")
      .select("category_id, name, parent_id, depth")
      .eq("parent_id", parent.category_id)
      .order("name");

    if (error) throw error;

    return Response.json(data);
  } catch (err) {
    console.error("Categories fetch error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
