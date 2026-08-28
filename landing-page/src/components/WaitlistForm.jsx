import { useRef, useState } from 'react'
import { WAITLIST } from '../content/site'
import { subscribeToWaitlist, WAITLIST_STATE } from '../lib/waitlist'
import { Field, Honeypot } from './ui/Field'

// Ein Formular, zwei Auftritte: kompakt im Hero, ausfuehrlich in der
// Warteliste-Sektion. Der Einwilligungshaken erscheint in BEIDEN Varianten und
// ist nie vorausgewaehlt — eine vorbelegte Checkbox ist nach Art. 4 Nr. 11
// DSGVO keine wirksame Einwilligung (EuGH, C-673/17 "Planet49").

export function WaitlistForm({ variant = 'full', submitLabel, className = '' }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [company, setCompany] = useState('')
  const [state, setState] = useState(WAITLIST_STATE.idle)
  const renderedAt = useRef(Date.now())

  const busy = state === WAITLIST_STATE.pending
  const done = state === WAITLIST_STATE.success

  async function onSubmit(event) {
    event.preventDefault()
    if (busy || done) return
    setState(WAITLIST_STATE.pending)
    const result = await subscribeToWaitlist({
      email,
      consent,
      consentVersion: WAITLIST.consentVersion,
      company,
      renderedAt: renderedAt.current,
    })
    setState(result)
    if (result === WAITLIST_STATE.success) setEmail('')
  }

  const message = {
    [WAITLIST_STATE.pending]: WAITLIST.states.pending,
    [WAITLIST_STATE.success]: WAITLIST.states.success,
    [WAITLIST_STATE.invalid]: WAITLIST.states.invalid,
    [WAITLIST_STATE.consentMissing]: WAITLIST.states.consentMissing,
    [WAITLIST_STATE.error]: WAITLIST.states.error,
  }[state]

  const invalid = state === WAITLIST_STATE.invalid

  return (
    <form onSubmit={onSubmit} noValidate className={`relative ${className}`}>
      <Honeypot value={company} onChange={(e) => setCompany(e.target.value)} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Field
          label={WAITLIST.formLabel}
          labelHidden
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={WAITLIST.formPlaceholder}
          autoComplete="email"
          required
          invalid={invalid}
          describedBy="waitlist-status"
          className="flex-1"
          disabled={busy || done}
        />
        <button type="submit" className="btn-primary shrink-0" disabled={busy || done}>
          {done ? 'Prüfe dein Postfach' : submitLabel ?? WAITLIST.submit}
        </button>
      </div>

      <label
        className={`flex cursor-pointer items-start gap-3 text-ink/70 ${
          variant === 'compact' ? 'mt-4 text-note' : 'mt-5 text-small'
        }`}
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded-xs border-ink/30 accent-moss-600"
        />
        <span>{WAITLIST.consent}</span>
      </label>

      {/* aria-live: Statusaenderungen erreichen auch Screenreader. */}
      <p
        id="waitlist-status"
        aria-live="polite"
        className={`mt-4 text-small ${
          state === WAITLIST_STATE.error || invalid || state === WAITLIST_STATE.consentMissing
            ? 'text-terra-700'
            : 'text-ink/70'
        }`}
      >
        {message}
      </p>
    </form>
  )
}
