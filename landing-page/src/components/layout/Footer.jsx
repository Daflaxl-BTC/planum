import { FOOTER, SITE } from '../../content/site'
import { Container } from './Container'
import { Wordmark } from './Wordmark'

// Bewusst keine Verlinkung auf /app/ — die laufende App wird auf dieser Seite
// nicht beworben, solange nichts bestellbar ist.
export function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-paper-deep py-16">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-measure-tight">
            <Wordmark />
            <p className="mt-4 text-small text-ink/70">{FOOTER.claim}</p>
          </div>

          <div className="flex flex-col gap-3 text-small">
            <p className="text-micro uppercase text-ink/50">Rechtliches</p>
            {FOOTER.legal.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-ink/70 transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-small">
            <p className="text-micro uppercase text-ink/50">Kontakt</p>
            <a
              href={`mailto:${FOOTER.contact}`}
              className="text-ink/70 transition-colors hover:text-ink"
            >
              {FOOTER.contact}
            </a>
            <p className="text-ink/70">{FOOTER.provider}</p>
            <p className="text-note text-ink/50">{FOOTER.credits}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ink/10 pt-6 text-micro uppercase text-ink/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {SITE.name} — {SITE.tagline}
          </p>
          <p>{FOOTER.updated}</p>
        </div>
      </Container>
    </footer>
  )
}
