# Claude Code Prompt — Feature: Krankheits-Diagnose ("Planum Pro Diagnose")

> Copy alles ab `===` in Claude Code rein. Vor Start: `git fetch && git pull --ff-only` (Repo ist aktuell hinter origin/main). Voraussetzung: das Foto-Verlauf-Feature (01_foto_verlauf.md) ist gemerged.

===

## Ziel
Der Nutzer macht ein Foto von einer kranken / verfärbten / befallenen Pflanze, schickt es an Plant.id `plant.health`-API (Kindwise), bekommt eine strukturierte Diagnose mit Empfehlung. Das ist 2026 ein Standard-Feature (Plantix, PictureThis Premium, Planta haben es) und im Businessplan `docs/businessplan.md` §6 als "Planum Pro Add-on, 4,99 €" definiert.

**Monetarisierungsmodell (entgegen Abo-Konkurrenz):** One-time Stripe-Payment 4,99 € via Stripe Payment Link / Checkout. Schaltet auf dem User-Profil `is_pro_diagnostics = true` frei und damit unbegrenzte Diagnosen. **Beta-Phase: erste 3 Diagnosen pro User gratis**, danach Paywall — damit ein Gefühl dafür entsteht, ohne sofortige Conversion-Hürde.

## Repo-Kontext
- App-Code: `app/src/`
- Edge Functions: `supabase/functions/` (eine existiert schon: `identify-plant`, nimm sie als Architektur-Vorlage)
- Plant.id v3 Key: Supabase Function Secret `KINDWISE_API_KEY` ist bereits gesetzt (siehe `supabase/functions/identify-plant/README.md`)
- Stack-Referenz: `app/src/pages/PlantDetail.jsx`, `app/src/pages/RegisterPlant.jsx`, `supabase/functions/identify-plant/index.ts`

## Datenmodell

### Migration: `supabase/migrations/20260513140000_08_disease_diagnoses.sql`

```sql
-- Krankheits-Diagnosen pro Pflanze
create table public.disease_diagnoses (
  id              uuid primary key default gen_random_uuid(),
  plant_id        uuid not null references public.plants(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  photo_url       text not null,
  is_healthy      boolean,
  health_probability numeric,            -- 0..1
  diseases        jsonb,                 -- normalized array, siehe Edge Function
  raw_response    jsonb,                 -- komplette Plant.id-Antwort zur Audit
  created_at      timestamptz not null default now()
);

alter table public.disease_diagnoses enable row level security;

create policy "User reads own diagnoses"
  on public.disease_diagnoses for select
  using (user_id = auth.uid());

create policy "User inserts own diagnoses"
  on public.disease_diagnoses for insert
  with check (user_id = auth.uid());

create policy "User deletes own diagnoses"
  on public.disease_diagnoses for delete
  using (user_id = auth.uid());

create index disease_diagnoses_plant_idx on public.disease_diagnoses(plant_id, created_at desc);

-- Pro-Flag im Profil
alter table public.profiles
  add column if not exists pro_diagnostics_unlocked_at timestamptz;

-- Helper: Anzahl Diagnosen pro User (für Free-Tier-Limit)
create or replace function public.count_user_diagnoses(p_user uuid)
returns int
language sql
stable
security invoker
as $$
  select count(*)::int from public.disease_diagnoses where user_id = p_user;
$$;
```

Apply via Supabase MCP `apply_migration`, project_id `snttiuvcpryobleinmxs`.

## Edge Function: `supabase/functions/diagnose-plant/index.ts`

Architektur-Vorlage: kopiere Struktur aus `supabase/functions/identify-plant/index.ts` (CORS, JWT-Auth, Service-Role für DB-Write, JSON-Response).

**Endpoint Plant.id v3 Health:**
```
POST https://plant.id/api/v3/health_assessment
Headers: Api-Key: <KINDWISE_API_KEY>, Content-Type: application/json
Query:   ?details=local_name,description,url,treatment,classification,common_names,cause
Body:    { "images": ["data:image/jpeg;base64,...AAAB..."], "similar_images": true }
```

(Doku verifizieren: `https://documenter.getpostman.com/view/24599534/2s93z5A4v2`. Wenn die Query-Param-Detail-Liste sich geändert hat, anpassen.)

**Flow in der Function:**
1. Auth: JWT aus Authorization-Header validieren (anon-client + getUser → user_id).
2. Body parsen: `{ image_base64: string, plant_id: uuid }`.
3. Free-Tier-Check: 
   - `profiles.pro_diagnostics_unlocked_at` is not null → erlaubt
   - Sonst: `count_user_diagnoses(user_id) < 3` → erlaubt
   - Sonst: 402 Payment Required mit `{ error: 'paywall', stripe_url: <Payment Link> }`
4. Plant.id-Call mit base64.
5. Response normalisieren: 
   ```ts
   {
     is_healthy: boolean,
     health_probability: number,
     diseases: Array<{
       name: string,         // e.g. "Powdery mildew"
       name_de: string|null, // wenn classification.de existiert
       probability: number,
       description: string|null,
       treatment: {
         biological: string|null,
         chemical: string|null,
         prevention: string|null,
       },
       similar_image_urls: string[],
     }>
   }
   ```
6. Foto in Storage hochladen (Service-Role-Client, bucket `plants`, Pfad `${user_id}/diagnoses/${uuid}.jpg`), publicUrl holen.
7. `disease_diagnoses` INSERT mit normalisierter + raw response.
8. Response an Client: `{ diagnosis_id, is_healthy, health_probability, diseases, photo_url }`.

**Wichtig:** Service-Role-Key NIE im Client. Nur für den Insert verwenden. Den Storage-Upload kann auch der User-Client (anon mit JWT) machen, aber: dann muss der Path `${user_id}/...` per RLS-Policy auf storage.objects exakt matchen — was er tut (siehe Migration 02). → entweder klappt user-side direkt, oder server-side mit service-role. Empfehlung: **user-side im Frontend** vor dem Edge-Function-Call (analog zu RegisterPlant.jsx), damit die Function nur die URL übergeben bekommt. Spart Bandbreite (Server muss base64 nicht doppelt halten) — base64 geht ohnehin nur an Plant.id.

→ Refactor: Body wird zu `{ photo_url: string, plant_id: uuid }`, Function fetcht das Bild selbst und konvertiert zu base64 für Plant.id. Photo wird vom Client ins Bucket hochgeladen.

**Secrets prüfen:**
```bash
supabase secrets list --project-ref snttiuvcpryobleinmxs
# KINDWISE_API_KEY sollte existieren
```

## UI-Änderungen

### A. PlantDetail.jsx — Neuer Bereich "Gesundheits-Check"
Zwischen "Wachstum"-Sektion und "Verlauf" einfügen.

Layout:
- Header: "Gesundheits-Check" mit kleinem Pulse-Sparkles-Icon (medical mood)
- Wenn 0 Diagnosen je gemacht: Karte mit "Sieht deine Pflanze krank aus? Mach ein Foto, wir prüfen es." + Button "Diagnose starten" (primary)
- Wenn ≥1 Diagnose: Liste der letzten 3 Diagnosen als kleine Karten (Foto-Thumb 56×56 + Status-Pill grün/gelb/rot + Datum) → Klick öffnet `DiagnosisDetail`-Modal mit voller Auflösung + Krankheits-Details + Empfehlung
- Button "+ Neue Diagnose" unten

### B. Neue Page `app/src/pages/DiagnoseRunner.jsx` (Route `/plant/:id/diagnose`)
Drei States:
1. **Foto-Aufnahme**: Input wie in RegisterPlant, Capture-Mode environment, Vorschau, Button "Diagnostizieren"
2. **Loading**: Spinner + animierter Hinweis-Text-Carousel ("Foto wird hochgeladen", "KI prüft Blätter", "Suche nach Anzeichen…", "Vergleiche mit Datenbank…", "Fast geschafft…")
3. **Ergebnis**: 
   - Banner oben: "Pflanze sieht gesund aus (94%)" grün / "Wir haben Auffälligkeiten gefunden (78% Vertrauen)" gelb / rot je nach is_healthy
   - Wenn nicht gesund: Liste der Top-3 Krankheiten als aufklappbare Karten mit:
     - Name (DE wenn vorhanden, sonst EN)
     - Wahrscheinlichkeit als Progress-Bar
     - Beschreibung (max 2 Zeilen, expandable)
     - Behandlung: 3 Tabs (Bio / Chemisch / Vorbeugung)
     - Ähnliche Beispielbilder (2-3 Thumbs)
   - "Speichern und schließen" → zurück zu PlantDetail
   - "Weitere Diagnose" → reset auf State 1

### C. Free-Tier + Paywall UX
- Auf PlantDetail klein anzeigen: "X von 3 Gratis-Diagnosen verbraucht" (wenn `pro_diagnostics_unlocked_at is null`)
- Bei 402-Response: Paywall-Sheet zeigen mit:
  - Headline: "Unbegrenzte Diagnosen freischalten"
  - "4,99 € einmalig, kein Abo"
  - "Verfügbar für alle deine Pflanzen, für immer"
  - Primary-Button → Stripe-Payment-Link in neuem Tab
  - Sekundärlink: "Vielleicht später"

### D. Settings.jsx — Pro-Status anzeigen
Neue Karte: "Planum Pro Diagnose" mit Status (Aktiv seit … / Nicht aktiv) und falls aktiv: Reset-Datum n/a (one-time, nie Ablauf).

## Stripe-Integration (minimal)

**Phase 1 (für diesen Prompt):** Stripe Payment Link manuell in Stripe-Dashboard erstellen (4,99 € EUR, success_url enthält `?session_id={CHECKOUT_SESSION_ID}`), Link als env-var `VITE_STRIPE_DIAGNOSIS_URL` in Vercel.

**Webhook später:** Eigene Edge Function `stripe-webhook` verifiziert Signature, setzt `profiles.pro_diagnostics_unlocked_at = now()` für die `user_id` aus der Checkout-Session (custom_field "user_id" beim Payment-Link konfigurieren).

→ Für DIESE Implementierung: TODO im Code lassen, Stripe-Webhook ist eigenes Folge-Ticket. Manuelles Setzen via SQL im Notfall ok.

## Edge Cases
1. **Plant.id Rate-Limit / Timeout**: 504 zurück, Frontend zeigt "Versuch es gleich nochmal" + Button "Erneut versuchen"
2. **Foto unscharf / kein Pflanzen-Foto**: Plant.id antwortet mit `is_plant: false` oder sehr niedriger Probability → Frontend zeigt "Wir konnten keine Pflanze auf dem Foto erkennen. Probiere ein helleres Foto"
3. **Free-Tier abgelaufen**: 402 mit Paywall-Sheet, kein Foto wurde verbraucht (Counter erst nach erfolgreichem Insert hochzählen)
4. **Sehr große Bilder**: Vor Upload auf 1280px Längskante komprimieren (Plant.id braucht keine Mega-Auflösung, spart Kosten + Latenz)
5. **Doppel-Klick auf "Diagnostizieren"**: Button disabled während laufenden Calls
6. **Pflanze wurde gelöscht während Diagnose lief**: Beim Insert FK-Fehler → Frontend Toast "Pflanze nicht mehr vorhanden"
7. **Mehrere Diagnosen kurz hintereinander**: kein Throttle, aber Plant.id-Kostenkontrolle via Free-Tier (3 Gratis hart deckeln)

## Acceptance Criteria
- [ ] Migration 08 sauber durchgelaufen, RLS-Policies aktiv
- [ ] Edge Function `diagnose-plant` deployed und mit anon-key + JWT testbar
- [ ] Auf PlantDetail erscheint "Gesundheits-Check"-Sektion mit Empty-State
- [ ] `/plant/:id/diagnose` Route funktioniert, Foto-Capture + Loading + Ergebnis-Anzeige
- [ ] Diagnose wird persistiert (`disease_diagnoses` Row mit Photo, Disease-Array, raw_response)
- [ ] Liste der letzten 3 Diagnosen auf PlantDetail zeigt korrekt Status-Farbe
- [ ] DiagnosisDetail-Modal zeigt Behandlungs-Tabs (Bio/Chemisch/Vorbeugung)
- [ ] 3-Gratis-Limit greift; 4. Diagnose triggert 402 + Paywall-Sheet
- [ ] Paywall-Sheet hat funktionierenden Link auf Stripe Payment Link (Test-Mode)
- [ ] Settings zeigt Pro-Status korrekt an
- [ ] Build durch (`cd app && npm run build`)
- [ ] Edge Function-Logs sauber, keine Service-Role-Key-Leaks
- [ ] Lighthouse Performance auf /diagnose nicht unter 80

## Out of Scope (NICHT machen)
- Stripe Webhook-Implementation (eigenes Ticket)
- Foto-Editor (Markierung der kranken Stelle)
- AI-Treatment-Recommendations selbst generieren (Plant.id liefert sie)
- Mehrere Pflanzen pro Diagnose
- Push-Notification "Krankheit verschlimmert sich"
- Tierarzt-/Experten-Chat (Planta-Feature, später)

## Kosten-Schätzung Plant.id
Plant.id v3 health_assessment: ~0.05 USD pro Call (siehe Kindwise-Pricing). Bei 1.000 aktiven Nutzern und 2 Diagnosen / Monat ≈ 100 USD / Monat. Free-Tier-Limit 3 pro User deckt Lifetime, danach Pro-Conversion → break-even bei ~1% Conversion-Rate.

## Reproduzieren / Test
```bash
cd /Users/daflaxl/Developer/planum
git fetch && git pull --ff-only

# Migration
supabase db push --project-ref snttiuvcpryobleinmxs

# Edge Function
supabase functions deploy diagnose-plant --project-ref snttiuvcpryobleinmxs

# Frontend
cd app && npm run dev
# Test: Pflanze öffnen → "Diagnose starten" → Foto einer mit Schädling befallenen Pflanze
# (Test-Foto: googelt "powdery mildew leaf" zum Validieren der Erkennung)
```

## Wenn Fragen offen sind
Frag Felix bei: Stripe-Account-Owner-Email, Stripe-Test-vs-Live, Free-Tier-Anzahl (aktuell 3, Felix kann ändern), Pricing-Wahl (4,99 € fix oder konfigurierbar).

## Notion-Archivierung am Ende
Eine Unterseite unter [Planum](https://www.notion.so/347bbb18a633816c8187c25353d4e924) mit Titel "🩺 Krankheits-Diagnose Pro — Implementierung". Inhalt: Architektur-Skizze, Kosten-Modell, Edge-Function-Diagram, offene Punkte (Stripe-Webhook). Pflicht.

===

**Stand:** 2026-05-13
**Status:** bereit für Claude Code (nach Foto-Verlauf)
**Estimated:** 1-2 Cowork-Sessions (DB + Edge Function ~3h, Frontend + UI ~5h)
**Voraussetzung:** Feature `01_foto_verlauf.md` ist gemerged (wegen geteilter PhotoUpload-Util)
