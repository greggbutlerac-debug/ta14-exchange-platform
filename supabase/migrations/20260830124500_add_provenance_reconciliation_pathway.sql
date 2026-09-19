create extension if not exists pgcrypto;

create table if not exists public.ta14_provenance_cases (
  id uuid primary key default gen_random_uuid(),
  case_identifier text unique not null default ('PR-' || to_char(now(), 'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  owner_user_id uuid not null references auth.users(id) on delete restrict,
  claimant_registry_submission_id uuid not null,
  claimant_registry_identifier text not null,
  claimant_governance_name text not null,
  target_name text not null,
  target_registry_identifier text,
  target_is_registered boolean not null default false,
  target_contact text,
  concern_summary text not null,
  disputed_propositions text,
  requested_resolution text,
  status text not null default 'INTAKE' check (status in ('INTAKE','EVIDENCE_GATHERING','NOTICE_PREPARATION','PARTICIPANT_RESPONSE','RECONCILIATION','FINDING_DRAFT','FROZEN','CLOSED','HOLD')),
  evidence_boundary text not null default 'No attribution by similarity, exposure, or timing alone.',
  public_visibility text not null default 'PRIVATE' check (public_visibility in ('PRIVATE','PARTICIPANT','PUBLIC_AFTER_FREEZE')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ta14_provenance_parties (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.ta14_provenance_cases(id) on delete cascade,
  party_role text not null check (party_role in ('CLAIMANT','TARGET','CONTRIBUTOR','REVIEWER','OTHER')),
  organization_name text not null,
  architecture_name text,
  registry_identifier text,
  registered_on_exchange boolean not null default false,
  contact_name text,
  contact_route text,
  participation_status text not null default 'UNNOTIFIED' check (participation_status in ('UNNOTIFIED','NOTICE_PREPARED','NOTIFIED','RESPONDED','DECLINED','PARTICIPATING','EXTERNAL_ONLY')),
  created_at timestamptz not null default now()
);

create table if not exists public.ta14_provenance_evidence (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.ta14_provenance_cases(id) on delete cascade,
  submitted_by_user_id uuid references auth.users(id) on delete set null,
  submitting_party_id uuid references public.ta14_provenance_parties(id) on delete set null,
  evidence_type text not null default 'DOCUMENT',
  title text not null,
  description text,
  event_date timestamptz,
  source_url text,
  storage_path text,
  sha256 text,
  original_filename text,
  mime_type text,
  byte_size bigint,
  evidence_status text not null default 'SUBMITTED' check (evidence_status in ('SUBMITTED','PRIMARY','CORROBORATED','CHALLENGED','SUPERSEDED','EXCLUDED','PRESERVED')),
  created_at timestamptz not null default now()
);

create table if not exists public.ta14_provenance_propositions (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.ta14_provenance_cases(id) on delete cascade,
  proposition_code text not null,
  proposition_text text not null,
  antecedence_status text not null default 'OPEN',
  exposure_status text not null default 'OPEN',
  successor_change_status text not null default 'OPEN',
  causation_status text not null default 'OPEN',
  classification text not null default 'OPEN',
  limitation text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(case_id, proposition_code)
);

create table if not exists public.ta14_provenance_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.ta14_provenance_cases(id) on delete cascade,
  event_type text not null,
  actor_label text not null,
  event_summary text not null,
  event_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.ta14_provenance_cases enable row level security;
alter table public.ta14_provenance_parties enable row level security;
alter table public.ta14_provenance_evidence enable row level security;
alter table public.ta14_provenance_propositions enable row level security;
alter table public.ta14_provenance_events enable row level security;

grant select, insert on public.ta14_provenance_cases to authenticated;
grant select on public.ta14_provenance_parties to authenticated;
grant select on public.ta14_provenance_evidence to authenticated;
grant select on public.ta14_provenance_propositions to authenticated;
grant select on public.ta14_provenance_events to authenticated;

create policy "claimant can read own provenance cases" on public.ta14_provenance_cases
  for select to authenticated using (owner_user_id = auth.uid());

create policy "claimant can open provenance case" on public.ta14_provenance_cases
  for insert to authenticated with check (owner_user_id = auth.uid());

create policy "claimant can read case parties" on public.ta14_provenance_parties
  for select to authenticated using (exists (select 1 from public.ta14_provenance_cases c where c.id = case_id and c.owner_user_id = auth.uid()));

create policy "claimant can read case evidence" on public.ta14_provenance_evidence
  for select to authenticated using (exists (select 1 from public.ta14_provenance_cases c where c.id = case_id and c.owner_user_id = auth.uid()));

create policy "claimant can read case propositions" on public.ta14_provenance_propositions
  for select to authenticated using (exists (select 1 from public.ta14_provenance_cases c where c.id = case_id and c.owner_user_id = auth.uid()));

create policy "claimant can read case events" on public.ta14_provenance_events
  for select to authenticated using (exists (select 1 from public.ta14_provenance_cases c where c.id = case_id and c.owner_user_id = auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit)
values ('provenance-evidence', 'provenance-evidence', false, 52428800)
on conflict (id) do nothing;

-- Storage writes are performed only by the authenticated TA-14 server route after
-- registry-standing and case-ownership checks. The bucket remains private.
