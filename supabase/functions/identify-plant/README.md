# identify-plant Edge Function

Ruft die **Plant.id v3 API (Kindwise)** auf, matched gegen `plant_species` und
**legt unbekannte Arten automatisch an**, wenn die Erkennung sicher ist
(probability ≥ 0.6).

## Deploy

```bash
# 1. Plant.id-Key von admin.kindwise.com (Plant.id Produkt aktivieren)
#    → im Supabase-Dashboard setzen, NICHT in CLI/Code
#    https://supabase.com/dashboard/project/snttiuvcpryobleinmxs/functions/secrets
#    Name: KINDWISE_API_KEY

# 2. Function deployen (via CLI oder MCP)
supabase functions deploy identify-plant --project-ref snttiuvcpryobleinmxs
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` werden von
Supabase automatisch in den Function-Env injiziert.

## Auto-Populate-Logik

Für jede Plant.id-Suggestion (top 5):

1. **DB-Match** (case-insensitive `scientific_name`) → existierende `species_id`
2. **probability < 0.6** → Genus-Fallback (z. B. `Ficus ...` matched einen
   beliebigen Ficus-Eintrag), kein Insert
3. **probability ≥ 0.6 + kein DB-Eintrag** → neuer `plant_species`-Row mit:
   - `water_interval_days` aus Plant.id `watering` (Skala 1-3 → 14/7/4 Tage)
   - `fertilize_interval_days` heuristisch aus Watering (4× seltener, 14-60 Tage)
   - `light_requirement` aus `best_light_condition` (Mapping → low/medium/bright/direct)
   - `care_notes` aus `description` + `best_watering` + `best_light_condition` + `best_soil_type`
   - `common_name_de` / `_en` aus `common_names[0]` (Plant.id liefert mit `language=de`)
   - `repot_interval_months` Default 24
   - `emoji` null (UI-Fallback `🪴`)

Race-Conditions auf `scientific_name` UNIQUE werden via `ilike`-Re-Select
abgefangen.

## Antwort-Schema

```json
{
  "suggestions": [
    {
      "scientific_name": "Cannabis sativa",
      "probability": 0.97,
      "common_name": "Hemp",
      "species_id": "uuid",
      "common_name_de": "Hanf",
      "emoji": null,
      "auto_created": true
    }
  ],
  "best_match_species_id": "uuid|null"
}
```

`auto_created: true` zeigt an, dass die Art gerade neu in `plant_species`
angelegt wurde — nützlich für UI-Hinweise wie „neu in deinem Katalog".

## Kosten

- Plant.id v3 Plant Identification: **1 Credit pro Call**
- 100 Credits/Monat im Free-Tier (auch im Commercial-Tier)
- Pay-as-you-go danach: ~$0.025 / Identifikation

`details=common_names,description,watering,best_watering,best_light_condition,
best_soil_type,propagation_methods,toxicity` kostet **keinen Aufpreis** —
nur die Identifikation zählt.

## Sicherheit

- JWT-Auth verpflichtend (`verify_jwt: true`) — anonyme Aufrufe = 401
- `KINDWISE_API_KEY` und `SUPABASE_SERVICE_ROLE_KEY` ausschließlich serverseitig
- Service-Role wird **nur** für `plant_species`-INSERT verwendet, nicht für
  User-Daten (RLS bleibt für alles andere aktiv)

## Migration zu anderem Provider

Falls Plant.id mal nicht passt: nur diese Datei umschreiben, Secret-Name
anpassen. Frontend-Schnittstelle (`{ image_base64 } → { suggestions, best_match_species_id }`)
bleibt stabil.
