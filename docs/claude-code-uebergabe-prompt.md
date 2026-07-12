# Übergabe-Prompt an Claude Code – Planum Web→iOS-Migration

> **Anleitung für Felix:** Öffne ein Terminal, wechsle ins Projekt und starte Claude Code. Kopiere danach den gesamten Block unter „PROMPT-BEGINN" bis „PROMPT-ENDE" als erste Nachricht in Claude Code.
>
> ```bash
> cd /Users/daflaxl/Gewerbe/Developer/planum
> claude
> ```
>
> **Vor dem Start bitte die fünf Entscheidungen aus `docs/ios-migration-plan.md` Abschnitt 10 beantworten** und im Prompt unten in den `[ENTSCHEIDUNG: …]`-Feldern eintragen.

---

## PROMPT-BEGINN

Du bist der ausführende Entwickler für die Migration des Projekts **Planum** von einer reinen Web-App zu einer nativen iOS-App. Der vollständige strategische Plan liegt in `docs/ios-migration-plan.md` – **lies ihn zuerst vollständig**, ebenso `CLAUDE.md`, `docs/entitlements-stufenmodell.md` und `docs/produktionsfahrplan-2026-07.md`. Halte dich an das dort dokumentierte Threat-Model und das Prinzip „Pro ⊇ Basis".

### Meine Rahmenentscheidungen (vom Auftraggeber vorgegeben)
- **Kanonische Slot-Domain:** `planumplants.de` (apex; `www` → 301 auf apex). Diese Domain dient zugleich als **Web-Rückfallebene**: Wird ein NFC-Sticker angetippt und die App ist **nicht** installiert, öffnet iOS via Universal Links automatisch die hinterlegte Website (die Pflanzenseite). Ist die App installiert, fängt sie den Tap ab. Die AASA-Datei und die Web-Routen `/nfc/*` und `/p/*` müssen also live und funktionsfähig sein, bevor Sticker gedruckt werden.
- **Apple Developer Program vorhanden:** ja.
- **Mac mit Xcode + Simulator verfügbar:** ja.
- **Basis zusätzlich als In-App-Kauf anbieten:** ja. Die Apple-Compliance für In-App-Käufe (Steuer-/Bankdaten, Verträge im App Store Connect) ist bereits vollständig eingerichtet — StoreKit-Produkte können direkt angelegt werden.
- **App Clip im MVP:** nein. Der Erstkontakt ohne installierte App wird über die Web-Rückfallebene (Universal-Links-Fallback auf `planumplants.de`) abgedeckt, nicht über einen App Clip. App Clip bleibt optionale Kür für Phase 3.

### Migrationsweg (verbindlich)
Wir nutzen **Capacitor**, nicht React Native. Der bestehende React/Vite-Code in `app/` bleibt die Quelle der Wahrheit und wird zu ~95 % unverändert weitergenutzt. Kein Totalneubau.

### Eiserne Sicherheitsregeln (nicht verhandelbar)
- Keine Secrets im Client. `VITE_`-Variablen enthalten ausschließlich Supabase-URL und anon-Key.
- Alle Berechtigungs-, Kontingent- und Zahlungsprüfungen serverseitig (Supabase RLS + Edge Functions).
- `service_role`-Key niemals clientseitig.
- Nach jeder Migration/Function: kurz erläutern, welche RLS-Policies greifen.

### Arbeitsweise
- Arbeite Phase für Phase. Nach jeder Phase: kurze Zusammenfassung + Commit-Vorschlag, dann auf mein „weiter" warten.
- Gib mir bei jedem Schritt, der eine externe Anwendung betrifft (Supabase, Vercel, Apple Developer, GitHub), **den Direktlink** und **alle konkreten Werte/Secrets/IDs**, die ich dort eintragen muss.
- Gib mir Terminalbefehle immer vollständig zum Copy/Pasten – inklusive des `cd`-Befehls in den richtigen Ordner.
- Wenn dir Kontext fehlt, frage mich, bevor du rätst.

---

### PHASE 0 – Fundament & Korrekturen
1. Korrigiere in `CLAUDE.md` die Statuszeile: KI-Integration (Plant.id) ist **erledigt (✅)**, da `supabase/functions/identify-plant/index.ts` produktiv und gehärtet existiert.
2. Erstelle eine neue Supabase-Migration mit den Tabellen `entitlements`, `ai_usage`, `push_tokens` gemäß `docs/ios-migration-plan.md` Abschnitt 5.1 und 5.4, inkl. RLS (Lesen nur eigener Datensatz, Schreiben nur service-role).
3. Zeige mir den exakten Supabase-Migrationsbefehl und den Direktlink zum SQL-Editor bzw. zur Migrations-Übersicht meines Projekts (ref: `snttiuvcpryobleinmxs`, Region eu-central-1).
4. Lege die Ordner `native/aasa/`, `native/icons/`, `native/entitlements/` sowie `docs/app-store-compliance.md` und `docs/nfc-token-spec.md` als Gerüst an.

### PHASE 1 – Capacitor-Schale & native Basics
1. Initialisiere Capacitor in `app/` (`@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`), erzeuge `capacitor.config.ts` mit korrekter App-ID/Bundle-ID und generiere das `ios/`-Projekt.
2. Konfiguriere **Associated Domains** und lege die `apple-app-site-association`-Datei unter `native/aasa/` an, mit den Pfaden `/nfc/*` und `/p/*` auf der kanonischen Domain. Nenne mir, wohin die AASA-Datei live deployt werden muss (Vercel-Pfad `/.well-known/apple-app-site-association`, ohne Dateiendung, Content-Type `application/json`).
3. Push-Setup: `push_tokens`-Registrierung im Client, Edge Function `push-dispatch` (APNs via `.p8`). Sage mir, wo ich Key ID, Team ID und den `.p8`-Inhalt als Supabase-Secrets hinterlege (Direktlink zu Project Settings → Edge Functions → Secrets).
4. Anleitung für den ersten TestFlight-Build (Schritte in Xcode + `npx cap sync ios`).

### PHASE 2 – NFC, Entitlements, IAP
1. Core-NFC-Integration: signierter Token-Flow gemäß `docs/nfc-token-spec.md`. Edge Function `nfc-redeem` (Signaturprüfung, Ablauf, Nonce-Replay-Schutz, Slot-Bindung). Skript `scripts/sign-nfc-token.mjs` für die Chip-Bespielung.
2. Edge Function `enforce-entitlements` bzw. Postgres-RPC `check_and_consume_quota`; schalte sie **vor** den Plant.id-Aufruf in `identify-plant`. Beachte: Erstbestimmung der Art zählt **nicht** ins Kontingent.
3. StoreKit/IAP: Produkte definieren (Basis-Unlock, 10er-Slot-Paket, Pro-Cloud-Abo), Edge Function `iap-verify` (Apple-Receipt/JWS-Validierung, setzt `entitlements`). Basis auch als In-App-Kauf, falls oben mit „ja" entschieden.
4. Compliance-Durchgang gegen `docs/app-store-compliance.md` (Guideline 3.1.1, Account-Löschung in-App, NFC-Usage-Description, Datenschutz-Label).

### PHASE 3 – Feinschliff & Zusatzfeatures
Offline-Cache, native Kamera/Timelapse, Homescreen-Widget (Ampelstatus), optional App Clip. Details in `docs/ios-migration-plan.md` Abschnitt 6.

### PHASE 4 – Einreichung
App-Store-Metadaten, Screenshots, Datenschutzangaben, Review-Einreichung. Web-Kanal (Vercel) bleibt parallel live.

---

Beginne mit **Phase 0, Schritt 1**. Bestätige zuerst in zwei, drei Sätzen dein Verständnis des Plans und liste, was du in Phase 0 anfassen wirst – dann warte auf mein „los".

## PROMPT-ENDE
