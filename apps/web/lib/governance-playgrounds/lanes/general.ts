import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 General Governance Playground
 *
 * A cross-domain governance lane for systems, workflows, records, services,
 * decisions, and execution routes that do not belong exclusively to a more
 * specialized lane.
 *
 * Governing sequence:
 * Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit ->
 * Execution -> Outcome
 */

export const GENERAL_GATE_IDS = [
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

export const GENERAL_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "ROUTE_IDENTITY_RECORD",
  "SYSTEM_IDENTITY_RECORD",
  "ACTOR_IDENTITY_RECORD",
  "SCOPE_RECORD",
  "BOUNDARY_RECORD",
  "SOURCE_RECORD",
  "EVIDENCE_RECORD",
  "AUTHORITY_RECORD",
  "APPROVAL_RECORD",
  "RULE_RECORD",
  "CONTROL_RECORD",
  "CONTROL_TEST_RECORD",
  "DEPENDENCY_RECORD",
  "HUMAN_OVERSIGHT_RECORD",
  "EXCEPTION_RECORD",
  "ESCALATION_RECORD",
  "CHANGE_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "REMEDIATION_RECORD",
  "REPLAY_RESULT",
] as const;

export type GeneralEvidenceType =
  (typeof GENERAL_EVIDENCE_TYPES)[number];

export const GENERAL_SECTIONS = [
  {
    sectionId: "general-route-identity",
    title: "Route Identity",
    description:
      "Identify the exact governed route, system, workflow, owner, environment, purpose, and version under review.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Route title",
        type: "text",
        required: true,
        placeholder: "General governance route",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the system, workflow, decision, service, record, action, or execution route being governed.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "routeIdentifier",
        label: "Stable route identifier",
        type: "text",
        required: true,
        placeholder: "general:route:2026-001",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "systemName",
        label: "System or process name",
        type: "text",
        required: true,
        placeholder: "Governed Operations Workflow",
        validation: { minLength: 2, maxLength: 300 },
      },
      {
        key: "systemVersion",
        label: "System or process version",
        type: "text",
        required: true,
        placeholder: "1.0.0",
        validation: { minLength: 1, maxLength: 120 },
      },
      {
        key: "businessOwner",
        label: "Business owner",
        type: "text",
        required: true,
        placeholder: "Governance Route Owner",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "technicalOwner",
        label: "Technical owner",
        type: "text",
        required: true,
        placeholder: "System Owner",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "deploymentEnvironment",
        label: "Deployment environment",
        type: "select",
        required: true,
        options: [
          { value: "design", label: "Design" },
          { value: "sandbox", label: "Sandbox" },
          { value: "staging", label: "Staging" },
          { value: "production", label: "Production" },
        ],
      },
      {
        key: "effectiveDate",
        label: "Effective date",
        type: "date",
        required: true,
      },
    ],
  },
  {
    sectionId: "general-claim-scope-boundary",
    title: "Claim, Scope, and Boundary",
    description:
      "Define the exact governance claim, intended use, affected parties, included and excluded activities, and non-claims.",
    order: 20,
    fields: [
      {
        key: "governanceClaim",
        label: "Governance claim",
        type: "textarea",
        required: true,
        placeholder:
          "State exactly what the route claims to govern, control, verify, permit, deny, hold, or escalate.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "claimBasis",
        label: "Claim basis",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the evidence, authority, rules, controls, and operating conditions supporting the governance claim.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "intendedUse",
        label: "Intended use",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the exact users, decisions, operations, systems, actions, and outcomes for which this route is intended.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "inScope",
        label: "In-scope activities",
        type: "textarea",
        required: true,
        placeholder:
          "Identify included actors, systems, data, records, dependencies, jurisdictions, environments, and execution types.",
        validation: { minLength: 10, maxLength: 5000 },
      },
      {
        key: "outOfScope",
        label: "Out-of-scope activities",
        type: "textarea",
        required: true,
        placeholder:
          "Identify excluded actors, systems, data, environments, decisions, permissions, and outcomes.",
        validation: { minLength: 10, maxLength: 5000 },
      },
      {
        key: "affectedParties",
        label: "Affected parties",
        type: "json",
        required: true,
        placeholder:
          '[{"group":"operators","effect":"workflow execution"},{"group":"customers","effect":"service outcome"}]',
      },
      {
        key: "prohibitedUses",
        label: "Prohibited uses",
        type: "json",
        required: true,
        placeholder:
          '["unapproved production execution","use outside stated scope","silent exception","unrecorded override"]',
      },
      {
        key: "nonClaims",
        label: "Explicit non-claims",
        type: "json",
        required: true,
        placeholder:
          '["does not certify universal safety","does not replace legal review","does not authorize execution outside the preserved route"]',
      },
    ],
  },
  {
    sectionId: "general-evidence-authority",
    title: "Evidence and Authority",
    description:
      "Establish the sources, records, evidence quality, authority, approval, validity, attribution, and conflict status supporting the route.",
    order: 30,
    fields: [
      {
        key: "sourceInventory",
        label: "Source inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"sourceId":"SRC-001","type":"system record","authority":"system of record","current":true}]',
      },
      {
        key: "evidenceInventory",
        label: "Evidence inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceId":"EV-001","type":"EVIDENCE_RECORD","supports":"route state","status":"current"}]',
      },
      {
        key: "evidenceQualityMethod",
        label: "Evidence quality method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how completeness, accuracy, attribution, timeliness, relevance, integrity, and reproducibility are assessed.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "authorityInventory",
        label: "Authority inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"authorityId":"AUTH-001","role":"business approver","scope":"production execution","status":"active"}]',
      },
      {
        key: "approvalRecord",
        label: "Approval record",
        type: "json",
        required: true,
        placeholder:
          '{"approvalId":"APR-001","approver":"authorized owner","scope":"route version 1.0.0","status":"approved"}',
      },
      {
        key: "validityWindow",
        label: "Validity window",
        type: "json",
        required: true,
        placeholder:
          '{"validFrom":"2026-07-01T00:00:00Z","validUntil":"2026-12-31T23:59:59Z"}',
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
        key: "missingEvidenceBehavior",
        label: "Missing evidence behavior",
        type: "select",
        required: true,
        options: [
          { value: "hold", label: "HOLD" },
          { value: "deny", label: "DENY" },
          { value: "escalate", label: "ESCALATE" },
          { value: "limited-mode", label: "Approved limited mode only" },
        ],
      },
    ],
  },
  {
    sectionId: "general-rules-controls-binding",
    title: "Rules, Controls, and Binding",
    description:
      "Define the rules, thresholds, controls, exception conditions, dependency requirements, and binding logic governing execution.",
    order: 40,
    fields: [
      {
        key: "governingRules",
        label: "Governing rules",
        type: "json",
        required: true,
        placeholder:
          '[{"ruleId":"RULE-001","condition":"all required evidence current","result":"eligible for commit"}]',
      },
      {
        key: "decisionThresholds",
        label: "Decision thresholds",
        type: "json",
        required: true,
        placeholder:
          '{"allow":"all mandatory gates pass","hold":"evidence incomplete","deny":"authority invalid","escalate":"material conflict"}',
      },
      {
        key: "controlInventory",
        label: "Control inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-001","objective":"prevent out-of-scope execution","type":"preventive","status":"active"}]',
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
        label: "Dependencies",
        type: "json",
        required: true,
        placeholder:
          '[{"dependencyId":"DEP-001","type":"identity","critical":true,"status":"available"}]',
      },
      {
        key: "bindingMethod",
        label: "Binding method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how claims, evidence, authority, rules, controls, dependencies, scope, and execution conditions are bound into one governed route.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "exceptionPolicy",
        label: "Exception policy",
        type: "textarea",
        required: true,
        placeholder:
          "Describe who may request, approve, limit, expire, monitor, revoke, and preserve exceptions.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "controlFailureBehavior",
        label: "Control failure behavior",
        type: "select",
        required: true,
        options: [
          { value: "fail-closed", label: "Fail closed" },
          { value: "hold", label: "HOLD" },
          { value: "deny", label: "DENY" },
          { value: "escalate", label: "ESCALATE" },
        ],
      },
    ],
  },
  {
    sectionId: "general-commit-execution-oversight",
    title: "Commit, Execution, and Human Oversight",
    description:
      "Define who may commit, what must be true before execution, how execution is constrained, and when humans must intervene.",
    order: 50,
    fields: [
      {
        key: "commitAuthority",
        label: "Commit authority",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"authorized operator","scope":"approved route only","status":"active"}]',
      },
      {
        key: "preExecutionConditions",
        label: "Pre-execution conditions",
        type: "json",
        required: true,
        placeholder:
          '["route identity verified","evidence current","authority active","controls effective","dependencies healthy"]',
      },
      {
        key: "executionConstraints",
        label: "Execution constraints",
        type: "json",
        required: true,
        placeholder:
          '["approved environment only","approved actor only","approved scope only","no silent override"]',
      },
      {
        key: "humanOversightModel",
        label: "Human oversight model",
        type: "textarea",
        required: true,
        placeholder:
          "Describe required human review, intervention authority, stop authority, escalation, independence, and record preservation.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "interventionTriggers",
        label: "Human intervention triggers",
        type: "json",
        required: true,
        placeholder:
          '["evidence conflict","authority loss","dependency failure","control failure","scope drift","unexpected outcome"]',
      },
      {
        key: "overridePolicy",
        label: "Override policy",
        type: "textarea",
        required: true,
        placeholder:
          "Describe whether override is permitted, who may authorize it, its maximum scope and duration, and how it is preserved.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "blockedInterventionBehavior",
        label: "Behavior when required intervention is blocked",
        type: "select",
        required: true,
        options: [
          { value: "deny", label: "DENY" },
          { value: "hold", label: "HOLD" },
          { value: "fail-closed", label: "Fail closed" },
        ],
      },
    ],
  },
  {
    sectionId: "general-change-monitoring-escalation",
    title: "Change, Monitoring, and Escalation",
    description:
      "Define monitored signals, drift, change control, reassessment, incidents, escalation, suspension, remediation, and restoration.",
    order: 60,
    fields: [
      {
        key: "monitoringPlan",
        label: "Monitoring plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe route monitoring, evidence refresh, authority review, control health, dependency health, execution review, and outcome review.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "monitoringSignals",
        label: "Monitoring signals",
        type: "json",
        required: true,
        placeholder:
          '["evidence expiry","authority revocation","rule change","control failure","dependency change","execution mismatch","outcome mismatch"]',
      },
      {
        key: "changeControl",
        label: "Change-control process",
        type: "textarea",
        required: true,
        placeholder:
          "Describe proposed change, impact assessment, approval, testing, deployment, rollback, preservation, and replay.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "materialChangeTriggers",
        label: "Material change triggers",
        type: "json",
        required: true,
        placeholder:
          '["scope change","actor change","authority change","rule change","control change","dependency change","model change","data change","tool change"]',
      },
      {
        key: "escalationPath",
        label: "Escalation path",
        type: "json",
        required: true,
        placeholder:
          '[{"level":1,"role":"route owner"},{"level":2,"role":"governance authority"},{"level":3,"role":"executive or legal authority"}]',
      },
      {
        key: "suspensionTriggers",
        label: "Suspension triggers",
        type: "json",
        required: true,
        placeholder:
          '["critical evidence loss","invalid authority","uncontrolled execution","material incident","failed remediation"]',
      },
      {
        key: "remediationProcess",
        label: "Remediation process",
        type: "textarea",
        required: true,
        placeholder:
          "Describe containment, correction, verification, evidence preservation, reapproval, replay, and controlled restoration.",
        validation: { minLength: 20, maxLength: 6000 },
      },
    ],
  },
  {
    sectionId: "general-records-outcomes-replay",
    title: "Records, Outcomes, and Replay",
    description:
      "Preserve what was known, approved, committed, executed, changed, and observed so the route can be independently replayed.",
    order: 70,
    fields: [
      {
        key: "requiredRecords",
        label: "Required preserved records",
        type: "json",
        required: true,
        placeholder:
          '["ROUTE_IDENTITY_RECORD","EVIDENCE_RECORD","AUTHORITY_RECORD","RULE_RECORD","CONTROL_RECORD","COMMIT_AUTHORIZATION","EXECUTION_RECEIPT","OUTCOME_EVIDENCE","REPLAY_RESULT"]',
      },
      {
        key: "recordIntegrityMethod",
        label: "Record integrity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe attribution, timestamps, signatures, hashes, append-only preservation, correction handling, retention, and access control.",
        validation: { minLength: 20, maxLength: 6000 },
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
            ruleId: "GENERAL-EXECUTION-01",
            description: "Required when execution has occurred.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"exec-001","routeVersion":"1.0.0","actor":"authorized operator","status":"completed"}',
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
            ruleId: "GENERAL-OUTCOME-01",
            description: "Required when outcome evidence is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe whether the actual outcome corresponded to the approved claim, scope, controls, execution conditions, and expected result.",
        validation: { maxLength: 5000 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["evidence expiry","authority change","scope change","rule change","control failure","dependency change","execution mismatch","outcome mismatch"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how route identity, evidence, authority, controls, dependencies, execution, outcomes, remediation, and changes are revalidated.",
        validation: { minLength: 20, maxLength: 6000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const GENERAL_SCENARIOS = [
  {
    scenarioId: "GENERAL-BASELINE-ALLOW",
    laneId: "general",
    title: "Complete governed route baseline",
    description:
      "The route identity, claim, scope, evidence, authority, controls, dependencies, oversight, execution conditions, and replay requirements are complete and current.",
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
    scenarioId: "GENERAL-MISSING-ROUTE-IDENTITY",
    laneId: "general",
    title: "Route identity missing",
    description:
      "The governed system, workflow, version, environment, or owner cannot be uniquely identified.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-MISSING-ROUTE-IDENTITY-I01",
        title: "Remove route identity record",
        description:
          "Remove the evidence that binds the route to a stable identity.",
        mutationType: "REMOVE_EVIDENCE",
        target: "ROUTE_IDENTITY_RECORD",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Reconstruct the route identity.",
      "Bind the correct version, environment, and owners.",
      "Replay before approval.",
    ],
  },
  {
    scenarioId: "GENERAL-UNSUPPORTED-CLAIM",
    laneId: "general",
    title: "Governance claim unsupported",
    description:
      "The route makes a material governance claim without sufficient supporting evidence.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-UNSUPPORTED-CLAIM-I01",
        title: "Remove claim support",
        description:
          "Remove evidence supporting the route's primary governance claim.",
        mutationType: "REMOVE_EVIDENCE",
        target: "GOVERNANCE_CLAIM_SUPPORT",
      },
    ],
    expectedGateStatuses: {
      G02_GOVERNANCE_CLAIM: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Narrow the claim or provide admissible support.",
      "Preserve the revised claim basis.",
      "Replay the route.",
    ],
  },
  {
    scenarioId: "GENERAL-SCOPE-DRIFT",
    laneId: "general",
    title: "Scope drift after approval",
    description:
      "The route is used for actors, systems, data, environments, decisions, or actions beyond the approved boundary.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-SCOPE-DRIFT-I01",
        title: "Alter route scope",
        description:
          "Expand the route beyond its approved in-scope boundary.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "inScope",
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
      "Stop out-of-scope use.",
      "Assess and approve any proposed expansion.",
      "Replay before restored execution.",
    ],
  },
  {
    scenarioId: "GENERAL-EXPIRED-EVIDENCE",
    laneId: "general",
    title: "Required evidence expired",
    description:
      "A mandatory evidence record is no longer valid within the route's preserved validity window.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-EXPIRED-EVIDENCE-I01",
        title: "Expire evidence record",
        description:
          "Expire a mandatory evidence record supporting admissibility.",
        mutationType: "EXPIRE_EVIDENCE",
        target: "EVIDENCE_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Refresh the expired evidence.",
      "Confirm no material drift occurred.",
      "Replay before renewed approval.",
    ],
  },
  {
    scenarioId: "GENERAL-AUTHORITY-REVOKED",
    laneId: "general",
    title: "Approval authority revoked",
    description:
      "The authority supporting approval, commitment, or execution is revoked or no longer valid.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-AUTHORITY-REVOKED-I01",
        title: "Revoke approval authority",
        description:
          "Invalidate the authority supporting the route's approval.",
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
      "Suspend execution.",
      "Obtain valid replacement authority.",
      "Issue a new approval and replay result.",
    ],
  },
  {
    scenarioId: "GENERAL-EVIDENCE-CONFLICT",
    laneId: "general",
    title: "Material evidence conflict",
    description:
      "Two or more authoritative evidence records materially disagree about the governed reality.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-EVIDENCE-CONFLICT-I01",
        title: "Create evidence conflict",
        description:
          "Introduce contradictory evidence for a material route condition.",
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
      "Preserve both evidence positions.",
      "Obtain independent resolution.",
      "Narrow or suspend the route until the conflict is resolved.",
    ],
  },
  {
    scenarioId: "GENERAL-CONTROL-FAILURE",
    laneId: "general",
    title: "Mandatory control failure",
    description:
      "A required preventive, detective, corrective, or execution control is ineffective or unavailable.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-CONTROL-FAILURE-I01",
        title: "Remove control test evidence",
        description:
          "Remove evidence showing that a mandatory control is effective.",
        mutationType: "REMOVE_EVIDENCE",
        target: "CONTROL_TEST_RECORD",
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
      "Replay before execution.",
    ],
  },
  {
    scenarioId: "GENERAL-DEPENDENCY-FAILURE",
    laneId: "general",
    title: "Critical dependency failure",
    description:
      "A critical identity, data, service, infrastructure, or operational dependency is unavailable or untrusted.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-DEPENDENCY-FAILURE-I01",
        title: "Alter dependency status",
        description:
          "Set a critical dependency to unavailable or invalid.",
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
      "Verify integrity and continuity.",
      "Replay before resumed execution.",
    ],
  },
  {
    scenarioId: "GENERAL-HUMAN-INTERVENTION-BLOCKED",
    laneId: "general",
    title: "Required human intervention blocked",
    description:
      "A human reviewer, stop authority, or escalation authority cannot intervene when required.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-HUMAN-INTERVENTION-BLOCKED-I01",
        title: "Block human intervention",
        description:
          "Prevent the required human authority from reviewing or stopping the route.",
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
      "Restore human intervention authority.",
      "Review any attempted or completed execution.",
      "Replay before resumed operation.",
    ],
  },
  {
    scenarioId: "GENERAL-EXECUTION-MISMATCH",
    laneId: "general",
    title: "Execution differs from approved route",
    description:
      "The actual actor, environment, scope, version, input, dependency, action, or destination differs from the committed route.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-EXECUTION-MISMATCH-I01",
        title: "Create execution mismatch",
        description:
          "Cause actual execution to differ from the approved commit.",
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
      "Stop the mismatched execution.",
      "Preserve the actual execution evidence.",
      "Investigate, remediate, and replay.",
    ],
  },
  {
    scenarioId: "GENERAL-OUTCOME-MISMATCH",
    laneId: "general",
    title: "Outcome contradicts approved claim",
    description:
      "The measured outcome does not correspond to the approved claim, controls, execution conditions, or expected result.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-OUTCOME-MISMATCH-I01",
        title: "Create outcome mismatch",
        description:
          "Provide outcome evidence that contradicts the approved route.",
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
      "Preserve the outcome evidence.",
      "Reassess the claim, controls, and route assumptions.",
      "Remediate and replay before restored reliance.",
    ],
  },
  {
    scenarioId: "GENERAL-MODEL-DRIFT",
    laneId: "general",
    title: "Model changed after approval",
    description:
      "A model used by the route changes without renewed review and binding.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: false,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-MODEL-DRIFT-I01",
        title: "Change model",
        description:
          "Replace or modify the model used by the approved route.",
        mutationType: "CHANGE_MODEL",
        target: "systemVersion",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Identify the changed model.",
      "Reevaluate evidence, controls, and outcomes.",
      "Replay before use.",
    ],
  },
  {
    scenarioId: "GENERAL-DATA-DRIFT",
    laneId: "general",
    title: "Data changed after approval",
    description:
      "Material source, schema, quality, provenance, or population changes occur after approval.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: false,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-DATA-DRIFT-I01",
        title: "Change data",
        description:
          "Change material data used by the route.",
        mutationType: "CHANGE_DATA",
        target: "sourceInventory",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Document the changed data.",
      "Revalidate provenance, quality, and scope.",
      "Replay before resumed use.",
    ],
  },
  {
    scenarioId: "GENERAL-TOOL-DRIFT",
    laneId: "general",
    title: "Tool changed after approval",
    description:
      "A material tool, service, connector, or execution component changes after approval.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: false,
    preconditions: [],
    injections: [
      {
        injectionId: "GENERAL-TOOL-DRIFT-I01",
        title: "Change tool",
        description:
          "Replace a material tool or execution component.",
        mutationType: "CHANGE_TOOL",
        target: "systemVersion",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Identify and assess the changed tool.",
      "Retest controls and dependencies.",
      "Replay before restored use.",
    ],
  },
  {
    scenarioId: "GENERAL-RECOVERY-REPLAY",
    laneId: "general",
    title: "Corrected route recovery and replay",
    description:
      "A prior governance failure is corrected, independently verified, preserved, and replayed before restored execution.",
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
      "Preserve the original failure and determination.",
      "Link remediation, verification, renewed authority, and restored controls.",
      "Issue a new replay result without altering the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type GeneralScenario = (typeof GENERAL_SCENARIOS)[number];

export const GENERAL_LANE = {
  laneId: "general",
  name: "General Governance Playground",
  shortName: "General",
  description:
    "Test cross-domain governance routes for identity, claim support, scope, evidence, authority, controls, dependencies, human oversight, execution integrity, outcomes, and continuing validity.",
  claimsGoverned: [
    "The exact route, system, workflow, owner, environment, version, and purpose are identified.",
    "The governance claim is explicit, bounded, and supported by admissible evidence.",
    "In-scope and out-of-scope activities, affected parties, prohibited uses, and non-claims are preserved.",
    "Evidence is attributable, current, relevant, sufficient, and free of unresolved material conflict.",
    "Approval, commitment, execution, exception, and intervention authorities are valid and bounded.",
    "Rules, thresholds, controls, dependencies, and failure behavior are bound to the approved route.",
    "Human oversight, stop authority, escalation, suspension, remediation, and restoration are operational.",
    "Execution remains identical to the approved commitment.",
    "Outcome evidence proves whether the route actually remained within its governed boundary.",
    "Changes, drift, failures, remediations, and replay results remain preserved and independently reviewable.",
  ],
  nonClaims: [
    "This lane does not certify universal safety, legality, compliance, performance, or fitness for every use.",
    "This lane does not replace domain-specific lanes when specialized governance requirements apply.",
    "This lane does not treat policy, approval, documentation, or monitoring alone as proof of controlled execution.",
    "This lane does not permit silent scope expansion, undocumented override, or post hoc reconstruction of missing evidence.",
    "An ALLOW determination applies only to the exact route, evidence, authority, controls, dependencies, environment, version, and validity window preserved.",
  ],
  sections: GENERAL_SECTIONS,
  gateIds: GENERAL_GATE_IDS,
  evidenceTypes: [...GENERAL_EVIDENCE_TYPES],
  scenarioIds: GENERAL_SCENARIOS.map((scenario) => scenario.scenarioId),
  determinationGuidance: [
    "DENY when authority is invalid, required human intervention is blocked, execution exceeds scope, or the actual execution materially differs from the approved route.",
    "ESCALATE when material evidence conflicts, competing authorities exist, or superior governance, legal, technical, or executive authority is required.",
    "HOLD when identity, evidence, controls, dependencies, approval, monitoring, continuity, outcome evidence, or replay requirements are incomplete, expired, changed, or unresolved.",
    "ALLOW only when all applicable gates pass and the route demonstrates complete identity, bounded claims, admissible evidence, valid authority, effective controls, healthy dependencies, preserved execution, and continuing validity.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getGeneralScenario(
  scenarioId: string,
): GeneralScenario | undefined {
  return GENERAL_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
