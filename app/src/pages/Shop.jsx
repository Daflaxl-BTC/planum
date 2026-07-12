import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchShopProducts } from '../lib/shopApi.js'
import ShopCategoryFilter from '../components/ShopCategoryFilter.jsx'
import ShopProductCard from '../components/ShopProductCard.jsx'
import { ShoppingBagIcon } from '../components/Icons.jsx'

export default function Shop() {
  const [category, setCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    fetchShopProducts(category)
      .then((data) => { if (active) setProducts(data) })
      .catch((err) => { if (active) setError(err) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [category])

  return (
    <div className="pb-10">
      <header className="px-6 pt-10 pb-6">
        <h1 className="font-display text-3xl text-sage-900">Pflegeshop</h1>
        <p className="text-sage-500 mt-1">
          Kuratierte Empfehlungen für deine Pflanzen.
        </p>
      </header>

      <div className="px-6 mb-5">
        <ShopCategoryFilter active={category} onChange={setCategory} />
      </div>

      <div className="px-6">
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <ErrorState />
        ) : products.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((p) => (
              <ShopProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <p className="text-xs text-sage-500 mt-8 leading-relaxed">
          Alle Produktempfehlungen sind Affiliate-Links. Wenn du über sie kaufst,
          erhalten wir eine kleine Provision – für dich ändert sich nichts am
          Preis. Mehr dazu in unserer{' '}
          <Link to="/datenschutz" className="underline hover:text-sage-700">
            Datenschutzerklärung
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-3xl bg-white border border-sage-100 p-4 animate-pulse">
          <div className="aspect-[4/3] rounded-2xl bg-sage-100 mb-3" />
          <div className="h-4 w-2/3 bg-sage-100 rounded mb-2" />
          <div className="h-3 w-1/2 bg-sage-100 rounded mb-4" />
          <div className="h-9 w-full bg-sage-100 rounded-full" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="card p-8 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-earth-100 flex items-center justify-center mb-4">
        <ShoppingBagIcon className="w-7 h-7 text-earth-700" />
      </div>
      <h2 className="font-display text-xl text-sage-900 mb-2">
        Sortiment wird gerade kuratiert
      </h2>
      <p className="text-sm text-sage-500">
        Schau später nochmal vorbei – hier kommen bald handverlesene
        Empfehlungen für deine Pflanzen.
      </p>
    </div>
  )
}

function ErrorState() {
  return (
    <div className="card p-6 text-center">
      <p className="text-sm text-sage-700">
        Sortiment konnte gerade nicht geladen werden. Versuch es später nochmal.
      </p>
    </div>
  )
}
