import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PlantDetail from './pages/PlantDetail.jsx'
import RegisterPlant from './pages/RegisterPlant.jsx'
import Settings from './pages/Settings.jsx'
import Scan from './pages/Scan.jsx'
import ScanResolver from './pages/ScanResolver.jsx'
import Shop from './pages/Shop.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
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
  )
}
