# iOS – Erster TestFlight-Build (Planum Plants)

Bundle-ID `de.planumplants.app` · App-Name „Planum Plants". Voraussetzung: Apple Developer Program aktiv, Xcode + Simulator installiert.

## 0. Web-Assets in die native Schale bauen
Bei jeder Änderung am React-Code **vor** dem Xcode-Build:
```bash
cd /Users/daflaxl/Gewerbe/Developer/planum/app
npm run cap:sync        # = vite build --mode capacitor && cap sync ios
```
`cap:sync` baut mit `base: '/'` (kein `/app/`-Prefix) und kopiert `dist/` nach `ios/App/App/public`.

## 1. Workspace in Xcode öffnen
```bash
open /Users/daflaxl/Gewerbe/Developer/planum/app/ios/App/App.xcodeproj
```
Capacitor 8 nutzt SPM (kein CocoaPods) → es gibt **keine** `.xcworkspace`, die `.xcodeproj` wird direkt geöffnet.

## 2. Signing & Capabilities (einmalig)
Target **App** → Tab **Signing & Capabilities**:
1. **Team** wählen → Automatic Signing an. Xcode registriert die App-ID `de.planumplants.app` beim Apple Developer Portal.
2. **+ Capability → Associated Domains** — Einträge prüfen/ergänzen:
   `applinks:planumplants.de`, `applinks:www.planumplants.de`.
3. **+ Capability → Push Notifications** — setzt `aps-environment` je Build korrekt (Debug=development, Archive=production).

Xcode verwendet dabei die vorhandene `ios/App/App/App.entitlements`.

**Wichtig danach:** Die echte **Team ID** (Apple Developer → Membership) in beide AASA-Kopien eintragen, `TEAMID` ersetzen:
- `native/aasa/apple-app-site-association`
- `landing-page/public/.well-known/apple-app-site-association`
→ committen + deployen, **bevor** Sticker gedruckt werden. Prüfen:
```bash
curl -sI https://planumplants.de/.well-known/apple-app-site-association
# erwartet: 200, Content-Type application/json, KEIN Redirect
```

## 3. Version & Build-Nummer
Target **App → General**: Version `1.0.0`, Build `1`. Build-Nummer bei jedem TestFlight-Upload erhöhen.

## 4. Archiv erstellen
1. Geräte-Dropdown oben: **Any iOS Device (arm64)** (nicht Simulator — Archive braucht ein Device-Target).
2. Menü **Product → Archive**. Nach Build öffnet sich der **Organizer**.

## 5. Nach App Store Connect hochladen
Im Organizer: Archiv wählen → **Distribute App** → **App Store Connect** → **Upload** → Automatic Signing durchklicken. Warten bis „Upload complete".

## 6. TestFlight
1. https://appstoreconnect.apple.com → App **Planum Plants** → Tab **TestFlight**.
2. Nach Processing (~5–15 min) den Build sehen. Beim ersten Mal **Export-Compliance** beantworten — via `ITSAppUsesNonExemptEncryption = false` in `Info.plist` bereits auf „keine nicht-exempte Verschlüsselung" gesetzt, daher meist keine Rückfrage.
3. **Internal Testing**: Tester-Gruppe anlegen, Apple-IDs einladen. Interne Tester brauchen kein Beta-Review.
4. TestFlight-App auf dem iPhone installieren → Build läuft.

## Push in TestFlight testen
- Nach Login triggert `app/src/lib/push.js` den iOS-Berechtigungsdialog; bei „Erlauben" wird das APNs-Token an die Edge Function `push-register` geschickt.
- TestFlight-Builds nutzen die **Sandbox**-APNs → `push-dispatch` mit `APNS_HOST=api.sandbox.push.apple.com` (Default) senden. App-Store-Release: `APNS_HOST=api.push.apple.com`.

## Häufige Stolpersteine
- **Weißer Screen nach Start** → `npm run cap:sync` vergessen oder mit falscher `base` gebaut (`/app/` statt `/`). Immer `cap:sync` nutzen.
- **Universal Link öffnet Safari statt App** → AASA nicht erreichbar / falsche Team ID / App frisch installiert (iOS lädt AASA beim ersten Install; ggf. neu installieren).
- **Kein Push-Token** → Push-Notifications-Capability fehlt oder auf Simulator getestet (APNs braucht echtes Gerät).
