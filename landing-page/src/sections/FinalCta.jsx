import { WAITLIST } from '../content/site'
import { Container } from '../components/layout/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { WaitlistForm } from '../components/WaitlistForm'

// Haupt-CTA als dunkles Panel. "Was danach passiert" steht bewusst daneben:
// die Unsicherheit "Was macht ihr mit meiner Adresse" ist der haeufigste Grund,
// ein Wartelisten-Formular abzubrechen.
export function FinalCta() {
  return (
    <section id="warteliste" className="bg-paper pb-section md:pb-section-lg">
      <Container>
        <Reveal className="relative isolate overflow-hidden rounded-xl bg-night px-6 py-14 text-paper sm:px-12 md:px-16 md:py-20">
          <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/2 left-1/2 -z-10 h-[140%] w-[90%] -translate-x-1/2"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(201,123,82,0.32) 0%, rgba(201,123,82,0) 70%)',
            }}
          />
          <img
            src="/medallion/front-560.webp"
            alt=""
            width="560"
            height="560"
            loading="lazy"
            decoding="async"
            className="pointer-events-none absolute -bottom-24 -right-20 -z-10 hidden w-[22rem] rotate-12 opacity-90 md:block"
          />

          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-7">
              <Eyebrow tone="dark">{WAITLIST.eyebrow}</Eyebrow>
              <h2 className="mt-6 text-display-lg">{WAITLIST.headline}</h2>
              <p className="mt-6 max-w-measure text-body text-paper/60">{WAITLIST.lead}</p>
              <WaitlistForm tone="dark" className="mt-9 max-w-[34rem]" />
            </div>

            <div className="md:col-span-4 md:col-start-9">
              <p className="text-micro font-semibold uppercase text-paper/40">Was danach passiert</p>
              <ol className="mt-6 space-y-5">
                {WAITLIST.steps.map((step, index) => (
                  <li key={step.slice(0, 24)} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-note font-semibold tabular-nums text-terra-300 ring-1 ring-inset ring-white/10">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-small text-paper/65">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
