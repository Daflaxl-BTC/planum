// Sendet eine Push-Nachricht an alle iOS-Geraete eines Nutzers via APNs.
//
// INTERN — nicht vom App-Client aufrufbar. Aufrufer muss den Service-Role-Key
// im Authorization-Header mitschicken (andere Edge Functions / Cron). Ein
// Angreifer mit nur dem anon-Key kann hier nicht senden.
//
// Aufruf:
//   POST /functions/v1/push-dispatch
//   Header: Authorization: Bearer <service-role-key>
//   Body:   { "user_id": "uuid", "title": "...", "body": "...", "data": {...} }
//
// Antwort:
//   { sent: <n>, failed: <n>, pruned: <n> }
//
// Secrets:
//   APNS_P8        — Inhalt der .p8-Datei (BEGIN/END PRIVATE KEY inkl.)
//   APNS_KEY_ID    — 10-stellige Key-ID des APNs-Auth-Keys
//   APNS_TEAM_ID   — Apple Team ID
//   APNS_BUNDLE_ID — Topic, default "de.planumplants.app"
//   APNS_HOST      — "api.sandbox.push.apple.com" (Dev/TestFlight, default)
//                    oder "api.push.apple.com" (App-Store-Release)
//
// Der APNs-Provider-JWT (ES256) wird pro Invocation frisch signiert und fuer
// alle Tokens dieses Aufrufs wiederverwendet (APNs erlaubt Reuse < 1h).

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

function b64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// PEM (PKCS8) → CryptoKey fuer ES256-Signatur.
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  const raw = atob(b64);
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf.buffer;
}

async function makeApnsJwt(p8: string, keyId: string, teamId: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(p8),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
  const header = b64url(new TextEncoder().encode(JSON.stringify({ alg: "ES256", kid: keyId })));
  const claims = b64url(
    new TextEncoder().encode(JSON.stringify({ iss: teamId, iat: Math.floor(Date.now() / 1000) })),
  );
  const signingInput = `${header}.${claims}`;
  const sig = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    key,
    new TextEncoder().encode(signingInput),
  );
  return `${signingInput}.${b64url(new Uint8Array(sig))}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return jsonResponse({ error: "supabase env missing" }, 500);
  }

  // Guard: nur Aufrufer mit Service-Role-Key duerfen senden.
  const authHeader = req.headers.get("Authorization") ?? "";
  const bearer = authHeader.replace(/^Bearer\s+/i, "");
  if (bearer !== serviceKey) {
    return jsonResponse({ error: "forbidden" }, 403);
  }

  const p8 = Deno.env.get("APNS_P8");
  const keyId = Deno.env.get("APNS_KEY_ID");
  const teamId = Deno.env.get("APNS_TEAM_ID");
  const bundleId = Deno.env.get("APNS_BUNDLE_ID") ?? "de.planumplants.app";
  const apnsHost = Deno.env.get("APNS_HOST") ?? "api.sandbox.push.apple.com";
  if (!p8 || !keyId || !teamId) {
    return jsonResponse({ error: "apns secrets missing" }, 500);
  }

  let payload: { user_id?: string; title?: string; body?: string; data?: Record<string, unknown> } = {};
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "invalid json body" }, 400);
  }
  const userId = payload.user_id;
  if (!userId || typeof userId !== "string") {
    return jsonResponse({ error: "user_id required" }, 400);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: tokens, error: tokErr } = await admin
    .from("push_tokens")
    .select("token")
    .eq("user_id", userId)
    .eq("platform", "ios");

  if (tokErr) {
    console.error("push-dispatch token query failed", tokErr);
    return jsonResponse({ error: "token query failed" }, 500);
  }
  if (!tokens || tokens.length === 0) {
    return jsonResponse({ sent: 0, failed: 0, pruned: 0 });
  }

  const jwt = await makeApnsJwt(p8, keyId, teamId);
  const apsBody = JSON.stringify({
    aps: {
      alert: { title: payload.title ?? "Planum", body: payload.body ?? "" },
      sound: "default",
    },
    ...(payload.data ?? {}),
  });

  let sent = 0;
  let failed = 0;
  const staleTokens: string[] = [];

  for (const { token } of tokens) {
    try {
      const res = await fetch(`https://${apnsHost}/3/device/${token}`, {
        method: "POST",
        headers: {
          authorization: `bearer ${jwt}`,
          "apns-topic": bundleId,
          "apns-push-type": "alert",
          "content-type": "application/json",
        },
        body: apsBody,
      });
      if (res.status === 200) {
        sent++;
      } else {
        failed++;
        // 410 Gone / 400 BadDeviceToken → Token toten, aufraeumen.
        if (res.status === 410 || res.status === 400) staleTokens.push(token);
        const errText = await res.text();
        console.error("apns reject", res.status, errText.slice(0, 200));
      }
    } catch (err) {
      failed++;
      console.error("apns fetch error", String(err).slice(0, 200));
    }
  }

  let pruned = 0;
  if (staleTokens.length > 0) {
    const { error: delErr } = await admin
      .from("push_tokens")
      .delete()
      .eq("user_id", userId)
      .in("token", staleTokens);
    if (delErr) console.error("stale token prune failed", delErr);
    else pruned = staleTokens.length;
  }

  return jsonResponse({ sent, failed, pruned });
});
