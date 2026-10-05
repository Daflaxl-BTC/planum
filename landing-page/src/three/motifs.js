// Die beiden Sticker-Motive als Zeichenanweisungen fuer Canvas 2D.
//
// Quelle sind die freigegebenen Druckvektoren der Variante D2 Terracotta-Relief
// (public/stickers/d2-terracotta-relief-*.svg, Runde D vom 07.07.2026). Die
// Pfade stehen hier woertlich, nur die dunkle Ebene (#96522F): die helle
// Versatzebene im SVG ist gemaltes Licht fuer den Flachdruck. Im 3D-Modell
// entsteht dieses Licht echt — aus der Relief-Normalen und der Szene.
//
// Konvention: gezeichnet wird eine Hoehenkarte. Weiss ist die Oberflaeche,
// Schwarz der tiefste Punkt einer Praegung. Die Deckkraft aus dem SVG wird zur
// Tiefe — die NFC-Boegen laufen nach aussen flacher aus, wie im Druck.

// Ein Blatt der Ranke: [y, Winkel links, Winkel rechts, Laenge, Bauch].
const LEAVES = [
  [88, -145, -35, 52, 15],
  [44, -140, -40, 58, 16],
  [0, -142, -38, 62, 17],
  [-44, -138, -42, 56, 15],
  [-88, -132, -48, 46, 13],
]

function leafPath(length, bulge) {
  const a = length
  return `M 0 0 C ${a * 0.25} ${-bulge} ${a * 0.75} ${-bulge} ${a} 0 C ${a * 0.75} ${bulge} ${a * 0.25} ${bulge} 0 0 Z`
}

function stroke(ctx, d, width, depth = 1) {
  ctx.lineWidth = width
  ctx.strokeStyle = depthColor(depth)
  ctx.stroke(new Path2D(d))
}

function dot(ctx, x, y, r, depth = 1) {
  ctx.fillStyle = depthColor(depth)
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
}

function depthColor(depth) {
  const v = Math.round(255 * (1 - depth))
  return `rgb(${v},${v},${v})`
}

function prepare(ctx) {
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

// ---------------------------------------------------------------------------
// Profil-Sticker, rund, Ø 40 mm. Schnittlinie im SVG: Kreis r = 200 um (230, 230).

export const MEDALLION = {
  // Ausschnitt in SVG-Einheiten, der genau die Stanzform abdeckt.
  box: { x: 30, y: 30, w: 400, h: 400 },
  // 10 SVG-Einheiten = 1 mm.
  unitsPerMm: 10,
}

export function drawMedallion(ctx, { fontFamily = 'Inter, system-ui, sans-serif' } = {}) {
  prepare(ctx)

  // Doppelte Zierlinie am Rand, als Rille.
  ctx.beginPath()
  ctx.lineWidth = 3
  ctx.strokeStyle = depthColor(0.85)
  ctx.arc(230, 230, 184, 0, Math.PI * 2)
  ctx.stroke()

  ctx.save()
  ctx.translate(230, 236)
  ctx.scale(0.92, 0.92)

  stroke(ctx, 'M 0 120 C -8 40 8 -40 0 -120', 3.2)

  for (const [y, left, right, length, bulge] of LEAVES) {
    for (const angle of [left, right]) {
      ctx.save()
      ctx.translate(0, y)
      ctx.rotate((angle * Math.PI) / 180)
      stroke(ctx, leafPath(length, bulge), 2.72)
      stroke(ctx, `M ${length * 0.08} 0 L ${length * 0.9} 0`, 1.904, 0.75)
      ctx.restore()
    }
  }

  dot(ctx, 0, -126, 3.52)
  ctx.restore()

  // NFC-Zeichen rechts an der Spitze der Ranke.
  stroke(ctx, 'M 233.12 102.4 A 5.6 5.6 0 0 1 233.12 113.6', 2.08, 0.8)
  stroke(ctx, 'M 234.08 97.6 A 10.4 10.4 0 0 1 234.08 118.4', 2.08, 0.62)
  stroke(ctx, 'M 235.04 92.8 A 15.2 15.2 0 0 1 235.04 123.2', 2.08, 0.44)
  dot(ctx, 229.6, 108, 2.08, 0.8)

  drawArcText(ctx, 'PLANUM', {
    cx: 230,
    cy: 230,
    r: 152,
    size: 18,
    tracking: 6,
    font: `500 18px ${fontFamily}`,
    depth: 0.9,
  })
}

// Schrift entlang des unteren Bogens, wie <textPath> im SVG: Grundlinie auf
// dem Kreis, Buchstaben zeigen zur Mitte, mittig ausgerichtet.
function drawArcText(ctx, text, { cx, cy, r, tracking, font, depth }) {
  ctx.save()
  ctx.font = font
  ctx.fillStyle = depthColor(depth)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  // Im SVG steht "P L A N U M" mit Leerzeichen UND letter-spacing 6.
  const glyphs = text.split('')
  const space = ctx.measureText(' ').width + tracking
  const widths = glyphs.map((g) => ctx.measureText(g).width)
  const total =
    widths.reduce((sum, w) => sum + w, 0) + (glyphs.length - 1) * (space + tracking)

  const arcLength = Math.PI * r
  let s = arcLength / 2 - total / 2

  glyphs.forEach((glyph, index) => {
    const center = s + widths[index] / 2
    const theta = Math.PI - center / r
    const x = cx + r * Math.cos(theta)
    const y = cy + r * Math.sin(theta)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(Math.atan2(-Math.cos(theta), Math.sin(theta)))
    ctx.fillText(glyph, 0, 0)
    ctx.restore()
    s += widths[index] + space + tracking
  })

  ctx.restore()
}

// ---------------------------------------------------------------------------
// Giess-Sticker, Tropfenform. Schnittlinie im SVG (magenta).

export const DROP = {
  box: { x: 40, y: 40, w: 300, h: 380 },
  // Hoehe der Stanzform 380 Einheiten = 40 mm laut Spezifikation.
  unitsPerMm: 9.5,
  // Kontur in SVG-Koordinaten, fuer die Geometrie.
  outline: {
    top: [190, 40],
    rightCurve: [190, 100, 340, 127.5, 340, 270],
    arc: { cx: 190, cy: 270, r: 150 },
    leftCurve: [40, 127.5, 190, 100, 190, 40],
  },
}

export function drawDrop(ctx) {
  prepare(ctx)

  // Innere Kontur als Rille.
  stroke(
    ctx,
    'M 190 58 C 190 118 324 142.7 324 270 A 134 134 0 1 1 56 270 C 56 142.7 190 118 190 58 Z',
    2.8,
    0.85,
  )

  ctx.save()
  ctx.translate(190, 252)
  ctx.scale(0.95, 0.95)
  stroke(ctx, 'M 0 -78 C 3 -60 22 -38 22 -22 A 22 22 0 1 1 -22 -22 C -22 -38 -3 -60 0 -78 Z', 3.2)
  dot(ctx, -7, -20, 4, 0.85)
  stroke(ctx, 'M -36 34 A 36 12.24 0 0 0 36 34', 2.56, 1)
  stroke(ctx, 'M -58 34 A 58 19.72 0 0 0 58 34', 2.56, 0.65)
  stroke(ctx, 'M -80 34 A 80 27.2 0 0 0 80 34', 2.56, 0.4)
  ctx.restore()

  stroke(ctx, 'M 193.05 334.75 A 5.25 5.25 0 0 1 193.05 345.25', 1.95, 0.8)
  stroke(ctx, 'M 193.95 330.25 A 9.75 9.75 0 0 1 193.95 349.75', 1.95, 0.62)
  stroke(ctx, 'M 194.85 325.75 A 14.25 14.25 0 0 1 194.85 354.25', 1.95, 0.44)
  dot(ctx, 189.75, 340, 1.95, 0.8)
}
