create table public.ta14_private_gcea_lifecycle_verifications (
  verification_id text primary key,
  owner_user_id uuid not null references auth.users(id),
  status text not null check (status in ('PASS','FAIL')),
  canonical_chain jsonb not null,
  checks jsonb not null,
  failures jsonb not null,
  result_hash text not null unique,
  preserved_at timestamptz not null default now()
);

alter table public.ta14_private_gcea_lifecycle_verifications enable row level security;

grant select, insert on public.ta14_private_gcea_lifecycle_verifications to authenticated;

create policy "gcea lifecycle owner read"
on public.ta14_private_gcea_lifecycle_verifications
for select to authenticated
using ((select auth.uid()) = owner_user_id);

create policy "gcea lifecycle owner append"
on public.ta14_private_gcea_lifecycle_verifications
for insert to authenticated
with check ((select auth.uid()) = owner_user_id);

create or replace function public.ta14_private_gcea_lifecycle_verifications_append_only()
returns trigger language plpgsql set search_path = public as $$
begin
  raise exception 'TA-14 private GCEA lifecycle verification evidence is append-only';
end;
$$;

create trigger ta14_private_gcea_lifecycle_verifications_append_only
before update or delete on public.ta14_private_gcea_lifecycle_verifications
for each row execute function public.ta14_private_gcea_lifecycle_verifications_append_only();
