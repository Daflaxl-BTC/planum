import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { Capacitor } from '@capacitor/core'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <App />
      </AuthProvider>
      {/* Native iOS build has no /_vercel/insights endpoint */}
      {!Capacitor.isNativePlatform() && <Analytics />}
    </BrowserRouter>
  </React.StrictMode>
)
