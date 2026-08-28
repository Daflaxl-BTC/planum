// Trägt eine E-Mail-Adresse in die Warteliste ein und verschickt die
// Double-Opt-In-Mail.
//
// Aufruf:
//   POST /functions/v1/waitlist-subscribe
//   Body: { "email": "...", "consent": true, "consentVersion": "...",
//           "company": "", "renderedAt": 1755000000000 }
//
// Antwort: IMMER { ok: true } bei formal gueltiger Eingabe — auch wenn die
// Adresse schon existiert. Eine unterscheidbare Antwort waere ein
// Enumerations-Leak: man koennte damit durchprobieren, wer eingetragen ist.
//
// Warum service-role: waitlist_signups hat RLS an und KEINE Policy. Der
// Schreibzugriff laeuft ausschliesslich hier. Eine offene insert-Policy fuer
// anon waere die groessere Luecke.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  ALLOWED_ORIGINS,
  clientIp,
  hashIp,
  jsonResponse,
  normalizeEmail,
  randomToken,
  sha256Hex,
  SITE_URL,
  corsHeaders,
} from "../_shared/waitlist.ts";

const RATE_LIMIT_PER_HOUR = 5;
const TOKEN_TTL_HOURS = 48;

// Zeitfalle: ein Formular, das in unter zwei Sekunden abgeschickt wird, hat
// kein Mensch ausgefuellt. Der Wert ist NICHT signiert und damit faelschbar —
// er ist ein billiger Filter gegen simple Bots, kein Sicherheitsmerkmal. Die
// tatsaechliche Absicherung sind Origin-Pruefung, Rate-Limit und Double-Opt-In.
const MIN_FORM_AGE_MS = 2_000;
const MAX_FORM_AGE_MS = 2 * 60 * 60 * 1000;

async function sendConfirmationMail(email: string, token: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("WAITLIST_FROM") ?? "Planum <hallo@planumplants.de>";
  if (!apiKey) {
    console.error("waitlist-subscribe: RESEND_API_KEY fehlt");
    return false;
  }

  // Der Bestaetigungslink zeigt auf die Function, nicht auf die Website —
  // erst sie setzt confirmed_at und leitet danach auf /danke weiter.
  const confirmBase = Deno.env.get("WAITLIST_CONFIRM_BASE") ??
    `${Deno.env.get("SUPABASE_URL")}/functions/v1/waitlist-confirm`;
  const link = `${confirmBase}?token=${token}`;

  const text = [
    "Fast geschafft.",
    "",
    "Du moechtest benachrichtigt werden, sobald Planum verfuegbar ist.",
    "Bitte bestaetige das einmal ueber diesen Link:",
    "",
    link,
    "",
    "Der Link gilt 48 Stunden. Wenn du dich nicht eingetragen hast,",
    "ignoriere diese Mail einfach — ohne Klick speichern wir nichts dauerhaft.",
    "",
    "Felix Ventures, Inh. Felix Georg Bredl",
  ].join("\n");

  const html = `<!doctype html><html lang="de"><body style="margin:0;background:#FBF9F4;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#14201A">
<div style="max-width:520px;margin:0 auto;padding:40px 24px">
  <p style="font-size:22px;line-height:1.3;margin:0 0 20px">Fast geschafft.</p>
  <p style="font-size:16px;line-height:1.6;margin:0 0 24px">Du möchtest benachrichtigt werden, sobald Planum verfügbar ist. Bitte bestätige das einmal:</p>
  <p style="margin:0 0 28px"><a href="${link}" style="display:inline-block;background:#386538;color:#FBF9F4;text-decoration:none;padding:14px 26px;border-radius:999px;font-size:15px">Eintrag bestätigen</a></p>
  <p style="font-size:14px;line-height:1.6;color:rgba(20,32,26,.7);margin:0 0 8px">Der Link gilt 48 Stunden. Wenn du dich nicht eingetragen hast, ignoriere diese Mail — ohne Klick speichern wir nichts dauerhaft.</p>
  <p style="font-size:12px;line-height:1.6;color:rgba(20,32,26,.5);margin:24px 0 0">Felix Ventures, Inh. Felix Georg Bredl · <a href="${SITE_URL}/impressum" style="color:inherit">Impressum</a> · <a href="${SITE_URL}/datenschutz" style="color:inherit">Datenschutz</a></p>
</div></body></html>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Bitte bestätige deinen Eintrag",
      text,
      html,
    }),
  });

  if (!res.ok) {
    // Bewusst ohne Response-Body im Log: der kann die Adresse enthalten.
    console.error("waitlist-subscribe: Resend antwortete mit", res.status);
    return false;
  }
  return true;
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed" }, 405, origin);
  }
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    return jsonResponse({ error: "origin not allowed" }, 403, origin);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return jsonResponse({ error: "supabase env missing" }, 500, origin);
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "invalid json body" }, 400, origin);
  }

  // Honeypot: fuer Menschen unsichtbar. Gefuellt => so tun, als waere alles
  // in Ordnung, aber nichts speichern. Ein Fehler wuerde dem Bot verraten,
  // dass die Falle existiert.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return jsonResponse({ ok: true }, 200, origin);
  }

  const renderedAt = Number(payload.renderedAt);
  if (Number.isFinite(renderedAt)) {
    const age = Date.now() - renderedAt;
    if (age < MIN_FORM_AGE_MS || age > MAX_FORM_AGE_MS) {
      return jsonResponse({ error: "form expired" }, 400, origin);
    }
  }

  if (payload.consent !== true) {
    return jsonResponse({ error: "consent required" }, 400, origin);
  }
  const consentVersion = typeof payload.consentVersion === "string" &&
      payload.consentVersion.length <= 40
    ? payload.consentVersion
    : "unknown";

  const email = normalizeEmail(payload.email);
  if (!email) {
    return jsonResponse({ error: "invalid email" }, 400, origin);
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const ipHash = await hashIp(clientIp(req));
  if (ipHash) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error } = await admin
      .from("waitlist_signups")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if (!error && (count ?? 0) >= RATE_LIMIT_PER_HOUR) {
      return jsonResponse({ error: "rate limited" }, 429, origin);
    }
  }

  const token = randomToken();
  const tokenHash = await sha256Hex(token);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_HOURS * 3600 * 1000)
    .toISOString();
  const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 300);

  const { data: existing } = await admin
    .from("waitlist_signups")
    .select("id, confirmed_at")
    .eq("email", email)
    .maybeSingle();

  if (existing?.confirmed_at) {
    // Schon bestaetigt: keine zweite Mail, aber dieselbe Antwort wie sonst.
    return jsonResponse({ ok: true }, 200, origin);
  }

  if (existing) {
    const { error } = await admin
      .from("waitlist_signups")
      .update({
        confirm_token_hash: tokenHash,
        token_expires_at: expiresAt,
        consent_version: consentVersion,
        ip_hash: ipHash,
        user_agent: userAgent,
      })
      .eq("id", existing.id);
    if (error) {
      console.error("waitlist-subscribe update failed", error.message);
      return jsonResponse({ error: "signup failed" }, 500, origin);
    }
  } else {
    const { error } = await admin.from("waitlist_signups").insert({
      email,
      confirm_token_hash: tokenHash,
      token_expires_at: expiresAt,
      consent_version: consentVersion,
      source: "landing",
      ip_hash: ipHash,
      user_agent: userAgent,
    });
    if (error) {
      // 23505 = unique_violation: zwei parallele Requests derselben Adresse.
      // Kein Fehlerfall fuer den Besucher — die erste hat gewonnen.
      if (error.code === "23505") {
        return jsonResponse({ ok: true }, 200, origin);
      }
      console.error("waitlist-subscribe insert failed", error.message);
      return jsonResponse({ error: "signup failed" }, 500, origin);
    }
  }

  const sent = await sendConfirmationMail(email, token);
  if (!sent) {
    return jsonResponse({ error: "mail failed" }, 502, origin);
  }

  return jsonResponse({ ok: true }, 200, origin);
});
