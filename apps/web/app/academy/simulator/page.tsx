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

const decisionStyle: Record<Decision, string> = {
  ALLOW: "border-emerald-300/40 bg-emerald-400/10 text-emerald-100",
  HOLD: "border-amber-300/40 bg-amber-400/10 text-amber-100",
  DENY: "border-rose-300/40 bg-rose-400/10 text-rose-100",
  ESCALATE: "border-violet-300/40 bg-violet-400/10 text-violet-100",
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

function GateToggle({ gate, checked, onChange }: { gate: (typeof gateLabels)[number]; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="group flex cursor-pointer gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-white/[0.018] p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/35 hover:bg-cyan-300/[0.055] hover:shadow-xl">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-cyan-400" />
      <span>
        <span className="block font-semibold text-white">{gate.label}</span>
        <span className="mt-1 block text-sm leading-6 text-slate-400">{gate.question}</span>
      </span>
    </label>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{detail}</p>
    </article>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400 sm:text-base">{text}</p>
    </div>
  );
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
    const matchesQuery = `${scenario.title} ${scenario.domain} ${scenario.consequence}`.toLowerCase().includes(query.toLowerCase());
    const matchesDomain = domain === "All domains" || scenario.domain === domain;
    const matchesDifficulty = difficulty === "All levels" || scenario.difficulty === difficulty;
    return matchesQuery && matchesDomain && matchesDifficulty;
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
    } catch {
      // Local preservation must never block the Academy experience.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ history, selectedId, gates, note }));
    } catch {
      // The learner may continue without local persistence.
    }
  }, [history, selectedId, gates, note]);

  function chooseScenario(id: string) {
    const next = scenarios.find((scenario) => scenario.id === id) ?? scenarios[0];
    setSelectedId(next.id);
    setGates(next.gates);
    setNote("");
    setActiveTab("run");
  }

  function updateGate(key: GateKey, value: boolean) {
    setGates((current) => ({ ...current, [key]: value }));
  }

  function preserveRun() {
    const preserved: PreservedRun = {
      id: `${Date.now()}-${selected.id}`,
      scenarioId: selected.id,
      title: selected.title,
      decision: result.decision,
      score: result.score,
      failed: result.failed,
      note,
      createdAt: new Date().toLocaleString(),
    };
    setHistory((current) => [preserved, ...current].slice(0, 50));
    setActiveTab("history");
  }

  function resetRun() {
    setGates(selected.gates);
    setNote("");
  }

  function clearHistory() {
    setHistory([]);
  }

  return (
    <main className="simulation-center relative min-h-screen overflow-hidden text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-24 h-[30rem] w-[30rem] rounded-full bg-cyan-400/[0.08] blur-[110px]" />
        <div className="absolute right-[-8rem] top-[22rem] h-[34rem] w-[34rem] rounded-full bg-indigo-500/[0.08] blur-[130px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
        <div className="absolute inset-0 opacity-[0.045]" style={{ backgroundImage: "linear-gradient(rgba(125,211,252,.65) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.65) 1px, transparent 1px)", backgroundSize: "52px 52px", maskImage: "linear-gradient(to bottom, black, transparent 78%)" }} />
      </div>

      <div className="simulation-shell mx-auto w-full max-w-[1540px] px-4 pb-24 pt-6 sm:px-6 lg:px-8 xl:px-10">
          <header className="relative overflow-hidden rounded-[2.25rem] border border-cyan-200/15 bg-[linear-gradient(135deg,rgba(8,24,39,.96),rgba(4,11,22,.92)_55%,rgba(11,24,47,.92))] p-6 shadow-[0_30px_90px_rgba(0,0,0,.42)] ring-1 ring-white/[0.04] backdrop-blur-xl sm:p-8 xl:p-10">
            <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-cyan-300">TA-14 Academy · Governed practice environment</p>
                <h1 className="mt-5 max-w-5xl bg-gradient-to-br from-white via-cyan-50 to-cyan-300 bg-clip-text text-4xl font-black tracking-[-0.055em] text-transparent sm:text-5xl xl:text-7xl">Simulation Center</h1>
                <p className="mt-5 max-w-4xl text-base leading-8 text-slate-300 sm:text-lg">Test whether a consequential action has earned the right to proceed before consequence binds to reality. Change the conditions, locate the earliest failure, preserve the determination, and learn why completion is never permission.</p>
              </div>
              <div className="rounded-2xl border border-cyan-300/25 bg-cyan-300/[0.06] px-5 py-4 text-sm leading-6 text-cyan-100 xl:max-w-sm">
                <span className="font-black">Governing principle:</span><br />No admissible evidence. No admissible execution.
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="Scenarios" value={String(scenarios.length)} detail="Consequence-bearing practice environments" />
              <Metric label="Runtime gates" value="24" detail="Complete governing chain represented" />
              <Metric label="Preserved runs" value={String(history.length)} detail="Local learner simulation records" />
              <Metric label="Current readiness" value={`${result.score}%`} detail={`${result.passed} of ${gateLabels.length} active gates satisfied`} />
            </div>
          </header>

          <div className="mt-6 flex flex-wrap gap-2">
            {(["run", "architecture", "history"] as const).map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`rounded-xl border px-4 py-3 text-sm font-black capitalize transition ${activeTab === tab ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-100" : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"}`}>{tab === "run" ? "Simulation workspace" : tab === "architecture" ? "Architecture correspondence" : "Preserved history"}</button>
            ))}
          </div>

          {activeTab === "run" && (
            <div className="mt-6 space-y-6">
              <section className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 backdrop-blur sm:p-8">
                <SectionTitle eyebrow="Scenario library" title="Choose a consequence-bearing action" text="Every simulation begins with an exact action, a real consequence, a bounded authority, and conditions that may drift before execution." />
                <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_220px_180px]">
                  <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search scenarios, domains, or consequences" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40" />
                  <select value={domain} onChange={(event) => setDomain(event.target.value)} className="rounded-xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40">{domains.map((item) => <option key={item}>{item}</option>)}</select>
                  <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="rounded-xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/40"><option>All levels</option><option>Intermediate</option><option>Advanced</option><option>Expert</option></select>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
                  {filtered.map((scenario) => (
                    <button key={scenario.id} type="button" onClick={() => chooseScenario(scenario.id)} className={`group relative overflow-hidden rounded-[1.35rem] border p-5 text-left shadow-lg transition duration-300 ${selectedId === scenario.id ? "border-cyan-300/50 bg-gradient-to-br from-cyan-300/[0.13] to-blue-500/[0.06] shadow-cyan-950/30 ring-1 ring-cyan-200/10" : "border-white/10 bg-gradient-to-br from-white/[0.045] to-white/[0.015] hover:-translate-y-1 hover:border-cyan-200/25 hover:bg-white/[0.06] hover:shadow-2xl"}`}>
                      <div className="flex items-center justify-between gap-3"><span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{scenario.domain}</span><span className="text-xs font-bold text-cyan-300">{scenario.difficulty}</span></div>
                      <h3 className="mt-4 text-lg font-black text-white">{scenario.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-slate-400">{scenario.consequence}</p>
                      <div className="mt-4 flex items-center justify-between text-xs"><span className="text-slate-500">Expected teaching state</span><span className={`rounded-full border px-2.5 py-1 font-black ${decisionStyle[scenario.expected]}`}>{scenario.expected}</span></div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="grid gap-6 2xl:grid-cols-[0.88fr_1.12fr]">
                <div className="space-y-6">
                  <article className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8">
                    <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Selected simulation</p>
                    <h2 className="mt-4 text-3xl font-black text-white">{selected.title}</h2>
                    <p className="mt-4 text-base leading-7 text-slate-300">{selected.consequence}</p>
                    <dl className="mt-6 space-y-4">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Evidence required</dt><dd className="mt-2 text-sm leading-6 text-slate-300">{selected.evidenceNeed}</dd></div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Authority required</dt><dd className="mt-2 text-sm leading-6 text-slate-300">{selected.authorityNeed}</dd></div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Execution boundary</dt><dd className="mt-2 text-sm leading-6 text-slate-300">{selected.boundary}</dd></div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><dt className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">Revalidation triggers</dt><dd className="mt-2 text-sm leading-6 text-slate-300">{selected.drift}</dd></div>
                    </dl>
                  </article>

                  <article className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8">
                    <h3 className="text-xl font-black text-white">Learner observation</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-400">Record why the action should be allowed, held, denied, or escalated. Notes are preserved locally with the run.</p>
                    <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={8} placeholder="Identify the earliest failed condition, the evidence needed to cure it, and whether revalidation could change the determination." className="mt-5 w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40" />
                  </article>
                </div>

                <div className="space-y-6">
                  <article className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><SectionTitle eyebrow="Gate laboratory" title="Change the governing conditions" text="A checked condition is currently supported. An unchecked condition remains unresolved and must stay visible." /><button type="button" onClick={resetRun} className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/[0.05]">Reset scenario</button></div>
                    <div className="mt-6 grid gap-3 md:grid-cols-2">{gateLabels.map((gate) => <GateToggle key={gate.key} gate={gate} checked={gates[gate.key]} onChange={(value) => updateGate(gate.key, value)} />)}</div>
                  </article>

                  <article className={`rounded-[2rem] border p-6 sm:p-8 ${decisionStyle[result.decision]}`}>
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.22em] opacity-70">Current determination</p><p className="mt-3 text-5xl font-black tracking-tight">{result.decision}</p></div><div className="rounded-2xl border border-current/20 px-5 py-4 text-right"><p className="text-xs font-bold uppercase tracking-[0.18em] opacity-70">Readiness</p><p className="mt-1 text-3xl font-black">{result.score}%</p></div></div>
                    <p className="mt-6 text-base font-semibold leading-7">{result.reason}</p>
                    {result.failed.length > 0 ? <div className="mt-6 space-y-2">{result.failed.map((failure) => <div key={failure} className="rounded-xl border border-current/20 bg-black/10 px-4 py-3 text-sm">{failure}</div>)}</div> : <div className="mt-6 rounded-xl border border-current/20 bg-black/10 px-4 py-3 text-sm">All modeled conditions are supported. Preserve the run before treating the determination as a learning artifact.</div>}
                    <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={preserveRun} className="rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100">Preserve simulation run</button><Link href="/academy/review" className="rounded-xl border border-current/25 px-5 py-3 text-sm font-black hover:bg-black/10">Open Review Workspace →</Link></div>
                  </article>
                </div>
              </section>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="mt-6 space-y-6">
              <section className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8"><SectionTitle eyebrow="Architecture orientation" title="Eight visible anchors. One complete runtime chain." text="The public anchors orient the learner. The 24-link runtime architecture governs the full movement from purpose to preserved outcome." /><div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{anchors.map((anchor) => <article key={anchor.number} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="text-sm font-black text-cyan-300">{anchor.number}</p><h3 className="mt-3 text-xl font-black text-white">{anchor.name}</h3><p className="mt-3 text-sm font-semibold leading-6 text-slate-300">{anchor.question}</p><p className="mt-3 text-sm leading-6 text-slate-500">{anchor.proof}</p></article>)}</div></section>
              <section className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8"><SectionTitle eyebrow="Complete chain" title="Twenty-four runtime links" text="A simulation may expose failure at any link. The earliest unresolved link controls the route; later completion cannot cure an earlier break." /><div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{runtimeLinks.map((link) => <article key={link.number} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] text-xs font-black text-cyan-200">{String(link.number).padStart(2, "0")}</span><h3 className="font-black text-white">{link.name}</h3></div><p className="mt-4 text-sm leading-6 text-slate-300">{link.function}</p><p className="mt-3 text-sm leading-6 text-slate-500">{link.failure}</p></article>)}</div></section>
              <section className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8">
                <SectionTitle
                  eyebrow="Failure replay laboratory"
                  title="Inject one material change at a time"
                  text="These drills teach the learner to stop at the earliest failed runtime link, identify the missing proof, and select the correct fail-closed response."
                />
                <div className="mt-7 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                  {failureDrills.map((drill) => (
                    <article
                      key={drill.link}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] text-xs font-black text-cyan-200">
                          {String(drill.link).padStart(2, "0")}
                        </span>
                        <span className={`rounded-full border px-3 py-1 text-[10px] font-black ${decisionStyle[drill.correctResponse]}`}>
                          {drill.correctResponse}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-black text-white">
                        {drill.title}
                      </h3>
                      <div className="mt-4 space-y-3">
                        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                            Injected change
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {drill.injectedChange}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                            Learner task
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {drill.learnerTask}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-black/10 p-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                            Evidence to seek
                          </p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            {drill.evidenceToSeek}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-sm leading-6 text-cyan-100">
                        {drill.teachingPoint}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8">
                <SectionTitle
                  eyebrow="Structured debrief"
                  title="Explain what the run proved—and what it did not"
                  text="A learner must be able to distinguish an observed condition from an inference, a preserved record from a claim, and a supported determination from a preferred result."
                />
                <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {debriefPrompts.map((prompt) => (
                    <article
                      key={prompt.number}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-black text-cyan-300">
                          {String(prompt.number).padStart(2, "0")}
                        </span>
                        <h3 className="font-black text-white">
                          {prompt.stage}
                        </h3>
                      </div>
                      <div className="mt-4 space-y-3 text-sm leading-6">
                        <p className="text-slate-300">
                          {prompt.observation}
                        </p>
                        <p className="text-slate-400">
                          {prompt.challenge}
                        </p>
                        <p className="text-slate-500">
                          {prompt.preservation}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8">
                <SectionTitle
                  eyebrow="Competency evidence"
                  title="Score demonstrated capability, not attendance"
                  text="The rubric makes progression inspectable. A learner advances by producing bounded evidence of capability, not by clicking through the simulation."
                />
                <div className="mt-7 overflow-x-auto rounded-2xl border border-white/10">
                  <table className="min-w-[1100px] w-full border-collapse text-left">
                    <thead className="bg-white/[0.05]">
                      <tr>
                        <th className="border-b border-white/10 p-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Capability
                        </th>
                        <th className="border-b border-white/10 p-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Developing
                        </th>
                        <th className="border-b border-white/10 p-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Proficient
                        </th>
                        <th className="border-b border-white/10 p-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Advanced
                        </th>
                        <th className="border-b border-white/10 p-4 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
                          Required evidence
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {competencyCriteria.map((criterion) => (
                        <tr
                          key={criterion.id}
                          className="border-b border-white/10 last:border-b-0"
                        >
                          <td className="p-4 align-top text-sm font-black text-white">
                            {criterion.capability}
                          </td>
                          <td className="p-4 align-top text-sm leading-6 text-slate-500">
                            {criterion.developing}
                          </td>
                          <td className="p-4 align-top text-sm leading-6 text-slate-300">
                            {criterion.proficient}
                          </td>
                          <td className="p-4 align-top text-sm leading-6 text-cyan-100">
                            {criterion.advanced}
                          </td>
                          <td className="p-4 align-top text-sm leading-6 text-slate-400">
                            {criterion.evidence}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8">
                <SectionTitle
                  eyebrow="Operating constitution"
                  title="Twenty-four principles governing every simulation"
                  text="These principles prevent the learning environment from rewarding completion, confidence, or favorable outcomes when the underlying execution has not earned standing."
                />
                <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {operatingPrinciples.map((principle) => (
                    <article
                      key={principle.number}
                      className="rounded-2xl border border-white/10 bg-white/[0.025] p-5"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] text-xs font-black text-cyan-200">
                          {String(principle.number).padStart(2, "0")}
                        </span>
                        <h3 className="font-black text-white">
                          {principle.title}
                        </h3>
                      </div>
                      <p className="mt-4 text-sm font-semibold leading-6 text-slate-300">
                        {principle.rule}
                      </p>
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {principle.practice}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-2"><article className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8"><SectionTitle eyebrow="Trust distinction" title="Verified does not mean admissible" text="Zero Trust can validate actor, request, role, device, and access while the exact execution still lacks current evidence, valid authority, preserved continuity, or a bounded consequence." /><div className="mt-6 space-y-3">{["Identity answers who or what is acting.","Access answers what the actor may reach.","Admissibility answers whether this exact action may bind to reality now.","Revalidation answers whether that permission still holds immediately before execution."].map((item) => <div key={item} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">{item}</div>)}</div></article><article className="rounded-[2rem] border border-amber-300/20 bg-amber-300/[0.05] p-6 sm:p-8"><SectionTitle eyebrow="Constitutional rule" title="The earliest failure governs" text="A route does not average its way into permission. One unresolved condition is enough to hold, deny, or escalate the action before consequence occurs." /><div className="mt-6 rounded-2xl border border-amber-300/20 bg-black/10 p-5 text-sm leading-7 text-amber-100">Completion is not evidence. Confidence is not authority. Verification is not standing. A favorable outcome does not retroactively make an inadmissible execution permissible.</div></article></section>
            </div>
          )}

          {activeTab === "history" && (
            <section className="mt-6 rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><SectionTitle eyebrow="Preserved learning record" title="Simulation history" text="Each preserved run captures the modeled conditions, determination, failed gates, learner note, and timestamp. These local records are learning artifacts, not production authorization." />{history.length > 0 && <button type="button" onClick={clearHistory} className="rounded-xl border border-rose-300/25 px-4 py-3 text-sm font-bold text-rose-200 hover:bg-rose-300/[0.06]">Clear local history</button>}</div>
              {history.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-10 text-center"><p className="text-lg font-black text-white">No preserved runs yet</p><p className="mt-3 text-sm text-slate-400">Complete a simulation and preserve the determination to create the first learning record.</p><button type="button" onClick={() => setActiveTab("run")} className="mt-5 rounded-xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950">Run first simulation →</button></div> : <div className="mt-7 space-y-4">{history.map((run) => <article key={run.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{run.createdAt}</p><h3 className="mt-2 text-lg font-black text-white">{run.title}</h3></div><div className="flex items-center gap-3"><span className={`rounded-full border px-3 py-1.5 text-xs font-black ${decisionStyle[run.decision]}`}>{run.decision}</span><span className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-black text-slate-300">{run.score}%</span></div></div>{run.failed.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{run.failed.map((failure) => <span key={failure} className="rounded-lg border border-white/10 bg-black/10 px-3 py-2 text-xs text-slate-400">{failure}</span>)}</div>}{run.note && <p className="mt-4 rounded-xl border border-white/10 bg-black/10 p-4 text-sm leading-6 text-slate-300">{run.note}</p>}<button type="button" onClick={() => chooseScenario(run.scenarioId)} className="mt-4 text-sm font-black text-cyan-300 hover:text-cyan-200">Reopen scenario →</button></article>)}</div>}
            </section>
          )}

          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            <article className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Next governed practice</p><h3 className="mt-3 text-xl font-black text-white">Route Construction Lab</h3><p className="mt-3 text-sm leading-6 text-slate-400">Convert an uncertain request into a bounded, attributable, challengeable route.</p><Link href="/academy/route-construction-lab" className="mt-5 inline-flex text-sm font-black text-cyan-300">Build a route →</Link></article>
            <article className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Challenge the result</p><h3 className="mt-3 text-xl font-black text-white">Review Workspace</h3><p className="mt-3 text-sm leading-6 text-slate-400">Preserve findings, objections, corrections, and version history without erasing uncertainty.</p><Link href="/academy/review" className="mt-5 inline-flex text-sm font-black text-cyan-300">Open review →</Link></article>
            <article className="rounded-[2rem] border border-white/[0.09] bg-[linear-gradient(145deg,rgba(8,20,34,.88),rgba(3,10,20,.78))] shadow-[0_20px_60px_rgba(0,0,0,.24)] ring-1 ring-white/[0.025] p-6"><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Prove capability</p><h3 className="mt-3 text-xl font-black text-white">Assessment Center</h3><p className="mt-3 text-sm leading-6 text-slate-400">Separate attendance and completion from demonstrated, scope-bounded competency.</p><Link href="/academy/assessment" className="mt-5 inline-flex text-sm font-black text-cyan-300">Open assessment →</Link></article>
          </section>

          <footer className="mt-10 border-t border-white/10 py-8 text-sm text-slate-500"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p>TA-14 Academy · Seventh major door of the TA-14 AI Governance Exchange</p><p>No admissible evidence. No admissible execution.</p></div></footer>
        </div>

      <style jsx global>{`
        .simulation-center { isolation: isolate; }
        .simulation-center ::selection { background: rgba(103, 232, 249, .28); color: #fff; }
        .simulation-center input,
        .simulation-center select,
        .simulation-center textarea { box-shadow: inset 0 1px 0 rgba(255,255,255,.035); }
        .simulation-center button,
        .simulation-center a { -webkit-tap-highlight-color: transparent; }
        .simulation-center article,
        .simulation-center section { transform: translateZ(0); }
        @media (prefers-reduced-motion: no-preference) {
          .simulation-shell > header { animation: simulation-rise .55s ease-out both; }
          .simulation-shell > div,
          .simulation-shell > section { animation: simulation-rise .65s .05s ease-out both; }
        }
        @keyframes simulation-rise {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
