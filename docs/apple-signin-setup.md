# Sign in with Apple – Einrichtung (Planum Plants)

Status: **vorbereitet** — UI-Button + `app/src/lib/appleAuth.js` sind da. Zum Aktivieren die folgenden Schritte einmalig durchführen, dann den nativen Flow in `appleAuth.js` einkommentieren.

## 1. Apple Developer – App ID Capability
- Apple Developer → Identifiers → App ID `de.planumplants.app` → **Sign In with Apple** aktivieren.
- In Xcode (Target App → Signing & Capabilities): **+ Capability → Sign in with Apple**.

## 2. Apple Developer – Service ID + Key (für Supabase-Serverseite)
- **Services ID** anlegen (z. B. `de.planumplants.signin`) → Sign In with Apple konfigurieren → Domain `planumplants.de`, Return-URL:
  `https://snttiuvcpryobleinmxs.supabase.co/auth/v1/callback`
- **Key** (Sign in with Apple) erstellen → `.p8` + Key ID notieren (Download nur einmal → 1Password).

## 3. Supabase – Apple-Provider aktivieren
Dashboard → Authentication → Providers → **Apple** → Enable:
https://supabase.com/dashboard/project/snttiuvcpryobleinmxs/auth/providers
- **Services ID** = die aus Schritt 2 (`de.planumplants.signin`).
- **Secret Key** = aus `.p8` + Key ID + Team ID `L52X6JA945` generiertes Client-Secret (Supabase-Feld akzeptiert den generierten JWT; Anleitung im Provider-Panel).
- Für den **nativen** iOS-Flow zusätzlich die App-Bundle-ID `de.planumplants.app` als erlaubten Client eintragen (Supabase „Authorized Client IDs").

## 4. Capacitor-Plugin installieren (nativer Flow)
```bash
cd /Users/daflaxl/Gewerbe/Developer/planum/app
npm install @capacitor-community/apple-sign-in
npm run cap:sync
```

## 5. Nativen Flow aktivieren
In `app/src/lib/appleAuth.js` den auskommentierten Plugin-Block einkommentieren (Bundle-ID `de.planumplants.app`, `signInWithIdToken({ provider: 'apple', token: identityToken })`) und den `throw` entfernen.

## Warum Sign in with Apple
- Nativer iOS-Login (Face/Touch ID), ein Tap.
- App-Store-Guideline 4.8: wenn Drittanbieter-Logins angeboten werden, muss ein datensparsamer Login (Apple) als Option dabei sein.
