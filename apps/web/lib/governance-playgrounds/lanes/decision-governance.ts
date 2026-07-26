import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Decision Governance Playground
 *
 * Tests whether a consequential decision is identified, evidence-bound,
 * rule-constrained, authorized, reviewable, preserved, and capable of replay
 * before any downstream execution is permitted.
 *
 * Governing principle:
 * No admissible evidence. No admissible execution.
 */

export const DECISION_GOVERNANCE_GATE_IDS = [
  "G01_ROUTE_IDENTITY",
  "G02_GOVERNANCE_CLAIM",
  "G03_SCOPE_BOUNDARY",
  "G04_ACTOR_IDENTITY",
  "G05_EVIDENCE_SUFFICIENCY",
  "G06_AUTHORITY_VALIDITY",
  "G07_RULE_CONTROL_BINDING",
  "G08_DEPENDENCY_INTEGRITY",
  "G09_HUMAN_OVERSIGHT",
  "G10_EXECUTION_CONSTRAINT",
  "G11_INTERVENTION_ESCALATION",
  "G12_RECORD_CONTINUITY",
  "G13_OUTCOME_CORRESPONDENCE",
  "G14_REPLAY_CONTINUING_VALIDITY",
] as const satisfies readonly SharedGateId[];

export const DECISION_GOVERNANCE_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "DECISION_IDENTITY",
  "DECISION_REQUEST",
  "DECISION_SCOPE_RECORD",
  "DECISION_AUTHORITY",
  "DELEGATION_RECORD",
  "DECISION_CRITERIA",
  "RULE_SET",
  "CONTROL_BINDING",
  "EVIDENCE_CATALOG",
  "EVIDENCE_AUTHORITY",
  "EVIDENCE_PROVENANCE",
  "EVIDENCE_CONFLICT_RECORD",
  "ALTERNATIVE_ANALYSIS",
  "UNCERTAINTY_ASSESSMENT",
  "HUMAN_JUDGMENT_RECORD",
  "REVIEW_RECORD",
  "OVERRIDE_RECORD",
  "COMMIT_AUTHORIZATION",
  "DECISION_RECEIPT",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "SUPERSESSION_RECORD",
  "CHANGE_RECORD",
  "REPLAY_RESULT",
] as const;

export type DecisionGovernanceEvidenceType =
  (typeof DECISION_GOVERNANCE_EVIDENCE_TYPES)[number];

export const DECISION_GOVERNANCE_SECTIONS = [
  {
    sectionId: "decision-identity",
    title: "Decision Identity",
    description:
      "Identify the exact decision, decision class, owner, requester, beneficiary, subject, jurisdiction, environment, and validity period being governed.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Decision route title",
        type: "text",
        required: true,
        placeholder: "Approve high-value vendor payment",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Decision route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the proposed decision, why it is being considered, who or what it affects, and what downstream execution could follow.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "decisionIdentifier",
        label: "Stable decision identifier",
        type: "text",
        required: true,
        placeholder: "decision:vendor-payment:2026-000184",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "decisionClass",
        label: "Decision class",
        type: "select",
        required: true,
        options: [
          { value: "approval", label: "Approval" },
          { value: "denial", label: "Denial" },
          { value: "eligibility", label: "Eligibility" },
          { value: "allocation", label: "Allocation" },
          { value: "classification", label: "Classification" },
          { value: "recommendation", label: "Recommendation" },
          { value: "prioritization", label: "Prioritization" },
          { value: "intervention", label: "Intervention" },
          { value: "authorization", label: "Authorization" },
          { value: "other", label: "Other consequential decision" },
        ],
      },
      {
        key: "decisionOwner",
        label: "Decision owner",
        type: "text",
        required: true,
        placeholder: "Finance Governance Team",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "decisionRequester",
        label: "Decision requester",
        type: "text",
        required: true,
        placeholder: "Accounts Payable Operations",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "decisionSubject",
        label: "Decision subject",
        type: "text",
        required: true,
        placeholder: "Invoice INV-2026-8841 / Vendor V-219",
        validation: { minLength: 2, maxLength: 500 },
      },
      {
        key: "affectedParties",
        label: "Affected parties",
        type: "json",
        required: true,
        placeholder:
          '[{"partyId":"vendor-219","role":"beneficiary"},{"partyId":"organization-1","role":"payer"}]',
      },
      {
        key: "jurisdiction",
        label: "Jurisdiction or governing domain",
        type: "text",
        required: true,
        placeholder: "United States / Florida / Internal Finance Policy",
        validation: { minLength: 2, maxLength: 500 },
      },
      {
        key: "decisionEnvironment",
        label: "Decision environment",
        type: "select",
        required: true,
        options: [
          { value: "simulation", label: "Simulation" },
          { value: "sandbox", label: "Sandbox" },
          { value: "staging", label: "Staging" },
          { value: "production", label: "Production" },
          { value: "advisory-only", label: "Advisory only" },
        ],
      },
    ],
  },
  {
    sectionId: "claim-scope-boundary",
    title: "Governance Claim and Decision Boundary",
    description:
      "State exactly what is being decided, what the decision can and cannot authorize, and which facts, actors, systems, time periods, and consequences remain inside or outside the route.",
    order: 20,
    fields: [
      {
        key: "governanceClaim",
        label: "Decision governance claim",
        type: "textarea",
        required: true,
        placeholder:
          "This route determines whether the declared vendor payment is admissible for approval using the identified evidence, criteria, authority, and controls.",
        validation: { minLength: 20, maxLength: 4000 },
      },
      {
        key: "decisionQuestion",
        label: "Decision question",
        type: "textarea",
        required: true,
        placeholder:
          "Does the preserved evidence support approval of this exact payment under the declared rules and authority?",
        validation: { minLength: 10, maxLength: 2000 },
      },
      {
        key: "permittedDeterminations",
        label: "Permitted determinations",
        type: "multiselect",
        required: true,
        options: [
          { value: "ALLOW", label: "ALLOW" },
          { value: "HOLD", label: "HOLD" },
          { value: "DENY", label: "DENY" },
          { value: "ESCALATE", label: "ESCALATE" },
        ],
      },
      {
        key: "inScope",
        label: "In-scope facts and consequences",
        type: "textarea",
        required: true,
        placeholder:
          "Identify the exact decision, evidence period, parties, amount, destination, rules, systems, and downstream execution covered.",
        validation: { minLength: 10, maxLength: 5000 },
      },
      {
        key: "outOfScope",
        label: "Out-of-scope facts and consequences",
        type: "textarea",
        required: true,
        placeholder:
          "Identify excluded decisions, parties, periods, jurisdictions, systems, outcomes, and legal conclusions.",
        validation: { minLength: 10, maxLength: 5000 },
      },
      {
        key: "decisionConsequences",
        label: "Potential decision consequences",
        type: "json",
        required: true,
        placeholder:
          '[{"determination":"ALLOW","consequence":"payment may proceed to independent commit gate"},{"determination":"HOLD","consequence":"execution blocked pending correction"}]',
      },
      {
        key: "explicitNonClaims",
        label: "Explicit non-claims",
        type: "textarea",
        required: true,
        placeholder:
          "This route does not prove legal compliance, factual truth beyond submitted evidence, downstream execution, or outcome causation unless separately tested.",
        validation: { minLength: 10, maxLength: 4000 },
      },
    ],
  },
  {
    sectionId: "actors-authority",
    title: "Actors, Roles, and Decision Authority",
    description:
      "Identify every requester, evidence provider, evaluator, reviewer, approver, override authority, commit authority, and affected party material to the decision.",
    order: 30,
    fields: [
      {
        key: "actors",
        label: "Material actors",
        type: "json",
        required: true,
        placeholder:
          '[{"actorId":"requester-1","role":"requester","type":"human"},{"actorId":"reviewer-1","role":"independent reviewer","type":"human"}]',
      },
      {
        key: "responsibilityMap",
        label: "Decision responsibility map",
        type: "json",
        required: true,
        placeholder:
          '{"request":"requester-1","provideEvidence":"evidence-owner-1","evaluate":"evaluator-1","approve":"approver-1","commit":"commit-service-1"}',
      },
      {
        key: "decisionAuthority",
        label: "Decision authority",
        type: "json",
        required: true,
        placeholder:
          '[{"holder":"approver-1","decisionClass":"vendor-payment","limit":"25000 USD","validUntil":"2026-12-31T23:59:59Z"}]',
      },
      {
        key: "delegationRecords",
        label: "Delegation records",
        type: "json",
        required: true,
        placeholder:
          '[{"delegator":"finance-director","delegate":"approver-1","scope":"payments up to 25000 USD","revocable":true}]',
      },
      {
        key: "conflictOfInterestPolicy",
        label: "Conflict-of-interest policy",
        type: "textarea",
        required: true,
        placeholder:
          "Describe disqualifying relationships, financial interests, prior involvement, and required replacement procedures.",
        validation: { minLength: 20, maxLength: 4000 },
      },
      {
        key: "separationOfDuties",
        label: "Separation-of-duties rules",
        type: "json",
        required: true,
        placeholder:
          '[{"rule":"requester cannot be final approver"},{"rule":"evidence provider cannot independently validate its own evidence"}]',
      },
      {
        key: "overrideAuthority",
        label: "Override authority",
        type: "json",
        required: true,
        placeholder:
          '[{"holder":"chief-financial-officer","scope":"documented emergency override","requiresIndependentReview":true}]',
      },
      {
        key: "commitAuthority",
        label: "Commit authority",
        type: "text",
        required: true,
        placeholder: "finance-controller-service",
        validation: { minLength: 2, maxLength: 240 },
      },
    ],
  },
  {
    sectionId: "criteria-rules-controls",
    title: "Decision Criteria, Rules, and Controls",
    description:
      "Define the criteria, thresholds, weighting, precedence, exception logic, rule-to-control bindings, and decision sequence that constrain the determination.",
    order: 40,
    fields: [
      {
        key: "decisionCriteria",
        label: "Decision criteria",
        type: "json",
        required: true,
        placeholder:
          '[{"criterionId":"invoice-valid","description":"Invoice is authentic and current","required":true},{"criterionId":"beneficiary-proven","required":true}]',
      },
      {
        key: "thresholds",
        label: "Decision thresholds",
        type: "json",
        required: true,
        placeholder:
          '[{"criterionId":"amount-limit","operator":"<=","value":25000,"unit":"USD","failure":"HOLD"}]',
      },
      {
        key: "ruleSet",
        label: "Applicable rule set",
        type: "json",
        required: true,
        placeholder:
          '[{"ruleId":"FIN-AP-01","version":"4.2","source":"Finance Policy","effectiveFrom":"2026-01-01"}]',
      },
      {
        key: "rulePrecedence",
        label: "Rule precedence",
        type: "json",
        required: true,
        placeholder:
          '["law and regulation","binding contract","board policy","finance policy","operational procedure"]',
      },
      {
        key: "exceptionRules",
        label: "Exception rules",
        type: "json",
        required: true,
        placeholder:
          '[{"exceptionId":"emergency-payment","authority":"chief-financial-officer","requires":["written basis","independent review","post-event audit"]}]',
      },
      {
        key: "ruleControlBindings",
        label: "Rule-to-control bindings",
        type: "json",
        required: true,
        placeholder:
          '[{"ruleId":"FIN-AP-01","control":"beneficiary verification gate","failure":"HOLD"}]',
      },
      {
        key: "requiredSequence",
        label: "Required decision sequence",
        type: "json",
        required: true,
        placeholder:
          '["identify-decision","establish-scope","validate-actors","validate-evidence","apply-rules","resolve-conflicts","determine","review","commit","preserve"]',
      },
      {
        key: "criteriaChangePolicy",
        label: "Criteria and rule change policy",
        type: "textarea",
        required: true,
        placeholder:
          "Describe versioning, notice, approval, effective dates, in-flight decision treatment, preservation, and replay requirements.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "evidence-uncertainty-alternatives",
    title: "Evidence, Uncertainty, and Alternatives",
    description:
      "Identify the evidence needed for the decision, establish its authority and provenance, preserve uncertainty, compare alternatives, and resolve conflicts without hiding them.",
    order: 50,
    fields: [
      {
        key: "requiredEvidence",
        label: "Required evidence catalog",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceType":"DECISION_REQUEST","required":true},{"evidenceType":"DECISION_AUTHORITY","required":true},{"evidenceType":"EVIDENCE_PROVENANCE","required":true}]',
      },
      {
        key: "evidenceAuthorityRules",
        label: "Evidence authority rules",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceType":"beneficiary-bank-record","authoritativeSource":"approved vendor master","maximumAge":"24 hours"}]',
      },
      {
        key: "evidenceProvenanceRequired",
        label: "Evidence provenance required",
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      {
        key: "evidenceFreshnessRules",
        label: "Evidence freshness rules",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceType":"authority-record","maximumAge":"1 hour"},{"evidenceType":"invoice","maximumAge":"90 days"}]',
      },
      {
        key: "uncertaintyAssessment",
        label: "Uncertainty assessment",
        type: "textarea",
        required: true,
        placeholder:
          "Describe known unknowns, confidence limits, unresolved facts, assumptions, and which uncertainties block determination.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "alternativeDecisions",
        label: "Alternative decisions considered",
        type: "json",
        required: true,
        placeholder:
          '[{"alternative":"ALLOW","supportingEvidence":["invoice-valid","authority-valid"]},{"alternative":"HOLD","supportingEvidence":["beneficiary-unresolved"]}]',
      },
      {
        key: "conflictResolutionMethod",
        label: "Evidence and authority conflict resolution method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how contradictory evidence, competing authorities, and incompatible rules are preserved, ranked, reviewed, and resolved.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "missingEvidenceTreatment",
        label: "Missing-evidence treatment",
        type: "select",
        required: true,
        options: [
          { value: "hold", label: "HOLD until supplied" },
          { value: "deny", label: "DENY when mandatory evidence cannot exist" },
          { value: "escalate", label: "ESCALATE for authorized judgment" },
          { value: "bounded-partial", label: "Issue bounded partial determination" },
        ],
      },
    ],
  },
  {
    sectionId: "review-override-intervention",
    title: "Review, Override, and Intervention",
    description:
      "Define when human judgment is mandatory, who may review or override the determination, how intervention works, and how unsafe or invalid decisions are stopped.",
    order: 60,
    fields: [
      {
        key: "humanReviewRequired",
        label: "Human review required",
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      {
        key: "humanJudgmentConditions",
        label: "Human judgment conditions",
        type: "json",
        required: true,
        placeholder:
          '["material evidence conflict","authority conflict","exception request","high-impact consequence","unresolved uncertainty"]',
      },
      {
        key: "reviewerQualifications",
        label: "Reviewer qualifications",
        type: "json",
        required: true,
        appliesWhen: [
          {
            ruleId: "DECISION-REVIEW-01",
            description: "Required when human review is enabled.",
            field: "humanReviewRequired",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '[{"role":"independent reviewer","qualification":"finance authority","independent":true}]',
      },
      {
        key: "reviewScope",
        label: "Review scope",
        type: "multiselect",
        required: true,
        appliesWhen: [
          {
            ruleId: "DECISION-REVIEW-02",
            description: "Required when human review is enabled.",
            field: "humanReviewRequired",
            operator: "equals",
            expected: true,
          },
        ],
        options: [
          { value: "identity", label: "Decision identity" },
          { value: "scope", label: "Scope boundary" },
          { value: "actors", label: "Actors and authority" },
          { value: "criteria", label: "Criteria and rules" },
          { value: "evidence", label: "Evidence and provenance" },
          { value: "uncertainty", label: "Uncertainty" },
          { value: "alternatives", label: "Alternatives" },
          { value: "determination", label: "Determination" },
          { value: "commit", label: "Commit authorization" },
          { value: "outcome", label: "Outcome correspondence" },
        ],
      },
      {
        key: "overrideRequirements",
        label: "Override requirements",
        type: "json",
        required: true,
        placeholder:
          '[{"requirement":"named authority"},{"requirement":"written basis"},{"requirement":"preserved original determination"},{"requirement":"independent post-override review"}]',
      },
      {
        key: "holdConditions",
        label: "HOLD conditions",
        type: "json",
        required: true,
        placeholder:
          '["missing mandatory evidence","expired authority","unresolved identity","criteria ambiguity","review incomplete"]',
      },
      {
        key: "denyConditions",
        label: "DENY conditions",
        type: "json",
        required: true,
        placeholder:
          '["prohibited decision","fraudulent evidence","unauthorized approver","explicit rule violation","self-dealing conflict"]',
      },
      {
        key: "escalationConditions",
        label: "ESCALATE conditions",
        type: "json",
        required: true,
        placeholder:
          '["conflicting authorities","material evidence conflict","exception request","required expert judgment","novel consequence"]',
      },
      {
        key: "interventionProcedure",
        label: "Intervention and correction procedure",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how an in-flight decision is paused, invalidated, corrected, reviewed, reauthorized, and replayed before execution.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "determination-records-replay",
    title: "Determination, Records, Outcome, and Replay",
    description:
      "Define how the bounded determination is issued, committed, preserved, linked to execution, compared with outcomes, superseded, and replayed.",
    order: 70,
    fields: [
      {
        key: "determinationFormat",
        label: "Bounded determination format",
        type: "json",
        required: true,
        placeholder:
          '{"requiredFields":["decisionIdentifier","determination","basis","evidenceReferences","authority","scope","validityWindow","nonClaims","evaluatorVersion"]}',
      },
      {
        key: "recordPlan",
        label: "Decision record preservation plan",
        type: "json",
        required: true,
        placeholder:
          '["DECISION_IDENTITY","DECISION_AUTHORITY","DECISION_CRITERIA","EVIDENCE_CATALOG","HUMAN_JUDGMENT_RECORD","DECISION_RECEIPT","TA14_BOUNDED_DETERMINATION"]',
      },
      {
        key: "commitRequired",
        label: "Independent commit required before execution",
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      {
        key: "validityWindow",
        label: "Determination validity window",
        type: "text",
        required: true,
        placeholder:
          "Until execution, material change, authority expiry, or 30 minutes, whichever occurs first",
        validation: { minLength: 3, maxLength: 800 },
      },
      {
        key: "supersessionPolicy",
        label: "Decision supersession policy",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how later evidence or authority creates a new decision without overwriting the preserved original.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "executionAvailable",
        label: "Execution record available",
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      {
        key: "executionReceipt",
        label: "Execution receipt",
        type: "json",
        required: false,
        appliesWhen: [
          {
            ruleId: "DECISION-EXECUTION-01",
            description: "Required when execution has occurred.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"exec-184","decisionId":"decision:vendor-payment:2026-000184","status":"completed"}',
      },
      {
        key: "outcomeAvailable",
        label: "Outcome evidence available",
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      {
        key: "measuredOutcome",
        label: "Measured outcome",
        type: "textarea",
        required: false,
        appliesWhen: [
          {
            ruleId: "DECISION-OUTCOME-01",
            description: "Required when outcome evidence is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe the observed result, affected parties, measurement method, and whether the result corresponds to the approved decision.",
        validation: { maxLength: 5000 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["new evidence","changed evidence","criteria change","rule change","authority change","actor change","scope change","override","incident","execution mismatch","outcome mismatch"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how evidence, authority, criteria, rules, actors, scope, execution state, and outcome are continuously matched to the preserved decision.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const DECISION_GOVERNANCE_SCENARIOS = [
  {
    scenarioId: "DECISION-BASELINE-ALLOW",
    laneId: "decision-governance",
    title: "Approved decision baseline",
    description:
      "The decision identity, scope, actors, authority, criteria, evidence, review, commit controls, records, and replay conditions are complete and current.",
    scenarioClass: "BASELINE",
    required: true,
    preconditions: [],
    injections: [],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "PASS",
      G02_GOVERNANCE_CLAIM: "PASS",
      G03_SCOPE_BOUNDARY: "PASS",
      G04_ACTOR_IDENTITY: "PASS",
      G05_EVIDENCE_SUFFICIENCY: "PASS",
      G06_AUTHORITY_VALIDITY: "PASS",
      G07_RULE_CONTROL_BINDING: "PASS",
      G08_DEPENDENCY_INTEGRITY: "PASS",
      G09_HUMAN_OVERSIGHT: "PASS",
      G10_EXECUTION_CONSTRAINT: "PASS",
      G11_INTERVENTION_ESCALATION: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
      G14_REPLAY_CONTINUING_VALIDITY: "PASS",
    },
    expectedDetermination: "ALLOW",
    recoveryRequirements: [],
  },
  {
    scenarioId: "DECISION-MISSING-MANDATORY-EVIDENCE",
    laneId: "decision-governance",
    title: "Mandatory evidence is missing",
    description:
      "A required evidence item is absent at the time the determination is evaluated.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-MISSING-MANDATORY-EVIDENCE-I01",
        title: "Remove required evidence",
        description:
          "Remove one mandatory evidence item from the decision package.",
        mutationType: "REMOVE_EVIDENCE",
        target: "requiredEvidence",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Supply the missing evidence from an authorized source.",
      "Preserve the original incomplete decision package.",
      "Replay the decision before any commit or execution.",
    ],
  },
  {
    scenarioId: "DECISION-EVIDENCE-CONFLICT",
    laneId: "decision-governance",
    title: "Material evidence conflict",
    description:
      "Two current, apparently authoritative evidence items materially contradict one another.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-EVIDENCE-CONFLICT-I01",
        title: "Create contradictory evidence",
        description:
          "Introduce two materially inconsistent evidence records relevant to the same criterion.",
        mutationType: "CREATE_EVIDENCE_CONFLICT",
        target: "requiredEvidence",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "ESCALATED",
      G08_DEPENDENCY_INTEGRITY: "ESCALATED",
      G09_HUMAN_OVERSIGHT: "PASS",
      G11_INTERVENTION_ESCALATION: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Preserve both evidence records and their provenance.",
      "Assign an authorized independent reviewer.",
      "Resolve or explicitly bound the conflict before determination.",
    ],
  },
  {
    scenarioId: "DECISION-AUTHORITY-CONFLICT",
    laneId: "decision-governance",
    title: "Conflicting decision authorities",
    description:
      "Two actors or authorities claim incompatible control over the same decision.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-AUTHORITY-CONFLICT-I01",
        title: "Create authority conflict",
        description:
          "Introduce incompatible current authority records for the same decision.",
        mutationType: "CREATE_AUTHORITY_CONFLICT",
        target: "decisionAuthority",
      },
    ],
    expectedGateStatuses: {
      G04_ACTOR_IDENTITY: "PASS",
      G06_AUTHORITY_VALIDITY: "ESCALATED",
      G11_INTERVENTION_ESCALATION: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Preserve both authority claims.",
      "Apply declared authority precedence.",
      "Obtain a binding resolution from the recognized superior authority.",
    ],
  },
  {
    scenarioId: "DECISION-CRITERIA-CHANGED-AFTER-REVIEW",
    laneId: "decision-governance",
    title: "Decision criteria change after review",
    description:
      "A material criterion, threshold, or rule changes after evaluation but before commit or execution.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-CRITERIA-CHANGED-AFTER-REVIEW-I01",
        title: "Alter decision criteria",
        description:
          "Change a material criterion or threshold after the decision has been reviewed.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "decisionCriteria",
        value: "material-criteria-change",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Preserve the prior criteria and determination.",
      "Apply the approved version-change process.",
      "Replay the entire decision under the new criteria.",
    ],
  },
  {
    scenarioId: "DECISION-UNAUTHORIZED-OVERRIDE",
    laneId: "decision-governance",
    title: "Unauthorized override attempt",
    description:
      "An actor without valid override authority attempts to replace or bypass the bounded determination.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-UNAUTHORIZED-OVERRIDE-I01",
        title: "Inject unauthorized override",
        description:
          "Attempt to replace the decision using an actor outside the declared override authority.",
        mutationType: "REVOKE_AUTHORITY",
        target: "overrideAuthority",
      },
    ],
    expectedGateStatuses: {
      G04_ACTOR_IDENTITY: "PASS",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Reject the override.",
      "Preserve the attempted override and actor identity.",
      "Initiate incident review where policy requires.",
    ],
  },
  {
    scenarioId: "DECISION-HUMAN-JUDGMENT-REQUIRED",
    laneId: "decision-governance",
    title: "Human judgment is required",
    description:
      "The decision reaches a declared condition that cannot be resolved by automated criteria alone.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-HUMAN-JUDGMENT-REQUIRED-I01",
        title: "Trigger judgment condition",
        description:
          "Introduce a condition listed as requiring qualified human judgment.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "humanJudgmentConditions",
        value: "material-novel-consequence",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "PASS",
      G09_HUMAN_OVERSIGHT: "ESCALATED",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Assign a qualified independent reviewer.",
      "Preserve the human judgment basis.",
      "Issue a new bounded determination after review.",
    ],
  },
  {
    scenarioId: "DECISION-CONFLICT-OF-INTEREST",
    laneId: "decision-governance",
    title: "Reviewer conflict of interest",
    description:
      "The assigned evaluator or approver has a disqualifying relationship or interest affecting the decision.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-CONFLICT-OF-INTEREST-I01",
        title: "Create reviewer conflict",
        description:
          "Assign a reviewer with a material conflict of interest.",
        mutationType: "ALTER_ACTOR",
        target: "actors",
        value: "conflicted-reviewer",
      },
    ],
    expectedGateStatuses: {
      G04_ACTOR_IDENTITY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G09_HUMAN_OVERSIGHT: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Remove the conflicted actor.",
      "Assign a qualified independent reviewer.",
      "Repeat affected review steps and preserve both versions.",
    ],
  },
  {
    scenarioId: "DECISION-SELF-APPROVAL",
    laneId: "decision-governance",
    title: "Requester attempts self-approval",
    description:
      "The same actor requests, evaluates, and approves the decision in violation of separation-of-duties requirements.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-SELF-APPROVAL-I01",
        title: "Collapse separation of duties",
        description:
          "Assign request, evaluation, and approval to the same actor.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "responsibilityMap",
        value: "single-actor-self-approval",
      },
    ],
    expectedGateStatuses: {
      G04_ACTOR_IDENTITY: "PASS",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G09_HUMAN_OVERSIGHT: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Restore required separation of duties.",
      "Invalidate the self-approved decision.",
      "Repeat the decision under independent authority.",
    ],
  },
  {
    scenarioId: "DECISION-EXECUTION-DIFFERS",
    laneId: "decision-governance",
    title: "Execution differs from the approved decision",
    description:
      "The execution receipt shows a materially different subject, amount, destination, action, or sequence than the preserved decision.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-EXECUTION-DIFFERS-I01",
        title: "Create execution mismatch",
        description:
          "Change a material execution parameter after decision approval.",
        mutationType: "CREATE_EXECUTION_MISMATCH",
        target: "executionReceipt",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Stop or reverse the mismatched execution where possible.",
      "Preserve the approved decision and actual execution separately.",
      "Open a correction and incident route.",
    ],
  },
  {
    scenarioId: "DECISION-OUTCOME-NOT-SUPPORTED",
    laneId: "decision-governance",
    title: "Outcome does not support the decision claim",
    description:
      "The decision and execution occur as approved, but the measured outcome does not support the claimed result or benefit.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-OUTCOME-NOT-SUPPORTED-I01",
        title: "Create outcome mismatch",
        description:
          "Provide outcome evidence inconsistent with the expected result of the approved decision.",
        mutationType: "CREATE_OUTCOME_MISMATCH",
        target: "measuredOutcome",
      },
    ],
    expectedGateStatuses: {
      G10_EXECUTION_CONSTRAINT: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Separate decision validity from outcome effectiveness.",
      "Correct unsupported outcome claims.",
      "Determine whether intervention, redesign, or supersession is required.",
    ],
  },
  {
    scenarioId: "DECISION-SUPERSEDED-BY-NEW-EVIDENCE",
    laneId: "decision-governance",
    title: "Decision superseded by new material evidence",
    description:
      "New authoritative evidence materially changes the basis of a previously preserved decision.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-SUPERSEDED-BY-NEW-EVIDENCE-I01",
        title: "Add superseding evidence",
        description:
          "Introduce new authoritative evidence that changes a material decision criterion.",
        mutationType: "ADD_EVIDENCE",
        target: "requiredEvidence",
        value: "new-material-authoritative-evidence",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "PASS",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Preserve the original decision unchanged.",
      "Create a supersession record linked to the original.",
      "Replay and issue a new determination using the new evidence.",
    ],
  },
  {
    scenarioId: "DECISION-RECOVERY-REPLAY",
    laneId: "decision-governance",
    title: "Corrected decision recovery and replay",
    description:
      "A prior HOLD, DENY, or ESCALATE condition is corrected, preserved, replayed, and issued as a new bounded determination.",
    scenarioClass: "RECOVERY",
    required: true,
    preconditions: [],
    injections: [],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "PASS",
      G02_GOVERNANCE_CLAIM: "PASS",
      G03_SCOPE_BOUNDARY: "PASS",
      G04_ACTOR_IDENTITY: "PASS",
      G05_EVIDENCE_SUFFICIENCY: "PASS",
      G06_AUTHORITY_VALIDITY: "PASS",
      G07_RULE_CONTROL_BINDING: "PASS",
      G08_DEPENDENCY_INTEGRITY: "PASS",
      G09_HUMAN_OVERSIGHT: "PASS",
      G10_EXECUTION_CONSTRAINT: "PASS",
      G11_INTERVENTION_ESCALATION: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
      G14_REPLAY_CONTINUING_VALIDITY: "PASS",
    },
    expectedDetermination: "ALLOW",
    recoveryRequirements: [
      "Preserve the original determination and failure state.",
      "Link the corrected decision to the prior version.",
      "Issue a new determination rather than editing the original.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type DecisionGovernanceScenario =
  (typeof DECISION_GOVERNANCE_SCENARIOS)[number];

export const DECISION_GOVERNANCE_LANE = {
  laneId: "decision-governance",
  name: "Decision Governance Playground",
  shortName: "Decision Governance",
  description:
    "Test whether a consequential decision is identified, bounded, evidence-supported, rule-constrained, authorized, independently reviewable, commit-controlled, preserved, outcome-aware, and continuously replayable.",
  claimsGoverned: [
    "The exact decision, subject, scope, actors, authority, criteria, evidence, rules, and validity period are identified.",
    "The decision question and permitted determinations are explicit and bounded.",
    "Mandatory evidence is current, attributable, authoritative, and provenance-preserved.",
    "Decision criteria, thresholds, exceptions, and rule precedence are declared before evaluation.",
    "Conflicts, uncertainty, missing evidence, and alternatives are preserved rather than hidden.",
    "Human judgment is required where declared conditions cannot be resolved through bounded criteria alone.",
    "Overrides require valid authority, written basis, preservation of the original determination, and independent review where specified.",
    "A decision does not become executable until required commit controls pass.",
    "Decision, commit, execution, and outcome records remain distinguishable and linked.",
    "Material evidence, authority, criteria, rule, actor, scope, execution, or outcome changes invalidate continuing reliance until replay.",
  ],
  nonClaims: [
    "This lane does not independently prove legal compliance, factual truth beyond the admitted evidence, cybersecurity, privacy, fairness, or model quality.",
    "This lane does not prove that a decision produced the claimed downstream outcome.",
    "This lane does not authorize execution outside the exact subject, scope, authority, criteria, evidence, and validity window preserved.",
    "This lane does not convert an advisory recommendation into binding authority.",
    "An ALLOW determination applies only to the exact identified decision and preserved evaluation context.",
  ],
  sections: DECISION_GOVERNANCE_SECTIONS,
  gateIds: DECISION_GOVERNANCE_GATE_IDS,
  evidenceTypes: [...DECISION_GOVERNANCE_EVIDENCE_TYPES],
  scenarioIds: DECISION_GOVERNANCE_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when the decision is prohibited, fraudulent evidence is used, authority is absent, separation rules are intentionally violated, an unauthorized override is attempted, or execution materially departs from the approved decision.",
    "ESCALATE when material evidence, authority, rule, or consequence conflicts require qualified independent judgment.",
    "HOLD when mandatory identity, evidence, authority, criteria, review, commit, record, execution, outcome, or replay requirements are incomplete, stale, or failed.",
    "ALLOW only when all applicable mandatory gates pass and all required scenarios demonstrate the declared bounded behavior.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getDecisionGovernanceScenario(
  scenarioId: string,
): DecisionGovernanceScenario | undefined {
  return DECISION_GOVERNANCE_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
