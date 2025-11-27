import admin from "./firebaseAdmin";
import { supabase } from "./supabaseClient";

export async function authenticate(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return { error: "Unauthorized", status: 401 };

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;

    const { data: user, error } = await supabase
      .from("users")
      .select("user_id")
      .eq("uid", uid)
      .single();

    if (error || !user) return { error: "User Not Found", status: 404 };

    return { user_id: user.user_id };
  } catch (err) {
    console.error("Auth error:", err); // 에러 확인
    return { error: "Invalid Token", status: 401 };
  }
}
