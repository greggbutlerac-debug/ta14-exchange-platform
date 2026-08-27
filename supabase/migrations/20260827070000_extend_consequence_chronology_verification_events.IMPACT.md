# 20260827070000 — Consequence Chronology Verification Events

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
- `EXAMINATION_LINEAGE`

## Existing event kinds preserved

`TECHNICAL_FREEZE`, `RUN_OPENED`, `S0`–`S7`, `FINDING`, `SEALED`, `RECEIPT_PUBLISHED`, `VOIDED`.

## Why all three are included

The independent-verification implementation appends `INDEPENDENT_VERIFICATION`; the staged Verification Admissibility architecture appends `VERIFIER_ADMISSIBILITY`; and the staged supersession-lineage architecture appends `EXAMINATION_LINEAGE`. The live chronology constraint predates those institutional layers.

## Execution

Do not execute in Supabase until this complete SQL and impact manifest are reviewed and the relevant dependent migrations are reconciled in execution order.
