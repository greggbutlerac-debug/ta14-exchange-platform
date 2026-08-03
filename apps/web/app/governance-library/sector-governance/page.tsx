"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type SectorStatus = "Active" | "Priority" | "Developing";

type SectorRecord = {
  id: string;
  code: string;
  title: string;
  description: string;
  accent: string;
  status: SectorStatus;
  systems: string[];
  authorityAreas: string[];
  evidence: string[];
  failureModes: string[];
  academy: string[];
};

const sectors: SectorRecord[] = [
  {
    id: "healthcare",
    code: "HC",
    title: "Healthcare & Clinical Systems",
    description: "Clinical AI, medical devices, diagnostics, hospitals, laboratories, patient safety, environmental integrity, and accountable human authority.",
    accent: "#7dd3fc",
    status: "Priority",
    systems: [
      "Clinical decision support",
      "Diagnostic and triage systems",
      "Medical-device software",
      "Hospital environmental integrity",
      "Laboratory evidence continuity",
      "Patient-facing automation",
    ],
    authorityAreas: [
      "HIPAA and health privacy",
      "FDA-regulated software and devices",
      "Clinical authority and credentialing",
      "Hospital policy and accreditation",
      "Evidence and outcome review",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing healthcare & clinical systems",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "financial",
    code: "FS",
    title: "Financial Services & Insurance",
    description: "Lending, payments, fraud, insurance, investment, claims, collections, identity, and other consequential financial decisions.",
    accent: "#fbbf24",
    status: "Priority",
    systems: [
      "Credit and underwriting",
      "Fraud and transaction monitoring",
      "Insurance claims",
      "Payments and account restriction",
      "Investment and suitability",
      "Collections and recovery",
    ],
    authorityAreas: [
      "Consumer financial protection",
      "Fair lending and discrimination",
      "Banking and insurance supervision",
      "Model risk management",
      "Identity and authorization",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing financial services & insurance",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "government",
    code: "GV",
    title: "Government & Public Administration",
    description: "Public-sector procurement, benefits, licensing, enforcement, justice, records, transparency, and accountable use of automated systems.",
    accent: "#c4b5fd",
    status: "Active",
    systems: [
      "Benefits and eligibility",
      "Licensing and permitting",
      "Public procurement",
      "Law enforcement support",
      "Administrative decision support",
      "Public records and transparency",
    ],
    authorityAreas: [
      "Constitutional and statutory authority",
      "Administrative procedure",
      "Procurement controls",
      "Records retention",
      "Public accountability and appeal",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing government & public administration",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "critical",
    code: "CI",
    title: "Critical Infrastructure & Utilities",
    description: "Energy, water, transportation, communications, public safety, industrial control, resilience, and continuity of essential services.",
    accent: "#fb7185",
    status: "Priority",
    systems: [
      "Energy generation and distribution",
      "Water and wastewater systems",
      "Transportation and logistics",
      "Communications networks",
      "Emergency operations",
      "Industrial control systems",
    ],
    authorityAreas: [
      "Critical-infrastructure regulation",
      "Cybersecurity and resilience",
      "Safety and continuity duties",
      "Incident reporting",
      "Operational authority",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing critical infrastructure & utilities",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "buildings",
    code: "BE",
    title: "Buildings, HVAC & Facility Systems",
    description: "Smart buildings, HVAC, refrigeration, BAS, environmental integrity, facility automation, field evidence, and verified intervention outcomes.",
    accent: "#34d399",
    status: "Priority",
    systems: [
      "HVAC diagnostics",
      "Refrigerant governance",
      "Building automation",
      "Indoor environmental quality",
      "Facility sensing",
      "Post-intervention verification",
    ],
    authorityAreas: [
      "Mechanical and building codes",
      "ASHRAE and ANSI standards",
      "EPA refrigerant rules",
      "Occupational and public-health duties",
      "Contractual and owner authority",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing buildings, hvac & facility systems",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "manufacturing",
    code: "MF",
    title: "Manufacturing & Industrial Operations",
    description: "Robotics, process automation, industrial quality, worker safety, environmental release, maintenance, and production governance.",
    accent: "#f97316",
    status: "Active",
    systems: [
      "Industrial robotics",
      "Quality inspection",
      "Predictive maintenance",
      "Process control",
      "Worker safety",
      "Environmental release monitoring",
    ],
    authorityAreas: [
      "OSHA and workplace safety",
      "Environmental permits",
      "Quality-management systems",
      "Machine safety standards",
      "Operational authorization",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing manufacturing & industrial operations",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "education",
    code: "ED",
    title: "Education & Workforce",
    description: "Admissions, assessment, credentialing, student support, workforce selection, training, discipline, and institutional learning systems.",
    accent: "#60a5fa",
    status: "Active",
    systems: [
      "Admissions and enrollment",
      "Assessment and proctoring",
      "Student support",
      "Credentialing",
      "Workforce screening",
      "Training and competency",
    ],
    authorityAreas: [
      "Education privacy",
      "Anti-discrimination law",
      "Accreditation and academic authority",
      "Employment law",
      "Appeal and due process",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing education & workforce",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "employment",
    code: "HR",
    title: "Employment & Human Resources",
    description: "Recruiting, hiring, promotion, scheduling, performance, discipline, termination, and workplace monitoring.",
    accent: "#a78bfa",
    status: "Active",
    systems: [
      "Candidate screening",
      "Interview analysis",
      "Promotion and performance",
      "Scheduling and allocation",
      "Workplace monitoring",
      "Discipline and termination",
    ],
    authorityAreas: [
      "Employment discrimination law",
      "Local automated-employment rules",
      "Labor and workplace rights",
      "Human review and appeal",
      "Record preservation",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing employment & human resources",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "environment",
    code: "EN",
    title: "Environmental Protection & Public Health",
    description: "Air, water, land, pollution, contamination, exposure, remediation, public health, and governed environmental outcome verification.",
    accent: "#22d3ee",
    status: "Priority",
    systems: [
      "Air and atmospheric integrity",
      "Water quality",
      "Waste and contamination",
      "Environmental sampling",
      "Remediation and restoration",
      "Public-health protection",
    ],
    authorityAreas: [
      "Clean Air Act and regulations",
      "Clean Water Act and regulations",
      "RCRA, CERCLA, TSCA, and EPCRA",
      "WHO guidance and health evidence",
      "State, tribal, and local authority",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing environmental protection & public health",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "identity",
    code: "ID",
    title: "Identity, Access & Digital Services",
    description: "Identity proofing, authentication, account access, fraud prevention, digital services, and consequential access restriction.",
    accent: "#38bdf8",
    status: "Active",
    systems: [
      "Identity verification",
      "Authentication",
      "Account recovery",
      "Access restriction",
      "Fraud prevention",
      "Digital public services",
    ],
    authorityAreas: [
      "Privacy and identity law",
      "Authorization and consent",
      "Security standards",
      "Appeal and recovery",
      "Evidence integrity",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing identity, access & digital services",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "legal",
    code: "LG",
    title: "Legal, Courts & Dispute Resolution",
    description: "Legal research, case support, judicial administration, evidence, dispute resolution, and systems that influence rights and remedies.",
    accent: "#e879f9",
    status: "Developing",
    systems: [
      "Legal research",
      "Document review",
      "Case management",
      "Judicial support",
      "Dispute resolution",
      "Evidence handling",
    ],
    authorityAreas: [
      "Professional responsibility",
      "Court rules and evidence",
      "Judicial authority",
      "Confidentiality and privilege",
      "Appeal and review",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing legal, courts & dispute resolution",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "security",
    code: "SC",
    title: "Cybersecurity, Privacy & Trust",
    description: "Security operations, privacy engineering, threat detection, incident response, surveillance boundaries, and trust infrastructure.",
    accent: "#2dd4bf",
    status: "Active",
    systems: [
      "Threat detection",
      "Incident response",
      "Privacy engineering",
      "Security monitoring",
      "Access control",
      "Trust and assurance",
    ],
    authorityAreas: [
      "Privacy law",
      "Cybersecurity frameworks",
      "Incident-notification duties",
      "Security authority",
      "Data minimization and retention",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing cybersecurity, privacy & trust",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "media",
    code: "MD",
    title: "Media, Communications & Public Information",
    description: "Content systems, public communications, synthetic media, moderation, advertising, disclosure, and information integrity.",
    accent: "#f472b6",
    status: "Developing",
    systems: [
      "Content generation",
      "Moderation",
      "Synthetic-media disclosure",
      "Advertising",
      "Public information",
      "Reputation and correction",
    ],
    authorityAreas: [
      "Consumer protection",
      "Platform rules",
      "Transparency duties",
      "Intellectual property",
      "Correction and provenance",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing media, communications & public information",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "research",
    code: "RS",
    title: "Research, Science & Laboratories",
    description: "Scientific research, experimentation, laboratory systems, data governance, reproducibility, publication, and responsible innovation.",
    accent: "#93c5fd",
    status: "Active",
    systems: [
      "Research design",
      "Laboratory automation",
      "Data analysis",
      "Reproducibility",
      "Publication",
      "Responsible innovation",
    ],
    authorityAreas: [
      "Research ethics",
      "Laboratory competence",
      "Data governance",
      "Publication integrity",
      "Institutional review",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing research, science & laboratories",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "transport",
    code: "TR",
    title: "Transportation, Mobility & Logistics",
    description: "Vehicles, fleets, routing, autonomous systems, aviation, maritime operations, rail, and logistics decisions.",
    accent: "#f59e0b",
    status: "Active",
    systems: [
      "Fleet operations",
      "Routing and dispatch",
      "Autonomous systems",
      "Aviation",
      "Maritime operations",
      "Rail and logistics",
    ],
    authorityAreas: [
      "Transportation safety",
      "Operator authority",
      "Vehicle and system standards",
      "Incident evidence",
      "Cross-border operation",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing transportation, mobility & logistics",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
  {
    id: "consumer",
    code: "CP",
    title: "Consumer Products & Digital Commerce",
    description: "Product safety, recommendation, pricing, commerce, customer service, warranty, and consumer-facing automation.",
    accent: "#84cc16",
    status: "Developing",
    systems: [
      "Product safety",
      "Recommendation systems",
      "Pricing",
      "Customer service",
      "Warranty and returns",
      "Marketplace integrity",
    ],
    authorityAreas: [
      "Consumer protection",
      "Product-safety rules",
      "Advertising standards",
      "Contract and warranty",
      "Complaint and correction",
    ],
    evidence: [
      "Declared system, version, owner, and operational purpose",
      "Applicable law, regulation, standard, code, policy, or contract",
      "Role, authority, delegation, and approval record",
      "Input evidence, source identity, chronology, and continuity",
      "Bounded determination and execution conditions",
      "Technical execution record and preserved outcome evidence",
    ],
    failureModes: [
      "Sector label used without resolving the actual activity or consequence",
      "A general framework treated as direct execution authority",
      "Current law, adopted code, or controlling edition left unresolved",
      "Human review named but not connected to a qualified accountable role",
      "Evidence gathered without continuity, scope, or interpretation limits",
      "Successful execution treated as proof of a successful real-world outcome",
    ],
    academy: [
      "Understand the authority structure governing consumer products & digital commerce",
      "Inspect real and simulated failure routes",
      "Build a sector-specific evidence package",
      "Resolve applicability, jurisdiction, role, and version",
      "Practice ALLOW, HOLD, DENY, and ESCALATE determinations",
      "Prepare for Entity Review or live governed execution",
    ],
  },
];

const chain = [
  ["Context", "01", "Identify the sector, activity, system, subject, place, and consequence."],
  ["Authority", "02", "Resolve the legal, regulatory, contractual, professional, and operational authority."],
  ["Applicability", "03", "Determine which instruments and duties actually apply to this route."],
  ["Evidence", "04", "Preserve source identity, chronology, continuity, methods, and interpretation limits."],
  ["Role", "05", "Bind each decision and execution step to a qualified accountable role."],
  ["Determination", "06", "Issue ALLOW, HOLD, DENY, or ESCALATE before consequence is bound."],
  ["Execution", "07", "Verify that the technical action corresponds to the committed determination."],
  ["Outcome", "08", "Return the real-world result to the record for review and future reliance."],
] as const;

const statusOptions: Array<"All statuses" | SectorStatus> = [
  "All statuses",
  "Priority",
  "Active",
  "Developing",
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function statusClass(status: SectorStatus): string {
  return status.toLowerCase();
}

export default function SectorGovernancePage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All statuses" | SectorStatus>("All statuses");
  const [selectedId, setSelectedId] = useState(sectors[0].id);
  const [activeChain, setActiveChain] = useState(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return sectors.filter((sector) => {
      const statusMatches = status === "All statuses" || sector.status === status;
      const searchable = [
        sector.code,
        sector.title,
        sector.description,
        sector.status,
        ...sector.systems,
        ...sector.authorityAreas,
        ...sector.evidence,
        ...sector.failureModes,
        ...sector.academy,
      ].join(" ").toLowerCase();
      const queryMatches = normalized.length === 0 || normalized.split(/\s+/).every((token) => searchable.includes(token));
      return statusMatches && queryMatches;
    });
  }, [query, status]);

  const selected = sectors.find((sector) => sector.id === selectedId) ?? filtered[0] ?? sectors[0];

  const metrics = useMemo(() => ({
    sectors: sectors.length,
    systems: new Set(sectors.flatMap((sector) => sector.systems)).size,
    authorities: new Set(sectors.flatMap((sector) => sector.authorityAreas)).size,
    evidence: new Set(sectors.flatMap((sector) => sector.evidence)).size,
  }), []);

  return (
    <main className="sectorPage">
      <div className="canvas" aria-hidden="true">
        <div className="grid" />
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
      </div>

      <div className="shell">
        <header className="topbar">
          <Link href="/governance-library" className="backLink">← Governance Library</Link>
          <div className="topStatus"><span /> Institutional sector resolution</div>
          <Link href="/governance-library/applicability" className="topAction">Resolve Applicability <Arrow /></Link>
        </header>

        <section className="hero">
          <div className="heroSeal"><span>SG</span><small>TA-14</small></div>
          <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
          <h1>Sector Governance <em>without sector shortcuts.</em></h1>
          <p className="lead">A sector name is only the beginning. TA-14 resolves the activity, consequence, authority, jurisdiction, role, evidence, execution boundary, and outcome requirements that make governance defensible inside a real operating environment.</p>
          <div className="heroActions">
            <a href="#workspace" className="button primary">Open Sector Workspace <span>↓</span></a>
            <Link href="/governance-library/authorities" className="button secondary">Resolve Authorities <Arrow /></Link>
            <Link href="/academy" className="button secondary">Enter Sector Academy <Arrow /></Link>
          </div>
          <div className="metrics">
            <article><strong>{metrics.sectors}</strong><span>Governed sectors</span></article>
            <article><strong>{metrics.systems}</strong><span>System classes</span></article>
            <article><strong>{metrics.authorities}</strong><span>Authority areas</span></article>
            <article><strong>{metrics.evidence}</strong><span>Evidence duties</span></article>
          </div>
        </section>

        <section className="definitionGrid">
          <article><span>SECTOR IS CONTEXT</span><strong>Not automatic authority</strong><p>Healthcare, finance, government, buildings, and other labels help locate the route, but they do not determine which law, standard, role, or permission controls execution.</p></article>
          <article><span>CONSEQUENCE CONTROLS DEPTH</span><strong>Higher consequence requires stronger proof</strong><p>The same technology may require a different route when it changes access, safety, money, health, liberty, environmental protection, or public rights.</p></article>
          <article><span>OUTCOME CLOSES THE ROUTE</span><strong>Execution is not the final proof</strong><p>The institution preserves what happened after action so future reliance is based on verified reality rather than assumed success.</p></article>
        </section>

        <section className="workspace" id="workspace">
          <div className="sectionHeading">
            <div><p className="eyebrow">SECTOR CONTROL DESK</p><h2>Choose the operating world. Then resolve what actually governs it.</h2></div>
            <p>Search by sector, system, authority, evidence duty, failure mode, or Academy pathway. Each record preserves the difference between a sector description and a governed execution route.</p>
          </div>

          <div className="filters">
            <label>Search sectors<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search healthcare, HVAC, lending, water, identity..." /></label>
            <label>Status<select value={status} onChange={(event) => setStatus(event.target.value as "All statuses" | SectorStatus)}>{statusOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
            <button type="button" onClick={() => { setQuery(""); setStatus("All statuses"); }}>Clear filters</button>
          </div>

          <div className="workspaceGrid">
            <aside className="sectorIndex">
              <div className="indexHeading"><span>Sector index</span><strong>{filtered.length} records</strong></div>
              <div className="sectorList">
                {filtered.map((sector, index) => (
                  <button key={sector.id} type="button" className={selected.id === sector.id ? "sectorButton active" : "sectorButton"} onClick={() => setSelectedId(sector.id)} style={{ "--accent": sector.accent } as CSSProperties}>
                    <span className="number">{String(index + 1).padStart(2, "0")}</span>
                    <span className="identity"><small>{sector.code}</small><strong>{sector.title}</strong><em>{sector.status}</em></span>
                    <i className={`statusDot ${statusClass(sector.status)}`} />
                  </button>
                ))}
              </div>
            </aside>

            <article className="sectorRecord" style={{ "--accent": selected.accent } as CSSProperties}>
              <div className="recordHeader">
                <div className="recordIdentity"><div className="recordSeal">{selected.code}</div><div><p>INSTITUTIONAL SECTOR RECORD</p><h3>{selected.title}</h3><span>{selected.description}</span></div></div>
                <div className={`statusBadge ${statusClass(selected.status)}`}>{selected.status}</div>
              </div>

              <div className="recordBand">
                <div><span>Sector code</span><strong>{selected.code}</strong></div>
                <div><span>Governance state</span><strong>{selected.status}</strong></div>
                <div><span>Required determination</span><strong>ALLOW · HOLD · DENY · ESCALATE</strong></div>
              </div>

              <div className="recordColumns">
                <section className="recordCard"><div className="cardHeading"><span>Systems and activities</span><strong>{selected.systems.length}</strong></div><div className="itemList">{selected.systems.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></section>
                <section className="recordCard"><div className="cardHeading"><span>Authority areas</span><strong>{selected.authorityAreas.length}</strong></div><div className="itemList">{selected.authorityAreas.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></section>
              </div>

              <section className="wideCard"><div className="cardHeading"><span>Required evidence package</span><strong>{selected.evidence.length}</strong></div><div className="evidenceGrid">{selected.evidence.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}</div></section>

              <section className="failureCard"><div className="cardHeading"><span>Sector governance failure modes</span><strong>{selected.failureModes.length}</strong></div><div className="failureGrid">{selected.failureModes.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></div>)}</div></section>

              <section className="academyCard"><div className="academySeal">AC</div><div><span>SECTOR ACADEMY PATHWAY</span><h4>{selected.title} Academy</h4><p>Learn the domain, inspect failure, build the evidence package, resolve authority, and practice the route before live consequence.</p><ul>{selected.academy.map((item) => <li key={item}>{item}</li>)}</ul></div></section>

              <div className="recordActions"><Link href="/governance-library/applicability" className="button secondary">Resolve Applicability <Arrow /></Link><Link href="/governance-library/authorities" className="button secondary">Resolve Authority <Arrow /></Link><Link href="/workspace/entity-review" className="button primary">Begin Entity Review <Arrow /></Link></div>
            </article>
          </div>
        </section>

        <section className="chainSection">
          <div className="sectionHeading"><div><p className="eyebrow">SECTOR GOVERNANCE ROUTE</p><h2>Move from operating context to verified outcome without losing authority.</h2></div><p>Select a stage to inspect the institutional question that must be answered before the route advances.</p></div>
          <div className="chainTrack">{chain.map(([title, code], index) => <button type="button" key={title} className={activeChain === index ? "active" : ""} onClick={() => setActiveChain(index)}><span>{code}</span><strong>{title}</strong>{index < chain.length - 1 ? <i>→</i> : null}</button>)}</div>
          <article className="chainDetail"><span>STAGE {chain[activeChain][1]}</span><h3>{chain[activeChain][0]}</h3><p>{chain[activeChain][2]}</p></article>
        </section>

        <section className="determinations">
          <div className="sectionHeading centered"><div><p className="eyebrow">SECTOR DETERMINATIONS</p><h2>Every consequential route must reach a bounded state.</h2></div></div>
          <div className="determinationGrid">
            <article className="allow"><span>01</span><h3>ALLOW</h3><p>Current authority and admissible evidence support the bounded action under preserved conditions.</p></article>
            <article className="hold"><span>02</span><h3>HOLD</h3><p>The route pauses because authority, evidence, version, role, or operating conditions remain unresolved.</p></article>
            <article className="deny"><span>03</span><h3>DENY</h3><p>The proposed action exceeds authority, conflicts with controlling requirements, or lacks required support.</p></article>
            <article className="escalate"><span>04</span><h3>ESCALATE</h3><p>A qualified authority must resolve conflict, uncertainty, novelty, or consequence before execution.</p></article>
          </div>
        </section>

        <section className="academySection">
          <div className="academyVisual"><div className="centralSeal"><small>TA-14</small><strong>ACADEMY</strong><span>SECTOR GOVERNANCE</span></div><i /><i /><i /></div>
          <div className="academyCopy"><p className="eyebrow">THE ACADEMY INSIDE EVERY SECTOR</p><h2>Learn the rules of the operating world before you govern its consequences.</h2><p>The Academy teaches sector context, actual authority, applicable instruments, evidence requirements, failure modes, role boundaries, simulations, assessments, and readiness before the participant enters live Entity Review or execution governance.</p><div className="academySteps">{["Orient","Classify","Resolve","Build","Simulate","Assess","Submit","Revalidate"].map((step,index)=><div key={step}><span>{String(index+1).padStart(2,"0")}</span><strong>{step}</strong></div>)}</div><div className="heroActions left"><Link href="/academy" className="button primary">Enter TA-14 Academy <Arrow /></Link><Link href="/workspace/entity-review" className="button secondary">Open Entity Review <Arrow /></Link></div></div>
        </section>

        <section className="boundarySection">
          <p className="eyebrow">INSTITUTIONAL BOUNDARY</p>
          <h2>A sector page does not create legal authority, professional competence, certification, or permission to execute.</h2>
          <p>TA-14 organizes the governance route, preserves evidence, resolves declared authority, exposes uncertainty, and produces bounded determinations. Official law, regulation, adopted codes, contracts, permits, qualified professionals, regulators, courts, and accountable organizations remain controlling within their actual scope.</p>
          <div className="boundaryGrid"><article><span>TA-14 PROVIDES</span><strong>Governed route construction, evidence organization, readiness, review, and bounded findings.</strong></article><article><span>TA-14 DOES NOT REPLACE</span><strong>Legislatures, regulators, courts, licensed professionals, certifiers, employers, or owners.</strong></article><article><span>EXECUTION REQUIRES</span><strong>Current authority, admissible evidence, accountable roles, technical control, and outcome verification.</strong></article></div>
        </section>

        <footer><span>TA-14 Authority Governance Institution</span><span>Sector Governance · TA14Authority.org</span></footer>
      </div>

      <style jsx>{`

        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
          background: #020812;
        }

        :global(body) {
          margin: 0;
          color: #f7fbff;
          background: #020812;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        :global(a) {
          color: inherit;
        }

        .sectorPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background: linear-gradient(180deg, rgba(2, 8, 18, 0.76), rgba(2, 7, 14, 0.96));
        }

        .canvas {
          position: fixed;
          inset: 0;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(circle at 50% -10%, rgba(55, 164, 255, 0.15), transparent 35%),
            linear-gradient(180deg, #020814, #06111d 48%, #02060d);
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: 0.13;
          background-image:
            linear-gradient(rgba(111, 213, 255, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(111, 213, 255, 0.25) 1px, transparent 1px);
          background-size: 72px 72px;
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }

        .glow {
          position: absolute;
          width: 720px;
          height: 720px;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.14;
        }

        .glowOne {
          left: -280px;
          top: 18%;
          background: #0f82d8;
        }

        .glowTwo {
          right: -300px;
          top: 55%;
          background: #a155ef;
        }

        .route {
          position: absolute;
          width: 72vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(98, 205, 255, 0.55), rgba(255, 197, 75, 0.45), transparent);
        }

        .route::after {
          content: "";
          position: absolute;
          top: -3px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff0a6;
          box-shadow: 0 0 18px rgba(255, 225, 126, 0.9);
          animation: packet 8s linear infinite;
        }

        .routeOne {
          left: -12%;
          top: 24%;
          transform: rotate(-8deg);
        }

        .routeTwo {
          right: -16%;
          top: 72%;
          transform: rotate(9deg);
        }

        .shell {
          width: min(1500px, calc(100% - 38px));
          margin: 0 auto;
          position: relative;
          z-index: 2;
          padding-bottom: 80px;
        }

        .topbar {
          min-height: 82px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 18px;
          border-bottom: 1px solid rgba(120, 209, 242, 0.14);
        }

        .backLink,
        .topAction,
        .button {
          min-height: 48px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
          transition: transform 0.22s, border-color 0.22s;
        }

        .backLink {
          justify-self: start;
          color: #bdd0da;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(255, 255, 255, 0.025);
        }

        .topAction,
        .button.primary {
          color: #03131b;
          border: 1px solid #a6eaff;
          background: linear-gradient(135deg, #d9f8ff, #73d6ef 65%, #2a98bd);
          box-shadow: 0 14px 32px rgba(62, 182, 220, 0.18);
        }

        .topAction {
          justify-self: end;
        }

        .button.secondary {
          color: #e7f8ff;
          border: 1px solid rgba(115, 210, 240, 0.22);
          background: linear-gradient(180deg, rgba(15, 43, 61, 0.88), rgba(5, 20, 32, 0.92));
        }

        .backLink:hover,
        .topAction:hover,
        .button:hover {
          transform: translateY(-3px);
        }

        .topStatus {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #829aa7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .topStatus span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #72e6b2;
          box-shadow: 0 0 14px rgba(114, 230, 178, 0.86);
        }

        .hero {
          max-width: 1180px;
          margin: 0 auto;
          padding: 86px 0 70px;
          text-align: center;
        }

        .heroSeal {
          width: 108px;
          height: 108px;
          margin: 0 auto 25px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 4px;
          border-radius: 50%;
          border: 1px solid rgba(255, 202, 91, 0.35);
          background: radial-gradient(circle, rgba(255, 210, 101, 0.11), rgba(4, 18, 31, 0.92) 68%);
          box-shadow: 0 0 62px rgba(255, 194, 61, 0.1);
        }

        .heroSeal span {
          color: #ffe09a;
          font: 900 31px Georgia, serif;
        }

        .heroSeal small {
          color: #7f99a5;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .eyebrow {
          margin: 0;
          color: #69def5;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .hero h1,
        .sectionHeading h2,
        .academyCopy h2,
        .boundarySection h2 {
          margin: 14px 0 19px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(48px, 6vw, 88px);
          line-height: 0.97;
          letter-spacing: -0.052em;
          text-wrap: balance;
        }

        .hero h1 em {
          display: block;
          color: #f2c760;
          font-style: italic;
          font-weight: 500;
        }

        .lead {
          max-width: 1000px;
          margin: 0 auto;
          color: #b0c2cc;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroActions {
          margin-top: 29px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 11px;
        }

        .heroActions.left {
          justify-content: flex-start;
        }

        .metrics {
          margin-top: 38px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .metrics article {
          padding: 19px;
          border: 1px solid rgba(108, 211, 244, 0.12);
          border-radius: 16px;
          background: rgba(6, 21, 35, 0.62);
        }

        .metrics strong {
          display: block;
          color: #f0d186;
          font: 700 29px Georgia, serif;
        }

        .metrics span {
          display: block;
          margin-top: 5px;
          color: #758d99;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .definitionGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding-bottom: 92px;
        }

        .definitionGrid article {
          padding: 25px;
          border: 1px solid rgba(104, 210, 242, 0.13);
          border-radius: 19px;
          background: linear-gradient(145deg, rgba(10, 31, 47, 0.8), rgba(4, 16, 27, 0.9));
        }

        .definitionGrid span {
          color: #6795a8;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.14em;
        }

        .definitionGrid strong {
          display: block;
          margin: 13px 0 8px;
          font: 700 21px Georgia, serif;
        }

        .definitionGrid p {
          margin: 0;
          color: #94a9b3;
          font-size: 13px;
          line-height: 1.62;
        }

        .workspace,
        .chainSection,
        .determinations,
        .academySection,
        .boundarySection {
          padding: 88px 0;
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 42px;
          align-items: end;
          margin-bottom: 32px;
        }

        .sectionHeading.centered {
          display: block;
          max-width: 950px;
          margin: 0 auto 34px;
          text-align: center;
        }

        .sectionHeading h2,
        .academyCopy h2,
        .boundarySection h2 {
          font-size: clamp(39px, 4.6vw, 68px);
        }

        .sectionHeading > p,
        .academyCopy > p,
        .boundarySection > p {
          margin: 0;
          color: #9eb1bb;
          font-size: 15px;
          line-height: 1.72;
        }

        .filters {
          padding: 18px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 220px auto;
          gap: 12px;
          align-items: end;
          border: 1px solid rgba(105, 211, 244, 0.12);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(9, 29, 44, 0.94), rgba(3, 13, 22, 0.97));
        }

        label {
          display: grid;
          gap: 7px;
          color: #7292a0;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 47px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 10px;
          outline: none;
          color: #eaf5f8;
          background: rgba(0, 0, 0, 0.2);
          font: inherit;
          text-transform: none;
        }

        select option {
          background: #071622;
        }

        .filters button {
          min-height: 47px;
          padding: 0 16px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 10px;
          color: #bacbd3;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
        }

        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 390px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .sectorIndex,
        .sectorRecord {
          border: 1px solid rgba(101, 210, 243, 0.12);
          border-radius: 24px;
          background: linear-gradient(145deg, rgba(9, 29, 44, 0.95), rgba(3, 13, 22, 0.98));
        }

        .sectorIndex {
          position: sticky;
          top: 18px;
          padding: 18px;
        }

        .indexHeading {
          padding: 2px 3px 15px;
          display: flex;
          justify-content: space-between;
          gap: 14px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .indexHeading span {
          color: #6ad9ed;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .indexHeading strong {
          color: #edc976;
          font: 700 17px Georgia, serif;
        }

        .sectorList {
          margin-top: 13px;
          display: grid;
          gap: 8px;
        }

        .sectorButton {
          width: 100%;
          padding: 12px;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) 9px;
          align-items: center;
          gap: 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          text-align: left;
          transition: transform 0.2s, border-color 0.2s;
        }

        .sectorButton:hover,
        .sectorButton.active {
          transform: translateX(4px);
          border-color: color-mix(in srgb, var(--accent) 50%, transparent);
          background: color-mix(in srgb, var(--accent) 7%, transparent);
        }

        .number {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
          border-radius: 9px;
          color: var(--accent);
          font-size: 8px;
          font-weight: 900;
        }

        .identity {
          min-width: 0;
          display: grid;
          gap: 3px;
        }

        .identity small {
          color: var(--accent);
          font-size: 7px;
          font-weight: 900;
        }

        .identity strong {
          color: #dce8ed;
          font-size: 10px;
        }

        .identity em {
          color: #6f8792;
          font-size: 8px;
          font-style: normal;
        }

        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #73818a;
        }

        .statusDot.priority,
        .statusBadge.priority {
          color: #241700;
          background: #f0c35a;
        }

        .statusDot.active,
        .statusBadge.active {
          color: #04160f;
          background: #6de1aa;
        }

        .statusDot.developing,
        .statusBadge.developing {
          color: #150c28;
          background: #b69cff;
        }

        .sectorRecord {
          padding: 27px;
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.24);
        }

        .recordHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .recordIdentity {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .recordSeal {
          width: 72px;
          height: 72px;
          flex: 0 0 72px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid color-mix(in srgb, var(--accent) 48%, transparent);
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 7%, transparent);
          font: 700 21px Georgia, serif;
          box-shadow: 0 0 30px color-mix(in srgb, var(--accent) 15%, transparent);
        }

        .recordIdentity p {
          margin: 0;
          color: var(--accent);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .recordIdentity h3 {
          margin: 6px 0 0;
          font: 700 clamp(29px, 3vw, 44px) Georgia, serif;
        }

        .recordIdentity span {
          display: block;
          max-width: 760px;
          margin-top: 8px;
          color: #8ea4ae;
          font-size: 12px;
          line-height: 1.55;
        }

        .statusBadge {
          padding: 9px 12px;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 950;
          text-transform: uppercase;
        }

        .recordBand {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .recordBand div,
        .recordCard,
        .wideCard,
        .failureCard {
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.14);
        }

        .recordBand span {
          color: #6998a9;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .recordBand strong {
          display: block;
          margin-top: 7px;
          font-size: 10px;
        }

        .recordColumns {
          margin-top: 13px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .cardHeading {
          padding-bottom: 12px;
          display: flex;
          justify-content: space-between;
          gap: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardHeading span {
          color: var(--accent, #71dbed);
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .cardHeading strong {
          color: #eccb80;
          font: 700 18px Georgia, serif;
        }

        .itemList {
          margin-top: 12px;
          display: grid;
          gap: 8px;
        }

        .itemList div {
          display: grid;
          grid-template-columns: 31px 1fr;
          gap: 10px;
          align-items: start;
        }

        .itemList span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
          color: var(--accent);
          font-size: 7px;
        }

        .itemList p {
          margin: 6px 0 0;
          color: #9eb1ba;
          font-size: 10px;
          line-height: 1.45;
        }

        .wideCard,
        .failureCard {
          margin-top: 13px;
        }

        .evidenceGrid,
        .failureGrid {
          margin-top: 13px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
        }

        .evidenceGrid div,
        .failureGrid div {
          min-height: 84px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.018);
        }

        .evidenceGrid span,
        .failureGrid span {
          color: var(--accent);
          font-size: 7px;
        }

        .evidenceGrid strong {
          display: block;
          margin-top: 8px;
          color: #aebfc6;
          font-size: 9px;
          line-height: 1.45;
        }

        .failureGrid p {
          margin: 8px 0 0;
          color: #a3b4bc;
          font-size: 9px;
          line-height: 1.45;
        }

        .academyCard {
          margin-top: 13px;
          padding: 20px;
          display: grid;
          grid-template-columns: 74px 1fr;
          gap: 17px;
          border: 1px solid rgba(91, 237, 177, 0.17);
          border-radius: 17px;
          background: linear-gradient(145deg, rgba(16, 53, 43, 0.5), rgba(4, 20, 24, 0.88));
        }

        .academySeal {
          width: 74px;
          height: 74px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(99, 239, 181, 0.45);
          color: #8ff5c6;
          font: 700 23px Georgia, serif;
        }

        .academyCard > div > span {
          color: #69dda9;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .academyCard h4 {
          margin: 7px 0 0;
          font: 700 24px Georgia, serif;
        }

        .academyCard p {
          margin: 8px 0 0;
          color: #94aaa5;
          font-size: 11px;
          line-height: 1.55;
        }

        .academyCard ul {
          margin: 12px 0 0;
          padding-left: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px 18px;
          color: #a6bab5;
          font-size: 9px;
          line-height: 1.45;
        }

        .recordActions {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 9px;
        }

        .chainTrack {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          border: 1px solid rgba(103, 210, 243, 0.14);
          border-radius: 17px;
          overflow: hidden;
          background: rgba(5, 20, 32, 0.78);
        }

        .chainTrack button {
          min-width: 0;
          padding: 21px 8px;
          position: relative;
          border: 0;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
          color: #8299a4;
          background: transparent;
          cursor: pointer;
        }

        .chainTrack button:last-child {
          border-right: 0;
        }

        .chainTrack button span,
        .chainTrack button strong {
          display: block;
        }

        .chainTrack button span {
          color: #658999;
          font-size: 8px;
        }

        .chainTrack button strong {
          margin-top: 7px;
          font-size: 10px;
        }

        .chainTrack button i {
          position: absolute;
          right: -7px;
          top: 50%;
          z-index: 2;
          color: #547687;
          font-style: normal;
        }

        .chainTrack button.active {
          color: #fff0bb;
          background: linear-gradient(180deg, rgba(255, 204, 89, 0.11), rgba(94, 211, 244, 0.05));
          box-shadow: inset 0 -3px #f0c55d;
        }

        .chainDetail {
          margin-top: 13px;
          padding: 31px;
          border: 1px solid rgba(255, 198, 82, 0.16);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(35, 29, 13, 0.4), rgba(5, 20, 31, 0.9));
        }

        .chainDetail span {
          color: #e4b856;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .chainDetail h3 {
          margin: 8px 0 7px;
          font: 700 39px Georgia, serif;
        }

        .chainDetail p {
          margin: 0;
          color: #a8bac2;
          font-size: 14px;
          line-height: 1.65;
        }

        .determinationGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 13px;
        }

        .determinationGrid article {
          min-height: 250px;
          padding: 23px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(10, 29, 42, 0.86), rgba(3, 15, 24, 0.94));
        }

        .determinationGrid span {
          color: #617b88;
          font-size: 9px;
          font-weight: 900;
        }

        .determinationGrid h3 {
          margin: 35px 0 11px;
          font: 700 36px Georgia, serif;
        }

        .determinationGrid p {
          color: #9cafb7;
          font-size: 12px;
          line-height: 1.6;
        }

        .allow h3 {
          color: #6de1aa;
        }

        .hold h3 {
          color: #f1c95f;
        }

        .deny h3 {
          color: #ff7588;
        }

        .escalate h3 {
          color: #b69cff;
        }

        .academySection {
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 58px;
          align-items: center;
          border-top: 1px solid rgba(105, 211, 244, 0.12);
          border-bottom: 1px solid rgba(105, 211, 244, 0.12);
        }

        .academyVisual {
          height: 500px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .centralSeal {
          width: 240px;
          height: 240px;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid #66e9ac;
          background: radial-gradient(circle, rgba(96, 236, 172, 0.16), rgba(3, 25, 28, 0.94));
          box-shadow: 0 0 70px rgba(77, 229, 166, 0.18);
        }

        .centralSeal small {
          color: #6faf99;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .centralSeal strong {
          color: #baffd7;
          font: 700 40px Georgia, serif;
        }

        .centralSeal span {
          margin-top: 7px;
          color: #6ddcad;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .academyVisual i {
          position: absolute;
          border: 1px solid rgba(94, 235, 174, 0.23);
          border-radius: 50%;
          animation: spin 24s linear infinite;
        }

        .academyVisual i:nth-of-type(1) {
          width: 320px;
          height: 430px;
        }

        .academyVisual i:nth-of-type(2) {
          width: 445px;
          height: 265px;
          animation-direction: reverse;
        }

        .academyVisual i:nth-of-type(3) {
          width: 480px;
          height: 480px;
          border-color: rgba(255, 205, 91, 0.13);
          animation-duration: 36s;
        }

        .academySteps {
          margin-top: 24px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 9px;
        }

        .academySteps div {
          padding: 13px;
          border: 1px solid rgba(99, 231, 177, 0.13);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.02);
        }

        .academySteps span {
          color: #5fa488;
          font-size: 7px;
        }

        .academySteps strong {
          display: block;
          margin-top: 5px;
          font-size: 9px;
        }

        .boundarySection {
          text-align: center;
        }

        .boundarySection > p {
          max-width: 1000px;
          margin: 0 auto;
        }

        .boundaryGrid {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .boundaryGrid article {
          padding: 22px;
          border: 1px solid rgba(255, 198, 82, 0.16);
          border-radius: 16px;
          background: rgba(25, 22, 12, 0.27);
        }

        .boundaryGrid span {
          color: #dfb75c;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.11em;
        }

        .boundaryGrid strong {
          display: block;
          margin-top: 9px;
          font-size: 12px;
          line-height: 1.52;
        }

        footer {
          min-height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid rgba(105, 211, 244, 0.12);
          color: #607b87;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.09em;
        }

        @keyframes packet {
          from {
            left: 0;
          }
          to {
            left: 100%;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1100px) {
          .sectionHeading,
          .workspaceGrid,
          .academySection {
            grid-template-columns: 1fr;
          }

          .sectorIndex {
            position: static;
          }

          .sectorList {
            grid-template-columns: 1fr 1fr;
          }

          .chainTrack {
            grid-template-columns: repeat(4, 1fr);
          }

          .determinationGrid {
            grid-template-columns: 1fr 1fr;
          }

          .academyVisual {
            height: 420px;
          }
        }

        @media (max-width: 760px) {
          .shell {
            width: min(100% - 22px, 1500px);
          }

          .topbar {
            grid-template-columns: 1fr auto;
          }

          .topStatus {
            display: none;
          }

          .hero {
            padding-top: 64px;
          }

          .hero h1 {
            font-size: 48px;
          }

          .lead {
            font-size: 15px;
          }

          .metrics,
          .definitionGrid,
          .recordBand,
          .recordColumns,
          .evidenceGrid,
          .failureGrid,
          .determinationGrid,
          .boundaryGrid,
          .academySteps {
            grid-template-columns: 1fr;
          }

          .filters {
            grid-template-columns: 1fr;
          }

          .sectorList {
            grid-template-columns: 1fr;
          }

          .sectorRecord {
            padding: 20px;
          }

          .recordHeader,
          .recordIdentity {
            flex-direction: column;
          }

          .academyCard {
            grid-template-columns: 1fr;
          }

          .academyCard ul {
            grid-template-columns: 1fr;
          }

          .chainTrack {
            grid-template-columns: 1fr 1fr;
          }

          .recordActions,
          .heroActions {
            flex-direction: column;
          }

          .button,
          .recordActions .button {
            width: 100%;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            text-align: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition: none !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
