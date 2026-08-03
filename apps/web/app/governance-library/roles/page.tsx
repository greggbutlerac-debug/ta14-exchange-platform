"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RoleRecord = {
  id: string;
  code: string;
  title: string;
  category: string;
  summary: string;
  responsibilities: string[];
  evidence: string[];
  boundaries: string[];
};

const roles: RoleRecord[] = [
  {
    id: "governing-body",
    code: "GB",
    title: "Governing Body",
    category: "Institutional authority",
    summary: "Sets institutional direction, approves policy, establishes risk appetite, appoints accountable officers, and preserves ultimate oversight responsibility.",
    responsibilities: [
      "Approve governance policy and institutional objectives",
      "Define risk appetite, consequence thresholds, and escalation boundaries",
      "Review material failures, exceptions, and unresolved authority conflicts",
      "Require evidence of implementation, not merely policy publication",
    ],
    evidence: [
      "Board resolutions",
      "Approved policies",
      "Delegation records",
      "Management review minutes",
    ],
    boundaries: [
      "Cannot delegate away ultimate accountability",
      "Must distinguish oversight from operational execution",
    ],
  },
  {
    id: "executive-accountable-officer",
    code: "EAO",
    title: "Executive Accountable Officer",
    category: "Executive authority",
    summary: "Holds named executive responsibility for the governed program and ensures that institutional commitments become funded, staffed, monitored, and enforced.",
    responsibilities: [
      "Translate governing-body direction into operational mandates",
      "Assign accountable owners and ensure sufficient resources",
      "Resolve cross-functional authority conflicts",
      "Report material risks and failures to the governing body",
    ],
    evidence: [
      "Executive mandate",
      "Resource approval",
      "Responsibility map",
      "Escalation decisions",
    ],
    boundaries: [
      "Cannot substitute executive preference for controlling law",
      "Must preserve decisions and reasons",
    ],
  },
  {
    id: "system-owner",
    code: "SO",
    title: "System or Capability Owner",
    category: "Operational accountability",
    summary: "Owns the intended purpose, approved use, version, lifecycle state, dependencies, controls, and consequences of a governed system or capability.",
    responsibilities: [
      "Define intended purpose and prohibited uses",
      "Maintain current system and capability inventory",
      "Approve changes within delegated authority",
      "Ensure revalidation after material change",
    ],
    evidence: [
      "System record",
      "Version history",
      "Change approvals",
      "Operational monitoring",
    ],
    boundaries: [
      "Ownership does not equal unlimited authority",
      "Must stop or escalate when conditions fail",
    ],
  },
  {
    id: "environmental-record-owner",
    code: "ERO",
    title: "Environmental Record Owner",
    category: "Environmental accountability",
    summary: "Owns the integrity, scope, chronology, attribution, limitations, and future-reliance conditions of an environmental record.",
    responsibilities: [
      "Define record purpose and subject boundary",
      "Preserve instrument, method, location, and chronology",
      "Ensure corrections and supersession do not erase history",
      "Control publication and reliance permissions",
    ],
    evidence: [
      "Environmental record",
      "Instrument register",
      "Continuity package",
      "Correction history",
    ],
    boundaries: [
      "Does not convert measurement into diagnosis",
      "Must preserve uncertainty and non-claims",
    ],
  },
  {
    id: "authority-resolver",
    code: "AR",
    title: "Authority Resolver",
    category: "Authority determination",
    summary: "Determines which law, regulation, standard, contract, delegation, or institutional mandate applies to the proposed action.",
    responsibilities: [
      "Identify controlling authority and current version",
      "Resolve jurisdiction, role, scope, and delegation",
      "Detect conflicts, expiration, revocation, or supersession",
      "Issue HOLD when authority remains unresolved",
    ],
    evidence: [
      "Authority map",
      "Applicability record",
      "Delegation evidence",
      "Conflict analysis",
    ],
    boundaries: [
      "Cannot invent authority",
      "Must separate guidance from enforceable obligation",
    ],
  },
  {
    id: "evidence-steward",
    code: "ES",
    title: "Evidence Steward",
    category: "Evidence governance",
    summary: "Preserves evidence identity, provenance, continuity, admissibility conditions, access controls, retention, and limitations.",
    responsibilities: [
      "Maintain provenance and chain of custody",
      "Protect evidence from substitution or unexplained alteration",
      "Map evidence to propositions it may support",
      "Preserve exclusion, challenge, and correction records",
    ],
    evidence: [
      "Evidence register",
      "Custody log",
      "Integrity hashes",
      "Admissibility notes",
    ],
    boundaries: [
      "Custody does not establish truth by itself",
      "Must preserve evidence that cuts against the preferred conclusion",
    ],
  },
  {
    id: "data-steward",
    code: "DS",
    title: "Data Steward",
    category: "Data governance",
    summary: "Maintains data quality, provenance, lawful use, access, retention, representativeness, and lifecycle controls.",
    responsibilities: [
      "Define quality and provenance requirements",
      "Approve access and permitted uses",
      "Monitor drift, bias, staleness, and missingness",
      "Coordinate correction and deletion duties",
    ],
    evidence: [
      "Dataset register",
      "Data lineage",
      "Access records",
      "Quality reports",
    ],
    boundaries: [
      "Data availability does not create permission to use",
      "Must distinguish source data from derived inference",
    ],
  },
  {
    id: "technical-lead",
    code: "TL",
    title: "Technical Lead",
    category: "Technical implementation",
    summary: "Designs, builds, tests, deploys, and maintains technical systems within approved governance and execution boundaries.",
    responsibilities: [
      "Implement required controls and enforcement points",
      "Preserve version, configuration, and dependency evidence",
      "Support testing, rollback, and incident containment",
      "Prevent unauthorized bypass of governance gates",
    ],
    evidence: [
      "Architecture diagrams",
      "Build records",
      "Test evidence",
      "Deployment manifests",
    ],
    boundaries: [
      "Technical capability is not decision authority",
      "Must not silently weaken controls",
    ],
  },
  {
    id: "model-owner",
    code: "MO",
    title: "Model Owner",
    category: "AI model accountability",
    summary: "Owns model selection, intended use, training or acquisition record, evaluation, monitoring, and change controls.",
    responsibilities: [
      "Maintain model card and version history",
      "Define evaluation criteria and limitations",
      "Monitor performance, drift, and misuse",
      "Trigger revalidation after material updates",
    ],
    evidence: [
      "Model record",
      "Evaluation results",
      "Change history",
      "Monitoring reports",
    ],
    boundaries: [
      "Model quality does not authorize consequential use",
      "Must preserve population and context limitations",
    ],
  },
  {
    id: "human-reviewer",
    code: "HR",
    title: "Human Reviewer",
    category: "Human decision authority",
    summary: "Exercises bounded human oversight, evaluates exceptions, and makes or escalates determinations where automation cannot lawfully or responsibly proceed alone.",
    responsibilities: [
      "Review evidence and governing route",
      "Confirm identity, authority, and conflicts",
      "Issue bounded ALLOW, HOLD, DENY, or ESCALATE determination",
      "Record reasons, limitations, and dissent",
    ],
    evidence: [
      "Review record",
      "Determination",
      "Reason statement",
      "Escalation package",
    ],
    boundaries: [
      "Human presence is not meaningful oversight by itself",
      "Must have time, competence, evidence, and actual authority",
    ],
  },
  {
    id: "environmental-reviewer",
    code: "ER",
    title: "Environmental Reviewer",
    category: "Environmental interpretation",
    summary: "Evaluates environmental evidence within declared competence and separates observation, interpretation, compliance, health, and intervention conclusions.",
    responsibilities: [
      "Assess measurement and method validity",
      "Evaluate context, continuity, and comparison",
      "Identify limits and alternate explanations",
      "Recommend or escalate intervention within authority",
    ],
    evidence: [
      "Interpretation record",
      "Method review",
      "Comparison analysis",
      "Limitations statement",
    ],
    boundaries: [
      "Cannot make unsupported medical or legal conclusions",
      "Must remain within professional scope",
    ],
  },
  {
    id: "legal-counsel",
    code: "LC",
    title: "Legal Counsel",
    category: "Legal interpretation",
    summary: "Interprets legal duties, privilege, liability, jurisdiction, and legal risk while preserving the distinction between legal advice and operational authority.",
    responsibilities: [
      "Interpret statutes, regulations, contracts, and case law",
      "Advise on applicability and legal exposure",
      "Review publication, confidentiality, and privilege boundaries",
      "Support dispute and enforcement response",
    ],
    evidence: [
      "Legal analysis",
      "Privilege record",
      "Contract review",
      "Regulatory response",
    ],
    boundaries: [
      "Legal interpretation may require regulator or court resolution",
      "Counsel does not replace technical evidence",
    ],
  },
  {
    id: "compliance-lead",
    code: "CL",
    title: "Compliance Lead",
    category: "Compliance operations",
    summary: "Maps obligations to controls, tests implementation, tracks deficiencies, and preserves evidence of compliance decisions.",
    responsibilities: [
      "Maintain obligation and control registers",
      "Coordinate testing and monitoring",
      "Track remediation and exceptions",
      "Prepare inspection and reporting packages",
    ],
    evidence: [
      "Control matrix",
      "Testing records",
      "Exception log",
      "Remediation plan",
    ],
    boundaries: [
      "Checklist completion is not proof of outcome",
      "Must distinguish design, implementation, and operating effectiveness",
    ],
  },
  {
    id: "risk-owner",
    code: "RO",
    title: "Risk Owner",
    category: "Risk acceptance",
    summary: "Owns a defined risk, decides treatment within delegated limits, and ensures residual risk is explicitly accepted, reduced, transferred, avoided, or escalated.",
    responsibilities: [
      "Approve risk treatment plans",
      "Review residual risk and assumptions",
      "Monitor triggers and changing conditions",
      "Escalate beyond delegated tolerance",
    ],
    evidence: [
      "Risk record",
      "Treatment plan",
      "Residual-risk decision",
      "Monitoring triggers",
    ],
    boundaries: [
      "Cannot accept risks reserved to another authority",
      "Must not use risk acceptance to bypass law",
    ],
  },
  {
    id: "independent-assessor",
    code: "IA",
    title: "Independent Assessor",
    category: "Independent assurance",
    summary: "Evaluates evidence, controls, conformity, and outcomes without owning the system or decision being assessed.",
    responsibilities: [
      "Define assessment scope and criteria",
      "Test evidence and control operation",
      "Preserve findings, limitations, and conflicts of interest",
      "Verify corrective action where authorized",
    ],
    evidence: [
      "Assessment plan",
      "Evidence requests",
      "Findings report",
      "Corrective-action verification",
    ],
    boundaries: [
      "Independence must be real and disclosed",
      "Assessment is bounded by scope and evidence",
    ],
  },
  {
    id: "laboratory-authority",
    code: "LAB",
    title: "Laboratory or Measurement Authority",
    category: "Measurement competence",
    summary: "Performs or validates sampling, calibration, testing, and analytical work under recognized methods and competence requirements.",
    responsibilities: [
      "Maintain method and accreditation scope",
      "Preserve calibration, quality control, and sample custody",
      "Report uncertainty, detection limits, and deviations",
      "Support reproducibility and challenge",
    ],
    evidence: [
      "Laboratory report",
      "Calibration certificate",
      "Quality-control results",
      "Chain-of-custody record",
    ],
    boundaries: [
      "Accreditation is scope-specific",
      "Results must remain tied to sample, method, and conditions",
    ],
  },
  {
    id: "privacy-officer",
    code: "PO",
    title: "Privacy Officer",
    category: "Privacy governance",
    summary: "Governs personal-data use, purpose limitation, rights, retention, disclosure, and privacy risk.",
    responsibilities: [
      "Assess lawful basis and purpose compatibility",
      "Review minimization and access controls",
      "Coordinate rights requests and retention",
      "Evaluate privacy impacts and disclosures",
    ],
    evidence: [
      "Privacy assessment",
      "Data inventory",
      "Rights log",
      "Retention schedule",
    ],
    boundaries: [
      "Privacy approval does not establish broader execution authority",
      "Must account for sensitive and inferred data",
    ],
  },
  {
    id: "security-officer",
    code: "SEC",
    title: "Security Officer",
    category: "Security governance",
    summary: "Protects systems, records, evidence, identities, keys, and execution channels against unauthorized access, alteration, disruption, or misuse.",
    responsibilities: [
      "Set security requirements and threat models",
      "Approve access and key-management controls",
      "Monitor vulnerabilities and incidents",
      "Preserve forensic evidence and containment actions",
    ],
    evidence: [
      "Threat model",
      "Security assessment",
      "Access logs",
      "Incident record",
    ],
    boundaries: [
      "Security does not prove governance legitimacy",
      "Must preserve availability without erasing evidence",
    ],
  },
  {
    id: "incident-authority",
    code: "INC",
    title: "Incident Authority",
    category: "Incident command",
    summary: "Coordinates containment, notification, evidence preservation, corrective action, and recovery during material events.",
    responsibilities: [
      "Classify incident severity and activate response",
      "Preserve evidence before remediation changes state",
      "Coordinate legal, technical, environmental, and public duties",
      "Approve recovery and post-incident review",
    ],
    evidence: [
      "Incident declaration",
      "Containment log",
      "Notification record",
      "Post-incident report",
    ],
    boundaries: [
      "Emergency authority must be bounded and time-limited",
      "Must preserve who acted and why",
    ],
  },
  {
    id: "academy-instructor",
    code: "AI",
    title: "Academy Instructor or Assessor",
    category: "Education and readiness",
    summary: "Teaches institutional methods, evaluates readiness, and preserves the boundary between learning achievement and operational authority.",
    responsibilities: [
      "Deliver approved curriculum and simulations",
      "Assess competence against declared criteria",
      "Preserve assessment evidence and accommodations",
      "Refer unresolved competence or integrity issues",
    ],
    evidence: [
      "Learning record",
      "Assessment result",
      "Simulation evidence",
      "Credential recommendation",
    ],
    boundaries: [
      "Credential does not automatically grant execution authority",
      "Instructor conflicts must be disclosed",
    ],
  },
  {
    id: "registrar",
    code: "REG",
    title: "Registry or Record Registrar",
    category: "Registration authority",
    summary: "Validates registration prerequisites, preserves registry identity and chronology, and prevents registration from being mistaken for endorsement.",
    responsibilities: [
      "Verify required entity and record fields",
      "Preserve timestamps, versions, and status",
      "Control correction, suspension, and supersession",
      "Publish explicit registry boundaries",
    ],
    evidence: [
      "Registration record",
      "Version history",
      "Status changes",
      "Verification package",
    ],
    boundaries: [
      "Registration is not certification or approval",
      "Registry statements must remain bounded",
    ],
  },
  {
    id: "ta14-reviewer",
    code: "T14",
    title: "TA-14 Institutional Reviewer",
    category: "TA-14 bounded review",
    summary: "Conducts a scoped TA-14 review of claims, evidence, authority, execution, and outcomes while preserving what was and was not reviewed.",
    responsibilities: [
      "Define scope, claim, non-claim, and evidence boundary",
      "Construct or inspect the governed route",
      "Issue bounded findings and corrective actions",
      "Preserve publication, confidentiality, and registry permissions",
    ],
    evidence: [
      "Review charter",
      "Governed findings",
      "Execution artifact where applicable",
      "Publication record",
    ],
    boundaries: [
      "TA-14 is not a legislature, regulator, court, or accredited certifier",
      "Findings remain bounded to scope, evidence, version, and date",
    ],
  },
];


const roleScenarios = [
  {
    title: "AI account suspension",
    domain: "AI Governance",
    summary: "A system proposes suspending a user account after detecting suspicious behavior.",
    roles: [
      "System or Capability Owner",
      "Authority Resolver",
      "Human Reviewer",
      "Evidence Steward",
    ],
    questions: [
      "Is the suspension authority current and role-specific?",
      "Does the evidence support this account, event, and version?",
      "Is human review required before consequence?",
      "Who verifies the post-action outcome?",
    ],
    outcome: "HOLD when identity, authority, evidence, or review conditions remain incomplete.",
  },
  {
    title: "Hospital pressure failure",
    domain: "Environmental Integrity",
    summary: "A hospital isolation room loses required pressure relationship during occupancy.",
    roles: [
      "Environmental Record Owner",
      "Environmental Reviewer",
      "Technical Lead",
      "Incident Authority",
    ],
    questions: [
      "Which activity and occupants are affected?",
      "What instrument and method establish the pressure state?",
      "Who may restrict, relocate, or close the room?",
      "What evidence supports reopening?",
    ],
    outcome: "ESCALATE when patient safety, clinical authority, or conflicting evidence exceeds delegated scope.",
  },
  {
    title: "Refrigerant charging intervention",
    domain: "Environmental Integrity",
    summary: "A technician proposes charging a system after incomplete evacuation evidence.",
    roles: [
      "Technical Lead",
      "Environmental Reviewer",
      "Evidence Steward",
      "System or Capability Owner",
    ],
    questions: [
      "Is the technician competent and authorized?",
      "Is evacuation evidence complete and attributable?",
      "Are refrigerant and equipment identities preserved?",
      "What outcome measurements are required?",
    ],
    outcome: "DENY when the proposed intervention would bypass required evidence or safety controls.",
  },
  {
    title: "Clean Air Act applicability",
    domain: "Law and Public Policy",
    summary: "A facility must determine whether an emissions activity triggers federal or state duties.",
    roles: [
      "Authority Resolver",
      "Legal Counsel",
      "Compliance Lead",
      "Environmental Record Owner",
    ],
    questions: [
      "Which source category and jurisdiction apply?",
      "What permit or regulatory program controls?",
      "Which adopted method and edition govern measurement?",
      "Who signs the resulting determination?",
    ],
    outcome: "HOLD until jurisdiction, applicability, method, and responsible authority are resolved.",
  },
  {
    title: "Model version change",
    domain: "AI Governance",
    summary: "A provider replaces the production model while preserving the same product name.",
    roles: [
      "Model Owner",
      "System or Capability Owner",
      "Risk Owner",
      "Independent Assessor",
    ],
    questions: [
      "Is the change material to performance or risk?",
      "Which prior evidence is no longer current?",
      "Who approves revalidation and redeployment?",
      "What users or decisions are affected?",
    ],
    outcome: "HOLD until the new version is tested, approved, and bound to current authority.",
  },
  {
    title: "Water contamination result",
    domain: "Environmental Integrity",
    summary: "A laboratory reports a contaminant above a threshold in a drinking-water sample.",
    roles: [
      "Laboratory or Measurement Authority",
      "Environmental Record Owner",
      "Authority Resolver",
      "Incident Authority",
    ],
    questions: [
      "Was sample custody preserved?",
      "Is the method within laboratory scope?",
      "Which threshold and jurisdiction apply?",
      "Who has notification and protective-action authority?",
    ],
    outcome: "ESCALATE when public-health notification or emergency action may be required.",
  },
  {
    title: "Entity review submission",
    domain: "Institutional Review",
    summary: "An outside entity submits a broad claim that its platform guarantees compliant AI.",
    roles: [
      "TA-14 Institutional Reviewer",
      "Evidence Steward",
      "Authority Resolver",
      "Independent Assessor",
    ],
    questions: [
      "Can the claim be bounded to one capability?",
      "What evidence and versions support it?",
      "What is outside scope?",
      "What may be published or registered?",
    ],
    outcome: "HOLD until claim, non-claim, evidence, authority, and publication boundaries are complete.",
  },
  {
    title: "Standard incorporated by reference",
    domain: "Law and Standards",
    summary: "A contract cites the latest ASHRAE standard while local code adopted an older edition.",
    roles: [
      "Authority Resolver",
      "Legal Counsel",
      "Compliance Lead",
      "Technical Lead",
    ],
    questions: [
      "Which edition is legally adopted?",
      "Does the contract impose a newer requirement?",
      "Can both duties coexist?",
      "What evidence proves implementation?",
    ],
    outcome: "ESCALATE when adopted law and contractual duty conflict or create different thresholds.",
  },
  {
    title: "Security incident with evidence risk",
    domain: "Institutional Operations",
    summary: "A security event threatens logs and execution records needed for later review.",
    roles: [
      "Security Officer",
      "Incident Authority",
      "Evidence Steward",
      "System or Capability Owner",
    ],
    questions: [
      "What must be contained immediately?",
      "Which evidence must be preserved before remediation?",
      "Who may isolate systems or revoke credentials?",
      "How will continuity be demonstrated afterward?",
    ],
    outcome: "ALLOW emergency containment only within time-limited authority and evidence-preservation controls.",
  },
  {
    title: "Privacy deletion request",
    domain: "Data Governance",
    summary: "A person requests deletion of data that also forms part of a legally required record.",
    roles: [
      "Privacy Officer",
      "Legal Counsel",
      "Data Steward",
      "Evidence Steward",
    ],
    questions: [
      "Which rights and exemptions apply?",
      "What retention authority controls?",
      "Can data be restricted or separated instead of erased?",
      "Who documents the final determination?",
    ],
    outcome: "HOLD until privacy rights, retention duties, and evidence integrity are reconciled.",
  },
  {
    title: "Registry correction",
    domain: "Institutional Record",
    summary: "A registered entity discovers a material error in a previously published record.",
    roles: [
      "Registry or Record Registrar",
      "Evidence Steward",
      "TA-14 Institutional Reviewer",
      "System or Capability Owner",
    ],
    questions: [
      "Can the error be corrected without erasing history?",
      "Does the correction change prior findings?",
      "Who approves supersession?",
      "What users must be notified?",
    ],
    outcome: "ALLOW correction only with preserved prior version, reason, authority, and effective date.",
  },
  {
    title: "Academy credential decision",
    domain: "TA-14 Academy",
    summary: "A learner passes an assessment but has not demonstrated live operational competence.",
    roles: [
      "Academy Instructor or Assessor",
      "Governing Body",
      "System or Capability Owner",
      "Human Reviewer",
    ],
    questions: [
      "What does the credential actually attest?",
      "What operational authority remains separate?",
      "Are accommodations and assessment integrity preserved?",
      "Who grants live-role authorization?",
    ],
    outcome: "DENY automatic execution authority; issue only the bounded learning or readiness credential supported.",
  },
];
const categories = ["All roles", ...Array.from(new Set(roles.map((role) => role.category)))];

const chain = [
  "Mandate",
  "Delegation",
  "Role",
  "Competence",
  "Evidence",
  "Decision",
  "Execution",
  "Outcome",
];

export default function RolesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All roles");
  const [selectedId, setSelectedId] = useState(roles[0].id);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roles.filter((role) => {
      const categoryMatches = category === "All roles" || role.category === category;
      const haystack = [role.title, role.code, role.category, role.summary, ...role.responsibilities, ...role.evidence, ...role.boundaries].join(" ").toLowerCase();
      return categoryMatches && (!q || q.split(/\s+/).every((token) => haystack.includes(token)));
    });
  }, [query, category]);
  const selected = roles.find((role) => role.id === selectedId) ?? filtered[0] ?? roles[0];
  return (
    <main className="rolesPage">
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />
      <div className="grid" />
      <div className="pageShell">
        <nav className="topbar">
          <Link href="/governance-library">← Governance Library</Link>
          <span>TA-14 Institutional Role Resolution</span>
          <Link href="/governance-library/authorities">Open Authorities →</Link>
        </nav>
        <header className="hero">
          <div className="seal"><span>RR</span><small>TA-14</small></div>
          <p className="eyebrow">ROLES · RESPONSIBILITIES · DELEGATION · ACCOUNTABILITY</p>
          <h1>Institutional Roles <em>& Responsibility</em></h1>
          <p className="lead">A role is not a title alone. It is a bounded assignment of authority, competence, evidence duties, decision rights, execution limits, escalation obligations, and outcome accountability.</p>
          <div className="metrics">
            <article><strong>{roles.length}</strong><span>Governed roles</span></article>
            <article><strong>{categories.length - 1}</strong><span>Role categories</span></article>
            <article><strong>{roles.reduce((total, role) => total + role.responsibilities.length, 0)}</strong><span>Responsibility statements</span></article>
            <article><strong>{roles.reduce((total, role) => total + role.evidence.length, 0)}</strong><span>Evidence duties</span></article>
          </div>
        </header>
        <section className="principleBand">
          <article><span>AUTHORITY</span><strong>Authority</strong><p>What the role is permitted and required to decide.</p></article>
          <article><span>COMPETENCE</span><strong>Competence</strong><p>What knowledge, qualification, and experience the role must possess.</p></article>
          <article><span>EVIDENCE</span><strong>Evidence</strong><p>What records the role must create, inspect, preserve, or challenge.</p></article>
          <article><span>ACCOUNTABILITY</span><strong>Accountability</strong><p>What outcome the role must answer for and cannot delegate away.</p></article>
        </section>
        <section className="workspace">
          <div className="sectionHeading">
            <div><p className="eyebrow">ROLE CONTROL DESK</p><h2>Find the role. Inspect the authority. Preserve the boundary.</h2></div>
            <p>Use the index to inspect responsibilities, required evidence, and the limits that prevent titles from becoming unbounded permission.</p>
          </div>
          <div className="filters">
            <label>Search roles<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search authority, evidence, environmental, review..." /></label>
            <label>Role category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <button type="button" onClick={() => { setQuery(""); setCategory("All roles"); }}>Clear filters</button>
          </div>
          <div className="workspaceGrid">
            <aside className="roleIndex">
              <div className="indexHeader"><span>Role index</span><strong>{filtered.length} records</strong></div>
              <div className="roleList">
                {filtered.map((role, index) => (
                  <button key={role.id} type="button" className={selected.id === role.id ? "active" : ""} onClick={() => setSelectedId(role.id)}>
                    <span className="number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="identity"><small>{role.category}</small><strong>{role.title}</strong><em>{role.code}</em></span>
                    <i>→</i>
                  </button>
                ))}
              </div>
            </aside>
            <article className="roleRecord">
              <div className="recordHeader"><div className="recordSeal">{selected.code}</div><div><p>{selected.category}</p><h3>{selected.title}</h3><span>{selected.summary}</span></div></div>
              <div className="roleMandate"><span>ROLE MANDATE</span><strong>{selected.summary}</strong></div>
              <div className="recordColumns">
                <section><div className="cardHeading"><span>Core responsibilities</span><strong>{selected.responsibilities.length}</strong></div><div className="numbered">{selected.responsibilities.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></section>
                <section><div className="cardHeading"><span>Required evidence</span><strong>{selected.evidence.length}</strong></div><div className="numbered">{selected.evidence.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></section>
              </div>
              <section className="boundaryCard"><span>ROLE BOUNDARIES</span>{selected.boundaries.map((item) => <p key={item}>◆ {item}</p>)}</section>
              <section className="questions"><span>REQUIRED ROLE QUESTIONS</span><div>
                <article><span>01</span><strong>Who appointed or delegated this role?</strong></article>
                <article><span>02</span><strong>What instrument creates the authority?</strong></article>
                <article><span>03</span><strong>What jurisdiction, subject, activity, and version are covered?</strong></article>
                <article><span>04</span><strong>What competence is required and how is it evidenced?</strong></article>
                <article><span>05</span><strong>What decisions may the role make directly?</strong></article>
                <article><span>06</span><strong>What conditions require HOLD or ESCALATE?</strong></article>
                <article><span>07</span><strong>What records must the role create and preserve?</strong></article>
                <article><span>08</span><strong>What outcome remains accountable to this role?</strong></article>
              </div></section>
              <div className="recordActions"><Link href="/governance-library/authorities">Resolve Authority</Link><Link href="/governance-library/applicability">Test Applicability</Link><Link className="primary" href="/workspace/entity-review">Begin Entity Review →</Link></div>
            </article>
          </div>
        </section>
        <section className="chainSection">
          <div className="sectionHeading"><div><p className="eyebrow">ROLE AUTHORITY CHAIN</p><h2>A title becomes governable only when its mandate survives every link.</h2></div><p>TA-14 preserves the route from institutional mandate through delegated role, competent decision, controlled execution, and accountable outcome.</p></div>
          <div className="chain">{chain.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong>{index < chain.length - 1 ? <i>→</i> : null}</div>)}</div>
        </section>
        <section className="failureSection">
          <div className="sectionHeading"><div><p className="eyebrow">ROLE FAILURE MODES</p><h2>Most accountability failures begin before the decision.</h2></div><p>These conditions should create HOLD, DENY, or ESCALATE rather than being hidden behind organizational titles.</p></div>
          <div className="failureGrid">
            <article><span>01</span><strong>Unassigned authority</strong><p>No named person or body owns the decision.</p></article>
            <article><span>02</span><strong>Conflicting delegation</strong><p>Two roles claim incompatible authority.</p></article>
            <article><span>03</span><strong>Expired mandate</strong><p>The delegation or appointment is no longer current.</p></article>
            <article><span>04</span><strong>Competence gap</strong><p>The role lacks required qualification or domain knowledge.</p></article>
            <article><span>05</span><strong>Evidence blindness</strong><p>The role decides without access to necessary evidence.</p></article>
            <article><span>06</span><strong>Rubber-stamp oversight</strong><p>Human review exists only nominally.</p></article>
            <article><span>07</span><strong>Execution bypass</strong><p>Technical systems act outside the committed determination.</p></article>
            <article><span>08</span><strong>Outcome abandonment</strong><p>No role remains accountable after action is taken.</p></article>
          </div>
        </section>

        <section className="scenarioSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">ROLE RESOLUTION SCENARIOS</p>
              <h2>See how multiple roles combine around one consequential event.</h2>
            </div>
            <p>
              No single title governs the entire route. Each scenario requires distinct authority,
              evidence, decision, execution, and outcome responsibilities to remain visible.
            </p>
          </div>
          <div className="scenarioGrid">
            {roleScenarios.map((scenario, index) => (
              <article key={scenario.title}>
                <div className="scenarioTopline">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{scenario.domain}</small>
                </div>
                <h3>{scenario.title}</h3>
                <p className="scenarioSummary">{scenario.summary}</p>
                <div className="scenarioBlock">
                  <strong>Required roles</strong>
                  <div className="scenarioTags">
                    {scenario.roles.map((role) => (
                      <span key={role}>{role}</span>
                    ))}
                  </div>
                </div>
                <div className="scenarioBlock">
                  <strong>Questions that must be resolved</strong>
                  <ol>
                    {scenario.questions.map((question) => (
                      <li key={question}>{question}</li>
                    ))}
                  </ol>
                </div>
                <div className="scenarioOutcome">
                  <span>TA-14 role determination</span>
                  <p>{scenario.outcome}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="academySection">
          <div className="academySeal"><small>TA-14</small><strong>ACADEMY</strong><span>ROLE RESOLUTION</span></div>
          <div><p className="eyebrow">ROLE & RESPONSIBILITY ACADEMY</p><h2>Learn the mandate before accepting the title.</h2><p>The Academy teaches how roles are created, delegated, limited, evidenced, challenged, suspended, superseded, and connected to real execution and outcome accountability.</p>
            <div className="academyGrid">
              <article><span>01</span><strong>Mandate literacy</strong><p>Read the instrument that creates the role.</p></article>
              <article><span>02</span><strong>Delegation mapping</strong><p>Trace who delegated what to whom.</p></article>
              <article><span>03</span><strong>Competence evidence</strong><p>Prove readiness for the assigned duty.</p></article>
              <article><span>04</span><strong>Decision boundaries</strong><p>Know what the role may allow, hold, deny, or escalate.</p></article>
              <article><span>05</span><strong>Record duties</strong><p>Create and preserve the evidence the role owes.</p></article>
              <article><span>06</span><strong>Scenario simulation</strong><p>Practice conflicts, exceptions, and adverse outcomes.</p></article>
            </div><div className="academyActions"><Link href="/academy">Enter TA-14 Academy</Link><Link href="/governance-library/authorities">Open Authorities</Link></div>
          </div>
        </section>
        <section className="closing">
          <p className="eyebrow">TA-14 INSTITUTIONAL ROLE RESOLUTION</p><h2>Authority must be named. Responsibility must be bounded. Evidence must survive. Outcome must return.</h2><div><Link href="/governance-library/authorities">Resolve Governing Authority</Link><Link href="/governance-library/applicability">Determine Applicability</Link><Link className="primary" href="/workspace/entity-review">Build Review Package →</Link></div>
        </section>
      </div>
      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }
        :global(html) {
          background: #020812;
          scroll-behavior: smooth;
        }
        :global(body) {
          margin: 0;
          color: #f4fbff;
          background: #020812;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        }
        :global(a) {
          color: inherit;
        }
        .rolesPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background: radial-gradient(circle at 50% -10%, rgba(56,148,201,.16), transparent 36%), linear-gradient(180deg,#03101a,#02070d 62%,#010408);
        }
        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1500px, calc(100% - 40px));
          margin: 0 auto;
          padding: 24px 0 90px;
        }
        .grid {
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .13;
          background-image: linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,.025) 1px, transparent 1px);
          background-size: 54px 54px;
        }
        .ambient {
          position: fixed;
          width: 680px;
          height: 680px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: .12;
          pointer-events: none;
        }
        .ambientOne {
          left: -260px;
          top: 18%;
          background: #1d8ec4;
        }
        .ambientTwo {
          right: -280px;
          top: 54%;
          background: #d0912f;
        }
        .topbar {
          min-height: 68px;
          padding: 12px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(118,218,239,.14);
          border-radius: 18px;
          background: rgba(5,20,31,.85);
          backdrop-filter: blur(16px);
        }
        .topbar a {
          min-height: 42px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 10px;
          text-decoration: none;
          color: #c9d8df;
          font-size: 10px;
          font-weight: 900;
        }
        .topbar a:first-child {
          justify-self: start;
        }
        .topbar a:last-child {
          justify-self: end;
        }
        .topbar span {
          color: #77dce9;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .hero {
          max-width: 1180px;
          margin: auto;
          padding: 88px 0 72px;
          text-align: center;
        }
        .seal {
          width: 112px;
          height: 112px;
          margin: 0 auto 24px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255,205,99,.36);
          border-radius: 50%;
          background: radial-gradient(circle,rgba(255,205,99,.12),rgba(4,19,29,.94));
          box-shadow: 0 0 60px rgba(255,191,58,.1);
        }
        .seal span {
          color: #ffe39a;
          font: 900 32px Georgia,serif;
        }
        .seal small {
          color: #7f9aa6;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .16em;
        }
        .eyebrow {
          margin: 0;
          color: #6ee4f4;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .22em;
          text-transform: uppercase;
        }
        h1,h2,h3 {
          font-family: Georgia, "Times New Roman", serif;
        }
        .hero h1 {
          margin: 15px 0 0;
          font-size: clamp(54px,7vw,98px);
          line-height: .94;
          letter-spacing: -.055em;
        }
        .hero h1 em {
          display: block;
          color: #f1c66d;
          font-weight: 500;
        }
        .lead {
          max-width: 980px;
          margin: 26px auto 0;
          color: #adbec6;
          font-size: 18px;
          line-height: 1.72;
        }
        .metrics {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 12px;
        }
        .metrics article {
          padding: 20px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px;
          background: rgba(7,25,36,.62);
        }
        .metrics strong {
          display: block;
          color: #f0cc82;
          font: 800 30px Georgia,serif;
        }
        .metrics span {
          display: block;
          margin-top: 6px;
          color: #748c97;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .09em;
          text-transform: uppercase;
        }
        .principleBand {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 12px;
          padding-bottom: 82px;
        }
        .principleBand article {
          padding: 24px;
          border: 1px solid rgba(102,223,239,.12);
          border-radius: 18px;
          background: linear-gradient(145deg,rgba(8,31,43,.82),rgba(3,14,22,.9));
        }
        .principleBand span {
          color: #72dce9;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .14em;
        }
        .principleBand strong {
          display: block;
          margin-top: 14px;
          font: 700 22px Georgia,serif;
        }
        .principleBand p {
          margin: 9px 0 0;
          color: #8fa6af;
          font-size: 12px;
          line-height: 1.6;
        }
        .workspace,.chainSection,.failureSection,.academySection {
          padding: 84px 0;
        }
        .sectionHeading {
          margin-bottom: 30px;
          display: grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 42px;
          align-items: end;
        }
        .sectionHeading h2,.academySection h2,.closing h2 {
          margin: 12px 0 0;
          font-size: clamp(40px,5vw,70px);
          line-height: .98;
          letter-spacing: -.045em;
        }
        .sectionHeading > p {
          margin: 0;
          color: #95aab4;
          font-size: 15px;
          line-height: 1.7;
        }
        .filters {
          padding: 18px;
          display: grid;
          grid-template-columns: 1fr 280px auto;
          gap: 12px;
          align-items: end;
          border: 1px solid rgba(102,223,239,.13);
          border-radius: 20px;
          background: rgba(5,22,33,.9);
        }
        .filters label {
          display: grid;
          gap: 8px;
          color: #7c9aa6;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .filters input,.filters select {
          width: 100%;
          min-height: 48px;
          padding: 0 13px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 11px;
          outline: none;
          color: #edf7fa;
          background: rgba(0,0,0,.2);
        }
        .filters option {
          background: #06131d;
        }
        .filters button {
          min-height: 48px;
          padding: 0 16px;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 11px;
          color: #bdcdd4;
          background: rgba(0,0,0,.18);
          cursor: pointer;
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
        }
        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 390px 1fr;
          gap: 17px;
          align-items: start;
        }
        .roleIndex,.roleRecord {
          border: 1px solid rgba(102,223,239,.13);
          border-radius: 24px;
          background: linear-gradient(145deg,rgba(8,29,42,.96),rgba(3,13,21,.98));
        }
        .roleIndex {
          position: sticky;
          top: 20px;
          padding: 18px;
          max-height: calc(100vh - 40px);
          overflow: auto;
        }
        .indexHeader {
          padding: 4px 3px 15px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .indexHeader span {
          color: #72dce9;
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
        }
        .indexHeader strong {
          color: #efca7a;
          font: 700 16px Georgia,serif;
        }
        .roleList {
          margin-top: 13px;
          display: grid;
          gap: 8px;
        }
        .roleList button {
          width: 100%;
          padding: 12px;
          display: grid;
          grid-template-columns: 40px 1fr 16px;
          gap: 11px;
          align-items: center;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 13px;
          color: inherit;
          background: rgba(0,0,0,.14);
          cursor: pointer;
          text-align: left;
        }
        .roleList button:hover,.roleList button.active {
          border-color: rgba(103,226,242,.32);
          background: rgba(103,226,242,.05);
          transform: translateX(3px);
        }
        .number {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(103,226,242,.16);
          border-radius: 10px;
          color: #69dce9;
          font-size: 8px;
        }
        .identity {
          min-width: 0;
          display: grid;
          gap: 4px;
        }
        .identity small {
          color: #718894;
          font-size: 7px;
          font-weight: 950;
          text-transform: uppercase;
        }
        .identity strong {
          color: #dce8ed;
          font-size: 11px;
        }
        .identity em {
          color: #68808c;
          font-size: 8px;
          font-style: normal;
        }
        .roleList i {
          color: #68dcea;
          font-style: normal;
        }
        .roleRecord {
          padding: 28px;
        }
        .recordHeader {
          display: flex;
          align-items: center;
          gap: 18px;
        }
        .recordSeal {
          width: 78px;
          height: 78px;
          flex: 0 0 78px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,201,90,.32);
          border-radius: 50%;
          color: #efca79;
          font: 800 20px Georgia,serif;
        }
        .recordHeader p {
          margin: 0;
          color: #68dce9;
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
        }
        .recordHeader h3 {
          margin: 7px 0 0;
          font-size: clamp(30px,3.4vw,48px);
        }
        .recordHeader span {
          display: block;
          margin-top: 8px;
          color: #8ba1ab;
          font-size: 12px;
          line-height: 1.6;
        }
        .roleMandate {
          margin-top: 22px;
          padding: 19px;
          border-left: 3px solid #efc66f;
          border-radius: 0 14px 14px 0;
          background: linear-gradient(90deg,rgba(239,198,111,.08),transparent);
        }
        .roleMandate span {
          color: #d2aa58;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .13em;
        }
        .roleMandate strong {
          display: block;
          margin-top: 8px;
          font: 700 18px Georgia,serif;
          line-height: 1.5;
        }
        .recordColumns {
          margin-top: 15px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .recordColumns section,.questions,.boundaryCard {
          padding: 20px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px;
          background: rgba(0,0,0,.14);
        }
        .cardHeading {
          padding-bottom: 13px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .cardHeading span {
          color: #72dce9;
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
        }
        .cardHeading strong {
          color: #efc979;
          font: 700 18px Georgia,serif;
        }
        .numbered {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }
        .numbered div {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 10px;
          align-items: start;
        }
        .numbered span {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(103,226,242,.14);
          border-radius: 9px;
          color: #69dce9;
          font-size: 7px;
        }
        .numbered p {
          margin: 5px 0 0;
          color: #a5b6bd;
          font-size: 10px;
          line-height: 1.5;
        }
        .boundaryCard {
          margin-top: 14px;
          border-color: rgba(255,201,90,.18);
        }
        .boundaryCard > span {
          color: #e6bc63;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .13em;
        }
        .boundaryCard p {
          margin: 12px 0 0;
          color: #d1dde1;
          font-size: 12px;
          line-height: 1.55;
        }
        .questions {
          margin-top: 14px;
        }
        .questions > span {
          color: #72dce9;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .13em;
        }
        .questions > div {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }
        .questions article {
          padding: 13px;
          display: grid;
          grid-template-columns: 30px 1fr;
          gap: 10px;
          align-items: center;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 11px;
        }
        .questions article span {
          color: #68dcea;
          font-size: 7px;
        }
        .questions article strong {
          font-size: 10px;
          line-height: 1.4;
        }
        .recordActions {
          margin-top: 17px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 9px;
        }
        .recordActions a,.academyActions a,.closing a {
          min-height: 46px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 11px;
          color: #c5d5dc;
          background: rgba(0,0,0,.18);
          text-decoration: none;
          font-size: 9px;
          font-weight: 950;
        }
        .recordActions a.primary,.closing a.primary {
          color: #06151c;
          border-color: #a9eef8;
          background: linear-gradient(135deg,#d7fbff,#72dceb 65%,#3aa9c2);
        }
        .chainSection {
          border-top: 1px solid rgba(103,226,242,.12);
        }
        .chain {
          display: grid;
          grid-template-columns: repeat(8,1fr);
          border: 1px solid rgba(103,226,242,.14);
          border-radius: 18px;
          overflow: hidden;
        }
        .chain div {
          min-width: 0;
          padding: 24px 8px;
          position: relative;
          text-align: center;
          border-right: 1px solid rgba(255,255,255,.06);
          background: rgba(5,24,35,.75);
        }
        .chain div:last-child {
          border-right: 0;
        }
        .chain span,.chain strong {
          display: block;
        }
        .chain span {
          color: #68dcea;
          font-size: 8px;
        }
        .chain strong {
          margin-top: 7px;
          font-size: 10px;
        }
        .chain i {
          position: absolute;
          right: -7px;
          top: 50%;
          z-index: 2;
          color: #efc66f;
          font-style: normal;
        }
        .failureGrid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 12px;
        }
        .failureGrid article {
          min-height: 210px;
          padding: 22px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 17px;
          background: linear-gradient(145deg,rgba(13,34,45,.82),rgba(4,16,24,.92));
        }
        .failureGrid span {
          color: #6b8b97;
          font-size: 8px;
        }
        .failureGrid strong {
          display: block;
          margin-top: 28px;
          font: 700 21px Georgia,serif;
        }
        .failureGrid p {
          margin: 10px 0 0;
          color: #8da3ad;
          font-size: 11px;
          line-height: 1.6;
        }
        .academySection {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 56px;
          align-items: center;
          border-top: 1px solid rgba(103,226,242,.12);
          border-bottom: 1px solid rgba(103,226,242,.12);
        }
        .academySeal {
          width: 300px;
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px solid #5ee2b1;
          border-radius: 50%;
          background: radial-gradient(circle,rgba(94,226,177,.15),rgba(3,25,28,.96));
          box-shadow: 0 0 70px rgba(94,226,177,.18);
        }
        .academySeal small {
          color: #69b99c;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .16em;
        }
        .academySeal strong {
          color: #bfffe0;
          font: 800 42px Georgia,serif;
        }
        .academySeal span {
          margin-top: 8px;
          color: #64d8ad;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .14em;
        }
        .academySection > div > p:not(.eyebrow) {
          color: #98adaf;
          font-size: 15px;
          line-height: 1.72;
        }
        .academyGrid {
          margin-top: 24px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .academyGrid article {
          padding: 16px;
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 12px;
          border: 1px solid rgba(94,226,177,.14);
          border-radius: 13px;
          background: rgba(255,255,255,.025);
        }
        .academyGrid span {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(94,226,177,.32);
          border-radius: 10px;
          color: #7be7bd;
          font-size: 8px;
        }
        .academyGrid strong {
          font-size: 11px;
        }
        .academyGrid p {
          margin: 5px 0 0;
          color: #7f9896;
          font-size: 9px;
          line-height: 1.45;
        }
        .academyActions {
          margin-top: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }
        .closing {
          padding: 100px 0 20px;
          text-align: center;
        }
        .closing h2 {
          max-width: 1120px;
          margin: 13px auto 0;
        }
        .closing > div {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .scenarioSection {
          padding: 84px 0;
          border-top: 1px solid rgba(103, 226, 242, .12);
        }
        .scenarioGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }
        .scenarioGrid > article {
          min-height: 520px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(103, 226, 242, .12);
          border-radius: 19px;
          background: linear-gradient(145deg, rgba(10, 33, 45, .86), rgba(3, 15, 23, .95));
          box-shadow: 0 20px 48px rgba(0, 0, 0, .18);
        }
        .scenarioTopline {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }
        .scenarioTopline span {
          color: #efc66f;
          font: 700 18px Georgia, serif;
        }
        .scenarioTopline small {
          color: #68dcea;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .scenarioGrid h3 {
          margin: 28px 0 0;
          font-size: 27px;
          line-height: 1.05;
        }
        .scenarioSummary {
          margin: 12px 0 0;
          color: #9db0b8;
          font-size: 12px;
          line-height: 1.65;
        }
        .scenarioBlock {
          margin-top: 20px;
          padding-top: 17px;
          border-top: 1px solid rgba(255, 255, 255, .06);
        }
        .scenarioBlock > strong {
          color: #75ddea;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .scenarioTags {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }
        .scenarioTags span {
          padding: 7px 9px;
          border: 1px solid rgba(103, 226, 242, .13);
          border-radius: 999px;
          color: #c5d7dd;
          background: rgba(0, 0, 0, .17);
          font-size: 8px;
          font-weight: 850;
        }
        .scenarioBlock ol {
          margin: 12px 0 0;
          padding-left: 18px;
          color: #9fb1b9;
        }
        .scenarioBlock li {
          margin: 8px 0;
          padding-left: 4px;
          font-size: 10px;
          line-height: 1.5;
        }
        .scenarioOutcome {
          margin-top: auto;
          padding: 16px;
          border-left: 3px solid #efc66f;
          border-radius: 0 12px 12px 0;
          background: linear-gradient(90deg, rgba(239, 198, 111, .08), transparent);
        }
        .scenarioOutcome span {
          color: #d4ad5c;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .scenarioOutcome p {
          margin: 7px 0 0;
          color: #dce6e9;
          font-size: 11px;
          line-height: 1.55;
        }
        @media (max-width: 1100px) {
          .scenarioGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 700px) {
          .scenarioGrid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 1100px) {
          .workspaceGrid { grid-template-columns: 1fr;
          } .roleIndex { position: static;
          max-height: none;
          } .roleList { grid-template-columns: 1fr 1fr;
          } .academySection { grid-template-columns: 1fr;
          } .academySeal { margin: auto;
          } .chain { grid-template-columns: repeat(4,1fr);
          };
        }
        @media (max-width: 760px) {
          .pageShell { width: calc(100% - 22px);
          } .topbar { grid-template-columns: 1fr 1fr;
          } .topbar span { display: none;
          } .metrics,.principleBand,.failureGrid { grid-template-columns: 1fr 1fr;
          } .sectionHeading,.filters,.recordColumns { grid-template-columns: 1fr;
          } .roleList,.questions > div,.academyGrid { grid-template-columns: 1fr;
          } .chain { grid-template-columns: 1fr 1fr;
          } .recordHeader { align-items: flex-start;
          };
        }
        @media (max-width: 520px) {
          .metrics,.principleBand,.failureGrid { grid-template-columns: 1fr;
          } .hero h1 { font-size: 48px;
          } .recordActions,.academyActions,.closing > div { flex-direction: column;
          } .recordActions a,.academyActions a,.closing a { width: 100%;
          };
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
          };
        }
      `}</style>
    </main>
  );
}
