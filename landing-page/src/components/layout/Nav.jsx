import { useEffect, useState } from 'react'
import { NAV } from '../../content/site'
import { Container } from './Container'
import { Wordmark } from './Wordmark'

// Kein backdrop-blur: der Balken ist bis zum ersten Scroll transparent und
// bekommt danach eine deckende Flaeche mit Hairline. Kein "Jetzt kaufen" —
// es gibt nichts zu kaufen (§ 5 UWG).
export function Nav() {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 ${
        stuck ? 'border-b border-ink/10 bg-paper' : 'border-b border-transparent'
      }`}
    >
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-50 focus:rounded-sm focus:bg-moss-600 focus:px-4 focus:py-2 focus:text-small focus:text-paper"
      >
        Zum Inhalt springen
      </a>

      <Container className="flex h-16 items-center justify-between gap-6 sm:h-[4.5rem]">
        <a href="/" aria-label="Planum — Startseite">
          <Wordmark />
        </a>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 lg:flex">
          {NAV.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-small text-ink/70 transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#warteliste" className="btn-primary px-5 py-2.5">
          {NAV.cta}
        </a>
      </Container>
    </header>
  )
}
