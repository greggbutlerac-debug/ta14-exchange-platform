# Object Impact — 20260826163500_add_consequence_run_manifest_v1.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Freeze-worthy boundary
Defines TA14-RM-v1: the exact logical composition of the aggregate examination run manifest whose TA14-CES-v1 canonical representation is SHA-256 hashed into run_sha256.

## Manifest composition
- manifest_spec = TA14-RM-v1
- run_id
- existing Registry record UUID reference
- existing Registry version-record UUID reference
- examination definition_id
- Technical Freeze record_id + freeze_sha256
- bound operator user_id + name
- environment_identity
- exactly eight ordered S0-S7 stage IDs + each recorded payload_sha256
- final_determination
- outcome_record

Finding, examination seal, receipt and chronology are intentionally excluded because they occur after the run is sealed. Timestamps and database-generated row IDs are intentionally excluded so database persistence mechanics do not redefine evidentiary content.

## Functions created/replaced
- public.consequence_run_manifest_v1(text)
- public.consequence_run_sha256_v1(text)
- public.consequence_verify_run_hash_v1(text)
- public.consequence_verify_integrity_v3(text)

## Existing objects read, not structurally modified
- public.consequence_examination_runs
- public.consequence_technical_freezes
- public.consequence_examination_events
- Existing v1/v2 Consequence verification/hash functions

## Structural modifications
None.

## Registry impact
None. Registry record/version UUIDs are immutable references inside the manifest. No Registry identity is created, copied, updated, finalized, or re-versioned.

## Permissions
All four functions revoke EXECUTE from PUBLIC, anon and authenticated and grant EXECUTE to service_role.

## Explicit non-claims
TA14-RM-v1 does not itself digitally sign evidence, establish external timestamp authority, prove who controlled a private key, or establish off-platform archival permanence. It defines and recomputes the database-side aggregate evidence digest boundary.
