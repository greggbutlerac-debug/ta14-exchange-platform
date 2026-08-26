# Object Impact — 20260826155000_add_consequence_terminal_issuance_functions.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Domain boundary
Consequence Examination Engine only. This migration does not alter the 14-step Registry submission, readiness, review, finalization, Registry identity, or Registry version architecture.

## Functions created/replaced

### public.consequence_issue_finding(text, uuid, text, text, jsonb, text)
- Requires an already SEALED examination run.
- Requires the run to retain its Registry architecture/version binding.
- Copies the run's final determination into the finding rather than allowing a second determination to be invented.
- Inserts one bounded finding.
- Appends a FINDING event to consequence_examination_chronology.

### public.consequence_issue_seal(text, text, uuid, text, text, jsonb, text)
- Requires an already SEALED run.
- Requires the referenced finding to belong to that same run.
- Copies authoritative run_sha256 and finding_sha256 into the seal.
- Inserts one examination seal.
- Appends a SEALED event to consequence_examination_chronology.

### public.consequence_issue_receipt(text, text, text, jsonb, text, text)
- Requires a SEALED run and a seal belonging to that same run.
- Issues PUBLIC or WITHHELD receipt state.
- PUBLIC receipts receive published_at automatically.
- WITHHELD receipts remain unpublished and do not generate a public-publication chronology event.
- PUBLIC receipts append RECEIPT_PUBLISHED to consequence_examination_chronology.
- The chronology event preserves the already-bound Registry record/version IDs; it does not recreate Registry identity.

## Existing tables written by functions, NOT structurally modified
- public.consequence_examination_findings
- public.consequence_examination_seals
- public.consequence_examination_receipts
- public.consequence_examination_chronology

## Existing tables read, NOT modified structurally
- public.consequence_examination_runs

## Permissions
EXECUTE is revoked from PUBLIC, anon, and authenticated for all three SECURITY DEFINER functions. No public execution surface is added.

## Objects NOT created or modified
- No tables
- No columns
- No constraints
- No indexes
- No triggers
- No RLS policies
- No Registry tables
- No Registry functions
- No Registry submission/readiness/finalization logic
- No Registry identifiers or version records
- No storage/auth objects

## Terminal chain enforced
Existing registered architecture/version -> Technical Freeze -> S0-S7 sealed run -> bounded finding -> examination seal -> receipt -> chronology.
