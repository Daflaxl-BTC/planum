import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { CameraIcon, ChevronLeftIcon, SparklesIcon } from '../components/Icons.jsx'
import { computeNextDue } from '../lib/careLogic.js'

export default function RegisterPlant() {
  const navigate = useNavigate()
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

  useEffect(() => {
    supabase
      .from('plant_species')
      .select('id, common_name_de, scientific_name, emoji')
      .order('common_name_de')
      .then(({ data }) => setSpecies(data ?? []))
  }, [])

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

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

      const selectedSpecies = species.find((s) => s.id === form.species_id)
      // fetch full species row for intervals
      let fullSpecies = null
      if (selectedSpecies) {
        const { data } = await supabase.from('plant_species').select('*').eq('id', selectedSpecies.id).single()
        fullSpecies = data
      }

      const now = new Date()
      const nextWater = fullSpecies ? computeNextDue({}, fullSpecies, 'water', now) : null
      const nextFert = fullSpecies ? computeNextDue({}, fullSpecies, 'fertilize', now) : null

      const { data: inserted, error: insErr } = await supabase
        .from('plants')
        .insert({
          user_id: user.id,
          nickname: form.nickname.trim(),
          species_id: form.species_id || null,
          location: form.location.trim() || null,
          photo_url,
          next_water_due_at: nextWater?.toISOString() ?? null,
          next_fertilize_due_at: nextFert?.toISOString() ?? null,
        })
        .select('id')
        .single()
      if (insErr) throw insErr

      navigate(`/plant/${inserted.id}`, { replace: true })
    } catch (err) {
      console.error(err)
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

          <div className="mt-2 flex items-center gap-2 text-xs text-sage-400">
            <SparklesIcon className="w-4 h-4 text-moss-500" />
            KI-Erkennung folgt – wähle vorerst manuell aus
          </div>
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

        {/* Species */}
        <div>
          <label className="label">Art</label>
          <select
            value={form.species_id}
            onChange={(e) => setForm({ ...form, species_id: e.target.value })}
            className="input appearance-none bg-white"
          >
            <option value="">— Art wählen —</option>
            {species.map((s) => (
              <option key={s.id} value={s.id}>
                {s.emoji} {s.common_name_de} · {s.scientific_name}
              </option>
            ))}
          </select>
          <p className="text-xs text-sage-400 mt-1">Legt automatisch Gieß- und Düngeintervalle fest.</p>
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

        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Wird gespeichert…' : 'Pflanze hinzufügen'}
        </button>
      </form>
    </div>
  )
}
