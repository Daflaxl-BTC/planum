// Production-Safe Logging.
// In Production hat console.* keinen Sink (kein Sentry/Datadog konfiguriert),
// aber Fehlerobjekte koennen User-IDs / Slot-UUIDs / JWT-Claims im Stack
// haben. Bis ein PII-Scrubbing-faehiges Error-Reporting (z.B. Sentry mit
// beforeSend-Filter) eingebaut ist, gaten wir console.* hinter import.meta.env.DEV.

export function devError(...args) {
  if (import.meta.env?.DEV) console.error(...args)
}

export function devWarn(...args) {
  if (import.meta.env?.DEV) console.warn(...args)
}
