# Planum — App-Store-Compliance-Checkliste

**Stand:** Gerüst (Phase 0) · **Inhalt final in Phase 2 (Compliance-Durchgang)**
**Grundlage:** `docs/ios-migration-plan.md` Abschnitt 8.

> Status-Legende: 🔲 offen · 🚧 in Arbeit · ✅ erledigt

---

## 1. Guideline 3.1.1 — In-App-Kauf-Pflicht (kritisch)

Digitale Freischaltung in der App **muss** per IAP möglich sein. Extern erworbener
Code (Amazon-Sticker) darf Features **zusätzlich/optional** freischalten, aber nicht
der **einzige** Weg sein; kein aktives Lenken aus der App zum externen Kauf.

- 🔲 Basis **auch** als StoreKit-IAP („Basis freischalten") — nicht nur NFC/Code-Einlösung.
- 🔲 Physische Einlösung als „bereits gekauft, hier einlösen" framen (kein Verkaufskanal in-App).
- 🔲 Slot-Erweiterung (9,99 €/10 Slots) als reguläres StoreKit-Produkt.
- 🔲 Pro-Cloud-Abo (2,99 €/Mo) als StoreKit-Auto-Renewable-Subscription.
- 🔲 `iap-verify` Edge Function validiert Apple-Receipt/JWS serverseitig, setzt `entitlements`.

## 2. Account-Löschung in-App (Apple-Pflicht seit 2022)

- 🔲 In-App-Flow zum vollständigen Konto- + Datenlöschen (nicht nur Web/E-Mail).
- 🔲 Serverseitige Kaskadenlöschung (auth.users → RLS `on delete cascade` greift).

## 3. NFC

- 🔲 `NFCReaderUsageDescription` in `Info.plist` klar formuliert (Zweck: Pflanzen-Slot antippen).
- 🔲 Associated Domains + AASA live auf `planumplants.de` (`/nfc/*`, `/p/*`).

## 4. Datenschutz-Nutrition-Label (App Privacy)

- 🔲 Kamerazugriff begründet (Pflanzenfotos, Bilderverlauf).
- 🔲 Fotos/Storage-Nutzung deklariert.
- 🔲 E-Mail (Auth/Magic-Link) deklariert.
- 🔲 Keine Weitergabe an Dritte außer serverseitigen Verarbeitern (Plant.id, APNs) — prüfen/deklarieren.

## 5. Sign in with Apple

- 🔲 Prüfen: Pflicht **nur wenn** andere Social-Logins angeboten werden. Bei reinem
  Magic-Link/E-Mail nicht zwingend — Status bestätigen.

## 6. Sonstige Review-Stolpersteine

- 🔲 Datenschutzerklärung + Support-URL im App Store Connect hinterlegt.
- 🔲 Keine Secrets/Placeholder im Binary; alle Drittanbieter-Keys serverseitig.
- 🔲 Demo-Account/Review-Notes für Apple-Reviewer (NFC-Flow ohne physischen Sticker testbar).
