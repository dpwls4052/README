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
    const {
      addressIdx,
      nickname,
      postcode,
      roadAddress,
      detailAddress,
      isDefault,
    } = body;

    if (!user_id || !addressIdx) {
      return Response.json(
        { success: false, errorMessage: "userId와 addressIdx는 필수입니다." },
        { status: 400 }
      );
    }

    // isDefault가 true이면 기존 기본 주소를 false로 변경
    if (isDefault) {
      const { error: defaultError } = await supabase
        .from("address")
        .update({ is_default: false })
        .eq("user_id", user_id)
        .neq("address_id", addressIdx);

      if (defaultError) {
        console.error("기존 기본 주소 업데이트 오류:", defaultError);
      }
    }

    // 주소 수정
    const { data, error } = await supabase
      .from("address")
      .update({
        nickname,
        postcode,
        road_address: roadAddress,
        detail_address: detailAddress,
        is_default: isDefault,
      })
      .eq("address_id", addressIdx)
      .eq("user_id", user_id)
      .select();

    if (error) {
      console.error("주소 수정 오류:", error);
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

    return Response.json({
      success: true,
      message: "주소가 성공적으로 수정되었습니다.",
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
