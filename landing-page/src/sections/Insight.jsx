import { INSIGHT } from '../content/site'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'

// Rahmt das Produkt ueber das Problem, statt Funktionen aufzuzaehlen.
// Der Schlusssatz steht abgesetzt und traegt die eigentliche These.
export function Insight() {
  return (
    <Section space="lg">
      <Container grid className="gap-y-10">
        <div className="col-span-4 md:col-span-5 md:col-start-1">
          <Reveal>
            <Eyebrow>{INSIGHT.eyebrow}</Eyebrow>
            <h2 className="mt-6 whitespace-pre-line text-h2">{INSIGHT.headline}</h2>
          </Reveal>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          {INSIGHT.body.map((paragraph, index) => (
            // Der Abstand haengt am Wrapper, nicht am <p>: jedes <p> ist erstes
            // Kind seines Reveal-Divs, ein :not(:first-child) griffe nie.
            <Reveal key={paragraph.slice(0, 24)} delay={index * 60} className={index > 0 ? 'mt-5' : ''}>
              <p className="max-w-measure text-body text-ink/70">{paragraph}</p>
            </Reveal>
          ))}

          <Reveal delay={180}>
            <p className="mt-10 border-l-2 border-terra-700 pl-6 font-display text-h3 text-ink">
              {INSIGHT.turn}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
