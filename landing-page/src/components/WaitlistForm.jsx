import { useId, useRef, useState } from 'react'
import { WAITLIST } from '../content/site'
import { subscribeToWaitlist, WAITLIST_STATE } from '../lib/waitlist'
import { Honeypot } from './ui/Field'
import { IconArrowRight, IconCheck } from './icons'

// Ein Formular fuer alle Stellen der Seite. Feld und Knopf sitzen in einer
// gemeinsamen Pille. Der Einwilligungshaken erscheint IMMER und ist nie
// vorausgewaehlt — eine vorbelegte Checkbox ist nach Art. 4 Nr. 11 DSGVO keine
// wirksame Einwilligung (EuGH, C-673/17 "Planet49").

const TONES = {
  dark: {
    shell: 'bg-white/[0.06] ring-white/15 focus-within:ring-terra-300/70',
    input: 'text-paper placeholder:text-paper/40',
    consent: 'text-paper/60',
    status: 'text-paper/70',
    box: 'border-white/30 accent-terra-500',
    problem: 'text-terra-300',
  },
  light: {
    shell: 'bg-white ring-ink/15 focus-within:ring-terra-500/70',
    input: 'text-ink placeholder:text-ink/40',
    consent: 'text-ink/65',
    status: 'text-ink/70',
    box: 'border-ink/30 accent-terra-500',
    problem: 'text-terra-700',
  },
}

export function WaitlistForm({ tone = 'dark', submitLabel, className = '' }) {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [company, setCompany] = useState('')
  const [state, setState] = useState(WAITLIST_STATE.idle)
  const renderedAt = useRef(Date.now())
  const id = useId()
  const statusId = `${id}-status`
  const t = TONES[tone]

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
  const problem = invalid || state === WAITLIST_STATE.error || state === WAITLIST_STATE.consentMissing

  return (
    <form onSubmit={onSubmit} noValidate className={`relative ${className}`}>
      <Honeypot value={company} onChange={(e) => setCompany(e.target.value)} />

      <div
        className={`flex flex-col gap-2 rounded-[1.6rem] p-1.5 ring-1 ring-inset transition-shadow sm:flex-row sm:items-center sm:rounded-full ${t.shell} ${
          invalid ? '!ring-terra-300' : ''
        }`}
      >
        <label htmlFor={`${id}-email`} className="sr-only">
          {WAITLIST.formLabel}
        </label>
        <input
          id={`${id}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={WAITLIST.formPlaceholder}
          autoComplete="email"
          required
          aria-invalid={invalid || undefined}
          aria-describedby={statusId}
          disabled={busy || done}
          className={`min-w-0 flex-1 bg-transparent px-4 py-2.5 text-body outline-none ${t.input}`}
        />
        <button type="submit" className="btn-primary shrink-0" disabled={busy || done}>
          {done ? (
            <>
              <IconCheck className="h-4 w-4" /> Prüfe dein Postfach
            </>
          ) : (
            <>
              {submitLabel ?? WAITLIST.submit}
              <IconArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      <label className={`mt-4 flex cursor-pointer items-start gap-3 text-note ${t.consent}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className={`mt-0.5 h-4 w-4 shrink-0 rounded-xs ${t.box}`}
        />
        <span>{WAITLIST.consent}</span>
      </label>

      {/* aria-live: Statusaenderungen erreichen auch Screenreader. */}
      <p
        id={statusId}
        aria-live="polite"
        className={`mt-3 min-h-[1.5em] text-small ${problem ? t.problem : t.status}`}
      >
        {message}
      </p>
    </form>
  )
}
