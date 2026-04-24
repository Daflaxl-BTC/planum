-- Households: geteilter Zugriff fuer Familienmitglieder.
-- Schaltet die bisherige Single-User-Autorisierung auf Haushalt um, behaelt aber
-- alle bestehenden Tabellen und Spalten. User-Felder (plants.user_id,
-- qr_packages.redeemed_by, qr_slots.claimed_by, care_logs.user_id) bleiben als
-- Attribution, die Zugriffspruefung laeuft ueber household_members.

begin;

-- ============================================================
-- TABELLEN
-- ============================================================

create table public.households (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default 'Mein Haushalt',
  created_by  uuid not null references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table public.household_members (
  household_id uuid not null references public.households(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null default 'member'
               check (role in ('owner','admin','member')),
  joined_at    timestamptz not null default now(),
  primary key (household_id, user_id)
);

create index household_members_user_idx on public.household_members(user_id);

-- ============================================================
-- SPALTEN AUF BESTEHENDEN TABELLEN
--   Tabellen sind leer (0 Rows), daher direkt NOT NULL moeglich.
-- ============================================================

alter table public.plants
  add column household_id uuid references public.households(id) on delete cascade;
create index plants_household_idx on public.plants(household_id);

alter table public.qr_packages
  add column household_id uuid references public.households(id) on delete set null;
create index qr_packages_household_idx
  on public.qr_packages(household_id) where household_id is not null;

-- plants.household_id wird ueber einen Trigger beim Insert befuellt,
-- wenn nicht explizit gesetzt: wir nehmen den Default-Haushalt des Users.
-- Das behaelt Kompatibilitaet mit einfacher App-Logik.

create or replace function public.plants_default_household()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.household_id is null then
    select hm.household_id
      into new.household_id
      from public.household_members hm
      where hm.user_id = new.user_id
      order by hm.joined_at asc
      limit 1;
  end if;

  if new.household_id is null then
    raise exception 'user % is not a member of any household', new.user_id
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger plants_set_default_household
  before insert on public.plants
  for each row execute function public.plants_default_household();

alter table public.plants
  alter column household_id set not null;

-- ============================================================
-- TRIGGER: Haushalts-Ersteller ist automatisch Owner
-- ============================================================

create or replace function public.add_creator_as_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.household_members (household_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict do nothing;
  return new;
end;
$$;

create trigger on_household_created
  after insert on public.households
  for each row execute function public.add_creator_as_owner();

-- ============================================================
-- Beim Signup automatisch einen Default-Haushalt anlegen
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_display_name text;
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;

  v_display_name := coalesce(
    nullif(split_part(new.email, '@', 1), ''),
    'Mein'
  );

  insert into public.households (name, created_by)
  values (v_display_name || 's Haushalt', new.id);
  -- add_creator_as_owner-Trigger haengt den Owner-Eintrag an.

  return new;
end;
$$;

-- ============================================================
-- HELPER: Mitgliedschaft pruefen (fuer RLS)
-- ============================================================

create or replace function public.is_household_member(hid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists(
    select 1
      from public.household_members
      where household_id = hid
        and user_id = auth.uid()
  );
$$;

revoke all on function public.is_household_member(uuid) from public;
grant execute on function public.is_household_member(uuid) to authenticated;

-- ============================================================
-- RLS fuer neue Tabellen
-- ============================================================

alter table public.households        enable row level security;
alter table public.household_members enable row level security;

create policy households_select_members
  on public.households for select
  using (public.is_household_member(id));

create policy households_insert_self
  on public.households for insert
  with check (created_by = auth.uid());

create policy households_update_admins
  on public.households for update
  using (
    exists(
      select 1 from public.household_members
        where household_id = households.id
          and user_id = auth.uid()
          and role in ('owner','admin')
    )
  );

create policy households_delete_owner
  on public.households for delete
  using (
    exists(
      select 1 from public.household_members
        where household_id = households.id
          and user_id = auth.uid()
          and role = 'owner'
    )
  );

create policy household_members_select
  on public.household_members for select
  using (public.is_household_member(household_id));

create policy household_members_insert_admins
  on public.household_members for insert
  with check (
    exists(
      select 1 from public.household_members m
        where m.household_id = household_members.household_id
          and m.user_id = auth.uid()
          and m.role in ('owner','admin')
    )
  );

create policy household_members_delete_self_or_admin
  on public.household_members for delete
  using (
    user_id = auth.uid()
    or exists(
      select 1 from public.household_members m
        where m.household_id = household_members.household_id
          and m.user_id = auth.uid()
          and m.role in ('owner','admin')
    )
  );

-- ============================================================
-- Bestehende User-basierte Policies durch Household-basierte ersetzen
-- ============================================================

-- qr_packages: Lesen wenn Haushaltsmitglied
drop policy if exists "qr_packages_read_own" on public.qr_packages;
create policy qr_packages_select_members
  on public.qr_packages for select
  using (
    household_id is not null
    and public.is_household_member(household_id)
  );

-- qr_slots: Lesen wenn Paket dem Haushalt gehoert. Update nur ueber RPC.
drop policy if exists "qr_slots_read_own"   on public.qr_slots;
drop policy if exists "qr_slots_update_own" on public.qr_slots;
create policy qr_slots_select_members
  on public.qr_slots for select
  using (
    exists(
      select 1 from public.qr_packages p
        where p.id = qr_slots.package_id
          and p.household_id is not null
          and public.is_household_member(p.household_id)
    )
  );
create policy qr_slots_update_members
  on public.qr_slots for update
  using (
    exists(
      select 1 from public.qr_packages p
        where p.id = qr_slots.package_id
          and p.household_id is not null
          and public.is_household_member(p.household_id)
    )
  );

-- plants: CRUD fuer alle Haushaltsmitglieder; Attribution via user_id.
drop policy if exists "plants_select_own" on public.plants;
drop policy if exists "plants_insert_own" on public.plants;
drop policy if exists "plants_update_own" on public.plants;
drop policy if exists "plants_delete_own" on public.plants;

create policy plants_select_members on public.plants for select
  using (public.is_household_member(household_id));

create policy plants_insert_members on public.plants for insert
  with check (
    user_id = auth.uid()
    and (
      household_id is null  -- Trigger fuellt Default
      or public.is_household_member(household_id)
    )
  );

create policy plants_update_members on public.plants for update
  using (public.is_household_member(household_id));

create policy plants_delete_members on public.plants for delete
  using (public.is_household_member(household_id));

-- care_logs: Lesen fuer Haushalt, Schreiben nur mit eigener user_id.
drop policy if exists "care_logs_select_own" on public.care_logs;
drop policy if exists "care_logs_insert_own" on public.care_logs;
drop policy if exists "care_logs_delete_own" on public.care_logs;

create policy care_logs_select_members on public.care_logs for select
  using (
    exists(
      select 1 from public.plants p
        where p.id = care_logs.plant_id
          and public.is_household_member(p.household_id)
    )
  );

create policy care_logs_insert_members on public.care_logs for insert
  with check (
    user_id = auth.uid()
    and exists(
      select 1 from public.plants p
        where p.id = care_logs.plant_id
          and public.is_household_member(p.household_id)
    )
  );

create policy care_logs_delete_members on public.care_logs for delete
  using (
    user_id = auth.uid()
    and exists(
      select 1 from public.plants p
        where p.id = care_logs.plant_id
          and public.is_household_member(p.household_id)
    )
  );

-- ============================================================
-- RPC: Paket aktivieren
-- ============================================================

create or replace function public.activate_qr_package(
  p_code          text,
  p_household_id  uuid
)
returns public.qr_packages
language plpgsql
security definer
set search_path = public
as $$
declare
  v_package public.qr_packages;
begin
  if not exists(
    select 1 from public.household_members
      where household_id = p_household_id
        and user_id = auth.uid()
  ) then
    raise exception 'not a member of target household'
      using errcode = '42501';
  end if;

  update public.qr_packages
    set household_id = p_household_id,
        redeemed_by  = auth.uid(),
        redeemed_at  = now()
    where code = p_code
      and household_id is null
    returning * into v_package;

  if v_package.id is null then
    raise exception 'invalid or already activated code'
      using errcode = '22023';
  end if;

  return v_package;
end;
$$;

revoke all on function public.activate_qr_package(text, uuid) from public;
grant execute on function public.activate_qr_package(text, uuid) to authenticated;

-- ============================================================
-- RPC: Slot-Lookup fuer Scan-Flow (pre-login safe)
--   Gibt nur Booleans zurueck, damit die Scan-Seite entscheiden kann:
--     - ist das Paket aktiviert?
--     - existiert schon eine Pflanze fuer diesen Slot?
--     - bin ich Mitglied im Haushalt des Pakets?
-- ============================================================

create or replace function public.lookup_plant_uuid(p_plant_uuid uuid)
returns table (
  package_activated boolean,
  plant_registered  boolean,
  user_is_member    boolean
)
language sql
security definer
stable
set search_path = public
as $$
  select
    p.household_id is not null                                        as package_activated,
    exists(select 1 from public.plants pl where pl.slot_uuid = s.uuid) as plant_registered,
    coalesce(public.is_household_member(p.household_id), false)       as user_is_member
  from public.qr_slots s
  join public.qr_packages p on p.id = s.package_id
  where s.uuid = p_plant_uuid
  limit 1;
$$;

revoke all on function public.lookup_plant_uuid(uuid) from public;
grant execute on function public.lookup_plant_uuid(uuid) to anon, authenticated;

commit;
