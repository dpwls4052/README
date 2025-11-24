import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { user_id } = await req.json();

    const { data, error } = await supabase
      .from("roles")
      .select("role_name")
      .eq("user_id", user_id)
      .single();

    if (error || !data) {
      return NextResponse.json({ role: null }, { status: 404 });
    }

    return NextResponse.json({ role: data.role_name });
  } catch (e) {
    return NextResponse.json({ role: null }, { status: 500 });
  }
}
