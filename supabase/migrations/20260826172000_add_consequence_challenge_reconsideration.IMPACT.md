# Object Impact — 20260826172000_add_consequence_challenge_reconsideration.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Governing boundary
A sealed examination, its S0-S7 events, finding, seal and receipt remain historical evidence and are not retrospectively rewritten. Challenges and reconsiderations are new attributable objects. A changed conclusion requires a separately identified superseding examination rather than mutation of the original.

## Tables created
### public.consequence_examination_challenges
Preserves challenger identity, challenge basis/scope/evidence, and exact source run/finding/seal hashes.

### public.consequence_examination_reconsiderations
Preserves reviewer attribution, reconsideration determination, rationale, limitations, source run hash and optional superseding examination linkage.

## Indexes created
- consequence_examination_challenges_run_idx
- consequence_examination_reconsiderations_run_idx

## Functions created
### public.consequence_record_challenge(...)
- Requires a SEALED source examination.
- Captures authoritative source run/finding/seal identities and hashes.
- Requires TA14-CES-v1 hash agreement for the complete logical challenge body.
- Appends CHALLENGE_SUBMITTED chronology.
- Does not modify the source examination.

### public.consequence_issue_reconsideration(...)
- Requires an unresolved challenge.
- Determinations: SUSTAINED / SUPERSEDING_EXAMINATION_REQUIRED / REJECTED / INDETERMINATE.
- SUPERSEDING_EXAMINATION_REQUIRED requires a separately existing run.
- Superseding run cannot be the source run.
- Superseding run must bind to the SAME existing Registry architecture/version UUIDs.
- Requires TA14-CES-v1 hash agreement for the complete logical reconsideration body.
- Resolves the challenge and appends RECONSIDERATION_ISSUED chronology.
- Does not rewrite the original finding/determination/seal/receipt.

## Existing table data modified
- public.consequence_examination_challenges.status: changed to RESOLVED by controlled reconsideration issuance.
- public.consequence_examination_chronology: new challenge/reconsideration events appended.

## Existing objects read but not structurally modified
- public.consequence_examination_runs
- public.consequence_examination_findings
- public.consequence_examination_seals
- public.consequence_examination_chronology
- public.consequence_verify_payload_hash_v1(jsonb,text)

## RLS / permissions
- RLS enabled on both new public-schema tables.
- No anon/authenticated policies created.
- Table access revoked from PUBLIC, anon, authenticated.
- Function EXECUTE revoked from PUBLIC, anon, authenticated and granted to service_role.

## Objects NOT modified
- consequence_examination_definitions
- consequence_technical_freezes
- consequence_examination_events / S0-S7 historical evidence
- source examination run terminal determination or run_sha256
- source finding
- source examination seal
- source receipt
- Registry submission/readiness/finalization tables/functions
- Registry identity/version rows
- auth/storage objects

## Registry rule
Registry architecture/version identity remains upstream. A superseding examination references the same existing Registry record/version; this migration never recreates Registry identity.
