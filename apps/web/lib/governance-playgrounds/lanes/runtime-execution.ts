import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Runtime & Execution Governance Playground
 *
 * Reference implementation for every future governance-specific lane.
 *
 * This lane tests whether an approved route remains bounded, authorized,
 * evidenced, constrained, interruptible, and attributable during execution.
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
  "ACTOR_IDENTITY",
  "ROUTE_SUPPORTING_EVIDENCE",
  "AUTHORITY_SOURCE",
  "CONTROL_IMPLEMENTATION",
  "DEPENDENCY_IDENTITY",
  "OVERSIGHT_QUALIFICATION",
  "EXECUTION_CONTROL",
  "INTERVENTION_TEST",
  "RECORD_CONTINUITY",
  "OUTCOME_EVIDENCE",
  "REPLAY_RESULT",
  "TOOL_PERMISSION_RECORD",
  "RUNTIME_ENVIRONMENT_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_RECEIPT",
] as const;

export type RuntimeExecutionEvidenceType =
  (typeof RUNTIME_EXECUTION_EVIDENCE_TYPES)[number];

export const RUNTIME_EXECUTION_SECTIONS = [
  {
    sectionId: "route-identity",
    title: "Route Identity",
    description:
      "Identify the exact execution route, governed object, environment, and version being tested.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Route title",
        description: "A specific name for this execution route.",
        type: "text",
        required: true,
        placeholder: "Vendor payment approval and execution",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Route description",
        description:
          "Describe the action from initiation through execution and outcome.",
        type: "textarea",
        required: true,
        placeholder:
          "Describe what initiates the route, what decisions occur, who commits execution, and what result is expected.",
        validation: { minLength: 20, maxLength: 4000 },
      },
      {
        key: "governedObjectType",
        label: "Governed object type",
        type: "select",
        required: true,
        options: [
          { value: "agent-action", label: "Agent action" },
          { value: "api-call", label: "API call" },
          { value: "automated-decision", label: "Automated decision" },
          { value: "financial-transaction", label: "Financial transaction" },
          { value: "model-deployment", label: "Model deployment" },
          { value: "system-change", label: "System change" },
          { value: "workflow", label: "Workflow" },
          { value: "other", label: "Other consequential execution" },
        ],
      },
      {
        key: "governedObjectIdentifier",
        label: "Governed object identifier",
        description:
          "A stable identifier for the exact workflow, agent, service, deployment, transaction, or action.",
        type: "text",
        required: true,
        placeholder: "runtime-route:vendor-payment:v1",
        validation: { minLength: 3, maxLength: 240 },
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
          { value: "hybrid", label: "Hybrid or multi-environment" },
        ],
      },
      {
        key: "routeVersion",
        label: "Route version",
        type: "text",
        required: true,
        placeholder: "1.0.0",
        validation: { minLength: 1, maxLength: 80 },
      },
    ],
  },
  {
    sectionId: "claim-boundary",
    title: "Governance Claim and Boundary",
    description:
      "State what the runtime governance architecture claims to control and where that claim ends.",
    order: 20,
    fields: [
      {
        key: "governanceClaim",
        label: "Runtime governance claim",
        type: "textarea",
        required: true,
        placeholder:
          "This architecture constrains execution to approved actors, tools, authority, evidence, sequence, and limits.",
        validation: { minLength: 20, maxLength: 3000 },
      },
      {
        key: "claimedControlLayers",
        label: "Claimed runtime controls",
        type: "multiselect",
        required: true,
        options: [
          { value: "identity", label: "Identity" },
          { value: "authority", label: "Authority" },
          { value: "evidence", label: "Evidence" },
          { value: "tools", label: "Tools and APIs" },
          { value: "sequence", label: "Execution sequence" },
          { value: "limits", label: "Execution limits" },
          { value: "intervention", label: "Intervention and shutdown" },
          { value: "records", label: "Execution records" },
          { value: "outcomes", label: "Outcome correspondence" },
        ],
      },
      {
        key: "explicitNonClaims",
        label: "Explicit non-claims",
        description:
          "State what the architecture does not prove or control.",
        type: "textarea",
        required: true,
        placeholder:
          "This test does not prove legal compliance, model truthfulness, cybersecurity, or outcome causation unless separately tested.",
        validation: { minLength: 10, maxLength: 3000 },
      },
      {
        key: "inScope",
        label: "In scope",
        type: "textarea",
        required: true,
        placeholder:
          "Actors, systems, tools, actions, environments, time period, and jurisdictions included.",
        validation: { minLength: 10, maxLength: 3000 },
      },
      {
        key: "outOfScope",
        label: "Out of scope",
        type: "textarea",
        required: true,
        placeholder:
          "Excluded actors, systems, tools, actions, environments, time periods, and jurisdictions.",
        validation: { minLength: 10, maxLength: 3000 },
      },
      {
        key: "jurisdiction",
        label: "Jurisdiction or regulatory context",
        type: "text",
        required: true,
        placeholder: "United States - Florida",
        validation: { minLength: 2, maxLength: 240 },
      },
    ],
  },
  {
    sectionId: "actors-authority",
    title: "Actors and Authority",
    description:
      "Identify who initiates, evaluates, authorizes, commits, executes, supervises, and receives the result.",
    order: 30,
    fields: [
      {
        key: "actors",
        label: "Material actors",
        type: "json",
        required: true,
        placeholder:
          '[{"id":"actor-1","type":"human","role":"route owner"},{"id":"agent-1","type":"agent","role":"executor"}]',
      },
      {
        key: "responsibilityMap",
        label: "Responsibility map",
        type: "json",
        required: true,
        placeholder:
          '{"initiate":"actor-1","approve":"actor-2","commit":"service-1","execute":"agent-1"}',
      },
      {
        key: "authorityDeclarations",
        label: "Authority declarations",
        type: "json",
        required: true,
        placeholder:
          '[{"holder":"actor-2","scope":"Approve vendor payments up to 50000 USD","validUntil":"2026-12-31T23:59:59Z"}]',
      },
      {
        key: "commitAuthority",
        label: "Commit authority",
        description:
          "Identify the actor or service permitted to make execution binding.",
        type: "text",
        required: true,
        placeholder: "finance-controller-role",
        validation: { minLength: 2, maxLength: 240 },
      },
    ],
  },
  {
    sectionId: "evidence-controls",
    title: "Evidence and Control Binding",
    description:
      "Declare the evidence required at runtime and bind each governance requirement to an enforceable control.",
    order: 40,
    fields: [
      {
        key: "evidenceStatement",
        label: "Evidence sufficiency statement",
        type: "textarea",
        required: true,
        placeholder:
          "Identify the minimum evidence required before the route may proceed.",
        validation: { minLength: 20, maxLength: 4000 },
      },
      {
        key: "requiredRuntimeEvidence",
        label: "Required runtime evidence",
        type: "json",
        required: true,
        placeholder:
          '[{"type":"AUTHORITY_SOURCE","requiredAt":"commit"},{"type":"DEPENDENCY_IDENTITY","requiredAt":"execution"}]',
      },
      {
        key: "controlBindings",
        label: "Rule-to-control bindings",
        type: "json",
        required: true,
        placeholder:
          '[{"rule":"Payment requires finance authority","control":"commit gate rejects absent authority","failure":"HOLD"}]',
      },
      {
        key: "evidenceFreshnessRules",
        label: "Evidence freshness rules",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceType":"AUTHORITY_SOURCE","maximumAgeMinutes":60}]',
      },
    ],
  },
  {
    sectionId: "dependencies-tools",
    title: "Dependencies, Tools, and Permissions",
    description:
      "Identify every material model, dataset, tool, API, vendor, credential, service, and environment dependency.",
    order: 50,
    fields: [
      {
        key: "dependencies",
        label: "Material dependencies",
        type: "json",
        required: true,
        placeholder:
          '[{"id":"payments-api","type":"api","version":"2026-07","approved":true}]',
      },
      {
        key: "approvedTools",
        label: "Approved tools and APIs",
        type: "json",
        required: true,
        placeholder:
          '[{"tool":"payments-api","actions":["validate-beneficiary","submit-payment"]}]',
      },
      {
        key: "prohibitedTools",
        label: "Prohibited tools and actions",
        type: "json",
        required: true,
        placeholder:
          '[{"tool":"shell","reason":"No operating-system command authority"}]',
      },
      {
        key: "credentialBoundary",
        label: "Credential and permission boundary",
        type: "textarea",
        required: true,
        placeholder:
          "Describe which credentials exist, who controls them, and which exact actions they permit.",
        validation: { minLength: 20, maxLength: 4000 },
      },
      {
        key: "dependencyChangePolicy",
        label: "Dependency change policy",
        type: "textarea",
        required: true,
        placeholder:
          "State what changes invalidate prior approval and require replay.",
        validation: { minLength: 10, maxLength: 3000 },
      },
    ],
  },
  {
    sectionId: "execution-intervention",
    title: "Execution Constraints and Intervention",
    description:
      "Define the route sequence, binding limits, failure responses, escalation path, and recovery process.",
    order: 60,
    fields: [
      {
        key: "executionConstraints",
        label: "Execution constraints",
        type: "json",
        required: true,
        placeholder:
          '[{"constraint":"amount <= 50000","enforcementPoint":"commit","failure":"HOLD"}]',
      },
      {
        key: "requiredSequence",
        label: "Required execution sequence",
        type: "json",
        required: true,
        placeholder:
          '["identify","validate-evidence","validate-authority","bind-controls","commit","execute","record","verify-outcome"]',
      },
      {
        key: "holdConditions",
        label: "HOLD conditions",
        type: "json",
        required: true,
        placeholder:
          '["missing evidence","expired evidence","failed mandatory gate","material drift"]',
      },
      {
        key: "denyConditions",
        label: "DENY conditions",
        type: "json",
        required: true,
        placeholder:
          '["prohibited action","authority exceeded","explicit boundary violation"]',
      },
      {
        key: "escalationConditions",
        label: "ESCALATE conditions",
        type: "json",
        required: true,
        placeholder:
          '["conflicting authority","unresolved evidence conflict","required human judgment"]',
      },
      {
        key: "recoveryProcedure",
        label: "Recovery procedure",
        type: "textarea",
        required: true,
        placeholder:
          "Describe safe stop, rollback, evidence preservation, correction, reauthorization, and replay.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "humanOversightRequired",
        label: "Human oversight required",
        type: "boolean",
        required: true,
        defaultValue: true,
      },
      {
        key: "oversightActors",
        label: "Oversight actors",
        type: "json",
        required: true,
        appliesWhen: [
          {
            ruleId: "RUNTIME-OVERSIGHT-01",
            description: "Required when human oversight is enabled.",
            field: "humanOversightRequired",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '[{"actorId":"reviewer-1","qualification":"finance authority","independent":true}]',
      },
      {
        key: "interventionPowers",
        label: "Human intervention powers",
        type: "multiselect",
        required: true,
        appliesWhen: [
          {
            ruleId: "RUNTIME-OVERSIGHT-02",
            description: "Required when human oversight is enabled.",
            field: "humanOversightRequired",
            operator: "equals",
            expected: true,
          },
        ],
        options: [
          { value: "inspect", label: "Inspect evidence" },
          { value: "hold", label: "Place route on HOLD" },
          { value: "deny", label: "DENY execution" },
          { value: "modify", label: "Request correction" },
          { value: "stop", label: "Stop active execution" },
          { value: "rollback", label: "Initiate rollback" },
          { value: "escalate", label: "Escalate for independent review" },
        ],
      },
    ],
  },
  {
    sectionId: "records-outcomes-replay",
    title: "Records, Outcomes, and Replay",
    description:
      "Define the preserved record chain, expected outcome, validity period, and material replay triggers.",
    order: 70,
    fields: [
      {
        key: "recordPlan",
        label: "Record preservation plan",
        type: "json",
        required: true,
        placeholder:
          '["DECLARED_GOVERNANCE_CLAIM","TEST_CONFIGURATION","OBSERVED_TEST_RESULT","TA14_BOUNDED_DETERMINATION"]',
      },
      {
        key: "approvedIntention",
        label: "Approved intention",
        type: "textarea",
        required: true,
        placeholder: "State the exact approved action and intended result.",
        validation: { minLength: 10, maxLength: 3000 },
      },
      {
        key: "outcomeAvailable",
        label: "Outcome currently available",
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      {
        key: "executedAction",
        label: "Executed action",
        type: "textarea",
        required: false,
        appliesWhen: [
          {
            ruleId: "RUNTIME-OUTCOME-01",
            description: "Required after execution occurs.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder: "State what actually executed.",
        validation: { maxLength: 4000 },
      },
      {
        key: "measuredOutcome",
        label: "Measured outcome",
        type: "textarea",
        required: false,
        appliesWhen: [
          {
            ruleId: "RUNTIME-OUTCOME-02",
            description: "Required when an outcome is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder: "State the observed result and measurement method.",
        validation: { maxLength: 4000 },
      },
      {
        key: "validityWindow",
        label: "Determination validity window",
        type: "text",
        required: true,
        placeholder: "Until execution or 60 minutes, whichever occurs first",
        validation: { minLength: 3, maxLength: 500 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["authority change","evidence expiration","tool change","model change","data change","environment change","control change","execution mismatch"]',
      },
      {
        key: "driftMonitoringPlan",
        label: "Drift monitoring plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how runtime state is compared with the approved route before commit, during execution, and after outcome.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const RUNTIME_EXECUTION_SCENARIOS = [
  {
    scenarioId: "RUNTIME-BASELINE-ALLOW",
    laneId: "runtime-execution",
    title: "Approved baseline route",
    description:
      "All required evidence, authority, dependencies, controls, intervention capabilities, and records are present and current.",
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
    scenarioId: "RUNTIME-AUTHORITY-EXPIRES",
    laneId: "runtime-execution",
    title: "Authority expires before commit",
    description:
      "The route is approved, but the authorizing actor's authority expires before execution becomes binding.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-AUTHORITY-EXPIRES-I01",
        title: "Expire commit authority",
        description:
          "Set the commit authority validity end time before the commit event.",
        mutationType: "REVOKE_AUTHORITY",
        target: "commitAuthority",
      },
    ],
    expectedGateStatuses: {
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Obtain valid authority.",
      "Preserve the expired authority result.",
      "Replay the route before commit.",
    ],
  },
  {
    scenarioId: "RUNTIME-UNAPPROVED-TOOL",
    laneId: "runtime-execution",
    title: "Unapproved tool selected",
    description:
      "The executing model or agent attempts to use a tool or API that is not part of the approved route.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-UNAPPROVED-TOOL-I01",
        title: "Substitute unapproved tool",
        description:
          "Replace an approved dependency with a tool outside the declared permission boundary.",
        mutationType: "CHANGE_TOOL",
        target: "approvedTools",
        value: "unapproved-tool",
      },
    ],
    expectedGateStatuses: {
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Block the unapproved tool.",
      "Preserve the attempted action.",
      "Require a new route if the tool is necessary.",
    ],
  },
  {
    scenarioId: "RUNTIME-EVIDENCE-STALE",
    laneId: "runtime-execution",
    title: "Required evidence becomes stale",
    description:
      "Evidence was current at review but exceeds its freshness limit before commit.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EVIDENCE-STALE-I01",
        title: "Expire runtime evidence",
        description:
          "Advance time beyond the declared evidence freshness window.",
        mutationType: "EXPIRE_EVIDENCE",
        target: "requiredRuntimeEvidence",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Refresh or replace the stale evidence.",
      "Re-evaluate affected gates.",
      "Issue a new bounded determination.",
    ],
  },
  {
    scenarioId: "RUNTIME-EVIDENCE-CONFLICT",
    laneId: "runtime-execution",
    title: "Material evidence conflict",
    description:
      "Two current evidence sources materially disagree about a required execution condition.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EVIDENCE-CONFLICT-I01",
        title: "Create evidence conflict",
        description:
          "Introduce a second evidence item that contradicts the first on a material route fact.",
        mutationType: "CREATE_EVIDENCE_CONFLICT",
        target: "requiredRuntimeEvidence",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "ESCALATED",
      G12_RECORD_CONTINUITY: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Preserve both conflicting evidence items.",
      "Assign an authorized independent reviewer.",
      "Resolve or explicitly bound the conflict.",
    ],
  },
  {
    scenarioId: "RUNTIME-HUMAN-CANNOT-STOP",
    laneId: "runtime-execution",
    title: "Human reviewer cannot stop execution",
    description:
      "The route represents human oversight, but the reviewer lacks timely stop or HOLD capability.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-HUMAN-CANNOT-STOP-I01",
        title: "Remove intervention power",
        description:
          "Prevent the designated human reviewer from stopping or holding the route.",
        mutationType: "BLOCK_HUMAN_INTERVENTION",
        target: "interventionPowers",
      },
    ],
    expectedGateStatuses: {
      G09_HUMAN_OVERSIGHT: "FAIL",
      G11_INTERVENTION_ESCALATION: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Grant and test real stop authority.",
      "Verify that execution fails closed during reviewer unavailability.",
    ],
  },
  {
    scenarioId: "RUNTIME-ROUTE-EXCEEDS-LIMIT",
    laneId: "runtime-execution",
    title: "Execution exceeds an explicit limit",
    description:
      "The execution request exceeds a declared financial, operational, temporal, geographic, or action boundary.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-ROUTE-EXCEEDS-LIMIT-I01",
        title: "Exceed approved constraint",
        description:
          "Alter a route value so the requested execution exceeds an explicit approved limit.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "executionConstraints",
        value: "outside-approved-boundary",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Reduce the request to the approved limit or create a new route.",
      "Obtain authority appropriate to the expanded action.",
    ],
  },
  {
    scenarioId: "RUNTIME-EXECUTION-MISMATCH",
    laneId: "runtime-execution",
    title: "Executed action differs from approved route",
    description:
      "The route receives approval, but the execution receipt shows a materially different action.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-EXECUTION-MISMATCH-I01",
        title: "Create execution mismatch",
        description:
          "Change a material execution parameter after approval and before or during execution.",
        mutationType: "CREATE_EXECUTION_MISMATCH",
        target: "executedAction",
      },
    ],
    expectedGateStatuses: {
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Stop or reverse the mismatched execution where possible.",
      "Preserve the approved and actual execution records separately.",
      "Open an incident and correction route.",
    ],
  },
  {
    scenarioId: "RUNTIME-RECOVERY-REPLAY",
    laneId: "runtime-execution",
    title: "Corrected route recovery and replay",
    description:
      "A prior HOLD condition is corrected, preserved, and replayed without overwriting the original result.",
    scenarioClass: "RECOVERY",
    required: true,
    preconditions: [],
    injections: [],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "PASS",
      G06_AUTHORITY_VALIDITY: "PASS",
      G10_EXECUTION_CONSTRAINT: "PASS",
      G11_INTERVENTION_ESCALATION: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
      G14_REPLAY_CONTINUING_VALIDITY: "PASS",
    },
    expectedDetermination: "ALLOW",
    recoveryRequirements: [
      "Preserve the original failed or held result.",
      "Link the corrected route to the prior version.",
      "Issue a new determination rather than editing the old one.",
    ],
  },
  {
    scenarioId: "RUNTIME-OUTCOME-MISMATCH",
    laneId: "runtime-execution",
    title: "Outcome does not support the approved claim",
    description:
      "The approved action executes as configured, but the observed outcome does not support the claimed benefit or intended result.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RUNTIME-OUTCOME-MISMATCH-I01",
        title: "Create outcome mismatch",
        description:
          "Provide an outcome record that does not correspond to the approved intention or claimed benefit.",
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
      "Separate successful execution from successful outcome.",
      "Correct unsupported benefit claims.",
      "Determine whether intervention or redesign is required.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type RuntimeExecutionScenario =
  (typeof RUNTIME_EXECUTION_SCENARIOS)[number];

export const RUNTIME_EXECUTION_LANE = {
  laneId: "runtime-execution",
  name: "Runtime & Execution Governance Playground",
  shortName: "Runtime & Execution",
  description:
    "Test whether governance remains valid from approval through commit, execution, intervention, record preservation, outcome, and replay.",
  claimsGoverned: [
    "The route executes only within its declared identity and scope.",
    "Execution is supported by current evidence and valid authority.",
    "Only approved dependencies, tools, permissions, and sequence are used.",
    "Material failures produce bounded HOLD, DENY, or ESCALATE behavior.",
    "Required human oversight possesses real intervention capability.",
    "The approved route, actual execution, and measured outcome remain distinguishable and traceable.",
    "Material drift invalidates or holds prior authorization until replay.",
  ],
  nonClaims: [
    "This lane does not independently prove legal or regulatory compliance.",
    "This lane does not prove that a model output is true or unbiased.",
    "This lane does not prove cybersecurity, privacy, or data quality unless those controls are separately evidenced and tested.",
    "This lane does not prove outcome causation.",
    "An ALLOW determination applies only to the tested route, evidence, authority, dependencies, environment, time, and evaluator version.",
  ],
  sections: RUNTIME_EXECUTION_SECTIONS,
  gateIds: RUNTIME_EXECUTION_GATE_IDS,
  evidenceTypes: [...RUNTIME_EXECUTION_EVIDENCE_TYPES],
  scenarioIds: RUNTIME_EXECUTION_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when execution is prohibited, authority is exceeded, or an explicit route boundary would be violated.",
    "ESCALATE when material evidence or authority conflicts require independent judgment.",
    "HOLD when mandatory evidence, authority, testing, constraint, intervention, outcome, or replay requirements remain incomplete or failed.",
    "ALLOW only when all applicable mandatory gates pass and all required scenarios complete with expected bounded behavior.",
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
