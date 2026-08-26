# Object Impact — 20260826165000_add_consequence_independent_verification.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Domain boundary
Consequence Examination Engine independent verification/replay evidence only. No 14-step Registry submission, readiness, review, finalization, identity, or version object is modified.

## Table created
### public.consequence_independent_verifications
Creates a separately attributable evidence object for independent verification or replay of an already sealed examination.

Columns:
- id UUID primary key
- verification_id TEXT unique
- run_id TEXT FK -> consequence_examination_runs(run_id)
- verifier_user_id UUID
- verifier_name TEXT
- verifier_organization TEXT nullable
- verification_method TEXT
- source_run_sha256 TEXT
- source_seal_id TEXT nullable
- source_seal_sha256 TEXT nullable
- replay_environment JSONB
- verification_result VERIFIED | FAILED | INDETERMINATE
- verification_body JSONB
- verification_sha256 TEXT
- issued_at TIMESTAMPTZ
- created_at TIMESTAMPTZ

RLS is enabled. PUBLIC, anon, and authenticated receive no table privileges.

## Index created
- consequence_independent_verifications_run_idx on (run_id, issued_at)

## Functions created/replaced
### public.consequence_record_independent_verification(...)
- Requires an already sealed source run.
- Captures the source run hash at verification issuance.
- Captures source examination seal/hash when one exists.
- Requires the independent verification body hash to recompute under TA14-CES-v1 before insertion.
- Appends INDEPENDENT_VERIFICATION to the source run chronology.
- Carries forward existing Registry record/version references in chronology only.
- Does not mutate the original run/finding/seal/receipt.

### public.consequence_verify_independent_verification(text)
- Verifies source run still resolves and its recorded hash matches the captured source hash.
- Verifies captured source seal continuity when present.
- Recomputes the verification evidence object's own TA14-CES-v1 hash.
- Returns VERIFIED / FAILED plus explicit failure codes.

## Existing table written, not structurally modified
- public.consequence_examination_chronology

## Existing tables read, not structurally modified
- public.consequence_examination_runs
- public.consequence_examination_seals

## Registry impact
None. Existing Registry record/version IDs remain references inherited from the source run. No Registry identity is created, copied, altered, finalized, or re-versioned.

## Semantic boundary
An independent verification/replay result is a new, separately attributable evidence object. It cannot retrospectively alter an already-issued examination determination, finding, seal, receipt, or Registry record.

## Explicit non-claims
This migration does not itself provide an external trusted timestamp, digital signature/private-key proof, independent operator accreditation, or off-platform archival permanence. It preserves database-side attribution, source binding, cryptographic evidence-object integrity, and chronology.
