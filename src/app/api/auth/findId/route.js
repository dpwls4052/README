import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { phone_number } = await req.json();

    const { data, error } = await supabase
      .from("users") 
      .select("email")
      .eq("phone_number", phone_number) 
      .single();

    if (error || !data) throw new Error("등록된 정보가 없습니다.");

    return NextResponse.json({ success: true, email: data.email });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
