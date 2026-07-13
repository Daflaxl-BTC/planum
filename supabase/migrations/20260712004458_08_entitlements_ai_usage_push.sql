-- 08: Entitlements, KI-Nutzungs-Log, Push-Token (App-Umbau Web -> Native)
-- Quelle: docs/ios-migration-plan.md Abschnitt 5.1 + 5.4.
-- RLS: Nutzer liest NUR eigenen Datensatz; Schreiben ausschliesslich service-role
--      (keine insert/update/delete-Policies -> service-role bypassed RLS).

-- Berechtigungsstufe pro Nutzer
create table public.entitlements (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  tier              text not null default 'free'
                    check (tier in ('free','basis','pro')),
  basis_unlocked_at timestamptz,             -- Lifetime-Freischaltung Basis
  pro_cloud_until   timestamptz,             -- Cloud-Abo-Ablauf (Pro)
  extra_slots       int not null default 0,  -- gekaufte 10er-Pakete
  updated_at        timestamptz not null default now()
);

-- Faelschungssicheres KI-Nutzungs-Log fuer Kontingente
create table public.ai_usage (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  plant_id   uuid references public.plants(id) on delete cascade,
  kind       text not null check (kind in ('identify','care_query')),
  called_at  timestamptz not null default now()
);
create index ai_usage_user_plant_called_idx
  on public.ai_usage (user_id, plant_id, called_at);

-- Push-Token pro Geraet
create table public.push_tokens (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  token      text not null,
  platform   text not null default 'ios' check (platform in ('ios','android','web')),
  updated_at timestamptz not null default now(),
  unique (user_id, token)
);
create index push_tokens_user_idx on public.push_tokens (user_id);

-- updated_at Trigger (bestehende Funktion public.touch_updated_at wiederverwenden)
create trigger entitlements_touch_updated_at before update on public.entitlements
  for each row execute function public.touch_updated_at();
create trigger push_tokens_touch_updated_at before update on public.push_tokens
  for each row execute function public.touch_updated_at();

-- RLS aktivieren
alter table public.entitlements enable row level security;
alter table public.ai_usage    enable row level security;
alter table public.push_tokens enable row level security;

-- Nur Lesen des eigenen Datensatzes; keine Schreib-Policies -> nur service-role schreibt
create policy "entitlements_select_own" on public.entitlements
  for select using (user_id = auth.uid());
create policy "ai_usage_select_own" on public.ai_usage
  for select using (user_id = auth.uid());
create policy "push_tokens_select_own" on public.push_tokens
  for select using (user_id = auth.uid());
