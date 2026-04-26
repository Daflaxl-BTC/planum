# Planum – Intelligentes Pflanzen-Tracking

## Projektübersicht
Planum ist eine Web-App für das Tracking und die Pflege von Zimmerpflanzen in Privathaushalten. Kunden erwerben ein Paket mit 20 QR-Code-Stickern ("Pflanzenslots") auf Amazon und registrieren ihre Pflanzen über die App. Eine KI-Bilderkennung identifiziert die Pflanze und liefert optimale Pflegehinweise.

## Tech-Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Supabase (Auth, DB, Storage, Edge Functions)
- **KI-Bilderkennung**: Plant.id v3 (Kindwise) — Edge Function `identify-plant`
  mit Auto-Populate von `plant_species` bei probability ≥ 0.6
- **Hosting**: Vercel
- **Zahlungen**: Stripe (optional für Shop)
- **QR-Codes**: Unique IDs, verlinken auf `app.planum.de/qr/{slot_uuid}`
  (siehe `ScanResolver` — entscheidet je nach Slot-Status zwischen Code-
  Aktivierung, Haushaltsbeitritt, Pflanze-registrieren oder Detail-Seite)

## Monetarisierungsmodell
- **Einmalkauf**: 19,99€ QR-Code-Paket (20 Slots) auf Amazon
- **Erweiterungspakete**: 9,99€ für 10 zusätzliche Slots
- **Integrierter Shop**: Affiliate-Links für Dünger, Erde, Töpfe
- **Premium-Add-ons**: Erweiterte KI-Diagnose, Krankheitserkennung

## Kernfeatures
1. QR-Code scannen → Pflanze registrieren
2. KI-Bilderkennung zur Pflanzenidentifikation
3. Automatische Pflegeprofile (Gießen, Düngen, Umtopfen)
4. Ampelsystem: 🟢 Gut | 🟡 Bedarf | 🔴 Hoher Bedarf
5. Pflege-Logging (Gießen, Düngen, Umtopfen dokumentieren)
6. Push-Erinnerungen bei fälligen Pflegeaktionen
7. Pflanzengalerie mit Wachstumsverlauf
8. Integrierter Pflegeshop (Affiliate)

## Datenbankschema (Supabase)
Siehe `supabase/migrations/` für das kanonische Schema. Kurzüberblick:
- `profiles` – 1:1 zu `auth.users`, Profil + Benachrichtigungen
- `households` – geteilter Zugang für Familienmitglieder (Owner/Admin/Member)
- `household_members` – Verknüpfung `auth.users` ↔ `households`
- `qr_packages` – Aktivierungscode (`code`) pro Amazon-Paket, bindet an Household
- `qr_slots` – N UUIDs pro Paket; `qr_slots.uuid` steckt im QR-Code-Link
- `plants` – Registrierte Pflanzen, `slot_uuid` referenziert Slot, `household_id` autorisiert
- `care_logs` – Gieß-/Dünge-/Umtopf-/Misting-/Prune-Events (Enum `care_action`)
- `plant_species` – Artendatenbank mit Pflegeinfos (geseedet mit 20 gängigen Arten)

Pflegetermine liegen direkt auf `plants` (`next_water_due_at`, `next_fertilize_due_at`,
`next_repot_due_at`); eine separate `care_schedules`-Tabelle wurde verworfen,
weil die On-Plant-Felder den Use-Case decken.

Mandantenisolation läuft über RLS gegen `household_members`. Aktivierung via
RPC `activate_qr_package(code, household_id)`; Scan-Lookups via
`lookup_plant_uuid(plant_uuid)` (Migration 06: gibt zusätzlich `household_id`,
`household_name` und — nur für Mitglieder — `plant_id` zurück). Beim Signup
wird automatisch ein Default-Haushalt angelegt (Trigger `handle_new_user`).
Slot-Bindung läuft über den Trigger `plants_claim_slot` (Migration 05):
Insert mit `slot_uuid` belegt den Slot exklusiv und blockt Cross-Household-
Versuche. Familien-Beitritt via Slot-Scan über RPC
`join_household_via_slot(slot_uuid)` (Migration 06): macht den scannenden
User zum `member` des Paket-Haushalts (idempotent).

Erst-Charge: 251 Pakete (5020 Slots) werden via
`supabase/seed/initial_packages.sql` erzeugt; Codes/Slot-URLs zum Drucken
exportierst du mit `supabase/seed/export_codes.sql` (CSV-Download im SQL Editor).

## Ordnerstruktur
```
Planum/
├── claude.md              # Diese Datei
├── docs/
│   └── businessplan.md    # Vollständiger Businessplan
├── landing-page/          # Vercel-deploybare Landingpage
│   ├── package.json
│   ├── index.html
│   ├── src/
│   └── public/
├── supabase/
│   ├── migrations/        # SQL-Migrationen (Schema + RLS)
│   ├── functions/         # Edge Functions (z. B. identify-plant)
│   └── seed/              # Hilfsskripte, z. B. Testpaket
└── README.md
```

## Wichtige Links
- **Amazon Listing**: TBD
- **Live App**: TBD (Vercel)
- **GitHub Repo**: TBD
- **PlantNet API**: https://my.plantnet.org/
- **Plant.id API**: https://www.kindwise.com/plant-id

## Nächste Schritte
1. ✅ Businessplan erstellen
2. ✅ Landingpage entwickeln und deployen
3. 🔲 MVP der Web-App (Supabase + React)
4. 🔲 KI-Integration (Plant.id API)
5. 🔲 QR-Code-Generator für Produktion
6. 🔲 Amazon Listing erstellen
7. 🔲 Beta-Test mit 50 Nutzern
