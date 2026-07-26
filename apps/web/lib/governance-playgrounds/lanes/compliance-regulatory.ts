import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Compliance & Regulatory Governance Playground
 *
 * Tests whether the declared system, decision, action, and execution route are
 * mapped to the correct regulatory obligations, supported by current evidence,
 * constrained by enforceable controls, and continuously replayable.
 */

export const COMPLIANCE_REGULATORY_GATE_IDS = [
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

export const COMPLIANCE_REGULATORY_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "REGULATORY_ROUTE_IDENTITY",
  "JURISDICTION_RECORD",
  "ENTITY_ROLE_RECORD",
  "APPLICABILITY_ASSESSMENT",
  "REGULATORY_SOURCE_RECORD",
  "OBLIGATION_MAPPING_RECORD",
  "REGULATORY_AUTHORITY_RECORD",
  "CONFORMITY_ASSESSMENT_RECORD",
  "CERTIFICATION_RECORD",
  "REGISTRATION_RECORD",
  "LICENSE_RECORD",
  "TECHNICAL_DOCUMENTATION_RECORD",
  "RISK_MANAGEMENT_RECORD",
  "HUMAN_OVERSIGHT_RECORD",
  "TRANSPARENCY_NOTICE_RECORD",
  "LOGGING_RECORD",
  "POST_MARKET_MONITORING_RECORD",
  "INCIDENT_REPORTING_RECORD",
  "EXEMPTION_RECORD",
  "DEROGATION_RECORD",
  "REGULATORY_CHANGE_RECORD",
  "AUDIT_RECORD",
  "ENFORCEMENT_ACTION_RECORD",
  "RUNTIME_COMPLIANCE_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "REMEDIATION_RECORD",
  "REPLAY_RESULT",
] as const;

export type ComplianceRegulatoryEvidenceType =
  (typeof COMPLIANCE_REGULATORY_EVIDENCE_TYPES)[number];

export const COMPLIANCE_REGULATORY_SECTIONS = [
  {
    sectionId: "regulatory-route-identity",
    title: "Regulatory Route Identity",
    description:
      "Identify the exact system, model, decision, action, environment, organization, affected parties, and regulated activity under review.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Regulatory route title",
        type: "text",
        required: true,
        placeholder: "Regulatory review for high-impact AI deployment",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Regulatory route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the regulated system, decision or action, deployment context, affected parties, and consequence of non-compliance.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "regulatoryRouteIdentifier",
        label: "Stable regulatory route identifier",
        type: "text",
        required: true,
        placeholder: "regulatory:ai-deployment:2026-00241",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "regulatedSystem",
        label: "Regulated system or process",
        type: "text",
        required: true,
        placeholder: "Automated employment screening system",
        validation: { minLength: 2, maxLength: 300 },
      },
      {
        key: "regulatedActivity",
        label: "Regulated activity",
        type: "textarea",
        required: true,
        placeholder:
          "Use of an AI system to rank applicants and produce recommendations affecting employment access.",
        validation: { minLength: 10, maxLength: 3000 },
      },
      {
        key: "organization",
        label: "Responsible organization",
        type: "text",
        required: true,
        placeholder: "Example Organization, Inc.",
        validation: { minLength: 2, maxLength: 300 },
      },
      {
        key: "deploymentEnvironment",
        label: "Deployment environment",
        type: "select",
        required: true,
        options: [
          { value: "research", label: "Research" },
          { value: "sandbox", label: "Sandbox" },
          { value: "pilot", label: "Pilot" },
          { value: "production", label: "Production" },
          { value: "cross-border", label: "Cross-border production" },
        ],
      },
      {
        key: "affectedParties",
        label: "Affected parties",
        type: "json",
        required: true,
        placeholder:
          '[{"partyType":"job applicant","impact":"employment access"},{"partyType":"employer","impact":"decision responsibility"}]',
      },
      {
        key: "regulatoryOwner",
        label: "Regulatory accountability owner",
        type: "text",
        required: true,
        placeholder: "Chief Compliance Officer",
        validation: { minLength: 2, maxLength: 240 },
      },
    ],
  },
  {
    sectionId: "jurisdiction-role-applicability",
    title: "Jurisdiction, Entity Role, and Applicability",
    description:
      "Determine which legal and regulatory regimes apply, which entity roles are held, and which obligations attach to the exact activity.",
    order: 20,
    fields: [
      {
        key: "jurisdictions",
        label: "Applicable jurisdictions",
        type: "json",
        required: true,
        placeholder:
          '[{"jurisdiction":"European Union","basis":"system placed on EU market"},{"jurisdiction":"United States / New York City","basis":"employment use"}]',
      },
      {
        key: "entityRoles",
        label: "Entity roles",
        type: "json",
        required: true,
        placeholder:
          '[{"framework":"EU AI Act","role":"deployer"},{"framework":"internal policy","role":"system owner"}]',
      },
      {
        key: "roleDeterminationBasis",
        label: "Role determination basis",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how provider, deployer, importer, distributor, operator, processor, controller, employer, or other role was determined.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "applicableFrameworks",
        label: "Applicable frameworks",
        type: "json",
        required: true,
        placeholder:
          '[{"frameworkId":"EU-AI-ACT","version":"current consolidated text"},{"frameworkId":"NYC-LL144","version":"current"}]',
      },
      {
        key: "applicabilityAssessment",
        label: "Applicability assessment",
        type: "textarea",
        required: true,
        placeholder:
          "Explain why each declared framework applies or does not apply to the exact system, activity, territory, actors, and timing.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "riskOrRegulatoryClassification",
        label: "Risk or regulatory classification",
        type: "json",
        required: true,
        placeholder:
          '[{"framework":"EU AI Act","classification":"high-risk"},{"framework":"NYC Local Law 144","classification":"automated employment decision tool"}]',
      },
      {
        key: "classificationBasis",
        label: "Classification basis",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the facts, use case, exclusions, thresholds, annexes, definitions, and authority supporting classification.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "crossBorderConsiderations",
        label: "Cross-border considerations",
        type: "textarea",
        required: true,
        placeholder:
          "Identify extraterritorial reach, data transfers, market placement, remote access, local representation, and conflicting obligations.",
        validation: { minLength: 10, maxLength: 5000 },
      },
    ],
  },
  {
    sectionId: "obligations-sources-authority",
    title: "Regulatory Sources, Obligations, and Authority",
    description:
      "Map each obligation to its authoritative source, responsible role, trigger, evidence requirement, and execution consequence.",
    order: 30,
    fields: [
      {
        key: "regulatorySources",
        label: "Authoritative regulatory sources",
        type: "json",
        required: true,
        placeholder:
          '[{"sourceId":"EU-AI-ACT-ART-26","title":"Deployer obligations","authority":"European Union","status":"in force"},{"sourceId":"NYC-LL144","title":"Automated employment decision tools","authority":"New York City","status":"in force"}]',
      },
      {
        key: "obligationMappings",
        label: "Obligation mappings",
        type: "json",
        required: true,
        placeholder:
          '[{"obligationId":"OBL-001","sourceId":"EU-AI-ACT-ART-26","responsibleRole":"deployer","requirement":"use system according to instructions","evidence":["deployment procedure","training record"]}]',
      },
      {
        key: "obligationTriggers",
        label: "Obligation triggers",
        type: "json",
        required: true,
        placeholder:
          '[{"obligationId":"OBL-001","trigger":"production deployment"},{"obligationId":"OBL-002","trigger":"material incident"}]',
      },
      {
        key: "responsibleActors",
        label: "Responsible actors",
        type: "json",
        required: true,
        placeholder:
          '[{"obligationId":"OBL-001","actor":"system owner"},{"obligationId":"OBL-002","actor":"incident response officer"}]',
      },
      {
        key: "evidenceRequirements",
        label: "Evidence required by obligation",
        type: "json",
        required: true,
        placeholder:
          '[{"obligationId":"OBL-001","evidenceTypes":["TECHNICAL_DOCUMENTATION_RECORD","HUMAN_OVERSIGHT_RECORD"]}]',
      },
      {
        key: "complianceDeadlines",
        label: "Deadlines and timing requirements",
        type: "json",
        required: true,
        placeholder:
          '[{"obligationId":"OBL-002","deadline":"within required regulatory reporting period"},{"obligationId":"OBL-003","deadline":"before production use"}]',
      },
      {
        key: "regulatoryAuthority",
        label: "Competent or supervisory authorities",
        type: "json",
        required: true,
        placeholder:
          '[{"jurisdiction":"European Union","authority":"competent market surveillance authority"},{"jurisdiction":"New York City","authority":"Department of Consumer and Worker Protection"}]',
      },
      {
        key: "obligationConflictMethod",
        label: "Conflicting obligation resolution",
        type: "textarea",
        required: true,
        placeholder:
          "Describe legal review, hierarchy analysis, jurisdictional scoping, escalation, preserved disagreement, and temporary HOLD behavior.",
        validation: { minLength: 20, maxLength: 6000 },
      },
    ],
  },
  {
    sectionId: "conformity-documentation-controls",
    title: "Conformity, Documentation, and Regulatory Controls",
    description:
      "Establish whether required assessments, registrations, licenses, technical documentation, notices, logs, and controls exist and remain bound to use.",
    order: 40,
    fields: [
      {
        key: "conformityRequirements",
        label: "Conformity or assessment requirements",
        type: "json",
        required: true,
        placeholder:
          '[{"requirement":"conformity assessment","applicable":true,"status":"completed"},{"requirement":"bias audit","applicable":true,"status":"completed"}]',
      },
      {
        key: "certificationsAndRegistrations",
        label: "Certifications, registrations, and licenses",
        type: "json",
        required: true,
        placeholder:
          '[{"type":"registration","identifier":"REG-2026-0191","status":"active","expiresAt":"2027-01-31T23:59:59Z"}]',
      },
      {
        key: "technicalDocumentation",
        label: "Technical documentation package",
        type: "json",
        required: true,
        placeholder:
          '["system description","intended purpose","model version","data provenance","risk management","testing","human oversight","logging","change history"]',
      },
      {
        key: "riskManagementControls",
        label: "Regulatory risk-management controls",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"REG-RISK-01","objective":"identify and mitigate foreseeable risk"},{"controlId":"REG-HO-02","objective":"ensure effective human oversight"}]',
      },
      {
        key: "transparencyRequirements",
        label: "Transparency and notice requirements",
        type: "json",
        required: true,
        placeholder:
          '[{"audience":"affected person","notice":"AI use disclosure"},{"audience":"operator","notice":"limitations and instructions"}]',
      },
      {
        key: "loggingRequirements",
        label: "Logging and traceability requirements",
        type: "json",
        required: true,
        placeholder:
          '["decision inputs","model version","human review","system output","execution action","incident markers","retention metadata"]',
      },
      {
        key: "runtimeComplianceControls",
        label: "Runtime compliance controls",
        type: "json",
        required: true,
        placeholder:
          '[{"controlId":"REG-CTRL-01","enforcementPoint":"pre-deployment","actionOnFailure":"HOLD"},{"controlId":"REG-CTRL-02","enforcementPoint":"pre-execution","actionOnFailure":"DENY"}]',
      },
      {
        key: "controlFailureBehavior",
        label: "Regulatory control failure behavior",
        type: "select",
        required: true,
        options: [
          { value: "hold", label: "HOLD" },
          { value: "deny", label: "DENY" },
          { value: "escalate", label: "ESCALATE" },
          { value: "stop-and-report", label: "STOP and report" },
        ],
      },
    ],
  },
  {
    sectionId: "monitoring-incident-enforcement",
    title: "Monitoring, Incident Reporting, and Enforcement",
    description:
      "Define post-market or operational monitoring, incident detection, reporting, regulatory response, audit access, and enforcement constraints.",
    order: 50,
    fields: [
      {
        key: "monitoringPlan",
        label: "Monitoring plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe continuous monitoring, sampling, complaint intake, drift detection, performance review, and regulatory escalation.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "monitoringSignals",
        label: "Monitoring signals",
        type: "json",
        required: true,
        placeholder:
          '["performance degradation","bias indicator","unauthorized use","scope expansion","incident","complaint","control failure","regulatory change"]',
      },
      {
        key: "incidentDefinitions",
        label: "Incident definitions and thresholds",
        type: "json",
        required: true,
        placeholder:
          '[{"incidentType":"serious incident","threshold":"material harm or regulatory definition met"},{"incidentType":"control failure","threshold":"mandatory control did not operate"}]',
      },
      {
        key: "incidentReportingProcedure",
        label: "Incident reporting procedure",
        type: "textarea",
        required: true,
        placeholder:
          "Describe detection, triage, authority review, regulator notification, affected-party communication, correction, and preserved evidence.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "reportingDeadlines",
        label: "Incident reporting deadlines",
        type: "json",
        required: true,
        placeholder:
          '[{"incidentType":"serious incident","deadline":"applicable statutory period"},{"incidentType":"material breach","deadline":"without undue delay"}]',
      },
      {
        key: "auditRequirements",
        label: "Audit and inspection requirements",
        type: "json",
        required: true,
        placeholder:
          '["record availability","authority access","evidence export","replay support","change history","exception register"]',
      },
      {
        key: "enforcementActions",
        label: "Known enforcement actions or restrictions",
        type: "json",
        required: true,
        placeholder:
          '[{"actionId":"none","status":"none-known"},{"actionId":"restriction-1","status":"inactive"}]',
      },
      {
        key: "restrictionBehavior",
        label: "Behavior under regulatory restriction",
        type: "select",
        required: true,
        options: [
          { value: "hold", label: "HOLD" },
          { value: "deny", label: "DENY" },
          { value: "stop", label: "STOP" },
          { value: "limited-mode", label: "Operate only within approved limited mode" },
        ],
      },
    ],
  },
  {
    sectionId: "exemptions-change-management",
    title: "Exemptions, Derogations, and Regulatory Change",
    description:
      "Constrain exemptions and derogations, preserve their authority and scope, and ensure regulatory change cannot silently invalidate prior review.",
    order: 60,
    fields: [
      {
        key: "claimedExemptions",
        label: "Claimed exemptions or exclusions",
        type: "json",
        required: true,
        placeholder:
          '[{"exemptionId":"EX-01","framework":"EU AI Act","claim":"research-only use","status":"not relied upon"}]',
      },
      {
        key: "exemptionAuthority",
        label: "Exemption authority and legal basis",
        type: "json",
        required: true,
        placeholder:
          '[{"exemptionId":"EX-01","source":"applicable legal provision","approvedBy":"legal-counsel","scope":"non-production research only"}]',
      },
      {
        key: "exemptionConditions",
        label: "Exemption conditions",
        type: "json",
        required: true,
        placeholder:
          '["specific purpose","limited duration","restricted users","no production decisions","preserved evidence","periodic review"]',
      },
      {
        key: "derogationRecords",
        label: "Derogation or emergency authorization records",
        type: "json",
        required: true,
        placeholder:
          '[{"derogationId":"DER-2026-02","status":"inactive","authority":"competent authority","expiresAt":"2026-08-15T00:00:00Z"}]',
      },
      {
        key: "regulatoryChangeSources",
        label: "Regulatory change sources",
        type: "json",
        required: true,
        placeholder:
          '["official journal","regulator guidance","court decisions","competent authority notices","legislative amendments"]',
      },
      {
        key: "changeAssessmentProcess",
        label: "Regulatory change assessment process",
        type: "textarea",
        required: true,
        placeholder:
          "Describe monitoring, legal review, applicability reassessment, obligation remapping, control change, communication, and replay.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "changeEffectiveBehavior",
        label: "Behavior when a regulatory change becomes effective",
        type: "select",
        required: true,
        options: [
          { value: "hold-until-reviewed", label: "HOLD until reviewed" },
          { value: "continue-with-approved-transition", label: "Continue under approved transition plan" },
          { value: "deny", label: "DENY further execution" },
          { value: "limited-mode", label: "Limit operation to unaffected scope" },
        ],
      },
      {
        key: "transitionPlan",
        label: "Transition plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe milestones, responsible actors, temporary controls, deadlines, testing, approvals, and completion evidence.",
        validation: { minLength: 20, maxLength: 6000 },
      },
    ],
  },
  {
    sectionId: "runtime-records-outcome-replay",
    title: "Runtime Compliance, Records, Outcomes, and Replay",
    description:
      "Preserve the exact obligations and evidence governing execution, compare actual use and outcome to regulatory constraints, and revalidate continuing compliance.",
    order: 70,
    fields: [
      {
        key: "runtimeObligationBinding",
        label: "Runtime obligation binding",
        type: "json",
        required: true,
        placeholder:
          '{"routeId":"regulatory:ai-deployment:2026-00241","obligations":["OBL-001","OBL-002"],"boundAt":"2026-07-26T16:20:00Z","bindingHash":"sha256:..."}',
      },
      {
        key: "runtimeComplianceEvaluation",
        label: "Runtime compliance evaluation",
        type: "json",
        required: true,
        placeholder:
          '[{"obligationId":"OBL-001","status":"supported"},{"obligationId":"OBL-002","status":"supported"}]',
      },
      {
        key: "requiredRecords",
        label: "Required preserved records",
        type: "json",
        required: true,
        placeholder:
          '["APPLICABILITY_ASSESSMENT","OBLIGATION_MAPPING_RECORD","CONFORMITY_ASSESSMENT_RECORD","TECHNICAL_DOCUMENTATION_RECORD","RUNTIME_COMPLIANCE_RECORD","EXECUTION_RECEIPT","REPLAY_RESULT"]',
      },
      {
        key: "recordIntegrityMethod",
        label: "Record integrity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe attribution, timestamps, signatures, hashes, append-only preservation, correction records, retention, and access control.",
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
            ruleId: "COMPLIANCE-REGULATORY-EXECUTION-01",
            description: "Required when execution has occurred.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"exec-241","obligationsApplied":["OBL-001","OBL-002"],"status":"completed"}',
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
            ruleId: "COMPLIANCE-REGULATORY-OUTCOME-01",
            description: "Required when outcome evidence is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe whether the actual use, decision, impact, reporting, and outcome remained within the declared regulatory obligations.",
        validation: { maxLength: 5000 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["jurisdiction change","entity role change","regulatory amendment","guidance change","classification change","certification expiry","incident","control failure","execution mismatch","outcome mismatch"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how jurisdiction, role, applicability, obligations, evidence, certifications, controls, execution, incidents, and outcomes are revalidated.",
        validation: { minLength: 20, maxLength: 6000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const COMPLIANCE_REGULATORY_SCENARIOS = [
  {
    scenarioId: "COMPLIANCE-REGULATORY-BASELINE-ALLOW",
    laneId: "compliance-regulatory",
    title: "Regulatory obligations supported baseline",
    description:
      "The correct jurisdictions, entity roles, classifications, obligations, evidence, controls, and runtime constraints are established and current.",
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
    scenarioId: "COMPLIANCE-REGULATORY-MISSING-OBLIGATION",
    laneId: "compliance-regulatory",
    title: "Mandatory obligation omitted",
    description:
      "An applicable obligation is absent from the regulatory mapping and runtime control package.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-MISSING-OBLIGATION-I01",
        title: "Remove obligation mapping",
        description:
          "Remove a mandatory obligation from the preserved mapping.",
        mutationType: "REMOVE_EVIDENCE",
        target: "OBLIGATION_MAPPING_RECORD",
      },
    ],
    expectedGateStatuses: {
      G02_GOVERNANCE_CLAIM: "FAIL",
      G03_SCOPE_BOUNDARY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Identify the missing obligation.",
      "Assign responsibility and evidence requirements.",
      "Bind the obligation to runtime controls and replay.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-WRONG-JURISDICTION",
    laneId: "compliance-regulatory",
    title: "Incorrect jurisdiction applied",
    description:
      "The route applies obligations from the wrong jurisdiction or omits the jurisdiction governing the actual use.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-WRONG-JURISDICTION-I01",
        title: "Alter jurisdiction",
        description:
          "Replace the applicable jurisdiction with an unrelated or incomplete jurisdiction.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "jurisdictions",
        value: "incorrect-jurisdiction",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G03_SCOPE_BOUNDARY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Reassess territorial and extraterritorial applicability.",
      "Correct the jurisdiction mapping.",
      "Replay all obligations and controls.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-EXPIRED-CERTIFICATION",
    laneId: "compliance-regulatory",
    title: "Required certification expired",
    description:
      "A required certification, registration, or license expired before the current use or execution.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-EXPIRED-CERTIFICATION-I01",
        title: "Expire certification evidence",
        description:
          "Expire a certification required for the regulated activity.",
        mutationType: "EXPIRE_EVIDENCE",
        target: "CERTIFICATION_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Renew or replace the required certification.",
      "Assess activity performed after expiry.",
      "Replay before resumed use.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-MISSING-CONFORMITY-EVIDENCE",
    laneId: "compliance-regulatory",
    title: "Conformity evidence missing",
    description:
      "The route claims required conformity or assessment completion without the supporting assessment record.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-MISSING-CONFORMITY-EVIDENCE-I01",
        title: "Remove conformity record",
        description:
          "Remove the mandatory conformity assessment evidence.",
        mutationType: "REMOVE_EVIDENCE",
        target: "CONFORMITY_ASSESSMENT_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Complete or obtain the required assessment.",
      "Preserve the assessment scope, result, and authority.",
      "Replay before execution.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-RUNTIME-DRIFT",
    laneId: "compliance-regulatory",
    title: "Runtime compliance drift",
    description:
      "The regulated system, use, model, territory, or controls change after review and before execution.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-RUNTIME-DRIFT-I01",
        title: "Alter regulated activity",
        description:
          "Change the actual runtime use so it no longer matches the reviewed activity.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "regulatedActivity",
        value: "unreviewed-material-use-change",
      },
    ],
    expectedGateStatuses: {
      G01_ROUTE_IDENTITY: "FAIL",
      G03_SCOPE_BOUNDARY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Stop or constrain the changed use.",
      "Repeat classification and applicability review.",
      "Remap obligations and replay.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-UNAUTHORIZED-EXEMPTION",
    laneId: "compliance-regulatory",
    title: "Unauthorized exemption claim",
    description:
      "An actor attempts to avoid applicable obligations using an exemption without a valid legal basis, authority, scope, or evidence.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-UNAUTHORIZED-EXEMPTION-I01",
        title: "Revoke exemption authority",
        description:
          "Invalidate the authority supporting the claimed exemption.",
        mutationType: "REVOKE_AUTHORITY",
        target: "exemptionAuthority",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Reject the unsupported exemption.",
      "Apply the full obligation set.",
      "Preserve the attempted exemption and actor identity.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-CONFLICTING-OBLIGATIONS",
    laneId: "compliance-regulatory",
    title: "Conflicting regulatory obligations",
    description:
      "Two applicable obligations or jurisdictional requirements produce materially incompatible execution requirements.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-CONFLICTING-OBLIGATIONS-I01",
        title: "Create regulatory evidence conflict",
        description:
          "Introduce incompatible obligation evidence for the same governed action.",
        mutationType: "CREATE_EVIDENCE_CONFLICT",
        target: "obligationMappings",
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
      "Obtain qualified jurisdictional review.",
      "Preserve both obligations and competing interpretations.",
      "Define a lawful bounded route or deny execution.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-AUDIT-EVIDENCE-MISSING",
    laneId: "compliance-regulatory",
    title: "Audit evidence unavailable",
    description:
      "The route cannot produce the required logs, documentation, attribution, or preserved records for regulatory inspection.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-AUDIT-EVIDENCE-MISSING-I01",
        title: "Remove audit record",
        description:
          "Remove required audit and inspection evidence.",
        mutationType: "REMOVE_EVIDENCE",
        target: "AUDIT_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Restore or regenerate only evidence that can be validly reproduced.",
      "Preserve the missing-record condition.",
      "Repeat the governed activity where reconstruction would be inadmissible.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-EXECUTION-VIOLATION",
    laneId: "compliance-regulatory",
    title: "Execution violates regulatory determination",
    description:
      "The route determines that execution must be blocked or constrained, but the action proceeds outside the permitted condition.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-EXECUTION-VIOLATION-I01",
        title: "Create execution mismatch",
        description:
          "Execute an action that the regulatory control determined should not proceed.",
        mutationType: "CREATE_EXECUTION_MISMATCH",
        target: "executionReceipt",
      },
    ],
    expectedGateStatuses: {
      G07_RULE_CONTROL_BINDING: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Stop or reverse the action where possible.",
      "Initiate incident and regulator-notification review.",
      "Repair and independently test the enforcement control.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-REGULATORY-UPDATE",
    laneId: "compliance-regulatory",
    title: "Regulatory update after approval",
    description:
      "A regulatory amendment, official guidance, or binding decision changes the applicable obligation set after the route was approved.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-REGULATORY-UPDATE-I01",
        title: "Alter regulatory source",
        description:
          "Change the governing regulatory source or obligation version after approval.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "regulatorySources",
        value: "material-regulatory-update",
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
      "Assess the change and effective date.",
      "Update role, classification, obligation, evidence, and control mappings.",
      "Replay before continued execution unless an approved transition applies.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-OUTCOME-MISMATCH",
    laneId: "compliance-regulatory",
    title: "Outcome contradicts regulatory claim",
    description:
      "The route executed under the mapped obligations, but outcome evidence shows actual use or impact outside the declared compliant boundary.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "COMPLIANCE-REGULATORY-OUTCOME-MISMATCH-I01",
        title: "Create outcome mismatch",
        description:
          "Provide outcome evidence showing a material violation of the declared regulatory boundary.",
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
      "Assess whether the mismatch is an incident or reportable event.",
      "Correct classification, controls, instructions, and monitoring.",
      "Preserve remediation and replay before restored reliance.",
    ],
  },
  {
    scenarioId: "COMPLIANCE-REGULATORY-RECOVERY-REPLAY",
    laneId: "compliance-regulatory",
    title: "Corrected regulatory recovery and replay",
    description:
      "A prior regulatory failure is corrected, preserved, independently reviewed, and replayed before the route is restored.",
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
      "Link corrected obligations, evidence, controls, and approvals to the failed route.",
      "Issue a new replay result rather than altering the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type ComplianceRegulatoryScenario =
  (typeof COMPLIANCE_REGULATORY_SCENARIOS)[number];

export const COMPLIANCE_REGULATORY_LANE = {
  laneId: "compliance-regulatory",
  name: "Compliance & Regulatory Governance Playground",
  shortName: "Compliance & Regulatory",
  description:
    "Test whether the correct jurisdictions, entity roles, classifications, obligations, evidence, assessments, controls, exemptions, incidents, execution records, and regulatory changes remain admissibly bound and replayable.",
  claimsGoverned: [
    "The exact regulated system, activity, organization, environment, and affected parties are identified.",
    "Applicable jurisdictions and entity roles are determined from preserved facts and authoritative sources.",
    "The risk or regulatory classification is supported and bounded.",
    "Each applicable obligation is mapped to its source, trigger, responsible actor, deadline, evidence, and execution consequence.",
    "Required conformity assessments, certifications, registrations, licenses, technical documentation, notices, logs, and monitoring records are current.",
    "Runtime controls enforce the declared regulatory obligations before execution.",
    "Exemptions and derogations are accepted only when supported by valid authority, scope, conditions, and evidence.",
    "Regulatory changes invalidate continuing reliance until applicability, obligations, controls, and evidence are reassessed.",
    "Incidents, restrictions, enforcement actions, execution, and outcomes are preserved and linked to the governed route.",
    "Continuing regulatory validity is tested through replay.",
  ],
  nonClaims: [
    "This lane does not provide legal advice or replace qualified jurisdiction-specific counsel.",
    "This lane does not claim universal compliance based on a single framework or jurisdiction.",
    "This lane does not treat policy alignment as proof of legal compliance.",
    "This lane does not validate an exemption merely because an organization labels an activity exempt.",
    "An ALLOW determination applies only to the exact jurisdictions, entity roles, classifications, obligation versions, evidence, controls, use, and validity window preserved.",
  ],
  sections: COMPLIANCE_REGULATORY_SECTIONS,
  gateIds: COMPLIANCE_REGULATORY_GATE_IDS,
  evidenceTypes: [...COMPLIANCE_REGULATORY_EVIDENCE_TYPES],
  scenarioIds: COMPLIANCE_REGULATORY_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when execution violates a binding regulatory determination, a mandatory control is bypassed, or an exemption is asserted without valid authority.",
    "ESCALATE when applicable jurisdictions or obligations conflict, classification is materially disputed, or enforcement and incident consequences require qualified superior review.",
    "HOLD when jurisdiction, role, applicability, classification, obligation mapping, certification, conformity evidence, audit evidence, regulatory version, controls, incidents, or replay requirements are incomplete, expired, or drifted.",
    "ALLOW only when all applicable regulatory gates pass and required scenarios demonstrate authoritative applicability, complete obligation mapping, current evidence, enforceable runtime controls, preserved records, and continuing validity.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getComplianceRegulatoryScenario(
  scenarioId: string,
): ComplianceRegulatoryScenario | undefined {
  return COMPLIANCE_REGULATORY_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
