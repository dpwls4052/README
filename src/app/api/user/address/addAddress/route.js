import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, nickname, postcode, roadAddress, detailAddress, isDefault } = body;

    console.log("받은 데이터:", { userId, nickname, postcode, roadAddress, detailAddress, isDefault });

    if (!userId || !roadAddress) {
      return Response.json(
        { success: false, errorMessage: "userId와 roadAddress는 필수입니다." },
        { status: 400 }
      );
    }

    // 기존 주소 개수 확인
    const { data: existingAddresses, error: countError } = await supabase
      .from("address")
      .select("address_id")
      .eq("user_id", userId)
      .eq("status", true);

    if (countError) {
      console.error("주소 개수 확인 오류:", countError);
    }

    // 첫 번째 주소이거나 isDefault가 true인 경우
    const shouldBeDefault = isDefault || !existingAddresses || existingAddresses.length === 0;

    if (shouldBeDefault) {
      // 모든 기존 주소의 is_default를 false로 변경
      await supabase
        .from("address")
        .update({ is_default: false })
        .eq("user_id", userId);
    }

    // 새 주소 추가
    const { data, error } = await supabase
      .from("address")
      .insert([
        {
          user_id: userId,
          nickname: nickname || "배송지",
          postcode: postcode || "",
          road_address: roadAddress,
          detail_address: detailAddress || "",
          is_default: shouldBeDefault,
          status: true,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { success: false, errorMessage: error.message },
        { status: 500 }
      );
    }

    console.log("추가된 주소:", data);

    return Response.json({
      success: true,
      message: "주소가 성공적으로 등록되었습니다.",
      address: data[0],
    });
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { success: false, errorMessage: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}