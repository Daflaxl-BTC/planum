import { useCallback, useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '../../hooks/useReducedMotion'
import './medallion.css'

// Das Hero-Objekt: der echte Sticker als 3D-Modell, offline gerendert.
//
// Quelle ist 3D-Objekt/planum-medallion-d40.glb (232.000 Dreiecke, Relief in
// der Geometrie, keine Texturen). Gerendert wird das Modell in
// scripts/render-medallion.mjs mit three.js — aber nur dort. Im Browser laeuft
// weder eine 3D-Bibliothek noch das Modell: das waeren rund 170 kB JavaScript
// plus 7 MB Geometrie fuer ein einziges Objekt. Ausgeliefert werden 24
// Einzelbilder eines Umlaufs (je 15 Grad) und zwei hochaufgeloeste Ruhelagen.
//
// Dadurch ist die Drehung echt — es sind Ansichten desselben Koerpers, keine
// perspektivische Verzerrung eines flachen Bildes — und kostet trotzdem kein
// Laufzeit-Rendering.

const TURN_FRAMES = 24
const HALF_TURN = TURN_FRAMES / 2

// Zeigerausschlag: 2 Frames = 30 Grad nach jeder Seite. Mehr wirkt nicht mehr
// wie Anfassen, sondern wie eine eigene Animation.
const SCRUB_RANGE = 2

const FLIP_DURATION = 780

// Pause auf der Rueckseite, bevor das Objekt von selbst zurueckdreht. Lang
// genug zum Hinsehen, kurz genug, dass die leere Scheibe kein Dauerbild wird.
const BACK_HOLD = 1500

const frameSrc = (index) => `/medallion/turn-${String(index).padStart(2, '0')}.webp`

const FRAME_INDEXES = Array.from({ length: TURN_FRAMES }, (_, index) => index)

// Ohne Modulo laeuft der Umlauf beim Umschlagen ins Negative.
const wrap = (index) => ((index % TURN_FRAMES) + TURN_FRAMES) % TURN_FRAMES

export function Medallion({ className = '' }) {
  const reduced = useReducedMotion()
  const stageRef = useRef(null)
  const timerRef = useRef(0)

  const [flipped, setFlipped] = useState(false)
  // null = Ruhelage, sonst der Index des sichtbaren Umlauf-Frames.
  const [frame, setFrame] = useState(null)
  const [framesReady, setFramesReady] = useState(false)
  const [spinning, setSpinning] = useState(false)

  const base = flipped ? HALF_TURN : 0

  // Die Umlauf-Frames sind zusammen rund 200 kB. Sie werden deshalb erst nach
  // dem ersten Zeigerkontakt geladen — bis dahin steht die Ruhelage, und die
  // Ladezeit der Seite bleibt unberuehrt. Auf Geraeten ohne Zeiger passiert
  // das nie.
  const loadFrames = useCallback(() => {
    if (framesReady || reduced) return
    setFramesReady(true)
  }, [framesReady, reduced])

  const onPointerMove = useCallback(
    (event) => {
      if (reduced || event.pointerType === 'touch' || spinning) return
      loadFrames()
      if (!framesReady) return

      const stage = stageRef.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5

      // Ohne Drosselung ueber requestAnimationFrame: der Browser liefert
      // pointermove ohnehin hoechstens einmal pro Bild, und der Wechsel selbst
      // ist ein display-Umschalten zwischen bereits geladenen Bildern.
      setFrame(wrap(base + Math.round(x * 2 * SCRUB_RANGE)))
    },
    [base, framesReady, loadFrames, reduced, spinning],
  )

  const onPointerLeave = useCallback(() => {
    if (spinning) return
    setFrame(null)
  }, [spinning])

  // Eine halbe Umdrehung ab dem uebergebenen Frame. Beim Drehen laeuft das
  // Objekt ueber die Kante — genau das unterscheidet einen Koerper von zwei
  // Bildern, die ineinander ueberblenden.
  //
  // Zeitgesteuert ueber setTimeout, nicht ueber requestAnimationFrame: es
  // werden 12 fertige Bilder umgeschaltet, mehr als ~60 Schritte pro Sekunde
  // gibt es dabei nicht zu sehen.
  const spin = useCallback((from, onDone) => {
    setSpinning(true)
    const start = performance.now()

    const step = () => {
      const t = Math.min(1, (performance.now() - start) / FLIP_DURATION)
      // Kurz beschleunigen, lange auslaufen — so liest sich das Anhalten als
      // Gewicht und nicht als abgebrochene Animation.
      const eased = 1 - (1 - t) ** 3
      setFrame(wrap(from + Math.round(eased * HALF_TURN)))
      if (t < 1) {
        timerRef.current = setTimeout(step, 16)
        return
      }
      onDone()
    }

    step()
  }, [])

  // Die Rueckseite ist die Klebeflaeche: eine glatte Scheibe. Als Dauerzustand
  // waere das ein leeres Hero-Bild, deshalb dreht das Objekt von selbst
  // zurueck. Die Drehung ist eine Vorfuehrung, kein Zustand.
  const flip = useCallback(() => {
    if (spinning) return

    if (reduced || !framesReady) {
      // Ohne geladene Frames faellt die Drehung aus, das Bild wechselt direkt.
      // Frames fuer den naechsten Klick im Hintergrund nachziehen.
      loadFrames()
      setFlipped(true)
      setFrame(null)
      timerRef.current = setTimeout(() => setFlipped(false), BACK_HOLD)
      return
    }

    spin(0, () => {
      setFlipped(true)
      setFrame(null)
      timerRef.current = setTimeout(() => {
        spin(HALF_TURN, () => {
          setFlipped(false)
          setFrame(null)
          setSpinning(false)
        })
      }, BACK_HOLD)
    })
  }, [framesReady, loadFrames, reduced, spin, spinning])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const still = flipped ? 'back' : 'front'
  // Bewusst ohne Materialangabe: das Modell zeigt das Motiv, nicht das
  // gedruckte Teil. Materialtests laufen noch (siehe claims-guard.md).
  const stillAlt = flipped
    ? 'Rückseite des Planum-Profil-Stickers: glatte Klebeseite.'
    : 'Planum-Profil-Sticker, rund, Ø 40 mm, mit Pflanzenranke, NFC-Wellen und Schriftzug PLANUM.'

  return (
    <div className={className}>
      <div
        ref={stageRef}
        className="medallion-stage"
        data-idle={frame === null ? 'true' : 'false'}
        onPointerEnter={loadFrames}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div className="medallion-guides" aria-hidden="true">
          <svg viewBox="0 0 400 400">
            <g fill="none" stroke="#96522F" strokeWidth="1">
              <circle cx="200" cy="200" r="196" strokeDasharray="7 7" opacity="0.35" />
              <circle cx="200" cy="200" r="150" opacity="0.18" />
              <line x1="200" y1="0" x2="200" y2="400" opacity="0.12" />
              <line x1="0" y1="200" x2="400" y2="200" opacity="0.12" />
            </g>
          </svg>
        </div>

        <div className="medallion-shadow" aria-hidden="true" />

        <div className="medallion-float">
          <img
            className="medallion-still"
            src={`/medallion/${still}-1120.webp`}
            srcSet={`/medallion/${still}-560.webp 560w, /medallion/${still}-1120.webp 1120w`}
            sizes="(min-width: 1024px) 30rem, 80vw"
            width="1120"
            height="1120"
            alt={stillAlt}
            // Das Objekt ist das groesste Element im ersten Bildschirm und
            // damit der LCP-Kandidat.
            decoding="sync"
            fetchpriority="high"
            data-visible={frame === null ? 'true' : 'false'}
          />

          {framesReady &&
            FRAME_INDEXES.map((index) => (
              <img
                key={index}
                className="medallion-frame"
                src={frameSrc(index)}
                width="560"
                height="560"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                data-visible={frame === index ? 'true' : 'false'}
              />
            ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2 text-micro uppercase text-ink/50">
        <button type="button" className="medallion-flip" aria-pressed={flipped} onClick={flip}>
          <span className="medallion-flip-dot" aria-hidden="true" />
          {flipped ? 'Vorderseite zeigen' : 'Rückseite zeigen'}
        </button>
        <span>Profil · Ø 40 mm</span>
        <span>NTAG213</span>
        {/* Kennzeichnung, weil das Bild ein Render ist und kein Produktfoto. */}
        <span className="text-ink/40 normal-case">Darstellung: 3D-Modell</span>
      </div>
    </div>
  )
}
