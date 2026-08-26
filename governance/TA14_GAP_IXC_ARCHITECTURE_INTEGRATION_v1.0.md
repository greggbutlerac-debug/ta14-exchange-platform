# TA-14 GAP-IXC Architecture Integration

**Instrument:** TA14-GAP-IXC-AI-001  
**Version:** 1.0 Integration Draft  
**Status:** IMPLEMENTATION BRANCH / NOT YET PRODUCTION  

## Governing decision

TA-14 will integrate GAP-IXC as a proposition-addressable assurance layer across the Exchange while preserving the canonical execution chain:

**Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome**

GAP-IXC does not replace that chain. It answers a different question: **what has actually been established, for which proposition, by which evidence, within which boundary, at which time?**

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
Architecture registration remains an attributable baseline. Registration must capture declared governance basis, authority model, propositions/claims, non-claims, implementation/version identity, scope, evidence inventory, and disclosure boundary. Registration does not self-award favorable GAP-IXC states.

### 2. Proposition registry
Claims become stable proposition objects. Each proposition receives an immutable proposition ID and is bound to architecture identity/version. Material reframing creates a new proposition identity.

### 3. Pre-evidence freeze
Before a GAP-IXC determination, freeze proposition/sub-propositions, scope/exclusions, route/environment, execution and consequence boundaries, observation window, applicable dimensions, evidence-admission rules, evidence inventory, and output schema.

### 4. Evidence admission
Evidence existence is distinct from evidence admission. Each admitted object must declare provenance, evidence class, proposition relevance, temporal relevance, integrity where material, scope, conflicts/limitations, and lineage when derived.

### 5. Determination engine
Determinations are issued per proposition and dimension. No architecture-wide PASS is produced by GAP-IXC. No favorable dimension inherits into another dimension.

### 6. Independence and reproduction
Independent production and independent reproduction are evidentiary standing qualifiers, not scalar verification levels. The Exchange must preserve where independence terminates.

### 7. Contradiction handling
Unresolved material contradiction blocks ESTABLISHED. Contradictory evidence cannot be buried as a favorable-state footnote or excluded after evidence review merely to improve the result.

### 8. Temporal validity and revalidation
Every determination is time/version/scope bounded. Material change to governance basis, authority, proposition, evidence, implementation/configuration, route/environment, evidence integrity, observation window, or discovered bypass triggers revalidation as applicable.

### 9. Qualification portability
UI cards, registry views, API payloads, receipts, badges, exports, public findings, and summaries must carry material qualifications and evidentiary standing. A standalone green checkmark or `ESTABLISHED` label is prohibited when omitted context would strengthen the apparent claim.

### 10. Historical records
Existing L0-L7 records remain historical records. They are not silently converted or rewritten. GAP-IXC assessments of historical artifacts are new separately identified determination records referencing the historical source and historical verification level.

## Exchange information architecture

The Exchange will expose these institutional surfaces:

1. **Architecture Registry** — identity, version, stewardship, scope, governance basis, declared authority model.
2. **Proposition Registry** — stable claims/non-claims and proposition history.
3. **Evidence Registry** — evidence objects, provenance, lineage, integrity, admission state.
4. **GAP-IXC Assurance** — proposition-addressable G/A/P/I/X/C determinations.
5. **Execution Artifacts** — preserved runtime/execution evidence and historical L0-L7 classification.
6. **Consequence Evidence** — downstream observation and outcome/non-outcome records.
7. **Independent Read & Reproduction** — frozen packets, assessor results, R0-R4 comparison state.
8. **Revalidation Ledger** — triggers, supersession, expiration, changed-state handling.
9. **Challenges & Corrections** — attributable challenge, correction, supersession, withdrawal.
10. **CAR-E** — internal adversarial examination of TA-14 instruments before institutional adoption.

## Registration changes

New/updated architecture intake must separately collect:
- governance-basis source and non-claims;
- authority source/delegation model;
- stable proposition set;
- implementation/version identity;
- evidence inventory and provenance;
- declared execution boundary;
- declared consequence boundary where applicable;
- revalidation triggers;
- independence claims and termination boundary.

No registrant chooses its own final GAP-IXC state during intake.

## Artifact changes

Every new execution artifact must be able to reference:
- proposition ID(s);
- evidence IDs;
- execution boundary;
- consequence boundary/observation window where applicable;
- applicable GAP-IXC determination IDs;
- evidentiary standing;
- material qualification;
- revalidation state.

Historical `verificationLevel` remains available as `historicalVerificationLevel` for preserved records and migration compatibility.

## UI changes

Replace assurance-first presentation such as `L6 VERIFIED` as the primary present-tense assurance representation with a proposition-centered assurance panel. Historical verification level may remain visibly labeled as historical classification.

A GAP-IXC panel must show:
- proposition;
- architecture/version;
- G/A/P/I/X/C state grid;
- evidence basis per state;
- independence boundary;
- material qualifications/unresolved conditions;
- assessment time and revalidation status;
- links to admitted evidence and frozen packet.

## Migration phases

### Phase 1 — Foundation
Introduce canonical GAP-IXC types/schema, proposition identity, freeze object, portable assurance object, and integration doctrine.

### Phase 2 — Registry dual-read
Preserve existing registry records while adding optional GAP-IXC references. No historical record receives an inferred favorable state.

### Phase 3 — New intake
Upgrade architecture and artifact intake so new submissions produce proposition-addressable, evidence-admission-ready records.

### Phase 4 — Assurance workspace
Add GAP-IXC assessment/freeze/evidence-admission/reproducibility surfaces.

### Phase 5 — Public presentation
Add qualified assurance panels to public architecture/artifact pages and remove ambiguous present-tense scalar verification presentation.

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
13. Changed state triggers bounded revalidation.
14. Historical findings are preserved rather than rewritten.
15. TA-14 does not self-award universal legal, moral, political, regulatory, or institutional legitimacy.

## Current implementation state

This integration draft authorizes implementation work on the isolated `architecture/gap-ixc-integration` branch. It does not itself activate GAP-IXC in production or retroactively alter any registered architecture or execution artifact.