# TA-14 Technical Differentiation & Prior-Art Engine v1

**Status:** OPEN RESEARCH RECORD — no novelty or patentability conclusion is self-awarded.

**Purpose:** Test TA-14's asserted architectural differentiation against the strongest known pre-existing and contemporary comparators. This record separates (1) established components, (2) potentially differentiating composition/semantics, (3) later/contemporary convergence, and (4) questions requiring claim-by-claim patent counsel review.

## Governing rule

Do not ask whether another system uses TA-14 vocabulary. Ask whether it discloses the same operative mechanism.

A component is not treated as novel merely because TA-14 gives it a different name. A combination is not treated as novel merely because its components are old. Any surviving differentiation must be stated as a bounded mechanism and tested against dated evidence.

## TA-14 executable reference object

Current executable harness: `apps/web/lib/execution-artifacts/execution-harness.ts`.

The implemented chain is:

`REALITY -> RECORD -> CONTINUITY -> ADMISSIBILITY -> BINDING -> COMMIT -> EXECUTION -> OUTCOME`

Determinations are `ALLOW | HOLD | DENY | ESCALATE`. Required predicates are evaluated stage-by-stage; a non-passing predicate terminates progression with its configured governed determination; downstream stages are not reached. The package preserves specification, trace, receipt, manifest and root hash. Expected determination is asserted after execution rather than supplied as the runtime answer.

## Candidate differentiation propositions — v1

These are research propositions, not novelty claims.

### DP-01 — Proposition-specific evidentiary standing before consequence
A consequential action is not permitted merely because a subject is authenticated or a policy says Permit. Required evidence must have standing for the particular proposition on which the consequence depends.

### DP-02 — Continuity of standing through the consequence boundary
Previously valid authority/evidence is not automatically sufficient later. Material change can withdraw standing before execution and force requalification.

### DP-03 — Ordered separation of admissibility, binding, commit and execution
Evidence qualification, consequence binding, commitment of the bounded action, and execution are represented as distinct governed stages rather than collapsed into a single authorization decision.

### DP-04 — Semantically distinct non-ALLOW outcomes
Uncertainty/insufficiency (HOLD), disqualifying condition (DENY), and unresolved conflict/required higher authority (ESCALATE) are not treated as interchangeable failures.

### DP-05 — Outcome is evidence-bearing closure, not retroactive authorization
Execution does not prove that its own prerequisites were valid, and an internal execution result does not automatically prove an external-world outcome. Outcome evidence closes the bounded chain and may require independent observation.

### DP-06 — Evidence-bearing reconstruction of the determination path
The frozen specification, stage trace, receipt, hashes and manifest preserve how the determination formed, including where progression stopped.

### DP-07 — Alternate-route/bypass challenge as part of execution standing
A governed route must not be treated as sufficient if the protected consequence remains reachable through an ungoverned alternate path within the tested boundary.

## Established prior mechanisms that TA-14 should NOT claim to have invented

1. Sensors and acquisition of external physical state.
2. Programmed conditional logic and control outputs.
3. Authentication, authorization, roles and privileges.
4. Permit/deny policy decisions and policy enforcement points.
5. Continuous/ongoing authorization and revocation after context changes.
6. Environmental/system conditions as authorization inputs.
7. Obligations and advice associated with authorization decisions.
8. Audit trails, command histories and event logs.
9. Cryptographic hashing, signed metadata, manifests and provenance chains.
10. Ordered workflow steps and authorized functionaries.
11. Fail-closed execution gates as a general concept.

## Comparator matrix — first pass

| Comparator | Dated baseline | What it clearly establishes | Pressure on TA-14 | Current v1 finding |
|---|---:|---|---|---|
| Johnson Controls Metasys | documented well before TA-14; current docs also examined | physical state acquisition, programmed control, authenticated/authorized commands, allow/deny at protected operations, audit/history | Strong against any claim that TA-14 invented conditional physical control, authorization or auditability | COMPONENT OVERLAP ESTABLISHED; full TA-14 chain equivalence NOT YET ESTABLISHED |
| UCONABC (Park & Sandhu) | 2004 | authorizations + obligations + conditions; decision continuity; mutable attributes; ongoing control and revocation | Very strong against broad claims around continuity, changed conditions invalidating access, or ongoing authorization | MAJOR PRIOR ART AGAINST BROAD CONTINUITY CLAIMS |
| XACML 3.0 | 2013 standard | PDP/PEP authorization, Permit/Deny/Indeterminate/NotApplicable, obligations/advice, combining algorithms | Strong against broad multi-outcome policy-decision and obligation claims | MAJOR PRIOR ART AGAINST GENERIC POLICY-DETERMINATION CLAIMS |
| NIST Zero Trust / PDP-PEP | 2020 onward | policy engine uses supporting information; PEP enforces decisions; continuous evaluation is a core deployment pattern | Strong against generic current-context authorization and enforcement claims | MAJOR PRIOR ART AGAINST GENERIC RUNTIME AUTHORIZATION CLAIMS |
| in-toto | public before TA-14 | signed layout, ordered authorized steps, link metadata, materials/products, verification and supply-chain continuity | Strong against generic claims for ordered signed provenance/evidence reconstruction | MAJOR PRIOR ART AGAINST GENERIC CHAIN-OF-CUSTODY/REPLAY CLAIMS |
| OPA | public before TA-14 | external/live data in policy evaluation, PDP near PEP, decision logging | Strong against generic policy-as-code/runtime decision claims | COMPONENT OVERLAP ESTABLISHED |

## Johnson Controls challenge — v1

Current Metasys documentation shows device-level authentication/authorization in which a target device evaluates local authorization policy for a protected BACnet operation and allows or rejects it. Metasys also supports role/privilege-based commands and audits commands/system activity.

Therefore TA-14 must NOT use the following as differentiation propositions:

- "TA-14 checks authority before an action."
- "TA-14 can deny a command."
- "TA-14 records the command."
- "TA-14 connects physical state to programmed control."

The live question is narrower: **does Metasys (or another pre-existing system) represent proposition-specific evidence qualification, continuity of that evidence/authority standing, consequence-specific binding, commit, execution and outcome as separately governed states whose failure semantics and preserved evidence determine whether consequence may form?**

That question remains OPEN and must be answered from documentation, patents and executable comparison — not vocabulary.

## UCON challenge — critical finding

UCONABC is a much more important comparator than a simple building controller for TA-14's `CONTINUITY` proposition. Its 2004 literature expressly integrates authorization, obligations and conditions, describes ongoing control, permits environmental/system status to affect decisions, and supports immediate revocation when requirements cease to hold.

**Consequence:** TA-14 cannot responsibly claim that "authorization must remain valid as conditions change" or "changed conditions can revoke standing" is itself novel.

Any surviving TA-14 distinction must be narrower than continuity alone.

## XACML challenge — critical finding

XACML already distinguishes Permit, Deny, Indeterminate and NotApplicable and carries obligations/advice from policy evaluation to enforcement. This is serious prior art against any assertion that multiple non-binary governance outcomes or policy obligations are inherently new.

**Open delta:** TA-14's HOLD/DENY/ESCALATE semantics may still differ operationally, but differentiation must be shown by state-transition and consequence behavior, not by the existence of more than two labels.

## in-toto challenge — critical finding

in-toto predates TA-14 and defines a signed layout containing ordered supply-chain steps and authorized functionaries, with signed link metadata recording commands/materials/products and verification against the layout.

**Consequence:** ordered evidence chains, signed provenance, authorized actors, reconstruction and verification are not standalone novelty propositions.

**Open delta:** whether TA-14's evidence objects govern *permission for a consequence at runtime* through proposition-specific standing rather than verifying completion of a predefined supply-chain layout.

## Temporal warning: contemporary/later convergence is not automatically prior art

Several 2026 publications now describe mechanisms close to parts of TA-14, including governance-gated execution with proof identifiers, pre-inference AI execution compliance with machine-verifiable evaluation receipts, permit-before-commit effect-boundary controls, authorization receipts, and mission-bound runtime enforcement.

These references are strategically important because they show the field is converging on evidence-bound execution. They must **not** be casually called prior art against a TA-14 priority position that predates them. Formal patent analysis must establish publication/filing/priority dates and applicable legal rules.

## Candidate surviving architectural delta — working hypothesis

The strongest current hypothesis is NOT any individual stage. It is the composition:

> A consequence-bearing execution architecture in which proposition-specific evidence and authority obtain bounded standing; that standing must remain continuous through an ordered admissibility/binding/commit boundary; materially changed conditions can withdraw prior standing; structurally different failures produce HOLD, DENY or ESCALATE before consequence; execution is separately evidenced; and outcome evidence closes rather than retroactively authorizes the chain.

**Status: UNPROVEN DIFFERENTIATION HYPOTHESIS.**

It survives this first pass only because the comparators examined so far each cover substantial subsets, while this research has not yet established a single pre-TA-14 reference disclosing the complete mechanism. That is not a novelty conclusion.

## Required destructive tests

### DT-01 — UCON equivalence test
Attempt to map every TA-14 stage and every determination to UCON pre/ongoing decisions, authorizations, obligations, conditions and mutability. If the mapping is complete without adding machinery, DP-02/DP-03 weaken materially.

### DT-02 — XACML equivalence test
Attempt to implement HOLD/DENY/ESCALATE and the TA-14 ordered chain using standard XACML PDP/PEP, obligations/advice and combining algorithms. Record what requires external orchestration.

### DT-03 — Metasys equivalence test
Use a changed-condition physical-control scenario. Determine whether native Metasys objects can carry evidence qualification and standing across the full chain or whether it implements control logic/authorization without those evidence semantics.

### DT-04 — in-toto equivalence test
Attempt to model a live consequence request as an in-toto layout and determine whether verification can function as pre-consequence authorization with changed-state invalidation and governed HOLD/DENY/ESCALATE semantics.

### DT-05 — Combined-obviousness pressure test
Do not stop if no single reference contains the whole chain. Test whether a skilled implementer could combine UCON + XACML/OPA + in-toto + an industrial PEP using ordinary engineering steps. This is essential for any patentability discussion.

## Patent-analysis boundary

This engineering record does not determine patent novelty, non-obviousness, infringement, validity or freedom to operate. Those require the actual patent claims, filing/priority chain, jurisdiction, claim construction and legally cognizable prior art. A patent professional should review the final claim chart.

## Next work items

1. Build a limitation-by-limitation matrix for DP-01 through DP-07 against UCON, XACML, NIST ZTA, Metasys, in-toto and OPA.
2. Add dated patent references with priority/publication dates and classify PRE-TA14 vs POST-TA14/CONTEMPORARY.
3. Build executable comparator challenge vectors for changed evidence, changed authority, unresolved conflict, stale evidence and alternate-route bypass.
4. Define exactly what `ADMISSIBILITY`, `BINDING`, `COMMIT` and `OUTCOME` add beyond known PDP/PEP and usage-control models.
5. Publish only bounded technical-differentiation findings; reserve patentability conclusions for counsel.
