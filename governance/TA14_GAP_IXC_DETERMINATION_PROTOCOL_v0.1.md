# TA-14 GAP-IXC Determination Protocol

**Instrument ID:** TA14-GAP-IXC-DP-001  
**Version:** 0.2 — CAR-E Candidate  
**Status:** NOT ADOPTED / ADVERSARIAL REVIEW REQUIRED  
**Issued by:** TA-14 Authority  

## 1. Purpose

This protocol defines a reproducible, proposition-addressable method for expressing bounded assurance without collapsing materially different evidence states into a single scalar verification level.

This candidate does not replace L0-L7 and does not create an issued assurance finding until it passes CAR-E review and an adoption event is separately recorded.

## 2. Governing object

No GAP-IXC determination attaches to an architecture in the abstract. The minimum addressable object is:

**Architecture identity → version → proposition → evidence set → assessment time**

The proposition must be atomic enough that one determination state can answer it without silently combining materially different claims.

A determination must not migrate to another version, proposition, route, environment, consequence, or time without an explicit revalidation basis.

## 3. Six dimensions

### G — Governance-Basis Support
Question: Has an attributable governance basis been established for the system to perform the declared bounded function within the declared domain and purpose?

G does not establish moral legitimacy, legal sufficiency, regulatory approval, endorsement, or universal standing.

### A — Authority Standing
Question: Has current, bounded authority for the specific consequential action been established from an attributable source?

A governance basis must not be treated as proof that a particular actor, agent, role, or route possesses authority for every consequence.

### P — Proposition Support
Question: Does the admitted evidence establish the factual proposition relied upon for the governed determination?

Authority does not cure unsupported facts.

### I — Implementation Support
Question: Does admitted evidence establish that the claimed control exists in the identified implementation and version?

Documentation alone does not establish implementation behavior unless the proposition is expressly documentary.

### X — Execution Support
Question: Does admitted evidence establish what occurred at the identified governed execution boundary for the frozen case?

Existence of a control does not establish that it operated in the examined case.

### C — Consequence Support
Question: Does admitted evidence establish formation or non-formation of the specifically identified downstream consequence within the declared observation boundary?

A DENY label or execution refusal does not by itself establish downstream non-occurrence.

## 4. Determination grammar

Each applicable dimension receives exactly one state:

- **ESTABLISHED** — the admitted frozen evidence satisfies every mandatory criterion for the bounded proposition.
- **PARTIALLY ESTABLISHED** — the proposition has been expressly decomposed into material sub-propositions, at least one sub-proposition is ESTABLISHED, and at least one other material sub-proposition is UNESTABLISHED or INDETERMINATE. The record must identify each sub-proposition and its state. PARTIALLY ESTABLISHED must not be used as a discretionary midpoint for weak evidence.
- **UNESTABLISHED** — the admitted evidence does not establish the proposition within scope. This does not establish the opposite proposition.
- **INDETERMINATE** — the available record cannot support a defensible determination because admitted evidence is materially conflicting, inaccessible, ambiguous, integrity-compromised, or otherwise incapable of resolving the proposition.
- **NOT APPLICABLE** — the dimension is outside the frozen proposition. N/A must include an applicability rationale and must not be used merely because evidence is missing.

Missing evidence defaults to **UNESTABLISHED** unless the reason a determination cannot be made is itself an indeterminate condition such as unresolved material conflict, inaccessible required evidence, ambiguous identity, or compromised evidence integrity.

## 5. Evidence admission gate

No evidence item may contribute to an ESTABLISHED or PARTIALLY ESTABLISHED state unless the assessment record identifies:

1. the evidence object;
2. provenance;
3. the proposition or sub-proposition it is offered to support;
4. temporal relevance;
5. integrity state where material;
6. scope/applicability;
7. material conflicts or limitations;
8. whether the evidence is direct, derived, testimonial, documentary, runtime, observational, or another declared evidence class.

Evidence existence is not evidence admission. Evidence admission is not proof. An assessor must state why an admitted item is capable of supporting the proposition for which it is relied upon.

## 6. Mandatory qualifiers

Every dimension determination must preserve:

1. architecture identity;
2. version/build/commit where applicable;
3. exact atomic proposition;
4. scope and exclusions;
5. admitted evidence identifiers;
6. evidence provenance;
7. determination time;
8. validity or observation window where applicable;
9. revalidation trigger;
10. unresolved conditions;
11. assessor identity or attributable assessor role;
12. independence boundary;
13. applicable establishment criteria and criterion-by-criterion disposition.

Provenance, time, scope, and independence are qualifiers of a determination, not additional assurance dimensions.

## 7. Evidence provenance

Use explicit provenance states. At minimum the record must distinguish where applicable:

- registrant-produced;
- TA-14-produced;
- independently produced;
- independently reproduced;
- public-source;
- cross-party;
- not independently established;
- not submitted;
- not preserved;
- outside review scope.

Integrity and independence are not synonyms. A hash may establish integrity of preserved bytes; it does not establish truth, independence, chronology, authority, or consequence.

## 8. Minimum establishment criteria

### 8.1 G — ESTABLISHED requires
- an identified governance-basis source;
- attributable issuer/origin;
- declared purpose/function;
- declared domain or jurisdiction where material;
- admitted evidence that the basis applies to the frozen system/function;
- current/effective status or a bounded historical-status proposition;
- explicit non-claims where legal, regulatory, moral, political, or institutional legitimacy is not established.

### 8.2 A — ESTABLISHED requires
- identified authority source;
- identified authority holder or executable authority path;
- bounded action/consequence;
- delegation or derivation where applicable;
- current validity at decision time;
- no admitted disqualifying revocation, expiration, scope excess, or unresolved substitution.

### 8.3 P — ESTABLISHED requires
- exact factual proposition;
- admitted evidence capable of supporting that proposition;
- temporal relevance;
- provenance;
- material conflicts resolved or bounded;
- no missing mandatory evidence concealed by inference.

### 8.4 I — ESTABLISHED requires
- identified implementation/version;
- identified claimed control;
- inspectable admitted evidence binding the control to that implementation;
- evidence sufficient for the implementation proposition asserted;
- material alternate-path limitations stated.

### 8.5 X — ESTABLISHED requires
- exact execution proposition;
- frozen target/version/environment;
- identified input, trigger, or challenge;
- identified execution boundary;
- contemporaneous or cryptographically bound execution evidence;
- resulting determination/action;
- evidence binding the result to the frozen case.

### 8.6 C — ESTABLISHED requires
- exact consequence proposition;
- identified downstream consequence boundary;
- observation method capable of detecting the claimed formation or non-formation;
- observation window;
- evidence binding the observed result to the frozen case;
- material alternate-route/bypass conditions addressed or explicitly bounded.

## 9. No cross-dimension inheritance

No favorable state automatically establishes another dimension.

In particular:

- G does not establish A;
- A does not establish P;
- P does not establish I;
- I does not establish X;
- X does not establish C;
- C does not retrospectively establish X, I, P, A, or G.

Evidence may be relevant to more than one dimension only when its relevance is separately admitted and justified for each proposition. A favorable downstream observation must not repair an unsupported upstream authority or governance basis.

## 10. Temporal rule

Every state is time-bounded. Revalidation triggers include, where material:

- implementation or configuration change;
- authority revocation, expiration, delegation change, or substitution;
- governance-basis change;
- material new evidence;
- proposition change;
- environment or route change;
- evidence-integrity failure;
- observation-window expiration;
- discovered bypass or alternate consequence path.

Historical validity for a frozen target does not create current standing for a changed target.

## 11. Independent reproducibility test

Before this protocol can be adopted as an assurance standard, at least two reviewers must independently assess the same frozen packet using the same question set without relying on private drafting context.

The frozen packet must include the exact proposition set, evidence inventory, evidence-admission rules, dimension criteria, and required output schema. Assessors may not privately supplement the packet with undisclosed evidence or drafting intent.

Compare results dimension by dimension:

- **R0 — MATCH:** same state and materially compatible reasoning.
- **R1 — QUALIFICATION DIVERGENCE:** same state but materially different qualification.
- **R2 — STATE DIVERGENCE:** different states.
- **R3 — BOUNDARY DIVERGENCE:** disagreement about the proposition, scope, applicability, evidence admission, or evidence boundary.
- **R4 — HIDDEN-CONTEXT DEPENDENCY:** a result materially depends on information outside the frozen packet.

R2, R3, or R4 prevents adoption of the affected rubric until corrected and retested. R1 requires review of whether the qualification could materially change reliance.

Assessor disagreement must not be resolved merely by averaging, majority vote, or selecting the more favorable determination. Correct the rubric, proposition, evidence packet, or admission rule and repeat the test.

## 12. Qualification portability

A material limitation must travel with the state it qualifies. Exported, summarized, indexed, API-delivered, or UI-displayed determinations must not separate a favorable state from a material limitation in a way that strengthens the apparent claim.

A portable determination must include at minimum the dimension, state, exact proposition or stable proposition identifier, target/version, material qualification, and evidence-record reference.

## 13. No architecture-wide PASS

GAP-IXC does not issue an undifferentiated architecture-wide PASS. Multiple propositions may hold different states simultaneously. A favorable state for one proposition must not be generalized to the architecture, version, domain, or consequence class as a whole.

## 14. Recursion and institutional boundary

TA-14 may apply this protocol to TA-14 records. TA-14 application of a TA-14 protocol does not independently establish TA-14's own independence, legal authority, moral legitimacy, regulatory authority, or universal governance standing.

Where independent verification terminates, the termination boundary must remain visible.

## 15. CAR-E pre-adoption gates

This candidate must not be adopted until:

1. all six dimensions survive overlap and authority-laundering review;
2. establishment criteria survive adversarial counterexamples;
3. PARTIALLY ESTABLISHED and INDETERMINATE are independently reproducible rather than discretionary catch-all states;
4. evidence-admission decisions are preserved and reproducible;
5. at least two independent-read assessments are performed on the same frozen evidence packet;
6. no unresolved R2-R4 divergence remains in the tested rubric;
7. qualification portability is demonstrated;
8. at least one TA-14 self-record and one external architecture record are tested;
9. historical L0-L7 records are not silently reinterpreted through GAP-IXC;
10. migration and non-migration rules are documented.

## 16. Current status

**CAR-E CANDIDATE ONLY. NOT AN ISSUED TA-14 ASSURANCE STANDARD.**

Illustrative GAP-IXC tables produced during design exploration are model probes only and must not be represented as issued findings.

---

**Core rule:** No dimension may claim a higher state of assurance than the admitted evidence establishes for the exact frozen proposition.
