-- TA-14 AI Governance Registry
-- Reviewer decision foundation
-- Adds review fields, accepted lifecycle support, indexes, and reviewer-only controls.

begin;

alter table public.ai_governance_registry_submissions
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by_user_id uuid references auth.users(id) on delete set null,
  add column if not exists review_decision text,
  add column if not exists review_rationale text,
  add column if not exists reviewer_notes text;

comment on column public.ai_governance_registry_submissions.reviewed_at is
  'Timestamp of the most recent bounded Registry review decision.';

comment on column public.ai_governance_registry_submissions.reviewed_by_user_id is
  'Authenticated user who issued the most recent bounded Registry review decision.';

comment on column public.ai_governance_registry_submissions.review_decision is
  'Latest bounded review action: return_for_correction, hold, escalate, or accept_for_registration.';

comment on column public.ai_governance_registry_submissions.review_rationale is
  'Required reviewer rationale supporting the latest bounded Registry decision.';

comment on column public.ai_governance_registry_submissions.reviewer_notes is
  'Optional internal reviewer notes. Not intended for publication.';

-- Replace any existing status check constraint that blocks the accepted state.
do $$
declare
  constraint_record record;
begin
  for constraint_record in
    select conname
    from pg_constraint
    where conrelid = 'public.ai_governance_registry_submissions'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format(
      'alter table public.ai_governance_registry_submissions drop constraint if exists %I',
      constraint_record.conname
    );
  end loop;
end
$$;

alter table public.ai_governance_registry_submissions
  add constraint ai_governance_registry_submissions_status_check
  check (
    status in (
      'draft',
      'submitted',
      'under_review',
      'hold',
      'escalated',
      'accepted',
      'registered',
      'active',
      'archived',
      'superseded',
      'disputed',
      'withdrawn',
      'rejected'
    )
  );

alter table public.ai_governance_registry_submissions
  drop constraint if exists ai_governance_registry_submissions_review_decision_check;

alter table public.ai_governance_registry_submissions
  add constraint ai_governance_registry_submissions_review_decision_check
  check (
    review_decision is null
    or review_decision in (
      'return_for_correction',
      'hold',
      'escalate',
      'accept_for_registration'
    )
  );

alter table public.ai_governance_registry_submissions
  drop constraint if exists ai_governance_registry_submissions_review_rationale_check;

alter table public.ai_governance_registry_submissions
  add constraint ai_governance_registry_submissions_review_rationale_check
  check (
    review_rationale is null
    or char_length(btrim(review_rationale)) >= 20
  );

create index if not exists idx_ai_registry_submissions_review_queue
  on public.ai_governance_registry_submissions (status, submitted_at asc)
  where status in ('submitted', 'under_review', 'hold', 'escalated');

create index if not exists idx_ai_registry_submissions_reviewed_at
  on public.ai_governance_registry_submissions (reviewed_at desc)
  where reviewed_at is not null;

create index if not exists idx_ai_registry_submissions_reviewed_by
  on public.ai_governance_registry_submissions (reviewed_by_user_id, reviewed_at desc)
  where reviewed_by_user_id is not null;

-- Reviewer authorization is controlled by a comma-separated server environment
-- variable in the application. This helper permits database policies to use the
-- same explicit allowlist through a PostgreSQL setting when configured.
create or replace function public.ta14_registry_is_reviewer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    auth.uid() is not null
    and lower(coalesce(auth.jwt() ->> 'email', '')) = any (
      string_to_array(
        lower(coalesce(current_setting('app.settings.ta14_registry_reviewer_emails', true), '')),
        ','
      )
    );
$$;

revoke all on function public.ta14_registry_is_reviewer() from public;
grant execute on function public.ta14_registry_is_reviewer() to authenticated;

alter table public.ai_governance_registry_submissions enable row level security;

-- Remove older reviewer policies with these canonical names before recreating.
drop policy if exists "Registry reviewers may read submitted records"
  on public.ai_governance_registry_submissions;

drop policy if exists "Registry reviewers may issue bounded decisions"
  on public.ai_governance_registry_submissions;

create policy "Registry reviewers may read submitted records"
  on public.ai_governance_registry_submissions
  for select
  to authenticated
  using (
    public.ta14_registry_is_reviewer()
    and status in (
      'submitted',
      'under_review',
      'hold',
      'escalated',
      'accepted',
      'registered',
      'active',
      'archived',
      'superseded',
      'disputed',
      'withdrawn',
      'rejected'
    )
  );

create policy "Registry reviewers may issue bounded decisions"
  on public.ai_governance_registry_submissions
  for update
  to authenticated
  using (
    public.ta14_registry_is_reviewer()
    and status in ('submitted', 'under_review', 'hold', 'escalated')
    and registry_identifier is null
  )
  with check (
    public.ta14_registry_is_reviewer()
    and status in ('draft', 'hold', 'escalated', 'accepted')
  );

-- Registrants retain access to their own records, but ordinary owner updates
-- must not be allowed to manufacture reviewer decisions.
create or replace function public.ta14_registry_protect_review_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.ta14_registry_is_reviewer() then
    return new;
  end if;

  if new.reviewed_at is distinct from old.reviewed_at
    or new.reviewed_by_user_id is distinct from old.reviewed_by_user_id
    or new.review_decision is distinct from old.review_decision
    or new.review_rationale is distinct from old.review_rationale
    or new.reviewer_notes is distinct from old.reviewer_notes
  then
    raise exception 'Registry review fields may only be changed by an authorized reviewer';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_ai_registry_review_fields
  on public.ai_governance_registry_submissions;

create trigger protect_ai_registry_review_fields
before update on public.ai_governance_registry_submissions
for each row
execute function public.ta14_registry_protect_review_fields();

-- Immutable event records need to remain readable by authorized reviewers.
alter table public.ai_governance_registry_events enable row level security;

drop policy if exists "Registry reviewers may read Registry events"
  on public.ai_governance_registry_events;

drop policy if exists "Registry reviewers may create Registry events"
  on public.ai_governance_registry_events;

create policy "Registry reviewers may read Registry events"
  on public.ai_governance_registry_events
  for select
  to authenticated
  using (public.ta14_registry_is_reviewer());

create policy "Registry reviewers may create Registry events"
  on public.ai_governance_registry_events
  for insert
  to authenticated
  with check (
    public.ta14_registry_is_reviewer()
    and actor_user_id = auth.uid()
  );

commit;
