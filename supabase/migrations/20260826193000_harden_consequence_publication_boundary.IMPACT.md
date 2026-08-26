# 20260826193000 — Consequence Examination Publication Boundary Hardening

**Status:** COMMITTED / NOT YET EXECUTED IN SUPABASE

## Purpose

Make publication an affirmative institutional act. A Consequence Examination finding, cryptographic seal, and chronology are publicly readable only after the same examination run has a receipt with `publication_state = 'PUBLIC'` and a non-null `published_at` timestamp. `WITHHELD` runs remain preserved but non-public.

## Registry boundary

This migration does **not** modify the TA-14 Registry, its 14-step registration flow, registration requirements, architecture/version identity, submission contracts, readiness/finalization logic, or Registry RLS policies.

## Tables created

None.

## Tables structurally modified

None. No columns, constraints, indexes, foreign keys, or table definitions are added or changed.

## Functions / triggers / views / RPCs / sequences / storage objects

None created, replaced, or removed.

## RLS policies removed

- `public_read_consequence_findings` on `public.consequence_examination_findings` (`USING (true)`)
- `public_read_consequence_seals` on `public.consequence_examination_seals` (`USING (true)`)
- `public_read_consequence_chronology` on `public.consequence_examination_chronology` (`USING (true)`)
- `public_read_public_consequence_receipts` on `public.consequence_examination_receipts` (recreated below with explicit `published_at is not null`)

## RLS policies created

- `public_read_published_consequence_findings`
  - Roles: `anon`, `authenticated`
  - Public read permitted only when a receipt exists for the same `run_id` with `publication_state = 'PUBLIC'` and `published_at is not null`.

- `public_read_published_consequence_seals`
  - Roles: `anon`, `authenticated`
  - Same PUBLIC-receipt authority rule.

- `public_read_published_consequence_chronology`
  - Roles: `anon`, `authenticated`
  - Same PUBLIC-receipt authority rule.

- `public_read_public_consequence_receipts`
  - Roles: `anon`, `authenticated`
  - Receipt itself is readable only when `publication_state = 'PUBLIC'` and `published_at is not null`.

## Privileges

No grants or revokes are changed. Existing SELECT grants and write revocations remain in force; RLS controls row visibility.

## Examination-state behavior

Unchanged:

`Technical Freeze -> S0-S7 -> runtime sealed -> bounded finding -> cryptographic seal -> receipt`

This migration changes only **public visibility after terminal issuance**. It does not change stage ordering, hashes, operator binding, determination grammar, finding validation, sealing validation, receipt validation, append-only mutation controls, or issuance functions.

## Publication rule after this migration

- `WITHHELD` receipt/run: receipt, finding, seal, and chronology are not readable through the public `anon` / `authenticated` RLS boundary.
- `PUBLIC` receipt/run with `published_at`: receipt, finding, seal, and chronology are publicly inspectable.
- Internal/service-role institutional preservation is not deleted or rewritten by this migration.

## Execution

Do not execute in Supabase until the complete SQL and this impact manifest have been reviewed and expressly authorized.
