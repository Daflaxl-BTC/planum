// Rendert planum-medallion-d40.glb offline zu Einzelbildern.
//
// Aufruf: npm run medallion
//
// Warum ueberhaupt offline: three.js kostet im Bundle rund 170 kB gzip, das
// Modell selbst 7 MB — zusammen ein Vielfaches des Budgets der gesamten
// Landingpage (Ziel < 90 kB JS gzip, LCP < 1,8 s). Ausgeliefert werden
// deshalb nur fertige Bilder; die Bibliothek liegt in scripts/vendor/ und
// steht bewusst nicht in package.json, weil sie zur Asset-Erzeugung gehoert
// und nicht zur Seite.
//
// Ergebnis in public/medallion/:
//   front-<breite>.webp / back-<breite>.webp  — die zwei Ruhelagen
//   turn-<nr>.webp                            — Umlauf fuer die Zeigerdrehung
//   detail-<breite>.webp                      — Makro fuer die Sticker-Sektion
//
// Die Frames haben einen Alphakanal, liegen also transparent ueber dem
// Seitenhintergrund. Deshalb toDataURL('image/webp') statt --screenshot:
// der Screenshot-Weg von Chrome fuellt Transparenz weiss auf.

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { launchBrowser, readDataUri, renderPage, serveDirectory } from './lib/headless.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public/medallion')

// Ruhelage identisch zur bisherigen CSS-Fassung, damit sich am Layout des
// Heros nichts verschiebt.
const POSE = { yaw: -19, pitch: 13, roll: -5 }

// Zwei Breiten: 1x fuer normale Displays, 2x fuer Retina. Mehr Stufen bringen
// nichts, weil das Objekt im Layout eine feste relative Groesse hat (30rem,
// also 480 px) — 1120 deckt damit schon mehr als das Doppelte ab.
const STILL_WIDTHS = [560, 1120]

// 24 Frames = 15 Grad pro Schritt. Darunter ruckelt die Drehung sichtbar,
// darueber waechst nur die Datenmenge.
const TURN_FRAMES = 24
// 560 statt der frueheren 440: die Frames stehen an derselben Stelle wie die
// Ruhelage (480 px im Layout). Bei 440 wurde das Objekt beim Drehen also
// hochskaliert und sichtbar weicher als davor und danach. Mehr als 560 lohnt
// nicht — 24 Frames zahlen jede Breite 24-fach.
const TURN_WIDTH = 560

// Ueberabtastung im Renderer (siehe composites/medallion.html): dreifach
// gerendert und heruntergerechnet. Das Relief hat 232.000 Dreiecke, deren
// Schattierung innerhalb der Flaeche wechselt — dagegen hilft kein MSAA,
// sondern nur echtes Downsampling.
const SUPERSAMPLE = 3

// Getrennte Qualitaeten: die Ruhelage und das Makro sind Standbilder und
// werden angesehen, die 24 Umlauf-Frames huschen in ~800 ms vorbei.
//
// Unter 0,7 bringt die Umlauf-Serie kaum noch etwas: gemessen 190 statt
// 196 kB bei q 0,62. Die Datenmenge steckt im Alphakanal, den WebP verlustfrei
// speichert — an dem dreht der Qualitaetsregler nicht.
const STILL_QUALITY = 0.88
const TURN_QUALITY = 0.72

// Makroansicht fuer die Sticker-Sektion. Sie ersetzt das fruehere
// Foto-Komposit, bei dem ein flacher Vektor auf einen Topffoto geklebt war.
//
// Bewusst keine Kantenansicht: das Modell ist eine Scheibe mit sichtbarer
// Dicke, das gedruckte Teil dagegen PET-Folie ab 125 µm (siehe
// docs/print-specs-nfc-stickers.md). Ein Blick auf die Kante wuerde ein
// Material behaupten, das es nicht gibt — Bilder unterliegen § 5 UWG genauso
// wie Text (siehe src/content/claims-guard.md).
const DETAIL = {
  // fill > 1 schneidet bewusst an: ein Ausschnitt liest sich als Makro,
  // ein vollstaendiges Objekt als zweites Produktbild.
  detail: { yaw: -11, pitch: 27, roll: -4, fill: 1.9, pany: -0.02, ratio: 4 / 3, widths: [768, 1536] },
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(0)} kB`
}

mkdirSync(outDir, { recursive: true })

const server = await serveDirectory(root)
const browser = await launchBrowser()

function frameUrl({
  yaw,
  pitch = POSE.pitch,
  roll = POSE.roll,
  size,
  height = size,
  fill,
  pany,
  quality = STILL_QUALITY,
}) {
  const params = new URLSearchParams({
    yaw: String(yaw),
    pitch: String(pitch),
    roll: String(roll),
    size: String(size),
    h: String(Math.round(height)),
    q: String(quality),
    ss: String(SUPERSAMPLE),
  })
  if (fill !== undefined) params.set('fill', String(fill))
  if (pany !== undefined) params.set('pany', String(pany))
  return `${server.origin}/scripts/composites/medallion.html?${params}`
}

async function render(target, options) {
  await renderPage(browser, frameUrl(options))
  const buffer = await readDataUri(browser, '#out')
  writeFileSync(resolve(outDir, target), buffer)
  return buffer.length
}

// Einzelne Gruppen erneuern, ohne jedes Mal alle 28 Bilder zu rendern.
const only = process.argv.find((arg) => arg.startsWith('--only='))?.slice(7)
const wants = (group) => !only || only.split(',').includes(group)

try {
  let total = 0

  for (const width of wants('stills') ? STILL_WIDTHS : []) {
    total += await render(`front-${width}.webp`, { yaw: POSE.yaw, size: width })
    console.log(`front-${width}.webp`)
    // Rueckseite: dieselbe Lage um 180 Grad gedreht, damit der Umschlag im
    // Hero wie ein echtes Umdrehen wirkt und nicht wie ein Bildwechsel.
    total += await render(`back-${width}.webp`, { yaw: POSE.yaw + 180, size: width })
    console.log(`back-${width}.webp`)
  }

  const turnCount = wants('turn') && !process.argv.includes('--stills-only') ? TURN_FRAMES : 0
  for (let index = 0; index < turnCount; index += 1) {
    const yaw = POSE.yaw + (index * 360) / TURN_FRAMES
    const name = `turn-${String(index).padStart(2, '0')}.webp`
    total += await render(name, { yaw, size: TURN_WIDTH, quality: TURN_QUALITY })
    console.log(name)
  }

  for (const [name, shot] of Object.entries(DETAIL)) {
    if (!wants(name)) continue
    for (const width of shot.widths) {
      const file = `${name}-${width}.webp`
      total += await render(file, {
        yaw: shot.yaw,
        pitch: shot.pitch,
        roll: shot.roll,
        size: width,
        height: width / shot.ratio,
        fill: shot.fill,
        pany: shot.pany,
      })
      console.log(file)
    }
  }

  console.log(`\nGesamt: ${kb(total)}`)
} finally {
  await browser.close()
  await server.close()
}
