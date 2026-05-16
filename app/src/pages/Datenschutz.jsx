import LegalLayout from '../components/LegalLayout.jsx'

export default function Datenschutz() {
  return (
    <LegalLayout title="Datenschutzerklärung" lastUpdated="16.05.2026">
      <section>
        <h2>1. Verantwortlicher</h2>
        <p>
          Verantwortlich für die Datenverarbeitung im Sinne der DSGVO ist:
        </p>
        <p>
          Felix Bredl, Einzelunternehmen (Planum)<br />
          Scharnhorststr. 46<br />
          80992 München<br />
          Deutschland<br />
          Telefon: +49 151 19784023<br />
          E-Mail: <a href="mailto:datenschutz@planum.de">datenschutz@planum.de</a>
        </p>
      </section>

      <section>
        <h2>2. Erhobene Daten</h2>
        <p>Wir verarbeiten folgende personenbezogene Daten:</p>
        <ul>
          <li>Account-Daten (E-Mail-Adresse, User-ID) zur Authentifizierung</li>
          <li>Pflanzen- und Pflegedaten (Pflanzenart, Pflege-Logs, Termine) zur Bereitstellung des Dienstes</li>
          <li>QR-Code-Slot-Zuordnungen und Haushalts-Zugehörigkeit</li>
          <li>Pflanzen-Fotos für die KI-Identifikation</li>
          <li>Server-Logs (IP-Adresse, Zeitstempel, User-Agent) zur Missbrauchs­prävention</li>
        </ul>
      </section>

      <section>
        <h2>3. Hosting & Auftragsverarbeiter</h2>
        <ul>
          <li><strong>Supabase</strong> (EU-Region, Frankfurt): Authentifizierung, Datenbank, Dateispeicher</li>
          <li><strong>Vercel Inc.</strong> (USA, DPF-zertifiziert): Hosting von Landing-Page und Web-App</li>
          <li><strong>Plant.id / Kindwise</strong>: KI-Bilderkennung von Pflanzenfotos</li>
        </ul>
        <p>
          Mit allen Auftragsverarbeitern bestehen Verträge gemäß Art. 28 DSGVO.
          Bilder werden zur Identifikation an Plant.id übertragen und dort gemäß
          deren Datenschutzbestimmungen verarbeitet.
        </p>
      </section>

      <section>
        <h2>4. Rechtsgrundlagen</h2>
        <ul>
          <li>Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung (Account, App-Funktionen)</li>
          <li>Art. 6 Abs. 1 lit. a DSGVO – Einwilligung (E-Mail-Benachrichtigungen)</li>
          <li>Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse (Betriebsstabilität, Missbrauchsprävention)</li>
        </ul>
      </section>

      <section>
        <h2>5. Speicherdauer</h2>
        <ul>
          <li>Account- und Pflanzendaten: bis zur Löschung des Accounts</li>
          <li>Server-Logs: maximal 30 Tage</li>
          <li>Inaktive Accounts ohne Pflanzen: maximal 24 Monate</li>
        </ul>
        <p>
          Auf Anfrage löschen wir personenbezogene Daten unverzüglich, soweit keine
          gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
      </section>

      <section>
        <h2>6. Deine Rechte</h2>
        <ul>
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
          <li>Widerspruch (Art. 21 DSGVO)</li>
          <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77 DSGVO)</li>
        </ul>
        <p>Anfragen richte bitte an <a href="mailto:datenschutz@planum.de">datenschutz@planum.de</a>.</p>
      </section>

      <section>
        <h2>7. Zuständige Aufsichtsbehörde</h2>
        <p>
          Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)<br />
          Promenade 18, 91522 Ansbach<br />
          Telefon: +49 981 53 1300<br />
          E-Mail: <a href="mailto:poststelle@lda.bayern.de">poststelle@lda.bayern.de</a>
        </p>
      </section>
    </LegalLayout>
  )
}
