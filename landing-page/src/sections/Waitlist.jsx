import { WAITLIST } from '../content/site'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Reveal } from '../components/ui/Reveal'
import { WaitlistForm } from '../components/WaitlistForm'

// Haupt-CTA als eigene Sektion. "Was danach passiert" steht bewusst daneben:
// die Unsicherheit "Was macht ihr mit meiner Adresse" ist der haeufigste Grund,
// ein Wartelisten-Formular abzubrechen.
export function Waitlist() {
  return (
    <Section id="warteliste" space="lg" tone="dark">
      <Container grid className="gap-y-14">
        <div className="col-span-4 md:col-span-6 md:col-start-1">
          <Reveal>
            <p className="flex items-center gap-3 text-micro font-medium uppercase text-paper/50">
              <span aria-hidden="true" className="h-px w-6 bg-terra-300" />
              {WAITLIST.eyebrow}
            </p>
            <h2 className="mt-6 text-h2 text-paper">{WAITLIST.headline}</h2>
            <p className="mt-6 max-w-measure text-body text-paper/70">{WAITLIST.lead}</p>
          </Reveal>

          <Reveal delay={120}>
            {/* Dunkle Sektion: Feld- und Hinweisfarben invertieren. */}
            <div className="mt-9 max-w-[34rem] [&_a]:text-paper [&_input[type=email]]:border-paper/25 [&_input[type=email]]:bg-paper/5 [&_input[type=email]]:text-paper [&_input[type=email]]:placeholder:text-paper/40 [&_label]:text-paper/70 [&_p]:text-paper/70">
              <WaitlistForm variant="full" />
            </div>
          </Reveal>
        </div>

        <div className="col-span-4 md:col-span-5 md:col-start-8">
          <Reveal delay={180}>
            <p className="text-micro uppercase text-paper/50">Was danach passiert</p>
            <ol className="mt-6">
              {WAITLIST.steps.map((step, index) => (
                <li
                  key={step.slice(0, 24)}
                  className="flex gap-5 border-t border-paper/15 py-5 first:border-t-0 first:pt-0"
                >
                  <span className="font-display tabular-nums text-terra-300">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-small text-paper/70">{step}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
