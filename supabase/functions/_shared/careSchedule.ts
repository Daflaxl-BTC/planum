// supabase/functions/_shared/careSchedule.ts
// Deno-Spiegel von app/src/lib/careLogic.js computeNextDue. Serverseitige Termin-Autoritaet.
const DAY_MS = 24 * 60 * 60 * 1000;

type Intervals = {
  water_interval_days?: number | null;
  fertilize_interval_days?: number | null;
  repot_interval_months?: number | null;
};

function addDays(from: Date, days: number): Date {
  return new Date(from.getTime() + days * DAY_MS);
}
function addMonths(from: Date, months: number): Date {
  const d = new Date(from);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d;
}

export function computeSchedule(plant: Intervals, species: Intervals, from = new Date()) {
  const waterDays = plant.water_interval_days ?? species.water_interval_days ?? 7;
  const fertDays  = plant.fertilize_interval_days ?? species.fertilize_interval_days ?? 30;
  const repotMon  = plant.repot_interval_months ?? species.repot_interval_months ?? 24;
  return {
    next_water_due_at: addDays(from, waterDays).toISOString(),
    next_fertilize_due_at: addDays(from, fertDays).toISOString(),
    next_repot_due_at: addMonths(from, repotMon).toISOString(),
  };
}
