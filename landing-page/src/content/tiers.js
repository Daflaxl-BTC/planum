// Stufenmodell. Quelle: docs/entitlements-stufenmodell.md (10.07.2026).
// Pro erscheint bewusst NICHT hier, sondern als Ausblick in pro.js —
// ohne Preis und ohne Datum (Festlegung 19.08.2026).

export const TIERS = {
  eyebrow: 'Stufen',
  headline: 'Kostenlos anfangen.\nEinmal zahlen, wenn es sich lohnt.',
  lead:
    'Die Gratisversion ist kein Demo mit abgeschnittenen Funktionen. Der Bilderverlauf und das Zeitraffer-Video gehören dazu — das Gedächtnis deiner Pflanze bekommst du geschenkt.',
  items: [
    {
      id: 'gratis',
      name: 'Gratis',
      price: '0 €',
      priceNote: 'App und Konto, dauerhaft',
      summary: 'Zum Ausprobieren mit den Pflanzen, die dir am wichtigsten sind.',
      features: [
        { text: 'Bis zu 5 Pflanzen' },
        { text: 'Bilderverlauf, dauerhaft gespeichert' },
        { text: 'Zeitraffer-Video aus deinen Fotos' },
        { text: 'Pflege manuell eintragen' },
        { text: 'Artenbestimmung bei der Erstregistrierung — kostenlos je Pflanze' },
        { text: 'Eine KI-Pflegeabfrage pro Monat je Pflanze', muted: true },
      ],
      cta: 'Zum Start benachrichtigen',
      featured: false,
    },
    {
      id: 'basis',
      name: 'Basis',
      price: '19,99 €',
      priceNote: 'Einmalig — kein Abo',
      badge: 'Das Sticker-Set',
      summary:
        'Das Set für 10 Pflanzen: 20 Sticker, zwei je Pflanze. Einmal gekauft, dauerhaft freigeschaltet.',
      features: [
        { text: 'Sticker für 10 Pflanzen (20 Stück)', strong: true },
        { text: 'Antippen statt suchen — das Profil öffnet sich direkt' },
        { text: 'Gießen per Tap protokollieren' },
        { text: 'Unbegrenzt viele Pflanzen in der App' },
        { text: 'Zwei KI-Pflegeabfragen pro Woche je Pflanze' },
        { text: 'Alles aus der Gratisversion inklusive' },
      ],
      cta: 'Zum Start benachrichtigen',
      featured: true,
    },
  ],
};
