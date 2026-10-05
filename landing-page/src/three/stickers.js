import * as THREE from 'three'

import { DROP, MEDALLION, drawDrop, drawMedallion } from './motifs'
import { bakeRelief } from './textures'

// Planum-Sticker als 3D-Koerper, Masseinheit Millimeter.
//
// Abmessungen und Materialanmutung wie im bisherigen Modell
// (3D-Objekt/planum-medallion-d40.glb: Ø 39,84 mm, 1 mm stark, matte
// Terracotta). Neu ist das Relief: nicht mehr als Dreiecksgebirge, sondern als
// Normal-Map direkt aus den Druckvektoren — siehe textures.js.

// 5,12 px je SVG-Einheit = 2048 px ueber das Medaillon. Genug fuer die
// Nahaufnahme, und die Texturen bleiben unter 16 MB Grafikspeicher.
const PX_PER_UNIT = 5.12
const THICKNESS_MM = 1

let bakePromise = null

// Einmal pro Seitenaufruf backen, egal wie viele Buehnen die Seite hat.
export function bakeStickerTextures() {
  if (!bakePromise) {
    bakePromise = (async () => {
      // Die Schrift auf dem Medaillon wird mit der Seitenschrift gesetzt.
      // Vor dem Zeichnen laden, sonst greift Canvas zur Ersatzschrift.
      try {
        await document.fonts.load('500 18px Inter')
      } catch {
        /* Ersatzschrift ist akzeptabel */
      }
      await idle()
      const medallion = bakeRelief({ draw: drawMedallion, box: MEDALLION.box, pxPerUnit: PX_PER_UNIT })
      await idle()
      const drop = bakeRelief({ draw: drawDrop, box: DROP.box, pxPerUnit: PX_PER_UNIT })
      return { medallion, drop }
    })()
  }
  return bakePromise
}

function idle() {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => resolve(), { timeout: 200 })
    else setTimeout(resolve, 16)
  })
}

function medallionShape() {
  const shape = new THREE.Shape()
  shape.absarc(230, -230, 200, 0, Math.PI * 2, false)
  return shape
}

function dropShape() {
  const { top, rightCurve, arc, leftCurve } = DROP.outline
  const flip = (values) => values.map((v, i) => (i % 2 === 1 ? -v : v))
  const shape = new THREE.Shape()
  shape.moveTo(top[0], -top[1])
  shape.bezierCurveTo(...flip(rightCurve))
  shape.absarc(arc.cx, -arc.cy, arc.r, 0, Math.PI, true)
  shape.bezierCurveTo(...flip(leftCurve))
  return shape
}

// Extrudiert in SVG-Einheiten, damit die UV-Koordinaten direkt aus der Lage
// im Druckvektor folgen. Danach auf Millimeter skaliert und zentriert.
function buildGeometry(shape, { box, unitsPerMm }) {
  const depth = THICKNESS_MM * unitsPerMm
  const bevel = 0.28 * unitsPerMm
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    // Kante nach innen versetzt: die Stanzkontur bleibt exakt die aus dem SVG.
    bevelOffset: -bevel,
    bevelSegments: 5,
    curveSegments: 96,
  })

  const position = geometry.attributes.position
  const normal = geometry.attributes.normal
  const uv = geometry.attributes.uv
  for (let i = 0; i < position.count; i += 1) {
    if (normal.getZ(i) < -0.5) {
      // Rueckseite: ein Punkt ausserhalb der Stanzform — dort ist die Textur
      // glatt und ohne Motiv. Die Rueckseite ist die Klebeflaeche.
      uv.setXY(i, 0.004, 0.996)
      continue
    }
    const u = (position.getX(i) - box.x) / box.w
    const v = 1 + (position.getY(i) + box.y) / box.h
    uv.setXY(i, u, v)
  }
  uv.needsUpdate = true

  geometry.computeBoundingBox()
  const center = new THREE.Vector3()
  geometry.boundingBox.getCenter(center)
  geometry.translate(-center.x, -center.y, -center.z)
  geometry.scale(1 / unitsPerMm, 1 / unitsPerMm, 1 / unitsPerMm)
  return geometry
}

function material(renderer, baked) {
  const map = new THREE.CanvasTexture(baked.albedo)
  map.colorSpace = THREE.SRGBColorSpace
  const normalMap = new THREE.CanvasTexture(baked.normal)
  normalMap.colorSpace = THREE.NoColorSpace
  const anisotropy = renderer.capabilities.getMaxAnisotropy()
  for (const texture of [map, normalMap]) {
    texture.anisotropy = Math.min(8, anisotropy)
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter
  }

  // Soft-Touch: matt, mit einem leichten samtigen Schimmer an den Kanten.
  return new THREE.MeshPhysicalMaterial({
    map,
    normalMap,
    normalScale: new THREE.Vector2(1, 1),
    roughness: 0.64,
    metalness: 0,
    sheen: 0.5,
    sheenRoughness: 0.55,
    sheenColor: new THREE.Color('#ffd2b5'),
  })
}

export async function createStickers(renderer) {
  const baked = await bakeStickerTextures()

  const medallion = new THREE.Mesh(
    buildGeometry(medallionShape(), MEDALLION),
    material(renderer, baked.medallion),
  )
  medallion.name = 'planum_medallion'

  const drop = new THREE.Mesh(buildGeometry(dropShape(), DROP), material(renderer, baked.drop))
  drop.name = 'planum_drop'

  return { medallion, drop }
}
