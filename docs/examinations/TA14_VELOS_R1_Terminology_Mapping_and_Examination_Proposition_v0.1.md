# TA-14 × VELOS R1 — TERMINOLOGY MAPPING + FORMAL EXAMINATION PROPOSITION

**Document:** TA14-VELOS-R1-SCOPE-001  
**Version:** v0.1  
**Status:** DRAFT — PARTICIPANT FACTUAL REVIEW REQUIRED  
**Participant Registry Identity:** TA-14-AIGR-000029  
**Participant:** Velos Systems  
**Participant Version:** v1.0.0 — Layer-4 Deterministic Enforcement Substrate  
**Participant Route Specification:** Velos Systems Route Specification v1.0.0  
**TA-14 Examination Role:** freeze proposition, evidence boundary, chronology, acceptance criteria, and finding boundary without rewriting either architecture.

---

## 1. PURPOSE

This instrument establishes the preliminary terminology map and bounded proposition for a bilateral TA-14 × Velos interoperability examination.

It does **not** establish interoperability, validate Velos performance claims, establish comparative superiority, or authorize production reliance.

The purpose of R1 is narrower:

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

## 4. PRELIMINARY TERMINOLOGY MAP

| TA-14 examination concept | Velos participant-authored concept | Mapping boundary |
|---|---|---|
| Registered architecture/version identity | TA-14-AIGR-000029 / Velos v1.0.0 | Identity linkage only; no claim validation |
| Admissibility determination | Upstream attestation / authority context presented to Velos | Interface correspondence to be frozen; not semantic equivalence |
| Authority state | Token hash existence / revocation state | Velos native invariant remains Velos-defined |
| Temporal authority validity | Authority Lease TTL | Mapping limited to declared execution-window condition |
| Consequence scope | Allowable target socket tuple | Velos target-bound enforcement surface |
| Binding / carried decision state | Attestation-envelope state committed into canonical kernel map | Exact carrier format and provenance must be frozen before execution |
| Execution boundary | tc_ingress decision point before destination application socket | R1 must prove the declared boundary empirically |
| Permitted progression | TC_ACT_OK | Indicates Velos pass behavior only; not a TA-14 ALLOW finding by itself |
| Refusal / prohibited progression | TC_ACT_SHOT and declared channel teardown behavior | Must be distinguished from observation-only logging |
| Refusal evidence | bpf_ringbuf event + Governance Refusal Receipt | Integrity, attribution, chronology and correlation must be examined |
| Changed authority condition | Dynamic canonical-map invalidation / changed runtime state | Exact update timing and next-action behavior must be frozen |
| Evidence continuity | Telemetry-to-receipt chain | Must preserve correspondence from challenged action to refusal evidence |

### Mapping rule

The terminology map is an interface aid, not an equivalence declaration. If either participant rejects a mapping as technically inaccurate, the mapping must be corrected before Technical Freeze.

---

## 5. R1 FORMAL PROPOSITION

### Proposition P1 — Active pre-execution interdiction

**Can a frozen TA-14 determination be carried across the declared interface into Velos v1.0.0 such that a consequential action determined inadmissible within the frozen TA-14 proposition is refused by Velos before the action crosses the declared execution boundary, while producing independently inspectable evidence sufficient to distinguish active interdiction from passive observation or post-event recording?**

### Sub-propositions

**P1-A — Interface correspondence**  
The frozen TA-14 state is conveyed into Velos through the exact declared carrier without semantic substitution or undeclared authority creation.

**P1-B — Native evaluation**  
Velos evaluates the received state using its declared native invariants rather than a TA-14-authored replacement decision engine.

**P1-C — Pre-execution refusal**  
When the frozen challenge condition requires refusal, the challenged consequence does not cross the declared Velos execution boundary.

**P1-D — Evidence correspondence**  
The preserved event and receipt can be correlated to the challenged action, native Velos determination, execution cut, and chronology.

**P1-E — Active enforcement distinction**  
The admitted evidence is sufficient to distinguish active prevention from passive detection, alerting, recording, or retrospective explanation.

---

## 6. EXPLICIT NON-CLAIMS

R1 does not establish:

1. that TA-14 and Velos are universally interoperable;
2. that Velos implements TA-14 architecture;
3. that TA-14 controls Velos native kernel logic;
4. that any Velos participant-authored performance statement is validated merely by registration or preservation;
5. that the declared **< 4.0 µs** latency profile is established unless measurement methodology, environment, samples, clocks, load conditions and preserved results are separately frozen and admitted;
6. that TC_ACT_SHOT, TCP_RST, or any other declared mechanism prevents consequences outside the frozen route and environment;
7. that a successful R1 result establishes security, safety, compliance, certification, or superiority beyond the proposition;
8. any Sovereign Kinetic dependency, physical backstop, or three-architecture chain.

---

## 7. PRELIMINARY FAILURE-CONDITION MATRIX

| ID | Challenge | TA-14-side state to freeze | Velos participant-authored expected behavior | Examination question |
|---|---|---|---|---|
| F0 | Valid authority / valid lease / valid target | admissible within frozen proposition | canonical match → TC_ACT_OK | Does permitted progression correspond to the frozen state? |
| F1 | Unknown or revoked authority token | inadmissible | map miss / refusal | Is progression actually prevented before execution? |
| F2 | Expired authority lease | inadmissible | TTL failure → refusal | Is temporal invalidity enforced at the declared boundary? |
| F3 | Out-of-scope target tuple | inadmissible | tuple mismatch → refusal | Can a valid authority state escape its declared target scope? |
| F4 | Authority changes after initial admissibility | prior state no longer supportable | map invalidation / next packet refused | Does stale prior authority continue to carry execution standing? |
| F5 | Upstream state conflicts with Velos runtime state | conflict explicitly frozen | Velos native fail-closed behavior claimed | Which state governs actual progression and what evidence proves it? |
| F6 | Refusal evidence continuity | refusal required | ring-buffer event → Governance Refusal Receipt | Can the receipt be bound to the exact challenged action and refusal chronology? |

---

## 8. TECHNICAL FREEZE GATES — R1 PRELIMINARY

No execution may count as R1 evidence until all applicable freeze gates are satisfied and preserved.

- **TF-01 Participant authority** — authorized Velos participant acceptance of frozen scope.
- **TF-02 Architecture identity** — TA-14-AIGR-000029 and exact Velos v1.0.0 artifact identity.
- **TF-03 Artifact integrity** — hashes/identities for route specification, runtime artifacts, configuration, test harness and evidence collectors.
- **TF-04 Claims and non-claims** — P1/P1-A through P1-E and Section 6 accepted.
- **TF-05 Native semantics** — terminology mapping factually accepted by both sides.
- **TF-06 Consequence boundary** — exact point at which the challenged action is considered to have crossed into consequential execution.
- **TF-07 Changed-condition objects** — token revocation, TTL expiry, tuple change, authority mutation and conflict states represented as reproducible fixtures.
- **TF-08 Route surface** — exact interface, network path, kernel hook, destination, bypass surfaces and alternate routes.
- **TF-09 Evidence package** — clocks, logs, packet evidence, kernel events, receipts, hashes, environment identity and collection method.
- **TF-10 Acceptance criteria** — PASS/FAIL/INCOMPLETE conditions for each challenge frozen before execution.
- **TF-11 Replay package** — if replay is used, replay inputs/environment/operator are separately attributable and cannot alter the original result.
- **TF-12 Publication/confidentiality** — public, controlled and excluded evidence boundaries frozen.

---

## 9. S0–S7 EXAMINATION RUNTIME BINDING

R1 will reuse the TA-14 consequence-examination runtime rather than creating a new lifecycle.

- **S0 — Frozen baseline:** identities, artifacts, interface, proposition, fixtures and acceptance criteria frozen.
- **S1 — Initial supportable state:** establish a valid authority / valid lease / valid target route capable of permitted progression.
- **S2 — Authority / evidence established:** demonstrate the exact carried state and Velos native canonical state used by the route.
- **S3 — Material condition change:** introduce the frozen invalidity or conflict condition.
- **S4 — Native reassessment:** observe Velos native evaluation under the changed condition without substituting TA-14 logic.
- **S5 — Consequential commitment challenge:** issue the frozen challenged action toward the declared execution boundary.
- **S6 — Alternate-route / bypass challenge:** challenge any declared alternate route that could allow the same frozen consequence to cross the boundary without the examined control.
- **S7 — Outcome and restoration evidence:** preserve whether execution occurred or was prevented, receipt/evidence continuity, and any natively supported restoration state.

---

## 10. PRELIMINARY ACCEPTANCE LOGIC

### SUPPORTED
The admitted frozen evidence establishes all required P1 sub-propositions within the declared environment and route, including pre-execution prevention and evidence correspondence.

### PARTIALLY_SUPPORTED
One or more material sub-propositions are established, but at least one required proposition remains unresolved without defeating all bounded findings.

### UNSUPPORTED
The admitted frozen evidence does not establish the R1 proposition within scope, including where the challenged consequence crosses the declared execution boundary when refusal was required.

### INDETERMINATE
The evidence is insufficient, contradictory, corrupted, unavailable, or methodologically incapable of supporting a bounded determination.

A determination describes what the admitted evidence establishes about the frozen proposition. It does not establish the opposite architecture-wide proposition and does not create universal certification.

---

## 11. OPEN ITEMS BEFORE v0.2

Participant factual review is required for:

1. exact name and field structure of the TA-14-to-Velos carrier object;
2. whether the participant accepts "upstream attestation / authority context" as the neutral mapped phrase for the input boundary;
3. exact tc hook/interface identity and test network path;
4. exact consequence/execution-crossing point for R1;
5. whether TCP_RST is required for every frozen refusal vector or only specific cases;
6. exact canonical_state_map mutation/revocation behavior and timing semantics;
7. exact Governance Refusal Receipt fields, key custody, signing method and verification procedure;
8. declared alternate/bypass route surface for S6;
9. evidence clocks and correlation method across TA-14, control plane, kernel event and receipt;
10. whether latency measurement is excluded from R1 or separately included under a frozen measurement protocol.

---

## 12. STATUS

**DRAFT — PARTICIPANT FACTUAL REVIEW REQUIRED**

No Technical Freeze has been established by this document. No R1 execution is authorized by this document. No interoperability finding exists.

Next controlled step: participant factual reconciliation of Section 4 terminology and Section 11 open items, followed by v0.2 and Technical Freeze readiness review.
