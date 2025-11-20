// @/app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import { signupFirebase } from '@/service/authService';
import { supabase } from '@/lib/supabaseClient';

/**
 * 회원가입 API
 * POST /api/auth/signup
 * Body: { email, password, name, phone }
 */
export async function POST(req) {
  try {
    const { email, password, name, phone } = await req.json();

    // 1. 필수 필드 검증
    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { success: false, error: "필수 정보를 모두 입력해주세요." },
        { status: 400 }
      );
    }

    // 2. Firebase 인증 - 회원가입
    const firebaseUser = await signupFirebase(email, password);
    
    if (!firebaseUser || !firebaseUser.uid) {
      throw new Error("Firebase 회원가입 실패");
    }

    console.log("✅ Firebase 회원가입 성공:", firebaseUser.uid);

    // 3. Supabase에서 이메일로 기존 사용자 조회
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (fetchError) {
      console.error("❌ 사용자 조회 실패:", fetchError);
      throw fetchError;
    }

    let user;

    if (!existingUser) {
      // 4-1. 신규 사용자 생성
      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert([
          {
            uid: firebaseUser.uid,
            email,
            name,
            phone_number: phone,
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error("❌ 신규 사용자 생성 실패:", insertError);
        throw insertError;
      }

      user = newUser;
      console.log("✅ Supabase 신규 사용자 생성 완료:", user.user_id);

      // 5. roles 테이블에 기본 역할(user) 추가
      const { data: roleData, error: roleError } = await supabase
        .from("roles")
        .insert([
          {
            user_id: user.user_id,
            role_name: "user"
          }
        ])
        .select()
        .single();

      if (roleError) {
        console.error("❌ 역할 추가 실패:", roleError);
        throw roleError; // roles 추가 실패 시 에러 발생
      }
      
      console.log("✅ 기본 역할(user) 추가 완료:", roleData);

    } else {
      // 4-2. 기존 사용자 업데이트 (uid 연동)
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({
          uid: firebaseUser.uid,
          phone_number: phone,
        })
        .eq("email", email)
        .select()
        .single();

      if (updateError) {
        console.error("❌ 사용자 업데이트 실패:", updateError);
        throw updateError;
      }

      user = updatedUser;
      console.log("✅ 기존 사용자 Firebase uid 연동 완료:", user.user_id);
    }

    // 6. 성공 응답
    return NextResponse.json(
      { 
        success: true, 
        user: {
          user_id: user.user_id,
          email: user.email,
          name: user.name,
          uid: user.uid
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("💥 회원가입 API 오류:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "회원가입 중 오류가 발생했습니다." 
      },
      { status: 500 }
    );
  }
}