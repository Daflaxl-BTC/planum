# Warteliste — Deployment und Secrets

Zwei Functions, ein Double-Opt-In:

| Function | Methode | Zweck |
|---|---|---|
| `waitlist-subscribe` | POST | Eintrag anlegen, Bestätigungsmail verschicken |
| `waitlist-confirm` | GET | Token einlösen, `confirmed_at` setzen, auf `/danke` weiterleiten |

Beide werden von anonymen Besuchern aufgerufen und brauchen deshalb
**`--no-verify-jwt`**. Die Herkunftsprüfung übernimmt stattdessen die
Origin-Allowlist in `_shared/waitlist.ts`.

## Deploy

```bash
supabase functions deploy waitlist-subscribe --no-verify-jwt
supabase functions deploy waitlist-confirm  --no-verify-jwt
```

## Secrets

Ausschließlich als Function-Secrets setzen — nie im Repo, nie als
`VITE_`-Variable.

```bash
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set WAITLIST_IP_PEPPER="$(openssl rand -hex 32)"
supabase secrets set WAITLIST_FROM="Planum <hallo@planumplants.de>"
supabase secrets set WAITLIST_SITE_URL="https://www.planumplants.de"
```

`WAITLIST_IP_PEPPER` darf nach dem ersten Produktivlauf nicht mehr geändert
werden — sonst greift das Rate-Limit für bestehende Hashes nicht mehr.
Ohne den Pepper wird gar keine IP gespeichert (`hashIp` gibt `null` zurück);
das Rate-Limit ist dann inaktiv, die Function bleibt aber funktionsfähig.

Optional: `WAITLIST_CONFIRM_BASE`, falls der Bestätigungslink nicht direkt auf
`${SUPABASE_URL}/functions/v1/waitlist-confirm` zeigen soll (z. B. hinter einem
eigenen Domain-Proxy).

## Voraussetzung Resend

Absenderdomain `planumplants.de` muss in Resend mit SPF, DKIM und DMARC
verifiziert sein, sonst landet die DOI-Mail im Spam oder wird abgelehnt.

## Lokal testen

```bash
supabase functions serve waitlist-subscribe --no-verify-jwt --env-file supabase/.env.local
```

Prüfpunkte:

1. Gültige Adresse → `{ ok: true }` + Mail.
2. Dieselbe Adresse erneut → `{ ok: true }`, kein zweiter Datensatz.
3. `company` gefüllt → `{ ok: true }`, **kein** Datenbankeintrag.
4. Sechs Requests in Folge → der sechste liefert `429`.
5. Mit anon key `select` auf `waitlist_signups` → 0 Zeilen (RLS ohne Policy).
