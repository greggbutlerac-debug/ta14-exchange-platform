create table if not exists public.exchange_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  organization_name text,
  account_type text not null default 'individual'
    check (account_type in ('individual', 'business', 'organization')),
  status text not null default 'active'
    check (status in ('active', 'restricted', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.exchange_profiles enable row level security;

drop policy if exists "Users can view their own exchange profile"
  on public.exchange_profiles;

create policy "Users can view their own exchange profile"
  on public.exchange_profiles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own exchange profile"
  on public.exchange_profiles;

create policy "Users can create their own exchange profile"
  on public.exchange_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own exchange profile"
  on public.exchange_profiles;

create policy "Users can update their own exchange profile"
  on public.exchange_profiles
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create or replace function public.set_exchange_profile_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_exchange_profile_updated_at
  on public.exchange_profiles;

create trigger set_exchange_profile_updated_at
before update on public.exchange_profiles
for each row
execute function public.set_exchange_profile_updated_at();

create or replace function public.create_exchange_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.exchange_profiles (
    user_id,
    email,
    display_name,
    organization_name,
    account_type
  )
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    nullif(new.raw_user_meta_data ->> 'organization_name', ''),
    case
      when new.raw_user_meta_data ->> 'account_type'
        in ('individual', 'business', 'organization')
      then new.raw_user_meta_data ->> 'account_type'
      else 'individual'
    end
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists create_exchange_profile_after_signup
  on auth.users;

create trigger create_exchange_profile_after_signup
after insert or update of email on auth.users
for each row
execute function public.create_exchange_profile_for_new_user();

insert into public.exchange_profiles (
  user_id,
  email,
  display_name,
  organization_name,
  account_type
)
select
  users.id,
  coalesce(users.email, ''),
  nullif(users.raw_user_meta_data ->> 'display_name', ''),
  nullif(users.raw_user_meta_data ->> 'organization_name', ''),
  case
    when users.raw_user_meta_data ->> 'account_type'
      in ('individual', 'business', 'organization')
    then users.raw_user_meta_data ->> 'account_type'
    else 'individual'
  end
from auth.users as users
on conflict (user_id) do update
set
  email = excluded.email,
  updated_at = now();
