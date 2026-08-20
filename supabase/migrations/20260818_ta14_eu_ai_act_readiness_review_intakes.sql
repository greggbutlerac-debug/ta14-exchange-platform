create table if not exists public.ta14_eu_ai_act_readiness_review_intakes (
  id uuid primary key default gen_random_uuid(),
  intake_id text not null unique,
  service_type text not null default 'EU_AI_ACT_READINESS',
  status text not null default 'submitted' check (status in ('submitted','triage','accepted','held','declined','completed','withdrawn')),
  urgency text not null default 'STANDARD' check (urgency in ('STANDARD','PRIORITY','CRITICAL')),

  organization_name text not null,
  contact_name text not null,
  contact_email text not null,
  system_name text not null,
  system_public_url text,

  declared_role text,
  intended_purpose text not null,
  eu_exposure text not null,
  current_classification text,
  possible_risk_path text,

  requested_outcome text not null,
  evidence_summary text not null,
  evidence_links text,
  known_gaps text,
  material_changes text,
  additional_context text,

  source_page text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  metadata jsonb not null default '{}'::jsonb,

  limitation_acknowledged boolean not null default false,
  accuracy_acknowledged boolean not null default false,

  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.ta14_eu_ai_act_readiness_review_intakes is
  'Persistent intake records for the fixed-scope $750 TA-14 EU AI Act Governed Readiness Review. Submission does not itself create certification, legal advice, conformity assessment, regulatory approval, or a favorable finding.';

create index if not exists ta14_eu_ai_act_readiness_review_intakes_status_created_idx
  on public.ta14_eu_ai_act_readiness_review_intakes (status, created_at desc);

create index if not exists ta14_eu_ai_act_readiness_review_intakes_email_idx
  on public.ta14_eu_ai_act_readiness_review_intakes (lower(contact_email));

alter table public.ta14_eu_ai_act_readiness_review_intakes enable row level security;

revoke all on table public.ta14_eu_ai_act_readiness_review_intakes from anon, authenticated;
