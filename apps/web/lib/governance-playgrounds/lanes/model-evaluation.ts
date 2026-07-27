import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Model Evaluation Governance Playground
 *
 * Governs whether a model evaluation is attributable, scoped, reproducible,
 * representative, authorized, preserved, and sufficient to support a bounded
 * deployment or execution claim.
 *
 * Governing sequence:
 * Reality -> Record -> Continuity -> Admissibility -> Binding -> Commit ->
 * Execution -> Outcome
 */

export const MODEL_EVALUATION_GATE_IDS = [
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

export const MODEL_EVALUATION_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "MODEL_IDENTITY_RECORD",
  "MODEL_VERSION_RECORD",
  "MODEL_PROVENANCE_RECORD",
  "EVALUATION_PLAN",
  "EVALUATION_SCOPE_RECORD",
  "DATASET_IDENTITY_RECORD",
  "DATASET_PROVENANCE_RECORD",
  "DATASET_QUALITY_RECORD",
  "BENCHMARK_DEFINITION_RECORD",
  "METRIC_DEFINITION_RECORD",
  "THRESHOLD_RECORD",
  "BASELINE_RECORD",
  "TEST_HARNESS_RECORD",
  "REPRODUCIBILITY_RECORD",
  "ROBUSTNESS_RECORD",
  "SAFETY_EVALUATION_RECORD",
  "FAIRNESS_EVALUATION_RECORD",
  "SECURITY_EVALUATION_RECORD",
  "LIMITATION_RECORD",
  "HUMAN_REVIEW_RECORD",
  "AUTHORITY_RECORD",
  "APPROVAL_RECORD",
  "CHANGE_RECORD",
  "DRIFT_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "INCIDENT_RECORD",
  "REMEDIATION_RECORD",
  "REPLAY_RESULT",
] as const;

export type ModelEvaluationEvidenceType =
  (typeof MODEL_EVALUATION_EVIDENCE_TYPES)[number];

export const MODEL_EVALUATION_SECTIONS = [
  {
    sectionId: "model-evaluation-identity",
    title: "Model and Evaluation Identity",
    description:
      "Identify the exact model, version, provider, owner, evaluation route, environment, intended decision, and validity period.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Evaluation route title",
        type: "text",
        required: true,
        placeholder: "Production model evaluation route",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Evaluation route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the model, evaluation purpose, deployment decision, execution claim, and governed consequences.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "evaluationRouteIdentifier",
        label: "Stable evaluation route identifier",
        type: "text",
        required: true,
        placeholder: "model-evaluation:route:2026-001",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "modelName",
        label: "Model name",
        type: "text",
        required: true,
        placeholder: "Governed Decision Model",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "modelIdentifier",
        label: "Stable model identifier",
        type: "text",
        required: true,
        placeholder: "model:provider:family:release",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "modelVersion",
        label: "Model version",
        type: "text",
        required: true,
        placeholder: "1.0.0",
        validation: { minLength: 1, maxLength: 120 },
      },
      {
        key: "modelProvider",
        label: "Model provider",
        type: "text",
        required: true,
        placeholder: "Model Provider",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "evaluationOwner",
        label: "Evaluation owner",
        type: "text",
        required: true,
        placeholder: "Independent Evaluation Authority",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "deploymentEnvironment",
        label: "Target environment",
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
        key: "evaluationDate",
        label: "Evaluation date",
        type: "date",
        required: true,
      },
      {
        key: "validUntil",
        label: "Evaluation validity end",
        type: "date",
        required: true,
      },
    ],
  },
  {
    sectionId: "model-evaluation-claim-scope",
    title: "Evaluation Claim, Scope, and Boundary",
    description:
      "Define exactly what the evaluation claims, the intended use, population, operating conditions, exclusions, limitations, and prohibited extrapolations.",
    order: 20,
    fields: [
      {
        key: "evaluationClaim",
        label: "Evaluation claim",
        type: "textarea",
        required: true,
        placeholder:
          "State exactly what the evaluation demonstrates and what deployment or execution decision it is intended to support.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "claimBasis",
        label: "Claim basis",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the evidence, benchmarks, metrics, datasets, thresholds, controls, reviewers, and assumptions supporting the claim.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "intendedUse",
        label: "Intended use",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the exact users, decisions, tasks, systems, populations, environments, and consequences covered.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "evaluationScope",
        label: "Evaluation scope",
        type: "json",
        required: true,
        placeholder:
          '{"tasks":["classification"],"populations":["approved population"],"environments":["production-v1"],"languages":["en"]}',
      },
      {
        key: "outOfScope",
        label: "Out-of-scope conditions",
        type: "json",
        required: true,
        placeholder:
          '["unseen populations","unsupported languages","autonomous high-impact execution","use after material model change"]',
      },
      {
        key: "prohibitedExtrapolations",
        label: "Prohibited extrapolations",
        type: "json",
        required: true,
        placeholder:
          '["benchmark success equals universal safety","average performance equals subgroup performance","offline score equals runtime control"]',
      },
      {
        key: "knownLimitations",
        label: "Known limitations",
        type: "json",
        required: true,
        placeholder:
          '[{"limitationId":"LIM-001","description":"reduced performance under distribution shift","materiality":"high"}]',
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
    sectionId: "model-evaluation-data-benchmarks",
    title: "Datasets, Benchmarks, and Metrics",
    description:
      "Establish dataset identity, provenance, representativeness, contamination controls, benchmark definitions, metrics, thresholds, and baselines.",
    order: 30,
    fields: [
      {
        key: "datasetInventory",
        label: "Evaluation dataset inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"datasetId":"DS-001","name":"Evaluation Set","version":"2026.1","purpose":"primary benchmark","status":"current"}]',
      },
      {
        key: "datasetProvenance",
        label: "Dataset provenance",
        type: "json",
        required: true,
        placeholder:
          '[{"datasetId":"DS-001","sources":["source-a"],"collectionPeriod":"2025-2026","authority":"approved custodian"}]',
      },
      {
        key: "representativenessMethod",
        label: "Representativeness method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how the evaluation population corresponds to the intended deployment population and known edge conditions.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "contaminationControls",
        label: "Contamination and leakage controls",
        type: "json",
        required: true,
        placeholder:
          '["training overlap analysis","deduplication","hidden holdout","prompt leakage review","benchmark memorization checks"]',
      },
      {
        key: "benchmarkDefinitions",
        label: "Benchmark definitions",
        type: "json",
        required: true,
        placeholder:
          '[{"benchmarkId":"BM-001","task":"approved task","datasetId":"DS-001","protocol":"frozen-v1"}]',
      },
      {
        key: "metricDefinitions",
        label: "Metric definitions",
        type: "json",
        required: true,
        placeholder:
          '[{"metricId":"MET-001","name":"accuracy","calculation":"correct/total","direction":"higher-is-better"}]',
      },
      {
        key: "decisionThresholds",
        label: "Decision thresholds",
        type: "json",
        required: true,
        placeholder:
          '{"allow":{"MET-001":">=0.95"},"hold":{"MET-001":"0.90-0.949"},"deny":{"MET-001":"<0.90"}}',
      },
      {
        key: "baselineComparison",
        label: "Baseline comparison",
        type: "json",
        required: true,
        placeholder:
          '[{"baselineId":"BASE-001","type":"previous approved model","version":"0.9.0","comparison":"non-inferior"}]',
      },
      {
        key: "subgroupEvaluation",
        label: "Subgroup evaluation",
        type: "json",
        required: true,
        placeholder:
          '[{"group":"approved subgroup","metric":"MET-001","result":0.95,"threshold":0.93}]',
      },
    ],
  },
  {
    sectionId: "model-evaluation-methods-controls",
    title: "Evaluation Methods, Controls, and Reproducibility",
    description:
      "Define the test harness, prompts or inputs, configurations, seeds, tools, reviewers, reproducibility, robustness, and control testing.",
    order: 40,
    fields: [
      {
        key: "evaluationProtocol",
        label: "Evaluation protocol",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the frozen evaluation procedure, ordering, sampling, prompts, input transformation, scoring, exclusions, and review steps.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "testHarness",
        label: "Test harness",
        type: "json",
        required: true,
        placeholder:
          '{"harnessId":"HARNESS-001","version":"1.0.0","repositoryCommit":"abc123","environment":"frozen"}',
      },
      {
        key: "modelConfiguration",
        label: "Model configuration",
        type: "json",
        required: true,
        placeholder:
          '{"temperature":0,"topP":1,"seed":42,"systemPromptVersion":"SP-001","toolAccess":"disabled"}',
      },
      {
        key: "reproducibilityMethod",
        label: "Reproducibility method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe environment capture, version pinning, seeds, dependency locks, reruns, variance limits, and independent reproduction.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "robustnessTests",
        label: "Robustness tests",
        type: "json",
        required: true,
        placeholder:
          '["input perturbation","distribution shift","missing fields","adversarial examples","tool failure","latency stress"]',
      },
      {
        key: "safetyTests",
        label: "Safety evaluation",
        type: "json",
        required: true,
        placeholder:
          '[{"testId":"SAFE-001","risk":"unsafe recommendation","result":"pass","evidenceId":"EV-SAFE-001"}]',
      },
      {
        key: "securityTests",
        label: "Security evaluation",
        type: "json",
        required: true,
        placeholder:
          '[{"testId":"SEC-001","risk":"prompt injection","result":"pass","evidenceId":"EV-SEC-001"}]',
      },
      {
        key: "fairnessTests",
        label: "Fairness and differential performance evaluation",
        type: "json",
        required: true,
        placeholder:
          '[{"testId":"FAIR-001","groups":["A","B"],"metric":"error-rate-gap","result":"within-threshold"}]',
      },
      {
        key: "controlTesting",
        label: "Evaluation control testing",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-EVAL-001","objective":"prevent dataset leakage","result":"effective"}]',
      },
    ],
  },
  {
    sectionId: "model-evaluation-review-approval",
    title: "Review, Authority, and Approval",
    description:
      "Define evaluator identity, independence, competence, conflicts, approval authority, decision rationale, exceptions, and deployment conditions.",
    order: 50,
    fields: [
      {
        key: "evaluatorIdentity",
        label: "Evaluator identity and role",
        type: "json",
        required: true,
        placeholder:
          '[{"person":"authorized evaluator","role":"lead evaluator","organization":"independent review function"}]',
      },
      {
        key: "evaluatorCompetence",
        label: "Evaluator competence",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"lead evaluator","requirements":["domain expertise","statistical evaluation","model safety","governance"]}]',
      },
      {
        key: "independenceControls",
        label: "Independence controls",
        type: "json",
        required: true,
        placeholder:
          '["separation from development","conflict disclosure","independent challenge","protected escalation"]',
      },
      {
        key: "evidenceConflicts",
        label: "Known evidence conflicts",
        type: "json",
        required: true,
        placeholder:
          '[{"conflictId":"CONFLICT-001","status":"resolved","resolution":"independent rerun"}]',
      },
      {
        key: "approvalAuthority",
        label: "Approval authority",
        type: "json",
        required: true,
        placeholder:
          '[{"authorityId":"AUTH-001","role":"model approval authority","scope":"production version 1.0.0","status":"active"}]',
      },
      {
        key: "approvalRecord",
        label: "Approval record",
        type: "json",
        required: true,
        placeholder:
          '{"approvalId":"APR-001","decision":"approved","scope":"bounded intended use","conditions":["runtime monitoring","no scope expansion"]}',
      },
      {
        key: "exceptionPolicy",
        label: "Exception policy",
        type: "textarea",
        required: true,
        placeholder:
          "Describe whether exceptions are allowed, who may approve them, their maximum duration and scope, required controls, and replay conditions.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "deploymentConditions",
        label: "Deployment conditions",
        type: "json",
        required: true,
        placeholder:
          '["exact approved model version","approved configuration","approved data boundary","runtime controls active","monitoring enabled"]',
      },
      {
        key: "failedThresholdBehavior",
        label: "Behavior when a mandatory threshold fails",
        type: "select",
        required: true,
        options: [
          { value: "deny", label: "DENY" },
          { value: "hold", label: "HOLD" },
          { value: "escalate", label: "ESCALATE" },
          { value: "limited-mode", label: "Approved limited mode only" },
        ],
      },
    ],
  },
  {
    sectionId: "model-evaluation-change-drift-monitoring",
    title: "Change, Drift, and Monitoring",
    description:
      "Define material changes, evaluation expiry, model drift, data drift, tool drift, performance monitoring, incident triggers, suspension, and re-evaluation.",
    order: 60,
    fields: [
      {
        key: "materialChangeTriggers",
        label: "Material change triggers",
        type: "json",
        required: true,
        placeholder:
          '["model weights change","model provider change","system prompt change","tool change","dataset change","task change","population change","threshold change"]',
      },
      {
        key: "driftMonitoringPlan",
        label: "Drift monitoring plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe monitoring for model, data, task, population, environment, performance, calibration, safety, and dependency drift.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "driftThresholds",
        label: "Drift thresholds",
        type: "json",
        required: true,
        placeholder:
          '{"performanceDrop":">2%","subgroupGapIncrease":">1%","distributionShift":"material","safetyIncidentCount":">0 critical"}',
      },
      {
        key: "monitoringSignals",
        label: "Monitoring signals",
        type: "json",
        required: true,
        placeholder:
          '["model hash change","configuration change","input distribution shift","metric degradation","incident","execution mismatch","outcome mismatch"]',
      },
      {
        key: "suspensionTriggers",
        label: "Suspension triggers",
        type: "json",
        required: true,
        placeholder:
          '["invalid model identity","expired evaluation","critical threshold failure","unresolved evidence conflict","material drift","unsafe outcome"]',
      },
      {
        key: "reEvaluationRequirements",
        label: "Re-evaluation requirements",
        type: "json",
        required: true,
        placeholder:
          '["new frozen model identity","updated datasets","full mandatory benchmark suite","independent review","new approval","replay result"]',
      },
      {
        key: "incidentProcedure",
        label: "Evaluation incident procedure",
        type: "textarea",
        required: true,
        placeholder:
          "Describe containment, evidence preservation, impact assessment, notification, correction, re-evaluation, approval, and replay.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "remediationVerification",
        label: "Remediation verification",
        type: "json",
        required: true,
        placeholder:
          '{"independentVerification":true,"fullRetest":true,"reapprovalRequired":true,"replayRequired":true}',
      },
    ],
  },
  {
    sectionId: "model-evaluation-records-execution-outcomes",
    title: "Records, Execution Binding, Outcomes, and Replay",
    description:
      "Preserve the evaluated model, evidence, approval, committed deployment, actual execution, outcomes, changes, remediation, and continuing validity.",
    order: 70,
    fields: [
      {
        key: "requiredRecords",
        label: "Required preserved records",
        type: "json",
        required: true,
        placeholder:
          '["MODEL_IDENTITY_RECORD","EVALUATION_PLAN","DATASET_IDENTITY_RECORD","BENCHMARK_DEFINITION_RECORD","METRIC_DEFINITION_RECORD","THRESHOLD_RECORD","REPRODUCIBILITY_RECORD","APPROVAL_RECORD","EXECUTION_RECEIPT","OUTCOME_EVIDENCE","REPLAY_RESULT"]',
      },
      {
        key: "recordIntegrityMethod",
        label: "Record integrity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe timestamps, signatures, hashes, dataset fingerprints, model hashes, environment capture, append-only preservation, corrections, retention, and access.",
        validation: { minLength: 20, maxLength: 7000 },
      },
      {
        key: "commitBinding",
        label: "Commit binding",
        type: "json",
        required: true,
        placeholder:
          '{"modelId":"model:provider:family:release","modelVersion":"1.0.0","configId":"CFG-001","approvalId":"APR-001","scope":"approved intended use"}',
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
            ruleId: "MODEL-EVALUATION-EXECUTION-01",
            description: "Required when the evaluated model has executed.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"exec-001","modelId":"model:provider:family:release","modelVersion":"1.0.0","configId":"CFG-001","status":"completed"}',
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
            ruleId: "MODEL-EVALUATION-OUTCOME-01",
            description: "Required when outcome evidence is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe whether runtime behavior and measured outcomes corresponded to the approved evaluation claim, thresholds, scope, and limitations.",
        validation: { maxLength: 6000 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["evaluation expiry","model change","data change","tool change","configuration change","threshold change","incident","execution mismatch","outcome mismatch"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how model identity, evidence, datasets, benchmarks, thresholds, approvals, deployment binding, runtime outcomes, drift, remediation, and changes are revalidated.",
        validation: { minLength: 20, maxLength: 7000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const MODEL_EVALUATION_SCENARIOS = [
  {
    scenarioId: "MODEL-EVALUATION-BASELINE-ALLOW",
    laneId: "model-evaluation",
    title: "Complete model evaluation baseline",
    description:
      "The exact model, scope, datasets, benchmarks, metrics, thresholds, methods, reviewers, approval, deployment conditions, and replay requirements are complete and current.",
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
    scenarioId: "MODEL-EVALUATION-MODEL-IDENTITY-MISSING",
    laneId: "model-evaluation",
    title: "Model identity missing",
    description:
      "The evaluated model, version, provider, hash, or configuration cannot be uniquely identified.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-MODEL-IDENTITY-MISSING-I01",
        title: "Remove model identity record",
        description:
          "Remove the evidence binding the evaluation to an exact model.",
        mutationType: "REMOVE_EVIDENCE",
        target: "MODEL_IDENTITY_RECORD",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Reconstruct the exact model identity and version.",
      "Bind the configuration and provider.",
      "Re-run and replay the evaluation.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-UNSUPPORTED-CLAIM",
    laneId: "model-evaluation",
    title: "Evaluation claim exceeds evidence",
    description:
      "The evaluation claim is broader than the tested tasks, populations, environments, metrics, or consequences.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-UNSUPPORTED-CLAIM-I01",
        title: "Remove evaluation claim support",
        description:
          "Remove evidence supporting a material evaluation claim.",
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
      "Narrow the claim or expand the evaluation.",
      "Preserve explicit limitations and non-claims.",
      "Replay before approval.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-DATASET-PROVENANCE-MISSING",
    laneId: "model-evaluation",
    title: "Evaluation dataset provenance missing",
    description:
      "The origin, authority, collection method, transformation, version, or custody of a material evaluation dataset is unavailable.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-DATASET-PROVENANCE-MISSING-I01",
        title: "Remove dataset provenance",
        description:
          "Remove provenance evidence for a mandatory evaluation dataset.",
        mutationType: "REMOVE_EVIDENCE",
        target: "DATASET_PROVENANCE_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Restore dataset provenance and custody.",
      "Verify transformations and version.",
      "Re-run affected evaluations.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-DATASET-CONTAMINATION",
    laneId: "model-evaluation",
    title: "Benchmark contamination detected",
    description:
      "Training overlap, memorization, leakage, prompt disclosure, or repeated tuning materially compromises benchmark validity.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-DATASET-CONTAMINATION-I01",
        title: "Create contamination evidence conflict",
        description:
          "Introduce conflicting evidence showing likely benchmark contamination.",
        mutationType: "CREATE_EVIDENCE_CONFLICT",
        target: "contaminationControls",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Preserve contamination evidence.",
      "Replace or quarantine the affected benchmark.",
      "Perform an independent clean evaluation.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-NONREPRESENTATIVE-DATA",
    laneId: "model-evaluation",
    title: "Evaluation population not representative",
    description:
      "The tested dataset does not adequately represent the intended deployment population, conditions, language, geography, or edge cases.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-NONREPRESENTATIVE-DATA-I01",
        title: "Alter evaluation population",
        description:
          "Change the evaluated population so it no longer corresponds to the intended use.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "evaluationScope",
        value: "nonrepresentative-evaluation-population",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Add representative data and edge conditions.",
      "Recalculate subgroup results.",
      "Narrow deployment until evidence is sufficient.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-THRESHOLD-FAILURE",
    laneId: "model-evaluation",
    title: "Mandatory evaluation threshold failed",
    description:
      "The model fails a required performance, safety, fairness, security, robustness, or calibration threshold.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-THRESHOLD-FAILURE-I01",
        title: "Alter threshold result",
        description:
          "Set a mandatory benchmark result below the approved threshold.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "decisionThresholds",
        value: "mandatory-threshold-failed",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "PASS",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Do not approve the failed model for the claimed use.",
      "Remediate or narrow scope.",
      "Perform a new independent evaluation.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-REPRODUCIBILITY-FAILURE",
    laneId: "model-evaluation",
    title: "Evaluation cannot be reproduced",
    description:
      "Independent reruns materially differ because the harness, model configuration, environment, seed, dependency, or scoring process is incomplete or unstable.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-REPRODUCIBILITY-FAILURE-I01",
        title: "Remove reproducibility record",
        description:
          "Remove evidence needed to independently reproduce the evaluation.",
        mutationType: "REMOVE_EVIDENCE",
        target: "REPRODUCIBILITY_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Freeze the harness, environment, configuration, and dependencies.",
      "Perform independent reruns.",
      "Preserve variance and resolution evidence.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-EVIDENCE-CONFLICT",
    laneId: "model-evaluation",
    title: "Material evaluation evidence conflict",
    description:
      "Authoritative evaluation records materially disagree about a benchmark result, threshold, limitation, safety condition, or approval basis.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-EVIDENCE-CONFLICT-I01",
        title: "Create evaluation evidence conflict",
        description:
          "Introduce contradictory evidence for a material evaluation result.",
        mutationType: "CREATE_EVIDENCE_CONFLICT",
        target: "benchmarkDefinitions",
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
      "Perform an independent adjudication and rerun.",
      "Suspend approval until resolved.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-APPROVAL-AUTHORITY-REVOKED",
    laneId: "model-evaluation",
    title: "Model approval authority revoked",
    description:
      "The authority supporting evaluation approval or deployment commitment is no longer valid.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-APPROVAL-AUTHORITY-REVOKED-I01",
        title: "Revoke approval authority",
        description:
          "Invalidate the authority that approved the evaluated model.",
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
      "Suspend deployment reliance.",
      "Obtain valid replacement authority.",
      "Issue a new approval and replay result.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-EXPIRED",
    laneId: "model-evaluation",
    title: "Evaluation validity expired",
    description:
      "The preserved evaluation is outside its approved validity window.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-EXPIRED-I01",
        title: "Expire evaluation evidence",
        description:
          "Expire the evaluation record supporting deployment.",
        mutationType: "EXPIRE_EVIDENCE",
        target: "EVALUATION_PLAN",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Perform the required re-evaluation.",
      "Confirm no material drift occurred.",
      "Issue renewed approval before execution.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-MODEL-CHANGE",
    laneId: "model-evaluation",
    title: "Model changed after evaluation",
    description:
      "The model identity, weights, provider release, architecture, or configuration changes after approval.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-MODEL-CHANGE-I01",
        title: "Change evaluated model",
        description:
          "Replace or modify the approved model.",
        mutationType: "CHANGE_MODEL",
        target: "modelVersion",
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
      "Identify and preserve the changed model.",
      "Repeat all applicable mandatory evaluations.",
      "Obtain new approval and replay.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-DATA-CHANGE",
    laneId: "model-evaluation",
    title: "Evaluation data changed after approval",
    description:
      "A material dataset, source, population, schema, labeling rule, transformation, or quality condition changes after approval.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-DATA-CHANGE-I01",
        title: "Change evaluation data",
        description:
          "Alter a material dataset used by the evaluation.",
        mutationType: "CHANGE_DATA",
        target: "datasetInventory",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Document and assess the changed data.",
      "Revalidate provenance, representativeness, and contamination controls.",
      "Re-run affected benchmarks.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-TOOL-CHANGE",
    laneId: "model-evaluation",
    title: "Evaluation tool or harness changed",
    description:
      "The test harness, scorer, runtime, dependency, connector, or evaluation tool changes after approval.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-TOOL-CHANGE-I01",
        title: "Change evaluation tool",
        description:
          "Replace a material evaluation tool or harness component.",
        mutationType: "CHANGE_TOOL",
        target: "testHarness",
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
      "Reproduce baseline results.",
      "Re-run affected evaluations and replay.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-HUMAN-INTERVENTION-BLOCKED",
    laneId: "model-evaluation",
    title: "Independent evaluation intervention blocked",
    description:
      "The evaluator, reviewer, or approval authority cannot challenge, stop, hold, deny, or escalate the evaluation route.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-HUMAN-INTERVENTION-BLOCKED-I01",
        title: "Block evaluator intervention",
        description:
          "Prevent required human review or stop authority.",
        mutationType: "BLOCK_HUMAN_INTERVENTION",
        target: "independenceControls",
      },
    ],
    expectedGateStatuses: {
      G09_HUMAN_OVERSIGHT: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Restore independent review and stop authority.",
      "Reassess affected evaluation decisions.",
      "Replay before approval.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-EXECUTION-MISMATCH",
    laneId: "model-evaluation",
    title: "Deployed model differs from evaluated model",
    description:
      "The model, version, configuration, prompt, tool access, data boundary, or environment used in execution differs from the evaluated and approved route.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-EXECUTION-MISMATCH-I01",
        title: "Create model execution mismatch",
        description:
          "Cause runtime execution to use a model or configuration different from the approved evaluation.",
        mutationType: "CREATE_EXECUTION_MISMATCH",
        target: "executionReceipt",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G03_SCOPE_BOUNDARY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Stop the mismatched deployment.",
      "Preserve the evaluated and actual runtime identities.",
      "Investigate, remediate, re-evaluate, and replay.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-OUTCOME-MISMATCH",
    laneId: "model-evaluation",
    title: "Runtime outcome contradicts evaluation claim",
    description:
      "Measured runtime behavior or outcomes materially contradict the approved evaluation claim, threshold, limitation, subgroup result, or expected control performance.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-OUTCOME-MISMATCH-I01",
        title: "Create model outcome mismatch",
        description:
          "Provide outcome evidence that contradicts the approved evaluation.",
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
      "Suspend or narrow deployment as required.",
      "Reassess the claim, thresholds, datasets, controls, and model before replay.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-RECOVERY-REPLAY",
    laneId: "model-evaluation",
    title: "Corrected model evaluation recovery and replay",
    description:
      "A prior evaluation failure is corrected, independently verified, preserved, and replayed before renewed approval or deployment.",
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
      "Preserve the original failed evaluation and determination.",
      "Link corrected evidence, reruns, independent review, renewed authority, and remediation verification.",
      "Issue a new replay result without altering the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type ModelEvaluationScenario =
  (typeof MODEL_EVALUATION_SCENARIOS)[number];

export const MODEL_EVALUATION_LANE = {
  laneId: "model-evaluation",
  name: "Model Evaluation Governance Playground",
  shortName: "Model Evaluation",
  description:
    "Test whether model evaluations are identifiable, bounded, representative, reproducible, independently reviewed, authority-backed, deployment-bound, outcome-verified, and continuously valid.",
  claimsGoverned: [
    "The exact evaluated model, version, provider, configuration, evaluation route, environment, owner, and validity period are identified.",
    "The evaluation claim is explicit, bounded, evidence-supported, and limited to the tested tasks, populations, environments, and consequences.",
    "Datasets are attributable, governed, representative, versioned, and protected against contamination and leakage.",
    "Benchmarks, metrics, thresholds, subgroup tests, and baselines are defined before the result is interpreted.",
    "The evaluation protocol, harness, configuration, environment, dependencies, scoring, and reproducibility evidence are preserved.",
    "Safety, security, fairness, robustness, calibration, and limitation evidence are included when applicable.",
    "Evaluators and approval authorities are competent, independent, attributable, and valid.",
    "Deployment is bound to the exact evaluated model, configuration, scope, controls, and validity window.",
    "Material model, data, tool, task, threshold, environment, or population changes require renewed evaluation and replay.",
    "Runtime outcomes prove whether the approved evaluation claim remained valid in operation.",
  ],
  nonClaims: [
    "A benchmark score alone does not authorize deployment or execution.",
    "An evaluation does not prove universal safety, legality, fairness, security, or suitability beyond its preserved scope.",
    "Offline evaluation does not replace runtime governance, monitoring, execution control, or outcome evidence.",
    "Average performance does not prove subgroup, edge-case, or out-of-distribution performance.",
    "An ALLOW determination applies only to the exact model, configuration, data, benchmarks, thresholds, scope, controls, environment, and validity window preserved.",
  ],
  sections: MODEL_EVALUATION_SECTIONS,
  gateIds: MODEL_EVALUATION_GATE_IDS,
  evidenceTypes: [...MODEL_EVALUATION_EVIDENCE_TYPES],
  scenarioIds: MODEL_EVALUATION_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when a mandatory threshold fails, approval authority is invalid, human intervention is blocked, or the deployed model differs from the evaluated and approved model.",
    "ESCALATE when material evidence conflicts, benchmark contamination is unresolved, or superior technical, governance, legal, safety, or executive authority is required.",
    "HOLD when model identity, datasets, provenance, representativeness, reproducibility, evaluation validity, tools, controls, review evidence, drift status, or outcome evidence is incomplete, expired, changed, or unresolved.",
    "ALLOW only when all applicable gates pass and the exact model is supported by bounded claims, admissible evaluation evidence, valid authority, effective controls, preserved deployment binding, and continuing validity.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getModelEvaluationScenario(
  scenarioId: string,
): ModelEvaluationScenario | undefined {
  return MODEL_EVALUATION_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
