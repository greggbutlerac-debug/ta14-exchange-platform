# TA-14 Exchange Evidence Hardening — Mainline Status

This branch starts from current `main` and is the reconciliation surface for the Evidence Hardening v2 specification and the Adversarial Hardening & Verification Standard.

## Institutional boundary

The eight-link parent architecture remains unchanged:

Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit -> Execution -> Outcome

No person-specific rebuttal, invitation, or special-access path is part of this engineering program. Technical criticisms are converted into general test cases and acceptance requirements.

## P0 gates

### P0-A — Current-state reconciliation
- [x] Start from current main rather than force-merging the stale hardening branch.
- [ ] Port only non-conflicting proof contracts and causal-control components after comparison.

### P0-B — Authoritative preservation
- [x] Browser storage is non-authoritative.
- [x] Preservation contract fails closed without an authoritative store.
- [x] Append-only Supabase ledger migration exists.
- [x] Supabase authoritative store exists and verifies stored digest on retrieval.
- [x] Authenticated server API route now exposes authoritative preserve/retrieve operations.
- [ ] Confirm migration applied in production.
- [ ] Run hostile duplicate/overwrite/update/delete/forged-receipt/digest-mismatch/client-write tests.

Until the open verification items pass, preservation is IMPLEMENTATION-COMPLETE / VERIFICATION-OPEN.

### P0-C — Scenario and evidence standing
- [x] Imported scenario verification is treated as untrusted evidence.
- [ ] Complete evidence standing/admissibility display semantics across public proof surfaces.
- [ ] Ensure UNKNOWN/UNRESOLVED cannot silently promote to ALLOW.

### P0-D — 24-artifact public corpus
- [ ] Verify TA14-EA-000001 through TA14-EA-000024 render in the public Artifact Registry.
- [ ] Verify each public artifact route resolves.
- [ ] Verify corpus counts and EAR correspondence.
- [ ] Add proof/evidence standing metadata without retroactive promotion.

## P1 gates
- Exact-action commit binding.
- Evidence and authority currentness.
- Protected-effect taxonomy.
- Alternate-route closure and bypass resistance.
- TOCTOU and concurrency tests.
- Changed-condition requalification.
- Frozen replay manifest and independent reproduction status.
- Separate determination, causal-control, execution-correspondence, and outcome-correspondence proof.

## P2 gates
- Propagate proof standing, provenance, limitations, replay status, and claim boundary across Registry, Founding Demonstrations, VSA and governed showcases.
- Propagate proof-to-participation conversion rails only after proof semantics are correct.

## Standing rule

No artifact, demonstration, receipt, or UI state may claim a stronger evidence rung than the strongest evidence actually supporting it. E3/E4/E5 are earned states, never migration defaults.

## High-scrutiny demonstration rule

NO-GO while any P0 requirement remains open.
