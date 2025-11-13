// @/app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import { signupFirebase } from '@/service/authService';
import { createUserSupabase } from '@/service/userService';
import { supabase } from '@/lib/supabaseClient';


// post /api/auth/signup
// 구조 ** 필수값
//{
//   "email": "test@gmail.com",
//   "phone_number": "01011112222",
//   "name": "이름"
// }

export async function POST(req) {
  try {
    const { email, password, name, phone_number } = await req.json();

    // 1️⃣ Firebase 가입
    const firebaseUser = await signupFirebase(email, password);

    // 2️⃣ Supabase에서 이메일로 기존 사용자 조회
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle(); 

    if (fetchError) throw fetchError;

    let user;
    if (!existingUser) {
      // 3️⃣ Supabase에 신규 사용자 생성
      const { data, error } = await createUserSupabase({
        email,
        name,
        phone_number,      
        uid: firebaseUser.uid
      });
      if (error) throw error;
      user = data;
    } else {
   
      const { data, error } = await supabase
        .from("users")
        .update({ uid: firebaseUser.uid, phone_number })
        .eq("email", email)
        .select()
        .maybeSingle();
      if (error) throw error;
      user = data;
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
