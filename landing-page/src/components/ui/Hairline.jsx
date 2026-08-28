// 1-px-Trennlinie statt Karten-Schatten.
export function Hairline({ className = '' }) {
  return <hr className={`border-0 border-t border-ink/10 ${className}`} />
}
