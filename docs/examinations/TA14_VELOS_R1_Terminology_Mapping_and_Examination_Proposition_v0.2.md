# TA-14 × VELOS R1 — TERMINOLOGY MAPPING + FORMAL EXAMINATION PROPOSITION

**Document:** TA14-VELOS-R1-SCOPE-001  
**Version:** v0.2  
**Status:** FACTUALLY RECONCILED — TECHNICAL FREEZE READINESS REVIEW PENDING  
**Participant Registry Identity:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0 — Layer-4 Deterministic Enforcement Substrate  
**Participant Route Specification:** Velos Systems Route Specification v1.0.0  
**Participant Factual Review:** TA14-VELOS-R1-PFR-001-RESP-v0.2, attested August 27, 2026  
**TA-14 Examination Role:** freeze proposition, evidence boundary, chronology, acceptance criteria, and finding boundary without rewriting either architecture.

---

## 1. PURPOSE

This instrument establishes the factually reconciled terminology map and bounded proposition for a bilateral TA-14 × Velos interoperability examination.

It does **not** establish interoperability, validate Velos performance claims, establish comparative superiority, or authorize production reliance.

The purpose of R1 is:

> Determine whether a frozen TA-14 admissibility state can be carried across a declared interface into the registered Velos v1.0.0 boundary such that a consequential action declared inadmissible within the frozen TA-14 proposition is actively interdicted before crossing the declared execution boundary, with preserved evidence sufficient to distinguish active interdiction from passive observation or post-event recording.

---

## 2. ARCHITECTURAL SOVEREIGNTY

The examination preserves the following separation:

- **Velos defines Velos.**
- **TA-14 defines TA-14.**
- **TA-14 governs the examination boundary, not the participant architecture.**
- **The preserved execution evidence determines the bounded finding.**

No Velos term becomes a TA-14 term merely by mapping. No TA-14 determination becomes a Velos determination merely by interface translation.

---

## 3. REGISTERED PARTICIPANT BASELINE

The Velos side of the examination is bound to:

- Registry Identifier: **TA-14-AIGR-000029**
- Version: **v1.0.0**
- Declared substrate: **Linux Kernel eBPF (tc-ingress) | PEP-L4 WireGate™**
- Declared scope: **Deterministic Layer-4 Execution Floor & T=0 Interdiction**
- Participant-authored route stages:
  1. Ingress and upstream attestation-envelope ingestion
  2. Kernel-space O(1) state matching
  3. Positive pass or fail-closed interdiction
  4. Telemetry preservation and Governance Refusal Receipt generation

All claims remain participant-authored propositions unless independently established by the frozen examination evidence.

---

## 4. FACTUALLY RECONCILED INTERFACE OBJECT

The participant identifies the interface carrier as the **Velos Execution Capability Token (VECT)**.

### Participant-authored VECT fields

- `assertion_id`: UUID / URN string
- `capability_token_fingerprint`: SHA-256 hex64
- `target_binding.protocol`: TCP
- `target_binding.dst_ip`: IPv4 / IPv6 string
- `target_binding.dst_port`: uint16
- `target_binding.payload_binding_hash`: SHA-256 hex64
- `temporal_authority.clock_source`: `CLOCK_REALTIME`
- `temporal_authority.epoch_ts_micros`: uint64
- `temporal_authority.valid_for_micros`: uint64
- `temporal_authority.max_skew_tolerance_micros`: 5000
- `idempotency_constraints.nonce`: hex64
- `idempotency_constraints.max_allowed_retransmissions`: 3
- `idempotency_constraints.single_session_only`: true

### Participant-authored carrier semantics

- Serialization: canonical JSON under RFC 8785 via local IPC / bounded ingress memory.
- Producer: upstream admissibility plane identified for R1 as the TA-14 Gateway.
- Consumer: Velos Control Plane / Ingress eBPF Map Loader.
- Cryptographic binding: SHA-256 digest over canonical payload hash bound to target socket.
- Freshness/scope: strict epoch-microsecond window; expired TTL or nonce replay fails closed.
- Input validation: strict JSON-schema conformance before BPF map insertion.

The participant accepts **“upstream attestation / authority context presented to Velos”** as factually acceptable neutral interface terminology.

---

## 5. FACTUALLY RECONCILED TERMINOLOGY MAP

| TA-14 examination concept | Velos participant-authored concept | Mapping boundary |
|---|---|---|
| Registered architecture/version identity | TA-14-AIGR-000029 / Velos v1.0.0 | Identity linkage only; no claim validation |
| Admissibility determination | Upstream attestation / authority context presented through VECT | Interface correspondence only; not semantic equivalence |
| Authority state | Capability token fingerprint existence / eviction state | Velos native invariant remains Velos-defined |
| Temporal authority validity | VECT temporal authority window and TTL | Mapping limited to declared execution-window condition |
| Consequence scope | VECT target binding: protocol + destination IP + destination port + payload binding hash | Velos target-bound enforcement surface |
| Binding / carried decision state | VECT accepted by Velos control plane and inserted into pinned BPF map | Carrier and provenance must remain unchanged after Technical Freeze |
| Execution boundary | tc_ingress before target kernel socket receive-buffer admission | R1 boundary fixed to participant-defined pre-socket cut |
| Permitted progression | TC_ACT_OK | Velos pass behavior only; not a TA-14 ALLOW finding by itself |
| Refusal / prohibited progression | TC_ACT_SHOT; TCP_RST only for active established flows after mid-flight authority mutation/revocation | TC_ACT_SHOT is authoritative execution cut |
| Refusal evidence | kernel event + Governance Refusal Receipt | Integrity, attribution, chronology and correlation must be examined |
| Changed authority condition | synchronous token eviction from pinned BPF map | Effect claimed on next tc_ingress packet evaluation |
| Evidence continuity | assertion_id + capability_token_fingerprint + kernel timestamp + pcap + signed receipt | Must preserve causal correspondence across the challenged action and refusal |

### Mapping rule

The terminology map is an interface aid, not an equivalence declaration. Any later change to these participant-authored facts requires explicit reconciliation before Technical Freeze.

---

## 6. R1 FORMAL PROPOSITION

### Proposition P1 — Active pre-execution interdiction

**Can a frozen TA-14 determination be carried across the declared interface into Velos v1.0.0 such that a consequential action determined inadmissible within the frozen TA-14 proposition is refused by Velos before the action crosses the declared execution boundary, while producing independently inspectable evidence sufficient to distinguish active interdiction from passive observation or post-event recording?**

### Sub-propositions

**P1-A — Interface correspondence**  
The frozen TA-14 state is conveyed into Velos through the frozen VECT carrier without semantic substitution or undeclared authority creation.

**P1-B — Native evaluation**  
Velos evaluates the received state using its declared native kernel-space invariants rather than a TA-14-authored replacement decision engine.

**P1-C — Pre-execution refusal**  
When the frozen challenge condition requires refusal, the challenged packet does not progress beyond `tc_ingress` into the target service kernel socket receive buffer.

**P1-D — Evidence correspondence**  
The preserved event and Governance Refusal Receipt can be correlated to the challenged action, VECT identity, native Velos determination, execution cut, and chronology.

**P1-E — Active enforcement distinction**  
The admitted evidence is sufficient to distinguish active prevention from passive detection, alerting, recording, or retrospective explanation.

---

## 7. EXPLICIT NON-CLAIMS

R1 does not establish:

1. that TA-14 and Velos are universally interoperable;
2. that Velos implements TA-14 architecture;
3. that TA-14 controls Velos native kernel logic;
4. that any Velos participant-authored performance statement is validated merely by registration or preservation;
5. that the declared **< 4.0 µs** latency profile is established; **performance measurement is explicitly excluded from R1** by participant selection;
6. that TC_ACT_SHOT, TCP_RST, or any other declared mechanism prevents consequences outside the frozen route and environment;
7. that a successful R1 result establishes security, safety, compliance, certification, or superiority beyond the proposition;
8. any Sovereign Kinetic dependency, physical backstop, or three-architecture chain;
9. protection of alternate unmonitored host paths, direct IPC outside the designated socket, loopback channels, or any other route expressly declared outside R1 scope.

---

## 8. FACTUALLY RECONCILED EXECUTION BOUNDARY

The participant defines the execution-crossing point as:

> **The boundary where an admitted packet traverses past the `tc_ingress` hook and is delivered into the kernel socket receive buffer of the target execution service.**

The earliest defensible execution cut for R1 is therefore:

> **Pre-socket packet progression interdiction at `tc_ingress`, before socket queue ingestion.**

For all invalid, stale, malformed, replayed, out-of-scope, or evicted inputs within the frozen route, **TC_ACT_SHOT** is the authoritative execution cut.

TCP reset behavior is narrower:

- active, established TCP flows after explicit mid-flight authority mutation/revocation may emit stateless bilateral `TCP_RST` packets;
- new/unestablished flows are refused with `TC_ACT_SHOT` at SYN without requiring reset teardown.

---

## 9. FACTUALLY RECONCILED NETWORK / ENFORCEMENT PATH

Participant-declared R1 environment:

- Linux Kernel 6.x, x86_64;
- container / dedicated Linux network-namespace environment;
- primary ingress via veth pair / `eth0` boundary interface;
- `clsact` qdisc with BPF attached at `tc_ingress`;
- target service bound to the declared destination IP and port;
- no user-space progression before the kernel hook disposes of the packet;
- instrumented route is the designated ingress veth/interface only.

The exact deployment identity, kernel build, container image, interface identifiers, destination service identity and configuration hashes remain Technical Freeze artifacts and must be captured before execution.

---

## 10. FAILURE-CONDITION MATRIX

| ID | Challenge | TA-14-side state to freeze | Velos participant-authored expected behavior | Examination question |
|---|---|---|---|---|
| F0 | Valid VECT / valid temporal authority / valid target | admissible within frozen proposition | canonical match → TC_ACT_OK | Does permitted progression correspond to the frozen state? |
| F1 | Unknown / absent / evicted capability token fingerprint | inadmissible | map miss → TC_ACT_SHOT | Is progression prevented before socket admission? |
| F2 | Expired temporal authority window | inadmissible | TTL failure → TC_ACT_SHOT | Is temporal invalidity enforced at the declared boundary? |
| F3 | Out-of-scope target binding | inadmissible | target mismatch → TC_ACT_SHOT | Can otherwise valid authority escape its declared target scope? |
| F4 | Authority mutation after initial admissibility | prior state no longer supportable | synchronous map eviction; next packet refused; active flow may receive TCP_RST | Does stale prior authority continue to carry execution standing? |
| F5 | Upstream state conflicts with Velos runtime state | conflict explicitly frozen | native Velos runtime/map state governs actual packet disposition | Which state governs progression and what evidence proves it? |
| F6 | Refusal evidence continuity | refusal required | kernel evidence + pcap + Governance Refusal Receipt | Can the refusal evidence be bound to the exact challenged action and chronology? |
| F7 | Malformed framing / schema-invalid VECT | inadmissible | rejected before BPF map insertion | Does malformed input fail closed without acquiring execution standing? |
| F8 | Replay / nonce reuse beyond permitted constraints | inadmissible | replay detected → refusal | Are idempotency constraints enforced as frozen? |
| F9 | Clock skew exceeds frozen tolerance | inadmissible | `CLOCK_SKEW_EXCEEDED` refusal | Does temporal trust fail closed when skew exceeds ±5 ms tolerance? |

---

## 11. GOVERNANCE REFUSAL RECEIPT — PARTICIPANT-AUTHORED EVIDENCE OBJECT

The participant identifies the following representative receipt fields:

- `receipt_id`
- `assertion_id`
- `evaluated_against_baseline = TA-14-AIGR-000029:PEP-L4`
- `transport_disposition = REFUSED_DROP | REFUSED_RESET`
- `refusal_reason_code`
- `measured_latency_micros`
- `transport_transition_admitted = false`
- `consequence_observation_scope = TRANSPORT_LAYER_ONLY`
- `kernel_evidence.hook_point = tc_ingress`
- `kernel_evidence.action_code = TC_ACT_SHOT | TCP_RST`
- `kernel_evidence.kernel_reference_ts_micros`
- `attestation.signer_identity`
- `attestation.signature_algorithm = Ed25519`
- `attestation.signature`

Participant-declared refusal reason codes include:

- `LEASE_EXPIRED`
- `MAP_EVICTED`
- `REPLAY_DETECTED`
- `CLOCK_SKEW_EXCEEDED`
- `MALFORMED_FRAMING`

Participant-declared key custody / verification:

- hardware/enclave-backed Ed25519 private key;
- published public node key;
- third-party offline receipt verification claimed without privileged Velos access.

### R1 evidence rule

The presence of a signed receipt is not by itself proof that interdiction occurred before execution. R1 must correlate receipt identity to kernel evidence, packet/network evidence, VECT identity and the frozen execution chronology.

---

## 12. CLOCK / CORRELATION MODEL

Participant-declared correlation model:

- PTP / `CLOCK_REALTIME` synchronization;
- frozen maximum skew tolerance: **±5.0 ms**;
- `assertion_id` paired with deterministic `capability_token_fingerprint`;
- kernel monotonic timestamp for local delta chronology;
- UTC wall-clock timestamp for cross-system audit pairing;
- full packet-capture traces on the frozen test interface.

Technical Freeze must identify the actual PTP source, clock status, capture interface, pcap tool/configuration and event-correlation procedure.

---

## 13. ALTERNATE / BYPASS ROUTE BOUNDARY

The participant expressly limits the claimed controlled surface to the instrumented ingress veth/interface.

The following are **outside the declared R1 consequence-control claim unless separately frozen into scope**:

- alternate unmonitored host network paths;
- direct IPC outside the designated socket;
- out-of-band loopback channels;
- any other route that does not traverse the designated instrumented interface.

### S6 implication

R1 will not convert out-of-scope routes into a failure of the frozen Velos route claim merely because they exist. However, Technical Freeze must prove that the R1 challenged consequence is actually routed through the declared interface and must identify whether any alternate in-scope route can reach the same target service without crossing the examined `tc_ingress` control.

---

## 14. PERFORMANCE CLAIM BOUNDARY

The participant selected:

**OPTION A — EXCLUDE PERFORMANCE MEASUREMENT FROM R1.**

Accordingly:

- R1 does not test or validate the **< 4.0 µs** proposition;
- any `measured_latency_micros` field in a receipt may be preserved as participant telemetry but is not an R1 acceptance criterion or finding basis;
- no R1 finding may state or imply that TA-14 independently verified Velos latency performance;
- a later benchmark may examine latency only under a separately frozen measurement protocol.

---

## 15. TECHNICAL FREEZE GATES — R1

No execution may count as R1 evidence until all applicable freeze gates are satisfied and preserved.

- **TF-01 Participant authority** — SATISFIED FOR SCOPING: Naimatullah, Founder & Principal Architect, factually attested PFR response on August 27, 2026. Final frozen-scope acceptance still required.
- **TF-02 Architecture identity** — TA-14-AIGR-000029 and exact Velos v1.0.0 runtime artifact identity must be preserved.
- **TF-03 Artifact integrity** — hashes/identities required for route specification, runtime artifacts, VECT schema, map loader, eBPF object, configuration, container/image, test harness and evidence collectors.
- **TF-04 Claims and non-claims** — P1/P1-A through P1-E and Sections 7, 13 and 14 must be accepted as frozen.
- **TF-05 Native semantics** — FACTUALLY RECONCILED: participant accepted neutral terminology and supplied Velos-native interface facts.
- **TF-06 Consequence boundary** — FACTUALLY RECONCILED: post-`tc_ingress` admission into target kernel socket receive buffer.
- **TF-07 Changed-condition objects** — reproducible fixtures required for token eviction, TTL expiry, target mismatch, replay, malformed framing, clock skew and upstream/runtime conflict.
- **TF-08 Route surface** — exact test interface, namespace topology, destination service, alternate in-scope route analysis and outside-scope declarations must be frozen.
- **TF-09 Evidence package** — clocks, pcap, kernel events, map mutation events, receipt public key, receipt verifier, hashes and environment identity must be frozen.
- **TF-10 Acceptance criteria** — PASS/FAIL/INCOMPLETE conditions for F0-F9 must be frozen before execution.
- **TF-11 Replay package** — if replay is used, replay inputs/environment/operator must be separately attributable and may not alter the original result.
- **TF-12 Publication/confidentiality** — public, controlled and excluded evidence boundaries must be frozen.

---

## 16. S0-S7 EXAMINATION RUNTIME BINDING

R1 will reuse the TA-14 consequence-examination runtime rather than creating a new lifecycle.

- **S0 — Frozen baseline:** identities, artifacts, VECT interface, route, proposition, fixtures and acceptance criteria frozen.
- **S1 — Initial supportable state:** establish valid VECT, valid temporal authority and valid target capable of permitted progression.
- **S2 — Authority / evidence established:** demonstrate the exact VECT and Velos native canonical map state used by the route.
- **S3 — Material condition change:** introduce the frozen invalidity, revocation, conflict, replay, malformed-input or skew condition.
- **S4 — Native reassessment:** observe Velos native evaluation under the changed condition without substituting TA-14 logic.
- **S5 — Consequential commitment challenge:** issue the frozen challenged action toward the declared execution boundary.
- **S6 — Alternate-route / bypass challenge:** test only the frozen in-scope alternate-route proposition, while preserving outside-scope routes as explicit non-claims.
- **S7 — Outcome and restoration evidence:** preserve whether socket admission occurred or was prevented, receipt/evidence continuity, active-flow teardown where applicable, and any natively supported restoration state.

---

## 17. PRELIMINARY ACCEPTANCE LOGIC

### SUPPORTED
The admitted frozen evidence establishes all required P1 sub-propositions within the declared environment and route, including pre-socket prevention and evidence correspondence.

### PARTIALLY_SUPPORTED
One or more material sub-propositions are established, but at least one required proposition remains unresolved without defeating all bounded findings.

### UNSUPPORTED
The admitted frozen evidence does not establish the R1 proposition within scope, including where the challenged packet reaches the target socket receive buffer when refusal was required.

### INDETERMINATE
The evidence is insufficient, contradictory, corrupted, unavailable, or methodologically incapable of supporting a bounded determination.

A determination describes what the admitted evidence establishes about the frozen proposition. It does not create universal certification and does not establish architecture-wide behavior outside the frozen route.

---

## 18. TECHNICAL FREEZE READINESS ITEMS REMAINING

Participant factual reconciliation is complete. The following are now implementation/evidence freeze items rather than terminology questions:

1. exact TA-14 Gateway artifact/version that produces the VECT;
2. frozen VECT JSON schema artifact and hash;
3. exact Velos control-plane/map-loader artifact and hash;
4. exact eBPF object/program artifact and hash;
5. exact kernel build, container/image identity, namespace topology and interface identifiers;
6. target execution service identity and socket binding;
7. receipt public key identity and offline verification procedure/tool;
8. packet-capture tool/configuration and capture interface;
9. PTP/clock-source identity and synchronization-health evidence;
10. reproducible fixtures for F0-F9;
11. final acceptance criteria for each F0-F9 challenge;
12. participant acceptance of the frozen proposition/non-claims;
13. publication/confidentiality boundary;
14. replay terms, if replay will be permitted.

---

## 19. STATUS

**FACTUALLY RECONCILED — TECHNICAL FREEZE READINESS REVIEW PENDING**

Participant factual review is complete and incorporated. No Technical Freeze has yet been established. No R1 execution is authorized by this document. No interoperability finding exists.

**Next controlled step:** complete the Section 18 artifact/evidence identities and acceptance criteria, then issue the R1 Technical Freeze readiness decision.
