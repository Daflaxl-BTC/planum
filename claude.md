# Planum – Intelligentes Pflanzen-Tracking

## Projektübersicht
Planum ist eine Web-App für das Tracking und die Pflege von Zimmerpflanzen in Privathaushalten. Kunden erwerben ein Paket mit 20 QR-Code-Stickern ("Pflanzenslots") auf Amazon und registrieren ihre Pflanzen über die App. Eine KI-Bilderkennung identifiziert die Pflanze und liefert optimale Pflegehinweise.

## Tech-Stack
- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Supabase (Auth, DB, Storage)
- **KI-Bilderkennung**: Plant.id API (Kindwise) / PlantNet API
- **Hosting**: Vercel
- **Zahlungen**: Stripe (optional für Shop)
- **QR-Codes**: Unique IDs, verlinken auf `app.planum.de/plant/{uuid}`

## Monetarisierungsmodell
- **Einmalkauf**: 19,99€ QR-Code-Paket (20 Slots) auf Amazon
- **Erweiterungspakete**: 9,99€ für 10 zusätzliche Slots
- **Integrierter Shop**: Affiliate-Links für Dünger, Erde, Töpfe
- **Premium-Add-ons**: Erweiterte KI-Diagnose, Krankheitserkennung

## Kernfeatures
1. QR-Code scannen → Pflanze registrieren
2. KI-Bilderkennung zur Pflanzenidentifikation
3. Automatische Pflegeprofile (Gießen, Düngen, Umtopfen)
4. Ampelsystem: 🟢 Gut | 🟡 Bedarf | 🔴 Hoher Bedarf
5. Pflege-Logging (Gießen, Düngen, Umtopfen dokumentieren)
6. Push-Erinnerungen bei fälligen Pflegeaktionen
7. Pflanzengalerie mit Wachstumsverlauf
8. Integrierter Pflegeshop (Affiliate)

## Datenbankschema (Supabase)
- `users` – Auth, Profil
- `qr_packages` – Aktivierungscodes, Lizenz
- `plants` – Registrierte Pflanzen mit Arteninfo
- `care_logs` – Gieß-/Dünge-/Umtopf-Events
- `care_schedules` – KI-generierte Pflegepläne
- `plant_species` – Artendatenbank mit Pflegeinfos

## Ordnerstruktur
```
Planum/
├── claude.md              # Diese Datei
├── docs/
│   └── businessplan.md    # Vollständiger Businessplan
├── landing-page/          # Vercel-deploybare Landingpage
│   ├── package.json
│   ├── index.html
│   ├── src/
│   └── public/
└── README.md
```

## Wichtige Links
- **Amazon Listing**: TBD
- **Live App**: TBD (Vercel)
- **GitHub Repo**: TBD
- **PlantNet API**: https://my.plantnet.org/
- **Plant.id API**: https://www.kindwise.com/plant-id

## Nächste Schritte
1. ✅ Businessplan erstellen
2. ✅ Landingpage entwickeln und deployen
3. 🔲 MVP der Web-App (Supabase + React)
4. 🔲 KI-Integration (Plant.id API)
5. 🔲 QR-Code-Generator für Produktion
6. 🔲 Amazon Listing erstellen
7. 🔲 Beta-Test mit 50 Nutzern
