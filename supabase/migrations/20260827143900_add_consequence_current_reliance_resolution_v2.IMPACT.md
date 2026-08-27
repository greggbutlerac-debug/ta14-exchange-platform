# Object Impact — Current Reliance Resolution v2

Status: COMMITTED FOR REVIEW / NOT EXECUTED IN SUPABASE

## Functions created
- `public.consequence_resolve_current_reliance(text)`
- `public.consequence_resolve_lineage_head(text)`

Both are read-only, STABLE, security-definer functions with execution restricted to `service_role`.

## Objects read
- `consequence_examination_runs`
- `consequence_examination_findings`
- `consequence_examination_seals`
- `consequence_examination_challenges`
- `consequence_examination_reconsiderations`
- `consequence_examination_lineage`

## Reliance controls
- Distinguishes historical existence from present reliance.
- Fails closed if a SEALED run lacks its finding or seal.
- Returns `CHALLENGED`, `REEXAMINATION_REQUIRED`, `RELIANCE_UNRESOLVED`, `SUPERSEDED`, or `CURRENT` as supported by preserved records.
- Resolves supersession through the complete chain to its terminal head.
- Detects cycles and bounds traversal depth at 100.

## Tables, rows, policies, triggers, indexes modified
None.

## Registry impact
None. Registry record/version UUIDs are read from the already-bound examination run and never created or changed.


