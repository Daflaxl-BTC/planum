import { STATUS } from '../content/site'
import { Container } from '../components/layout/Container'

// Schmales Band statt Banner. Die Ehrlichkeit ("noch nicht erhaeltlich") ist
// hier der Conversion-Treiber, nicht die Bremse: sie erklaert, warum es nur
// ein E-Mail-Feld gibt und keinen Kaufen-Knopf.
export function StatusBar() {
  return (
    <div className="border-y border-ink/10 bg-paper-deep py-4">
      <Container className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-small">
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-terra-500"
        />
        <span className="text-ink/70">{STATUS.text}</span>
        <span className="text-ink">{STATUS.emphasis}</span>
      </Container>
    </div>
  )
}
