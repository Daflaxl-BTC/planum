import { PRO } from '../content/pro'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import {
  IconConductivity,
  IconDrop,
  IconHumidity,
  IconSun,
  IconThermometer,
} from '../components/icons'

// Abgesetzte dunkle Sektion: der Ausblick soll sichtbar NICHT Teil des
// aktuellen Angebots sein. Kein Preis, keine Jahreszahl.
// Leitfaehigkeit steht ausdruecklich als Duenge-Indikator — eine NPK- oder
// Naehrstoffmessung waere eine unhaltbare Behauptung.
const ICONS = [IconDrop, IconThermometer, IconSun, IconHumidity, IconConductivity]

export function ProOutlook() {
  return (
    <Section space="lg" tone="dark">
      <Container grid className="gap-y-14">
        <div className="col-span-4 md:col-span-5 md:col-start-1">
          <Reveal>
            <p className="flex items-center gap-3 text-micro font-medium uppercase text-paper/50">
              <span aria-hidden="true" className="h-px w-6 bg-terra-300" />
              {PRO.eyebrow}
            </p>
            <h2 className="mt-6 text-h2 text-paper">{PRO.headline}</h2>
            <p className="mt-6 max-w-measure text-body text-paper/70">{PRO.lead}</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 border-t border-paper/15 pt-8">
              <h3 className="font-display text-h3 text-paper">{PRO.promise.title}</h3>
              <p className="mt-3 max-w-measure text-body text-paper/70">
                {PRO.promise.body}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="col-span-4 md:col-span-6 md:col-start-7">
          <ul>
            {PRO.measures.map((measure, index) => {
              const Icon = ICONS[index] ?? IconDrop
              return (
                <Reveal
                  as="li"
                  key={measure.label}
                  delay={index * 45}
                  className="flex items-start gap-5 border-t border-paper/15 py-5 first:border-t-0 first:pt-0"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-terra-300" />
                  <div>
                    <p className="text-body text-paper">{measure.label}</p>
                    <p className="mt-1 text-small text-paper/60">{measure.note}</p>
                  </div>
                </Reveal>
              )
            })}
          </ul>

          <Reveal delay={240}>
            <p className="mt-10 border-l-2 border-terra-300 pl-6 text-small text-paper/60">
              {PRO.status}
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  )
}
