// app/api/auth/me/route.js
import { supabase } from "@/lib/supabaseClient";

export async function POST(req) {
  try {
    const { uid, email } = await req.json();

    if (!uid || !email)
      return new Response(JSON.stringify({ error: "uid and email required" }), { status: 400 });

    // Supabase에서 uuid(user_id) 조회
    const { data, error } = await supabase
      .from("users")
      .select("user_id")
      .eq("uid", uid)
      .eq("email", email)
      .maybeSingle();

    if (error) throw error;
    if (!data) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    return new Response(JSON.stringify({ user_id: data.user_id }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
