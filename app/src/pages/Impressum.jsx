import LegalLayout from '../components/LegalLayout.jsx'

export default function Impressum() {
  return (
    <LegalLayout title="Impressum" lastUpdated="16.05.2026">
      <section>
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          Felix Bredl, Einzelunternehmen (Planum)<br />
          Scharnhorststr. 46<br />
          80992 München<br />
          Deutschland
        </p>
      </section>

      <section>
        <h2>Kontakt</h2>
        <p>
          Telefon: +49 151 19784023<br />
          E-Mail: <a href="mailto:hello@planum.de">hello@planum.de</a>
        </p>
      </section>

      <section>
        <h2>Umsatzsteuer-ID</h2>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          DE461810782
        </p>
      </section>

      <section>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>
          Felix Bredl<br />
          Scharnhorststr. 46<br />
          80992 München<br />
          Deutschland
        </p>
      </section>

      <section>
        <h2>Verantwortliche Person in der EU (GPSR)</h2>
        <p>
          Felix Bredl, Einzelunternehmen<br />
          Scharnhorststr. 46, 80992 München, Deutschland<br />
          E-Mail: <a href="mailto:hello@planum.de">hello@planum.de</a>
        </p>
      </section>

      <section>
        <h2>Streitbeilegung</h2>
        <p>
          Die Europäische Kommission stellt eine Plattform zur Online-Streit­beilegung
          (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a>.
        </p>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungs­verfahren vor
          einer Verbraucher­schlichtungs­stelle teilzunehmen.
        </p>
      </section>
    </LegalLayout>
  )
}
