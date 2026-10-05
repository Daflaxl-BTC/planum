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

    let disposed = false
    let visible = false
    let stage = null

    const onReady = () => setReady(true)
    canvas.addEventListener('stage:ready', onReady)

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

    let booted = false
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible && !booted) {
          booted = true
          const go = () => boot().catch(() => {})
          if ('requestIdleCallback' in window) requestIdleCallback(go, { timeout: 1200 })
          else setTimeout(go, 200)
        }
        if (!stage || reduced) return
        if (visible) stage.start()
        else stage.stop()
      },
      { rootMargin: '200px 0px' },
    )
    observer.observe(wrap)

    const resizeObserver = new ResizeObserver(() => stageRef.current?.resize())
    resizeObserver.observe(wrap)

    return () => {
      disposed = true
      observer.disconnect()
      resizeObserver.disconnect()
      canvas.removeEventListener('stage:ready', onReady)
      stageRef.current?.dispose()
      stageRef.current = null
    }
  }, [reduced, tone])

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
