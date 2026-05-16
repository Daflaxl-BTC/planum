-- M4: Index auf qr_slots.package_id.
--
-- Begruendung: qr_slots hat FK -> qr_packages.id, aber bis hierher keinen
-- expliziten Index auf der FK-Spalte. Mehrere Hot-Paths joinen ueber
-- package_id:
--   - lookup_plant_uuid (Scan-Resolver, hochfrequent)
--   - plants_claim_slot Trigger (jede Pflanzen-Registrierung)
--   - join_household_via_slot RPC
-- Bei der Erst-Charge sind das 5020 Slots; bei einem ungeplanten Cleanup
-- (Slots eines Pakets) waere ein Seq-Scan auf der wachsenden Tabelle teuer.

begin;

create index if not exists qr_slots_package_idx
  on public.qr_slots(package_id);

commit;
