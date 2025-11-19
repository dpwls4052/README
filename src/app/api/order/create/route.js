import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(req) {
//   console.log("🚀 주문 생성 API 시작");
  
  try {
    const body = await req.json();
    // console.log("📦 받은 데이터:", JSON.stringify(body, null, 2));
    
    const {
      userId,
      orderItems,
      price,
      name,
      phone,
      email,
      postal_code,
      address1,
      address2,
      memo,
      paymentMethod,
    } = body;

    // 1️⃣ 필수 필드 검증
    if (!userId || !orderItems || orderItems.length === 0 || !price) {
    //   console.error("❌ 필수 필드 누락:", { userId, orderItemsLength: orderItems?.length, price });
      return NextResponse.json(
        { success: false, errorMessage: "필수 주문 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 2️⃣ 주문번호 생성
    const timestamp = Date.now().toString().slice(-8);
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `ON${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${timestamp}${randomSuffix}`;
    // console.log("✅ 주문번호 생성:", orderNumber);

    // 3️⃣ orders 테이블에 삽입할 데이터 생성 (book_id 제외)
    const orderRows = orderItems.map((item) => {
      const row = {
        order_number: orderNumber,
        user_id: userId,
        // book_id는 orders 테이블에 없으므로 제외
        title: item.title || "",
        cover: item.cover || item.image || "",  // cover 또는 image 둘 다 대응
        book_price: Number(item.price) || 0,
        amount: Number(item.quantity) || 1,
        price: Number(price) || 0,
        name: name || "",
        phone: phone || "",
        email: email || "",
        postal_code: postal_code || "",
        address1: address1 || "",
        address2: address2 || "",
        memo: memo || "",
        payment_method: paymentMethod || "toss",
        status: "결제완료",
        shipping_status: "배송준비",
      };
      
    //   console.log("📝 주문 행 생성:", row);
      return row;
    });

    // 4️⃣ orders 테이블에 주문 데이터 삽입
    // console.log("💾 orders 테이블에 삽입 시작...");
    const { data: insertedData, error: insertError } = await supabase
      .from("orders")
      .insert(orderRows)
      .select();

    if (insertError) {
    //   console.error("❌ orders 테이블 삽입 실패:", insertError);
      return NextResponse.json(
        { 
          success: false, 
          errorMessage: "주문 정보 저장에 실패했습니다.",
          dbDetails: insertError.message 
        },
        { status: 500 }
      );
    }

    // console.log("✅ orders 테이블 삽입 성공:", insertedData?.length || 0, "개");

    // 5️⃣ 장바구니에서 구매한 상품 삭제 (book_id 기준)
    const purchasedBookIds = orderItems
      .map(item => item.book_id)
      .filter(Boolean);

    // console.log("🛒 장바구니 삭제 대상 book_id:", purchasedBookIds);

    if (purchasedBookIds.length > 0) {
      const { error: cartDeleteError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', userId)
        .in('book_id', purchasedBookIds);

      if (cartDeleteError) {
        // console.error("⚠️ 장바구니 삭제 실패:", cartDeleteError);
      } else {
        // console.log(`✅ 장바구니에서 ${purchasedBookIds.length}개 상품 삭제 완료`);
      }
    }

    // 6️⃣ 재고 차감 (book 테이블 업데이트)
    // console.log("📦 재고 차감 시작...");
    
    for (const item of orderItems) {
      if (!item.book_id) {
        // console.warn(`⚠️ book_id 없음: ${item.title} - 재고 차감 건너뜀`);
        continue;
      }

      try {
        // 현재 재고 조회
        const { data: bookData, error: fetchError } = await supabase
          .from('book')
          .select('stock, title')
          .eq('book_id', item.book_id)
          .single();

        if (fetchError || !bookData) {
        //   console.error(`❌ 재고 조회 실패 (book_id: ${item.book_id}):`, fetchError?.message);
          continue;
        }

        const currentStock = bookData.stock || 0;
        const quantity = item.quantity || 1;
        const newStock = Math.max(0, currentStock - quantity);

        // console.log(`  📊 ${bookData.title}: ${currentStock} → ${newStock} (${quantity}개 차감)`);

        // 재고 업데이트
        const { error: updateError } = await supabase
          .from('book')
          .update({ stock: newStock })
          .eq('book_id', item.book_id);

        if (updateError) {
        //   console.error(`❌ 재고 업데이트 실패 (book_id: ${item.book_id}):`, updateError.message);
        } else {
        //   console.log(`  ✅ 재고 차감 완료`);
        }
      } catch (stockError) {
        // console.error(`❌ 재고 처리 중 예외 (book_id: ${item.book_id}):`, stockError);
      }
    }

    // 7️⃣ 성공 응답
    // console.log("🎉 주문 처리 완료!");
    return NextResponse.json({
      success: true,
      orderNumber,
      message: "주문이 성공적으로 완료되었습니다.",
      details: {
        totalItems: orderItems.length,
        totalPrice: price,
        cartCleared: purchasedBookIds.length,
      }
    });

  } catch (error) {
    // console.error("💥 주문 처리 중 예외 발생:", error);
    return NextResponse.json(
      { 
        success: false, 
        errorMessage: `서버 오류가 발생했습니다: ${error.message}` 
      },
      { status: 500 }
    );
  }
}