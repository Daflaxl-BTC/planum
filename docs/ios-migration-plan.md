# Planum – Migrationsplan: Von der Web-Ebene zur iOS-App

**Stand:** 12.07.2026 · **Autor:** Strategie-/Architektur-Vorbereitung für Umsetzung mit Claude Code
**Leitmotiv:** *Festina lente* – „Eile mit Weile". Wir bewahren den bestehenden, sicherheitsgehärteten Web-Kern und legen die native Hülle darum, statt in blindem Aktionismus neu zu bauen.

---

## 0. Executive Summary (die Kurzfassung für den eiligen Blick)

Planum besitzt bereits einen tragfähigen Web-Kern: React/Vite-Frontend, Supabase-Backend mit durchgehender Row Level Security, eine serverseitig gehärtete Plant.id-Edge-Function und ein durchdachtes dreistufiges Monetarisierungsmodell. Der pragmatische, risikoärmste Weg zur iOS-App führt **nicht** über einen Totalneubau in React Native, sondern über **Capacitor** – eine dünne native Schale, die exakt unseren vorhandenen Web-Code kapselt und ihm Zugriff auf Core NFC, Push, Kamera und App-Store-Präsenz verschafft.

Drei Dinge entscheiden über Erfolg oder Scheitern der App-Ebene, und alle drei sind eher juristisch-architektonischer als programmatischer Natur:

1. **Die Domain-Entscheidung** (app.planum.de vs. www.planumplants.de) muss *vor* jedem NFC-Druck fallen – sie ist die Wurzel der Universal Links, ohne die iOS keine Hintergrund-NFC-Taps auf unsere App leitet.
2. **Das App-Store-Compliance-Risiko** beim Basis-Unlock: Ein per Amazon erworbener Freischaltcode darf nach Apples Richtlinien Features nur *optional* freischalten – ein regulärer In-App-Kauf muss zusätzlich existieren. Hier drohen sonst Ablehnung im Review.
3. **Die serverseitige Durchsetzung** von Entitlements und Quotas. Sie existiert konzeptionell, aber noch nicht als eigene Tabellenschicht – diese Lücke schließen wir jetzt, bevor Geld fließt.

Dieser Plan liefert: die technische Migrationsstrecke, die gehärtete Sicherheitsarchitektur, kuratierte Zusatzfeatures, die empfohlene Ordnerstruktur und – als separates Dokument – den vollständigen Übergabe-Prompt für Claude Code.

---

## 1. Ausgangslage – was wir bereits besitzen (die ehrliche Bestandsaufnahme)

Eine seriöse Migration beginnt mit einer nüchternen Inventur. *Sine ira et studio* – ohne Zorn und Eifer, wie Tacitus es forderte:

**Vorhanden und tragfähig:**
- `app/` – React 18.3.1, Vite 5.3.4, Tailwind 3.4.4, `@supabase/supabase-js`, `qr-scanner`, `react-router-dom`. Reines JSX, kein TypeScript.
- `supabase/migrations/…_01_init_schema.sql` – Tabellen `profiles`, `plant_species`, `qr_packages`, `plants`, `qr_slots`, `care_logs`; durchgängige RLS-Policies nach dem Muster `auth.uid() = user_id`; Trigger `handle_new_user`, `touch_updated_at`.
- `supabase/functions/identify-plant/index.ts` – **vollständig implementierte** Plant.id-v3-Integration mit JWT-Prüfung, service-role-getrennter Artenpopulation, Größenlimit und Rate Limiting. Sicherheitsreview PR#7 bereits durchlaufen.
- `docs/entitlements-stufenmodell.md` – maßgebliche Spezifikation des Gratis/Basis/Pro-Modells.
- `docs/produktionsfahrplan-2026-07.md` – Compliance (GPSR, LUCID, DPMA), Zeitachse, Domain-Baustelle.
- `scripts/` – QR-Code-Generator für die Produktion.

**Diskrepanz, die korrigiert werden muss:** `CLAUDE.md` markiert die KI-Integration noch als offen (🔲), obwohl die Edge Function längst produktiv und gehärtet ist. Die Dokumentation hinkt dem Code hinterher – ein klassisches Beispiel dafür, dass Landkarten veralten, während das Gelände sich wandelt. Erste Amtshandlung von Claude Code sollte die Aktualisierung dieser Statuszeile sein.

**Noch nicht vorhanden (die echten Baustellen):**
- Keine eigene Entitlements-/Quota-Tabellenschicht – Tier-Logik lebt bislang nur im Konzept.
- Kein `ai_usage`-Log zur serverseitigen Kontingent-Durchsetzung.
- Keine native Schale, kein NFC-Handling, kein Push-Setup.
- Keine App-Store-konforme IAP-Schicht (StoreKit/Receipt-Validierung).
- Domain-Uneinheitlichkeit ungelöst (dreifach: app.planum.de / www.planumplants.de / Vercel-/app/-Pfad).

---

## 2. Die strategische Weichenstellung: Capacitor statt Rewrite

### 2.1 Der Entscheid und seine Begründung

Vor uns liegen zwei Wege, und die Wahl gleicht der berühmten Weggabelung des Herakles – der bequeme und der mühsame. Nur ist hier ausnahmsweise der bequeme zugleich der klügere.

**Weg A – Capacitor (empfohlen):** Capacitor umschließt unsere bestehende Web-App als natives WKWebView-Projekt. Der React-Code bleibt zu ~95 % unangetastet; wir gewinnen native Plugins für NFC, Push, Kamera, Haptik und – entscheidend – eine echte App-Store-Präsenz. Die Web-App bleibt parallel deploybar (Vercel), wir betreiben *eine* Codebasis für zwei Kanäle.

**Weg B – React Native / Expo (nicht empfohlen):** Vollständiger Neubau der UI-Schicht. Höhere native Performance und „reineres" Nativgefühl, aber Wochen an Rewrite, doppelte Wartung, Verlust des Web-Kanals in identischer Form. Für ein Team unserer Größe und einen App-Kern, der im Wesentlichen aus Formularen, Listen und Kamera-Aufrufen besteht, wäre das mit Kanonen auf Spatzen geschossen.

> **Rhetorische Notiz (Kontrast-Figur):** Ich stelle bewusst „bequem *und* klug" gegen „rein *aber* teuer". Der Kontrast entlarvt die vermeintliche Tugend des schwereren Weges als Kostenfalle – eine Technik, die auch in Pitches wirkt: die naheliegende Heldengeschichte ausräumen, bevor der Zuhörer sie selbst romantisiert.

### 2.2 Was Capacitor konkret bedeutet

| Aspekt | Konsequenz |
|---|---|
| **Codebasis** | Bestehendes `app/` bleibt Quelle der Wahrheit; Capacitor generiert ein `ios/`-Xcode-Projekt daneben. |
| **Voraussetzung** | macOS + Xcode zwingend für den iOS-Build. Ohne Mac kein iOS-Binary. |
| **Native Brücke** | JS ⇄ Swift via Capacitor-Plugins (offiziell + Community). |
| **Web bleibt live** | Vercel-Deploy unverändert; die App lädt entweder gebündeltes Web-Asset oder eine Remote-URL. |
| **Updates** | UI-Änderungen ohne App-Store-Review möglich (Web-Assets), native Änderungen brauchen Review. |

### 2.3 Voraussetzungen, die *du* (Felix) beschaffen musst

Diese Dinge kann Claude Code nicht für dich erledigen – sie erfordern deine Identität, deine Kreditkarte oder deine Entscheidung:

1. **Apple Developer Program** – 99 USD/Jahr, Anmeldung unter https://developer.apple.com/programs/enroll/ . Ohne Mitgliedschaft kein Universal-Links-Entitlement, kein TestFlight, keine Veröffentlichung.
2. **Ein Mac mit Xcode** (aktuelle Version aus dem Mac App Store).
3. **APNs Auth Key (.p8)** – für Push, erzeugbar unter https://developer.apple.com/account/resources/authkeys/list . Notiere dir dabei **Key ID** und **Team ID**.
4. **Finale Domain-Entscheidung** (siehe Abschnitt 4) – Blocker für NFC und Universal Links.

---

## 3. Die Zielarchitektur (Vogelperspektive)

```
┌─────────────────────────────────────────────────────────────┐
│  iOS-App (Capacitor-Schale, WKWebView)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React/Vite Web-Kern  (app/ – unverändert weitergenutzt)│  │
│  │   • Auth (Supabase magic-link / OTP)                    │  │
│  │   • Pflanzen-Liste, Detail, Pflege-Logging, Galerie     │  │
│  │   • Ampelsystem, Shop (Affiliate)                       │  │
│  └───────────────────────────────────────────────────────┘  │
│  Native Plugins:  Core NFC │ Push (APNs) │ Kamera │ Haptik    │
│  StoreKit / IAP  ←── App-Store-konforme Freischaltung         │
└───────────────┬─────────────────────────────────────────────┘
                │  HTTPS (nur öffentl. anon-Key im Client)
                ▼
┌─────────────────────────────────────────────────────────────┐
│  Supabase (eu-central-1, ref: snttiuvcpryobleinmxs)           │
│   • Postgres + RLS (jede Tabelle, auth.uid()-Scoping)         │
│   • Edge Functions (Deno):                                    │
│       identify-plant │ enforce-entitlements │ nfc-redeem      │
│       iap-verify │ push-dispatch                              │
│   • Storage (Bild-Uploads, validiert)                         │
└─────────────────────────────────────────────────────────────┘
                │
                ▼   serverseitige Drittanbieter-Aufrufe (Secrets nie im Client)
        Plant.id (Kindwise) · APNs · Apple Receipt-Verify · Stripe (optional)
```

Das Leitprinzip bleibt eherne Regel: **Kein Geheimnis, keine Berechtigungsprüfung, keine Kontingentzählung jemals im Client.** `VITE_`-Variablen sind öffentlich – sie transportieren ausschließlich die Supabase-URL und den anon-Key.

---

## 4. Der kritische Pfad: Domain, NFC und Universal Links

Hier liegt der gordische Knoten des gesamten Vorhabens. Ich zerschlage ihn nicht mit dem Schwert, sondern entwirre ihn geordnet.

### 4.1 Warum die Domain alles bestimmt

iOS liest einen NFC-Tag im Hintergrund (ohne geöffnete App) nur dann und leitet ihn an *unsere* App, wenn der auf dem Chip gespeicherte URL-Record ein gültiger **Universal Link** ist – also auf eine Domain zeigt, für die unsere App per **Associated-Domains-Entitlement** und einer `apple-app-site-association`-Datei (AASA) registriert ist. Ändert sich die Domain nach dem Druck der Sticker, sind die Chips wertlos oder müssen umgeleitet werden. Deshalb: **erst entscheiden, dann drucken.**

### 4.2 Empfehlung zur Domain

Ich empfehle, **eine** kanonische Domain für Slot-URLs festzulegen und alle anderen per 301-Redirect darauf zu führen. Da die Juni-Marketing-Assets und der Produktionsfahrplan bereits auf `www.planumplants.de` konvergieren, ist der Weg des geringsten Widerstands:

- **Kanonisch für Slots:** `planumplants.de` (ohne `www`, als apex; `www` → 301 auf apex).
- **AASA-Pfade:** `/nfc/*` und `/p/*` an die App gebunden.
- **app.planum.de** entweder ganz aufgeben oder als reinen 301-Redirect auf `planumplants.de` betreiben.

> **Rhetorische Notiz (Dreierfigur):** „Erst entscheiden, dann drucken, dann skalieren." Der Dreischritt verleiht der Handlungsanweisung Rhythmus und Merkbarkeit – Cäsars *veni, vidi, vici* ist der Urahn dieser Figur.

### 4.3 Die Zwei-URL-Architektur der Sticker (aus der SPV-Field-Notiz)

Jeder Sticker trägt zwei physisch getrennte Träger mit *unterschiedlichen* URLs:

- **NFC-Chip** → `https://planumplants.de/nfc/{signed_token}` – ein signierter, kurzlebiger Token, der einen Magic-Link-Login und die Slot-Zuordnung auslöst.
- **QR-Code (aufgedruckt)** → `https://planumplants.de/p/{plant_uuid}` – die öffentlich sichtbare Pflanzenseite, **ohne** den NFC-Token.

Der Grund für die Trennung ist ein subtiler Angriffsvektor: Wäre der NFC-Token auch im QR sichtbar, könnte ein Fremder ihn abfotografieren und den Login-/Zuordnungsvorgang kapern (Photo-Replay). Die beiden Träger dürfen ihre Geheimnisse also nicht teilen – Sicherheit durch Trennung, nicht durch Verschleierung.

### 4.4 App Clips (optionale Kür)

Ein App Clip kann per NFC starten, wenn die Vollapp *nicht* installiert ist – ideal für den Erstkontakt am Regal oder beim Auspacken. Kein Muss für das MVP, aber ein eleganter Trichter in die Vollinstallation. Als eigenes Arbeitspaket in Phase 3 vorgesehen.

---

## 5. Gehärtete Sicherheitsarchitektur (Task #6)

Die bestehende RLS ist solide – das Review PR#7 hat das bestätigt. Doch die App-Ebene öffnet neue Flanken: Zahlungen, Freischaltungen, Push-Token, NFC-Token. Wir bauen die Mauer nicht nur höher, sondern ergänzen fehlende Bastionen. *Si vis pacem, para bellum* – wer den Frieden (des reibungslosen Betriebs) will, rüste für den Angriff.

### 5.1 Entitlements & Quotas serverseitig (die zentrale Lücke)

**Neue Tabellen (Migration):**

```sql
-- Berechtigungsstufe pro Nutzer
create table public.entitlements (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  tier              text not null default 'free'
                    check (tier in ('free','basis','pro')),
  basis_unlocked_at timestamptz,        -- Lifetime-Freischaltung Basis
  pro_cloud_until   timestamptz,        -- Cloud-Abo-Ablauf (Pro)
  extra_slots       int not null default 0,  -- gekaufte 10er-Pakete
  updated_at        timestamptz not null default now()
);

-- Fälschungssicheres Nutzungs-Log für KI-Kontingente
create table public.ai_usage (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  plant_id   uuid references public.plants(id) on delete cascade,
  kind       text not null check (kind in ('identify','care_query')),
  called_at  timestamptz not null default now()
);
create index on public.ai_usage (user_id, plant_id, called_at);
```

**RLS:** Beide Tabellen ausschließlich lesbar für den eigenen Nutzer; **schreibbar nur über service-role** (Edge Functions). Der Client darf sein eigenes Entitlement *sehen*, aber niemals *setzen* – sonst könnte sich jeder per DevTools zum Pro-Nutzer befördern.

**Durchsetzung:** Eine Edge Function `enforce-entitlements` (bzw. eine Postgres-RPC `check_and_consume_quota`) prüft *vor* jedem KI-Aufruf:
- Ist die Tier-Stufe berechtigt?
- Wurde das Kontingent (Gratis 1×/Monat/Pflanze, Basis 2×/Woche/Pflanze) im Zeitfenster ausgeschöpft? – gezählt aus `ai_usage`, nicht aus Client-Angaben.
- Erst bei Freigabe wird der teure Plant.id-Aufruf getätigt und der Verbrauch geloggt.

Die bestehende `identify-plant`-Function ruft künftig zuerst diese Prüfung auf. Wichtig: Die *Erstbestimmung* der Art bei Registrierung zählt laut Spec **nicht** ins Kontingent – diese Ausnahme wird explizit als `kind='identify'` mit Sonderbehandlung modelliert.

### 5.2 NFC-Signed-Token-Flow

- Token-Format: kurzlebiges, HMAC-signiertes JWT-artiges Payload `{slot_id, exp, nonce}`, Signatur mit einem **nur serverseitig** vorhandenen Secret.
- Edge Function `nfc-redeem` verifiziert Signatur, Ablauf und Einmaligkeit (Nonce gegen Replay), bindet den Slot an den eingeloggten Nutzer.
- Chips werden **gegen Wiederbeschreiben gesperrt** (Lock-Bit) – ein einmal ausgelieferter Tag lässt sich nicht umprogrammieren.
- Der Token erscheint **nie** im QR-Code (siehe 4.3).

### 5.3 IAP-Receipt-Validierung (App-Store-Pflicht)

- StoreKit-Kauf im Client löst nur die *Anzeige* aus; die *Wahrheit* über den Kaufstatus wird serverseitig hergestellt.
- Edge Function `iap-verify` prüft den App-Store-Server-Receipt (Apple Server API / signierte JWS-Transaktion), setzt danach `entitlements.tier` bzw. `basis_unlocked_at`.
- Damit ist der Kauf fälschungssicher: Ein manipulierter Client kann keine Berechtigung erschleichen.

### 5.4 Push-Sicherheit

- Push-Token werden pro Gerät in einer Tabelle `push_tokens (user_id, token, platform, updated_at)` unter RLS gespeichert.
- Versand ausschließlich über Edge Function `push-dispatch` mit dem `.p8`-Key (Secret in Supabase Vault, nie im Client).

### 5.5 Weiterhin geltende Grundregeln (aus dem Threat-Model)

- API-Keys (Plant.id/PlantNet/Stripe/APNs) **nur serverseitig**.
- RLS auf allen Tabellen, `service_role`-Key nie clientseitig.
- Plant-UUIDs zufällig (RFC-4122-v4), Berechtigung serverseitig prüfen – „unguessable URL" ist kein Schutz.
- Stripe-Webhooks signaturverifiziert (falls Shop-Zahlungen).
- Bild-Uploads nach Typ/Größe validieren, bevor sie an Dritte gehen.

### 5.6 Zusammenfassung der neuen Edge Functions

| Function | Zweck | Secret |
|---|---|---|
| `identify-plant` (Bestand) | Artenbestimmung, künftig mit Quota-Vorprüfung | `PLANT_ID_API_KEY` |
| `enforce-entitlements` | Tier-/Kontingentprüfung | – (nur DB) |
| `nfc-redeem` | Signierten NFC-Token einlösen | `NFC_SIGNING_SECRET` |
| `iap-verify` | Apple-Receipt validieren, Tier setzen | `APPLE_IAP_KEY` |
| `push-dispatch` | Push über APNs versenden | `APNS_P8`, `APNS_KEY_ID`, `APNS_TEAM_ID` |

---

## 6. Zusatzfeatures (Task #6 – die Kür jenseits des Pflichtprogramms)

Aus der Analyse der Notion-Unterseiten und der App-Logik destilliert, nach Aufwand/Nutzen sortiert. Ich unterscheide bewusst „Sofort-Kandidaten" von „Vision", damit wir nicht der Versuchung erliegen, alles zugleich zu wollen – *qui nimium probat, nihil probat*, wer zu viel beweist, beweist nichts.

**Sofort-Kandidaten (hoher Nutzen, mit App-Ebene erst möglich):**
1. **Native Push-Erinnerungen** bei fälliger Pflege – das eigentliche Killer-Argument der App gegenüber der Web-Version. Ampellogik (🟢🟡🔴) triggert lokale/remote Notifications.
2. **NFC-Tap-to-Open** als Kernerlebnis – Pflanze antippen, sofort im Detail landen. Ohne App ein QR-Scan, mit App ein magischer Tap.
3. **Kamera-Wachstumsverlauf mit Timelapse** – Bildserie pro Pflanze, gratis (laut Spec), nativer Kamerazugriff macht es beiläufig statt umständlich.
4. **Offline-Fähigkeit** – Pflegepläne und letzte Bilder lokal gecacht; die App funktioniert auch ohne Netz im Wintergarten.

**Mittelfristig:**
5. **Widget & Live Activity** – Ampelstatus der pflegebedürftigsten Pflanze auf dem Homescreen.
6. **Apple-Health-freie Erinnerungslogik mit Fokuszeiten** – keine Nachtbenachrichtigungen.
7. **Familien-/Multi-User-Freigabe** (Pro-Feature laut Spec) – geteilter Pflanzenhaushalt.
8. **Sensor-Autologging** (Pro, Sensor-Kit) – Messwerte fließen automatisch in `care_logs`.

**Vision (später, mit Bedacht):**
9. **Sensor-KI-Diagnose** – Anomalieerkennung aus Sensorreihen (Pro-Cloud-Abo).
10. **Community-/Tausch-Layer** – Ableger-Börse, Affiliate-Verstärker.

---

## 7. Roadmap – vier Phasen bis zum App-Store-Release

Ich gliedere in Phasen, nicht in starre Kalenderwochen, weil der Apple-Review-Zyklus eine Unbekannte ist, die sich der Planung entzieht.

### Phase 0 – Fundament & Entscheidungen (bevor Code entsteht)
- Domain final entscheiden (Abschnitt 4.2), DNS/Redirects setzen.
- Apple Developer Program beitreten, App-ID + Bundle-ID reservieren.
- Supabase-Migration für `entitlements`, `ai_usage`, `push_tokens` einspielen.
- `CLAUDE.md`-Statuszeile KI-Integration auf ✅ korrigieren.

### Phase 1 – Capacitor-Schale & native Basics
- Capacitor in `app/` initialisieren, `ios/`-Projekt generieren.
- Associated Domains + AASA-Datei ausrollen (Universal Links testen).
- Push-Setup (APNs, `.p8`, `push_tokens`, `push-dispatch`).
- Erster TestFlight-Build.

### Phase 2 – NFC, Entitlements, IAP
- Core-NFC-Plugin, `nfc-redeem`-Flow end-to-end.
- `enforce-entitlements` vor `identify-plant` schalten.
- StoreKit-Produkte anlegen, `iap-verify` implementieren.
- Compliance-Check gegen Apple-Richtlinien (Abschnitt 8).

### Phase 3 – Feinschliff & Zusatzfeatures
- Offline-Cache, native Kamera/Timelapse, Widget.
- Optional: App Clip für Erstkontakt.
- Beta-Test mit 50 Nutzern (aus CLAUDE.md-Nächste-Schritte).

### Phase 4 – Einreichung & Release
- App-Store-Metadaten, Screenshots, Datenschutzangaben.
- Review einreichen, Rückfragen-Puffer einplanen.
- Web-Kanal (Vercel) parallel weiterbetreiben.

---

## 8. App-Store-Compliance – das unterschätzte Minenfeld

Hier lauert das größte nicht-technische Risiko, und ich benenne es unverblümt, weil verschwiegene Risiken die teuersten sind.

### 8.1 Das IAP-Problem beim Basis-Unlock

Apples Richtlinien (Guideline 3.1.1) verlangen: Wird digitale Funktionalität innerhalb der App freigeschaltet, **muss** dies über In-App-Kauf möglich sein. Ein extern erworbener Code (Amazon-Sticker-Paket) darf Features **zusätzlich und optional** freischalten – aber er darf nicht der **einzige** Weg sein, und die App darf nicht aktiv aus der App heraus auf den externen Kauf lenken.

**Konsequenz für Planum:** Das 19,99-€-Basis-Paket via Amazon-Code ist zulässig – *sofern* in der App parallel ein gleichwertiger In-App-Kauf („Basis freischalten") existiert. Andernfalls droht Ablehnung im Review.

**Empfohlene Lösung:**
- Basis **sowohl** per NFC-/Code-Einlösung (physisches Paket) **als auch** per In-App-Kauf anbieten.
- Die physische Einlösung als „du hast bereits gekauft, hier einlösen" framen, nicht als Verkaufskanal *innerhalb* der App.
- Slot-Erweiterungen (9,99 €/10 Slots) und Pro-Cloud-Abo (2,99 €/Mo) als reguläre StoreKit-Produkte.

### 8.2 Weitere Prüfpunkte

- **Datenschutz-Nutrition-Label**: Kamerazugriff, Fotos, ggf. Standort begründen.
- **Account-Löschung in-App** (Apple-Pflicht seit 2022) – muss existieren.
- **NFC-Nutzungszweck** in `Info.plist` (`NFCReaderUsageDescription`) klar formulieren.
- **Sign in with Apple**: Pflicht, *wenn* andere Social-Logins angeboten werden. Bei reinem Magic-Link/E-Mail nicht zwingend – aber prüfen.

---

## 9. Empfohlene neue Ordnerstruktur (Task – „welche Ordner ausbilden")

Die bestehende Struktur ist gesund; wir ergänzen sie gezielt, ohne sie zu überwuchern. Jeder neue Ordner hat einen klaren Daseinszweck:

```
Planum/
├── app/                      # (Bestand) React/Vite-Web-Kern
│   ├── ios/                  # NEU – von Capacitor generiertes Xcode-Projekt
│   └── capacitor.config.ts   # NEU – Capacitor-Konfiguration
├── supabase/
│   ├── migrations/           # (Bestand) + neue Migration entitlements/ai_usage
│   └── functions/
│       ├── identify-plant/   # (Bestand)
│       ├── enforce-entitlements/  # NEU
│       ├── nfc-redeem/       # NEU
│       ├── iap-verify/       # NEU
│       └── push-dispatch/    # NEU
├── native/                   # NEU – native Assets & Konfig
│   ├── aasa/                 #   apple-app-site-association-Datei
│   ├── icons/                #   App-Icons, Splash-Screens
│   └── entitlements/         #   .entitlements-Dateien (Associated Domains, Push)
├── docs/
│   ├── ios-migration-plan.md # DIESES Dokument
│   ├── entitlements-stufenmodell.md  # (Bestand, maßgeblich)
│   ├── app-store-compliance.md  # NEU – Checkliste für Review
│   └── nfc-token-spec.md     # NEU – Signaturformat, Redemption-Flow
├── scripts/
│   ├── generate-sample-urls.mjs  # (Bestand)
│   └── sign-nfc-token.mjs    # NEU – Token-Signierung für Chip-Bespielung
└── marketing/                # (Bestand)
```

Priorität der neuen Ordner: `supabase/functions/*` und die Migration zuerst (Fundament), dann `native/`, zuletzt die Doku-Ergänzungen.

---

## 10. Offene Entscheidungen, die nur du treffen kannst

Damit Claude Code nicht ins Leere läuft, sammle ich hier die Gabelungen, an denen deine Hand am Steuer gefragt ist:

1. **Domain**: Bestätigst du `planumplants.de` als kanonische Slot-Domain? (Empfehlung: ja.)
2. **Apple Developer**: Ist die Mitgliedschaft bereits vorhanden oder muss sie noch beantragt werden?
3. **Mac/Xcode**: Steht dir eine macOS-Maschine mit Xcode zur Verfügung?
4. **IAP-Umfang**: Bieten wir Basis auch als reinen In-App-Kauf an (compliance-empfohlen) – ja/nein?
5. **App Clip**: Im MVP schon dabei oder erst Phase 3?

Diese fünf Punkte sind keine Bremse, sondern das Geländer, das uns vor dem Abgrund bewahrt. Beantworte sie, und Claude Code kann in gerader Linie loslegen.

---

## 11. Nächster Schritt

Der beiliegende **Übergabe-Prompt** (`docs/claude-code-uebergabe-prompt.md`) ist so gebaut, dass du ihn – nach Klärung der fünf Entscheidungen oben – vollständig in Claude Code einfügen kannst. Er ist selbst-enthaltend, verweist auf dieses Dokument und führt die Migration Phase für Phase aus.

*Nunc est agendum* – jetzt gilt es zu handeln. Aber mit ruhiger Hand.
