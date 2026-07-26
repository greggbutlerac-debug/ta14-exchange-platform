import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Risk Management Governance Playground
 *
 * Tests whether risks are identified from preserved evidence, assigned to
 * accountable owners, evaluated against explicit criteria, reduced through
 * enforceable controls, constrained before execution, and continuously replayed.
 */

export const RISK_MANAGEMENT_GATE_IDS = [
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

export const RISK_MANAGEMENT_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "RISK_ROUTE_IDENTITY",
  "RISK_SCOPE_RECORD",
  "RISK_TAXONOMY_RECORD",
  "HAZARD_RECORD",
  "THREAT_RECORD",
  "VULNERABILITY_RECORD",
  "IMPACT_RECORD",
  "LIKELIHOOD_RECORD",
  "RISK_SCORE_RECORD",
  "RISK_CRITERIA_RECORD",
  "RISK_OWNER_RECORD",
  "RISK_APPETITE_RECORD",
  "RISK_TOLERANCE_RECORD",
  "CONTROL_MAPPING_RECORD",
  "CONTROL_TEST_RECORD",
  "RESIDUAL_RISK_RECORD",
  "RISK_ACCEPTANCE_RECORD",
  "RISK_TREATMENT_RECORD",
  "DEPENDENCY_RISK_RECORD",
  "HUMAN_OVERSIGHT_RECORD",
  "ESCALATION_RECORD",
  "INCIDENT_RECORD",
  "MONITORING_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "REMEDIATION_RECORD",
  "REPLAY_RESULT",
] as const;

export type RiskManagementEvidenceType =
  (typeof RISK_MANAGEMENT_EVIDENCE_TYPES)[number];

export const RISK_MANAGEMENT_SECTIONS = [
  {
    sectionId: "risk-route-identity",
    title: "Risk Route Identity",
    description:
      "Identify the exact system, decision, action, environment, owner, affected parties, and consequence surface being assessed.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Risk route title",
        type: "text",
        required: true,
        placeholder: "Risk assessment for autonomous payment execution",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Risk route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the system, decision or action, deployment context, affected parties, and why risk governance is required.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "riskRouteIdentifier",
        label: "Stable risk route identifier",
        type: "text",
        required: true,
        placeholder: "risk:payments:2026-00312",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "subjectSystem",
        label: "System or process under risk assessment",
        type: "text",
        required: true,
        placeholder: "Autonomous Accounts Payable Service",
        validation: { minLength: 2, maxLength: 300 },
      },
      {
        key: "subjectDecisionOrAction",
        label: "Decision or action under assessment",
        type: "textarea",
        required: true,
        placeholder:
          "Approve, hold, deny, or escalate a vendor payment before commitment.",
        validation: { minLength: 10, maxLength: 3000 },
      },
      {
        key: "riskOwner",
        label: "Primary risk owner",
        type: "text",
        required: true,
        placeholder: "Finance Risk Officer",
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
          '[{"partyId":"vendor-219","impact":"payment delay or loss"},{"partyId":"organization-1","impact":"financial and compliance exposure"}]',
      },
      {
        key: "assessmentTimestamp",
        label: "Assessment timestamp",
        type: "text",
        required: true,
        placeholder: "2026-07-26T18:30:00Z",
        validation: { minLength: 10, maxLength: 100 },
      },
    ],
  },
  {
    sectionId: "claim-scope-context",
    title: "Risk Claim, Scope, and Context",
    description:
      "State the exact risk-governance claim, assessment boundary, operational context, assumptions, exclusions, and permitted determinations.",
    order: 20,
    fields: [
      {
        key: "governanceClaim",
        label: "Risk governance claim",
        type: "textarea",
        required: true,
        placeholder:
          "This route determines whether identified risks are sufficiently evidenced, owned, controlled, and constrained before execution.",
        validation: { minLength: 20, maxLength: 4000 },
      },
      {
        key: "riskQuestion",
        label: "Risk question",
        type: "textarea",
        required: true,
        placeholder:
          "Are the material risks of this exact action within approved appetite and tolerance after verified controls are applied?",
        validation: { minLength: 10, maxLength: 2000 },
      },
      {
        key: "inScope",
        label: "In-scope risks",
        type: "textarea",
        required: true,
        placeholder:
          "Identify included systems, decisions, actors, hazards, threats, vulnerabilities, impacts, dependencies, time periods, and jurisdictions.",
        validation: { minLength: 10, maxLength: 5000 },
      },
      {
        key: "outOfScope",
        label: "Out-of-scope risks",
        type: "textarea",
        required: true,
        placeholder:
          "Identify excluded systems, actors, risk classes, periods, geographies, and conclusions.",
        validation: { minLength: 10, maxLength: 5000 },
      },
      {
        key: "operationalContext",
        label: "Operational context",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the business purpose, users, environment, dependencies, consequence severity, and expected operating conditions.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "assessmentAssumptions",
        label: "Assessment assumptions",
        type: "json",
        required: true,
        placeholder:
          '["identity service available","authority registry current","payment limits unchanged","vendor data authentic"]',
      },
      {
        key: "riskTaxonomy",
        label: "Risk taxonomy",
        type: "json",
        required: true,
        placeholder:
          '["financial","operational","legal","compliance","security","privacy","safety","reputational","model","third-party"]',
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
    ],
  },
  {
    sectionId: "identification-analysis",
    title: "Risk Identification and Analysis",
    description:
      "Identify hazards, threats, vulnerabilities, failure modes, affected assets, consequences, likelihood, severity, and uncertainty from preserved evidence.",
    order: 30,
    fields: [
      {
        key: "riskRegister",
        label: "Risk register",
        type: "json",
        required: true,
        placeholder:
          '[{"riskId":"R-001","event":"unauthorized payment","cause":"invalid authority accepted","impact":"financial loss","owner":"finance-risk"}]',
      },
      {
        key: "hazards",
        label: "Hazards and harmful conditions",
        type: "json",
        required: true,
        placeholder:
          '[{"hazardId":"H-001","condition":"payment released to unverified beneficiary"}]',
      },
      {
        key: "threats",
        label: "Threats",
        type: "json",
        required: true,
        placeholder:
          '[{"threatId":"T-001","actor":"external fraudster","capability":"beneficiary substitution"}]',
      },
      {
        key: "vulnerabilities",
        label: "Vulnerabilities",
        type: "json",
        required: true,
        placeholder:
          '[{"vulnerabilityId":"V-001","condition":"beneficiary change lacks independent verification"}]',
      },
      {
        key: "failureModes",
        label: "Failure modes",
        type: "json",
        required: true,
        placeholder:
          '["false approval","missed HOLD","control bypass","stale authority","execution mismatch","unreported incident"]',
      },
      {
        key: "impactAssessment",
        label: "Impact assessment",
        type: "json",
        required: true,
        placeholder:
          '[{"riskId":"R-001","financial":"high","operational":"medium","legal":"high","affectedParties":["organization","vendor"]}]',
      },
      {
        key: "likelihoodAssessment",
        label: "Likelihood assessment",
        type: "json",
        required: true,
        placeholder:
          '[{"riskId":"R-001","likelihood":"possible","basis":"historical incidents and control weakness"}]',
      },
      {
        key: "uncertaintyAssessment",
        label: "Uncertainty assessment",
        type: "textarea",
        required: true,
        placeholder:
          "Describe missing data, model uncertainty, unknown dependencies, disputed assumptions, and confidence limits.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "riskInterdependencies",
        label: "Risk interdependencies",
        type: "json",
        required: true,
        placeholder:
          '[{"riskId":"R-001","dependsOn":["identity risk","vendor-master risk","bank-validation risk"]}]',
      },
    ],
  },
  {
    sectionId: "criteria-appetite-tolerance",
    title: "Risk Criteria, Appetite, and Tolerance",
    description:
      "Define the approved risk criteria, scoring method, appetite, tolerance, prohibited conditions, and authority required to accept residual risk.",
    order: 40,
    fields: [
      {
        key: "riskCriteria",
        label: "Risk criteria",
        type: "json",
        required: true,
        placeholder:
          '{"likelihoodScale":["rare","unlikely","possible","likely","almost certain"],"impactScale":["low","moderate","high","severe","critical"]}',
      },
      {
        key: "scoringMethod",
        label: "Risk scoring method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe calculation, qualitative overrides, uncertainty treatment, aggregation, and prohibited score manipulation.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "riskAppetite",
        label: "Approved risk appetite",
        type: "json",
        required: true,
        placeholder:
          '[{"riskClass":"financial fraud","appetite":"very low"},{"riskClass":"service delay","appetite":"moderate"}]',
      },
      {
        key: "riskTolerance",
        label: "Risk tolerance thresholds",
        type: "json",
        required: true,
        placeholder:
          '[{"riskClass":"financial fraud","maximumResidualRisk":"low"},{"riskClass":"service delay","maximumResidualRisk":"medium"}]',
      },
      {
        key: "prohibitedConditions",
        label: "Prohibited risk conditions",
        type: "json",
        required: true,
        placeholder:
          '["unverified beneficiary","invalid payment authority","control bypass","unknown execution destination","unbounded critical impact"]',
      },
      {
        key: "riskAcceptanceAuthority",
        label: "Risk acceptance authority",
        type: "json",
        required: true,
        placeholder:
          '[{"riskLevel":"low","role":"risk owner"},{"riskLevel":"medium","role":"business executive"},{"riskLevel":"high","role":"executive risk committee"}]',
      },
      {
        key: "aggregationRules",
        label: "Risk aggregation rules",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how individually acceptable risks may become unacceptable in aggregate or through correlated dependencies.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "criteriaChangeControl",
        label: "Risk-criteria change control",
        type: "textarea",
        required: true,
        placeholder:
          "Describe authority, approval, versioning, notice, effective date, migration, and replay requirements for changed criteria.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "treatment-controls-residual-risk",
    title: "Risk Treatment, Controls, and Residual Risk",
    description:
      "Map each material risk to treatment, enforceable controls, control owners, test evidence, residual risk, and required acceptance authority.",
    order: 50,
    fields: [
      {
        key: "treatmentPlan",
        label: "Risk treatment plan",
        type: "json",
        required: true,
        placeholder:
          '[{"riskId":"R-001","strategy":"reduce","actions":["verify beneficiary","require dual approval","block changed bank details"]}]',
      },
      {
        key: "controlMappings",
        label: "Risk-to-control mappings",
        type: "json",
        required: true,
        placeholder:
          '[{"riskId":"R-001","controls":["CTRL-BEN-01","CTRL-AUTH-02","CTRL-DUAL-03"]}]',
      },
      {
        key: "controlOwners",
        label: "Control owners",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-BEN-01","owner":"vendor-master-team"},{"controlId":"CTRL-AUTH-02","owner":"finance-controls"}]',
      },
      {
        key: "controlTestEvidence",
        label: "Control test evidence",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-BEN-01","result":"pass","testedAt":"2026-07-25T10:00:00Z"}]',
      },
      {
        key: "inherentRisk",
        label: "Inherent risk",
        type: "json",
        required: true,
        placeholder:
          '[{"riskId":"R-001","rating":"critical","basis":"high impact and likely exploitation without controls"}]',
      },
      {
        key: "residualRisk",
        label: "Residual risk",
        type: "json",
        required: true,
        placeholder:
          '[{"riskId":"R-001","rating":"low","basis":"preventive controls tested and enforced"}]',
      },
      {
        key: "riskAcceptanceRecords",
        label: "Risk acceptance records",
        type: "json",
        required: true,
        placeholder:
          '[{"riskId":"R-001","acceptedBy":"finance-risk-officer","authority":"low residual risk","expiresAt":"2026-10-31T23:59:59Z"}]',
      },
      {
        key: "controlFailureBehavior",
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
        key: "treatmentCompletionCriteria",
        label: "Treatment completion criteria",
        type: "textarea",
        required: true,
        placeholder:
          "Describe evidence required to show treatment was implemented, tested, effective, and bound before execution.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "monitoring-escalation-change",
    title: "Monitoring, Escalation, and Risk Change",
    description:
      "Define monitoring signals, key risk indicators, escalation thresholds, incident linkage, and how material changes invalidate prior risk determinations.",
    order: 60,
    fields: [
      {
        key: "monitoringPlan",
        label: "Risk monitoring plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe continuous monitoring, sampling, reassessment frequency, owner review, and escalation.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "keyRiskIndicators",
        label: "Key risk indicators",
        type: "json",
        required: true,
        placeholder:
          '[{"indicator":"beneficiary change rate","threshold":"greater than 2% weekly"},{"indicator":"authority failure rate","threshold":"greater than 0"}]',
      },
      {
        key: "warningThresholds",
        label: "Warning thresholds",
        type: "json",
        required: true,
        placeholder:
          '[{"condition":"control latency degradation","response":"HOLD"},{"condition":"critical dependency unavailable","response":"DENY"}]',
      },
      {
        key: "escalationConditions",
        label: "Escalation conditions",
        type: "json",
        required: true,
        placeholder:
          '["risk exceeds tolerance","critical uncertainty","conflicting risk evidence","control failure","incident","unapproved scope change"]',
      },
      {
        key: "escalationPath",
        label: "Escalation path",
        type: "json",
        required: true,
        placeholder:
          '[{"level":1,"role":"risk owner"},{"level":2,"role":"business executive"},{"level":3,"role":"enterprise risk committee"}]',
      },
      {
        key: "incidentLinkage",
        label: "Incident linkage requirements",
        type: "json",
        required: true,
        placeholder:
          '["link incident to risk record","reassess likelihood","reassess impact","test controls","review acceptance","require replay"]',
      },
      {
        key: "changeTriggers",
        label: "Material change triggers",
        type: "json",
        required: true,
        placeholder:
          '["model change","data change","tool change","policy change","jurisdiction change","dependency change","new threat","new incident","control degradation"]',
      },
      {
        key: "changeBehavior",
        label: "Behavior after material change",
        type: "select",
        required: true,
        options: [
          { value: "hold-until-reassessed", label: "HOLD until reassessed" },
          { value: "deny", label: "DENY" },
          { value: "limited-mode", label: "Operate only within unchanged scope" },
          { value: "escalate", label: "ESCALATE" },
        ],
      },
    ],
  },
  {
    sectionId: "runtime-records-outcome-replay",
    title: "Runtime Risk, Records, Outcomes, and Replay",
    description:
      "Preserve the exact risk assessment and controls bound to execution, compare actual outcome to expected risk, and revalidate continuing admissibility.",
    order: 70,
    fields: [
      {
        key: "runtimeRiskBinding",
        label: "Runtime risk binding",
        type: "json",
        required: true,
        placeholder:
          '{"routeId":"risk:payments:2026-00312","riskIds":["R-001","R-002"],"boundAt":"2026-07-26T18:40:00Z","bindingHash":"sha256:..."}',
      },
      {
        key: "runtimeControlBinding",
        label: "Runtime control binding",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-BEN-01","status":"active"},{"controlId":"CTRL-AUTH-02","status":"active"}]',
      },
      {
        key: "requiredRecords",
        label: "Required preserved records",
        type: "json",
        required: true,
        placeholder:
          '["RISK_SCOPE_RECORD","RISK_SCORE_RECORD","RISK_OWNER_RECORD","CONTROL_MAPPING_RECORD","CONTROL_TEST_RECORD","RESIDUAL_RISK_RECORD","RISK_ACCEPTANCE_RECORD","EXECUTION_RECEIPT","REPLAY_RESULT"]',
      },
      {
        key: "recordIntegrityMethod",
        label: "Record integrity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe attribution, timestamps, signatures, hashes, append-only preservation, corrections, retention, and access control.",
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
            ruleId: "RISK-MANAGEMENT-EXECUTION-01",
            description: "Required when execution has occurred.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"exec-312","riskBinding":"sha256:...","controlsApplied":["CTRL-BEN-01","CTRL-AUTH-02"],"status":"completed"}',
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
            ruleId: "RISK-MANAGEMENT-OUTCOME-01",
            description: "Required when outcome evidence is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe the actual outcome, realized risk, near misses, control effectiveness, and whether residual-risk assumptions remained valid.",
        validation: { maxLength: 5000 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["risk owner change","criteria change","appetite change","control change","dependency change","new threat","incident","execution mismatch","outcome mismatch"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how scope, evidence, risk criteria, controls, residual risk, acceptance authority, execution, incidents, and outcomes are revalidated.",
        validation: { minLength: 20, maxLength: 6000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const RISK_MANAGEMENT_SCENARIOS = [
  {
    scenarioId: "RISK-MANAGEMENT-BASELINE-ALLOW",
    laneId: "risk-management",
    title: "Risk-managed execution baseline",
    description:
      "Material risks are identified, supported, owned, treated, tested, within tolerance, accepted by valid authority, and bound to execution.",
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
    scenarioId: "RISK-MANAGEMENT-MISSING-MATERIAL-RISK",
    laneId: "risk-management",
    title: "Material risk omitted",
    description:
      "A foreseeable material risk is absent from the risk register and control mapping.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-MISSING-MATERIAL-RISK-I01",
        title: "Remove risk evidence",
        description:
          "Remove a material risk record from the assessment package.",
        mutationType: "REMOVE_EVIDENCE",
        target: "RISK_SCORE_RECORD",
      },
    ],
    expectedGateStatuses: {
      G02_GOVERNANCE_CLAIM: "FAIL",
      G03_SCOPE_BOUNDARY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Add the omitted material risk.",
      "Assess likelihood, impact, controls, and residual risk.",
      "Repeat authorization and replay.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-INVALID-RISK-OWNER",
    laneId: "risk-management",
    title: "Risk owner lacks authority",
    description:
      "The assigned risk owner is identifiable but lacks authority for the declared risk class or acceptance level.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-INVALID-RISK-OWNER-I01",
        title: "Revoke risk-owner authority",
        description:
          "Invalidate the authority assigned to the risk owner.",
        mutationType: "REVOKE_AUTHORITY",
        target: "riskAcceptanceAuthority",
      },
    ],
    expectedGateStatuses: {
      G04_ACTOR_IDENTITY: "PASS",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Assign a valid risk owner or acceptance authority.",
      "Preserve the invalid assignment.",
      "Repeat risk acceptance.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-RISK-EXCEEDS-TOLERANCE",
    laneId: "risk-management",
    title: "Residual risk exceeds tolerance",
    description:
      "Residual risk remains above the approved tolerance after declared controls are applied.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-RISK-EXCEEDS-TOLERANCE-I01",
        title: "Increase residual risk",
        description:
          "Alter the residual-risk assessment above the approved tolerance.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "residualRisk",
        value: "above-approved-tolerance",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Reduce the residual risk or narrow the execution scope.",
      "Obtain superior authority only where acceptance is legally and organizationally permitted.",
      "Replay before execution.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-UNAUTHORIZED-RISK-ACCEPTANCE",
    laneId: "risk-management",
    title: "Unauthorized risk acceptance",
    description:
      "An actor accepts residual risk beyond their delegated authority.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-UNAUTHORIZED-RISK-ACCEPTANCE-I01",
        title: "Revoke acceptance authority",
        description:
          "Invalidate the authority supporting the risk acceptance.",
        mutationType: "REVOKE_AUTHORITY",
        target: "riskAcceptanceRecords",
      },
    ],
    expectedGateStatuses: {
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Reject the unauthorized acceptance.",
      "Preserve the attempted acceptance and actor identity.",
      "Route the decision to valid authority.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-CONTROL-EVIDENCE-MISSING",
    laneId: "risk-management",
    title: "Control test evidence missing",
    description:
      "Risk treatment relies on a mandatory control without current evidence that the control is operating effectively.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-CONTROL-EVIDENCE-MISSING-I01",
        title: "Remove control test evidence",
        description:
          "Remove current test evidence for a risk-reducing control.",
        mutationType: "REMOVE_EVIDENCE",
        target: "CONTROL_TEST_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Test the control at the actual enforcement point.",
      "Recalculate residual risk.",
      "Repeat acceptance and replay.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-CONFLICTING-RISK-EVIDENCE",
    laneId: "risk-management",
    title: "Conflicting risk evidence",
    description:
      "Material evidence supports incompatible likelihood, impact, or residual-risk determinations.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-CONFLICTING-RISK-EVIDENCE-I01",
        title: "Create risk evidence conflict",
        description:
          "Introduce conflicting evidence for the same material risk.",
        mutationType: "CREATE_EVIDENCE_CONFLICT",
        target: "riskRegister",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Preserve both evidence positions.",
      "Obtain independent review.",
      "Resolve or bound the conflict before execution.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-CRITERIA-CHANGED",
    laneId: "risk-management",
    title: "Risk criteria changed after review",
    description:
      "Risk scoring criteria, appetite, or tolerance changes after approval and before execution.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-CRITERIA-CHANGED-I01",
        title: "Alter risk criteria",
        description:
          "Replace the approved risk criteria after review.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "riskCriteria",
        value: "unreviewed-risk-criteria",
      },
    ],
    expectedGateStatuses: {
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Recalculate inherent and residual risk under the current criteria.",
      "Repeat risk acceptance.",
      "Replay before execution.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-DEPENDENCY-FAILURE",
    laneId: "risk-management",
    title: "Critical dependency risk realized",
    description:
      "A critical dependency becomes unavailable or untrusted, invalidating the risk treatment assumptions.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-DEPENDENCY-FAILURE-I01",
        title: "Alter dependency state",
        description:
          "Mark a critical risk-control dependency unavailable.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "riskInterdependencies",
        value: "critical-dependency-unavailable",
      },
    ],
    expectedGateStatuses: {
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Restore or replace the dependency.",
      "Reassess risk under the degraded state.",
      "Verify compensating controls and replay.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-EXECUTION-MISMATCH",
    laneId: "risk-management",
    title: "Execution exceeds approved risk boundary",
    description:
      "The action executes outside the scope, amount, destination, or condition used in the approved risk assessment.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-EXECUTION-MISMATCH-I01",
        title: "Create execution mismatch",
        description:
          "Execute outside the risk-approved boundary.",
        mutationType: "CREATE_EXECUTION_MISMATCH",
        target: "executionReceipt",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Stop or reverse execution where possible.",
      "Preserve the mismatch.",
      "Initiate incident review and reassess risk.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-OUTCOME-MISMATCH",
    laneId: "risk-management",
    title: "Outcome exceeds expected residual risk",
    description:
      "Outcome evidence shows greater harm, frequency, severity, or control failure than the accepted residual-risk determination.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-OUTCOME-MISMATCH-I01",
        title: "Create outcome mismatch",
        description:
          "Provide evidence that the realized outcome exceeded the accepted residual risk.",
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
      "Reassess likelihood, impact, and control effectiveness.",
      "Suspend reliance on the prior acceptance.",
      "Remediate and replay before continued execution.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-RISK-EVIDENCE-EXPIRED",
    laneId: "risk-management",
    title: "Risk evidence expired",
    description:
      "A required risk assessment, control test, or acceptance record has expired.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MANAGEMENT-RISK-EVIDENCE-EXPIRED-I01",
        title: "Expire risk evidence",
        description:
          "Expire a required risk acceptance or assessment record.",
        mutationType: "EXPIRE_EVIDENCE",
        target: "RISK_ACCEPTANCE_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Renew the assessment and acceptance.",
      "Verify current criteria and controls.",
      "Replay the route.",
    ],
  },
  {
    scenarioId: "RISK-MANAGEMENT-RECOVERY-REPLAY",
    laneId: "risk-management",
    title: "Corrected risk recovery and replay",
    description:
      "A prior risk-governance failure is corrected, preserved, independently reviewed, and replayed before restoration.",
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
      "Link remediation, reassessment, control tests, and acceptance to the failed route.",
      "Issue a new replay result rather than altering the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type RiskManagementScenario =
  (typeof RISK_MANAGEMENT_SCENARIOS)[number];

export const RISK_MANAGEMENT_LANE = {
  laneId: "risk-management",
  name: "Risk Management Governance Playground",
  shortName: "Risk Management",
  description:
    "Test whether material risks are identified, evidenced, owned, scored under approved criteria, reduced through verified controls, accepted by valid authority, constrained before execution, linked to outcomes, and continuously replayable.",
  claimsGoverned: [
    "The exact system, decision, action, environment, owner, and affected parties are identified.",
    "Material hazards, threats, vulnerabilities, failure modes, impacts, likelihoods, and uncertainties are preserved.",
    "Risk criteria, appetite, tolerance, prohibited conditions, and aggregation rules are explicit and approved.",
    "Each material risk has an accountable owner and enforceable treatment plan.",
    "Risk-reducing controls are implemented, tested, and bound to execution.",
    "Residual risk is supported by evidence and accepted only by valid authority.",
    "Execution cannot exceed the scope or conditions used in the risk determination.",
    "Material changes, incidents, dependency failures, new threats, or outcome mismatches invalidate continuing reliance until replay.",
    "Risk records, execution receipts, and outcome evidence remain attributable and challengeable.",
  ],
  nonClaims: [
    "This lane does not claim that all uncertainty can be eliminated.",
    "This lane does not prove that a numerical score is correct merely because a formula was applied.",
    "This lane does not permit risk acceptance to override prohibited legal, ethical, safety, or authority boundaries.",
    "This lane does not treat control existence as proof of operating effectiveness.",
    "An ALLOW determination applies only to the exact scope, evidence, criteria, controls, residual risk, acceptance authority, dependencies, and validity window preserved.",
  ],
  sections: RISK_MANAGEMENT_SECTIONS,
  gateIds: RISK_MANAGEMENT_GATE_IDS,
  evidenceTypes: [...RISK_MANAGEMENT_EVIDENCE_TYPES],
  scenarioIds: RISK_MANAGEMENT_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when execution exceeds an approved risk boundary, a prohibited condition exists, or residual risk is accepted without valid authority.",
    "ESCALATE when residual risk exceeds tolerance, material evidence conflicts, critical uncertainty remains unresolved, or superior risk authority is required.",
    "HOLD when risk scope, evidence, ownership, criteria, control tests, residual-risk calculations, acceptance records, dependencies, monitoring, or replay requirements are incomplete, expired, or drifted.",
    "ALLOW only when all applicable risk gates pass and required scenarios demonstrate evidenced risk identification, valid treatment, effective controls, authorized residual-risk acceptance, constrained execution, and continuing validity.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getRiskManagementScenario(
  scenarioId: string,
): RiskManagementScenario | undefined {
  return RISK_MANAGEMENT_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
