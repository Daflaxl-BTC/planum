import { useEffect } from 'react'

// Meldet den Scrollfortschritt eines Elements als Zahl von 0 bis 1.
//
// mode 'through': 0, wenn die Oberkante unten ins Bild kommt, 1, wenn die
//                 Unterkante oben hinausgeht.
// mode 'sticky':  0, wenn die Oberkante oben anliegt, 1, wenn die Unterkante
//                 unten anliegt — fuer Abschnitte mit position: sticky.
//
// Ruft onProgress direkt auf statt einen State zu setzen: Aufrufer, die nur
// eine CSS-Variable schreiben, sparen sich so das Neu-Rendern bei jedem Bild.
export function useScrollProgress(ref, onProgress, { mode = 'through' } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let frame = 0

    const measure = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      // Im Sticky-Modus zaehlt die Hoehe des fixierten Kinds (100svh), nicht
      // innerHeight: mobile Browser blenden beim Scrollen die Adressleiste
      // ein und aus, innerHeight springt dabei um bis zu 100 px — und mit ihm
      // der Fortschritt, sodass Schritte an den Grenzen hin- und herkippten.
      const vh =
        mode === 'sticky'
          ? el.firstElementChild?.getBoundingClientRect().height || window.innerHeight
          : window.innerHeight
      const raw =
        mode === 'sticky'
          ? -rect.top / Math.max(1, rect.height - vh)
          : (vh - rect.top) / Math.max(1, rect.height + vh)
      onProgress(Math.min(1, Math.max(0, raw)))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
    // onProgress ist bei den Aufrufern stabil (useCallback oder Ref-Setter).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, mode])
}
