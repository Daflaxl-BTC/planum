// Bestaetigt einen Warteliste-Eintrag (zweiter Schritt des Double-Opt-In).
//
// Aufruf: GET /functions/v1/waitlist-confirm?token=<token>
// Antwort: 302 auf ${SITE_URL}/danke bzw. /danke?fehler=...
//
// Der Token steht nur im Klartext in der Mail; in der Datenbank liegt sein
// SHA-256. Wer die Tabelle liest, kann damit keinen Eintrag bestaetigen.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { sha256Hex, SITE_URL } from "../_shared/waitlist.ts";

function redirect(path: string) {
  return new Response(null, {
    status: 302,
    headers: {
      Location: `${SITE_URL}${path}`,
      "Cache-Control": "no-store",
      // Der Token steht in der URL — er darf nicht als Referrer weiterwandern.
      "Referrer-Policy": "no-referrer",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response("method not allowed", { status: 405 });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token || token.length < 20 || token.length > 200) {
    return redirect("/danke?fehler=link");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("waitlist-confirm: supabase env fehlt");
    return redirect("/danke?fehler=server");
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const tokenHash = await sha256Hex(token);

  const { data: row, error } = await admin
    .from("waitlist_signups")
    .select("id, confirmed_at, token_expires_at")
    .eq("confirm_token_hash", tokenHash)
    .maybeSingle();

  if (error) {
    console.error("waitlist-confirm lookup failed", error.message);
    return redirect("/danke?fehler=server");
  }
  if (!row) {
    return redirect("/danke?fehler=link");
  }
  if (row.confirmed_at) {
    // Zweiter Klick auf denselben Link — kein Fehler.
    return redirect("/danke");
  }
  if (row.token_expires_at && new Date(row.token_expires_at) < new Date()) {
    return redirect("/danke?fehler=abgelaufen");
  }

  const { error: updateErr } = await admin
    .from("waitlist_signups")
    .update({
      confirmed_at: new Date().toISOString(),
      // Token nach Gebrauch entwerten.
      confirm_token_hash: null,
      token_expires_at: null,
    })
    .eq("id", row.id);

  if (updateErr) {
    console.error("waitlist-confirm update failed", updateErr.message);
    return redirect("/danke?fehler=server");
  }

  return redirect("/danke");
});
