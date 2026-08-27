# Object Impact — Verification Admissibility v2

Status: COMMITTED FOR REVIEW / NOT EXECUTED IN SUPABASE

## Table created
- `public.consequence_verification_admissibility`
  - RLS enabled
  - direct access revoked from PUBLIC, anon, authenticated
  - one frozen admissibility record per run/verifier

## Index created
- `consequence_verification_admissibility_run_verifier_uq`

## Functions created
- `public.consequence_record_verification_admissibility(text,text,uuid,text,text,jsonb,jsonb,jsonb,jsonb,text,jsonb,jsonb,text)`
- `public.consequence_record_independent_verification_v2(text,text,text,uuid,text,text,jsonb,jsonb,text,jsonb,text,jsonb,text)`

## Existing function privilege modified
- Direct `service_role` EXECUTE is revoked from `public.consequence_record_independent_verification(text,text,uuid,text,text,text,jsonb,text,jsonb,text)`.
- The v1 recorder remains the internal implementation invoked by the security-definer v2 gate.

## Existing objects read/appended
- Runs and seals are read.
- `consequence_examination_chronology` receives `VERIFIER_ADMISSIBILITY`.
- The existing independent-verification recorder receives the admitted verification after v2 validation.

## Enforced boundary
The v2 gate requires the same run, verifier UUID, name, organization, accepted scope, replay boundary, and an `ADMISSIBLE` or `PARTIALLY_ADMISSIBLE` determination. It prevents the older RPC from bypassing admissibility.

## Registry impact
None. Existing Registry architecture/version identity is carried from the sealed run and is never recreated or modified.


