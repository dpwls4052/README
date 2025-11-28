import { authenticate } from "@/lib/authenticate";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }
    const { user_id } = auth;

    if (!user_id) {
      return Response.json(
        { success: false, errorMessage: "userId는 필수입니다." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("address")
      .select("*")
      .eq("user_id", user_id)
      .eq("status", true)
      .order("is_default", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { success: false, errorMessage: error.message },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      addresses: data || [],
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { success: false, errorMessage: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
