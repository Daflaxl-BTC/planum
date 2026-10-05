import { BENTO } from '../content/landing'
import { APP_PROOF } from '../content/steps'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { IconCheck, IconDrop, IconFilm, IconGlobe, IconShield, IconSpark } from '../components/icons'

// Funktionsuebersicht als Bento-Raster. Die kleinen Oberflaechen sind
// schematisch und als solche gekennzeichnet — die Ampel-Schwellen entsprechen
// der echten Logik (app/src/lib/careLogic.js, siehe APP_PROOF in steps.js).

const TONE = {
  good: { dot: 'bg-moss-500', text: 'text-moss-700', ring: 'ring-moss-500/25', bg: 'bg-moss-50' },
  needs: { dot: 'bg-[#E0A458]', text: 'text-[#8A5A1C]', ring: 'ring-[#E0A458]/30', bg: 'bg-[#FBF1E3]' },
  urgent: { dot: 'bg-terra-700', text: 'text-terra-700', ring: 'ring-terra-700/25', bg: 'bg-terra-100' },
}

export function Bento() {
  const { cards } = BENTO
  // Titel und Texte der drei grossen Karten kommen aus APP_PROOF (steps.js).
  const [ampel, timelapse, species] = APP_PROOF.items
  return (
    <Section id="in-der-app" space="lg" tone="deep">
      <Container>
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <Eyebrow>{BENTO.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-h2">{BENTO.headline}</h2>
          </Reveal>
          <Reveal delay={60} className="md:col-span-5">
            <p className="text-body text-ink/65">{BENTO.lead}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-6 md:gap-5">
          {/* Ampel — die grosse Karte */}
          <Reveal className="card-light flex flex-col overflow-hidden md:col-span-4 md:row-span-2">
            <div className="p-7 sm:p-9">
              <h3 className="text-h3">{ampel.title}</h3>
              <p className="mt-2 max-w-measure-tight text-small text-ink/60">{ampel.body}</p>
            </div>
            <div className="relative mt-auto px-5 pb-5 sm:px-9 sm:pb-9">
              <div className="rounded-lg bg-paper p-3 ring-1 ring-inset ring-ink/[0.06] sm:p-4">
                <div className="flex items-center justify-between px-2 pb-3 pt-1">
                  <p className="text-note font-semibold">Deine Pflanzen</p>
                  <p className="text-note text-ink/40">3 von 10</p>
                </div>
                <ul className="space-y-2">
                  {BENTO.plants.map((plant) => {
                    const t = TONE[plant.tone]
                    return (
                      <li
                        key={plant.name}
                        className="flex items-center gap-4 rounded-md bg-white px-4 py-3 ring-1 ring-inset ring-ink/[0.06]"
                      >
                        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${t.bg}`}>
                          <span className={`h-2.5 w-2.5 rounded-full ${t.dot}`} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-small font-semibold">{plant.name}</p>
                          <p className="truncate text-note text-ink/45">{plant.place}</p>
                        </div>
                        <span className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-note font-medium ring-1 ring-inset ${t.ring} ${t.text}`}>
                          <span className="hidden sm:inline">Gießen </span>
                          {plant.due}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {APP_PROOF.legend.states.map((state) => (
                  <li key={state.tone} className="flex items-start gap-2.5">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TONE[state.tone].dot}`} />
                    <div>
                      <p className="text-note font-semibold">{state.label}</p>
                      <p className="text-note text-ink/50">{state.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Zeitraffer */}
          <Reveal delay={60} className="card-light overflow-hidden p-7 md:col-span-2">
            <Badge icon={IconFilm}>{cards.timelapse.badge}</Badge>
            <h3 className="mt-5 text-h3">{timelapse.title}</h3>
            <p className="mt-2 text-small text-ink/60">{timelapse.body}</p>
            <Filmstrip />
          </Reveal>

          {/* Artenbestimmung */}
          <Reveal delay={120} className="card-light overflow-hidden p-7 md:col-span-2">
            <Badge icon={IconSpark}>{cards.species.badge}</Badge>
            <h3 className="mt-5 text-h3">{species.title}</h3>
            <p className="mt-2 text-small text-ink/60">{species.body}</p>
            <ScanFrame />
          </Reveal>

          <SmallCard icon={IconDrop} delay={0} {...cards.tap}>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-moss-50 px-3 py-1.5 text-note font-medium text-moss-700 ring-1 ring-inset ring-moss-500/20">
              <IconCheck className="h-3.5 w-3.5" /> Gegossen · gerade eben
            </div>
          </SmallCard>
          <SmallCard icon={IconGlobe} delay={60} {...cards.web} />
          <SmallCard icon={IconShield} delay={120} {...cards.privacy} />
        </div>

        <p className="mt-6 text-note text-ink/45">{BENTO.note}</p>
      </Container>
    </Section>
  )
}

function Badge({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-terra-100 px-2.5 py-1 text-note font-medium text-terra-700">
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  )
}

function SmallCard({ icon: Icon, title, body, delay, children }) {
  return (
    <Reveal delay={delay} className="card-light p-7 md:col-span-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-night text-terra-300">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-5 text-h3">{title}</h3>
      <p className="mt-2 text-small text-ink/60">{body}</p>
      {children}
    </Reveal>
  )
}

// Fuenf Bilder eines Verlaufs: dieselbe Pflanze, Blatt fuer Blatt groesser.
function Filmstrip() {
  const frames = [0.55, 0.68, 0.8, 0.9, 1]
  return (
    <div aria-hidden="true" className="mt-6 flex gap-1.5">
      {frames.map((scale, index) => (
        <div
          key={scale}
          className="relative flex aspect-[3/4] flex-1 items-end justify-center overflow-hidden rounded-sm bg-gradient-to-b from-[#EFE7D8] to-[#E3D7C2]"
        >
          <svg viewBox="0 0 40 56" className="w-full" style={{ transform: `scale(${scale})`, transformOrigin: 'bottom' }}>
            <path d="M14 56h12l2-10H12z" fill="#C97B52" />
            <path d="M20 46V24" stroke="#386538" strokeWidth="1.6" fill="none" />
            <path d="M20 34c-6-1-9-5-9-10 6 1 9 5 9 10Z" fill="#4a7f4a" />
            <path d="M20 28c0-6 4-10 10-11 1 6-3 10-10 11Z" fill="#6b9b6b" />
            {index > 1 && <path d="M20 22c-4-1-6-4-6-8 4 1 6 4 6 8Z" fill="#4a7f4a" />}
          </svg>
          <span className="absolute left-1 top-1 text-[0.55rem] font-semibold text-ink/35">{index + 1}</span>
        </div>
      ))}
    </div>
  )
}

function ScanFrame() {
  return (
    <div aria-hidden="true" className="relative mt-6 flex h-28 items-center justify-center rounded-md bg-night">
      <div className="absolute inset-4">
        {['left-0 top-0 border-l border-t', 'right-0 top-0 border-r border-t', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map(
          (corner) => (
            <span key={corner} className={`absolute h-4 w-4 border-terra-300 ${corner}`} />
          ),
        )}
      </div>
      <svg viewBox="0 0 48 48" className="h-14 w-14" fill="none" stroke="#9FDCB4" strokeWidth="1.4" strokeLinecap="round">
        <path d="M24 44V20" />
        <path d="M24 26c0-8 5-14 14-16 1 9-4 15-14 16Z" />
        <path d="M24 33c-8-1-12-6-12-13 8 1 12 6 12 13Z" />
      </svg>
      <span className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-transparent via-mint/70 to-transparent" />
    </div>
  )
}
