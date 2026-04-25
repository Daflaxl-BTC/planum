import { QrIcon } from '../components/Icons.jsx'

export default function ScanPlaceholder() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-moss-100 flex items-center justify-center mb-5">
        <QrIcon className="w-8 h-8 text-moss-600" />
      </div>
      <h1 className="font-display text-2xl text-sage-900 mb-2">QR-Scanner</h1>
      <p className="text-sage-500 max-w-xs">
        Scannst du einen Planum-QR-Sticker von einer Pflanze, landest du direkt auf der Pflege-Seite dieser Pflanze.
      </p>
      <p className="text-xs text-sage-400 mt-6">Kamera-Scanner folgt in Phase 4.</p>
    </div>
  )
}
