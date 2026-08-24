-- 11: waitlist_signups — Warteliste der Landingpage (Double-Opt-In).
--
-- RLS ist an, es gibt bewusst KEINE Policy: gelesen und geschrieben wird
-- ausschliesslich per service-role in den Edge Functions waitlist-subscribe /
-- waitlist-confirm. Eine offene insert-Policy waere hier die groessere Luecke —
-- sie erlaubte jedem anonymen Besucher, die Tabelle zu fluten.
--
-- E-Mail als text statt citext: die Adresse wird in der Edge Function
-- normalisiert (trim + lowercase), die Eindeutigkeit sichert der unique Index.
-- Damit braucht die Migration keine Extension-Rechte.

create table public.waitlist_signups (
  id                uuid primary key default gen_random_uuid(),
  email             text        not null,
  confirmed_at      timestamptz,
  confirm_token_hash text,
  token_expires_at  timestamptz,
  consent_version   text        not null,
  source            text        not null default 'landing',
  ip_hash           text,                     -- sha256(ip || pepper), nie die Klar-IP
  user_agent        text,
  created_at        timestamptz not null default now(),
  unsubscribed_at   timestamptz
);

create unique index waitlist_signups_email_key   on public.waitlist_signups (lower(email));
create index waitlist_signups_token_idx          on public.waitlist_signups (confirm_token_hash)
  where confirm_token_hash is not null;
create index waitlist_signups_ip_created_idx     on public.waitlist_signups (ip_hash, created_at desc);
create index waitlist_signups_unconfirmed_idx    on public.waitlist_signups (created_at)
  where confirmed_at is null;

alter table public.waitlist_signups enable row level security;
-- Keine Policies. Absicht, kein Versehen.

-- Aufraeumen unbestaetigter Eintraege. Datenminimierung nach Art. 5 (1) c DSGVO:
-- wer den Bestaetigungslink nicht klickt, hat keine Einwilligung erteilt.
-- Aufruf per pg_cron oder manuell; security definer, damit ein Cron-Job ohne
-- Tabellenrechte auskommt.
create or replace function public.purge_unconfirmed_waitlist()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  removed integer;
begin
  delete from public.waitlist_signups
  where confirmed_at is null
    and created_at < now() - interval '30 days';
  get diagnostics removed = row_count;
  return removed;
end;
$$;

revoke all on function public.purge_unconfirmed_waitlist() from public, anon, authenticated;
