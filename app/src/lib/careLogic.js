const DAY_MS = 24 * 60 * 60 * 1000

export function addDays(date, days) {
  const d = new Date(date)
  d.setTime(d.getTime() + days * DAY_MS)
  return d
}

export function addMonths(date, months) {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

export function effectiveInterval(plant, field, species) {
  return plant[field] ?? species?.[field] ?? null
}

// Returns 'good' | 'needs' | 'urgent' | null for one due date
export function statusForDueDate(dueAt, now = new Date()) {
  if (!dueAt) return null
  const due = new Date(dueAt).getTime()
  const diffMs = due - now.getTime()
  if (diffMs < 0) return 'urgent'
  if (diffMs < 2 * DAY_MS) return 'needs'
  return 'good'
}

// Worst-of for overall plant status
export function overallStatus(plant) {
  const statuses = [
    statusForDueDate(plant.next_water_due_at),
    statusForDueDate(plant.next_fertilize_due_at),
  ].filter(Boolean)
  if (statuses.includes('urgent')) return 'urgent'
  if (statuses.includes('needs')) return 'needs'
  return statuses.length ? 'good' : 'good'
}

export function formatDueLabel(dueAt, actionLabel, now = new Date()) {
  if (!dueAt) return `${actionLabel} geplant`
  const due = new Date(dueAt).getTime()
  const diffMs = due - now.getTime()
  const diffDays = Math.round(diffMs / DAY_MS)
  if (diffMs < 0) {
    const overdue = Math.abs(diffDays)
    if (overdue === 0) return `${actionLabel} heute überfällig`
    return `${actionLabel} ${overdue} Tag${overdue === 1 ? '' : 'e'} überfällig`
  }
  if (diffDays === 0) return `${actionLabel} heute`
  if (diffDays === 1) return `${actionLabel} morgen`
  return `${actionLabel} in ${diffDays} Tagen`
}

// For a plant + species + action, compute next due timestamp from "now"
export function computeNextDue(plant, species, action, from = new Date()) {
  if (action === 'water') {
    const days = plant.water_interval_days ?? species?.water_interval_days ?? 7
    return addDays(from, days)
  }
  if (action === 'fertilize') {
    const days = plant.fertilize_interval_days ?? species?.fertilize_interval_days ?? 30
    return addDays(from, days)
  }
  if (action === 'repot') {
    const months = plant.repot_interval_months ?? species?.repot_interval_months ?? 24
    return addMonths(from, months)
  }
  return null
}

export function prettyDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function prettyRelative(date, now = new Date()) {
  if (!date) return 'nie'
  const diff = now.getTime() - new Date(date).getTime()
  const days = Math.floor(diff / DAY_MS)
  if (days <= 0) return 'heute'
  if (days === 1) return 'gestern'
  if (days < 7) return `vor ${days} Tagen`
  if (days < 30) return `vor ${Math.floor(days / 7)} Woche${Math.floor(days / 7) === 1 ? '' : 'n'}`
  if (days < 365) return `vor ${Math.floor(days / 30)} Monat${Math.floor(days / 30) === 1 ? '' : 'en'}`
  return `vor ${Math.floor(days / 365)} Jahr${Math.floor(days / 365) === 1 ? '' : 'en'}`
}
