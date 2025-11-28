import { authenticate } from "@/lib/authenticate";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const auth = await authenticate(request);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }
    const { user_id } = auth;
    const { addressIdx } = body;

    console.log("기본 배송지 설정 요청:", { user_id, addressIdx });

    if (!user_id || !addressIdx) {
      return Response.json(
        { success: false, errorMessage: "userId와 addressIdx는 필수입니다." },
        { status: 400 }
      );
    }

    // 1. 해당 유저의 모든 주소를 false로 변경
    const { error: resetError } = await supabase
      .from("address")
      .update({ is_default: false })
      .eq("user_id", user_id);

    if (resetError) {
      console.error("기본 배송지 초기화 오류:", resetError);
      return Response.json(
        { success: false, errorMessage: resetError.message },
        { status: 500 }
      );
    }

    // 2. 선택한 주소만 true로 변경
    const { data, error } = await supabase
      .from("address")
      .update({ is_default: true })
      .eq("address_id", addressIdx)
      .eq("user_id", user_id)
      .select();

    if (error) {
      console.error("기본 배송지 설정 오류:", error);
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

    console.log("기본 배송지 설정 완료:", data);

    return Response.json({
      success: true,
      message: "기본 배송지가 설정되었습니다.",
      address: data[0],
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { success: false, errorMessage: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
