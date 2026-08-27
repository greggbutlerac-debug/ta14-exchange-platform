# TA-14 × VELOS R1 — PARTICIPANT RESPONSE PRESERVATION + RECONCILIATION

**Document:** TA14-VELOS-R1-PRR-001  
**Version:** v0.1  
**Status:** READY FOR PARTICIPANT RESPONSE INTAKE  
**Participant Registry Identity:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0 — Layer-4 Deterministic Enforcement Substrate  
**Source Request:** TA14-VELOS-R1-PREI-001 v0.1

---

## 1. PURPOSE

This instrument governs preservation and reconciliation of the participant response to TA14-VELOS-R1-PREI-001 v0.1.

The participant response must first be preserved as received before TA-14 interpretation, normalization, correction, or freeze-readiness judgment.

No participant-authored runtime fact becomes a TA-14-validated fact merely because it is preserved here.

---

## 2. INTAKE RULE

Upon receipt, preserve the participant response under a dedicated artifact path and mark it:

**PRESERVED AS RECEIVED — PARTICIPANT-AUTHORED — NO TA-14 VALIDATION**

Record:

- source filename / message identity;
- received date/time;
- participant name and role;
- participant attestation selection;
- original artifact hash where available;
- whether any attachments, code, binaries, public keys, schemas, pcaps, command output, topology diagrams, or external repository references accompanied the response.

Do not rewrite the participant response in place.

---

## 3. RECONCILIATION STATES

For each participant-owned item A-09 through A-28, assign exactly one reconciliation state:

- **FACTUALLY RECONCILED** — participant response supplies an exact identity/configuration sufficient to populate the R1 freeze package, subject to independent artifact verification where required;
- **PARTIAL** — material facts are supplied but one or more exact identities, hashes, commands, evidence methods, or boundaries remain unresolved;
- **UNFROZEN** — participant expressly states the item is not yet fixed;
- **NOT APPLICABLE** — participant states it does not apply and the explanation is consistent with the declared R1 route;
- **OUT OF SCOPE** — participant states it is outside R1 and the exclusion does not collapse the frozen proposition;
- **CONFLICT** — response conflicts with previously preserved participant-authored facts or the current scope;
- **INSUFFICIENT** — response does not provide enough information to establish the claimed state.

No item is marked FACTUALLY RECONCILED solely because the participant selected FIXED.

---

## 4. ITEM-BY-ITEM RECONCILIATION MATRIX

| ID | Participant state | TA-14 reconciliation state | Exact identity/evidence supplied | Conflict or dependency | Freeze consequence |
|---|---|---|---|---|---|
| A-09 | PENDING | PENDING | — | — | HOLD |
| A-10 | PENDING | PENDING | — | — | HOLD |
| A-11 | PENDING | PENDING | — | — | HOLD |
| A-12 | PENDING | PENDING | — | — | HOLD |
| A-13 | PENDING | PENDING | — | — | HOLD |
| A-14 | PENDING | PENDING | — | — | HOLD |
| A-15 | PENDING | PENDING | — | — | HOLD |
| A-16 | PENDING | PENDING | — | — | HOLD |
| A-17 | PENDING | PENDING | — | — | HOLD |
| A-18 | PENDING | PENDING | — | — | HOLD |
| A-19 | PENDING | PENDING | — | — | HOLD |
| A-20 | PENDING | PENDING | — | — | HOLD |
| A-21 | PENDING | PENDING | — | — | HOLD |
| A-22 | PENDING | PENDING | — | — | HOLD |
| A-23 | PENDING | PENDING | — | — | HOLD |
| A-24 | PENDING | PENDING | — | — | HOLD |
| A-25 | PENDING | PENDING | — | — | HOLD |
| A-26 | PENDING | PENDING | — | — | HOLD |
| A-27 | PENDING | PENDING | — | — | HOLD |
| A-28 | PENDING | PENDING | — | — | HOLD |

---

## 5. REQUIRED CONFLICT CHECKS

The returned response must be checked against the previously preserved participant factual record, including at minimum:

1. `tc_ingress` as the declared enforcement point;
2. kernel socket receive-buffer admission as the execution-crossing point;
3. `TC_ACT_SHOT` as the authoritative refusal cut for invalid/stale/evicted packets;
4. `TCP_RST` limited to the declared active established-flow condition;
5. synchronous map deletion/eviction semantics for revocation;
6. outside-scope status of unmonitored host paths, direct IPC and loopback unless the participant explicitly changes the declared R1 boundary;
7. PTP / `CLOCK_REALTIME` and the previously declared ±5 ms skew tolerance;
8. participant selection of performance Option A — `<4.0 µs` excluded from R1;
9. Governance Refusal Receipt cryptography.

### Mandatory cryptography reconciliation

The earlier participant-authored Route Specification described Governance Refusal Receipts using **HMAC-SHA256**. The later participant factual review described **Ed25519** receipts and public offline verification.

This discrepancy must be explicitly resolved before Technical Freeze.

TA-14 must not silently treat HMAC-SHA256 and Ed25519 as equivalent or assume one supersedes the other without participant confirmation.

---

## 6. S6 RECONCILIATION

Participant response to the narrow in-scope alternate-route question must be classified as one of:

- **NO IN-SCOPE ALTERNATE ROUTE IDENTIFIED — TOPOLOGY EVIDENCE SUFFICIENT**;
- **NO IN-SCOPE ALTERNATE ROUTE IDENTIFIED — TOPOLOGY EVIDENCE INSUFFICIENT**;
- **IN-SCOPE ALTERNATE ROUTE IDENTIFIED — S6 CHALLENGE REQUIRED**;
- **UNFROZEN / UNKNOWN — TECHNICAL FREEZE HOLD**.

This reconciliation does not expand R1 into architecture-wide non-bypassability.

---

## 7. ARTIFACT VERIFICATION RULE

For any participant item represented by source, binary, object, image, schema, key, capture, or other exact artifact:

- preserve immutable identity where available;
- compute or independently verify SHA-256 before final freeze where technically applicable;
- record repository commit / image digest / BPF object identity / key fingerprint separately rather than treating one identifier as a substitute for another;
- record any artifact that TA-14 cannot independently obtain or verify as participant-supplied evidence, not independently verified evidence.

---

## 8. FREEZE EFFECT

After reconciliation, each item must produce one of three freeze effects:

- **SATISFIED** — no remaining fact required for Technical Freeze;
- **OPEN** — non-critical completion action remains and must be completed before freeze issuance;
- **HOLD** — Technical Freeze cannot be issued until resolved.

A participant attestation of factual completeness does not override a TA-14 HOLD condition.

---

## 9. OUTPUTS AFTER RESPONSE RECONCILIATION

If the response is sufficiently complete, TA-14 will create:

1. `TA14_VELOS_R1_Participant_Factual_Response_[version].md` — exact preservation artifact;
2. `TA14_VELOS_R1_Artifact_Identity_and_Acceptance_Criteria_Package_v0.2.md` — populated artifact identities and final acceptance package draft;
3. `TA14_VELOS_R1_Technical_Freeze_Readiness_Matrix_v0.2.md` — updated gate states;
4. a final participant freeze-acceptance instrument if readiness reaches the required threshold.

If the response contains unresolved conflicts or insufficient identities, TA-14 will preserve those conditions and issue only the minimum bounded follow-up required to resolve them.

---

## 10. CURRENT STATE

**READY FOR PARTICIPANT RESPONSE INTAKE**

No Technical Freeze exists. No R1 examination execution is authorized. No finding has been issued.
