// Drei Strichzeichnungen fuer die Schrittfolge in HowItWorks.
//
// Warum gezeichnet und nicht fotografiert oder gerendert: die drei Schritte
// spielen am Topf, und genau dieses Bild gibt es noch nicht — der Sticker ist
// nicht produziert. Ein Foto-Komposit davon war der Grund, warum die alte
// Fassung billig wirkte, und ein Render mit Topf waere dieselbe Behauptung in
// sauberer Optik.
//
// Die Zeichnungen behaupten deshalb kein Material und keinen Ort, sondern
// zeigen nur Geometrie: die beiden echten Stanzformen (Kreis Ø 40 mm und
// Tropfen 32 x 40 mm im richtigen Verhaeltnis) und die Handlung als Diagramm.
// Strichstaerke und Strichelung sind dieselben wie bei den Hilfslinien im Hero
// (Medallion), damit die Seite eine Zeichensprache hat und nicht drei.

const STROKE = '#96522F'

// Radius des runden Profilplaettchens im 120er-Raster.
const DISC = 23

// Strichstaerke bewusst im Nutzerkoordinatensystem statt non-scaling-stroke:
// bei rund 200 px Darstellungsbreite ergibt 1,1 knapp zwei Geraetepixel. Ein
// echtes 1-px-Haarlinie verschwindet in der Flaeche, die Zeichnung wirkt dann
// wie ein Rest und nicht wie eine Setzung.
function Frame({ children, label }) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label={label}
      className="h-full w-full"
      fill="none"
      stroke={STROKE}
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

// 01 — Aufkleben: die gestrichelte Markierung ist die Zielflaeche, die
// durchgezogene Scheibe liegt leicht versetzt darueber. Der Versatz ist der
// ganze Trick: er zeigt Bewegung, ohne dass etwas animiert werden muss.
function Stick() {
  return (
    <Frame label="Runder Sticker wird auf eine markierte Fläche gelegt.">
      <circle cx="52" cy="76" r={DISC + 8} strokeDasharray="6 7" opacity="0.4" />
      <circle cx="66" cy="50" r={DISC} opacity="0.9" />
      <circle cx="66" cy="50" r={DISC - 7} opacity="0.3" />
      {/* Fallrichtung als zwei kurze Spuren, nicht als Pfeil: ein Pfeil waere
          Piktogramm-Sprache und faellt aus der Zeichnung heraus. */}
      <path d="M104 8 L88 24" opacity="0.45" />
      <path d="M112 22 L100 34" opacity="0.28" />
    </Frame>
  )
}

// 02 — Antippen: Scheibe plus drei Boegen. Die Boegen sitzen dort, wo beim
// Halten das Geraet steht, und wiederholen das NFC-Motiv des Stickers.
function Tap() {
  return (
    <Frame label="Ein Gerät wird an den runden Sticker gehalten, Funkwellen gehen aus.">
      <circle cx="40" cy="74" r={DISC} opacity="0.9" />
      <circle cx="40" cy="74" r={DISC - 7} opacity="0.3" />
      <path d="M62 56 A 26 26 0 0 0 62 30" opacity="0.55" />
      <path d="M72 60 A 36 36 0 0 0 72 22" opacity="0.35" />
      <path d="M82 64 A 46 46 0 0 0 82 14" opacity="0.2" />
      {/* Geraetekante, angeschnitten — ein vollstaendiges Handy waere ein
          Icon, die Kante bleibt Andeutung. */}
      <path d="M96 112 L96 24 A 7 7 0 0 1 103 17 L120 17" opacity="0.35" />
    </Frame>
  )
}

// 03 — Giessen loggen: der Tropfen im echten Seitenverhaeltnis 32 : 40 mm.
// Die Kontur ist aus zwei Boegen und einer Spitze gebaut, wie die Stanzform.
function Log() {
  return (
    <Frame label="Tropfenförmiger Sticker mit einem fallenden Tropfen darüber.">
      <path d="M58 32 C 84 56 92 86 58 94 C 24 86 32 56 58 32 Z" opacity="0.9" />
      <path d="M58 52 C 72 66 76 80 58 84 C 40 80 44 66 58 52 Z" opacity="0.3" />
      <path d="M58 6 C 66 13 68 22 58 24 C 48 22 50 13 58 6 Z" opacity="0.45" />
      {/* Wasseroberflaeche als zwei Linien: der Tropfen faellt in etwas hinein,
          das nicht naeher bezeichnet werden muss. */}
      <path d="M28 108 L88 108" opacity="0.28" />
      <path d="M40 116 L76 116" opacity="0.16" />
    </Frame>
  )
}

const DIAGRAMS = { stick: Stick, tap: Tap, log: Log }

export function StepDiagram({ name, className = '' }) {
  const Drawing = DIAGRAMS[name]
  if (!Drawing) return null
  return (
    <div className={className}>
      <Drawing />
    </div>
  )
}
