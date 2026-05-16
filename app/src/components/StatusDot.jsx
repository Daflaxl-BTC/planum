const COLORS = {
  good: 'bg-emerald-400 shadow-emerald-400/50',
  needs: 'bg-amber-400 shadow-amber-400/50',
  urgent: 'bg-red-400 shadow-red-400/50',
  unknown: 'bg-sage-300 shadow-sage-300/40',
}

export default function StatusDot({ status = 'good', size = 'md', pulse = true }) {
  const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' }
  const animate = pulse && (status === 'needs' || status === 'urgent')
  return (
    <span
      className={`inline-block rounded-full shadow-lg ${sizes[size]} ${COLORS[status] ?? COLORS.unknown} ${animate ? 'animate-pulse' : ''}`}
      aria-label={`Status: ${status}`}
    />
  )
}
