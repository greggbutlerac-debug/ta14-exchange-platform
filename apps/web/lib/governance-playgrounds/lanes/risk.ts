import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Risk Governance Playground
 *
 * Governs whether a risk determination is identifiable, evidence-supported,
 * bounded, authority-backed, control-bound, independently reviewable,
 * execution-constrained, and continuously valid.
 *
 * Governing sequence:
 * Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit ->
 * Execution -> Outcome
 */

export const RISK_GATE_IDS = [
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

export const RISK_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "RISK_ROUTE_RECORD",
  "RISK_SUBJECT_RECORD",
  "ACTOR_IDENTITY_RECORD",
  "RISK_OWNER_RECORD",
  "THREAT_RECORD",
  "HAZARD_RECORD",
  "VULNERABILITY_RECORD",
  "EXPOSURE_RECORD",
  "IMPACT_RECORD",
  "LIKELIHOOD_RECORD",
  "RISK_MODEL_RECORD",
  "RISK_THRESHOLD_RECORD",
  "EVIDENCE_RECORD",
  "SOURCE_RECORD",
  "AUTHORITY_RECORD",
  "POLICY_RECORD",
  "RULE_RECORD",
  "CONTROL_RECORD",
  "DEPENDENCY_RECORD",
  "CONFLICT_RECORD",
  "HUMAN_REVIEW_RECORD",
  "RISK_TREATMENT_RECORD",
  "RESIDUAL_RISK_RECORD",
  "EXCEPTION_RECORD",
  "ESCALATION_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "INCIDENT_RECORD",
  "REMEDIATION_RECORD",
  "REPLAY_RESULT",
] as const;

export type RiskEvidenceType =
  (typeof RISK_EVIDENCE_TYPES)[number];

export const RISK_SECTIONS = [
  {
    sectionId: "risk-identity",
    title: "Risk Route Identity",
    description:
      "Identify the exact risk subject, owner, assessor, environment, route, version, assessment purpose, and validity period.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Risk route title",
        type: "text",
        required: true,
        placeholder: "Production risk assessment route",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Risk route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the risk subject, decision context, affected parties, consequences, and why governance is required.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "riskRouteIdentifier",
        label: "Stable risk route identifier",
        type: "text",
        required: true,
        placeholder: "risk:route:2026-001",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "riskIdentifier",
        label: "Risk identifier",
        type: "text",
        required: true,
        placeholder: "RISK-2026-001",
        validation: { minLength: 3, maxLength: 240 },
      },
      {
        key: "riskSubject",
        label: "Risk subject",
        type: "json",
        required: true,
        placeholder:
          '{"subjectId":"SUBJECT-001","type":"system","name":"Governed system"}',
      },
      {
        key: "riskOwner",
        label: "Risk owner",
        type: "json",
        required: true,
        placeholder:
          '{"ownerId":"OWNER-001","role":"risk owner","organization":"approved organization"}',
      },
      {
        key: "riskAssessor",
        label: "Risk assessor",
        type: "json",
        required: true,
        placeholder:
          '{"assessorId":"ASSESSOR-001","role":"authorized assessor","independent":true}',
      },
      {
        key: "riskEnvironment",
        label: "Risk environment",
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
        key: "assessmentDate",
        label: "Assessment date",
        type: "date",
        required: true,
      },
      {
        key: "validUntil",
        label: "Assessment validity end",
        type: "date",
        required: true,
      },
    ],
  },
  {
    sectionId: "risk-claim-scope",
    title: "Risk Claim, Scope, and Boundary",
    description:
      "Define the exact risk claim, assets, populations, threat and hazard boundaries, exclusions, assumptions, consequence categories, and prohibited extrapolations.",
    order: 20,
    fields: [
      {
        key: "riskClaim",
        label: "Risk claim",
        type: "textarea",
        required: true,
        placeholder:
          "State exactly what risk is being assessed and what the assessment is claimed to establish.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "claimBasis",
        label: "Claim basis",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the evidence, methods, thresholds, controls, assumptions, and authority supporting the risk claim.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "riskScope",
        label: "Risk scope",
        type: "json",
        required: true,
        placeholder:
          '{"assets":["approved asset"],"populations":["approved population"],"environments":["production"],"timeHorizon":"12 months"}',
      },
      {
        key: "outOfScope",
        label: "Out-of-scope conditions",
        type: "json",
        required: true,
        placeholder:
          '["unapproved environment","unassessed population","unknown third party","materially changed system"]',
      },
      {
        key: "assumptions",
        label: "Assessment assumptions",
        type: "json",
        required: true,
        placeholder:
          '[{"assumptionId":"ASM-001","description":"control remains active","status":"verified"}]',
      },
      {
        key: "consequenceCategories",
        label: "Consequence categories",
        type: "json",
        required: true,
        placeholder:
          '["safety","financial","legal","operational","privacy","security","reputational"]',
      },
      {
        key: "prohibitedExtrapolations",
        label: "Prohibited extrapolations",
        type: "json",
        required: true,
        placeholder:
          '["low average risk equals no subgroup risk","current risk equals future risk","control design equals control effectiveness"]',
      },
      {
        key: "riskCriticality",
        label: "Risk criticality",
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
    sectionId: "risk-evidence-model",
    title: "Threats, Hazards, Evidence, and Risk Model",
    description:
      "Establish threats, hazards, vulnerabilities, exposures, impacts, likelihoods, evidence, sources, model logic, thresholds, and uncertainty.",
    order: 30,
    fields: [
      {
        key: "threatInventory",
        label: "Threat inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"threatId":"THREAT-001","description":"unauthorized action","status":"active"}]',
      },
      {
        key: "hazardInventory",
        label: "Hazard inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"hazardId":"HAZ-001","description":"unsafe system state","status":"active"}]',
      },
      {
        key: "vulnerabilityInventory",
        label: "Vulnerability inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"vulnerabilityId":"VULN-001","description":"insufficient validation","status":"open"}]',
      },
      {
        key: "exposureInventory",
        label: "Exposure inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"exposureId":"EXP-001","asset":"approved asset","frequency":"daily","duration":"continuous"}]',
      },
      {
        key: "impactAssessment",
        label: "Impact assessment",
        type: "json",
        required: true,
        placeholder:
          '[{"impactId":"IMP-001","category":"operational","severity":"high","basis":"documented analysis"}]',
      },
      {
        key: "likelihoodAssessment",
        label: "Likelihood assessment",
        type: "json",
        required: true,
        placeholder:
          '[{"likelihoodId":"LIK-001","rating":"possible","frequency":"annual","basis":"historical and modeled evidence"}]',
      },
      {
        key: "evidenceInventory",
        label: "Risk evidence inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceId":"EV-001","type":"EVIDENCE_RECORD","supports":"risk condition","status":"current"}]',
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
        key: "riskModel",
        label: "Risk model",
        type: "json",
        required: true,
        placeholder:
          '{"modelId":"RISK-MODEL-001","version":"1.0.0","method":"likelihood-impact-control-effectiveness"}',
      },
      {
        key: "riskThresholds",
        label: "Risk thresholds",
        type: "json",
        required: true,
        placeholder:
          '{"allow":"low residual risk","hold":"material uncertainty","deny":"unacceptable risk","escalate":"conflicting high-impact evidence"}',
      },
      {
        key: "uncertaintyRecord",
        label: "Uncertainty record",
        type: "json",
        required: true,
        placeholder:
          '[{"uncertaintyId":"UNC-001","description":"limited incident history","materiality":"moderate","treatment":"conservative threshold"}]',
      },
    ],
  },
  {
    sectionId: "risk-authority-controls",
    title: "Authority, Policies, Controls, and Treatment",
    description:
      "Bind risk decisions to valid authority, policies, rules, controls, dependencies, treatment plans, residual risk, exceptions, and acceptance limits.",
    order: 40,
    fields: [
      {
        key: "authorityInventory",
        label: "Risk authority inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"authorityId":"AUTH-001","role":"risk approver","scope":"RISK-2026-001","status":"active"}]',
      },
      {
        key: "policyInventory",
        label: "Applicable policies",
        type: "json",
        required: true,
        placeholder:
          '[{"policyId":"POL-001","version":"1.0","scope":"risk route","status":"active"}]',
      },
      {
        key: "governingRules",
        label: "Governing risk rules",
        type: "json",
        required: true,
        placeholder:
          '[{"ruleId":"RULE-001","condition":"residual risk <= approved threshold","result":"eligible for acceptance"}]',
      },
      {
        key: "controlInventory",
        label: "Risk controls",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-001","objective":"reduce unauthorized execution risk","type":"preventive","status":"active"}]',
      },
      {
        key: "controlTesting",
        label: "Control effectiveness testing",
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
          '[{"dependencyId":"DEP-001","type":"monitoring service","critical":true,"status":"available"}]',
      },
      {
        key: "riskTreatmentPlan",
        label: "Risk treatment plan",
        type: "json",
        required: true,
        placeholder:
          '[{"treatmentId":"TRT-001","strategy":"mitigate","owner":"risk owner","dueDate":"2026-08-01","status":"complete"}]',
      },
      {
        key: "residualRisk",
        label: "Residual risk",
        type: "json",
        required: true,
        placeholder:
          '{"rating":"low","basis":"controls tested effective","acceptedBy":"authorized risk owner"}',
      },
      {
        key: "exceptionPolicy",
        label: "Risk exception policy",
        type: "textarea",
        required: true,
        placeholder:
          "Describe who may approve a risk exception, maximum scope and duration, compensating controls, monitoring, revocation, and replay requirements.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "unacceptableRiskBehavior",
        label: "Unacceptable risk behavior",
        type: "select",
        required: true,
        options: [
          { value: "deny", label: "DENY" },
          { value: "hold", label: "HOLD" },
          { value: "escalate", label: "ESCALATE" },
          { value: "fail-closed", label: "Fail closed" },
        ],
      },
    ],
  },
  {
    sectionId: "risk-review-acceptance",
    title: "Review, Acceptance, and Commit",
    description:
      "Define reviewer competence, independence, challenge, risk acceptance authority, rationale, conditions, commit authority, and execution constraints.",
    order: 50,
    fields: [
      {
        key: "reviewerIdentity",
        label: "Risk reviewer identity",
        type: "json",
        required: true,
        placeholder:
          '[{"reviewerId":"REV-001","role":"independent risk reviewer","organization":"approved review function"}]',
      },
      {
        key: "reviewerCompetence",
        label: "Reviewer competence",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"independent risk reviewer","requirements":["domain expertise","risk methodology","control evaluation","governance authority"]}]',
      },
      {
        key: "independenceControls",
        label: "Independence controls",
        type: "json",
        required: true,
        placeholder:
          '["separation from risk owner","conflict disclosure","independent challenge","protected escalation"]',
      },
      {
        key: "riskDeterminationRationale",
        label: "Risk determination rationale",
        type: "textarea",
        required: true,
        placeholder:
          "Explain why the evidence, risk model, thresholds, controls, treatment, residual risk, and authority support ALLOW, HOLD, DENY, or ESCALATE.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "riskAcceptanceAuthority",
        label: "Risk acceptance authority",
        type: "json",
        required: true,
        placeholder:
          '[{"authorityId":"AUTH-ACCEPT-001","role":"risk acceptance authority","maximumRating":"moderate","status":"active"}]',
      },
      {
        key: "acceptanceConditions",
        label: "Risk acceptance conditions",
        type: "json",
        required: true,
        placeholder:
          '["controls active","residual risk within threshold","monitoring enabled","no material change","validity window open"]',
      },
      {
        key: "commitAuthority",
        label: "Risk commit authority",
        type: "json",
        required: true,
        placeholder:
          '[{"authorityId":"AUTH-COMMIT-001","role":"risk committer","scope":"approved route only","status":"active"}]',
      },
      {
        key: "executionConstraints",
        label: "Execution constraints",
        type: "json",
        required: true,
        placeholder:
          '{"scopeExpansion":false,"monitoringRequired":true,"maximumResidualRisk":"moderate","validityWindow":"approved window"}',
      },
      {
        key: "humanOversightModel",
        label: "Human oversight model",
        type: "textarea",
        required: true,
        placeholder:
          "Describe when human review, challenge, intervention, stop authority, escalation, and post-decision review are required.",
        validation: { minLength: 20, maxLength: 6000 },
      },
    ],
  },
  {
    sectionId: "risk-monitoring-incidents",
    title: "Monitoring, Drift, Incidents, and Remediation",
    description:
      "Define risk indicators, drift, incidents, treatment failure, escalation, suspension, reassessment, remediation, and restoration.",
    order: 60,
    fields: [
      {
        key: "riskMonitoringPlan",
        label: "Risk monitoring plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe monitoring of threats, hazards, vulnerabilities, exposure, impacts, likelihoods, controls, residual risk, dependencies, incidents, and outcomes.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "keyRiskIndicators",
        label: "Key risk indicators",
        type: "json",
        required: true,
        placeholder:
          '[{"indicatorId":"KRI-001","signal":"control failure rate","threshold":">1%","frequency":"daily"}]',
      },
      {
        key: "driftTriggers",
        label: "Risk drift triggers",
        type: "json",
        required: true,
        placeholder:
          '["new threat","new hazard","vulnerability change","exposure increase","impact change","likelihood change","control degradation","dependency change"]',
      },
      {
        key: "incidentTriggers",
        label: "Risk incident triggers",
        type: "json",
        required: true,
        placeholder:
          '["control failure","unapproved residual risk","unexpected harm","unauthorized execution","record discontinuity","blocked intervention"]',
      },
      {
        key: "suspensionTriggers",
        label: "Suspension triggers",
        type: "json",
        required: true,
        placeholder:
          '["risk threshold exceeded","authority invalid","critical evidence loss","material conflict","treatment failure","critical incident"]',
      },
      {
        key: "escalationPath",
        label: "Escalation path",
        type: "json",
        required: true,
        placeholder:
          '[{"level":1,"role":"risk owner"},{"level":2,"role":"governance authority"},{"level":3,"role":"executive or legal authority"}]',
      },
      {
        key: "reassessmentRequirements",
        label: "Risk reassessment requirements",
        type: "json",
        required: true,
        placeholder:
          '["updated evidence","recalculated likelihood and impact","control retest","residual risk update","independent review","new acceptance"]',
      },
      {
        key: "remediationProcess",
        label: "Risk remediation process",
        type: "textarea",
        required: true,
        placeholder:
          "Describe containment, evidence preservation, impact assessment, treatment correction, control retesting, reassessment, reacceptance, replay, and restoration.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "restorationConditions",
        label: "Restoration conditions",
        type: "json",
        required: true,
        placeholder:
          '["root cause corrected","controls effective","residual risk within threshold","authority valid","independent verification complete","replay passes"]',
      },
    ],
  },
  {
    sectionId: "risk-records-outcomes",
    title: "Risk Records, Execution, Outcomes, and Replay",
    description:
      "Preserve the risk claim, evidence, model, review, treatment, residual risk, acceptance, execution, outcomes, incidents, remediation, and replay.",
    order: 70,
    fields: [
      {
        key: "requiredRecords",
        label: "Required preserved records",
        type: "json",
        required: true,
        placeholder:
          '["RISK_ROUTE_RECORD","RISK_SUBJECT_RECORD","THREAT_RECORD","HAZARD_RECORD","VULNERABILITY_RECORD","EXPOSURE_RECORD","IMPACT_RECORD","LIKELIHOOD_RECORD","RISK_MODEL_RECORD","RISK_THRESHOLD_RECORD","CONTROL_RECORD","RISK_TREATMENT_RECORD","RESIDUAL_RISK_RECORD","HUMAN_REVIEW_RECORD","COMMIT_AUTHORIZATION","EXECUTION_RECEIPT","OUTCOME_EVIDENCE","REPLAY_RESULT"]',
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
        key: "riskCommitRecord",
        label: "Risk commit record",
        type: "json",
        required: true,
        placeholder:
          '{"riskId":"RISK-2026-001","determination":"ALLOW","residualRisk":"low","acceptanceId":"ACCEPT-001"}',
      },
      {
        key: "executionAvailable",
        label: "Risk-governed execution occurred",
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
            ruleId: "RISK-EXECUTION-01",
            description: "Required when risk-governed execution has occurred.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"EXEC-001","riskId":"RISK-2026-001","status":"completed","controlsActive":true}',
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
        label: "Measured risk outcome",
        type: "textarea",
        required: false,
        appliesWhen: [
          {
            ruleId: "RISK-OUTCOME-01",
            description: "Required when outcome evidence is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe whether observed outcomes corresponded to the assessed risk, expected control performance, residual risk, and accepted conditions.",
        validation: { maxLength: 6000 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["evidence expiry","authority change","policy change","model change","data change","tool change","new threat","control failure","execution mismatch","outcome mismatch","incident"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how identity, evidence, threats, hazards, vulnerabilities, exposure, impacts, likelihoods, controls, treatment, residual risk, authority, execution, outcomes, incidents, and remediation are revalidated.",
        validation: { minLength: 20, maxLength: 7000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const RISK_SCENARIOS = [
  {
    scenarioId: "RISK-BASELINE-ALLOW",
    laneId: "risk",
    title: "Complete admissible risk baseline",
    description:
      "The exact risk subject, evidence, threats, hazards, vulnerabilities, exposure, impact, likelihood, controls, treatment, residual risk, authority, review, commit, and replay requirements are complete and current.",
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
    scenarioId: "RISK-IDENTITY-MISSING",
    laneId: "risk",
    title: "Risk route identity missing",
    description:
      "The exact risk subject, owner, assessor, environment, route, or assessment version cannot be uniquely identified.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-IDENTITY-MISSING-I01",
        title: "Remove risk route identity",
        description:
          "Remove evidence binding the assessment to one exact risk route.",
        mutationType: "REMOVE_EVIDENCE",
        target: "RISK_ROUTE_RECORD",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Reconstruct the exact risk identity.",
      "Bind the subject, owner, assessor, and environment.",
      "Replay before acceptance.",
    ],
  },
  {
    scenarioId: "RISK-CLAIM-UNSUPPORTED",
    laneId: "risk",
    title: "Risk claim exceeds evidence",
    description:
      "The risk claim is broader than the assessed assets, populations, environments, threats, hazards, time horizon, or evidence.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-CLAIM-UNSUPPORTED-I01",
        title: "Remove risk claim support",
        description:
          "Remove evidence supporting a material risk claim.",
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
      "Narrow the claim or expand the assessment.",
      "Preserve explicit limitations and non-claims.",
      "Replay before acceptance.",
    ],
  },
  {
    scenarioId: "RISK-EVIDENCE-MISSING",
    laneId: "risk",
    title: "Mandatory risk evidence missing",
    description:
      "A required evidence record supporting a material threat, hazard, vulnerability, exposure, impact, likelihood, or control condition is unavailable.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-EVIDENCE-MISSING-I01",
        title: "Remove mandatory risk evidence",
        description:
          "Remove a mandatory risk evidence record.",
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
      "Repeat the assessment.",
    ],
  },
  {
    scenarioId: "RISK-EVIDENCE-EXPIRED",
    laneId: "risk",
    title: "Risk evidence expired",
    description:
      "A mandatory risk evidence record is outside its approved validity window.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-EVIDENCE-EXPIRED-I01",
        title: "Expire risk evidence",
        description:
          "Expire a mandatory evidence record supporting risk acceptance.",
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
      "Recalculate risk and residual risk.",
      "Issue renewed acceptance and replay.",
    ],
  },
  {
    scenarioId: "RISK-EVIDENCE-CONFLICT",
    laneId: "risk",
    title: "Material risk evidence conflict",
    description:
      "Authoritative records materially disagree about a threat, hazard, vulnerability, exposure, impact, likelihood, control, or residual risk.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-EVIDENCE-CONFLICT-I01",
        title: "Create risk evidence conflict",
        description:
          "Introduce contradictory evidence for a material risk condition.",
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
      "Resolve through independent risk authority.",
      "Do not accept or execute until resolved.",
    ],
  },
  {
    scenarioId: "RISK-AUTHORITY-REVOKED",
    laneId: "risk",
    title: "Risk acceptance authority revoked",
    description:
      "The authority supporting assessment, treatment approval, residual risk acceptance, commitment, or execution is no longer valid.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-AUTHORITY-REVOKED-I01",
        title: "Revoke risk authority",
        description:
          "Invalidate a mandatory risk authority record.",
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
      "Suspend reliance on prior risk acceptance.",
      "Obtain valid replacement authority.",
      "Issue a new acceptance and commit.",
    ],
  },
  {
    scenarioId: "RISK-SCOPE-DRIFT",
    laneId: "risk",
    title: "Risk scope changed after acceptance",
    description:
      "The asset, population, environment, threat, hazard, exposure, time horizon, consequence, or dependency expands beyond the accepted boundary.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-SCOPE-DRIFT-I01",
        title: "Alter risk scope",
        description:
          "Expand the assessed risk beyond its preserved boundary.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "riskScope",
        value: "expanded-unapproved-risk-scope",
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
      "Reject reliance on the prior assessment.",
      "Create a new bounded risk route.",
      "Reassess and reaccept before execution.",
    ],
  },
  {
    scenarioId: "RISK-CONTROL-FAILURE",
    laneId: "risk",
    title: "Mandatory risk control failed",
    description:
      "A control used to reduce inherent risk is ineffective, unavailable, bypassed, or no longer operating as assessed.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-CONTROL-FAILURE-I01",
        title: "Remove control effectiveness evidence",
        description:
          "Remove evidence showing a mandatory risk control is effective.",
        mutationType: "REMOVE_EVIDENCE",
        target: "CONTROL_RECORD",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Restore or replace the failed control.",
      "Retest control effectiveness.",
      "Recalculate residual risk and reaccept.",
    ],
  },
  {
    scenarioId: "RISK-UNACCEPTABLE-RESIDUAL-RISK",
    laneId: "risk",
    title: "Residual risk exceeds approved threshold",
    description:
      "After treatment and control effects, the remaining risk exceeds the authorized acceptance threshold.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-UNACCEPTABLE-RESIDUAL-RISK-I01",
        title: "Alter residual risk",
        description:
          "Set residual risk above the approved acceptance threshold.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "residualRisk",
        value: "unacceptable",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Do not accept or execute under the failed threshold.",
      "Apply additional treatment or narrow scope.",
      "Reassess and obtain new authority.",
    ],
  },
  {
    scenarioId: "RISK-DEPENDENCY-FAILURE",
    laneId: "risk",
    title: "Critical risk dependency failed",
    description:
      "A critical monitoring, identity, model, data, tool, policy, control, or infrastructure dependency is unavailable or untrusted.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-DEPENDENCY-FAILURE-I01",
        title: "Alter risk dependency status",
        description:
          "Set a critical risk dependency to failed.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "dependencies",
        value: "critical-risk-dependency-failed",
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
      "Reassess before acceptance.",
    ],
  },
  {
    scenarioId: "RISK-MODEL-CHANGE",
    laneId: "risk",
    title: "Risk model changed",
    description:
      "The risk model, scoring method, weighting, threshold logic, or model version changes after acceptance.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-MODEL-CHANGE-I01",
        title: "Change risk model",
        description:
          "Replace or modify the model used to determine risk.",
        mutationType: "CHANGE_MODEL",
        target: "riskModel",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Identify and validate the changed risk model.",
      "Recalculate inherent and residual risk.",
      "Obtain renewed review and acceptance.",
    ],
  },
  {
    scenarioId: "RISK-DATA-CHANGE",
    laneId: "risk",
    title: "Risk data changed",
    description:
      "Material incident, exposure, vulnerability, threat, hazard, impact, likelihood, or control data changes after acceptance.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-DATA-CHANGE-I01",
        title: "Change risk data",
        description:
          "Alter a material data package supporting the risk determination.",
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
      "Recalculate risk and control effect.",
      "Repeat review and acceptance.",
    ],
  },
  {
    scenarioId: "RISK-TOOL-CHANGE",
    laneId: "risk",
    title: "Risk assessment tool changed",
    description:
      "A material assessment tool, connector, data pipeline, scoring component, or monitoring service changes after acceptance.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-TOOL-CHANGE-I01",
        title: "Change risk tool",
        description:
          "Replace a material tool supporting the risk assessment.",
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
      "Retest risk calculations and controls.",
      "Repeat the assessment and replay.",
    ],
  },
  {
    scenarioId: "RISK-HUMAN-INTERVENTION-BLOCKED",
    laneId: "risk",
    title: "Required risk intervention blocked",
    description:
      "The authorized reviewer or risk owner cannot challenge, hold, deny, suspend, reverse, or escalate the risk route.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-HUMAN-INTERVENTION-BLOCKED-I01",
        title: "Block risk intervention",
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
      "Restore review, challenge, intervention, and stop authority.",
      "Reassess all affected risk acceptances.",
      "Replay before renewed reliance.",
    ],
  },
  {
    scenarioId: "RISK-EXECUTION-MISMATCH",
    laneId: "risk",
    title: "Execution differs from risk-accepted conditions",
    description:
      "The actual actor, subject, scope, model, data, tool, target, control state, or environment differs from the conditions under which risk was accepted.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-EXECUTION-MISMATCH-I01",
        title: "Create risk execution mismatch",
        description:
          "Cause actual execution to differ from the risk-accepted route.",
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
      "Preserve accepted conditions and actual execution evidence.",
      "Reassess, remediate, and replay.",
    ],
  },
  {
    scenarioId: "RISK-OUTCOME-MISMATCH",
    laneId: "risk",
    title: "Observed outcome contradicts risk determination",
    description:
      "Measured outcomes show greater harm, frequency, severity, exposure, or control failure than the accepted risk determination predicted.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "RISK-OUTCOME-MISMATCH-I01",
        title: "Create risk outcome mismatch",
        description:
          "Provide outcome evidence that contradicts the accepted risk determination.",
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
      "Suspend or narrow operations where required.",
      "Reassess risk, controls, treatment, and acceptance before replay.",
    ],
  },
  {
    scenarioId: "RISK-RECOVERY-REPLAY",
    laneId: "risk",
    title: "Corrected risk recovery and replay",
    description:
      "A prior risk governance failure is corrected, independently verified, preserved, and replayed before renewed acceptance or execution.",
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
      "Preserve the original failed assessment and determination.",
      "Link corrected evidence, updated risk calculations, treatment, control testing, renewed authority, and independent verification.",
      "Issue a new risk acceptance and replay result without altering the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type RiskScenario =
  (typeof RISK_SCENARIOS)[number];

export const RISK_LANE = {
  laneId: "risk",
  name: "Risk Governance Playground",
  shortName: "Risk",
  description:
    "Test whether a risk determination is identifiable, bounded, evidence-supported, methodologically sound, authority-backed, control-bound, treatment-aware, independently reviewable, execution-constrained, outcome-verified, and continuously valid.",
  claimsGoverned: [
    "The exact risk subject, owner, assessor, environment, route, version, and validity period are identified.",
    "The risk claim, scope, assets, populations, threats, hazards, exposures, assumptions, consequences, and exclusions are explicit.",
    "Threats, hazards, vulnerabilities, exposures, impacts, likelihoods, evidence, sources, and uncertainty are preserved.",
    "The risk model, thresholds, scoring logic, assumptions, and limitations are defined before acceptance.",
    "Policies, rules, controls, dependencies, treatment plans, and residual risk are bound to the decision.",
    "Risk assessors, reviewers, owners, acceptance authorities, exception authorities, and commit authorities are competent, attributable, independent where required, and valid.",
    "Residual risk is accepted only within the authorized threshold and preserved conditions.",
    "Material model, data, tool, threat, hazard, exposure, control, dependency, scope, policy, or authority changes invalidate prior reliance.",
    "Execution receipts prove whether operations remained within risk-accepted conditions.",
    "Outcome evidence proves whether observed harm, frequency, severity, exposure, and control performance corresponded to the accepted risk determination.",
  ],
  nonClaims: [
    "A risk score alone does not authorize acceptance, deployment, or execution.",
    "Low average risk does not prove low subgroup, edge-case, or future risk.",
    "Control design does not prove control effectiveness.",
    "Risk acceptance does not eliminate risk or authorize operation beyond the exact preserved boundary.",
    "An ALLOW determination applies only to the exact evidence, threats, hazards, vulnerabilities, exposure, impacts, likelihoods, controls, treatment, residual risk, authority, scope, environment, and validity period preserved.",
  ],
  sections: RISK_SECTIONS,
  gateIds: RISK_GATE_IDS,
  evidenceTypes: [...RISK_EVIDENCE_TYPES],
  scenarioIds: RISK_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when authority is invalid, residual risk exceeds the approved threshold, scope expands, required intervention is blocked, or execution differs from risk-accepted conditions.",
    "ESCALATE when material evidence conflicts or superior governance, legal, safety, financial, technical, or executive authority is required.",
    "HOLD when evidence, models, controls, dependencies, treatment, residual risk, review, validity, monitoring, outcomes, or remediation is incomplete, expired, changed, or unresolved.",
    "ALLOW only when all applicable gates pass and the exact risk route is supported by admissible evidence, bounded scope, valid methodology, effective controls, authorized residual risk acceptance, preserved commitment, and continuing validity.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getRiskScenario(
  scenarioId: string,
): RiskScenario | undefined {
  return RISK_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
