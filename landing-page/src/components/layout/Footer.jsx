import { FOOTER, NAV, SITE } from '../../content/site'
import { Container } from './Container'
import { Wordmark } from './Wordmark'

// Bewusst keine Verlinkung auf /app/ — die laufende App wird auf dieser Seite
// nicht beworben, solange nichts bestellbar ist.
export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night pb-10 pt-20 text-paper">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Wordmark tone="paper" />
            <p className="mt-5 max-w-measure-tight text-small text-paper/55">{FOOTER.claim}</p>
          </div>

          <div className="flex flex-col gap-3 text-small md:col-span-2 md:col-start-6">
            <p className="text-micro uppercase text-paper/40">Seite</p>
            {NAV.links.map((link) => (
              <a key={link.href} href={link.href} className="text-paper/65 transition-colors hover:text-paper">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-small md:col-span-2">
            <p className="text-micro uppercase text-paper/40">Rechtliches</p>
            {FOOTER.legal.map((item) => (
              <a key={item.href} href={item.href} className="text-paper/65 transition-colors hover:text-paper">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-small md:col-span-3">
            <p className="text-micro uppercase text-paper/40">Kontakt</p>
            <a
              href={`mailto:${FOOTER.contact}`}
              className="break-all text-paper/65 transition-colors hover:text-paper"
            >
              {FOOTER.contact}
            </a>
            <p className="text-paper/65">{FOOTER.provider}</p>
          </div>
        </div>

        {/* Riesige Wortmarke als Abschluss, angeschnitten. */}
        <p
          aria-hidden="true"
          className="pointer-events-none mt-20 select-none text-center font-display text-[22vw] font-semibold leading-[0.75] tracking-[-0.06em] text-white/[0.035]"
        >
          Planum
        </p>

        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 text-note text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {SITE.name} — {SITE.tagline}
          </p>
          <p>{FOOTER.updated}</p>
        </div>
      </Container>
    </footer>
  )
}
