import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import StatusDot from '../components/StatusDot.jsx'
import { PlusIcon, SparklesIcon } from '../components/Icons.jsx'
import { overallStatus, statusForDueDate, formatDueLabel } from '../lib/careLogic.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data, error } = await supabase
        .from('plants')
        .select(`
          id, nickname, photo_url, detected_species_name, location,
          next_water_due_at, next_fertilize_due_at,
          species:plant_species(common_name_de, scientific_name, emoji)
        `)
        .is('archived_at', null)
        .order('created_at', { ascending: false })
      if (!active) return
      if (error) console.error(error)
      setPlants(data ?? [])
      setLoading(false)
    })()
    return () => { active = false }
  }, [])

  const counts = plants.reduce((acc, p) => {
    const s = overallStatus(p)
    acc[s] = (acc[s] || 0) + 1
    return acc
  }, {})

  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
    || user?.email?.split('@')[0]
    || 'du'

  return (
    <div>
      {/* Header */}
      <header className="px-6 pt-10 pb-6">
        <p className="text-sm text-sage-500">Hallo, {firstName}</p>
        <h1 className="font-display text-3xl text-sage-900 mt-0.5">Deine Pflanzen</h1>

        {plants.length > 0 && (
          <div className="mt-5 flex gap-2">
            <StatusPill status="urgent" count={counts.urgent || 0} label="Dringend" />
            <StatusPill status="needs" count={counts.needs || 0} label="Bald fällig" />
            <StatusPill status="good" count={counts.good || 0} label="OK" />
          </div>
        )}
      </header>

      {/* Content */}
      <div className="px-6">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card p-4 animate-pulse flex gap-3">
                <div className="w-14 h-14 rounded-2xl bg-sage-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 bg-sage-100 rounded" />
                  <div className="h-2.5 w-1/2 bg-sage-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : plants.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="space-y-3">
            {plants.map((p) => (
              <PlantCard key={p.id} plant={p} />
            ))}
          </ul>
        )}
      </div>

      {/* FAB */}
      <Link
        to="/plant/new"
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-moss-600 text-white shadow-lg shadow-moss-600/30 flex items-center justify-center hover:bg-moss-700 transition-colors z-30"
        aria-label="Pflanze hinzufügen"
      >
        <PlusIcon className="w-6 h-6" />
      </Link>
    </div>
  )
}

function StatusPill({ status, count, label }) {
  const colors = {
    good: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    needs: 'bg-amber-50 text-amber-700 border-amber-100',
    urgent: 'bg-red-50 text-red-700 border-red-100',
  }
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${colors[status]}`}>
      <StatusDot status={status} size="sm" pulse={false} />
      <span>{count} {label}</span>
    </div>
  )
}

function PlantCard({ plant }) {
  const status = overallStatus(plant)
  const speciesName = plant.species?.common_name_de || plant.detected_species_name || 'Unbekannte Art'

  let headline = 'Alles bestens'
  const waterStatus = statusForDueDate(plant.next_water_due_at)
  const fertStatus = statusForDueDate(plant.next_fertilize_due_at)
  if (waterStatus === 'urgent') headline = formatDueLabel(plant.next_water_due_at, 'Gießen')
  else if (fertStatus === 'urgent') headline = formatDueLabel(plant.next_fertilize_due_at, 'Düngen')
  else if (waterStatus === 'needs') headline = formatDueLabel(plant.next_water_due_at, 'Gießen')
  else if (fertStatus === 'needs') headline = formatDueLabel(plant.next_fertilize_due_at, 'Düngen')
  else if (plant.next_water_due_at) headline = formatDueLabel(plant.next_water_due_at, 'Gießen')

  return (
    <li>
      <Link
        to={`/plant/${plant.id}`}
        className="card p-4 flex items-center gap-3 hover:border-sage-200 hover:shadow-md transition-all group"
      >
        <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center overflow-hidden flex-shrink-0">
          {plant.photo_url ? (
            <img src={plant.photo_url} alt={plant.nickname} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">{plant.species?.emoji || '🪴'}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sage-900 truncate">{plant.nickname}</p>
          <p className="text-xs text-sage-400 truncate">{speciesName}{plant.location ? ` · ${plant.location}` : ''}</p>
          <p className={`text-xs mt-1 font-medium ${
            status === 'urgent' ? 'text-red-600' :
            status === 'needs' ? 'text-amber-700' : 'text-sage-500'
          }`}>
            {headline}
          </p>
        </div>
        <StatusDot status={status} />
      </Link>
    </li>
  )
}

function EmptyState() {
  return (
    <div className="card p-8 text-center mt-4">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-moss-100 flex items-center justify-center mb-4">
        <SparklesIcon className="w-7 h-7 text-moss-600" />
      </div>
      <h2 className="font-display text-xl text-sage-900 mb-2">Noch keine Pflanzen</h2>
      <p className="text-sm text-sage-500 mb-6">
        Füge deine erste Pflanze hinzu und lass die KI bei der Pflege helfen.
      </p>
      <Link to="/plant/new" className="btn-primary w-full">
        <PlusIcon className="w-5 h-5 mr-2" />
        Erste Pflanze hinzufügen
      </Link>
    </div>
  )
}
