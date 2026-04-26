import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { ChevronLeftIcon, QrIcon, LeafIcon, CheckIcon } from '../components/Icons.jsx'

// Zustaende:
//   loading   -> RPC laeuft
//   unknown   -> Slot existiert nicht
//   needs_activation -> Paket noch nicht aktiviert (User muss Code eingeben)
//   needs_join -> Paket aktiviert, User nicht im Haushalt
//   redirect_register -> Slot frei in unserem Haushalt -> Pflanze registrieren
//   redirect_plant    -> Slot bereits einer Pflanze zugeordnet
//   error            -> sonstiges
//
// `slotUuid` ist der UUID-Teil aus dem QR-Code-Link  /qr/<uuid>.

export default function ScanResolver() {
  const { slotUuid } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [state, setState] = useState({ kind: 'loading' })

  useEffect(() => {
    if (authLoading) return
    if (!user) return
    resolve()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, slotUuid])

  async function resolve() {
    setState({ kind: 'loading' })
    const { data, error } = await supabase.rpc('lookup_plant_uuid', {
      p_plant_uuid: slotUuid,
    })
    if (error) {
      setState({ kind: 'error', message: error.message })
      return
    }
    const row = Array.isArray(data) ? data[0] : data
    if (!row) {
      setState({ kind: 'unknown' })
      return
    }
    if (!row.package_activated) {
      setState({ kind: 'needs_activation' })
      return
    }
    if (!row.user_is_member) {
      setState({ kind: 'needs_join', householdName: row.household_name })
      return
    }
    if (row.plant_registered && row.plant_id) {
      setState({ kind: 'redirect_plant', plantId: row.plant_id })
      return
    }
    setState({ kind: 'redirect_register', householdId: row.household_id })
  }

  if (!authLoading && !user) {
    return <Navigate to="/login" state={{ from: `/qr/${slotUuid}` }} replace />
  }

  if (state.kind === 'redirect_plant') {
    return <Navigate to={`/plant/${state.plantId}`} replace />
  }
  if (state.kind === 'redirect_register') {
    return (
      <Navigate
        to={`/plant/new?slot=${slotUuid}&household=${state.householdId}`}
        replace
      />
    )
  }

  return (
    <div className="pb-8">
      <div className="px-6 pt-10 pb-6 flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-white border border-sage-100 flex items-center justify-center hover:bg-sage-50 transition-colors"
          aria-label="Zurück"
        >
          <ChevronLeftIcon className="w-5 h-5 text-sage-800" />
        </button>
        <h1 className="font-display text-2xl text-sage-900">QR-Code gescannt</h1>
      </div>

      <div className="px-6">
        {state.kind === 'loading' && <Loading />}
        {state.kind === 'unknown' && <UnknownSlot />}
        {state.kind === 'needs_activation' && (
          <NeedsActivation slotUuid={slotUuid} onSuccess={resolve} />
        )}
        {state.kind === 'needs_join' && (
          <NeedsJoin
            slotUuid={slotUuid}
            householdName={state.householdName}
            onSuccess={resolve}
          />
        )}
        {state.kind === 'error' && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {state.message}
          </p>
        )}
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="card p-8 text-center">
      <div className="w-8 h-8 mx-auto rounded-full border-2 border-moss-200 border-t-moss-600 animate-spin" />
      <p className="text-sm text-sage-500 mt-4">QR-Code wird gepruft…</p>
    </div>
  )
}

function UnknownSlot() {
  return (
    <div className="card p-6 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-sage-100 flex items-center justify-center mb-4">
        <QrIcon className="w-7 h-7 text-sage-400" />
      </div>
      <h2 className="font-display text-xl text-sage-900 mb-2">Code unbekannt</h2>
      <p className="text-sm text-sage-500">
        Diesen QR-Code kennen wir nicht. Pruefe, ob du den richtigen Sticker
        gescannt hast.
      </p>
    </div>
  )
}

function NeedsActivation({ slotUuid, onSuccess }) {
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      // Default-Haushalt des Users holen (in der Praxis genau einer).
      const { data: members, error: mErr } = await supabase
        .from('household_members')
        .select('household_id, joined_at')
        .order('joined_at', { ascending: true })
        .limit(1)
      if (mErr) throw mErr
      const householdId = members?.[0]?.household_id
      if (!householdId) {
        throw new Error(
          'Du bist noch in keinem Haushalt. Logge dich neu ein und versuch es erneut.',
        )
      }

      const { error: actErr } = await supabase.rpc('activate_qr_package', {
        p_code: code.trim(),
        p_household_id: householdId,
      })
      if (actErr) throw actErr
      // Erfolg — Slot-Status neu pruefen, dann ggf. Redirect zur Plant-Reg.
      onSuccess?.()
    } catch (err) {
      setError(err.message || 'Aktivierung fehlgeschlagen.')
      setSubmitting(false)
    }
  }

  return (
    <div className="card p-6">
      <div className="w-14 h-14 rounded-2xl bg-moss-100 flex items-center justify-center mb-4">
        <LeafIcon className="w-7 h-7 text-moss-600" />
      </div>
      <h2 className="font-display text-xl text-sage-900 mb-2">
        Paket aktivieren
      </h2>
      <p className="text-sm text-sage-500 mb-5">
        Dieser Sticker gehoert zu einem Paket, das noch nicht freigeschaltet
        ist. Gib den Code aus deiner Verpackung ein.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Aktivierungscode</label>
          <input
            type="text"
            required
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="PLNM-XXXX-YYYY"
            className="input font-mono tracking-wider"
            disabled={submitting}
          />
          <p className="text-xs text-sage-400 mt-1">
            Steht innen in deiner Planum-Verpackung.
          </p>
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </p>
        )}
        <button type="submit" className="btn-primary w-full" disabled={submitting}>
          {submitting ? 'Wird aktiviert…' : 'Code aktivieren'}
        </button>
      </form>
    </div>
  )
}

function NeedsJoin({ slotUuid, householdName, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleJoin() {
    if (submitting) return
    setSubmitting(true)
    setError(null)
    const { error: joinErr } = await supabase.rpc('join_household_via_slot', {
      p_slot_uuid: slotUuid,
    })
    if (joinErr) {
      setError(joinErr.message || 'Beitritt fehlgeschlagen.')
      setSubmitting(false)
      return
    }
    onSuccess?.()
  }

  return (
    <div className="card p-6">
      <div className="w-14 h-14 rounded-2xl bg-moss-100 flex items-center justify-center mb-4">
        <CheckIcon className="w-7 h-7 text-moss-600" />
      </div>
      <h2 className="font-display text-xl text-sage-900 mb-2">
        Haushalt beitreten?
      </h2>
      <p className="text-sm text-sage-500 mb-5">
        Diese Pflanze gehoert zum Haushalt
        {householdName ? (
          <> <span className="font-medium text-sage-800">„{householdName}"</span></>
        ) : null}
        . Wenn du beitrittst, kannst du die Pflanzen darin sehen und mitpflegen.
      </p>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-3">
          {error}
        </p>
      )}
      <button
        onClick={handleJoin}
        className="btn-primary w-full"
        disabled={submitting}
      >
        {submitting ? 'Trete bei…' : 'Beitreten'}
      </button>
    </div>
  )
}
