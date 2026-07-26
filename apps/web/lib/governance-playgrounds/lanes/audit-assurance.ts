import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Audit & Assurance Governance Playground
 *
 * Tests whether a governance determination can be independently verified,
 * reproduced, challenged, remediated, and continuously revalidated from
 * preserved evidence.
 */

export const AUDIT_ASSURANCE_GATE_IDS = [
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

export const AUDIT_ASSURANCE_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "AUDIT_ROUTE_IDENTITY",
  "AUDIT_SCOPE_RECORD",
  "AUDIT_OBJECTIVE_RECORD",
  "AUDIT_CRITERIA_RECORD",
  "AUDITOR_IDENTITY_RECORD",
  "AUDITOR_INDEPENDENCE_RECORD",
  "AUDITOR_AUTHORITY_RECORD",
  "EVIDENCE_INVENTORY_RECORD",
  "SAMPLING_PLAN_RECORD",
  "SAMPLING_RESULT_RECORD",
  "CHAIN_OF_CUSTODY_RECORD",
  "RECORD_INTEGRITY_RECORD",
  "AUDIT_PROCEDURE_RECORD",
  "REPERFORMANCE_RECORD",
  "CONTROL_TEST_RECORD",
  "FINDING_RECORD",
  "EXCEPTION_RECORD",
  "ROOT_CAUSE_RECORD",
  "ASSURANCE_OPINION_RECORD",
  "CORRECTIVE_ACTION_RECORD",
  "REMEDIATION_VERIFICATION_RECORD",
  "FOLLOW_UP_RECORD",
  "ESCALATION_RECORD",
  "CONTINUOUS_ASSURANCE_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "REPLAY_RESULT",
] as const;

export type AuditAssuranceEvidenceType =
  (typeof AUDIT_ASSURANCE_EVIDENCE_TYPES)[number];

export const AUDIT_ASSURANCE_SECTIONS = [
  {
    sectionId: "audit-route-identity",
    title: "Audit Route Identity",
    description:
      "Identify the exact governance route, system, decision, action, audit owner, reviewer, environment, and period under assurance review.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Audit route title",
        type: "text",
        required: true,
        placeholder: "Independent assurance review of autonomous payment governance",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Audit route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the subject of the audit, the governance determination being tested, the assurance objective, and the consequence of an unsupported opinion.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "auditRouteIdentifier",
        label: "Stable audit route identifier",
        type: "text",
        required: true,
        placeholder: "audit:payments:2026-00188",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "subjectSystem",
        label: "System or process under audit",
        type: "text",
        required: true,
        placeholder: "Autonomous Accounts Payable Service",
        validation: { minLength: 2, maxLength: 300 },
      },
      {
        key: "subjectDecisionOrAction",
        label: "Decision or action under audit",
        type: "textarea",
        required: true,
        placeholder:
          "Pre-execution authorization of vendor payments above the declared approval threshold.",
        validation: { minLength: 10, maxLength: 3000 },
      },
      {
        key: "auditOwner",
        label: "Audit owner",
        type: "text",
        required: true,
        placeholder: "Internal Audit",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "leadAuditor",
        label: "Lead auditor or reviewer",
        type: "text",
        required: true,
        placeholder: "Independent Assurance Lead",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "environment",
        label: "Environment reviewed",
        type: "select",
        required: true,
        options: [
          { value: "simulation", label: "Simulation" },
          { value: "sandbox", label: "Sandbox" },
          { value: "staging", label: "Staging" },
          { value: "production", label: "Production" },
          { value: "mixed", label: "Mixed environments" },
        ],
      },
      {
        key: "auditPeriod",
        label: "Audit period",
        type: "json",
        required: true,
        placeholder:
          '{"start":"2026-01-01T00:00:00Z","end":"2026-06-30T23:59:59Z"}',
      },
    ],
  },
  {
    sectionId: "scope-criteria-independence",
    title: "Audit Scope, Criteria, and Independence",
    description:
      "Define the audit objective, scope, criteria, standards, assertions, materiality, exclusions, and reviewer independence.",
    order: 20,
    fields: [
      {
        key: "auditObjective",
        label: "Audit objective",
        type: "textarea",
        required: true,
        placeholder:
          "Determine whether the governance route operated as designed and whether the resulting determinations are reproducible from preserved evidence.",
        validation: { minLength: 20, maxLength: 4000 },
      },
      {
        key: "inScope",
        label: "In-scope subjects",
        type: "textarea",
        required: true,
        placeholder:
          "Identify included systems, decisions, controls, actors, records, executions, outcomes, periods, locations, and dependencies.",
        validation: { minLength: 10, maxLength: 5000 },
      },
      {
        key: "outOfScope",
        label: "Out-of-scope subjects",
        type: "textarea",
        required: true,
        placeholder:
          "Identify excluded systems, processes, periods, locations, records, legal conclusions, and assurance limitations.",
        validation: { minLength: 10, maxLength: 5000 },
      },
      {
        key: "auditCriteria",
        label: "Audit criteria",
        type: "json",
        required: true,
        placeholder:
          '[{"criterionId":"CRIT-001","source":"TA-14 runtime gate requirements","version":"1.0"},{"criterionId":"CRIT-002","source":"enterprise payment policy","version":"4.2"}]',
      },
      {
        key: "assuranceStandards",
        label: "Assurance standards or methodology",
        type: "json",
        required: true,
        placeholder:
          '["independence","evidence sufficiency","traceability","reperformance","materiality","preserved findings"]',
      },
      {
        key: "managementAssertions",
        label: "Management or system assertions",
        type: "json",
        required: true,
        placeholder:
          '["controls operated as designed","records are complete","execution matched authorization","outcomes remained within scope"]',
      },
      {
        key: "materialityThresholds",
        label: "Materiality thresholds",
        type: "json",
        required: true,
        placeholder:
          '[{"category":"control failure","threshold":"any preventive-control bypass"},{"category":"record omission","threshold":"any missing mandatory evidence"}]',
      },
      {
        key: "auditorIndependence",
        label: "Auditor independence assessment",
        type: "textarea",
        required: true,
        placeholder:
          "Describe organizational, financial, operational, personal, and system-development relationships that could impair independence.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "conflictsOfInterest",
        label: "Conflicts of interest",
        type: "json",
        required: true,
        placeholder:
          '[{"conflict":"none identified","mitigation":"not applicable"}]',
      },
    ],
  },
  {
    sectionId: "evidence-traceability",
    title: "Evidence, Sampling, and Traceability",
    description:
      "Establish the evidence population, completeness, chain of custody, sampling method, integrity controls, and traceability from claim to conclusion.",
    order: 30,
    fields: [
      {
        key: "evidenceInventory",
        label: "Evidence inventory",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceId":"EV-001","type":"runtime decision record","source":"governance engine","period":"2026-Q1"},{"evidenceId":"EV-002","type":"execution receipt","source":"payment service","period":"2026-Q1"}]',
      },
      {
        key: "evidencePopulation",
        label: "Evidence population",
        type: "json",
        required: true,
        placeholder:
          '{"populationDescription":"all governed payments above $25,000","populationSize":842,"completenessBasis":"system export reconciled to ledger"}',
      },
      {
        key: "samplingPlan",
        label: "Sampling plan",
        type: "json",
        required: true,
        placeholder:
          '{"method":"risk-based stratified sample","sampleSize":84,"strata":["high-value","exception","random"],"seed":"audit-2026-00188"}',
      },
      {
        key: "samplingRationale",
        label: "Sampling rationale",
        type: "textarea",
        required: true,
        placeholder:
          "Explain why the selected sample supports the audit objective, materiality, population characteristics, and risk profile.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "chainOfCustody",
        label: "Evidence chain of custody",
        type: "json",
        required: true,
        placeholder:
          '[{"evidenceId":"EV-001","collectedBy":"auditor-1","collectedAt":"2026-07-12T10:00:00Z","hash":"sha256:...","sourceSystem":"governance-engine"}]',
      },
      {
        key: "recordIntegrityControls",
        label: "Record integrity controls",
        type: "json",
        required: true,
        placeholder:
          '["cryptographic hashes","signed exports","append-only storage","access logs","correction records","retention controls"]',
      },
      {
        key: "completenessAssessment",
        label: "Evidence completeness assessment",
        type: "textarea",
        required: true,
        placeholder:
          "Describe reconciliation, missing-record analysis, duplicate detection, population tie-out, and excluded evidence.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "traceabilityMatrix",
        label: "Claim-to-evidence traceability matrix",
        type: "json",
        required: true,
        placeholder:
          '[{"assertion":"controls operated as designed","criteria":["CRIT-001"],"evidence":["EV-001","EV-003"],"procedure":"PROC-001"}]',
      },
    ],
  },
  {
    sectionId: "audit-procedures-reperformance",
    title: "Audit Procedures and Reperformance",
    description:
      "Define the inspection, inquiry, observation, testing, recalculation, reperformance, and contradiction-handling procedures used to support the opinion.",
    order: 40,
    fields: [
      {
        key: "auditProcedures",
        label: "Audit procedures",
        type: "json",
        required: true,
        placeholder:
          '[{"procedureId":"PROC-001","type":"reperformance","objective":"reproduce governance determination"},{"procedureId":"PROC-002","type":"inspection","objective":"verify execution receipt"}]',
      },
      {
        key: "inspectionProcedures",
        label: "Inspection procedures",
        type: "textarea",
        required: true,
        placeholder:
          "Describe which records, configurations, approvals, logs, and execution receipts will be inspected.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "inquiryProcedures",
        label: "Inquiry procedures",
        type: "textarea",
        required: true,
        placeholder:
          "Describe interviews, responsible actors, corroboration requirements, and limitations of inquiry evidence.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "observationProcedures",
        label: "Observation procedures",
        type: "textarea",
        required: true,
        placeholder:
          "Describe direct observation of control operation, human oversight, exception handling, and evidence preservation.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "reperformancePlan",
        label: "Reperformance plan",
        type: "json",
        required: true,
        placeholder:
          '[{"sampleId":"S-001","routeId":"route-418","expectedDetermination":"HOLD","requiredEvidence":["EV-001","EV-002"]}]',
      },
      {
        key: "reperformanceResults",
        label: "Reperformance results",
        type: "json",
        required: true,
        placeholder:
          '[{"sampleId":"S-001","result":"matched","observedDetermination":"HOLD","variance":null}]',
      },
      {
        key: "controlTesting",
        label: "Control testing",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"CTRL-AUTH-01","test":"invalid authority is blocked","result":"pass"},{"controlId":"CTRL-BEN-02","test":"unverified beneficiary produces HOLD","result":"pass"}]',
      },
      {
        key: "contradictionProcedure",
        label: "Contradictory evidence procedure",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how conflicting evidence is preserved, investigated, escalated, and reflected in the assurance conclusion.",
        validation: { minLength: 20, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "findings-opinion",
    title: "Findings, Exceptions, and Assurance Opinion",
    description:
      "Record findings, exceptions, severity, root cause, affected population, management response, and the bounded assurance opinion.",
    order: 50,
    fields: [
      {
        key: "findings",
        label: "Audit findings",
        type: "json",
        required: true,
        placeholder:
          '[{"findingId":"F-001","criterion":"CRIT-001","condition":"missing execution receipt","severity":"high","affectedPopulation":3}]',
      },
      {
        key: "exceptions",
        label: "Exceptions and deviations",
        type: "json",
        required: true,
        placeholder:
          '[{"exceptionId":"EXC-001","sampleId":"S-014","condition":"control evidence unavailable","disposition":"open"}]',
      },
      {
        key: "severityMethod",
        label: "Finding severity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how consequence, likelihood, control importance, population impact, recurrence, and regulatory significance determine severity.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "rootCauseAnalysis",
        label: "Root-cause analysis",
        type: "json",
        required: true,
        placeholder:
          '[{"findingId":"F-001","rootCause":"execution system did not require receipt persistence","contributingFactors":["configuration drift"]}]',
      },
      {
        key: "affectedPopulationAssessment",
        label: "Affected population assessment",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how sampled exceptions were projected, bounded, or expanded to the full population.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "managementResponse",
        label: "Management response",
        type: "json",
        required: true,
        placeholder:
          '[{"findingId":"F-001","response":"accepted","owner":"payments-platform","targetDate":"2026-08-31"}]',
      },
      {
        key: "assuranceOpinion",
        label: "Assurance opinion",
        type: "select",
        required: true,
        options: [
          { value: "reasonable-assurance", label: "Reasonable assurance" },
          { value: "limited-assurance", label: "Limited assurance" },
          { value: "qualified", label: "Qualified assurance" },
          { value: "adverse", label: "Adverse conclusion" },
          { value: "disclaimer", label: "Disclaimer of conclusion" },
        ],
      },
      {
        key: "opinionBasis",
        label: "Basis for assurance opinion",
        type: "textarea",
        required: true,
        placeholder:
          "Explain the evidence, procedures, limitations, findings, materiality, and unresolved matters supporting the opinion.",
        validation: { minLength: 20, maxLength: 7000 },
      },
    ],
  },
  {
    sectionId: "remediation-follow-up",
    title: "Corrective Action, Verification, and Follow-up",
    description:
      "Bind findings to accountable remediation, due dates, independent verification, retesting, escalation, and closure criteria.",
    order: 60,
    fields: [
      {
        key: "correctiveActions",
        label: "Corrective actions",
        type: "json",
        required: true,
        placeholder:
          '[{"actionId":"CA-001","findingId":"F-001","owner":"payments-platform","action":"enforce execution receipt persistence","dueDate":"2026-08-31"}]',
      },
      {
        key: "remediationOwners",
        label: "Remediation owners",
        type: "json",
        required: true,
        placeholder:
          '[{"actionId":"CA-001","owner":"payments-platform-lead","authority":"system change owner"}]',
      },
      {
        key: "verificationPlan",
        label: "Remediation verification plan",
        type: "json",
        required: true,
        placeholder:
          '[{"actionId":"CA-001","verification":"inspect deployment and reperform 20 transactions","reviewer":"internal-audit"}]',
      },
      {
        key: "retestResults",
        label: "Retest results",
        type: "json",
        required: true,
        placeholder:
          '[{"actionId":"CA-001","result":"pass","testedAt":"2026-09-05T14:00:00Z","evidence":["RET-001"]}]',
      },
      {
        key: "closureCriteria",
        label: "Finding closure criteria",
        type: "textarea",
        required: true,
        placeholder:
          "Describe required implementation, operating period, evidence, independent verification, residual risk, and approval for closure.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "outstandingIssues",
        label: "Outstanding issues",
        type: "json",
        required: true,
        placeholder:
          '[{"findingId":"F-002","status":"open","reason":"remediation not yet tested"}]',
      },
      {
        key: "escalationConditions",
        label: "Escalation conditions",
        type: "json",
        required: true,
        placeholder:
          '["missed remediation date","failed retest","repeated finding","management disagreement","critical uncorrected issue"]',
      },
      {
        key: "followUpSchedule",
        label: "Follow-up schedule",
        type: "json",
        required: true,
        placeholder:
          '[{"reviewDate":"2026-09-05","scope":"CA-001 retest"},{"reviewDate":"2026-10-01","scope":"all open findings"}]',
      },
    ],
  },
  {
    sectionId: "continuous-assurance-replay",
    title: "Continuous Assurance, Outcomes, and Replay",
    description:
      "Preserve the audit route, monitor material change, compare actual outcomes to the assurance conclusion, and repeat independent verification when continuing validity changes.",
    order: 70,
    fields: [
      {
        key: "auditRecordBinding",
        label: "Audit record binding",
        type: "json",
        required: true,
        placeholder:
          '{"auditId":"audit:payments:2026-00188","criteriaVersion":"1.0","evidenceHash":"sha256:...","opinion":"qualified"}',
      },
      {
        key: "continuousAssurancePlan",
        label: "Continuous assurance plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe automated monitoring, periodic independent review, evidence refresh, exception detection, and opinion renewal.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "continuousAssuranceSignals",
        label: "Continuous assurance signals",
        type: "json",
        required: true,
        placeholder:
          '["control change","policy change","model change","data change","evidence gap","new exception","incident","failed remediation","execution mismatch","outcome mismatch"]',
      },
      {
        key: "requiredRecords",
        label: "Required preserved records",
        type: "json",
        required: true,
        placeholder:
          '["AUDIT_SCOPE_RECORD","AUDIT_CRITERIA_RECORD","AUDITOR_INDEPENDENCE_RECORD","EVIDENCE_INVENTORY_RECORD","SAMPLING_PLAN_RECORD","AUDIT_PROCEDURE_RECORD","FINDING_RECORD","ASSURANCE_OPINION_RECORD","REMEDIATION_VERIFICATION_RECORD","REPLAY_RESULT"]',
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
            ruleId: "AUDIT-ASSURANCE-EXECUTION-01",
            description: "Required when audited execution has occurred.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"exec-418","auditBinding":"sha256:...","status":"completed"}',
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
            ruleId: "AUDIT-ASSURANCE-OUTCOME-01",
            description: "Required when outcome evidence is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe whether actual execution, control performance, incidents, and outcomes remained consistent with the assurance opinion.",
        validation: { maxLength: 5000 },
      },
      {
        key: "replayTriggers",
        label: "Audit replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["criteria change","scope change","auditor conflict","evidence change","control change","new finding","failed remediation","incident","execution mismatch","outcome mismatch"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing assurance method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how independence, scope, criteria, evidence, sampling, procedures, findings, remediation, execution, and outcomes are revalidated.",
        validation: { minLength: 20, maxLength: 6000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const AUDIT_ASSURANCE_SCENARIOS = [
  {
    scenarioId: "AUDIT-ASSURANCE-BASELINE-ALLOW",
    laneId: "outcome-assurance",
    title: "Independent reproducible assurance baseline",
    description:
      "An independent auditor can reproduce the governance determination from complete, traceable, and preserved evidence.",
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
    scenarioId: "AUDIT-ASSURANCE-MISSING-EVIDENCE",
    laneId: "outcome-assurance",
    title: "Mandatory audit evidence missing",
    description:
      "A mandatory record required to support the audit conclusion is unavailable.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-MISSING-EVIDENCE-I01",
        title: "Remove mandatory evidence",
        description:
          "Remove a required audit evidence record.",
        mutationType: "REMOVE_EVIDENCE",
        target: "EVIDENCE_INVENTORY_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Locate or validly reproduce the missing evidence.",
      "Preserve the evidence gap and its effect on the opinion.",
      "Repeat affected procedures.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-BROKEN-CHAIN-OF-CUSTODY",
    laneId: "outcome-assurance",
    title: "Broken evidence chain of custody",
    description:
      "Evidence cannot be reliably linked from source collection through audit use and preservation.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-BROKEN-CHAIN-OF-CUSTODY-I01",
        title: "Alter custody record",
        description:
          "Modify the evidence custody record so source, collector, timestamp, or hash no longer reconciles.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "chainOfCustody",
        value: "custody-break",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Re-establish source integrity where possible.",
      "Exclude evidence that cannot be authenticated.",
      "Reperform affected procedures.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-SAMPLING-FAILURE",
    laneId: "outcome-assurance",
    title: "Sampling method unsupported",
    description:
      "The sample is biased, incomplete, too small, or disconnected from the declared population and materiality.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-SAMPLING-FAILURE-I01",
        title: "Alter sampling plan",
        description:
          "Replace the approved sample with an unsupported selection.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "samplingPlan",
        value: "unsupported-sample",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Define the complete population.",
      "Select a supportable sample.",
      "Repeat sampling and projection procedures.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-EVIDENCE-CONFLICT",
    laneId: "outcome-assurance",
    title: "Conflicting audit evidence",
    description:
      "Material evidence supports incompatible conclusions about control operation, execution, or outcome.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-EVIDENCE-CONFLICT-I01",
        title: "Create evidence conflict",
        description:
          "Introduce conflicting evidence for the same audited assertion.",
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
      "Investigate source, timing, scope, and authority.",
      "Qualify, revise, or disclaim the opinion if unresolved.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-INDEPENDENCE-VIOLATION",
    laneId: "outcome-assurance",
    title: "Auditor independence impaired",
    description:
      "The reviewer participated in designing, operating, approving, or financially benefiting from the audited control or route.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-INDEPENDENCE-VIOLATION-I01",
        title: "Alter auditor relationship",
        description:
          "Add a material conflict that impairs auditor independence.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "auditorIndependence",
        value: "material-independence-conflict",
      },
    ],
    expectedGateStatuses: {
      G04_ACTOR_IDENTITY: "PASS",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Remove the impaired reviewer.",
      "Assign an independent auditor.",
      "Repeat affected procedures and opinion issuance.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-INCORRECT-CRITERIA",
    laneId: "outcome-assurance",
    title: "Incorrect audit criteria applied",
    description:
      "The audit uses criteria that are superseded, irrelevant, incomplete, or outside the declared scope.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-INCORRECT-CRITERIA-I01",
        title: "Alter audit criteria",
        description:
          "Replace the approved audit criteria with an incorrect version.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "auditCriteria",
        value: "incorrect-or-superseded-criteria",
      },
    ],
    expectedGateStatuses: {
      G02_GOVERNANCE_CLAIM: "FAIL",
      G03_SCOPE_BOUNDARY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Identify current applicable criteria.",
      "Reperform affected procedures.",
      "Reissue the opinion if materially changed.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-CONTROL-NOT-REPRODUCIBLE",
    laneId: "outcome-assurance",
    title: "Control determination cannot be reproduced",
    description:
      "The auditor cannot obtain the same determination from the preserved inputs, rules, authority, and control configuration.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-CONTROL-NOT-REPRODUCIBLE-I01",
        title: "Create execution mismatch",
        description:
          "Produce a reperformance result that differs from the preserved governance determination.",
        mutationType: "CREATE_EXECUTION_MISMATCH",
        target: "reperformanceResults",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Identify the source of non-reproducibility.",
      "Preserve both original and reperformed results.",
      "Correct configuration, evidence, or rules and repeat testing.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-REMEDIATION-MISSING",
    laneId: "outcome-assurance",
    title: "Material finding lacks remediation",
    description:
      "A material finding remains open without an accountable owner, corrective action, due date, or escalation.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-REMEDIATION-MISSING-I01",
        title: "Remove corrective action evidence",
        description:
          "Remove the remediation record for a material finding.",
        mutationType: "REMOVE_EVIDENCE",
        target: "CORRECTIVE_ACTION_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G09_HUMAN_OVERSIGHT: "FAIL",
      G11_INTERVENTION_ESCALATION: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Assign an accountable remediation owner.",
      "Define due date, verification, and closure criteria.",
      "Escalate overdue material findings.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-FAILED-RETEST",
    laneId: "outcome-assurance",
    title: "Remediation retest failed",
    description:
      "Corrective action was declared complete, but independent retesting shows the control or record defect persists.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-FAILED-RETEST-I01",
        title: "Create outcome mismatch",
        description:
          "Provide retest evidence showing remediation did not achieve the declared result.",
        mutationType: "CREATE_OUTCOME_MISMATCH",
        target: "retestResults",
      },
    ],
    expectedGateStatuses: {
      G09_HUMAN_OVERSIGHT: "FAIL",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Reopen the finding.",
      "Revise root-cause analysis and corrective action.",
      "Retest independently before closure.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-OUTCOME-MISMATCH",
    laneId: "outcome-assurance",
    title: "Outcome contradicts assurance opinion",
    description:
      "Subsequent execution or outcome evidence materially contradicts the issued assurance conclusion.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-OUTCOME-MISMATCH-I01",
        title: "Create assurance outcome mismatch",
        description:
          "Provide outcome evidence inconsistent with the assurance opinion.",
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
      "Assess whether the opinion must be withdrawn, qualified, or reissued.",
      "Expand testing to affected populations.",
      "Preserve the contradiction and notify relying parties where required.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-AUDIT-DRIFT",
    laneId: "outcome-assurance",
    title: "Audit scope or evidence drift",
    description:
      "The audited system, criteria, controls, data, or evidence population changes after opinion issuance.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-AUDIT-DRIFT-I01",
        title: "Alter audited subject",
        description:
          "Change the system or control configuration beyond the audited scope.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "subjectSystem",
        value: "materially-changed-system",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G03_SCOPE_BOUNDARY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Define the changed audit population and criteria.",
      "Perform targeted or full reassessment.",
      "Issue a new assurance record.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-EVIDENCE-EXPIRED",
    laneId: "outcome-assurance",
    title: "Assurance evidence expired",
    description:
      "A time-bounded audit, test, certification, or remediation-verification record is no longer current.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "AUDIT-ASSURANCE-EVIDENCE-EXPIRED-I01",
        title: "Expire assurance evidence",
        description:
          "Expire a required assurance or remediation-verification record.",
        mutationType: "EXPIRE_EVIDENCE",
        target: "REMEDIATION_VERIFICATION_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Refresh the affected evidence.",
      "Repeat required tests or verification.",
      "Reissue continuing-assurance status.",
    ],
  },
  {
    scenarioId: "AUDIT-ASSURANCE-RECOVERY-REPLAY",
    laneId: "outcome-assurance",
    title: "Corrected audit recovery and replay",
    description:
      "A prior assurance failure is corrected, independently verified, preserved, and replayed without altering the original record.",
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
      "Preserve the original finding, failed opinion, or evidence gap.",
      "Link remediation, independent verification, and retest evidence.",
      "Issue a new replay and assurance result rather than modifying the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type AuditAssuranceScenario =
  (typeof AUDIT_ASSURANCE_SCENARIOS)[number];

export const AUDIT_ASSURANCE_LANE = {
  laneId: "outcome-assurance",
  name: "Audit & Assurance Governance Playground",
  shortName: "Audit & Assurance",
  description:
    "Test whether governance claims, evidence, controls, execution, outcomes, findings, remediation, and assurance conclusions can be independently verified, reproduced, challenged, preserved, and replayed.",
  claimsGoverned: [
    "The exact audited system, decision, action, environment, period, and assurance objective are identified.",
    "Audit scope, criteria, standards, materiality, assertions, and exclusions are explicit.",
    "Auditor identity, authority, competence, and independence are supported.",
    "The evidence population is complete, traceable, sampled through a supportable method, and preserved through chain of custody.",
    "Audit procedures are sufficient to inspect, observe, inquire, test, recalculate, and reperform the governance determination.",
    "Contradictory evidence is preserved and reflected in findings and the opinion.",
    "Findings are linked to criteria, evidence, severity, root cause, affected population, and management response.",
    "Corrective actions are assigned, tested, independently verified, and closed only against declared criteria.",
    "The assurance opinion is bounded to the exact scope, criteria, period, evidence, procedures, and limitations reviewed.",
    "Material change, failed remediation, execution mismatch, or outcome contradiction invalidates continuing reliance until replay.",
  ],
  nonClaims: [
    "This lane does not guarantee that an audit will detect every error, fraud, omission, or control failure.",
    "This lane does not treat management inquiry alone as sufficient evidence.",
    "This lane does not permit an auditor to assure work where independence is materially impaired.",
    "This lane does not convert incomplete or unauthenticated records into admissible evidence.",
    "An ALLOW determination applies only to the exact audit scope, criteria, evidence population, procedures, independence conditions, findings, remediation state, and validity window preserved.",
  ],
  sections: AUDIT_ASSURANCE_SECTIONS,
  gateIds: AUDIT_ASSURANCE_GATE_IDS,
  evidenceTypes: [...AUDIT_ASSURANCE_EVIDENCE_TYPES],
  scenarioIds: AUDIT_ASSURANCE_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when auditor independence is materially impaired, the governance determination cannot be reproduced, or an assurance opinion is knowingly issued against contradictory evidence.",
    "ESCALATE when material evidence conflicts, management disputes material findings, or unresolved limitations require superior independent review.",
    "HOLD when scope, criteria, evidence, sampling, custody, procedures, findings, remediation, retesting, outcome correspondence, or replay requirements are incomplete, expired, or drifted.",
    "ALLOW only when all applicable assurance gates pass and required scenarios demonstrate independent authority, sufficient traceable evidence, reproducible procedures, bounded findings, verified remediation, and continuing assurance validity.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getAuditAssuranceScenario(
  scenarioId: string,
): AuditAssuranceScenario | undefined {
  return AUDIT_ASSURANCE_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
