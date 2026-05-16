import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

// Login + AuthCallback bleiben eager, weil sie der erste Touchpoint sind.
// Alle anderen Routen werden lazy geladen, damit das Initial-Bundle
// (Dashboard + Auth) nicht den Scanner-Worker, Shop etc. mitschleppt.
import Login from './pages/Login.jsx'
import AuthCallback from './pages/AuthCallback.jsx'

const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const PlantDetail = lazy(() => import('./pages/PlantDetail.jsx'))
const RegisterPlant = lazy(() => import('./pages/RegisterPlant.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const Scan = lazy(() => import('./pages/Scan.jsx'))
const ScanResolver = lazy(() => import('./pages/ScanResolver.jsx'))
const Shop = lazy(() => import('./pages/Shop.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function RouteFallback() {
  return (
    <div className="px-6 pt-16 flex justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-moss-200 border-t-moss-600 animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="plant/new" element={<RegisterPlant />} />
          <Route path="plant/:id" element={<PlantDetail />} />
          <Route path="qr/:slotUuid" element={<ScanResolver />} />
          <Route path="scan" element={<Scan />} />
          <Route path="shop" element={<Shop />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
