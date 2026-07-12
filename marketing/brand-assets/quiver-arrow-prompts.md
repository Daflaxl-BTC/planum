# Quiver / Arrow 1.1 – Logo Regeneration Prompts

Für app.quiver.ai. Jede der vier Sektionen ist ein eigenständiger Prompt – kopiere den jeweiligen Block 1:1 in Arrow 1.1.

Allgemeine Hinweise zum Workflow:

1. Pro Marke einmal den Master-Prompt absenden, dann je Variante (Icon / Wordmark / Lockup / Dark) eine Folge-Iteration.
2. Output-Format immer auf SVG forcieren ("export: SVG, optimized paths").
3. Wenn Arrow Text als Pfade rendern kann, das aktivieren – sonst Font explizit deklarieren.
4. Bei Schriftarten ohne Lizenz für Kommerz: Outline-Conversion nach dem Export.

---

# 1) PLANUM – Smart Plant Tracking

```
ROLE
You are a senior brand designer producing a complete, production-ready logo
suite for "Planum", a smart indoor-plant-tracking app (QR stickers + AI plant
recognition + care reminders). Output every asset as a clean, optimized SVG.

BRAND POSITIONING
Planum makes caring for houseplants effortless: a customer applies a QR
sticker to each plant pot, scans it, and the app identifies the species via
AI and schedules watering, fertilizing, and repotting. The brand feels
botanical, calm, and quietly intelligent — somewhere between a Berlin
concept-store and a Scandinavian gardening app. NOT cute, NOT cartoon, NOT
"app-bro"-tech.

VISUAL DNA
- Botanical minimalism, organic line work
- Earthy / herbal palette with deep forest green as anchor
- Serif headline + clean sans-serif tagline (editorial, not techy)
- Round/circular containment for profile-safe crops
- Light cream + earth-brown accents to give warmth (NOT pure white)

EXACT COLOR PALETTE (hex, do not deviate)
- Forest Green primary  : #386538
- Mid Green             : #4a7f4a
- Mint highlight        : #98bc98
- Pale leaf             : #c3d9c3
- Cream background      : #fdf8ed
- Soft cream            : #fefcf7
- Earth accent          : #9a683a
- Deep ink (text)       : #353c2e
- Subtle border         : #e0ece0

TYPOGRAPHY
- Wordmark             : "Lora", serif, weight 700, tight optical kerning
- Tagline / arc text   : "Lato", sans-serif, weight 500–600, letter-spacing
                         +6 to +14 (caps), small-caps look
- Fallback stack       : Lora, Georgia, "Times New Roman", serif /
                         Lato, "Helvetica Neue", Arial, sans-serif

CORE ICON: THE LEAF MARK
A two-stroke abstract leaf — one curved primary leaf-edge, one inner
vein/curl. Rendered as line art (stroke, not fill), 1.5px stroke at base
scale, round caps and round joins. The leaf is asymmetric: the main blade
arches up-right, the inner vein curls in toward the stem. NO realistic
rendering, NO veins/serration detail — purely a calligraphic gesture.

DELIVERABLES (separate SVG files)

1. ICON / FAVICON   (viewBox 0 0 32 32)
   - Rounded square, radius 8, fill #386538
   - White / mint leaf gestures inside, 3 layered tones (#98bc98 base,
     #c3d9c3 highlight, #6b9b6b shadow)
   - No outer stroke, no shadow
   - File: planum-icon.svg

2. PROFILE / LEAF MARK   (viewBox 0 0 1080 1080)
   - Full-bleed circle, radial gradient #4a7f4a → #386538 → #2e512e
   - Soft mint glow centered above middle (#98bc98 @ 35% opacity)
   - Centered leaf glyph, ~700px tall, white-to-cream linear gradient
     (#ffffff → #e8ebe2)
   - Subtle drop shadow: stdDeviation 6, dy 8, slope 0.25
   - File: planum-logo-leaf.svg

3. WORDMARK LOGO   (viewBox 0 0 1080 1080)
   - Cream radial background (#fefcf7 → #f6f7f4 → #e8ebe2), 2px inner
     ring stroke #e0ece0
   - Watermark leaf in soft green at 10% opacity, top third
   - Filled green disc badge above wordmark, 60px radius, gradient
     #4a7f4a → #386538, inverted leaf glyph in white inside
   - Wordmark "Planum", Lora 700, font-size 170, fill #353c2e, centered
   - Tagline "PFLANZEN · PLAN · KI", Lato, font-size 32, fill #7a8963,
     letter-spacing 6
   - Three decorative dots beneath tagline, fading opacity (1.0 / 0.6 / 0.3)
   - File: planum-logo-wordmark.svg

4. MONOGRAM "P"   (viewBox 0 0 1080 1080)
   - Cream/earth radial background (#fdf8ed → #f0e6d6 → #e0ccab)
   - Two faint forest-green concentric inner rings
   - Top arc text: "PLANUM · BERLIN", Lato 38, #9a683a, letter-spacing 14
   - Bottom arc text: "SMART PLANT CARE · EST. 2026", Lato 30, #9a683a
   - Massive serif "P" in center, Lora 700, 620px font-size,
     gradient fill #386538 → #2e512e, with soft drop shadow
   - Small leaf accent right-of-P shoulder, mid-green stroke
   - Two small earth-tone bookend dots on horizontal centerline
   - File: planum-logo-monogram.svg

5. HORIZONTAL LOCKUP (NEW – generate for header use)   (viewBox 0 0 600 160)
   - Round green badge left (80px radius), white leaf inside
   - Wordmark "Planum" right of badge, Lora 700, ~96px, #353c2e
   - Optional baseline divider + tagline below in Lato caps
   - File: planum-logo-horizontal.svg

TECHNICAL REQUIREMENTS (apply to ALL files)
- Pure vector — no embedded raster, no base64 data URIs
- All gradients in <defs>, named meaningfully (id="leafShade", id="bg2", …)
- Optimized paths, no duplicate or invisible shapes, no metadata bloat
- Group structure: <g id="background">, <g id="icon">, <g id="wordmark">
- Stroke widths in absolute units, never `vector-effect: non-scaling-stroke`
  unless explicitly specified
- Output text as <text> with full font-family stack AND ALSO provide a
  second variant where text has been converted to <path> outlines for
  font-independence — name the outlined version "*-outlined.svg"
- Transparent background only on horizontal lockup; round-bg variants keep
  their gradient fills

DON'TS
- No realistic photographic leaves
- No 3D bevels, glossy highlights, or pseudo-Apple sheen
- No swooshes, lensflares, or generic "tech" arcs
- No emoji-style colors (avoid #00FF00, neon greens)
- No "AI sparkle" stars, no tree silhouettes, no tropical foliage
- No mascots, no characters, no human shapes
- No registered/trademark symbols in the artwork
```

---

# 2) QUICKALERT – Premium Alert Beacon

```
ROLE
You are a senior brand designer producing a complete logo suite for
"QuickAlert", a marketing/lead-capture service that turns alert signups into
follow-up email flows. Output every asset as production-ready SVG.

BRAND POSITIONING
QuickAlert is a premium notification & alert capture product. The visual
language must signal "important, but classy" — think a luxurious warning
beacon, not an emergency siren. Warmth over panic. Premium amber-and-gold,
NOT red. The icon is a stylized lighthouse-style beacon: rounded base, glass
dome, glowing core.

VISUAL DNA
- Premium amber & gold palette on warm dark background
- Glow + halo, but contained — no garish neon
- Geometric beacon silhouette, slight pictogram look
- Confident sans-serif wordmark, modern but not minimalistic to the point
  of generic
- Subtle animated counterpart possible (pulsing core), but logo file is
  static SVG; reserve animations for a separate "*-animated.svg"

EXACT COLOR PALETTE
- Amber primary       : #F59E0B
- Warm gold highlight : #FBBF24
- Deep amber shadow   : #B45309
- Warm brown base     : #8B6F47
- Background warm     : #2A1D0E
- Background mid      : #4A331A
- Cream highlight     : #FFF8E7
- Pure white (sparingly): #FFFFFF

TYPOGRAPHY
- Wordmark : "Inter", weight 700–800, slightly tightened tracking (-1)
- Tagline  : "Inter", weight 500, uppercase, letter-spacing +4
- Fallback : Inter, "Helvetica Neue", system-ui, sans-serif

CORE ICON: THE BEACON
Composed in 5 layers, drawn front-to-back:
1. Outer halo glow         — radial gradient, amber, fading to transparent
2. Background disc         — deep warm brown, gradient #2A1D0E → #4A331A
3. Inner gold ring         — 2px stroke, gradient amber → gold
4. LED pulse ring          — 3px stroke, #F59E0B at 60% opacity
                             (animated variant: opacity 0.4↔0.8 @ 2s loop)
5. Beacon body (centered)  :
   - Saucer base (ellipse, brown #8B6F47)
   - Square housing (rect, gradient #B45309 → #8B6F47, rx 3)
   - Dome (path: rounded triangle/arch, gradient amber → gold)
   - Inner shine highlight (path, white @ 70% opacity)
   - Pulse light at dome center (#FBBF24, optionally animated radius
     6→10→6 @ 1.5s)

The beacon must read as "lighthouse / alert tower" at any size — silhouette
test passes at 16px.

DELIVERABLES

1. PRIMARY LOGO ICON   (viewBox 0 0 120 120)
   - All 5 layers above, halo at 50% opacity for safety on light AND dark
     backgrounds
   - File: quickalert-icon.svg
   - Animated variant: quickalert-icon-animated.svg

2. APP ICON (iOS / favicon)   (viewBox 0 0 1024 1024)
   - Rounded square (radius 224), gradient background
   - Beacon scaled to fill ~70% of canvas, halo extends to canvas edge but
     fades out by 95%
   - File: quickalert-app-icon.svg

3. HORIZONTAL LOCKUP   (viewBox 0 0 720 160)
   - Beacon icon left (size 120), wordmark "QuickAlert" right
   - Wordmark: Inter 800, ~80px, fill #2A1D0E (light variant) /
     #FFF8E7 (dark variant)
   - Optical alignment: cap-height of "Q" matches diameter of icon's inner
     gold ring
   - File: quickalert-logo.svg + quickalert-logo-dark.svg

4. WORDMARK ONLY   (viewBox 0 0 720 200)
   - Pure type, Inter 800, kerning tightened, optional small amber dot or
     tick over the "i" referencing the beacon pulse
   - File: quickalert-wordmark.svg

5. MONOCHROME EMERGENCY VARIANTS
   - 1-color black on transparent (quickalert-mono-black.svg)
   - 1-color white on transparent (quickalert-mono-white.svg)
   - For embossing / single-color print

TECHNICAL REQUIREMENTS
- All gradients in <defs>: outerGlow, bgGradient, ringGradient, baseGradient,
  domeGradient, shineGradient
- Animations only in the *-animated.svg variants, using <animate> tags;
  static SVGs must NOT contain animation tags (some tools strip them and
  break the file)
- Group structure: <g id="halo">, <g id="bg">, <g id="rings">,
  <g id="beacon">, <g id="wordmark">
- Pure vector, no raster
- viewBox tight to artwork, no excess padding (allow ≤4% breathing room)

DON'TS
- No red emergency-siren colors (#FF0000 / #DC2626 forbidden)
- No exclamation marks ("!") in the icon
- No bell icons, no megaphone, no envelope — those are notification clichés
- No shield, no checkmark, no lock
- No realistic lighthouse with stripes
- No outlined sans-serif wordmark — solid fills only
- No drop shadows on the wordmark
```

---

# 3) SATOSHI RETIREMENT – Bitcoin Sunset Wordmark

```
ROLE
You are a senior brand designer producing the complete logo suite for
"Satoshi Retirement", a Bitcoin retirement / financial-freedom calculator
landing page. Output as production-ready SVG.

BRAND POSITIONING
Satoshi Retirement helps people model what their Bitcoin holdings could mean
for early retirement. The aesthetic is "financial freedom on a beach at
sunset" — Bitcoin orange sun on a dark navy horizon, palm silhouettes,
calm and aspirational, NOT crypto-bro neon. The wordmark is the hero; the
sunset scene lives in the avatar/profile asset.

VISUAL DNA
- Bitcoin orange sunset gradient
- Deep navy night sky transitioning to molten amber horizon
- Geometric Bitcoin "₿" glyph as the only crypto symbol
- Modern geometric sans-serif wordmark, weight 800
- Restraint: ONE light source (the sun), no extra glowing elements

EXACT COLOR PALETTE
- Bitcoin orange       : #f7931a
- Orange light         : #fdb94d
- Orange deep          : #c77600
- Sunset peach         : #FFE9C4
- Burnt sienna         : #5c2a00
- Deep navy            : #0a0d18
- Mid navy             : #1c1530
- Twilight purple      : #4a2218
- Light text on dark   : #e6edf3
- Dark text on light   : #1c2025

TYPOGRAPHY
- Wordmark      : "Space Grotesk", weight 800, letter-spacing -2
- Fallback stack: "Space Grotesk", Inter, "Helvetica Neue", sans-serif
- The "₿" glyph in the wordmark uses the same font's Bitcoin code-point if
  present; otherwise a manually drawn ₿ matching the font's stroke contrast
  must be inserted as a <path>

CORE WORDMARK STRUCTURE
"₿ Satoshi" colored in the orange gradient, "Retirement" colored in the
neutral tone (light or dark depending on background variant). The two halves
are separated only by color shift, not by spacing trick. Optical kerning
between "i" of "Satoshi" and "R" of "Retirement" should feel like one word.

DELIVERABLES

1. WORDMARK – LIGHT BG   (viewBox 0 0 900 200)
   - "₿ Satoshi" filled with linear gradient #f7931a → #fdb94d (top-left to
     bottom-right)
   - "Retirement" filled with #1c2025 (near-black, never pure black)
   - Transparent background
   - Font-size 110, x-baseline 130
   - File: satoshi-logo.svg

2. WORDMARK – DARK BG   (viewBox 0 0 900 200)
   - Same as above, but "Retirement" filled with #e6edf3
   - Transparent background (the dark canvas comes from the page)
   - File: satoshi-logo-dark.svg

3. APP ICON / FAVICON   (viewBox 0 0 256 256)
   - Rounded square (radius 56), gradient background #1c2540 → #0a0d18
   - Centered halo (radial gradient amber, 0.55 → 0 opacity)
   - Sun disc (circle r=70, gradient #FFE9C4 → #fdb94d → #f7931a → #c77600)
   - Bitcoin "₿" glyph stamped on the sun in dark amber #2a1300, scale 0.22
   - Glyph includes its 4 vertical "ticks" above and below (Bitcoin
     canonical form: 4 short rectangles, 2 top + 2 bottom)
   - File: satoshi-icon.svg

4. SUNSET PROFILE PICTURE   (viewBox 0 0 1080 1080) — Instagram-safe
   - Square base, full-bleed sunset:
     · Sky gradient top-down: #0a0d18 → #1c1530 → #4a2218 → #9c5a0a →
       #f7931a → #fdb94d
     · Ocean below horizon (y=700): #c77600 → #5a2f08 → #16121e → #0a0a14
       → #000000
   - Sun fully above horizon, large halo, ₿ centered on disc
   - Reflection wedge on water (orange gradient, fading to transparent)
   - Two black palm silhouettes (left larger, right smaller mirrored), drawn
     as feathered fronds — each frond is a curved rachis with ~22 short
     leaflets above and shorter ones below for "drooping" gravity look
   - Subtle stars in upper sky (≤10 small white circles, varied opacity)
   - Faint vignette at corners (#000 @ 50% in outer 30%)
   - Wordmark band at bottom: rounded rect #000 @ 42% opacity, white text
     "SATOSHI RETIREMENT", Space Grotesk 800, font-size 42, letter-spacing 3
   - File: satoshi-profilbild.svg

5. HORIZONTAL LOCKUP w/ SUN   (viewBox 0 0 1200 240)
   - Small sun icon left (90px), wordmark right
   - For email signature / blog header
   - File: satoshi-logo-horizontal.svg

TECHNICAL REQUIREMENTS
- All gradients in <defs>: skyGrad, oceanGrad, sunGrad, sunHalo, btcOnSun,
  reflection, orangeGrad, vignette
- Palm fronds: define <symbol id="frond"> once, instantiate via <use> with
  rotate transforms — keeps file size lean
- Wordmark text rendered as <text>; provide additional outlined version
  named "*-outlined.svg" for font-independence
- Pure vector, no raster
- Group structure: <g id="sky">, <g id="sun">, <g id="ocean">,
  <g id="palms-left">, <g id="palms-right">, <g id="wordmark">

DON'TS
- No "Lambo" tropes, no rocket ships, no diamond hands
- No glitchy / matrix effects
- No green crypto colors anywhere
- No 3D rendered Bitcoin coins
- No hyper-realistic photographic beaches
- No multiple suns, no moons, no clouds
- No script / handwritten fonts
- No "₿" used outside the wordmark and the icon — it's a single, rare element
```

---

# 4) KAFFEEKUMPEL – QR Coffee Kasse

```
ROLE
You are a senior brand designer producing the complete logo suite for
"kaffeekumpel", an account-less coffee-fund app for shared kitchens (WGs,
offices). Each group has a QR code that members scan to log a coffee or
settle up via PayPal.me. Output as production-ready SVG.

BRAND POSITIONING
Friendly, low-key, German-Mittelstand-meets-startup. The product is
"hang it on the wall, scan, done". Visual tone: warm, woody, approachable,
slightly handcrafted. NOT corporate, NOT sleek-SaaS, NOT cute-mascot.
Lowercase wordmark always: "kaffeekumpel".

VISUAL DNA
- Warm coffee-brown palette anchored by cream
- A coffee cup with a QR-code label on its side as the central icon
- Subtle steam wisps as decorative flourish, not literal
- Wordmark in geometric sans-serif, lowercase, tight tracking
- Tagline in spaced caps, like a vintage Kaffeerösterei stamp

EXACT COLOR PALETTE (from tailwind.config.ts)
- kaffee-50  cream         : #FAF6F1
- kaffee-100               : #F1E7D8
- kaffee-700 mid brown     : #5B3A1E
- kaffee-800 dark brown    : #3A2618
- deep brown               : #2E1D10
- shadow brown             : #1F140A

TYPOGRAPHY
- Wordmark : "Inter" or "Space Grotesk", weight 800, lowercase,
             letter-spacing -3, optical sizing tight
- Tagline  : "Inter", weight 500, uppercase, letter-spacing +4 to +6
- Fallback : Inter, "Space Grotesk", "Helvetica Neue", system-ui

CORE ICON: THE QR-CUP
A 3/4-front view of a ceramic mug (NOT a paper cup, NOT a takeaway lid)
with a square QR-code label on its side. Construction:

- Saucer (flat ellipse beneath cup) — single shade dark brown
- Cup body (rounded rectangle, rx 14) — cream gradient #FAF6F1 → #F1E7D8
- Handle (curved C-shape on right side, single thick stroke, cream tone,
  with a subtle inner shadow line at 25% opacity to imply roundness)
- 3 steam wisps above the cup (curving sine-wave paths, brown/cream stroke,
  round-capped, ~55% opacity)
- QR-CODE LABEL on cup body:
   · 10×10 module grid, module size scales with cup
   · 3 finder patterns (top-left, top-right, bottom-left): outer 7×7 dark,
     inner 5×5 light, core 3×3 dark — canonical QR finder
   · Hand-placed data modules in remaining cells for "alive" QR feeling
   · Module color: #3A2618 dark brown
   · Background: cream #FAF6F1, optional 4px border in same dark brown
- The QR label sits centered on the cup body, slightly tilted ≤2° feels
  human; perfectly square also OK

DELIVERABLES

1. PRIMARY LOGO – HORIZONTAL   (viewBox 0 0 900 240)
   - QR-cup icon left, ~180px tall
   - Wordmark "kaffeekumpel" centered vertically right of icon, Inter 800,
     font-size 92, fill #3A2618, letter-spacing -3
   - Tagline "DIE QR-KAFFEEKASSE" beneath wordmark, Inter 500, font-size 22,
     letter-spacing 4, fill #5B3A1E
   - File: kaffeekumpel-logo.svg

2. APP ICON   (viewBox 0 0 256 256)
   - Rounded square (radius 56), radial gradient #5B3A1E → #2E1D10
   - QR-cup icon centered, scaled to ~75% of canvas, cup tones brightened
     against dark background, steam in cream at 55% opacity
   - File: kaffeekumpel-icon.svg

3. WORDMARK ONLY   (viewBox 0 0 720 200)
   - Centered "kaffeekumpel", Inter 800, 100px, #3A2618
   - Tagline below in caps, Inter 500, 22px, letter-spacing 6
   - Transparent background
   - File: kaffeekumpel-wordmark.svg

4. CIRCULAR PROFILE BADGE   (viewBox 0 0 1080 1080)
   - Round full-bleed background, radial gradient #5B3A1E → #3A2618 → #2E1D10
   - Cream cup centered, large QR label, generous steam wisps
   - No wordmark inside (Instagram-safe inner circle)
   - File: kaffeekumpel-profile.svg

5. STAMP / SEAL VARIANT (NEW)   (viewBox 0 0 600 600)
   - Two concentric thin circles (kaffee-700 stroke)
   - Top arc: "KAFFEEKUMPEL · DIE QR-KAFFEEKASSE"
   - Bottom arc: "EST. 2025 · MUNICH"
   - Tiny coffee bean motif at left + right bookends
   - Center: lowercase "k" monogram, Inter 800, very large
   - File: kaffeekumpel-stamp.svg

TECHNICAL REQUIREMENTS
- Define gradients once in <defs>: cupBody, bgRadial
- Define the QR code as <g id="qr-mark"> reusable symbol so the same module
  pattern appears in every variant
- Pure vector, no raster
- Wordmark as <text> with full font stack AND a "*-outlined.svg" variant
- Group structure: <g id="bg">, <g id="cup">, <g id="qr">, <g id="steam">,
  <g id="wordmark">

DON'TS
- No coffee bean as the primary icon (steam + cup + QR is the gestalt — beans
  only allowed as bookend ornament in the stamp)
- No Cappuccino-foam-art (no hearts, leaves, swirls in the cup top)
- No takeaway / paper cup with sleeve (we are the WG-mug brand)
- No "smiling cup" mascots, no eyes on the cup
- No lightning / wifi / cloud icons
- No German-flag colors
- No camelCase, no PascalCase wordmark — always lowercase
- No registered/trademark symbols
- No realistic wood textures or photographic backgrounds — flat vector only
```

---

# Globale Output-Spezifikation (für alle vier Marken)

Wenn Arrow 1.1 erlaubt, einen "Output Spec"-Block mitzusenden, hänge diesen
an JEDEN der oben stehenden Prompts an:

```
OUTPUT SPECIFICATION
- Format            : SVG 1.1, valid XML, UTF-8
- Color profile     : sRGB only, hex values exactly as specified
- viewBox           : tight to artwork, no inflated padding
- Embedded fonts    : NONE (use font-family + provide outlined variant)
- Filters           : only feGaussianBlur / feOffset / feMerge if explicitly
                      called for in the brief; nothing else
- Filesize target   : ≤8 KB per file post-optimization (SVGO defaults)
- Group naming      : as specified per brand
- Validation        : output must pass W3C SVG validator; no <foreignObject>,
                      no <script>, no external refs, no xlink:href to remote
- Animation         : only in files explicitly suffixed "-animated.svg"
- Background        : transparent unless brief states a fill
- Naming convention : kebab-case, brand-prefix, e.g.
                      planum-logo-wordmark.svg

QUALITY CHECKLIST (model self-checks before delivery)
[ ] Logo is recognizable at 16×16 px
[ ] Logo is recognizable in pure black, pure white, single-color print
[ ] No Adobe-Illustrator-leftover IDs (path123, Layer_1)
[ ] No clip-paths used to "fake" vector — every shape is a real path
[ ] Wordmark spelled correctly (Planum / QuickAlert / Satoshi Retirement /
    kaffeekumpel — note casing)
[ ] No accidental white box behind transparent assets
[ ] Hex values match the brand palette character-for-character
```

---

# Tipps für Arrow 1.1

- Arrow versteht "ROLE / BRIEF / DELIVERABLES / DON'TS"-Struktur am besten
  — die Reihenfolge nicht umstellen.
- Bei Schriftart-Vorgaben: Arrow rendert Schrift manchmal als bitmap-tracing.
  Wenn der Output unsauber ist, in einer zweiten Iteration explizit fragen:
  "Render the wordmark as native &lt;text&gt; with font-family exactly as
  specified. Provide a second variant with text converted to outline paths
  via geometric reconstruction."
- Bei zu wenig Detail: in der Iteration spezifisch nachschärfen ("the leaf
  arcs more aggressively to the upper-right, the inner vein curls 30 degrees
  tighter").
- Variante in 16px / 32px / 256px / 1024px nebeneinander rendern lassen vor
  dem Approve — viele Logos sehen erst dann den Skalierungs-Test bestehen.

---

# Verwendung

1. Quiver Arrow 1.1 öffnen.
2. Pro Marke einen Master-Prompt absenden.
3. Iterieren bis das Set sitzt.
4. Output-SVGs lokal als `brand-assets/<datei>.svg` ablegen — überschreibt
   die aktuell vorhandenen Files in den Projektordnern.
5. Vor Commit: optional durch SVGO laufen lassen
   (`npx svgo brand-assets/*.svg --multipass`).
