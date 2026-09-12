# TA-14 GAP-IXC Independent-Read Test Packet 001

**Packet ID:** TA14-GAP-IXC-IRT-001  
**Protocol:** TA14-GAP-IXC-DP-001 v0.4 — CAR-E Candidate  
**Status:** FROZEN TEST PACKET / NO ISSUED ASSURANCE FINDING  
**Target:** TA14-EA-000038 — End-to-End Consequence-Bearing Proof — DENY Path  
**Target governance:** TA-14 Admissible Execution Architecture / TA-14-AIGR-000007  
**Historical source date:** 2026-08-23

## 1. Purpose

This packet tests whether separate assessors can apply GAP-IXC v0.4 to the same frozen evidence and materially reproduce the same bounded determination without access to prior CAR-E model-probe conclusions.

This packet does not alter TA14-EA-000038, does not replace its L6 historical classification, and does not create a new assurance finding by itself.

## 2. Frozen proposition set

### PROP-001 — Implementation proposition
For the identified TA14-EA-000038 artifact and frozen target, the admitted evidence establishes that the claimed DENY-path control is represented in the identified implementation/specification sufficiently to support the artifact's bounded implementation claim.

### PROP-002 — Execution proposition
For the identified TA14-EA-000038 frozen case, the admitted evidence establishes that the governed execution boundary actually refused the disqualified action as claimed.

### PROP-003 — Consequence proposition
For the identified TA14-EA-000038 frozen case, the admitted evidence establishes that the prohibited external downstream consequence did not occur.

No assessor may narrow, decompose, replace, or strengthen these propositions after evidence review begins.

## 3. Frozen scope

In scope:
- TA14-EA-000038 only;
- the exact DENY-path proposition language preserved in the source artifact;
- the evidence objects explicitly included in this packet;
- implementation, execution, and consequence support only.

Out of scope:
- architecture-wide validity;
- legal or regulatory compliance;
- moral or institutional legitimacy;
- other TA-14 artifacts;
- routes or consequences not identified by the frozen case;
- evidence not included in this packet;
- prior CAR-E analyst conclusions.

G, A, and P are NOT APPLICABLE for this reproducibility packet because the test is intentionally limited to I, X, and C. This N/A choice is part of the pre-evidence freeze and is not an assessor discretion.

## 4. Frozen source evidence

### E-001 — Registry source record
Source file: `apps/web/app/artifacts/registry/evidence-hardening-artifacts.ts`

Preserved fields for TA14-EA-000038:
- Title: `End-to-End Consequence-Bearing Proof — DENY Path`
- Determination: `DENY`
- Sector: `Capstone consequence proof`
- Earliest control: `EXECUTION`
- Receipt: `HTTP 403 · DENIED`
- Outcome: `Disqualifying condition prevents bounded execution`
- Summary: `The full consequence-bearing chain encounters a disqualifying authority, admissibility, destination, or boundary condition and refuses execution.`
- Proves: `The bounded case demonstrates DENY behavior across the complete consequence-bearing chain.`
- Does not prove: `External non-occurrence requires downstream evidence rather than the DENY label alone.`
- Historical verification level: `L6`
- Historical status: `PUBLISHED`

### E-002 — GAP-IXC protocol
`governance/TA14_GAP_IXC_DETERMINATION_PROTOCOL_v0.4.md`

No other evidence is admitted for Test 001.

## 5. Evidence-admission constraints

1. E-001 is TA-14-produced documentary/registry evidence.
2. The `HTTP 403 · DENIED` field is a preserved registry assertion/receipt description; it must not be silently promoted into independent runtime observation.
3. No independent reproduction evidence is included.
4. No separately preserved downstream observation is included.
5. No assessor may retrieve additional repository files, private drafting context, prior chat analysis, or unstated implementation knowledge for the determination.
6. Missing evidence is treated according to v0.4; it is not filled by favorable inference.

## 6. Required assessor output

For each of I, X, and C, return:

- Dimension
- State: ESTABLISHED / PARTIALLY ESTABLISHED / UNESTABLISHED / INDETERMINATE / NOT APPLICABLE
- Exact proposition ID
- Evidentiary standing qualifier
- Evidence IDs relied upon
- Criterion-by-criterion disposition
- Material qualification
- Independence boundary
- Revalidation trigger, if applicable
- Reasoning limited to the frozen packet

The assessor must not issue an architecture-wide PASS/FAIL.

## 7. Independence instructions

The assessor must perform the determination without seeing any prior assessor result. The assessor must disclose any prior exposure to a GAP-IXC determination for TA14-EA-000038. Material prior exposure disqualifies the run from serving as a clean independent-read adoption test, though it may still be preserved as a rehearsal.

TA-14, the protocol author, and any agent that participated materially in designing v0.4 cannot self-award independent standing merely by completing this packet.

## 8. Comparison classes

After at least two eligible independent results exist, compare them using v0.4:

- R0 — MATCH
- R1 — QUALIFICATION DIVERGENCE
- R2 — STATE DIVERGENCE
- R3 — BOUNDARY DIVERGENCE
- R4 — HIDDEN-CONTEXT DEPENDENCY

R2-R4 block adoption of the affected rubric until correction and retest.

## 9. Freeze rule

Any material change to propositions, scope, admitted evidence, admission constraints, or required output invalidates this packet identity and requires a new packet/version. Results from different packet versions must not be compared as if produced from identical evidence.

## 10. Current state

**READY FOR EXTERNAL INDEPENDENT READ.**

No independent result has been recorded by this packet at freeze. No result should be inferred from the fact that the packet was authored by TA-14.