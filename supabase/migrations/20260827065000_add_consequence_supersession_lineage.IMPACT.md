# Object Impact — 20260827065000_add_consequence_supersession_lineage.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Purpose
Adds explicit, traversable lineage between sealed source and successor Consequence Examination runs without mutating either historical examination.

## Table created
- public.consequence_examination_lineage

Stores:
- source and successor run IDs;
- SUPERSEDES or REEXAMINES relationship;
- optional reconsideration authority;
- frozen source/successor run hashes;
- inherited existing Registry record/version UUID references;
- TA14-CES-v1 hashed lineage evidence;
- recorder attribution and chronology time.

## Indexes created
- consequence_examination_lineage_pair_uq
- consequence_examination_lineage_source_idx
- consequence_examination_lineage_successor_idx

## Functions created/replaced
- public.consequence_record_examination_lineage(text,text,text,text,text,uuid,text,jsonb,text)
- public.consequence_get_examination_lineage(text)

## Enforced controls
- Source and successor cannot be the same run.
- Both examinations must already be SEALED and have run_sha256.
- Both must bind to the exact same existing Registry architecture/version.
- SUPERSEDES requires a reconsideration whose determination is SUPERSEDING_EXAMINATION_REQUIRED and whose declared successor is the exact successor run.
- Lineage evidence must match its supplied TA14-CES-v1 SHA-256.
- Recording lineage appends an EXAMINATION_LINEAGE event to source chronology; it does not update the source examination.

## Existing objects read / appended to
- public.consequence_examination_runs — READ ONLY
- public.consequence_examination_reconsiderations — READ ONLY
- public.consequence_examination_chronology — APPEND ONLY

## Structural modifications to existing objects
None.

## Registry impact
None. Existing registry_record_id and registry_version_record_id are inherited as references. No Registry identity, version, submission, readiness, review, or finalization object is created or modified.

## Permissions
- New lineage table has RLS enabled.
- Table access revoked from PUBLIC, anon, authenticated.
- Function execution revoked from PUBLIC, anon, authenticated.
- Function execution granted to service_role.

## Semantic boundary
Supersession changes which later examination may govern future reliance. It does not erase, rewrite, invalidate retroactively, or replace the historical existence of the source examination, its finding, seal, receipt, independent verification, challenge, or reconsideration.