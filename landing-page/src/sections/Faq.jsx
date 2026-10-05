import { useId, useState } from 'react'
import { FAQ } from '../content/faq'
import { FOOTER } from '../content/site'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { IconToggle } from '../components/icons'

// Akkordeon als echtes <button aria-expanded aria-controls>. Ein <div> mit
// onClick waere per Tastatur nicht bedienbar und fuer Screenreader stumm.
export function Faq() {
  const [open, setOpen] = useState(0)
  const baseId = useId()

  return (
    <Section id="fragen" space="lg" tone="paper">
      <Container grid className="gap-y-12">
        <div className="col-span-4 md:col-span-4">
          <Reveal className="md:sticky md:top-28">
            <Eyebrow>{FAQ.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-h2">{FAQ.headline}</h2>
            <p className="mt-6 text-small text-ink/55">
              Noch etwas offen? Schreib uns an{' '}
              <a
                href={`mailto:${FOOTER.contact}`}
                className="break-all text-ink underline decoration-terra-500/50 underline-offset-4 hover:decoration-terra-500"
              >
                {FOOTER.contact}
              </a>
              .
            </p>
          </Reveal>
        </div>

        <ul className="col-span-4 space-y-3 md:col-span-7 md:col-start-6">
          {FAQ.items.map((item, index) => {
            const isOpen = open === index
            const panelId = `${baseId}-panel-${index}`
            const buttonId = `${baseId}-button-${index}`

            return (
              <Reveal
                as="li"
                key={item.q}
                delay={Math.min(index, 4) * 40}
                className={`rounded-lg transition-colors duration-300 ${
                  isOpen ? 'bg-white ring-1 ring-inset ring-ink/[0.08]' : 'bg-paper-deep/70 hover:bg-paper-deep'
                }`}
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left"
                  >
                    <span className="text-body font-semibold tracking-[-0.01em]">{item.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isOpen ? 'bg-terra-500 text-white' : 'bg-white text-ink/60 ring-1 ring-inset ring-ink/10'
                      }`}
                    >
                      <IconToggle open={isOpen} className="h-3.5 w-3.5" />
                    </span>
                  </button>
                </h3>

                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen}>
                  <p className="max-w-measure px-6 pb-6 text-small text-ink/65">{item.a}</p>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </Section>
  )
}
