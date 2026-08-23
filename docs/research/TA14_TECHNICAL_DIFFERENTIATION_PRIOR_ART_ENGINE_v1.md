# TA-14 Technical Differentiation & Prior-Art Engine v1

**Status:** OPEN RESEARCH RECORD — no novelty or patentability conclusion is self-awarded.

**Purpose:** Test TA-14's asserted architectural differentiation against the strongest known pre-existing and contemporary comparators. This record separates established components, potentially differentiating composition/semantics, later/contemporary convergence, and questions requiring claim-by-claim patent counsel review.

## Governing rule

Do not ask whether another system uses TA-14 vocabulary. Ask whether it discloses the same operative mechanism. A component is not novel merely because TA-14 gives it a different name. A combination is not novel merely because its components are old. Any surviving differentiation must be stated as a bounded mechanism and tested against dated evidence.

## TA-14 executable reference object

Current executable harness: `apps/web/lib/execution-artifacts/execution-harness.ts`.

`REALITY -> RECORD -> CONTINUITY -> ADMISSIBILITY -> BINDING -> COMMIT -> EXECUTION -> OUTCOME`

Determinations: `ALLOW | HOLD | DENY | ESCALATE`. Required predicates are evaluated stage-by-stage; a non-passing predicate terminates progression with its configured governed determination; downstream stages are not reached. The package preserves specification, trace, receipt, manifest and root hash. Expected determination is asserted after execution rather than supplied as the runtime answer.

## Candidate differentiation propositions

- **DP-01 — Proposition-specific evidentiary standing before consequence.** Required evidence must have standing for the particular proposition on which the consequence depends; authentication or a generic Permit is not sufficient by itself.
- **DP-02 — Continuity of standing through the consequence boundary.** Previously valid authority/evidence can lose standing after material change and require requalification.
- **DP-03 — Ordered separation of admissibility, binding, commit and execution.** Evidence qualification, consequence binding, bounded commitment and execution are represented as distinct governed states.
- **DP-04 — Semantically distinct non-ALLOW outcomes.** HOLD, DENY and ESCALATE represent different governance conditions rather than interchangeable failure labels.
- **DP-05 — Outcome is evidence-bearing closure, not retroactive authorization.** Execution does not prove its own prerequisites; outcome evidence closes the bounded chain and may require independent observation.
- **DP-06 — Evidence-bearing reconstruction of the determination path.** Frozen specification, stage trace, receipt, hashes and manifest preserve how and where the determination formed.
- **DP-07 — Alternate-route/bypass challenge as part of execution standing.** A protected consequence is not considered governed if it remains reachable through an ungoverned alternate route inside the tested boundary.

## Established mechanisms TA-14 should NOT claim to have invented

Sensors/external-state acquisition; programmed conditional control; authentication/authorization/RBAC; Permit/Deny policy decisions; policy decision/enforcement points; ongoing authorization and revocation; environmental/system conditions as authorization inputs; obligations/advice; audit/event histories; hashing/signatures/manifests; ordered workflows; authorized functionaries; provenance chains; generic fail-closed gates.

## Primary dated comparator record

### UCONABC — Park & Sandhu, ACM TISSEC, 1 Feb 2004, DOI 10.1145/984334.984339
Integrates Authorizations, oBligations and Conditions and expressly covers continuity/ongoing controls and mutability. Conditions include environmental/system requirements. The model addresses ongoing control and immediate revocation.

### XACML 3.0 — OASIS standard, pre-TA-14
Defines PDP/PEP authorization decisions of Permit, Deny, Indeterminate and NotApplicable; conditions; obligations/advice; combining algorithms; and enforcement behavior. A PEP may condition Permit on its ability to discharge obligations.

### NIST SP 800-207 Zero Trust Architecture — Aug 2020
Separates policy engine, policy administrator and policy enforcement point. The policy engine uses enterprise policy plus supporting/external information to grant, deny or revoke access; the administrator executes the decision; the PEP enables, monitors and terminates access.

### in-toto — public pre-TA-14
Defines signed layouts containing ordered steps, requirements and authorized functionaries; signed link metadata records materials, products, commands and byproducts; client verification checks the final product against the layout. Layout freshness/expiration is also verified.

### Johnson Controls Metasys — documented pre-TA-14/current manuals examined
Establishes physical state acquisition, programmed control, authenticated/authorized commands, protected operations and audit/history. This defeats broad claims that conditional physical control, authorization, refusal or command logging are themselves TA-14 inventions.

## Limitation-by-limitation matrix — v1

Legend: **S** = substantially disclosed by comparator; **P** = partial/analogous disclosure; **N/E** = not established in the evidence reviewed; **OPEN** = deeper implementation/patent review required.

| TA-14 proposition | UCONABC | XACML | NIST ZTA | in-toto | Metasys | v1 pressure finding |
|---|---|---|---|---|---|---|
| DP-01 proposition-specific evidentiary standing | P | P | P | P | N/E | **SURVIVES NARROWLY.** All can consume attributes/evidence-like information, but reviewed sources do not establish TA-14's claimed distinction between evidence existence/integrity and proposition-specific admissible standing as a separately governed pre-consequence state. |
| DP-02 continuity through consequence boundary | **S** | P | **S** | P (expiry/freshness) | P | **BROAD CLAIM DEFEATED.** UCON expressly teaches decision continuity/ongoing control and immediate revocation; ZTA teaches grant/deny/revoke using current supporting information. TA-14 differentiation cannot rest on continuity alone. |
| DP-03 separate admissibility -> binding -> commit -> execution | P | P | P | P | P | **SURVIVES, HIGH OBVIOUSNESS PRESSURE.** PDP/PEP and workflow/provenance systems separate decision from enforcement and ordered steps, but the exact four-state semantic decomposition has not yet been established as one pre-TA-14 mechanism. Mere relabeling would not be enough. |
| DP-04 HOLD vs DENY vs ESCALATE semantics | P | **S/P** | P | N/E | P | **LABEL NOVELTY DEFEATED; OPERATIVE SEMANTICS OPEN.** XACML already has Permit/Deny/Indeterminate/NotApplicable and obligations/advice. TA-14 must prove materially different consequence behavior, especially HOLD vs ESCALATE. |
| DP-05 outcome evidence closes but does not authorize | P | N/E | P | **P/S** | P | **SURVIVES NARROWLY.** in-toto strongly anticipates post-step evidence/verification. What remains open is TA-14's rule that outcome cannot cure missing pre-execution standing and closes a consequence-governance chain rather than merely verifying workflow/product conformance. |
| DP-06 reconstructable evidence-bearing determination path | P | P | P | **S** | P | **BROAD CLAIM DEFEATED.** Signed layouts/link metadata and verification strongly anticipate reconstructable evidence chains; TA-14's narrower possible delta is reconstructing the *governed consequence determination*, including terminal non-progression semantics. |
| DP-07 alternate-route/bypass closure | P | P | P | N/E | P | **OPEN / HIGH PRESSURE.** Enforcement architectures assume protected resources are behind PEPs; bypass resistance is a known security requirement. TA-14 cannot claim bypass resistance generally; only a specific evidence requirement tying alternate-route closure to execution standing might survive. |

## Destructive finding 01 — CONTINUITY is not the novelty center

**Finding:** DP-02 as a broad proposition is defeated by pre-existing usage-control literature. UCONABC expressly generalizes access control to include continuity (ongoing controls), obligations, conditions and mutability and discusses immediate revocation. NIST ZTA later reinforces current-information grant/deny/revoke behavior.

**TA-14 correction:** Never claim that TA-14 invented the idea that authority/permission must remain valid as conditions change.

## Destructive finding 02 — Multiple determinations are not the novelty center

XACML already supplies Permit, Deny, Indeterminate and NotApplicable, plus obligations/advice and deterministic combining algorithms. Therefore the existence of four TA-14 labels is not a defensible novelty proposition.

**Surviving question:** Do HOLD and ESCALATE create distinct mandatory state transitions and authority consequences that cannot be reproduced by ordinary XACML decision + obligation/advice orchestration without adding an external governance state machine?

## Destructive finding 03 — Provenance/reconstruction is not the novelty center

in-toto already supplies signed ordered layouts, authorized functionaries, link metadata, materials/products/byproducts, verification and freshness/expiration checks.

**TA-14 correction:** Never claim that an ordered signed evidence chain, authorized actors, cryptographic reconstruction or replayability alone is novel.

**Surviving question:** Is the evidence object merely proving that steps occurred, or is proposition-specific evidentiary standing itself a prerequisite that controls whether a consequence is allowed to form at runtime?

## Destructive finding 04 — PDP/PEP separation is not the novelty center

NIST ZTA separates decision, administration and enforcement. XACML likewise distinguishes PDP and PEP. Metasys protects physical operations with authorization and execution controls.

**TA-14 correction:** Never claim that separating decision from enforcement, or checking policy before physical/digital execution, is itself novel.

## Stage-by-stage pressure map

| TA-14 stage | Closest established analogues | What TA-14 must still establish if differentiation is claimed |
|---|---|---|
| REALITY | sensor/system/environment attributes; PIPs; conditions | A technical mechanism beyond ordinary state/input acquisition. No standalone novelty position recommended. |
| RECORD | audit/event records; signed link metadata; attributes | A governed record whose evidentiary role is materially different from ordinary logs/provenance. Weak standalone novelty position. |
| CONTINUITY | UCON ongoing control; ZTA revoke; freshness/expiry | Broad novelty unavailable. Treat as inherited mechanism unless coupled to a narrower proposition-standing construct. |
| ADMISSIBILITY | XACML conditions/attributes; UCON predicates; provenance verification | Define why evidence can be authentic yet lack standing for a particular proposition, and show this state has operative consequences not reducible to a normal policy predicate. **Key candidate delta.** |
| BINDING | authorization decision; obligations; policy-to-PEP control | Define the object/transition by which admissible evidence becomes consequence-specific constraint. Must be more than renamed Permit/obligation. **Key candidate delta.** |
| COMMIT | PA/PEP command establishment; transaction/workflow commit concepts | Define a frozen consequence commitment distinct from authorization and execution, including what is cryptographically/evidentially fixed and what changes invalidate it. **Key candidate delta, high prior-art risk.** |
| EXECUTION | PEP, controller output, protected operation | No broad novelty position. Candidate distinction exists only in dependency on surviving upstream standing and evidence of terminal state. |
| OUTCOME | telemetry, history, in-toto products/byproducts/verification | Define closure semantics: outcome evidence cannot retroactively cure invalid execution standing; independent external observation may be required. **Candidate delta.** |

## Current strongest differentiation hypothesis — narrowed v2

The first-pass eight-stage story is too broad for a novelty proposition because multiple individual stages are strongly anticipated. The more defensible research hypothesis is now:

> **A proposition-standing consequence protocol in which evidence that is merely present, authentic or policy-relevant does not thereby possess execution standing; qualifying evidence is admitted for a bounded proposition, transformed into a consequence-specific binding, frozen at commit, and required to retain continuity through the execution boundary; materially different failure states force HOLD, DENY or authority-transfer/ESCALATE before consequence; and outcome evidence closes the chain without retroactively curing absent pre-execution standing.**

**STATUS: UNPROVEN; SURVIVES FIRST LIMITATION PASS; HIGH COMBINATION/OBVIOUSNESS RISK.**

This hypothesis is narrower than TA-14 as a whole. It intentionally concedes UCON continuity, XACML policy outcomes/obligations, PDP/PEP enforcement, industrial control, provenance and cryptographic reconstruction.

## Combined-obviousness pressure

A serious reviewer can plausibly argue that a skilled engineer could combine:

1. UCON for ongoing authorization/conditions/revocation;
2. XACML or OPA for policy evaluation and non-binary decision handling;
3. NIST-style PDP/PEP separation for enforcement;
4. in-toto-style signed provenance/verification; and
5. industrial-control or transactional commit/execution mechanisms.

The research burden is therefore **not** merely to show that no single reference uses all eight TA-14 words. We must identify a technical interaction among `ADMISSIBILITY -> BINDING -> COMMIT -> EXECUTION -> OUTCOME` that would not be an ordinary predictable combination of those known teachings.

This is the central unresolved patentability pressure point.

## Required executable comparator challenge vectors

### CV-01 — Authentic evidence, wrong proposition
Evidence is authentic and integrity-valid but supports proposition A while requested consequence depends on proposition B. Test whether comparator systems represent a separate admissibility-standing failure rather than merely evaluating a false policy attribute.

### CV-02 — Valid approval, material evidence changes before commit
Approval exists at T0; qualifying evidence materially changes at T1; commit requested at T2. Test whether prior approval is withdrawn because proposition standing is no longer continuous.

### CV-03 — Commit fixed, runtime destination/version changes
Authority and evidence remain valid but the execution target diverges after commit. Test whether the system distinguishes invalid binding/commit correspondence from ordinary access denial.

### CV-04 — Two valid obligations conflict
Both obligations are individually valid but consequences are incompatible. Test whether the system transfers authority (ESCALATE) rather than selecting by ordinary policy-combining precedence.

### CV-05 — Internal DENY but alternate route remains open
Primary PEP denies the action while an alternate route can still create the protected consequence. Test whether governance standing itself remains unclosed until alternate-route containment is evidenced.

### CV-06 — Execution receipt exists; external outcome unobserved
Execution telemetry says success but no qualifying independent outcome evidence exists. Test whether the system distinguishes execution completion from outcome standing/closure.

## Patent-analysis boundary

This engineering record does not determine patent novelty, non-obviousness, infringement, validity or freedom to operate. Those require actual patent claims, filing/priority chain, jurisdiction, claim construction and legally cognizable prior art. The final claim chart should be reviewed by patent counsel.

## Next work items

1. Execute CV-01 through CV-06 conceptually against UCON, XACML, NIST ZTA, in-toto and the TA-14 harness and record PASS/PARTIAL/NO-MATCH.
2. Search patent literature specifically around evidence-qualified authorization, pre-execution evidence standing, commit-bound authorization, authorization receipts, usage-control provenance and consequence closure.
3. Establish TA-14's actual earliest support/priority dates for each surviving proposition rather than relying on a single global date.
4. Produce a claim-chart-ready record separating **known element**, **known combination**, **surviving interaction**, and **unsupported assertion**.
5. Do not resume aggressive novelty messaging until the combination/obviousness test is complete.
