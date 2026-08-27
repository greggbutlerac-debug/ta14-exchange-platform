# TA-14 × VELOS R1 — ARTIFACT IDENTITY + ACCEPTANCE CRITERIA PACKAGE

**Document:** TA14-VELOS-R1-AIAC-001  
**Version:** v0.1  
**Status:** DRAFT — UNFROZEN ARTIFACT IDENTITIES REMAIN  
**Related Scope:** TA14-VELOS-R1-SCOPE-001 v0.2  
**Related Readiness Matrix:** TA14-VELOS-R1-TFR-001 v0.1  
**Participant Registry Identity:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0 — Layer-4 Deterministic Enforcement Substrate

---

## 1. PURPOSE

This package prepares the exact executable and evidentiary identities required for TA-14 × Velos R1 Technical Freeze and fixes the PASS / FAIL / INCOMPLETE logic for challenges F0-F9.

This package does **not** establish Technical Freeze. Every artifact value not already preserved is marked **UNFROZEN** and must be replaced by exact identity, version, configuration, and hash information before R1 execution may count as examination evidence.

---

## 2. GOVERNING R1 PROPOSITION

**Can a frozen TA-14 determination be carried across the declared interface into Velos v1.0.0 such that a consequential action determined inadmissible within the frozen TA-14 proposition is refused by Velos before the action crosses the declared execution boundary, while producing independently inspectable evidence sufficient to distinguish active interdiction from passive observation or post-event recording?**

Execution-crossing point remains:

> An admitted packet traverses past `tc_ingress` and is delivered into the kernel socket receive buffer of the frozen target execution service.

Authoritative refusal cut remains:

> `TC_ACT_SHOT` at `tc_ingress` before target socket receive-buffer admission.

Performance measurement remains explicitly excluded from R1.

---

## 3. ARTIFACT IDENTITY MANIFEST

| ID | Artifact / evidence object | Required frozen identity | Current state |
|---|---|---|---|
| A-01 | TA-14 VECT producer / Gateway | artifact name, version, source/binary identity, deployment identity, SHA-256 | **UNFROZEN** |
| A-02 | VECT schema | canonical machine-readable JSON schema, version, SHA-256 | **UNFROZEN** |
| A-03 | Valid VECT fixture | exact canonical JSON bytes + SHA-256 | **UNFROZEN** |
| A-04 | Malformed VECT fixture | exact bytes + expected schema failure + SHA-256 | **UNFROZEN** |
| A-05 | Replay VECT fixture | exact nonce/idempotency state + SHA-256 | **UNFROZEN** |
| A-06 | Expired VECT fixture | exact temporal-authority fields + SHA-256 | **UNFROZEN** |
| A-07 | Clock-skew VECT fixture | exact timestamps/skew condition + SHA-256 | **UNFROZEN** |
| A-08 | Out-of-scope target VECT fixture | exact target binding + SHA-256 | **UNFROZEN** |
| A-09 | Velos control-plane / map loader | artifact name/version/source or binary hash | **UNFROZEN** |
| A-10 | Velos eBPF program/object | source commit, build identity, object hash, section/program identity | **UNFROZEN** |
| A-11 | `canonical_state_map` definition | map name/type/key/value schema and pinned path | **UNFROZEN** |
| A-12 | Revocation/mutation mechanism | exact command/tool/API and version | **UNFROZEN** |
| A-13 | Kernel environment | exact kernel release/build, architecture, relevant config identity | **UNFROZEN** |
| A-14 | Container/runtime image | immutable image digest or equivalent runtime package hash | **UNFROZEN** |
| A-15 | Namespace/network topology | topology diagram/record, interface names, bridge/veth IDs, addresses | **UNFROZEN** |
| A-16 | tc attachment | exact interface, clsact qdisc, ingress filter/program attachment evidence | **UNFROZEN** |
| A-17 | Target execution service | artifact name/version/hash | **UNFROZEN** |
| A-18 | Target socket fixture | protocol, IP, port, namespace and service binding | **UNFROZEN** |
| A-19 | Challenge payload | exact bytes/object + SHA-256 | **UNFROZEN** |
| A-20 | Kernel/ring-buffer event schema | schema/version/hash | **UNFROZEN** |
| A-21 | Event collector | artifact/version/hash and invocation | **UNFROZEN** |
| A-22 | Governance Refusal Receipt schema | exact canonical schema/version/hash | **UNFROZEN** |
| A-23 | Receipt signer public identity | signer URN + Ed25519 public-key fingerprint | **UNFROZEN** |
| A-24 | Offline receipt verifier | artifact/tool/version/hash and procedure | **UNFROZEN** |
| A-25 | Packet capture tool | tool/version + command/configuration | **UNFROZEN** |
| A-26 | Packet capture interface/filter | exact interface, BPF/filter expression, start/stop rules | **UNFROZEN** |
| A-27 | PTP / wall-clock source | source identity and sync-health evidence procedure | **UNFROZEN** |
| A-28 | Monotonic chronology source | kernel clock source and event extraction method | **UNFROZEN** |
| A-29 | Evidence package directory/manifest | deterministic evidence layout + manifest hash procedure | **UNFROZEN** |
| A-30 | Publication/confidentiality declaration | public / controlled / excluded classification for each artifact class | **UNFROZEN** |
| A-31 | Replay declaration | `NO REPLAY` or frozen replay operator/method/environment | **UNFROZEN** |

### Identity rule

No artifact is frozen merely because its type or conceptual role is known. Where hashing is technically applicable, the exact bytes or immutable build identity must be preserved before execution.

---

## 4. REQUIRED EVIDENCE CHANNELS

Every R1 refusal challenge must preserve the following evidence channels where applicable:

- **E1 — Source / proposition evidence:** exact TA-14-side determination and VECT identity;
- **E2 — Velos control-plane evidence:** ingestion, validation, map insertion/eviction or rejection;
- **E3 — Kernel enforcement evidence:** `tc_ingress` evaluation and actual action code;
- **E4 — Network evidence:** pcap sufficient to observe progression or absence of progression across the declared cut;
- **E5 — Target/sink evidence:** evidence establishing whether the challenged packet entered the target service kernel socket receive buffer;
- **E6 — Receipt evidence:** signed Governance Refusal Receipt where one is expected;
- **E7 — Chronology/correlation evidence:** `assertion_id`, token fingerprint, packet/header hash, timestamps and causal linkage across E1-E6;
- **E8 — Artifact integrity evidence:** hashes/identities proving the runtime and evidence collectors match the frozen manifest.

No single evidence channel substitutes for the others when the proposition requires independent distinction between active interdiction and post-event recording.

---

## 5. F0 — VALID AUTHORITY / VALID LEASE / VALID TARGET

### Frozen initial state

- valid VECT;
- recognized capability token fingerprint;
- temporal authority within frozen window;
- target binding matches frozen target socket;
- no replay violation;
- Velos native runtime state consistent with progression.

### Exact action issued

Send the frozen challenge payload toward the frozen target service using the frozen route.

### Expected Velos-native disposition

`TC_ACT_OK`.

### PASS

PASS only if all are established:

1. frozen VECT identity is proven;
2. Velos native state recognizes the frozen capability;
3. `tc_ingress` returns permitted progression consistent with `TC_ACT_OK`;
4. packet/network evidence shows the challenged packet progresses beyond the enforcement point;
5. target/sink evidence shows socket receive-buffer admission for the frozen target service;
6. evidence remains correlated to the same assertion/action identity.

### FAIL

FAIL if the valid frozen route is refused, altered, redirected, or otherwise fails to produce the declared permitted progression under the frozen environment without an admitted external cause.

### INCOMPLETE

INCOMPLETE if progression may have occurred but source, kernel, network, sink or chronology evidence cannot establish the exact route result.

---

## 6. F1 — UNKNOWN / ABSENT / EVICTED CAPABILITY TOKEN

### Frozen changed condition

The challenged capability token fingerprint is absent from the frozen Velos canonical state at evaluation time.

### Expected Velos-native disposition

Map lookup miss → `TC_ACT_SHOT`.

### PASS

PASS only if:

1. token absence/eviction is independently evidenced before the challenged packet evaluation;
2. `tc_ingress` enforcement evidence shows `TC_ACT_SHOT` for the challenged action;
3. pcap shows no prohibited progression beyond the frozen enforcement cut;
4. target/sink evidence establishes no socket receive-buffer admission;
5. receipt/evidence continuity binds the refusal to the exact challenged action where a receipt is expected;
6. chronology establishes refusal before execution-crossing.

### FAIL

FAIL if the challenged packet reaches the target socket receive buffer, if Velos admits the unknown/evicted capability, or if evidence proves only after-the-fact recording rather than enforcement.

### INCOMPLETE

INCOMPLETE if a drop is observed but token state, kernel action, sink non-admission, or chronology cannot be attributed sufficiently.

---

## 7. F2 — EXPIRED TEMPORAL AUTHORITY

### Frozen changed condition

VECT temporal authority is expired at evaluation time under the frozen clock/skew model.

### Expected Velos-native disposition

Temporal validity failure → `TC_ACT_SHOT`.

### PASS

PASS only if the frozen clocks establish expiry before the challenge, `TC_ACT_SHOT` is attributed to the exact packet/action, target admission does not occur, and receipt/evidence correlation identifies `LEASE_EXPIRED` or the frozen equivalent reason.

### FAIL

FAIL if an expired VECT retains execution standing and the challenged packet reaches the target socket receive buffer.

### INCOMPLETE

INCOMPLETE if expiry cannot be proven under the frozen clock sources/skew tolerance or if refusal cannot be causally tied to expiry.

---

## 8. F3 — OUT-OF-SCOPE TARGET BINDING

### Frozen changed condition

A VECT that is otherwise valid is challenged against a destination outside its frozen target binding.

### Expected Velos-native disposition

Target mismatch → `TC_ACT_SHOT`.

### PASS

PASS only if the exact target mismatch is evidenced, the packet is refused at `tc_ingress`, the out-of-scope destination receives no socket admission, and chronology/correlation remain intact.

### FAIL

FAIL if valid authority can be used to reach the frozen out-of-scope target through the examined route.

### INCOMPLETE

INCOMPLETE if target identity or route identity is ambiguous, or if sink evidence cannot establish whether the wrong target received the challenged action.

---

## 9. F4 — AUTHORITY MUTATION AFTER INITIAL ADMISSIBILITY

### Frozen initial state

A previously valid VECT/capability state is established and an active flow condition is created if active-flow teardown is part of the frozen challenge.

### Frozen changed condition

Capability token state is synchronously evicted using the frozen revocation mechanism.

### Expected Velos-native disposition

- next challenged packet: map miss → `TC_ACT_SHOT`;
- active established TCP flow: `TCP_RST` only if included by the frozen active-flow fixture;
- already fully acknowledged prior transmissions remain outside retroactive reversal.

### PASS

PASS only if:

1. map mutation chronology is preserved;
2. the challenged post-revocation packet is issued after mutation effectiveness;
3. `TC_ACT_SHOT` prevents post-revocation socket admission;
4. any required `TCP_RST` behavior is separately evidenced for the frozen active-flow case;
5. prior acknowledged traffic is distinguished from prohibited post-revocation progression.

### FAIL

FAIL if stale pre-revocation authority continues to admit a post-revocation challenged packet through the examined route.

### INCOMPLETE

INCOMPLETE if the mutation effective time, packet ordering, active-flow state or sink chronology cannot be established.

---

## 10. F5 — UPSTREAM STATE CONFLICTS WITH VELOS RUNTIME STATE

### Frozen changed condition

The upstream carrier indicates standing that conflicts with the frozen Velos runtime/canonical state.

### Expected Velos-native disposition

Velos native runtime/map state governs the packet disposition. No TA-14-authored replacement decision logic is introduced inside Velos.

### PASS

PASS only if the conflict is proven, Velos evaluates under its frozen native state, the actual network/sink disposition corresponds to that native state, and the evidence demonstrates which state governed execution.

### FAIL

FAIL if undeclared logic, implicit override, authority laundering, or semantic substitution governs progression contrary to the frozen interface and native-semantics boundary.

### INCOMPLETE

INCOMPLETE if the two conflicting states cannot be independently established or if the actual governing state cannot be attributed from preserved evidence.

---

## 11. F6 — REFUSAL EVIDENCE CONTINUITY

### Frozen challenge

Use one frozen refusal vector to examine whether all evidence objects bind to the same challenged action and refusal chronology.

### Expected evidence chain

VECT / assertion → control-plane state → kernel event → pcap/sink observation → Governance Refusal Receipt.

### PASS

PASS only if the evidence package permits independent correlation of the same challenged action across the required channels and validates the receipt signature using the frozen public verification identity.

### FAIL

FAIL if the receipt or telemetry corresponds to a different action, chronology contradicts pre-execution refusal, the signature is invalid, or sink evidence establishes prohibited execution despite a refusal receipt.

### INCOMPLETE

INCOMPLETE if one or more required correlation identifiers, timestamps, hashes, signature artifacts or evidence channels are absent or methodologically insufficient.

---

## 12. F7 — MALFORMED / SCHEMA-INVALID VECT

### Frozen changed condition

Present the frozen malformed/schema-invalid VECT fixture.

### Expected Velos-native disposition

Rejected before BPF map insertion; no execution standing acquired.

### PASS

PASS only if schema/input validation rejects the exact fixture before canonical-state insertion and no challenged packet obtains permitted progression from that malformed carrier.

### FAIL

FAIL if malformed input acquires canonical execution standing or enables target socket admission through the frozen route.

### INCOMPLETE

INCOMPLETE if rejection is observed but insertion state, reason, or resulting route behavior cannot be independently established.

---

## 13. F8 — REPLAY / NONCE VIOLATION

### Frozen changed condition

Re-use the frozen nonce/assertion beyond the declared idempotency/retransmission constraints.

### Expected Velos-native disposition

Replay detected → refusal.

### PASS

PASS only if the replay constraint is proven exceeded, the replayed challenge is refused before socket admission, and the evidence/receipt identifies `REPLAY_DETECTED` or frozen equivalent.

### FAIL

FAIL if replayed authority is accepted beyond the frozen allowed retransmission/session constraint and reaches the target socket.

### INCOMPLETE

INCOMPLETE if nonce/session state or retransmission count cannot be independently reconstructed.

---

## 14. F9 — CLOCK SKEW EXCEEDS FROZEN TOLERANCE

### Frozen changed condition

Create a carrier/evaluation condition outside the participant-declared ±5.0 ms maximum skew tolerance.

### Expected Velos-native disposition

Clock trust fails closed → refusal with `CLOCK_SKEW_EXCEEDED` or frozen equivalent.

### PASS

PASS only if the skew magnitude is independently demonstrated using the frozen clock sources, refusal occurs before target socket admission, and the evidence package causally attributes the refusal to the skew condition.

### FAIL

FAIL if a carrier outside the frozen skew tolerance retains execution standing and the challenged packet reaches the target socket receive buffer.

### INCOMPLETE

INCOMPLETE if actual skew cannot be proven, clock health is unknown, or refusal cannot be distinguished from another cause.

---

## 15. GLOBAL FAILURE RULES

Regardless of challenge-specific expectations, a refusal challenge cannot be marked PASS if any of the following occur:

- target socket receive-buffer admission is established for the challenged prohibited packet;
- kernel evidence is absent and the claimed execution cut cannot otherwise be independently proven;
- evidence shows only detection, alerting, receipt generation or logging after prohibited execution;
- the challenged action cannot be bound to the frozen VECT/assertion identity;
- runtime artifacts differ materially from the frozen artifact manifest;
- the declared route was bypassed or the challenged action used an unfrozen path;
- acceptance criteria were modified after execution to accommodate the observed result.

---

## 16. GLOBAL INCOMPLETE RULES

An R1 challenge is INCOMPLETE rather than PASS or FAIL when the evidence cannot support a defensible determination because of:

- missing or corrupted source evidence;
- missing kernel event evidence;
- missing target/sink evidence;
- missing packet capture where required;
- missing or unverifiable receipt signature;
- clock/synchronization uncertainty that defeats chronology;
- ambiguous artifact identity;
- inability to prove the challenged route used the frozen enforcement point;
- contradictory evidence not resolvable under the frozen methodology;
- execution environment divergence from the frozen manifest.

INCOMPLETE is preserved as an evidentiary condition and must not be rewritten into PASS after execution without a new controlled examination run.

---

## 17. PUBLICATION / CLAIM BOUNDARY

No R1 result may state or imply:

- universal TA-14 × Velos interoperability;
- architecture-wide Velos non-bypassability;
- validated `<4.0 µs` latency performance;
- protection of unmonitored host paths, direct IPC, loopback or other routes expressly outside the frozen scope;
- security, safety, compliance, certification or comparative superiority beyond the frozen proposition;
- Sovereign Kinetic participation or physical-backstop validation.

---

## 18. FREEZE COMPLETION CHECKLIST

Before this package can become a frozen acceptance package:

- [ ] A-01 through A-31 resolved to exact values or explicitly declared not applicable;
- [ ] all hashable artifacts hashed and recorded;
- [ ] F0-F9 fixture files/commands preserved;
- [ ] F0-F9 evidence-channel requirements confirmed technically available;
- [ ] target/sink observation method verified;
- [ ] receipt verification method independently runnable;
- [ ] publication/confidentiality state declared;
- [ ] replay state declared;
- [ ] participant accepts final artifact identities and acceptance criteria;
- [ ] TA-14 Technical Freeze record issued.

---

## 19. STATUS

**DRAFT — UNFROZEN ARTIFACT IDENTITIES REMAIN**

The R1 acceptance grammar is now explicit and predeclared. Technical Freeze remains **HOLD** because executable identities and evidence collection artifacts have not yet been inserted into A-01 through A-31.

**Next controlled action:** obtain and preserve the actual Velos runtime/evidence artifact identities and the exact TA-14 VECT producer/schema/fixtures, then revise this package to v0.2 for final participant freeze acceptance.
