// Ablauf + Materialität der Sticker.
// Zahlen und Materialangaben stammen aus docs/print-specs-nfc-stickers.md
// und docs/sticker-variants-d/. Nichts hier ist geschätzt.

export const STEPS = {
  eyebrow: 'So funktioniert es',
  headline: 'Drei Handgriffe.\nDanach nie wieder ein Formular.',
  items: [
    {
      n: '01',
      title: 'Aufkleben',
      body:
        'Zwei Sticker pro Pflanze: eine runde Medaille fürs Profil, ein Tropfen fürs Gießen. Beide kleben auf Ton, Keramik und Kunststoff.',
    },
    {
      n: '02',
      title: 'Antippen',
      body:
        'Handy kurz an die Medaille halten. Das Pflanzenprofil öffnet sich sofort — ohne dass du in einer Liste nach der richtigen Pflanze suchst.',
    },
    {
      n: '03',
      title: 'Gießen loggen',
      body:
        'Nach dem Gießen einmal den Tropfen antippen. Das war es. Kein Haken, kein Formular, kein „mach ich später".',
    },
  ],
};

export const CRAFT = {
  eyebrow: 'Die Sticker',
  headline: 'Technik, die man nicht sieht.',
  lead:
    'Ein Aufkleber, der nach Technik aussieht, kommt nach zwei Wochen wieder ab. Deshalb steckt bei Planum die Elektronik unter dem Motiv — und oben ist nur Gestaltung.',
  specs: [
    {
      label: 'Profil-Sticker',
      value: 'Rund, Ø 40 mm',
      note: 'Öffnet das Pflanzenprofil.',
    },
    {
      label: 'Gieß-Sticker',
      value: 'Tropfenform, 32 × 40 mm',
      note: 'Ein Tap protokolliert das Gießen.',
    },
    {
      label: 'NFC-Chip',
      value: 'NTAG213',
      note: 'Antenne unsichtbar unter dem Motiv.',
    },
    {
      label: 'Kein QR auf dem Sticker',
      value: 'Nur auf dem Trägerpapier',
      note: 'Als Rückfallweg, falls dein Gerät kein NFC hat.',
    },
  ],
  design: {
    title: 'Terracotta-Relief',
    body:
      'Gedeckte Erdtöne, botanische Zeichnung, matte Soft-Touch-Oberfläche. Der Sticker soll auf einem Terrakotta-Topf aussehen, als wäre er schon immer dort gewesen — nicht wie ein Preisschild.',
  },
};

export const APP_PROOF = {
  eyebrow: 'In der App',
  headline: 'Was du nach dem Tippen siehst.',
  // Die drei Schwellen sind nicht erfunden, sondern die tatsaechlichen Werte aus
  // app/src/lib/careLogic.js (statusForDueDate). Aendert sich die Logik dort,
  // gehoert dieser Block angepasst.
  legend: {
    caption: 'Die Ampel kennt genau drei Zustände — abgeleitet aus dem Termin, den Planum für jede Pflanze führt.',
    states: [
      { tone: 'good', label: 'Alles gut', body: 'Der nächste Termin ist mehr als zwei Tage entfernt.' },
      { tone: 'needs', label: 'Wird bald fällig', body: 'Weniger als zwei Tage bis zum nächsten Termin.' },
      { tone: 'urgent', label: 'Überfällig', body: 'Der Termin liegt in der Vergangenheit.' },
    ],
  },
  items: [
    {
      title: 'Ampel statt Zahlenkolonnen',
      body:
        'Grün, Gelb, Rot. Du siehst in einer Sekunde, welche Pflanze dran ist — und welche du in Ruhe lassen kannst.',
    },
    {
      title: 'Bilderverlauf und Zeitraffer',
      body:
        'Jedes Foto bleibt erhalten und wird zur chronologischen Galerie. Daraus entsteht ein kurzes Zeitraffer-Video. Beides ist im Gratisplan enthalten.',
    },
    {
      title: 'KI-gestützte Artenbestimmung',
      body:
        'Ein Foto bei der Erstregistrierung genügt: Planum bestimmt die Art und leitet daraus einen Pflegerhythmus ab. Diese erste Bestimmung ist immer kostenlos.',
    },
  ],
};
