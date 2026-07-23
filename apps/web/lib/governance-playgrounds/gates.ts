import type { GateDefinition } from "./types";

/**
 * TA-14 Governance-Specific Playgrounds
 * Shared 14-gate evaluation framework
 *
 * Every governance-specific playground uses this same evaluation spine.
 * Individual lane definitions may add applicability rules, required evidence,
 * and scenario-specific conditions, but they must not rename or bypass these
 * shared gates.
 */

export const SHARED_GATE_IDS = [
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
] as const;

export type SharedGateId = (typeof SHARED_GATE_IDS)[number];

export const SHARED_GATE_DEFINITIONS = [
  {
    gateId: "G01_ROUTE_IDENTITY",
    order: 1,
    title: "Route Identity",
    shortTitle: "Identity",
    purpose:
      "Establish the exact route, system, decision, action, or execution being governed.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: [
      "routeTitle",
      "routeDescription",
      "governedObjectType",
      "governedObjectIdentifier",
    ],
    requiredEvidenceTypes: [],
    dependencies: [],
    passConditions: [
      {
        conditionId: "G01-P01",
        description:
          "The governed object and route are uniquely and consistently identified.",
        source: "ROUTE_FIELD",
        field: "governedObjectIdentifier",
        operator: "exists",
      },
    ],
    failConditions: [
      {
        conditionId: "G01-F01",
        description:
          "The governed object is absent, ambiguous, duplicated, or materially inconsistent.",
        source: "ROUTE_FIELD",
        field: "governedObjectIdentifier",
        operator: "not_exists",
      },
    ],
    escalationConditions: [],
    outputClaims: [
      "The tested route and governed object were specifically identified.",
    ],
    prohibitedClaims: [
      "Identity alone proves authority, safety, compliance, or admissibility.",
    ],
    remediationGuidance: [
      "Provide a unique governed-object identifier.",
      "Distinguish this route from prior, parallel, test, and production routes.",
    ],
  },
  {
    gateId: "G02_GOVERNANCE_CLAIM",
    order: 2,
    title: "Governance Claim",
    shortTitle: "Claim",
    purpose:
      "State exactly what the governance architecture claims to control and what it does not claim.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: [
      "governanceClaim",
      "claimedControlLayers",
      "explicitNonClaims",
    ],
    requiredEvidenceTypes: ["GOVERNANCE_CLAIM_SUPPORT"],
    dependencies: ["G01_ROUTE_IDENTITY"],
    passConditions: [
      {
        conditionId: "G02-P01",
        description:
          "The claim is testable, bounded, attributable, and supported by identified evidence.",
        source: "ROUTE_FIELD",
        field: "governanceClaim",
        operator: "exists",
      },
    ],
    failConditions: [
      {
        conditionId: "G02-F01",
        description:
          "The claim is absent, unbounded, internally contradictory, or broader than the declared control layers.",
        source: "ROUTE_FIELD",
        field: "explicitNonClaims",
        operator: "not_exists",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G02-E01",
        description:
          "The claimant disputes the interpretation or decomposition of the governance claim.",
        source: "REVIEWER_FINDING",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "The declared governance claim was decomposed into testable control layers.",
    ],
    prohibitedClaims: [
      "A broad marketing statement proves end-to-end governance.",
    ],
    remediationGuidance: [
      "Rewrite the claim in testable language.",
      "Declare explicit non-claims and limitations.",
      "Map each claimed control layer to evidence and enforceable controls.",
    ],
  },
  {
    gateId: "G03_SCOPE_BOUNDARY",
    order: 3,
    title: "Scope and Boundary",
    shortTitle: "Boundary",
    purpose:
      "Define where governance begins, where it ends, and which actors, systems, environments, and actions are inside or outside scope.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: [
      "inScope",
      "outOfScope",
      "environment",
      "jurisdiction",
    ],
    requiredEvidenceTypes: [],
    dependencies: ["G02_GOVERNANCE_CLAIM"],
    passConditions: [
      {
        conditionId: "G03-P01",
        description:
          "The route contains explicit operational, organizational, geographic, and temporal boundaries.",
        source: "ROUTE_FIELD",
        field: "inScope",
        operator: "exists",
      },
    ],
    failConditions: [
      {
        conditionId: "G03-F01",
        description:
          "The route omits a material boundary or includes actions outside the claimant's declared scope.",
        source: "ROUTE_FIELD",
        field: "outOfScope",
        operator: "not_exists",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G03-E01",
        description:
          "Jurisdiction, ownership, or cross-system responsibility remains materially disputed.",
        source: "REVIEWER_FINDING",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "The determination applies only within the declared and tested boundary.",
    ],
    prohibitedClaims: [
      "A bounded result applies universally or outside the tested environment.",
    ],
    remediationGuidance: [
      "Define explicit inclusion and exclusion boundaries.",
      "Identify jurisdictional and cross-system dependencies.",
    ],
  },
  {
    gateId: "G04_ACTOR_IDENTITY",
    order: 4,
    title: "Actor Identity and Responsibility",
    shortTitle: "Actors",
    purpose:
      "Identify every material human, organization, model, agent, service, and system participating in the route.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: ["actors", "responsibilityMap"],
    requiredEvidenceTypes: ["ACTOR_IDENTITY"],
    dependencies: ["G01_ROUTE_IDENTITY", "G03_SCOPE_BOUNDARY"],
    passConditions: [
      {
        conditionId: "G04-P01",
        description:
          "Material actors are identified and their responsibilities are attributable.",
        source: "ROUTE_FIELD",
        field: "responsibilityMap",
        operator: "exists",
      },
    ],
    failConditions: [
      {
        conditionId: "G04-F01",
        description:
          "A material actor is anonymous, misidentified, duplicated, or lacks an assigned responsibility.",
        source: "EVIDENCE",
        operator: "conflicted",
        evidenceType: "ACTOR_IDENTITY",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G04-E01",
        description:
          "Competing parties claim responsibility or deny responsibility for the same governed action.",
        source: "REVIEWER_FINDING",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "Material route actors and declared responsibilities were identified.",
    ],
    prohibitedClaims: [
      "Actor identity proves authority or competent performance.",
    ],
    remediationGuidance: [
      "Bind every material actor to a stable identifier.",
      "Assign responsibility for each consequential route step.",
    ],
  },
  {
    gateId: "G05_EVIDENCE_SUFFICIENCY",
    order: 5,
    title: "Evidence Sufficiency and Integrity",
    shortTitle: "Evidence",
    purpose:
      "Determine whether the evidence required for the claimed governance control exists, is attributable, current, authentic, and sufficient.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: ["evidenceStatement"],
    requiredEvidenceTypes: ["ROUTE_SUPPORTING_EVIDENCE"],
    dependencies: [
      "G01_ROUTE_IDENTITY",
      "G02_GOVERNANCE_CLAIM",
      "G03_SCOPE_BOUNDARY",
    ],
    passConditions: [
      {
        conditionId: "G05-P01",
        description:
          "All mandatory evidence is present, attributable, current, and adequate for the bounded claim.",
        source: "EVIDENCE",
        operator: "verified",
        evidenceType: "ROUTE_SUPPORTING_EVIDENCE",
      },
    ],
    failConditions: [
      {
        conditionId: "G05-F01",
        description:
          "Mandatory evidence is missing, expired, revoked, materially incomplete, or outside the tested boundary.",
        source: "EVIDENCE",
        operator: "not_exists",
        evidenceType: "ROUTE_SUPPORTING_EVIDENCE",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G05-E01",
        description:
          "Material evidence conflicts and the conflict cannot be resolved within the automated route.",
        source: "EVIDENCE",
        operator: "conflicted",
        evidenceType: "ROUTE_SUPPORTING_EVIDENCE",
      },
    ],
    outputClaims: [
      "The identified evidence was sufficient for the bounded determination at the tested time.",
    ],
    prohibitedClaims: [
      "Evidence sufficiency proves truth beyond the evidence's scope.",
      "Uploaded evidence is automatically authentic or admissible.",
    ],
    remediationGuidance: [
      "Provide the missing evidence.",
      "Resolve authenticity, custody, expiration, and conflict issues.",
      "Reduce the claim to match the evidence actually available.",
    ],
  },
  {
    gateId: "G06_AUTHORITY_VALIDITY",
    order: 6,
    title: "Authority Validity",
    shortTitle: "Authority",
    purpose:
      "Verify that the actor authorizing or executing the route possesses current authority for the exact action and boundary.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: ["authorityDeclarations"],
    requiredEvidenceTypes: ["AUTHORITY_SOURCE"],
    dependencies: [
      "G03_SCOPE_BOUNDARY",
      "G04_ACTOR_IDENTITY",
      "G05_EVIDENCE_SUFFICIENCY",
    ],
    passConditions: [
      {
        conditionId: "G06-P01",
        description:
          "Current authority exists and covers the actor, action, environment, time, and claimed scope.",
        source: "AUTHORITY",
        operator: "valid",
      },
    ],
    failConditions: [
      {
        conditionId: "G06-F01",
        description:
          "Authority is absent, expired, revoked, delegated beyond its source, or outside the declared scope.",
        source: "AUTHORITY",
        operator: "outside_scope",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G06-E01",
        description:
          "Competing or ambiguous authority claims require human or institutional resolution.",
        source: "AUTHORITY",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "The declared authority was valid for the bounded route at the tested time.",
    ],
    prohibitedClaims: [
      "Possessing technical access proves legal, organizational, or delegated authority.",
    ],
    remediationGuidance: [
      "Provide the source and scope of authority.",
      "Renew expired authority or obtain valid delegation.",
      "Reduce the route to the authority actually held.",
    ],
  },
  {
    gateId: "G07_RULE_CONTROL_BINDING",
    order: 7,
    title: "Rule and Control Binding",
    shortTitle: "Controls",
    purpose:
      "Bind declared policy, requirements, risk treatment, or governance rules to enforceable route controls.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: ["controlBindings"],
    requiredEvidenceTypes: ["CONTROL_IMPLEMENTATION"],
    dependencies: [
      "G02_GOVERNANCE_CLAIM",
      "G03_SCOPE_BOUNDARY",
      "G05_EVIDENCE_SUFFICIENCY",
    ],
    passConditions: [
      {
        conditionId: "G07-P01",
        description:
          "Every material declared rule is mapped to an enforceable control, evidence source, owner, and failure consequence.",
        source: "ROUTE_FIELD",
        field: "controlBindings",
        operator: "exists",
      },
    ],
    failConditions: [
      {
        conditionId: "G07-F01",
        description:
          "A material rule exists only as policy language, guidance, a dashboard indicator, or an unenforced recommendation.",
        source: "EVIDENCE",
        operator: "not_exists",
        evidenceType: "CONTROL_IMPLEMENTATION",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G07-E01",
        description:
          "The enforceability or interpretation of a material rule remains disputed.",
        source: "REVIEWER_FINDING",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "Material governance requirements were mapped to identified controls.",
    ],
    prohibitedClaims: [
      "Written policy or a risk score is equivalent to execution control.",
    ],
    remediationGuidance: [
      "Bind each material rule to an enforcement point.",
      "Identify the responsible actor and required evidence.",
      "Define the consequence when the control fails.",
    ],
  },
  {
    gateId: "G08_DEPENDENCY_INTEGRITY",
    order: 8,
    title: "Dependency Integrity",
    shortTitle: "Dependencies",
    purpose:
      "Verify that models, data, tools, vendors, services, credentials, environments, and upstream records remain the approved dependencies.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: ["dependencies"],
    requiredEvidenceTypes: ["DEPENDENCY_IDENTITY"],
    dependencies: [
      "G01_ROUTE_IDENTITY",
      "G03_SCOPE_BOUNDARY",
      "G05_EVIDENCE_SUFFICIENCY",
    ],
    passConditions: [
      {
        conditionId: "G08-P01",
        description:
          "Material dependencies are identified, approved, current, and unchanged from the tested route.",
        source: "EVIDENCE",
        operator: "verified",
        evidenceType: "DEPENDENCY_IDENTITY",
      },
    ],
    failConditions: [
      {
        conditionId: "G08-F01",
        description:
          "A material dependency is unknown, unapproved, substituted, compromised, unavailable, or outside the tested version.",
        source: "EVIDENCE",
        operator: "conflicted",
        evidenceType: "DEPENDENCY_IDENTITY",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G08-E01",
        description:
          "A third party controls a material dependency but cannot provide sufficient evidence or responsibility boundaries.",
        source: "REVIEWER_FINDING",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "The determination applies to the identified dependency set and versions.",
    ],
    prohibitedClaims: [
      "The determination survives an untested dependency change.",
    ],
    remediationGuidance: [
      "Identify and version every material dependency.",
      "Re-test after model, data, tool, vendor, credential, or environment changes.",
    ],
  },
  {
    gateId: "G09_HUMAN_OVERSIGHT",
    order: 9,
    title: "Human Oversight",
    shortTitle: "Oversight",
    purpose:
      "Determine whether required human oversight is qualified, informed, timely, independent, recorded, and capable of intervention.",
    requirementLevel: "CONDITIONAL",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [
      {
        ruleId: "G09-A01",
        description:
          "Applies when the route declares, requires, or depends upon human review, approval, supervision, intervention, or appeal.",
        field: "humanOversightRequired",
        operator: "equals",
        expected: true,
      },
    ],
    requiredFieldKeys: [
      "humanOversightRequired",
      "oversightActors",
      "interventionPowers",
    ],
    requiredEvidenceTypes: ["OVERSIGHT_QUALIFICATION"],
    dependencies: [
      "G04_ACTOR_IDENTITY",
      "G06_AUTHORITY_VALIDITY",
      "G07_RULE_CONTROL_BINDING",
    ],
    passConditions: [
      {
        conditionId: "G09-P01",
        description:
          "The oversight actor can access sufficient information, act in time, and stop or alter the governed action.",
        source: "ROUTE_FIELD",
        field: "interventionPowers",
        operator: "exists",
      },
    ],
    failConditions: [
      {
        conditionId: "G09-F01",
        description:
          "Human oversight is ceremonial, uninformed, unqualified, delayed, conflicted, or unable to intervene.",
        source: "EVIDENCE",
        operator: "not_exists",
        evidenceType: "OVERSIGHT_QUALIFICATION",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G09-E01",
        description:
          "The adequacy or independence of the oversight actor is materially disputed.",
        source: "REVIEWER_FINDING",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "The tested oversight arrangement possessed the declared intervention capability.",
    ],
    prohibitedClaims: [
      "A human approval click proves meaningful oversight.",
    ],
    remediationGuidance: [
      "Provide the oversight actor with sufficient evidence and time.",
      "Grant and test real stop, correction, and escalation authority.",
    ],
  },
  {
    gateId: "G10_EXECUTION_CONSTRAINT",
    order: 10,
    title: "Execution Constraint",
    shortTitle: "Constraint",
    purpose:
      "Verify that execution is technically and procedurally constrained to the approved route, tools, actions, limits, and sequence.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: ["executionConstraints"],
    requiredEvidenceTypes: ["EXECUTION_CONTROL"],
    dependencies: [
      "G06_AUTHORITY_VALIDITY",
      "G07_RULE_CONTROL_BINDING",
      "G08_DEPENDENCY_INTEGRITY",
    ],
    passConditions: [
      {
        conditionId: "G10-P01",
        description:
          "The route cannot execute outside its approved tools, authority, actions, limits, or sequence without producing a governed failure.",
        source: "EVIDENCE",
        operator: "verified",
        evidenceType: "EXECUTION_CONTROL",
      },
    ],
    failConditions: [
      {
        conditionId: "G10-F01",
        description:
          "Execution can bypass, ignore, exceed, or silently diverge from an approved material constraint.",
        source: "EVIDENCE",
        operator: "not_exists",
        evidenceType: "EXECUTION_CONTROL",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G10-E01",
        description:
          "The execution environment cannot prove whether a material constraint is enforceable.",
        source: "SYSTEM_STATE",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "The tested execution path was constrained to the declared route boundary.",
    ],
    prohibitedClaims: [
      "A policy prompt, warning, or dashboard alone makes prohibited execution impossible.",
    ],
    remediationGuidance: [
      "Move critical controls into enforceable execution points.",
      "Fail closed when required evidence, authority, or dependencies are unavailable.",
    ],
  },
  {
    gateId: "G11_INTERVENTION_ESCALATION",
    order: 11,
    title: "Intervention and Escalation",
    shortTitle: "Intervention",
    purpose:
      "Confirm that the route can stop, hold, deny, escalate, correct, or safely recover when a governed condition changes.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: [
      "holdConditions",
      "denyConditions",
      "escalationConditions",
      "recoveryProcedure",
    ],
    requiredEvidenceTypes: ["INTERVENTION_TEST"],
    dependencies: [
      "G09_HUMAN_OVERSIGHT",
      "G10_EXECUTION_CONSTRAINT",
    ],
    passConditions: [
      {
        conditionId: "G11-P01",
        description:
          "Required HOLD, DENY, ESCALATE, stop, correction, and recovery actions are defined and successfully testable.",
        source: "EVIDENCE",
        operator: "verified",
        evidenceType: "INTERVENTION_TEST",
      },
    ],
    failConditions: [
      {
        conditionId: "G11-F01",
        description:
          "The system continues, fails open, or lacks a bounded response after a material governance failure.",
        source: "EVIDENCE",
        operator: "not_exists",
        evidenceType: "INTERVENTION_TEST",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G11-E01",
        description:
          "A required intervention depends on unresolved external authority or unavailable human judgment.",
        source: "SYSTEM_STATE",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "The tested route demonstrated the declared intervention and escalation behavior.",
    ],
    prohibitedClaims: [
      "Documented procedures prove that intervention will work.",
    ],
    remediationGuidance: [
      "Define deterministic failure responses.",
      "Test stop, hold, deny, escalation, correction, and recovery behavior.",
    ],
  },
  {
    gateId: "G12_RECORD_CONTINUITY",
    order: 12,
    title: "Record Continuity",
    shortTitle: "Continuity",
    purpose:
      "Preserve an attributable and tamper-evident chain from declared claim through test configuration, observed result, determination, execution, and correction.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: ["recordPlan"],
    requiredEvidenceTypes: ["RECORD_CONTINUITY"],
    dependencies: [
      "G01_ROUTE_IDENTITY",
      "G04_ACTOR_IDENTITY",
      "G05_EVIDENCE_SUFFICIENCY",
    ],
    passConditions: [
      {
        conditionId: "G12-P01",
        description:
          "Required records are separately classified, attributable, versioned, hash-bound, and linked without overwriting prior states.",
        source: "EVIDENCE",
        operator: "verified",
        evidenceType: "RECORD_CONTINUITY",
      },
    ],
    failConditions: [
      {
        conditionId: "G12-F01",
        description:
          "Material records are missing, mutable without trace, merged across record classes, or disconnected from the governed route.",
        source: "EVIDENCE",
        operator: "conflicted",
        evidenceType: "RECORD_CONTINUITY",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G12-E01",
        description:
          "Custody, authenticity, ownership, or record conflict requires independent review.",
        source: "EVIDENCE",
        operator: "conflicted",
        evidenceType: "RECORD_CONTINUITY",
      },
    ],
    outputClaims: [
      "The tested record chain preserved the identified governance states and changes.",
    ],
    prohibitedClaims: [
      "A mutable activity log is automatically an admissible governance record.",
    ],
    remediationGuidance: [
      "Separate claims, configurations, observations, and determinations.",
      "Preserve immutable versions and correction relationships.",
    ],
  },
  {
    gateId: "G13_OUTCOME_CORRESPONDENCE",
    order: 13,
    title: "Outcome Correspondence",
    shortTitle: "Outcome",
    purpose:
      "Determine whether the executed action and measured outcome correspond to the approved route and claimed result.",
    requirementLevel: "CONDITIONAL",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [
      {
        ruleId: "G13-A01",
        description:
          "Applies when an execution, decision, intervention, or measurable result has occurred or is represented as successful.",
        field: "outcomeAvailable",
        operator: "equals",
        expected: true,
      },
    ],
    requiredFieldKeys: [
      "approvedIntention",
      "executedAction",
      "measuredOutcome",
    ],
    requiredEvidenceTypes: ["OUTCOME_EVIDENCE"],
    dependencies: [
      "G10_EXECUTION_CONSTRAINT",
      "G12_RECORD_CONTINUITY",
    ],
    passConditions: [
      {
        conditionId: "G13-P01",
        description:
          "The executed action matches the approved route and the measured outcome supports only the bounded claim made.",
        source: "EVIDENCE",
        operator: "verified",
        evidenceType: "OUTCOME_EVIDENCE",
      },
    ],
    failConditions: [
      {
        conditionId: "G13-F01",
        description:
          "Execution diverged from approval, the outcome was not measured, or the claimed benefit exceeds the observed result.",
        source: "EVIDENCE",
        operator: "conflicted",
        evidenceType: "OUTCOME_EVIDENCE",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G13-E01",
        description:
          "Outcome causation, attribution, or adverse consequence remains materially disputed.",
        source: "REVIEWER_FINDING",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "The observed outcome corresponded to the bounded approved route to the extent identified.",
    ],
    prohibitedClaims: [
      "Approval, execution, and success are the same state.",
      "Correlation proves causation.",
    ],
    remediationGuidance: [
      "Measure the actual outcome.",
      "Compare approved intention, execution, and observed result separately.",
      "Reduce unsupported benefit claims.",
    ],
  },
  {
    gateId: "G14_REPLAY_CONTINUING_VALIDITY",
    order: 14,
    title: "Replay and Continuing Validity",
    shortTitle: "Replay",
    purpose:
      "Verify that the determination remains valid after time, evidence, authority, dependency, rule, environment, execution, or outcome changes.",
    requirementLevel: "MANDATORY",
    applicableLanes: [
      "general",
      "runtime-execution",
      "model-evaluation",
      "data-provenance",
      "agent-tools",
      "decision",
      "human-oversight",
      "policy-controls",
      "risk",
      "compliance-regulatory",
      "security-third-party",
      "outcome-assurance",
    ],
    applicabilityRules: [],
    requiredFieldKeys: [
      "replayTriggers",
      "validityWindow",
      "driftMonitoringPlan",
    ],
    requiredEvidenceTypes: ["REPLAY_RESULT"],
    dependencies: [
      "G05_EVIDENCE_SUFFICIENCY",
      "G06_AUTHORITY_VALIDITY",
      "G08_DEPENDENCY_INTEGRITY",
      "G12_RECORD_CONTINUITY",
    ],
    passConditions: [
      {
        conditionId: "G14-P01",
        description:
          "Material changes trigger replay, and the current route still satisfies all applicable mandatory gates.",
        source: "EVIDENCE",
        operator: "verified",
        evidenceType: "REPLAY_RESULT",
      },
    ],
    failConditions: [
      {
        conditionId: "G14-F01",
        description:
          "A material change occurred without replay, or replay shows that a prior determination no longer remains valid.",
        source: "SYSTEM_STATE",
        operator: "conflicted",
      },
    ],
    escalationConditions: [
      {
        conditionId: "G14-E01",
        description:
          "The effect of a material change cannot be resolved within the existing evaluator or evidence boundary.",
        source: "REVIEWER_FINDING",
        operator: "conflicted",
      },
    ],
    outputClaims: [
      "The determination was valid only for the tested state and identified validity period.",
    ],
    prohibitedClaims: [
      "A prior ALLOW remains permanently valid.",
      "An unchanged user interface proves an unchanged governed route.",
    ],
    remediationGuidance: [
      "Define all material replay triggers.",
      "Invalidate or hold prior determinations after material drift.",
      "Preserve both the original and replay results.",
    ],
  },
] as const satisfies readonly GateDefinition[];

export type SharedGateDefinition =
  (typeof SHARED_GATE_DEFINITIONS)[number];

export const SHARED_GATE_BY_ID = Object.freeze(
  Object.fromEntries(
    SHARED_GATE_DEFINITIONS.map((gate) => [gate.gateId, gate]),
  ) as Record<SharedGateId, SharedGateDefinition>,
);

export function getSharedGateDefinition(
  gateId: SharedGateId,
): SharedGateDefinition {
  return SHARED_GATE_BY_ID[gateId];
}
