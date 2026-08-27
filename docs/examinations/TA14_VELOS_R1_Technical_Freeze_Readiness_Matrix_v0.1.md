# TA-14 × VELOS R1 — TECHNICAL FREEZE READINESS MATRIX

**Document:** TA14-VELOS-R1-TFR-001  
**Version:** v0.1  
**Status:** HOLD — TECHNICAL FREEZE NOT YET ESTABLISHED  
**Related Scope:** TA14-VELOS-R1-SCOPE-001 v0.2  
**Participant Registry Identity:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0 — Layer-4 Deterministic Enforcement Substrate

---

## 1. PURPOSE

This matrix converts the remaining R1 scoping dependencies into explicit Technical Freeze gates.

A gate is marked:

- **SATISFIED** — the required fact or participant reconciliation is already preserved sufficiently for freeze readiness;
- **OPEN** — the item is known but exact executable identity/evidence is not yet preserved;
- **HOLD** — execution must not be treated as R1 evidence until the item is resolved.

This document does not itself establish Technical Freeze and does not authorize examination execution.

---

## 2. CURRENT READINESS DETERMINATION

**R1 TECHNICAL FREEZE READINESS: HOLD**

Participant factual reconciliation is complete. The remaining blockers are executable artifact identity, environment identity, evidence-source identity, challenge fixtures, and predeclared acceptance criteria.

The current examination proposition, non-claims, interface terminology, execution boundary, performance exclusion, and participant authority are sufficiently reconciled to proceed into freeze preparation.

---

## 3. TECHNICAL FREEZE GATE MATRIX

| Gate | Requirement | Status | Preserved basis | Remaining action before freeze |
|---|---|---|---|---|
| TF-01 | Participant authority | SATISFIED | Naimatullah, Founder & Principal Architect, attested TA14-VELOS-R1-PFR-001-RESP-v0.2 on Aug. 27, 2026 | Participant must still accept final frozen instrument after all artifact identities are inserted |
| TF-02 | Registered architecture identity | SATISFIED | TA-14-AIGR-000029 · Velos Systems v1.0.0 | Preserve exact executable Velos runtime artifacts under this identity |
| TF-03 | TA-14 producer identity | HOLD | Scope identifies upstream TA-14 Gateway as VECT producer | Name exact TA-14 Gateway artifact/version/hash that creates the frozen VECT |
| TF-04 | VECT schema identity | HOLD | Participant supplied field structure and RFC 8785 canonical JSON semantics | Preserve machine-readable schema artifact, version and SHA-256 hash |
| TF-05 | Velos control-plane identity | HOLD | Participant identifies Velos Control Plane / Ingress eBPF Map Loader | Preserve exact source/binary/container artifact and SHA-256 hash |
| TF-06 | eBPF enforcement artifact | HOLD | Participant identifies tc_ingress and canonical_state_map behavior | Preserve exact eBPF object/program identity, build/compiler information and SHA-256 hash |
| TF-07 | Kernel/runtime environment | OPEN | Linux Kernel 6.x x86_64 container/network namespace declared | Freeze exact kernel release/build, host/VM identity if applicable, container image digest and namespace topology |
| TF-08 | Network route identity | OPEN | veth/eth0 boundary + clsact tc_ingress declared | Freeze exact interface names/IDs, qdisc attachment, IP addressing, bridge/veth topology and packet path |
| TF-09 | Target consequence fixture | HOLD | Execution crossing point = target kernel socket receive-buffer admission | Freeze target service artifact/version/hash, destination IP:port, protocol, payload fixture and consequence-observation method |
| TF-10 | VECT generation fixture | HOLD | VECT fields are reconciled | Preserve exact valid VECT fixture and deterministic invalid/challenge variants for F0-F9 |
| TF-11 | Revocation/mutation fixture | HOLD | `bpf_map_delete_elem` behavior participant-declared | Preserve exact mutation command/tool, token key, chronology capture and active-flow condition |
| TF-12 | Receipt signing identity | OPEN | Ed25519, hardware/enclave-backed key, offline verification declared | Preserve public key fingerprint, signer URN, key publication location and verification tool/procedure |
| TF-13 | Kernel event evidence | HOLD | kernel event / ring-buffer evidence required | Freeze event schema, collection program, output format, storage path and integrity method |
| TF-14 | Packet evidence | OPEN | Full pcap available on test interface | Freeze capture tool/version, command/config, capture interface, filter, start/stop rule and hash procedure |
| TF-15 | Clock chronology evidence | OPEN | PTP / CLOCK_REALTIME + monotonic timestamps; ±5 ms tolerance declared | Freeze PTP source, sync-health capture, wall-clock source and method for proving skew remained within bound |
| TF-16 | Alternate-route proposition | OPEN | Unmonitored host paths/direct IPC/loopback outside declared claim | Identify any alternate **in-scope** route to same target; if none, preserve topology evidence supporting that statement |
| TF-17 | F0-F9 challenge fixtures | HOLD | Failure matrix defined in Scope v0.2 | Preserve exact repeatable input/configuration for every challenge before execution |
| TF-18 | F0-F9 acceptance criteria | HOLD | Preliminary examination questions defined | Freeze observable PASS / FAIL / INCOMPLETE conditions for each challenge before execution |
| TF-19 | Performance boundary | SATISFIED | Participant selected Option A | Preserve statement that <4.0 µs is excluded from R1 finding and acceptance logic |
| TF-20 | Publication/confidentiality boundary | OPEN | Not yet fixed | Declare which raw artifacts may be public, controlled, confidential or participant-only |
| TF-21 | Replay terms | OPEN | Replay optional | Declare whether replay is permitted; if yes, freeze replay operator, inputs, environment and non-alteration rules |
| TF-22 | Final participant freeze acceptance | HOLD | Not possible until all OPEN/HOLD artifacts are complete | Velos accepts final frozen identities, proposition, non-claims, fixtures and acceptance criteria |
| TF-23 | TA-14 freeze issuance | HOLD | No Technical Freeze exists | TA-14 issues Technical Freeze only after all mandatory gates are satisfied |

---

## 4. REQUIRED ARTIFACT MANIFEST BEFORE TECHNICAL FREEZE

The following exact objects must be identifiable and hashable where technically applicable:

1. TA-14 Gateway / VECT producer artifact;
2. VECT JSON schema;
3. valid VECT fixture;
4. F1-F9 invalid/challenge VECT or state fixtures;
5. Velos control-plane / map-loader artifact;
6. Velos eBPF program/object;
7. kernel/runtime build identity;
8. container image digest or equivalent runtime package identity;
9. namespace/network topology record;
10. target service artifact;
11. target IP:port and protocol fixture;
12. challenge payload artifact;
13. map mutation/revocation tool or command record;
14. kernel/ring-buffer event schema and collector;
15. receipt schema;
16. receipt public verification key identity;
17. receipt verification tool/procedure;
18. packet-capture tool/configuration;
19. clock/PTP source and synchronization-health evidence method;
20. acceptance-criteria manifest for F0-F9;
21. publication/confidentiality declaration;
22. replay declaration, if applicable.

---

## 5. ACCEPTANCE-CRITERIA TEMPLATE

Before Technical Freeze, each F0-F9 challenge must contain all of the following fields:

- **Challenge ID**
- **Frozen initial state**
- **Frozen changed/invalid condition**
- **Exact action issued**
- **Expected Velos-native disposition**
- **Declared execution-crossing point**
- **Required source evidence**
- **Required target/sink evidence**
- **Required kernel evidence**
- **Required receipt evidence**
- **Required chronology/correlation evidence**
- **PASS condition**
- **FAIL condition**
- **INCOMPLETE condition**
- **Out-of-scope observations**

No post-run alteration of these criteria may convert a failed or incomplete challenge into a supported result.

---

## 6. MINIMUM EVIDENCE FOR ACTIVE-INTERDICTION CLAIM

For any refusal challenge to support P1-C through P1-E, R1 must preserve evidence sufficient to establish all of the following:

1. the exact frozen VECT or changed-condition identity;
2. the exact packet/action challenged;
3. Velos native state at evaluation time;
4. the `tc_ingress` disposition actually taken;
5. whether the packet entered the target service kernel socket receive buffer;
6. receipt identity and signature validity;
7. event/packet/receipt causal correlation;
8. chronology sufficient to distinguish pre-execution interdiction from post-event recording.

A receipt without source/sink and kernel correlation is insufficient by itself.

---

## 7. R1 PERFORMANCE EXCLUSION

The participant selected **Option A — exclude performance measurement from R1**.

Therefore:

- `<4.0 µs` is not a Technical Freeze acceptance criterion;
- latency fields may be preserved as participant telemetry only;
- R1 may not issue a TA-14 finding validating the latency proposition;
- a later performance examination requires a separate frozen measurement protocol.

---

## 8. READINESS DECISION RULE

R1 may advance from **HOLD** to **READY FOR TECHNICAL FREEZE** only when:

- every mandatory identity/evidence gate is SATISFIED;
- all F0-F9 fixtures are reproducible and preserved;
- all F0-F9 acceptance criteria are frozen;
- participant and TA-14 artifact identities are attributable;
- the evidence path can independently establish source, enforcement point, sink and chronology;
- Velos accepts the final frozen participant-specific facts and non-claims;
- TA-14 issues the formal Technical Freeze record.

Until then, any execution is exploratory and may not be treated as R1 examination evidence.

---

## 9. CURRENT STATUS

**HOLD — TECHNICAL FREEZE NOT YET ESTABLISHED**

### Already reconciled

- participant identity and authority;
- registered Velos baseline;
- VECT terminology and field structure;
- neutral interface terminology;
- execution-crossing point;
- TC_ACT_SHOT / TCP_RST scope;
- revocation behavior;
- receipt semantics;
- clock/correlation model;
- declared outside-scope bypass surfaces;
- performance exclusion;
- R1 proposition and non-claim boundary.

### Remaining blockers

Executable artifact hashes, environment identities, target fixture, evidence collectors, F0-F9 reproducible fixtures, F0-F9 acceptance criteria, publication boundary, replay terms if used, and final participant freeze acceptance.

**Next controlled action:** build and preserve the R1 Artifact Identity + Acceptance Criteria Package, then reassess this matrix for Technical Freeze issuance.
