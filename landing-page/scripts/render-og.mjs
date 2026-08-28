// Rendert scripts/og-image.html nach public/og-image.png.
//
// Bewusst ohne Puppeteer oder sharp: beides waeren neue Dependencies fuer
// genau ein Bild, das sich vielleicht dreimal im Jahr aendert. Stattdessen
// wird der ohnehin installierte Chrome im Headless-Modus aufgerufen.
//
// Aufruf: npm run og

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const source = resolve(root, 'scripts/og-image.html')
const target = resolve(root, 'public/og-image.png')

// Reihenfolge = Praeferenz. Chromium-Derivate koennen alle --screenshot.
const CANDIDATES = {
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ],
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  ],
  linux: ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'],
}

const browser =
  process.env.CHROME_PATH ??
  (CANDIDATES[process.platform] ?? []).find((path) => existsSync(path))

if (!browser) {
  console.error(
    'Kein Chrome/Chromium gefunden. Pfad ueber die Umgebungsvariable CHROME_PATH setzen.',
  )
  process.exit(1)
}

// --allow-file-access-from-files: die Vorlage laedt Fonts und die
// Sticker-SVGs ueber relative file://-Pfade.
// --virtual-time-budget: wartet, bis Fonts und SVGs wirklich gezeichnet sind —
// ohne das rendert Chrome die Karte gelegentlich in der Fallback-Schrift.
const result = spawnSync(
  browser,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    '--virtual-time-budget=4000',
    `--screenshot=${target}`,
    pathToFileURL(source).href,
  ],
  { stdio: 'inherit' },
)

if (result.status !== 0) process.exit(result.status ?? 1)
console.log(`og-image.png geschrieben: ${target}`)
