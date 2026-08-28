// Danke-Seite: kein React, nur ein Textwechsel je nach ?fehler=-Parameter.
// Die Function waitlist-confirm leitet mit diesem Parameter hierher.
import '../index.css'

const MESSAGES = {
  link: {
    title: 'Dieser Link stimmt nicht.',
    text: 'Möglicherweise wurde er beim Kopieren abgeschnitten. Trag dich einfach noch einmal ein — dann schicken wir dir einen frischen Link.',
  },
  abgelaufen: {
    title: 'Der Link ist abgelaufen.',
    text: 'Bestätigungslinks gelten 48 Stunden. Trag dich noch einmal ein, dann bekommst du einen neuen.',
  },
  server: {
    title: 'Das hat gerade nicht geklappt.',
    text: 'Bei uns ist etwas schiefgegangen. Versuch den Link später noch einmal — er bleibt gültig.',
  },
}

const fehler = new URLSearchParams(window.location.search).get('fehler')
const message = fehler ? MESSAGES[fehler] : null

if (message) {
  document.getElementById('danke-titel').textContent = message.title
  document.getElementById('danke-text').textContent = message.text
}
