import { Link } from 'react-router-dom'

export default function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div className="min-h-screen bg-cream-50">
      <main className="max-w-2xl mx-auto px-6 pt-10 pb-16">
        <Link to="/" className="text-sm text-sage-500 hover:text-sage-700">← Zurück</Link>
        <header className="mt-4 mb-8">
          <h1 className="font-display text-3xl text-sage-900">{title}</h1>
          {lastUpdated && (
            <p className="text-xs text-sage-400 mt-2">Stand: {lastUpdated}</p>
          )}
        </header>

        <div className="card p-6 mb-8 bg-amber-50 border-amber-100">
          <p className="text-sm text-amber-900">
            <strong>Hinweis:</strong> Vorläufige Fassung. Vor Live-Schaltung muss
            ein Anwalt die Texte prüfen — insbesondere die Auftragsverarbeiter-
            Liste und die Sonderfälle für KI-gestützte Bildverarbeitung.
          </p>
        </div>

        <article className="space-y-6 text-sage-700 leading-relaxed [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-sage-900 [&_h2]:mt-8 [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:text-sage-900 [&_h3]:mt-4 [&_h3]:mb-1 [&_p]:text-sm [&_li]:text-sm [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_a]:text-moss-700 [&_a]:underline">
          {children}
        </article>
      </main>
    </div>
  )
}
