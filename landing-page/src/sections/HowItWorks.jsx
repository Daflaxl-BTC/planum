import { STEPS } from '../content/steps'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { StepDiagram } from '../components/media/StepDiagram'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'

// Drei Schritte als Folge breiter Zeilen — bewusst KEIN dreispaltiges
// Karten-Raster mit Rahmen und Schatten, und auch nicht mehr die drei gleich
// hohen Textspalten der ersten Fassung: die lasen sich wie eine Tabelle.
//
// Jede Zeile traegt die Schrittziffer, den Text in Lesebreite und rechts eine
// Strichzeichnung (StepDiagram). Die Zeichnungen haengen unterschiedlich hoch
// im Satzspiegel, damit die Folge einen Rhythmus bekommt und nicht wie drei
// Kopien derselben Zeile wirkt.
const LIFT = ['md:-translate-y-2', 'md:translate-y-4', 'md:translate-y-1']

export function HowItWorks() {
  return (
    <Section id="so-gehts" space="lg" tone="deep">
      <Container>
        <Reveal className="max-w-measure">
          <Eyebrow>{STEPS.eyebrow}</Eyebrow>
          <h2 className="mt-6 whitespace-pre-line text-h2">{STEPS.headline}</h2>
        </Reveal>

        <ol className="mt-16 border-t border-ink/10">
          {STEPS.items.map((step, index) => (
            <Reveal
              as="li"
              key={step.n}
              delay={index * 60}
              className="grid grid-cols-4 items-start gap-x-6 border-b border-ink/10 py-10 md:grid-cols-12 md:gap-x-8 md:py-14"
            >
              {/* Auf schmalen Displays steht die Ziffer ueber dem Text: als
                  eigene Spalte bliebe fuer den Satz eine Gasse von gut 200 px,
                  in der jede Zeile drei Woerter traegt. */}
              <p className="col-span-4 font-display text-[2.75rem] leading-none text-terra-700 md:col-span-1 md:text-[3.25rem]">
                {step.n}
              </p>

              <div className="col-span-4 mt-4 md:col-span-6 md:mt-0">
                <h3 className="text-h3">{step.title}</h3>
                <p className="mt-3 max-w-measure text-body text-ink/70">{step.body}</p>
              </div>

              {/* Auf schmalen Displays entfaellt die Zeichnung: dort steht sie
                  unter dem Text und waere ein zweites, kleineres Bild ohne
                  eigenen Beitrag — der Text sagt bereits dasselbe. */}
              <StepDiagram
                name={step.art}
                className={`col-start-9 col-span-4 hidden aspect-square w-full max-w-[12.5rem] justify-self-end md:block ${LIFT[index]}`}
              />
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  )
}
