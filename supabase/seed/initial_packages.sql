-- Seed-Skript fuer die ersten 251 Verkaufspakete (Launch-Charge).
--
-- Erzeugt:
--   * 251 Eintraege in qr_packages (unaktiviert, household_id IS NULL)
--   * 20 qr_slots pro Paket (insgesamt 5020 Stueck)
--
-- Codes haben das Format  PLNM-XXXX-YYYY  (12 Zeichen, klein gehalten fuers
-- Aufdrucken auf die Verpackung). Verwendetes Alphabet ist crockford-base32
-- ohne 0/O/1/I/L, damit Codes auch handschriftlich nicht missgelesen werden.
--
-- Idempotent:   Skript prueft, ob bereits 251+ Pakete existieren, und tut
-- in dem Fall nichts. Loesche zum Re-Seed alle qr_packages aus der DB.
--
-- Ausfuehrung:
--   supabase db execute --file supabase/seed/initial_packages.sql
-- oder via Supabase SQL Editor: Inhalt einfuegen + Run.
--
-- Codes anschliessend per supabase/seed/export_codes.sql exportieren.

begin;

create or replace function pg_temp.planum_random_code()
returns text
language plpgsql
as $$
declare
  alphabet text := 'ABCDEFGHJKMNPQRSTVWXYZ23456789';
  result   text := 'PLNM-';
  i        int;
begin
  for i in 1..4 loop
    result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  end loop;
  result := result || '-';
  for i in 1..4 loop
    result := result || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  end loop;
  return result;
end;
$$;

do $$
declare
  v_existing  int;
  v_target    int := 251;
  v_inserted  int := 0;
  v_attempts  int := 0;
  v_max_tries int := 5000;
  v_code      text;
  v_package_id uuid;
begin
  select count(*) into v_existing from public.qr_packages;
  if v_existing >= v_target then
    raise notice 'qr_packages enthaelt bereits % Eintraege (>= %), Seed uebersprungen.',
      v_existing, v_target;
    return;
  end if;

  raise notice 'Seede % Pakete (bestand: %) ...', v_target - v_existing, v_existing;

  while v_inserted < (v_target - v_existing) and v_attempts < v_max_tries loop
    v_attempts := v_attempts + 1;
    v_code := pg_temp.planum_random_code();

    begin
      insert into public.qr_packages (code, slot_count)
      values (v_code, 20)
      returning id into v_package_id;

      insert into public.qr_slots (package_id)
      select v_package_id from generate_series(1, 20);

      v_inserted := v_inserted + 1;
    exception when unique_violation then
      -- Sehr selten: Code-Kollision. Naechster Versuch.
      null;
    end;
  end loop;

  if v_inserted < (v_target - v_existing) then
    raise exception 'Seed konnte nur % von % Paketen erzeugen (Code-Kollisionen).',
      v_inserted, v_target - v_existing;
  end if;

  raise notice 'Seed erfolgreich: % Pakete, % Slots eingefuegt.',
    v_inserted, v_inserted * 20;
end $$;

commit;
