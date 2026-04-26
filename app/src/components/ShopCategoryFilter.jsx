import { SHOP_CATEGORIES } from '../lib/shopApi.js'

export default function ShopCategoryFilter({ active, onChange }) {
  return (
    <div className="-mx-6 px-6 overflow-x-auto scrollbar-none">
      <div className="flex gap-2 pb-1 w-max">
        {SHOP_CATEGORIES.map(({ key, label }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-moss-600 text-cream-50'
                  : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
