-- Pflegeshop: kuratiertes Sortiment fuer den /shop-Tab.
-- Sortiment soll spaeter ohne Re-Deploy editierbar sein. Schema deshalb in
-- der DB statt hardcoded im Frontend. Live-Preise werden NICHT gepflegt
-- (rechtlich heikel) -- nur unverbindliche Hinweise.
--
-- Read-only fuer alle authentifizierten Nutzer; Pflege erfolgt nur via
-- Service-Role/SQL durch Felix.

begin;

create table public.shop_products (
  id                uuid primary key default gen_random_uuid(),
  category          text not null
                    check (category in ('duenger','erde','toepfe','werkzeug','bewaesserung','sonstiges')),
  title             text not null,
  subtitle          text,
  description       text,
  image_url         text,
  affiliate_url     text not null,
  affiliate_network text not null
                    check (affiliate_network in ('amazon','awin','direct')),
  price_hint        text,
  badge             text,
  sort_order        int  not null default 100,
  active            boolean not null default true,
  created_at        timestamptz not null default now()
);

create index shop_products_active_sort_idx
  on public.shop_products (active, sort_order)
  where active = true;

alter table public.shop_products enable row level security;

create policy shop_products_select_authenticated
  on public.shop_products for select
  using (auth.role() = 'authenticated');

commit;
