import { ECOSYSTEM } from '../content/site'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Reveal } from '../components/ui/Reveal'

// Ein Gedanke in grosser Type. Kein Fremdmarkenname, kein Wettbewerbsvergleich —
// das Prinzip "Basis zuerst, Erweiterung spaeter" traegt sich selbst.
export function Ecosystem() {
  return (
    <Section space="md">
      <Container grid>
        <div className="col-span-4 md:col-span-10 md:col-start-2">
          <Reveal>
            <h2 className="whitespace-pre-line text-display-lg">{ECOSYSTEM.headline}</h2>
          </Reveal>
          <Reveal delay={60}>
            <p className="mt-8 max-w-measure text-lead text-ink/70">{ECOSYSTEM.body}</p>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
