// Zentrale Texte der Landingpage.
// Vor Änderungen: src/content/claims-guard.md lesen.

export const SITE = {
  name: 'Planum',
  domain: 'https://www.planumplants.de',
  tagline: 'Pflanzenpflege, die am Topf beginnt',
  priceNote: 'Geplanter Verkaufspreis, inkl. MwSt., Stand 08/2026.',
};

export const META = {
  title: 'Planum — die Erinnerung klebt am Topf',
  description:
    'Ein Aufkleber am Blumentopf, ein Tippen mit dem Handy: Planum merkt sich, wann deine Pflanze zuletzt Wasser bekam. Ohne Abo, ohne Zettelwirtschaft.',
  ogAlt: 'Zimmerpflanze in einem Terrakotta-Topf mit einem Planum-Sticker',
};

export const NAV = {
  links: [
    { href: '#so-gehts', label: 'So funktioniert es' },
    { href: '#sticker', label: 'Die Sticker' },
    { href: '#stufen', label: 'Stufen' },
    { href: '#fragen', label: 'Fragen' },
  ],
  cta: 'Benachrichtigen',
};

export const HERO = {
  eyebrow: 'Intelligentes Pflanzen-Tracking',
  headline: 'Die Erinnerung\nklebt am Topf.',
  lead:
    'Ein Aufkleber am Blumentopf. Ein kurzes Tippen mit dem Handy. Ab da weiß deine Pflanze selbst, wann sie zuletzt Wasser bekommen hat — und du auch.',
  formLabel: 'E-Mail-Adresse',
  formPlaceholder: 'du@beispiel.de',
  submit: 'Zum Start benachrichtigen',
  reassurance: 'Eine Mail zum Start. Keine Werbung dazwischen. Jederzeit abbestellbar.',
};

export const STATUS = {
  text: 'Noch nicht erhältlich — die erste Charge entsteht gerade.',
  emphasis: 'Trag dich ein, wir melden uns, sobald es losgeht.',
};

export const INSIGHT = {
  eyebrow: 'Warum noch eine Pflanzen-App',
  headline: 'Pflege-Apps erinnern dich im Büro.\nGegossen wird zu Hause.',
  body: [
    'Jede Pflanzen-App scheitert an derselben Stelle. Sie verlangt, dass du nach dem Gießen das Handy herausholst, die App suchst, die richtige Pflanze antippst und einen Haken setzt. Das hält niemand länger als drei Wochen durch.',
    'Danach stimmen die Daten nicht mehr. Die Erinnerungen werden falsch. Und die App landet im Ordner mit den anderen guten Vorsätzen.',
  ],
  turn:
    'Planum dreht das um: Der Auslöser sitzt dort, wo die Handlung passiert. Am Topf.',
};

export const ECOSYSTEM = {
  headline: 'Erst Sticker.\nDann Sensoren.',
  body:
    'Planum ist keine App, die irgendwann ein Zubehör bekommt, sondern ein System, das mitwächst. Du fängst mit einem Aufkleber an. Wenn du später mehr wissen willst, misst ein Sensor für dich weiter — auf derselben Pflanze, in derselben Historie, ohne dass du von vorn anfängst.',
};

export const WAITLIST = {
  eyebrow: 'Warteliste',
  headline: 'Sei dabei, wenn es losgeht.',
  lead:
    'Wir schreiben dir genau einmal: wenn das Sticker-Set bestellbar ist. Kein Newsletter, keine Zwischenstände.',
  formLabel: 'E-Mail-Adresse',
  formPlaceholder: 'du@beispiel.de',
  submit: 'Eintragen',
  consent:
    'Ich möchte per E-Mail benachrichtigt werden, sobald Planum verfügbar ist. Die Einwilligung kann ich jederzeit widerrufen.',
  // Versionsstempel des Einwilligungstextes. Wird mitgespeichert, damit sich
  // die Einwilligung nach Art. 7 (1) DSGVO im Nachhinein belegen laesst.
  // Bei jeder Textaenderung hochzaehlen.
  consentVersion: '2026-08-20',
  steps: [
    'Du trägst deine E-Mail-Adresse ein.',
    'Du bekommst eine Mail mit einem Bestätigungslink — erst danach speichern wir dich dauerhaft.',
    'Zum Start schreiben wir dir ein einziges Mal. Danach ist Schluss, wenn du willst.',
  ],
  states: {
    pending: 'Wird gesendet …',
    success:
      'Fast geschafft. Wir haben dir eine Bestätigungsmail geschickt — bitte klicke den Link darin.',
    invalid: 'Diese E-Mail-Adresse sieht nicht gültig aus.',
    consentMissing: 'Bitte bestätige die Einwilligung, damit wir dir schreiben dürfen.',
    error:
      'Das hat gerade nicht geklappt. Versuch es bitte gleich noch einmal.',
  },
};

export const FOOTER = {
  claim: 'Planum — intelligentes Pflanzen-Tracking.',
  legal: [
    { href: '/impressum', label: 'Impressum' },
    { href: '/datenschutz', label: 'Datenschutz' },
  ],
  contact: 'felix.ventures.contact@proton.me',
  provider: 'Felix Ventures, Inh. Felix Georg Bredl',
  updated: 'Stand: August 2026',
  // Kein Stockmaterial, also keine Attributionspflicht. Der Hinweis steht
  // trotzdem da: eigene Aufnahmen sind ein Qualitaetsargument, kein Kleingedrucktes.
  credits: 'Produktfotos: eigene Aufnahmen',
};

export const IMPRESSUM = {
  provider: 'Felix Ventures, Inh. Felix Georg Bredl',
  legalForm: 'Einzelunternehmen, nicht im Handelsregister eingetragen',
  address: ['c/o Autorenglück #43669', 'Albert-Einstein-Str. 47', '02977 Hoyerswerda', 'Deutschland'],
  phone: '+49 1511 9784023',
  email: 'felix.ventures.contact@proton.me',
  vatId: 'DE461810782',
  responsible: 'Felix Georg Bredl, Anschrift wie oben',
  supervisoryAuthority:
    'Bayerisches Landesamt für Datenschutzaufsicht (BayLDA), Promenade 18, 91522 Ansbach',
};
