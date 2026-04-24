import { ShoppingBagIcon } from '../components/Icons.jsx'

export default function ShopPlaceholder() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-earth-100 flex items-center justify-center mb-5">
        <ShoppingBagIcon className="w-8 h-8 text-earth-700" />
      </div>
      <h1 className="font-display text-2xl text-sage-900 mb-2">Pflegeshop</h1>
      <p className="text-sage-500 max-w-xs">
        Kuratierte Empfehlungen für Dünger, Erde und Töpfe – abgestimmt auf deine Pflanzen.
      </p>
      <p className="text-xs text-sage-400 mt-6">Kommt bald.</p>
    </div>
  )
}
