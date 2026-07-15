// app/src/lib/nfc.js
// Foreground Core NFC NDEF-Read via @exxili/capacitor-nfc.
// Extrahiert slot_uuid aus der NDEF-URL; gleiche Parse-Logik wie bisheriger QR-Pfad.
import { NFC } from '@exxili/capacitor-nfc'
import { Capacitor } from '@capacitor/core'

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

export function parseSlotUuid(text) {
  if (!text) return null
  try {
    const url = new URL(text)
    const m = url.pathname.match(/\/(?:plant|scan|qr|s|p)\/([0-9a-f-]{36})/i)
    if (m) return m[1].toLowerCase()
    const fb = url.pathname.match(UUID_RE) || url.search.match(UUID_RE)
    if (fb) return fb[0].toLowerCase()
  } catch {
    const m = text.trim().match(UUID_RE)
    if (m) return m[0].toLowerCase()
  }
  return null
}

export async function isNfcAvailable() {
  if (Capacitor.getPlatform() !== 'ios') return false
  try { return (await NFC.isSupported()).supported } catch { return false }
}

// Startet eine NFC-Scan-Session, liest die erste NDEF-URL, gibt slot_uuid zurueck.
// @exxili liefert Text-/URI-Records bereits als String (data.string()).
export async function readSlotUuid() {
  return new Promise((resolve, reject) => {
    let done = false
    let offRead = () => {}
    let offErr = () => {}
    const finish = async (fn, arg) => {
      if (done) return; done = true
      offRead(); offErr()
      try { await NFC.cancelScan() } catch { /* egal */ }
      fn(arg)
    }
    offRead = NFC.onRead((data) => {
      const msg = data.string()
      const records = (msg?.messages ?? []).flatMap((m) => m?.records ?? [])
      for (const r of records) {
        const payload = typeof r?.payload === 'string' ? r.payload : String(r?.payload ?? '')
        const uuid = parseSlotUuid(payload)
        if (uuid) return finish(resolve, uuid)
      }
      finish(reject, new Error('Kein Planum-Sticker erkannt.'))
    })
    offErr = NFC.onError((e) => finish(reject, new Error(e?.error || 'NFC-Lesung fehlgeschlagen.')))
    NFC.startScan().catch((e) => finish(reject, e))
  })
}
