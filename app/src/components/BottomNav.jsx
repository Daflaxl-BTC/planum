import { NavLink } from 'react-router-dom'
import { LeafIcon, QrIcon, ShoppingBagIcon, SettingsIcon } from './Icons.jsx'

const items = [
  { to: '/', label: 'Pflanzen', icon: LeafIcon, end: true },
  { to: '/scan', label: 'Scannen', icon: QrIcon },
  { to: '/shop', label: 'Shop', icon: ShoppingBagIcon },
  { to: '/settings', label: 'Profil', icon: SettingsIcon },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-sage-100 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto flex justify-around py-2.5">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                isActive ? 'text-moss-600' : 'text-sage-400 hover:text-sage-600'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
