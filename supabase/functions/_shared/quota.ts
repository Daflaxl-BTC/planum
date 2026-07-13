// supabase/functions/_shared/quota.ts
// Serverseitige Kontingent-Pruefung. Nie im Client. service-role liest/schreibt ai_usage.
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export type Unit = "month" | "week" | "none";
export type Limit = { count: number; unit: Unit };

export function limitForTier(tier: string): Limit {
  if (tier === "pro") return { count: Infinity, unit: "none" };
  if (tier === "basis") return { count: 2, unit: "week" };
  return { count: 1, unit: "month" }; // free + fallback
}

export function windowStart(unit: Unit, now = new Date()): Date {
  if (unit === "month") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
  }
  if (unit === "week") {
    return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
  return new Date(0);
}

export function isOverLimit(used: number, limit: Limit): boolean {
  if (limit.count === Infinity) return false;
  return used >= limit.count;
}

export function retryAtFor(unit: Unit, now = new Date()): Date {
  if (unit === "month") {
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  }
  if (unit === "week") {
    return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  }
  return now;
}

// Prueft Kontingent OHNE zu zaehlen (Zaehlung = separater Insert nach Erfolg).
export async function checkCareQuery(
  admin: SupabaseClient, userId: string, plantId: string, now = new Date(),
): Promise<{ ok: boolean; retryAt?: string; unit: Unit }> {
  const { data: ent } = await admin
    .from("entitlements").select("tier").eq("user_id", userId).maybeSingle();
  const limit = limitForTier(ent?.tier ?? "free");
  if (limit.unit === "none") return { ok: true, unit: "none" };

  const since = windowStart(limit.unit, now).toISOString();
  const { count } = await admin
    .from("ai_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId).eq("plant_id", plantId).eq("kind", "care_query")
    .gte("called_at", since);

  if (isOverLimit(count ?? 0, limit)) {
    return { ok: false, retryAt: retryAtFor(limit.unit, now).toISOString(), unit: limit.unit };
  }
  return { ok: true, unit: limit.unit };
}

// Zaehlt einen care_query (nach erfolgreichem Plant.id-Health-Call aufrufen).
export async function countCareQuery(
  admin: SupabaseClient, userId: string, plantId: string,
): Promise<void> {
  await admin.from("ai_usage").insert({ user_id: userId, plant_id: plantId, kind: "care_query" });
}
