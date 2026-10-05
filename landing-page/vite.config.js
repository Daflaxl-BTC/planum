import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// package.json ist "type": "module" — __dirname existiert hier nicht.
const root = dirname(fileURLToPath(import.meta.url))

// MPA statt SPA-Router: drei echte HTML-Dokumente, kein Routing-JS im Bundle.
// Die Rewrites dafuer stehen in der Root-vercel.json VOR dem Catch-all.
export default defineConfig({
  plugins: [react()],
  build: {
    // Der einzige grosse Chunk ist die 3D-Buehne (three.js, ~135 kB gzip). Er
    // wird per dynamic import erst geladen, wenn die Seite steht und der
    // Browser Luft hat — er liegt nicht im kritischen Pfad.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        impressum: resolve(root, 'impressum.html'),
        datenschutz: resolve(root, 'datenschutz.html'),
        danke: resolve(root, 'danke.html'),
      },
    },
  },
})
