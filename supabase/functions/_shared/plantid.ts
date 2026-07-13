// supabase/functions/_shared/plantid.ts
// Plant.id v3 Clients. API-Key nur serverseitig (Deno.env), nie im Client.
const IDENTIFY_URL = "https://plant.id/api/v3/identification";
const HEALTH_URL = "https://plant.id/api/v3/health_assessment";

export type IdentifyResult = { scientific_name: string | null; probability: number };

export async function identifySpecies(apiKey: string, imageBase64: string): Promise<IdentifyResult> {
  const url = new URL(IDENTIFY_URL);
  url.searchParams.set("language", "de");
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ images: [imageBase64], classification_level: "species", similar_images: false }),
  });
  if (!res.ok) throw new Error(`plant.id identify ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const top = json?.result?.classification?.suggestions?.[0];
  return { scientific_name: top?.name ?? null, probability: top?.probability ?? 0 };
}

export type HealthResult = {
  is_healthy: boolean | null;
  is_healthy_probability: number | null;
  diseases: Array<{ name: string; probability: number }>;
};

export async function assessHealth(apiKey: string, imageBase64: string): Promise<HealthResult> {
  const url = new URL(HEALTH_URL);
  url.searchParams.set("language", "de");
  url.searchParams.set("details", "description,treatment");
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Api-Key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ images: [imageBase64], similar_images: false }),
  });
  if (!res.ok) throw new Error(`plant.id health ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  const h = json?.result?.is_healthy;
  const diseaseSug = json?.result?.disease?.suggestions ?? [];
  return {
    is_healthy: h?.binary ?? null,
    is_healthy_probability: h?.probability ?? null,
    diseases: diseaseSug.slice(0, 3).map((d: any) => ({ name: d.name, probability: d.probability })),
  };
}
