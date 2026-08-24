// Einziger horizontaler Rahmen der Seite. 12-Spalten-Grid optional, damit
// Sektionen asymmetrisch setzen koennen statt alles mittig zu stapeln.
export function Container({ as: Tag = 'div', grid = false, className = '', children }) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[78rem] px-6 sm:px-8 lg:px-12 ${
        grid ? 'grid grid-cols-4 gap-x-6 md:grid-cols-12 md:gap-x-8' : ''
      } ${className}`}
    >
      {children}
    </Tag>
  )
}
