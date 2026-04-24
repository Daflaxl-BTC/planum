import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function AuthCallback() {
  const { session, loading } = useAuth()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase client auto-processes the hash on load; wait a tick for it to settle.
    const t = setTimeout(() => setReady(true), 400)
    return () => clearTimeout(t)
  }, [])

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-moss-200 border-t-moss-600 animate-spin" />
      </div>
    )
  }
  return <Navigate to={session ? '/' : '/login'} replace />
}
