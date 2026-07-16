-- TA-14 Exchange MVP initial PostgreSQL schema
create extension if not exists pgcrypto;

create type route_decision as enum ('ALLOW','HOLD','DENY','ESCALATE');
create type route_boundary as enum ('self_declared','mapped','reviewable','verified','continuously_verified');
create type registry_status as enum ('draft','self_declared','reviewable','verified','continuously_verified','under_review','suspended','expired','revoked');

create table organizations (
  org_id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  display_name text not null,
  owner_user_id uuid not null,
  identity_level text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table organization_members (
  org_id uuid not null references organizations(org_id),
  user_id uuid not null,
  role text not null check (role in ('owner','admin','builder','viewer')),
  revoked_at timestamptz,
  primary key (org_id,user_id)
);

create table systems (
  system_id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  org_id uuid not null references organizations(org_id),
  name text not null,
  intended_purpose text not null,
  current_version text not null,
  environment text not null,
  created_at timestamptz not null default now()
);

create table routes (
  route_id uuid primary key default gen_random_uuid(),
  public_rid text not null unique,
  system_id uuid not null references systems(system_id),
  purpose text not null,
  visibility text not null default 'private',
  current_version_id uuid,
  created_at timestamptz not null default now()
);

create table route_versions (
  route_version_id uuid primary key default gen_random_uuid(),
  route_id uuid not null references routes(route_id),
  version_no integer not null check (version_no > 0),
  policy_version text not null,
  content jsonb not null,
  content_hash text not null,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  unique(route_id,version_no),
  unique(route_id,content_hash)
);
alter table routes add constraint routes_current_version_fk foreign key (current_version_id) references route_versions(route_version_id);

create table evidence_objects (
  evidence_id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  org_id uuid not null references organizations(org_id),
  source text not null,
  evidence_type text not null,
  classification text not null,
  content_hash text not null,
  captured_at timestamptz not null,
  validity_state text not null,
  object_key text,
  retention_state text not null default 'active',
  created_at timestamptz not null default now()
);

create table authority_records (
  authority_id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  route_version_id uuid not null references route_versions(route_version_id),
  issuer text not null,
  role text not null,
  scope text not null,
  effective_at timestamptz not null,
  expires_at timestamptz not null,
  revocation_state text not null,
  bound_actor text,
  bound_action text not null,
  created_at timestamptz not null default now()
);

create table test_runs (
  test_run_id uuid primary key default gen_random_uuid(),
  route_version_id uuid not null references route_versions(route_version_id),
  policy_version text not null,
  decision route_decision not null,
  input_hash text not null,
  replay_key text not null unique,
  created_at timestamptz not null default now()
);

create table test_receipts (
  receipt_id uuid primary key default gen_random_uuid(),
  test_run_id uuid not null references test_runs(test_run_id),
  requirement_id text not null,
  result text not null,
  reason text not null,
  evidence_ids jsonb not null default '[]'::jsonb,
  receipt_hash text not null,
  signature_key_id text,
  signature text,
  created_at timestamptz not null default now()
);

create table aer_records (
  aer_id uuid primary key default gen_random_uuid(),
  route_version_id uuid not null references route_versions(route_version_id),
  test_run_id uuid not null references test_runs(test_run_id),
  boundary route_boundary not null,
  manifest_hash text not null,
  json_object_key text,
  pdf_object_key text,
  created_at timestamptz not null default now()
);

create table payments (
  payment_id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(org_id),
  provider text not null,
  provider_event_id text not null unique,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null,
  state text not null,
  created_at timestamptz not null default now()
);

create table entitlements (
  entitlement_id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(org_id),
  payment_id uuid references payments(payment_id),
  entitlement_type text not null,
  route_id uuid references routes(route_id),
  activated_at timestamptz not null default now(),
  ended_at timestamptz,
  unique(payment_id, entitlement_type)
);

create table registry_events (
  registry_event_id uuid primary key default gen_random_uuid(),
  route_id uuid not null references routes(route_id),
  event_type text not null,
  status registry_status not null,
  payload jsonb not null,
  payload_hash text not null,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table audit_events (
  audit_event_id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations(org_id),
  actor_id uuid,
  action text not null,
  object_type text not null,
  object_id text not null,
  before_hash text,
  after_hash text,
  ip_context inet,
  device_context text,
  created_at timestamptz not null default now()
);

-- Immutable records: updates/deletes must be denied by application role.
create or replace function prevent_mutation() returns trigger language plpgsql as $$
begin
  raise exception 'append-only table: mutation prohibited';
end $$;

create trigger no_update_route_versions before update or delete on route_versions for each row execute function prevent_mutation();
create trigger no_update_test_runs before update or delete on test_runs for each row execute function prevent_mutation();
create trigger no_update_test_receipts before update or delete on test_receipts for each row execute function prevent_mutation();
create trigger no_update_registry_events before update or delete on registry_events for each row execute function prevent_mutation();

-- Row-level security foundation. Production policies bind app.user_id/app.org_id session claims.
alter table organizations enable row level security;
alter table systems enable row level security;
alter table routes enable row level security;
alter table route_versions enable row level security;
alter table evidence_objects enable row level security;
