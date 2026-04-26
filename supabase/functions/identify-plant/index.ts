// Plant.id v3 (Kindwise) → plant_species matcher mit Auto-Populate.
//
// Aufruf:
//   POST /functions/v1/identify-plant
//   Header: Authorization: Bearer <user-jwt>
//   Body:   { "image_base64": "<base64 ohne data:-prefix>" }
//
// Antwort:
//   {
//     suggestions: [
//       {
//         scientific_name: "Cannabis sativa",
//         probability: 0.97,
//         common_name: "Hemp",
//         species_id: "uuid",
//         common_name_de: "Hanf",
//         emoji: null,
//         auto_created: true
//       },
//       ...
//     ],
//     best_match_species_id: "uuid|null"
//   }
//
// Auto-Populate-Strategie:
//   - DB-Match (case-insensitive scientific_name) → existierende species_id zurueck
//   - Kein Match, probability >= 0.6 → neue plant_species-Zeile mit Plant.id-
//     Pflegedaten anlegen, species_id zurueck
//   - Kein Match, probability < 0.6 → species_id null (informativer Fallback)
//
// Secrets:
//   KINDWISE_API_KEY  — von admin.kindwise.com (Plant.id Produkt)
//
// Das Service-Role-Key wird nur fuer den Auto-Populate-INSERT in plant_species
// verwendet, niemals dem Client exponiert.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const PLANT_ID_URL = "https://plant.id/api/v3/identification";
const AUTO_POPULATE_THRESHOLD = 0.6;
const PLANT_ID_DETAILS = [
  "common_names",
  "description",
  "watering",
  "best_watering",
  "best_light_condition",
  "best_soil_type",
  "propagation_methods",
  "toxicity",
].join(",");

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

// Plant.id watering: { min: 1..3, max: 1..3 }, 1=trocken, 2=mittel, 3=feucht.
// Wir nehmen `max` als oberen Pflege-Bedarf.
function mapWateringDays(watering: { min?: number; max?: number } | undefined): number {
  const level = watering?.max ?? watering?.min;
  if (level == null) return 7;
  if (level <= 1) return 14;
  if (level >= 3) return 4;
  return 7;
}

function deriveFertilizeDays(waterDays: number): number {
  // Heuristik: Duengen ~4x seltener als Giessen, geclampt 14..60 Tage.
  return Math.max(14, Math.min(60, waterDays * 4));
}

// Plant.id-Lichtangaben (frei formuliert) → schema-enum.
function mapLight(textOrArray: unknown): string {
  if (!textOrArray) return "bright";
  const flat = Array.isArray(textOrArray)
    ? textOrArray.join(" ").toLowerCase()
    : String(textOrArray).toLowerCase();
  if (flat.includes("full sun") || flat.includes("direct sun")) return "direct";
  if (flat.includes("part") || flat.includes("filtered") || flat.includes("indirect")) return "bright";
  if (flat.includes("deep shade") || flat.includes("low light") || flat.includes("full shade")) return "low";
  if (flat.includes("shade")) return "medium";
  return "bright";
}

function pickDescription(details: any): string | null {
  // Plant.id liefert description mal als string, mal als { value, citation }.
  const raw = details?.description?.value ?? details?.description ?? null;
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim().slice(0, 1000);
  return trimmed.length > 0 ? trimmed : null;
}

function buildCareNotes(details: any): string | null {
  const parts: string[] = [];
  const desc = pickDescription(details);
  if (desc) parts.push(desc);
  if (details?.best_watering) parts.push(`Gießen: ${details.best_watering}`);
  if (details?.best_light_condition) parts.push(`Licht: ${details.best_light_condition}`);
  if (details?.best_soil_type) parts.push(`Substrat: ${details.best_soil_type}`);
  if (parts.length === 0) return null;
  return parts.join("\n\n").slice(0, 1500);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed" }, 405);
  }

  const apiKey = Deno.env.get("KINDWISE_API_KEY");
  if (!apiKey) {
    return jsonResponse({ error: "KINDWISE_API_KEY not configured" }, 500);
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

  let payload: { image_base64?: string } = {};
  try {
    payload = await req.json();
  } catch {
    return jsonResponse({ error: "invalid json body" }, 400);
  }

  const image = payload.image_base64;
  if (!image || typeof image !== "string" || image.length < 100) {
    return jsonResponse({ error: "image_base64 required" }, 400);
  }

  const userClient = createClient(supabaseUrl, supabaseAnon, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return jsonResponse({ error: "not authenticated" }, 401);
  }

  // Plant.id-Call
  const url = new URL(PLANT_ID_URL);
  url.searchParams.set("details", PLANT_ID_DETAILS);
  url.searchParams.set("language", "de");

  let plantIdJson: any;
  try {
    const res = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        images: [image],
        classification_level: "species",
        similar_images: false,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("plant.id error", res.status, text);
      // 200 mit Error-Body, damit supabase-js nicht throwt und das Frontend
      // den Detail-Text direkt anzeigen kann (Diagnose-Modus).
      return jsonResponse({
        suggestions: [],
        best_match_species_id: null,
        diag_error: `Plant.id ${res.status}: ${text.slice(0, 400)}`,
        api_key_length: apiKey.length,
      });
    }
    plantIdJson = await res.json();
  } catch (err) {
    console.error("plant.id fetch error", err);
    return jsonResponse({
      suggestions: [],
      best_match_species_id: null,
      diag_error: `Plant.id unreachable: ${String(err).slice(0, 300)}`,
    });
  }

  const rawSuggestions: Array<{ name?: string; probability?: number; details?: any }> =
    plantIdJson?.result?.classification?.suggestions ?? [];

  const top = rawSuggestions
    .filter((s) => s?.name && typeof s.probability === "number")
    .slice(0, 5);

  if (top.length === 0) {
    return jsonResponse({ suggestions: [], best_match_species_id: null });
  }

  // Service-role nur fuer Auto-Populate-INSERTs.
  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const enriched: Array<{
    scientific_name: string;
    probability: number;
    common_name: string | null;
    species_id: string | null;
    common_name_de: string | null;
    emoji: string | null;
    auto_created: boolean;
  }> = [];

  for (const sug of top) {
    const sci = sug.name as string;
    const probability = sug.probability as number;
    const commonName = sug.details?.common_names?.[0] ?? null;

    // 1. Direct match
    const { data: existing } = await userClient
      .from("plant_species")
      .select("id, common_name_de, emoji, scientific_name")
      .ilike("scientific_name", sci)
      .limit(1)
      .maybeSingle();

    if (existing) {
      enriched.push({
        scientific_name: existing.scientific_name,
        probability,
        common_name: commonName,
        species_id: existing.id,
        common_name_de: existing.common_name_de,
        emoji: existing.emoji,
        auto_created: false,
      });
      continue;
    }

    // 2. Genus fallback (low-confidence) — vermeidet Spam-Inserts
    if (probability < AUTO_POPULATE_THRESHOLD) {
      const genus = sci.split(" ")[0];
      const { data: genusMatch } = await userClient
        .from("plant_species")
        .select("id, common_name_de, emoji")
        .ilike("scientific_name", `${genus} %`)
        .limit(1)
        .maybeSingle();

      enriched.push({
        scientific_name: sci,
        probability,
        common_name: commonName,
        species_id: genusMatch?.id ?? null,
        common_name_de: genusMatch?.common_name_de ?? null,
        emoji: genusMatch?.emoji ?? null,
        auto_created: false,
      });
      continue;
    }

    // 3. Auto-populate (high confidence + no DB entry)
    const details = sug.details ?? {};
    const waterDays = mapWateringDays(details.watering);
    const fertilizeDays = deriveFertilizeDays(waterDays);
    const light = mapLight(details.best_light_condition ?? details.sunlight);
    const careNotes = buildCareNotes(details);

    const insertRow = {
      scientific_name: sci,
      common_name_de: commonName,
      common_name_en: commonName,
      water_interval_days: waterDays,
      fertilize_interval_days: fertilizeDays,
      repot_interval_months: 24,
      light_requirement: light,
      care_notes: careNotes,
      emoji: null,
    };

    const { data: created, error: insErr } = await adminClient
      .from("plant_species")
      .insert(insertRow)
      .select("id, common_name_de, emoji")
      .single();

    if (insErr) {
      // Race-Condition: parallel angelegt → erneut selecten
      if (insErr.code === "23505") {
        const { data: raced } = await userClient
          .from("plant_species")
          .select("id, common_name_de, emoji")
          .ilike("scientific_name", sci)
          .limit(1)
          .maybeSingle();
        if (raced) {
          enriched.push({
            scientific_name: sci,
            probability,
            common_name: commonName,
            species_id: raced.id,
            common_name_de: raced.common_name_de,
            emoji: raced.emoji,
            auto_created: false,
          });
          continue;
        }
      }
      console.error("auto-populate failed", insErr);
      enriched.push({
        scientific_name: sci,
        probability,
        common_name: commonName,
        species_id: null,
        common_name_de: null,
        emoji: null,
        auto_created: false,
      });
      continue;
    }

    enriched.push({
      scientific_name: sci,
      probability,
      common_name: commonName,
      species_id: created.id,
      common_name_de: created.common_name_de,
      emoji: created.emoji,
      auto_created: true,
    });
  }

  const best = enriched.find((s) => s.species_id) ?? null;

  return jsonResponse({
    suggestions: enriched,
    best_match_species_id: best?.species_id ?? null,
  });
});
