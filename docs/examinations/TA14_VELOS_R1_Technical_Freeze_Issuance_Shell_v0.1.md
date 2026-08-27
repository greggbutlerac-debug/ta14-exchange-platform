# TA-14 × VELOS R1 — TECHNICAL FREEZE ISSUANCE SHELL

**Document:** TA14-VELOS-R1-TF-ISSUE-001  
**Version:** v0.1  
**Status:** PREPARED — NOT ISSUED  
**Registry:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0 — Layer-4 Deterministic Enforcement Substrate

---

## 1. PURPOSE

This shell predefines the exact structure of the TA-14 Technical Freeze record before final participant acceptance is received.

It does not create, imply, or backdate Technical Freeze.

Technical Freeze may be issued only after the Final Freeze-Completion + Participant Acceptance Instrument is returned and every mandatory identity-sealing condition is satisfied.

---

## 2. FROZEN PROPOSITION

> Can a frozen TA-14 determination be carried across the declared interface into Velos such that a consequential action determined inadmissible by TA-14 is refused by Velos before the action crosses the declared execution boundary, while producing independently inspectable evidence sufficient to distinguish active interdiction from passive observation or post-event recording?

---

## 3. FROZEN NON-CLAIMS

R1 does not establish:

- universal TA-14/Velos interoperability;
- architecture-wide non-bypassability;
- validation of the participant-authored `<4.0 µs` performance claim;
- security, safety, compliance, certification, or comparative superiority beyond the frozen proposition;
- behavior on alternate host paths, direct IPC, loopback, or other routes explicitly outside the declared R1 surface;
- any dependency on Sovereign Kinetic.

---

## 4. FROZEN EXECUTION BOUNDARY

The declared execution-crossing point is:

**delivery of an admitted packet past the designated `tc_ingress` enforcement hook into the kernel socket receive buffer of the frozen target execution service.**

The earliest declared refusal cut is pre-socket packet interdiction at `tc_ingress`.

---

## 5. FROZEN NATIVE SEMANTICS

Subject to final identity sealing, R1 preserves the following participant-authored native semantics:

- `TC_ACT_SHOT` is the authoritative cut for invalid, stale, replayed, out-of-scope, or evicted capability state;
- `TCP_RST` is limited to the declared active established-flow revocation condition;
- revocation is represented by synchronous deletion/eviction from the pinned BPF map;
- prior fully acknowledged transmissions remain committed and are not retrospectively invalidated;
- Velos native state governs the Velos execution decision after the declared interface handoff;
- no TA-14 semantic override is introduced into Velos runtime logic.

---

## 6. FROZEN ROUTE

The R1 route is limited to the final participant-accepted topology manifest, expected to include:

- root namespace source side;
- designated veth pair;
- `ns_target`;
- `veth-target`;
- target TCP socket `10.240.0.2:8443`;
- no NAT/proxy on the declared path;
- no in-scope alternate route reaching the same frozen consequence without traversing the designated instrumented interface.

The exact final topology evidence identity is populated only at issuance.

---

## 7. FROZEN EVIDENCE CHANNELS

Technical Freeze requires the final immutable identities for:

1. TA-14 VECT source/proposition artifact;
2. Velos control-plane / map-loader;
3. eBPF enforcement object;
4. `canonical_state_map` definition;
5. revocation/mutation mechanism;
6. kernel/runtime environment;
7. topology and `tc_ingress` attachment evidence;
8. target service/socket fixture;
9. challenge payload identity;
10. kernel ring-buffer event evidence;
11. refusal receipt schema and Ed25519 signer identity;
12. offline receipt verifier;
13. packet capture method;
14. wall-clock synchronization health evidence;
15. monotonic chronology evidence;
16. final evidence package manifest and hashes.

---

## 8. FROZEN FAILURE MATRIX

The predeclared F0-F9 PASS/FAIL/INCOMPLETE criteria remain those preserved in TA14-VELOS-R1-AIAC-001 and its final populated revision.

No substantive acceptance criterion may be changed after Technical Freeze for the same R1 run.

---

## 9. RECEIPT CRYPTOGRAPHY

At issuance, this field must contain exactly one frozen state:

- **ED25519 — FINAL**; or
- another participant-confirmed state accompanied by an explicit reconciliation of prior conflicting statements.

Technical Freeze cannot be issued while the R1 receipt cryptography remains ambiguous.

---

## 10. PERFORMANCE BOUNDARY

**`<4.0 µs` PERFORMANCE MEASUREMENT IS EXCLUDED FROM R1.**

Any latency telemetry captured during execution is non-determinative participant telemetry for this R1 finding.

---

## 11. FINAL ARTIFACT MANIFEST

At issuance, populate:

- artifact name;
- artifact role;
- exact repository commit / binary identity / image digest / key fingerprint / command-output identity as applicable;
- SHA-256 where technically applicable;
- participant-supplied vs independently verified evidence status.

Technical Freeze identity is the complete sealed manifest, not a label detached from the artifacts it binds.

---

## 12. PARTICIPANT ACCEPTANCE

At issuance, attach the preserved participant acceptance state from TA14-VELOS-R1-FFCPA-001.

Participant acceptance confirms factual configuration only. It is not a TA-14 finding or certification.

---

## 13. ISSUANCE RECORD

**Technical Freeze ID:** UNISSUED  
**Issued by:** UNISSUED  
**Issued timestamp:** UNISSUED  
**Final manifest hash:** UNISSUED  
**Participant acceptance artifact:** UNISSUED  
**Authorized examination run:** NONE

---

## 14. CURRENT STATE

**PREPARED — NOT ISSUED**

No Technical Freeze exists until TA-14 explicitly completes and issues this record after all final acceptance conditions are satisfied.
