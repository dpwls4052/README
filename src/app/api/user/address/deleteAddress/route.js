import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, addressIdx } = body;

    console.log("삭제 요청:", { userId, addressIdx });

    if (!userId || !addressIdx) {
      return Response.json(
        { success: false, errorMessage: "userId와 addressIdx는 필수입니다." },
        { status: 400 }
      );
    }

    // 소프트 삭제 (status를 false로 변경)
    const { data, error } = await supabase
      .from("address")
      .update({ status: false })
      .eq("address_id", addressIdx)
      .eq("user_id", userId)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { success: false, errorMessage: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return Response.json(
        { success: false, errorMessage: "주소를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    console.log("삭제된 주소:", data);

    return Response.json({
      success: true,
      message: "주소가 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { success: false, errorMessage: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}