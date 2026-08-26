# Object Impact — 20260826160500_add_consequence_integrity_verifier.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Domain boundary
Consequence Examination Engine only. No 14-step Registry submission, readiness, review, finalization, identity, or version object is modified.

## Function created/replaced
### public.consequence_verify_integrity(text)
SECURITY DEFINER, STABLE verifier for one examination run.

Verifies:
- run exists;
- Technical Freeze exists and is issued;
- definition binding matches freeze -> run;
- Registry record binding matches freeze -> run;
- Registry version binding matches freeze -> run;
- authoritative Registry architecture still resolves as registered;
- Registry version record belongs to that Registry identifier and version label;
- sealed runs contain exactly S0-S7 and preserve S0..S7 order;
- sealed run has final determination and valid recorded SHA-256 shape;
- finding determination equals run determination;
- seal belongs to same run/finding and carries matching recorded run/finding digests;
- receipt belongs to same seal/run;
- PUBLIC receipt has publication timestamp;
- chronology sequence is contiguous from 1 with no duplicate sequence number;
- terminal state is reported deterministically.

Returns JSONB with VERIFIED or FAILED plus explicit failure codes.

## Verification boundary
This function verifies relational/structural integrity and continuity of the SHA-256 values already recorded in the examination chain. It deliberately does NOT claim to recompute SHA-256 from JSONB payloads, because canonical byte serialization is not established by this migration. That cryptographic recomputation layer should be separately specified and frozen before implementation.

## Permissions
- EXECUTE revoked from PUBLIC, anon, authenticated.
- EXECUTE granted to service_role.

## Existing objects read but NOT modified
- public.consequence_examination_runs
- public.consequence_technical_freezes
- public.consequence_examination_events
- public.consequence_examination_findings
- public.consequence_examination_seals
- public.consequence_examination_receipts
- public.consequence_examination_chronology
- public.ta14_registry_public_records
- public.ta14_registry_version_records

## Objects structurally modified
None.

## Objects NOT created or modified
- No tables
- No columns
- No constraints
- No indexes
- No triggers
- No RLS policies
- No Registry tables/functions/workflow
- No Registry identity/version rows
- No auth/storage objects
