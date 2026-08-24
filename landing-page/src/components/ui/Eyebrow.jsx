// Kleine Vorzeile. Bewusst KEINE Badge-Pill mit Hintergrund — ein kurzer
// Strich plus Versalien reicht und ist das unauffaelligere Signal.
export function Eyebrow({ children, className = '' }) {
  return (
    <p className={`flex items-center gap-3 text-micro font-medium uppercase text-ink/50 ${className}`}>
      <span aria-hidden="true" className="h-px w-6 bg-terra-700" />
      {children}
    </p>
  )
}
