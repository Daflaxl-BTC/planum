-- Familien-/Multi-User-Flow:
--   Sobald ein Code aus der Verpackung eingeloest ist, gehoert das Paket einem
--   Haushalt. Jeder, der danach einen der 20 Slot-QR-Codes scannt, bekommt im
--   Scan-Flow die Option, dem Haushalt beizutreten.
--
-- Dieses File:
--   1. Erweitert lookup_plant_uuid um household_id, household_name und plant_id
--      (nur sichtbar fuer Mitglieder), damit der Scan-Resolver in der App
--      ohne zweiten Roundtrip entscheiden kann.
--   2. Fuegt RPC join_household_via_slot(slot_uuid) hinzu, das auth.uid() als
--      'member' eintraegt. Idempotent: doppelte Joins sind no-op.

begin;

-- ============================================================
-- lookup_plant_uuid: erweiterte Spalten fuer den Scan-Resolver
-- ============================================================

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
  select
    p.household_id is not null
      as package_activated,
    pl.id is not null
      as plant_registered,
    coalesce(public.is_household_member(p.household_id), false)
      as user_is_member,
    p.household_id,
    h.name
      as household_name,
    -- plant_id und household_name nur preisgeben, wenn auth.uid()
    -- tatsaechlich Mitglied ist. Sonst NULL, damit ein gescannter
    -- Sticker keine fremden Pflanzen-Details leakt.
    case
      when public.is_household_member(p.household_id) then pl.id
      else null
    end
      as plant_id
  from public.qr_slots s
  join public.qr_packages p   on p.id = s.package_id
  left join public.households h on h.id = p.household_id
  left join public.plants pl    on pl.slot_uuid = s.uuid
  where s.uuid = p_plant_uuid
  limit 1;
$$;

revoke all on function public.lookup_plant_uuid(uuid) from public;
grant execute on function public.lookup_plant_uuid(uuid) to anon, authenticated;

-- ============================================================
-- join_household_via_slot: Slot-Scan -> Haushaltsbeitritt
-- ============================================================

create or replace function public.join_household_via_slot(p_slot_uuid uuid)
returns table (
  household_id   uuid,
  household_name text,
  already_member boolean
)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_household_id   uuid;
  v_household_name text;
  v_already        boolean;
begin
  if auth.uid() is null then
    raise exception 'must be authenticated'
      using errcode = '42501';
  end if;

  select p.household_id, h.name
    into v_household_id, v_household_name
    from public.qr_slots s
    join public.qr_packages p on p.id = s.package_id
    left join public.households h on h.id = p.household_id
    where s.uuid = p_slot_uuid;

  if v_household_id is null then
    raise exception 'slot is unknown or its package is not activated yet'
      using errcode = '22023';
  end if;

  select exists(
    select 1 from public.household_members hm
      where hm.household_id = v_household_id
        and hm.user_id = auth.uid()
  ) into v_already;

  if not v_already then
    insert into public.household_members (household_id, user_id, role)
    values (v_household_id, auth.uid(), 'member')
    on conflict (household_id, user_id) do nothing;
  end if;

  return query
    select v_household_id, v_household_name, v_already;
end;
$$;

revoke all on function public.join_household_via_slot(uuid) from public;
grant execute on function public.join_household_via_slot(uuid) to authenticated;

commit;
