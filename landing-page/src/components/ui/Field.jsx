import { useId } from 'react'

// Eingabefeld mit echtem <label>. Kein Placeholder-als-Label — der verschwindet
// beim Tippen und ist damit fuer Screenreader und Fehlerkorrektur wertlos.
export function Field({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required = false,
  invalid = false,
  describedBy,
  className = '',
  inputClassName = '',
  labelHidden = false,
  ...rest
}) {
  const id = useId()

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={
          labelHidden
            ? 'sr-only'
            : 'mb-2 block text-micro uppercase text-ink/50'
        }
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-sm border bg-paper px-4 py-3.5 text-body text-ink placeholder:text-ink/40 transition-colors ${
          invalid ? 'border-terra-700' : 'border-ink/20 hover:border-ink/35'
        } ${inputClassName}`}
        {...rest}
      />
    </div>
  )
}

// Honeypot: fuer Menschen unsichtbar, fuer Bots ein ausfuellbares Feld.
// Absichtlich nicht display:none — manche Bots ueberspringen solche Felder.
export function Honeypot({ value, onChange }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor="company">Firma</label>
      <input
        id="company"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
