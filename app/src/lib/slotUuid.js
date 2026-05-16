// Slot-UUID-Parser fuer den QR-Scanner.
//
// Akzeptiert die Formate, die unsere QR-Sticker produzieren koennen:
//   1. Voll-qualifizierte URL mit Pfad /plant/<uuid>, /scan/<uuid>,
//      /qr/<uuid> oder /s/<uuid> (Production-Format).
//   2. URL mit UUID in Pfad oder Query (Legacy-/Diagnose-Stickern).
//   3. Roh-UUID (Fallback fuer manuell eingegebene Codes).
//
// Strikte RFC-4122-v4-Validierung: Slot-IDs werden in der Datenbank via
// `gen_random_uuid()` erzeugt, sind also IMMER v4 (Version-Nibble = 4,
// Variant-Nibble in {8,9,a,b}). Damit faellt jeder beliebige UUID-foermige
// Substring aus phishing-QRs raus, bevor wir das Backend mit einem
// RPC-Call belasten.

// 13. Hex-Char = '4' (Version), 17. Hex-Char in [89ab] (Variant). Case-i.
const UUID_V4 = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i
const UUID_V4_PATH = /\/(?:plant|scan|qr|s)\/([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:[/?#]|$)/i

export function parseSlotUuid(text) {
  if (!text) return null
  try {
    const url = new URL(text)
    const m = url.pathname.match(UUID_V4_PATH)
    if (m) return m[1].toLowerCase()
    const fallback = url.pathname.match(UUID_V4) || url.search.match(UUID_V4)
    if (fallback) return fallback[0].toLowerCase()
  } catch {
    const m = text.trim().match(UUID_V4)
    if (m) return m[0].toLowerCase()
  }
  return null
}
