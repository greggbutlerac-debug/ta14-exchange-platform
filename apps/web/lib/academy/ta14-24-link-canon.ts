/**
 * TA-14 Authority Governance Institution
 * TA-14 Academy + TA-14 AI Governance Exchange
 *
 * ACD-024 - Canonical 24-Link Admissible Execution Architecture
 *
 * CREATE:
 *   apps/web/lib/academy/ta14-24-link-canon.ts
 *
 * Purpose:
 *   Provide one controlled, dependency-light source of truth for the full
 *   TA-14 24-Link Admissible Execution Architecture. Academy lessons,
 *   explorers, simulations, route-state tools, Exchange overlays, registry
 *   relationships, evidence maps, patent/publication mappings, assessments,
 *   credentials, and replay interfaces should read from this canonical object
 *   instead of retyping doctrine independently.
 *
 * Provenance rule:
 *   The foundational Chain of Eight - Reality -> Record -> Continuity ->
 *   Admissibility -> Binding -> Commit -> Execution -> Outcome - was already
 *   created and publicly published May 1, 2025. The 24-link architecture is
 *   the subsequent higher-resolution decomposition and maturation of that
 *   existing parent route. Never represent the original Chain of Eight as
 *   having been created later than May 1, 2025.
 */

export const TA14_24_LINK_CANON_VERSION = "1.0.0" as const;
export const TA14_24_LINK_CANON_STATE = "active" as const;
export const TA14_CHAIN_OF_EIGHT_ORIGIN_DATE = "2025-05-01" as const;

export const TA14_CHAIN_OF_EIGHT = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
] as const;

export type TA14ChainOfEightAnchor = (typeof TA14_CHAIN_OF_EIGHT)[number];

export const TA14_PROVENANCE_STATEMENT =
  "The foundational TA-14 Chain of Eight - Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit -> Execution -> Outcome - was created and publicly published May 1, 2025. The current 24-link architecture is the subsequent higher-resolution decomposition and maturation of that already-existing parent route." as const;

export const TA14_ORIGIN_RULE =
  "Never describe the original TA-14 Chain of Eight as having been developed after May 1, 2025. Later work increased architectural resolution; it did not create the original parent route." as const;

export const TA14_24_LINK_NAMES = [
  "Admissible Reality",
  "Record",
  "Continuity",
  "Evidence Governance",
  "Admissible Evidence",
  "Admissible Truth",
  "Reliance",
  "Authority",
  "Legitimacy",
  "Consequence Formation",
  "Attachment / Assent",
  "Binding Reality",
  "Binding",
  "Commit Reality",
  "Commit",
  "Execution Reality",
  "Admissible Non-Occurrence",
  "Prevented Consequence",
  "Execution",
  "Outcome Reality",
  "Outcome",
  "New Reality",
  "Memory",
  "Future Chain",
] as const;

export type TA14LinkName = (typeof TA14_24_LINK_NAMES)[number];
export type TA14LinkOrder =
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
  | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24;

export type TA14LinkId = `TA14-LINK-${
  | "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08"
  | "09" | "10" | "11" | "12" | "13" | "14" | "15" | "16"
  | "17" | "18" | "19" | "20" | "21" | "22" | "23" | "24"}`;

export type TA14LinkVersionState =
  | "draft"
  | "candidate"
  | "active"
  | "degraded"
  | "superseded"
  | "retired";

export type TA14RouteDecision =
  | "CONTINUE"
  | "NARROW"
  | "HOLD"
  | "REFUSE"
  | "ESCALATE";

export type TA14EvidenceHealthState =
  | "supported"
  | "partial"
  | "held"
  | "challenged"
  | "untested"
  | "outside_scope";

export type TA14ArchitectureRegion =
  | "reality-evidence"
  | "reliance-authority"
  | "binding-commit"
  | "execution-non-occurrence"
  | "outcome-recursion";

export interface TA14CanonicalLink {
  readonly linkId: TA14LinkId;
  readonly order: TA14LinkOrder;
  readonly canonicalName: TA14LinkName;
  readonly slug: string;
  readonly parentAnchor: TA14ChainOfEightAnchor;
  readonly region: TA14ArchitectureRegion;
  readonly definition: string;
  readonly governingQuestion: string;
  readonly evidenceRequirements: readonly string[];
  readonly failureModes: readonly string[];
  readonly transitionRule: string;
  readonly holdRefuseEscalateRule: string;
  readonly upstreamDependencies: readonly TA14LinkId[];
  readonly downstreamConsequence: string;
  readonly proofObject: string;
  readonly masteryTask: string;
  readonly versionState: TA14LinkVersionState;
}

function link(
  value: TA14CanonicalLink,
): TA14CanonicalLink {
  return Object.freeze(value);
}

export const TA14_24_LINKS: readonly TA14CanonicalLink[] = Object.freeze([
  link({
    linkId: "TA14-LINK-01",
    order: 1,
    canonicalName: "Admissible Reality",
    slug: "admissible-reality",
    parentAnchor: "Reality",
    region: "reality-evidence",
    definition: "Establish the bounded, current reality that may legitimately enter governance.",
    governingQuestion: "What bounded reality may legitimately enter governance?",
    evidenceRequirements: ["Bounded current-state evidence", "Scope declaration", "Source context"],
    failureModes: ["Unbounded assumptions", "Stale state", "Hidden conditions"],
    transitionRule: "Reality boundary and supporting evidence must be established before Record can be relied upon.",
    holdRefuseEscalateRule: "HOLD when the reality boundary is undefined, stale, materially incomplete, or unsupported.",
    upstreamDependencies: [],
    downstreamConsequence: "Every later determination can inherit an unbounded or false starting state.",
    proofObject: "Admissible Reality declaration with source, scope, timestamp, and bounded-state evidence.",
    masteryTask: "Identify the Admissible Reality state, cite the evidence, diagnose defects, and decide whether to continue, narrow, hold, refuse, or escalate.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-02",
    order: 2,
    canonicalName: "Record",
    slug: "record",
    parentAnchor: "Record",
    region: "reality-evidence",
    definition: "Convert relevant reality into a durable, attributable, reconstructable record.",
    governingQuestion: "What must be durably captured so the event can be reconstructed?",
    evidenceRequirements: ["Attributable record", "Timestamp", "Source", "Relevant state"],
    failureModes: ["Missing timestamps", "Unverifiable source", "Incomplete capture"],
    transitionRule: "The event must be reconstructable before downstream governance relies on it.",
    holdRefuseEscalateRule: "REFUSE downstream reliance on an event that cannot be reconstructed from an attributable record.",
    upstreamDependencies: ["TA14-LINK-01"],
    downstreamConsequence: "Governance becomes dependent on facts that cannot be reconstructed or challenged.",
    proofObject: "Durable event record containing source identity, capture time, state, and attribution.",
    masteryTask: "Identify the Record state, cite the record, diagnose capture defects, and decide whether continuation is admissible.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-03",
    order: 3,
    canonicalName: "Continuity",
    slug: "continuity",
    parentAnchor: "Continuity",
    region: "reality-evidence",
    definition: "Preserve record meaning, lineage, custody, version, and dependency continuity across time and transformation.",
    governingQuestion: "What must remain continuous from source through consequence?",
    evidenceRequirements: ["Lineage", "Custody", "Version history", "Transformation history", "Dependency continuity"],
    failureModes: ["Lost lineage", "Detached context", "Untracked transformation"],
    transitionRule: "Continuity must remain demonstrable before governed evidence can be treated as stable enough for use.",
    holdRefuseEscalateRule: "HOLD whenever continuity cannot be demonstrated across a material transformation, handoff, or dependency change.",
    upstreamDependencies: ["TA14-LINK-01", "TA14-LINK-02"],
    downstreamConsequence: "A correct record can become unusable or misleading after continuity breaks.",
    proofObject: "Continuity record preserving lineage, custody, transformations, dependencies, and version transitions.",
    masteryTask: "Trace continuity from source toward consequence and identify the earliest discontinuity that would invalidate reliance.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-04",
    order: 4,
    canonicalName: "Evidence Governance",
    slug: "evidence-governance",
    parentAnchor: "Continuity",
    region: "reality-evidence",
    definition: "Govern how evidence is created, classified, handled, updated, challenged, versioned, and retired.",
    governingQuestion: "Under what rules is evidence created, classified, updated, challenged, and retired?",
    evidenceRequirements: ["Evidence class", "Owner", "Handling rule", "Version", "Challenge state"],
    failureModes: ["Conflicting evidence classes", "Uncontrolled updates", "Ambiguous ownership"],
    transitionRule: "Evidence must have a determinate governance state before its admissibility can be evaluated.",
    holdRefuseEscalateRule: "REFUSE evidence whose governance state, owner, class, version, or challenge status is indeterminate.",
    upstreamDependencies: ["TA14-LINK-02", "TA14-LINK-03"],
    downstreamConsequence: "Ungoverned evidence can silently change, conflict, or acquire unsupported authority.",
    proofObject: "Evidence-governance metadata establishing class, stewardship, version, handling, and challenge status.",
    masteryTask: "Determine whether an evidence set is governable before asking whether it is admissible.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-05",
    order: 5,
    canonicalName: "Admissible Evidence",
    slug: "admissible-evidence",
    parentAnchor: "Admissibility",
    region: "reality-evidence",
    definition: "Determine whether available evidence is sufficient, attributable, timely, scoped, authentic, and usable for the declared decision.",
    governingQuestion: "Is this evidence sufficient, attributable, timely, scoped, and usable for this decision?",
    evidenceRequirements: ["Sufficiency", "Attribution", "Timeliness", "Scope", "Authenticity"],
    failureModes: ["Stale evidence", "Irrelevant evidence", "Incomplete evidence", "Unauthenticated evidence"],
    transitionRule: "The decision scope must not exceed what the admitted evidence can support.",
    holdRefuseEscalateRule: "HOLD or NARROW whenever evidence is insufficient for the declared decision; REFUSE when essential evidence is invalid or unauthenticated.",
    upstreamDependencies: ["TA14-LINK-03", "TA14-LINK-04"],
    downstreamConsequence: "Unsupported evidence can create false truth, reliance, authority, and consequence formation.",
    proofObject: "Admissible Evidence determination recording sufficiency, scope, timeliness, attribution, and authenticity.",
    masteryTask: "Judge whether the evidence is admissible for this exact decision, not merely whether evidence exists.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-06",
    order: 6,
    canonicalName: "Admissible Truth",
    slug: "admissible-truth",
    parentAnchor: "Admissibility",
    region: "reality-evidence",
    definition: "Form the strongest bounded truth claim that the admitted evidence can actually support.",
    governingQuestion: "What bounded truth claim can the evidence actually support?",
    evidenceRequirements: ["Explicit claim", "Uncertainty", "Evidence basis", "Exclusions"],
    failureModes: ["Inference presented as fact", "Overbroad certainty", "Hidden uncertainty"],
    transitionRule: "A truth claim must remain inside the evidentiary boundary before it can support reliance.",
    holdRefuseEscalateRule: "NARROW or REFUSE any claim that exceeds its evidence or conceals material uncertainty.",
    upstreamDependencies: ["TA14-LINK-05"],
    downstreamConsequence: "Overstated truth can corrupt all later reliance and authority decisions.",
    proofObject: "Bounded truth statement linked to admitted evidence, uncertainty, exclusions, and claim scope.",
    masteryTask: "Write the strongest supportable truth statement without exceeding the evidence.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-07",
    order: 7,
    canonicalName: "Reliance",
    slug: "reliance",
    parentAnchor: "Admissibility",
    region: "reliance-authority",
    definition: "Determine whether the admissible truth may be relied upon by a particular actor or system for a declared purpose and consequence.",
    governingQuestion: "Who may rely on what, for which purpose, and under what conditions?",
    evidenceRequirements: ["Declared reliance purpose", "Permitted users", "Conditions", "Dependencies"],
    failureModes: ["Purpose mismatch", "Scope drift", "Unsupported dependency"],
    transitionRule: "Reliance must remain purpose-bound and condition-bound before authority is exercised on its basis.",
    holdRefuseEscalateRule: "REFUSE downstream reliance outside the declared purpose, users, conditions, or dependency boundary.",
    upstreamDependencies: ["TA14-LINK-05", "TA14-LINK-06"],
    downstreamConsequence: "Valid evidence can be misused for a decision it was never fit to support.",
    proofObject: "Reliance declaration specifying actor, purpose, scope, dependencies, conditions, and expiry/revalidation triggers.",
    masteryTask: "State exactly who may rely on what, for which purpose, under which conditions, and where reliance must stop.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-08",
    order: 8,
    canonicalName: "Authority",
    slug: "authority",
    parentAnchor: "Admissibility",
    region: "reliance-authority",
    definition: "Verify who or what is permitted to act, decide, approve, refuse, escalate, or bind the next governance transition.",
    governingQuestion: "Who or what may act, decide, approve, refuse, or escalate?",
    evidenceRequirements: ["Authority source", "Delegation", "Validity period", "Action class"],
    failureModes: ["Unauthorized actor", "Expired delegation", "Ambiguous control"],
    transitionRule: "The next governed act may proceed only when authority for that action class is current and bounded.",
    holdRefuseEscalateRule: "STOP when authority cannot be established, has expired, is ambiguous, or does not cover the intended action.",
    upstreamDependencies: ["TA14-LINK-07"],
    downstreamConsequence: "A correct decision can still become inadmissible when made or executed without authority.",
    proofObject: "Authority record establishing source, scope, validity, delegation chain, and permitted action class.",
    masteryTask: "Identify the authority required for the next consequence-bearing step and prove that it is current and bounded.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-09",
    order: 9,
    canonicalName: "Legitimacy",
    slug: "legitimacy",
    parentAnchor: "Admissibility",
    region: "reliance-authority",
    definition: "Test whether otherwise valid authority is being exercised properly within its purpose, scope, constraints, and governing basis.",
    governingQuestion: "Is this exercise of authority proper here?",
    evidenceRequirements: ["Purpose", "Scope", "Constraints", "Governing basis", "Conflict check"],
    failureModes: ["Mission creep", "Abuse of discretion", "Invalid purpose", "Hidden conflict"],
    transitionRule: "Authority must be legitimate in this context before it can form a consequence.",
    holdRefuseEscalateRule: "ESCALATE or REFUSE illegitimate use of otherwise valid authority.",
    upstreamDependencies: ["TA14-LINK-07", "TA14-LINK-08"],
    downstreamConsequence: "Possession of authority can be mistaken for permission to use it for an improper purpose.",
    proofObject: "Legitimacy determination linking authority exercise to purpose, scope, governing basis, and conflict clearance.",
    masteryTask: "Explain why the authority is legitimate here, not merely why the actor possesses authority.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-10",
    order: 10,
    canonicalName: "Consequence Formation",
    slug: "consequence-formation",
    parentAnchor: "Admissibility",
    region: "reliance-authority",
    definition: "Make the emerging consequence visible and governable before it hardens into attachment, binding, commit, or execution.",
    governingQuestion: "What consequence is forming if the chain continues?",
    evidenceRequirements: ["Consequence model", "Affected subjects", "Reversibility", "Dependencies"],
    failureModes: ["Hidden downstream effects", "Unmodeled impact", "Premature inevitability"],
    transitionRule: "The emerging consequence must be visible enough to assess before attachment or assent occurs.",
    holdRefuseEscalateRule: "HOLD until material affected subjects, dependencies, reversibility, and downstream effects are visible enough to govern.",
    upstreamDependencies: ["TA14-LINK-06", "TA14-LINK-07", "TA14-LINK-08", "TA14-LINK-09"],
    downstreamConsequence: "A consequence can become procedurally inevitable before anyone has governed what is actually forming.",
    proofObject: "Consequence-formation record describing intended and foreseeable effects, affected subjects, reversibility, and dependencies.",
    masteryTask: "Map the consequence that will form if continuation occurs and identify when it becomes harder to reverse.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-11",
    order: 11,
    canonicalName: "Attachment / Assent",
    slug: "attachment-assent",
    parentAnchor: "Admissibility",
    region: "reliance-authority",
    definition: "Identify when a person, system, duty, obligation, or consequence becomes attached, accepted, or assigned on a governed basis.",
    governingQuestion: "What is attaching, to whom, and on what basis?",
    evidenceRequirements: ["Subject", "Obligation", "Assent or attachment basis", "Timing", "Conditions"],
    failureModes: ["Silent attachment", "Coerced or accidental binding", "Unclear assent"],
    transitionRule: "Attachment must be identifiable and supportable before the chain enters Binding Reality.",
    holdRefuseEscalateRule: "Do not bind an unidentified, unsupported, coerced, or materially ambiguous attachment.",
    upstreamDependencies: ["TA14-LINK-10"],
    downstreamConsequence: "Abstract governance can silently attach real obligations or consequences to a subject without supportable assent or basis.",
    proofObject: "Attachment/assent record identifying subject, obligation, basis, timing, conditions, and exceptions.",
    masteryTask: "Show what is attaching, to whom, when, under what authority, and on what basis.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-12",
    order: 12,
    canonicalName: "Binding Reality",
    slug: "binding-reality",
    parentAnchor: "Binding",
    region: "binding-commit",
    definition: "Reconfirm the real-world state immediately before a supported determination becomes bound.",
    governingQuestion: "What real-world state exists immediately before binding?",
    evidenceRequirements: ["Fresh state check", "Dependency status", "Relevant changes"],
    failureModes: ["State changed after review", "Dependency drift", "Obsolete condition"],
    transitionRule: "Material conditions must be revalidated against current reality before Binding.",
    holdRefuseEscalateRule: "HOLD and return upstream when a material state or dependency has changed since the prior determination.",
    upstreamDependencies: ["TA14-LINK-11"],
    downstreamConsequence: "A previously valid determination can bind against a world that no longer exists.",
    proofObject: "Binding Reality receipt establishing current state, relevant changes, and dependency status immediately before binding.",
    masteryTask: "Revalidate current reality at the boundary where a determination is about to become operative.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-13",
    order: 13,
    canonicalName: "Binding",
    slug: "binding",
    parentAnchor: "Binding",
    region: "binding-commit",
    definition: "Create the bounded, reviewable linkage that makes a supported determination operative for the declared parties, systems, scope, and terms.",
    governingQuestion: "Exactly what becomes bound and what remains outside scope?",
    evidenceRequirements: ["Bound object", "Scope", "Parties or systems", "Terms", "Receipt"],
    failureModes: ["Premature binding", "Incomplete scope", "Non-reviewable linkage"],
    transitionRule: "Only bounded and reviewable determinations may enter the commitment path.",
    holdRefuseEscalateRule: "REFUSE binding without an explicit, reviewable linkage identifying object, parties/systems, scope, terms, and exclusions.",
    upstreamDependencies: ["TA14-LINK-11", "TA14-LINK-12"],
    downstreamConsequence: "Ambiguous or premature binding can create obligations and momentum that later controls cannot safely unwind.",
    proofObject: "Binding receipt specifying bound object, parties/systems, scope, terms, exclusions, and governing basis.",
    masteryTask: "Specify exactly what becomes bound, what does not, and what receipt proves the boundary.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-14",
    order: 14,
    canonicalName: "Commit Reality",
    slug: "commit-reality",
    parentAnchor: "Commit",
    region: "binding-commit",
    definition: "Reconfirm the actual state immediately before consequence-bearing commitment.",
    governingQuestion: "What actual state exists immediately before consequence-bearing commitment?",
    evidenceRequirements: ["Final reality check", "New evidence", "Risk state", "Authority freshness"],
    failureModes: ["Late drift", "Changed risk", "New evidence", "Altered authority"],
    transitionRule: "Commit assumptions must still be true at the moment commitment is about to occur.",
    holdRefuseEscalateRule: "HOLD or return upstream when binding assumptions, evidence, risk, authority, or scope have materially changed.",
    upstreamDependencies: ["TA14-LINK-13"],
    downstreamConsequence: "A valid binding can become inadmissible before commit when the world or authority changes.",
    proofObject: "Commit Reality receipt recording current state, fresh evidence, authority, scope, risk, and material changes.",
    masteryTask: "Run the final pre-commit reality check and identify whether any condition requires reopening earlier links.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-15",
    order: 15,
    canonicalName: "Commit",
    slug: "commit",
    parentAnchor: "Commit",
    region: "binding-commit",
    definition: "Authorize the exact bounded transition from governed determination into consequence-bearing action.",
    governingQuestion: "What bounded transition into action is authorized?",
    evidenceRequirements: ["Commit decision", "Exact scope", "Refusal conditions", "Receipt"],
    failureModes: ["Scope expansion", "Missing final approval", "Hidden defaults"],
    transitionRule: "Execution preparation may begin only from an explicit, bounded, current commitment.",
    holdRefuseEscalateRule: "No admissible commit without explicit bounded authorization and preserved refusal conditions.",
    upstreamDependencies: ["TA14-LINK-13", "TA14-LINK-14"],
    downstreamConsequence: "An intention can silently become action authority without a reviewable commitment boundary.",
    proofObject: "Commit receipt identifying exact authorized transition, scope, conditions, authority, and refusal triggers.",
    masteryTask: "State the exact commitment and prove what the system is and is not authorized to do next.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-16",
    order: 16,
    canonicalName: "Execution Reality",
    slug: "execution-reality",
    parentAnchor: "Execution",
    region: "execution-non-occurrence",
    definition: "Confirm the live state in which execution would actually occur, including dependencies and safeguards that may have changed after commit.",
    governingQuestion: "What live state exists where execution will actually occur?",
    evidenceRequirements: ["Runtime dependencies", "Safeguards", "Environment", "Freshness"],
    failureModes: ["Runtime drift", "Unavailable safeguards", "Changed dependencies"],
    transitionRule: "Execution may occur only when live runtime reality remains compatible with the bounded commitment.",
    holdRefuseEscalateRule: "BLOCK execution when runtime reality, dependencies, safeguards, or constraints no longer match the commit basis.",
    upstreamDependencies: ["TA14-LINK-15"],
    downstreamConsequence: "A technically correct action can execute against a materially different environment than the one that was committed.",
    proofObject: "Execution Reality receipt recording runtime environment, dependency state, safeguards, freshness, and commit comparison.",
    masteryTask: "Validate the live execution environment and determine whether continuation, hold, refusal, or escalation is required.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-17",
    order: 17,
    canonicalName: "Admissible Non-Occurrence",
    slug: "admissible-non-occurrence",
    parentAnchor: "Execution",
    region: "execution-non-occurrence",
    definition: "Recognize and preserve a justified governed state in which consequence-bearing action correctly does not occur.",
    governingQuestion: "Can non-execution be proven as the correct governed result?",
    evidenceRequirements: ["Refusal or block basis", "Missing or failed condition", "Decision record"],
    failureModes: ["Treating refusal as failure", "Undocumented block", "Forced continuation"],
    transitionRule: "When continuation is not supportable, justified non-occurrence must be preserved as a governed result rather than hidden as an error.",
    holdRefuseEscalateRule: "REFUSE execution when a required admissibility condition cannot be established; preserve the refusal basis and route state.",
    upstreamDependencies: ["TA14-LINK-16"],
    downstreamConsequence: "Systems can be pressured into execution merely because non-execution is not represented as a valid governed result.",
    proofObject: "Non-occurrence decision record establishing failed condition, refusal/block basis, authority, route state, and time.",
    masteryTask: "Prove why non-execution is the admissible result and distinguish correct refusal from technical failure.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-18",
    order: 18,
    canonicalName: "Prevented Consequence",
    slug: "prevented-consequence",
    parentAnchor: "Execution",
    region: "execution-non-occurrence",
    definition: "Record the consequence that was intentionally prevented by refusal, containment, intervention, or non-execution.",
    governingQuestion: "What consequence was intentionally prevented, and how is that proven?",
    evidenceRequirements: ["Intervention record", "Causal basis", "Prevented state", "Receipt"],
    failureModes: ["Invisible prevention", "No causal record", "No intervention proof"],
    transitionRule: "A prevention claim must be evidence-linked before it may enter Outcome Reality as a governed result.",
    holdRefuseEscalateRule: "Do not claim prevention without evidence connecting the intervention or non-occurrence decision to the avoided consequence.",
    upstreamDependencies: ["TA14-LINK-16", "TA14-LINK-17"],
    downstreamConsequence: "Successful governance can disappear from the record when prevented harm is not represented or proven.",
    proofObject: "Prevented-consequence receipt linking intervention/non-occurrence to the consequence that did not attach.",
    masteryTask: "Document what was prevented, the causal pathway, the intervention, and the evidence supporting the prevention claim.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-19",
    order: 19,
    canonicalName: "Execution",
    slug: "execution",
    parentAnchor: "Execution",
    region: "execution-non-occurrence",
    definition: "Carry out the authorized action within the exact bounded commitment, live runtime conditions, and execution controls.",
    governingQuestion: "Did action occur within the authorized commitment and controls?",
    evidenceRequirements: ["Execution trace", "Scope match", "Controls", "Side-effect record"],
    failureModes: ["Bypass", "Scope overrun", "Unauthorized side effect", "Uncontrolled execution"],
    transitionRule: "Outcome observation begins only after actual execution or governed non-execution has been established.",
    holdRefuseEscalateRule: "STOP or CONTAIN when execution departs from bounded authorization, required safeguards, or runtime constraints.",
    upstreamDependencies: ["TA14-LINK-15", "TA14-LINK-16"],
    downstreamConsequence: "Technically successful execution can still misexecute when scope, authority, or controls are exceeded.",
    proofObject: "Execution trace proving action, scope, controls, runtime state, side effects, and commit correspondence.",
    masteryTask: "Show whether execution matched the authorized commitment and identify any scope or control deviation.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-20",
    order: 20,
    canonicalName: "Outcome Reality",
    slug: "outcome-reality",
    parentAnchor: "Outcome",
    region: "outcome-recursion",
    definition: "Observe the real state that now exists after execution, refusal, containment, or non-occurrence.",
    governingQuestion: "What real state exists after execution or non-execution?",
    evidenceRequirements: ["Direct post-action observation", "Measurements", "Timing"],
    failureModes: ["Assumed success", "Proxy-only measurement", "Delayed harm ignored"],
    transitionRule: "Outcome cannot be declared until post-action reality has been observed sufficiently for the declared scope.",
    holdRefuseEscalateRule: "HOLD outcome determination when direct post-action reality is unavailable, materially delayed, or represented only by an inadequate proxy.",
    upstreamDependencies: ["TA14-LINK-17", "TA14-LINK-18", "TA14-LINK-19"],
    downstreamConsequence: "A system can declare success without contacting the reality actually produced by action or non-action.",
    proofObject: "Outcome Reality observation record with measurements, timing, source, and execution/non-occurrence linkage.",
    masteryTask: "Measure the state that now exists before deciding what outcome the chain produced.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-21",
    order: 21,
    canonicalName: "Outcome",
    slug: "outcome",
    parentAnchor: "Outcome",
    region: "outcome-recursion",
    definition: "Determine, classify, and record the governed result of the chain against intended and permitted consequence.",
    governingQuestion: "What governed result did the chain actually produce?",
    evidenceRequirements: ["Result classification", "Intended-versus-actual variance", "Accountability"],
    failureModes: ["No verification", "Selective reporting", "Missing accountability"],
    transitionRule: "Closure requires an evaluated and recorded outcome before the new reality is inherited by future governance.",
    holdRefuseEscalateRule: "HOLD closure until the result, material variance, accountability, and unresolved effects are recorded.",
    upstreamDependencies: ["TA14-LINK-20"],
    downstreamConsequence: "Execution can be treated as completion even when the actual governed result is unknown or materially divergent.",
    proofObject: "Outcome determination recording result class, variance, intended consequence, actual consequence, and accountability.",
    masteryTask: "Classify the outcome and identify any variance between intended, permitted, prevented, and actual consequence.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-22",
    order: 22,
    canonicalName: "New Reality",
    slug: "new-reality",
    parentAnchor: "Outcome",
    region: "outcome-recursion",
    definition: "Recognize the changed starting reality created by the governed outcome and make it explicit for future decisions.",
    governingQuestion: "What new starting reality now exists because of the outcome?",
    evidenceRequirements: ["Updated state", "Changed constraints", "New dependencies"],
    failureModes: ["Treating outcome as terminal", "Failure to update state"],
    transitionRule: "Future governance must inherit the new reality rather than silently continuing from pre-outcome assumptions.",
    holdRefuseEscalateRule: "HOLD future decision-making when the new state, constraints, or dependencies have not been updated after a material outcome.",
    upstreamDependencies: ["TA14-LINK-20", "TA14-LINK-21"],
    downstreamConsequence: "Future decisions can operate on an obsolete world model after consequence has already changed reality.",
    proofObject: "New Reality state record describing changed conditions, constraints, dependencies, and inherited consequences.",
    masteryTask: "Define the new reality created by the outcome and identify what future governance must inherit.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-23",
    order: 23,
    canonicalName: "Memory",
    slug: "memory",
    parentAnchor: "Outcome",
    region: "outcome-recursion",
    definition: "Preserve governed knowledge, lineage, findings, doctrine, limitations, supersession state, and lessons needed for future use.",
    governingQuestion: "What governed knowledge must survive for future use?",
    evidenceRequirements: ["Lineage", "Findings", "Doctrine", "Lessons", "Version and supersession state"],
    failureModes: ["Orphaned lessons", "Doctrine drift", "Overwritten records", "Superseded material reused as current"],
    transitionRule: "Future Chain may rely only on controlled memory whose version, lineage, limitations, and supersession state are visible.",
    holdRefuseEscalateRule: "Do not reuse ungoverned, conflicting, orphaned, or superseded memory as current doctrine without resolution.",
    upstreamDependencies: ["TA14-LINK-21", "TA14-LINK-22"],
    downstreamConsequence: "The system repeats prior errors, loses provenance, or silently treats obsolete governance as current.",
    proofObject: "Governed memory record with lineage, version, findings, lessons, limitations, conflict state, and supersession status.",
    masteryTask: "Specify what must survive, what must not be silently reused, and how future reviewers can retrieve governed memory.",
    versionState: "active",
  }),
  link({
    linkId: "TA14-LINK-24",
    order: 24,
    canonicalName: "Future Chain",
    slug: "future-chain",
    parentAnchor: "Outcome",
    region: "outcome-recursion",
    definition: "Launch the next governed cycle from New Reality and controlled Memory with explicit entry triggers, inherited constraints, and preserved lineage.",
    governingQuestion: "What triggers the next governed cycle, and what does it inherit?",
    evidenceRequirements: ["Entry trigger", "Inherited state", "Memory references", "Constraints"],
    failureModes: ["Uncontrolled recurrence", "Missing handoff", "Forgotten constraints"],
    transitionRule: "A new chain begins only from governed New Reality and controlled Memory with explicit entry conditions.",
    holdRefuseEscalateRule: "HOLD recurrence when entry conditions, inherited state, memory references, or constraints are missing or unresolved.",
    upstreamDependencies: ["TA14-LINK-22", "TA14-LINK-23"],
    downstreamConsequence: "A new governance cycle can detach from the reality, evidence, limitations, and lessons produced by the previous chain.",
    proofObject: "Future Chain entry record containing trigger, inherited state, memory references, constraints, and prior-chain linkage.",
    masteryTask: "Define the trigger and inherited conditions for the next chain and prove continuity with the governed outcome and memory state.",
    versionState: "active",
  }),
]);

export const TA14_24_LINK_CHAIN_STRING = TA14_24_LINKS
  .map((item) => item.canonicalName)
  .join(" -> ");

export const TA14_8_TO_24_LINEAGE: Readonly<Record<TA14ChainOfEightAnchor, readonly TA14LinkId[]>> = Object.freeze({
  Reality: ["TA14-LINK-01", "TA14-LINK-12", "TA14-LINK-14", "TA14-LINK-16", "TA14-LINK-20"],
  Record: ["TA14-LINK-02"],
  Continuity: ["TA14-LINK-03", "TA14-LINK-04"],
  Admissibility: ["TA14-LINK-05", "TA14-LINK-06", "TA14-LINK-07", "TA14-LINK-08", "TA14-LINK-09", "TA14-LINK-10", "TA14-LINK-11"],
  Binding: ["TA14-LINK-12", "TA14-LINK-13"],
  Commit: ["TA14-LINK-14", "TA14-LINK-15"],
  Execution: ["TA14-LINK-16", "TA14-LINK-17", "TA14-LINK-18", "TA14-LINK-19"],
  Outcome: ["TA14-LINK-20", "TA14-LINK-21", "TA14-LINK-22", "TA14-LINK-23", "TA14-LINK-24"],
});

export const TA14_ARCHITECTURE_REGIONS: readonly {
  readonly id: TA14ArchitectureRegion;
  readonly label: string;
  readonly linkIds: readonly TA14LinkId[];
}[] = Object.freeze([
  {
    id: "reality-evidence",
    label: "Reality & Evidence",
    linkIds: ["TA14-LINK-01", "TA14-LINK-02", "TA14-LINK-03", "TA14-LINK-04", "TA14-LINK-05", "TA14-LINK-06"],
  },
  {
    id: "reliance-authority",
    label: "Reliance, Authority & Consequence Formation",
    linkIds: ["TA14-LINK-07", "TA14-LINK-08", "TA14-LINK-09", "TA14-LINK-10", "TA14-LINK-11"],
  },
  {
    id: "binding-commit",
    label: "Binding & Commit",
    linkIds: ["TA14-LINK-12", "TA14-LINK-13", "TA14-LINK-14", "TA14-LINK-15"],
  },
  {
    id: "execution-non-occurrence",
    label: "Execution & Admissible Non-Occurrence",
    linkIds: ["TA14-LINK-16", "TA14-LINK-17", "TA14-LINK-18", "TA14-LINK-19"],
  },
  {
    id: "outcome-recursion",
    label: "Outcome, New Reality, Memory & Future Chain",
    linkIds: ["TA14-LINK-20", "TA14-LINK-21", "TA14-LINK-22", "TA14-LINK-23", "TA14-LINK-24"],
  },
]);

export const TA14_EXECUTION_CAPABLE_ROUTE: readonly TA14LinkId[] = Object.freeze([
  "TA14-LINK-15",
  "TA14-LINK-16",
  "TA14-LINK-19",
  "TA14-LINK-20",
  "TA14-LINK-21",
  "TA14-LINK-22",
  "TA14-LINK-23",
  "TA14-LINK-24",
]);

export const TA14_NON_OCCURRENCE_ROUTE: readonly TA14LinkId[] = Object.freeze([
  "TA14-LINK-15",
  "TA14-LINK-16",
  "TA14-LINK-17",
  "TA14-LINK-18",
  "TA14-LINK-20",
  "TA14-LINK-21",
  "TA14-LINK-22",
  "TA14-LINK-23",
  "TA14-LINK-24",
]);

export const TA14_NON_OCCURRENCE_TEACHING_RULE =
  "Reaching Execution is not the highest score. Preserving admissibility is the goal, including correct refusal. Non-execution can be a governed success when continuation is no longer admissible." as const;

export interface TA14RouteState {
  readonly currentLink: TA14LinkId;
  readonly lastAdmissibleLink: TA14LinkId | null;
  readonly firstBrokenLink: TA14LinkId | null;
  readonly decision: TA14RouteDecision;
  readonly reason: string;
  readonly requiredRecovery: readonly string[];
  readonly formingConsequence: string;
  readonly evidenceRefs: readonly string[];
  readonly evaluatedAt: string;
}

export const TA14_ROUTE_STATE_QUESTIONS = [
  "Where are we in the 24-link chain?",
  "What is the last admissibly established link?",
  "What evidence establishes it?",
  "What is the first link that is no longer supportable?",
  "What must become true before the next link is allowed?",
  "What consequence is forming if we continue?",
] as const;

export function getTA14LinkById(linkId: TA14LinkId): TA14CanonicalLink {
  const found = TA14_24_LINKS.find((item) => item.linkId === linkId);
  if (!found) {
    throw new Error(`Unknown TA-14 link id: ${linkId}`);
  }
  return found;
}

export function getTA14LinkByOrder(order: TA14LinkOrder): TA14CanonicalLink {
  const found = TA14_24_LINKS.find((item) => item.order === order);
  if (!found) {
    throw new Error(`Unknown TA-14 link order: ${order}`);
  }
  return found;
}

export function getTA14LinkBySlug(slug: string): TA14CanonicalLink | undefined {
  return TA14_24_LINKS.find((item) => item.slug === slug);
}

export function getTA14LinksForAnchor(
  anchor: TA14ChainOfEightAnchor,
): readonly TA14CanonicalLink[] {
  return TA14_8_TO_24_LINEAGE[anchor].map(getTA14LinkById);
}

export function getTA14LinksForRegion(
  region: TA14ArchitectureRegion,
): readonly TA14CanonicalLink[] {
  return TA14_24_LINKS.filter((item) => item.region === region);
}

export function getTA14NextCanonicalLink(
  linkId: TA14LinkId,
): TA14CanonicalLink | null {
  const current = getTA14LinkById(linkId);
  if (current.order === 24) return null;
  return getTA14LinkByOrder((current.order + 1) as TA14LinkOrder);
}

export function validateTA1424LinkCanon(): readonly string[] {
  const errors: string[] = [];

  if (TA14_24_LINKS.length !== 24) {
    errors.push(`Expected 24 canonical links; received ${TA14_24_LINKS.length}.`);
  }

  const ids = new Set<string>();
  const names = new Set<string>();
  const slugs = new Set<string>();

  TA14_24_LINKS.forEach((item, index) => {
    const expectedOrder = index + 1;
    const expectedId = `TA14-LINK-${String(expectedOrder).padStart(2, "0")}`;

    if (item.order !== expectedOrder) {
      errors.push(`Order mismatch at index ${index}: expected ${expectedOrder}, received ${item.order}.`);
    }
    if (item.linkId !== expectedId) {
      errors.push(`ID mismatch for order ${item.order}: expected ${expectedId}, received ${item.linkId}.`);
    }
    if (ids.has(item.linkId)) errors.push(`Duplicate link id: ${item.linkId}.`);
    if (names.has(item.canonicalName)) errors.push(`Duplicate canonical name: ${item.canonicalName}.`);
    if (slugs.has(item.slug)) errors.push(`Duplicate slug: ${item.slug}.`);

    ids.add(item.linkId);
    names.add(item.canonicalName);
    slugs.add(item.slug);

    if (!item.definition.trim()) errors.push(`${item.linkId} is missing a definition.`);
    if (!item.governingQuestion.trim()) errors.push(`${item.linkId} is missing a governing question.`);
    if (item.evidenceRequirements.length === 0) errors.push(`${item.linkId} is missing evidence requirements.`);
    if (item.failureModes.length === 0) errors.push(`${item.linkId} is missing failure modes.`);
    if (!item.transitionRule.trim()) errors.push(`${item.linkId} is missing a transition rule.`);
    if (!item.holdRefuseEscalateRule.trim()) errors.push(`${item.linkId} is missing a hold/refuse/escalate rule.`);
    if (!item.proofObject.trim()) errors.push(`${item.linkId} is missing a proof object.`);
  });

  return Object.freeze(errors);
}

export const TA14_24_LINK_CANON_VALIDATION = validateTA1424LinkCanon();

export const TA14_24_LINK_CANON = Object.freeze({
  version: TA14_24_LINK_CANON_VERSION,
  state: TA14_24_LINK_CANON_STATE,
  chainOfEightOriginDate: TA14_CHAIN_OF_EIGHT_ORIGIN_DATE,
  chainOfEight: TA14_CHAIN_OF_EIGHT,
  provenanceStatement: TA14_PROVENANCE_STATEMENT,
  originRule: TA14_ORIGIN_RULE,
  links: TA14_24_LINKS,
  lineage: TA14_8_TO_24_LINEAGE,
  regions: TA14_ARCHITECTURE_REGIONS,
  executionCapableRoute: TA14_EXECUTION_CAPABLE_ROUTE,
  nonOccurrenceRoute: TA14_NON_OCCURRENCE_ROUTE,
  nonOccurrenceTeachingRule: TA14_NON_OCCURRENCE_TEACHING_RULE,
  routeStateQuestions: TA14_ROUTE_STATE_QUESTIONS,
  validationErrors: TA14_24_LINK_CANON_VALIDATION,
});

export default TA14_24_LINK_CANON;
