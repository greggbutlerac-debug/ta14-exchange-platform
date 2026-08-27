# Object Impact — Supersession Lineage Hardening

Status: COMMITTED FOR REVIEW / NOT EXECUTED IN SUPABASE

## Index created
- `consequence_examination_lineage_source_supersedes_uq`
  - partial unique index on `source_run_id` where `relationship='SUPERSEDES'`
  - permits only one superseding successor per source examination

## Function replaced
- `public.consequence_record_examination_lineage(text,text,text,text,text,uuid,text,jsonb,text)`

## Behavioral corrections
- Refuses a second `SUPERSEDES` successor for the same source.
- Traverses existing `SUPERSEDES` relationships and refuses any insertion that would create a cycle.
- Preserves sealed-run requirements, same Registry architecture/version requirement, reconsideration authority, TA14-CES-v1 hashing, chronology append, and service-role-only execution.

## Existing tables structurally modified
No columns or constraints are changed. The new partial unique index enforces the single-successor rule.

## Registry impact
None.


