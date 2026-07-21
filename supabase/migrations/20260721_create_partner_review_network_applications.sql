-- TA-14 Partner Review Network application foundation
-- Creates applicant-scoped application records, attachment metadata,
-- reviewer determinations, correction history, and row-level security.

begin;

create extension if not exists pgcrypto;

create or replace function public.ta14_set_updated_at()
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

create table if not exists public.partner_review_network_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_user_id uuid not null references auth.users(id) on delete cascade,

  application_number text generated always as (
    'PRN-' || upper(substr(replace(id::text, '-', ''), 1, 12))
  ) stored,

  status text not null default 'draft'
    check (
      status in (
        'draft',
        'ready_for_payment',
        'payment_pending',
        'submitted',
        'under_review',
        'correction_requested',
        'determined',
        'withdrawn'
      )
    ),

  qualification_outcome text
    check (
      qualification_outcome is null
      or qualification_outcome in (
        'qualified',
        'qualified_with_conditions',
        'deferred',
        'not_qualified'
      )
    ),

  payment_status text not null default 'not_started'
    check (
      payment_status in (
        'not_started',
        'pending',
        'paid',
        'failed',
        'refunded',
        'waived'
      )
    ),

  payment_amount_cents integer not null default 45000
    check (payment_amount_cents >= 0),

  payment_currency text not null default 'usd'
    check (char_length(payment_currency) = 3),

  payment_provider text,
  payment_reference text,
  paid_at timestamptz,

  organization_name text,
  organization_website text,
  contact_name text,
  contact_role text,
  contact_email text,
  contact_phone text,
  jurisdiction text,
  years_operating integer
    check (years_operating is null or years_operating >= 0),

  primary_review_domain text,
  secondary_review_domains text[] not null default '{}',
  governance_summary text,
  desired_review_lane text,
  representative_work text,

  governance_method text,
  evidence_qualification_method text,
  uncertainty_handling text,
  escalation_practice text,

  reviewer_authority_boundary text,
  conflict_disclosures text,
  additional_context text,

  acknowledgement_accuracy boolean not null default false,
  acknowledgement_adverse_outcome boolean not null default false,
  acknowledgement_payment_not_acceptance boolean not null default false,
  acknowledgement_bounded_authority boolean not null default false,

  submitted_at timestamptz,
  withdrawn_at timestamptz,

  assigned_reviewer_user_id uuid references auth.users(id) on delete set null,
  review_started_at timestamptz,
  determination_completed_at timestamptz,

  current_determination_summary text,
  current_conditions text,
  current_evidence_boundary text,
  current_correction_requirements text,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint partner_review_network_submission_requirements
    check (
      status not in ('submitted', 'under_review', 'correction_requested', 'determined')
      or (
        organization_name is not null
        and btrim(organization_name) <> ''
        and contact_name is not null
        and btrim(contact_name) <> ''
        and contact_email is not null
        and btrim(contact_email) <> ''
        and primary_review_domain is not null
        and btrim(primary_review_domain) <> ''
        and governance_method is not null
        and btrim(governance_method) <> ''
        and evidence_qualification_method is not null
        and btrim(evidence_qualification_method) <> ''
        and reviewer_authority_boundary is not null
        and btrim(reviewer_authority_boundary) <> ''
        and acknowledgement_accuracy
        and acknowledgement_adverse_outcome
        and acknowledgement_payment_not_acceptance
        and acknowledgement_bounded_authority
        and submitted_at is not null
      )
    ),

  constraint partner_review_network_determination_requirements
    check (
      status <> 'determined'
      or (
        qualification_outcome is not null
        and determination_completed_at is not null
        and current_determination_summary is not null
        and btrim(current_determination_summary) <> ''
        and current_evidence_boundary is not null
        and btrim(current_evidence_boundary) <> ''
      )
    )
);

create index if not exists partner_review_network_applications_applicant_idx
  on public.partner_review_network_applications (applicant_user_id, created_at desc);

create index if not exists partner_review_network_applications_status_idx
  on public.partner_review_network_applications (status, created_at asc);

create index if not exists partner_review_network_applications_reviewer_idx
  on public.partner_review_network_applications (assigned_reviewer_user_id, status, created_at asc);

create unique index if not exists partner_review_network_applications_payment_reference_idx
  on public.partner_review_network_applications (payment_provider, payment_reference)
  where payment_reference is not null;

drop trigger if exists partner_review_network_applications_set_updated_at
  on public.partner_review_network_applications;

create trigger partner_review_network_applications_set_updated_at
before update on public.partner_review_network_applications
for each row
execute function public.ta14_set_updated_at();

create table if not exists public.partner_review_network_attachments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null
    references public.partner_review_network_applications(id)
    on delete cascade,
  applicant_user_id uuid not null
    references auth.users(id)
    on delete cascade,

  storage_bucket text not null default 'partner-review-network-private',
  storage_path text not null,
  original_filename text not null,
  mime_type text,
  size_bytes bigint not null check (size_bytes >= 0),
  sha256_hex text
    check (
      sha256_hex is null
      or sha256_hex ~ '^[0-9a-fA-F]{64}$'
    ),

  upload_status text not null default 'pending'
    check (upload_status in ('pending', 'uploaded', 'verified', 'rejected', 'removed')),

  rejection_reason text,
  uploaded_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  unique (application_id, storage_path)
);

create index if not exists partner_review_network_attachments_application_idx
  on public.partner_review_network_attachments (application_id, created_at asc);

drop trigger if exists partner_review_network_attachments_set_updated_at
  on public.partner_review_network_attachments;

create trigger partner_review_network_attachments_set_updated_at
before update on public.partner_review_network_attachments
for each row
execute function public.ta14_set_updated_at();

create table if not exists public.partner_review_network_review_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null
    references public.partner_review_network_applications(id)
    on delete cascade,

  event_type text not null
    check (
      event_type in (
        'submitted',
        'review_started',
        'evidence_reviewed',
        'correction_requested',
        'correction_received',
        'status_changed',
        'determination_recorded',
        'payment_recorded',
        'application_withdrawn',
        'administrative_note'
      )
    ),

  actor_user_id uuid references auth.users(id) on delete set null,
  previous_status text,
  new_status text,
  qualification_outcome text
    check (
      qualification_outcome is null
      or qualification_outcome in (
        'qualified',
        'qualified_with_conditions',
        'deferred',
        'not_qualified'
      )
    ),

  summary text not null,
  evidence_boundary text,
  conditions text,
  correction_requirements text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists partner_review_network_review_events_application_idx
  on public.partner_review_network_review_events (application_id, created_at asc);

alter table public.partner_review_network_applications enable row level security;
alter table public.partner_review_network_attachments enable row level security;
alter table public.partner_review_network_review_events enable row level security;

drop policy if exists "Applicants can read their own PRN applications"
  on public.partner_review_network_applications;

create policy "Applicants can read their own PRN applications"
on public.partner_review_network_applications
for select
to authenticated
using (applicant_user_id = auth.uid());

drop policy if exists "Applicants can create their own PRN applications"
  on public.partner_review_network_applications;

create policy "Applicants can create their own PRN applications"
on public.partner_review_network_applications
for insert
to authenticated
with check (
  applicant_user_id = auth.uid()
  and status in ('draft', 'ready_for_payment', 'payment_pending')
  and qualification_outcome is null
  and assigned_reviewer_user_id is null
  and determination_completed_at is null
);

drop policy if exists "Applicants can update editable PRN applications"
  on public.partner_review_network_applications;

create policy "Applicants can update editable PRN applications"
on public.partner_review_network_applications
for update
to authenticated
using (
  applicant_user_id = auth.uid()
  and status in ('draft', 'ready_for_payment', 'payment_pending', 'correction_requested')
)
with check (
  applicant_user_id = auth.uid()
  and status in ('draft', 'ready_for_payment', 'payment_pending', 'submitted', 'correction_requested', 'withdrawn')
  and qualification_outcome is null
  and assigned_reviewer_user_id is null
  and determination_completed_at is null
);

drop policy if exists "Applicants can read their own PRN attachments"
  on public.partner_review_network_attachments;

create policy "Applicants can read their own PRN attachments"
on public.partner_review_network_attachments
for select
to authenticated
using (applicant_user_id = auth.uid());

drop policy if exists "Applicants can create attachments for editable PRN applications"
  on public.partner_review_network_attachments;

create policy "Applicants can create attachments for editable PRN applications"
on public.partner_review_network_attachments
for insert
to authenticated
with check (
  applicant_user_id = auth.uid()
  and exists (
    select 1
    from public.partner_review_network_applications application
    where application.id = application_id
      and application.applicant_user_id = auth.uid()
      and application.status in ('draft', 'ready_for_payment', 'payment_pending', 'correction_requested')
  )
);

drop policy if exists "Applicants can update attachments for editable PRN applications"
  on public.partner_review_network_attachments;

create policy "Applicants can update attachments for editable PRN applications"
on public.partner_review_network_attachments
for update
to authenticated
using (
  applicant_user_id = auth.uid()
  and exists (
    select 1
    from public.partner_review_network_applications application
    where application.id = application_id
      and application.applicant_user_id = auth.uid()
      and application.status in ('draft', 'ready_for_payment', 'payment_pending', 'correction_requested')
  )
)
with check (
  applicant_user_id = auth.uid()
  and exists (
    select 1
    from public.partner_review_network_applications application
    where application.id = application_id
      and application.applicant_user_id = auth.uid()
      and application.status in ('draft', 'ready_for_payment', 'payment_pending', 'correction_requested')
  )
);

drop policy if exists "Applicants can remove attachments from editable PRN applications"
  on public.partner_review_network_attachments;

create policy "Applicants can remove attachments from editable PRN applications"
on public.partner_review_network_attachments
for delete
to authenticated
using (
  applicant_user_id = auth.uid()
  and exists (
    select 1
    from public.partner_review_network_applications application
    where application.id = application_id
      and application.applicant_user_id = auth.uid()
      and application.status in ('draft', 'ready_for_payment', 'payment_pending', 'correction_requested')
  )
);

drop policy if exists "Applicants can read their own PRN review history"
  on public.partner_review_network_review_events;

create policy "Applicants can read their own PRN review history"
on public.partner_review_network_review_events
for select
to authenticated
using (
  exists (
    select 1
    from public.partner_review_network_applications application
    where application.id = application_id
      and application.applicant_user_id = auth.uid()
  )
);

comment on table public.partner_review_network_applications is
  'TA-14 Partner Review Network applicant records, payment state, review assignment, and current qualification determination.';

comment on table public.partner_review_network_attachments is
  'Metadata for private supporting materials associated with a Partner Review Network application.';

comment on table public.partner_review_network_review_events is
  'Append-oriented review, correction, payment, status, and determination history for a Partner Review Network application.';

comment on column public.partner_review_network_applications.payment_status is
  'Payment purchases the qualification review only and never guarantees acceptance or a favorable outcome.';

commit;
