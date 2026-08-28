import { useReveal } from '../../hooks/useReveal'

// Einblenden: nur opacity + 8px Translate, 480ms, einmalig.
// delay in ms, Stagger bewusst <= 60ms halten.
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const { ref, visible } = useReveal()

  return (
    <Tag
      ref={ref}
      data-visible={visible ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
