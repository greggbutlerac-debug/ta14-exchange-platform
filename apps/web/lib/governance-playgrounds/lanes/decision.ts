import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Decision Governance Playground
 *
 * Governs whether a proposed decision is identifiable, evidence-supported,
 * authority-backed, bounded, independently reviewable, execution-ready, and
 * continuously valid.
 *
 * Governing sequence:
 * Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit ->
 * Execution -> Outcome
 */

export const DECISION_GATE_IDS = [
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

export const DECISION_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "DECISION_ROUTE_RECORD",
  "DECISION_SUBJECT_RECORD",
  "ACTOR_IDENTITY_RECORD",
  "DECISION_OWNER_RECORD",
  "EVIDENCE_RECORD",
  "SOURCE_RECORD",
  "AUTHORITY_RECORD",
  "POLICY_RECORD",
  "RULE_RECORD",
  "CONTROL_RECORD",
  "DEPENDENCY_RECORD",
  "CONFLICT_RECORD",
  "HUMAN_REVIEW_RECORD",
  "EXCEPTION_RECORD",
  "ESCALATION_RECORD",
  "DECISION_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "INCIDENT_RECORD",
  "REMEDIATION_RECORD",
  "REPLAY_RESULT",
] as const;

export type DecisionEvidenceType =
  (typeof DECISION_EVIDENCE_TYPES)[number];

export const DECISION_SECTIONS = [
  {
    sectionId: "decision-identity",
    title: "Decision Identity",
    description:
      "Identify the exact decision, subject, owner, actor, environment, route, version, and decision purpose.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Decision route title",
        type: "text",
        required: true,
        placeholder: "Production decision route",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Decision route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the proposed decision, affected subject, consequences, and why governance is required.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "decisionRouteIdentifier",
        label: "Stable decision route identifier",
        type: "text",
        required: true,
        placeholder: "decision:route:2026-001",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "decisionIdentifier",
        label: "Decision identifier",
        type: "text",
        required: true,
        placeholder: "DEC-2026-001",
        validation: { minLength: 3, maxLength: 240 },
      },
      {
        key: "decisionSubject",
        label: "Decision subject",
        type: "json",
        required: true,
        placeholder:
          '{"subjectId":"SUBJECT-001","type":"transaction","name":"Approved subject"}',
      },
      {
        key: "decisionOwner",
        label: "Decision owner",
        type: "json",
        required: true,
        placeholder:
          '{"ownerId":"OWNER-001","role":"decision owner","organization":"approved organization"}',
      },
      {
        key: "decisionActor",
        label: "Decision actor",
        type: "json",
        required: true,
        placeholder:
          '{"actorId":"ACT-001","type":"human-or-system","role":"authorized decision actor"}',
      },
      {
        key: "decisionEnvironment",
        label: "Decision environment",
        type: "select",
        required: true,
        options: [
          { value: "research", label: "Research" },
          { value: "sandbox", label: "Sandbox" },
          { value: "staging", label: "Staging" },
          { value: "production", label: "Production" },
        ],
      },
      {
        key: "decisionDate",
        label: "Decision date",
        type: "date",
        required: true,
      },
      {
        key: "validUntil",
        label: "Decision validity end",
        type: "date",
        required: true,
      },
    ],
  },
  {
    sectionId: "decision-claim-scope",
    title: "Decision Claim, Scope, and Boundary",
    description:
      "Define the exact claim, intended result, affected population, constraints, exclusions, prohibited outcomes, and consequence level.",
    order: 20,
    fields: [
      {
        key: "decisionClaim",
        label: "Decision claim",
        type: "textarea",
        required: true,
        placeholder:
          "State exactly what is being decided and what the decision is claimed to establish.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "claimBasis",
        label: "Claim basis",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the evidence, rules, thresholds, authority, controls, and assumptions supporting the claim.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "intendedResult",
        label: "Intended result",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the exact result the decision is intended to produce.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "decisionScope",
        label: "Decision scope",
        type: "json",
        required: true,
        placeholder:
          '{"subjects":["approved subject"],"actions":["approved action"],"environment":"production"}',
      },
      {
        key: "outOfScope",
        label: "Out-of-scope conditions",
        type: "json",
        required: true,
        placeholder:
          '["unapproved subject","unapproved action","scope expansion","expired evidence"]',
      },
      {
        key: "prohibitedOutcomes",
        label: "Prohibited outcomes",
        type: "json",
        required: true,
        placeholder:
          '["unauthorized denial","wrong beneficiary","unbounded execution","silent override"]',
      },
      {
        key: "decisionConstraints",
        label: "Decision constraints",
        type: "json",
        required: true,
        placeholder:
          '{"maximumImpact":"bounded","requiredApprovals":2,"executionWindow":"approved window"}',
      },
      {
        key: "consequenceLevel",
        label: "Consequence level",
        type: "select",
        required: true,
        options: [
          { value: "low", label: "Low" },
          { value: "moderate", label: "Moderate" },
          { value: "high", label: "High" },
          { value: "critical", label: "Critical" },
        ],
      },
    ],
  },
  {
    sectionId: "decision-evidence",
    title: "Evidence and Source Integrity",
    description:
      "Establish the evidence inventory, source identity, provenance, quality, recency, conflicts, missing evidence, and admissibility requirements.",
    order: 30,
    fields: [
      {
        key: "evidenceInventory",
        label: "Decision evidence inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceId":"EV-001","type":"EVIDENCE_RECORD","supports":"decision condition","status":"current"}]',
      },
      {
        key: "sourceInventory",
        label: "Source inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"sourceId":"SRC-001","type":"authoritative system","owner":"approved custodian","status":"current"}]',
      },
      {
        key: "evidenceProvenance",
        label: "Evidence provenance",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceId":"EV-001","sourceId":"SRC-001","collectedAt":"2026-07-20T12:00:00Z","method":"verified import"}]',
      },
      {
        key: "evidenceQualityMethod",
        label: "Evidence quality method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how accuracy, completeness, attribution, timeliness, relevance, integrity, and reproducibility are assessed.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "evidenceValidity",
        label: "Evidence validity",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceId":"EV-001","validFrom":"2026-07-20","validUntil":"2026-08-20","status":"current"}]',
      },
      {
        key: "evidenceConflicts",
        label: "Known evidence conflicts",
        type: "json",
        required: true,
        placeholder:
          '[{"conflictId":"CONFLICT-001","status":"resolved","resolution":"independent verification"}]',
      },
      {
        key: "missingEvidence",
        label: "Known missing evidence",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceType":"none","materiality":"none","status":"not applicable"}]',
      },
      {
        key: "missingEvidenceBehavior",
        label: "Behavior when mandatory evidence is missing",
        type: "select",
        required: true,
        options: [
          { value: "hold", label: "HOLD" },
          { value: "deny", label: "DENY" },
          { value: "escalate", label: "ESCALATE" },
          { value: "fail-closed", label: "Fail closed" },
        ],
      },
    ],
  },
  {
    sectionId: "decision-authority-rules-controls",
    title: "Authority, Rules, Controls, and Dependencies",
    description:
      "Bind the decision to valid authority, applicable policy, rules, thresholds, controls, dependencies, exception limits, and failure behavior.",
    order: 40,
    fields: [
      {
        key: "authorityInventory",
        label: "Authority inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"authorityId":"AUTH-001","role":"decision approver","scope":"DEC-2026-001","status":"active"}]',
      },
      {
        key: "policyInventory",
        label: "Applicable policies",
        type: "json",
        required: true,
        placeholder:
          '[{"policyId":"POL-001","version":"1.0","scope":"decision route","status":"active"}]',
      },
      {
        key: "governingRules",
        label: "Governing rules",
        type: "json",
        required: true,
        placeholder:
          '[{"ruleId":"RULE-001","condition":"all mandatory evidence is current","result":"eligible for approval"}]',
      },
      {
        key: "decisionThresholds",
        label: "Decision thresholds",
        type: "json",
        required: true,
        placeholder:
          '{"allow":"all mandatory conditions satisfied","hold":"evidence incomplete","deny":"authority invalid","escalate":"material conflict"}',
      },
      {
        key: "controlInventory",
        label: "Decision controls",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-001","objective":"prevent unauthorized decision","type":"preventive","status":"active"}]',
      },
      {
        key: "controlTesting",
        label: "Control testing",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-001","testDate":"2026-07-20","result":"effective","evidenceId":"EV-CTRL-001"}]',
      },
      {
        key: "dependencies",
        label: "Critical dependencies",
        type: "json",
        required: true,
        placeholder:
          '[{"dependencyId":"DEP-001","type":"identity service","critical":true,"status":"available"}]',
      },
      {
        key: "exceptionPolicy",
        label: "Exception policy",
        type: "textarea",
        required: true,
        placeholder:
          "Describe whether exceptions are allowed, who may approve them, their maximum scope and duration, required controls, and replay conditions.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "failureBehavior",
        label: "Mandatory control or dependency failure behavior",
        type: "select",
        required: true,
        options: [
          { value: "hold", label: "HOLD" },
          { value: "deny", label: "DENY" },
          { value: "escalate", label: "ESCALATE" },
          { value: "fail-closed", label: "Fail closed" },
        ],
      },
    ],
  },
  {
    sectionId: "decision-review-commit",
    title: "Review, Determination, and Commit",
    description:
      "Define reviewer competence, independence, conflicts, determination rationale, approval conditions, commit authority, and execution constraints.",
    order: 50,
    fields: [
      {
        key: "reviewerIdentity",
        label: "Reviewer identity",
        type: "json",
        required: true,
        placeholder:
          '[{"reviewerId":"REV-001","role":"independent reviewer","organization":"approved review function"}]',
      },
      {
        key: "reviewerCompetence",
        label: "Reviewer competence",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"independent reviewer","requirements":["domain expertise","governance authority","conflict management"]}]',
      },
      {
        key: "independenceControls",
        label: "Independence controls",
        type: "json",
        required: true,
        placeholder:
          '["separation from requestor","conflict disclosure","independent challenge","protected escalation"]',
      },
      {
        key: "determinationRationale",
        label: "Determination rationale",
        type: "textarea",
        required: true,
        placeholder:
          "Explain why the evidence, authority, rules, controls, dependencies, and scope support ALLOW, HOLD, DENY, or ESCALATE.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "approvalConditions",
        label: "Approval conditions",
        type: "json",
        required: true,
        placeholder:
          '["exact subject","exact action","exact evidence package","valid authority","controls active","no material change"]',
      },
      {
        key: "commitAuthority",
        label: "Commit authority",
        type: "json",
        required: true,
        placeholder:
          '[{"authorityId":"AUTH-COMMIT-001","role":"decision committer","scope":"approved decision only","status":"active"}]',
      },
      {
        key: "executionConstraints",
        label: "Execution constraints",
        type: "json",
        required: true,
        placeholder:
          '{"maximumAttempts":1,"validityWindow":"approved window","target":"approved target","scopeExpansion":false}',
      },
      {
        key: "humanOversightModel",
        label: "Human oversight model",
        type: "textarea",
        required: true,
        placeholder:
          "Describe when human review, intervention, stop authority, escalation, and post-decision review are required.",
        validation: { minLength: 20, maxLength: 6000 },
      },
    ],
  },
  {
    sectionId: "decision-change-monitoring",
    title: "Change, Monitoring, Incidents, and Remediation",
    description:
      "Define material changes, monitoring signals, drift, incidents, suspension, escalation, remediation, reapproval, and restoration.",
    order: 60,
    fields: [
      {
        key: "materialChangeTriggers",
        label: "Material change triggers",
        type: "json",
        required: true,
        placeholder:
          '["subject change","evidence change","authority change","policy change","rule change","model change","data change","tool change","scope change"]',
      },
      {
        key: "monitoringPlan",
        label: "Decision monitoring plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe monitoring of evidence, authority, subject, actor, policy, rules, controls, dependencies, execution, outcomes, and drift.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "monitoringSignals",
        label: "Monitoring signals",
        type: "json",
        required: true,
        placeholder:
          '["evidence expiry","authority revocation","policy change","control failure","dependency failure","execution mismatch","outcome mismatch"]',
      },
      {
        key: "incidentTriggers",
        label: "Incident triggers",
        type: "json",
        required: true,
        placeholder:
          '["unauthorized decision","wrong subject","wrong action","blocked review","record discontinuity","unexpected adverse outcome"]',
      },
      {
        key: "suspensionTriggers",
        label: "Suspension triggers",
        type: "json",
        required: true,
        placeholder:
          '["invalid authority","critical evidence loss","material conflict","scope drift","failed control","critical incident"]',
      },
      {
        key: "escalationPath",
        label: "Escalation path",
        type: "json",
        required: true,
        placeholder:
          '[{"level":1,"role":"decision owner"},{"level":2,"role":"governance authority"},{"level":3,"role":"executive or legal authority"}]',
      },
      {
        key: "remediationProcess",
        label: "Remediation process",
        type: "textarea",
        required: true,
        placeholder:
          "Describe containment, evidence preservation, impact assessment, correction, verification, reapproval, replay, and restoration.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "restorationConditions",
        label: "Restoration conditions",
        type: "json",
        required: true,
        placeholder:
          '["root cause corrected","evidence complete","authority valid","controls retested","independent verification complete","replay passes"]',
      },
    ],
  },
  {
    sectionId: "decision-records-outcomes",
    title: "Decision Records, Execution, Outcomes, and Replay",
    description:
      "Preserve what was proposed, evidenced, reviewed, determined, committed, executed, observed, remediated, and replayed.",
    order: 70,
    fields: [
      {
        key: "requiredRecords",
        label: "Required preserved records",
        type: "json",
        required: true,
        placeholder:
          '["DECISION_ROUTE_RECORD","DECISION_SUBJECT_RECORD","EVIDENCE_RECORD","AUTHORITY_RECORD","RULE_RECORD","CONTROL_RECORD","HUMAN_REVIEW_RECORD","DECISION_RECORD","COMMIT_AUTHORIZATION","EXECUTION_RECEIPT","OUTCOME_EVIDENCE","REPLAY_RESULT"]',
      },
      {
        key: "recordIntegrityMethod",
        label: "Record integrity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe timestamps, signatures, hashes, append-only preservation, corrections, retention, access, and chain of custody.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "decisionRecord",
        label: "Decision record",
        type: "json",
        required: true,
        placeholder:
          '{"decisionId":"DEC-2026-001","determination":"ALLOW","scope":"bounded","approvalId":"APR-001"}',
      },
      {
        key: "executionAvailable",
        label: "Execution occurred",
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
            description: "Required when the approved decision has executed.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"EXEC-001","decisionId":"DEC-2026-001","status":"completed","target":"approved target"}',
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
          "Describe whether the actual outcome corresponded to the approved decision, scope, constraints, controls, and intended result.",
        validation: { maxLength: 6000 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["evidence expiry","authority change","policy change","model change","data change","tool change","execution mismatch","outcome mismatch","incident"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how identity, evidence, authority, rules, controls, dependencies, decision, execution, outcomes, drift, incidents, and remediation are revalidated.",
        validation: { minLength: 20, maxLength: 7000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const DECISION_SCENARIOS = [
  {
    scenarioId: "DECISION-BASELINE-ALLOW",
    laneId: "decision",
    title: "Complete admissible decision baseline",
    description:
      "The exact decision, subject, actor, evidence, authority, rules, controls, dependencies, review, commit, and replay requirements are complete and current.",
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
    scenarioId: "DECISION-IDENTITY-MISSING",
    laneId: "decision",
    title: "Decision identity missing",
    description:
      "The exact decision, subject, owner, actor, route, environment, or version cannot be uniquely identified.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-IDENTITY-MISSING-I01",
        title: "Remove decision route identity",
        description:
          "Remove evidence binding the proposed determination to one exact decision route.",
        mutationType: "REMOVE_EVIDENCE",
        target: "DECISION_ROUTE_RECORD",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Reconstruct the exact decision identity.",
      "Bind the subject, owner, actor, and environment.",
      "Replay before approval.",
    ],
  },
  {
    scenarioId: "DECISION-ACTOR-IDENTITY-MISSING",
    laneId: "decision",
    title: "Decision actor identity missing",
    description:
      "The human, service, model, agent, or system making the decision cannot be uniquely identified.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-ACTOR-IDENTITY-MISSING-I01",
        title: "Remove actor identity",
        description:
          "Remove the evidence identifying the decision actor.",
        mutationType: "REMOVE_EVIDENCE",
        target: "ACTOR_IDENTITY_RECORD",
      },
    ],
    expectedGateStatuses: {
      G04_ACTOR_IDENTITY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Verify the actor identity.",
      "Rebind valid authority.",
      "Issue a new decision determination.",
    ],
  },
  {
    scenarioId: "DECISION-CLAIM-UNSUPPORTED",
    laneId: "decision",
    title: "Decision claim exceeds evidence",
    description:
      "The decision claim is broader than the available evidence, tested conditions, affected subjects, or approved consequence boundary.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-CLAIM-UNSUPPORTED-I01",
        title: "Remove claim support",
        description:
          "Remove evidence supporting a material decision claim.",
        mutationType: "REMOVE_EVIDENCE",
        target: "GOVERNANCE_CLAIM_SUPPORT",
      },
    ],
    expectedGateStatuses: {
      G02_GOVERNANCE_CLAIM: "FAIL",
      G03_SCOPE_BOUNDARY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Narrow the decision claim or obtain additional evidence.",
      "Preserve explicit non-claims and limitations.",
      "Replay before approval.",
    ],
  },
  {
    scenarioId: "DECISION-EVIDENCE-MISSING",
    laneId: "decision",
    title: "Mandatory decision evidence missing",
    description:
      "A required evidence record supporting a material decision condition is unavailable.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-EVIDENCE-MISSING-I01",
        title: "Remove mandatory evidence",
        description:
          "Remove a mandatory decision evidence record.",
        mutationType: "REMOVE_EVIDENCE",
        target: "EVIDENCE_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Obtain the missing evidence.",
      "Verify source, integrity, and validity.",
      "Repeat the determination.",
    ],
  },
  {
    scenarioId: "DECISION-EVIDENCE-EXPIRED",
    laneId: "decision",
    title: "Decision evidence expired",
    description:
      "A mandatory evidence record is outside its approved validity window.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-EVIDENCE-EXPIRED-I01",
        title: "Expire decision evidence",
        description:
          "Expire a mandatory evidence record supporting the determination.",
        mutationType: "EXPIRE_EVIDENCE",
        target: "EVIDENCE_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Refresh the expired evidence.",
      "Confirm no material change occurred.",
      "Reissue the decision and replay.",
    ],
  },
  {
    scenarioId: "DECISION-EVIDENCE-CONFLICT",
    laneId: "decision",
    title: "Material decision evidence conflict",
    description:
      "Authoritative records materially disagree about the subject, condition, amount, eligibility, risk, authority, or expected result.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-EVIDENCE-CONFLICT-I01",
        title: "Create decision evidence conflict",
        description:
          "Introduce contradictory evidence for a material decision condition.",
        mutationType: "CREATE_EVIDENCE_CONFLICT",
        target: "evidenceInventory",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Preserve every conflicting record.",
      "Resolve the conflict through independent authority.",
      "Do not commit until the conflict is resolved.",
    ],
  },
  {
    scenarioId: "DECISION-AUTHORITY-REVOKED",
    laneId: "decision",
    title: "Decision authority revoked",
    description:
      "The authority supporting review, approval, commitment, or execution is no longer valid.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-AUTHORITY-REVOKED-I01",
        title: "Revoke decision authority",
        description:
          "Invalidate a mandatory authority record.",
        mutationType: "REVOKE_AUTHORITY",
        target: "AUTHORITY_RECORD",
      },
    ],
    expectedGateStatuses: {
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Suspend reliance on the prior decision.",
      "Obtain valid replacement authority.",
      "Issue a new decision and commit.",
    ],
  },
  {
    scenarioId: "DECISION-SCOPE-DRIFT",
    laneId: "decision",
    title: "Decision scope changed after approval",
    description:
      "The subject, population, action, environment, amount, consequence, destination, or duration expands beyond the approved decision boundary.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-SCOPE-DRIFT-I01",
        title: "Alter decision scope",
        description:
          "Expand the decision beyond its preserved boundary.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "decisionScope",
        value: "expanded-unapproved-scope",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Reject the altered decision.",
      "Create a new bounded route for the expanded scope.",
      "Reevaluate and recommit.",
    ],
  },
  {
    scenarioId: "DECISION-CONTROL-FAILURE",
    laneId: "decision",
    title: "Mandatory decision control failed",
    description:
      "A preventive, detective, approval, segregation, or release control is ineffective or unavailable.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-CONTROL-FAILURE-I01",
        title: "Remove control effectiveness evidence",
        description:
          "Remove evidence showing a mandatory decision control is effective.",
        mutationType: "REMOVE_EVIDENCE",
        target: "CONTROL_RECORD",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Restore or replace the control.",
      "Test operating effectiveness.",
      "Repeat review and approval.",
    ],
  },
  {
    scenarioId: "DECISION-DEPENDENCY-FAILURE",
    laneId: "decision",
    title: "Critical decision dependency failed",
    description:
      "A critical identity, source, policy, data, model, tool, authorization, or infrastructure dependency is unavailable or untrusted.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-DEPENDENCY-FAILURE-I01",
        title: "Alter dependency status",
        description:
          "Set a critical decision dependency to failed.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "dependencies",
        value: "critical-dependency-failed",
      },
    ],
    expectedGateStatuses: {
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Restore or replace the dependency.",
      "Verify continuity and integrity.",
      "Replay before commitment.",
    ],
  },
  {
    scenarioId: "DECISION-MODEL-CHANGE",
    laneId: "decision",
    title: "Decision model changed",
    description:
      "A model materially supporting the decision changes after review or approval.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-MODEL-CHANGE-I01",
        title: "Change decision model",
        description:
          "Replace or modify the model supporting the decision.",
        mutationType: "CHANGE_MODEL",
        target: "decisionActor",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Identify and evaluate the changed model.",
      "Repeat affected decision tests.",
      "Obtain renewed approval and replay.",
    ],
  },
  {
    scenarioId: "DECISION-DATA-CHANGE",
    laneId: "decision",
    title: "Decision data changed",
    description:
      "Material data, source, schema, value, provenance, or quality condition changes after review or approval.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-DATA-CHANGE-I01",
        title: "Change decision data",
        description:
          "Alter a material data package supporting the decision.",
        mutationType: "CHANGE_DATA",
        target: "evidenceInventory",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Preserve and validate the changed data.",
      "Reassess decision impact.",
      "Repeat review and approval.",
    ],
  },
  {
    scenarioId: "DECISION-TOOL-CHANGE",
    laneId: "decision",
    title: "Decision tool changed",
    description:
      "A material tool, workflow, connector, scoring component, or decision service changes after approval.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-TOOL-CHANGE-I01",
        title: "Change decision tool",
        description:
          "Replace a material tool supporting the decision.",
        mutationType: "CHANGE_TOOL",
        target: "dependencies",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Identify and validate the changed tool.",
      "Retest rules and controls.",
      "Repeat the decision and replay.",
    ],
  },
  {
    scenarioId: "DECISION-HUMAN-INTERVENTION-BLOCKED",
    laneId: "decision",
    title: "Required human decision intervention blocked",
    description:
      "The authorized reviewer cannot challenge, hold, deny, reverse, suspend, or escalate the decision.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-HUMAN-INTERVENTION-BLOCKED-I01",
        title: "Block decision intervention",
        description:
          "Disable required human review or stop authority.",
        mutationType: "BLOCK_HUMAN_INTERVENTION",
        target: "humanOversightModel",
      },
    ],
    expectedGateStatuses: {
      G09_HUMAN_OVERSIGHT: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Restore review, intervention, and stop authority.",
      "Reassess all affected determinations.",
      "Replay before renewed approval.",
    ],
  },
  {
    scenarioId: "DECISION-EXECUTION-MISMATCH",
    laneId: "decision",
    title: "Executed action differs from approved decision",
    description:
      "The actual actor, subject, target, destination, amount, timing, model, data, tool, or action differs from the approved decision.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-EXECUTION-MISMATCH-I01",
        title: "Create decision execution mismatch",
        description:
          "Cause actual execution to differ from the approved decision.",
        mutationType: "CREATE_EXECUTION_MISMATCH",
        target: "executionReceipt",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Stop or contain the mismatched execution.",
      "Preserve the approved decision and actual execution evidence.",
      "Investigate, remediate, and replay.",
    ],
  },
  {
    scenarioId: "DECISION-OUTCOME-MISMATCH",
    laneId: "decision",
    title: "Outcome contradicts approved decision claim",
    description:
      "The measured outcome does not correspond to the approved decision, scope, constraints, controls, or intended result.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "DECISION-OUTCOME-MISMATCH-I01",
        title: "Create decision outcome mismatch",
        description:
          "Provide outcome evidence that contradicts the approved decision.",
        mutationType: "CREATE_OUTCOME_MISMATCH",
        target: "measuredOutcome",
      },
    ],
    expectedGateStatuses: {
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Preserve the contradictory outcome evidence.",
      "Assess impact and suspend continuing reliance where required.",
      "Remediate and replay before restored approval.",
    ],
  },
  {
    scenarioId: "DECISION-RECOVERY-REPLAY",
    laneId: "decision",
    title: "Corrected decision recovery and replay",
    description:
      "A prior decision failure is corrected, independently verified, preserved, and replayed before renewed approval or execution.",
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
      "Preserve the original failed decision and determination.",
      "Link corrected evidence, renewed authority, control testing, and independent verification.",
      "Issue a new decision and replay result without altering the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type DecisionScenario =
  (typeof DECISION_SCENARIOS)[number];

export const DECISION_LANE = {
  laneId: "decision",
  name: "Decision Governance Playground",
  shortName: "Decision",
  description:
    "Test whether a proposed decision is identifiable, bounded, evidence-supported, authority-backed, rule-bound, independently reviewable, execution-constrained, outcome-verified, and continuously valid.",
  claimsGoverned: [
    "The exact decision, subject, owner, actor, environment, route, and validity period are identified.",
    "The decision claim, intended result, scope, constraints, exclusions, prohibited outcomes, and consequence level are explicit.",
    "Evidence is attributable, current, relevant, sufficient, and free of unresolved material conflict.",
    "Decision, review, approval, commit, exception, intervention, and execution authorities are valid and bounded.",
    "Policies, rules, thresholds, controls, dependencies, and failure behavior are defined before approval.",
    "Independent review, challenge, intervention, stop authority, and escalation remain available.",
    "The decision commit is bound to the exact subject, evidence, authority, rules, controls, scope, and validity window.",
    "Material model, data, tool, evidence, policy, authority, subject, scope, or dependency changes invalidate prior reliance.",
    "Execution receipts prove what action actually occurred.",
    "Outcome evidence proves whether the approved decision produced the intended governed result.",
  ],
  nonClaims: [
    "A recommendation, score, prediction, approval, or policy reference alone does not prove an admissible decision.",
    "A valid decision does not authorize execution beyond the exact preserved scope and validity window.",
    "A high-confidence result does not replace evidence, authority, review, controls, or outcome proof.",
    "Monitoring does not cure an unauthorized, unsupported, or unbounded decision.",
    "An ALLOW determination applies only to the exact evidence, authority, subject, actor, rules, controls, dependencies, scope, environment, and validity period preserved.",
  ],
  sections: DECISION_SECTIONS,
  gateIds: DECISION_GATE_IDS,
  evidenceTypes: [...DECISION_EVIDENCE_TYPES],
  scenarioIds: DECISION_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when actor or authority is invalid, scope expands, required intervention is blocked, or execution differs from the approved decision.",
    "ESCALATE when material evidence conflicts or superior governance, legal, safety, financial, technical, or executive authority is required.",
    "HOLD when evidence, controls, dependencies, review, validity, policy, data, model, tools, continuity, outcomes, or remediation is incomplete, expired, changed, or unresolved.",
    "ALLOW only when all applicable gates pass and the exact decision is supported by admissible evidence, valid authority, bounded scope, effective controls, preserved commitment, and continuing validity.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getDecisionScenario(
  scenarioId: string,
): DecisionScenario | undefined {
  return DECISION_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
