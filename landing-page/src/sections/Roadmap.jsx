import { PRO } from '../content/pro'
import { ROADMAP } from '../content/landing'
import { ECOSYSTEM } from '../content/site'
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

// Fahrplan in drei Stufen und der Pro-Ausblick. KEIN Preis, KEINE Jahreszahl
// (Festlegung 19.08.2026). Leitfaehigkeit steht ausdruecklich als
// Duenge-Indikator — eine NPK-Messung waere eine unhaltbare Behauptung.

const ICONS = [IconDrop, IconThermometer, IconSun, IconHumidity, IconConductivity]

const STATE_STYLE = {
  planned: 'bg-white/[0.06] text-paper/70 ring-white/15',
  production: 'bg-terra-500/15 text-terra-300 ring-terra-300/30',
  dev: 'bg-mint/10 text-mint ring-mint/25',
}

export function Roadmap() {
  return (
    <Section id="pro" space="lg" tone="dark" className="overflow-hidden">
      <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-6">
            <Eyebrow tone="dark">{ROADMAP.eyebrow}</Eyebrow>
            <h2 className="mt-6 whitespace-pre-line text-display-lg">{ECOSYSTEM.headline}</h2>
          </Reveal>
          <Reveal delay={60} className="md:col-span-5 md:col-start-8">
            <p className="text-body text-paper/60">{ECOSYSTEM.body}</p>
          </Reveal>
        </div>

        <ol className="relative mt-16 grid gap-4 md:grid-cols-3">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-[2.15rem] hidden h-px bg-gradient-to-r from-white/5 via-terra-300/40 to-mint/30 md:block"
          />
          {ROADMAP.stages.map((stage, index) => (
            <Reveal as="li" key={stage.name} delay={index * 60} className="card-dark relative p-6">
              <div className="flex items-center justify-between">
                <span className="text-note text-paper/45">{stage.tag}</span>
                <span className={`rounded-full px-2.5 py-1 text-note font-medium ring-1 ring-inset ${STATE_STYLE[stage.state]}`}>
                  {ROADMAP.stateLabel[stage.state]}
                </span>
              </div>
              <h3 className="mt-6 text-h3">{stage.name}</h3>
              <p className="mt-2 text-small text-paper/55">{stage.body}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={60} className="card-dark relative mt-5 overflow-hidden p-7 sm:p-10">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(159,220,180,0.14), rgba(159,220,180,0))' }}
          />
          <div className="relative grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <span className="rounded-full bg-mint/10 px-2.5 py-1 text-note font-medium text-mint ring-1 ring-inset ring-mint/25">
                {PRO.eyebrow}
              </span>
              <h3 className="mt-5 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.03em]">
                {PRO.headline}
              </h3>
              <p className="mt-4 text-small text-paper/60">{PRO.lead}</p>
            </div>

            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:col-span-7">
              {PRO.measures.map((measure, index) => {
                const Icon = ICONS[index] ?? IconDrop
                return (
                  <li
                    key={measure.label}
                    className={`rounded-lg bg-white/[0.03] p-4 ring-1 ring-inset ring-white/[0.07] ${
                      index === PRO.measures.length - 1 ? 'col-span-2 sm:col-span-2' : ''
                    }`}
                  >
                    <Icon className="h-5 w-5 text-mint" />
                    <p className="mt-3 text-small font-semibold">{measure.label}</p>
                    <p className="mt-1 text-note text-paper/45">{measure.note}</p>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="relative mt-10 grid gap-6 border-t border-white/10 pt-8 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="text-h3 font-semibold text-glow">{PRO.promise.title}</p>
            </div>
            <div className="md:col-span-7">
              <p className="text-small text-paper/60">{PRO.promise.body}</p>
              <p className="mt-4 text-note text-paper/40">{PRO.status}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  )
}
