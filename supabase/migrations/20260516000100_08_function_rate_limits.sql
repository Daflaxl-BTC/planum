-- H1: Rate-Limit-Infrastruktur fuer Edge Functions.
--
-- Use case: identify-plant ruft Plant.id auf (kostenpflichtige Credits).
-- Ohne Limit kann ein authentifizierter User die Credits in Minuten
-- aufbrauchen. Diese Tabelle + RPC erlauben sliding-window Limits, die
-- aus Edge Functions via service-role client aufgerufen werden.
--
-- Schema bewusst minimal: ein Row pro Request, mit (user_id, action,
-- requested_at). Der RPC `consume_rate_limit` macht beides atomar:
-- Count im Fenster + Insert wenn Limit nicht erreicht.

begin;

create table if not exists public.function_rate_limits (
  id           bigint generated always as identity primary key,
  user_id      uuid not null references auth.users(id) on delete cascade,
  action       text not null,
  requested_at timestamptz not null default now()
);

create index if not exists function_rate_limits_user_action_time_idx
  on public.function_rate_limits (user_id, action, requested_at desc);

-- Nur Service-Role darf rein/raus. Authenticated-Clients sehen das nicht.
alter table public.function_rate_limits enable row level security;
revoke all on table public.function_rate_limits from public, anon, authenticated;

-- consume_rate_limit:
--   Prueft, ob `p_user_id` innerhalb der letzten `p_window_seconds`
--   schon `p_max_requests` Requests fuer `p_action` gemacht hat.
--   Wenn nein -> Insert + return (true, current_count + 1, retry_after_seconds=0).
--   Wenn ja  -> kein Insert + return (false, current_count, retry_after_seconds).
--
-- Wird aus Edge Functions mit dem Service-Role-Client aufgerufen.
create or replace function public.consume_rate_limit(
  p_user_id        uuid,
  p_action         text,
  p_max_requests   int,
  p_window_seconds int
)
returns table (
  allowed        boolean,
  current_count  int,
  retry_after_s  int
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cutoff   timestamptz := now() - make_interval(secs => p_window_seconds);
  v_count    int;
  v_oldest   timestamptz;
begin
  if p_user_id is null or p_action is null or p_max_requests <= 0
     or p_window_seconds <= 0 then
    raise exception 'invalid rate-limit parameters'
      using errcode = '22023';
  end if;

  select count(*), min(requested_at)
    into v_count, v_oldest
    from public.function_rate_limits
    where user_id = p_user_id
      and action  = p_action
      and requested_at >= v_cutoff;

  if v_count >= p_max_requests then
    return query
      select false,
             v_count,
             greatest(
               1,
               ceil(extract(epoch from (v_oldest + make_interval(secs => p_window_seconds) - now())))::int
             );
    return;
  end if;

  insert into public.function_rate_limits (user_id, action)
    values (p_user_id, p_action);

  return query select true, v_count + 1, 0;
end;
$$;

revoke all on function public.consume_rate_limit(uuid, text, int, int) from public;
grant execute on function public.consume_rate_limit(uuid, text, int, int) to service_role;

-- Opportunistisches Cleanup: aelter als 1 Tag wird verworfen. Statt
-- pg_cron einzurichten, ruft die Edge Function das gelegentlich auf;
-- alternativ kann ein scheduled job die Funktion taeglich triggern.
create or replace function public.purge_old_rate_limits()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.function_rate_limits
    where requested_at < now() - interval '1 day';
$$;

revoke all on function public.purge_old_rate_limits() from public;
grant execute on function public.purge_old_rate_limits() to service_role;

commit;
