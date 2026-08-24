// Sektionsrahmen mit variierendem Rhythmus. Ueberall dasselbe py-32 ist eines
// der deutlichsten Merkmale generisch gebauter Seiten.
const SPACE = {
  sm: 'py-section',
  md: 'py-section md:py-section-lg',
  lg: 'py-section-lg md:py-section-xl',
}

const TONE = {
  paper: 'bg-paper text-ink',
  deep: 'bg-paper-deep text-ink',
  dark: 'bg-moss-900 text-paper',
}

export function Section({
  id,
  space = 'md',
  tone = 'paper',
  className = '',
  children,
  ...rest
}) {
  return (
    <section
      id={id}
      className={`${SPACE[space]} ${TONE[tone]} ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
}
