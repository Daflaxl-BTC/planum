import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: Web-Deploy liegt unter /app/ (Vercel), der Capacitor-Build lädt lokal ab / .
// Der Router liest denselben Wert über import.meta.env.BASE_URL (siehe main.jsx).
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'capacitor' ? '/' : '/app/',
  server: { port: 5174 },
}))
