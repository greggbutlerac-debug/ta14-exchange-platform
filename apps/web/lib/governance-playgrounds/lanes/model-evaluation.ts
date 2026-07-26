import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Model Evaluation Governance Playground
 *
 * Tests whether a specific model remains identified, bounded, evaluated,
 * authorized, monitored, reviewable, and valid for its declared use.
 *
 * Governing principle:
 * No admissible evidence. No admissible execution.
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
  "MODEL_IDENTITY",
  "MODEL_VERSION_RECORD",
  "MODEL_CARD",
  "INTENDED_USE_DECLARATION",
  "PROHIBITED_USE_DECLARATION",
  "EVALUATION_DATASET_RECORD",
  "EVALUATION_METHOD",
  "BENCHMARK_RESULT",
  "ROBUSTNESS_TEST_RESULT",
  "BIAS_OR_FAIRNESS_TEST_RESULT",
  "SAFETY_TEST_RESULT",
  "LIMITATION_RECORD",
  "APPROVAL_AUTHORITY",
  "DEPLOYMENT_CONTEXT_RECORD",
  "HUMAN_REVIEW_PLAN",
  "MONITORING_PLAN",
  "DRIFT_RESULT",
  "CHANGE_RECORD",
  "RETIREMENT_RECORD",
  "REPLAY_RESULT",
] as const;

export type ModelEvaluationEvidenceType =
  (typeof MODEL_EVALUATION_EVIDENCE_TYPES)[number];

export const MODEL_EVALUATION_SECTIONS = [
  {
    sectionId: "model-identity",
    title: "Model Identity",
    description:
      "Identify the exact model, version, provider, artifact, configuration, and deployment context being evaluated.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Evaluation route title",
        type: "text",
        required: true,
        placeholder: "Customer-support model release evaluation",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Evaluation description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the model, intended use, deployment context, material decisions, affected parties, and evaluation objective.",
        validation: { minLength: 20, maxLength: 4000 },
      },
      {
        key: "modelName",
        label: "Model name",
        type: "text",
        required: true,
        placeholder: "support-assistant-model",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "modelIdentifier",
        label: "Stable model identifier",
        description:
          "A stable identifier for the exact model artifact or hosted model endpoint.",
        type: "text",
        required: true,
        placeholder: "model:support-assistant:2026-07-26",
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
        label: "Model provider or owner",
        type: "text",
        required: true,
        placeholder: "Organization or provider name",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "modelType",
        label: "Model type",
        type: "select",
        required: true,
        options: [
          { value: "classification", label: "Classification" },
          { value: "regression", label: "Regression" },
          { value: "ranking", label: "Ranking or recommendation" },
          { value: "generative-language", label: "Generative language" },
          { value: "generative-image", label: "Generative image" },
          { value: "multimodal", label: "Multimodal" },
          { value: "forecasting", label: "Forecasting" },
          { value: "anomaly-detection", label: "Anomaly detection" },
          { value: "other", label: "Other" },
        ],
      },
      {
        key: "deploymentContext",
        label: "Deployment context",
        type: "select",
        required: true,
        options: [
          { value: "research", label: "Research" },
          { value: "simulation", label: "Simulation" },
          { value: "sandbox", label: "Sandbox" },
          { value: "staging", label: "Staging" },
          { value: "production", label: "Production" },
          { value: "embedded-third-party", label: "Embedded in third-party system" },
        ],
      },
    ],
  },
  {
    sectionId: "claim-boundary",
    title: "Governance Claim and Use Boundary",
    description:
      "State what the evaluation claims to establish, the uses it covers, and the uses it does not support.",
    order: 20,
    fields: [
      {
        key: "governanceClaim",
        label: "Model governance claim",
        type: "textarea",
        required: true,
        placeholder:
          "This evaluation supports use of the identified model for the declared task, population, environment, and decision boundary.",
        validation: { minLength: 20, maxLength: 3000 },
      },
      {
        key: "intendedUses",
        label: "Intended uses",
        type: "textarea",
        required: true,
        placeholder:
          "Describe each approved task, user group, environment, decision context, and output use.",
        validation: { minLength: 10, maxLength: 4000 },
      },
      {
        key: "prohibitedUses",
        label: "Prohibited uses",
        type: "textarea",
        required: true,
        placeholder:
          "List uses that are not supported, approved, or permitted by this evaluation.",
        validation: { minLength: 10, maxLength: 4000 },
      },
      {
        key: "inScope",
        label: "In scope",
        type: "textarea",
        required: true,
        placeholder:
          "Models, versions, prompts, adapters, populations, languages, environments, tasks, and time period included.",
        validation: { minLength: 10, maxLength: 4000 },
      },
      {
        key: "outOfScope",
        label: "Out of scope",
        type: "textarea",
        required: true,
        placeholder:
          "Excluded models, versions, populations, languages, tasks, environments, and downstream uses.",
        validation: { minLength: 10, maxLength: 4000 },
      },
      {
        key: "explicitNonClaims",
        label: "Explicit non-claims",
        type: "textarea",
        required: true,
        placeholder:
          "This evaluation does not prove universal truthfulness, legal compliance, cybersecurity, runtime control, or outcome causation.",
        validation: { minLength: 10, maxLength: 3000 },
      },
    ],
  },
  {
    sectionId: "evaluation-design",
    title: "Evaluation Design",
    description:
      "Define the evaluation questions, datasets, methods, metrics, thresholds, and known limitations.",
    order: 30,
    fields: [
      {
        key: "evaluationObjectives",
        label: "Evaluation objectives",
        type: "json",
        required: true,
        placeholder:
          '[{"objective":"answer quality","metric":"task success rate","threshold":0.9}]',
      },
      {
        key: "evaluationDatasets",
        label: "Evaluation datasets",
        type: "json",
        required: true,
        placeholder:
          '[{"datasetId":"eval-set-1","version":"2026-07","population":"declared users","approved":true}]',
      },
      {
        key: "evaluationMethods",
        label: "Evaluation methods",
        type: "json",
        required: true,
        placeholder:
          '[{"method":"held-out benchmark","reviewers":["evaluator-1"],"repeatable":true}]',
      },
      {
        key: "metricsAndThresholds",
        label: "Metrics and acceptance thresholds",
        type: "json",
        required: true,
        placeholder:
          '[{"metric":"critical error rate","operator":"<=","threshold":0.01,"failure":"HOLD"}]',
      },
      {
        key: "subgroupEvaluationPlan",
        label: "Subgroup and affected-party evaluation plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe relevant subgroups, languages, accessibility conditions, edge cases, and affected-party considerations.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "knownLimitations",
        label: "Known model and evaluation limitations",
        type: "textarea",
        required: true,
        placeholder:
          "State known blind spots, unsupported conditions, dataset limits, uncertainty, and unresolved risks.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "authority-approval",
    title: "Authority and Approval",
    description:
      "Identify who is qualified and authorized to design, perform, interpret, approve, restrict, or reject the evaluation.",
    order: 40,
    fields: [
      {
        key: "evaluationActors",
        label: "Evaluation actors",
        type: "json",
        required: true,
        placeholder:
          '[{"actorId":"evaluator-1","role":"independent evaluator","qualification":"model assurance"}]',
      },
      {
        key: "approvalAuthority",
        label: "Approval authority",
        type: "json",
        required: true,
        placeholder:
          '[{"holder":"model-risk-committee","scope":"approve production use","validUntil":"2027-01-01T00:00:00Z"}]',
      },
      {
        key: "conflictOfInterestControls",
        label: "Conflict-of-interest controls",
        type: "textarea",
        required: true,
        placeholder:
          "Describe reviewer independence, disclosure requirements, recusal rules, and separation from commercial influence.",
        validation: { minLength: 20, maxLength: 4000 },
      },
      {
        key: "releaseDecisionBoundary",
        label: "Release decision boundary",
        type: "textarea",
        required: true,
        placeholder:
          "State who may approve release, what conditions they may waive, and what conditions cannot be waived.",
        validation: { minLength: 20, maxLength: 4000 },
      },
    ],
  },
  {
    sectionId: "dependencies-changes",
    title: "Dependencies and Material Changes",
    description:
      "Identify every dependency that can materially affect model behavior or invalidate the evaluation.",
    order: 50,
    fields: [
      {
        key: "modelDependencies",
        label: "Material model dependencies",
        type: "json",
        required: true,
        placeholder:
          '[{"type":"base-model","identifier":"provider:model:v3","version":"3.1"},{"type":"adapter","identifier":"support-lora","version":"1.2"}]',
      },
      {
        key: "promptAndConfiguration",
        label: "Prompt, system instruction, and configuration boundary",
        type: "json",
        required: true,
        placeholder:
          '{"systemPromptVersion":"4","temperature":0.2,"toolsEnabled":false}',
      },
      {
        key: "dataDependencies",
        label: "Training, retrieval, and reference data dependencies",
        type: "json",
        required: true,
        placeholder:
          '[{"dataset":"knowledge-base","version":"2026-07-01","approved":true}]',
      },
      {
        key: "materialChangePolicy",
        label: "Material change and re-evaluation policy",
        type: "textarea",
        required: true,
        placeholder:
          "State which model, prompt, adapter, data, tool, environment, provider, or threshold changes invalidate the prior evaluation.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "versionVerificationMethod",
        label: "Model version verification method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how the evaluated model artifact is matched to the model actually deployed or invoked.",
        validation: { minLength: 20, maxLength: 4000 },
      },
    ],
  },
  {
    sectionId: "oversight-monitoring",
    title: "Human Oversight, Monitoring, and Intervention",
    description:
      "Define ongoing monitoring, human review, incident response, restriction, rollback, and retirement controls.",
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
        key: "humanReviewPlan",
        label: "Human review plan",
        type: "textarea",
        required: true,
        appliesWhen: [
          {
            ruleId: "MODEL-REVIEW-01",
            description: "Required when human review is enabled.",
            field: "humanReviewRequired",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe reviewer qualification, sampling, timing, authority, intervention power, and documentation.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "monitoringMetrics",
        label: "Production monitoring metrics",
        type: "json",
        required: true,
        placeholder:
          '[{"metric":"critical error rate","window":"24h","threshold":0.01,"response":"HOLD"}]',
      },
      {
        key: "driftDetectionPlan",
        label: "Drift detection plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe behavior, data, population, context, performance, and provider drift detection.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "incidentResponsePlan",
        label: "Incident response and restriction plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe containment, suspension, rollback, notification, correction, re-evaluation, and preservation.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "retirementCriteria",
        label: "Restriction and retirement criteria",
        type: "json",
        required: true,
        placeholder:
          '["unresolved critical failure","provider withdrawal","material unbounded drift","expired approval"]',
      },
    ],
  },
  {
    sectionId: "records-replay",
    title: "Records, Validity, and Replay",
    description:
      "Define the preserved evaluation record, validity window, challenge route, and mandatory replay triggers.",
    order: 70,
    fields: [
      {
        key: "recordPlan",
        label: "Evaluation record preservation plan",
        type: "json",
        required: true,
        placeholder:
          '["DECLARED_GOVERNANCE_CLAIM","TEST_CONFIGURATION","OBSERVED_TEST_RESULT","TA14_BOUNDED_DETERMINATION"]',
      },
      {
        key: "evaluationValidityWindow",
        label: "Evaluation validity window",
        type: "text",
        required: true,
        placeholder:
          "Valid for 90 days or until any material model, data, prompt, tool, provider, or environment change",
        validation: { minLength: 3, maxLength: 600 },
      },
      {
        key: "replayTriggers",
        label: "Mandatory replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["model version change","prompt change","dataset change","provider change","threshold change","new affected population","material incident"]',
      },
      {
        key: "challengeProcess",
        label: "Challenge and counterevidence process",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how findings may be challenged, how counterevidence is preserved, and who resolves the dispute.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how the current deployed model is continuously matched to the approved evaluation boundary.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const MODEL_EVALUATION_SCENARIOS = [
  {
    scenarioId: "MODEL-BASELINE-ALLOW",
    laneId: "model-evaluation",
    title: "Approved model evaluation baseline",
    description:
      "The identified model, version, use, datasets, methods, thresholds, authority, monitoring, and records are complete and current.",
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
    scenarioId: "MODEL-VERSION-MISMATCH",
    laneId: "model-evaluation",
    title: "Deployed model version differs from evaluated version",
    description:
      "The model presented for use does not match the exact model artifact or hosted version that was evaluated.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-VERSION-MISMATCH-I01",
        title: "Change model version",
        description:
          "Replace the evaluated model version with a materially different version.",
        mutationType: "CHANGE_MODEL",
        target: "modelVersion",
        value: "unevaluated-version",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Block use of the unevaluated model version.",
      "Preserve the mismatch record.",
      "Evaluate the new version before release.",
    ],
  },
  {
    scenarioId: "MODEL-OUT-OF-SCOPE-USE",
    laneId: "model-evaluation",
    title: "Model used outside the evaluated purpose",
    description:
      "A model evaluated for one task, population, language, or environment is proposed for a materially different use.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-OUT-OF-SCOPE-USE-I01",
        title: "Change intended use",
        description:
          "Alter the requested model use beyond the declared evaluation boundary.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "intendedUses",
        value: "outside-evaluated-use",
      },
    ],
    expectedGateStatuses: {
      G02_GOVERNANCE_CLAIM: "FAIL",
      G03_SCOPE_BOUNDARY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Return the use to the evaluated boundary or create a new evaluation route.",
      "Obtain approval appropriate to the expanded use.",
    ],
  },
  {
    scenarioId: "MODEL-EVALUATION-DATASET-CHANGED",
    laneId: "model-evaluation",
    title: "Evaluation dataset changes after approval",
    description:
      "A benchmark or evaluation dataset is replaced, altered, or reweighted after the original determination.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVALUATION-DATASET-CHANGED-I01",
        title: "Change evaluation dataset",
        description:
          "Replace the approved evaluation dataset with a materially different dataset.",
        mutationType: "CHANGE_DATA",
        target: "evaluationDatasets",
        value: "unapproved-evaluation-dataset",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Preserve the original and changed dataset records.",
      "Re-run affected evaluations.",
      "Issue a new bounded determination.",
    ],
  },
  {
    scenarioId: "MODEL-CRITICAL-THRESHOLD-FAILURE",
    laneId: "model-evaluation",
    title: "Critical evaluation threshold fails",
    description:
      "The model fails a mandatory safety, robustness, fairness, reliability, or task-performance threshold.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-CRITICAL-THRESHOLD-FAILURE-I01",
        title: "Fail mandatory threshold",
        description:
          "Alter an observed evaluation result so a mandatory threshold is not met.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "metricsAndThresholds",
        value: "mandatory-threshold-failed",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "PASS",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Restrict release or use.",
      "Correct the model, method, or use boundary.",
      "Repeat the failed evaluation.",
    ],
  },
  {
    scenarioId: "MODEL-EVIDENCE-CONFLICT",
    laneId: "model-evaluation",
    title: "Independent evaluations materially conflict",
    description:
      "Two current and credible evaluation records reach materially different findings about the same model and use.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-EVIDENCE-CONFLICT-I01",
        title: "Create evaluation conflict",
        description:
          "Introduce a second valid evaluation result that contradicts a material finding.",
        mutationType: "CREATE_EVIDENCE_CONFLICT",
        target: "evaluationMethods",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "ESCALATED",
      G06_AUTHORITY_VALIDITY: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Preserve both evaluation records.",
      "Assign an authorized independent reviewer.",
      "Resolve or explicitly bound the disagreement.",
    ],
  },
  {
    scenarioId: "MODEL-HUMAN-REVIEW-INEFFECTIVE",
    laneId: "model-evaluation",
    title: "Required human review is not operational",
    description:
      "Human review is declared, but reviewers lack qualification, access, time, authority, or intervention capability.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-HUMAN-REVIEW-INEFFECTIVE-I01",
        title: "Block meaningful human review",
        description:
          "Prevent the designated reviewer from inspecting or restricting the model.",
        mutationType: "BLOCK_HUMAN_INTERVENTION",
        target: "humanReviewPlan",
      },
    ],
    expectedGateStatuses: {
      G09_HUMAN_OVERSIGHT: "FAIL",
      G11_INTERVENTION_ESCALATION: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Provide qualified reviewers with timely access and real intervention authority.",
      "Test the review and restriction process.",
    ],
  },
  {
    scenarioId: "MODEL-PRODUCTION-DRIFT",
    laneId: "model-evaluation",
    title: "Production behavior materially drifts",
    description:
      "Observed production behavior, inputs, populations, or performance materially departs from the evaluated boundary.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "MODEL-PRODUCTION-DRIFT-I01",
        title: "Introduce material model drift",
        description:
          "Alter production behavior or context beyond the declared monitoring threshold.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "driftDetectionPlan",
        value: "material-drift-detected",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Restrict or suspend affected use.",
      "Preserve drift evidence.",
      "Re-evaluate the current model and context.",
    ],
  },
  {
    scenarioId: "MODEL-RECOVERY-REPLAY",
    laneId: "model-evaluation",
    title: "Corrected model evaluation and replay",
    description:
      "A prior failed or held evaluation is corrected, preserved, repeated, and issued as a new determination.",
    scenarioClass: "RECOVERY",
    required: true,
    preconditions: [],
    injections: [],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "PASS",
      G03_SCOPE_BOUNDARY: "PASS",
      G05_EVIDENCE_SUFFICIENCY: "PASS",
      G06_AUTHORITY_VALIDITY: "PASS",
      G07_RULE_CONTROL_BINDING: "PASS",
      G08_DEPENDENCY_INTEGRITY: "PASS",
      G09_HUMAN_OVERSIGHT: "PASS",
      G10_EXECUTION_CONSTRAINT: "PASS",
      G12_RECORD_CONTINUITY: "PASS",
      G14_REPLAY_CONTINUING_VALIDITY: "PASS",
    },
    expectedDetermination: "ALLOW",
    recoveryRequirements: [
      "Preserve the original determination and failed findings.",
      "Link the corrected evaluation to the prior version.",
      "Issue a new determination without editing the prior record.",
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
    "Test whether a specific model, version, use, evaluation method, threshold, approval, monitoring plan, and continuing-validity claim remain bounded and supported.",
  claimsGoverned: [
    "The exact model and version under evaluation are identified.",
    "The model is evaluated only for declared tasks, populations, environments, and use boundaries.",
    "Evaluation methods, datasets, metrics, and thresholds are explicit and reviewable.",
    "Release authority is valid and bounded.",
    "Material model, data, prompt, provider, environment, or use changes invalidate prior approval until replay.",
    "Production monitoring and human intervention are operational where required.",
    "Evaluation findings, limitations, conflicts, corrections, and supersession remain preserved.",
  ],
  nonClaims: [
    "This lane does not prove that every model output is true, safe, fair, or lawful.",
    "This lane does not independently prove training-data ownership, privacy compliance, cybersecurity, or runtime enforcement.",
    "Passing an evaluation does not authorize use outside the tested model, version, purpose, population, language, environment, threshold, or validity period.",
    "This lane does not prove downstream outcome causation.",
    "An ALLOW determination applies only to the preserved evidence, methods, thresholds, dependencies, authority, context, and evaluator version tested.",
  ],
  sections: MODEL_EVALUATION_SECTIONS,
  gateIds: MODEL_EVALUATION_GATE_IDS,
  evidenceTypes: [...MODEL_EVALUATION_EVIDENCE_TYPES],
  scenarioIds: MODEL_EVALUATION_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when the model identity, version, or proposed use falls outside the evaluated and authorized boundary.",
    "ESCALATE when material evaluation evidence, authority, or interpretation conflicts require independent judgment.",
    "HOLD when mandatory evaluation evidence, thresholds, monitoring, oversight, change control, or replay requirements remain incomplete or failed.",
    "ALLOW only when all applicable mandatory gates pass and all required scenarios demonstrate the expected bounded behavior.",
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
