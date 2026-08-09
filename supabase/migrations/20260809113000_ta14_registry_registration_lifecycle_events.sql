begin;

create extension if not exists pgcrypto;

-- ============================================================================
-- TA-14 REGISTRATION LIFECYCLE TELEMETRY
--
-- Purpose:
-- Preserve non-authoritative operational telemetry for the governance
-- registration journey:
--
--   account created
--     -> registration page opened
--     -> registration started
--     -> draft saved
--     -> submitted
--     -> registered
--
-- These events DO NOT create or modify an authoritative governance
-- registration. They exist only to provide administrative visibility into
-- where a participant is in the intake journey.
-- ============================================================================

create table if not exists public.ta14_registry_registration_lifecycle_events (
  id uuid primary key default gen_random_uuid(),

  user_id uuid
    references auth.users(id)
    on delete set null,

  submission_id uuid
    references public.ai_governance_registry_submissions(id)
    on delete set null,

  event_type text not null,

  source text not null default 'web',

  session_key text,

  governance_name text,
  organization_name text,
  contact_email text,

  event_payload jsonb not null default '{}'::jsonb,

  occurred_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),

  constraint ta14_registry_registration_lifecycle_event_type_check
    check (
      event_type in (
        'registration_page_opened',
        'registration_started',
        'draft_saved',
        'submission_submitted',
        'registration_completed',
        'registration_failed'
      )
    ),

  constraint ta14_registry_registration_lifecycle_source_check
    check (
      source in (
        'web',
        'api',
        'server',
        'system'
      )
    )
);

comment on table public.ta14_registry_registration_lifecycle_events is
  'Operational telemetry for the TA-14 governance registration journey. Lifecycle events are not authoritative Registry records and do not constitute submission, registration, approval, certification, endorsement, or review.';

comment on column public.ta14_registry_registration_lifecycle_events.event_type is
  'Non-authoritative intake journey event. Only submission and registration tables establish authoritative Registry lifecycle state.';

comment on column public.ta14_registry_registration_lifecycle_events.session_key is
  'Optional non-secret browser/session correlation key used to group pre-submission lifecycle events.';

comment on column public.ta14_registry_registration_lifecycle_events.event_payload is
  'Minimal structured operational context for administrative visibility. Do not store secrets, credentials, or unnecessary sensitive content.';


-- ============================================================================
-- INDEXES
-- ============================================================================

create index if not exists
  ta14_registry_registration_lifecycle_events_user_idx
on public.ta14_registry_registration_lifecycle_events (
  user_id,
  occurred_at desc
);

create index if not exists
  ta14_registry_registration_lifecycle_events_submission_idx
on public.ta14_registry_registration_lifecycle_events (
  submission_id,
  occurred_at desc
)
where submission_id is not null;

create index if not exists
  ta14_registry_registration_lifecycle_events_type_idx
on public.ta14_registry_registration_lifecycle_events (
  event_type,
  occurred_at desc
);

create index if not exists
  ta14_registry_registration_lifecycle_events_email_idx
on public.ta14_registry_registration_lifecycle_events (
  lower(contact_email),
  occurred_at desc
)
where contact_email is not null;

create index if not exists
  ta14_registry_registration_lifecycle_events_session_idx
on public.ta14_registry_registration_lifecycle_events (
  session_key,
  occurred_at desc
)
where session_key is not null;


-- ============================================================================
-- ROW LEVEL SECURITY
--
-- The browser does not write directly to this table.
-- A protected server-side route validates the authenticated Supabase session
-- and writes with the service role.
-- ============================================================================

alter table public.ta14_registry_registration_lifecycle_events
  enable row level security;

revoke all
  on table public.ta14_registry_registration_lifecycle_events
  from public;

revoke all
  on table public.ta14_registry_registration_lifecycle_events
  from anon;

revoke all
  on table public.ta14_registry_registration_lifecycle_events
  from authenticated;


-- ============================================================================
-- ADMINISTRATIVE SUMMARY
-- ============================================================================

create or replace function
  public.ta14_registry_registration_lifecycle_summary_v1(
    p_since timestamptz default null
  )
returns table (
  registration_page_opened_count bigint,
  registration_started_count bigint,
  draft_saved_count bigint,
  submission_submitted_count bigint,
  registration_completed_count bigint,
  registration_failed_count bigint,
  unique_users bigint,
  newest_event_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*) filter (
      where event_type = 'registration_page_opened'
    ) as registration_page_opened_count,

    count(*) filter (
      where event_type = 'registration_started'
    ) as registration_started_count,

    count(*) filter (
      where event_type = 'draft_saved'
    ) as draft_saved_count,

    count(*) filter (
      where event_type = 'submission_submitted'
    ) as submission_submitted_count,

    count(*) filter (
      where event_type = 'registration_completed'
    ) as registration_completed_count,

    count(*) filter (
      where event_type = 'registration_failed'
    ) as registration_failed_count,

    count(distinct user_id) filter (
      where user_id is not null
    ) as unique_users,

    max(occurred_at) as newest_event_at

  from public.ta14_registry_registration_lifecycle_events

  where
    p_since is null
    or occurred_at >= p_since;
$$;

revoke all
  on function
    public.ta14_registry_registration_lifecycle_summary_v1(timestamptz)
  from public;

revoke all
  on function
    public.ta14_registry_registration_lifecycle_summary_v1(timestamptz)
  from anon;

revoke all
  on function
    public.ta14_registry_registration_lifecycle_summary_v1(timestamptz)
  from authenticated;


-- ============================================================================
-- ADMINISTRATIVE JOURNEY VIEW
--
-- Aggregates lifecycle telemetry per authenticated user while preserving the
-- authoritative submission state separately.
-- ============================================================================

create or replace view public.ta14_registry_registration_journeys_v1
with (security_invoker = false)
as
select
  u.id as user_id,
  u.email as account_email,
  u.created_at as account_created_at,
  u.last_sign_in_at,

  min(e.occurred_at) filter (
    where e.event_type = 'registration_page_opened'
  ) as first_registration_page_opened_at,

  min(e.occurred_at) filter (
    where e.event_type = 'registration_started'
  ) as first_registration_started_at,

  max(e.occurred_at) filter (
    where e.event_type = 'draft_saved'
  ) as latest_draft_saved_at,

  max(e.occurred_at) filter (
    where e.event_type = 'submission_submitted'
  ) as latest_submission_submitted_at,

  max(e.occurred_at) filter (
    where e.event_type = 'registration_completed'
  ) as latest_registration_completed_at,

  max(e.occurred_at) filter (
    where e.event_type = 'registration_failed'
  ) as latest_registration_failed_at,

  count(e.id) as lifecycle_event_count,

  count(s.id) as governance_submission_count,

  max(s.status) filter (
    where s.created_at = (
      select max(s2.created_at)
      from public.ai_governance_registry_submissions s2
      where s2.owner_user_id = u.id
    )
  ) as latest_submission_status

from auth.users u

left join public.ta14_registry_registration_lifecycle_events e
  on e.user_id = u.id

left join public.ai_governance_registry_submissions s
  on s.owner_user_id = u.id

group by
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at;

comment on view public.ta14_registry_registration_journeys_v1 is
  'Administrative journey view combining account presence, non-authoritative registration telemetry, and authoritative governance submission counts.';

revoke all
  on public.ta14_registry_registration_journeys_v1
  from public;

revoke all
  on public.ta14_registry_registration_journeys_v1
  from anon;

revoke all
  on public.ta14_registry_registration_journeys_v1
  from authenticated;


commit;
