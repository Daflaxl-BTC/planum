import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { signInWithApple } from '../lib/appleAuth.js'
import { LeafIcon } from '../components/Icons.jsx'

export default function Login() {
  const { session, loading } = useAuth()
  const location = useLocation()
  const [mode, setMode] = useState('signin') // signin | signup
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | busy | confirm | error
  const [error, setError] = useState(null)

  if (!loading && session) {
    const from = location.state?.from || '/'
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('busy')
    setError(null)

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })
      if (error) {
        setStatus('error')
        setError(error.message)
        return
      }
      // Bei aktivierter E-Mail-Bestaetigung gibt es noch keine Session.
      if (!data.session) {
        setStatus('confirm')
        return
      }
      // Session da -> AuthContext leitet automatisch weiter.
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) {
        setStatus('error')
        setError(error.message)
        return
      }
    }
    setStatus('idle')
  }

  async function handleApple() {
    setError(null)
    try {
      await signInWithApple()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleReset() {
    if (!email.trim()) {
      setError('Bitte zuerst deine E-Mail eingeben.')
      return
    }
    setStatus('busy')
    setError(null)
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: 'https://planumplants.de/app/reset-password',
    })
    if (error) {
      setStatus('error')
      setError(error.message)
    } else {
      setStatus('reset')
    }
  }

  if (status === 'confirm') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm card p-6 text-center">
          <h2 className="font-display text-xl text-sage-900 mb-1">E-Mail bestätigen</h2>
          <p className="text-sm text-sage-500 leading-relaxed">
            Wir haben dir eine Bestätigungs-Mail an <span className="font-medium text-sage-800">{email}</span> geschickt.
            Bestätige sie und melde dich dann an.
          </p>
          <button onClick={() => { setMode('signin'); setStatus('idle') }} className="btn-ghost mt-6 text-sm">
            Zur Anmeldung
          </button>
        </div>
      </div>
    )
  }

  if (status === 'reset') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm card p-6 text-center">
          <h2 className="font-display text-xl text-sage-900 mb-1">Reset-Mail unterwegs</h2>
          <p className="text-sm text-sage-500 leading-relaxed">
            Wir haben dir einen Link zum Zurücksetzen an <span className="font-medium text-sage-800">{email}</span> geschickt.
            Öffne ihn und vergib ein neues Passwort.
          </p>
          <button onClick={() => setStatus('idle')} className="btn-ghost mt-6 text-sm">
            Zur Anmeldung
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-moss-600 flex items-center justify-center mb-4 shadow-lg shadow-moss-600/20">
            <LeafIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl text-sage-900">
            {mode === 'signup' ? 'Konto erstellen' : 'Willkommen'}
          </h1>
          <p className="text-sage-500 text-sm mt-1">
            {mode === 'signup' ? 'Registriere dich mit E-Mail & Passwort' : 'Melde dich mit E-Mail & Passwort an'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">E-Mail</label>
            <input
              type="email"
              required
              autoFocus
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="du@beispiel.de"
              className="input"
              disabled={status === 'busy'}
            />
          </div>
          <div>
            <label className="label">Passwort</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 8 Zeichen"
              className="input"
              disabled={status === 'busy'}
            />
            {mode === 'signin' && (
              <button
                type="button"
                onClick={handleReset}
                disabled={status === 'busy'}
                className="text-xs text-moss-600 hover:underline mt-2"
              >
                Passwort vergessen?
              </button>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
          )}
          <button type="submit" className="btn-primary w-full" disabled={status === 'busy'}>
            {status === 'busy'
              ? 'Bitte warten…'
              : mode === 'signup' ? 'Registrieren' : 'Anmelden'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-sage-200 flex-1" />
          <span className="text-xs text-sage-400">oder</span>
          <div className="h-px bg-sage-200 flex-1" />
        </div>

        <button onClick={handleApple} className="btn-ghost w-full flex items-center justify-center gap-2 border border-sage-200">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16.365 1.43c0 1.14-.42 2.2-1.14 3-.79.9-2.08 1.6-3.2 1.5-.14-1.1.42-2.28 1.1-3 .77-.83 2.1-1.44 3.24-1.5zM20.7 17.2c-.58 1.34-.86 1.93-1.6 3.12-1.05 1.66-2.53 3.72-4.36 3.74-1.63.02-2.05-1.06-4.26-1.05-2.2.01-2.67 1.07-4.3 1.05-1.83-.02-3.23-1.88-4.28-3.53C-.02 17.5-.34 12.8 1.5 10.35c1-1.35 2.55-2.14 4-2.14 1.5 0 2.44.82 3.68.82 1.2 0 1.93-.82 3.66-.82 1.32 0 2.72.72 3.72 1.96-3.27 1.79-2.74 6.46.14 7.03z" />
          </svg>
          Mit Apple anmelden
        </button>

        <p className="text-center text-sm text-sage-500 mt-6">
          {mode === 'signup' ? 'Schon ein Konto?' : 'Noch kein Konto?'}{' '}
          <button
            type="button"
            onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(null) }}
            className="text-moss-600 hover:underline font-medium"
          >
            {mode === 'signup' ? 'Anmelden' : 'Registrieren'}
          </button>
        </p>

        <p className="text-center text-xs text-sage-400 mt-8">
          Zurück zur <Link to="/" className="text-moss-600 hover:underline">Startseite</Link>
        </p>
      </div>
    </div>
  )
}
