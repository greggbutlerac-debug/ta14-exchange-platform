create table if not exists public.asg_searches (
  id uuid primary key default gen_random_uuid(),
  search_id text not null unique,
  request_text text not null,
  profile text not null,
  profile_version text not null default 'v0.1',
  provider text not null default 'GOOGLE',
  state text not null default 'RECEIVED',
  provider_metadata jsonb not null default '{}'::jsonb,
  gate_version text not null default 'asg.v0.1',
  started_at timestamptz not null default now(),
  closed_at timestamptz
);

create table if not exists public.asg_candidates (
  id uuid primary key default gen_random_uuid(),
  candidate_id text not null unique,
  search_id text not null references public.asg_searches(search_id) on delete cascade,
  provider_rank integer,
  delivered_rank integer,
  url text not null,
  title text,
  snippet text,
  canonical_host text,
  identity_hash text not null,
  evidence_snapshot jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now()
);

create table if not exists public.asg_determinations (
  id uuid primary key default gen_random_uuid(),
  determination_id text not null unique,
  candidate_id text not null references public.asg_candidates(candidate_id) on delete cascade,
  state text not null check (state in ('ALLOW','HOLD','DENY','ESCALATE')),
  reason_code text not null,
  explanation text not null,
  profile_version text not null,
  gate_version text not null,
  evidence_hash text not null,
  binding_hash text not null,
  supersedes text,
  determined_at timestamptz not null default now()
);

create table if not exists public.asg_delivery_receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_id text not null unique,
  search_id text not null references public.asg_searches(search_id) on delete cascade,
  committed_candidate_ids jsonb not null default '[]'::jsonb,
  google_candidate_count integer not null default 0,
  allow_count integer not null default 0,
  hold_count integer not null default 0,
  deny_count integer not null default 0,
  escalate_count integer not null default 0,
  delivered_count integer not null default 0,
  commit_hash text not null,
  gate_latency_ms integer,
  committed_at timestamptz not null default now()
);

create table if not exists public.asg_events (
  id bigserial primary key,
  search_id text not null references public.asg_searches(search_id) on delete cascade,
  candidate_id text,
  event_type text not null,
  prior_state text,
  new_state text,
  payload jsonb not null default '{}'::jsonb,
  event_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists asg_candidates_search_idx on public.asg_candidates(search_id);
create index if not exists asg_determinations_candidate_idx on public.asg_determinations(candidate_id, determined_at desc);
create index if not exists asg_events_search_idx on public.asg_events(search_id, created_at);
create index if not exists asg_receipts_search_idx on public.asg_delivery_receipts(search_id);

alter table public.asg_searches enable row level security;
alter table public.asg_candidates enable row level security;
alter table public.asg_determinations enable row level security;
alter table public.asg_delivery_receipts enable row level security;
alter table public.asg_events enable row level security;

comment on table public.asg_candidates is 'Provider candidates preserved before TA-14 result-level filtering; provider rank is never overwritten by delivered rank.';
comment on table public.asg_events is 'Append-only ASG state history. Re-evaluation adds events and determinations rather than rewriting prior standing.';
