-- Security-Fix (C1):
--   lookup_plant_uuid gab `household_id` und `household_name` bisher
--   unconditional zurueck. Die Funktion ist via `grant execute ... to anon`
--   callable, d.h. ein Scan einer beliebigen Slot-UUID enthuellte den
--   Haushaltsnamen auch ohne Login. Dieses Migration gated beide Felder
--   analog zu `plant_id` hinter `is_household_member(household_id)`.
--
-- Schema bleibt unveraendert (gleiche Rueckgabe-Spalten); nur die
-- Sichtbarkeit der Werte fuer Nicht-Mitglieder aendert sich.

begin;

drop function if exists public.lookup_plant_uuid(uuid);

create function public.lookup_plant_uuid(p_plant_uuid uuid)
returns table (
  package_activated boolean,
  plant_registered  boolean,
  user_is_member    boolean,
  household_id      uuid,
  household_name    text,
  plant_id          uuid
)
language sql
security definer
stable
set search_path = public
as $$
  with row as (
    select
      p.household_id                                  as h_id,
      h.name                                          as h_name,
      pl.id                                           as pl_id,
      p.household_id is not null                      as activated,
      pl.id is not null                               as registered,
      coalesce(public.is_household_member(p.household_id), false)
                                                      as is_member
    from public.qr_slots s
    join public.qr_packages p   on p.id = s.package_id
    left join public.households h on h.id = p.household_id
    left join public.plants pl    on pl.slot_uuid = s.uuid
    where s.uuid = p_plant_uuid
    limit 1
  )
  select
    activated   as package_activated,
    registered  as plant_registered,
    is_member   as user_is_member,
    -- Haushalts-Identitaet (id + name) nur fuer Mitglieder. Ein gescannter
    -- Sticker eines fremden Pakets darf nichts ueber den besitzenden
    -- Haushalt verraten -- weder Name (PII) noch interne UUID.
    case when is_member then h_id  else null end as household_id,
    case when is_member then h_name else null end as household_name,
    case when is_member then pl_id  else null end as plant_id
  from row;
$$;

revoke all on function public.lookup_plant_uuid(uuid) from public;
grant execute on function public.lookup_plant_uuid(uuid) to anon, authenticated;

commit;
