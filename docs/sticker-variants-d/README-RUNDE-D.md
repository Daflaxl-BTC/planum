# Planum Sticker — Runde D (2026-07-06)

**Neuansatz gegenüber Runde C:** Formcodierung statt Symbolcodierung.

Runde C unterschied Gießen/Profil nur über grafische Details (Regenstreifen vs. Sonne) — zu subtil,
funktional kaum ablesbar. Runde D codiert die Funktion in die **Stanzform** selbst:

| Sticker | Form | Endformat | Funktion |
|---|---|---|---|
| **Profil** | Rundes Medaillon | Ø 40 mm (Bleed 3 mm → 46 × 46 mm) | Tap/Scan öffnet Pflanzenprofil |
| **Gießen** | Wassertropfen-Stanzung | 32 × 40 mm (Bleed 3 mm → 38 × 46 mm) | Tap loggt Gießen (`?action=giessen`) |

Vorteile: Funktion auf einen Blick und haptisch erkennbar, starker Wiedererkennungswert am Regal,
die Tropfenform ist zugleich Marketing-Asset (Verpackung, Icon, App).

## Die 5 Designrichtungen

| # | Name | Charakter | Linie |
|---|---|---|---|
| D1 | Messing-Botanik | Elfenbein + Messing-Gravur, Kupferstich | Premium-Default |
| D2 | Terracotta-Relief | Ton-in-Ton, geprägtes Töpfersiegel | Stealth |
| D3 | Aquarell-Botanik | weiche Farbwaschungen, handgemalt | Massenmarkt |
| D4 | Nachtgrün & Gold | Dark Botanical Luxury | Statement/Geschenk |
| D5 | Nordisches Leinen | Skandi-Minimal, Leinen + Nähkante | Japandi |

Gemeinsame Designsprache: botanischer Zweig (Profil), fallender Tropfen + Ringe (Gießen),
Wordmark „PLANUM" im Bogen, dezente NFC-Tap-Wellen als Affordanz.

## Technische Konformität (geprüft gegen `../print-specs-nfc-stickers.md`)

- Keine metallischen Vollflächen über der NFC-Antennenzone — Gold/Messing nur als feine Linien, CMYK-simuliert (kein Hot-Stamping; Velia-konform).
- Stanzkontur als magenta gestrichelte Linie in jeder Datei (Spot-Color `CutContour` bei Finalabgabe).
- Bleed 3 mm rundum, Motiv randabfallend — der Bleed folgt der **Stanzform** (Kreis Ø 46 mm bzw. Tropfen 38 × 46 mm), keine quadratische Kachel; alles außerhalb der CutContour verbleibt auf dem Trägerpapier.
- SVG = Vektorquelle; PNG 300 dpi (Profil 543 px², Tropfen 449 × 543 px).
- **Offen:** QR-Zone. Runde D ist NFC-first. Falls QR-Fallback nötig (ältere Geräte), empfohlene Lösung:
  QR auf der **Rückseite des Trägerpapiers** oder als Mini-QR (15 × 15 mm, weiße Zone) nur auf dem Profil-Sticker — Designentscheidung vor Finalabgabe.
- Tropfen-Stanzung ist bei Konturstanzen-Herstellern (Velia: „präzises Konturstanzen") kein Mehraufwand; ein neues Stanzwerkzeug pro Form fällt einmalig an — im Angebot abfragen.

## Dateien

- `svg/` — 10 Vektorquellen (5 Richtungen × Profil/Gießen)
- `png/` — 300-dpi-Renderings
- `00-uebersicht-runde-d.png` — Kontaktbogen
- `showcase-runde-d.html` — Begutachtung im Topf-Kontext (im Browser öffnen)

## Nächster Schritt

Felix wählt 1–2 Richtungen → daraus PDF/X-1a-Druckdaten (CMYK, FOGRA39, CutContour-Spot,
Schriften in Pfaden) in den Velia-Größen + NFC-Encoding-CSV.
