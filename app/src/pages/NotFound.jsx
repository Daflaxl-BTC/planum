import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl text-sage-200">404</p>
      <h1 className="font-display text-2xl text-sage-900 mt-4 mb-2">Seite nicht gefunden</h1>
      <p className="text-sage-500 mb-6">Dieser Pfad existiert nicht.</p>
      <Link to="/" className="btn-primary">Zur Übersicht</Link>
    </div>
  )
}
