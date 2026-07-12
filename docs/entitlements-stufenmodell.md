# Planum — Entitlement-Modell: Gratis / Basis / Pro

**Stand:** 10.07.2026 · **Status:** Spezifikation für den App-Umbau (Web → Native)
**Grundlage:** Notion „Planum Basis + Pro — Strategie-Redesign" (28.06.2026) + Entscheidung Felix vom 10.07.2026

---

## 1. Die drei Stufen im Überblick

| | **Gratis** | **Basis** | **Pro** |
|---|---|---|---|
| **Einstieg** | App-Download, Konto | Sticker-Paket (19,99 €, Amazon) | Pro Starter-Kit (39,99 €) + optional Cloud-Abo (2,99 €/Mo) |
| **Entitlement-Flag** | `free` | `basis_unlock` (lifetime) | `pro_cloud` (Abo) — **schließt Basis vollständig ein** |
| **Pflanzen anlegen** | ✅ ja, einzeln aufrufbar — **max. 5 Pflanzen** | ✅ unbegrenzt, via NFC-Tap direkt | ✅ wie Basis |
| **Datenweg** | manuell (Foto, Log) | NFC-Tap → Pflanze + Tap-to-Log | Sensor-Autologging (Messwerte **für immer gratis**) |
| **KI-Pflegeabfragen** | **1×/Monat je Pflanze** | **2×/Woche je Pflanze** | wie Basis + KI-Diagnose aus Sensordaten (Abo) |
| **Bilderverlauf** | ✅ **im Gratisplan enthalten** | ✅ | ✅ |
| **Timelapse-Video** | ✅ gratis, bereits als Web-Feature (s. §2.3) | ✅ | ✅ |
| **Erlösquelle** | Funnel → Konversion | Einmalkauf + Erweiterungen | Hardware-Marge (Sensoren) + Abo für Mehrwert |

**Kernprinzip:** Pro ⊇ Basis. Kein Feature der Basis-Stufe wird in Pro weggenommen oder erneut verkauft — sonst kannibalisiert sich das Modell selbst.

---

## 2. Gratis-Stufe im Detail

Die Gratisversion ist **vollwertig nutzbar**, kein verkrüppeltes Demo. Die Grenze verläuft entlang der Bequemlichkeit und der KI-Kosten, nicht entlang der Grundfunktion.

### 2.1 Pflanzenzugriff
- Pflanzen werden **einzeln aufgerufen** (Liste → Detailansicht). Kein NFC-Komfortzugriff, keine Sammel-Dashboards.
- Anlegen, Fotografieren, manuelles Pflege-Logging: uneingeschränkt möglich.
- **Deckel: max. 5 Pflanzen** im Gratisplan. „Unbegrenzte Pflanzen" ist ein Basis-Verkaufsargument; der Deckel stützt es, ohne die Grundnutzung zu verkrüppeln (Gratis-Nutzer pflegen selten mehr).

### 2.2 Bilderverlauf (Gratis-Feature, bewusst!)
- **Jedes Bild, das durch die KI gejagt wurde, wird gespeichert** und bleibt dauerhaft einsehbar — chronologische Galerie je Pflanze über Monate hinweg.
- Rationale: Der Verlauf ist der emotionale Anker („meine Pflanze wächst") und zugleich Lock-in — wer 6 Monate Historie hat, wechselt nicht zur Konkurrenz. Er kostet uns nur Storage (billig), keine API-Calls.

### 2.3 Timelapse-Video (gratis, bereits als Web-Feature)
- Aus dem Bilderverlauf wird ein kurzes Video generiert: „So hat sich deine Pflanze über die Monate verändert."
- **Entscheidung 10.07.2026:** Wird **schon als Web-Feature** umgesetzt (nicht erst nach Native-App-Launch) und gehört fest in den **Gratisplan**. Es ist unser natürlichstes Viral-/Share-Feature (Social-Media-Export mit Planum-Branding).

### 2.4 KI-Pflegeabfragen (die eigentliche Schranke)
- Limit: **1× pro Monat je Pflanze** (Entscheidung 10.07.2026).
- Rationale: Plant.id-API-Calls sind unsere **einzige nennenswerte Grenzkoste**. Das Limit schützt die Marge und erzeugt zugleich den Kaufimpuls für Basis.
- Die **Artenbestimmung bei Erstregistrierung** einer Pflanze zählt **nicht** gegen das Limit (einmalig je Pflanze gratis) — sonst bricht das Onboarding.

---

## 3. Basis-Stufe im Detail

- **Freischaltung:** Registrierung des ersten Sticker-Pakets bindet den Paket-Code (`qr_packages`) ans Konto → `basis_unlock` wird **lifetime** gesetzt. Kein Abo, keine Wiederholung.
- **KI-Pflegeabfragen: 2× pro Woche je Pflanze.** Bei 20 Pflanzen also bis zu 40 Abfragen/Woche — großzügig genug, dass es sich nie knapp anfühlt, aber gedeckelt gegen Missbrauch (Scripting, Account-Sharing).
- NFC-Tap öffnet die Pflanze direkt; Gieß-Sticker loggt per Tap (`?action=giessen`).
- Unbegrenzte Pflanzenzahl (Slots physisch durch Sticker begrenzt, Erweiterung 9,99 €/10 Slots).
- Alle Gratis-Features selbstverständlich enthalten.

---

## 4. Pro-Stufe im Detail (Referenz: Strategie-Redesign)

- **Hue-Prinzip:** Hub = Bridge (dünne Marge), Sensoren = Blades (Marge), **Messwerte für immer gratis** — auch ohne Abo.
- **Cloud-Abo (2,99 €/Mo)** nur für Mehrwert: Langzeit-Historie der Sensordaten, Multi-User, KI-Diagnose aus Sensordaten.
- Pro schließt `basis_unlock` ein. Eine Pflanze kann Sticker **und** Sensor tragen; Sensor-Autologging ersetzt dann Tap-to-Log.
- Zeitplan: Q3/26–Q2/27 gem. Redesign-Dokument.

---

## 5. Entschiedene Dials (Felix, 10.07.2026)

1. **Gratis-KI-Kadenz:** **1×/Monat je Pflanze** (entschieden). Fühlt sich fair an, skaliert aber nicht in Missbrauch, weil Gratis-Nutzer selten viele Pflanzen pflegen.
2. **Pflanzenlimit Gratis:** **Deckel 5 Pflanzen** (entschieden). Stützt „unbegrenzte Pflanzen" als Basis-Verkaufsargument, ohne die Grundnutzung zu verkrüppeln.
3. **Timelapse-Roadmap-Slot:** **schon als Web-Feature** (entschieden) — früher Viral-/Share-Hebel, im Gratisplan.

---

## 6. Technische Durchsetzung (nicht verhandelbar)

- **Alles serverseitig.** Entitlements + Quotas werden in Supabase geprüft (RLS + Edge Functions), niemals im Client. `VITE_`-Variablen sind öffentlich.
- **`ai_quota`-Zählung:** Edge Function zählt KI-Calls je `plant_id`/`user_id` mit Zeitfenster (Monat bzw. Woche); Plant.id-Key liegt ausschließlich serverseitig.
- **Bilderverlauf-Storage:** Bilder vor Ablage komprimieren (~1280 px, WebP) — Storage bleibt Cent-Bereich, der Verlauf bleibt dauerhaft finanzierbar.
- **Schema-Erweiterung (beim App-Umbau):** `entitlements`-Tabelle oder Spalten auf `users` (`tier`, `basis_unlocked_at`, `pro_cloud_until`) + `ai_usage`-Log-Tabelle (`user_id`, `plant_id`, `called_at`, `kind`).
- **Lifetime-Bindung:** `qr_packages.activated_by` = User-Bindung des Paket-Codes; ein Code ist genau einem Konto zuordenbar.

---

## 7. Warum diese Grenze richtig gezogen ist

Die Gratis-Stufe gibt das **Gedächtnis** (Verlauf, Historie, Emotion) und rationiert die **Intelligenz** (KI-Calls = Grenzkosten). Damit ist das Freemium-Versprechen ehrlich — die App ist wirklich nutzbar — und der Upgrade-Grund trotzdem klar: Komfort (NFC) + Intelligenz im Alltagstakt (2×/Woche je Pflanze). Das löst das im Redesign benannte „Razor-ohne-Blades"-Problem auf der Software-Seite.
