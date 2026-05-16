import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import {
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  QrIcon,
  SparklesIcon,
} from '../components/Icons.jsx'
import { computeNextDue } from '../lib/careLogic.js'
import { devError, devWarn } from '../lib/devLog.js'

const MIN_SUGGESTION_PROBABILITY = 0.05
const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10 MB -- matched zur Edge-Function (~13.5 MB base64).
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      const comma = typeof result === 'string' ? result.indexOf(',') : -1
      resolve(comma >= 0 ? result.slice(comma + 1) : result)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function speciesDisplay(s) {
  if (!s) return ''
  return `${s.emoji ?? '🌱'} ${s.common_name_de}`
}

function SpeciesSelect({ species, value, onChange }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const selected = useMemo(
    () => species.find((s) => s.id === value) ?? null,
    [species, value],
  )

  // Sync input display when external value changes (KI-Auto-Select).
  useEffect(() => {
    if (open) return
    setQuery(selected ? speciesDisplay(selected) : '')
  }, [selected, open])

  // Close on outside click.
  useEffect(() => {
    function onClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const filtered = useMemo(() => {
    if (!open) return []
    const q = query.trim().toLowerCase()
    if (!q) return species
    return species.filter((s) => {
      return (
        (s.common_name_de ?? '').toLowerCase().includes(q) ||
        (s.scientific_name ?? '').toLowerCase().includes(q)
      )
    })
  }, [open, query, species])

  function handleType(e) {
    setQuery(e.target.value)
    setOpen(true)
    if (value) onChange('')
  }

  function pick(s) {
    onChange(s.id)
    setQuery(speciesDisplay(s))
    setOpen(false)
    inputRef.current?.blur()
  }

  function clear() {
    onChange('')
    setQuery('')
    setOpen(true)
    inputRef.current?.focus()
  }

  function openDropdown() {
    if (selected) setQuery('')
    setOpen(true)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleType}
          onFocus={openDropdown}
          placeholder="Art suchen — z.B. Monstera"
          className="input pr-10"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={value ? clear : () => (open ? setOpen(false) : openDropdown())}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-sage-400 hover:text-sage-700 hover:bg-sage-100 transition-colors"
          aria-label={value ? 'Auswahl löschen' : 'Liste öffnen'}
          tabIndex={-1}
        >
          {value ? (
            <span className="text-lg leading-none">×</span>
          ) : (
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          )}
        </button>
      </div>

      {open && (
        <div className="absolute z-20 left-0 right-0 mt-1 rounded-2xl border border-sage-200 bg-white shadow-lg overflow-hidden">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-sm text-sage-500">Keine Treffer für „{query}".</div>
          ) : (
            <ul className="max-h-72 overflow-y-auto py-1">
              {filtered.map((s) => {
                const isCurrent = s.id === value
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => pick(s)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isCurrent ? 'bg-moss-50' : 'hover:bg-sage-50'
                      }`}
                    >
                      <span className="text-xl flex-shrink-0">{s.emoji ?? '🌱'}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-sage-900 truncate">
                          {s.common_name_de}
                        </span>
                        <span className="block text-xs text-sage-500 italic truncate">
                          {s.scientific_name}
                        </span>
                      </span>
                      {isCurrent && <CheckIcon className="w-4 h-4 text-moss-600 flex-shrink-0" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default function RegisterPlant() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const slotUuid = searchParams.get('slot') || null
  const householdIdParam = searchParams.get('household') || null
  const { user } = useAuth()
  const fileInputRef = useRef(null)
  const [species, setSpecies] = useState([])
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [form, setForm] = useState({
    nickname: '',
    species_id: '',
    location: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [identifying, setIdentifying] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [aiError, setAiError] = useState(null)
  const [detectedFallback, setDetectedFallback] = useState(null)
  // Verified household-id: NUR die household_id, die der Slot tatsaechlich
  // im Backend hat und in der der User Mitglied ist. Verhindert, dass ein
  // manipulierter `?household=`-Query-Param eine Pflanze in einen fremden
  // Haushalt schreibt (RLS+Trigger blockieren das ohnehin, aber so sieht
  // der User die UX-Fehlermeldung vor dem Submit statt eines DB-Errors).
  const [verifiedHouseholdId, setVerifiedHouseholdId] = useState(null)
  const [slotChecking, setSlotChecking] = useState(Boolean(slotUuid))

  useEffect(() => {
    supabase
      .from('plant_species')
      .select('id, common_name_de, scientific_name, emoji')
      .order('common_name_de')
      .then(({ data }) => setSpecies(data ?? []))
  }, [])

  useEffect(() => {
    if (!slotUuid) {
      setSlotChecking(false)
      return
    }
    let active = true
    setSlotChecking(true)
    supabase
      .rpc('lookup_plant_uuid', { p_plant_uuid: slotUuid })
      .then(({ data, error: rpcErr }) => {
        if (!active) return
        if (rpcErr) {
          setError(rpcErr.message)
          setSlotChecking(false)
          return
        }
        const info = Array.isArray(data) ? data[0] : data
        if (!info || !info.package_activated || !info.user_is_member) {
          // ScanResolver kennt den richtigen Flow (Aktivierung, Beitritt,
          // unbekannter Slot). Dort hin redirecten statt hier zu raten.
          navigate(`/qr/${slotUuid}`, { replace: true })
          return
        }
        if (info.plant_registered && info.plant_id) {
          navigate(`/plant/${info.plant_id}`, { replace: true })
          return
        }
        if (householdIdParam && householdIdParam !== info.household_id) {
          // Query-Param wurde manipuliert oder ist veraltet — wir
          // verwenden die vertrauenswuerdige household_id aus dem Slot.
          devWarn('[register] household query param mismatch — using slot household')
        }
        setVerifiedHouseholdId(info.household_id)
        setSlotChecking(false)
      })
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slotUuid])

  async function handleFile(e) {
    const file = e.target.files?.[0]
    // input wert leeren, damit derselbe File-Pick erneut triggern kann.
    e.target.value = ''
    if (!file) return

    // Mime-Type-Whitelist: Browser-Kameras liefern fast immer JPEG;
    // einige iOS-Versionen liefern HEIC. Andere Formate (gif, svg, pdf)
    // sind weder fuer Plant.id noch fuer das Storage-Hosting sinnvoll.
    if (!file.type.startsWith('image/') || (file.type && !ALLOWED_IMAGE_TYPES.includes(file.type))) {
      setAiSuggestions(null)
      setDetectedFallback(null)
      setPhotoFile(null)
      setPhotoPreview(null)
      setAiError('Bitte ein JPEG-, PNG-, WebP- oder HEIC-Bild waehlen.')
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setAiSuggestions(null)
      setDetectedFallback(null)
      setPhotoFile(null)
      setPhotoPreview(null)
      setAiError(`Das Bild ist zu gross (max ${Math.round(MAX_IMAGE_BYTES / 1024 / 1024)} MB).`)
      return
    }

    setPhotoFile(file)
    setAiSuggestions(null)
    setAiError(null)
    setDetectedFallback(null)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(file)
    await identifyPlant(file)
  }

  async function identifyPlant(file) {
    setIdentifying(true)
    try {
      const image_base64 = await fileToBase64(file)
      const { data, error: fnErr } = await supabase.functions.invoke('identify-plant', {
        body: { image_base64 },
      })
      if (fnErr) throw fnErr
      if (data?.diag_error) {
        devError('identify-plant diag', data)
        setAiError(data.diag_error)
        return
      }
      const list = data?.suggestions ?? []
      setAiSuggestions(list)
      const best = data?.best_match_species_id
      if (best && !form.species_id) {
        setForm((f) => ({ ...f, species_id: best }))
      }
    } catch (err) {
      devError('identify-plant', err)
      let detail = err.message || 'KI-Erkennung nicht verfügbar'
      try {
        const body = await err?.context?.json?.()
        if (body) {
          devError('identify-plant body', body)
          if (body.error === 'rate_limit_exceeded') {
            const wait = Math.max(1, body.retry_after_seconds ?? 60)
            detail = `Zu viele Bild-Analysen in kurzer Zeit. Bitte in ${wait}s erneut versuchen.`
          } else if (body.upstream_status) {
            detail = `Plant.id ${body.upstream_status}: ${(body.upstream_body || '').slice(0, 200)}`
          } else if (body.error) {
            detail = body.error
          }
        }
      } catch (_) { /* ignore */ }
      setAiError(detail)
    } finally {
      setIdentifying(false)
    }
  }

  const visibleSuggestions = useMemo(() => {
    if (!aiSuggestions) return []
    return aiSuggestions
      .filter((s) => (s.probability ?? 0) >= MIN_SUGGESTION_PROBABILITY)
      .slice(0, 3)
  }, [aiSuggestions])

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)

    try {
      let photo_url = null
      if (photoFile) {
        const ext = photoFile.name.split('.').pop()?.toLowerCase() || 'jpg'
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`
        const { error: upErr } = await supabase.storage
          .from('plants')
          .upload(path, photoFile, { cacheControl: '31536000', upsert: false })
        if (upErr) throw upErr
        const { data: pub } = supabase.storage.from('plants').getPublicUrl(path)
        photo_url = pub.publicUrl
      }

      let fullSpecies = null
      if (form.species_id) {
        const { data } = await supabase
          .from('plant_species')
          .select('*')
          .eq('id', form.species_id)
          .single()
        fullSpecies = data
      }

      const now = new Date()
      const intervalSource = fullSpecies ?? { water_interval_days: 7, fertilize_interval_days: 30 }
      const nextWater = computeNextDue({}, intervalSource, 'water', now)
      const nextFert = computeNextDue({}, intervalSource, 'fertilize', now)

      const insertPayload = {
        user_id: user.id,
        nickname: form.nickname.trim(),
        species_id: form.species_id || null,
        detected_species_name:
          !form.species_id && detectedFallback ? detectedFallback.scientific_name : null,
        detected_confidence:
          !form.species_id && detectedFallback ? detectedFallback.probability : null,
        location: form.location.trim() || null,
        photo_url,
        next_water_due_at: nextWater.toISOString(),
        next_fertilize_due_at: nextFert.toISOString(),
      }
      // Wenn ueber Slot-Scan gestartet, slot_uuid + verified household_id
      // explizit setzen, damit der plants_claim_slot-Trigger nicht den
      // falschen Default-Haushalt pruefen muss. verifiedHouseholdId kommt
      // aus dem Slot-Lookup -- nicht aus dem (manipulierbaren) Query-Param.
      if (slotUuid) insertPayload.slot_uuid = slotUuid
      if (verifiedHouseholdId) insertPayload.household_id = verifiedHouseholdId

      const { data: inserted, error: insErr } = await supabase
        .from('plants')
        .insert(insertPayload)
        .select('id')
        .single()
      if (insErr) throw insErr

      navigate(`/plant/${inserted.id}`, { replace: true })
    } catch (err) {
      devError(err)
      setError(err.message || 'Etwas ist schiefgelaufen.')
      setSubmitting(false)
    }
  }

  return (
    <div className="pb-8">
      <div className="px-6 pt-10 pb-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white border border-sage-100 flex items-center justify-center hover:bg-sage-50 transition-colors"
          aria-label="Zurück"
        >
          <ChevronLeftIcon className="w-5 h-5 text-sage-800" />
        </button>
        <h1 className="font-display text-2xl text-sage-900">Neue Pflanze</h1>
      </div>

      <form onSubmit={handleSubmit} className="px-6 space-y-5">
        {slotUuid && (
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-moss-50 border border-moss-100 text-moss-800">
            <QrIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-moss-600" />
            <div className="text-xs leading-relaxed">
              <p className="font-medium">QR-Sticker wird zugewiesen</p>
              <p className="text-moss-700 break-all">{slotUuid}</p>
            </div>
          </div>
        )}

        {/* Photo */}
        <div>
          <label className="label">Foto</label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video rounded-3xl bg-sage-50 border-2 border-dashed border-sage-200 hover:border-moss-300 hover:bg-sage-100/50 transition-all flex flex-col items-center justify-center gap-2 overflow-hidden"
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Vorschau" className="w-full h-full object-cover" />
            ) : (
              <>
                <CameraIcon className="w-8 h-8 text-sage-400" />
                <span className="text-sm text-sage-500">Foto aufnehmen oder wählen</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFile}
            className="hidden"
          />

          <div className="mt-2 flex items-center gap-2 text-xs text-sage-500">
            <SparklesIcon className="w-4 h-4 text-moss-500" />
            {identifying
              ? 'KI analysiert das Foto…'
              : visibleSuggestions.length > 0
              ? 'KI-Vorschläge unten – tippen zum Übernehmen'
              : aiSuggestions
              ? 'Keine eindeutige Erkennung – wähle die Art unten manuell'
              : aiError
              ? aiError
              : 'Foto wählen für automatische Pflanzenerkennung'}
          </div>

          {visibleSuggestions.length > 0 && (
            <div className="mt-3 space-y-2">
              {visibleSuggestions.map((s) => {
                const isMatch = !!s.species_id
                const isSelected = isMatch
                  ? form.species_id === s.species_id
                  : !form.species_id && detectedFallback?.scientific_name === s.scientific_name
                const pct = Math.round((s.probability ?? 0) * 100)
                const label = s.common_name_de ?? s.common_name ?? s.scientific_name
                const handleClick = () => {
                  if (isMatch) {
                    setForm((f) => ({ ...f, species_id: s.species_id }))
                    setDetectedFallback(null)
                  } else {
                    setForm((f) => ({ ...f, species_id: '' }))
                    setDetectedFallback({
                      scientific_name: s.scientific_name,
                      probability: s.probability,
                      common_name: s.common_name,
                    })
                  }
                }
                return (
                  <button
                    type="button"
                    key={s.scientific_name}
                    onClick={handleClick}
                    aria-pressed={isSelected}
                    className={`w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${
                      isSelected
                        ? 'bg-moss-50 border-2 border-moss-500 ring-4 ring-moss-100 shadow-sm'
                        : 'bg-white border-2 border-sage-100 hover:border-moss-200'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{s.emoji ?? '🌱'}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium text-sage-900 truncate">
                        {label}
                      </span>
                      <span className="block text-xs text-sage-500 italic truncate">
                        {s.scientific_name}
                        {!isMatch && ' · Standard-Pflegeplan'}
                      </span>
                    </span>
                    {isSelected ? (
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-moss-600 flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-sage-500 flex-shrink-0">{pct}%</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Nickname */}
        <div>
          <label className="label">Name</label>
          <input
            type="text"
            required
            value={form.nickname}
            onChange={(e) => setForm({ ...form, nickname: e.target.value })}
            placeholder="z.B. Kleine Monstera"
            className="input"
          />
        </div>

        {/* Species (searchable) */}
        <div>
          <label className="label">Art</label>
          <SpeciesSelect
            species={species}
            value={form.species_id}
            onChange={(id) => {
              setForm((f) => ({ ...f, species_id: id }))
              if (id) setDetectedFallback(null)
            }}
          />
          <p className="text-xs text-sage-400 mt-1">
            {detectedFallback
              ? `KI erkannte „${detectedFallback.scientific_name}" – Standard-Pflegeintervalle werden verwendet.`
              : 'Legt automatisch Gieß- und Düngeintervalle fest.'}
          </p>
        </div>

        {/* Location */}
        <div>
          <label className="label">Standort (optional)</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="z.B. Wohnzimmer, Fensterbank Ost"
            className="input"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
        )}

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={submitting || slotChecking}
        >
          {slotChecking
            ? 'Slot wird geprüft…'
            : submitting
              ? 'Wird gespeichert…'
              : 'Pflanze hinzufügen'}
        </button>
      </form>
    </div>
  )
}
