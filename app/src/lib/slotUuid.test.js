import { describe, it, expect } from 'vitest'
import { parseSlotUuid } from './slotUuid.js'

const VALID = 'a1b2c3d4-e5f6-4789-9abc-def012345678'

describe('parseSlotUuid', () => {
  it('returns null for empty input', () => {
    expect(parseSlotUuid('')).toBeNull()
    expect(parseSlotUuid(null)).toBeNull()
    expect(parseSlotUuid(undefined)).toBeNull()
  })

  it('extracts uuid from a /qr/ URL', () => {
    expect(parseSlotUuid(`https://app.planum.de/qr/${VALID}`)).toBe(VALID)
  })

  it('extracts uuid from /plant/, /scan/, /s/ paths', () => {
    expect(parseSlotUuid(`https://app.planum.de/plant/${VALID}`)).toBe(VALID)
    expect(parseSlotUuid(`https://app.planum.de/scan/${VALID}`)).toBe(VALID)
    expect(parseSlotUuid(`https://app.planum.de/s/${VALID}`)).toBe(VALID)
  })

  it('lowercases extracted uuids', () => {
    expect(parseSlotUuid(`https://x.example/qr/${VALID.toUpperCase()}`)).toBe(VALID)
  })

  it('falls back to uuid in query string', () => {
    expect(parseSlotUuid(`https://x.example/?id=${VALID}`)).toBe(VALID)
  })

  it('returns null for non-uuid URLs', () => {
    expect(parseSlotUuid('https://example.com/not-a-uuid')).toBeNull()
  })

  it('accepts a bare uuid as fallback', () => {
    expect(parseSlotUuid(VALID)).toBe(VALID)
    expect(parseSlotUuid(`  ${VALID}  `)).toBe(VALID)
  })

  it('returns null for malformed uuids', () => {
    expect(parseSlotUuid('not-a-uuid')).toBeNull()
    expect(parseSlotUuid('a1b2c3d4-e5f6-4789-9abc')).toBeNull()
  })

  it('rejects non-v4 uuids (M7 regression)', () => {
    // Version-Nibble 1 statt 4 -> kein v4, sollte null sein.
    expect(parseSlotUuid('a1b2c3d4-e5f6-1789-9abc-def012345678')).toBeNull()
    // Variant-Nibble c (sollte 8/9/a/b sein) -> kein v4.
    expect(parseSlotUuid('a1b2c3d4-e5f6-4789-cabc-def012345678')).toBeNull()
    // Komplett-Nullen sind nicht RFC-konform.
    expect(parseSlotUuid('00000000-0000-0000-0000-000000000000')).toBeNull()
    // FFFFFF... ist kein v4.
    expect(parseSlotUuid('ffffffff-ffff-ffff-ffff-ffffffffffff')).toBeNull()
  })
})
