// Texte der neuen Module (Redesign 10/2026).
// Jede Aussage hier ist aus bestehenden, geprueften Texten abgeleitet
// (faq.js, steps.js, tiers.js, pro.js) — vor Aenderungen claims-guard.md lesen.

export const HERO_META = {
  chip: 'Erste Charge in Produktion',
  // Ehrlichkeit als Conversion-Treiber: erklaert, warum es nur ein E-Mail-Feld
  // gibt und keinen Kaufen-Knopf.
  chipNote: 'Noch nicht erhältlich',
  facts: [
    { value: 'Ø 40 mm', label: 'Profil-Sticker' },
    { value: 'NTAG213', label: 'NFC unter dem Motiv' },
    { value: '19,99 €', label: 'Basis, einmalig*' },
  ],
}

// Kompatibilitaet statt Logo-Leiste: es gibt keine Kunden, die man zeigen
// koennte, und erfundene Social Proof ist verboten (claims-guard.md).
export const COMPAT = {
  label: 'Funktioniert mit',
  items: [
    'iPhone ab iPhone 7',
    'Android mit NFC',
    'Ohne NFC: QR-Code auf dem Trägerpapier',
    'Ton, Keramik und Kunststoff',
    'Ohne App-Installation',
    'Für Zimmerpflanzen',
  ],
}

export const INSIGHT_STATEMENT = {
  eyebrow: 'Das Problem',
  text:
    'Jede Pflanzen-App scheitert an derselben Stelle. Nach dem Gießen: Handy raus, App suchen, Pflanze finden, Haken setzen. Das hält niemand länger als drei Wochen durch. Planum dreht das um — der Auslöser sitzt dort, wo die Handlung passiert. Am Topf.',
  // Ab diesem Wort wird der Satz in Terracotta gesetzt.
  accentFrom: 'Planum',
}

export const STORY_OVERLAYS = {
  stick: { a: 'Profil · Ø 40 mm', b: 'Gießen · 32 × 40 mm' },
  tap: { title: 'Monstera', meta: 'Wohnzimmer · Profil geöffnet', note: 'Beispielansicht' },
  log: { title: 'Gießen protokolliert', meta: 'gerade eben' },
}

export const BENTO = {
  eyebrow: 'In der App',
  headline: 'Was du nach dem Tippen siehst.',
  lead:
    'Kein Dashboard voller Diagramme. Eine Ampel, ein Verlauf, ein Pflegerhythmus — und die Gewissheit, wann zuletzt gegossen wurde.',
  note: 'Oberflächen schematisch dargestellt. Die Schwellen der Ampel entsprechen der Logik in der App.',
  plants: [
    { name: 'Monstera', place: 'Wohnzimmer', due: 'in 4 Tagen', tone: 'good' },
    { name: 'Calathea', place: 'Schlafzimmer', due: 'morgen', tone: 'needs' },
    { name: 'Ficus', place: 'Flur', due: 'überfällig', tone: 'urgent' },
  ],
  // Titel/Texte von Ampel, Zeitraffer und Artenbestimmung: APP_PROOF in steps.js.
  cards: {
    timelapse: {
      badge: 'Im Gratisplan',
    },
    species: {
      badge: 'Erste Bestimmung kostenlos',
    },
    tap: {
      title: 'Gießen ist ein Tap',
      body: 'Tropfen antippen, fertig. Kein Menü, kein Formular.',
    },
    web: {
      title: 'Keine App nötig',
      body: 'Beim Antippen öffnet sich das Profil im Browser. Eine native App ist in Arbeit, aber keine Voraussetzung.',
    },
    privacy: {
      title: 'Daten in der EU',
      body: 'Für die Warteliste speichern wir nur deine E-Mail-Adresse. Keine Analyse- oder Werbe-Cookies.',
    },
  },
}

// Ueberschrift und Einleitung kommen aus ECOSYSTEM (site.js).
export const ROADMAP = {
  eyebrow: 'Ein System, das mitwächst',
  stages: [
    { tag: 'Stufe 1', name: 'Gratis', body: 'Bis zu fünf Pflanzen, Bilderverlauf und Zeitraffer.', state: 'planned' },
    { tag: 'Stufe 2', name: 'Basis', body: 'Das Sticker-Set für 10 Pflanzen. Antippen statt suchen.', state: 'production' },
    { tag: 'Stufe 3', name: 'Pro', body: 'Ein Sensor in der Erde, der selbst protokolliert.', state: 'dev' },
  ],
  stateLabel: {
    planned: 'Zum Start',
    production: 'In Produktion',
    dev: 'In Entwicklung',
  },
}
