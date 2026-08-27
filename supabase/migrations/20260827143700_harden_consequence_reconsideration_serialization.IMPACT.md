# Object Impact — Reconsideration Serialization Hardening

Status: COMMITTED FOR REVIEW / NOT EXECUTED IN SUPABASE

## Function replaced
- `public.consequence_issue_reconsideration(text,text,uuid,text,text,text,jsonb,jsonb,text,text)`

## Behavioral correction
- Locks the preserved source examination run before issuing reconsideration.
- Revalidates that the source remains `SEALED` with `run_sha256`.
- Serializes chronology sequence assignment against other institutional events for the same run.
- Preserves existing determination grammar, hashing, challenge resolution, Registry/version binding, and service-role-only execution.

## Tables structurally modified
None.

## Existing rows modified by future function use
Only the targeted challenge status changes to `RESOLVED`, as already designed. Historical examinations and terminal records remain unchanged.

## Registry impact
None.


