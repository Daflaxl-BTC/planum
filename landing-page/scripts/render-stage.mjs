// Erzeugt aus der 3D-Buehne der Seite (src/three/) die Offline-Dateien:
//
//   public/medallion/front-<breite>.webp   Poster fuer den Hero (LCP)
//   public/medallion/detail-<breite>.webp  Poster fuer die Makroansicht
//   3D-Objekt/planum-stickers-d2-v2.glb   beide Sticker als 3D-Modell
//
// Aufruf: npm run medallion
//
// Die Poster stehen auf der Seite, bis three.js geladen ist, und bleiben
// stehen, wenn WebGL fehlt. Sie kommen deshalb aus genau derselben Szene wie
// das Live-Bild — sonst springt das Objekt beim Ueberblenden.
//
// Gerendert wird in Headless-Chrome gegen den Vite-Dev-Server, weil die
// Module unter src/three/ Bare Imports ('three') und Vite-Aufloesung brauchen.

import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createServer } from 'vite'

import { launchBrowser, readDataUri, renderPage } from './lib/headless.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const JOBS = [
  { file: 'public/medallion/front-560.webp', query: { mode: 'poster', pose: 'hero', w: 560 } },
  { file: 'public/medallion/front-1120.webp', query: { mode: 'poster', pose: 'hero', w: 1120 } },
  { file: 'public/medallion/detail-768.webp', query: { mode: 'poster', pose: 'macro', w: 768, h: 653 } },
  { file: 'public/medallion/detail-1536.webp', query: { mode: 'poster', pose: 'macro', w: 1536, h: 1306 } },
  { file: '3D-Objekt/planum-stickers-d2-v2.glb', query: { mode: 'glb' } },
]

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`

const server = await createServer({
  root,
  logLevel: 'error',
  server: { port: 0, host: '127.0.0.1' },
})
await server.listen()
const { port } = server.httpServer.address()
const origin = `http://127.0.0.1:${port}`

const browser = await launchBrowser()

try {
  for (const job of JOBS) {
    const url = `${origin}/scripts/composites/stage-export.html?${new URLSearchParams(job.query)}`
    await renderPage(browser, url)
    const buffer = await readDataUri(browser, '#out')
    writeFileSync(resolve(root, job.file), buffer)
    console.log(`${job.file}  ${kb(buffer.length)}`)
  }
} finally {
  // Unter Windows haelt Chrome das Profil manchmal noch fest; das darf den
  // eigentlichen Fehler nicht ueberdecken.
  await browser.close().catch(() => {})
  await server.close()
}
