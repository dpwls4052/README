// src/services/userService.js
import { supabase } from '../lib/supabaseClient';

// 회원 생성
export async function createUserSupabase({ email, name, uid }) {
  const { data, error } = await supabase
    .from('users')
    .insert({ email, name, uid }) // user_id는 BIGINT PK, 자동 생성
    .select()
    .maybeSingle(); // PK 이름과 상관없이 안전하게 단일 행 반환

  return { data, error };
}

// 회원 정보 업데이트
export async function updateUserSupabase(userId, updates) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('user_id', userId)
    .select();
  if (error) throw error;
  return data;
}

// 회원 탈퇴
export async function deleteUserSupabase(userId) {
  const { data, error } = await supabase
    .from('users')
    .update({ status: false })
    .eq('user_id', userId)
    .select();
  if (error) throw error;
  return data;
}
