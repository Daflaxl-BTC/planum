import { SITE } from '../content/site'
import { TIERS } from '../content/tiers'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { IconCheck } from '../components/icons'

// Zwei Stufen, keine drei — Pro steht bewusst nicht hier, sondern als
// Ausblick ohne Preis im Fahrplan darunter.
// Der CTA fuehrt zur Warteliste, nicht in einen Kauf: es gibt nichts zu kaufen,
// und ein Kaufen-Knopf waere irrefuehrend (§ 5 UWG).

function featureClass(feature, featured) {
  if (featured) {
    if (feature.muted) return 'text-paper/40'
    return feature.strong ? 'font-semibold text-paper' : 'text-paper/75'
  }
  if (feature.muted) return 'text-ink/45'
  return feature.strong ? 'font-semibold text-ink' : 'text-ink/70'
}

function checkClass(feature, featured) {
  if (feature.muted) return featured ? 'bg-white/5 text-paper/30' : 'bg-ink/5 text-ink/30'
  return featured ? 'bg-terra-500/20 text-terra-300' : 'bg-moss-50 text-moss-600'
}

export function Tiers() {
  return (
    <Section id="stufen" space="lg" tone="paper">
      <Container>
        <Reveal className="mx-auto max-w-[44rem] text-center">
          <Eyebrow className="justify-center">{TIERS.eyebrow}</Eyebrow>
          <h2 className="mt-6 whitespace-pre-line text-h2">{TIERS.headline}</h2>
          <p className="mx-auto mt-6 max-w-measure text-body text-ink/60">{TIERS.lead}</p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-[60rem] gap-5 md:grid-cols-2">
          {TIERS.items.map((tier, index) => {
            const featured = tier.featured
            return (
              <Reveal
                key={tier.id}
                delay={index * 60}
                className={`relative flex flex-col overflow-hidden rounded-xl p-8 sm:p-10 ${
                  featured ? 'bg-night text-paper shadow-glow' : 'card-light'
                }`}
              >
                {featured && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full"
                    style={{ background: 'radial-gradient(closest-side, rgba(201,123,82,0.35), rgba(201,123,82,0))' }}
                  />
                )}

                <div className="relative flex items-center justify-between gap-4">
                  <h3 className="text-h3">{tier.name}</h3>
                  {tier.badge && (
                    <span className="rounded-full bg-terra-500/15 px-3 py-1 text-note font-medium text-terra-300 ring-1 ring-inset ring-terra-300/30">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <p className="relative mt-6 font-display text-[3rem] font-semibold leading-none tracking-[-0.04em] tabular-nums">
                  {tier.price}
                </p>
                <p className={`relative mt-2 text-note ${featured ? 'text-paper/50' : 'text-ink/45'}`}>
                  {tier.priceNote}
                </p>

                <p className={`relative mt-6 text-small ${featured ? 'text-paper/70' : 'text-ink/65'}`}>
                  {tier.summary}
                </p>

                <ul
                  className={`relative mt-8 flex-1 space-y-3 border-t pt-8 ${
                    featured ? 'border-white/10' : 'border-ink/[0.08]'
                  }`}
                >
                  {tier.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3 text-small">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${checkClass(feature, featured)}`}
                      >
                        <IconCheck className="h-3 w-3" />
                      </span>
                      <span className={featureClass(feature, featured)}>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#warteliste"
                  className={
                    featured
                      ? 'btn-primary relative mt-10'
                      : 'btn-ghost mt-10 text-ink ring-ink/15 hover:bg-ink/[0.04]'
                  }
                >
                  {tier.cta}
                </a>
              </Reveal>
            )
          })}
        </div>

        {/* Preisangabe klar als geplant gekennzeichnet — es liegt kein Angebot vor. */}
        <p className="mt-8 text-center text-note text-ink/45">{SITE.priceNote}</p>
      </Container>
    </Section>
  )
}
