import { SITE } from '../content/site'
import { TIERS } from '../content/tiers'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { IconCheck } from '../components/icons'

// Zwei Spalten, keine drei — Pro steht bewusst nicht hier, sondern als
// Ausblick ohne Preis in der naechsten Sektion.
// Der CTA fuehrt zur Warteliste, nicht in einen Kauf: es gibt nichts zu kaufen,
// und ein Kaufen-Knopf waere irrefuehrend (§ 5 UWG).
export function Tiers() {
  return (
    <Section id="stufen" space="lg">
      <Container>
        <Reveal className="max-w-measure">
          <Eyebrow>{TIERS.eyebrow}</Eyebrow>
          <h2 className="mt-6 whitespace-pre-line text-h2">{TIERS.headline}</h2>
          <p className="mt-6 text-body text-ink/70">{TIERS.lead}</p>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2 md:gap-10">
          {TIERS.items.map((tier, index) => (
            <Reveal
              key={tier.id}
              delay={index * 60}
              className={`flex flex-col rounded-md p-8 sm:p-10 ${
                tier.featured
                  ? 'bg-paper-deep ring-1 ring-terra-700/30'
                  : 'border border-ink/10'
              }`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-h3">{tier.name}</h3>
                {tier.badge && (
                  <span className="text-micro uppercase text-terra-700">{tier.badge}</span>
                )}
              </div>

              <p className="mt-6 font-display text-[2.5rem] leading-none tabular-nums">
                {tier.price}
              </p>
              <p className="mt-2 text-note text-ink/50">{tier.priceNote}</p>

              <p className="mt-6 text-body text-ink/70">{tier.summary}</p>

              <ul className="mt-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3 text-small">
                    <IconCheck
                      className={`mt-1 h-4 w-4 shrink-0 ${
                        feature.muted ? 'text-ink/30' : 'text-moss-600'
                      }`}
                    />
                    <span
                      className={
                        feature.muted
                          ? 'text-ink/50'
                          : feature.strong
                            ? 'text-ink'
                            : 'text-ink/70'
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <a href="#warteliste" className="btn-primary mt-10 self-start">
                {tier.cta}
              </a>
            </Reveal>
          ))}
        </div>

        {/* Preisangabe klar als geplant gekennzeichnet — es liegt kein Angebot vor. */}
        <Reveal delay={120}>
          <p className="mt-8 text-note text-ink/50">{SITE.priceNote}</p>
        </Reveal>
      </Container>
    </Section>
  )
}
