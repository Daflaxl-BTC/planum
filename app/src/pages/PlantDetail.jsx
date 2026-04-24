import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import StatusDot from '../components/StatusDot.jsx'
import {
  ChevronLeftIcon, DropletIcon, FlaskIcon, RepotIcon,
  SparklesIcon, SunIcon,
} from '../components/Icons.jsx'
import {
  overallStatus, formatDueLabel, prettyDate, prettyRelative, computeNextDue,
} from '../lib/careLogic.js'

const ACTION_META = {
  water: {
    label: 'Gegossen',
    verb: 'Gießen',
    icon: DropletIcon,
    lastField: 'last_watered_at',
    dueField: 'next_water_due_at',
    bubble: 'bg-blue-100 text-blue-700',
    btn: 'bg-blue-50 hover:bg-blue-100 text-blue-700 active:bg-blue-200',
  },
  fertilize: {
    label: 'Gedüngt',
    verb: 'Düngen',
    icon: FlaskIcon,
    lastField: 'last_fertilized_at',
    dueField: 'next_fertilize_due_at',
    bubble: 'bg-amber-100 text-amber-700',
    btn: 'bg-amber-50 hover:bg-amber-100 text-amber-700 active:bg-amber-200',
  },
  repot: {
    label: 'Umgetopft',
    verb: 'Umtopfen',
    icon: RepotIcon,
    lastField: 'last_repotted_at',
    dueField: 'next_repot_due_at',
    bubble: 'bg-earth-100 text-earth-700',
    btn: 'bg-earth-50 hover:bg-earth-100 text-earth-700 active:bg-earth-200',
  },
}

export default function PlantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [plant, setPlant] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pendingAction, setPendingAction] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    const [{ data: plantData, error: plantErr }, { data: logData }] = await Promise.all([
      supabase
        .from('plants')
        .select('*, species:plant_species(*)')
        .eq('id', id)
        .maybeSingle(),
      supabase
        .from('care_logs')
        .select('*')
        .eq('plant_id', id)
        .order('logged_at', { ascending: false })
        .limit(20),
    ])
    if (plantErr) console.error(plantErr)
    setPlant(plantData)
    setLogs(logData ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  async function logAction(action) {
    if (!plant || pendingAction) return
    setPendingAction(action)
    const meta = ACTION_META[action]
    const now = new Date()
    const nextDue = computeNextDue(plant, plant.species, action, now)

    const updates = {
      [meta.lastField]: now.toISOString(),
      [meta.dueField]: nextDue ? nextDue.toISOString() : null,
    }

    const { error: logErr } = await supabase.from('care_logs').insert({
      plant_id: plant.id,
      user_id: user.id,
      action,
    })
    if (logErr) {
      console.error(logErr)
      setPendingAction(null)
      return
    }
    const { error: updErr } = await supabase.from('plants').update(updates).eq('id', plant.id)
    if (updErr) console.error(updErr)

    await load()
    setPendingAction(null)
  }

  async function handleDelete() {
    if (!confirm(`"${plant.nickname}" wirklich löschen? Alle Pflegeeinträge gehen verloren.`)) return
    setDeleting(true)
    const { error } = await supabase.from('plants').delete().eq('id', plant.id)
    if (error) {
      alert(error.message)
      setDeleting(false)
      return
    }
    navigate('/', { replace: true })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-moss-200 border-t-moss-600 animate-spin" />
      </div>
    )
  }
  if (!plant) {
    return (
      <div className="p-6 text-center">
        <p className="text-sage-500">Pflanze nicht gefunden.</p>
        <Link to="/" className="btn-ghost mt-4">Zurück</Link>
      </div>
    )
  }

  const status = overallStatus(plant)
  const species = plant.species

  return (
    <div>
      {/* Hero image + header */}
      <div className="relative">
        <div className="h-64 bg-gradient-to-br from-moss-100 to-sage-200 overflow-hidden">
          {plant.photo_url ? (
            <img src={plant.photo_url} alt={plant.nickname} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl">{species?.emoji || '🪴'}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label="Zurück"
        >
          <ChevronLeftIcon className="w-5 h-5 text-sage-800" />
        </button>
      </div>

      <div className="px-6 -mt-6 relative">
        <div className="card p-5">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0">
              <h1 className="font-display text-2xl text-sage-900 truncate">{plant.nickname}</h1>
              <p className="text-sm text-sage-500 italic truncate">
                {species?.scientific_name || plant.detected_species_name || 'Unbekannte Art'}
              </p>
            </div>
            <StatusDot status={status} size="lg" />
          </div>

          {(plant.location || species?.light_requirement) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {plant.location && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sage-100 text-sage-700 text-xs">
                  📍 {plant.location}
                </span>
              )}
              {species?.light_requirement && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs">
                  <SunIcon className="w-3 h-3" /> {LIGHT_LABELS[species.light_requirement]}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Care actions */}
      <section className="px-6 mt-6">
        <h2 className="font-display text-lg text-sage-900 mb-3">Pflege-Aktionen</h2>
        <div className="grid grid-cols-3 gap-3">
          {['water', 'fertilize', 'repot'].map((action) => (
            <CareActionButton
              key={action}
              action={action}
              plant={plant}
              pending={pendingAction === action}
              onPress={() => logAction(action)}
            />
          ))}
        </div>
      </section>

      {/* KI-Tipps */}
      {species?.care_notes && (
        <section className="px-6 mt-6">
          <div className="card p-4 bg-gradient-to-br from-moss-50 to-cream-50 border-moss-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-5 h-5 text-moss-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-moss-700 uppercase tracking-wide mb-1">Pflege-Tipp</p>
                <p className="text-sm text-sage-700 leading-relaxed">{species.care_notes}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* History */}
      <section className="px-6 mt-6">
        <h2 className="font-display text-lg text-sage-900 mb-3">Verlauf</h2>
        {logs.length === 0 ? (
          <div className="card p-6 text-center text-sm text-sage-500">
            Noch keine Einträge. Drücke oben einen Knopf, um deine erste Aktion zu loggen.
          </div>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => {
              const meta = ACTION_META[log.action]
              const Icon = meta?.icon
              return (
                <li key={log.id} className="card p-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${meta?.bubble || 'bg-sage-100 text-sage-700'} flex items-center justify-center flex-shrink-0`}>
                    {Icon && <Icon className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sage-800">{meta?.label || log.action}</p>
                    <p className="text-xs text-sage-400">{prettyRelative(log.logged_at)} · {prettyDate(log.logged_at)}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* Danger zone */}
      <section className="px-6 mt-10 mb-8">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full text-center py-3 rounded-full text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {deleting ? 'Wird gelöscht…' : 'Pflanze löschen'}
        </button>
      </section>
    </div>
  )
}

const LIGHT_LABELS = {
  low: 'Schatten',
  medium: 'Halbschatten',
  bright: 'Hell',
  direct: 'Sonne',
}

function CareActionButton({ action, plant, pending, onPress }) {
  const meta = ACTION_META[action]
  const Icon = meta.icon
  const dueLabel = formatDueLabel(plant[meta.dueField], meta.verb)
  const lastLabel = plant[meta.lastField] ? `Zuletzt: ${prettyRelative(plant[meta.lastField])}` : 'Nie'
  const hint = plant[meta.dueField] ? dueLabel : lastLabel

  return (
    <button
      onClick={onPress}
      disabled={pending}
      className={`${meta.btn} rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all disabled:opacity-50`}
    >
      <Icon className="w-6 h-6" />
      <span className="font-semibold text-sm">{pending ? '…' : meta.label}</span>
      <span className="text-[10px] text-center leading-tight opacity-80">{hint}</span>
    </button>
  )
}
