# Object Impact — 20260826170500_add_consequence_verification_admissibility.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Purpose
Adds an explicit pre-verification admissibility layer for independent verification/replay. A verifier must have preserved standing, independence, accepted scope, and replay boundary before a verification can be admitted through the v2 recording path.

## Table created
### public.consequence_verification_admissibility
Stores one verifier-admissibility record per run/verifier pair, including:
- verifier identity and organization
- standing basis
- independence declaration
- accepted verification scope
- exact replay boundary
- source run hash
- source examination seal identity/hash when present
- ADMISSIBLE / PARTIALLY_ADMISSIBLE / INADMISSIBLE / INDETERMINATE determination
- limitations
- canonical evidence body + TA14-CES-v1 SHA-256

RLS is enabled. No anon/authenticated table privileges are granted.

## Index created
- consequence_verification_admissibility_run_verifier_uq — unique(run_id, verifier_user_id)

## Functions created/replaced
### public.consequence_record_verification_admissibility(...)
- Requires a sealed source examination run.
- Refuses the original bound examination operator as the independent verifier.
- Cryptographically verifies the admissibility evidence body under TA14-CES-v1 before insertion.
- Captures the source run and seal hashes.
- Appends VERIFIER_ADMISSIBILITY to examination chronology.

### public.consequence_record_independent_verification_v2(...)
- Requires an existing verifier-admissibility record.
- Requires same run and same verifier identity.
- Permits verification recording only when admissibility is ADMISSIBLE or PARTIALLY_ADMISSIBLE.
- Delegates final evidence recording to the existing independent-verification function.

## Existing objects written, not structurally modified
- public.consequence_examination_chronology
- public.consequence_independent_verifications (through existing controlled function)

## Existing objects read, not structurally modified
- public.consequence_examination_runs
- public.consequence_examination_seals

## Registry impact
None. Existing Registry record/version references are carried into chronology only. No Registry identity, submission, readiness, review, finalization, or version row is created or modified.

## Security
Table access and function execution revoked from PUBLIC, anon, authenticated. Controlled functions granted only to service_role.

## Semantic boundary
An admissible verifier is not thereby correct, and an independent verification does not become a new source determination. This layer establishes whether the verification evidence is eligible to be considered as separately attributable verification evidence; it cannot retrospectively modify the original examination, finding, seal, receipt, or Registry identity.
