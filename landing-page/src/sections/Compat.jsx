import { COMPAT } from '../content/landing'

// Laufband mit Kompatibilitaetsangaben — an der Stelle, an der Startups ihre
// Kundenlogos zeigen. Hier stehen Fakten statt Logos: es gibt noch keine
// Kunden, und erfundene Social Proof ist verboten (claims-guard.md).
export function Compat() {
  const items = [...COMPAT.items, ...COMPAT.items]
  return (
    <div className="relative border-y border-white/[0.07] bg-night py-6 text-paper">
      <p className="sr-only">
        {COMPAT.label}: {COMPAT.items.join(', ')}
      </p>
      <div aria-hidden="true" className="flex items-center gap-8 overflow-hidden">
        <p className="shrink-0 pl-6 text-micro font-semibold uppercase text-paper/40 sm:pl-12">
          {COMPAT.label}
        </p>
        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
          <ul className="flex w-max animate-marquee gap-12 motion-reduce:animate-none">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="flex shrink-0 items-center gap-12 text-small text-paper/70">
                {item}
                <span className="h-1 w-1 rounded-full bg-terra-500/70" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
