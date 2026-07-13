// supabase/functions/_shared/quota.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { limitForTier, windowStart, isOverLimit, retryAtFor } from "./quota.ts";

Deno.test("limitForTier maps tiers", () => {
  assertEquals(limitForTier("free"), { count: 1, unit: "month" });
  assertEquals(limitForTier("basis"), { count: 2, unit: "week" });
  assertEquals(limitForTier("pro"), { count: Infinity, unit: "none" });
  assertEquals(limitForTier("unknown"), { count: 1, unit: "month" });
});

Deno.test("windowStart month = first of month UTC", () => {
  const now = new Date("2026-07-13T10:00:00Z");
  assertEquals(windowStart("month", now).toISOString(), "2026-07-01T00:00:00.000Z");
});

Deno.test("windowStart week = 7 days back", () => {
  const now = new Date("2026-07-13T10:00:00Z");
  assertEquals(windowStart("week", now).toISOString(), "2026-07-06T10:00:00.000Z");
});

Deno.test("isOverLimit compares used vs limit", () => {
  assertEquals(isOverLimit(1, { count: 1, unit: "month" }), true);
  assertEquals(isOverLimit(0, { count: 1, unit: "month" }), false);
  assertEquals(isOverLimit(5, { count: Infinity, unit: "none" }), false);
});

Deno.test("retryAtFor month = next month first", () => {
  const now = new Date("2026-07-13T10:00:00Z");
  assertEquals(retryAtFor("month", now).toISOString(), "2026-08-01T00:00:00.000Z");
});
