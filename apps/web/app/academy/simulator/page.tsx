"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Decision = "ALLOW" | "HOLD" | "DENY" | "ESCALATE";
type Difficulty = "Intermediate" | "Advanced" | "Expert";
type GateKey = "reality" | "record" | "evidence" | "authority" | "continuity" | "boundary" | "dependencies" | "revalidation";

type GateState = {
  reality: boolean;
  record: boolean;
  evidence: boolean;
  authority: boolean;
  continuity: boolean;
  boundary: boolean;
  dependencies: boolean;
  revalidation: boolean;
};

type Scenario = {
  id: string;
  title: string;
  domain: string;
  difficulty: Difficulty;
  consequence: string;
  evidenceNeed: string;
  authorityNeed: string;
  boundary: string;
  drift: string;
  expected: Decision;
  gates: GateState;
};

type PreservedRun = {
  id: string;
  scenarioId: string;
  title: string;
  decision: Decision;
  score: number;
  failed: string[];
  note: string;
  createdAt: string;
};

type Anchor = {
  number: string;
  name: string;
  question: string;
  proof: string;
};

type RuntimeLink = {
  number: number;
  name: string;
  function: string;
  failure: string;
};

const STORAGE_KEY = "ta14-academy-simulation-center-v2";

const defaultGates: GateState = {
  reality: true,
  record: true,
  evidence: false,
  authority: false,
  continuity: true,
  boundary: true,
  dependencies: true,
  revalidation: false,
};

const scenarios: Scenario[] = [
  {
    id: "vendor-payment",
    title: "Vendor payment above $25,000",
    domain: "Financial execution",
    difficulty: "Advanced",
    consequence: "Funds leave the governed organization.",
    evidenceNeed: "Beneficiary identity, invoice, contract, approval record",
    authorityNeed: "CFO plus authorized controller",
    boundary: "Payment scope and amount ceiling",
    drift: "Bank details or approval chain changes",
    expected: "ESCALATE",
    gates: {
      reality: true,
      record: true,
      evidence: false,
      authority: false,
      continuity: false,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "autonomous-building",
    title: "Autonomous building control change",
    domain: "Physical systems",
    difficulty: "Expert",
    consequence: "A building environment changes without direct human intervention.",
    evidenceNeed: "Current sensor record, control intent, occupancy state",
    authorityNeed: "Facilities authority within approved operating band",
    boundary: "Setpoint, duration, zone, and safety constraints",
    drift: "Sensor, occupancy, weather, or equipment state changes",
    expected: "HOLD",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: false,
      revalidation: false,
    },
  },
  {
    id: "regulated-record",
    title: "Regulated record release",
    domain: "Records governance",
    difficulty: "Advanced",
    consequence: "A regulated record becomes externally binding.",
    evidenceNeed: "Verified record, disclosure basis, recipient identity",
    authorityNeed: "Authorized privacy or records officer",
    boundary: "Permitted fields, recipient, purpose, and duration",
    drift: "Consent, classification, or legal hold changes",
    expected: "ALLOW",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: true,
    },
  },
  {
    id: "clinical-triage",
    title: "Clinical AI triage recommendation",
    domain: "Healthcare",
    difficulty: "Expert",
    consequence: "A patient may receive delayed, accelerated, or redirected care.",
    evidenceNeed: "Current observations, provenance, model limits, clinician context",
    authorityNeed: "Licensed clinician with current scope",
    boundary: "Recommendation only; no autonomous diagnosis or treatment",
    drift: "Patient status, medication, or symptom changes",
    expected: "HOLD",
    gates: {
      reality: true,
      record: true,
      evidence: false,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "hiring-screen",
    title: "Automated hiring-screen disposition",
    domain: "Employment",
    difficulty: "Advanced",
    consequence: "A candidate may be advanced or excluded from employment consideration.",
    evidenceNeed: "Validated criteria, candidate record, bias testing, accommodation status",
    authorityNeed: "Authorized hiring decision owner",
    boundary: "Screening support only within published job criteria",
    drift: "Job requirements, candidate data, or legal constraints change",
    expected: "ESCALATE",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: false,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "credit-limit",
    title: "Consumer credit-limit increase",
    domain: "Financial services",
    difficulty: "Expert",
    consequence: "A consumer receives altered access to credit and financial exposure.",
    evidenceNeed: "Current income, repayment history, identity, policy version",
    authorityNeed: "Delegated credit authority within threshold",
    boundary: "Product, amount, jurisdiction, and risk limits",
    drift: "Fraud signal, policy, income, or account condition changes",
    expected: "HOLD",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: false,
      boundary: true,
      dependencies: false,
      revalidation: false,
    },
  },
  {
    id: "robotic-maintenance",
    title: "Industrial robot maintenance restart",
    domain: "Industrial safety",
    difficulty: "Expert",
    consequence: "Machinery re-enters an operating state near people and equipment.",
    evidenceNeed: "Lockout record, inspection, guarding, test cycle evidence",
    authorityNeed: "Authorized maintenance and safety sign-off",
    boundary: "Named cell, speed, payload, and operating window",
    drift: "Guard, sensor, personnel, or maintenance state changes",
    expected: "DENY",
    gates: {
      reality: true,
      record: true,
      evidence: false,
      authority: true,
      continuity: true,
      boundary: false,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "public-benefit",
    title: "Public-benefit eligibility recommendation",
    domain: "Public sector",
    difficulty: "Advanced",
    consequence: "A person may receive or lose access to a public benefit.",
    evidenceNeed: "Application record, policy basis, identity, exception review",
    authorityNeed: "Authorized caseworker or adjudicator",
    boundary: "Recommendation bounded to current program and jurisdiction",
    drift: "Policy, household, income, or appeal status changes",
    expected: "ESCALATE",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "model-deploy",
    title: "High-impact model production deployment",
    domain: "AI operations",
    difficulty: "Expert",
    consequence: "A model begins shaping consequential decisions at production scale.",
    evidenceNeed: "Evaluation results, data lineage, risk review, rollback proof",
    authorityNeed: "Named deployment authority and system owner",
    boundary: "Approved use case, users, regions, and decision rights",
    drift: "Model, data, dependency, or threat state changes",
    expected: "HOLD",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: false,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "data-export",
    title: "Sensitive dataset cross-border export",
    domain: "Data governance",
    difficulty: "Expert",
    consequence: "Sensitive data moves across systems and jurisdictions.",
    evidenceNeed: "Classification, lawful basis, recipient controls, transfer assessment",
    authorityNeed: "Data owner plus privacy authority",
    boundary: "Approved fields, destination, purpose, and retention",
    drift: "Jurisdiction, recipient, consent, or classification changes",
    expected: "DENY",
    gates: {
      reality: true,
      record: true,
      evidence: false,
      authority: true,
      continuity: true,
      boundary: false,
      dependencies: false,
      revalidation: false,
    },
  },
  {
    id: "emergency-dispatch",
    title: "AI-assisted emergency dispatch priority",
    domain: "Public safety",
    difficulty: "Expert",
    consequence: "Emergency resources may be redirected under time pressure.",
    evidenceNeed: "Caller record, location confidence, incident type, resource state",
    authorityNeed: "Certified dispatcher within command policy",
    boundary: "Priority recommendation only; dispatcher retains final authority",
    drift: "Incident severity, location, or resource availability changes",
    expected: "ESCALATE",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: false,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "insurance-claim",
    title: "Automated insurance claim settlement",
    domain: "Insurance",
    difficulty: "Advanced",
    consequence: "A claimant receives or is denied financial settlement.",
    evidenceNeed: "Policy, loss evidence, valuation, fraud indicators",
    authorityNeed: "Claims authority within settlement threshold",
    boundary: "Named claim, coverage, amount, and exception limits",
    drift: "New evidence, fraud signal, litigation, or policy interpretation",
    expected: "HOLD",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "school-placement",
    title: "Student placement recommendation",
    domain: "Education",
    difficulty: "Intermediate",
    consequence: "A learner may be placed into a consequential educational track.",
    evidenceNeed: "Current assessment, teacher input, accommodations, family record",
    authorityNeed: "Authorized educator or placement team",
    boundary: "Recommendation only within published placement policy",
    drift: "Accommodation, assessment, enrollment, or appeal changes",
    expected: "ESCALATE",
    gates: {
      reality: true,
      record: true,
      evidence: false,
      authority: false,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "grid-balancing",
    title: "Autonomous electrical grid balancing action",
    domain: "Critical infrastructure",
    difficulty: "Expert",
    consequence: "Electrical service and equipment stability may be affected.",
    evidenceNeed: "Telemetry, forecast, reserve state, equipment constraints",
    authorityNeed: "Grid operator authority within emergency protocol",
    boundary: "Named assets, duration, ramp rate, and reserve floor",
    drift: "Telemetry, weather, demand, or equipment status changes",
    expected: "HOLD",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: false,
      revalidation: false,
    },
  },
  {
    id: "content-removal",
    title: "Platform content-removal decision",
    domain: "Digital platforms",
    difficulty: "Intermediate",
    consequence: "Speech, access, or account standing may be affected.",
    evidenceNeed: "Content record, policy basis, context, prior notices",
    authorityNeed: "Authorized moderator or appeals authority",
    boundary: "Specific content and policy; no account-wide expansion",
    drift: "Context, policy, appeal, or threat state changes",
    expected: "ESCALATE",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "procurement-award",
    title: "Public procurement award recommendation",
    domain: "Procurement",
    difficulty: "Advanced",
    consequence: "Public funds and supplier opportunity may be allocated.",
    evidenceNeed: "Bid record, scoring rubric, conflicts, evaluation trail",
    authorityNeed: "Authorized procurement board",
    boundary: "Named solicitation, criteria, and award ceiling",
    drift: "Conflict, bid protest, funding, or scoring changes",
    expected: "HOLD",
    gates: {
      reality: true,
      record: true,
      evidence: false,
      authority: true,
      continuity: false,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "air-quality",
    title: "Automated indoor-air intervention",
    domain: "Environmental systems",
    difficulty: "Advanced",
    consequence: "Equipment operation and occupant exposure conditions change.",
    evidenceNeed: "Current sensor record, calibration, occupancy, equipment status",
    authorityNeed: "Facilities authority within approved intervention band",
    boundary: "Named zone, equipment, duration, and safe operating range",
    drift: "Sensor validity, occupancy, weather, or equipment changes",
    expected: "HOLD",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: false,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "identity-revoke",
    title: "Privileged identity access revocation",
    domain: "Cybersecurity",
    difficulty: "Advanced",
    consequence: "A person or service loses access to critical systems.",
    evidenceNeed: "Identity proof, session record, risk signal, owner context",
    authorityNeed: "IAM authority under incident policy",
    boundary: "Named identity, systems, duration, and recovery path",
    drift: "Incident, ownership, session, or business continuity changes",
    expected: "ALLOW",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: false,
      revalidation: true,
    },
  },
  {
    id: "autonomous-vehicle",
    title: "Autonomous vehicle remote-route change",
    domain: "Mobility",
    difficulty: "Expert",
    consequence: "A vehicle changes path while transporting people or goods.",
    evidenceNeed: "Map, localization, traffic, vehicle health, mission record",
    authorityNeed: "Fleet authority within operating design domain",
    boundary: "Approved geography, weather, speed, and mission constraints",
    drift: "Road, weather, sensor, passenger, or vehicle state changes",
    expected: "DENY",
    gates: {
      reality: true,
      record: true,
      evidence: false,
      authority: true,
      continuity: true,
      boundary: false,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "legal-filing",
    title: "AI-prepared legal filing submission",
    domain: "Legal operations",
    difficulty: "Expert",
    consequence: "A representation becomes binding before a court or agency.",
    evidenceNeed: "Source record, citations, client approval, jurisdiction rules",
    authorityNeed: "Licensed counsel with filing authority",
    boundary: "Named matter, jurisdiction, claims, and filing deadline",
    drift: "Facts, law, client instruction, or docket status changes",
    expected: "ESCALATE",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "supply-release",
    title: "Critical pharmaceutical batch release",
    domain: "Life sciences",
    difficulty: "Expert",
    consequence: "A manufactured batch enters distribution and patient use.",
    evidenceNeed: "Test results, chain of custody, deviations, stability record",
    authorityNeed: "Qualified person or release authority",
    boundary: "Named batch, market, shelf life, and release conditions",
    drift: "Deviation, test, storage, or regulatory status changes",
    expected: "DENY",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: false,
      continuity: false,
      boundary: false,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "payroll-change",
    title: "Enterprise payroll master-data change",
    domain: "Enterprise operations",
    difficulty: "Intermediate",
    consequence: "Employee compensation and tax records may be altered.",
    evidenceNeed: "Employee request, identity, supporting record, effective date",
    authorityNeed: "Payroll authority within assigned organization",
    boundary: "Named employee, fields, effective date, and audit window",
    drift: "Employment, banking, tax, or approval state changes",
    expected: "HOLD",
    gates: {
      reality: true,
      record: true,
      evidence: false,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: false,
      revalidation: false,
    },
  },
  {
    id: "research-release",
    title: "Dual-use research publication release",
    domain: "Research governance",
    difficulty: "Expert",
    consequence: "Sensitive capability information may become publicly available.",
    evidenceNeed: "Manuscript, risk review, funding terms, mitigation record",
    authorityNeed: "Research institution publication authority",
    boundary: "Approved redactions, audience, timing, and distribution",
    drift: "Threat, legal, sponsor, or classification status changes",
    expected: "ESCALATE",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: true,
      boundary: true,
      dependencies: true,
      revalidation: false,
    },
  },
  {
    id: "water-treatment",
    title: "Autonomous water-treatment dosing change",
    domain: "Critical infrastructure",
    difficulty: "Expert",
    consequence: "Chemical dosing changes water quality and public exposure.",
    evidenceNeed: "Current sensors, calibration, lab results, process state",
    authorityNeed: "Licensed operator within approved dosing envelope",
    boundary: "Named process, chemical, range, duration, and fallback",
    drift: "Sensor, source water, equipment, or lab result changes",
    expected: "DENY",
    gates: {
      reality: true,
      record: true,
      evidence: true,
      authority: true,
      continuity: true,
      boundary: false,
      dependencies: true,
      revalidation: false,
    },
  },
];

const anchors: Anchor[] = [
  {
    number: "01",
    name: "Reality",
    question: "What is true now?",
    proof: "Current observations and conditions.",
  },
  {
    number: "02",
    name: "Record",
    question: "What has been captured?",
    proof: "Attributable, timestamped, reviewable records.",
  },
  {
    number: "03",
    name: "Continuity",
    question: "Has identity and state remained connected?",
    proof: "Traceable custody, versions, and dependencies.",
  },
  {
    number: "04",
    name: "Admissibility",
    question: "May the evidence support this action?",
    proof: "Current, sufficient, relevant evidence.",
  },
  {
    number: "05",
    name: "Binding",
    question: "What may become authoritative?",
    proof: "Valid authority and bounded decision rights.",
  },
  {
    number: "06",
    name: "Commit",
    question: "What exact determination is preserved?",
    proof: "Versioned decision and conditions.",
  },
  {
    number: "07",
    name: "Execution",
    question: "What is permitted to occur?",
    proof: "Controlled action inside the approved boundary.",
  },
  {
    number: "08",
    name: "Outcome",
    question: "What actually happened?",
    proof: "Preserved result, variance, and learning evidence.",
  },
];

const runtimeLinks: RuntimeLink[] = [
  {
    number: 1,
    name: "Purpose",
    function: "Tests the purpose condition before consequence may bind to reality.",
    failure: "If purpose is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 2,
    name: "Actor",
    function: "Tests the actor condition before consequence may bind to reality.",
    failure: "If actor is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 3,
    name: "Consequence",
    function: "Tests the consequence condition before consequence may bind to reality.",
    failure: "If consequence is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 4,
    name: "Boundary",
    function: "Tests the boundary condition before consequence may bind to reality.",
    failure: "If boundary is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 5,
    name: "Reality",
    function: "Tests the reality condition before consequence may bind to reality.",
    failure: "If reality is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 6,
    name: "Record",
    function: "Tests the record condition before consequence may bind to reality.",
    failure: "If record is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 7,
    name: "Source",
    function: "Tests the source condition before consequence may bind to reality.",
    failure: "If source is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 8,
    name: "Provenance",
    function: "Tests the provenance condition before consequence may bind to reality.",
    failure: "If provenance is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 9,
    name: "Currency",
    function: "Tests the currency condition before consequence may bind to reality.",
    failure: "If currency is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 10,
    name: "Completeness",
    function: "Tests the completeness condition before consequence may bind to reality.",
    failure: "If completeness is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 11,
    name: "Relevance",
    function: "Tests the relevance condition before consequence may bind to reality.",
    failure: "If relevance is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 12,
    name: "Conflict",
    function: "Tests the conflict condition before consequence may bind to reality.",
    failure: "If conflict is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 13,
    name: "Authority",
    function: "Tests the authority condition before consequence may bind to reality.",
    failure: "If authority is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 14,
    name: "Scope",
    function: "Tests the scope condition before consequence may bind to reality.",
    failure: "If scope is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 15,
    name: "Delegation",
    function: "Tests the delegation condition before consequence may bind to reality.",
    failure: "If delegation is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 16,
    name: "Continuity",
    function: "Tests the continuity condition before consequence may bind to reality.",
    failure: "If continuity is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 17,
    name: "Dependency",
    function: "Tests the dependency condition before consequence may bind to reality.",
    failure: "If dependency is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 18,
    name: "Drift",
    function: "Tests the drift condition before consequence may bind to reality.",
    failure: "If drift is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 19,
    name: "Admissibility",
    function: "Tests the admissibility condition before consequence may bind to reality.",
    failure: "If admissibility is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 20,
    name: "Determination",
    function: "Tests the determination condition before consequence may bind to reality.",
    failure: "If determination is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 21,
    name: "Binding",
    function: "Tests the binding condition before consequence may bind to reality.",
    failure: "If binding is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 22,
    name: "Commit",
    function: "Tests the commit condition before consequence may bind to reality.",
    failure: "If commit is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 23,
    name: "Execution",
    function: "Tests the execution condition before consequence may bind to reality.",
    failure: "If execution is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
  {
    number: 24,
    name: "Outcome",
    function: "Tests the outcome condition before consequence may bind to reality.",
    failure: "If outcome is missing, stale, conflicted, or outside scope, execution cannot silently proceed.",
  },
];

const gateLabels: Array<{ key: GateKey; label: string; question: string; hold: string }> = [
  { key: "reality", label: "Reality established", question: "Are the relevant present conditions known?", hold: "Current reality has not been established." },
  { key: "record", label: "Record preserved", question: "Is the source record attributable and inspectable?", hold: "The record is missing or not preservable." },
  { key: "evidence", label: "Evidence admissible", question: "Is the evidence sufficient, current, and relevant?", hold: "Admissible evidence is incomplete." },
  { key: "authority", label: "Authority valid", question: "Is authority valid for this exact action now?", hold: "Required authority is not established." },
  { key: "continuity", label: "Continuity preserved", question: "Has identity, state, and custody remained connected?", hold: "Continuity has not been preserved." },
  { key: "boundary", label: "Boundary respected", question: "Does the action remain within approved scope?", hold: "The action exceeds its approved boundary." },
  { key: "dependencies", label: "Dependencies valid", question: "Are required systems and conditions still valid?", hold: "A required dependency changed or failed." },
  { key: "revalidation", label: "Revalidation complete", question: "Were conditions rechecked immediately before execution?", hold: "Pre-execution revalidation is incomplete." },
];


type FailureDrill = {
  link: number;
  title: string;
  injectedChange: string;
  learnerTask: string;
  evidenceToSeek: string;
  correctResponse: Decision;
  teachingPoint: string;
};

type DebriefPrompt = {
  number: number;
  stage: string;
  observation: string;
  challenge: string;
  preservation: string;
};

type CompetencyCriterion = {
  id: string;
  capability: string;
  developing: string;
  proficient: string;
  advanced: string;
  evidence: string;
};

const failureDrills: FailureDrill[] = [
  {
    link: 1,
    title: "Purpose failure injection",
    injectedChange: "A material change is introduced at the purpose link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current purpose condition rather than relying on the prior state.",
    correctResponse: "ESCALATE",
    teachingPoint: "A completed route cannot silently carry an invalid purpose condition into execution.",
  },
  {
    link: 2,
    title: "Actor failure injection",
    injectedChange: "A material change is introduced at the actor link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current actor condition rather than relying on the prior state.",
    correctResponse: "DENY",
    teachingPoint: "A completed route cannot silently carry an invalid actor condition into execution.",
  },
  {
    link: 3,
    title: "Consequence failure injection",
    injectedChange: "A material change is introduced at the consequence link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current consequence condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid consequence condition into execution.",
  },
  {
    link: 4,
    title: "Boundary failure injection",
    injectedChange: "A material change is introduced at the boundary link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current boundary condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid boundary condition into execution.",
  },
  {
    link: 5,
    title: "Reality failure injection",
    injectedChange: "A material change is introduced at the reality link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current reality condition rather than relying on the prior state.",
    correctResponse: "ESCALATE",
    teachingPoint: "A completed route cannot silently carry an invalid reality condition into execution.",
  },
  {
    link: 6,
    title: "Record failure injection",
    injectedChange: "A material change is introduced at the record link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current record condition rather than relying on the prior state.",
    correctResponse: "DENY",
    teachingPoint: "A completed route cannot silently carry an invalid record condition into execution.",
  },
  {
    link: 7,
    title: "Source failure injection",
    injectedChange: "A material change is introduced at the source link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current source condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid source condition into execution.",
  },
  {
    link: 8,
    title: "Provenance failure injection",
    injectedChange: "A material change is introduced at the provenance link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current provenance condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid provenance condition into execution.",
  },
  {
    link: 9,
    title: "Currency failure injection",
    injectedChange: "A material change is introduced at the currency link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current currency condition rather than relying on the prior state.",
    correctResponse: "ESCALATE",
    teachingPoint: "A completed route cannot silently carry an invalid currency condition into execution.",
  },
  {
    link: 10,
    title: "Completeness failure injection",
    injectedChange: "A material change is introduced at the completeness link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current completeness condition rather than relying on the prior state.",
    correctResponse: "DENY",
    teachingPoint: "A completed route cannot silently carry an invalid completeness condition into execution.",
  },
  {
    link: 11,
    title: "Relevance failure injection",
    injectedChange: "A material change is introduced at the relevance link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current relevance condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid relevance condition into execution.",
  },
  {
    link: 12,
    title: "Conflict failure injection",
    injectedChange: "A material change is introduced at the conflict link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current conflict condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid conflict condition into execution.",
  },
  {
    link: 13,
    title: "Authority failure injection",
    injectedChange: "A material change is introduced at the authority link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current authority condition rather than relying on the prior state.",
    correctResponse: "ESCALATE",
    teachingPoint: "A completed route cannot silently carry an invalid authority condition into execution.",
  },
  {
    link: 14,
    title: "Scope failure injection",
    injectedChange: "A material change is introduced at the scope link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current scope condition rather than relying on the prior state.",
    correctResponse: "DENY",
    teachingPoint: "A completed route cannot silently carry an invalid scope condition into execution.",
  },
  {
    link: 15,
    title: "Delegation failure injection",
    injectedChange: "A material change is introduced at the delegation link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current delegation condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid delegation condition into execution.",
  },
  {
    link: 16,
    title: "Continuity failure injection",
    injectedChange: "A material change is introduced at the continuity link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current continuity condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid continuity condition into execution.",
  },
  {
    link: 17,
    title: "Dependency failure injection",
    injectedChange: "A material change is introduced at the dependency link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current dependency condition rather than relying on the prior state.",
    correctResponse: "ESCALATE",
    teachingPoint: "A completed route cannot silently carry an invalid dependency condition into execution.",
  },
  {
    link: 18,
    title: "Drift failure injection",
    injectedChange: "A material change is introduced at the drift link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current drift condition rather than relying on the prior state.",
    correctResponse: "DENY",
    teachingPoint: "A completed route cannot silently carry an invalid drift condition into execution.",
  },
  {
    link: 19,
    title: "Admissibility failure injection",
    injectedChange: "A material change is introduced at the admissibility link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current admissibility condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid admissibility condition into execution.",
  },
  {
    link: 20,
    title: "Determination failure injection",
    injectedChange: "A material change is introduced at the determination link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current determination condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid determination condition into execution.",
  },
  {
    link: 21,
    title: "Binding failure injection",
    injectedChange: "A material change is introduced at the binding link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current binding condition rather than relying on the prior state.",
    correctResponse: "ESCALATE",
    teachingPoint: "A completed route cannot silently carry an invalid binding condition into execution.",
  },
  {
    link: 22,
    title: "Commit failure injection",
    injectedChange: "A material change is introduced at the commit link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current commit condition rather than relying on the prior state.",
    correctResponse: "DENY",
    teachingPoint: "A completed route cannot silently carry an invalid commit condition into execution.",
  },
  {
    link: 23,
    title: "Execution failure injection",
    injectedChange: "A material change is introduced at the execution link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current execution condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid execution condition into execution.",
  },
  {
    link: 24,
    title: "Outcome failure injection",
    injectedChange: "A material change is introduced at the outcome link immediately before execution.",
    learnerTask: "Identify whether the change breaks standing, authority, continuity, boundary, or evidentiary sufficiency.",
    evidenceToSeek: "Locate the attributable record that can prove the current outcome condition rather than relying on the prior state.",
    correctResponse: "HOLD",
    teachingPoint: "A completed route cannot silently carry an invalid outcome condition into execution.",
  },
];

const debriefPrompts: DebriefPrompt[] = [
  {
    number: 1,
    stage: "Purpose",
    observation: "State what the simulation actually established about purpose, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the purpose link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the purpose determination.",
  },
  {
    number: 2,
    stage: "Actor",
    observation: "State what the simulation actually established about actor, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the actor link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the actor determination.",
  },
  {
    number: 3,
    stage: "Consequence",
    observation: "State what the simulation actually established about consequence, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the consequence link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the consequence determination.",
  },
  {
    number: 4,
    stage: "Boundary",
    observation: "State what the simulation actually established about boundary, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the boundary link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the boundary determination.",
  },
  {
    number: 5,
    stage: "Reality",
    observation: "State what the simulation actually established about reality, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the reality link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the reality determination.",
  },
  {
    number: 6,
    stage: "Record",
    observation: "State what the simulation actually established about record, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the record link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the record determination.",
  },
  {
    number: 7,
    stage: "Source",
    observation: "State what the simulation actually established about source, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the source link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the source determination.",
  },
  {
    number: 8,
    stage: "Provenance",
    observation: "State what the simulation actually established about provenance, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the provenance link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the provenance determination.",
  },
  {
    number: 9,
    stage: "Currency",
    observation: "State what the simulation actually established about currency, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the currency link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the currency determination.",
  },
  {
    number: 10,
    stage: "Completeness",
    observation: "State what the simulation actually established about completeness, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the completeness link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the completeness determination.",
  },
  {
    number: 11,
    stage: "Relevance",
    observation: "State what the simulation actually established about relevance, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the relevance link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the relevance determination.",
  },
  {
    number: 12,
    stage: "Conflict",
    observation: "State what the simulation actually established about conflict, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the conflict link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the conflict determination.",
  },
  {
    number: 13,
    stage: "Authority",
    observation: "State what the simulation actually established about authority, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the authority link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the authority determination.",
  },
  {
    number: 14,
    stage: "Scope",
    observation: "State what the simulation actually established about scope, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the scope link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the scope determination.",
  },
  {
    number: 15,
    stage: "Delegation",
    observation: "State what the simulation actually established about delegation, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the delegation link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the delegation determination.",
  },
  {
    number: 16,
    stage: "Continuity",
    observation: "State what the simulation actually established about continuity, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the continuity link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the continuity determination.",
  },
  {
    number: 17,
    stage: "Dependency",
    observation: "State what the simulation actually established about dependency, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the dependency link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the dependency determination.",
  },
  {
    number: 18,
    stage: "Drift",
    observation: "State what the simulation actually established about drift, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the drift link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the drift determination.",
  },
  {
    number: 19,
    stage: "Admissibility",
    observation: "State what the simulation actually established about admissibility, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the admissibility link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the admissibility determination.",
  },
  {
    number: 20,
    stage: "Determination",
    observation: "State what the simulation actually established about determination, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the determination link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the determination determination.",
  },
  {
    number: 21,
    stage: "Binding",
    observation: "State what the simulation actually established about binding, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the binding link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the binding determination.",
  },
  {
    number: 22,
    stage: "Commit",
    observation: "State what the simulation actually established about commit, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the commit link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the commit determination.",
  },
  {
    number: 23,
    stage: "Execution",
    observation: "State what the simulation actually established about execution, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the execution link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the execution determination.",
  },
  {
    number: 24,
    stage: "Outcome",
    observation: "State what the simulation actually established about outcome, without adding assumptions.",
    challenge: "Explain what a reviewer could reasonably dispute at the outcome link.",
    preservation: "Name the record, timestamp, source, and version needed to preserve the outcome determination.",
  },
];

const competencyCriteria: CompetencyCriterion[] = [
  {
    id: "boundary",
    capability: "Boundary definition",
    developing: "Names the action but leaves scope implicit.",
    proficient: "Defines actors, consequence, scope, exclusions, and time window.",
    advanced: "Detects boundary expansion and designs enforceable constraint checks.",
    evidence: "A bounded action statement and explicit exclusions.",
  },
  {
    id: "reality",
    capability: "Reality establishment",
    developing: "Relies on general context or prior conditions.",
    proficient: "Uses current attributable observations relevant to the action.",
    advanced: "Separates direct observation, inference, uncertainty, and contested reality.",
    evidence: "Current reality record with source and timestamp.",
  },
  {
    id: "record",
    capability: "Record integrity",
    developing: "Captures notes without provenance or version.",
    proficient: "Preserves attributable, timestamped, reviewable source records.",
    advanced: "Designs custody, version, correction, and challenge controls.",
    evidence: "Record package with provenance and version history.",
  },
  {
    id: "evidence",
    capability: "Evidence admissibility",
    developing: "Treats available information as sufficient evidence.",
    proficient: "Tests currency, relevance, completeness, conflict, and sufficiency.",
    advanced: "Explains why evidence has standing for this exact consequence.",
    evidence: "Evidence matrix and unresolved-gap record.",
  },
  {
    id: "authority",
    capability: "Authority validation",
    developing: "Identifies a role but not current delegated power.",
    proficient: "Validates actor, role, scope, delegation, and present validity.",
    advanced: "Detects authority drift, conflicts, and nondelegable decisions.",
    evidence: "Authority record tied to action and boundary.",
  },
  {
    id: "continuity",
    capability: "Continuity preservation",
    developing: "Assumes identity and state remain connected.",
    proficient: "Traces identity, custody, versions, dependencies, and state changes.",
    advanced: "Locates the exact break and prevents silent continuity repair.",
    evidence: "Continuity map and break log.",
  },
  {
    id: "drift",
    capability: "Drift recognition",
    developing: "Notices obvious changes after the fact.",
    proficient: "Identifies conditions that require revalidation before execution.",
    advanced: "Builds trigger logic for authority, evidence, dependency, and boundary drift.",
    evidence: "Drift register and revalidation policy.",
  },
  {
    id: "determination",
    capability: "Determination discipline",
    developing: "Chooses a favorable result from incomplete conditions.",
    proficient: "Uses ALLOW, HOLD, DENY, or ESCALATE with explicit reasons.",
    advanced: "Distinguishes curable holds, prohibited actions, and authority escalation.",
    evidence: "Preserved determination with failed links.",
  },
  {
    id: "execution",
    capability: "Execution control",
    developing: "Treats approval as unrestricted permission.",
    proficient: "Binds execution to exact conditions, limits, and validity window.",
    advanced: "Designs fail-closed enforcement and controlled exception handling.",
    evidence: "Execution permit and enforcement record.",
  },
  {
    id: "outcome",
    capability: "Outcome correspondence",
    developing: "Records whether the task completed.",
    proficient: "Compares intended, permitted, actual, and observed outcome.",
    advanced: "Identifies variance, unintended consequence, and learning obligations.",
    evidence: "Outcome record with correspondence analysis.",
  },
  {
    id: "challenge",
    capability: "Challengeability",
    developing: "Defends the route without preserving objections.",
    proficient: "Records findings, objections, corrections, and unresolved disputes.",
    advanced: "Maintains challenge without erasing lineage or uncertainty.",
    evidence: "Review record and correction history.",
  },
  {
    id: "communication",
    capability: "Governance communication",
    developing: "Uses abstract terminology without operational meaning.",
    proficient: "Explains the failed condition and required next action plainly.",
    advanced: "Communicates limits without overstating certainty or authority.",
    evidence: "Plain-language learner debrief.",
  },
];

type OperatingPrinciple = {
  number: number;
  title: string;
  rule: string;
  practice: string;
};

const operatingPrinciples: OperatingPrinciple[] = [
  {
    number: 1,
    title: "Evidence before intervention",
    rule: "Do not act merely because a workflow reached its final step.",
    practice: "Require current, relevant, attributable proof before permission is considered.",
  },
  {
    number: 2,
    title: "Admissibility before execution",
    rule: "Available information is not automatically admissible evidence.",
    practice: "Test standing, sufficiency, conflict, currency, and scope.",
  },
  {
    number: 3,
    title: "Boundary before authority",
    rule: "Authority must attach to an exact action and consequence.",
    practice: "Reject vague permission that silently expands during execution.",
  },
  {
    number: 4,
    title: "Continuity before reliance",
    rule: "A valid beginning does not prove an unbroken route.",
    practice: "Preserve identity, custody, state, versions, and dependencies.",
  },
  {
    number: 5,
    title: "Revalidation before consequence",
    rule: "Prior permission may expire when material conditions change.",
    practice: "Recheck decisive conditions immediately before execution.",
  },
  {
    number: 6,
    title: "Failure must remain visible",
    rule: "Uncertainty cannot be converted into a favorable answer by interface design.",
    practice: "Preserve unknown, disputed, missing, and stale states.",
  },
  {
    number: 7,
    title: "The earliest break controls",
    rule: "Later completion cannot cure an earlier architectural failure.",
    practice: "Stop at the first failed runtime link and preserve why.",
  },
  {
    number: 8,
    title: "Authority cannot be invented",
    rule: "A system may explain authority but may not manufacture it.",
    practice: "Escalate when valid decision rights are absent or unclear.",
  },
  {
    number: 9,
    title: "Evidence cannot be fabricated",
    rule: "A learning environment may provide examples, never false proof.",
    practice: "Keep scenario assumptions distinct from production evidence.",
  },
  {
    number: 10,
    title: "Outcome does not cure process",
    rule: "A favorable result does not retroactively authorize an inadmissible action.",
    practice: "Compare intended, permitted, actual, and observed outcomes.",
  },
  {
    number: 11,
    title: "Challenge must remain possible",
    rule: "Governance requires correction without erasing lineage.",
    practice: "Preserve objections, findings, versions, and unresolved disputes.",
  },
  {
    number: 12,
    title: "Competency must be bounded",
    rule: "Capability demonstrated in one scope is not universal standing.",
    practice: "Attach evidence to task, domain, conditions, and validity period.",
  },
  {
    number: 13,
    title: "Completion is not competency",
    rule: "Finishing content proves participation, not reliable performance.",
    practice: "Require observable work products and reviewable determinations.",
  },
  {
    number: 14,
    title: "Confidence is not permission",
    rule: "Model certainty cannot substitute for authority or evidence.",
    practice: "Treat confidence as one signal inside a governed route.",
  },
  {
    number: 15,
    title: "Identity is not admissibility",
    rule: "A verified actor may still attempt an inadmissible execution.",
    practice: "Validate the exact action, evidence, authority, and conditions.",
  },
  {
    number: 16,
    title: "Access is not standing",
    rule: "Permission to reach a system is not permission to bind reality.",
    practice: "Separate access governance from execution governance.",
  },
  {
    number: 17,
    title: "Exceptions require governance",
    rule: "Urgency does not erase architecture.",
    practice: "Bound emergency authority, duration, evidence, and after-action review.",
  },
  {
    number: 18,
    title: "Dependencies carry risk",
    rule: "A route inherits conditions from systems it depends upon.",
    practice: "Track dependency validity, drift, failure, and replacement.",
  },
  {
    number: 19,
    title: "Records require provenance",
    rule: "A record without source, time, identity, and version cannot carry full weight.",
    practice: "Preserve who, what, when, where, and how.",
  },
  {
    number: 20,
    title: "Simulation must not impersonate production",
    rule: "Practice artifacts are educational evidence, not execution authority.",
    practice: "Label local runs and prevent transfer of standing by implication.",
  },
  {
    number: 21,
    title: "Determinations require reasons",
    rule: "ALLOW, HOLD, DENY, and ESCALATE must remain explainable.",
    practice: "Tie each outcome to specific passed and failed conditions.",
  },
  {
    number: 22,
    title: "Binding must be explicit",
    rule: "A determination becomes operational only through controlled commitment.",
    practice: "Preserve the exact decision, conditions, owner, and validity window.",
  },
  {
    number: 23,
    title: "Execution must correspond",
    rule: "The action performed must match the action authorized.",
    practice: "Detect variance in actor, scope, timing, target, and effect.",
  },
  {
    number: 24,
    title: "Learning must preserve truth",
    rule: "Education may simplify explanation, never the governing facts.",
    practice: "Teach complexity through calm sequence without deleting constraints.",
  },
];

const decisionTone: Record<Decision, string> = {
  ALLOW: "allow",
  HOLD: "hold",
  DENY: "deny",
  ESCALATE: "escalate",
};

function evaluate(gates: GateState) {
  const failed = gateLabels.filter((gate) => !gates[gate.key]).map((gate) => gate.hold);
  let decision: Decision = "ALLOW";
  let reason = "All required conditions are currently satisfied and revalidated.";
  if (!gates.boundary) {
    decision = "DENY";
    reason = "Execution exceeds the approved boundary and may not proceed.";
  } else if (!gates.authority) {
    decision = "ESCALATE";
    reason = "A valid human or institutional authority must resolve the action.";
  } else if (failed.length > 0) {
    decision = "HOLD";
    reason = "One or more admissibility conditions remain unresolved.";
  }
  const passed = gateLabels.length - failed.length;
  const score = Math.round((passed / gateLabels.length) * 100);
  return { decision, reason, failed, passed, score };
}

function DecisionPill({ value }: { value: Decision }) {
  return <span className={`decisionPill ${decisionTone[value]}`}>{value}</span>;
}

function GateConsole({ gate, checked, index, onChange }: { gate: (typeof gateLabels)[number]; checked: boolean; index: number; onChange: (value: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className={`gateConsole ${checked ? "supported" : "unsupported"}`}>
      <span className="gateNumber">{String(index + 1).padStart(2, "0")}</span>
      <span className="gateCopy">
        <span className="gateTop"><strong>{gate.label}</strong><i /></span>
        <span className="gateQuestion">{gate.question}</span>
        {!checked && <span className="gateFailure">{gate.hold}</span>}
      </span>
    </button>
  );
}

function ReadinessGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="readinessGauge">
      <svg viewBox="0 0 128 128" aria-hidden="true">
        <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="8" />
        <circle cx="64" cy="64" r="52" fill="none" stroke="url(#simGauge)" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
        <defs><linearGradient id="simGauge"><stop stopColor="#65eaff"/><stop offset="1" stopColor="#8b7cff"/></linearGradient></defs>
      </svg>
      <div><strong>{score}%</strong><span>readiness</span></div>
    </div>
  );
}

function AnchorRail({ gates }: { gates: GateState }) {
  const anchors = [
    ["Reality", gates.reality], ["Record", gates.record], ["Continuity", gates.continuity], ["Admissibility", gates.evidence],
    ["Binding", gates.boundary], ["Commit", gates.authority], ["Execution", gates.dependencies], ["Outcome", gates.revalidation],
  ] as const;
  return <div className="anchorRail">{anchors.map(([label, active], index) => <div key={label} className={active ? "active" : ""}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong><i /></div>)}</div>;
}

export default function SimulatorPage() {
  const [selectedId, setSelectedId] = useState(scenarios[0].id);
  const [gates, setGates] = useState<GateState>(scenarios[0].gates);
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("All domains");
  const [difficulty, setDifficulty] = useState("All levels");
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<PreservedRun[]>([]);
  const [activeTab, setActiveTab] = useState<"run" | "architecture" | "history">("run");

  const selected = scenarios.find((scenario) => scenario.id === selectedId) ?? scenarios[0];
  const result = useMemo(() => evaluate(gates), [gates]);
  const domains = useMemo(() => ["All domains", ...Array.from(new Set(scenarios.map((scenario) => scenario.domain)))], []);
  const filtered = useMemo(() => scenarios.filter((scenario) => {
    const text = `${scenario.title} ${scenario.domain} ${scenario.consequence}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (domain === "All domains" || scenario.domain === domain) && (difficulty === "All levels" || scenario.difficulty === difficulty);
  }), [query, domain, difficulty]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { history?: PreservedRun[]; selectedId?: string; gates?: GateState; note?: string };
      if (parsed.history) setHistory(parsed.history);
      if (parsed.selectedId && scenarios.some((item) => item.id === parsed.selectedId)) setSelectedId(parsed.selectedId);
      if (parsed.gates) setGates(parsed.gates);
      if (typeof parsed.note === "string") setNote(parsed.note);
    } catch {}
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ history, selectedId, gates, note })); } catch {}
  }, [history, selectedId, gates, note]);

  const chooseScenario = (id: string) => {
    const next = scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
    setSelectedId(next.id); setGates(next.gates); setNote(""); setActiveTab("run");
  };
  const preserveRun = () => {
    const item: PreservedRun = { id: `${Date.now()}-${selected.id}`, scenarioId: selected.id, title: selected.title, decision: result.decision, score: result.score, failed: result.failed, note, createdAt: new Date().toLocaleString() };
    setHistory((current) => [item, ...current].slice(0, 50)); setActiveTab("history");
  };

  return (
    <main className="simPage">
      <div className="ambient" aria-hidden="true"><div className="stars"/><div className="gridFloor"/><div className="aurora auroraOne"/><div className="aurora auroraTwo"/></div>
      <div className="shell">
        <header className="hero">
          <div className="heroCopy">
            <div className="liveLabel"><span/>TA-14 Academy · Live governed laboratory</div>
            <h1>Simulation <em>Center</em></h1>
            <p>Operate a consequence-bearing route, manipulate governing conditions, and watch the determination change before consequence binds to reality.</p>
            <div className="heroActions"><button type="button" onClick={() => setActiveTab("run")} className="primaryButton">Enter live laboratory →</button><button type="button" onClick={() => setActiveTab("architecture")} className="secondaryButton">Inspect architecture</button></div>
            <div className="governingRule"><span>Governing principle</span><strong>No admissible evidence. No admissible execution.</strong></div>
          </div>
          <div className={`commandCore ${decisionTone[result.decision]}`}>
            <div className="coreHeader"><div><span>Live determination</span><h2>{result.decision}</h2></div><DecisionPill value={result.decision}/></div>
            <p>{result.reason}</p>
            <div className="coreBody"><ReadinessGauge score={result.score}/><div className="failureStack">{result.failed.slice(0,4).map((failure)=><div key={failure}>{failure}</div>)}{result.failed.length===0&&<div className="allClear">All modeled conditions are currently supported.</div>}</div></div>
          </div>
          <div className="heroRail"><AnchorRail gates={gates}/></div>
        </header>

        <section className="statDeck">
          <article><span>Scenarios</span><strong>24</strong><small>Consequence-bearing environments</small></article>
          <article><span>Runtime gates</span><strong>24</strong><small>Complete governing chain represented</small></article>
          <article><span>Preserved runs</span><strong>{history.length}</strong><small>Local learner simulation records</small></article>
          <article className="accent"><span>Current readiness</span><strong>{result.score}%</strong><small>{result.passed} of 8 active gates satisfied</small></article>
        </section>

        <nav className="modeTabs">{(["run","architecture","history"] as const).map((tab)=><button key={tab} type="button" onClick={()=>setActiveTab(tab)} className={activeTab===tab?"active":""}>{tab==="run"?"Live simulation":tab==="architecture"?"Runtime architecture":`Preserved runs · ${history.length}`}</button>)}</nav>

        {activeTab === "run" && <section className="laboratory">
          <aside className="scenarioDock">
            <div className="sectionIntro"><span>Scenario library</span><h2>Choose the consequence</h2><p>Twenty-four distinct environments with different evidence, authority, boundary, and drift conditions.</p></div>
            <div className="filters"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search scenarios"/><div><select value={domain} onChange={(e)=>setDomain(e.target.value)}>{domains.map((item)=><option key={item}>{item}</option>)}</select><select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}><option>All levels</option><option>Intermediate</option><option>Advanced</option><option>Expert</option></select></div></div>
            <div className="scenarioList">{filtered.map((scenario)=><button key={scenario.id} type="button" onClick={()=>chooseScenario(scenario.id)} className={selected.id===scenario.id?"active":""}><span className="scenarioMeta"><b>{scenario.domain}</b><DecisionPill value={scenario.expected}/></span><strong>{scenario.title}</strong><small>{scenario.consequence}</small></button>)}</div>
          </aside>

          <div className="runtimeStage">
            <article className="selectedScenario panel">
              <div className="panelHeader"><div><span>Selected simulation</span><h2>{selected.title}</h2><p>{selected.consequence}</p></div><div className="statusPair"><b>{selected.difficulty}</b><DecisionPill value={selected.expected}/></div></div>
              <div className="scenarioFacts"><Info label="Evidence required" value={selected.evidenceNeed}/><Info label="Authority required" value={selected.authorityNeed}/><Info label="Execution boundary" value={selected.boundary}/><Info label="Revalidation triggers" value={selected.drift}/></div>
            </article>

            <article className="gateLab panel">
              <div className="panelHeader"><div><span>Gate laboratory</span><h2>Change the governing conditions</h2><p>Every switch changes the route. The earliest unsupported condition remains visible.</p></div><button type="button" onClick={()=>{setGates(selected.gates);setNote("");}} className="secondaryButton">Reset scenario</button></div>
              <div className="gateGrid">{gateLabels.map((gate,index)=><GateConsole key={gate.key} gate={gate} checked={gates[gate.key]} index={index} onChange={(value)=>setGates((current)=>({...current,[gate.key]:value}))}/>)}</div>
            </article>

            <article className={`determinationStage ${decisionTone[result.decision]}`}>
              <ReadinessGauge score={result.score}/><div><span>Current determination</span><div className="determinationTitle"><h2>{result.decision}</h2><DecisionPill value={result.decision}/></div><p>{result.reason}</p><div className="determinationFailures">{result.failed.map((failure)=><div key={failure}>{failure}</div>)}{result.failed.length===0&&<div className="allClear">All required conditions are supported.</div>}</div></div>
            </article>

            <article className="reasoning panel"><span>Learner observation</span><h2>Preserve your reasoning</h2><textarea value={note} onChange={(e)=>setNote(e.target.value)} rows={6} placeholder="Identify the earliest failed condition, the evidence needed to cure it, and whether revalidation could change the determination."/><div><button type="button" onClick={preserveRun} className="primaryButton">Preserve simulation run</button><Link href="/academy/review" className="secondaryButton">Open Review Workspace →</Link></div></article>
          </div>
        </section>}

        {activeTab === "architecture" && <section className="architecture panel"><div className="sectionIntro"><span>Runtime architecture</span><h2>Twenty-four links behind eight anchor gates</h2><p>Each runtime link carries a defined function, failure condition, and place in the execution chain.</p></div><div className="architectureGrid">{runtimeLinks.map((link)=><article key={link.number}><span>Link {String(link.number).padStart(2,"0")}</span><h3>{link.name}</h3><p>{link.function}</p><small>Failure: {link.failure}</small></article>)}</div></section>}

        {activeTab === "history" && <section className="history panel"><div className="panelHeader"><div><span>Preserved history</span><h2>Local simulation records</h2></div>{history.length>0&&<button type="button" onClick={()=>setHistory([])} className="secondaryButton">Clear history</button>}</div><div className="historyList">{history.length===0?<div className="emptyState">No preserved runs yet.</div>:history.map((run)=><article key={run.id}><div><h3>{run.title}</h3><small>{run.createdAt}</small></div><div className="runScore"><DecisionPill value={run.decision}/><strong>{run.score}%</strong></div>{run.note&&<p>{run.note}</p>}</article>)}</div></section>}

        <section className="nextDeck"><Next href="/academy/route-construction-lab" eyebrow="Next governed practice" title="Route Construction Lab" text="Convert an uncertain request into a bounded, attributable, challengeable route."/><Next href="/academy/review" eyebrow="Challenge the result" title="Review Workspace" text="Preserve findings, objections, corrections, and version history."/><Next href="/academy/assessment" eyebrow="Prove capability" title="Assessment Center" text="Separate completion from demonstrated, scope-bounded competency."/></section>
      </div>

      <style jsx global>{`
        .simPage{position:relative;min-height:100vh;overflow:hidden;color:#edf8ff;background:#020711;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.simPage *{box-sizing:border-box}.ambient{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}.stars{position:absolute;inset:0;background-image:radial-gradient(circle at 18% 22%,rgba(255,255,255,.8) 0 1px,transparent 1.4px),radial-gradient(circle at 68% 14%,rgba(111,231,255,.8) 0 1px,transparent 1.4px),radial-gradient(circle at 84% 44%,rgba(255,255,255,.55) 0 1px,transparent 1.4px);background-size:190px 190px,270px 270px,330px 330px;opacity:.22}.gridFloor{position:absolute;left:-20%;right:-20%;bottom:-34%;height:76%;transform:perspective(500px) rotateX(68deg);transform-origin:center top;background-image:linear-gradient(rgba(76,225,255,.13) 1px,transparent 1px),linear-gradient(90deg,rgba(76,225,255,.13) 1px,transparent 1px);background-size:58px 58px;mask-image:linear-gradient(to bottom,transparent,#000 18%,#000 70%,transparent)}.aurora{position:absolute;border-radius:999px;filter:blur(130px);opacity:.18}.auroraOne{width:34rem;height:34rem;left:-12rem;top:6rem;background:#00c7e9}.auroraTwo{width:42rem;height:42rem;right:-16rem;top:28rem;background:#735cff}.shell{position:relative;z-index:1;width:min(100%,1680px);margin:0 auto;padding:24px 22px 90px}.hero,.panel,.scenarioDock,.statDeck article{border:1px solid rgba(126,205,232,.15);box-shadow:0 30px 90px rgba(0,0,0,.34),inset 0 1px 0 rgba(255,255,255,.05)}.hero{position:relative;display:grid;grid-template-columns:1.05fr .95fr;gap:28px;padding:42px;border-radius:34px;background:radial-gradient(circle at 12% 8%,rgba(30,211,238,.16),transparent 34%),linear-gradient(135deg,rgba(10,29,47,.97),rgba(4,11,22,.96) 58%,rgba(16,20,47,.94));overflow:hidden}.hero:before{content:"";position:absolute;inset:0;background:linear-gradient(118deg,rgba(255,255,255,.035),transparent 28%,transparent 74%,rgba(120,104,255,.05));pointer-events:none}.heroCopy,.commandCore,.heroRail{position:relative}.liveLabel{display:inline-flex;align-items:center;gap:10px;padding:9px 14px;border:1px solid rgba(91,232,255,.23);border-radius:999px;background:rgba(65,226,255,.06);color:#bff6ff;font-size:10px;font-weight:900;letter-spacing:.22em;text-transform:uppercase}.liveLabel span{width:8px;height:8px;border-radius:50%;background:#66ecff;box-shadow:0 0 18px rgba(102,236,255,.95)}.hero h1{margin:28px 0 0;font-size:clamp(3.6rem,7vw,6.4rem);line-height:.88;letter-spacing:-.075em}.hero h1 em{display:block;font-style:normal;color:transparent;background:linear-gradient(90deg,#b9f7ff,#6fe7ff 46%,#9b91ff);background-clip:text}.heroCopy>p{max-width:760px;margin:24px 0 0;color:#a7bdca;font-size:1.05rem;line-height:1.75}.heroActions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.primaryButton,.secondaryButton{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 17px;border-radius:13px;font-size:.78rem;font-weight:900;text-decoration:none;cursor:pointer;transition:.24s}.primaryButton{border:0;color:#04131b;background:linear-gradient(90deg,#b9f7ff,#72e8ff);box-shadow:0 14px 34px rgba(48,219,255,.18)}.secondaryButton{border:1px solid rgba(255,255,255,.12);color:#f3fbff;background:rgba(255,255,255,.035)}.primaryButton:hover,.secondaryButton:hover{transform:translateY(-2px)}.governingRule{margin-top:28px;padding-top:22px;border-top:1px solid rgba(255,255,255,.08)}.governingRule span{display:block;color:#66849a;font-size:.62rem;font-weight:900;letter-spacing:.16em;text-transform:uppercase}.governingRule strong{display:block;margin-top:7px;color:#9cf1ff;font-size:.92rem}.commandCore{align-self:stretch;padding:28px;border:1px solid rgba(255,255,255,.1);border-radius:26px;background:linear-gradient(145deg,rgba(8,24,40,.93),rgba(3,9,19,.9));box-shadow:0 26px 70px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.04)}.commandCore:after{content:"";position:absolute;inset:auto 24px 0;height:1px;background:linear-gradient(90deg,transparent,rgba(100,234,255,.5),transparent)}.coreHeader{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.coreHeader span,.panelHeader>div>span,.sectionIntro>span,.reasoning>span,.determinationStage>div>span{color:#62e8ff;font-size:.62rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.coreHeader h2{margin:8px 0 0;font-size:2.65rem;letter-spacing:-.05em}.commandCore>p{margin:14px 0 0;color:#91a9b8;font-size:.8rem;line-height:1.65}.coreBody{display:grid;grid-template-columns:180px 1fr;gap:20px;align-items:center;margin-top:18px}.readinessGauge{position:relative;display:grid;place-items:center;width:172px;height:172px}.readinessGauge svg{position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)}.readinessGauge svg circle:last-of-type{transition:stroke-dashoffset .6s ease}.readinessGauge div{text-align:center}.readinessGauge strong{display:block;font-size:2.7rem;letter-spacing:-.08em}.readinessGauge span{display:block;margin-top:4px;color:#76a1b6;font-size:.58rem;font-weight:900;letter-spacing:.2em;text-transform:uppercase}.failureStack{display:grid;gap:8px}.failureStack>div,.determinationFailures>div{padding:10px 12px;border:1px solid rgba(255,121,146,.15);border-radius:11px;color:#d9a9b5;background:rgba(255,92,123,.045);font-size:.68rem;line-height:1.45}.allClear{color:#b8f8d4!important;border-color:rgba(70,236,151,.2)!important;background:rgba(70,236,151,.06)!important}.heroRail{grid-column:1/-1}.anchorRail{display:grid;grid-template-columns:repeat(8,1fr);gap:8px}.anchorRail div{padding:13px 8px;border:1px solid rgba(255,255,255,.07);border-radius:14px;text-align:center;background:rgba(255,255,255,.022)}.anchorRail div span{display:block;color:#536f83;font-size:.54rem;font-weight:900;letter-spacing:.14em}.anchorRail div strong{display:block;margin-top:6px;color:#7690a1;font-size:.66rem}.anchorRail div i{display:block;width:28px;height:3px;margin:10px auto 0;border-radius:999px;background:#263848}.anchorRail div.active{border-color:rgba(92,231,255,.25);background:rgba(62,222,255,.06)}.anchorRail div.active strong{color:#c6f8ff}.anchorRail div.active i{background:#66ebff;box-shadow:0 0 12px rgba(102,235,255,.75)}.statDeck{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-top:18px}.statDeck article{min-height:132px;padding:21px;border-radius:20px;background:linear-gradient(145deg,rgba(8,23,38,.88),rgba(3,10,20,.88))}.statDeck article span{color:#69869a;font-size:.6rem;font-weight:900;letter-spacing:.15em;text-transform:uppercase}.statDeck article strong{display:block;margin-top:9px;font-size:2.25rem;letter-spacing:-.05em}.statDeck article small{display:block;margin-top:7px;color:#70899a;font-size:.67rem;line-height:1.45}.statDeck article.accent{border-color:rgba(100,232,255,.24);background:linear-gradient(145deg,rgba(8,37,51,.93),rgba(5,13,28,.92))}.modeTabs{display:flex;gap:8px;margin-top:18px;padding:6px;border:1px solid rgba(255,255,255,.08);border-radius:16px;background:rgba(3,11,21,.72);width:max-content;max-width:100%}.modeTabs button{padding:11px 15px;border:0;border-radius:11px;color:#6f899a;background:transparent;font-size:.72rem;font-weight:900;cursor:pointer}.modeTabs button.active{color:#d9fbff;background:rgba(76,225,255,.09);box-shadow:inset 0 0 0 1px rgba(98,232,255,.18)}.laboratory{display:grid;grid-template-columns:350px minmax(0,1fr);gap:16px;margin-top:16px;align-items:start}.scenarioDock{position:sticky;top:18px;height:calc(100vh - 36px);padding:22px;border-radius:25px;background:linear-gradient(145deg,rgba(8,24,40,.94),rgba(3,10,20,.93));overflow:hidden}.sectionIntro h2,.panelHeader h2,.reasoning h2{margin:8px 0 0;font-size:1.55rem;letter-spacing:-.035em}.sectionIntro p,.panelHeader p{margin:9px 0 0;color:#7992a2;font-size:.72rem;line-height:1.55}.filters{display:grid;gap:8px;margin-top:18px}.filters>div{display:grid;grid-template-columns:1fr 1fr;gap:8px}.filters input,.filters select,.reasoning textarea{width:100%;border:1px solid rgba(255,255,255,.09);border-radius:12px;color:#dceaf2;background:rgba(1,7,15,.8);outline:none}.filters input,.filters select{height:42px;padding:0 11px;font-size:.68rem}.filters select option{background:#07111f}.scenarioList{height:calc(100vh - 285px);margin-top:12px;padding-right:3px;overflow:auto;scrollbar-width:thin;scrollbar-color:rgba(86,224,255,.25) transparent}.scenarioList>button{display:block;width:100%;margin-bottom:8px;padding:14px;border:1px solid rgba(255,255,255,.07);border-radius:15px;color:inherit;background:rgba(255,255,255,.02);text-align:left;cursor:pointer;transition:.22s}.scenarioList>button:hover,.scenarioList>button.active{transform:translateX(3px);border-color:rgba(96,231,255,.28);background:rgba(69,222,255,.06)}.scenarioMeta{display:flex;justify-content:space-between;gap:8px;align-items:center}.scenarioMeta b{color:#5f7d90;font-size:.53rem;letter-spacing:.11em;text-transform:uppercase}.scenarioList>button>strong{display:block;margin-top:9px;font-size:.78rem}.scenarioList>button>small{display:block;margin-top:6px;color:#748c9c;font-size:.62rem;line-height:1.45}.runtimeStage{display:grid;gap:16px}.panel{padding:27px;border-radius:25px;background:linear-gradient(145deg,rgba(8,24,40,.9),rgba(3,10,20,.9))}.panelHeader{display:flex;justify-content:space-between;align-items:flex-start;gap:18px}.panelHeader h2{font-size:1.9rem}.statusPair{display:flex;align-items:center;gap:8px}.statusPair>b{padding:7px 10px;border:1px solid rgba(255,255,255,.09);border-radius:999px;color:#afc0ca;background:rgba(255,255,255,.03);font-size:.61rem}.scenarioFacts{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px}.infoCard{padding:16px;border:1px solid rgba(255,255,255,.07);border-radius:15px;background:rgba(255,255,255,.022)}.infoCard span{color:#5f7d90;font-size:.56rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.infoCard p{margin:8px 0 0;color:#b4c6d1;font-size:.72rem;line-height:1.55}.gateGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px}.gateConsole{display:grid;grid-template-columns:44px 1fr;gap:13px;width:100%;padding:15px;border-radius:16px;text-align:left;cursor:pointer;transition:.22s}.gateConsole.supported{border:1px solid rgba(89,232,255,.26);background:linear-gradient(135deg,rgba(69,224,255,.075),rgba(3,12,22,.5))}.gateConsole.unsupported{border:1px solid rgba(255,112,140,.2);background:linear-gradient(135deg,rgba(255,82,118,.055),rgba(3,12,22,.5))}.gateConsole:hover{transform:translateY(-2px)}.gateNumber{display:grid;place-items:center;width:42px;height:42px;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#bfeef5;background:rgba(255,255,255,.035);font-size:.63rem;font-weight:900}.gateCopy{min-width:0}.gateTop{display:flex;justify-content:space-between;gap:10px}.gateTop strong{color:#eef9ff;font-size:.76rem}.gateTop i{width:10px;height:10px;border-radius:50%;background:#ff7f99;box-shadow:0 0 14px rgba(255,107,139,.65)}.supported .gateTop i{background:#66ebff;box-shadow:0 0 14px rgba(102,235,255,.8)}.gateQuestion{display:block;margin-top:7px;color:#7891a1;font-size:.65rem;line-height:1.5}.gateFailure{display:block;margin-top:8px;color:#d89aa8;font-size:.59rem;line-height:1.45}.determinationStage{display:grid;grid-template-columns:210px 1fr;gap:28px;align-items:center;padding:32px;border:1px solid rgba(103,229,255,.2);border-radius:28px;background:radial-gradient(circle at 15% 30%,rgba(49,222,255,.14),transparent 28%),linear-gradient(135deg,rgba(7,29,47,.96),rgba(4,11,23,.96) 56%,rgba(18,18,50,.92));box-shadow:0 34px 95px rgba(0,0,0,.43),inset 0 1px 0 rgba(255,255,255,.05)}.determinationTitle{display:flex;align-items:center;gap:12px;margin-top:8px}.determinationTitle h2{margin:0;font-size:3.7rem;letter-spacing:-.07em}.determinationStage p{margin:15px 0 0;color:#a4b8c5;font-size:.82rem;line-height:1.65}.determinationFailures{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:17px}.reasoning textarea{margin-top:17px;padding:15px;resize:vertical;font:inherit;font-size:.74rem;line-height:1.6}.reasoning>div{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.decisionPill{display:inline-flex;align-items:center;justify-content:center;padding:6px 9px;border-radius:999px;font-size:.52rem;font-weight:950;letter-spacing:.13em}.decisionPill.allow{color:#b9f8d2;border:1px solid rgba(74,234,145,.3);background:rgba(74,234,145,.08)}.decisionPill.hold{color:#ffd29d;border:1px solid rgba(255,179,77,.3);background:rgba(255,179,77,.08)}.decisionPill.deny{color:#ffb2c0;border:1px solid rgba(255,95,127,.3);background:rgba(255,95,127,.08)}.decisionPill.escalate{color:#d1c4ff;border:1px solid rgba(154,126,255,.3);background:rgba(154,126,255,.08)}.architecture,.history{margin-top:16px}.architectureGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:20px}.architectureGrid article{padding:18px;border:1px solid rgba(255,255,255,.07);border-radius:16px;background:rgba(255,255,255,.022)}.architectureGrid article>span{color:#58dff8;font-size:.55rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.architectureGrid h3{margin:9px 0 0;font-size:.95rem}.architectureGrid p{margin:9px 0 0;color:#7c94a4;font-size:.67rem;line-height:1.5}.architectureGrid small{display:block;margin-top:12px;padding-top:11px;border-top:1px solid rgba(255,255,255,.07);color:#c58f9b;font-size:.59rem;line-height:1.45}.historyList{display:grid;gap:9px;margin-top:20px}.historyList article{display:grid;grid-template-columns:1fr auto;gap:14px;padding:17px;border:1px solid rgba(255,255,255,.07);border-radius:15px;background:rgba(255,255,255,.022)}.historyList h3{margin:0;font-size:.82rem}.historyList small{display:block;margin-top:5px;color:#60798c;font-size:.58rem}.historyList p{grid-column:1/-1;margin:0;color:#859cac;font-size:.67rem;line-height:1.5}.runScore{display:flex;align-items:center;gap:9px}.runScore strong{color:#7eeaff;font-size:.78rem}.emptyState{padding:48px;border:1px dashed rgba(255,255,255,.12);border-radius:18px;color:#60798b;text-align:center}.nextDeck{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}.nextCard{padding:22px;border:1px solid rgba(255,255,255,.08);border-radius:20px;background:linear-gradient(145deg,rgba(8,23,38,.84),rgba(3,10,20,.86))}.nextCard span{color:#55e2fa;font-size:.55rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.nextCard h3{margin:10px 0 0;font-size:1.08rem}.nextCard p{margin:9px 0 0;color:#758d9d;font-size:.67rem;line-height:1.5}.nextCard a{display:inline-flex;margin-top:14px;color:#78ebff;font-size:.68rem;font-weight:900;text-decoration:none}
        @media(max-width:1180px){.hero{grid-template-columns:1fr}.laboratory{grid-template-columns:310px 1fr}.anchorRail{grid-template-columns:repeat(4,1fr)}.statDeck{grid-template-columns:1fr 1fr}.architectureGrid{grid-template-columns:1fr 1fr}}
        @media(max-width:900px){.shell{padding:16px 14px 70px}.hero{padding:28px;border-radius:25px}.laboratory{grid-template-columns:1fr}.scenarioDock{position:relative;top:auto;height:auto}.scenarioList{height:430px}.gateGrid,.scenarioFacts,.determinationFailures{grid-template-columns:1fr}.determinationStage{grid-template-columns:1fr}.nextDeck{grid-template-columns:1fr}.commandCore{padding:22px}}
        @media(max-width:640px){.hero h1{font-size:3.65rem}.coreBody{grid-template-columns:1fr}.readinessGauge{width:150px;height:150px;margin:auto}.anchorRail{grid-template-columns:1fr 1fr}.statDeck{grid-template-columns:1fr}.modeTabs{width:100%;overflow:auto}.modeTabs button{white-space:nowrap}.panel{padding:20px}.panelHeader{display:grid}.architectureGrid{grid-template-columns:1fr}.filters>div{grid-template-columns:1fr}.scenarioFacts{grid-template-columns:1fr}.determinationTitle h2{font-size:2.8rem}}
        @media(prefers-reduced-motion:no-preference){.hero,.panel,.scenarioDock,.statDeck article{animation:rise .55s ease-out both}@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}}
      `}</style>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="infoCard"><span>{label}</span><p>{value}</p></div>; }
function Next({ href, eyebrow, title, text }: { href: string; eyebrow: string; title: string; text: string }) { return <article className="nextCard"><span>{eyebrow}</span><h3>{title}</h3><p>{text}</p><Link href={href}>Open →</Link></article>; }
