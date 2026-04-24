-- Erzeugt ein Testpaket mit 20 Slots (unaktiviert).
-- Nach Ausfuehrung wird der Code in der Postgres-NOTICE-Ausgabe gezeigt.
-- Einloesen in der App via RPC:
--   select activate_qr_package('<code>', '<household_id>');
-- Ausfuehren z.B. via Supabase SQL Editor oder:
--   supabase db execute --file supabase/seed/test_package.sql

do $$
declare
  v_package_id uuid;
  v_code       text := 'PLNM-TEST-' || upper(substr(encode(gen_random_bytes(3), 'hex'), 1, 6));
begin
  insert into public.qr_packages (code, slot_count)
  values (v_code, 20)
  returning id into v_package_id;

  insert into public.qr_slots (package_id)
  select v_package_id from generate_series(1, 20);

  raise notice '';
  raise notice '=== Testpaket erstellt ===';
  raise notice 'Aktivierungscode: %', v_code;
  raise notice 'Package-ID:       %', v_package_id;
  raise notice 'Slots:            20 (unclaimed)';
end $$;
