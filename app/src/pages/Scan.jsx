import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import QrScanner from 'qr-scanner'
import { supabase } from '../lib/supabase.js'
import { CameraIcon, ChevronLeftIcon, QrIcon, SparklesIcon } from '../components/Icons.jsx'

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

function parseSlotUuid(text) {
  if (!text) return null
  try {
    const url = new URL(text)
    const m = url.pathname.match(/\/(?:plant|scan|qr|s)\/([0-9a-f-]{36})/i)
    if (m) return m[1].toLowerCase()
    const fallback = url.pathname.match(UUID_RE) || url.search.match(UUID_RE)
    if (fallback) return fallback[0].toLowerCase()
  } catch {
    const m = text.trim().match(UUID_RE)
    if (m) return m[0].toLowerCase()
  }
  return null
}

export default function Scan() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const fileInputRef = useRef(null)
  const handlingRef = useRef(false)

  const [phase, setPhase] = useState('init') // init | scanning | resolving | error | not-supported
  const [errorMsg, setErrorMsg] = useState(null)
  const [hasFlash, setHasFlash] = useState(false)
  const [flashOn, setFlashOn] = useState(false)
  const [unknownText, setUnknownText] = useState(null)
  const [resolveError, setResolveError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function start() {
      if (!videoRef.current) return
      const supported = await QrScanner.hasCamera()
      if (cancelled) return
      if (!supported) {
        setPhase('not-supported')
        return
      }

      const scanner = new QrScanner(
        videoRef.current,
        (result) => handleDecode(result.data),
        {
          preferredCamera: 'environment',
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
          returnDetailedScanResult: true,
        },
      )
      scannerRef.current = scanner

      try {
        await scanner.start()
        if (cancelled) {
          scanner.stop()
          scanner.destroy()
          return
        }
        const flashAvailable = await scanner.hasFlash().catch(() => false)
        if (!cancelled) {
          setHasFlash(flashAvailable)
          setPhase('scanning')
        }
      } catch (err) {
        console.error('[scan] camera start failed', err)
        if (cancelled) return
        scanner.destroy()
        scannerRef.current = null
        setErrorMsg(
          err?.name === 'NotAllowedError'
            ? 'Kamera-Zugriff wurde verweigert. Bitte in den Browser-Einstellungen erlauben.'
            : err?.message || 'Kamera konnte nicht gestartet werden.',
        )
        setPhase('error')
      }
    }

    start()

    return () => {
      cancelled = true
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy()
        scannerRef.current = null
      }
    }
  }, [])

  async function handleDecode(text) {
    if (handlingRef.current) return
    handlingRef.current = true
    scannerRef.current?.stop()
    setPhase('resolving')
    setResolveError(null)
    setUnknownText(null)

    const slotUuid = parseSlotUuid(text)
    if (!slotUuid) {
      setUnknownText(text)
      handlingRef.current = false
      return
    }

    try {
      const { data: plant, error: plantErr } = await supabase
        .from('plants')
        .select('id')
        .eq('slot_uuid', slotUuid)
        .is('archived_at', null)
        .maybeSingle()
      if (plantErr) throw plantErr

      if (plant) {
        navigate(`/plant/${plant.id}`)
        return
      }

      const { data: lookup, error: rpcErr } = await supabase.rpc('lookup_plant_uuid', {
        p_plant_uuid: slotUuid,
      })
      if (rpcErr) throw rpcErr

      const info = Array.isArray(lookup) ? lookup[0] : lookup
      if (!info) {
        setResolveError('Dieser QR-Code gehört nicht zu Planum.')
        handlingRef.current = false
        return
      }
      if (!info.package_activated) {
        setResolveError('Das Paket dieses Stickers ist noch nicht aktiviert. Aktiviere es zuerst im Profil.')
        handlingRef.current = false
        return
      }
      if (!info.user_is_member) {
        setResolveError('Dieser Sticker gehört zu einem anderen Haushalt.')
        handlingRef.current = false
        return
      }

      navigate(`/plant/new?slot=${slotUuid}`)
    } catch (err) {
      console.error('[scan] resolve failed', err)
      setResolveError(err.message || 'Slot konnte nicht aufgelöst werden.')
      handlingRef.current = false
    }
  }

  async function toggleFlash() {
    if (!scannerRef.current) return
    try {
      await scannerRef.current.toggleFlash()
      setFlashOn(scannerRef.current.isFlashOn())
    } catch (err) {
      console.error('[scan] flash toggle failed', err)
    }
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const result = await QrScanner.scanImage(file, { returnDetailedScanResult: true })
      handleDecode(result.data)
    } catch {
      setResolveError('Auf diesem Bild wurde kein QR-Code gefunden.')
    }
  }

  async function resumeScanning() {
    setUnknownText(null)
    setResolveError(null)
    handlingRef.current = false
    if (scannerRef.current) {
      try {
        await scannerRef.current.start()
        setPhase('scanning')
      } catch (err) {
        console.error('[scan] restart failed', err)
        setErrorMsg(err.message || 'Kamera konnte nicht neu gestartet werden.')
        setPhase('error')
      }
    } else {
      // Fallback: trigger full re-mount
      setPhase('init')
    }
  }

  const showOverlay = phase === 'resolving' || !!unknownText || !!resolveError

  return (
    <div className="pb-8">
      <div className="px-6 pt-10 pb-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white border border-sage-100 flex items-center justify-center hover:bg-sage-50 transition-colors"
          aria-label="Zurück"
        >
          <ChevronLeftIcon className="w-5 h-5 text-sage-800" />
        </button>
        <h1 className="font-display text-2xl text-sage-900">QR-Scanner</h1>
      </div>

      <div className="px-6">
        <div className="relative rounded-3xl overflow-hidden bg-sage-900 aspect-[4/5] shadow-lg">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />

          {/* Scan frame */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="relative w-3/4 aspect-square">
              <span className="absolute -top-px -left-px w-8 h-8 border-t-4 border-l-4 border-white/90 rounded-tl-2xl" />
              <span className="absolute -top-px -right-px w-8 h-8 border-t-4 border-r-4 border-white/90 rounded-tr-2xl" />
              <span className="absolute -bottom-px -left-px w-8 h-8 border-b-4 border-l-4 border-white/90 rounded-bl-2xl" />
              <span className="absolute -bottom-px -right-px w-8 h-8 border-b-4 border-r-4 border-white/90 rounded-br-2xl" />
              {phase === 'scanning' && (
                <span className="absolute left-2 right-2 top-1/2 h-0.5 bg-moss-400/80 shadow-[0_0_12px_rgba(124,191,118,0.8)] animate-pulse" />
              )}
            </div>
          </div>

          {/* Status pill */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur text-white text-xs px-3 py-1.5 rounded-full">
            {phase === 'init' && 'Kamera wird gestartet…'}
            {phase === 'scanning' && 'Sticker mittig im Rahmen ausrichten'}
            {phase === 'resolving' && 'Wird gesucht…'}
            {phase === 'error' && 'Fehler'}
            {phase === 'not-supported' && 'Keine Kamera erkannt'}
          </div>

          {/* Flash toggle */}
          {hasFlash && phase === 'scanning' && (
            <button
              onClick={toggleFlash}
              className={`absolute bottom-4 right-4 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur transition-colors ${
                flashOn ? 'bg-amber-400 text-amber-950' : 'bg-black/50 text-white'
              }`}
              aria-label="Blitz umschalten"
            >
              <FlashIcon className="w-5 h-5" />
            </button>
          )}

          {/* Error / not-supported overlay */}
          {(phase === 'error' || phase === 'not-supported') && (
            <div className="absolute inset-0 bg-sage-900/85 text-white flex flex-col items-center justify-center p-6 text-center">
              <CameraIcon className="w-10 h-10 mb-3 text-white/80" />
              <p className="text-sm leading-relaxed max-w-xs">
                {phase === 'not-supported'
                  ? 'Auf diesem Gerät wurde keine Kamera gefunden. Lade alternativ ein Foto hoch.'
                  : errorMsg}
              </p>
            </div>
          )}

          {/* Resolving / unknown / error overlay */}
          {showOverlay && (
            <div className="absolute inset-0 bg-sage-900/85 backdrop-blur-sm text-white flex flex-col items-center justify-center p-6 text-center">
              {phase === 'resolving' && !unknownText && !resolveError && (
                <>
                  <div className="w-9 h-9 rounded-full border-2 border-white/30 border-t-white animate-spin mb-3" />
                  <p className="text-sm">Slot wird geprüft…</p>
                </>
              )}
              {unknownText && (
                <>
                  <QrIcon className="w-9 h-9 mb-3 text-white/80" />
                  <p className="text-sm font-medium mb-1">Kein Planum-Sticker</p>
                  <p className="text-xs text-white/70 break-all max-w-xs mb-4">{unknownText}</p>
                  <button onClick={resumeScanning} className="btn-primary !py-2 !px-5 text-sm">
                    Erneut scannen
                  </button>
                </>
              )}
              {resolveError && (
                <>
                  <QrIcon className="w-9 h-9 mb-3 text-white/80" />
                  <p className="text-sm leading-relaxed max-w-xs mb-4">{resolveError}</p>
                  <button onClick={resumeScanning} className="btn-primary !py-2 !px-5 text-sm">
                    Erneut scannen
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Helper actions */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary !py-2.5 !px-4 text-sm flex-1"
          >
            <CameraIcon className="w-4 h-4 mr-2" />
            Foto hochladen
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>

        <div className="mt-6 flex items-start gap-3 text-xs text-sage-500 leading-relaxed">
          <SparklesIcon className="w-4 h-4 text-moss-500 flex-shrink-0 mt-0.5" />
          <p>
            Halte den Planum-QR-Sticker in den Rahmen. Bekannte Sticker führen direkt zur Pflanze;
            neue Slots starten die Pflanzen-Registrierung.
          </p>
        </div>
      </div>
    </div>
  )
}

function FlashIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  )
}
