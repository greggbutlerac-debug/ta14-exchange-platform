import type {
  LaneDefinition,
  PlaygroundSectionDefinition,
  ScenarioDefinition,
} from "../types";
import type { SharedGateId } from "../gates";

/**
 * TA-14 Human Oversight Governance Playground
 *
 * Tests whether human review, intervention, stop authority, escalation,
 * override, accountability, competence, independence, and preserved evidence
 * remain available and effective before, during, and after execution.
 */

export const HUMAN_OVERSIGHT_GATE_IDS = [
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

export const HUMAN_OVERSIGHT_EVIDENCE_TYPES = [
  "GOVERNANCE_CLAIM_SUPPORT",
  "OVERSIGHT_ROUTE_IDENTITY",
  "HUMAN_ROLE_RECORD",
  "IDENTITY_VERIFICATION_RECORD",
  "COMPETENCE_RECORD",
  "TRAINING_RECORD",
  "INDEPENDENCE_RECORD",
  "CONFLICT_OF_INTEREST_RECORD",
  "AUTHORITY_RECORD",
  "DELEGATION_RECORD",
  "REVIEW_REQUIREMENT_RECORD",
  "INTERVENTION_TRIGGER_RECORD",
  "STOP_AUTHORITY_RECORD",
  "OVERRIDE_RECORD",
  "ESCALATION_RECORD",
  "WORKLOAD_RECORD",
  "AVAILABILITY_RECORD",
  "CONTROL_RECORD",
  "CONTROL_TEST_RECORD",
  "HUMAN_REVIEW_RECORD",
  "COMMIT_AUTHORIZATION",
  "EXECUTION_RECEIPT",
  "OUTCOME_EVIDENCE",
  "INCIDENT_RECORD",
  "REMEDIATION_RECORD",
  "REPLAY_RESULT",
] as const;

export type HumanOversightEvidenceType =
  (typeof HUMAN_OVERSIGHT_EVIDENCE_TYPES)[number];

export const HUMAN_OVERSIGHT_SECTIONS = [
  {
    sectionId: "human-oversight-route-identity",
    title: "Oversight Route Identity",
    description:
      "Identify the exact governed route, system, decision, action, human oversight function, owners, environment, and version under review.",
    order: 10,
    fields: [
      {
        key: "routeTitle",
        label: "Oversight route title",
        type: "text",
        required: true,
        placeholder: "Human oversight for autonomous execution route",
        validation: { minLength: 3, maxLength: 160 },
      },
      {
        key: "routeDescription",
        label: "Route description",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the system, decision, action, consequence, human role, and why oversight is required.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "oversightRouteIdentifier",
        label: "Stable oversight route identifier",
        type: "text",
        required: true,
        placeholder: "human-oversight:production-route:2026-001",
        validation: { minLength: 3, maxLength: 300 },
      },
      {
        key: "governedSystem",
        label: "Governed system or workflow",
        type: "text",
        required: true,
        placeholder: "Autonomous Operations Workflow",
        validation: { minLength: 2, maxLength: 300 },
      },
      {
        key: "systemVersion",
        label: "System version",
        type: "text",
        required: true,
        placeholder: "1.0.0",
        validation: { minLength: 1, maxLength: 120 },
      },
      {
        key: "oversightOwner",
        label: "Oversight owner",
        type: "text",
        required: true,
        placeholder: "Human Oversight Authority",
        validation: { minLength: 2, maxLength: 240 },
      },
      {
        key: "businessOwner",
        label: "Business owner",
        type: "text",
        required: true,
        placeholder: "Operational Route Owner",
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
    ],
  },
  {
    sectionId: "human-roles-competence-independence",
    title: "Human Roles, Competence, and Independence",
    description:
      "Define the reviewers, operators, approvers, stop authorities, escalation authorities, competence requirements, independence, conflicts, and workload limits.",
    order: 20,
    fields: [
      {
        key: "humanRoles",
        label: "Human oversight roles",
        type: "json",
        required: true,
        placeholder:
          '[{"roleId":"ROLE-01","name":"reviewer","scope":"pre-execution review"},{"roleId":"ROLE-02","name":"stop authority","scope":"all production execution"}]',
      },
      {
        key: "roleResponsibilities",
        label: "Role responsibilities",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"reviewer","responsibilities":["inspect evidence","challenge recommendation","approve or hold"]}]',
      },
      {
        key: "competenceRequirements",
        label: "Competence requirements",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"reviewer","requirements":["domain expertise","system training","governance training","incident response"]}]',
      },
      {
        key: "trainingStatus",
        label: "Training and qualification status",
        type: "json",
        required: true,
        placeholder:
          '[{"person":"authorized reviewer","role":"reviewer","status":"current","expiresAt":"2027-06-30"}]',
      },
      {
        key: "independenceRequirements",
        label: "Independence requirements",
        type: "textarea",
        required: true,
        placeholder:
          "Describe separation from development, commercial pressure, direct operational incentives, and conflicted reporting lines.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "conflictOfInterestControls",
        label: "Conflict-of-interest controls",
        type: "json",
        required: true,
        placeholder:
          '["mandatory disclosure","recusal","alternate reviewer","preserved conflict record"]',
      },
      {
        key: "workloadLimits",
        label: "Workload and attention limits",
        type: "json",
        required: true,
        placeholder:
          '{"maximumConcurrentReviews":5,"maximumShiftHours":10,"mandatoryBreaks":true,"fatigueEscalation":true}',
      },
      {
        key: "staffingCoverage",
        label: "Staffing and coverage",
        type: "json",
        required: true,
        placeholder:
          '{"primaryCoverage":"24x7","backupCoverage":"24x7","minimumQualifiedReviewers":2}',
      },
    ],
  },
  {
    sectionId: "oversight-scope-timing-information",
    title: "Oversight Scope, Timing, and Information",
    description:
      "Define when oversight occurs, what the human must see, the decision time available, the review depth, and the consequences of unavailable or late review.",
    order: 30,
    fields: [
      {
        key: "oversightMode",
        label: "Oversight mode",
        type: "select",
        required: true,
        options: [
          { value: "human-in-the-loop", label: "Human in the loop" },
          { value: "human-on-the-loop", label: "Human on the loop" },
          { value: "human-over-the-loop", label: "Human over the loop" },
          { value: "post-execution-review", label: "Post-execution review" },
          { value: "hybrid", label: "Hybrid" },
        ],
      },
      {
        key: "reviewTiming",
        label: "Review timing",
        type: "json",
        required: true,
        placeholder:
          '{"preExecution":true,"duringExecution":true,"postExecution":true,"maximumResponseTimeSeconds":120}',
      },
      {
        key: "requiredInformation",
        label: "Information available to the human",
        type: "json",
        required: true,
        placeholder:
          '["route identity","source evidence","authority","policy","risk","dependencies","recommended action","alternatives","uncertainty","expected consequences"]',
      },
      {
        key: "informationPresentation",
        label: "Information presentation method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how material facts, uncertainty, conflicts, limitations, alternatives, and irreversible consequences are presented without manipulation.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "reviewDepth",
        label: "Required review depth",
        type: "select",
        required: true,
        options: [
          { value: "acknowledgment", label: "Acknowledgment" },
          { value: "reasonableness-review", label: "Reasonableness review" },
          { value: "independent-verification", label: "Independent verification" },
          { value: "dual-approval", label: "Dual approval" },
        ],
      },
      {
        key: "decisionTimeAdequacy",
        label: "Decision-time adequacy",
        type: "textarea",
        required: true,
        placeholder:
          "Explain why the available review period is sufficient for the complexity, consequence, uncertainty, and evidence volume.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "unavailableReviewerBehavior",
        label: "Behavior when reviewer is unavailable",
        type: "select",
        required: true,
        options: [
          { value: "hold", label: "HOLD" },
          { value: "deny", label: "DENY" },
          { value: "backup-reviewer", label: "Route to qualified backup" },
          { value: "limited-mode", label: "Approved limited mode" },
        ],
      },
      {
        key: "lateReviewBehavior",
        label: "Behavior when review is late",
        type: "select",
        required: true,
        options: [
          { value: "hold", label: "HOLD" },
          { value: "deny", label: "DENY" },
          { value: "auto-escalate", label: "Automatically escalate" },
          { value: "fail-closed", label: "Fail closed" },
        ],
      },
    ],
  },
  {
    sectionId: "intervention-stop-escalation",
    title: "Intervention, Stop Authority, and Escalation",
    description:
      "Define intervention triggers, stop mechanisms, pause, reversal, containment, escalation paths, emergency authority, and blocked-intervention behavior.",
    order: 40,
    fields: [
      {
        key: "interventionTriggers",
        label: "Intervention triggers",
        type: "json",
        required: true,
        placeholder:
          '["evidence conflict","authority loss","scope drift","control failure","dependency failure","unexpected output","unsafe condition","outcome mismatch"]',
      },
      {
        key: "stopAuthority",
        label: "Stop authority",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"stop authority","scope":"all production execution","activation":"immediate","delegable":false}]',
      },
      {
        key: "stopMechanism",
        label: "Stop mechanism",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the technical and operational mechanism to pause, deny, contain, reverse, or terminate execution.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "reversibility",
        label: "Reversibility and containment",
        type: "json",
        required: true,
        placeholder:
          '{"reversibleActions":["queued transaction"],"irreversibleActions":["external disclosure"],"containmentAvailable":true}',
      },
      {
        key: "escalationPath",
        label: "Escalation path",
        type: "json",
        required: true,
        placeholder:
          '[{"level":1,"role":"reviewer"},{"level":2,"role":"governance authority"},{"level":3,"role":"executive or legal authority"}]',
      },
      {
        key: "emergencyAuthority",
        label: "Emergency authority",
        type: "json",
        required: true,
        placeholder:
          '{"role":"incident commander","scope":"containment only","maximumDurationMinutes":60,"postReviewRequired":true}',
      },
      {
        key: "blockedInterventionBehavior",
        label: "Blocked-intervention behavior",
        type: "select",
        required: true,
        options: [
          { value: "deny", label: "DENY" },
          { value: "fail-closed", label: "Fail closed" },
          { value: "hold", label: "HOLD" },
          { value: "emergency-shutdown", label: "Emergency shutdown" },
        ],
      },
      {
        key: "interventionTesting",
        label: "Intervention testing",
        type: "json",
        required: true,
        placeholder:
          '[{"test":"manual stop","date":"2026-07-20","result":"effective"},{"test":"backup escalation","date":"2026-07-20","result":"effective"}]',
      },
    ],
  },
  {
    sectionId: "approval-override-accountability",
    title: "Approval, Override, and Accountability",
    description:
      "Define approval authority, dual control, override conditions, override limits, reasons, accountability, reviewability, and prohibited override behavior.",
    order: 50,
    fields: [
      {
        key: "approvalAuthority",
        label: "Approval authority",
        type: "json",
        required: true,
        placeholder:
          '[{"role":"authorized reviewer","scope":"standard execution"},{"role":"senior authority","scope":"high-consequence execution"}]',
      },
      {
        key: "dualControlRequirements",
        label: "Dual-control requirements",
        type: "json",
        required: true,
        placeholder:
          '[{"condition":"irreversible high-impact action","requiredApprovals":2,"independent":true}]',
      },
      {
        key: "overridePermitted",
        label: "Override permitted",
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      {
        key: "overrideConditions",
        label: "Override conditions",
        type: "json",
        required: false,
        appliesWhen: [
          {
            ruleId: "HUMAN-OVERSIGHT-OVERRIDE-01",
            description: "Required when override is permitted.",
            field: "overridePermitted",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '["documented emergency","bounded scope","named authority","time-limited","post-event independent review"]',
      },
      {
        key: "overrideLimits",
        label: "Override limits",
        type: "json",
        required: false,
        appliesWhen: [
          {
            ruleId: "HUMAN-OVERSIGHT-OVERRIDE-02",
            description: "Required when override is permitted.",
            field: "overridePermitted",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"maximumDurationMinutes":30,"maximumExecutions":1,"prohibited":["authority bypass","evidence fabrication","record deletion"]}',
      },
      {
        key: "reasonRequirement",
        label: "Reason and justification requirement",
        type: "textarea",
        required: true,
        placeholder:
          "Describe the minimum contemporaneous explanation required for approval, rejection, hold, escalation, intervention, and override.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "accountabilityAssignment",
        label: "Accountability assignment",
        type: "json",
        required: true,
        placeholder:
          '[{"decision":"approve","accountableRole":"authorized reviewer"},{"decision":"override","accountableRole":"named emergency authority"}]',
      },
      {
        key: "prohibitedHumanActions",
        label: "Prohibited human actions",
        type: "json",
        required: true,
        placeholder:
          '["rubber-stamp approval","shared credentials","undocumented override","retrospective justification","record alteration","coerced approval"]',
      },
    ],
  },
  {
    sectionId: "monitoring-fatigue-manipulation-incidents",
    title: "Monitoring, Fatigue, Manipulation, and Incidents",
    description:
      "Monitor oversight effectiveness, automation bias, fatigue, alert burden, reviewer disagreement, coercion, manipulation, incidents, and remediation.",
    order: 60,
    fields: [
      {
        key: "oversightMonitoringPlan",
        label: "Oversight monitoring plan",
        type: "textarea",
        required: true,
        placeholder:
          "Describe monitoring of review quality, response time, intervention success, disagreement, overrides, workload, fatigue, and missed signals.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "effectivenessMetrics",
        label: "Oversight effectiveness metrics",
        type: "json",
        required: true,
        placeholder:
          '[{"metric":"intervention success rate","target":">=99%"},{"metric":"missed critical alerts","target":"0"}]',
      },
      {
        key: "automationBiasControls",
        label: "Automation-bias controls",
        type: "json",
        required: true,
        placeholder:
          '["independent first assessment","alternative presentation","uncertainty visibility","mandatory challenge prompts","random blind review"]',
      },
      {
        key: "fatigueControls",
        label: "Fatigue and alert-overload controls",
        type: "json",
        required: true,
        placeholder:
          '["shift limits","alert prioritization","mandatory breaks","backup staffing","fatigue self-reporting","automatic reassignment"]',
      },
      {
        key: "manipulationControls",
        label: "Manipulation and coercion controls",
        type: "json",
        required: true,
        placeholder:
          '["neutral presentation","no deceptive urgency","commercial pressure disclosure","protected escalation","anti-retaliation"]',
      },
      {
        key: "disagreementProcedure",
        label: "Reviewer disagreement procedure",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how disagreement is preserved, escalated, independently resolved, and prevented from being silently suppressed.",
        validation: { minLength: 20, maxLength: 5000 },
      },
      {
        key: "incidentProcedure",
        label: "Oversight incident procedure",
        type: "textarea",
        required: true,
        placeholder:
          "Describe containment, evidence preservation, reviewer protection, impact assessment, remediation, retraining, and replay.",
        validation: { minLength: 20, maxLength: 6000 },
      },
      {
        key: "remediationVerification",
        label: "Remediation verification",
        type: "json",
        required: true,
        placeholder:
          '{"independentVerification":true,"retestRequired":true,"reapprovalRequired":true,"replayRequired":true}',
      },
    ],
  },
  {
    sectionId: "records-outcomes-replay",
    title: "Oversight Records, Outcomes, and Replay",
    description:
      "Preserve who saw what, when they saw it, what they decided, whether intervention worked, what executed, and whether the outcome matched the governed route.",
    order: 70,
    fields: [
      {
        key: "requiredRecords",
        label: "Required preserved records",
        type: "json",
        required: true,
        placeholder:
          '["HUMAN_ROLE_RECORD","COMPETENCE_RECORD","AUTHORITY_RECORD","HUMAN_REVIEW_RECORD","STOP_AUTHORITY_RECORD","OVERRIDE_RECORD","ESCALATION_RECORD","EXECUTION_RECEIPT","OUTCOME_EVIDENCE","REPLAY_RESULT"]',
      },
      {
        key: "reviewRecordRequirements",
        label: "Human review record requirements",
        type: "json",
        required: true,
        placeholder:
          '["reviewer identity","role","authority","information viewed","timestamp","decision","reason","conflicts","interventions","signature"]',
      },
      {
        key: "recordIntegrityMethod",
        label: "Record integrity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe attribution, timestamps, signatures, hashes, append-only preservation, corrections, retention, and access control.",
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
            ruleId: "HUMAN-OVERSIGHT-EXECUTION-01",
            description: "Required when execution has occurred.",
            field: "executionAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          '{"executionId":"exec-001","reviewer":"authorized reviewer","approvalId":"APR-001","status":"completed"}',
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
        label: "Measured oversight outcome",
        type: "textarea",
        required: false,
        appliesWhen: [
          {
            ruleId: "HUMAN-OVERSIGHT-OUTCOME-01",
            description: "Required when outcome evidence is available.",
            field: "outcomeAvailable",
            operator: "equals",
            expected: true,
          },
        ],
        placeholder:
          "Describe whether human review was timely, informed, independent, effective, able to intervene, and consistent with the actual execution and outcome.",
        validation: { maxLength: 5000 },
      },
      {
        key: "replayTriggers",
        label: "Replay triggers",
        type: "json",
        required: true,
        placeholder:
          '["role change","authority change","training expiry","staffing failure","blocked intervention","override","incident","execution mismatch","outcome mismatch"]',
      },
      {
        key: "continuingValidityMethod",
        label: "Continuing validity method",
        type: "textarea",
        required: true,
        placeholder:
          "Describe how roles, competence, independence, authority, staffing, intervention controls, execution, outcomes, and remediation are revalidated.",
        validation: { minLength: 20, maxLength: 6000 },
      },
    ],
  },
] as const satisfies readonly PlaygroundSectionDefinition[];

export const HUMAN_OVERSIGHT_SCENARIOS = [
  {
    scenarioId: "HUMAN-OVERSIGHT-BASELINE-ALLOW",
    laneId: "human-oversight",
    title: "Effective human oversight baseline",
    description:
      "Qualified, independent, authorized humans receive sufficient information and time, can intervene and stop execution, and preserve review evidence.",
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
    scenarioId: "HUMAN-OVERSIGHT-REVIEWER-IDENTITY-MISSING",
    laneId: "human-oversight",
    title: "Reviewer identity missing",
    description:
      "The person performing review or approval cannot be uniquely identified and attributed.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-REVIEWER-IDENTITY-MISSING-I01",
        title: "Remove reviewer identity evidence",
        description:
          "Remove the record binding the review to a verified human identity.",
        mutationType: "REMOVE_EVIDENCE",
        target: "IDENTITY_VERIFICATION_RECORD",
      },
    ],
    expectedGateStatuses: {
      G04_ACTOR_IDENTITY: "FAIL",
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G12_RECORD_CONTINUITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Verify and bind the reviewer identity.",
      "Reperform the review under attributed authority.",
      "Replay before execution.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-TRAINING-EXPIRED",
    laneId: "human-oversight",
    title: "Reviewer qualification expired",
    description:
      "The assigned reviewer lacks current training, certification, or demonstrated competence required for the route.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-TRAINING-EXPIRED-I01",
        title: "Expire competence evidence",
        description:
          "Expire the reviewer's required training or qualification record.",
        mutationType: "EXPIRE_EVIDENCE",
        target: "COMPETENCE_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G09_HUMAN_OVERSIGHT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Assign a currently qualified reviewer or restore qualification.",
      "Reperform affected review.",
      "Replay before resumed execution.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-CONFLICT-OF-INTEREST",
    laneId: "human-oversight",
    title: "Reviewer independence compromised",
    description:
      "The reviewer has a material conflict, incentive, reporting dependency, or development responsibility that compromises independent judgment.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-CONFLICT-OF-INTEREST-I01",
        title: "Alter independence status",
        description:
          "Introduce a material unresolved reviewer conflict of interest.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "conflictOfInterestControls",
        value: "material-conflict-unresolved",
      },
    ],
    expectedGateStatuses: {
      G06_AUTHORITY_VALIDITY: "FAIL",
      G09_HUMAN_OVERSIGHT: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "ESCALATE",
    recoveryRequirements: [
      "Recuse the conflicted reviewer.",
      "Assign an independent qualified reviewer.",
      "Preserve and replay the affected review.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-INSUFFICIENT-INFORMATION",
    laneId: "human-oversight",
    title: "Human receives insufficient information",
    description:
      "Material evidence, uncertainty, conflicts, alternatives, consequences, or route limitations are withheld or obscured.",
    scenarioClass: "SINGLE_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-INSUFFICIENT-INFORMATION-I01",
        title: "Remove human review evidence",
        description:
          "Remove evidence showing the reviewer received all required information.",
        mutationType: "REMOVE_EVIDENCE",
        target: "HUMAN_REVIEW_RECORD",
      },
    ],
    expectedGateStatuses: {
      G05_EVIDENCE_SUFFICIENCY: "FAIL",
      G09_HUMAN_OVERSIGHT: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Provide the complete required information set.",
      "Allow adequate review time.",
      "Reperform and preserve the review.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-INADEQUATE-DECISION-TIME",
    laneId: "human-oversight",
    title: "Insufficient time for meaningful review",
    description:
      "The human is technically present but cannot reasonably understand, challenge, or intervene before execution.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-INADEQUATE-DECISION-TIME-I01",
        title: "Alter review timing",
        description:
          "Reduce review time below the route's minimum meaningful review period.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "reviewTiming",
        value: "insufficient-review-time",
      },
    ],
    expectedGateStatuses: {
      G09_HUMAN_OVERSIGHT: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Restore sufficient review time.",
      "Pause execution until meaningful review is possible.",
      "Reperform the decision.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-AUTHORITY-REVOKED",
    laneId: "human-oversight",
    title: "Human approval authority revoked",
    description:
      "The reviewer, approver, stop authority, or emergency authority no longer has valid authority.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-AUTHORITY-REVOKED-I01",
        title: "Revoke human authority",
        description:
          "Invalidate the authority supporting human approval or intervention.",
        mutationType: "REVOKE_AUTHORITY",
        target: "AUTHORITY_RECORD",
      },
    ],
    expectedGateStatuses: {
      G06_AUTHORITY_VALIDITY: "FAIL",
      G09_HUMAN_OVERSIGHT: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Suspend affected execution.",
      "Assign valid authority.",
      "Issue a new review and replay result.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-INTERVENTION-BLOCKED",
    laneId: "human-oversight",
    title: "Human intervention blocked",
    description:
      "The assigned human cannot pause, deny, redirect, contain, reverse, or stop the governed execution.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-INTERVENTION-BLOCKED-I01",
        title: "Block human intervention",
        description:
          "Disable the required intervention or stop mechanism.",
        mutationType: "BLOCK_HUMAN_INTERVENTION",
        target: "stopMechanism",
      },
    ],
    expectedGateStatuses: {
      G09_HUMAN_OVERSIGHT: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G11_INTERVENTION_ESCALATION: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Restore verified stop and intervention capability.",
      "Test intervention under realistic conditions.",
      "Replay before execution.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-UNAUTHORIZED-OVERRIDE",
    laneId: "human-oversight",
    title: "Unauthorized human override",
    description:
      "A human bypasses a gate, control, hold, denial, or escalation without valid bounded override authority.",
    scenarioClass: "ADVERSARIAL",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-UNAUTHORIZED-OVERRIDE-I01",
        title: "Alter override authority",
        description:
          "Create an override outside the approved authority, scope, or duration.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "overrideConditions",
        value: "unauthorized-unbounded-override",
      },
    ],
    expectedGateStatuses: {
      G06_AUTHORITY_VALIDITY: "FAIL",
      G07_RULE_CONTROL_BINDING: "FAIL",
      G09_HUMAN_OVERSIGHT: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Terminate the unauthorized override.",
      "Preserve all override and execution records.",
      "Investigate accountability and replay.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-AUTOMATION-BIAS",
    laneId: "human-oversight",
    title: "Human rubber-stamps system recommendation",
    description:
      "The reviewer accepts the recommendation without meaningful independent assessment or challenge.",
    scenarioClass: "COMPOUND_FAILURE",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-AUTOMATION-BIAS-I01",
        title: "Alter review method",
        description:
          "Remove independent assessment and require recommendation-first review.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "automationBiasControls",
        value: "recommendation-first-rubber-stamp",
      },
    ],
    expectedGateStatuses: {
      G09_HUMAN_OVERSIGHT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Reperform an independent review.",
      "Apply anti-bias controls.",
      "Assess prior approvals for systemic impact.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-FATIGUE-OVERLOAD",
    laneId: "human-oversight",
    title: "Reviewer fatigue or alert overload",
    description:
      "Workload, shift duration, alert volume, or staffing conditions make meaningful oversight unreliable.",
    scenarioClass: "POST_ALLOW_DRIFT",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-FATIGUE-OVERLOAD-I01",
        title: "Alter workload limits",
        description:
          "Exceed approved concurrent review or shift limits.",
        mutationType: "ALTER_ROUTE_FIELD",
        target: "workloadLimits",
        value: "reviewer-overloaded",
      },
    ],
    expectedGateStatuses: {
      G08_DEPENDENCY_INTEGRITY: "FAIL",
      G09_HUMAN_OVERSIGHT: "FAIL",
      G11_INTERVENTION_ESCALATION: "PASS",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Reassign work to qualified rested staff.",
      "Reduce alert burden and restore staffing limits.",
      "Review decisions made during the overload period.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-EXECUTION-MISMATCH",
    laneId: "human-oversight",
    title: "Execution differs from human approval",
    description:
      "The actual action, actor, scope, parameters, destination, or timing differs from what the human reviewed and approved.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-EXECUTION-MISMATCH-I01",
        title: "Create execution mismatch",
        description:
          "Cause actual execution to differ from the preserved human approval.",
        mutationType: "CREATE_EXECUTION_MISMATCH",
        target: "executionReceipt",
      },
    ],
    expectedGateStatuses: {
      G03_SCOPE_BOUNDARY: "FAIL",
      G09_HUMAN_OVERSIGHT: "FAIL",
      G10_EXECUTION_CONSTRAINT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
    },
    expectedDetermination: "DENY",
    recoveryRequirements: [
      "Stop or contain the mismatched execution.",
      "Preserve the approval and actual execution records.",
      "Investigate and replay.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-OUTCOME-MISMATCH",
    laneId: "human-oversight",
    title: "Oversight outcome ineffective",
    description:
      "Outcome evidence shows that human review, intervention, or stop authority did not prevent or contain the governed harm or deviation.",
    scenarioClass: "EXECUTION_MISMATCH",
    required: true,
    preconditions: [],
    injections: [
      {
        injectionId: "HUMAN-OVERSIGHT-OUTCOME-MISMATCH-I01",
        title: "Create oversight outcome mismatch",
        description:
          "Provide outcome evidence that contradicts the claimed effectiveness of human oversight.",
        mutationType: "CREATE_OUTCOME_MISMATCH",
        target: "measuredOutcome",
      },
    ],
    expectedGateStatuses: {
      G09_HUMAN_OVERSIGHT: "FAIL",
      G12_RECORD_CONTINUITY: "PASS",
      G13_OUTCOME_CORRESPONDENCE: "FAIL",
      G14_REPLAY_CONTINUING_VALIDITY: "FAIL",
    },
    expectedDetermination: "HOLD",
    recoveryRequirements: [
      "Preserve the failed oversight outcome.",
      "Reassess staffing, information, timing, authority, and intervention controls.",
      "Remediate and replay before restored reliance.",
    ],
  },
  {
    scenarioId: "HUMAN-OVERSIGHT-RECOVERY-REPLAY",
    laneId: "human-oversight",
    title: "Corrected oversight recovery and replay",
    description:
      "A prior human oversight failure is corrected, independently verified, preserved, and replayed before restored execution.",
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
      "Preserve the original oversight failure and determination.",
      "Link corrected staffing, competence, authority, information, intervention testing, and independent verification.",
      "Issue a new replay result without altering the original record.",
    ],
  },
] as const satisfies readonly ScenarioDefinition[];

export type HumanOversightScenario =
  (typeof HUMAN_OVERSIGHT_SCENARIOS)[number];

export const HUMAN_OVERSIGHT_LANE = {
  laneId: "human-oversight",
  name: "Human Oversight Governance Playground",
  shortName: "Human Oversight",
  description:
    "Test whether human reviewers and intervention authorities are identified, qualified, independent, informed, authorized, available, able to stop execution, accountable, and preserved in replayable records.",
  claimsGoverned: [
    "The exact human oversight route, governed system, owners, environment, and version are identified.",
    "Human roles, responsibilities, competence, training, independence, conflicts, workload, and staffing are explicit.",
    "Humans receive the material evidence, uncertainty, alternatives, consequences, and limitations required for meaningful review.",
    "Review timing and depth are proportionate to complexity, consequence, reversibility, and uncertainty.",
    "Approval, intervention, stop, escalation, emergency, and override authorities are valid, bounded, and attributable.",
    "Human intervention and stop mechanisms are technically and operationally effective.",
    "Automation bias, fatigue, alert overload, manipulation, coercion, and reviewer disagreement are actively governed.",
    "Actual execution remains identical to what the human reviewed and approved.",
    "Outcome evidence proves whether human oversight actually worked.",
    "Oversight failures, incidents, remediation, requalification, and replay remain preserved and independently reviewable.",
  ],
  nonClaims: [
    "Human presence alone does not prove meaningful oversight.",
    "A click, acknowledgment, signature, or approval alone does not prove independent review.",
    "This lane does not treat humans as a substitute for missing evidence, invalid authority, ineffective controls, or unsafe execution.",
    "This lane does not permit undocumented overrides or retrospective justification.",
    "An ALLOW determination applies only to the exact humans, roles, competence, authority, information, timing, intervention controls, route, and validity window preserved.",
  ],
  sections: HUMAN_OVERSIGHT_SECTIONS,
  gateIds: HUMAN_OVERSIGHT_GATE_IDS,
  evidenceTypes: [...HUMAN_OVERSIGHT_EVIDENCE_TYPES],
  scenarioIds: HUMAN_OVERSIGHT_SCENARIOS.map(
    (scenario) => scenario.scenarioId,
  ),
  determinationGuidance: [
    "DENY when human authority is invalid, intervention is blocked, meaningful review time is absent, an override is unauthorized, or execution differs from human approval.",
    "ESCALATE when independence is compromised, material reviewer disagreement remains unresolved, or superior governance, legal, safety, or executive authority is required.",
    "HOLD when identity, competence, training, information, staffing, review evidence, intervention testing, outcome evidence, or continuing validity is incomplete, expired, overloaded, or unresolved.",
    "ALLOW only when all applicable gates pass and qualified independent humans have sufficient information and time, valid authority, effective intervention capability, preserved accountability, and demonstrated continuing validity.",
  ],
  enabled: true,
  version: "1.0.0",
} as const satisfies LaneDefinition;

export function getHumanOversightScenario(
  scenarioId: string,
): HumanOversightScenario | undefined {
  return HUMAN_OVERSIGHT_SCENARIOS.find(
    (scenario) => scenario.scenarioId === scenarioId,
  );
}
