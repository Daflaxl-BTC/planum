import { useCallback, useRef } from 'react'
import { INSIGHT_STATEMENT } from '../content/landing'
import { Container } from '../components/layout/Container'
import { Section } from '../components/layout/Section'
import { Eyebrow } from '../components/ui/Eyebrow'
import { useScrollProgress } from '../hooks/useScrollProgress'

// Ein Absatz in grosser Type, der sich beim Scrollen Wort fuer Wort aufhellt.
// Der Fortschritt landet als CSS-Variable am Container; jedes Wort rechnet
// seine Deckkraft selbst aus seinem Index — kein React-Rendern pro Bild.
// Ohne JavaScript und bei reduzierter Bewegung steht der Text voll da.
export function Insight() {
  const ref = useRef(null)
  const words = INSIGHT_STATEMENT.text.split(' ')
  const accentAt = words.indexOf(INSIGHT_STATEMENT.accentFrom)

  const onProgress = useCallback((p) => {
    // Zwischen 15 % und 65 % Durchlauf wird der ganze Absatz aufgedeckt.
    const t = Math.min(1, Math.max(0, (p - 0.15) / 0.5))
    ref.current?.style.setProperty('--lit', String(t * words.length))
  }, [words.length])

  useScrollProgress(ref, onProgress)

  return (
    <Section space="lg" tone="paper">
      <Container>
        <Eyebrow>{INSIGHT_STATEMENT.eyebrow}</Eyebrow>
        <p
          ref={ref}
          className="mt-8 max-w-[22ch] font-display text-[clamp(1.9rem,4.4vw,3.6rem)] font-semibold leading-[1.08] tracking-[-0.035em] sm:max-w-[26ch] lg:max-w-[30ch]"
          style={{ '--lit': words.length }}
        >
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className={`insight-word ${index >= accentAt ? 'text-terra-700' : ''}`}
              style={{ '--i': index }}
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </Container>
    </Section>
  )
}
