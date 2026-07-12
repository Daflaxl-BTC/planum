-- Quelle: bereits auf dem Planum-Supabase-Projekt angewendet (version 20260424190037).
-- Diese Datei spiegelt das tatsaechlich laufende Schema, damit `supabase db pull`
-- / lokale Dev-Umgebungen uebereinstimmen. NICHT erneut anwenden.

-- Extensions
create extension if not exists "pgcrypto";

-- Care action enum
do $$ begin
  create type public.care_action as enum ('water', 'fertilize', 'repot', 'mist', 'prune');
exception when duplicate_object then null; end $$;

-- Profiles (one-to-one with auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  notification_email boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Plant species (global, read-only for users)
create table public.plant_species (
  id uuid primary key default gen_random_uuid(),
  scientific_name text unique not null,
  common_name_de text,
  common_name_en text,
  water_interval_days int not null default 7,
  fertilize_interval_days int not null default 30,
  repot_interval_months int not null default 24,
  light_requirement text check (light_requirement in ('low','medium','bright','direct')),
  care_notes text,
  emoji text,
  image_url text,
  created_at timestamptz not null default now()
);

-- QR packages (sold on Amazon)
create table public.qr_packages (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  slot_count int not null default 20,
  redeemed_by uuid references auth.users(id) on delete set null,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Plants
create table public.plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slot_uuid uuid unique,
  species_id uuid references public.plant_species(id) on delete set null,
  nickname text not null,
  detected_species_name text,
  detected_confidence numeric,
  photo_url text,
  location text,
  light_condition text,
  water_interval_days int,
  fertilize_interval_days int,
  repot_interval_months int,
  last_watered_at timestamptz,
  last_fertilized_at timestamptz,
  last_repotted_at timestamptz,
  next_water_due_at timestamptz,
  next_fertilize_due_at timestamptz,
  next_repot_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

-- QR slots (one per sticker, created when package is generated)
create table public.qr_slots (
  uuid uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.qr_packages(id) on delete cascade,
  claimed_by uuid references auth.users(id) on delete set null,
  plant_id uuid references public.plants(id) on delete set null,
  claimed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.plants
  add constraint plants_slot_uuid_fkey
  foreign key (slot_uuid) references public.qr_slots(uuid) on delete set null;

-- Care logs
create table public.care_logs (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references public.plants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  action public.care_action not null,
  notes text,
  photo_url text,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Indexes
create index plants_user_id_idx on public.plants(user_id);
create index plants_next_water_due_idx on public.plants(next_water_due_at) where archived_at is null;
create index care_logs_plant_id_logged_idx on public.care_logs(plant_id, logged_at desc);
create index qr_slots_claimed_by_idx on public.qr_slots(claimed_by);

-- Auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger plants_touch_updated_at before update on public.plants
  for each row execute function public.touch_updated_at();
create trigger profiles_touch_updated_at before update on public.profiles
  for each row execute function public.touch_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.plant_species enable row level security;
alter table public.qr_packages enable row level security;
alter table public.qr_slots enable row level security;
alter table public.plants enable row level security;
alter table public.care_logs enable row level security;

-- profiles: user manages own row
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- plant_species: public read
create policy "species_read_all" on public.plant_species for select using (true);

-- qr_packages: user can read own redeemed, and can redeem (update) unclaimed by code
create policy "qr_packages_read_own" on public.qr_packages for select using (redeemed_by = auth.uid());

-- qr_slots: user reads/updates own
create policy "qr_slots_read_own" on public.qr_slots for select using (claimed_by = auth.uid());
create policy "qr_slots_update_own" on public.qr_slots for update using (claimed_by = auth.uid());

-- plants: full CRUD for owner
create policy "plants_select_own" on public.plants for select using (user_id = auth.uid());
create policy "plants_insert_own" on public.plants for insert with check (user_id = auth.uid());
create policy "plants_update_own" on public.plants for update using (user_id = auth.uid());
create policy "plants_delete_own" on public.plants for delete using (user_id = auth.uid());

-- care_logs: user CRUD for own plants
create policy "care_logs_select_own" on public.care_logs for select using (user_id = auth.uid());
create policy "care_logs_insert_own" on public.care_logs for insert with check (user_id = auth.uid());
create policy "care_logs_delete_own" on public.care_logs for delete using (user_id = auth.uid());
