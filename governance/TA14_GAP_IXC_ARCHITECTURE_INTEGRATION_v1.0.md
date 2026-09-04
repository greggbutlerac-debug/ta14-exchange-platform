# TA-14 GAP-IXC Architecture Integration

**Instrument:** TA14-GAP-IXC-AI-001  
**Version:** 1.0 Integration Draft  
**Status:** IMPLEMENTATION BRANCH / NOT YET PRODUCTION  

## Governing decision

TA-14 will integrate GAP-IXC as a proposition-addressable assurance layer across the Exchange while preserving the canonical execution chain:

**Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome**

GAP-IXC does not replace that chain. It answers a different question: **what has actually been established, for which proposition, by which evidence, within which boundary, at which time?**

## Registry simplicity rule

The Registry must remain easy to enter and difficult to overclaim.

Registration is a baseline identity-and-declaration function, not a forced assurance examination. Fields are mandatory only when TA-14 cannot create an attributable, bounded registry record without them.

GAP-IXC depth is **progressive**:

1. **Registration baseline** — minimum information needed to identify the architecture, version, claimant/steward, scope, core claims, material non-claims, and an attributable contact/authority basis.
2. **Evidence-ready enrichment** — optional evidence, provenance, repositories, publications, implementation references, and additional boundaries may be added when available.
3. **Examination-ready freeze** — detailed proposition IDs, evidence admission, execution boundaries, consequence boundaries, revalidation triggers, and GAP-IXC criteria become required only for propositions submitted for a governed examination or assurance determination.
4. **Independent assurance** — independent-read/reproduction information becomes required only when independent standing is actually claimed or sought.

A registrant must not be required to manufacture information, evidence, execution boundaries, consequence boundaries, or independence claims that are not relevant to the architecture or the purpose of the registration.

## Assurance dimensions

- **G — Governance-Basis Support**
- **A — Authority Standing**
- **P — Proposition Support**
- **I — Implementation Support**
- **X — Execution Support**
- **C — Consequence Support**

Every dimension uses: ESTABLISHED / PARTIALLY ESTABLISHED / UNESTABLISHED / INDETERMINATE / NOT APPLICABLE.

No state may travel without its evidentiary standing, proposition identity, architecture/version identity, material qualification, evidence reference, and independence boundary.

## Exchange-wide architecture

### 1. Registration layer
Architecture registration remains an attributable baseline. The minimum registration record captures identity, version, claimant/steward, concise scope, core claims, material non-claims, and enough authority/contact information to attribute the submission. Additional governance-basis, implementation, evidence, execution, consequence, revalidation, or independence fields are conditional and may remain optional until relevant to an examination or assurance request. Registration does not self-award favorable GAP-IXC states.

### 2. Proposition registry
Claims may become stable proposition objects when they are frozen for examination, assurance, interoperability work, or another governed process. Ordinary registration does not require every sentence or claim to receive a proposition ID.

### 3. Pre-evidence freeze
Before a GAP-IXC determination, freeze proposition/sub-propositions, scope/exclusions, route/environment, execution and consequence boundaries where applicable, observation window where applicable, applicable dimensions, evidence-admission rules, evidence inventory, and output schema.

### 4. Evidence admission
Evidence existence is distinct from evidence admission. For evidence actually relied upon in a GAP-IXC determination, record provenance, evidence class, proposition relevance, temporal relevance, integrity where material, scope, conflicts/limitations, and lineage when derived. Ordinary registration evidence does not need full determination-grade metadata unless it is later admitted into an assurance process.

### 5. Determination engine
Determinations are issued per proposition and dimension. No architecture-wide PASS is produced by GAP-IXC. No favorable dimension inherits into another dimension.

### 6. Independence and reproduction
Independent production and independent reproduction are evidentiary standing qualifiers, not scalar verification levels. The Exchange must preserve where independence terminates when independent standing is relevant or claimed.

### 7. Contradiction handling
Unresolved material contradiction blocks ESTABLISHED. Contradictory evidence cannot be buried as a favorable-state footnote or excluded after evidence review merely to improve the result.

### 8. Temporal validity and revalidation
Every issued GAP-IXC determination is time/version/scope bounded. Material change to governance basis, authority, proposition, evidence, implementation/configuration, route/environment, evidence integrity, observation window, or discovered bypass triggers revalidation when that change is relevant to the issued determination.

### 9. Qualification portability
UI cards, registry views, API payloads, receipts, badges, exports, public findings, and summaries must carry material qualifications and evidentiary standing when displaying GAP-IXC determinations. A standalone green checkmark or `ESTABLISHED` label is prohibited when omitted context would strengthen the apparent claim.

### 10. Historical records
Existing L0-L7 records remain historical records. They are not silently converted or rewritten. GAP-IXC assessments of historical artifacts are new separately identified determination records referencing the historical source and historical verification level.

## Exchange information architecture

The Exchange may expose these institutional surfaces as separate views or combined modules where simplicity improves usability:

1. **Architecture Registry** — identity, version, stewardship, scope, claims and non-claims.
2. **Evidence & Propositions** — deeper proposition and evidence records when a governed process requires them.
3. **GAP-IXC Assurance** — proposition-addressable G/A/P/I/X/C determinations.
4. **Execution & Consequence Records** — runtime artifacts and downstream outcome/non-outcome evidence.
5. **Independent Review & Revalidation** — independent reads/reproduction, revalidation, challenges, corrections, supersession, and withdrawal.
6. **CAR-E** — internal adversarial examination of TA-14 instruments before institutional adoption.

These are information responsibilities, not a requirement to create ten separate navigation items or force registrants through ten separate workflows.

## Registration changes

### Minimum required for ordinary registration
- governance/architecture name;
- current version or version label;
- claimant or submitting organization;
- steward/contact route;
- concise description and scope;
- core claims;
- material non-claims or limitations where needed to prevent a misleading registration;
- submitter authority/attestation sufficient to attribute the record.

### Conditional or optional at registration
Collect these only when relevant, available, or necessary for the registrant's chosen pathway:
- detailed governance-basis source;
- detailed delegation/authority chain;
- stable proposition IDs;
- implementation/build/commit identity;
- evidence inventory and detailed provenance;
- execution boundary;
- consequence boundary or observation window;
- revalidation triggers;
- independent production/reproduction claims;
- publications, repositories, patents, standards mappings, and supporting attachments.

### Required later for GAP-IXC determination
When a registrant asks TA-14 to examine or issue assurance on a proposition, TA-14 may require the additional fields and evidence necessary for the specific applicable G/A/P/I/X/C dimensions. Requirements must be proposition-specific rather than imposed globally on every registrant.

No registrant chooses its own final GAP-IXC state during intake.

## Artifact changes

New execution artifacts should be able to reference, when applicable:
- proposition ID(s);
- evidence IDs;
- execution boundary;
- consequence boundary/observation window;
- GAP-IXC determination IDs;
- evidentiary standing;
- material qualification;
- revalidation state.

Fields that are not applicable to the artifact must not be mandatory merely for schema symmetry.

Historical `verificationLevel` remains available as `historicalVerificationLevel` for preserved records and migration compatibility.

## UI changes

Replace assurance-first presentation such as `L6 VERIFIED` as the primary present-tense assurance representation with proposition-centered assurance where a GAP-IXC determination exists. Historical verification level may remain visibly labeled as historical classification.

The ordinary Registry profile should remain simple. A deeper GAP-IXC panel appears only when an assurance record exists.

A GAP-IXC panel should show, as applicable:
- proposition;
- architecture/version;
- applicable G/A/P/I/X/C states;
- evidence basis;
- independence boundary where relevant;
- material qualifications/unresolved conditions;
- assessment time and revalidation status;
- links to admitted evidence/frozen packet where available.

NOT APPLICABLE dimensions do not need to dominate the public UI.

## Migration phases

### Phase 1 — Foundation
Introduce canonical GAP-IXC types/schema, proposition identity, freeze object, portable assurance object, and integration doctrine.

### Phase 2 — Registry dual-read
Preserve existing registry records while adding optional GAP-IXC references. No historical record receives an inferred favorable state.

### Phase 3 — Lightweight intake
Keep ordinary registration streamlined. Add deeper fields progressively and conditionally for examination-ready or assurance-seeking submissions rather than making the entire GAP-IXC schema mandatory at initial registration.

### Phase 4 — Assurance workspace
Add GAP-IXC assessment/freeze/evidence-admission/reproducibility surfaces for users who enter governed examination or assurance pathways.

### Phase 5 — Public presentation
Add qualified assurance panels only where determinations exist and remove ambiguous present-tense scalar verification presentation.

### Phase 6 — Historical assessment
Assess selected historical records only through separately identified frozen GAP-IXC assessments. Never bulk infer states from L0-L7.

### Phase 7 — CAR-E adoption gate
Before GAP-IXC becomes an institutional standard, complete independent reproducibility testing and preserve adoption authority, version, effective date, migration rules, and non-retroactivity boundary.

## Non-negotiable invariants

1. No admissible evidence. No admissible execution.
2. Registration is not verification.
3. Evidence integrity is not evidence truth.
4. Governance basis is not action authority.
5. Authority is not factual proposition support.
6. Proposition support is not implementation proof.
7. Implementation proof is not execution proof.
8. Execution proof is not consequence proof.
9. A DENY label is not downstream non-occurrence proof.
10. Independence cannot be self-awarded.
11. Missing evidence cannot be favorably inferred.
12. Material qualifications travel with favorable findings.
13. Changed state triggers bounded revalidation where relevant.
14. Historical findings are preserved rather than rewritten.
15. TA-14 does not self-award universal legal, moral, political, regulatory, or institutional legitimacy.
16. Registry complexity must be proportionate to the pathway selected.
17. NOT APPLICABLE information must not be collected merely for completeness.
18. Assurance-grade requirements begin when assurance is sought, not merely because registration occurred.

## Current implementation state

This integration draft authorizes implementation work on the isolated `architecture/gap-ixc-integration` branch. It does not itself activate GAP-IXC in production or retroactively alter any registered architecture or execution artifact.