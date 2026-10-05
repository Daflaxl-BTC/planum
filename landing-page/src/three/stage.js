import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

import { createStickers } from './stickers'

// Eine WebGL-Buehne fuer die beiden Sticker.
//
// Wird erst nach dem ersten Bild der Seite per dynamic import geladen (siehe
// StickerStage.jsx) — three.js steht damit nicht im kritischen Pfad, der LCP
// bleibt das vorgerenderte Standbild.
//
// Die Buehne kennt keine Abschnitte der Seite. Sie bekommt Zielposen
// (setPose) und laeuft weich dorthin; welche Pose wann gilt, entscheidet die
// React-Seite.

const DEG = Math.PI / 180

export async function createStage(
  canvas,
  { reducedMotion = false, tone = 'dark', preserveDrawingBuffer = false, pixelRatio } = {},
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
    // Nur fuer den Offline-Export (scripts/render-stage.mjs), der das Bild
    // nach dem Rendern ausliest.
    preserveDrawingBuffer,
  })
  renderer.setPixelRatio(pixelRatio ?? Math.min(window.devicePixelRatio || 1, 2))
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 0.92
  renderer.outputColorSpace = THREE.SRGBColorSpace

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = tone === 'dark' ? 0.3 : 0.5
  pmrem.dispose()

  // Hauptlicht von oben links wie in den bisherigen Renders (Nordfenster).
  const key = new THREE.DirectionalLight(0xfff1e2, 2.6)
  key.position.set(-60, 80, 90)
  scene.add(key)

  // Kantenlicht von hinten rechts. Auf dunklem Grund zeichnet es die Kontur
  // nach — in Moosgruen statt Weiss, damit es zur Seite gehoert.
  const rim = new THREE.DirectionalLight(tone === 'dark' ? 0x9fdcb4 : 0xffffff, tone === 'dark' ? 3.2 : 0.8)
  rim.position.set(90, 40, -60)
  scene.add(rim)

  const fill = new THREE.DirectionalLight(0xffd9bd, 0.45)
  fill.position.set(70, -50, 60)
  scene.add(fill)

  scene.add(new THREE.AmbientLight(0xf7ede0, 0.1))

  const camera = new THREE.PerspectiveCamera(28, 1, 1, 1000)
  camera.position.set(0, 0, 170)

  const { medallion, drop } = await createStickers(renderer)
  const actors = { medallion, drop }
  // Bewusst nicht in mesh.userData: das wird beim Klonen (GLB-Export) per
  // JSON kopiert, und der Rueckverweis auf die Gruppe waere zirkulaer.
  const pivots = new Map()
  for (const mesh of Object.values(actors)) {
    const pivot = new THREE.Group()
    pivot.add(mesh)
    scene.add(pivot)
    pivots.set(mesh, pivot)
  }

  // Aktueller und Ziel-Zustand je Objekt: Position (mm), Drehung (Grad),
  // Skalierung, Sichtbarkeit.
  const state = {}
  for (const name of Object.keys(actors)) {
    state[name] = {
      current: { p: [0, 0, 0], r: [0, 0, 0], s: 1, o: 1 },
      target: { p: [0, 0, 0], r: [0, 0, 0], s: 1, o: 1 },
      float: name === 'medallion' ? 0 : 1.7,
    }
  }

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  let width = 1
  let height = 1
  let frame = 0
  let running = false
  let last = performance.now()
  let first = true

  function resize() {
    const rect = canvas.getBoundingClientRect()
    width = Math.max(1, rect.width)
    height = Math.max(1, rect.height)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // Auf schmalen Flaechen zurueckfahren, damit nichts angeschnitten wird.
    camera.position.z = camera.aspect < 1 ? 170 / Math.max(0.62, camera.aspect) : 170
    camera.updateProjectionMatrix()
  }

  function setPose(pose, { instant = false } = {}) {
    for (const [name, values] of Object.entries(pose)) {
      const entry = state[name]
      if (!entry) continue
      Object.assign(entry.target, values)
      if (instant || reducedMotion) {
        entry.current = {
          p: [...entry.target.p],
          r: [...entry.target.r],
          s: entry.target.s,
          o: entry.target.o,
        }
      }
    }
    if (!running) render(performance.now(), 0)
  }

  function setPointer(x, y) {
    pointer.tx = x
    pointer.ty = y
  }

  // Bildratenunabhaengige Daempfung.
  const damp = (from, to, lambda, dt) => from + (to - from) * (1 - Math.exp(-lambda * dt))

  function render(now, dt) {
    const time = now / 1000
    pointer.x = damp(pointer.x, pointer.tx, 4, dt)
    pointer.y = damp(pointer.y, pointer.ty, 4, dt)

    for (const [name, mesh] of Object.entries(actors)) {
      const { current, target, float } = state[name]
      const speed = 3.2
      for (let i = 0; i < 3; i += 1) {
        current.p[i] = damp(current.p[i], target.p[i], speed, dt)
        current.r[i] = damp(current.r[i], target.r[i], speed, dt)
      }
      current.s = damp(current.s, target.s, speed, dt)
      current.o = damp(current.o, target.o, speed * 1.5, dt)

      const bob = reducedMotion ? 0 : Math.sin(time * 0.8 + float) * 1.4
      const sway = reducedMotion ? 0 : Math.sin(time * 0.5 + float) * 4

      const pivot = pivots.get(mesh)
      pivot.position.set(current.p[0], current.p[1] + bob, current.p[2])
      pivot.rotation.set(
        (current.r[0] + pointer.y * 10) * DEG,
        (current.r[1] + sway + pointer.x * 16) * DEG,
        current.r[2] * DEG,
      )
      pivot.scale.setScalar(Math.max(0.0001, current.s * current.o))
      pivot.visible = current.o > 0.02
    }

    renderer.render(scene, camera)
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    render(now, dt)
    if (first) {
      first = false
      canvas.dispatchEvent(new CustomEvent('stage:ready'))
    }
    frame = requestAnimationFrame(loop)
  }

  function start() {
    if (running) return
    running = true
    last = performance.now()
    frame = requestAnimationFrame(loop)
  }

  function stop() {
    running = false
    cancelAnimationFrame(frame)
  }

  function dispose() {
    stop()
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose()
      if (object.material) {
        for (const value of Object.values(object.material)) {
          if (value && value.isTexture) value.dispose()
        }
        object.material.dispose()
      }
    })
    scene.environment?.dispose()
    renderer.dispose()
  }

  resize()

  return {
    setPose,
    setPointer,
    resize,
    start,
    stop,
    dispose,
    renderOnce: () => render(performance.now(), 1),
    // Fuer den Export als GLB.
    actors,
  }
}
