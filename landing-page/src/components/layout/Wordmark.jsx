// Wortmarke: Blattform aus dem Favicon plus Fraunces-Schriftzug.
// Kein Logo-Bild — als Inline-SVG skaliert es scharf und kostet keinen Request.
export function Wordmark({ className = '', tone = 'ink' }) {
  const text = tone === 'paper' ? 'text-paper' : 'text-ink'
  const leaf = tone === 'paper' ? '#98bc98' : '#386538'

  return (
    <span className={`inline-flex items-center gap-2.5 ${text} ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 24"
        className="h-5 w-auto"
        fill="none"
        stroke={leaf}
        strokeWidth="1.4"
        strokeLinecap="round"
      >
        <path d="M10 23V9" />
        <path d="M10 12C10 7 13 3 18 2c.6 5-2 9-8 10Z" />
        <path d="M10 16c-4-.6-6-3.6-6-7.6 4 .6 6 3.6 6 7.6Z" />
      </svg>
      <span className="font-display text-[1.35rem] leading-none tracking-tight">
        Planum
      </span>
    </span>
  )
}
