# TA-14 × VELOS R1 — TA-14 ARTIFACT IDENTITY RESOLUTION

**Document:** TA14-VELOS-R1-TA14-AIR-001  
**Version:** v0.1  
**Status:** PARTIALLY RESOLVED — SHA-256 FREEZE PENDING  
**Related Package:** TA14-VELOS-R1-AIAC-001 v0.1

## 1. PURPOSE

This record binds the newly created TA-14-side R1 VECT contract artifacts to exact repository paths and Git commit identities. It does not establish Technical Freeze. Final byte-level SHA-256 values remain to be computed and preserved at freeze.

## 2. A-01 — TA-14 VECT PRODUCER / CONTRACT ARTIFACT

- Path: `apps/web/lib/examinations/velos-r1/vect.ts`
- Commit: `f7913ff1726328a1e3fd0008a505fb9dea6e11f0`
- Role: bounded TA-14-side R1 VECT construction, canonicalization and structural validation contract
- Status: **PARTIALLY RESOLVED**
- Remaining: freeze final file bytes and SHA-256; if a deployed runtime endpoint is later used to emit VECT objects, freeze that deployment/artifact identity separately.

## 3. A-02 — VECT SCHEMA

- Path: `apps/web/lib/examinations/velos-r1/vect.schema.json`
- Commit: `bf2ce05a6e684b6b8218c782d954fad8d2b1e3eb`
- Schema ID: `urn:ta14:velos:r1:vect:1.0.0`
- Status: **PARTIALLY RESOLVED**
- Remaining: freeze final file bytes and SHA-256.

## 4. A-03 / A-04 / A-06 / A-07 / A-08 — DETERMINISTIC FIXTURE SET

- Path: `apps/web/lib/examinations/velos-r1/fixtures.json`
- Commit: `2e99988921bf01efc0c5ea409b6f28058587e72c`
- Fixture Set: `TA14-VELOS-R1-VECT-FIXTURES-v0.1`
- Included:
  - A-03 / F0 valid VECT
  - A-04 / F7 malformed VECT
  - A-06 / F2 expired VECT
  - A-07 / F9 clock-skew VECT
  - A-08 / F3 out-of-scope-target VECT
- Status: **PARTIALLY RESOLVED**
- Remaining: freeze final file bytes and SHA-256; freeze exact examination clock interpretation and target/network identities.

## 5. A-05 — REPLAY FIXTURE

- Path: `apps/web/lib/examinations/velos-r1/fixtures.json`
- Commit: `2e99988921bf01efc0c5ea409b6f28058587e72c`
- Fixture: `f8_replay`
- Status: **PARTIALLY RESOLVED**
- Remaining: freeze exact replay sequence/count and Velos-side replay-state implementation evidence.

## 6. IMPORTANT BOUNDARY

The creation of these artifacts closes the paper-only gap on the TA-14 side. It does **not** establish that:

- Velos accepts or consumes these exact bytes;
- a live TA-14 Gateway deployment has emitted them;
- Velos runtime artifacts are frozen;
- any R1 challenge has been executed;
- interoperability exists.

Those propositions remain subject to Technical Freeze and admitted execution evidence.

## 7. CURRENT EFFECT ON READINESS

A-01 through A-08 now have concrete repository artifact identities, but remain **PARTIALLY RESOLVED** until final SHA-256 values and applicable runtime/deployment identities are preserved.

Velos-owned A-09 onward remain participant/runtime evidence dependencies except where TA-14 controls the evidence harness.

**Next controlled action:** obtain the participant-owned Velos runtime/evidence identities required for A-09 through A-28 and compute the final hash manifest before participant freeze acceptance.
