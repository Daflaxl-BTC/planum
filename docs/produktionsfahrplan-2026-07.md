# Planum — Produktionsfahrplan & Status (2026-07-06)

Konsolidiert aus: Notion „Planum Basis + Pro — Strategie-Redesign" (28.06.), „Aktions-Sticker Druckdateien" (28.06.),
`print-specs-nfc-stickers.md`, `sticker-design-strategie.md`, Hersteller-Korrespondenz (Velia Gao / Getsmart, SPV Field).

---

## 1. Wo wir stehen (Ist-Zustand)

**Konzept (bestätigt, 28.06.):** Drei-Stufen-Modell
- **Gratis** — App/Web, Tracking, Pflegepläne; NFC-Scan öffnet Web-Pflanzenseite ohne App.
- **Basis** — NFC-Sticker-Pack (~20–30 € / 20 Sticker, Amazon), Einmalkauf, Premium-Unlock. **Zwei Sticker pro Pflanze:** Profil + Gießen (Tap-to-Log).
- **Pro** — Sensor + Hub (Q4/26–Q2/27), Monetarisierung nach Philips-Hue-Prinzip.

**Erledigt:** Businessplan, Landingpage, App-MVP (`app/`), QR-Generator, Marktanalyse, Gewerbeummeldung (10.05.),
Legal Pages (PR #8), Druckspezifikation Velia, Hersteller-Anschreiben, Designrunden A–C, **Designrunde D (heute, neu)**.

**Offen (kritischer Pfad):** Design-Freigabe → Sample-Order → Pilot-Order · Plant.id-Integration · NFC-Flow in der App ·
Amazon-Listing + Compliance · Domain-Entscheid · Markenschutz.

---

## 2. Zertifizierungen & Pflichten (recherchiert 06.07.2026)

Gute Nachricht: Der Aufwand ist überschaubar, weil passive NFC-Tags rechtlich günstig liegen.

| Pflicht | Gilt für Planum? | Was zu tun ist |
|---|---|---|
| **CE / Funkanlagenrichtlinie (RED 2014/53/EU)** | **Nein** — passive NFC-Tags ohne Batterie sind keine Funkanlage; kein CE-Zeichen, keine Konformitätserklärung nach RED nötig. | Nichts. Beim Pro-Produkt (Sensor+Hub, aktiv funkend) wird RED/CE später voll fällig. |
| **RoHS 2011/65/EU** | Ja (Elektronikkomponente im Chip) | Vom Hersteller RoHS-Konformitätserklärung + Testreport für den verwendeten Tag anfordern (NTAG213-Inlays sind standardmäßig konform — Nachweis in die Unterlagen). |
| **REACH 1907/2006** | Ja (Folie, Kleber, Farben) | REACH-/SVHC-Erklärung des Herstellers für Folie + Adhäsiv einholen. |
| **WEEE / ElektroG** | **Klären** — Einstufung passiver RFID-Sticker als Elektrogerät ist Grauzone. | Kurze Anfrage an stiftung ear (oder Take-e-way/Händlerbund) zur Einordnung; falls ja: Registrierung + Mülltonnen-Symbol. Vor Amazon-Launch klären, Amazon prüft EPR-Nummern. |
| **GPSR (EU 2023/988, seit 12/2024)** | **Ja, zwingend für Amazon** | Verantwortliche Person in der EU benennen (= dein Gewerbe), Name + Anschrift + **E-Mail** auf Produkt/Verpackung, Produkt-ID (Chargen-/Modellnummer), Angaben im Amazon Compliance-Dashboard hinterlegen. |
| **VerpackG / LUCID** | Ja | Registrierung im LUCID-Register + Lizenzierung der Verpackungsmengen (z. B. Lizenzero) — Amazon verlangt die LUCID-Nummer. |
| **BattG** | Nein (keine Batterie) | — |
| **Markenschutz** | Dringend empfohlen | „Planum" als Wort-/Bildmarke beim DPMA (~290 €, Nizza-Klassen 9, 16, 42), optional EUIPO (~850 €). Vor dem Amazon-Listing anmelden → ermöglicht Amazon Brand Registry (Schutz gegen Hijacker, A+ Content). |

**Merksatz:** Kein einziges „Zertifikat" ist zu erwerben — es sind Lieferantennachweise (RoHS/REACH), Registrierungen (LUCID, ggf. ear) und Kennzeichnungspflichten (GPSR). Budget: unter 1.500 € inkl. DPMA-Marke.

---

## 3. Produzentensuche China — konkreter Ablauf

1. **Angebotsrunde (KW 28–29):** Anfrage-Paket (`docs/manufacturer/`) aktualisieren auf Runde-D-Designs und Zwei-Formen-Stanzung (rund + Tropfen). An 3–5 Anbieter parallel: Getsmart (Velia Gao — warm), SPV Field (v2-Anfrage liegt vor), plus 2–3 neue Alibaba-Kandidaten (Suchbegriffe: „NFC sticker NTAG213 custom die cut", Verified Supplier, ≥5 Jahre, Trade Assurance).
2. **Abfragen:** Stückpreis bei 1.000 / 5.000 / 50.000, einmalige Stanzwerkzeugkosten für Tropfenform, NFC-Encoding je URL aus CSV + Lock-Bit, RoHS/REACH-Dokumente, Sample-Zeit.
3. **Samples (KW 30–32):** 15–30 Stück, beide Formen. Abnahmeprotokoll aus `print-specs-nfc-stickers.md` §8 (NFC-Read iPhone/Android, Wassertest 24 h, UV-Test 7 Tage, Klebkraft Terracotta/Keramik/Plastik).
4. **Pilot (KW 33–36):** 1.000–1.300 Stück über Trade Assurance; parallel Amazon-Listing fertigstellen.

---

## 4. App/Web-App — Restarbeiten bis „operativ"

1. **Plant.id-Integration** (einziger offener MVP-Punkt) — serverseitig als Supabase Edge Function proxyen, Key nie ins Vite-Bundle.
2. **NFC-Aktions-Flow** — Route `?action=giessen`: Tap loggt Gießen + Wassertropfen-Sound + **Undo**; Eigentümer-Prüfung serverseitig (RLS), Web-Fallback für Nicht-Eigentümer nur mit Berechtigungscheck.
3. **Sticker-Zuordnung im Onboarding** — beide Sticker einer Pflanze zuordnen (ein Screen, zwei Taps).
4. **Domain-Entscheid (blockiert QR/NFC-Encoding!)** — app.planum.de vs. planumplants.de vs. /app/-Pfad final festlegen, bevor eine einzige URL in Chips geschrieben wird. Empfehlung: `app.planum.de` mit Redirects von Altpfaden.
5. **RLS-Audit + Beta** — Security-Review, dann Beta mit 50 Nutzern (Roadmap-Punkt 7).

---

## 5. Zeitachse zum operativen Start

| KW | Meilenstein |
|---|---|
| 28 | Design-Entscheid Runde D (1–2 Richtungen), Domain-Entscheid, DPMA-Anmeldung, LUCID-Registrierung |
| 28–29 | Druckdaten-Finalisierung (PDF/X-1a, CMYK/FOGRA39, CutContour), Angebotsrunde an 3–5 Hersteller |
| 30–32 | Samples + Abnahmetests; parallel Plant.id + NFC-Flow in der App |
| 33 | GPSR-Kennzeichnung + Verpackungsdesign final; Amazon-Listing-Entwurf (Texte liegen: Varianten A/B/C) |
| 33–36 | Pilot-Order 1.000–1.300 Stück; Beta-Test 50 Nutzer |
| 37–38 | Wareneingang, Endkontrolle, FBA-Anlieferung, **Listing live** |

---

## 6. Entscheidungen — Stand 07.07.2026

1. ✅ **Designrichtungen:** D1 Messing-Botanik (Hauptlinie) + D2 Terracotta-Relief (Stealth). Druckdaten in `sticker-variants-d/druckdaten/`.
2. ✅ **QR-Fallback:** QR nur auf dem Trägerpapier — Sticker bleiben NFC-only (NFC in DE faktisch flächendeckend; iPhone ≥7, Android-Standard).
3. ✅ **Domain:** `www.planumplants.de` wird in die Chips encodiert (Encoding-CSV liegt bei). Redirects von app.planum.de/Altpfaden einrichten. Zukunftssicher: Universal/App Links öffnen später die geplante **native App** (App Store / Google Play — Umbau in separatem Arbeitspaket) mit derselben URL.
4. 🔲 Markenanmeldung nur DPMA (DE) oder direkt EUIPO (EU)?
5. 🔲 Packgröße: 20 Sticker = 10 Pflanzen (2er-System) — kommunizieren wir „10 Pflanzen-Set“ statt „20 Sticker“?
