begin;

create extension if not exists pgcrypto;

-- Partial registration recovery is deliberately separate from the authoritative
-- Registry submission table. It preserves unfinished work without implying
-- submission, registration, review, certification, endorsement, or approval.
create table if not exists public.ta14_registry_registration_recovery_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recovery_key text not null,
  state text not null default 'active',
  active_step integer not null default 0,
  governance_name text,
  organization_name text,
  contact_email text,
  draft_payload jsonb not null default '{}'::jsonb,
  submission_id uuid references public.ai_governance_registry_submissions(id) on delete set null,
  first_saved_at timestamptz not null default timezone('utc', now()),
  last_saved_at timestamptz not null default timezone('utc', now()),
  promoted_at timestamptz,
  completed_at timestamptz,
  constraint ta14_registry_registration_recovery_state_check
    check (state in ('active','promoted','completed','abandoned')),
  constraint ta14_registry_registration_recovery_step_check
    check (active_step between 0 and 13),
  constraint ta14_registry_registration_recovery_key_check
    check (length(btrim(recovery_key)) between 8 and 128),
  unique (user_id, recovery_key)
);

comment on table public.ta14_registry_registration_recovery_drafts is
  'Non-authoritative account-backed recovery state for incomplete TA-14 governance registration. A recovery record is not a Registry submission or registration.';

create index if not exists ta14_registry_registration_recovery_user_idx
  on public.ta14_registry_registration_recovery_drafts(user_id, last_saved_at desc);

create index if not exists ta14_registry_registration_recovery_state_idx
  on public.ta14_registry_registration_recovery_drafts(state, last_saved_at desc);

alter table public.ta14_registry_registration_recovery_drafts enable row level security;
revoke all on table public.ta14_registry_registration_recovery_drafts from public;
revoke all on table public.ta14_registry_registration_recovery_drafts from anon;
revoke all on table public.ta14_registry_registration_recovery_drafts from authenticated;

-- Admin awareness on the first durable recovery save. This is intentionally
-- separate from governance_registered and does not imply a Registry record.
create or replace function public.ta14_registry_recovery_started_notification_v1()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ta14_registry_admin_notifications (
    notification_key,
    notification_type,
    priority,
    state,
    submission_id,
    registry_identifier,
    governance_name,
    claimant_name,
    organization_name,
    requested_review_pathway,
    title,
    message,
    event_payload,
    occurred_at
  ) values (
    'registration_recovery_started:' || new.id::text,
    'registration_started',
    'attention',
    'unread',
    null,
    null,
    coalesce(nullif(btrim(new.governance_name), ''), 'Unnamed governance registration'),
    null,
    nullif(btrim(new.organization_name), ''),
    null,
    'Governance registration started',
    'An authenticated participant has an account-backed incomplete governance registration. The record is recovery state only and is not yet a Registry submission.',
    jsonb_build_object(
      'recovery_id', new.id,
      'user_id', new.user_id,
      'active_step', new.active_step,
      'contact_email', new.contact_email,
      'state', new.state
    ),
    new.first_saved_at
  )
  on conflict (notification_key) do nothing;

  return new;
end;
$$;

revoke all on function public.ta14_registry_recovery_started_notification_v1() from public, anon, authenticated;

drop trigger if exists ta14_registry_recovery_started_notification_trigger
  on public.ta14_registry_registration_recovery_drafts;
create trigger ta14_registry_recovery_started_notification_trigger
after insert on public.ta14_registry_registration_recovery_drafts
for each row execute function public.ta14_registry_recovery_started_notification_v1();

commit;
