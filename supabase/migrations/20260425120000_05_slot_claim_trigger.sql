-- Slot-Claim-Trigger: bindet einen QR-Slot dauerhaft an die registrierte Pflanze.
--
-- Verhindert, dass derselbe Slot von zwei Pflanzen / zwei Haushalten benutzt
-- wird. Validiert ausserdem, dass der Slot zu einem Paket gehoert, das dem
-- Haushalt der Pflanze zugeordnet ist.

begin;

-- ============================================================
-- INSERT: Slot beanspruchen + Cross-Household-Versuch blocken
-- ============================================================

create or replace function public.plants_claim_slot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot      public.qr_slots;
  v_package   public.qr_packages;
begin
  if new.slot_uuid is null then
    return new;
  end if;

  select * into v_slot
    from public.qr_slots
    where uuid = new.slot_uuid
    for update;

  if not found then
    raise exception 'qr_slot % does not exist', new.slot_uuid
      using errcode = '23503';
  end if;

  if v_slot.plant_id is not null and v_slot.plant_id <> new.id then
    raise exception 'qr_slot % is already bound to plant %', new.slot_uuid, v_slot.plant_id
      using errcode = '23505';
  end if;

  select * into v_package
    from public.qr_packages
    where id = v_slot.package_id;

  if v_package.household_id is null then
    raise exception 'qr_slot % belongs to an unactivated package', new.slot_uuid
      using errcode = '22023';
  end if;

  if v_package.household_id <> new.household_id then
    raise exception 'qr_slot % belongs to a different household', new.slot_uuid
      using errcode = '42501';
  end if;

  update public.qr_slots
    set plant_id   = new.id,
        claimed_by = new.user_id,
        claimed_at = coalesce(claimed_at, now())
    where uuid = new.slot_uuid;

  return new;
end;
$$;

create trigger plants_claim_slot_after_insert
  after insert on public.plants
  for each row execute function public.plants_claim_slot();

-- Slot wird auch bei spaeterem Setzen via UPDATE beansprucht.
create trigger plants_claim_slot_after_update
  after update of slot_uuid on public.plants
  for each row
  when (new.slot_uuid is distinct from old.slot_uuid and new.slot_uuid is not null)
  execute function public.plants_claim_slot();

-- ============================================================
-- DELETE / Slot loesen: Slot wieder frei innerhalb des Haushalts
-- ============================================================

create or replace function public.plants_release_slot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.slot_uuid is not null then
    update public.qr_slots
      set plant_id   = null,
          claimed_by = null,
          claimed_at = null
      where uuid = old.slot_uuid
        and plant_id = old.id;
  end if;
  return old;
end;
$$;

create trigger plants_release_slot_after_delete
  after delete on public.plants
  for each row execute function public.plants_release_slot();

-- Bei Slot-Wechsel via UPDATE: alten Slot freigeben.
create or replace function public.plants_release_old_slot()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.slot_uuid is not null and old.slot_uuid is distinct from new.slot_uuid then
    update public.qr_slots
      set plant_id   = null,
          claimed_by = null,
          claimed_at = null
      where uuid = old.slot_uuid
        and plant_id = old.id;
  end if;
  return new;
end;
$$;

create trigger plants_release_old_slot_after_update
  after update of slot_uuid on public.plants
  for each row
  when (old.slot_uuid is distinct from new.slot_uuid and old.slot_uuid is not null)
  execute function public.plants_release_old_slot();

commit;
