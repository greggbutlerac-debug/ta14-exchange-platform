create extension if not exists pgcrypto;

create table if not exists public.aca_search_records (
  id uuid primary key default gen_random_uuid(),
  record_id text not null unique,
  request_text text not null,
  bounded_query text not null,
  determination text not null check (determination in ('ALLOW','HOLD','DENY','ESCALATE')),
  determination_reason text not null,
  commit_state text not null default 'NOT_COMMITTED' check (commit_state in ('NOT_COMMITTED','COMMITTED','BLOCKED')),
  provider text not null default 'GOOGLE_WEB_SEARCH',
  provider_request_url text,
  request_word_count integer not null default 0,
  bounded_word_count integer not null default 0,
  evidence jsonb not null default '{}'::jsonb,
  continuity jsonb not null default '{}'::jsonb,
  binding jsonb not null default '{}'::jsonb,
  outcome jsonb not null default '{}'::jsonb,
  session_fingerprint text,
  created_at timestamptz not null default now(),
  committed_at timestamptz,
  outcome_recorded_at timestamptz
);

create index if not exists aca_search_records_created_at_idx on public.aca_search_records(created_at desc);
create index if not exists aca_search_records_determination_idx on public.aca_search_records(determination);
create index if not exists aca_search_records_commit_state_idx on public.aca_search_records(commit_state);

alter table public.aca_search_records enable row level security;

-- Public demonstrator records are written only through the server-side service role.
-- No anonymous direct read/write policy is created here. Administrative/research views
-- can be added separately with bounded aggregation rather than exposing raw queries.
comment on table public.aca_search_records is 'TA-14 ACA preserved pre-computational search governance records. Raw requests are not public by default.';
