// supabase/functions/_shared/ranking.ts
// Reines Ranking: gleiche Art zuerst, dann zuletzt aktualisiert. Keine stille Auto-Zuordnung.
export type RankPlant = { id: string; species_id: string | null; updated_at: string };
export type Identified = { species_id: string | null };

export function rankPlants(
  plants: RankPlant[], identified: Identified,
): { suggested: RankPlant | null; candidates: RankPlant[] } {
  const scored = [...plants].sort((p, q) => {
    const ps = identified.species_id && p.species_id === identified.species_id ? 1 : 0;
    const qs = identified.species_id && q.species_id === identified.species_id ? 1 : 0;
    if (ps !== qs) return qs - ps;                 // Art-Match zuerst
    return new Date(q.updated_at).getTime() - new Date(p.updated_at).getTime(); // neueste zuerst
  });
  return { suggested: scored[0] ?? null, candidates: scored };
}
