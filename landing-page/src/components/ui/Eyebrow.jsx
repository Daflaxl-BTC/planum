// Kleine Vorzeile in Versalien mit Terracotta-Punkt.
export function Eyebrow({ children, tone = 'light', className = '' }) {
  const text = tone === 'dark' ? 'text-paper/55' : 'text-ink/55'
  return (
    <p className={`flex items-center gap-2.5 text-micro font-semibold uppercase ${text} ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-terra-500" />
      {children}
    </p>
  )
}
