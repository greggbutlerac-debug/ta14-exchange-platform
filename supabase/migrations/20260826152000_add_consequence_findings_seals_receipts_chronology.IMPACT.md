# Object Impact — 20260826152000_add_consequence_findings_seals_receipts_chronology.sql

Status: COMMITTED / NOT YET EXECUTED IN SUPABASE

## Domain boundary
Consequence Examination Engine only. This migration does not alter the 14-step Registry submission, readiness, review, or finalization architecture. It creates terminal examination records downstream of an already Registry-bound examination run.

## Tables created
1. public.consequence_examination_findings
   - One bounded TA-14 finding per run.
   - FK to consequence_examination_runs(run_id).
   - Determination constrained to SUPPORTED / PARTIALLY_SUPPORTED / UNSUPPORTED / INDETERMINATE.
   - SHA-256 integrity field.

2. public.consequence_examination_seals
   - One cryptographic seal per run/finding.
   - FKs to examination run and finding.
   - Preserves run hash, finding hash, seal manifest, seal hash, sealing authority and timestamp.

3. public.consequence_examination_receipts
   - One public/withheld receipt per sealed run.
   - FKs to examination run and seal.
   - Receipt payload + SHA-256.
   - PUBLIC receipts require published_at.

4. public.consequence_examination_chronology
   - Append-only ordered chronology per run.
   - Supports TECHNICAL_FREEZE, RUN_OPENED, S0-S7, FINDING, SEALED, RECEIPT_PUBLISHED, VOIDED event kinds.
   - Unique (run_id, sequence_no).

## Existing tables modified
None.

## Registry objects modified
None.

The following Registry objects are not altered:
- Registry submission tables
- Registry readiness functions
- Registry finalization functions
- public.ta14_registry_public_records
- public.ta14_registry_version_records
- Registry identifiers/version lineage

Registry identity reaches these terminal records only through the existing run -> Technical Freeze -> Registry architecture/version binding.

## Functions created
1. public.validate_consequence_finding()
   - Requires SEALED run.
   - Requires authoritative run hash.
   - Requires finding determination to equal run final determination.

2. public.validate_consequence_seal()
   - Requires SEALED run.
   - Requires supplied run hash to equal authoritative run hash.
   - Requires finding to belong to same run.
   - Requires supplied finding hash to equal authoritative finding hash.

3. public.validate_consequence_receipt()
   - Requires receipt seal to belong to same run.

4. public.prevent_consequence_terminal_mutation()
   - Rejects UPDATE/DELETE on findings, seals, receipts and chronology.

EXECUTE is revoked from PUBLIC, anon and authenticated for all four functions; they operate only through triggers.

## Triggers created
- validate_consequence_finding on consequence_examination_findings BEFORE INSERT
- validate_consequence_seal on consequence_examination_seals BEFORE INSERT
- validate_consequence_receipt on consequence_examination_receipts BEFORE INSERT
- prevent_consequence_findings_mutation BEFORE UPDATE OR DELETE
- prevent_consequence_seals_mutation BEFORE UPDATE OR DELETE
- prevent_consequence_receipts_mutation BEFORE UPDATE OR DELETE
- prevent_consequence_chronology_mutation BEFORE UPDATE OR DELETE

## RLS policies created
- public_read_consequence_findings
- public_read_consequence_seals
- public_read_public_consequence_receipts (PUBLIC receipts only)
- public_read_consequence_chronology

## Indexes created
- consequence_examination_findings_run_idx
- consequence_examination_seals_run_idx
- consequence_examination_receipts_run_idx
- consequence_examination_chronology_run_idx

## Objects explicitly NOT modified
- public.consequence_examination_definitions
- public.consequence_technical_freezes
- public.consequence_examination_runs
- public.consequence_examination_events
- public.ta14_protected_examinations
- auth objects
- storage buckets

## Chain established
Existing registered architecture/version -> Technical Freeze -> S0-S7 examination run -> bounded finding -> cryptographic seal -> receipt -> ordered examination chronology.
