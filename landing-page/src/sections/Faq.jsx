import { useId, useState } from 'react'
import { FAQ } from '../content/faq'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { IconToggle } from '../components/icons'

// Akkordeon als echtes <button aria-expanded aria-controls>. Ein <div> mit
// onClick waere per Tastatur nicht bedienbar und fuer Screenreader stumm.
export function Faq() {
  const [open, setOpen] = useState(null)
  const baseId = useId()

  return (
    <Section id="fragen" space="lg">
      <Container grid className="gap-y-12">
        <div className="col-span-4 md:col-span-4 md:col-start-1">
          <Reveal>
            <Eyebrow>{FAQ.eyebrow}</Eyebrow>
            <h2 className="mt-6 text-h2">{FAQ.headline}</h2>
          </Reveal>
        </div>

        <div className="col-span-4 md:col-span-7 md:col-start-6">
          <ul className="border-t border-ink/10">
            {FAQ.items.map((item, index) => {
              const isOpen = open === index
              const panelId = `${baseId}-panel-${index}`
              const buttonId = `${baseId}-button-${index}`

              return (
                <li key={item.q} className="border-b border-ink/10">
                  <h3>
                    <button
                      type="button"
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : index)}
                      className="flex w-full items-start justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-h3">{item.q}</span>
                      <IconToggle
                        open={isOpen}
                        className="mt-1.5 h-4 w-4 shrink-0 text-terra-700"
                      />
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    hidden={!isOpen}
                  >
                    <p className="max-w-measure pb-7 text-body text-ink/70">{item.a}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </Container>
    </Section>
  )
}
