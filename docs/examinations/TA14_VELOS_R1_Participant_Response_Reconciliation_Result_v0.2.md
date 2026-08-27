# TA-14 × VELOS R1 — PARTICIPANT RESPONSE RECONCILIATION RESULT

**Document:** TA14-VELOS-R1-PRR-001  
**Version:** v0.2  
**Status:** RECONCILED — TECHNICAL FREEZE READINESS ADVANCED, DIGEST SEALING REMAINS  
**Participant Registry Identity:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0 — Layer-4 Deterministic Enforcement Substrate  
**Source Request:** TA14-VELOS-R1-PREI-001 v0.1  
**Source Response:** TA14-VELOS-R1-PREI-001-RESP-v0.1

---

## 1. RECEIPT / ATTESTATION CHRONOLOGY

TA-14 received the participant response on August 27, 2026 in the TA-14 working chronology.

The participant-authored attestation states August 28, 2026.

**Reconciliation state:** NO CONFLICT — timezone-consistent unless contrary evidence emerges.

The participant date is preserved exactly as authored. TA-14 does not rewrite or normalize the participant-local attestation date.

---

## 2. ITEM-BY-ITEM RECONCILIATION

| ID | Participant state | TA-14 reconciliation | Freeze effect |
|---|---|---|---|
| A-09 | FIXED; commit/digest UNFROZEN | PARTIAL — artifact/version/entrypoint supplied; immutable source/build identity still unfrozen | OPEN |
| A-10 | FIXED; deployable SHA-256 UNFROZEN | PARTIAL — source path, program/section, compiler family, CO-RE/BTF and attach command supplied; deployable object digest remains unfrozen | OPEN |
| A-11 | FIXED | FACTUALLY RECONCILED — map identity, type, size, pinned path, key/value layouts supplied | SATISFIED subject runtime verification |
| A-12 | FIXED | FACTUALLY RECONCILED — synchronous eviction, active-flow reset and ring-buffer event behavior supplied | SATISFIED subject runtime verification |
| A-13 | FIXED | FACTUALLY RECONCILED — Linux 6.8.0-generic x86_64, clsact/BTF and privilege assumptions supplied | SATISFIED subject runtime verification |
| A-14 | FIXED | PARTIAL — namespace/root-context model supplied, but no immutable runtime image/package digest because participant describes bare-metal/VM testbed rather than a fixed container image | OPEN until final environment manifest |
| A-15 | FIXED | FACTUALLY RECONCILED — root namespace, veth pair, target namespace/addressing and no NAT/proxy declared | SATISFIED subject topology capture |
| A-16 | FIXED | FACTUALLY RECONCILED — clsact attachment and proof commands supplied | SATISFIED subject execution-time attachment evidence |
| A-17 | FIXED | PARTIAL — target service class supplied, but exact source/binary/container artifact identity remains unspecified | OPEN |
| A-18 | FIXED | FACTUALLY RECONCILED — ns_target, TCP, 10.240.0.2:8443 and execution-crossing point supplied | SATISFIED subject socket proof method |
| A-19 | FIXED | FACTUALLY RECONCILED — VECT payload hash, single segment, no fragmentation condition supplied | SATISFIED |
| A-20 | FIXED | FACTUALLY RECONCILED — ring-buffer channel and event field set supplied | SATISFIED subject schema artifact preservation |
| A-21 | FIXED | PARTIAL — collector named but exact source/build/hash and invocation remain unspecified | OPEN |
| A-22 | FIXED | FACTUALLY RECONCILED — canonical RFC 8785 JSON + Ed25519 supplied | SATISFIED subject exact schema preservation |
| A-23 | FIXED | PARTIAL — signer URN supplied; public key/fingerprint itself not supplied | OPEN |
| A-24 | FIXED | PARTIAL — standalone offline verifier named; exact version/hash/command remain unspecified | OPEN |
| A-25 | FIXED | PARTIAL — dumpcap/tcpdump/libpcap identified; exact version not supplied | OPEN |
| A-26 | FIXED | PARTIAL — dual-capture concept supplied; exact interface/filter/start-stop/hash procedure remains unspecified | OPEN |
| A-27 | FIXED | PARTIAL — chrony/PTP, UTC and ±5 ms supplied; exact synchronization-health capture method remains unspecified | OPEN |
| A-28 | FIXED | FACTUALLY RECONCILED — CLOCK_MONOTONIC_RAW supplied for internal delta chronology | SATISFIED subject execution evidence |

---

## 3. CRYPTOGRAPHY RECONCILIATION

Earlier participant material described Governance Refusal Receipts using HMAC-SHA256.

The participant factual review and the current runtime/evidence response both describe canonical RFC 8785 JSON receipts signed with **Ed25519**, with signer identity `urn:velos:key:node-l4-sec01` and standalone offline verification.

**Current reconciliation:** PARTICIPANT POSITION CONSISTENTLY ED25519 IN THE TWO LATEST FACTUAL RESPONSES; EARLIER HMAC-SHA256 STATEMENT REMAINS A SUPERSEDED-CANDIDATE, NOT YET FORMALLY WITHDRAWN.

**Freeze effect:** OPEN.

Before final Technical Freeze, participant must explicitly state that the R1 frozen receipt mechanism is Ed25519 and that the earlier HMAC-SHA256 statement does not govern R1. This can be satisfied in the final freeze-acceptance attestation; no separate architecture rewrite is required.

---

## 4. S6 RECONCILIATION

Participant states:

- no in-scope alternate route identified;
- target namespace contains only `lo` and `veth-target`;
- alternate host / IPC paths remain outside declared scope.

**TA-14 reconciliation:** NO IN-SCOPE ALTERNATE ROUTE IDENTIFIED — TOPOLOGY EVIDENCE REQUIRED AT FREEZE / EXECUTION.

**Freeze effect:** OPEN, not HOLD.

The remaining requirement is evidentiary: preserve the final network namespace/interface/routing state proving the declared R1 topology at execution time.

---

## 5. PERFORMANCE BOUNDARY

The response does not reopen performance measurement.

The previously accepted R1 boundary remains:

**OPTION A — `<4.0 µs` PERFORMANCE MEASUREMENT EXCLUDED FROM R1.**

Any latency values captured during R1 remain participant telemetry only and cannot support a TA-14 performance finding.

---

## 6. CURRENT FREEZE READINESS

The participant response materially advances R1 from broad artifact-identity HOLD into a narrower pre-freeze completion state.

### Satisfied / sufficiently reconciled for freeze preparation

- A-11 canonical state map;
- A-12 revocation/mutation semantics;
- A-13 kernel environment;
- A-15 topology model;
- A-16 attachment method;
- A-18 socket/consequence boundary;
- A-19 payload binding;
- A-20 kernel event channel/schema fields;
- A-22 Ed25519 receipt direction;
- A-28 monotonic chronology;
- S6 declared in-scope route surface;
- performance exclusion.

### Remaining OPEN items before Technical Freeze

1. A-09 exact source commit/build/package identity for `velos-l4-map-loader`;
2. A-10 deployable eBPF object SHA-256;
3. A-14 final immutable runtime/environment manifest;
4. A-17 exact deterministic echo-listener artifact identity;
5. A-21 exact `velos-event-collector` identity/invocation/hash;
6. A-23 Ed25519 public key + stable fingerprint;
7. A-24 exact `velos-receipt-verify` version/hash/verification command;
8. A-25 exact packet-capture tool/version;
9. A-26 exact dual-capture interfaces/filter/start-stop/hash procedure;
10. A-27 exact clock-sync health capture method;
11. final topology evidence for S6;
12. explicit final confirmation that Ed25519 governs R1 and the earlier HMAC-SHA256 statement does not;
13. final immutable digests/hashes for all hashable TA-14 and Velos artifacts.

---

## 7. READINESS DETERMINATION

**R1 STATUS: READY FOR FINAL FREEZE-COMPLETION PACKAGE — TECHNICAL FREEZE NOT YET ISSUED.**

This is no longer a broad architectural-scoping HOLD. The proposition, native semantics, route, consequence boundary, evidence channels and failure logic are sufficiently reconciled.

The remaining work is exact identity sealing and final participant acceptance.

No R1 examination execution is authorized until the final immutable identities and freeze acceptance are preserved.
