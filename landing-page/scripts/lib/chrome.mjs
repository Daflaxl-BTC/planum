// Findet einen installierten Chromium-Browser und ruft ihn headless auf.
//
// Bewusst ohne Puppeteer, sharp oder einen anderen Bild-Toolchain: das waeren
// neue Dependencies (plus ~200 MB Chromium-Download bzw. native Bindings, die
// beim Wechsel zwischen macOS und Windows neu gebaut werden muessen) fuer
// Bilder, die sich vielleicht dreimal im Jahr aendern. Der ohnehin
// installierte Browser kann alles, was hier gebraucht wird: rendern,
// screenshotten und — ueber Canvas — WebP kodieren.

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'

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

export function findBrowser() {
  const browser =
    process.env.CHROME_PATH ??
    (CANDIDATES[process.platform] ?? []).find((path) => existsSync(path))

  if (!browser) {
    console.error(
      'Kein Chrome/Chromium gefunden. Pfad ueber die Umgebungsvariable CHROME_PATH setzen.',
    )
    process.exit(1)
  }
  return browser
}

// --allow-file-access-from-files: die Vorlagen laden Fotos, Fonts und SVGs
//   ueber relative file://-Pfade. Ohne das Flag gilt jede Datei als eigener
//   Origin und ein per Canvas gelesenes Bild wuerde die Leinwand "tainten".
// --virtual-time-budget: wartet, bis Fonts, SVGs und Bilder wirklich
//   gezeichnet sind — ohne das rendert Chrome gelegentlich zu frueh.
const BASE_FLAGS = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--allow-file-access-from-files',
  '--virtual-time-budget=8000',
]

export function screenshot({ url, out, width, height, scale = 1 }) {
  const result = spawnSync(
    findBrowser(),
    [
      ...BASE_FLAGS,
      `--force-device-scale-factor=${scale}`,
      `--window-size=${width},${height}`,
      `--screenshot=${out}`,
      url,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] },
  )
  if (result.status !== 0) {
    throw new Error(`Chrome-Screenshot fehlgeschlagen (Exit ${result.status}): ${url}`)
  }
}

// Rendert eine Seite und gibt das serialisierte DOM zurueck. Einziger Weg,
// Daten ohne DevTools-Protokoll aus dem Headless-Browser herauszubekommen —
// die WebP-Kodierung nutzt das, um ihre Data-URI zu uebergeben.
export function dumpDom(url) {
  const result = spawnSync(findBrowser(), [...BASE_FLAGS, '--dump-dom', url], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  })
  if (result.status !== 0) {
    throw new Error(`Chrome-DOM-Dump fehlgeschlagen (Exit ${result.status}): ${url}`)
  }
  return result.stdout
}
