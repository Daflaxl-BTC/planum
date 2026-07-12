# Planum – Businessplan

## 1. Executive Summary

**Planum** verbindet physische QR-Code-Sticker mit einer KI-gestützten Pflanzen-Tracking-App. Kunden kaufen auf Amazon ein Paket mit 20 QR-Code-Stickern für 19,99€, kleben diese auf ihre Pflanzen und nutzen die Web-App zur Identifikation, Pflege-Tracking und Optimierung. Ein integrierter Shop generiert zusätzliche Einnahmen über Affiliate-Provisionen und Eigenmarken-Produkte.

---

## 2. Marktanalyse

### 2.1 Marktgröße
Der globale Markt für Pflanzen-Identifikations-Apps wurde 2024 auf **1,2 Mrd. USD** geschätzt und soll bis 2033 auf **3,5 Mrd. USD** wachsen (CAGR 12,5%). Der breitere Pflanzenpflegemarkt wächst von 3,4 Mrd. USD (2025) auf 8,4 Mrd. USD (2035) bei einer CAGR von 9,5%.

### 2.2 Zielgruppe
- **Primär**: Millennials & Gen Z mit Zimmerpflanzen (25–40 Jahre)
- **Sekundär**: Hobby-Gärtner 40+ mit wachsendem Technik-Interesse
- **Markttrend**: "Plant Parenting" als Lifestyle-Trend seit COVID-19
- **Deutschland**: ca. 36 Mio. Haushalte, ~70% besitzen Zimmerpflanzen → **25 Mio. potenzielle Haushalte**

### 2.3 Wettbewerbsanalyse

| App | Modell | Preis | Stärken | Schwächen |
|-----|--------|-------|---------|-----------|
| **Planta** | Freemium/Abo | 37,99€/Jahr | Gieß-Erinnerungen, schönes UI | Kein physisches Produkt, Abo-Müdigkeit |
| **Greg** | Freemium/Abo | ~40€/Jahr | Standort-basierte Pflege | Komplex, keine Hardware |
| **PlantNet** | Kostenlos | 0€ | Wissenschaftlich genau | Nur Identifikation, keine Pflege |
| **PictureThis** | Freemium/Abo | 29,99€/Jahr | Große Datenbank | Aggressive Abo-Werbung |
| **Planum** | Einmalkauf + Shop | 19,99€ einmalig | Physisch + Digital, kein Abo, KI | Noch kein Markenname |

### 2.4 Alleinstellungsmerkmale (USP)
1. **Physisches Produkt + Digitale App** – Greifbarer Wert, kein reines Software-Abo
2. **Einmalkauf statt Abo** – Klarer Gegenpol zur Abo-Müdigkeit
3. **QR-Code je Pflanze** – Jede Pflanze hat ihre eigene "digitale Identität"
4. **KI-gestützte Pflege** – Automatische Erkennung + personalisierte Pflegepläne
5. **Ampelsystem** – Sofort erkennbar, welche Pflanze Aufmerksamkeit braucht

---

## 3. Produktbeschreibung

### 3.1 Physisches Produkt (Amazon)
- **20 QR-Code-Sticker** in Premium-Verpackung
- Wetterfest, UV-beständig (Oracal 3551 Folie)
- Jeder Sticker hat eine einzigartige UUID
- Verpackung: Nachhaltige Kartonage mit Planum-Branding
- Beilage: Quick-Start-Guide mit Anleitung

### 3.2 Digitale App (Web-App)
- **Registrierung**: QR-Code scannen → Pflanze fotografieren → KI identifiziert
- **Dashboard**: Alle Pflanzen im Ampelsystem auf einen Blick
- **Pflege-Tracker**: Gießen, Düngen, Umtopfen dokumentieren
- **KI-Empfehlungen**: Optimale Pflegezyklen basierend auf Art, Standort, Jahreszeit
- **Wachstumsgalerie**: Fotoverlauf jeder Pflanze
- **Shop**: Kuratierte Pflegeprodukte (Affiliate + Eigenmarke)

### 3.3 Aktions-Sticker — Designkonzept (Entwurf)

Die Sticker entwickeln sich vom QR-Funktionsobjekt zum **hochwertigen Designobjekt**, das den Topf ästhetisch aufwertet. Kein sichtbarer QR-Code mehr — die NFC-Antenne liegt unsichtbar unter einem premium gestalteten Motiv (Design-Sheet: `docs/sticker-variants-c/aktions-sticker-design.svg`).

**Zwei-Sticker-System pro Pflanze:**

1. **Gießen-Sticker (Wassertropfen):** Tippen löst direkt den Befehl „Gießen" aus — der Eintrag wird automatisch geloggt (NDEF-URL mit `?action=giessen`). Löst den größten Retention-Killer (manuelles Logging) ohne Sensor.
2. **Profil-Sticker (botanisches Motiv, z. B. Monstera-Blatt):** Tippen öffnet das Pflanzenprofil (App oder Web-Fallback, falls App nicht installiert).

**Designsprache:** runde Die-Cut-Sticker, matte Sage-/Cremetöne, Messing-Akzentring, botanische Line-Art. Premium-Anmutung als Kaufargument und Amazon-Foto-Hero.

**Setup / Paarung:** Beide Sticker werden bei der Ersteinrichtung einmal der zuvor registrierten Pflanze zugeordnet. Danach genügt ein Tap.

**Erlebnis-Layer:** Beim Auslösen von „Gießen" spielt die App/Web-App einen Regen-/Wassertropfen-Sound — die Nutzung wird zum kleinen sinnlichen Moment statt einer Karteikarten-Aktion.

**Caveats (umzusetzen):**
- *iOS:* bei geschlossener App erscheint zuerst ein Tipp-Banner (nicht ganz „dranhalten, fertig"); Android löst direkt aus.
- *Undo:* versehentliche Taps brauchen eine kurze „Rückgängig"-Bestätigung.
- *Pack-Mathematik:* 2 Sticker/Pflanze → ein 20er-Pack deckt ~10 Pflanzen. Pack-Größen/Preise (20–30 €) entsprechend kalkulieren.
- *Sicherheit:* Web-Fallback nur mit serverseitiger Eigentümer-Prüfung (unguessable UUID), damit fremde Taps keine Pflanzendaten zeigen.

---

## 4. Finanzplanung

### 4.1 Produktkostenkalkulation (pro Einheit / 20er Paket)

| Position | Kosten |
|----------|--------|
| QR-Code-Sticker (20 Stk., Premium-Folie, Druck) | 1,20€ |
| Verpackung (Kartonage, bedruckt) | 0,80€ |
| Quick-Start-Beilage (Druck) | 0,15€ |
| Versand an Amazon FBA-Lager | 0,35€ |
| **Herstellungskosten gesamt** | **2,50€** |

### 4.2 Amazon FBA Kostenkalkulation (VK 19,99€)

| Position | Betrag |
|----------|--------|
| Verkaufspreis (brutto) | 19,99€ |
| - MwSt. (19%) | -3,19€ |
| = Netto-Verkaufspreis | 16,80€ |
| - Amazon Verkaufsgebühr (15%) | -2,52€ |
| - FBA Versandgebühr (Kleinpaket) | -2,89€ |
| - FBA Lagergebühr (pro Monat, anteilig) | -0,15€ |
| - Herstellungskosten | -2,50€ |
| - Amazon PPC Werbekosten (~15% vom VK) | -2,52€ |
| = **Gewinn pro Einheit** | **6,22€** |
| = **Marge** | **37,0%** |

### 4.3 Software-Betriebskosten (monatlich)

| Position | Kosten/Monat |
|----------|-------------|
| Supabase (Pro Plan) | 25€ |
| Vercel (Pro Plan) | 20€ |
| Plant.id API (500 Calls/Mo) | 50€ |
| Domain + SSL | 2€ |
| E-Mail-Service (Resend) | 10€ |
| **Gesamt** | **107€/Monat** |

*Bei Skalierung (>10.000 Nutzer): ca. 350–500€/Monat*

### 4.4 Umsatzprognose (12 Monate)

| Monat | Verkäufe/Mo | Umsatz (brutto) | Gewinn (Amazon) | Shop-Affiliate | Gesamt-Gewinn |
|-------|-------------|-----------------|-----------------|----------------|---------------|
| 1–3 | 100 | 1.999€ | 622€ | 50€ | 672€ |
| 4–6 | 300 | 5.997€ | 1.866€ | 200€ | 2.066€ |
| 7–9 | 600 | 11.994€ | 3.732€ | 500€ | 4.232€ |
| 10–12 | 1.000 | 19.990€ | 6.220€ | 1.000€ | 7.220€ |
| **Jahr 1 Gesamt** | **6.000** | **119.940€** | **37.320€** | **5.250€** | **42.570€** |

*Abzüglich Software-Kosten (1.284€/Jahr) und einmalige Startkosten → **Netto-Jahresgewinn: ca. 36.000–39.000€***

### 4.5 Startkapitalbedarf

| Position | Einmalig |
|----------|----------|
| Erste Produktionscharge (500 Pakete) | 1.250€ |
| Amazon Seller-Konto (Professional) | 39€/Mo |
| Logo & Branding-Design | 500€ |
| Produktfotografie | 300€ |
| Amazon PPC Startbudget | 500€ |
| Domain + erste 3 Monate Hosting | 400€ |
| **Gesamt Startkapital** | **~3.000€** |

---

## 5. Monetarisierungsstrategie

### 5.0 Dreistufenmodell: Gratis / Basis / Pro (Entscheidung 10.07.2026)

Die Erlöslogik ruht auf drei Stufen. Leitprinzip: **Pro ⊇ Basis** — kein Feature wird auf einer höheren Stufe wieder weggenommen oder erneut verkauft. Die Gratis-Stufe gibt das **Gedächtnis** (Verlauf, Historie, Emotion) und rationiert die **Intelligenz** (KI-Calls = einzige nennenswerte Grenzkoste). Vollständige Spezifikation: `docs/entitlements-stufenmodell.md`.

| | **Gratis** | **Basis** | **Pro** |
|---|---|---|---|
| **Einstieg** | App, Konto | Sticker-Paket 19,99 € (Amazon) | Pro Starter-Kit 39,99 € + optional Cloud-Abo 2,99 €/Mo |
| **Pflanzen** | max. 5, einzeln aufrufbar | unbegrenzt, NFC-Tap | wie Basis + Sensor |
| **KI-Pflegeabfragen** | 1×/Monat je Pflanze | 2×/Woche je Pflanze | wie Basis + KI-Diagnose aus Sensordaten (Abo) |
| **Bilderverlauf + Timelapse** | ✅ gratis | ✅ | ✅ |
| **Erlösquelle** | Funnel → Konversion | Einmalkauf + Erweiterungen | Hardware-Marge + Abo |

- **Gratis** ist bewusst *vollwertig*, kein verkrüppeltes Demo: Anlegen, Fotografieren, manuelles Logging und der **dauerhafte Bilderverlauf** (inkl. Timelapse-Video als Web-Feature) sind frei. Die Schranke verläuft entlang KI-Kosten (1×/Monat je Pflanze) und Komfort (kein NFC), nicht entlang der Grundfunktion. Die Artenbestimmung bei Erstregistrierung zählt nicht gegen das Limit.
- **Basis** wird durch Registrierung des ersten Sticker-Pakets **lifetime** freigeschaltet (`basis_unlock`, kein Abo) und hebt die KI-Frequenz auf alltagstaugliche 2×/Woche je Pflanze; NFC-Tap ersetzt das manuelle Aufrufen und Loggen.
- **Pro** folgt dem Hue-Prinzip (Hub = Bridge, Sensoren = Blades): Messwerte für immer gratis, das Cloud-Abo (2,99 €/Mo) nur für Mehrwert (Langzeit-Historie, Multi-User, Sensor-KI-Diagnose). Zeitplan Q3/26–Q2/27.

### 5.1 Primär: Amazon-Verkauf (Sticker-/QR-Pakete → Basis-Freischaltung)
- **Starter-Paket**: 20 Sticker/QR-Codes für 19,99€ (schaltet Basis lifetime frei)
- **Erweiterungs-Paket**: 10 Codes für 9,99€
- **Family-Paket**: 50 Codes für 39,99€

### 5.2 Sekundär: Integrierter Pflegeshop
- **Affiliate-Einnahmen** (Amazon PartnerNet): 3–10% auf empfohlene Produkte
  - Dünger, Erde, Töpfe, Gießkannen, Pflanzlichter
  - Prognostizierter Umsatz: 5–15€ pro aktivem Nutzer/Jahr
- **Eigenmarke** (Phase 2): Planum-gebrandete Pflegeprodukte
  - Planum Bio-Dünger, Planum Pflanzenerde
  - Margen: 40–60%

### 5.3 Tertiär: Pro-Stufe & Abo (Hardware + Cloud)
- **Planum Pro** (Sensor-Hardware, Starter-Kit 39,99€): Sensor-Autologging, Messwerte dauerhaft gratis; Marge über Sensor-„Blades".
- **Cloud-Abo** (2,99€/Mo): Langzeit-Historie der Sensordaten, Multi-User, KI-Diagnose aus Sensordaten.
- **Planum für Teams**: Büro-/Gemeinschaftsgärten (B2B)
- **API-Zugang**: Für Gärtnereien und Pflanzenhändler

### 5.4 Zusätzliche Monetarisierungswege
- **Branded Content**: Kooperationen mit Pflanzenhändlern (Dehner, OBI, etc.)
- **Daten-Insights** (anonymisiert): Welche Pflanzen sind beliebt, wann wird gekauft
- **Saisonale Bundles**: Frühlings-Starter-Kit, Winterpflege-Set

---

## 6. Amazon-Strategie

### 6.1 Listing-Optimierung
- **Titel**: "Planum Pflanzen-Tracker | 20 QR-Code Sticker mit KI-App | Gieß-Erinnerungen, Pflanzenerkennung & Pflege-Tipps | Geschenkidee für Pflanzenliebhaber"
- **Kategorie**: Garten > Gartenarbeit > Pflanzenpflege
- **Keywords**: Pflanzen App, Gießerinnerung, Pflanzen Tracker, Pflanzenpflege, QR Code Pflanzen, Geschenk Pflanzenliebhaber, Plant Care
- **A+ Content**: Premium-Bildergalerie mit App-Screenshots

### 6.2 Launch-Strategie
1. **Pre-Launch** (Woche 1–2): Vine-Programm für erste Reviews
2. **Soft Launch** (Woche 3–4): Niedrige PPC-Gebote, Long-Tail Keywords
3. **Main Launch** (Monat 2): Aggressive PPC, Deal des Tages
4. **Skalierung** (Monat 3+): Sponsored Brands, Produktvideos

### 6.3 Gebührenstruktur 2026
- Verkaufsgebühr: ~15% (Kategorie Garten)
- FBA-Versandgebühr: ~2,89€ (Kleinpaket, nach Gebührenreduktion Dez 2025)
- Lagergebühr: ~0,15€/Monat pro Einheit
- Digital Services Fee (ab März 2026): in Verkaufsgebühr integriert
- PPC-Budget: 15–20% vom Umsatz in der Startphase, 10% nach Etablierung

---

## 7. Technologie & KI-Integration

### 7.1 Pflanzenidentifikation
- **Primär**: Plant.id API (Kindwise) – 0,10€ pro Identifikation
- **Fallback**: PlantNet API – kostenlos bis 500 Calls/Tag
- **Genauigkeit**: >95% bei gängigen Zimmerpflanzen

### 7.2 Pflege-KI
- GPT-4-basierte Pflegeempfehlungen
- Berücksichtigt: Pflanzenart, Standort, Lichtverh., Jahreszeit, Gieß-Historik
- Lernt aus Nutzer-Feedback (optimiert Intervalle)

### 7.3 Ampelsystem-Logik
- 🟢 **Gut**: Alle Pflegeaktionen im Zeitplan
- 🟡 **Bedarf**: Nächste Aktion steht in 1–2 Tagen an
- 🔴 **Hoher Bedarf**: Aktion ist überfällig
- 🔔 **Push-Benachrichtigung**: Bei Status-Wechsel auf Gelb/Rot

---

## 8. Rechtliches & Compliance

- **DSGVO**: Nutzerdaten in EU gehostet (Supabase EU-Region)
- **Impressum & AGB**: Erforderlich für Web-App
- **Amazon Compliance**: CE-Kennzeichnung der Sticker (nicht erforderlich für einfache Aufkleber)
- **Markenrecht**: "Planum" als Wortmarke beim DPMA anmelden (~290€)
- **Verpackungsgesetz**: Registrierung bei LUCID (Zentrale Stelle Verpackungsregister)

---

## 9. Risiken & Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Niedrige Amazon-Reviews | Mittel | Hoch | Vine-Programm, exzellenter Support |
| KI-Erkennung ungenau | Niedrig | Mittel | Manuelle Korrektur + Feedback-Loop |
| Kopie durch Wettbewerber | Mittel | Mittel | First-Mover, Community aufbauen |
| API-Kosten steigen | Niedrig | Mittel | Fallback-APIs, eigenes ML-Modell (Phase 3) |
| Geringe App-Nutzung | Mittel | Hoch | Gamification, Push-Notifications |

---

## 10. Meilensteine & Timeline

| Phase | Zeitraum | Meilenstein |
|-------|----------|-------------|
| 1 | Monat 1 | Landingpage live, MVP der App |
| 2 | Monat 2 | KI-Integration, Beta-Test (50 Nutzer) |
| 3 | Monat 3 | Amazon-Listing live, erste Verkäufe |
| 4 | Monat 4–6 | Optimierung, Shop-Integration |
| 5 | Monat 7–9 | Erweiterungspakete, Marketing-Push |
| 6 | Monat 10–12 | Break-Even, Eigenmarke planen |

---

*Erstellt: April 2026 | Version 1.0 | Planum UG (in Gründung)*
