# Planum — NFC Signed-Token-Spezifikation

**Stand:** Gerüst (Phase 0) · **Inhalt final in Phase 2 (Core-NFC-Integration)**
**Grundlage:** `docs/ios-migration-plan.md` Abschnitt 4.3 + 5.2.

---

## 1. Zwei-URL-Architektur der Sticker (Sicherheit durch Trennung)

Jeder Sticker trägt zwei physisch getrennte Träger mit **unterschiedlichen** URLs:

| Träger | URL | Zweck |
|---|---|---|
| **NFC-Chip** | `https://planumplants.de/nfc/{signed_token}` | signierter, kurzlebiger Token → Magic-Link-Login + Slot-Zuordnung |
| **QR (Trägerpapier)** | `https://planumplants.de/p/{plant_uuid}` | öffentliche Pflanzenseite, **ohne** Token |

Der NFC-Token erscheint **nie** im QR — sonst Photo-Replay-Angriff (Abfotografieren → Login-/Zuordnungs-Kaperung).

## 2. Token-Format (TODO Phase 2 finalisieren)

HMAC-signiertes, kurzlebiges Payload:

```
{ "slot_id": "<uuid>", "exp": <unix_ts>, "nonce": "<random>" }
```

- **Signatur:** HMAC-SHA256 mit `NFC_SIGNING_SECRET` (nur serverseitig, Supabase-Secret).
- **Kodierung:** URL-safe Base64 (Payload + Signatur) — genaues Wire-Format in Phase 2.
- **Ablauf (`exp`):** kurzlebig (z. B. Minuten für Redemption-Fenster) — Wert final klären.
- **Nonce:** einmalig, Replay-Schutz.

## 3. Redemption-Flow — Edge Function `nfc-redeem` (TODO Phase 2)

1. Signaturprüfung mit `NFC_SIGNING_SECRET`.
2. Ablauf prüfen (`exp` nicht überschritten).
3. Nonce-Einmaligkeit prüfen (Replay-Schutz, verbrauchte Nonces persistieren).
4. Slot an eingeloggten Nutzer binden (`qr_slots.claimed_by`), Idempotenz sicherstellen.
5. Bereits belegter Slot / fremder Nutzer → Fehler bzw. Web-Fallback nur mit Berechtigungscheck.

## 4. Chip-Bespielung — `scripts/sign-nfc-token.mjs` (TODO Phase 2)

- Liest Slot-Liste (CSV), erzeugt signierten Token je Slot, schreibt Encoding-CSV für Hersteller.
- Chips gegen Wiederbeschreiben sperren (**Lock-Bit**) — einmal ausgeliefert, nicht umprogrammierbar.
- `NFC_SIGNING_SECRET` nur lokal/serverseitig, nie ins Repo.

## 5. Offene Punkte

- 🔲 Wire-Format Token (Feldreihenfolge, Base64-Segmenttrennung).
- 🔲 `exp`-Dauer festlegen.
- 🔲 Nonce-Store: eigene Tabelle vs. Wiederverwendung `qr_slots.claimed_at` als Einmal-Marker.
- 🔲 Verhalten bei App installiert (Universal Link fängt Tap) vs. nicht installiert (Web-Fallback).
