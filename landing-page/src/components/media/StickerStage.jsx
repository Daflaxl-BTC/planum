import { useEffect, useRef, useState } from 'react'

import { useReducedMotion } from '../../hooks/useReducedMotion'

// React-Huelle um die WebGL-Buehne (src/three/stage.js).
//
// Ablauf: Zuerst steht das vorgerenderte Standbild (poster) — es ist der
// LCP-Kandidat und funktioniert ohne JavaScript und ohne WebGL. Erst wenn die
// Buehne in Sichtweite ist UND der Browser Luft hat, wird three.js
// nachgeladen. Sobald das erste echte Bild steht, blendet das Standbild aus.
// Faellt WebGL aus, bleibt einfach das Standbild stehen.

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function StickerStage({
  pose,
  poster,
  posterAlt = '',
  posterClassName = '',
  tone = 'dark',
  interactive = true,
  // 'desktop': auf Handys bleibt das Standbild stehen und es entsteht kein
  // WebGL-Kontext. Fuer Buehnen, die dort keinen Mehrwert gegenueber dem
  // Poster haben — jeder Kontext kostet Grafikspeicher.
  live = 'all',
  className = '',
  children,
}) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)
  const stageRef = useRef(null)
  const poseRef = useRef(pose)
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)

  poseRef.current = pose

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas || !supportsWebGL()) return undefined
    if (live === 'desktop' && window.matchMedia('(max-width: 767px), (pointer: coarse)').matches) {
      return undefined
    }

    let disposed = false
    let visible = false
    let stage = null

    const onReady = () => setReady(true)
    canvas.addEventListener('stage:ready', onReady)

    // Verwirft der Browser den Grafikkontext (iOS bei Speicherdruck), bleibt
    // die Flaeche sonst leer. Dann zurueck auf das Standbild.
    const onLost = () => {
      stageRef.current?.stop()
      setReady(false)
    }
    canvas.addEventListener('webglcontextlost', onLost)

    const boot = async () => {
      const { createStage } = await import('../../three/stage')
      if (disposed) return
      stage = await createStage(canvas, { reducedMotion: reduced, tone })
      if (disposed) {
        stage.dispose()
        return
      }
      stageRef.current = stage
      stage.setPose(poseRef.current, { instant: true })
      if (reduced) {
        stage.renderOnce()
        setReady(true)
      } else if (visible) {
        stage.start()
      }
    }

    // Aufbau (Texturen hochladen, Shader kompilieren) kostet auf Handys einige
    // hundert Millisekunden. Deshalb schon gut eine Bildschirmhoehe vorher
    // starten — sonst faellt genau dieser Aussetzer in das Scrollen hinein.
    let booted = false
    const bootObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || booted) return
        booted = true
        bootObserver.disconnect()
        const go = () => boot().catch(() => {})
        if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 1200 })
        else setTimeout(go, 200)
      },
      { rootMargin: '120% 0px' },
    )
    bootObserver.observe(wrap)

    // Gerendert wird nur, solange die Buehne wirklich zu sehen ist.
    const runObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (!stage || reduced) return
        if (visible) stage.start()
        else stage.stop()
      },
      { rootMargin: '80px 0px' },
    )
    runObserver.observe(wrap)

    const resizeObserver = new ResizeObserver(() => stageRef.current?.resize())
    resizeObserver.observe(wrap)

    return () => {
      disposed = true
      bootObserver.disconnect()
      runObserver.disconnect()
      resizeObserver.disconnect()
      canvas.removeEventListener('stage:ready', onReady)
      canvas.removeEventListener('webglcontextlost', onLost)
      stageRef.current?.dispose()
      stageRef.current = null
    }
  }, [reduced, tone, live])

  useEffect(() => {
    stageRef.current?.setPose(pose)
  }, [pose])

  useEffect(() => {
    if (!interactive || reduced) return undefined
    const onMove = (event) => {
      if (event.pointerType === 'touch') return
      const wrap = wrapRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2
      stageRef.current?.setPointer(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y)))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [interactive, reduced])

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {poster && (
        <img
          src={poster.src}
          srcSet={poster.srcSet}
          sizes={poster.sizes}
          width={poster.width}
          height={poster.height}
          alt={posterAlt}
          decoding="async"
          fetchpriority={poster.priority ? 'high' : undefined}
          aria-hidden={ready ? 'true' : undefined}
          className={`pointer-events-none absolute transition-opacity duration-700 ${
            ready ? 'opacity-0' : 'opacity-100'
          } ${posterClassName}`}
        />
      )}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          ready ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {children}
    </div>
  )
}
