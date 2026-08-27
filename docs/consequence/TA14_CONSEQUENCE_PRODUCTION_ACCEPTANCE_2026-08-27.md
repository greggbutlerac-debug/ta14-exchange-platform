# TA-14 Consequence Examination Engine — Production Acceptance Record

**Acceptance date:** 2026-08-27  
**Production Supabase project:** `llzzalyiuqwyfeefdrto`  
**Acceptance classification:** PASS within the bounded controls stated below  
**Fixture policy:** `TA14-ACC` / `TA14-ACCEPTANCE` fixtures only; transactional execution; acceptance fixtures rolled back after each scenario.

## Purpose

This record preserves production execution evidence for the post-live Consequence hardening boundary. It does not claim that every possible Consequence behavior has been examined. It records the controls actually exercised against production and the defects discovered and corrected during acceptance.

## Hardening boundary executed

1. Chronology event grammar.
2. Verification Admissibility v2 and legacy v1 service-role bypass closure.
3. Reconsideration serialization.
4. Supersession uniqueness and cycle protection.
5. Current Reliance Resolution v2.

## Production acceptance findings

### A. Registry → Technical Freeze

Initial result: **INCOMPLETE / FAIL-CLOSED**.

The Technical Freeze correctly refused a Registry architecture/version mismatch. Production revealed that permanent Registry identity `TA-14-AIGR-000008` was current at version `2.0`, while its version-record structure still represented the earlier one-version-per-identity model.

Corrective action: reconcile the Registry version model so multiple immutable version records may exist beneath one permanent Registry identity; preserve 1.0; establish 2.0 beneath `TA-14-AIGR-000008`; keep archived `TA-14-AIGR-000010` archived.

Retest result: **PASS**. A bounded acceptance Technical Freeze reached `TECHNICAL_FREEZE_ISSUED` with the correct architecture/version binding.

### B. Technical Freeze → S0–S7 runtime

Initial result: **FAIL-CLOSED**.

The runtime helper attempted to write event type `STAGE_RECORDED`, while the canonical live event grammar permits `SCENARIO_STAGE` for scenario stages.

Corrective action: reconcile `consequence_record_stage` to emit canonical `SCENARIO_STAGE`; do not widen the event-type constraint.

Retest results:

- Out-of-order S1 before S0: **PASS / REFUSED** — `Stage chronology violation: expected S0, received S1`.
- Ordered S0 through S7: **PASS** — eight stage events recorded.
- Runtime event type: **PASS** — `SCENARIO_STAGE`.
- Chronology: **PASS** — `TECHNICAL_FREEZE → RUN_OPENED → S0 → S1 → S2 → S3 → S4 → S5 → S6 → S7`.

### C. Seal, Finding, Verifier Admissibility, Independent Verification

Results:

- Run seal: **PASS**.
- Finding issuance: **PASS**.
- Examination seal: **PASS**.
- Verification admissibility: **PASS** with an admissible bounded verifier fixture.
- Independent verification v2: **PASS**.
- Legacy v1 verification path: **PASS / CLOSED** for `service_role`; v2 remains the admitted service-role path.
- Preserved chronology: **PASS** — `... → FINDING → SEALED → VERIFIER_ADMISSIBILITY → INDEPENDENT_VERIFICATION`.

### D. Challenge, Reconsideration, Supersession, Current Reliance

Current Reliance transitions exercised in production:

`CURRENT → CHALLENGED → REEXAMINATION_REQUIRED → SUPERSEDED`

All four expected postures: **PASS**.

Restraint controls:

- Competing supersession: **PASS / REFUSED** — `Source examination already has a superseding successor`.
- Cyclic supersession: **PASS / REFUSED** — `Supersession lineage would create a cycle`.
- Post-examination chronology: **PASS** — `FINDING → SEALED → CHALLENGE_SUBMITTED → RECONSIDERATION_ISSUED → EXAMINATION_LINEAGE`.

## Production contamination boundary

Acceptance scenarios were executed inside explicit database transactions and rolled back. The acceptance fixtures were not retained as institutional examination records. Corrective schema/function migrations remain as production changes.

## Defects discovered by production acceptance

1. **Registry permanent-identity/version continuity incompatibility.** Deployment success alone had not demonstrated that the Technical Freeze could bind to the canonical current Registry version.
2. **Consequence stage event grammar incompatibility.** Deployment success alone had not demonstrated that the S0–S7 runtime helper could write an event accepted by the canonical event ledger.

Both defects were corrected without weakening the refusing controls that exposed them, and both affected boundaries were rerun successfully.

## Accepted boundary

Within the controls exercised on 2026-08-27, production demonstrated:

- exact Registry architecture/version binding before Technical Freeze;
- strict S0–S7 ordering and refusal of out-of-order stage execution;
- canonical examination chronology;
- sealed-run finding and seal issuance;
- verifier admissibility before service-role independent verification;
- challenge and reconsideration preservation without rewriting the source examination;
- one controlling supersession successor per source examination;
- cycle refusal in supersession lineage; and
- derived Current Reliance posture without mutation of preserved historical examination objects.

**Final determination: PASS — BOUNDED PRODUCTION ACCEPTANCE.**

## Non-claims

This record does not certify every Exchange subsystem, every Registry behavior, every possible examination input, every authorization path, or every future deployment. Any later schema/function change affecting this boundary requires revalidation appropriate to the changed surface.
