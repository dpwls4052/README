import { NextResponse } from "next/server";
import { authenticate } from "@/lib/authenticate";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const auth = await authenticate(req);

  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  const { user_id } = auth; // 인증 완료된 user_id

  const { data, error } = await supabase
    .from("roles")
    .select("role_name")
    .eq("user_id", user_id)
    .single();

  if (error) return NextResponse.json({ role: null }, { status: 404 });

  return NextResponse.json({ role: data.role_name });
}
