# Object Impact — 20260826145500_bind_consequence_examinations_to_registry_versions.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Domain boundary
This migration is limited to the TA-14 Consequence Examination Engine. It does not alter the 14-step Registry submission, readiness, review, or finalization architecture. Registry tables are referenced only as authoritative foreign-key targets/read sources.

## Tables modified

### public.consequence_technical_freezes
Adds:
- registry_record_id uuid
- registry_version_record_id uuid

Adds foreign keys:
- consequence_technical_freezes_registry_record_id_fkey -> public.ta14_registry_public_records(id), ON DELETE RESTRICT
- consequence_technical_freezes_registry_version_record_id_fkey -> public.ta14_registry_version_records(id), ON DELETE RESTRICT

Adds check constraint:
- issued_freeze_requires_registry_binding
  - A row whose status is TECHNICAL_FREEZE_ISSUED must contain both Registry bindings.

Adds indexes:
- consequence_technical_freezes_registry_record_idx
- consequence_technical_freezes_registry_version_idx

Adds trigger:
- validate_consequence_freeze_registry_binding

### public.consequence_examination_runs
Adds:
- registry_record_id uuid
- registry_version_record_id uuid

Adds foreign keys:
- consequence_examination_runs_registry_record_id_fkey -> public.ta14_registry_public_records(id), ON DELETE RESTRICT
- consequence_examination_runs_registry_version_record_id_fkey -> public.ta14_registry_version_records(id), ON DELETE RESTRICT

Adds indexes:
- consequence_examination_runs_registry_record_idx
- consequence_examination_runs_registry_version_idx

Adds trigger:
- enforce_consequence_run_registry_binding

## Functions created/replaced

### public.validate_consequence_freeze_registry_binding()
Trigger function. It:
- rejects half-bound Registry identity/version pairs;
- requires an existing registered architecture for an issued Technical Freeze;
- requires an existing Registry version record;
- requires the version record's registry_identifier to equal the architecture registry_identifier;
- requires the version label to equal the registered architecture's bound version;
- does not create or update Registry identity.

EXECUTE is revoked from PUBLIC, anon, and authenticated. It is invoked only as a table trigger.

### public.enforce_consequence_run_registry_binding()
Trigger function. It:
- requires the run's record_id + freeze_sha256 to resolve to an issued Technical Freeze;
- requires that freeze to already carry Registry architecture/version bindings;
- copies those bindings into a new run when omitted;
- rejects any run attempting to bind to a different Registry architecture/version than its freeze;
- derives governance_registry_identifier as a compatibility/display field from the authoritative Registry record.

EXECUTE is revoked from PUBLIC, anon, and authenticated. It is invoked only as a table trigger.

## Registry objects referenced but NOT modified
- public.ta14_registry_public_records
- public.ta14_registry_version_records

No columns, constraints, policies, triggers, functions, rows, submission steps, readiness rules, review rules, finalization rules, or Registry identifiers are changed by this migration.

## Objects NOT created or modified
- consequence_examination_definitions
- consequence_examination_events
- Registry submission tables
- Registry readiness/finalization functions
- Registry version series or lineage
- public receipt RPCs
- sealed examination chronology RPCs
- storage buckets
- auth objects

## Identity rule established
Registry identity remains authoritative in the existing Registry. The Consequence Examination Engine stores foreign-key bindings to that identity/version and never recreates it.
