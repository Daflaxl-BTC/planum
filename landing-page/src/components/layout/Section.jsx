// Sektionsrahmen mit variierendem Rhythmus. Hell und dunkel wechseln sich ab:
// die dunklen Buehnen tragen das 3D-Objekt, die hellen den Lesetext.
const SPACE = {
  none: '',
  sm: 'py-section',
  md: 'py-section md:py-section-lg',
  lg: 'py-section-lg md:py-section-xl',
}

const TONE = {
  paper: 'bg-paper text-ink',
  deep: 'bg-paper-deep text-ink',
  dark: 'bg-night text-paper',
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
      data-tone={tone}
      className={`relative ${SPACE[space]} ${TONE[tone]} ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
}
