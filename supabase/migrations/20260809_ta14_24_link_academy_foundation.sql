-- TA-14 24-Link Academy + Exchange persistence foundation
-- Date: 2026-08-09
--
-- Purpose:
--   Persist governed Route State sessions, Chain Passport mastery,
--   Build-a-Chain / Architecture Health maps, and simulator attempts.
--
-- Architectural boundary:
--   These records support learning, review, evidence mapping, replay,
--   and future credential workflows. They do not by themselves constitute
--   certification, legal determination, production validation, endorsement,
--   or authorization to execute.

create extension if not exists pgcrypto;

create or replace function public.ta14_academy_set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.ta14_academy_prevent_mutation()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  raise exception 'TA-14 Academy lifecycle records are append-only.';
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. Route State
-- ---------------------------------------------------------------------------

create table if not exists public.ta14_academy_route_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  title text not null default 'TA-14 Route State Session',
  subject_type text not null default 'governed_system',
  subject_name text not null,
  declared_scope text,

  current_link_id text not null,
  last_admissible_link_id text,
  first_broken_link_id text,

  decision text not null default 'HOLD',
  reason text,
  required_recovery text,
  forming_consequence text,

  status text not null default 'draft',
  route_context jsonb not null default '{}'::jsonb,

  completed_at timestamptz,
  archived_at timestamptz,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ta14_route_current_link_check
    check (current_link_id ~ '^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$'),

  constraint ta14_route_last_admissible_link_check
    check (
      last_admissible_link_id is null
      or last_admissible_link_id ~ '^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$'
    ),

  constraint ta14_route_first_broken_link_check
    check (
      first_broken_link_id is null
      or first_broken_link_id ~ '^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$'
    ),

  constraint ta14_route_decision_check
    check (
      decision in (
        'CONTINUE',
        'NARROW',
        'HOLD',
        'REFUSE',
        'ESCALATE'
      )
    ),

  constraint ta14_route_status_check
    check (status in ('draft', 'active', 'completed', 'archived'))
);

drop trigger if exists ta14_academy_route_sessions_updated_at
  on public.ta14_academy_route_sessions;

create trigger ta14_academy_route_sessions_updated_at
before update on public.ta14_academy_route_sessions
for each row
execute function public.ta14_academy_set_updated_at();

create index if not exists ta14_academy_route_sessions_owner_idx
  on public.ta14_academy_route_sessions(owner_user_id, updated_at desc);

create index if not exists ta14_academy_route_sessions_state_idx
  on public.ta14_academy_route_sessions(
    current_link_id,
    first_broken_link_id,
    decision
  );

create table if not exists public.ta14_academy_route_events (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null
    references public.ta14_academy_route_sessions(id)
    on delete cascade,

  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  event_summary text not null,

  previous_state jsonb not null default '{}'::jsonb,
  resulting_state jsonb not null default '{}'::jsonb,
  event_payload jsonb not null default '{}'::jsonb,

  occurred_at timestamptz not null default timezone('utc', now())
);

create index if not exists ta14_academy_route_events_session_idx
  on public.ta14_academy_route_events(session_id, occurred_at, id);

drop trigger if exists ta14_academy_route_events_immutable
  on public.ta14_academy_route_events;

create trigger ta14_academy_route_events_immutable
before update or delete on public.ta14_academy_route_events
for each row
execute function public.ta14_academy_prevent_mutation();

-- ---------------------------------------------------------------------------
-- 2. Chain Passport
-- ---------------------------------------------------------------------------

create table if not exists public.ta14_academy_passports (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  passport_key text not null default 'primary',
  title text not null default 'TA-14 24-Link Chain Passport',
  status text not null default 'active',

  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  archived_at timestamptz,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ta14_academy_passport_status_check
    check (status in ('active', 'completed', 'archived')),

  unique (owner_user_id, passport_key)
);

drop trigger if exists ta14_academy_passports_updated_at
  on public.ta14_academy_passports;

create trigger ta14_academy_passports_updated_at
before update on public.ta14_academy_passports
for each row
execute function public.ta14_academy_set_updated_at();

create table if not exists public.ta14_academy_passport_links (
  id uuid primary key default gen_random_uuid(),
  passport_id uuid not null
    references public.ta14_academy_passports(id)
    on delete cascade,

  link_id text not null,
  mastery_stage text not null default 'NOT STARTED',

  evidence_summary text,
  evidence_references jsonb not null default '[]'::jsonb,
  assessment_notes text,

  demonstrated_at timestamptz,
  verified_at timestamptz,
  verified_by_user_id uuid references auth.users(id) on delete set null,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ta14_passport_link_id_check
    check (link_id ~ '^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$'),

  constraint ta14_passport_mastery_stage_check
    check (
      mastery_stage in (
        'NOT STARTED',
        'RECOGNIZED',
        'EXPLAINED',
        'EVIDENCE-MAPPED',
        'DIAGNOSED',
        'APPLIED',
        'REPLAYED',
        'MASTERED'
      )
    ),

  unique (passport_id, link_id)
);

drop trigger if exists ta14_academy_passport_links_updated_at
  on public.ta14_academy_passport_links;

create trigger ta14_academy_passport_links_updated_at
before update on public.ta14_academy_passport_links
for each row
execute function public.ta14_academy_set_updated_at();

create index if not exists ta14_academy_passport_links_passport_idx
  on public.ta14_academy_passport_links(passport_id, link_id);

-- ---------------------------------------------------------------------------
-- 3. Build-a-Chain + Architecture Health
-- ---------------------------------------------------------------------------

create table if not exists public.ta14_academy_chain_maps (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  subject_name text not null,
  subject_type text not null default 'governed_system',
  declared_scope text,
  version_label text,

  registry_submission_id uuid
    references public.ai_governance_registry_submissions(id)
    on delete set null,

  status text not null default 'draft',
  map_context jsonb not null default '{}'::jsonb,

  completed_at timestamptz,
  archived_at timestamptz,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ta14_chain_map_status_check
    check (status in ('draft', 'active', 'completed', 'archived'))
);

drop trigger if exists ta14_academy_chain_maps_updated_at
  on public.ta14_academy_chain_maps;

create trigger ta14_academy_chain_maps_updated_at
before update on public.ta14_academy_chain_maps
for each row
execute function public.ta14_academy_set_updated_at();

create index if not exists ta14_academy_chain_maps_owner_idx
  on public.ta14_academy_chain_maps(owner_user_id, updated_at desc);

create index if not exists ta14_academy_chain_maps_registry_idx
  on public.ta14_academy_chain_maps(registry_submission_id)
  where registry_submission_id is not null;

create table if not exists public.ta14_academy_chain_map_links (
  id uuid primary key default gen_random_uuid(),
  chain_map_id uuid not null
    references public.ta14_academy_chain_maps(id)
    on delete cascade,

  link_id text not null,
  evidence_state text not null default 'untested',

  supporting_artifact_reference text,
  evidence_references jsonb not null default '[]'::jsonb,
  assessment_note text,

  review_scope text,
  version_state text,
  challenge_state text,
  visibility text not null default 'public',

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint ta14_chain_map_link_id_check
    check (link_id ~ '^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$'),

  constraint ta14_chain_map_evidence_state_check
    check (
      evidence_state in (
        'supported',
        'partial',
        'held',
        'challenged',
        'untested',
        'outside_scope'
      )
    ),

  constraint ta14_chain_map_visibility_check
    check (visibility in ('public', 'private', 'mixed')),

  unique (chain_map_id, link_id)
);

drop trigger if exists ta14_academy_chain_map_links_updated_at
  on public.ta14_academy_chain_map_links;

create trigger ta14_academy_chain_map_links_updated_at
before update on public.ta14_academy_chain_map_links
for each row
execute function public.ta14_academy_set_updated_at();

create index if not exists ta14_academy_chain_map_links_map_idx
  on public.ta14_academy_chain_map_links(chain_map_id, link_id);

create index if not exists ta14_academy_chain_map_links_state_idx
  on public.ta14_academy_chain_map_links(evidence_state, link_id);

-- ---------------------------------------------------------------------------
-- 4. Simulation Attempts
-- ---------------------------------------------------------------------------

create table if not exists public.ta14_academy_simulation_attempts (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,

  scenario_id text not null,
  scenario_version text not null default 'v1',

  selected_first_broken_link_id text,
  selected_last_admissible_link_id text,
  selected_decision text,

  expected_first_broken_link_id text,
  expected_last_admissible_link_id text,
  expected_decision text,

  route_preservation_score integer not null default 0,
  result_state text not null default 'submitted',

  attempt_payload jsonb not null default '{}'::jsonb,

  completed_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),

  constraint ta14_simulation_selected_first_broken_check
    check (
      selected_first_broken_link_id is null
      or selected_first_broken_link_id
        ~ '^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$'
    ),

  constraint ta14_simulation_selected_last_admissible_check
    check (
      selected_last_admissible_link_id is null
      or selected_last_admissible_link_id
        ~ '^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$'
    ),

  constraint ta14_simulation_expected_first_broken_check
    check (
      expected_first_broken_link_id is null
      or expected_first_broken_link_id
        ~ '^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$'
    ),

  constraint ta14_simulation_expected_last_admissible_check
    check (
      expected_last_admissible_link_id is null
      or expected_last_admissible_link_id
        ~ '^TA14-LINK-(0[1-9]|1[0-9]|2[0-4])$'
    ),

  constraint ta14_simulation_selected_decision_check
    check (
      selected_decision is null
      or selected_decision in (
        'CONTINUE',
        'NARROW',
        'HOLD',
        'REFUSE',
        'ESCALATE'
      )
    ),

  constraint ta14_simulation_expected_decision_check
    check (
      expected_decision is null
      or expected_decision in (
        'CONTINUE',
        'NARROW',
        'HOLD',
        'REFUSE',
        'ESCALATE'
      )
    ),

  constraint ta14_simulation_score_check
    check (route_preservation_score between 0 and 100),

  constraint ta14_simulation_result_state_check
    check (
      result_state in (
        'submitted',
        'route_preserved',
        'reassess',
        'voided'
      )
    )
);

create index if not exists ta14_academy_simulation_attempts_owner_idx
  on public.ta14_academy_simulation_attempts(
    owner_user_id,
    completed_at desc
  );

create index if not exists ta14_academy_simulation_attempts_scenario_idx
  on public.ta14_academy_simulation_attempts(
    scenario_id,
    scenario_version
  );

-- ---------------------------------------------------------------------------
-- 5. Row-Level Security
-- ---------------------------------------------------------------------------

alter table public.ta14_academy_route_sessions enable row level security;
alter table public.ta14_academy_route_events enable row level security;
alter table public.ta14_academy_passports enable row level security;
alter table public.ta14_academy_passport_links enable row level security;
alter table public.ta14_academy_chain_maps enable row level security;
alter table public.ta14_academy_chain_map_links enable row level security;
alter table public.ta14_academy_simulation_attempts enable row level security;

-- Route sessions

drop policy if exists "Academy users can read own route sessions"
  on public.ta14_academy_route_sessions;

create policy "Academy users can read own route sessions"
  on public.ta14_academy_route_sessions
  for select
  to authenticated
  using ((select auth.uid()) = owner_user_id);

drop policy if exists "Academy users can create own route sessions"
  on public.ta14_academy_route_sessions;

create policy "Academy users can create own route sessions"
  on public.ta14_academy_route_sessions
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_user_id);

drop policy if exists "Academy users can update own route sessions"
  on public.ta14_academy_route_sessions;

create policy "Academy users can update own route sessions"
  on public.ta14_academy_route_sessions
  for update
  to authenticated
  using ((select auth.uid()) = owner_user_id)
  with check ((select auth.uid()) = owner_user_id);

drop policy if exists "Academy users can delete own draft route sessions"
  on public.ta14_academy_route_sessions;

create policy "Academy users can delete own draft route sessions"
  on public.ta14_academy_route_sessions
  for delete
  to authenticated
  using (
    (select auth.uid()) = owner_user_id
    and status = 'draft'
  );

-- Route events

drop policy if exists "Academy users can read own route events"
  on public.ta14_academy_route_events;

create policy "Academy users can read own route events"
  on public.ta14_academy_route_events
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.ta14_academy_route_sessions as sessions
      where sessions.id = session_id
        and sessions.owner_user_id = (select auth.uid())
    )
  );

drop policy if exists "Academy users can append own route events"
  on public.ta14_academy_route_events;

create policy "Academy users can append own route events"
  on public.ta14_academy_route_events
  for insert
  to authenticated
  with check (
    actor_user_id = (select auth.uid())
    and exists (
      select 1
      from public.ta14_academy_route_sessions as sessions
      where sessions.id = session_id
        and sessions.owner_user_id = (select auth.uid())
    )
  );

-- Passports

drop policy if exists "Academy users can read own passports"
  on public.ta14_academy_passports;

create policy "Academy users can read own passports"
  on public.ta14_academy_passports
  for select
  to authenticated
  using ((select auth.uid()) = owner_user_id);

drop policy if exists "Academy users can create own passports"
  on public.ta14_academy_passports;

create policy "Academy users can create own passports"
  on public.ta14_academy_passports
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_user_id);

drop policy if exists "Academy users can update own passports"
  on public.ta14_academy_passports;

create policy "Academy users can update own passports"
  on public.ta14_academy_passports
  for update
  to authenticated
  using ((select auth.uid()) = owner_user_id)
  with check ((select auth.uid()) = owner_user_id);

drop policy if exists "Academy users can read own passport links"
  on public.ta14_academy_passport_links;

create policy "Academy users can read own passport links"
  on public.ta14_academy_passport_links
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.ta14_academy_passports as passports
      where passports.id = passport_id
        and passports.owner_user_id = (select auth.uid())
    )
  );

drop policy if exists "Academy users can create own passport links"
  on public.ta14_academy_passport_links;

create policy "Academy users can create own passport links"
  on public.ta14_academy_passport_links
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.ta14_academy_passports as passports
      where passports.id = passport_id
        and passports.owner_user_id = (select auth.uid())
    )
  );

drop policy if exists "Academy users can update own passport links"
  on public.ta14_academy_passport_links;

create policy "Academy users can update own passport links"
  on public.ta14_academy_passport_links
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.ta14_academy_passports as passports
      where passports.id = passport_id
        and passports.owner_user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.ta14_academy_passports as passports
      where passports.id = passport_id
        and passports.owner_user_id = (select auth.uid())
    )
  );

-- Chain maps

drop policy if exists "Academy users can read own chain maps"
  on public.ta14_academy_chain_maps;

create policy "Academy users can read own chain maps"
  on public.ta14_academy_chain_maps
  for select
  to authenticated
  using ((select auth.uid()) = owner_user_id);

drop policy if exists "Academy users can create own chain maps"
  on public.ta14_academy_chain_maps;

create policy "Academy users can create own chain maps"
  on public.ta14_academy_chain_maps
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_user_id);

drop policy if exists "Academy users can update own chain maps"
  on public.ta14_academy_chain_maps;

create policy "Academy users can update own chain maps"
  on public.ta14_academy_chain_maps
  for update
  to authenticated
  using ((select auth.uid()) = owner_user_id)
  with check ((select auth.uid()) = owner_user_id);

drop policy if exists "Academy users can delete own draft chain maps"
  on public.ta14_academy_chain_maps;

create policy "Academy users can delete own draft chain maps"
  on public.ta14_academy_chain_maps
  for delete
  to authenticated
  using (
    (select auth.uid()) = owner_user_id
    and status = 'draft'
  );

drop policy if exists "Academy users can read own chain-map links"
  on public.ta14_academy_chain_map_links;

create policy "Academy users can read own chain-map links"
  on public.ta14_academy_chain_map_links
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.ta14_academy_chain_maps as maps
      where maps.id = chain_map_id
        and maps.owner_user_id = (select auth.uid())
    )
  );

drop policy if exists "Academy users can create own chain-map links"
  on public.ta14_academy_chain_map_links;

create policy "Academy users can create own chain-map links"
  on public.ta14_academy_chain_map_links
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.ta14_academy_chain_maps as maps
      where maps.id = chain_map_id
        and maps.owner_user_id = (select auth.uid())
    )
  );

drop policy if exists "Academy users can update own chain-map links"
  on public.ta14_academy_chain_map_links;

create policy "Academy users can update own chain-map links"
  on public.ta14_academy_chain_map_links
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.ta14_academy_chain_maps as maps
      where maps.id = chain_map_id
        and maps.owner_user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.ta14_academy_chain_maps as maps
      where maps.id = chain_map_id
        and maps.owner_user_id = (select auth.uid())
    )
  );

-- Simulation attempts

drop policy if exists "Academy users can read own simulation attempts"
  on public.ta14_academy_simulation_attempts;

create policy "Academy users can read own simulation attempts"
  on public.ta14_academy_simulation_attempts
  for select
  to authenticated
  using ((select auth.uid()) = owner_user_id);

drop policy if exists "Academy users can create own simulation attempts"
  on public.ta14_academy_simulation_attempts;

create policy "Academy users can create own simulation attempts"
  on public.ta14_academy_simulation_attempts
  for insert
  to authenticated
  with check ((select auth.uid()) = owner_user_id);

-- ---------------------------------------------------------------------------
-- 6. Privileges
-- ---------------------------------------------------------------------------

grant select, insert, update, delete
  on public.ta14_academy_route_sessions
  to authenticated;

grant select, insert
  on public.ta14_academy_route_events
  to authenticated;

grant select, insert, update
  on public.ta14_academy_passports
  to authenticated;

grant select, insert, update
  on public.ta14_academy_passport_links
  to authenticated;

grant select, insert, update, delete
  on public.ta14_academy_chain_maps
  to authenticated;

grant select, insert, update
  on public.ta14_academy_chain_map_links
  to authenticated;

grant select, insert
  on public.ta14_academy_simulation_attempts
  to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Schema comments
-- ---------------------------------------------------------------------------

comment on table public.ta14_academy_route_sessions is
  'Persistent Route State records for the TA-14 24-Link Academy.';

comment on table public.ta14_academy_route_events is
  'Append-only lifecycle events for TA-14 Route State sessions.';

comment on table public.ta14_academy_passports is
  'Learner-level TA-14 Chain Passport records.';

comment on table public.ta14_academy_passport_links is
  'Per-link mastery state and evidence for a TA-14 Chain Passport.';

comment on table public.ta14_academy_chain_maps is
  'Build-a-Chain and Architecture Health mapping records.';

comment on table public.ta14_academy_chain_map_links is
  'Per-link evidence-state coordinates for a TA-14 chain map.';

comment on table public.ta14_academy_simulation_attempts is
  'Recorded TA-14 Chain Failure Simulator attempts and route-preservation scores.';
