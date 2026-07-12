# Claude Code Prompt — Feature: Foto-Verlauf / Wachstumstagebuch

> Copy alles ab `===` in Claude Code rein. Vor Start: `git fetch && git pull --ff-only` (Repo ist aktuell hinter origin/main).

===

## Ziel
Eine Planum-Pflanze hat heute genau ein einziges Foto — das beim Registrieren in `RegisterPlant.jsx` hochgeladene `plants.photo_url`. Das ist zu wenig. Der Businessplan (`docs/businessplan.md` §3.2) verspricht eine **Wachstumsgalerie mit Fotoverlauf**, und die Konkurrenz (Planta, The Plant Map) verkauft das 2026 als Standard-Feature. Wir bauen es jetzt.

Konkret: Der Nutzer soll bei jeder Pflege-Aktion **optional** ein Foto anhängen können, und auf der Pflanzendetailseite eine **chronologische Foto-Galerie** sehen — als Wachstumstagebuch. Zusätzlich braucht es einen Standalone-Eintrag "Nur Foto loggen" (ohne Care-Action).

## Repo-Kontext
- App-Code: `app/src/`
- Stack: React 18 + Vite 5 + Tailwind 3.4 + React Router 6 + Supabase 2.45
- Theme: sage / moss / earth / cream Farben, `font-display` (DM Serif), `rounded-3xl` Cards
- Style-Referenzen (lies vor dem Start): `app/src/pages/PlantDetail.jsx`, `app/src/pages/RegisterPlant.jsx`, `app/src/components/Icons.jsx`

## Datenmodell (fast nichts neu)
`public.care_logs` hat **bereits** eine `photo_url text` Spalte (siehe `supabase/migrations/20260424190037_01_init_schema.sql`). Wir nutzen sie. Plus: neue Action-Enum-Variante `'photo'` für reine Foto-Einträge ohne Pflege-Sinn.

### Migration anlegen
Datei: `supabase/migrations/20260513120000_07_care_logs_photo.sql`

```sql
-- Foto-only Care-Log-Variante: Nutzer kann ein Foto loggen ohne Wasser/Dünger/Umtopfen
alter type public.care_action add value if not exists 'photo';

-- Optional: composite index für Galerie-Queries (plant_id + logged_at)
create index if not exists care_logs_plant_logged_idx
  on public.care_logs(plant_id, logged_at desc);

-- Bucket bleibt 'plants' — gleiche RLS-Pfad-Policy gilt auch für Care-Log-Fotos
```

Apply via Supabase MCP `apply_migration` mit project_id `snttiuvcpryobleinmxs`.

**Wichtig:** Enum-Werte können in Postgres in einer eigenen Transaktion-Migration nur einzeln hinzugefügt werden. Falls Probleme: in zwei Statements splitten (erst `add value`, dann separat den Index).

## UI-Änderungen

### A. PlantDetail.jsx — Care-Buttons mit optionalem Foto
Aktuell: 3 Buttons (Wasser/Dünger/Umtopfen), single click → schreibt sofort care_logs + updated plants. Behalten als **Fast-Path** (langes Tippen / einfaches Tippen → kein Foto).

**Neu:** Tap auf Care-Button öffnet ein **Bottom-Sheet** mit:
1. Großer Button "Nur loggen" (= aktuelles Verhalten, schreibt sofort, schließt Sheet)
2. Button "Mit Foto loggen" → öffnet `<input type=file accept=image/* capture=environment>` → Foto wird hochgeladen, dann care_log mit photo_url geschrieben
3. Optional Textarea "Notiz" (max 200 Zeichen, mappt auf `care_logs.notes`)
4. "Abbrechen"

UX-Detail: Wenn der Nutzer das Foto bereits ausgewählt hat und auf "Speichern" tippt, einen Spinner zeigen während Upload + Insert läuft. Bei Upload-Fehler: Care-Log trotzdem ohne photo_url schreiben + Toast "Foto konnte nicht gespeichert werden, Aktion aber geloggt."

### B. PlantDetail.jsx — "Wachstum"-Sektion (neue Galerie)
Zwischen "KI-Tipp" und "Verlauf" einfügen. Lädt aus `care_logs` alle Einträge mit `photo_url is not null` für die Pflanze, sortiert `logged_at desc`.

Layout:
- Header: "Wachstum" (`font-display text-lg text-sage-900`) + rechts kleiner "+ Foto"-Pill-Button
- Wenn 0 Einträge: leerer State `Karte` mit Icon + Text "Mach dein erstes Wachstums-Foto" + Primary-Button "Foto hinzufügen"
- Wenn ≥1: horizontales Scroll-Carousel (`overflow-x-auto snap-x snap-mandatory`) mit Square-Thumbnails `w-32 h-32 rounded-2xl`. Jedes Thumb zeigt Foto + Datum-Overlay unten links (`prettyDate`)
- Klick auf Thumb → Lightbox-Overlay (full-screen, `bg-black/95`), zeigt Foto in voller Größe, Datum + Action-Label (Gegossen/Gedüngt/Foto), Pfeile zum Navigieren, X zum Schließen, Tap außerhalb schließt auch

### C. PlantDetail.jsx — Standalone "+ Foto"-Aktion
Der "+ Foto"-Pill-Button im Galerie-Header startet direkt den Foto-Picker (kein Bottom-Sheet) und schreibt einen care_log mit `action='photo'`, kein Update auf plants.next_*_due_at.

## Implementierung — neue Komponenten

### `app/src/components/PhotoUpload.js` (neue Util)
Re-use vom Pattern in RegisterPlant.jsx. Funktion `uploadCareLogPhoto(file, userId)` → returns publicUrl oder throws. Pfad: `${userId}/care/${crypto.randomUUID()}.${ext}`. Bucket `plants`. CacheControl `'31536000'`.

### `app/src/components/CareActionSheet.jsx` (neue Komponente)
Props: `{ open, onClose, action, plant, species, onLogged }`. Action ist 'water' | 'fertilize' | 'repot'. Beim Submit: Foto upload (optional) → `supabase.from('care_logs').insert({plant_id, user_id, action, notes, photo_url})` → wenn action ≠ 'photo': plant-update mit neuem next_*_due_at (computeNextDue Logic aus careLogic). Dann `onLogged()`.

UX: Bottom-Sheet via `position: fixed; bottom: 0` + Slide-In, Backdrop `bg-black/40`, max-height 90vh, scrollbar bei Bedarf. Style: `rounded-t-3xl bg-white`.

### `app/src/components/GalleryLightbox.jsx` (neue Komponente)
Props: `{ items, startIndex, onClose }`. items = Array von `{ photo_url, logged_at, action }`. Keyboard: Escape schließt, ← → navigiert. Touch-Swipe für Mobile.

### `app/src/components/PhotoTimeline.jsx` (neue Komponente)
Props: `{ plantId, onAddPhoto }`. Lädt selbständig per useEffect, rendert Header + Carousel + Empty-State. State-Mgmt lokal.

## API-Calls (alle via supabase-js, RLS schützt)

Galerie laden:
```js
const { data } = await supabase
  .from('care_logs')
  .select('id, action, photo_url, logged_at, notes')
  .eq('plant_id', plantId)
  .not('photo_url', 'is', null)
  .order('logged_at', { ascending: false })
  .limit(50)
```

Foto-only log:
```js
const path = `${user.id}/care/${crypto.randomUUID()}.${ext}`
await supabase.storage.from('plants').upload(path, file, { cacheControl: '31536000', upsert: false })
const { data: pub } = supabase.storage.from('plants').getPublicUrl(path)
await supabase.from('care_logs').insert({
  plant_id: plant.id,
  user_id: user.id,
  action: 'photo',
  photo_url: pub.publicUrl,
})
```

## Edge Cases (alle behandeln)
1. **Großes Foto (>10 MB)**: vor Upload via Canvas auf max 1600px Längskante skalieren, dann JPEG 0.85 quality. Util `compressImage(file)`. Browser-only, kein Worker. Wenn das fehlschlägt → original hochladen.
2. **Kein Foto ausgewählt**: Sheet-Submit deaktiviert solange action=photo und kein File. Bei action=water|fertilize|repot ist Foto optional.
3. **Offline / Netzwerk-Fehler beim Upload**: Care-Log trotzdem ohne photo_url speichern, Toast zeigen.
4. **Lightbox auf iOS Safari**: `100vh` ist tückisch → `100dvh` mit Fallback.
5. **`care_logs.action='photo'` in der bestehenden Verlauf-Liste unten in PlantDetail**: braucht ACTION_META-Entry mit Icon (Kamera) + Label "Foto" + Bubble-Stil. Auch dort Thumb falls photo_url da ist.

## Acceptance Criteria
- [ ] Migration läuft sauber, `'photo'` ist in `care_action`-Enum
- [ ] Tap auf Wasser-Button öffnet Bottom-Sheet mit 2 Optionen + optionalem Foto
- [ ] "Nur loggen" verhält sich exakt wie heute (Care-Log + plants-Update + Sheet schließt)
- [ ] "Mit Foto loggen" lädt Bild hoch, schreibt Care-Log mit photo_url
- [ ] Neue Sektion "Wachstum" auf PlantDetail; Empty-State wenn keine Fotos, Carousel wenn ≥1
- [ ] "+ Foto"-Pill rechts im Sektion-Header öffnet direkt Foto-Picker (action='photo')
- [ ] Lightbox: Tap auf Thumb öffnet, X / Backdrop / Escape schließt, ←/→ navigiert
- [ ] Verlauf-Liste unten zeigt 'photo'-Einträge mit Kamera-Icon
- [ ] Build läuft (`cd app && npm run build` → keine Errors, gzip-Größe nicht über +20 KB JS)
- [ ] Mobile-Test auf 375px (iPhone SE) und 414px (iPhone 14 Pro Max) sieht ok aus
- [ ] Keine TypeScript-Errors (wir sind reines JSX, aber lint-clean)

## Out of Scope (NICHT machen)
- Mehrere Fotos pro Care-Log (1:1 bleibt)
- Foto-Editing (Crop/Filter) im Browser
- AI-Wachstums-Analyse ("ist gewachsen?")
- Export der Galerie als PDF/ZIP
- Public-Share-Links

## Reproduzieren / Test
```bash
cd /Users/daflaxl/Developer/planum
git fetch && git pull --ff-only
cd app && npm ci && npm run dev
# Browser: http://localhost:5175/app/
# Login → Pflanze öffnen → Wasser-Button tappen → Foto wählen → speichern → Galerie checken
```

## Wenn Fragen offen sind
Frag Felix bevor du startest. Nicht raten bei: Bottom-Sheet vs Modal, Carousel-Richtung, Action-Reihenfolge, Lightbox-Library (sollte _ohne_ neue Lib gehen).

## Notion-Archivierung am Ende
Eine Unterseite unter [Planum](https://www.notion.so/347bbb18a633816c8187c25353d4e924) mit Titel "📸 Foto-Verlauf — Implementierung". Inhalt: was gebaut wurde, Architektur-Entscheidungen, offene Punkte. Pflicht.

===

**Stand:** 2026-05-13
**Status:** bereit für Claude Code
**Estimated:** 4-6 Stunden Cowork-Session
