import { describe, it, expect } from 'vitest'
import {
  addDays,
  statusForDueDate,
  overallStatus,
  computeNextDue,
  formatDueLabel,
} from './careLogic.js'

const NOW = new Date('2026-05-16T12:00:00Z')

describe('statusForDueDate', () => {
  it('returns null when no date is provided', () => {
    expect(statusForDueDate(null, NOW)).toBeNull()
    expect(statusForDueDate(undefined, NOW)).toBeNull()
  })

  it('returns urgent for past due dates', () => {
    expect(statusForDueDate(addDays(NOW, -1), NOW)).toBe('urgent')
  })

  it('returns needs for due within 48h', () => {
    expect(statusForDueDate(addDays(NOW, 1), NOW)).toBe('needs')
  })

  it('returns good for due in more than 48h', () => {
    expect(statusForDueDate(addDays(NOW, 5), NOW)).toBe('good')
  })
})

describe('overallStatus', () => {
  it('returns unknown when no due dates are set', () => {
    // Regression fuer M3: vorher gab die Tautologie hier 'good' zurueck.
    expect(overallStatus({})).toBe('unknown')
    expect(
      overallStatus({ next_water_due_at: null, next_fertilize_due_at: null }),
    ).toBe('unknown')
  })

  it('returns good when both due dates are in the future', () => {
    const plant = {
      next_water_due_at: addDays(NOW, 7).toISOString(),
      next_fertilize_due_at: addDays(NOW, 30).toISOString(),
    }
    expect(overallStatus(plant)).toBe('good')
  })

  it('escalates to urgent if any due date is overdue', () => {
    const plant = {
      next_water_due_at: addDays(NOW, -1).toISOString(),
      next_fertilize_due_at: addDays(NOW, 30).toISOString(),
    }
    expect(overallStatus(plant)).toBe('urgent')
  })

  it('returns needs when due within 48h but not overdue', () => {
    const plant = {
      next_water_due_at: addDays(NOW, 1).toISOString(),
      next_fertilize_due_at: addDays(NOW, 30).toISOString(),
    }
    expect(overallStatus(plant)).toBe('needs')
  })
})

describe('computeNextDue', () => {
  it('uses plant override for water interval', () => {
    const out = computeNextDue({ water_interval_days: 3 }, { water_interval_days: 7 }, 'water', NOW)
    expect(out.getTime() - NOW.getTime()).toBe(3 * 24 * 60 * 60 * 1000)
  })

  it('falls back to species interval', () => {
    const out = computeNextDue({}, { water_interval_days: 7 }, 'water', NOW)
    expect(out.getTime() - NOW.getTime()).toBe(7 * 24 * 60 * 60 * 1000)
  })

  it('falls back to default 7 days for water', () => {
    const out = computeNextDue({}, null, 'water', NOW)
    expect(out.getTime() - NOW.getTime()).toBe(7 * 24 * 60 * 60 * 1000)
  })

  it('returns null for unknown action', () => {
    expect(computeNextDue({}, {}, 'sing-to-it', NOW)).toBeNull()
  })
})

describe('formatDueLabel', () => {
  it('marks no date as planned', () => {
    expect(formatDueLabel(null, 'Gießen', NOW)).toBe('Gießen geplant')
  })

  it('uses singular for one day overdue', () => {
    expect(formatDueLabel(addDays(NOW, -1), 'Gießen', NOW)).toBe('Gießen 1 Tag überfällig')
  })

  it('uses plural for multiple days overdue', () => {
    expect(formatDueLabel(addDays(NOW, -3), 'Gießen', NOW)).toBe('Gießen 3 Tage überfällig')
  })
})
