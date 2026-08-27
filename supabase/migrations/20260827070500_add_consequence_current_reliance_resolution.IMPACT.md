# Object Impact — Current Reliance Resolution v1

Status: STAGED ONLY — DO NOT EXECUTE UNTIL APPROVED.

## Creates

### Functions
1. `public.consequence_resolve_current_reliance(text)`
   - Read-only/STABLE resolver.
   - Reads sealed run, finding, seal, challenges, reconsiderations, and supersession lineage.
   - Returns present reliance posture without modifying historical records.
   - Fails closed when a SEALED run lacks its required finding or seal.
   - Resolves a superseded run to the terminal head of the full `SUPERSEDES` chain rather than stopping at the first successor.
   - Returns `RELIANCE_UNRESOLVED` if lineage traversal detects a cycle or exceeds its bounded depth.
   - Possible postures: `NOT_FOUND`, `NOT_RELIANCE_ELIGIBLE`, `SUPERSEDED`, `REEXAMINATION_REQUIRED`, `CHALLENGED`, `RELIANCE_UNRESOLVED`, `CURRENT`.

2. `public.consequence_resolve_lineage_head(text)`
   - Read-only/STABLE lineage traversal.
   - Resolves the latest `SUPERSEDES` successor.
   - Detects cycles and bounds traversal depth at 100.

## Privilege changes
- Revokes EXECUTE from `public`, `anon`, and `authenticated` for both functions.
- Grants EXECUTE to `service_role` only.

## Reads existing objects
- `public.consequence_examination_runs`
- `public.consequence_examination_findings`
- `public.consequence_examination_seals`
- `public.consequence_examination_challenges`
- `public.consequence_examination_reconsiderations`
- `public.consequence_examination_lineage`

## Modifies existing tables
- NONE.

## Creates tables/indexes/triggers/policies
- NONE.

## Registry impact
- NONE.
- Does not alter the 14-step Registry submission/readiness/finalization architecture.
- Does not create or modify Registry identity/version records.
- Registry IDs are read only from the already-bound examination run.

## Historical integrity boundary
- No examination, finding, seal, receipt, challenge, reconsideration, verification, or lineage object is amended, revoked, erased, or rewritten.
- A SEALED status alone is insufficient for current reliance when the terminal finding or seal is missing.
- A superseded examination resolves to the terminal preserved lineage head, not merely its immediate successor.
- The migration derives current reliance posture from preserved chronology only.
