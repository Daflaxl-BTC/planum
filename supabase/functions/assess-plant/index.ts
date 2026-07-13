// supabase/functions/assess-plant/index.ts
// NFC/Skip Foto-Update. service-role: Storage-Upload, plant_photos-Insert, plants-Update.
// Kontingent + Haushaltszugehoerigkeit serverseitig geprueft; Client nie vertraut.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { checkCareQuery, countCareQuery } from "../_shared/quota.ts";
import { rankPlants } from "../_shared/ranking.ts";
import { computeSchedule } from "../_shared/careSchedule.ts";
import { identifySpecies, assessHealth } from "../_shared/plantid.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const apiKey = Deno.env.get("KINDWISE_API_KEY");
  if (!supabaseUrl || !supabaseAnon || !serviceKey || !apiKey) return json({ error: "env missing" }, 500);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "missing authorization header" }, 401);

  let body: any = {};
  try { body = await req.json(); } catch { return json({ error: "invalid json" }, 400); }
  const mode = body.mode;

  const userClient = createClient(supabaseUrl, supabaseAnon, { global: { headers: { Authorization: authHeader } } });
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) return json({ error: "not authenticated" }, 401);
  const userId = userData.user.id;

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  // Haushalte des Users (fuer Autorisierung + Ranking-Scope)
  const { data: memberships } = await admin
    .from("household_members").select("household_id").eq("user_id", userId);
  const householdIds = (memberships ?? []).map((m: any) => m.household_id);
  if (householdIds.length === 0) return json({ error: "no household" }, 403);

  // ---- mode: confirm (Skip-Nachgang) ----
  if (mode === "confirm") {
    const { photo_id, plant_id } = body;
    if (!photo_id || !plant_id) return json({ error: "photo_id + plant_id required" }, 400);
    const plant = await loadOwnedPlant(admin, plant_id, householdIds);
    if (!plant) return json({ error: "plant not in household" }, 403);

    const species = await loadSpecies(admin, plant.species_id);
    const sched = computeSchedule(plant, species ?? {}, new Date());
    await admin.from("plant_photos").update({ plant_id, status: "confirmed" }).eq("id", photo_id);
    const { data: photo } = await admin.from("plant_photos").select("image_url").eq("id", photo_id).maybeSingle();
    await admin.from("plants").update({ ...sched, photo_url: photo?.image_url ?? undefined }).eq("id", plant_id);
    return json({ ok: true });
  }

  // ---- mode: assess (NFC + Skip) ----
  if (mode !== "assess") return json({ error: "unknown mode" }, 400);
  const imageBase64 = body.image_base64;
  if (!imageBase64 || typeof imageBase64 !== "string" || imageBase64.length < 100) {
    return json({ error: "image_base64 required" }, 400);
  }

  // Bild serverseitig hochladen (Bucket plants)
  const bytes = Uint8Array.from(atob(imageBase64), (c) => c.charCodeAt(0));
  const path = `${householdIds[0]}/${crypto.randomUUID()}.jpg`;
  const { error: upErr } = await admin.storage.from("plants").upload(path, bytes, { contentType: "image/jpeg" });
  if (upErr) { console.error("upload failed", upErr); return json({ error: "upload failed" }, 500); }
  const { data: pub } = admin.storage.from("plants").getPublicUrl(path);
  const imageUrl = pub.publicUrl;

  if (body.plant_id) {
    // NFC-Zweig: Pflanze bekannt
    const plant = await loadOwnedPlant(admin, body.plant_id, householdIds);
    if (!plant) return json({ error: "plant not in household" }, 403);

    const quota = await checkCareQuery(admin, userId, plant.id);
    if (!quota.ok) return json({ error: "quota exceeded", retryAt: quota.retryAt }, 429);

    let assessment;
    try { assessment = await assessHealth(apiKey, imageBase64); }
    catch (e) { console.error(e); return json({ error: "assessment failed" }, 502); }

    await countCareQuery(admin, userId, plant.id);
    const { data: photo } = await admin.from("plant_photos").insert({
      plant_id: plant.id, household_id: plant.household_id, user_id: userId,
      image_url: imageUrl, source: "nfc", status: "confirmed", assessment,
    }).select("id").single();

    const species = await loadSpecies(admin, plant.species_id);
    const sched = computeSchedule(plant, species ?? {}, new Date());
    await admin.from("plants").update({ ...sched, photo_url: imageUrl }).eq("id", plant.id);
    return json({ photo_id: photo?.id, assessment, plant_id: plant.id });
  }

  // Skip-Zweig: Pflanze unbekannt → Identify + Ranking + Bestaetigung
  let species_id: string | null = null;
  try {
    const ident = await identifySpecies(apiKey, imageBase64);
    if (ident.scientific_name) {
      const { data: sp } = await admin.from("plant_species")
        .select("id").ilike("scientific_name", ident.scientific_name).limit(1).maybeSingle();
      species_id = sp?.id ?? null;
    }
  } catch (e) { console.error("identify failed", e); /* Ranking faellt auf zuletzt zurueck */ }

  const { data: plants } = await admin.from("plants")
    .select("id, species_id, updated_at, household_id, nickname, photo_url")
    .in("household_id", householdIds).is("archived_at", null);
  const ranked = rankPlants((plants ?? []) as any, { species_id });
  const suggested = ranked.suggested;

  let assessment;
  try { assessment = await assessHealth(apiKey, imageBase64); }
  catch (e) { console.error(e); return json({ error: "assessment failed" }, 502); }

  // Quota gegen suggested (falls vorhanden); ohne suggested wird bei confirm gezaehlt.
  if (suggested) {
    const quota = await checkCareQuery(admin, userId, suggested.id);
    if (!quota.ok) return json({ error: "quota exceeded", retryAt: quota.retryAt }, 429);
    await countCareQuery(admin, userId, suggested.id);
  }

  const { data: photo } = await admin.from("plant_photos").insert({
    plant_id: suggested?.id ?? null, household_id: householdIds[0], user_id: userId,
    image_url: imageUrl, source: "skip", status: "pending", assessment,
  }).select("id").single();

  return json({
    photo_id: photo?.id, assessment,
    suggested: suggested ? { plant_id: suggested.id, nickname: (suggested as any).nickname } : null,
    candidates: ranked.candidates.map((p: any) => ({ plant_id: p.id, nickname: p.nickname, photo_url: p.photo_url })),
  });
});

async function loadOwnedPlant(admin: any, plantId: string, householdIds: string[]) {
  const { data } = await admin.from("plants")
    .select("id, species_id, household_id, water_interval_days, fertilize_interval_days, repot_interval_months")
    .eq("id", plantId).maybeSingle();
  if (!data || !householdIds.includes(data.household_id)) return null;
  return data;
}
async function loadSpecies(admin: any, speciesId: string | null) {
  if (!speciesId) return null;
  const { data } = await admin.from("plant_species")
    .select("water_interval_days, fertilize_interval_days, repot_interval_months").eq("id", speciesId).maybeSingle();
  return data;
}
