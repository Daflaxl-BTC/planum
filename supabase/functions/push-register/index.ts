// Registriert ein APNs-Device-Token fuer den eingeloggten Nutzer.
//
// Aufruf:
//   POST /functions/v1/push-register
//   Header: Authorization: Bearer <user-jwt>
//   Body:   { "token": "<apns-hex-token>", "platform": "ios" }
//
// Antwort:
//   { ok: true }
//
// Warum service-role: push_tokens hat KEINE insert/update-Policy (RLS erlaubt
// dem Client nur SELECT der eigenen Zeilen). Der Schreibzugriff laeuft
// ausschliesslich hier ueber den Service-Role-Key — konform zur Regel
// "Schreiben nur service-role". Die user_id wird NICHT aus dem Body genommen,
// sondern aus dem verifizierten JWT, damit kein Nutzer fremde Tokens setzt.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const ALLOWED_PLATFORMS = new Set(["ios", "android", "web"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseAnon || !serviceKey) {
    return jsonResponse({ error: "supabase env missing" }, 500);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return jsonResponse({ error: "missing authorization header" }, 401);
  }

  let payload: { token?: string; platform?: string } = {};
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "invalid json body" }, 400);
  }

  const token = payload.token;
  if (!token || typeof token !== "string" || token.length < 16) {
    return jsonResponse({ error: "token required" }, 400);
  }
  const platform = payload.platform ?? "ios";
  if (!ALLOWED_PLATFORMS.has(platform)) {
    return jsonResponse({ error: "invalid platform" }, 400);
  }

  // user_id kommt aus dem verifizierten JWT, nie aus dem Body.
  const userClient = createClient(supabaseUrl, supabaseAnon, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return jsonResponse({ error: "not authenticated" }, 401);
  }
  const userId = userData.user.id;

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error: upsertErr } = await adminClient
    .from("push_tokens")
    .upsert(
      { user_id: userId, token, platform, updated_at: new Date().toISOString() },
      { onConflict: "user_id,token" },
    );

  if (upsertErr) {
    console.error("push-register upsert failed", upsertErr);
    return jsonResponse({ error: "registration failed" }, 500);
  }

  return jsonResponse({ ok: true });
});
