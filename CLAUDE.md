# Planum – Intelligentes Pflanzen-Tracking

## Projektübersicht
Planum ist eine Web-App für das Tracking und die Pflege von Zimmerpflanzen in Privathaushalten. Kunden erwerben ein Paket mit 20 QR-Code-Stickern ("Pflanzenslots") auf Amazon und registrieren ihre Pflanzen über die App. Eine KI-Bilderkennung identifiziert die Pflanze und liefert optimale Pflegehinweise.

## Tech-Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Supabase (Auth, DB, Storage)
- **KI-Bilderkennung**: Plant.id API (Kindwise) / PlantNet API
- **Hosting**: Vercel
- **Zahlungen**: Stripe (optional für Shop)
- **QR-Codes**: Unique IDs, verlinken auf `app.planum.de/plant/{uuid}`
  - ⚠️ Domain uneinheitlich: Mai-Seeds nutzen app.planum.de, Juni-Marketing-Assets www.planumplants.de, Vercel-Deploy unter /app/-Pfad — vor weiteren QR-Drucken final klären.

## Monetarisierungsmodell — Dreistufig: Gratis / Basis / Pro
Leitprinzip **Pro ⊇ Basis** (kein Feature wird höher wieder weggenommen/verkauft). Volle Spec: `docs/entitlements-stufenmodell.md` (Stand 10.07.2026).
- **Gratis**: vollwertig nutzbar, Pflanzen einzeln aufrufbar (max. 5). Bilderverlauf + Timelapse-Video gratis. KI-Pflegeabfragen 1×/Monat je Pflanze (Artenbestimmung bei Erstregistrierung zählt nicht).
- **Basis** (Einmalkauf 19,99€ Sticker-Paket, `basis_unlock` lifetime): unbegrenzte Pflanzen via NFC-Tap, KI 2×/Woche je Pflanze. Erweiterung 9,99€/10 Slots.
- **Pro** (Sensor-Kit 39,99€ + optional Cloud-Abo 2,99€/Mo): Sensor-Autologging, Messwerte für immer gratis; Abo nur für Langzeit-Historie, Multi-User, Sensor-KI-Diagnose.
- **Integrierter Shop**: Affiliate-Links für Dünger, Erde, Töpfe.
- **Durchsetzung**: Entitlements + Quotas serverseitig (Supabase RLS/Edge Functions), nie im Client.

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
- `users` – Auth, Profil
- `qr_packages` – Aktivierungscodes, Lizenz
- `plants` – Registrierte Pflanzen mit Arteninfo
- `care_logs` – Gieß-/Dünge-/Umtopf-Events
- `care_schedules` – KI-generierte Pflegepläne
- `plant_species` – Artendatenbank mit Pflegeinfos

## Ordnerstruktur
```
Planum/
├── CLAUDE.md              # Diese Datei
├── app/                   # Web-App (Vite/React, Supabase, qr-scanner)
├── supabase/              # Migrations, Functions, Seed
├── marketing/             # Marketing-Assets
├── scripts/               # u. a. generate-sample-urls.mjs
├── env/                   # Env-Dateien
├── vercel.json            # Vercel-Konfiguration
├── docs/
│   └── businessplan.md    # Vollständiger Businessplan
├── landing-page/          # Vercel-deploybare Landingpage
│   ├── package.json
│   ├── index.html
│   ├── src/
│   └── public/
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
3. ✅ MVP der Web-App (Supabase + React) — existiert in `app/`
4. ✅ KI-Integration (Plant.id API) — `supabase/functions/identify-plant/index.ts` produktiv & gehärtet (Security-Review PR#7)
5. ✅ QR-Code-Generator für Produktion — existiert in `scripts/`
6. 🔲 Amazon Listing erstellen
7. 🔲 Beta-Test mit 50 Nutzern

---

## 📚 Doku-Index (docs/)

Projekt-Doku liegt in `docs/`. Bei Bedarf gezielt lesen:

- `docs/DEPLOY-ANLEITUNG.md` — Deployment
- `docs/entitlements-stufenmodell.md` — **Entitlement-Modell Gratis/Basis/Pro (maßgeblich)**
- `docs/businessplan.md` — Geschäftsmodell
- `docs/marktanalyse-wettbewerb.md` — Markt & Wettbewerb
- `docs/sticker-design-strategie.md`, `docs/print-specs-nfc-stickers.md` — Sticker & Print-Specs
- `docs/shop-briefing.md` — Shop-Briefing
- weitere: `docs/prompts/`, `docs/manufacturer/`, `docs/sticker-variants-c/`

---

## 🔒 Sicherheit (Threat-Model für `security-guidance`-Plugin)

Das `security-guidance`-Plugin reviewt Diffs automatisch. Bei Planum besonders kritisch:

- **API-Keys (Plant.id / PlantNet / Stripe)**: Nur serverseitig (Supabase Edge Function oder Server-Route). Niemals im React/Vite-Client-Bundle — `VITE_`-Variablen sind öffentlich und dürfen keine Secrets enthalten. Bilderkennung serverseitig proxyen.
- **Supabase RLS**: Auf allen Tabellen (`plants`, `care_logs`, `qr_packages`, …) Row Level Security; Zugriff nur auf eigene `user_id`-Rows. `service_role`-Key nie clientseitig.
- **QR-/Plant-UUIDs**: Nicht erratbar (zufällige UUID), und `app.planum.de/plant/{uuid}` muss serverseitig die Berechtigung prüfen — keine Daten nur über „unguessable URL" schützen.
- **Stripe**: Webhook-Signaturen verifizieren, Beträge/Status serverseitig prüfen.
- **Uploads**: Bild-Uploads validieren (Typ/Größe), nicht ungeprüft an Drittanbieter weiterreichen.
