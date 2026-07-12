import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav.jsx'

export default function Layout() {
  return (
    <div className="min-h-screen bg-cream-50">
      <main className="max-w-md mx-auto pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
