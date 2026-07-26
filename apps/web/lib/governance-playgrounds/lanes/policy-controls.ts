import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Policy & Controls Governance Playground
 *
 * Tests whether declared policies are authoritative, current, scoped, bound to
 * enforceable controls, effective at runtime, preserved through exceptions,
 * and continuously replayable.
 */

export const POLICY_CONTROLS_GATE_IDS = [
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

export const POLICY_CONTROLS_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "POLICY_ROUTE_IDENTITY",
  "POLICY_SCOPE_RECORD",
  "POLICY_DOCUMENT",
  "POLICY_AUTHORITY_RECORD",
  "POLICY_VERSION_RECORD",
  "POLICY_APPROVAL_RECORD",
  "CONTROL_CATALOG",
  "CONTROL_OWNER_RECORD",
  "CONTROL_IMPLEMENTATION_RECORD",
  "CONTROL_TEST_RECORD",
  "CONTROL_EFFECTIVENESS_RECORD",
  "ENFORCEMENT_POINT_RECORD",
  "RULE_BINDING_RECORD",
  "CONFIGURATION_RECORD",
  "EXCEPTION_RECORD",
  "WAIVER_RECORD",
  "CONFLICT_RESOLUTION_RECORD",
  "CHANGE_CONTROL_RECORD",
  "RUNTIME_EVALUATION_RECORD",
  "CONTROL_FAILURE_RECORD",
  "ESCALATION_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "REMEDIATION_RECORD",
  "REPLAY_RESULT",
] as const;

export type PolicyControlsEvidenceType =
  (typeof POLICY_CONTROLS_EVIDENCE_TYPES)[number];

export const POLICY_CONTROLS_SECTIONS = [
  {
    sectionId: "policy-route-identity",
    title: "Policy Route Identity",
    description:
      "Identify the exact policy-governed system, decision, action, environment, owner, affected parties, and control surface.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Policy route title",
        type: "text",
        required: true,
        placeholder: "Policy control for autonomous vendor-payment execution",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Policy route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the policy-governed action, the controls that constrain it, and the consequences of control failure.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "policyRouteIdentifier",
        label: "Stable policy route identifier",
        type: "text",
        required: true,
        placeholder: "policy-control:payments:2026-00418",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "subjectSystem",
        label: "System or process under policy control",
        type: "text",
        required: true,
        placeholder: "Autonomous Accounts Payable Service",
        validation: { minLength: 2, maxLength: 300 },
      },
      {
        key: "subjectDecisionOrAction",
        label: "Decision or action being constrained",
        type: "textarea",
        required: true,
        placeholder:
          "Authorize, hold, deny, or escalate a vendor payment before commitment.",
        validation: { minLength: 10, maxLength: 2500 },
      },
      {
        key: "policyOwner",
        label: "Policy owner",
        type: "text",
        required: true,
        placeholder: "Enterprise Finance Governance",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "controlOwner",
        label: "Control owner",
        type: "text",
        required: true,
        placeholder: "Payments Platform Control Team",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "environment",
        label: "Execution environment",
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
      {
        key: "affectedParties",
        label: "Affected parties",
        type: "json",
        required: true,
        placeholder:
          '[{"partyId":"vendor-219","role":"beneficiary"},{"partyId":"organization-1","role":"payer"}]',
      },
    ],
  },
  {
    sectionId: "claim-scope-boundary",
    title: "Policy Claim and Boundary",
    description:
      "State what the policy and controls are expected to govern, where their authority begins and ends, and what is explicitly excluded.",
    order: 20,
    fields: [
      {
        key: "governanceClaim",
        label: "Policy and controls governance claim",
        type: "textarea",
        required: true,
        placeholder:
          "This route determines whether the declared action is governed by a current authoritative policy and whether enforceable controls remain bound to execution.",
        validation: { minLength: 20, maxLength: 4000 },
      },
      {
        key: "policyQuestion",
        label: "Policy-control question",
        type: "textarea",
        required: true,
        placeholder:
          "Does a current and authoritative policy govern this action, and are the required controls implemented, effective, enforced, and preserved?",
        validation: { minLength: 10, maxLength: 2000 },
      },
      {
        key: "inScope",
        label: "In-scope policy and controls",
        type: "textarea",
        required: true,
        placeholder:
          "Identify included decisions, systems, actors, transactions, control objectives, jurisdictions, thresholds, and time periods.",
        validation: { minLength: 10, maxLength: 5000 },
      },
      {
        key: "outOfScope",
        label: "Out-of-scope policy and controls",
        type: "textarea",
        required: true,
        placeholder:
          "Identify excluded systems, actors, transaction types, jurisdictions, periods, and legal conclusions.",
        validation: { minLength: 10, maxLength: 5000 },
      },
      {
        key: "policyObjectives",
        label: "Policy objectives",
        type: "json",
        required: true,
        placeholder:
          '["prevent unauthorized payments","require verified beneficiaries","enforce separation of duties","preserve execution evidence"]',
      },
      {
        key: "controlObjectives",
        label: "Control objectives",
        type: "json",
        required: true,
        placeholder:
          '["validate authority","validate beneficiary","enforce approval threshold","block conflicting evidence","record outcome"]',
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
        key: "explicitNonClaims",
        label: "Explicit non-claims",
        type: "textarea",
        required: true,
        placeholder:
          "This route does not prove legal compliance merely because a policy exists and does not guarantee that every risk has been eliminated.",
        validation: { minLength: 10, maxLength: 4000 },
      },
    ],
  },
  {
    sectionId: "policy-authority-version",
    title: "Policy Authority, Approval, and Version",
    description:
      "Establish the governing policy source, issuing authority, approval state, effective period, supersession rules, and exact version applicable at decision time.",
    order: 30,
    fields: [
      {
        key: "policyDocuments",
        label: "Applicable policy documents",
        type: "json",
        required: true,
        placeholder:
          '[{"policyId":"FIN-PAY-004","title":"Vendor Payment Authorization Policy","version":"4.2","effectiveFrom":"2026-01-01T00:00:00Z"}]',
      },
      {
        key: "policyAuthority",
        label: "Policy authority",
        type: "json",
        required: true,
        placeholder:
          '[{"policyId":"FIN-PAY-004","issuer":"Chief Financial Officer","authorityBasis":"Board-approved delegation"}]',
      },
      {
        key: "policyApprovalRecords",
        label: "Policy approval records",
        type: "json",
        required: true,
        placeholder:
          '[{"policyId":"FIN-PAY-004","approvedBy":"cfo-1","approvedAt":"2025-12-15T14:30:00Z","status":"approved"}]',
      },
      {
        key: "currentPolicyVersion",
        label: "Current policy version",
        type: "text",
        required: true,
        placeholder: "4.2",
        validation: { minLength: 1, maxLength: 100 },
      },
      {
        key: "effectivePeriod",
        label: "Policy effective period",
        type: "json",
        required: true,
        placeholder:
          '{"effectiveFrom":"2026-01-01T00:00:00Z","effectiveUntil":"2026-12-31T23:59:59Z"}',
      },
      {
        key: "supersessionRules",
        label: "Supersession rules",
        type: "textarea",
        required: true,
        placeholder:
          "Describe when a new version supersedes a prior policy, how open decisions are handled, and whether replay is mandatory.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "policyHierarchy",
        label: "Policy hierarchy",
        type: "json",
        required: true,
        placeholder:
          '[{"level":1,"source":"law"},{"level":2,"source":"board policy"},{"level":3,"source":"enterprise standard"},{"level":4,"source":"operating procedure"}]',
      },
      {
        key: "conflictResolutionMethod",
        label: "Policy conflict resolution method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe precedence, authority review, escalation, preservation, and temporary HOLD requirements for conflicting policies.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "control-design-implementation",
    title: "Control Design and Implementation",
    description:
      "Define the controls required by policy, their ownership, implementation, enforcement points, dependencies, and fail-safe behavior.",
    order: 40,
    fields: [
      {
        key: "controlCatalog",
        label: "Control catalog",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-AUTH-01","objective":"verify authority","type":"preventive","enforcementPoint":"pre-commit"},{"controlId":"CTRL-BEN-02","objective":"verify beneficiary","type":"preventive","enforcementPoint":"pre-execution"}]',
      },
      {
        key: "controlOwners",
        label: "Control owners",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-AUTH-01","owner":"finance-controls-team"},{"controlId":"CTRL-BEN-02","owner":"vendor-master-team"}]',
      },
      {
        key: "controlImplementations",
        label: "Control implementations",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-AUTH-01","implementation":"runtime authority resolver","version":"2.4.1"},{"controlId":"CTRL-BEN-02","implementation":"beneficiary verification service","version":"5.1.0"}]',
      },
      {
        key: "enforcementPoints",
        label: "Enforcement points",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-AUTH-01","stage":"before-commit"},{"controlId":"CTRL-BEN-02","stage":"before-execution"}]',
      },
      {
        key: "controlDependencies",
        label: "Control dependencies",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-AUTH-01","dependsOn":["identity-service","authority-registry"]},{"controlId":"CTRL-BEN-02","dependsOn":["vendor-master","bank-validation-service"]}]',
      },
      {
        key: "failSafeBehavior",
        label: "Control failure behavior",
        type: "select",
        required: true,
        options: [
          { value: "hold", label: "HOLD" },
          { value: "deny", label: "DENY" },
          { value: "escalate", label: "ESCALATE" },
          { value: "fail-closed", label: "Fail closed" },
        ],
      },
      {
        key: "manualControlProcedure",
        label: "Manual control procedure",
        type: "textarea",
        required: true,
        placeholder:
          "Describe when manual control is permitted, who may operate it, what evidence is required, and how the result is reconciled.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "controlBypassProtection",
        label: "Control bypass protection",
        type: "json",
        required: true,
        placeholder:
          '["signed deployment","runtime attestation","separation of duties","immutable control mapping","bypass alerting","automatic HOLD"]',
      },
    ],
  },
  {
    sectionId: "testing-effectiveness-monitoring",
    title: "Control Testing, Effectiveness, and Monitoring",
    description:
      "Establish how controls are tested before use, monitored during operation, measured against objectives, and invalidated when effectiveness is unsupported.",
    order: 50,
    fields: [
      {
        key: "controlTestPlan",
        label: "Control test plan",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-AUTH-01","test":"invalid authority is blocked","frequency":"daily"},{"controlId":"CTRL-BEN-02","test":"unverified beneficiary produces HOLD","frequency":"per release"}]',
      },
      {
        key: "controlTestResults",
        label: "Current control test results",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-AUTH-01","result":"pass","testedAt":"2026-07-25T10:00:00Z"},{"controlId":"CTRL-BEN-02","result":"pass","testedAt":"2026-07-25T10:10:00Z"}]',
      },
      {
        key: "effectivenessCriteria",
        label: "Control effectiveness criteria",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-AUTH-01","metric":"unauthorized actions blocked","threshold":"100%"},{"controlId":"CTRL-BEN-02","metric":"unverified beneficiaries blocked","threshold":"100%"}]',
      },
      {
        key: "monitoringSignals",
        label: "Runtime monitoring signals",
        type: "json",
        required: true,
        placeholder:
          '["control invocation","control decision","latency","dependency status","bypass attempt","exception use","execution mismatch"]',
      },
      {
        key: "monitoringFrequency",
        label: "Monitoring frequency",
        type: "text",
        required: true,
        placeholder: "Continuous at runtime; daily aggregate review",
        validation: { minLength: 3, maxLength: 500 },
      },
      {
        key: "controlFailureThresholds",
        label: "Control failure thresholds",
        type: "json",
        required: true,
        placeholder:
          '[{"condition":"single preventive control failure","response":"HOLD"},{"condition":"repeated bypass attempts","response":"DENY and ESCALATE"}]',
      },
      {
        key: "effectivenessReviewMethod",
        label: "Effectiveness review method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how design effectiveness, operating effectiveness, false positives, false negatives, incidents, and outcomes are reviewed.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "independentAssurance",
        label: "Independent assurance requirements",
        type: "textarea",
        required: true,
        placeholder:
          "Describe when independent testing, sampling, audit, or second-line review is required.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "exceptions-waivers-change",
    title: "Exceptions, Waivers, and Change Control",
    description:
      "Constrain policy exceptions and waivers, preserve their authority and scope, and ensure policy or control changes cannot silently alter execution.",
    order: 60,
    fields: [
      {
        key: "exceptionConditions",
        label: "Permitted exception conditions",
        type: "json",
        required: true,
        placeholder:
          '["declared emergency","verified service outage","court order","documented business continuity event"]',
      },
      {
        key: "exceptionAuthority",
        label: "Exception authority",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"chief-financial-officer","scope":"declared finance emergencies","maximumDuration":"24 hours"}]',
      },
      {
        key: "exceptionRequirements",
        label: "Exception requirements",
        type: "json",
        required: true,
        placeholder:
          '["named authority","written basis","specific scope","time limit","compensating controls","independent review","preserved original determination"]',
      },
      {
        key: "waiverRegistry",
        label: "Waiver registry",
        type: "json",
        required: true,
        placeholder:
          '[{"waiverId":"WVR-2026-019","policyId":"FIN-PAY-004","status":"inactive","expiresAt":"2026-08-01T00:00:00Z"}]',
      },
      {
        key: "compensatingControls",
        label: "Compensating controls",
        type: "json",
        required: true,
        placeholder:
          '[{"exceptionType":"vendor-validation-outage","controls":["manual bank verification","dual approval","next-day reconciliation"]}]',
      },
      {
        key: "changeControlProcess",
        label: "Policy and control change process",
        type: "textarea",
        required: true,
        placeholder:
          "Describe proposal, approval, testing, deployment, rollback, notice, versioning, migration, and replay requirements.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "emergencyChangeRules",
        label: "Emergency change rules",
        type: "textarea",
        required: true,
        placeholder:
          "Describe emergency authority, minimum evidence, time limit, retrospective review, rollback, and incident linkage.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "driftDetection",
        label: "Policy and control drift detection",
        type: "json",
        required: true,
        placeholder:
          '["policy hash change","control configuration change","enforcement point change","dependency change","exception growth","test-result degradation"]',
      },
    ],
  },
  {
    sectionId: "runtime-records-outcome-replay",
    title: "Runtime Binding, Records, Outcomes, and Replay",
    description:
      "Preserve which policy and controls governed the exact action, prove runtime enforcement, compare execution and outcome, and revalidate continuing authority through replay.",
    order: 70,
    fields: [
      {
        key: "runtimePolicyBinding",
        label: "Runtime policy binding",
        type: "json",
        required: true,
        placeholder:
          '{"policyId":"FIN-PAY-004","version":"4.2","boundAt":"2026-07-26T15:42:00Z","routeHash":"sha256:..."}',
      },
      {
        key: "runtimeControlBinding",
        label: "Runtime control binding",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-AUTH-01","version":"2.4.1","status":"active"},{"controlId":"CTRL-BEN-02","version":"5.1.0","status":"active"}]',
      },
      {
        key: "requiredRecords",
        label: "Required preserved records",
        type: "json",
        required: true,
        placeholder:
          '["POLICY_DOCUMENT","POLICY_AUTHORITY_RECORD","POLICY_VERSION_RECORD","CONTROL_IMPLEMENTATION_RECORD","CONTROL_TEST_RECORD","RULE_BINDING_RECORD","RUNTIME_EVALUATION_RECORD","EXECUTION_RECEIPT","REPLAY_RESULT"]',
      },
      {
        key: "recordIntegrityMethod",
        label: "Record integrity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe attribution, timestamps, signatures, hashes, append-only preservation, corrections, and access control.",
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
            ruleId: "POLICY-CONTROLS-EXECUTION-01",
            description: "Required when execution has occurred.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"exec-418","policyVersion":"4.2","controlsApplied":["CTRL-AUTH-01","CTRL-BEN-02"],"status":"completed"}',
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
            ruleId: "POLICY-CONTROLS-OUTCOME-01",
            description: "Required when outcome evidence is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe whether the policy objective and control objective were achieved and whether the action produced any material mismatch.",
        validation: { maxLength: 5000 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["policy version change","authority change","control change","configuration change","dependency change","exception","waiver","control failure","execution mismatch","outcome mismatch"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how policy authority, version, control implementation, test results, enforcement points, exceptions, execution, and outcomes are revalidated.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const POLICY_CONTROLS_SCENARIOS = [
  {
    scenarioId: "POLICY-CONTROLS-BASELINE-ALLOW",
    laneId: "policy-controls",
    title: "Authoritative policy and effective controls baseline",
    description:
      "A current authoritative policy is bound to implemented, tested, effective, and enforced controls before execution.",
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
    scenarioId: "POLICY-CONTROLS-MISSING-POLICY",
    laneId: "policy-controls",
    title: "Missing governing policy",
    description:
      "The action has controls or procedures but no admissible governing policy for the declared decision.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-MISSING-POLICY-I01",
        title: "Remove governing policy",
        description:
          "Remove the authoritative policy document from the evidence package.",
        mutationType: "REMOVE_EVIDENCE",
        target: "POLICY_DOCUMENT",
      },
    ],
    expectedGateStatuses: {
      G02_GOVERNANCE_CLAIM: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Identify the authoritative policy.",
      "Verify approval, scope, version, and effective period.",
      "Rebind controls to the policy before execution.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-EXPIRED-POLICY",
    laneId: "policy-controls",
    title: "Policy expired before decision",
    description:
      "The policy evidence exists but the effective period ended before the governed decision.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-EXPIRED-POLICY-I01",
        title: "Expire policy evidence",
        description:
          "Expire the governing policy version before the current decision.",
        mutationType: "EXPIRE_EVIDENCE",
        target: "POLICY_VERSION_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Approve or identify a current policy version.",
      "Assess decisions made after expiry.",
      "Replay the route under the current policy.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-CONFLICTING-POLICIES",
    laneId: "policy-controls",
    title: "Conflicting policies",
    description:
      "Two applicable policies produce materially inconsistent requirements or determinations.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-CONFLICTING-POLICIES-I01",
        title: "Create evidence conflict",
        description:
          "Introduce a conflicting policy with overlapping scope and incompatible requirements.",
        mutationType: "CREATE_EVIDENCE_CONFLICT",
        target: "policyDocuments",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Apply the declared policy hierarchy.",
      "Obtain authoritative conflict resolution.",
      "Preserve both policies and the resolution record.",
      "Replay before release.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-NOT-IMPLEMENTED",
    laneId: "policy-controls",
    title: "Required control not implemented",
    description:
      "The policy requires a control that has no verified implementation at the declared enforcement point.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-NOT-IMPLEMENTED-I01",
        title: "Remove control implementation evidence",
        description:
          "Remove the implementation record for a mandatory preventive control.",
        mutationType: "REMOVE_EVIDENCE",
        target: "CONTROL_IMPLEMENTATION_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Implement the required control.",
      "Test the control at the actual enforcement point.",
      "Preserve implementation and test evidence.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-CONTROL-BYPASS",
    laneId: "policy-controls",
    title: "Control bypass attempt",
    description:
      "Execution is routed around a mandatory control or the control is disabled without authorized change control.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-CONTROL-BYPASS-I01",
        title: "Alter control binding",
        description:
          "Remove a required preventive control from the runtime binding.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "runtimeControlBinding",
        value: "required-control-removed",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Block execution.",
      "Restore the required control binding.",
      "Preserve the bypass attempt and actor identity.",
      "Initiate incident or disciplinary review where applicable.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-UNAUTHORIZED-EXCEPTION",
    laneId: "policy-controls",
    title: "Unauthorized policy exception",
    description:
      "An actor attempts to waive or bypass a policy requirement without valid exception authority, scope, time limit, or compensating control.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-UNAUTHORIZED-EXCEPTION-I01",
        title: "Revoke exception authority",
        description:
          "Invalidate the authority supporting the attempted exception.",
        mutationType: "REVOKE_AUTHORITY",
        target: "exceptionAuthority",
      },
    ],
    expectedGateStatuses: {
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Reject the exception.",
      "Preserve the attempted exception and basis.",
      "Escalate to valid authority if exceptional handling remains necessary.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-RUNTIME-POLICY-DRIFT",
    laneId: "policy-controls",
    title: "Runtime policy drift",
    description:
      "The policy or control configuration bound at execution differs from the version approved during review.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-RUNTIME-POLICY-DRIFT-I01",
        title: "Alter runtime policy version",
        description:
          "Change the runtime-bound policy version after review and before execution.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "runtimePolicyBinding",
        value: "unreviewed-policy-version",
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
      "Restore the reviewed policy-control binding or conduct a new review.",
      "Preserve the drift event.",
      "Replay before execution.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-INCORRECT-POLICY-VERSION",
    laneId: "policy-controls",
    title: "Incorrect policy version applied",
    description:
      "A valid but superseded policy version is applied to the current action.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-INCORRECT-POLICY-VERSION-I01",
        title: "Alter policy version",
        description:
          "Bind a superseded policy version to the current route.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "currentPolicyVersion",
        value: "superseded-version",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Bind the current approved version.",
      "Assess whether the superseded version materially changed the determination.",
      "Replay the route.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-ENFORCEMENT-FAILURE",
    laneId: "policy-controls",
    title: "Control enforcement failure",
    description:
      "The control evaluates correctly but fails to constrain execution at the declared enforcement point.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-ENFORCEMENT-FAILURE-I01",
        title: "Create execution mismatch",
        description:
          "Execute an action that the runtime control determined should be blocked.",
        mutationType: "CREATE_EXECUTION_MISMATCH",
        target: "executionReceipt",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Stop or reverse the action where possible.",
      "Preserve the control decision and execution mismatch.",
      "Repair and independently test the enforcement point.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-CONTROL-TEST-EXPIRED",
    laneId: "policy-controls",
    title: "Control test evidence expired",
    description:
      "The control remains deployed, but required operating-effectiveness test evidence is no longer current.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-CONTROL-TEST-EXPIRED-I01",
        title: "Expire control test evidence",
        description:
          "Expire the required current control test result.",
        mutationType: "EXPIRE_EVIDENCE",
        target: "CONTROL_TEST_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Retest the control.",
      "Verify operating effectiveness at the production enforcement point.",
      "Replay affected routes where required.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-OUTCOME-MISMATCH",
    laneId: "policy-controls",
    title: "Control objective not achieved",
    description:
      "The policy and control executed as recorded, but outcome evidence shows that the declared control objective was not achieved.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "POLICY-CONTROLS-OUTCOME-MISMATCH-I01",
        title: "Create outcome mismatch",
        description:
          "Provide evidence showing the governed outcome violated the declared control objective.",
        mutationType: "CREATE_OUTCOME_MISMATCH",
        target: "measuredOutcome",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "PASS",
      G10_EXECUTION_CONSTRAINT: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Separate procedural control execution from actual effectiveness.",
      "Reassess control design and thresholds.",
      "Issue remediation and replay requirements before continued reliance.",
    ],
  },
  {
    scenarioId: "POLICY-CONTROLS-RECOVERY-REPLAY",
    laneId: "policy-controls",
    title: "Corrected policy-control recovery and replay",
    description:
      "A prior policy or control failure is corrected, preserved, independently validated, and replayed before the route is restored.",
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
      "Link remediation and test evidence to the failed route.",
      "Issue a new replay result rather than altering the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type PolicyControlsScenario =
  (typeof POLICY_CONTROLS_SCENARIOS)[number];

export const POLICY_CONTROLS_LANE = {
  laneId: "policy-controls",
  name: "Policy & Controls Governance Playground",
  shortName: "Policy & Controls",
  description:
    "Test whether authoritative policies are current, scoped, versioned, bound to implemented controls, effective at runtime, protected from bypass, constrained through exceptions, preserved through execution, and continuously replayable.",
  claimsGoverned: [
    "The exact policy-governed system, decision, action, environment, owner, and control surface are identified.",
    "The applicable policy is authoritative, approved, current, and in force at decision time.",
    "The exact policy version and hierarchy are preserved.",
    "Mandatory controls are identified, owned, implemented, and bound to declared enforcement points.",
    "Control dependencies are available and their failure behavior is defined.",
    "Controls are tested and supported by current operating-effectiveness evidence.",
    "Runtime execution cannot silently bypass or replace required controls.",
    "Exceptions and waivers require valid authority, narrow scope, time limits, compensating controls, and preserved review.",
    "Policy or control changes invalidate continuing reliance until the changed route is reviewed and replayed.",
    "Runtime policy and control bindings are linked to execution and outcome evidence.",
  ],
  nonClaims: [
    "This lane does not claim that the existence of a policy proves legal compliance.",
    "This lane does not guarantee that controls eliminate every risk.",
    "This lane does not treat written procedures as implemented controls without implementation and test evidence.",
    "This lane does not validate unauthorized exceptions merely because they were operationally convenient.",
    "An ALLOW determination applies only to the exact policy version, control implementation, configuration, dependencies, authority, scope, and validity window preserved.",
  ],
  sections: POLICY_CONTROLS_SECTIONS,
  gateIds: POLICY_CONTROLS_GATE_IDS,
  evidenceTypes: [...POLICY_CONTROLS_EVIDENCE_TYPES],
  scenarioIds: POLICY_CONTROLS_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when mandatory controls are missing, bypassed, unenforced, or overridden without authority, or when execution contradicts a control determination.",
    "ESCALATE when authoritative policies conflict, exceptional conditions exceed declared authority, or unresolved consequences require superior independent review.",
    "HOLD when policy authority, version, scope, approval, test evidence, dependencies, exceptions, runtime binding, records, or replay requirements are incomplete, expired, or drifted.",
    "ALLOW only when all applicable policy-control gates pass and required scenarios demonstrate authoritative policy, effective control binding, enforceable runtime constraint, preserved evidence, and continuing validity.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getPolicyControlsScenario(
  scenarioId: string,
): PolicyControlsScenario | undefined {
  return POLICY_CONTROLS_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
