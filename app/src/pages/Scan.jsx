import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { isNfcAvailable, readSlotUuid } from '../lib/nfc.js'
import { fileToBase64, assessNfc, assessSkip, confirmMatch } from '../lib/assessApi.js'
import { CameraIcon, ChevronLeftIcon, SparklesIcon } from '../components/Icons.jsx'

export default function Scan() {
  const navigate = useNavigate()
  const fileRef = useRef(null)
  const [nfcOk, setNfcOk] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | nfc | uploading | assessing | confirm | error
  const [error, setError] = useState(null)
  const [sheet, setSheet] = useState(null) // { photo_id, suggested, candidates, assessment }

  useEffect(() => { isNfcAvailable().then(setNfcOk) }, [])

  async function resolvePlantId(slotUuid) {
    const { data: plant } = await supabase.from('plants')
      .select('id').eq('slot_uuid', slotUuid).is('archived_at', null).maybeSingle()
    if (plant) return plant.id
    const { data: lookup } = await supabase.rpc('lookup_plant_uuid', { p_plant_uuid: slotUuid })
    const info = Array.isArray(lookup) ? lookup[0] : lookup
    if (!info) throw new Error('Dieser NFC-Sticker gehört nicht zu Planum.')
    if (!info.package_activated) throw new Error('Paket noch nicht aktiviert. Zuerst im Profil aktivieren.')
    if (!info.user_is_member) throw new Error('Dieser Sticker gehört zu einem anderen Haushalt.')
    if (!info.plant_id) throw new Error('Für diesen Sticker ist noch keine Pflanze registriert.')
    return info.plant_id
  }

  async function startNfc() {
    setError(null); setPhase('nfc')
    try {
      const slotUuid = await readSlotUuid()
      const plantId = await resolvePlantId(slotUuid)
      openCameraFor({ mode: 'nfc', plantId })
    } catch (e) { setError(e.message || 'NFC-Lesung fehlgeschlagen.'); setPhase('error') }
  }

  const pending = useRef(null)
  function openCameraFor(ctx) { pending.current = ctx; fileRef.current?.click() }

  async function onFile(e) {
    const file = e.target.files?.[0]; e.target.value = ''
    if (!file) { setPhase('idle'); return }
    const ctx = pending.current || { mode: 'skip' }
    setError(null); setPhase('uploading')
    try {
      const b64 = await fileToBase64(file)
      setPhase('assessing')
      if (ctx.mode === 'nfc') {
        const res = await assessNfc(b64, ctx.plantId)
        navigate(`/plant/${res.plant_id}`)
      } else {
        const res = await assessSkip(b64)
        if (!res.suggested) throw new Error('Keine passende Pflanze gefunden. Bitte manuell wählen.')
        setSheet(res); setPhase('confirm')
      }
    } catch (e) { setError(mapErr(e)); setPhase('error') }
  }

  async function confirmSuggested(plantId) {
    setPhase('assessing')
    try { await confirmMatch(sheet.photo_id, plantId); navigate(`/plant/${plantId}`) }
    catch (e) { setError(mapErr(e)); setPhase('error') }
  }

  function mapErr(e) {
    if (e?.context?.status === 429 || /quota/i.test(e?.message || ''))
      return 'KI-Limit erreicht. Nächste Analyse später oder Upgrade.'
    return e?.message || 'Etwas ist schiefgelaufen.'
  }

  const busy = phase === 'uploading' || phase === 'assessing' || phase === 'nfc'

  return (
    <div className="pb-8">
      <div className="px-6 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} aria-label="Zurück"
          className="w-10 h-10 rounded-full bg-white border border-sage-100 flex items-center justify-center hover:bg-sage-50">
          <ChevronLeftIcon className="w-5 h-5 text-sage-800" />
        </button>
        <h1 className="font-display text-2xl text-sage-900">Pflanze aktualisieren</h1>
      </div>

      <div className="px-6 space-y-4">
        {/* NFC-Karte (Primär) */}
        <button disabled={!nfcOk || busy} onClick={startNfc}
          className="w-full card p-6 text-left disabled:opacity-50">
          <div className="flex items-center gap-4">
            <NfcGlyph className="w-10 h-10 text-moss-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-sage-900">Handy an Sticker halten</p>
              <p className="text-xs text-sage-500 mt-0.5">
                {nfcOk ? 'NFC-Tap startet das Update' : 'NFC auf diesem Gerät nicht verfügbar'}
              </p>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-3 text-xs text-sage-400">
          <span className="flex-1 h-px bg-sage-200" /> ODER <span className="flex-1 h-px bg-sage-200" />
        </div>

        {/* Skip-Foto (Sekundär) */}
        <button disabled={busy} onClick={() => openCameraFor({ mode: 'skip' })}
          className="btn-primary w-full">
          <CameraIcon className="w-4 h-4 mr-2" /> Ohne NFC — Foto machen
        </button>

        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />

        <div className="flex items-start gap-3 text-xs text-sage-500 leading-relaxed pt-2">
          <SparklesIcon className="w-4 h-4 text-moss-500 flex-shrink-0 mt-0.5" />
          <p>Foto der Pflanze machen — die KI erkennt den Zustand und aktualisiert Bild und Pflegeplan.
             Ohne NFC schlägt sie dir die passende registrierte Pflanze vor.</p>
        </div>

        {busy && (
          <div className="flex items-center justify-center gap-3 py-6 text-sage-600">
            <span className="w-6 h-6 rounded-full border-2 border-sage-200 border-t-moss-500 animate-spin" />
            <span className="text-sm">{phase === 'nfc' ? 'Sticker lesen…' : phase === 'uploading' ? 'Foto wird geladen…' : 'KI analysiert…'}</span>
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
            <button onClick={() => { setError(null); setPhase('idle') }} className="block mt-2 underline">Erneut versuchen</button>
          </div>
        )}
      </div>

      {/* Bestätigungs-Sheet (nur Skip) */}
      {phase === 'confirm' && sheet && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end" onClick={() => setPhase('idle')}>
          <div className="w-full bg-white rounded-t-3xl p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
            <p className="font-display text-xl text-sage-900">Ist das {sheet.suggested.nickname}?</p>
            <button onClick={() => confirmSuggested(sheet.suggested.plant_id)} className="btn-primary w-full">
              Ja, aktualisieren
            </button>
            <details>
              <summary className="text-sm text-sage-500 cursor-pointer">Andere Pflanze</summary>
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {sheet.candidates.map((c) => (
                  <button key={c.plant_id} onClick={() => confirmSuggested(c.plant_id)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-sage-100 hover:bg-sage-50 text-sage-800">
                    {c.nickname}
                  </button>
                ))}
              </div>
            </details>
          </div>
        </div>
      )}
    </div>
  )
}

function NfcGlyph({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" aria-hidden="true">
      <path d="M5 8a13 13 0 0 1 0 8M9 6a17 17 0 0 1 0 12M13 4v16" />
      <rect x="16" y="3" width="6" height="18" rx="2" />
    </svg>
  )
}
