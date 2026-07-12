# Planum Runde D — Lieferpaket Druckdaten (2026-07-07)

**Freigegebene Richtungen:** D1 Messing-Botanik (Hauptlinie) + D2 Terracotta-Relief (Stealth-Variante).
**Konfiguration:** NFC-only-Sticker, QR ausschließlich auf dem Trägerpapier, Encoding auf `www.planumplants.de`.

## Dateien

| Datei | Sticker | Endformat | Datenformat (inkl. 3 mm Bleed) |
|---|---|---|---|
| `planum-d1-messing-profil-oe40mm.pdf` | D1 Profil | Ø 40 mm Kreis | 46 × 46 mm |
| `planum-d1-messing-giessen-32x40mm.pdf` | D1 Gießen | 32 × 40 mm Tropfen | 38 × 46 mm |
| `planum-d2-terracotta-profil-oe40mm.pdf` | D2 Profil | Ø 40 mm Kreis | 46 × 46 mm |
| `planum-d2-terracotta-giessen-32x40mm.pdf` | D2 Gießen | 32 × 40 mm Tropfen | 38 × 46 mm |
| `planum-2026-07-07-nfc-encoding-samples.csv` | Encoding | 15 Paare = 30 Sticker | — |

## Technische Eckdaten

- **CMYK**, Output-Condition **FOGRA39** (ISO Coated v2), PDF-Kompatibilität 1.3 (transparenzfrei geflattet).
- **CutContour** als echte Spot-Color (Separation, Overprint, 0,25 pt) — Kreis Ø 40 mm bzw. Tropfenkontur.
- Bleed folgt der Stanzform (Kreis Ø 46 mm / Tropfen 38 × 46 mm) — **keine quadratische Kachel**; Rest = Trägerpapier.
- Keine Schriften enthalten (Wordmark als Pfade), keine RGB-Inhalte, keine Metallflächen über der Antennenzone.

## Encoding (CSV)

- Profil: `https://www.planumplants.de/p/{uuid}` · Gießen: dieselbe URL + `?action=giessen`.
- Beide Sticker eines Paars tragen **dieselbe UUID** (Spalte `pair_id` verbindet sie).
- Längste URL 81 Zeichen — NTAG213-konform. **Lock-Bit nach Encoding setzen** (Spalte bestätigt).
- URLs sind zukunftssicher: öffnen später via Universal/App Links direkt die native App.

## An den Hersteller kommunizieren

1. Zwei Stanzformen → einmalige Werkzeugkosten für die **Tropfenform** im Angebot separat ausweisen.
2. QR-Code **nicht** auf den Sticker, sondern auf das Trägerpapier je Paar drucken (gleiche Profil-URL).
3. NFC-Encoding je Sticker aus CSV, danach Lock-Bit; Stichproben-Scan-Protokoll erbeten.
4. RoHS- + REACH-/SVHC-Erklärung für Inlay, Folie und Adhäsiv beilegen.
5. Material/Veredelung unverändert gem. `../../print-specs-nfc-stickers.md` (PET ≥125 μm, Soft-Touch matt, Schutzlack).

## Prüfvermerk

Maße, Spot-Color und Render der vier PDFs am 07.07.2026 programmatisch und visuell geprüft.
Hersteller möge Proof/Preflight bestätigen (Standard bei Getsmart/Velia).
