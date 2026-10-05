// Aus einem Motiv (Hoehenkarte) werden zwei Texturen: Farbe und Normalen.
//
// Das ersetzt das alte Relief aus 232.000 Dreiecken. Dort war die Praegung als
// Hoehenfeld auf einem Polarraster abgetastet — an jeder schraegen Linie
// entstanden Treppenstufen, die man im Makro deutlich sah (Blaetter,
// Schriftzug). Hier ist die Praegung pixelgenau aus dem Vektor gerechnet und
// liegt als Normal-Map auf einer glatten Flaeche: schaerfer, und statt 7 MB
// Geometrie ein paar Millisekunden Rechenzeit im Browser.

// Gedeckter Terracotta-Verlauf aus dem Druck-SVG (#C97B52 -> #BC6E48), die
// Rillen ziehen Richtung #96522F wie die dunkle Druckebene.
const BASE_LIGHT = [201, 123, 82]
const BASE_DARK = [188, 110, 72]
const GROOVE = [150, 82, 47]

function boxBlur(src, dst, width, height, radius, horizontal) {
  const span = radius * 2 + 1
  if (horizontal) {
    for (let y = 0; y < height; y += 1) {
      const row = y * width
      let acc = 0
      for (let x = -radius; x <= radius; x += 1) acc += src[row + Math.min(width - 1, Math.max(0, x))]
      for (let x = 0; x < width; x += 1) {
        dst[row + x] = acc / span
        const add = Math.min(width - 1, x + radius + 1)
        const sub = Math.max(0, x - radius)
        acc += src[row + add] - src[row + sub]
      }
    }
  } else {
    for (let x = 0; x < width; x += 1) {
      let acc = 0
      for (let y = -radius; y <= radius; y += 1) acc += src[Math.min(height - 1, Math.max(0, y)) * width + x]
      for (let y = 0; y < height; y += 1) {
        dst[y * width + x] = acc / span
        const add = Math.min(height - 1, y + radius + 1)
        const sub = Math.max(0, y - radius)
        acc += src[add * width + x] - src[sub * width + x]
      }
    }
  }
}

// Zwei Durchgaenge Boxfilter ~ Gaussglocke. Ergibt das weiche Rillenprofil
// einer Praegung statt einer senkrechten Stufe.
function soften(height, width, h, radius) {
  const tmp = new Float32Array(height.length)
  for (let pass = 0; pass < 2; pass += 1) {
    boxBlur(height, tmp, width, h, radius, true)
    boxBlur(tmp, height, width, h, radius, false)
  }
}

// Deterministisches Rauschen: dieselbe Koernung bei jedem Laden.
function hash(x, y) {
  let n = x * 374761393 + y * 668265263
  n = (n ^ (n >>> 13)) * 1274126177
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295
}

export function bakeRelief({ draw, box, pxPerUnit, strength = 6.5, blur = 1 }) {
  const width = Math.round(box.w * pxPerUnit)
  const height = Math.round(box.h * pxPerUnit)

  const source = document.createElement('canvas')
  source.width = width
  source.height = height
  const ctx = source.getContext('2d', { willReadFrequently: true })
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, width, height)
  ctx.setTransform(pxPerUnit, 0, 0, pxPerUnit, -box.x * pxPerUnit, -box.y * pxPerUnit)
  draw(ctx)

  const pixels = ctx.getImageData(0, 0, width, height).data
  const field = new Float32Array(width * height)
  for (let i = 0; i < field.length; i += 1) field[i] = pixels[i * 4] / 255

  soften(field, width, height, Math.max(1, Math.round(blur * pxPerUnit * 0.5)))

  const albedo = document.createElement('canvas')
  const normal = document.createElement('canvas')
  albedo.width = normal.width = width
  albedo.height = normal.height = height
  const albedoCtx = albedo.getContext('2d')
  const normalCtx = normal.getContext('2d')
  const albedoData = albedoCtx.createImageData(width, height)
  const normalData = normalCtx.createImageData(width, height)
  const a = albedoData.data
  const n = normalData.data

  // Licht im Druck kommt von oben links, der Verlauf liegt entsprechend.
  const gx = width * 0.42
  const gy = height * 0.36
  const gr = Math.hypot(width, height) * 0.62

  for (let y = 0; y < height; y += 1) {
    const up = Math.max(0, y - 1) * width
    const down = Math.min(height - 1, y + 1) * width
    const row = y * width
    for (let x = 0; x < width; x += 1) {
      const i = row + x
      const left = field[row + Math.max(0, x - 1)]
      const right = field[row + Math.min(width - 1, x + 1)]
      const top = field[up + x]
      const bottom = field[down + x]

      // Tangentialraum: +X nach rechts, +Y nach oben (Canvas-Zeilen laufen
      // nach unten, daher bottom - top).
      let nx = (left - right) * strength
      let ny = (bottom - top) * strength
      const len = Math.hypot(nx, ny, 1)
      nx /= len
      ny /= len
      const nz = 1 / len

      const o = i * 4
      n[o] = (nx * 0.5 + 0.5) * 255
      n[o + 1] = (ny * 0.5 + 0.5) * 255
      n[o + 2] = (nz * 0.5 + 0.5) * 255
      n[o + 3] = 255

      const t = Math.min(1, Math.hypot(x - gx, y - gy) / gr)
      const groove = (1 - field[i]) * 0.7
      // Feine Koernung der Soft-Touch-Oberflaeche, kaum sichtbar.
      const grain = (hash(x, y) - 0.5) * 7
      for (let c = 0; c < 3; c += 1) {
        const base = BASE_LIGHT[c] + (BASE_DARK[c] - BASE_LIGHT[c]) * t
        a[o + c] = base + (GROOVE[c] - base) * groove + grain
      }
      a[o + 3] = 255
    }
  }

  albedoCtx.putImageData(albedoData, 0, 0)
  normalCtx.putImageData(normalData, 0, 0)

  return { albedo, normal, width, height }
}
