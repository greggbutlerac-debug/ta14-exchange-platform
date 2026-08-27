# 20260827070000 — Consequence Chronology Post-Examination Events

**Status:** STAGED ON `atlas/consequence-chronology-hardening` / NOT EXECUTED IN SUPABASE

## Purpose

Extend the authoritative `consequence_examination_chronology.event_kind` grammar so the already-designed post-examination institutional layers can append their chronology events without violating the database constraint.

## Registry boundary

No TA-14 Registry table, Registry function, submission/readiness/finalization logic, or 14-step registration behavior is created or modified.

## Tables created

None.

## Tables modified

`public.consequence_examination_chronology`

- Drops and recreates only `consequence_examination_chronology_event_kind_check`.
- No columns, indexes, foreign keys, RLS policies, grants, or stored chronology rows are changed.

## Functions / triggers / views / RPCs / sequences / storage objects

None created, replaced, or removed.

## Newly admitted chronology event kinds

- `INDEPENDENT_VERIFICATION`
- `VERIFIER_ADMISSIBILITY`
- `CHALLENGE_SUBMITTED`
- `RECONSIDERATION_ISSUED`
- `EXAMINATION_LINEAGE`

## Existing event kinds preserved

`TECHNICAL_FREEZE`, `RUN_OPENED`, `S0`–`S7`, `FINDING`, `SEALED`, `RECEIPT_PUBLISHED`, `VOIDED`.

## Why all five are included

- The live independent-verification implementation appends `INDEPENDENT_VERIFICATION`.
- Verification Admissibility appends `VERIFIER_ADMISSIBILITY`.
- Challenge/Reconsideration appends `CHALLENGE_SUBMITTED` and `RECONSIDERATION_ISSUED`.
- Supersession Lineage appends `EXAMINATION_LINEAGE`.

The live chronology constraint predates all five post-examination institutional event types.

## Execution dependency

This migration must execute before:

1. `20260826170500_add_consequence_verification_admissibility.sql`
2. `20260826172000_add_consequence_challenge_reconsideration.sql`
3. `20260827065000_add_consequence_supersession_lineage.sql`

The existing independent-verification function is already live but cannot successfully append its chronology event until this grammar repair is applied.

## Execution

Do not execute in Supabase until this complete SQL and impact manifest are reviewed and the relevant dependent migrations are reconciled in execution order.
