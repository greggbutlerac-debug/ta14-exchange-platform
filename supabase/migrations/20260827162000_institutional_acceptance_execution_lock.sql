-- TA-14 Institutional Examination Production Acceptance
-- Durable one-shot execution lock and first-result preservation surface.
-- This table is operational acceptance evidence only. It is not a Registry,
-- participant, certification, or governed institutional finding surface.

create table if not exists public.ta14_institutional_acceptance_executions (
  execution_key text primary key,
  fixture_record_id text not null unique,
  state text not null check (state in ('CLAIMED', 'COMPLETED')),
  claimed_at timestamptz not null,
  completed_at timestamptz,
  deployment_commit text,
  trigger_identity text not null check (trigger_identity = 'VERCEL_CRON'),
  result_http_status integer,
  result_determination text check (result_determination in ('PASS', 'FAIL', 'INCOMPLETE')),
  result_body jsonb,
  completion_detail text,
  created_at timestamptz not null default now(),
  constraint ta14_acceptance_fixture_namespace
    check (fixture_record_id like 'TA14-ACCEPTANCE-%'),
  constraint ta14_acceptance_completion_consistency
    check (
      (state = 'CLAIMED' and completed_at is null)
      or
      (state = 'COMPLETED' and completed_at is not null)
    )
);

comment on table public.ta14_institutional_acceptance_executions is
  'Operational evidence for the TA-14 Institutional Examination Production Acceptance System. Not participant evidence, Registry standing, certification, or an institutional examination finding.';

alter table public.ta14_institutional_acceptance_executions enable row level security;

-- Explicitly deny browser/API roles. Server-side service_role access is the
-- only intended application path for the acceptance trigger.
revoke all on table public.ta14_institutional_acceptance_executions from anon;
revoke all on table public.ta14_institutional_acceptance_executions from authenticated;
grant select, insert, update on table public.ta14_institutional_acceptance_executions to service_role;
