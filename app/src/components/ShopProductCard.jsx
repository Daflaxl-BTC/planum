import {
  FlaskIcon,
  RepotIcon,
  DropletIcon,
  ShoppingBagIcon,
  SparklesIcon,
  SunIcon,
} from './Icons.jsx'

const CATEGORY_ICON = {
  duenger:      FlaskIcon,
  erde:         RepotIcon,
  toepfe:       RepotIcon,
  bewaesserung: DropletIcon,
  werkzeug:     ShoppingBagIcon,
  sonstiges:    SunIcon,
}

export default function ShopProductCard({ product }) {
  const Icon = CATEGORY_ICON[product.category] || SparklesIcon

  return (
    <article className="rounded-3xl bg-white shadow-sm border border-sage-100 p-4 flex flex-col">
      <div className="relative aspect-[4/3] rounded-2xl bg-sage-50 overflow-hidden mb-3 flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        ) : (
          <Icon className="w-12 h-12 text-sage-300" />
        )}
        <span className="absolute top-2 left-2 bg-earth-100 text-earth-800 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium">
          Werbung
        </span>
        {product.badge && (
          <span className="absolute top-2 right-2 bg-moss-600 text-cream-50 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium">
            {product.badge}
          </span>
        )}
      </div>

      <h3 className="font-display text-lg text-sage-900 leading-tight">
        {product.title}
      </h3>
      {product.subtitle && (
        <p className="text-sm text-sage-500 mt-0.5">{product.subtitle}</p>
      )}
      {product.price_hint && (
        <p className="text-xs text-earth-700 mt-1">{product.price_hint}</p>
      )}

      <a
        href={product.affiliate_url}
        target="_blank"
        rel="sponsored noopener nofollow"
        className="mt-3 inline-flex items-center justify-center px-4 py-2.5 bg-moss-600 text-cream-50 font-medium rounded-full text-sm hover:bg-moss-700 transition-colors"
      >
        Auf Amazon ansehen →
      </a>
    </article>
  )
}
