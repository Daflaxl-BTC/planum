// Anmeldung an der Warteliste. Bewusst plain fetch statt @supabase/supabase-js:
// das Paket kostet rund 40 kB gzip und wird hier fuer genau einen POST nicht
// gebraucht. Der anon key ist oeffentlich — das ist so vorgesehen, geschrieben
// wird ausschliesslich service-role innerhalb der Edge Function.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const WAITLIST_STATE = {
  idle: 'idle',
  pending: 'pending',
  success: 'success',
  invalid: 'invalid',
  consentMissing: 'consentMissing',
  error: 'error',
}

export async function subscribeToWaitlist({
  email,
  consent,
  consentVersion,
  company,
  renderedAt,
}) {
  if (!consent) return WAITLIST_STATE.consentMissing

  const trimmed = (email ?? '').trim()
  // Grobpruefung im Client, damit ein Tippfehler keinen Request kostet.
  // Massgeblich ist die Pruefung in der Edge Function.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
    return WAITLIST_STATE.invalid
  }

  if (!SUPABASE_URL || !ANON_KEY) {
    console.error('waitlist: VITE_SUPABASE_URL oder VITE_SUPABASE_ANON_KEY fehlt')
    return WAITLIST_STATE.error
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/waitlist-subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        email: trimmed,
        consent: true,
        consentVersion,
        company: company ?? '',
        renderedAt,
      }),
    })

    if (res.ok) return WAITLIST_STATE.success
    if (res.status === 400) return WAITLIST_STATE.invalid
    return WAITLIST_STATE.error
  } catch {
    return WAITLIST_STATE.error
  }
}
