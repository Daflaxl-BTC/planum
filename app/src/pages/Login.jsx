import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { LeafIcon } from '../components/Icons.jsx'

export default function Login() {
  const { session, loading } = useAuth()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState(null)

  if (!loading && session) {
    const from = location.state?.from || '/'
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })
    if (error) {
      setStatus('error')
      setError(error.message)
    } else {
      setStatus('sent')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-moss-600 flex items-center justify-center mb-4 shadow-lg shadow-moss-600/20">
            <LeafIcon className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl text-sage-900">Willkommen</h1>
          <p className="text-sage-500 text-sm mt-1">Melde dich mit deiner E-Mail an</p>
        </div>

        {status === 'sent' ? (
          <div className="card p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-moss-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-moss-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 className="font-display text-xl text-sage-900 mb-1">E-Mail unterwegs</h2>
            <p className="text-sm text-sage-500 leading-relaxed">
              Wir haben dir einen Magic Link an <span className="font-medium text-sage-800">{email}</span> geschickt.
              Klicke den Link, um dich anzumelden.
            </p>
            <button onClick={() => setStatus('idle')} className="btn-ghost mt-6 text-sm">
              Andere E-Mail verwenden
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">E-Mail</label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="du@beispiel.de"
                className="input"
                disabled={status === 'sending'}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full" disabled={status === 'sending'}>
              {status === 'sending' ? 'Wird gesendet…' : 'Magic Link senden'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-sage-400 mt-8">
          Zurück zur <Link to="/" className="text-moss-600 hover:underline">Startseite</Link>
        </p>
      </div>
    </div>
  )
}
