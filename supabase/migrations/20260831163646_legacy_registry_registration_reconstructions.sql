create table if not exists public.ta14_registry_legacy_registration_reconstructions (
  id uuid primary key default gen_random_uuid(),
  recovery_record_id uuid not null references public.ta14_registry_pre_submission_recovery_records(id),
  owner_user_id uuid not null references auth.users(id),
  status text not null default 'OPEN' check (status in ('OPEN','RECONSTRUCTION_IN_PROGRESS','PARTICIPANT_CONFIRMED','PROMOTED_TO_DRAFT','CLOSED')),
  original_attempt_at timestamptz not null,
  original_failure_type text not null,
  reconstructed_payload jsonb not null default '{}'::jsonb,
  participant_confirmed_at timestamptz,
  promoted_submission_id uuid references public.ai_governance_registry_submissions(id),
  reconstructed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  provenance_boundary jsonb not null default '{"originalSubstantivePayloadRecovered":false,"reconstructedPayloadIsOriginalServerRecord":false,"originalAttemptTimestampPreserved":true,"reconstructionTimestampPreserved":true}'::jsonb,
  unique (recovery_record_id)
);

alter table public.ta14_registry_legacy_registration_reconstructions enable row level security;
grant select, insert, update on public.ta14_registry_legacy_registration_reconstructions to authenticated;

create policy "legacy reconstruction owner read" on public.ta14_registry_legacy_registration_reconstructions for select to authenticated using (auth.uid() = owner_user_id);
create policy "legacy reconstruction owner insert" on public.ta14_registry_legacy_registration_reconstructions for insert to authenticated with check (auth.uid() = owner_user_id);
create policy "legacy reconstruction owner update" on public.ta14_registry_legacy_registration_reconstructions for update to authenticated using (auth.uid() = owner_user_id) with check (auth.uid() = owner_user_id);

create or replace function public.ta14_guard_legacy_registration_reconstruction_provenance()
returns trigger language plpgsql as $$
begin
  if coalesce((new.provenance_boundary->>'originalSubstantivePayloadRecovered')::boolean, true) <> false then
    raise exception 'legacy reconstruction cannot represent original substantive payload as recovered';
  end if;
  if coalesce((new.provenance_boundary->>'reconstructedPayloadIsOriginalServerRecord')::boolean, true) <> false then
    raise exception 'legacy reconstruction cannot represent reconstructed payload as original server record';
  end if;
  new.updated_at = now();
  return new;
end;
$$;

create trigger ta14_guard_legacy_registration_reconstruction_provenance
before insert or update on public.ta14_registry_legacy_registration_reconstructions
for each row execute function public.ta14_guard_legacy_registration_reconstruction_provenance();
