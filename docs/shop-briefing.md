# Pflegeshop – Briefing für Claude Code

> **Zweck**: Selbstständig die Shop-Oberfläche (`/shop`) der Planum-App fertigstellen.
> **Erstellt**: 2026-04-25 (Cowork-Session, Recherche-Vorlauf)
> **Status**: Bereit für Implementierung. Keine Tracking-IDs vorhanden – alle Affiliate-Links sind Platzhalter (`PARTNER_ID_TBD`), die Felix später ersetzt.

---

## 0. Kontext für Claude Code

- **Branch**: `claude/fervent-jackson-d4ccd7` enthält den `app/`-Ordner (eigentliche Web-App). `main` hat nur die Landing-Page. Vor Beginn: `git checkout claude/fervent-jackson-d4ccd7` und prüfen, ob das immer noch der aktive App-Branch ist (sonst Felix fragen).
- **Aktueller Zustand**: `app/src/pages/ShopPlaceholder.jsx` ist eine leere "Kommt bald"-Seite. Route ist in `app/src/App.jsx` Zeile 25 als `/shop` registriert. BottomNav verlinkt schon dorthin.
- **Stack der App**: React 18 + Vite + Tailwind 3.4 + React Router 6 + Supabase. Keine zusätzlichen UI-Bibliotheken installieren ohne Rückfrage (Golden Rule #6 in CLAUDE.md).
- **Theme** (in `app/tailwind.config.js`):
  - Farben: `sage`, `earth`, `moss`, `cream` (jeweils 50–900). Bestehende Pages nutzen `bg-cream-50`, `text-sage-900`, Akzente in `earth-700` / `moss-500`.
  - Fonts: `font-display` (DM Serif Display) für Headlines, `font-body` (Inter) für Text.
  - Buttons/Cards: weiche Rundungen (`rounded-2xl`/`rounded-3xl`), keine harten Schatten – Style-Referenz: `Dashboard.jsx` und `PlantDetail.jsx`.

---

## 1. Architektur-Entscheidungen (von Claude vorrecherchiert, Felix bestätigt: ausstehend)

### 1.1 Datenhaltung: Supabase-Tabelle statt Hardcode

**Begründung**: Sortiment soll später ohne Re-Deploy kuratierbar sein. Spätere Saisonalität (z. B. "Frühlings-Specials") ist trivial über ein `active`-Flag steuerbar.

Neue Tabelle `shop_products` (Migration anlegen, **nicht** an bestehenden Tabellen rütteln):

```sql
create table shop_products (
  id            uuid primary key default gen_random_uuid(),
  category      text not null check (category in ('duenger','erde','toepfe','werkzeug','bewaesserung','sonstiges')),
  title         text not null,
  subtitle      text,
  description   text,
  image_url     text,                              -- Supabase Storage oder externer CDN-Link
  affiliate_url text not null,                     -- vollständiger Deeplink inkl. Tracking-Tag
  affiliate_network text not null check (affiliate_network in ('amazon','awin','direct')),
  price_hint    text,                              -- "ab 9,99 €" – KEIN Live-Preis (rechtlich heikel)
  badge         text,                              -- "Empfehlung", "Bestseller", optional
  sort_order    int not null default 100,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- RLS: alle authentifizierten Nutzer dürfen lesen, niemand schreibt aus dem Frontend
alter table shop_products enable row level security;
create policy "shop_products read for authed" on shop_products
  for select using (auth.role() = 'authenticated');
```

> Migration über Supabase CLI oder MCP-Tool. **Nicht** den `apply_migration`-MCP-Call ohne Rückfrage feuern – Felix muss den Diff sehen.

### 1.2 Affiliate-Programme: Zweistufig

| Phase | Quelle           | Wann        | Provision           | Cookie | Vorteil                              |
| ----- | ---------------- | ----------- | ------------------- | ------ | ------------------------------------ |
| 1     | Amazon PartnerNet | Sofort live | 3 % (Garten)        | 24 h   | Sortimentsbreite, schnelle Anmeldung |
| 2     | Awin (Pflanzen-Kölle, BALDUR, Horstmann) | Nach Awin-Freischaltung | 8–12 %  | bis 30 d | Bessere Marge, themenrelevant        |

In `affiliate_network` zunächst nur `amazon`. Awin-Felder werden 1:1 ergänzt, sobald Felix die Tracking-Parameter hat – kein Code-Refactor nötig.

### 1.3 Erstes Sortiment (10 Karten, Amazon-Platzhalter)

Diese Produkte als Seed-Daten in einer SQL-Datei `supabase/seed/shop_products.sql` ablegen. Affiliate-URL-Format Amazon: `https://www.amazon.de/dp/<ASIN>?tag=PARTNER_ID_TBD`.

| # | Kategorie     | Titel (Beispiel)                              | Subtitle                          |
| - | ------------- | --------------------------------------------- | --------------------------------- |
| 1 | duenger       | Compo Grünpflanzen-Dünger 500 ml              | Universal-Flüssigdünger           |
| 2 | duenger       | Substral Naturen Bio Zimmerpflanzen-Dünger    | Bio-zertifiziert                  |
| 3 | erde          | Floragard Bio-Zimmerpflanzenerde 5 L          | Torffrei                          |
| 4 | erde          | Compo Sana Kakteen- und Sukkulentenerde 5 L   | Mineralisch                       |
| 5 | toepfe        | LECHUZA Classico LS 28 Selbstbewässerungstopf | Mit Wasserstandsanzeige           |
| 6 | toepfe        | Übertopf Keramik 14 cm (3er-Set)              | Schlichtes Design                 |
| 7 | bewaesserung  | Gardena Bewässerungssystem für Zimmerpflanzen | Urlaubsbewässerung                |
| 8 | bewaesserung  | Sprühflasche 500 ml mit feinem Nebel          | Für Blattpflege                   |
| 9 | werkzeug      | Mini-Gartenwerkzeug-Set 3-teilig              | Schaufel, Harke, Forke            |
| 10| sonstiges     | Pflanzenleuchte LED-Vollspektrum              | Für dunkle Standorte              |

> **Recherche-Job für Claude Code**: ASINs selbst auf amazon.de heraussuchen (Web-Tool nutzen). Bei jedem Produkt prüfen: noch lieferbar, ≥ 4 Sterne, Versand durch Amazon. Bilder NICHT direkt von Amazon hotlinken – das verstößt gegen die AGB. Stattdessen: Amazon Product Advertising API (später) oder eigene Fotos in Supabase Storage.

### 1.4 UI-Vorgaben

- **Layout**: Identisch zu `Dashboard.jsx` (Padding, Container-Breite, BottomNav unten).
- **Header**: Headline "Pflegeshop" in `font-display text-3xl text-sage-900`, darunter Subline `text-sage-500`: "Kuratierte Empfehlungen für deine Pflanzen."
- **Filter-Chips** (horizontal scrollbar auf Mobile): Alle / Dünger / Erde / Töpfe / Bewässerung / Werkzeug. Aktiver Chip: `bg-moss-600 text-cream-50`, inaktiv: `bg-sage-100 text-sage-700`.
- **Produkt-Karten** (Grid: 1 Spalte mobile, 2 Spalten ≥ md):
  - `rounded-3xl bg-white shadow-sm border border-sage-100 p-4`
  - Bild oben (Aspect-Ratio 4:3, `object-cover`, `rounded-2xl`).
  - Titel (`font-display text-lg`), Subtitle (`text-sm text-sage-500`), Preis-Hinweis (`text-xs text-earth-700`).
  - **Werbe-Badge** (Pflicht!): kleines Pill `bg-earth-100 text-earth-800 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full` mit Text "Werbung".
  - CTA-Button: "Auf Amazon ansehen →" → `<a target="_blank" rel="sponsored noopener nofollow">`. **Das `rel="sponsored"` ist Pflicht** (Google-Richtlinie + Transparenz).
- **Footer-Disclaimer** unter dem Grid:
  > Alle Produktempfehlungen sind Affiliate-Links. Wenn du über sie kaufst, erhalten wir eine kleine Provision – für dich ändert sich nichts am Preis. Mehr dazu in unserer [Datenschutzerklärung](/datenschutz).
- **Leerer Zustand** (wenn `shop_products` noch leer): freundliche Karte "Sortiment wird gerade kuratiert. Schau später nochmal vorbei." – nicht crashen.
- **Loading-State**: Skeleton-Karten (3 Stück, `animate-pulse bg-sage-100`).

### 1.5 Code-Aufbau

```
app/src/pages/Shop.jsx              # neue Datei, ersetzt ShopPlaceholder.jsx
app/src/components/ShopProductCard.jsx
app/src/components/ShopCategoryFilter.jsx
app/src/lib/shopApi.js              # fetchShopProducts(category?) -> Supabase Query
```

In `App.jsx` Zeile 11+25 `ShopPlaceholder` durch `Shop` ersetzen. Die alte Datei kann gelöscht werden.

---

## 2. Was Claude Code NICHT machen soll

- Keine eigenen Affiliate-IDs erfinden / einsetzen. Platzhalter `PARTNER_ID_TBD`, fertig.
- Keine Live-Preise scrapen oder cachen. Nur unverbindliche Hinweise wie "ab 9,99 €", die Felix manuell pflegt.
- Keine Amazon-Produktbilder per Hotlink einbinden – AGB-Verstoß. Lieber Platzhalter-SVG aus Lucide oder eigene Symbole.
- Keine Schemaänderung an `users`, `qr_packages`, `plants`, `care_logs`, `care_schedules`, `plant_species`. Nur die NEUE Tabelle `shop_products` anlegen.
- Keine `npm install` neuer Pakete ohne Rückfrage. Alles, was hier steht, geht mit den vorhandenen Deps.
- Kein Production-Deploy. Nur lokal testen + Branch pushen.

---

## 3. Akzeptanzkriterien (Felix prüft am Ende)

- [ ] `/shop` zeigt keine "Kommt bald"-Seite mehr, sondern Filter + Produktkarten.
- [ ] Mit leerer DB: leerer-Zustand-Card erscheint, kein Crash.
- [ ] Mit Seed-Daten (10 Produkte): Karten in 1/2-Spalten-Grid, Filter funktioniert.
- [ ] Jede Karte hat sichtbares "Werbung"-Badge.
- [ ] Klick auf CTA öffnet Amazon-Link in neuem Tab mit `rel="sponsored noopener nofollow"`.
- [ ] Disclaimer-Text unter dem Grid sichtbar.
- [ ] Lighthouse-Mobile-Score ≥ 90 für die `/shop`-Route.
- [ ] Migration-SQL und Seed-SQL liegen versioniert im Repo unter `supabase/migrations/` bzw. `supabase/seed/`.
- [ ] `npm run build` läuft fehlerfrei.

---

## 4. To-do nach Implementierung (Felix-Aufgaben, NICHT Claude)

**Steuer-/Gewerbe-Setup** (Felix hat bereits ein Einzelunternehmen mit Regelbesteuerung im Handel mit elektronischem Straßenverkehrszubehör, inkl. Amazon-Seller-Account):

1. **Gewerbeummeldung** beim Gewerbeamt: Tätigkeit erweitern um "Betrieb einer Online-Plattform mit Werbeerlösen (Affiliate-Marketing) und Vermarktung digitaler Pflanzenpflege-Dienste". Kein neues Gewerbe.
2. **ELSTER-Mitteilung** ans Finanzamt: erweiterte Tätigkeit + geänderte Umsatzprognose.
3. **USt-IdNr** vom BZSt abwarten (Antrag läuft bereits). **Vor Erteilung KEINE Awin-/Amazon-Auszahlungen scharfschalten**, sonst Reverse-Charge-Problematik bei Amazon Luxemburg.
4. In **lexoffice/sevdesk** separates Erlöskonto "Affiliate-Provisionen" anlegen, damit Auswertung pro Geschäftsfeld möglich ist.

**Affiliate-Anmeldungen** (nach USt-IdNr-Erteilung):

5. Amazon PartnerNet anmelden → Tracking-ID (`planum-21` o. ä.) erhalten → in den 10 Seed-URLs `PARTNER_ID_TBD` ersetzen. Steuerdaten = identisch zum bestehenden Seller-Account.
6. Awin-Publisher anlegen, bei Pflanzen-Kölle / BALDUR / Horstmann bewerben.
7. Innerhalb 180 Tagen ≥ 3 qualifizierte Sales generieren, sonst sperrt Amazon den PartnerNet-Account.

**Frontend-/Rechtliches** (kann auch jetzt schon passieren):

8. Impressum + Datenschutzerklärung um Affiliate-Hinweis ergänzen (Mustertexte z. B. von e-recht24.de).
9. Cookie-Consent prüfen: Affiliate-Tracking-Cookies sind opt-in-pflichtig (TDDDG).
10. Werbe-Kennzeichnung auf jeder Karte sichtbar (im Frontend-Spec oben bereits vorgegeben).

**USt-Hinweise für die spätere Buchhaltung** (nur Info, nicht für Claude Code):

- Awin DE & deutsche Merchants → Rechnung/Gutschrift mit 19 % USt.
- Amazon PartnerNet (Luxemburg) → Reverse Charge, keine USt ausweisen, in USt-Voranmeldung + Zusammenfassende Meldung (ZM) deklarieren.
- Vorsteuerabzug für Hosting, Supabase, Plant.id-API, Tools etc.

---

## 5. Quellen-Hinweise (für späteres Nachlesen)

- Amazon PartnerNet Provisionsstruktur: `partnernet.amazon.de/help/operating/schedule`
- Awin-Merchant-Übersicht (Pflanzen): `awin.com/de` → Suche "Garten/Pflanzen"
- 100 Partnerprogramme Pflanzen & Garten: `100partnerprogramme.de/thema/pflanzen-garten/`
- Werbekennzeichnung (UWG): BGH-Urteil I ZR 125/14 (Schleichwerbung)
- Kleinunternehmer-Grenzen § 19 UStG (Stand 2025): 25.000 € Vorjahr / 100.000 € lfd. Jahr
