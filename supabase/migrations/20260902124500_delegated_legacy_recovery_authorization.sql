begin;

-- Recovery provenance and recovery operation are distinct authorities.
-- This table authorizes a specific authenticated operator for one preserved
-- recovery record without transferring ownership of the historical record.
create table if not exists public.ta14_registry_legacy_recovery_operator_authorizations (
  recovery_record_id uuid not null references public.ta14_registry_pre_submission_recovery_records(id) on delete cascade,
  operator_user_id uuid not null references auth.users(id) on delete cascade,
  authority_basis text not null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  primary key (recovery_record_id, operator_user_id)
);

comment on table public.ta14_registry_legacy_recovery_operator_authorizations is
  'Scoped authority to reconstruct/confirm one preserved legacy registration recovery record. Does not transfer claimant, owner, patent, or provenance identity.';

alter table public.ta14_registry_legacy_recovery_operator_authorizations enable row level security;
revoke all on public.ta14_registry_legacy_recovery_operator_authorizations from public, anon;
grant select on public.ta14_registry_legacy_recovery_operator_authorizations to authenticated;

create policy "legacy recovery operator sees own authorization"
on public.ta14_registry_legacy_recovery_operator_authorizations
for select to authenticated
using (operator_user_id = auth.uid() and revoked_at is null);

-- Security-definer predicate lets RLS ask whether the current user may operate a
-- recovery record without exposing the authorization ledger to other users.
create or replace function public.ta14_can_operate_legacy_recovery(p_recovery_record_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.ta14_registry_pre_submission_recovery_records r
    where r.id = p_recovery_record_id
      and (
        r.owner_user_id = auth.uid()
        or exists (
          select 1
          from public.ta14_registry_legacy_recovery_operator_authorizations a
          where a.recovery_record_id = r.id
            and a.operator_user_id = auth.uid()
            and a.revoked_at is null
        )
      )
  );
$$;

grant execute on function public.ta14_can_operate_legacy_recovery(uuid) to authenticated;

-- Allow a delegated operator to read the preserved recovery boundary, but not
-- to rewrite its owner or historical provenance.
create policy "legacy recovery delegated read"
on public.ta14_registry_pre_submission_recovery_records
for select to authenticated
using (public.ta14_can_operate_legacy_recovery(id));

alter table public.ta14_registry_legacy_registration_reconstructions
  add column if not exists operator_user_id uuid references auth.users(id),
  add column if not exists participant_confirmed_by uuid references auth.users(id);

update public.ta14_registry_legacy_registration_reconstructions
set operator_user_id = owner_user_id
where operator_user_id is null;

alter table public.ta14_registry_legacy_registration_reconstructions
  alter column operator_user_id set not null;

create policy "legacy reconstruction delegated read"
on public.ta14_registry_legacy_registration_reconstructions
for select to authenticated
using (
  auth.uid() = owner_user_id
  or (auth.uid() = operator_user_id and public.ta14_can_operate_legacy_recovery(recovery_record_id))
);

create policy "legacy reconstruction delegated insert"
on public.ta14_registry_legacy_registration_reconstructions
for insert to authenticated
with check (
  auth.uid() = operator_user_id
  and public.ta14_can_operate_legacy_recovery(recovery_record_id)
);

create policy "legacy reconstruction delegated update"
on public.ta14_registry_legacy_registration_reconstructions
for update to authenticated
using (
  auth.uid() = owner_user_id
  or (auth.uid() = operator_user_id and public.ta14_can_operate_legacy_recovery(recovery_record_id))
)
with check (
  auth.uid() = owner_user_id
  or (auth.uid() = operator_user_id and public.ta14_can_operate_legacy_recovery(recovery_record_id))
);

commit;
