# Claims-Guard — verbindlich für alle Texte in `src/content/`

Stand: 20.08.2026 · Grundlage: `docs/entitlements-stufenmodell.md` (10.07.2026, laut `CLAUDE.md` maßgeblich)

Diese Datei existiert, damit spätere Textänderungen nicht in alte, unhaltbare Claims zurückfallen.
**Vor jedem Merge an `src/content/*` gegen diese Liste prüfen.**

---

## 1. Verbotene Aussagen

| Verboten | Warum | Stattdessen |
|---|---|---|
| Prozentzahlen zur KI-Genauigkeit („95 %", „99 %") | Nicht belegbar; hängt an Plant.id **und** an der Fotoqualität des Nutzers | „KI-gestützte Artenbestimmung" ohne Quote |
| „über 10.000 Pflanzenarten" | Zahl stammt aus Fremdmarketing, nicht verifiziert | Keine Artenzahl nennen |
| „0 € monatliche Kosten" (pauschal) | Gilt für Gratis und Basis, aber Pro hat ein optionales Abo | „Basis ist ein Einmalkauf — kein Abo." |
| NPK-/Nährstoffmessung, „misst Stickstoff/Phosphor/Kalium" | Der Sensor misst **EC (Leitfähigkeit)**, keine Labor-NPK-Werte | „Leitfähigkeit als Dünge-Indikator" |
| „verhindert Pflanzentod", „deine Pflanze stirbt nie wieder" | Erfolgsversprechen, das niemand halten kann | „hilft dir, den Rhythmus zu halten" |
| Nutzerzahlen, Testimonials, Sternebewertungen | Existieren nicht — erfundene Social Proof ist Wettbewerbsverstoß | Weglassen |
| „wetterfest", „für draußen", „UV-beständig" | Materialtests (Wasser/UV/Klebkraft) stehen laut Produktionsfahrplan noch aus | Nur Innenraum-Nutzung beschreiben |
| Konkrete Launch-Daten, Jahreszahlen, „ab 2027", „Herbst 2026" | Festlegung 19.08.2026: **kein Datum** kommunizieren | „Noch nicht erhältlich" + Warteliste |
| Preise für Pro (39,99 € Kit, 2,99 €/Mo) | Hardware existiert nicht; öffentliche Preisbindung wäre riskant | Pro ohne jede Preisangabe |
| Details zum Erweiterungs-Set (9,99 € / 10 Slots) | Unter dem neuen Zwei-Sticker-System ist unklar, ob 10 Slots = 10 Pflanzen oder 5. **Ungeklärt** | Auf der Landingpage gar nicht erwähnen |
| Verlinkung auf `/app/` | Festlegung 19.08.2026: vor dem Launch keine App-Verlinkung | Kein Link, kein Hinweis |
| Namentlicher Wettbewerbsvergleich (FYTA, Xiaomi, Planta, PictureThis) | Vergleichende Werbung nach § 6 UWG muss jede Aussage belegen können | Sachlich über das eigene Modell reden |
| „Philips Hue", „das Hue für Pflanzen" | Fremde Marke; Festlegung 19.08.2026 | Prinzip beschreiben, Marke nicht nennen |

---

## 2. Gesicherte Fakten (so und nicht anders)

**Gratis**
- max. **5 Pflanzen**
- KI-Pflegeabfrage **1× pro Monat je Pflanze**
- Die **Artenbestimmung bei der Erstregistrierung zählt nicht** gegen das Limit
- Bilderverlauf und Timelapse-Video **sind im Gratisplan enthalten**

**Basis — 19,99 €**
- Auszeichnung immer als *„geplanter Verkaufspreis, inkl. MwSt., Stand 08/2026"*
- **20 Sticker = 10 Pflanzen** (zwei Sticker je Pflanze: Profil + Gießen). Kommunikation primär als **„für 10 Pflanzen"** (Festlegung 20.08.2026)
- Einmalkauf, **lifetime** freigeschaltet, kein Abo
- KI-Pflegeabfrage **2× pro Woche je Pflanze**
- Unbegrenzte Pflanzenzahl in der App (physisch durch die Sticker begrenzt)

**Pro (Ausblick, ohne Preis und ohne Datum)**
- Messgrößen: Bodenfeuchte, Temperatur, Licht, Luftfeuchte, Leitfähigkeit (EC) **als Dünge-Indikator**
- **„Deine Messwerte bleiben für immer kostenlos — auch ohne Abo."** Dieser Satz ist gesetzt.
- Ein Abo ist optional und nur für Zusatznutzen (Langzeit-Historie, Multi-User, Sensor-Diagnose)
- Prinzip **Pro ⊇ Basis**: keine Basis-Funktion wird in Pro erneut verkauft

**Sticker (Runde D, Variante D2 Terracotta-Relief, freigegeben 07.07.2026)**
- Profil-Sticker rund, **Ø 40 mm** · Gieß-Sticker Tropfenform, **32 × 40 mm**
- NFC-Chip **NTAG213**, Antenne unsichtbar unter dem Motiv
- **Kein sichtbarer QR-Code auf dem Sticker** — QR nur auf dem Trägerpapier als Fallback

---

## 3. Formulierungsregeln

- Kein Ausrufezeichen in Fließtext.
- Keine Superlative ohne Beleg („das beste", „revolutionär", „einzigartig").
- Zahlen ausschreiben, wenn sie Nutzen bedeuten („für 10 Pflanzen"), nicht wenn sie nur Inhalt sind.
- Einschränkungen aktiv nennen statt verstecken. Die Seite gewinnt durch Ehrlichkeit, nicht trotz ihr.
- Deutsch, „du"-Ansprache, keine Anglizismen wo ein deutsches Wort existiert („Pflegeplan" statt „Care Plan").
