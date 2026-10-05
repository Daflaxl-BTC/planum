import { useEffect, useState } from 'react'
import { NAV } from '../../content/site'
import { Wordmark } from './Wordmark'

// Schwebende Navigationsleiste als dunkle Glas-Pille. Sie bleibt in jeder
// Sektion gleich — ueber dem dunklen Hero und ueber hellem Lesetext — statt
// beim Scrollen die Farbe zu wechseln. Kein "Jetzt kaufen": es gibt nichts zu
// kaufen (§ 5 UWG), der CTA fuehrt zur Warteliste.
export function Nav() {
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <a
        href="#inhalt"
        className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-50 focus:rounded-full focus:bg-terra-500 focus:px-4 focus:py-2 focus:text-small focus:text-white"
      >
        Zum Inhalt springen
      </a>

      <div
        className={`pointer-events-auto mx-auto flex h-14 max-w-[64rem] items-center justify-between gap-6 rounded-full pl-5 pr-2 ring-1 ring-inset transition-all duration-300 ${
          stuck
            ? 'bg-night/80 ring-white/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,.5)] backdrop-blur-xl'
            : 'bg-night/30 ring-white/[0.06] backdrop-blur-md'
        }`}
      >
        <a href="/" aria-label="Planum — Startseite">
          <Wordmark tone="paper" />
        </a>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-1 md:flex">
          {NAV.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-small text-paper/65 transition-colors hover:bg-white/[0.06] hover:text-paper"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#warteliste" className="btn-primary px-5 py-2.5">
          {NAV.cta}
        </a>
      </div>
    </header>
  )
}
