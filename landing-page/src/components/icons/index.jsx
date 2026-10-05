// Strichzeichnungen, 1.4px, gleiche Anmutung wie die Sticker-Line-Art.
// Bewusst keine Emoji als Icon-Ersatz.

const base = {
  'aria-hidden': 'true',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconDrop({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5c3.2 3.6 5.2 6.3 5.2 8.9A5.2 5.2 0 0 1 12 17.6a5.2 5.2 0 0 1-5.2-5.2c0-2.6 2-5.3 5.2-8.9Z" />
    </svg>
  )
}

export function IconMedal({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.4" />
    </svg>
  )
}

export function IconLeaf({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M11 21V9" />
      <path d="M11 12c0-5 3-9 9-10 .8 5.6-2.4 9.6-9 10Z" />
    </svg>
  )
}

export function IconThermometer({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M14 14.2V5a2 2 0 1 0-4 0v9.2a4 4 0 1 0 4 0Z" />
    </svg>
  )
}

export function IconSun({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.4 5.4l1.4 1.4M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4" />
    </svg>
  )
}

export function IconHumidity({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M8 3.5c2.4 2.8 3.8 4.8 3.8 6.6A3.8 3.8 0 0 1 8 13.9a3.8 3.8 0 0 1-3.8-3.8C4.2 8.3 5.6 6.3 8 3.5Z" />
      <path d="M16.5 10.5c1.9 2.2 3 3.8 3 5.2a3 3 0 1 1-6 0c0-1.4 1.1-3 3-5.2Z" />
    </svg>
  )
}

export function IconConductivity({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M13 3 5.5 13.5H11L9.5 21 18 10.5h-5.6L13 3Z" />
    </svg>
  )
}

export function IconCheck({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </svg>
  )
}

export function IconArrowDown({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 4.5v15M6 13.5l6 6 6-6" />
    </svg>
  )
}

// Plus, das sich per CSS zum Minus dreht — fuer das FAQ-Akkordeon.
export function IconToggle({ open = false, className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 12h15" />
      <path
        d="M12 4.5v15"
        style={{
          transformOrigin: 'center',
          transform: open ? 'scaleY(0)' : 'scaleY(1)',
          transition: 'transform 220ms cubic-bezier(.22,1,.36,1)',
        }}
      />
    </svg>
  )
}

export function IconArrowRight({ className = 'h-4 w-4' }) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </svg>
  )
}

// NFC-Zeichen wie auf dem Sticker: Punkt plus drei Boegen.
export function IconNfc({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="7" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path d="M10.5 8.5a5 5 0 0 1 0 7" />
      <path d="M13.5 6a8.5 8.5 0 0 1 0 12" />
      <path d="M16.5 3.5a12 12 0 0 1 0 17" />
    </svg>
  )
}

export function IconSpark({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5c.6 4.2 2.3 5.9 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.6 5.9-2.3 6.5-6.5Z" />
      <path d="M18.5 15.5c.25 1.6.9 2.25 2.5 2.5-1.6.25-2.25.9-2.5 2.5-.25-1.6-.9-2.25-2.5-2.5 1.6-.25 2.25-.9 2.5-2.5Z" />
    </svg>
  )
}

export function IconGlobe({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.2 3.6 8.5S14.4 18.1 12 20.5M12 3.5C9.6 5.9 8.4 8.7 8.4 12s1.2 6.1 3.6 8.5" />
    </svg>
  )
}

export function IconShield({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <path d="M12 3.5 5 6v5.6c0 4.2 2.9 7.6 7 8.9 4.1-1.3 7-4.7 7-8.9V6l-7-2.5Z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </svg>
  )
}

export function IconFilm({ className = 'h-5 w-5' }) {
  return (
    <svg {...base} className={className}>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <path d="M3.5 9h17M3.5 15h17M8 5v4M12 5v4M16 5v4M8 15v4M12 15v4M16 15v4" />
    </svg>
  )
}
