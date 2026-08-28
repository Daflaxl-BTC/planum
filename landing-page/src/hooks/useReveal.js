import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

// Einmaliges Einblenden beim Eintritt in den Viewport.
// Bewusst kein Re-Trigger beim Zurueckscrollen — wiederholte Bewegung wirkt
// unruhig und ist eines der Merkmale generischer Template-Seiten.
export function useReveal({ threshold = 0.15, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (reduced || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [reduced, threshold, rootMargin])

  return { ref, visible }
}
