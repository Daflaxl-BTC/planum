import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { LeafIcon } from '../components/Icons.jsx'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | busy | done | error
  const [error, setError] = useState(null)

  // Der Recovery-Link setzt via detectSessionInUrl automatisch eine Session.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(!!data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('busy')
    setError(null)
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setStatus('error')
      setError(error.message)
      return
    }
    setStatus('done')
    setTimeout(() => navigate('/', { replace: true }), 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-moss-600 flex items-center justify-center mb-4 shadow-lg shadow-moss-600/20">
            <LeafIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl text-sage-900">Neues Passwort</h1>
          <p className="text-sage-500 text-sm mt-1">Vergib ein neues Passwort für dein Konto</p>
        </div>

        {status === 'done' ? (
          <div className="card p-6 text-center">
            <p className="text-sm text-sage-600">Passwort geändert. Du wirst weitergeleitet…</p>
          </div>
        ) : !ready ? (
          <div className="card p-6 text-center">
            <p className="text-sm text-sage-500 leading-relaxed">
              Dieser Link ist ungültig oder abgelaufen. Fordere über „Passwort vergessen?" einen neuen an.
            </p>
            <Link to="/login" className="btn-ghost mt-6 text-sm inline-block">Zur Anmeldung</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Neues Passwort</label>
              <input
                type="password"
                required
                minLength={8}
                autoFocus
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mindestens 8 Zeichen"
                className="input"
                disabled={status === 'busy'}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full" disabled={status === 'busy'}>
              {status === 'busy' ? 'Bitte warten…' : 'Passwort speichern'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
