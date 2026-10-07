import { useCallback, useRef, useState } from 'react'
import { STEPS } from '../content/steps'
import { STORY_OVERLAYS } from '../content/landing'
import { Container } from '../components/layout/Container'
import { Eyebrow } from '../components/ui/Eyebrow'
import { Reveal } from '../components/ui/Reveal'
import { StickerStage } from '../components/media/StickerStage'
import { IconCheck, IconNfc } from '../components/icons'
import { useScrollProgress } from '../hooks/useScrollProgress'
import { STORY_POSES } from '../three/poses'

// Scroll-Erzaehlung: Die Buehne bleibt stehen, waehrend die drei Schritte
// durchlaufen. Jeder Schritt hat eine eigene Pose der Sticker und eine
// schmale Einblendung, die die Handlung zeigt — Masse, Antippen, Bestaetigung.
//
// Barrierefrei bleibt es, weil alle drei Schritte immer als Liste im DOM
// stehen; nur die Hervorhebung wandert mit.

// Standbild, falls WebGL fehlt oder der Browser den Grafikkontext verwirft.
const POSTER = {
  src: '/medallion/front-560.webp',
  srcSet: '/medallion/front-560.webp 560w, /medallion/front-1120.webp 1120w',
  sizes: '(min-width: 768px) 50vw, 46svh',
  width: 1120,
  height: 1120,
}

function StepNumber({ index, active }) {
  return (
    <span
      className={`absolute left-0 top-0 flex h-[1.8rem] w-[1.8rem] items-center justify-center rounded-full text-note font-semibold tabular-nums ring-1 ring-inset transition-colors duration-500 ${
        active ? 'bg-terra-500 text-white ring-terra-300' : 'bg-night text-paper/60 ring-white/15'
      }`}
    >
      {index + 1}
    </span>
  )
}

export function Story() {
  const trackRef = useRef(null)
  const barRef = useRef(null)
  const [step, setStep] = useState(0)

  const onProgress = useCallback((p) => {
    setStep(Math.min(STEPS.items.length - 1, Math.floor(p * STEPS.items.length * 0.999)))
    barRef.current?.style.setProperty('transform', `scaleY(${p})`)
  }, [])

  useScrollProgress(trackRef, onProgress, { mode: 'sticky' })

  return (
    <section id="so-gehts" data-tone="dark" className="relative bg-night text-paper">
      <Container className="pt-section md:pt-section-lg">
        <Reveal className="max-w-measure">
          <Eyebrow tone="dark">{STEPS.eyebrow}</Eyebrow>
          <h2 className="mt-6 whitespace-pre-line text-h2">{STEPS.headline}</h2>
        </Reveal>
      </Container>

      <div ref={trackRef} className="relative h-[300vh]">
        <div className="sticky top-0 flex h-[100svh] items-start overflow-hidden md:items-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-10%] top-1/2 h-[90vh] w-[70vw] -translate-y-1/2"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(201,123,82,0.18) 0%, rgba(201,123,82,0) 70%)',
            }}
          />

          {/* Auf dem Handy oben angeschlagen statt vertikal zentriert: so bleibt
              die Buehne stehen, auch wenn sich darunter der Text aendert. */}
          <Container grid className="relative w-full items-start gap-y-6 pt-20 md:items-center md:pt-0">
            {/* Desktop: alle drei Schritte als Liste, der aktive hervorgehoben. */}
            <ol className="relative order-2 col-span-4 hidden md:order-1 md:col-span-5 md:block">
              {/* Fortschrittslinie */}
              <span aria-hidden="true" className="absolute bottom-2 left-[0.9rem] top-2 w-px bg-white/10">
                <span
                  ref={barRef}
                  className="block h-full w-full origin-top bg-terra-300"
                  style={{ transform: 'scaleY(0)' }}
                />
              </span>

              {STEPS.items.map((item, index) => {
                const active = index === step
                return (
                  <li
                    key={item.n}
                    aria-current={active ? 'step' : undefined}
                    className={`relative pl-12 transition-opacity duration-500 ${
                      active ? 'opacity-100' : 'opacity-35'
                    } ${index > 0 ? 'mt-10' : ''}`}
                  >
                    <StepNumber index={index} active={active} />
                    <h3 className="text-h3">{item.title}</h3>
                    <p className="mt-2 max-w-measure-tight text-body text-paper/60">{item.body}</p>
                  </li>
                )
              })}
            </ol>

            {/* Handy: Fortschritt als drei Segmente, darunter alle Schritte
                uebereinander in derselben Rasterzelle. Die Hoehe ist damit
                immer die des laengsten Schritts und aendert sich beim Wechsel
                nicht — vorher klappten die Texte auf und zu, und die fixierte
                Buehne sprang bei jedem Schritt mit. */}
            <div className="order-2 col-span-4 md:hidden">
              <div aria-hidden="true" className="flex gap-1.5">
                {STEPS.items.map((item, index) => (
                  <span
                    key={item.n}
                    className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                      index <= step ? 'bg-terra-300' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
              <ol className="mt-5 grid">
                {STEPS.items.map((item, index) => {
                  const active = index === step
                  return (
                    <li
                      key={item.n}
                      aria-current={active ? 'step' : undefined}
                      className={`relative pl-12 transition-[opacity,transform] duration-500 ease-reveal [grid-area:1/1] ${
                        active ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
                      }`}
                    >
                      <StepNumber index={index} active />
                      <h3 className="text-h3">{item.title}</h3>
                      <p className="mt-2 text-small text-paper/60">{item.body}</p>
                    </li>
                  )
                })}
              </ol>
            </div>

            <div className="order-1 col-span-4 md:order-2 md:col-span-7">
              <StickerStage
                pose={STORY_POSES[step]}
                poster={POSTER}
                posterClassName="inset-[12%] h-[76%] w-[76%] object-contain"
                className="mx-auto aspect-square w-full max-w-[min(100%,46svh)] md:max-w-[min(100%,80svh)]"
              >
                <Overlay step={step} />
              </StickerStage>
            </div>
          </Container>
        </div>
      </div>
    </section>
  )
}

function Overlay({ step }) {
  const show = (index) =>
    `absolute inset-0 transition-all duration-700 ease-reveal ${
      step === index ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-3'
    }`

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* 01 Masse */}
      <div className={show(0)}>
        <Tag className="left-[4%] top-[18%]">{STORY_OVERLAYS.stick.a}</Tag>
        <Tag className="bottom-[20%] right-[4%]">{STORY_OVERLAYS.stick.b}</Tag>
      </div>

      {/* 02 Antippen: Wellen und das Profil, das sich oeffnet */}
      <div className={show(1)}>
        <div className="absolute left-1/2 top-1/2 h-0 w-0">
          {[0, 0.7, 1.4].map((delay) => (
            <span
              key={delay}
              className="absolute -left-[8rem] -top-[8rem] h-[16rem] w-[16rem] animate-pulse-ring rounded-full border border-mint/40"
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </div>
        <div className="absolute right-0 top-0 w-[10.5rem] rounded-lg bg-night-700/90 p-3 text-[0.9em] sm:right-[2%] sm:top-[14%] sm:w-[13.5rem] sm:p-4 shadow-card ring-1 ring-inset ring-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 text-note text-mint">
            <IconNfc className="h-4 w-4" />
            NFC erkannt
          </div>
          <p className="mt-3 text-body font-semibold">{STORY_OVERLAYS.tap.title}</p>
          <p className="text-note text-paper/50">{STORY_OVERLAYS.tap.meta}</p>
          <div className="mt-3 flex items-center gap-2 text-note text-paper/70">
            <span className="h-2 w-2 rounded-full bg-moss-400" /> Alles gut
          </div>
          <p className="mt-3 border-t border-white/10 pt-2 text-[0.7rem] text-paper/35">
            {STORY_OVERLAYS.tap.note}
          </p>
        </div>
      </div>

      {/* 03 Bestaetigung */}
      <div className={show(2)}>
        <div className="absolute left-1/2 top-[12%] flex -translate-x-1/2 items-center gap-3 whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-small text-ink shadow-glow">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-moss-600 text-white">
            <IconCheck className="h-3.5 w-3.5" />
          </span>
          <span className="font-semibold">{STORY_OVERLAYS.log.title}</span>
          <span className="text-ink/45">{STORY_OVERLAYS.log.meta}</span>
        </div>
      </div>
    </div>
  )
}

function Tag({ className = '', children }) {
  return (
    <span
      className={`absolute flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1.5 text-note text-paper/75 ring-1 ring-inset ring-white/15 backdrop-blur-md ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-terra-300" />
      {children}
    </span>
  )
}
