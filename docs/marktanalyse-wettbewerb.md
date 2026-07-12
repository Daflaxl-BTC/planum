# Marktanalyse: Pflanzen-Tracking-Apps + Hardware
**Erstellt:** 2026-05-02
**Kontext:** Wettbewerbsanalyse für Planum (QR-Sticker + KI-Bilderkennung + App)

---

## Executive Summary

Der Markt für Pflanzen-Tracking lässt sich in **vier klar trennbare Segmente** gliedern. Direkte 1:1-Konkurrenz zu Planums Konzept (physisches Pflanzen-Identifikator-Sticker-Paket auf Amazon + KI-App + Care-Tracking) existiert **praktisch nicht** – aber es gibt starke Player in jedem Einzelsegment, die das Konzept teilweise abdecken.

**Kernergebnis:** Planums White Space ist die Kombination aus
1. günstigem, physischem Tracker (QR statt teuren Sensoren),
2. SKU-fähigem Amazon-Retail (statt D2C-Webshop oder reiner App),
3. eindeutiger 1:1-Plant-Mapping (jeder Sticker = eine Pflanze, eindeutige UUID),
4. KI-Identifikation beim Onboarding (statt manueller Eingabe).

Der nächste Konkurrent in der QR-Mechanik ist **HortusFox** (self-hosted, Tech-Nische) und **The Plant Map** (NFC-basiert, iOS-only). Im Hardware-Sensor-Segment ist **FYTA** (Berlin) der DACH-Platzhirsch, aber 10x teurer pro Pflanze als Planum.

---

## 1. Marktkategorien im Überblick

| Kategorie | Beispiele | Hardware | Preisniveau | Direktbezug zu Planum |
|---|---|---|---|---|
| **A. QR/NFC-Sticker-Tracking** | HortusFox, The Plant Map, MasterTag, Plantsoon | passive Sticker/Tags | low | **Direkter Konkurrent** |
| **B. Smart-Sensoren (Soil/Light)** | FYTA Beam, Xiaomi Mi Flora, Parrot Flower Power, SmartyPlants, OKO | aktive Bluetooth/WiFi-Sensoren | mittel-hoch | Indirekt (anderes Wertversprechen) |
| **C. Pure Software / Plant-ID** | PictureThis, Planta, Greg, PlantNet, Blossom, PlantIn, Vera (Bloomscape) | keine | freemium | Indirekt (Planum nutzt selbst Plant.id-API) |
| **D. Smart Pots / Self-Watering** | Click & Grow, AeroGarden, Lua, Plantui | aktiver Topf mit Pumpe/Licht | hoch | Komplementär (anderes Use-Case) |

---

## 2. Segment A – Direkte Konkurrenten (QR/NFC-Sticker)

Das ist Planums Kernarena. Hier sind alle relevanten Player:

### HortusFox
- **Was:** Open-Source, self-hosted Plant-Manager mit QR-Code-Druck-Funktion.
- **Hardware:** Druckt eigene QR-Codes, kein Verkaufsmodell für Sticker.
- **Zielgruppe:** Technik-affine Selbsthoster, Homelab-Community (Umbrel-App, Docker).
- **Schwäche:** Kein Plug-&-Play für Otto-Normal. Selbsthosting ist eine Mauer. Keine KI-Identifikation.
- **Bedrohung für Planum:** Niedrig – disjoint Zielgruppe.

### The Plant Map (iOS)
- **Was:** Visueller Watering-Tracker mit Apple-Shortcuts-NFC-Integration.
- **Hardware:** Nutzer kauft NFC-Sticker selbst (~15$ für 50 Stück).
- **Mechanik:** Sticker auf Topf → Tippen mit iPhone → Pflanze als gegossen markiert.
- **Schwäche:** iOS-only, NFC-Sticker müssen separat besorgt + manuell verknüpft werden, keine Plant-ID, keine eindeutige 1:1-Zuordnung beim Erstkauf.
- **Bedrohung für Planum:** Mittel – ähnliche UX-Idee, aber kein integriertes Produkt.

### Plantsoon
- **Was:** Anodisierte Aluminium-QR-Labels mit digitaler Pflanzen-Story.
- **Zielgruppe:** Botanische Gärten, Public Spaces, Garten-Designer (B2B).
- **Pricing:** Subscription-basiert, Free-Tier bis 25 Pflanzen.
- **Bedrohung für Planum:** Niedrig – B2B-Fokus, anderes Pricing-Modell.

### MasterTag, Muddy Boots, Smurfit Westrock, Bloomin' Easy
- **Was:** B2B-Hortikultur-Etiketten-Hersteller, beliefern Gärtnereien mit QR-Tags zur Kunden-Info.
- **Mechanik:** QR scannt → statische Pflegeinfo-Webseite. Kein App-gestütztes Logging, kein Care-Tracking.
- **Bedrohung für Planum:** Sehr niedrig – komplett anderer Vertriebskanal (Gärtnerei → Endkunde, kein Tracking-Loop).

### Bloomin' Easy (AR-Variante)
- **Was:** QR-Scan zeigt 3D-Augmented-Reality-Pflanze im eigenen Garten.
- **Bedrohung:** Niedrig – Marketing-Gimmick, kein Tracking.

**Fazit Segment A:** **Keine integrierte, retail-fähige Lösung mit App + KI + Sticker-Paket existiert.** Planum hat hier echten White Space.

---

## 3. Segment B – Smart-Sensoren (indirekte Konkurrenz)

Anderes Wertversprechen (Echtzeit-Messdaten), aber überlappende Zielgruppe.

### FYTA Beam (Berlin, DACH-Platzhirsch)
- **Hardware:** Solar-betriebener Bluetooth-Sensor, misst Bodenfeuchte, Nährstoffe, Temperatur, vollständiges Lichtspektrum (RGB + Infrarot).
- **System:** Beam (Sensor) + optional WiFi-Hub für Remote-Zugriff. Apple-HomeKit + Matter-kompatibel.
- **Pricing:** 39,99 € pro Sensor; 3er-Bundle 109,99 €; 5er + Hub 219,99 €; 10er + Hub 399,99 €.
- **Stärken:** Hardware-Qualität, App kostenlos (kein Abo), neue Gen-2 mit 13 Health-Metriken (2025).
- **Schwächen:** Pro Pflanze ~40 €. Bei 20 Pflanzen kostet FYTA **800 €**, Planum (geplant) 19,99 €. Faktor 40.
- **Bedrohung:** Hoch im Premium-Segment, irrelevant im Mass-Market.

### Xiaomi Mi Flora / Flower Care (HHCCJCY01/10)
- **Hardware:** Bluetooth-LE-Sensor, ~15-25 € pro Stück (China-Preis), CR2032-Batterie.
- **App:** Mi Home / Flower Care, ~3.000 Arten in DB.
- **Stärken:** Sehr günstig, Bastler-Community (Home Assistant, ESPHome).
- **Schwächen:** App-UX schwach, BLE-Reichweite ~2-3 m, Hub-Setup nötig für Remote.
- **Bedrohung:** Mittel – Preis-Konkurrent, aber UX-Hürde.

### Parrot Flower Power
- **Status:** Vorläufer, Produktion eingestellt. Nur Restbestand. Marktrelevanz gering.

### SmartyPlants (UK Kickstarter, 2024-25)
- **Hardware:** Multisensor (Feuchte, Nährstoffe, Licht, Luftfeuchte, Temperatur).
- **Status:** £100k+ auf Kickstarter, Top 1% Projekte, in Markteinführung.
- **Bedrohung:** Mittelfristig relevant, aber Premium-Pricing.

### OKO
- **Hardware:** Misst Wasser, Temperatur, Luftfeuchte, pH. Outdoor/Garten-Fokus.

**Fazit Segment B:** Sensoren spielen ein anderes Spiel (kontinuierliche Messung statt Identifikation/Logging). Planum kann sich klar abgrenzen über **Preis, Einfachheit, Onboarding via KI-Foto**.

---

## 4. Segment C – Pure Software / Plant-ID-Apps

Planum nutzt Plant.id selbst als Backend – diese Apps sind also keine direkten Wettbewerber, sondern definieren den Stand der Technik.

| App | Stärke | Preis | Notiz |
|---|---|---|---|
| **PictureThis** | Beste ID-Genauigkeit (98 %), 400k+ Arten | Freemium, ~30$/Jahr | Marktführer Plant-ID |
| **Planta** | Beste Care-Pläne, Lichtmesser, 30M+ getrackte Pflanzen | Freemium, Premium ~3 €/Monat | Schwedischer Marktführer Care |
| **Greg** | Community, "PlantVision" misst Topf+Fenster-Distanz | 29,99 $/Jahr | $5,4M Seed (2021), Community-Fokus |
| **PlantIn** | All-in-one ID + Care + Krankheiten + Experten-Chat | Freemium | Direkter PictureThis-Konkurrent |
| **Blossom** | Care-Tipps von "The Spruce" kuratiert | Freemium | Premium-Content-Spiel |
| **PlantNet** | Wissenschaftliche Crowd-DB, akademisch | Kostenlos | Eher Bestimmungs-Tool |
| **Vera (Bloomscape)** | Tracking + Plant Mom Support | Kostenlos | E-Commerce-Funnel für Bloomscape-Shop |
| **House Plant Tracker** | Spartanisch, simple Watering-Reminder | Free | Long-Tail |

**Fazit Segment C:** Reife, konsolidierte App-Landschaft. Differenzierung läuft über UX, Community, Preisgestaltung. **Kein Player verkauft Hardware-SKU als Hauptgeschäftsmodell.**

---

## 5. Segment D – Smart Pots (komplementär, kein Wettbewerber)

| Produkt | Was | Preis | Bezug zu Planum |
|---|---|---|---|
| **Click & Grow** | Hydroponik-Topf mit "Smart Soil"-Pods, LED, 1-Monats-Wassertank | ab ~100 € | Komplementär |
| **AeroGarden** | Hydroponik bis 24 Pflanzen (Farm XL), WiFi (Bounty Elite) | 100-500 € | Komplementär |
| **Lua** | Animierter "emotionaler" Smart-Topf | ~80 € | Gimmick-Nische |
| **Plantui 6** | Finnisches Hydroponik-System, 6 Pods, adaptive LEDs | ~250 € | Kraut/Salat-Indoor-Garten |

**Fazit Segment D:** Anderes Use-Case (essbare Pflanzen, eigene Mini-Töpfe). Planum richtet sich an **bestehende Zimmerpflanzen-Sammler**, nicht an Hydroponik-Neueinsteiger.

---

## 6. White-Space-Analyse für Planum

| Dimension | Etablierte Player | Planums Position |
|---|---|---|
| **Vertriebskanal** | App-Stores, D2C-Webshops, B2B-Gärtnereien | **Amazon FBA-Retail** (einzigartig) |
| **Hardware-Preis pro Pflanze** | 15-40 € (Sensoren) | **~1 €** (Sticker im 20er-Pack) |
| **Identifikation** | Manuell oder per Foto-App | **KI-Foto beim Sticker-Aktivieren** (Onboarding-UX) |
| **1:1-Mapping Pflanze ↔ Identifier** | Optional, manuell | **Vorgegeben durch UUID-Sticker** |
| **Re-Engagement-Mechanik** | Push-Notifications | **Physischer QR am Topf** (haptischer Trigger) |
| **Skalierbarkeit** | Marketing-getrieben | **Verpackungs-getrieben** (Pakete = SKUs) |
| **Lock-in / Wiederkauf** | Abo-Subscription | **Erweiterungspakete** (9,99 € / 10 Slots) + Affiliate-Shop |

### Risiken
- **The Plant Map** könnte das Konzept kopieren und einen NFC-Sticker-Pack auf Amazon launchen. Mitigation: First-Mover, deutsche Sprache, eigene Marke etablieren.
- **FYTA** könnte Low-End-Variante (passive QR statt Sensor) nachschieben. Mitigation: Preis-Schiene aggressiv halten.
- **PictureThis / Planta** könnten ein Hardware-Bundle launchen. Mitigation: schnell auf Markt, Amazon-Listings reservieren.

### Chancen
- **DACH-Markt unbesetzt** für QR-Sticker-Lösung. FYTA spielt Premium, kein Mass-Market-Anbieter.
- **Geschenk-Use-Case**: 19,99 € Sticker-Pack als Geschenk für Pflanzenfans ist deutlich anschlussfähiger als 200 € Sensor-Bundle.
- **Affiliate-Hebel**: Mit installierter Basis (UUID = User-Profil) zielgerichtetes Cross-Selling von Dünger/Erde.

---

## 7. Strategische Empfehlungen

1. **Differenzierung sofort kommunizieren:** "Smart Plant Care für 1 € pro Pflanze" – Kontrast zu FYTA/Mi Flora explizit machen.
2. **Amazon-Listing absichern:** Markenrechte "Planum" prüfen, FBA-Setup priorisieren bevor jemand mit ähnlichem Konzept startet.
3. **iOS-Shortcuts-Integration evaluieren:** The Plant Map nutzt das clever – Planum sollte zusätzlich zur QR-Mechanik auch Siri-Shortcuts unterstützen ("Hey Siri, Monstera gegossen").
4. **NFC als Premium-Variante prüfen:** QR ist günstiger und scanbar ohne Tap, aber NFC-Sticker (5-10 ct/Stück) als Premium-Pack für 29,99 € könnte zusätzliche Marge bringen.
5. **Plant.id-Backend monitorisieren:** Falls API-Kosten steigen, PlantNet als Fallback/Hybrid nutzen.
6. **Content-Marketing in DE:** Kategorie "intelligente Pflanzenpflege auf Deutsch" ist SEO-mäßig vergleichsweise frei – PictureThis/Planta dominieren EN.

---

## 8. Quellen

- [The Plant Map – iOS Water Tracker mit NFC](https://apps.apple.com/us/app/the-plant-map-water-tracker/id6743325138)
- [HortusFox – Self-hosted Plant Manager](https://www.hortusfox.com/)
- [FYTA – Smart Plant Sensors (DE)](https://fyta.de/en)
- [FYTA Beam Pricing & Bundles](https://fyta.de/en/products/fyta-beam)
- [Xiaomi Mi Flora Review](https://smarthomescene.com/reviews/xiaomi-miflora-plant-sensor-tuya-version-hhccjcy10-review/)
- [PictureThis](https://apps.apple.com/us/app/picturethis-plant-identifier/id1252497129)
- [Planta](https://getplanta.com/)
- [Greg App](https://greg.app/)
- [Vera by Bloomscape](https://bloomscape.com/vera/)
- [SmartyPlants Kickstarter](https://www.kickstarter.com/projects/smartyplants/smartyplants-sensors-to-monitor-your-plants-every-need)
- [Plantsoon – B2B QR Plant Signs](https://plantsoon.com/plantsigns)
- [MasterTag – Horticultural QR Labels](https://mastertag.com/)
- [Click & Grow Smart Garden 3](https://www.clickandgrow.com/products/the-smart-garden-3)
- [Mordor Intelligence – Indoor Plants Market 2025](https://www.mordorintelligence.com/industry-reports/indoor-plants-market)
- [Plant Care Apps Market – Newstrail](https://www.newstrail.com/plant-care-apps-market-hits-new-high-major-giants-planta-picturethis-greg-blossom/)
- [How NFC Tags Help with Plant Care – HowToGeek](https://www.howtogeek.com/tired-of-killing-your-pot-plants-heres-how-nfc-tags-can-help/)
