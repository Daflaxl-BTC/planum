import { APP_PROOF } from '../content/steps'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'

// TODO (AP5): In die linke Spalte gehoeren spaeter ECHTE Screenshots aus der
// laufenden App. Bis sie vorliegen steht dort die Ampel-Legende — echte
// Produktlogik statt eines erfundenen Dashboard-Mockups, das genau der
// Rueckfall in den Look waere, der vermieden werden soll.

// Die Punktfarben sind bewusst nicht die Signalfarben aus dem Betriebssystem:
// gedecktes Moos/Terracotta/Rostrot haelt die Ampel in der Seitenpalette.
const TONE_DOT = {
  good: 'bg-moss-500',
  needs: 'bg-terra-300',
  urgent: 'bg-terra-700',
}

export function AppProof() {
  return (
    <Section space="lg" tone="deep">
      <Container grid className="gap-y-12">
        <div className="col-span-4 md:col-span-4 md:col-start-1">
          <Reveal>
            <Eyebrow>{APP_PROOF.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-h2">{APP_PROOF.headline}</h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-8 max-w-measure text-small text-ink/70">
              {APP_PROOF.legend.caption}
            </p>
            <ul className="mt-8">
              {APP_PROOF.legend.states.map((state) => (
                <li
                  key={state.tone}
                  className="grid grid-cols-[10px,1fr] items-baseline gap-x-4 border-t border-ink/10 py-4"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-2 block h-[10px] w-[10px] rounded-full ${TONE_DOT[state.tone]}`}
                  />
                  <div>
                    <p className="text-small">{state.label}</p>
                    <p className="mt-1 text-note text-ink/50">{state.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="col-span-4 md:col-span-7 md:col-start-6">
          {APP_PROOF.items.map((item, index) => (
            <Reveal
              key={item.title}
              delay={index * 60}
              className="border-t border-ink/10 py-8 first:border-t-0 first:pt-0"
            >
              <h3 className="text-h3">{item.title}</h3>
              <p className="mt-3 max-w-measure text-body text-ink/70">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}
