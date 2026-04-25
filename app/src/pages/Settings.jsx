import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { LogoutIcon } from '../components/Icons.jsx'

export default function Settings() {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => setProfile(data))
  }, [user])

  async function toggleEmails(next) {
    if (!profile) return
    setSaving(true)
    const { data, error } = await supabase
      .from('profiles')
      .update({ notification_email: next })
      .eq('id', profile.id)
      .select()
      .single()
    if (!error) setProfile(data)
    setSaving(false)
  }

  return (
    <div className="pb-8">
      <header className="px-6 pt-10 pb-6">
        <h1 className="font-display text-3xl text-sage-900">Profil</h1>
      </header>

      <div className="px-6 space-y-4">
        <div className="card p-5">
          <p className="text-xs text-sage-400 uppercase tracking-wide">Angemeldet als</p>
          <p className="font-medium text-sage-900 mt-0.5 break-all">{user?.email}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <p className="font-medium text-sage-900">E-Mail-Erinnerungen</p>
              <p className="text-xs text-sage-500 mt-0.5">Wir schicken dir eine Mail, wenn Pflanzen dringend Pflege brauchen.</p>
            </div>
            <button
              onClick={() => toggleEmails(!profile?.notification_email)}
              disabled={!profile || saving}
              role="switch"
              aria-checked={!!profile?.notification_email}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full transition-colors ${
                profile?.notification_email ? 'bg-moss-600' : 'bg-sage-200'
              } disabled:opacity-50`}
            >
              <span className={`inline-block h-5 w-5 translate-y-1 rounded-full bg-white shadow transition-transform ${
                profile?.notification_email ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        <button onClick={signOut} className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white border border-sage-200 text-sage-700 font-medium hover:bg-sage-50 transition-colors">
          <LogoutIcon className="w-4 h-4" />
          Abmelden
        </button>
      </div>
    </div>
  )
}
