// Gemeinsame Bausteine der beiden Warteliste-Functions.
// Bewusst ohne Abhaengigkeiten ausser der Web-Crypto-API.

export const SITE_URL = Deno.env.get("WAITLIST_SITE_URL") ??
  "https://www.planumplants.de";

// Origin-Allowlist statt "*": die Function ist oeffentlich aufrufbar
// (verify_jwt = false), deshalb ist der Origin die einzige Herkunftsangabe,
// die der Browser selbst setzt und die eine Seite nicht faelschen kann.
export const ALLOWED_ORIGINS = new Set([
  "https://www.planumplants.de",
  "https://planumplants.de",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

export function corsHeaders(origin: string | null): Record<string, string> {
  const allowed = origin && ALLOWED_ORIGINS.has(origin);
  return {
    "Access-Control-Allow-Origin": allowed ? origin : "https://www.planumplants.de",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}

export function jsonResponse(
  body: unknown,
  status = 200,
  origin: string | null = null,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
  });
}

// Pragmatische RFC-5322-Naeherung. Absichtlich nicht maximal streng —
// die eigentliche Pruefung ist der Bestaetigungslink, den nur erreicht,
// wer das Postfach wirklich hat.
const EMAIL_RE = /^[^\s@,;:<>"'\\]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i;

// Wegwerf-Domains. Kein Vollstaendigkeitsanspruch — die Liste haelt nur den
// billigsten Missbrauch fern.
const DISPOSABLE = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "getnada.com",
  "sharklasers.com",
  "throwawaymail.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "mohmal.com",
  "spam4.me",
]);

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 6 || email.length > 254) return null;
  if (!EMAIL_RE.test(email)) return null;
  const domain = email.slice(email.lastIndexOf("@") + 1);
  if (DISPOSABLE.has(domain)) return null;
  return email;
}

export async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Die Klar-IP wird nie gespeichert. Der Pepper macht den Hash gegen das
// Durchprobieren des IPv4-Raums (2^32 Kandidaten) unbrauchbar.
export async function hashIp(ip: string | null): Promise<string | null> {
  if (!ip) return null;
  const pepper = Deno.env.get("WAITLIST_IP_PEPPER");
  if (!pepper) return null;
  return await sha256Hex(`${ip}|${pepper}`);
}

export function clientIp(req: Request): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("cf-connecting-ip");
}

export function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}
