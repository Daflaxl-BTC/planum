# native/ — iOS-Assets & Konfiguration (Capacitor)

Kanonische Quelle für native Konfig, die nicht direkt im generierten `app/ios/`-Xcode-Projekt gepflegt werden soll. Bei Änderungen hier **und** an der wirksamen Stelle im Xcode-Projekt synchron halten.

## aasa/
`apple-app-site-association` — Universal-Links-Manifest.

**Wirksame Ablage (Deploy):** `landing-page/public/.well-known/apple-app-site-association`
→ ausgeliefert unter `https://planumplants.de/.well-known/apple-app-site-association`
(Vite kopiert `public/**` in den dist-Root; statische Files schlagen die Vercel-Rewrites).
Content-Type `application/json` erzwungen via `vercel.json` → `headers`.

**Team ID gesetzt:** `L52X6JA945.de.planumplants.app` (App-ID = Team ID `L52X6JA945` + Bundle-ID). Beide Kopien (native/aasa + landing-page/public) sind angeglichen.
Nach Deploy prüfen: `curl -sI https://planumplants.de/.well-known/apple-app-site-association` → 200, `application/json`, **kein** Redirect.

## entitlements/
`App.entitlements` — kanonische Referenz. Wirksam unter `app/ios/App/App/App.entitlements`.
Enthält Associated Domains (`applinks:planumplants.de`, `applinks:www.planumplants.de`) und `aps-environment`.

**Verdrahtung in Xcode (einmalig, da Automatic Signing die App-ID beim Apple Developer registriert):**
1. `app/ios/App/App.xcworkspace` bzw. `App.xcodeproj` in Xcode öffnen.
2. Target **App** → **Signing & Capabilities** → Team wählen (Automatic Signing).
3. **+ Capability** → **Associated Domains** hinzufügen → Einträge `applinks:planumplants.de` und `applinks:www.planumplants.de`.
4. **+ Capability** → **Push Notifications** hinzufügen (setzt `aps-environment` korrekt je Build).
5. Xcode nutzt dabei die vorhandene `App/App.entitlements`; `aps-environment` wird für Debug=development, Archive/Release=production gesetzt.

## icons/
App-Icons & Splash-Screens (Quell-Assets). Generierung ins Xcode-Asset-Catalog später
(z. B. via `@capacitor/assets`). Noch leer (Phase 3 Feinschliff).
