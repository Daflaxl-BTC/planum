---
title: "Planum Sticker — Variante C: 12 Stil-Varianten"
date: 2026-05-02
project: Planum
phase: Hardware-Design
tags:
  - planum
  - sticker
  - qr
  - design
  - hardware
status: review
aliases:
  - Monstera Hug Varianten
  - Variante C Showcase
---

# Variante C — „Monstera Hug" · 12 Stil-Varianten

> [!info] Kontext
> Ausbau der **Variante C** aus `Planum_Konzept_Sticker.html` (zwei Monstera-Blätter umarmen den QR-Code). Der ursprüngliche QR im Konzept war nur ein Schach-Pattern — diese Varianten enthalten alle **echte, scanbare QR-Codes**.

## Spezifikationen (für alle 12 Varianten gleich)

| Parameter | Wert |
|---|---|
| Durchmesser | 30 mm |
| QR-Inhalt | `https://app.planum.de/plant/{uuid}` |
| QR-Version | 9 (53×53 Module) |
| Fehlerkorrektur | **ECC-H** (30 % verdeckte Module tolerierbar) |
| Quiet-Zone | ≥ 4 Module (im Render: ≈ 5,8) |
| Rendering | SVG (vektoriell, drucksicher) |
| Sample-UUID | `8c4f9d2e-1b6a-4e3f-9a7d-2c5b8e1f4a09` |

## Was „mit AI" gemacht wurde

Echte Diffusion-QR-Codes (`QR Monster` / Stable-Diffusion ControlNet) brauchen GPU + Diffusionsmodell — in dieser Session nicht verfügbar. Drei algorithmische Hebel decken den optischen Zielkorridor ab und bleiben **garantiert druckfähig**:

1. **Module-Shape-Engine** — Punkte, abgerundete Quadrate, Mini-Blätter, Glas-Mosaik
2. **Color-Engine** — CMYK-Verläufe, Gold-Foil-Mock, Aquarell-Halos, Negative-Space
3. **Eye-Variation** — klassisch quadratisch, abgerundet, Tropfen-organisch

## Vergleichs-Galerie

| Variante | Vorschau | Charakter |
|---|---|---|
| [[C1 — Classic]] | ![[c1-classic.png\|180]] | Original mit echtem QR, klassische Augen |
| [[C2 — Dots]] | ![[c2-dots.png\|180]] | Punkt-Module, modern und freundlich |
| [[C3 — Leaves]] | ![[c3-leaf-modules.png\|180]] | Jedes Modul ein winziges Blatt |
| [[C4 — Gradient]] | ![[c4-gradient.png\|180]] | Forest→Leaf→Sage CMYK-Verlauf |
| [[C5 — Center-Logo]] | ![[c5-logo-center.png\|180]] | Planum-Mark im Zentrum (ECC-H 22 %) |
| [[C6 — Night]] | ![[c6-inverted.png\|180]] | Negative Space, dunkler Sticker |
| [[C7 — Botanical]] | ![[c7-flora.png\|180]] | Mix aus Blatt- und Punkt-Modulen |
| [[C8 — Gold]] | ![[c8-gold.png\|180]] | Premium Gold-Foil auf Forest |
| [[C9 — Aquarell]] | ![[c9-watercolor.png\|180]] | Halos, weiche Patches — handgemalt |
| [[C10 — Sun]] | ![[c10-topdown.png\|180]] | 8 Blätter strahlen rund um den QR |
| [[C11 — Mosaic]] | ![[c11-stained.png\|180]] | Stained-Glass mit 6 Grünschattierungen |
| [[C12 — Minimal]] | ![[c12-minimal.png\|180]] | Reduziert, größter QR, Mini-Bogen |

## Decoder-Validierung

> [!success] 12 / 12 zuverlässig dekodiert
> pyzbar 0.1.9 + libzbar 0.23 + cv2 4.13 (mit Inversions-Fallback für Dark-Variants).
> Phone-Kameras (iOS Live Text, Google Lens) sollten alle Varianten lesen können.

| Variante | pyzbar direkt | mit Inversion | Hinweis |
|---|:---:|:---:|---|
| C1–C5, C7, C9, C11, C12 | ✅ | — | Standard-Scan |
| C6 (Night) | — | ✅ | Dark-bg, alle modernen Phones |
| C8 (Gold) | — | ✅ | Dark-bg + Gold-Module |
| C10 (Sun) | ✅ | — | Standard-Scan |

## Empfehlungen

> [!tip] Mein Vorschlag
> - **Hauptlinie:** `[[C2 — Dots]]` oder `[[C4 — Gradient]]` — beides modern, breit anschlussfähig, druckrobust
> - **Premium-Box:** `[[C8 — Gold]]` als limitierte Edition (wirkt teurer, rechtfertigt höheren Preis)
> - **Saison-Edition:** `[[C9 — Aquarell]]` oder `[[C11 — Mosaic]]` — emotional und verkaufsfähig auf Social
> - **Nicht empfohlen für Hauptlinie:** C6 (Night), C8 (Gold) — Dark-Variants funktionieren, aber QR-Apps älterer Android-Versionen können stolpern

## Nächste Schritte

- [ ] Eine Variante als Hauptlinie festlegen
- [ ] `Planum_Konzept_Sticker.html` mit gewählter Variante aktualisieren
- [ ] Hersteller-Anfrage anpassen (`Planum_Anfrage_Hersteller.docx`)
- [ ] Druck-Test bei 30 mm physischer Größe (Inkjet auf Papier reicht für Scan-Test)
- [ ] Optional: 1–2 Varianten als A/B-Test in einer Mini-Charge bestellen

## Source-Files

- Generator-Script: `scripts/generate_qr.py` (Python + qrcode + cairosvg)
- Showcase-HTML: `docs/sticker-variants-c/showcase.html`
- Vektor-SVGs: `docs/sticker-variants-c/svg/c1.svg … c12.svg`
- Master-CSV (1 000 UUIDs): `scripts/output/planum-2026-05-02T14-45-22-master.csv`

## Verwandte Notes

- [[Planum Konzept]]
- [[Hersteller-Anfrage]]
- [[QR-Code Standards]]
- [[Businessplan]]
