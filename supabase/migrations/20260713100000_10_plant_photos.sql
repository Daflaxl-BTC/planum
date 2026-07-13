-- 10: plant_photos — Bilderverlauf + Zustands-Assessments (NFC/Skip Foto-Update-Flow)
-- RLS: Haushaltsmitglieder lesen; Schreiben ausschliesslich service-role (Edge Function).

create table public.plant_photos (
  id           uuid primary key default gen_random_uuid(),
  plant_id     uuid references public.plants(id) on delete cascade,   -- null = pending Skip-Match
  household_id uuid not null references public.households(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  image_url    text not null,
  source       text not null check (source in ('nfc','skip')),
  status       text not null default 'pending' check (status in ('pending','confirmed')),
  assessment   jsonb,
  taken_at     timestamptz not null default now(),
  created_at   timestamptz not null default now()
);
create index plant_photos_plant_taken_idx on public.plant_photos (plant_id, taken_at desc);
create index plant_photos_household_idx   on public.plant_photos (household_id);

alter table public.plant_photos enable row level security;

create policy "plant_photos_select_household" on public.plant_photos
  for select using (
    household_id in (select household_id from public.household_members where user_id = auth.uid())
  );
-- Kein insert/update/delete-Policy -> nur service-role schreibt.
