import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Runtime Execution Governance Playground
 *
 * Governs the final pre-execution and runtime boundary where an approved
 * decision becomes a permitted, held, denied, or escalated action.
 *
 * Governing sequence:
 * Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit ->
 * Execution -> Outcome
 */

export const RUNTIME_EXECUTION_GATE_IDS = [
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

export const RUNTIME_EXECUTION_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "ROUTE_IDENTITY_RECORD",
  "EXECUTION_TARGET_RECORD",
  "ACTOR_IDENTITY_RECORD",
  "SYSTEM_IDENTITY_RECORD",
  "MODEL_IDENTITY_RECORD",
  "DATA_IDENTITY_RECORD",
  "TOOL_IDENTITY_RECORD",
  "EVIDENCE_RECORD",
  "AUTHORITY_RECORD",
  "RULE_RECORD",
  "CONTROL_RECORD",
  "DEPENDENCY_RECORD",
  "HUMAN_OVERSIGHT_RECORD",
  "EXCEPTION_RECORD",
  "ESCALATION_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_INTENT_RECORD",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "INCIDENT_RECORD",
  "REMEDIATION_RECORD",
  "REPLAY_RESULT",
] as const;

export type RuntimeExecutionEvidenceType =
  (typeof RUNTIME_EXECUTION_EVIDENCE_TYPES)[number];

export const RUNTIME_EXECUTION_SECTIONS = [
  {
    sectionId: "runtime-execution-route-identity",
    title: "Execution Route Identity",
    description:
      "Identify the exact route, system, actor, model, data, tool, target, environment, version, and execution purpose.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Execution route title",
        type: "text",
        required: true,
        placeholder: "Production execution route",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Execution route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the proposed action, target, actor, system, consequences, and why runtime governance is required.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "routeIdentifier",
        label: "Stable route identifier",
        type: "text",
        required: true,
        placeholder: "runtime-execution:route:2026-001",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "systemIdentity",
        label: "Executing system identity",
        type: "json",
        required: true,
        placeholder:
          '{"systemId":"SYS-001","name":"Governed Runtime","version":"1.0.0","environment":"production"}',
      },
      {
        key: "actorIdentity",
        label: "Execution actor identity",
        type: "json",
        required: true,
        placeholder:
          '{"actorId":"ACT-001","type":"service","role":"authorized executor","status":"active"}',
      },
      {
        key: "executionTarget",
        label: "Execution target",
        type: "json",
        required: true,
        placeholder:
          '{"targetId":"TARGET-001","type":"external system","destination":"approved endpoint"}',
      },
      {
        key: "modelIdentity",
        label: "Model identity",
        type: "json",
        required: false,
        placeholder:
          '{"modelId":"MODEL-001","version":"1.0.0","provider":"approved provider"}',
      },
      {
        key: "dataIdentity",
        label: "Data identity",
        type: "json",
        required: true,
        placeholder:
          '{"dataPackageId":"DATA-001","version":"2026.1","source":"approved source"}',
      },
      {
        key: "toolIdentity",
        label: "Tool identity",
        type: "json",
        required: false,
        placeholder:
          '{"toolId":"TOOL-001","version":"1.0.0","scope":"approved action"}',
      },
    ],
  },
  {
    sectionId: "runtime-execution-intent-scope",
    title: "Execution Intent, Scope, and Boundary",
    description:
      "Define the exact proposed action, permitted scope, prohibited actions, irreversible consequences, destinations, and non-claims.",
    order: 20,
    fields: [
      {
        key: "executionIntent",
        label: "Execution intent",
        type: "textarea",
        required: true,
        placeholder:
          "State exactly what action is proposed, why, for whom, against what target, and with what expected result.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "permittedActions",
        label: "Permitted actions",
        type: "json",
        required: true,
        placeholder:
          '["approved transaction","approved system update","approved notification"]',
      },
      {
        key: "prohibitedActions",
        label: "Prohibited actions",
        type: "json",
        required: true,
        placeholder:
          '["unapproved destination","scope expansion","credential change","record deletion","silent override"]',
      },
      {
        key: "executionParameters",
        label: "Execution parameters",
        type: "json",
        required: true,
        placeholder:
          '{"amount":27500,"currency":"USD","destination":"approved beneficiary","maximumAttempts":1}',
      },
      {
        key: "scopeBoundary",
        label: "Scope boundary",
        type: "json",
        required: true,
        placeholder:
          '{"actor":"ACT-001","target":"TARGET-001","environment":"production","timeWindow":"approved window"}',
      },
      {
        key: "irreversibleConsequences",
        label: "Irreversible consequences",
        type: "json",
        required: true,
        placeholder:
          '["external funds transfer","public disclosure","physical actuation","permanent deletion"]',
      },
      {
        key: "nonClaims",
        label: "Explicit non-claims",
        type: "json",
        required: true,
        placeholder:
          '["approval does not extend beyond this exact action","runtime permission does not certify universal safety"]',
      },
    ],
  },
  {
    sectionId: "runtime-execution-evidence-authority",
    title: "Evidence, Authority, and Admissibility",
    description:
      "Establish the evidence, source authority, approval authority, actor authority, validity windows, conflicts, and admissibility conditions required before commitment.",
    order: 30,
    fields: [
      {
        key: "evidenceInventory",
        label: "Execution evidence inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceId":"EV-001","type":"EVIDENCE_RECORD","supports":"execution condition","status":"current"}]',
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
        key: "authorityInventory",
        label: "Authority inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"authorityId":"AUTH-001","role":"execution approver","scope":"TARGET-001","status":"active"}]',
      },
      {
        key: "actorAuthority",
        label: "Actor execution authority",
        type: "json",
        required: true,
        placeholder:
          '{"actorId":"ACT-001","authorityId":"AUTH-ACT-001","scope":"approved route only","status":"active"}',
      },
      {
        key: "approvalRecord",
        label: "Approval record",
        type: "json",
        required: true,
        placeholder:
          '{"approvalId":"APR-001","decision":"approved","routeId":"runtime-execution:route:2026-001","status":"active"}',
      },
      {
        key: "validityWindow",
        label: "Validity window",
        type: "json",
        required: true,
        placeholder:
          '{"validFrom":"2026-07-01T00:00:00Z","validUntil":"2026-07-01T01:00:00Z"}',
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
          { value: "fail-closed", label: "Fail closed" },
        ],
      },
    ],
  },
  {
    sectionId: "runtime-execution-rules-controls",
    title: "Rules, Controls, Dependencies, and Binding",
    description:
      "Bind the proposed action to the applicable rules, thresholds, controls, dependencies, exception policy, and fail-closed behavior.",
    order: 40,
    fields: [
      {
        key: "governingRules",
        label: "Governing rules",
        type: "json",
        required: true,
        placeholder:
          '[{"ruleId":"RULE-001","condition":"all mandatory gates pass","result":"eligible for commit"}]',
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
        label: "Execution controls",
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
        label: "Critical dependencies",
        type: "json",
        required: true,
        placeholder:
          '[{"dependencyId":"DEP-001","type":"identity provider","critical":true,"status":"available"}]',
      },
      {
        key: "bindingMethod",
        label: "Execution binding method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how actor, model, data, tools, evidence, authority, rules, controls, target, parameters, and validity window are bound into one immutable commit.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "exceptionPolicy",
        label: "Exception policy",
        type: "textarea",
        required: true,
        placeholder:
          "Describe who may request, approve, constrain, expire, monitor, revoke, and preserve an execution exception.",
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
    sectionId: "runtime-execution-commit-release",
    title: "Commit, Release, and Intervention",
    description:
      "Define commitment authority, release conditions, runtime checks, human intervention, stop authority, rollback, and blocked-intervention behavior.",
    order: 50,
    fields: [
      {
        key: "commitAuthority",
        label: "Commit authority",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"authorized committer","scope":"approved route only","status":"active"}]',
      },
      {
        key: "preCommitConditions",
        label: "Pre-commit conditions",
        type: "json",
        required: true,
        placeholder:
          '["identity verified","evidence current","authority valid","controls effective","dependencies healthy","target confirmed"]',
      },
      {
        key: "releaseConditions",
        label: "Release conditions",
        type: "json",
        required: true,
        placeholder:
          '["commit hash matches","parameters unchanged","validity window open","runtime controls active"]',
      },
      {
        key: "runtimeChecks",
        label: "Runtime checks",
        type: "json",
        required: true,
        placeholder:
          '["actor revalidation","target revalidation","parameter comparison","dependency health","scope comparison"]',
      },
      {
        key: "humanOversightModel",
        label: "Human oversight model",
        type: "textarea",
        required: true,
        placeholder:
          "Describe when human review, intervention, stop authority, escalation, and post-execution review are required.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "interventionTriggers",
        label: "Intervention triggers",
        type: "json",
        required: true,
        placeholder:
          '["evidence conflict","authority loss","parameter change","target change","control failure","dependency failure","unexpected runtime state"]',
      },
      {
        key: "rollbackContainment",
        label: "Rollback and containment",
        type: "json",
        required: true,
        placeholder:
          '{"rollbackAvailable":true,"containmentAvailable":true,"maximumContainmentTimeSeconds":30}',
      },
      {
        key: "blockedInterventionBehavior",
        label: "Behavior when intervention is blocked",
        type: "select",
        required: true,
        options: [
          { value: "deny", label: "DENY" },
          { value: "fail-closed", label: "Fail closed" },
          { value: "hold", label: "HOLD" },
          { value: "emergency-stop", label: "Emergency stop" },
        ],
      },
    ],
  },
  {
    sectionId: "runtime-execution-monitoring-incidents",
    title: "Monitoring, Incidents, Drift, and Remediation",
    description:
      "Monitor pre-release state, runtime behavior, execution mismatches, drift, incidents, escalation, suspension, remediation, and controlled restoration.",
    order: 60,
    fields: [
      {
        key: "runtimeMonitoringPlan",
        label: "Runtime monitoring plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe monitoring of actor, model, data, tools, target, parameters, controls, dependencies, latency, failures, and outcome signals.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "monitoringSignals",
        label: "Monitoring signals",
        type: "json",
        required: true,
        placeholder:
          '["identity change","authority revocation","model change","data change","tool change","target change","control failure","execution mismatch","outcome mismatch"]',
      },
      {
        key: "driftTriggers",
        label: "Drift triggers",
        type: "json",
        required: true,
        placeholder:
          '["model version drift","data package drift","tool version drift","scope drift","parameter drift","environment drift"]',
      },
      {
        key: "incidentTriggers",
        label: "Incident triggers",
        type: "json",
        required: true,
        placeholder:
          '["unauthorized release","wrong target","wrong amount","failed control","blocked stop","unexpected side effect","record discontinuity"]',
      },
      {
        key: "escalationPath",
        label: "Escalation path",
        type: "json",
        required: true,
        placeholder:
          '[{"level":1,"role":"runtime operator"},{"level":2,"role":"governance authority"},{"level":3,"role":"executive or legal authority"}]',
      },
      {
        key: "suspensionTriggers",
        label: "Suspension triggers",
        type: "json",
        required: true,
        placeholder:
          '["invalid authority","critical evidence loss","uncontrolled execution","material mismatch","critical incident","failed remediation"]',
      },
      {
        key: "remediationProcess",
        label: "Remediation process",
        type: "textarea",
        required: true,
        placeholder:
          "Describe containment, reversal, evidence preservation, impact assessment, correction, verification, reapproval, replay, and restoration.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "restorationConditions",
        label: "Restoration conditions",
        type: "json",
        required: true,
        placeholder:
          '["root cause corrected","controls retested","authority renewed","evidence complete","independent verification complete","replay passes"]',
      },
    ],
  },
  {
    sectionId: "runtime-execution-records-outcomes",
    title: "Execution Records, Outcomes, and Replay",
    description:
      "Preserve what was proposed, admitted, committed, released, executed, changed, observed, remediated, and replayed.",
    order: 70,
    fields: [
      {
        key: "requiredRecords",
        label: "Required preserved records",
        type: "json",
        required: true,
        placeholder:
          '["ROUTE_IDENTITY_RECORD","EXECUTION_INTENT_RECORD","EVIDENCE_RECORD","AUTHORITY_RECORD","RULE_RECORD","CONTROL_RECORD","COMMIT_AUTHORIZATION","EXECUTION_RECEIPT","OUTCOME_EVIDENCE","REPLAY_RESULT"]',
      },
      {
        key: "recordIntegrityMethod",
        label: "Record integrity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe timestamps, signatures, hashes, immutable commit references, append-only preservation, correction handling, retention, and access control.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "commitRecord",
        label: "Commit authorization",
        type: "json",
        required: true,
        placeholder:
          '{"commitId":"COMMIT-001","routeId":"runtime-execution:route:2026-001","hash":"sha256:...","decision":"ALLOW"}',
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
            ruleId: "RUNTIME-EXECUTION-RECEIPT-01",
            description: "Required when execution has occurred.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"EXEC-001","commitId":"COMMIT-001","actor":"ACT-001","target":"TARGET-001","status":"completed"}',
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
            ruleId: "RUNTIME-EXECUTION-OUTCOME-01",
            description: "Required when outcome evidence is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe whether the actual execution and outcome matched the committed action, parameters, target, scope, controls, and expected result.",
        validation: { maxLength: 6000 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["evidence expiry","authority change","model change","data change","tool change","target change","execution mismatch","outcome mismatch","incident"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how route identity, evidence, authority, controls, dependencies, commit, execution, outcome, drift, incidents, and remediation are revalidated.",
        validation: { minLength: 20, maxLength: 7000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const RUNTIME_EXECUTION_SCENARIOS = [
  {
    scenarioId: "RUNTIME-EXECUTION-BASELINE-ALLOW",
    laneId: "runtime-execution",
    title: "Complete admissible runtime execution",
    description:
      "The exact route, actor, model, data, tool, target, evidence, authority, controls, dependencies, commit, release, and replay requirements are complete and current.",
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
    scenarioId: "RUNTIME-EXECUTION-MISSING-ROUTE-IDENTITY",
    laneId: "runtime-execution",
    title: "Execution route identity missing",
    description:
      "The exact system, actor, target, model, data, tool, environment, or version cannot be uniquely identified.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-MISSING-ROUTE-IDENTITY-I01",
        title: "Remove route identity",
        description:
          "Remove evidence binding the proposed action to one exact route.",
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
      "Reconstruct the exact route identity.",
      "Bind actor, target, environment, and versions.",
      "Replay before commitment.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-ACTOR-IDENTITY-MISSING",
    laneId: "runtime-execution",
    title: "Execution actor identity missing",
    description:
      "The human, service, agent, model, or system attempting execution cannot be uniquely identified.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-ACTOR-IDENTITY-MISSING-I01",
        title: "Remove actor identity",
        description:
          "Remove the record identifying the execution actor.",
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
      "Rebind valid actor authority.",
      "Issue a new commit decision.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-EVIDENCE-EXPIRED",
    laneId: "runtime-execution",
    title: "Required execution evidence expired",
    description:
      "A mandatory evidence record is outside its approved validity window before release.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-EVIDENCE-EXPIRED-I01",
        title: "Expire execution evidence",
        description:
          "Expire a mandatory evidence record supporting runtime admissibility.",
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
      "Confirm no material route drift.",
      "Recommit and replay before release.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-AUTHORITY-REVOKED",
    laneId: "runtime-execution",
    title: "Execution authority revoked",
    description:
      "Approval, actor, commit, or release authority is revoked after route preparation.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-AUTHORITY-REVOKED-I01",
        title: "Revoke execution authority",
        description:
          "Invalidate a mandatory authority record before execution.",
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
      "Stop release.",
      "Obtain valid replacement authority.",
      "Issue a new approval and commit.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-EVIDENCE-CONFLICT",
    laneId: "runtime-execution",
    title: "Material execution evidence conflict",
    description:
      "Authoritative records disagree about the actor, target, amount, destination, condition, authority, or expected result.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-EVIDENCE-CONFLICT-I01",
        title: "Create execution evidence conflict",
        description:
          "Introduce contradictory evidence for a material execution condition.",
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
      "Preserve all conflicting evidence.",
      "Resolve through independent authority.",
      "Do not recommit until resolved.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-SCOPE-DRIFT",
    laneId: "runtime-execution",
    title: "Execution scope changed after approval",
    description:
      "The actor, target, destination, amount, environment, purpose, or action expands beyond the approved scope.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-SCOPE-DRIFT-I01",
        title: "Alter execution scope",
        description:
          "Expand the proposed execution beyond the preserved boundary.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "scopeBoundary",
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
      "Reject the altered action.",
      "Create a new bounded route for any proposed expansion.",
      "Reevaluate and recommit.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-CONTROL-FAILURE",
    laneId: "runtime-execution",
    title: "Mandatory runtime control failed",
    description:
      "A preventive, detective, release, target, parameter, or containment control is ineffective or unavailable.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-CONTROL-FAILURE-I01",
        title: "Remove control effectiveness evidence",
        description:
          "Remove evidence showing a mandatory runtime control is effective.",
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
      "Recommit before release.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-DEPENDENCY-FAILURE",
    laneId: "runtime-execution",
    title: "Critical runtime dependency failed",
    description:
      "A critical identity, data, tool, network, target, authorization, or infrastructure dependency is unavailable or untrusted.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-DEPENDENCY-FAILURE-I01",
        title: "Alter dependency status",
        description:
          "Set a critical execution dependency to failed.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "dependencies",
        value: "critical-runtime-dependency-failed",
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
      "Replay before execution.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-MODEL-CHANGE",
    laneId: "runtime-execution",
    title: "Model changed after commit",
    description:
      "The model identity, version, configuration, or provider release differs from the committed route.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-MODEL-CHANGE-I01",
        title: "Change runtime model",
        description:
          "Replace or modify the committed model.",
        mutationType: "CHANGE_MODEL",
        target: "modelIdentity",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Stop execution.",
      "Evaluate and approve the changed model.",
      "Create a new commit and replay.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-DATA-CHANGE",
    laneId: "runtime-execution",
    title: "Data changed after commit",
    description:
      "The input package, source, schema, value, provenance, or quality condition differs from the committed route.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-DATA-CHANGE-I01",
        title: "Change runtime data",
        description:
          "Alter the data package bound to the commit.",
        mutationType: "CHANGE_DATA",
        target: "dataIdentity",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Preserve the changed data identity.",
      "Revalidate provenance and effect.",
      "Recommit before execution.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-TOOL-CHANGE",
    laneId: "runtime-execution",
    title: "Tool changed after commit",
    description:
      "A material tool, connector, API, actuator, service, or execution component differs from the committed route.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-TOOL-CHANGE-I01",
        title: "Change runtime tool",
        description:
          "Replace a tool bound to the approved commit.",
        mutationType: "CHANGE_TOOL",
        target: "toolIdentity",
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
      "Identify and validate the changed tool.",
      "Retest controls and dependencies.",
      "Create a new commit before release.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-HUMAN-INTERVENTION-BLOCKED",
    laneId: "runtime-execution",
    title: "Required human intervention blocked",
    description:
      "The authorized human cannot pause, deny, redirect, contain, reverse, or stop execution.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-HUMAN-INTERVENTION-BLOCKED-I01",
        title: "Block runtime intervention",
        description:
          "Disable the required human intervention or stop mechanism.",
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
      "Restore intervention authority and mechanism.",
      "Test stop and containment capability.",
      "Recommit before execution.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-EXECUTION-MISMATCH",
    laneId: "runtime-execution",
    title: "Actual execution differs from commit",
    description:
      "The actual actor, target, destination, model, data, tool, amount, parameter, timing, or action differs from the immutable commit.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-EXECUTION-MISMATCH-I01",
        title: "Create runtime execution mismatch",
        description:
          "Cause actual execution to differ from the committed route.",
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
      "Preserve the commit and actual execution evidence.",
      "Investigate, remediate, and replay.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-OUTCOME-MISMATCH",
    laneId: "runtime-execution",
    title: "Execution outcome contradicts approved claim",
    description:
      "The measured outcome does not correspond to the committed action, target, parameters, controls, or expected result.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-OUTCOME-MISMATCH-I01",
        title: "Create runtime outcome mismatch",
        description:
          "Provide outcome evidence that contradicts the approved execution claim.",
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
      "Preserve the actual outcome evidence.",
      "Assess impact and contain continuing effects.",
      "Remediate and replay before restored reliance.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-RECOVERY-REPLAY",
    laneId: "runtime-execution",
    title: "Corrected runtime recovery and replay",
    description:
      "A prior runtime execution failure is corrected, independently verified, preserved, and replayed before restored execution.",
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
      "Preserve the original failure, commit, execution, and determination.",
      "Link remediation, renewed evidence, authority, control testing, and independent verification.",
      "Issue a new commit and replay result without altering the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type RuntimeExecutionScenario =
  (typeof RUNTIME_EXECUTION_SCENARIOS)[number];

export const RUNTIME_EXECUTION_LANE = {
  laneId: "runtime-execution",
  name: "Runtime Execution Governance Playground",
  shortName: "Runtime Execution",
  description:
    "Test the final admissibility boundary where approved evidence, authority, scope, controls, dependencies, and intent are bound into a commit before an action is permitted to execute.",
  claimsGoverned: [
    "The exact route, actor, system, model, data, tool, target, environment, and execution purpose are identified.",
    "The proposed action, scope, parameters, destination, consequences, prohibited actions, and non-claims are explicit.",
    "Evidence is attributable, current, sufficient, and free of unresolved material conflict before commitment.",
    "Approval, actor, commit, release, intervention, and exception authorities are valid and bounded.",
    "Rules, thresholds, controls, dependencies, targets, parameters, and failure behavior are bound into one immutable commit.",
    "Runtime release is permitted only when the live state still matches the committed state.",
    "Human intervention, stop authority, rollback, containment, escalation, and fail-closed behavior remain operational.",
    "Material model, data, tool, target, parameter, scope, environment, or authority changes invalidate the prior commit.",
    "Execution receipts prove what actually executed.",
    "Outcome evidence proves whether controlled execution produced the approved result.",
  ],
  nonClaims: [
    "Approval alone does not prove admissible execution.",
    "A commit does not authorize any action beyond the exact preserved route and validity window.",
    "Monitoring alone does not prevent unauthorized or mismatched execution.",
    "A successful system response does not prove the correct actor, target, parameters, authority, or outcome.",
    "An ALLOW determination applies only to the exact evidence, authority, actor, model, data, tools, target, parameters, controls, dependencies, environment, and validity window preserved.",
  ],
  sections: RUNTIME_EXECUTION_SECTIONS,
  gateIds: RUNTIME_EXECUTION_GATE_IDS,
  evidenceTypes: [...RUNTIME_EXECUTION_EVIDENCE_TYPES],
  scenarioIds: RUNTIME_EXECUTION_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when actor or authority is invalid, scope changes, intervention is blocked, the committed identity changes, or actual execution differs from the commit.",
    "ESCALATE when material evidence conflicts or superior governance, legal, safety, financial, technical, or executive authority is required.",
    "HOLD when evidence, controls, dependencies, validity, data, tools, monitoring, continuity, outcome evidence, or remediation is incomplete, expired, changed, or unresolved.",
    "ALLOW only when all applicable gates pass and the live execution state exactly matches the bounded, evidence-supported, authority-backed, control-bound immutable commit.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getRuntimeExecutionScenario(
  scenarioId: string,
): RuntimeExecutionScenario | undefined {
  return RUNTIME_EXECUTION_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
