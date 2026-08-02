"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Domain = "AI Governance" | "Environmental Integrity" | "Law & Standards";
type ApplicabilityStatus = "Likely Applicable" | "Review Required" | "Supporting Authority" | "Outside Current Scope";

type DeterminationProfile = {
  domain: Domain;
  jurisdiction: string;
  role: string;
  systemOrActivity: string;
  sector: string;
  consequence: string;
  evidenceType: string;
  adoptionPath: string;
};

type AuthorityResult = {
  id: string;
  name: string;
  family: string;
  status: ApplicabilityStatus;
  domain: Domain[];
  jurisdictions: string[];
  roles: string[];
  systems: string[];
  sectors: string[];
  consequenceLevels: string[];
  adoptionPaths: string[];
  why: string;
  evidence: string[];
  applicabilityQuestions: string[];
  limits: string;
  route: string;
  href: string;
};

const initialProfile: DeterminationProfile = {
  domain: "Environmental Integrity",
  jurisdiction: "United States",
  role: "Facility owner or operator",
  systemOrActivity: "Air emissions or atmospheric monitoring",
  sector: "Built environment",
  consequence: "High",
  evidenceType: "Measurement and monitoring records",
  adoptionPath: "Statute or regulation",
};

const authorityCatalog: AuthorityResult[] = [
  {
    id: "clean-air-act",
    name: "Clean Air Act",
    family: "Federal environmental statute",
    status: "Likely Applicable",
    domain: ["Environmental Integrity", "Law & Standards"],
    jurisdictions: ["United States"],
    roles: ["Facility owner or operator", "Regulated entity", "Government or public authority", "Environmental reviewer"],
    systems: ["Air emissions or atmospheric monitoring", "Building and indoor environmental conditions", "Industrial process or pollution control"],
    sectors: ["Built environment", "Industrial and manufacturing", "Energy and utilities", "Public infrastructure"],
    consequenceLevels: ["High", "Critical"],
    adoptionPaths: ["Statute or regulation"],
    why: "The selected profile involves air emissions, atmospheric evidence, or a regulated source within the United States. Applicability depends on source classification, pollutant, jurisdiction, permit status, program delegation, and the specific implementing regulation.",
    evidence: [
      "Source and facility identity",
      "Permit and program applicability record",
      "Pollutant and emission-unit inventory",
      "Monitoring method and instrument record",
      "Calibration and quality-assurance package",
      "Emission, operating, and exception logs",
      "Reporting and certification records",
      "Enforcement, deviation, or corrective-action history",
    ],
    applicabilityQuestions: [
      "Is the activity a stationary source, mobile source, product, fuel, or another regulated category?",
      "Which pollutant, threshold, permit program, state implementation plan, or federal rule may govern?",
      "Has the controlling jurisdiction adopted, delegated, or supplemented the federal requirement?",
      "Which monitoring, reporting, certification, and record-retention duties apply to the actual source?",
    ],
    limits: "The statute establishes the legal framework. A determination still requires the current implementing rule, permit, jurisdiction, adopted methods, and source-specific facts.",
    route: "TA-14 Clean Air and Atmospheric Integrity Applicability Route",
    href: "/governance-library/laws",
  },
  {
    id: "clean-water-act",
    name: "Clean Water Act",
    family: "Federal environmental statute",
    status: "Likely Applicable",
    domain: ["Environmental Integrity", "Law & Standards"],
    jurisdictions: ["United States"],
    roles: ["Facility owner or operator", "Regulated entity", "Government or public authority", "Environmental reviewer"],
    systems: ["Water discharge, sampling, or treatment", "Industrial process or pollution control", "Environmental remediation"],
    sectors: ["Industrial and manufacturing", "Water and wastewater", "Energy and utilities", "Public infrastructure"],
    consequenceLevels: ["High", "Critical"],
    adoptionPaths: ["Statute or regulation"],
    why: "The selected profile concerns a discharge, water-quality condition, treatment process, sampling program, or remediation pathway in the United States. Applicability turns on the receiving water, discharge pathway, permit status, pollutant, and responsible authority.",
    evidence: [
      "Discharger and outfall identity",
      "Permit and effluent-limit record",
      "Sampling plan and chain of custody",
      "Approved analytical method",
      "Laboratory and quality-control package",
      "Discharge monitoring reports",
      "Bypass, upset, exceedance, and correction records",
      "Receiving-water and outcome evidence",
    ],
    applicabilityQuestions: [
      "Is there an addition of a pollutant through a point source or another regulated discharge pathway?",
      "Which permit, effluent limitation, pretreatment rule, stormwater program, or water-quality requirement applies?",
      "Which analytical method, sampling frequency, detection limit, and reporting format control?",
      "What evidence demonstrates the actual environmental outcome rather than only administrative compliance?",
    ],
    limits: "The legal framework does not by itself establish permit coverage, jurisdictional water status, method validity, or the truth of a claimed environmental outcome.",
    route: "TA-14 Water Integrity Applicability Route",
    href: "/governance-library/laws",
  },
  {
    id: "safe-drinking-water-act",
    name: "Safe Drinking Water Act",
    family: "Federal public-health and environmental statute",
    status: "Review Required",
    domain: ["Environmental Integrity", "Law & Standards"],
    jurisdictions: ["United States"],
    roles: ["Facility owner or operator", "Regulated entity", "Government or public authority", "Environmental reviewer"],
    systems: ["Drinking water supply or treatment", "Water discharge, sampling, or treatment"],
    sectors: ["Water and wastewater", "Public infrastructure", "Healthcare", "Built environment"],
    consequenceLevels: ["High", "Critical"],
    adoptionPaths: ["Statute or regulation"],
    why: "The profile may involve a public water system, drinking-water treatment, distribution, sampling, monitoring, public notification, or underground-injection activity.",
    evidence: [
      "System classification and responsible-party record",
      "Source-water and treatment description",
      "Sampling site plan",
      "Method and laboratory record",
      "Maximum contaminant level or treatment-technique mapping",
      "Public notification and corrective-action record",
      "Distribution-system and residual evidence",
      "Outcome and recurrence monitoring",
    ],
    applicabilityQuestions: [
      "Is the system a public water system or another regulated drinking-water activity?",
      "Which contaminant, treatment technique, monitoring schedule, and notification requirement applies?",
      "Which state, tribal, territorial, or federal authority has primacy?",
      "Does the evidence establish current water integrity at the actual point and time of reliance?",
    ],
    limits: "A legal citation does not substitute for current system classification, primacy authority, method control, sampling validity, or point-of-use evidence.",
    route: "TA-14 Drinking Water Integrity Route",
    href: "/governance-library/laws",
  },
  {
    id: "rcra",
    name: "Resource Conservation and Recovery Act",
    family: "Waste and hazardous-material statute",
    status: "Review Required",
    domain: ["Environmental Integrity", "Law & Standards"],
    jurisdictions: ["United States"],
    roles: ["Facility owner or operator", "Regulated entity", "Environmental reviewer"],
    systems: ["Waste generation, storage, transport, or disposal", "Industrial process or pollution control", "Environmental remediation"],
    sectors: ["Industrial and manufacturing", "Waste management", "Healthcare", "Energy and utilities"],
    consequenceLevels: ["Medium", "High", "Critical"],
    adoptionPaths: ["Statute or regulation"],
    why: "The profile may involve solid waste, hazardous waste, used oil, underground storage tanks, treatment, storage, transport, disposal, corrective action, or related record duties.",
    evidence: [
      "Waste determination",
      "Generator and facility status",
      "Manifest and custody records",
      "Container, tank, storage, and inspection logs",
      "Treatment or disposal documentation",
      "Emergency and contingency records",
      "Closure or corrective-action evidence",
      "State authorization and rule-version mapping",
    ],
    applicabilityQuestions: [
      "What material is being managed and how is it legally classified?",
      "Which generator, transporter, treatment, storage, disposal, or tank requirements apply?",
      "Has the state adopted requirements more stringent or broader than the federal baseline?",
      "Can custody, accumulation time, container integrity, treatment, disposal, and final outcome be reconstructed?",
    ],
    limits: "Waste classification and state authorization are fact-specific. The current adopted rule and actual material characteristics control.",
    route: "TA-14 Waste and Material Integrity Route",
    href: "/governance-library/laws",
  },
  {
    id: "cercla",
    name: "CERCLA / Superfund",
    family: "Contamination and remediation statute",
    status: "Review Required",
    domain: ["Environmental Integrity", "Law & Standards"],
    jurisdictions: ["United States"],
    roles: ["Facility owner or operator", "Regulated entity", "Government or public authority", "Environmental reviewer"],
    systems: ["Environmental remediation", "Industrial process or pollution control", "Waste generation, storage, transport, or disposal"],
    sectors: ["Industrial and manufacturing", "Waste management", "Public infrastructure", "Real estate and development"],
    consequenceLevels: ["High", "Critical"],
    adoptionPaths: ["Statute or regulation"],
    why: "The profile may involve a release or threatened release of hazardous substances, site investigation, response action, liability, cleanup, natural-resource damage, or long-term remedy performance.",
    evidence: [
      "Site and potentially responsible-party identity",
      "Release and substance characterization",
      "Sampling, laboratory, and chain-of-custody package",
      "Exposure-pathway and receptor record",
      "Removal or remedial-action decision record",
      "Remedy construction and operation evidence",
      "Institutional-control and monitoring record",
      "Outcome, recurrence, and long-term stewardship evidence",
    ],
    applicabilityQuestions: [
      "Was there a release or threatened release of a covered hazardous substance?",
      "Which parties, property interests, defenses, exemptions, and response authorities are implicated?",
      "Which sampling, risk, remedy, and long-term monitoring requirements govern the site?",
      "Does the record prove remedy performance and current environmental condition rather than only project completion?",
    ],
    limits: "Liability, defenses, remedy selection, and evidentiary sufficiency require site-specific legal and technical review.",
    route: "TA-14 Contamination and Remediation Integrity Route",
    href: "/governance-library/laws",
  },
  {
    id: "ashrae-62-1",
    name: "ASHRAE Standard 62.1",
    family: "Ventilation and indoor-air standard",
    status: "Supporting Authority",
    domain: ["Environmental Integrity", "Law & Standards"],
    jurisdictions: ["United States", "Global", "European Union", "Canada", "Other"],
    roles: ["Facility owner or operator", "Designer or engineer", "Commissioning or testing provider", "Environmental reviewer"],
    systems: ["Building and indoor environmental conditions", "HVAC design, operation, or maintenance"],
    sectors: ["Built environment", "Healthcare", "Education", "Commercial facilities", "Public infrastructure"],
    consequenceLevels: ["Medium", "High"],
    adoptionPaths: ["Voluntary standard", "Adopted code", "Contractual requirement"],
    why: "The profile involves ventilation, acceptable indoor air quality, building operation, or adopted mechanical and building-code requirements.",
    evidence: [
      "Applicable edition and adoption record",
      "Occupancy and space classification",
      "Outdoor-air and system calculations",
      "Design and balancing records",
      "Operation and maintenance evidence",
      "Sensor and control records",
      "Exception, override, and change history",
      "Measured environmental outcome",
    ],
    applicabilityQuestions: [
      "Which edition is controlling through code, contract, design basis, or voluntary adoption?",
      "Which occupancy, space, system, and ventilation procedure applies?",
      "Do field conditions and operation correspond to the design assumptions?",
      "What evidence establishes actual indoor environmental protection after occupancy and change?",
    ],
    limits: "A standard may be voluntary or become enforceable through adoption, contract, permit, or another authority. The adopted edition and local amendments control.",
    route: "TA-14 Ventilation and Indoor Environmental Integrity Route",
    href: "/governance-library/standards",
  },
  {
    id: "iso-14001",
    name: "ISO 14001",
    family: "Environmental management-system standard",
    status: "Supporting Authority",
    domain: ["Environmental Integrity", "Law & Standards"],
    jurisdictions: ["Global", "United States", "European Union", "Canada", "Other"],
    roles: ["Facility owner or operator", "Regulated entity", "Environmental reviewer", "Executive or governing body"],
    systems: ["Environmental management system", "Industrial process or pollution control", "Environmental remediation"],
    sectors: ["Industrial and manufacturing", "Energy and utilities", "Built environment", "Public infrastructure"],
    consequenceLevels: ["Medium", "High"],
    adoptionPaths: ["Voluntary standard", "Contractual requirement"],
    why: "The profile includes an organizational environmental-management system, operational controls, compliance obligations, objectives, monitoring, audit, corrective action, and continual improvement.",
    evidence: [
      "Management-system scope",
      "Environmental aspects and impacts register",
      "Compliance-obligation register",
      "Operational control records",
      "Monitoring and measurement evidence",
      "Internal audit and management review",
      "Nonconformity and corrective-action record",
      "Environmental performance and outcome evidence",
    ],
    applicabilityQuestions: [
      "Was the standard voluntarily adopted, contractually required, or used for certification?",
      "What organizational and facility boundary does the management system cover?",
      "Which legal and other obligations were identified and kept current?",
      "Does management-system conformity correspond to actual environmental outcomes at the relevant facility and time?",
    ],
    limits: "Management-system conformity does not independently prove compliance with every applicable law or the validity of a specific environmental claim.",
    route: "TA-14 Environmental Management System Route",
    href: "/governance-library/standards",
  },
  {
    id: "eu-ai-act",
    name: "EU AI Act",
    family: "Binding AI regulation",
    status: "Likely Applicable",
    domain: ["AI Governance", "Law & Standards"],
    jurisdictions: ["European Union", "Global"],
    roles: ["AI provider", "AI deployer", "Importer or distributor", "Product manufacturer", "Executive or governing body"],
    systems: ["High-risk AI system", "General-purpose AI", "AI transparency use case", "Automated consequential decision"],
    sectors: ["General enterprise", "Healthcare", "Employment", "Financial services", "Education", "Public infrastructure"],
    consequenceLevels: ["Medium", "High", "Critical"],
    adoptionPaths: ["Statute or regulation"],
    why: "The selected profile involves an AI role, system, market, or affected person connected to the European Union. Classification, role, placing on the market, putting into service, use context, and prohibited or high-risk status require direct review.",
    evidence: [
      "Role and economic-operator record",
      "System classification and intended purpose",
      "Risk-management and data-governance records",
      "Technical documentation and logging",
      "Human oversight and performance evidence",
      "Transparency and affected-person information",
      "Post-market monitoring and incident record",
      "Change, version, and substantial-modification record",
    ],
    applicabilityQuestions: [
      "What role does the entity perform and where is the system placed, used, or its output relied upon?",
      "Is the system prohibited, high-risk, transparency-regulated, general-purpose, or outside those categories?",
      "Which system version, intended purpose, affected population, and deployment context are in scope?",
      "What obligations apply before deployment, during operation, after material change, and after an incident?",
    ],
    limits: "Applicability and obligations depend on role, classification, timing, implementing measures, harmonized standards, and the actual use context.",
    route: "TA-14 EU AI Act Applicability Route",
    href: "/governance-library/laws",
  },
  {
    id: "iso-42001",
    name: "ISO/IEC 42001",
    family: "AI management-system standard",
    status: "Supporting Authority",
    domain: ["AI Governance", "Law & Standards"],
    jurisdictions: ["Global", "United States", "European Union", "Canada", "Other"],
    roles: ["AI provider", "AI deployer", "Executive or governing body", "Environmental reviewer"],
    systems: ["High-risk AI system", "General-purpose AI", "Automated consequential decision", "AI management system"],
    sectors: ["General enterprise", "Healthcare", "Employment", "Financial services", "Education", "Public infrastructure"],
    consequenceLevels: ["Medium", "High", "Critical"],
    adoptionPaths: ["Voluntary standard", "Contractual requirement"],
    why: "The organization develops, provides, or uses AI and may require a formal management system with governance roles, risk controls, monitoring, review, and continual improvement.",
    evidence: [
      "Management-system scope",
      "AI policy and objectives",
      "Roles and accountability",
      "Risk and impact assessment",
      "Operational controls and supplier controls",
      "Performance evaluation and monitoring",
      "Internal audit and management review",
      "Corrective action and improvement record",
    ],
    applicabilityQuestions: [
      "Was the standard voluntarily adopted, contractually required, or used for certification?",
      "Which entity, products, services, locations, and lifecycle activities are inside the management-system scope?",
      "Which controls are applicable and what evidence supports implementation?",
      "Does management-system conformity correspond to the specific AI execution being relied upon?",
    ],
    limits: "Management-system conformity does not independently prove that a specific AI action was authorized, evidence-supported, admissible, and correctly executed.",
    route: "TA-14 AI Management System Applicability Route",
    href: "/governance-library/standards",
  },
  {
    id: "nist-ai-rmf",
    name: "NIST AI Risk Management Framework",
    family: "Voluntary AI risk framework",
    status: "Supporting Authority",
    domain: ["AI Governance", "Law & Standards"],
    jurisdictions: ["United States", "Global", "Other"],
    roles: ["AI provider", "AI deployer", "Executive or governing body", "Government or public authority"],
    systems: ["High-risk AI system", "General-purpose AI", "Automated consequential decision", "AI management system"],
    sectors: ["General enterprise", "Healthcare", "Employment", "Financial services", "Education", "Public infrastructure"],
    consequenceLevels: ["Medium", "High", "Critical"],
    adoptionPaths: ["Voluntary framework", "Contractual requirement", "Organizational policy"],
    why: "The profile requires structured governance, context mapping, measurement, and management of AI risks across the lifecycle.",
    evidence: [
      "Governance role and policy record",
      "Context and impact mapping",
      "Risk and trustworthiness criteria",
      "Testing, validation, and measurement results",
      "Risk treatment and acceptance record",
      "Monitoring and incident evidence",
      "Change and version record",
      "Outcome and affected-party evidence",
    ],
    applicabilityQuestions: [
      "Was the framework adopted by policy, contract, procurement, regulation, or voluntary commitment?",
      "Which AI system, lifecycle stage, risk, and affected group are in scope?",
      "Which profile, playbook, measurement method, and acceptance criteria are being used?",
      "How is the risk conclusion bound to an actual execution decision?",
    ],
    limits: "A voluntary risk framework supports governance but is not self-executing legal authority and does not independently authorize consequential action.",
    route: "TA-14 AI Risk and Execution Applicability Route",
    href: "/governance-library/frameworks",
  },
  {
    id: "who-air-quality",
    name: "WHO Global Air Quality Guidelines",
    family: "International public-health guidance",
    status: "Supporting Authority",
    domain: ["Environmental Integrity", "Law & Standards"],
    jurisdictions: ["Global", "United States", "European Union", "Canada", "Other"],
    roles: ["Government or public authority", "Environmental reviewer", "Facility owner or operator", "Designer or engineer"],
    systems: ["Air emissions or atmospheric monitoring", "Building and indoor environmental conditions", "Environmental management system"],
    sectors: ["Public infrastructure", "Built environment", "Healthcare", "Education", "Industrial and manufacturing"],
    consequenceLevels: ["Medium", "High", "Critical"],
    adoptionPaths: ["Guidance", "Organizational policy", "Public-health recommendation"],
    why: "The profile involves air-quality policy, health-protective benchmarks, atmospheric measurement, exposure reduction, or public-health planning.",
    evidence: [
      "Guideline edition and pollutant mapping",
      "Measurement method and quality assurance",
      "Population and exposure context",
      "Temporal averaging and exceedance record",
      "Source and intervention evidence",
      "Policy or organizational adoption record",
      "Health-protection rationale",
      "Outcome and trend evidence",
    ],
    applicabilityQuestions: [
      "Is the guideline being used as non-binding health guidance, policy support, contract criteria, or adopted law?",
      "Which pollutant, averaging period, population, and exposure context are relevant?",
      "How does the measurement method correspond to the guideline basis?",
      "What legal or organizational authority converts the guidance into an actual duty or action threshold?",
    ],
    limits: "WHO guidelines are health guidance unless adopted or otherwise made operative through a competent authority. They do not independently create legal obligations.",
    route: "TA-14 Public-Health Air Guidance Applicability Route",
    href: "/governance-library/frameworks",
  },
  {
    id: "ta14-aea",
    name: "TA-14 Admissible Execution Architecture",
    family: "Institutional governance architecture",
    status: "Supporting Authority",
    domain: ["AI Governance", "Environmental Integrity", "Law & Standards"],
    jurisdictions: ["Global", "United States", "European Union", "Canada", "Other"],
    roles: ["AI provider", "AI deployer", "Facility owner or operator", "Environmental reviewer", "Executive or governing body", "Government or public authority"],
    systems: ["High-risk AI system", "Automated consequential decision", "Air emissions or atmospheric monitoring", "Building and indoor environmental conditions", "Environmental remediation", "HVAC design, operation, or maintenance"],
    sectors: ["General enterprise", "Healthcare", "Employment", "Financial services", "Education", "Built environment", "Industrial and manufacturing", "Public infrastructure"],
    consequenceLevels: ["Medium", "High", "Critical"],
    adoptionPaths: ["Institutional architecture", "Contractual requirement", "Organizational policy"],
    why: "The selected activity requires a preserved route from reality and evidence through authority, admissibility, commitment, execution or intervention, and verified outcome.",
    evidence: [
      "Reality and proposed-action declaration",
      "Record identity and continuity package",
      "Admitted evidence and excluded evidence",
      "Authority and applicability determination",
      "Bounded ALLOW, HOLD, DENY, or ESCALATE determination",
      "Committed execution or intervention record",
      "Technical effect and outcome evidence",
      "Integrity, verification, limitation, and future-reliance package",
    ],
    applicabilityQuestions: [
      "What consequence is proposed and which authority can permit, restrict, or prohibit it?",
      "Which evidence is admissible for the bounded proposition and which evidence is excluded?",
      "What determination must be committed before the execution boundary is crossed?",
      "What outcome evidence must return to the record before success or reliance may be claimed?",
    ],
    limits: "TA-14 is not a legislature, regulator, court, or accredited certification body. The architecture preserves and governs reliance on applicable authority; it does not manufacture authority that does not exist.",
    route: "TA-14 Institutional Applicability and Admissible Execution Route",
    href: "/workspace/ai-governance",
  },
];

const fieldOptions = {
  jurisdiction: ["United States", "European Union", "Canada", "Global", "Other"],
  role: [
    "Facility owner or operator",
    "Regulated entity",
    "Environmental reviewer",
    "Designer or engineer",
    "Commissioning or testing provider",
    "Government or public authority",
    "AI provider",
    "AI deployer",
    "Importer or distributor",
    "Product manufacturer",
    "Executive or governing body",
  ],
  systemOrActivity: [
    "Air emissions or atmospheric monitoring",
    "Building and indoor environmental conditions",
    "HVAC design, operation, or maintenance",
    "Water discharge, sampling, or treatment",
    "Drinking water supply or treatment",
    "Waste generation, storage, transport, or disposal",
    "Environmental remediation",
    "Industrial process or pollution control",
    "Environmental management system",
    "High-risk AI system",
    "General-purpose AI",
    "AI transparency use case",
    "Automated consequential decision",
    "AI management system",
  ],
  sector: [
    "Built environment",
    "Industrial and manufacturing",
    "Energy and utilities",
    "Water and wastewater",
    "Waste management",
    "Healthcare",
    "Education",
    "Employment",
    "Financial services",
    "Commercial facilities",
    "Public infrastructure",
    "Real estate and development",
    "General enterprise",
  ],
  consequence: ["Low", "Medium", "High", "Critical"],
  evidenceType: [
    "Measurement and monitoring records",
    "Sampling and laboratory records",
    "Permit, compliance, or inspection records",
    "Design, commissioning, or maintenance records",
    "AI technical and governance records",
    "Management-system records",
    "Mixed evidence package",
  ],
  adoptionPath: [
    "Statute or regulation",
    "Adopted code",
    "Voluntary standard",
    "Voluntary framework",
    "Contractual requirement",
    "Organizational policy",
    "Guidance",
    "Public-health recommendation",
    "Institutional architecture",
  ],
};

function scoreAuthority(authority: AuthorityResult, profile: DeterminationProfile) {
  let score = 0;
  if (authority.domain.includes(profile.domain)) score += 4;
  if (authority.jurisdictions.includes(profile.jurisdiction)) score += 4;
  if (authority.roles.includes(profile.role)) score += 3;
  if (authority.systems.includes(profile.systemOrActivity)) score += 5;
  if (authority.sectors.includes(profile.sector)) score += 2;
  if (authority.consequenceLevels.includes(profile.consequence)) score += 2;
  if (authority.adoptionPaths.includes(profile.adoptionPath)) score += 3;
  return score;
}

function statusClass(status: ApplicabilityStatus) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function ApplicabilityPage() {
  const [profile, setProfile] = useState<DeterminationProfile>(initialProfile);
  const [selectedId, setSelectedId] = useState("clean-air-act");

  const ranked = useMemo(() => {
    return authorityCatalog
      .map((authority) => ({ authority, score: scoreAuthority(authority, profile) }))
      .sort((a, b) => b.score - a.score)
      .map(({ authority, score }, index) => ({
        ...authority,
        computedStatus:
          score >= 15
            ? "Likely Applicable"
            : score >= 9
              ? "Review Required"
              : index < 6
                ? "Supporting Authority"
                : "Outside Current Scope",
        score,
      }));
  }, [profile]);

  const selected = ranked.find((item) => item.id === selectedId) ?? ranked[0];
  const active = ranked.filter((item) => item.computedStatus !== "Outside Current Scope");

  function update<K extends keyof DeterminationProfile>(key: K, value: DeterminationProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  return (
    <main className="page">
      <div className="background" aria-hidden="true"><i/><i/><i/><i/></div>
      <div className="shell">
        <header className="topbar">
          <Link href="/governance-library">← Governance Library</Link>
          <span>TA-14 Institutional Applicability Determination</span>
          <Link href="/governance-library/authorities">Governing Authorities →</Link>
        </header>

        <section className="hero">
          <div className="seal"><span>AP</span><small>TA-14</small></div>
          <p className="eyebrow">AUTHORITY · JURISDICTION · ROLE · ACTIVITY · EVIDENCE · CONSEQUENCE</p>
          <h1>Determine what may apply <em>before governance claims become execution.</em></h1>
          <p className="lead">This workspace does not declare legal compliance. It guides a bounded applicability review across AI governance, Environmental Integrity Governance, law, regulation, standards, codes, guidance, contracts, and TA-14 institutional routes.</p>
          <div className="metrics">
            <article><strong>{authorityCatalog.length}</strong><span>Authority records</span></article>
            <article><strong>{active.length}</strong><span>Current matches</span></article>
            <article><strong>03</strong><span>Institutional domains</span></article>
            <article><strong>08</strong><span>Resolution stages</span></article>
          </div>
        </section>

        <section className="workspace">
          <aside className="profilePanel">
            <p className="eyebrow">APPLICABILITY PROFILE</p>
            <h2>Describe the actual governed situation.</h2>
            <p>Applicability cannot be resolved from the name of a law or standard alone. Preserve the domain, jurisdiction, role, activity, sector, consequence, evidence, and adoption pathway.</p>

            <label>Institutional domain
              <select value={profile.domain} onChange={(event) => update("domain", event.target.value as Domain)}>
                <option>AI Governance</option><option>Environmental Integrity</option><option>Law & Standards</option>
              </select>
            </label>
            {(Object.keys(fieldOptions) as Array<keyof typeof fieldOptions>).map((key) => (
              <label key={key}>{key.replace(/([A-Z])/g, " $1")}
                <select value={profile[key]} onChange={(event) => update(key as keyof DeterminationProfile, event.target.value as never)}>
                  {fieldOptions[key].map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
            ))}

            <div className="profileSummary">
              <span>PROFILE BOUNDARY</span>
              <strong>{profile.domain}</strong>
              <p>{profile.role} · {profile.jurisdiction} · {profile.systemOrActivity} · {profile.consequence} consequence</p>
            </div>
          </aside>

          <section className="resultsPanel">
            <div className="resultsHeading">
              <div><p className="eyebrow">RANKED AUTHORITY RESULTS</p><h2>Potentially applicable instruments and supporting authorities</h2></div>
              <span>{active.length} active results</span>
            </div>

            <div className="resultLayout">
              <div className="resultIndex">
                {ranked.map((item, index) => (
                  <button key={item.id} className={selected.id === item.id ? "active" : ""} onClick={() => setSelectedId(item.id)}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div><small>{item.family}</small><strong>{item.name}</strong><em>{item.score} relevance points</em></div>
                    <i className={statusClass(item.computedStatus)}>{item.computedStatus}</i>
                  </button>
                ))}
              </div>

              <article className="resultDetail">
                <div className="detailHeader">
                  <div><p>{selected.family}</p><h3>{selected.name}</h3></div>
                  <span className={statusClass(selected.computedStatus)}>{selected.computedStatus}</span>
                </div>

                <div className="authorityStrip">
                  <div><span>Domain</span><strong>{selected.domain.join(" · ")}</strong></div>
                  <div><span>Route</span><strong>{selected.route}</strong></div>
                  <div><span>Relevance</span><strong>{selected.score} / 23</strong></div>
                </div>

                <section className="whyCard"><span>WHY THIS APPEARS</span><p>{selected.why}</p></section>

                <div className="detailGrid">
                  <section><span>APPLICABILITY QUESTIONS</span>{selected.applicabilityQuestions.map((question, index) => <div key={question}><b>{String(index + 1).padStart(2, "0")}</b><p>{question}</p></div>)}</section>
                  <section><span>EVIDENCE TO PRESERVE</span>{selected.evidence.map((item, index) => <div key={item}><b>{String(index + 1).padStart(2, "0")}</b><p>{item}</p></div>)}</section>
                </div>

                <section className="limitCard"><span>LIMIT OF THIS RESULT</span><p>{selected.limits}</p></section>

                <div className="actions">
                  <Link href={selected.href}>Open source library →</Link>
                  <Link href="/governance-library/crosswalks">Open authority crosswalk →</Link>
                  <Link className="primary" href="/workspace/entity-review">Begin guided review →</Link>
                </div>
              </article>
            </div>
          </section>
        </section>

        <section className="sequence">
          <div><p className="eyebrow">THE TA-14 APPLICABILITY SEQUENCE</p><h2>Applicability is a governed determination, not a keyword match.</h2></div>
          <div className="sequenceGrid">
            {[
              ["01", "Identify", "Identify the real entity, facility, system, activity, product, instrument, place, and responsible role."],
              ["02", "Classify", "Classify the law, regulation, standard, code, framework, guidance, contract, or institutional architecture."],
              ["03", "Locate", "Resolve jurisdiction, market, site, affected person, receiving environment, and competent authority."],
              ["04", "Version", "Preserve the controlling edition, effective date, amendment, adoption, permit, contract, and local modification."],
              ["05", "Scope", "Determine whether the actual role, activity, threshold, system, source, or consequence falls within scope."],
              ["06", "Evidence", "Preserve the evidence required to support applicability, exemptions, exclusions, and the governed proposition."],
              ["07", "Determine", "Commit a bounded applicability finding: applicable, conditional, review required, supporting, or outside scope."],
              ["08", "Revalidate", "Reassess after material change, new evidence, a new version, a new jurisdiction, or a changed consequence."],
            ].map(([code, title, text]) => <article key={code}><span>{code}</span><strong>{title}</strong><p>{text}</p></article>)}
          </div>
        </section>

        <section className="boundary">
          <div className="seal small"><span>AB</span><small>Boundary</small></div>
          <p className="eyebrow gold">INSTITUTIONAL APPLICABILITY BOUNDARY</p>
          <h2>A preliminary result is not legal advice, regulatory approval, certification, or permission to execute.</h2>
          <p>The workspace helps assemble the questions, authorities, evidence, versions, and boundaries required for competent review. Final applicability may require regulators, counsel, qualified technical professionals, adopted codes, permit authorities, accredited bodies, or other competent decision-makers.</p>
          <div className="boundaryGrid">
            <article><span>THE SYSTEM PROVIDES</span><strong>Structured applicability triage, authority mapping, evidence orientation, and governed review entry</strong></article>
            <article><span>THE SYSTEM DOES NOT PROVIDE</span><strong>Automatic compliance, legal advice, certification, regulatory approval, or fabricated authority</strong></article>
            <article><span>EXECUTION REQUIRES</span><strong>Current authority, admissible evidence, bounded determination, preserved commitment, and verified outcome</strong></article>
          </div>
        </section>
      </div>

      <style jsx>{`
        :global(*){box-sizing:border-box}:global(html){background:#020812;scroll-behavior:smooth}:global(body){margin:0;background:#020812;color:#f5fbff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}:global(a){color:inherit}.page{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 50% -10%,rgba(49,157,208,.16),transparent 32%),linear-gradient(180deg,#04111d,#020812 52%,#01050a)}.background{position:fixed;inset:0;pointer-events:none;opacity:.18;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:52px 52px}.background i{position:absolute;width:520px;height:520px;border-radius:50%;filter:blur(100px);background:#0a8ea9;opacity:.12}.background i:nth-child(1){left:-240px;top:10%}.background i:nth-child(2){right:-250px;top:30%;background:#b97b1d}.background i:nth-child(3){left:35%;top:65%;background:#3d5ed2}.background i:nth-child(4){right:18%;top:85%;background:#5cae74}.shell{width:min(1500px,calc(100% - 36px));margin:auto;position:relative;z-index:2;padding-bottom:90px}.topbar{min-height:72px;padding:11px 14px;display:grid;grid-template-columns:1fr auto 1fr;gap:20px;align-items:center;border-bottom:1px solid rgba(120,220,239,.16)}.topbar a{font-size:10px;font-weight:900;text-decoration:none;color:#b8ccd5}.topbar a:last-child{text-align:right}.topbar span{color:#6f9dab;font-size:9px;font-weight:950;letter-spacing:.14em;text-transform:uppercase}.hero{max-width:1150px;margin:auto;padding:85px 0 75px;text-align:center}.seal{width:108px;height:108px;margin:0 auto 24px;display:grid;place-items:center;align-content:center;border-radius:50%;border:1px solid rgba(255,205,100,.42);background:radial-gradient(circle,rgba(255,208,98,.14),rgba(4,20,32,.96));box-shadow:0 0 60px rgba(255,185,55,.1)}.seal span{font:900 31px Georgia,serif;color:#ffe49f}.seal small{color:#718995;font-size:8px;letter-spacing:.16em}.seal.small{width:82px;height:82px}.eyebrow{margin:0;color:#6fe4f5;font-size:10px;font-weight:950;letter-spacing:.22em;text-transform:uppercase}.eyebrow.gold{color:#e9ba5f}.hero h1,.profilePanel h2,.resultsHeading h2,.sequence h2,.boundary h2{font-family:Georgia,"Times New Roman",serif;letter-spacing:-.045em}.hero h1{margin:15px 0 0;font-size:clamp(52px,6.4vw,92px);line-height:.95}.hero h1 em{display:block;color:#ffc94f;font-weight:500}.lead{max-width:970px;margin:26px auto 0;color:#afc2ca;font-size:18px;line-height:1.75}.metrics{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:34px}.metrics article{padding:18px;border:1px solid rgba(255,255,255,.07);border-radius:16px;background:rgba(8,25,38,.66)}.metrics strong{display:block;color:#efd28e;font:700 28px Georgia,serif}.metrics span{display:block;margin-top:5px;color:#728b96;font-size:8px;font-weight:900;text-transform:uppercase}.workspace{display:grid;grid-template-columns:390px 1fr;gap:18px;align-items:start}.profilePanel,.resultsPanel{border:1px solid rgba(105,218,237,.14);border-radius:25px;background:linear-gradient(145deg,rgba(8,31,44,.96),rgba(3,14,23,.98));box-shadow:0 26px 70px rgba(0,0,0,.25)}.profilePanel{position:sticky;top:18px;padding:24px}.profilePanel h2{margin:11px 0 13px;font-size:34px}.profilePanel>p:not(.eyebrow){color:#8fa8b2;font-size:12px;line-height:1.62}.profilePanel label{display:grid;gap:7px;margin-top:13px;color:#6f98a7;font-size:8px;font-weight:900;text-transform:uppercase}.profilePanel select{width:100%;min-height:45px;padding:0 12px;border:1px solid rgba(255,255,255,.1);border-radius:10px;color:#e9f5f8;background:#071722}.profileSummary{margin-top:20px;padding:16px;border:1px solid rgba(255,202,82,.18);border-radius:14px;background:rgba(255,197,74,.04)}.profileSummary span{color:#d8a94e;font-size:8px;font-weight:950}.profileSummary strong{display:block;margin-top:7px;font:700 19px Georgia,serif}.profileSummary p{margin:6px 0 0;color:#8ea5ae;font-size:10px;line-height:1.5}.resultsPanel{padding:22px}.resultsHeading{display:flex;align-items:end;justify-content:space-between;gap:20px;padding:4px 3px 20px}.resultsHeading h2{max-width:760px;margin:10px 0 0;font-size:43px;line-height:1}.resultsHeading>span{padding:9px 12px;border-radius:999px;background:rgba(104,225,244,.08);color:#6dd8ea;font-size:9px;font-weight:900}.resultLayout{display:grid;grid-template-columns:340px 1fr;gap:14px}.resultIndex{display:grid;gap:8px;align-content:start}.resultIndex button{width:100%;padding:13px;display:grid;grid-template-columns:38px 1fr;gap:10px;border:1px solid rgba(255,255,255,.06);border-radius:13px;color:inherit;background:rgba(0,0,0,.16);text-align:left;cursor:pointer}.resultIndex button:hover,.resultIndex button.active{border-color:rgba(105,226,244,.32);background:rgba(105,226,244,.05)}.resultIndex button>span{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(105,226,244,.15);border-radius:9px;color:#67d6e8;font-size:8px}.resultIndex small,.resultIndex strong,.resultIndex em{display:block}.resultIndex small{color:#6f8791;font-size:7px;text-transform:uppercase}.resultIndex strong{margin-top:4px;font-size:11px}.resultIndex em{margin-top:4px;color:#617983;font-size:8px;font-style:normal}.resultIndex i{grid-column:1/3;width:max-content;padding:5px 8px;border-radius:999px;font-size:7px;font-style:normal;font-weight:900;text-transform:uppercase}.likely-applicable{color:#7df0bb;background:rgba(74,223,158,.1)}.review-required{color:#ffd26c;background:rgba(255,197,72,.1)}.supporting-authority{color:#75dff1;background:rgba(92,205,235,.1)}.outside-current-scope{color:#7c8b92;background:rgba(255,255,255,.04)}.resultDetail{padding:24px;border:1px solid rgba(255,255,255,.07);border-radius:20px;background:rgba(0,0,0,.14)}.detailHeader{display:flex;justify-content:space-between;gap:18px}.detailHeader p{margin:0;color:#68d9ea;font-size:8px;font-weight:900;text-transform:uppercase}.detailHeader h3{margin:7px 0 0;font:700 42px/1 Georgia,serif}.detailHeader>span{height:max-content;padding:8px 11px;border-radius:999px;font-size:8px;font-weight:900;text-transform:uppercase}.authorityStrip{display:grid;grid-template-columns:1fr 1.5fr .6fr;gap:9px;margin-top:21px}.authorityStrip div,.whyCard,.detailGrid section,.limitCard{padding:16px;border:1px solid rgba(255,255,255,.07);border-radius:14px;background:rgba(255,255,255,.02)}.authorityStrip span,.whyCard span,.detailGrid section>span,.limitCard span{color:#64d8ea;font-size:7px;font-weight:900;text-transform:uppercase}.authorityStrip strong{display:block;margin-top:6px;font-size:10px}.whyCard,.limitCard{margin-top:12px}.whyCard p,.limitCard p{margin:8px 0 0;color:#a9bbc3;font-size:12px;line-height:1.65}.detailGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.detailGrid section>div{display:grid;grid-template-columns:30px 1fr;gap:9px;margin-top:10px}.detailGrid b{width:30px;height:30px;display:grid;place-items:center;border:1px solid rgba(105,225,242,.12);border-radius:8px;color:#64d7e8;font-size:7px}.detailGrid p{margin:5px 0 0;color:#97aeb7;font-size:10px;line-height:1.45}.limitCard{border-color:rgba(255,200,76,.18)}.limitCard span{color:#e8b756}.actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:14px}.actions a{min-height:42px;padding:0 13px;display:inline-flex;align-items:center;border:1px solid rgba(255,255,255,.1);border-radius:10px;text-decoration:none;color:#bdced5;background:rgba(0,0,0,.17);font-size:8px;font-weight:900;text-transform:uppercase}.actions .primary{color:#04181d;border-color:#9eecf7;background:linear-gradient(135deg,#d6fbff,#72dcec 65%,#39aac1)}.sequence{padding:100px 0}.sequence>div:first-child{max-width:930px}.sequence h2,.boundary h2{margin:12px 0 0;font-size:clamp(40px,4.8vw,68px);line-height:1}.sequenceGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;margin-top:32px}.sequenceGrid article{min-height:190px;padding:19px;border:1px solid rgba(105,223,240,.1);border-radius:17px;background:rgba(8,28,40,.72)}.sequenceGrid span{width:38px;height:38px;display:grid;place-items:center;border:1px solid rgba(255,201,83,.2);border-radius:50%;color:#ebc66e;font-size:8px}.sequenceGrid strong{display:block;margin-top:21px;font:700 19px Georgia,serif}.sequenceGrid p{margin:9px 0 0;color:#8099a4;font-size:10px;line-height:1.58}.boundary{padding:58px 34px;border:1px solid rgba(255,200,76,.22);border-radius:30px;background:rgba(8,21,32,.97);text-align:center}.boundary>p:not(.eyebrow){max-width:970px;margin:21px auto 0;color:#a4b6bd;font-size:15px;line-height:1.76}.boundaryGrid{max-width:1100px;margin:29px auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:11px}.boundaryGrid article{padding:20px;border:1px solid rgba(255,255,255,.07);border-radius:15px}.boundaryGrid span{color:#ddb257;font-size:8px;font-weight:900}.boundaryGrid strong{display:block;margin-top:9px;font-size:12px;line-height:1.45}@media(max-width:1120px){.workspace{grid-template-columns:1fr}.profilePanel{position:static}.resultLayout{grid-template-columns:1fr}.resultIndex{grid-template-columns:1fr 1fr}.sequenceGrid{grid-template-columns:1fr 1fr}}@media(max-width:760px){.shell{width:calc(100% - 22px)}.topbar{grid-template-columns:1fr 1fr}.topbar span{display:none}.hero{padding:64px 0}.hero h1{font-size:50px}.lead{font-size:15px}.metrics,.resultIndex,.authorityStrip,.detailGrid,.sequenceGrid,.boundaryGrid{grid-template-columns:1fr}.resultsHeading,.detailHeader{align-items:flex-start;flex-direction:column}.resultDetail{padding:18px}.detailHeader h3{font-size:34px}.actions{flex-direction:column}.actions a{width:100%;justify-content:center}.boundary{padding:42px 19px}}
      `}</style>
    </main>
  );
}
