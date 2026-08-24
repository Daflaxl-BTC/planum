// Headless-Chrome mit DevTools-Protokoll und ein Mini-Webserver dazu.
//
// Warum nicht das einfache --dump-dom aus lib/chrome.mjs: das schreibt das DOM
// nach Ablauf des virtuellen Zeitbudgets heraus, unabhaengig davon, ob die
// Seite fertig ist. Fuer statisches Markup reicht das. Ein WebGL-Render mit
// Software-Rasterizer braucht mehrere Sekunden *echte* Zeit, die vom virtuellen
// Budget nicht abgedeckt wird — der Dump kaeme leer zurueck. Ueber das
// DevTools-Protokoll laesst sich stattdessen auf ein Signal der Seite warten.
//
// Warum ein Webserver statt file://: ES-Module und Importmaps gelten unter
// file:// als Origin "null"; Chrome verweigert den Import. Ein Server auf
// 127.0.0.1 ist der kuerzeste Weg dahin und braucht nur node:http.
//
// Beides ohne Puppeteer — das waere eine Dependency samt eigenem
// Chromium-Download fuer Funktionen, die hier auf ~120 Zeilen passen.

import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdtempSync, rmSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { extname, join, normalize } from 'node:path'

import { findBrowser } from './chrome.mjs'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.glb': 'model/gltf-binary',
}

// Nur lesend, nur localhost, nur fuer die Dauer des Renderlaufs.
export function serveDirectory(root) {
  const server = createServer(async (request, response) => {
    const relative = normalize(decodeURIComponent(request.url.split('?')[0]))
    // Verzeichniswechsel nach oben abweisen, damit ein Tippfehler in einer
    // Vorlage nicht das halbe Dateisystem ausliefert.
    if (relative.includes('..')) {
      response.writeHead(403).end()
      return
    }
    try {
      const body = await readFile(join(root, relative))
      response.writeHead(200, { 'content-type': MIME[extname(relative)] ?? 'application/octet-stream' })
      response.end(body)
    } catch {
      response.writeHead(404).end()
    }
  })

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      resolve({
        origin: `http://127.0.0.1:${port}`,
        close: () => new Promise((done) => server.close(done)),
      })
    })
  })
}

async function poll(url, attempts = 80) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) return response.json()
    } catch {
      // Chrome startet noch.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error(`DevTools-Endpunkt nicht erreichbar: ${url}`)
}

// --enable-unsafe-swiftshader: ohne GPU faellt WebGL auf SwiftShader zurueck.
// Chrome verlangt dafuer seit M110 eine ausdrueckliche Bestaetigung, sonst
// liefert getContext('webgl2') null. "unsafe" meint hier: langsam und ohne
// Hardware-Isolation — fuer einen Offline-Renderlauf ohne Fremdinhalte egal.
export async function launchBrowser({ port = 9222 } = {}) {
  const profile = mkdtempSync(join(tmpdir(), 'planum-chrome-'))
  const process_ = spawn(
    findBrowser(),
    [
      '--headless=new',
      '--disable-gpu',
      '--enable-unsafe-swiftshader',
      '--hide-scrollbars',
      '--no-first-run',
      '--no-default-browser-check',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profile}`,
      'about:blank',
    ],
    { stdio: 'ignore' },
  )

  await poll(`http://127.0.0.1:${port}/json/version`)
  const targets = await poll(`http://127.0.0.1:${port}/json/list`)
  const page = targets.find((target) => target.type === 'page')
  if (!page) throw new Error('Kein Page-Target in Chrome gefunden')

  const socket = new WebSocket(page.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })

  let nextId = 0
  const pending = new Map()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    const resolver = pending.get(message.id)
    if (!resolver) return
    pending.delete(message.id)
    if (message.error) resolver.reject(new Error(message.error.message))
    else resolver.resolve(message.result)
  })

  function send(method, params = {}) {
    const id = (nextId += 1)
    socket.send(JSON.stringify({ id, method, params }))
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }))
  }

  return {
    send,
    async close() {
      socket.close()
      process_.kill()
      // Chrome schreibt beim Beenden noch in sein Profil; ein sofortiges
      // Loeschen laeuft in ENOTEMPTY. maxRetries wartet das ab.
      rmSync(profile, { recursive: true, force: true, maxRetries: 20, retryDelay: 100 })
    },
  }
}

// Laedt eine Seite und wartet, bis sie selbst meldet, dass sie fertig ist.
// Die Vorlage signalisiert ueber document.title: 'ready' oder 'error: …'.
export async function renderPage(browser, url, { timeout = 120_000 } = {}) {
  await browser.send('Page.navigate', { url })
  const result = await browser.send('Runtime.evaluate', {
    expression: `new Promise((resolve) => {
      const started = Date.now()
      const timer = setInterval(() => {
        if (document.title) { clearInterval(timer); resolve(document.title) }
        else if (Date.now() - started > ${timeout}) { clearInterval(timer); resolve('timeout') }
      }, 100)
    })`,
    awaitPromise: true,
    returnByValue: true,
    timeout,
  })
  const status = result.result.value
  if (status !== 'ready') throw new Error(`Render fehlgeschlagen (${status}): ${url}`)
}

// Holt eine Data-URI aus dem geladenen Dokument und gibt sie als Buffer zurueck.
export async function readDataUri(browser, selector) {
  const result = await browser.send('Runtime.evaluate', {
    expression: `document.querySelector(${JSON.stringify(selector)}).src`,
    returnByValue: true,
  })
  const source = result.result.value ?? ''
  const comma = source.indexOf(',')
  if (!source.startsWith('data:') || comma < 0) {
    throw new Error(`Kein Bild in ${selector}`)
  }
  return Buffer.from(source.slice(comma + 1), 'base64')
}
