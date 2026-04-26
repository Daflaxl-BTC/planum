-- Druck-Export fuer die initiale 251er-Charge.
--
-- Liefert pro Paket:
--   * package_id           interne UUID (fuer Logistik)
--   * code                 Aktivierungscode fuer die Verpackung
--   * slot_index           1..20
--   * slot_uuid            UUID, die im Slot-QR-Code steckt
--   * slot_url             vollstaendige Scan-URL fuer den Druck
--
-- WICHTIG  Vor dem Druck pruefen:
--   * Die Member-App lebt unter dem Pfad /app/ (siehe vercel.json + Vite
--     basename). Solange noch keine Custom Domain auf Vite=base="/" gemappt
--     ist, MUESSEN die QR-URLs den /app/-Prefix enthalten — sonst landen
--     Scans auf der Landingpage. Passe @base_url unten an deinen Stand an.
--
-- Im Supabase SQL Editor: dieses Skript ausfuehren -> Resultset
-- ueber den "Download CSV"-Button exportieren.
--
-- Variante via psql / supabase CLI:
--   psql "$SUPABASE_DB_URL" -A -F',' -c "$(cat supabase/seed/export_codes.sql)" \
--     > planum-codes-charge1.csv
--
-- Filter (z.B. nur unaktivierte Pakete fuer den Druck): Where-Klausel anpassen.

with
  base as (
    -- An die Production-URL anpassen!
    -- Aktuell live: https://planum-quick-alert.vercel.app/app
    -- Spaeter ggf.: https://app.planum.de/app
    select 'https://planum-quick-alert.vercel.app/app'::text as base_url
  ),
  ordered_slots as (
    select
      s.uuid                                                  as slot_uuid,
      s.package_id,
      row_number() over (partition by s.package_id order by s.created_at, s.uuid) as slot_index
    from public.qr_slots s
  )
select
  p.id                                                        as package_id,
  p.code,
  os.slot_index,
  os.slot_uuid,
  (select base_url from base) || '/qr/' || os.slot_uuid::text as slot_url,
  case when p.household_id is null then 'unredeemed' else 'redeemed' end
                                                              as status,
  p.created_at
from public.qr_packages p
join ordered_slots os on os.package_id = p.id
-- where p.household_id is null  -- nur unredeemed exportieren
order by p.created_at, p.code, os.slot_index;
