-- Tracked links and click events. Each client only sees their own rows (RLS).
-- Public opens go through private.track_click, which is not exposed by the Data API.

create table public.links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null constraint links_name_len check (char_length(name) between 1 and 80),
  slug text not null constraint links_slug_format check (slug ~ '^[a-z0-9]{4,32}$'),
  destination_url text not null constraint links_destination_http check (destination_url ~ '^https?://'),
  created_at timestamptz not null default now(),
  constraint links_slug_key unique (slug)
);

create index links_user_id_idx on public.links (user_id);

create table public.clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.links (id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer text,
  user_agent text
);

create index clicks_link_id_clicked_at_idx on public.clicks (link_id, clicked_at desc);

alter table public.links enable row level security;
alter table public.clicks enable row level security;

create policy links_select_own
  on public.links
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy links_insert_own
  on public.links
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy links_update_own
  on public.links
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy links_delete_own
  on public.links
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy clicks_select_own
  on public.clicks
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.links
      where links.id = clicks.link_id
        and links.user_id = (select auth.uid())
    )
  );

revoke all on table public.links from anon;
revoke all on table public.clicks from anon, authenticated;
grant select, insert, update, delete on table public.links to authenticated;
grant select on table public.clicks to authenticated;

create schema if not exists private;

revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

create or replace function private.track_click(
  p_slug text,
  p_referrer text,
  p_user_agent text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_link_id uuid;
  v_destination text;
begin
  if p_slug is null or p_slug !~ '^[a-z0-9]{4,32}$' then
    return null;
  end if;

  select id, destination_url
    into v_link_id, v_destination
  from public.links
  where slug = p_slug;

  if v_link_id is null or v_destination !~ '^https?://' then
    return null;
  end if;

  insert into public.clicks (link_id, referrer, user_agent)
  values (
    v_link_id,
    nullif(left(coalesce(p_referrer, ''), 500), ''),
    nullif(left(coalesce(p_user_agent, ''), 500), '')
  );

  return v_destination;
end;
$$;

revoke all on function private.track_click(text, text, text) from public;
grant execute on function private.track_click(text, text, text) to anon, authenticated;

create or replace function public.track_click(
  p_slug text,
  p_referrer text,
  p_user_agent text
)
returns text
language sql
security invoker
set search_path = ''
as $$
  select private.track_click(p_slug, p_referrer, p_user_agent);
$$;

revoke all on function public.track_click(text, text, text) from public;
grant execute on function public.track_click(text, text, text) to anon, authenticated;
