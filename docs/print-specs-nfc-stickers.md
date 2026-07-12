# Planum NFC+QR Sticker – Druckspezifikation

**Lieferant**: Getsmart Technology Co., Ltd. (Velia Gao)
**Stand**: 2026-05-02
**Phase**: Pre-Production Samples (15 Stück) → Pilot (1.300) → Mass (50.000+)

Dieses Dokument ist das Briefing für den Designer **und** die Datenabgabe an Velia.
Bei Unklarheiten in der Spec **vor** dem Druck zurückfragen, nicht raten.

---

## 1. Produktformat

| Größe | Durchmesser | Form | Anzahl Sample | Anzahl Pilot |
|-------|-------------|------|---------------|--------------|
| S     | 25 mm       | Kreis | 5            | 500          |
| M     | 30 mm       | Kreis | 5            | 500          |
| L     | 40 mm       | Kreis | 5            | 300          |

- **Material**: PET, ≥125 μm, wasserfest, UV-fest, outdoor-tauglich (ganzjährig)
- **Typ**: Flexibel (für gewölbte Töpfe)
- **Veredelung**: Soft-Touch matte Laminierung + kratzfester Schutzlack
- **Stanzung**: Präzises Konturstanzen mit glatten Kanten
- **NFC-Chip**: NTAG213 (alle 3 Größen)
- **KEIN Hot-Stamping** – Silber-/Kupfer-Akzente werden durch Vollfarbdruck simuliert

---

## 2. Datenformat (Designer → Lieferant)

| Punkt | Vorgabe |
|-------|---------|
| Dateiformat | **PDF/X-1a** (preferred), alternativ AI mit eingebetteten Schriften |
| Anzahl Dateien | **3 separate Dateien** – eine pro Größe |
| Dateinamen | `planum-sticker-25mm.pdf`, `planum-sticker-30mm.pdf`, `planum-sticker-40mm.pdf` |
| Farbraum | **CMYK** |
| ICC-Profil | ISO Coated v2 (FOGRA39) |
| Auflösung | min. **300 dpi** für Pixelinhalte; Logos/Texte als **Vektor** |
| Schriften | **In Pfade umgewandelt** (outlined) |
| Schwarz | C0 M0 Y0 K100 für Text; Tiefenschwarz nur für Flächen (z. B. C40 M30 Y30 K100) |

---

## 3. Layout & Maße (pro Größe)

Die Werte gelten je Sticker. Maße sind Durchmesser-bezogen.

| Größe | Endformat | Bleed (allseitig) | Datenformat | Safe Area (vom Rand) |
|-------|-----------|-------------------|-------------|----------------------|
| 25 mm | Ø 25,0 mm | +3 mm             | Ø 31,0 mm   | 2,0 mm innen         |
| 30 mm | Ø 30,0 mm | +3 mm             | Ø 36,0 mm   | 2,0 mm innen         |
| 40 mm | Ø 40,0 mm | +3 mm             | Ø 46,0 mm   | 2,0 mm innen         |

**Pflicht-Layer/Spotcolors:**

- `CutContour` – Stanzlinie als Spot-Color (Volltonfarbe), 100 % Magenta-Sample, **overprint**, dünnste Linie
- Druckdaten in CMYK darunter
- Bleed bis zur äußeren Kante des Datenformats füllen

---

## 4. Variable-Data-Zone (QR-Code-Bereich)

**Kritisch:** In jedem Artwork muss ein klar definierter, **leerer weißer Bereich** für den Variable-Data-QR vorhanden sein. Velia druckt den QR pro Sticker an exakt dieser Stelle.

| Größe | QR-Zone (Quadrat) | Position | Quiet Zone um QR |
|-------|-------------------|----------|------------------|
| 25 mm | **15 × 15 mm**    | zentriert oder unten zentriert | min. 1 mm rundum frei |
| 30 mm | **18 × 18 mm**    | zentriert oder unten zentriert | min. 1 mm rundum frei |
| 40 mm | **22 × 22 mm**    | zentriert | min. 1,5 mm rundum frei |

- QR-Zone im Artwork als **Layer "QR-Placeholder"** mit Platzhalter-Quadrat markieren (wird vom Lieferanten ersetzt).
- Hintergrund der QR-Zone: **rein weiß** (C0 M0 Y0 K0), nicht laminiert mit metallischer Optik darunter.
- **Modulgröße des QR ≥ 0,4 mm** für zuverlässiges Scannen aus 5–15 cm Abstand.

---

## 5. NFC-Antennen-Bereich (technische Sperrzone)

Der NTAG213-Chip sitzt mittig, die Antenne läuft kreisförmig nahe am äußeren Rand.

- **Keine metallischen Vollflächen** (Silber-/Kupfer-Imitat) **direkt über der Antenne** – schwächt das NFC-Signal.
- Silber-/Kupfer-Akzente nur als **dünne Linien, Logo-Details oder kleine Flächen** im Innenbereich.
- Zentral (über dem Chip) ist **keine** Sperrzone – dort kann gedruckt werden, auch das Planum-Logo.

---

## 6. Markenelemente (verbindlich)

- **Planum-Logo**: nutze die finale SVG aus `landing-page/public/planum-icon.svg` als Vektorquelle
- **Hauptfarbe**: tbd. – Designer soll Brand-Farbe(n) der Landing-Page (siehe `landing-page/tailwind.config.js`) übernehmen
- **Typografie**: gleiche Schrift wie Landing-Page (oder explizit abweichen, wenn besser für Sticker-Lesbarkeit)
- **Pflicht-Element**: kleines "NFC"-Symbol oder "Tap or Scan"-Hinweis, damit Endkunden wissen, was der Sticker kann

---

## 7. Lieferung an Velia (Checkliste)

Vor Versand der Druckdaten an Velia prüfen:

- [ ] 3 PDF/X-1a-Dateien (eine pro Größe)
- [ ] Alle Schriften in Pfade umgewandelt
- [ ] CutContour als Spot-Color, overprint, vorhanden
- [ ] Bleed 3 mm allseitig korrekt gefüllt
- [ ] QR-Placeholder-Layer markiert mit klarer Bemaßung
- [ ] Keine RGB-Inhalte
- [ ] Keine eingebetteten Profile außer FOGRA39
- [ ] Sample-CSV beigelegt: `planum-2026-05-02T*-supplier.csv`
- [ ] Begleit-E-Mail mit Verweis auf dieses Spec-Dokument

---

## 8. Qualitätsabnahme bei Sample-Eingang

Pro Größe testen:

1. **Druckqualität**: Farbtreue (gegen FOGRA39 erwartet), Konturschärfe, Lackbeschaffenheit
2. **Stanzkante**: glatt, kein Ausreißen, exakter Durchmesser (±0,2 mm)
3. **Klebkraft**: auf Terracotta, glasiertem Keramik-Topf, Plastiktopf je 24 h, dann ablösen → kein Rückstand bei Plastik, klebt fest auf Keramik
4. **NFC-Lesbarkeit**: mit iPhone (≥iPhone 7) und Android-Phone scannen, jeder Tag muss URL aus Master-CSV liefern
5. **QR-Scan**: jeder QR scannt korrekt aus 5/10/15/20 cm Abstand bei normalem Innenraumlicht
6. **NFC↔QR-Match**: jeder Sticker liefert per Tap und Scan **dieselbe** URL
7. **UV-Test**: 1 Sticker pro Größe 7 Tage direkte Sonne (Fensterbank Süd) → Farbveränderung dokumentieren
8. **Wassertest**: 1 Sticker pro Größe 24 h in stehendem Wasser → Delaminierung? Druck verlaufen? NFC noch lesbar?

Erst bei bestandenem Test → Pilotbestellung freigeben.

---

## 9. Was an Velia kommuniziert werden muss

- "Variable-Data-Zone in den Artworks ist als separater Layer markiert. Bitte QR exakt dort einsetzen."
- "Verwendet die beigefügte CSV (Reihenfolge: 5× 25mm, 5× 30mm, 5× 40mm)."
- "Wir benötigen je Sticker NFC-Encoding **und** gedruckten QR mit der **identischen** URL."
- "NFC-Schreibschutz nach Encoding (Lock Bit setzen) – damit Endkunden den Tag nicht versehentlich überschreiben können."

---

## 10. Offene Punkte

- [ ] Designer briefen / beauftragen
- [ ] Brand-Farbe und Typografie aus Landing-Page extrahieren und hier ergänzen
- [ ] Entscheidung: QR mittig vs. unten zentriert (Designentscheidung)
- [ ] NFC-Lock-Bit-Frage an Velia stellen (sollen sie schreibgeschützt liefern?)
- [ ] Verpackungsdesign für Endkundenversand (separate Spec)
