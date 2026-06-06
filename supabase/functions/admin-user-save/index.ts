import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();

    console.log("📦 Payload:", payload);

    const url = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !serviceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const admin = createClient(url, serviceKey);

    let authData;
    let authError;
    let userId = payload.id;

    // ======================================================
    // 1. CREATE USER (if no id)
    // ======================================================
    if (!payload.id) {
      console.log("🆕 Creating new user...");

      const result = await admin.auth.admin.createUser({
        email: payload.email,
        password: payload.password ?? "TempPass123!",
        email_confirm: true,
      });

      authData = result.data;
      authError = result.error;

      if (authError) throw authError;

      userId = authData.user.id;

      console.log("✅ Created user:", userId);
    }

    // ======================================================
    // 2. UPDATE USER (if id exists)
    // ======================================================
    else {
      console.log("✏️ Updating existing user...");

      const result = await admin.auth.admin.updateUserById(userId, {
        email: payload.email,
      });

      authData = result.data;
      authError = result.error;

      if (authError) throw authError;

      console.log("✅ Updated auth user:", userId);
    }

    // ======================================================
    // 3. UPSERT PROFILE (works for both create & update)
    // ======================================================
    const { data: profileData, error: profileError } = await admin
      .from("profiles")
      .upsert({
        id: userId,
        display_name: payload.display_name,
        contact: payload.contact,
        role: payload.role,
        status: payload.status,
        updated_at: new Date().toISOString(),
      })
      .select();

    if (profileError) {
      console.error("❌ Profile error:", profileError);
      throw profileError;
    }

    console.log("✅ Profile saved");

    // ======================================================
    // 4. RESPONSE
    // ======================================================
    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
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
    console.error("💥 ERROR:", err);

    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }
});