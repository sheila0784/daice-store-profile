import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // =========================
    // 1. Read + validate payload
    // =========================
    const payload = await req.json();

    if (!payload.id) throw new Error("Missing user id");
    if (!payload.email) throw new Error("Missing email");

    console.log("📦 Payload received:", payload);

    // =========================
    // 2. Check secrets
    // =========================
    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !serviceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const admin = createClient(url, serviceKey);

    // =========================
    // 3. Update Auth user
    // =========================
    const { data: authData, error: authError } =
      await admin.auth.admin.updateUserById(payload.id, {
        email: payload.email,
      });

    if (authError) {
      console.error("❌ Auth update failed:", authError);
      throw authError;
    }

    console.log("✅ Auth updated:", authData.user?.id);

    // =========================
    // 4. Update profile table
    // =========================
    const { data: profileData, error: profileError } = await admin
      .from("profiles")
      .update({
        display_name: payload.display_name,
        contact: payload.contact,
        role: payload.role,
        status: payload.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", payload.id)
      .select();

    if (profileError) {
      console.error("❌ Profile update failed:", profileError);
      throw profileError;
    }

    console.log("✅ Profile updated");

    // =========================
    // 5. Return success
    // =========================
    return new Response(
      JSON.stringify({
        success: true,
        auth: authData.user,
        profile: profileData,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("💥 FUNCTION ERROR:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});