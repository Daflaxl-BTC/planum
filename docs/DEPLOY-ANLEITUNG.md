# Planum – Deployment-Anleitung

## Schritt 1: GitHub Repo erstellen & pushen

Öffne ein Terminal im `Planum`-Ordner und führe aus:

```bash
cd Planum

# Git initialisieren (falls noch nicht geschehen)
git init
git branch -m main

# Alle Dateien hinzufügen & committen
git add -A
git commit -m "Initial commit: Planum – Intelligentes Pflanzen-Tracking"

# GitHub Repo erstellen (gh CLI muss installiert sein: brew install gh)
gh repo create planum --public --description "Planum – Intelligentes Pflanzen-Tracking mit QR-Codes und KI" --source . --push
```

## Schritt 2: Vercel Deployment

### Option A: Über Vercel Dashboard (empfohlen)
1. Gehe zu [vercel.com/new](https://vercel.com/new)
2. Importiere dein `planum` GitHub Repo
3. Setze "Root Directory" auf `landing-page`
4. Framework: Vite (wird automatisch erkannt)
5. Klicke "Deploy"

### Option B: Über Vercel CLI
```bash
cd landing-page
npx vercel --prod
```

## Schritt 3: Custom Domain (optional)
```bash
npx vercel domains add planum.de
```

## Ergebnis
Deine Landingpage ist live unter: `https://planum.vercel.app`
