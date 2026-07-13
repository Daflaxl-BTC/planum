// supabase/functions/_shared/careSchedule.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { computeSchedule } from "./careSchedule.ts";

Deno.test("uses plant interval over species, computes due dates", () => {
  const from = new Date("2026-07-13T00:00:00Z");
  const s = computeSchedule(
    { water_interval_days: 7, fertilize_interval_days: 30, repot_interval_months: 24 },
    { water_interval_days: 14, fertilize_interval_days: 60, repot_interval_months: 12 },
    from,
  );
  assertEquals(s.next_water_due_at, "2026-07-20T00:00:00.000Z");
  assertEquals(s.next_fertilize_due_at, "2026-08-12T00:00:00.000Z");
  assertEquals(s.next_repot_due_at, "2028-07-13T00:00:00.000Z");
});

Deno.test("falls back to species then defaults", () => {
  const from = new Date("2026-07-13T00:00:00Z");
  const s = computeSchedule({}, { water_interval_days: 10 }, from);
  assertEquals(s.next_water_due_at, "2026-07-23T00:00:00.000Z");
  assertEquals(s.next_fertilize_due_at, "2026-08-12T00:00:00.000Z"); // default 30
});
