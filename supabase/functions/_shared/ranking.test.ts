// supabase/functions/_shared/ranking.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { rankPlants } from "./ranking.ts";

const plants = [
  { id: "a", species_id: "monstera", updated_at: "2026-07-01T00:00:00Z" },
  { id: "b", species_id: "ficus",    updated_at: "2026-07-10T00:00:00Z" },
  { id: "c", species_id: "monstera", updated_at: "2026-07-12T00:00:00Z" },
];

Deno.test("same species ranks first, newest updated wins tiebreak", () => {
  const r = rankPlants(plants, { species_id: "monstera" });
  assertEquals(r.suggested?.id, "c");
  assertEquals(r.candidates.map((p) => p.id), ["c", "a", "b"]);
});

Deno.test("no species match falls back to newest updated", () => {
  const r = rankPlants(plants, { species_id: "unknown" });
  assertEquals(r.suggested?.id, "c"); // c newest updated overall
});

Deno.test("empty plant list returns null suggested", () => {
  const r = rankPlants([], { species_id: "monstera" });
  assertEquals(r.suggested, null);
  assertEquals(r.candidates, []);
});
