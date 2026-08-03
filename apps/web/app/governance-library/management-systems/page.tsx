"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ManagementSystem = {
  title: string;
  shortName: string;
  category: string;
  status: string;
  authority: string;
  description: string;
  purpose: string;
  operatingModel: string[];
  evidence: string[];
  lifecycleCoverage: string[];
  governanceOutcome: string;
  record: string;
  crosswalk: string;
  accent: string;
};

const systems: ManagementSystem[] = [
  {
    title: "ISO/IEC 42001 Artificial Intelligence Management System",
    shortName: "ISO/IEC 42001 AIMS",
    category: "International Management System Standard",
    status: "Published",
    authority: "ISO and IEC",
    description:
      "A formal artificial intelligence management system standard for establishing, implementing, maintaining, and continually improving organizational AI governance.",
    purpose:
      "Provide a repeatable organizational system for managing AI responsibilities, risks, objectives, controls, documentation, performance evaluation, and continual improvement.",
    operatingModel: [
      "Organizational context and interested parties",
      "Leadership, policy, roles, and accountability",
      "Risk and opportunity planning",
      "Operational controls and lifecycle processes",
      "Performance evaluation and internal audit",
      "Corrective action and continual improvement",
    ],
    evidence: [
      "AI Management System Scope",
      "AI Policy",
      "Risk Treatment Plan",
      "Statement of Applicability",
      "Internal Audit Record",
      "Management Review Record",
    ],
    lifecycleCoverage: [
      "Planning",
      "Design",
      "Development",
      "Deployment",
      "Operation",
      "Retirement",
    ],
    governanceOutcome:
      "A documented and continually improving organizational AI management system.",
    record: "/governance-library/iso-iec-42001-2023",
    crosswalk: "/governance-library/crosswalks",
    accent: "42",
  },
  {
    title: "NIST Artificial Intelligence Risk Management Framework",
    shortName: "NIST AI RMF Governance Program",
    category: "Voluntary Risk Management Framework",
    status: "Published",
    authority: "National Institute of Standards and Technology",
    description:
      "An organizational AI risk management framework structured around the Govern, Map, Measure, and Manage functions.",
    purpose:
      "Help organizations incorporate trustworthiness considerations into the design, development, deployment, use, and evaluation of AI systems.",
    operatingModel: [
      "Govern organizational culture and accountability",
      "Map system context, impacts, and affected parties",
      "Measure risks, performance, and trustworthiness",
      "Manage prioritized risks and responses",
      "Document assumptions, limitations, and decisions",
      "Review outcomes and adapt governance practices",
    ],
    evidence: [
      "Governance Profile",
      "Context Map",
      "Risk Measurement Record",
      "Impact Assessment",
      "Risk Response Decision",
      "Monitoring Record",
    ],
    lifecycleCoverage: [
      "Governance",
      "Context Mapping",
      "Measurement",
      "Risk Treatment",
      "Monitoring",
      "Improvement",
    ],
    governanceOutcome:
      "A contextual and risk-informed program for managing trustworthy AI across organizational functions.",
    record: "/governance-library/nist-ai-rmf-1-0",
    crosswalk: "/governance-library/crosswalks",
    accent: "RMF",
  },
  {
    title: "TA-14 Admissible Execution Architecture",
    shortName: "TA-14 Admissible Execution",
    category: "Evidence-Bound Execution Governance",
    status: "Operational Architecture",
    authority: "TA-14 Authority",
    description:
      "An evidence-bound governance architecture for determining whether consequential AI execution is admissible before an action is committed.",
    purpose:
      "Connect governance requirements, authority, evidence, continuity, binding, execution control, and preserved outcomes within one governed operating sequence.",
    operatingModel: [
      "Establish reality through admissible evidence",
      "Preserve records and continuity",
      "Determine admissibility before execution",
      "Bind authority, conditions, and limitations",
      "Commit only authorized execution",
      "Preserve outcome evidence for review",
    ],
    evidence: [
      "Reality Record",
      "Continuity Record",
      "Admissibility Determination",
      "Binding Record",
      "Execution Receipt",
      "Outcome Record",
    ],
    lifecycleCoverage: [
      "Evidence Intake",
      "Applicability",
      "Admissibility",
      "Binding",
      "Execution",
      "Outcome",
    ],
    governanceOutcome:
      "Controlled execution supported by admissible evidence, preserved authority, and reviewable outcome proof.",
    record: "/governance-library",
    crosswalk: "/governance-library/crosswalks",
    accent: "TA",
  },
  {
    title: "OECD AI Governance Operating Model",
    shortName: "OECD Principles Operating Model",
    category: "International Policy Governance Model",
    status: "Active Guidance",
    authority: "Organisation for Economic Co-operation and Development",
    description:
      "A policy-oriented governance model grounded in inclusive growth, human-centered values, transparency, robustness, safety, security, and accountability.",
    purpose:
      "Translate international AI principles into organizational policies, responsibilities, lifecycle controls, and accountability practices.",
    operatingModel: [
      "Define responsible AI objectives",
      "Protect human rights and democratic values",
      "Establish transparency and explainability practices",
      "Manage robustness, safety, and security",
      "Assign accountability across organizational roles",
      "Review social and economic impacts",
    ],
    evidence: [
      "Responsible AI Policy",
      "Human Rights Assessment",
      "Transparency Record",
      "Safety Evaluation",
      "Accountability Matrix",
      "Impact Review",
    ],
    lifecycleCoverage: [
      "Policy",
      "Design",
      "Use",
      "Monitoring",
      "Accountability",
      "Review",
    ],
    governanceOutcome:
      "An organizational governance model aligned with internationally recognized responsible AI principles.",
    record: "/governance-library/principles",
    crosswalk: "/governance-library/crosswalks",
    accent: "OE",
  },
  {
    title: "EU AI Act Compliance Management System",
    shortName: "EU AI Act Compliance Program",
    category: "Regulatory Compliance Management",
    status: "Regulatory Implementation",
    authority: "European Union",
    description:
      "An organizational compliance structure for identifying AI system roles, risk classifications, obligations, controls, documentation, and post-market responsibilities.",
    purpose:
      "Operationalize provider, deployer, importer, distributor, and other regulated obligations across the AI system lifecycle.",
    operatingModel: [
      "Determine regulated role and territorial applicability",
      "Classify prohibited, high-risk, transparency, or other use",
      "Implement risk management and data governance",
      "Maintain technical documentation and records",
      "Establish human oversight and monitoring",
      "Manage incidents, corrective action, and reporting",
    ],
    evidence: [
      "Role Determination",
      "Risk Classification",
      "Technical Documentation",
      "Conformity Evidence",
      "Human Oversight Record",
      "Post-Market Monitoring Record",
    ],
    lifecycleCoverage: [
      "Applicability",
      "Classification",
      "Conformity",
      "Deployment",
      "Monitoring",
      "Incident Response",
    ],
    governanceOutcome:
      "A traceable compliance program connecting regulated obligations to organizational controls and evidence.",
    record: "/governance-library/laws",
    crosswalk: "/governance-library/crosswalks",
    accent: "EU",
  },
  {
    title: "Enterprise Responsible AI Governance Program",
    shortName: "Enterprise Responsible AI Program",
    category: "Organizational Governance Program",
    status: "Implementation Model",
    authority: "Enterprise Governance Authority",
    description:
      "A configurable enterprise operating model for coordinating policy, review, risk, assurance, legal, technical, and executive governance functions.",
    purpose:
      "Create a unified organizational structure for governing AI portfolios, use cases, systems, vendors, incidents, and lifecycle decisions.",
    operatingModel: [
      "Establish enterprise AI policy and governance council",
      "Maintain AI system and use-case inventory",
      "Route systems through risk-tiered review",
      "Coordinate legal, security, privacy, and assurance",
      "Monitor deployed systems and third parties",
      "Report governance performance to leadership",
    ],
    evidence: [
      "AI Inventory",
      "Use-Case Intake Record",
      "Risk Tier Decision",
      "Review Committee Decision",
      "Vendor Assessment",
      "Executive Governance Report",
    ],
    lifecycleCoverage: [
      "Intake",
      "Inventory",
      "Review",
      "Approval",
      "Monitoring",
      "Reporting",
    ],
    governanceOutcome:
      "An integrated enterprise program for consistent AI oversight, decision-making, and accountability.",
    record: "/governance-library/frameworks",
    crosswalk: "/governance-library/crosswalks",
    accent: "EG",
  },
  {
    title: "ISO 9001 Quality Management System",
    shortName: "ISO 9001 QMS",
    category: "International Management System Standard",
    status: "Published",
    authority: "International Organization for Standardization",
    description:
      "A quality management system model for controlling processes, responsibilities, documented information, performance evaluation, corrective action, and continual improvement.",
    purpose:
      "Provide a disciplined organizational structure for consistently meeting requirements, controlling process variation, addressing nonconformity, and improving performance.",
    operatingModel: [
      "Define organizational context and quality-system scope",
      "Assign leadership responsibilities and quality objectives",
      "Control operational processes and documented information",
      "Evaluate suppliers, resources, competence, and performance",
      "Audit the system and conduct management review",
      "Correct nonconformity and improve process effectiveness",
    ],
    evidence: [
      "Quality Management System Scope",
      "Process Map",
      "Quality Objectives",
      "Competence Record",
      "Internal Audit Record",
      "Corrective Action Record",
    ],
    lifecycleCoverage: [
      "Context",
      "Planning",
      "Operation",
      "Evaluation",
      "Correction",
      "Improvement",
    ],
    governanceOutcome:
      "A controlled quality system capable of demonstrating process ownership, conformity, correction, and improvement.",
    record: "/governance-library/standards",
    crosswalk: "/governance-library/crosswalks",
    accent: "Q9",
  },
  {
    title: "ISO 14001 Environmental Management System",
    shortName: "ISO 14001 EMS",
    category: "Environmental Management System Standard",
    status: "Published",
    authority: "International Organization for Standardization",
    description:
      "An environmental management system standard for identifying environmental aspects, obligations, risks, controls, objectives, performance, and improvement.",
    purpose:
      "Organize environmental responsibility so that impacts, compliance obligations, operational controls, emergency conditions, performance, and corrective action are governed as one system.",
    operatingModel: [
      "Identify environmental aspects and significant impacts",
      "Determine compliance obligations and interested parties",
      "Establish objectives, controls, and operational criteria",
      "Prepare for emergencies and abnormal operating conditions",
      "Monitor environmental performance and compliance status",
      "Correct failures and improve environmental outcomes",
    ],
    evidence: [
      "Environmental Aspects Register",
      "Compliance Obligations Register",
      "Operational Control Record",
      "Emergency Preparedness Record",
      "Environmental Monitoring Record",
      "Corrective Action Record",
    ],
    lifecycleCoverage: [
      "Aspects",
      "Obligations",
      "Controls",
      "Monitoring",
      "Review",
      "Improvement",
    ],
    governanceOutcome:
      "A repeatable environmental governance system that connects obligations, operating controls, measured conditions, and improvement.",
    record: "/governance-library/standards",
    crosswalk: "/governance-library/crosswalks",
    accent: "E14",
  },
  {
    title: "ISO 45001 Occupational Health and Safety Management System",
    shortName: "ISO 45001 OH&S",
    category: "Safety Management System Standard",
    status: "Published",
    authority: "International Organization for Standardization",
    description:
      "A management system for occupational health and safety hazards, worker participation, operational controls, incident response, performance evaluation, and improvement.",
    purpose:
      "Provide an accountable system for identifying hazards, reducing occupational risk, consulting workers, controlling operations, investigating incidents, and improving safety performance.",
    operatingModel: [
      "Determine OH&S context, scope, and worker needs",
      "Identify hazards and assess occupational risks",
      "Establish controls, competence, and participation",
      "Prepare for incidents and emergency conditions",
      "Evaluate performance, compliance, and effectiveness",
      "Investigate incidents and implement corrective action",
    ],
    evidence: [
      "Hazard Register",
      "Risk Assessment",
      "Worker Consultation Record",
      "Operational Control Procedure",
      "Incident Investigation",
      "Management Review Record",
    ],
    lifecycleCoverage: [
      "Hazard Identification",
      "Risk Assessment",
      "Control",
      "Incident Response",
      "Evaluation",
      "Improvement",
    ],
    governanceOutcome:
      "A governed health-and-safety system with traceable hazards, controls, participation, incidents, and corrective action.",
    record: "/governance-library/standards",
    crosswalk: "/governance-library/crosswalks",
    accent: "S45",
  },
  {
    title: "ISO/IEC 27001 Information Security Management System",
    shortName: "ISO/IEC 27001 ISMS",
    category: "Information Security Management System Standard",
    status: "Published",
    authority: "ISO and IEC",
    description:
      "An information security management system for governing confidentiality, integrity, availability, risk treatment, control selection, monitoring, and continual improvement.",
    purpose:
      "Establish a risk-based organizational system for protecting information assets, assigning security responsibilities, selecting controls, preserving evidence, and improving resilience.",
    operatingModel: [
      "Define information-security context and scope",
      "Assess information-security risks and opportunities",
      "Select controls and preserve applicability decisions",
      "Operate access, asset, supplier, and incident controls",
      "Monitor effectiveness and conduct internal audits",
      "Correct nonconformity and improve the ISMS",
    ],
    evidence: [
      "ISMS Scope",
      "Risk Assessment",
      "Risk Treatment Plan",
      "Statement of Applicability",
      "Security Incident Record",
      "Internal Audit Record",
    ],
    lifecycleCoverage: [
      "Scope",
      "Risk",
      "Treatment",
      "Operation",
      "Audit",
      "Improvement",
    ],
    governanceOutcome:
      "A risk-based information-security system with documented control selection, operation, monitoring, and correction.",
    record: "/governance-library/standards",
    crosswalk: "/governance-library/crosswalks",
    accent: "27",
  },
  {
    title: "ISO 22301 Business Continuity Management System",
    shortName: "ISO 22301 BCMS",
    category: "Business Continuity Management System Standard",
    status: "Published",
    authority: "International Organization for Standardization",
    description:
      "A management system for business-impact analysis, continuity strategy, incident response, recovery capability, exercises, review, and improvement.",
    purpose:
      "Govern organizational resilience by identifying critical activities, acceptable disruption, dependencies, recovery strategies, response structures, and tested continuity capability.",
    operatingModel: [
      "Identify critical products, services, and dependencies",
      "Conduct business-impact and continuity-risk analysis",
      "Define continuity and recovery strategies",
      "Establish incident command and communication",
      "Exercise, test, evaluate, and maintain capability",
      "Review disruption outcomes and improve resilience",
    ],
    evidence: [
      "Business Impact Analysis",
      "Continuity Risk Assessment",
      "Recovery Strategy",
      "Continuity Plan",
      "Exercise Record",
      "After-Action Review",
    ],
    lifecycleCoverage: [
      "Impact Analysis",
      "Strategy",
      "Planning",
      "Response",
      "Exercise",
      "Improvement",
    ],
    governanceOutcome:
      "A tested continuity system capable of preserving critical operations and recording recovery performance.",
    record: "/governance-library/standards",
    crosswalk: "/governance-library/crosswalks",
    accent: "BC",
  },
  {
    title: "ISO 31000 Enterprise Risk Management Guidance",
    shortName: "ISO 31000 Risk System",
    category: "Risk Management Guidance",
    status: "Published Guidance",
    authority: "International Organization for Standardization",
    description:
      "A principles-and-process model for integrating risk management into governance, strategy, planning, operations, reporting, values, and culture.",
    purpose:
      "Create a consistent organizational method for establishing context, identifying risk, analyzing consequences and likelihood, evaluating treatment options, and monitoring change.",
    operatingModel: [
      "Integrate risk management into governance and decisions",
      "Establish scope, context, and risk criteria",
      "Identify, analyze, and evaluate risk",
      "Select and implement risk treatment",
      "Communicate, consult, monitor, and review",
      "Record learning and improve the framework",
    ],
    evidence: [
      "Risk Framework",
      "Risk Criteria",
      "Risk Register",
      "Risk Treatment Plan",
      "Monitoring Record",
      "Risk Review Record",
    ],
    lifecycleCoverage: [
      "Integration",
      "Context",
      "Assessment",
      "Treatment",
      "Monitoring",
      "Improvement",
    ],
    governanceOutcome:
      "A common risk language and process capable of supporting consistent organizational decisions without substituting for legal authority or execution proof.",
    record: "/governance-library/risk-management",
    crosswalk: "/governance-library/crosswalks",
    accent: "31",
  },
  {
    title: "TA-14 Environmental Integrity Governance Management System",
    shortName: "Environmental Integrity Governance",
    category: "Environmental Governance Architecture",
    status: "Operational Architecture",
    authority: "TA-14 Authority",
    description:
      "An institutional governance architecture for converting environmental reality into bounded records, continuity, admissibility, governed intervention, execution, outcome, and future reliance.",
    purpose:
      "Connect physical conditions, qualified observation, professional authority, environmental records, intervention boundaries, outcome windows, and proof limitations within one governed system.",
    operatingModel: [
      "Declare place, activity, purpose, and consequence",
      "Qualify environmental and atmospheric evidence",
      "Preserve record continuity and method limitations",
      "Resolve authority, applicability, and intervention boundary",
      "Govern execution and professional handoff",
      "Preserve outcome and future-reliance boundaries",
    ],
    evidence: [
      "Atmospheric Integrity Record",
      "Environmental Reality Record",
      "Continuity Package",
      "Authority Resolution",
      "Intervention Record",
      "Outcome Record",
    ],
    lifecycleCoverage: [
      "Reality",
      "Record",
      "Continuity",
      "Admissibility",
      "Execution",
      "Outcome",
    ],
    governanceOutcome:
      "A bounded environmental governance system that preserves what was observed, authorized, changed, achieved, and left unresolved.",
    record: "/environmental-integrity-governance",
    crosswalk: "/governance-library/crosswalks",
    accent: "EI",
  },
  {
    title: "TA-14 Integrated Management and Execution Governance System",
    shortName: "Integrated Management + Execution",
    category: "Integrated Governance Architecture",
    status: "Institutional Model",
    authority: "TA-14 Authority",
    description:
      "A cross-system governance model that connects organizational management systems to event-level admissible execution without collapsing one into the other.",
    purpose:
      "Preserve the distinction between organizational assurance and consequential execution while enabling policies, controls, audits, authority, evidence, determinations, receipts, and outcomes to interoperate.",
    operatingModel: [
      "Map management-system obligations to operating controls",
      "Resolve applicable authority and current editions",
      "Bind organizational controls to event-level evidence",
      "Issue ALLOW, HOLD, DENY, or ESCALATE determinations",
      "Preserve execution and outcome artifacts",
      "Return failures and outcomes into corrective action",
    ],
    evidence: [
      "Integrated Scope Map",
      "Authority Crosswalk",
      "Control-to-Evidence Map",
      "Execution Determination",
      "Outcome Package",
      "Corrective Action Link",
    ],
    lifecycleCoverage: [
      "Management System",
      "Authority",
      "Evidence",
      "Determination",
      "Execution",
      "Improvement",
    ],
    governanceOutcome:
      "An integrated governance route in which organizational systems support execution decisions and execution outcomes strengthen organizational controls.",
    record: "/governance-library/crosswalks",
    crosswalk: "/governance-library/crosswalks",
    accent: "IX",
  },

];

const categories = [
  "All System Types",
  ...Array.from(new Set(systems.map((system) => system.category))),
];

const statuses = [
  "All Statuses",
  ...Array.from(new Set(systems.map((system) => system.status))),
];

export default function ManagementSystemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All System Types");
  const [activeStatus, setActiveStatus] = useState("All Statuses");
  const [expandedSystems, setExpandedSystems] = useState<string[]>([]);

  const visibleSystems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return systems.filter((system) => {
      const matchesCategory =
        activeCategory === "All System Types" ||
        system.category === activeCategory;

      const matchesStatus =
        activeStatus === "All Statuses" || system.status === activeStatus;

      const matchesSearch =
        query.length === 0 ||
        [
          system.title,
          system.shortName,
          system.category,
          system.status,
          system.authority,
          system.description,
          system.purpose,
          system.governanceOutcome,
          ...system.operatingModel,
          ...system.evidence,
          ...system.lifecycleCoverage,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesStatus && matchesSearch;
    });
  }, [activeCategory, activeStatus, searchQuery]);

  const totalEvidenceTypes = systems.reduce(
    (total, system) => total + system.evidence.length,
    0,
  );

  const totalOperatingControls = systems.reduce(
    (total, system) => total + system.operatingModel.length,
    0,
  );

  const activeFilterCount = [
    searchQuery.trim().length > 0,
    activeCategory !== "All System Types",
    activeStatus !== "All Statuses",
  ].filter(Boolean).length;

  function toggleSystem(title: string) {
    setExpandedSystems((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  }

  function clearFilters() {
    setSearchQuery("");
    setActiveCategory("All System Types");
    setActiveStatus("All Statuses");
  }

  return (
    <main className="managementSystemsPage">
      <div className="backgroundGrid" />
      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      <div className="pageShell">
        <div className="topbar">
          <Link href="/governance-library" className="topbarLink">
            ← Governance Library
          </Link>

          <div className="topbarStatus">
            <span />
            Management systems indexed
          </div>

          <Link
            href="/governance-library/crosswalks"
            className="topbarAction"
          >
            Open Crosswalks →
          </Link>
        </div>

        <header className="hero">
          <div className="heroSeal">
            <span>MS</span>
            <small>Management systems</small>
          </div>

          <p className="eyebrow">TA-14 AI GOVERNANCE LIBRARY</p>

          <h1>
            AI Management
            <span> Systems</span>
          </h1>

          <p className="lead">
            Explore the organizational systems, governance programs,
            regulatory operating models, and evidence structures used to
            manage artificial intelligence across policy, risk, lifecycle,
            assurance, execution, and continual improvement.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{systems.length}</span>
              <small>Systems indexed</small>
            </article>

            <article>
              <span>{categories.length - 1}</span>
              <small>System categories</small>
            </article>

            <article>
              <span>{totalOperatingControls}</span>
              <small>Operating controls</small>
            </article>

            <article>
              <span>{totalEvidenceTypes}</span>
              <small>Evidence types</small>
            </article>

            <article>
              <span>{visibleSystems.length}</span>
              <small>Systems shown</small>
            </article>
          </div>
        </header>

        <section className="definitionSection">
          <div className="definitionSeal">
            <span>OS</span>
            <small>Operating structure</small>
          </div>

          <div>
            <p className="eyebrow gold">MANAGEMENT SYSTEM PURPOSE</p>

            <h2>
              Governance becomes operational when responsibility, evidence,
              control, review, and improvement are organized into a repeatable
              system.
            </h2>
          </div>

          <p>
            An AI management system is more than a policy collection. It
            establishes how an organization assigns authority, identifies
            obligations, evaluates risk, approves systems, preserves records,
            monitors performance, responds to incidents, and improves its
            governance over time.
          </p>
        </section>

        <section className="controlSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">MANAGEMENT SYSTEM CONTROL DESK</p>

              <h2>
                Find the operating model that governs the organization behind
                the AI system.
              </h2>
            </div>

            <p>
              Search across standards, frameworks, regulatory programs,
              enterprise models, and evidence-bound execution architectures.
              Compare their scope, authority, operating controls, records, and
              governance outcomes.
            </p>
          </div>

          <div className="filterPanel">
            <label>
              Search management systems
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search ISO 42001, NIST AI RMF, evidence, audit, compliance..."
              />
            </label>

            <label>
              System type
              <select
                value={activeCategory}
                onChange={(event) => setActiveCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Status
              <select
                value={activeStatus}
                onChange={(event) => setActiveStatus(event.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          <div className="resultBar">
            <div>
              <span>{visibleSystems.length}</span>
              <small>Systems displayed</small>
            </div>

            <div>
              <span>{activeFilterCount}</span>
              <small>Active filters</small>
            </div>

            <div>
              <span>{expandedSystems.length}</span>
              <small>Systems expanded</small>
            </div>
          </div>
        </section>

        <section className="systemsSection">
          {visibleSystems.length > 0 ? (
            <div className="systemsGrid">
              {visibleSystems.map((system) => {
                const isExpanded = expandedSystems.includes(system.title);

                return (
                  <article key={system.title} className="systemCard">
                    <div className="cardHeader">
                      <div className="systemSeal">{system.accent}</div>

                      <div className="statusBadge">{system.status}</div>
                    </div>

                    <div className="systemMeta">
                      <span>{system.category}</span>
                      <strong>{system.authority}</strong>
                    </div>

                    <h2>{system.shortName}</h2>

                    <p className="fullTitle">{system.title}</p>

                    <p className="description">{system.description}</p>

                    <div className="purposeBlock">
                      <span>Management system purpose</span>
                      <p>{system.purpose}</p>
                    </div>

                    <div className="listHeading">
                      <span>Operating model</span>
                      <strong>{system.operatingModel.length} functions</strong>
                    </div>

                    <div className="operatingList">
                      {(isExpanded
                        ? system.operatingModel
                        : system.operatingModel.slice(0, 4)
                      ).map((item) => (
                        <div key={item}>
                          <span>◆</span>
                          <strong>{item}</strong>
                        </div>
                      ))}
                    </div>

                    {system.operatingModel.length > 4 ? (
                      <button
                        type="button"
                        className="expandButton"
                        onClick={() => toggleSystem(system.title)}
                      >
                        {isExpanded
                          ? "Show fewer functions"
                          : `Show ${
                              system.operatingModel.length - 4
                            } more functions`}
                      </button>
                    ) : null}

                    <div className="coverageBlock">
                      <span>Lifecycle coverage</span>

                      <div className="tagList">
                        {system.lifecycleCoverage.map((stage) => (
                          <strong key={stage}>{stage}</strong>
                        ))}
                      </div>
                    </div>

                    <div className="evidenceBlock">
                      <span>Expected management records</span>

                      <div className="evidenceGrid">
                        {system.evidence.map((record) => (
                          <div key={record}>
                            <span />
                            <strong>{record}</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="outcomeBlock">
                      <span>Governance outcome</span>
                      <strong>{system.governanceOutcome}</strong>
                    </div>

                    <div className="cardActions">
                      <Link href={system.record} className="primaryAction">
                        View Record →
                      </Link>

                      <Link href={system.crosswalk} className="secondaryAction">
                        Crosswalk
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="emptyState">
              <div className="emptySeal">0</div>

              <h2>No management systems match the current filters.</h2>

              <p>
                Reset the control desk or search for a broader organizational
                governance concept.
              </p>

              <button type="button" onClick={clearFilters}>
                Reset management system search
              </button>
            </div>
          )}
        </section>

        <section className="operatingSequence">
          <p className="eyebrow gold">
            AI MANAGEMENT SYSTEM OPERATING SEQUENCE
          </p>

          <h2>
            A governed organization must connect policy to execution and
            execution back to improvement.
          </h2>

          <div className="sequenceTrack">
            {[
              ["01", "Context", "Define scope, purpose, obligations, and affected parties."],
              ["02", "Leadership", "Assign policy, authority, ownership, and accountability."],
              ["03", "Planning", "Identify risk, objectives, controls, and evidence needs."],
              ["04", "Operation", "Apply governance across the AI lifecycle."],
              ["05", "Evaluation", "Monitor, audit, test, review, and challenge performance."],
              ["06", "Improvement", "Correct failures and strengthen the management system."],
            ].map(([number, title, description]) => (
              <article key={title}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="comparisonSection">
          <div className="comparisonSeal">
            <span>MX</span>
            <small>System comparison</small>
          </div>

          <p className="eyebrow gold">
            MANAGEMENT SYSTEM CROSSWALK BOUNDARY
          </p>

          <h2>
            Different systems may govern the same organization from different
            directions.
          </h2>

          <p>
            A management system standard may define organizational processes. A
            risk framework may structure assessment and treatment. A regulation
            may impose mandatory obligations. An execution architecture may
            determine whether a consequential action is permitted to proceed.
            Crosswalks reveal where these systems align, where they supplement
            one another, and where one system cannot substitute for another.
          </p>

          <div className="comparisonGrid">
            <article>
              <span>MANAGEMENT SYSTEM STANDARDS</span>
              <strong>
                Establish repeatable organizational governance, documentation,
                audit, review, and continual improvement.
              </strong>
            </article>

            <article>
              <span>RISK MANAGEMENT FRAMEWORKS</span>
              <strong>
                Structure contextual risk identification, measurement,
                prioritization, treatment, and monitoring.
              </strong>
            </article>

            <article>
              <span>REGULATORY PROGRAMS</span>
              <strong>
                Translate legal obligations into roles, controls,
                documentation, conformity, and reporting requirements.
              </strong>
            </article>

            <article>
              <span>EXECUTION GOVERNANCE</span>
              <strong>
                Binds evidence, authority, conditions, decisions, execution, and
                outcomes at the point of consequential action.
              </strong>
            </article>
          </div>

          <div className="comparisonActions">
            <Link
              href="/governance-library/crosswalks"
              className="primaryAction"
            >
              Open Crosswalks →
            </Link>

            <Link
              href="/governance-library/risk-management"
              className="secondaryAction"
            >
              Risk Management
            </Link>

            <Link
              href="/governance-library/assurance"
              className="secondaryAction"
            >
              Assurance
            </Link>

            <Link
              href="/governance-library/governed-records"
              className="secondaryAction"
            >
              Governed Records
            </Link>
          </div>
        </section>

        <section className="resolutionSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">INSTITUTIONAL RESOLUTION DESK</p>
              <h2>Management-system authority must be resolved before it is relied upon.</h2>
            </div>
            <p>
              Publication alone does not establish applicability. Each system must be inspected for edition,
              adoption, contractual incorporation, jurisdiction, organizational scope, certification status,
              supersession, transition, and the precise decision for which it is being invoked.
            </p>
          </div>

          <div className="resolutionGrid">
            {[
              ["01", "Identity", "Confirm the exact system, publisher, edition, amendment state, and official source."],
              ["02", "Authority", "Distinguish law, regulation, standard, guidance, contract, certification criteria, and internal policy."],
              ["03", "Applicability", "Resolve jurisdiction, role, sector, activity, system boundary, and triggering facts."],
              ["04", "Adoption", "Determine whether the system is voluntary, contractually required, incorporated, certified, or otherwise binding."],
              ["05", "Evidence", "Identify the records necessary to demonstrate operation rather than policy existence alone."],
              ["06", "Decision", "State what the management system supports, what remains unresolved, and what cannot proceed."],
              ["07", "Execution", "Connect applicable organizational controls to the bounded action under review."],
              ["08", "Outcome", "Return incidents, failures, audit findings, and measured outcomes into review and improvement."],
            ].map(([number, title, description]) => (
              <article key={title}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundaryIntro">
            <div className="definitionSeal">
              <span>BD</span>
              <small>System boundary</small>
            </div>
            <div>
              <p className="eyebrow gold">ORGANIZATIONAL ASSURANCE ≠ EVENT-LEVEL EXECUTION PROOF</p>
              <h2>A mature management system can govern the organization without proving that a specific consequential action was admissible.</h2>
            </div>
          </div>

          <div className="boundaryGrid">
            <article>
              <span>MANAGEMENT-SYSTEM EVIDENCE</span>
              <strong>Scope, policy, process ownership, risk treatment, competence, audits, management review, and corrective action.</strong>
              <p>Demonstrates that an organizational governance system was established and operated within a declared boundary.</p>
            </article>
            <article>
              <span>EXECUTION EVIDENCE</span>
              <strong>Proposed action, admitted evidence, current authority, determination, binding, commit state, execution receipt, and outcome.</strong>
              <p>Demonstrates what governed a particular action at the moment consequence was permitted to bind to reality.</p>
            </article>
            <article>
              <span>CERTIFICATION BOUNDARY</span>
              <strong>Certification may attest conformity to a management-system standard within a defined scope and period.</strong>
              <p>It does not automatically certify every AI model, decision, environmental condition, operational action, or future outcome.</p>
            </article>
            <article>
              <span>PROFESSIONAL BOUNDARY</span>
              <strong>Management systems do not replace licensed authority, clinical judgment, engineering responsibility, commissioning, or code enforcement.</strong>
              <p>Those authorities remain separately attributable and must be preserved within the governed route.</p>
            </article>
          </div>
        </section>

        <section className="failureSection">
          <p className="eyebrow gold">MANAGEMENT-SYSTEM FAILURE MODES</p>
          <h2>Common conditions that require HOLD, correction, or escalation.</h2>
          <div className="failureGrid">
            {[
              ["Scope mismatch", "The cited system or certificate does not cover the entity, facility, process, product, model, or action under review."],
              ["Edition drift", "A newer publication is assumed to control even though adoption, transition, contract, or regulatory incorporation is unresolved."],
              ["Paper compliance", "Policies and procedures exist, but operating evidence does not demonstrate that controls were performed."],
              ["Authority substitution", "A voluntary framework or internal policy is presented as though it were enacted legal authority."],
              ["Certification overclaim", "A scoped management-system certificate is treated as proof that a specific system or execution is safe, lawful, or correct."],
              ["Audit discontinuity", "Findings, corrective actions, exceptions, or management-review decisions cannot be traced through closure."],
              ["Control-to-event gap", "Organizational controls are documented but were not bound to the consequential action at commit time."],
              ["Outcome blindness", "The organization records approval or deployment but does not preserve whether the intervention achieved the declared outcome."],
            ].map(([title, description]) => (
              <article key={title}>
                <span>HOLD</span>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="academySection">
          <div>
            <p className="eyebrow">TA-14 ACADEMY · MANAGEMENT-SYSTEM LITERACY</p>
            <h2>Learn how to distinguish organizational governance, legal authority, certification, assurance, and admissible execution.</h2>
            <p>
              The Academy route teaches readers how to inspect scope, editions, adoption, evidence, auditability,
              control operation, event-level binding, outcomes, limitations, and defensible claims.
            </p>
          </div>
          <div className="academyActions">
            <Link href="/academy" className="primaryAction">Open TA-14 Academy →</Link>
            <Link href="/governance-library/applicability" className="secondaryAction">Resolve Applicability</Link>
            <Link href="/governance-library/authorities" className="secondaryAction">Inspect Authorities</Link>
            <Link href="/governance-library/governed-records" className="secondaryAction">Governed Records</Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .managementSystemsPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f4fbff;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(33, 154, 203, 0.18),
              transparent 36%
            ),
            radial-gradient(
              circle at 7% 44%,
              rgba(83, 225, 241, 0.06),
              transparent 26%
            ),
            radial-gradient(
              circle at 94% 74%,
              rgba(236, 180, 68, 0.06),
              transparent 28%
            ),
            linear-gradient(
              180deg,
              #04101b 0%,
              #020913 52%,
              #01060c 100%
            );
        }

        .backgroundGrid,
        .backgroundGlow {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .backgroundGrid {
          opacity: 0.16;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.018) 1px,
              transparent 1px
            );
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        .glowOne {
          background: radial-gradient(
            circle at 17% 20%,
            rgba(99, 230, 255, 0.07),
            transparent 26%
          );
        }

        .glowTwo {
          background: radial-gradient(
            circle at 84% 55%,
            rgba(255, 196, 79, 0.05),
            transparent 24%
          );
        }

        .pageShell {
          position: relative;
          z-index: 2;
          width: min(1480px, calc(100% - 40px));
          margin: auto;
          padding: 24px 0 90px;
        }

        .topbar {
          padding: 12px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 19px;
          background: linear-gradient(
            180deg,
            rgba(8, 26, 42, 0.88),
            rgba(4, 15, 26, 0.76)
          );
          box-shadow:
            0 16px 50px rgba(0, 0, 0, 0.28),
            inset 0 1px rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(18px);
        }

        .topbarLink,
        .topbarAction,
        .primaryAction,
        .secondaryAction {
          min-height: 44px;
          padding: 0 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition:
            transform 0.22s,
            border-color 0.22s,
            background 0.22s;
        }

        .topbarLink {
          justify-self: start;
          color: #c4d5de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarAction,
        .primaryAction {
          justify-self: end;
          color: #041a23;
          border: 1px solid #aaf2ff;
          background: linear-gradient(
            135deg,
            #d9fbff,
            #76deef 64%,
            #38aeca
          );
        }

        .secondaryAction {
          color: #c2d5dd;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topbarLink:hover,
        .topbarAction:hover,
        .primaryAction:hover,
        .secondaryAction:hover {
          transform: translateY(-2px);
        }

        .topbarStatus {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8fa9b6;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .topbarStatus span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #72e6b2;
          box-shadow: 0 0 15px rgba(114, 230, 178, 0.9);
        }

        .hero {
          max-width: 1160px;
          margin: auto;
          padding: 88px 0 72px;
          text-align: center;
        }

        .heroSeal,
        .definitionSeal,
        .comparisonSeal {
          width: 106px;
          height: 106px;
          margin: 0 auto 27px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 198, 82, 0.37);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 220, 146, 0.16),
              transparent 36%
            ),
            rgba(4, 18, 30, 0.96);
          box-shadow:
            0 0 60px rgba(255, 193, 64, 0.09),
            inset 0 0 28px rgba(255, 255, 255, 0.03);
        }

        .heroSeal span,
        .definitionSeal span,
        .comparisonSeal span {
          color: #ffe3a0;
          font: 900 30px Georgia, serif;
        }

        .heroSeal small,
        .definitionSeal small,
        .comparisonSeal small {
          color: #8199a4;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .eyebrow {
          margin: 0;
          color: #6fe8ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.21em;
          text-transform: uppercase;
        }

        .eyebrow.gold {
          color: #efbd59;
        }

        h1,
        h2 {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero h1 {
          margin: 15px auto 0;
          font-size: clamp(52px, 6.3vw, 90px);
          line-height: 0.94;
          letter-spacing: -0.055em;
        }

        .hero h1 span {
          display: block;
          color: #9fb4bf;
          font-style: italic;
          font-weight: 500;
        }

        .lead {
          max-width: 960px;
          margin: 27px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroMetrics {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .heroMetrics article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(6, 20, 32, 0.58);
        }

        .heroMetrics span {
          display: block;
          color: #f0d28f;
          font: 700 27px Georgia, serif;
        }

        .heroMetrics small {
          display: block;
          margin-top: 5px;
          color: #788f9a;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .definitionSection {
          padding: 34px;
          display: grid;
          grid-template-columns: auto 1.15fr 0.85fr;
          align-items: center;
          gap: 30px;
          border: 1px solid rgba(255, 198, 82, 0.17);
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 0 50%,
              rgba(255, 190, 59, 0.07),
              transparent 30%
            ),
            rgba(5, 18, 30, 0.78);
        }

        .definitionSeal {
          width: 82px;
          height: 82px;
          margin: 0;
        }

        .definitionSeal span {
          font-size: 23px;
        }

        .definitionSeal small {
          font-size: 6px;
        }

        .definitionSection h2 {
          margin: 10px 0 0;
          font-size: clamp(31px, 3.2vw, 48px);
          line-height: 1.02;
          letter-spacing: -0.04em;
        }

        .definitionSection > p {
          margin: 0;
          color: #9fb2bb;
          font-size: 14px;
          line-height: 1.75;
        }

        .controlSection {
          padding-top: 82px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading h2,
        .operatingSequence h2,
        .comparisonSection h2 {
          margin: 11px 0 0;
          font-size: clamp(38px, 4.3vw, 64px);
          line-height: 0.99;
          letter-spacing: -0.047em;
        }

        .sectionHeading > p {
          margin: 0;
          color: #98adb7;
          font-size: 15px;
          line-height: 1.75;
        }

        .filterPanel {
          padding: 19px;
          display: grid;
          grid-template-columns:
            minmax(260px, 1fr)
            minmax(210px, 0.55fr)
            minmax(180px, 0.42fr)
            auto;
          align-items: end;
          gap: 12px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 21px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.27);
        }

        label {
          display: grid;
          gap: 8px;
          color: #80a1af;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        input,
        select {
          width: 100%;
          min-height: 46px;
          box-sizing: border-box;
          padding: 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          outline: none;
          color: #e8f2f5;
          background: rgba(0, 0, 0, 0.2);
          font: inherit;
          text-transform: none;
        }

        select option {
          color: #e8f2f5;
          background: #06131f;
        }

        input:focus,
        select:focus {
          border-color: rgba(99, 230, 255, 0.42);
          box-shadow: 0 0 0 3px rgba(99, 230, 255, 0.06);
        }

        .filterPanel button,
        .emptyState button {
          min-height: 46px;
          padding: 0 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #b5c7cf;
          background: rgba(0, 0, 0, 0.19);
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .resultBar {
          margin-top: 12px;
          padding: 15px 17px;
          display: flex;
          align-items: center;
          gap: 28px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background: rgba(5, 18, 30, 0.66);
        }

        .resultBar > div {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .resultBar span {
          color: #efcc82;
          font: 700 23px Georgia, serif;
        }

        .resultBar small {
          color: #7c939e;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .systemsSection {
          padding-top: 27px;
        }

        .systemsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          align-items: start;
        }

        .systemCard {
          min-width: 0;
          padding: 23px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(99, 230, 255, 0.05),
              transparent 28%
            ),
            linear-gradient(
              145deg,
              rgba(9, 29, 44, 0.95),
              rgba(3, 13, 22, 0.98)
            );
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
        }

        .cardHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .systemSeal {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.3);
          border-radius: 50%;
          color: #f1ce83;
          background: rgba(255, 198, 82, 0.05);
          font: 700 14px Georgia, serif;
        }

        .statusBadge {
          padding: 7px 9px;
          border: 1px solid rgba(113, 229, 181, 0.16);
          border-radius: 999px;
          color: #8fe0ba;
          background: rgba(113, 229, 181, 0.04);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .systemMeta {
          margin-top: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .systemMeta span,
        .systemMeta strong {
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .systemMeta span {
          color: #70dce9;
        }

        .systemMeta strong {
          color: #b19a68;
          text-align: right;
        }

        .systemCard h2 {
          margin: 10px 0 0;
          color: #e6f0f3;
          font-size: 31px;
          line-height: 1.08;
        }

        .fullTitle {
          margin: 8px 0 0;
          color: #6f8a96;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .description {
          margin: 14px 0 0;
          color: #91a6b0;
          font-size: 13px;
          line-height: 1.65;
        }

        .purposeBlock,
        .coverageBlock,
        .evidenceBlock,
        .outcomeBlock {
          margin-top: 18px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .purposeBlock span,
        .coverageBlock > span,
        .evidenceBlock > span,
        .outcomeBlock span,
        .listHeading span {
          color: #6c8793;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .purposeBlock p {
          margin: 8px 0 0;
          color: #b7c6cc;
          font-size: 11px;
          line-height: 1.6;
        }

        .listHeading {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .listHeading strong {
          color: #d1ae67;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .operatingList {
          margin-top: 10px;
          display: grid;
          gap: 8px;
        }

        .operatingList div {
          padding: 11px 12px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.13);
        }

        .operatingList span {
          color: #6fdce9;
          font-size: 7px;
        }

        .operatingList strong {
          color: #c9d7dc;
          font-size: 10px;
          line-height: 1.45;
        }

        .expandButton {
          margin-top: 11px;
          padding: 0;
          border: 0;
          color: #79dce9;
          background: none;
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .tagList {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tagList strong {
          padding: 6px 8px;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 999px;
          color: #9fc4cd;
          background: rgba(99, 230, 255, 0.03);
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .evidenceGrid {
          margin-top: 10px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 7px;
        }

        .evidenceGrid div {
          padding: 9px;
          display: flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.015);
        }

        .evidenceGrid span {
          width: 5px;
          height: 5px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #d7b462;
          box-shadow: 0 0 9px rgba(215, 180, 98, 0.45);
        }

        .evidenceGrid strong {
          color: #aebfc6;
          font-size: 8px;
          line-height: 1.35;
        }

        .outcomeBlock strong {
          display: block;
          margin-top: 7px;
          color: #efd18d;
          font: 700 14px/1.45 Georgia, serif;
        }

        .cardActions {
          margin-top: 18px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .cardActions .primaryAction,
        .cardActions .secondaryAction {
          justify-self: stretch;
        }

        .emptyState {
          padding: 72px 25px;
          border: 1px dashed rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          background: rgba(5, 18, 30, 0.67);
          text-align: center;
        }

        .emptySeal {
          width: 70px;
          height: 70px;
          margin: auto;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc66f;
          font: 700 24px Georgia, serif;
        }

        .emptyState h2 {
          margin: 20px 0 0;
          font-size: 29px;
        }

        .emptyState p {
          margin: 13px 0 0;
          color: #849aa5;
          font-size: 12px;
        }

        .emptyState button {
          margin-top: 20px;
        }

        .operatingSequence {
          margin-top: 88px;
          padding: 50px 34px;
          border: 1px solid rgba(99, 230, 255, 0.13);
          border-radius: 28px;
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(99, 230, 255, 0.08),
              transparent 39%
            ),
            rgba(4, 16, 27, 0.88);
          text-align: center;
        }

        .operatingSequence h2 {
          max-width: 1040px;
          margin-left: auto;
          margin-right: auto;
        }

        .sequenceTrack {
          margin-top: 32px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .sequenceTrack article {
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.16);
        }

        .sequenceTrack span {
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .sequenceTrack strong {
          display: block;
          margin-top: 7px;
          color: #dce7eb;
          font: 700 18px Georgia, serif;
        }

        .sequenceTrack p {
          margin: 8px 0 0;
          color: #788f9a;
          font-size: 10px;
          line-height: 1.5;
        }

        .comparisonSection {
          margin-top: 88px;
          padding: 56px 34px;
          border: 1px solid rgba(255, 197, 82, 0.24);
          border-radius: 31px;
          background:
            radial-gradient(
              circle at 50% 0,
              rgba(255, 185, 44, 0.12),
              transparent 42%
            ),
            linear-gradient(
              180deg,
              rgba(8, 20, 33, 0.97),
              rgba(3, 10, 18, 0.99)
            );
          box-shadow:
            0 28px 78px rgba(0, 0, 0, 0.35),
            inset 0 1px rgba(255, 255, 255, 0.025);
          text-align: center;
        }

        .comparisonSeal {
          width: 82px;
          height: 82px;
          margin-bottom: 22px;
        }

        .comparisonSeal span {
          font-size: 23px;
        }

        .comparisonSeal small {
          font-size: 6px;
        }

        .comparisonSection h2 {
          max-width: 1060px;
          margin: 14px auto 0;
        }

        .comparisonSection > p:not(.eyebrow) {
          max-width: 1010px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .comparisonGrid {
          max-width: 1160px;
          margin: 31px auto 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .comparisonGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.17);
        }

        .comparisonGrid span {
          display: block;
          color: #e3b759;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .comparisonGrid strong {
          display: block;
          margin-top: 9px;
          color: #d9e4e8;
          font-size: 12px;
          line-height: 1.45;
        }

        .comparisonActions {
          margin-top: 29px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }


        .resolutionSection,
        .boundarySection,
        .failureSection,
        .academySection {
          margin-top: 88px;
          padding: 48px 34px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 28px;
          background: linear-gradient(145deg, rgba(8, 27, 42, 0.92), rgba(3, 12, 21, 0.98));
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.3);
        }

        .resolutionGrid,
        .failureGrid {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .resolutionGrid article,
        .failureGrid article,
        .boundaryGrid article {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.16);
        }

        .resolutionGrid span,
        .failureGrid span,
        .boundaryGrid span {
          color: #efbd59;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .resolutionGrid strong,
        .failureGrid strong,
        .boundaryGrid strong {
          display: block;
          margin-top: 8px;
          color: #e0eaee;
          font: 700 17px/1.3 Georgia, serif;
        }

        .resolutionGrid p,
        .failureGrid p,
        .boundaryGrid p {
          margin: 9px 0 0;
          color: #8299a4;
          font-size: 10px;
          line-height: 1.58;
        }

        .boundaryIntro {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 28px;
        }

        .boundaryIntro .definitionSeal {
          margin: 0;
        }

        .boundaryIntro h2,
        .failureSection h2,
        .academySection h2 {
          margin: 11px 0 0;
          font-size: clamp(36px, 4vw, 59px);
          line-height: 1;
          letter-spacing: -0.045em;
        }

        .boundaryGrid {
          margin-top: 30px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .academySection {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 38px;
          border-color: rgba(255, 198, 82, 0.21);
          background: radial-gradient(circle at 0 50%, rgba(255, 190, 59, 0.08), transparent 34%), rgba(5, 18, 30, 0.92);
        }

        .academySection > div > p:not(.eyebrow) {
          margin: 20px 0 0;
          color: #9cb0ba;
          font-size: 14px;
          line-height: 1.72;
        }

        .academyActions {
          display: grid;
          gap: 10px;
        }

        .academyActions .primaryAction,
        .academyActions .secondaryAction {
          justify-self: stretch;
        }

        @media (max-width: 1180px) {
          .heroMetrics {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }

          .definitionSection {
            grid-template-columns: auto 1fr;
          }

          .definitionSection > p {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 980px) {
          .filterPanel {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 900px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .sectionHeading {
            grid-template-columns: 1fr;
          }

          .systemsGrid {
            grid-template-columns: 1fr;
          }

          .sequenceTrack {
            grid-template-columns: repeat(2, 1fr);
          }
        }


        @media (max-width: 1080px) {
          .resolutionGrid,
          .failureGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .academySection {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .resolutionGrid,
          .failureGrid,
          .boundaryGrid,
          .boundaryIntro {
            grid-template-columns: 1fr;
          }

          .boundaryIntro {
            text-align: center;
          }

          .boundaryIntro .definitionSeal {
            margin: auto;
          }

          .resolutionSection,
          .boundarySection,
          .failureSection,
          .academySection {
            padding: 30px 20px;
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics,
          .definitionSection,
          .filterPanel,
          .sequenceTrack,
          .comparisonGrid {
            grid-template-columns: 1fr;
          }

          .topbarLink,
          .topbarAction {
            justify-self: stretch;
          }

          .hero {
            padding: 62px 0;
          }

          .hero h1 {
            font-size: clamp(45px, 14vw, 68px);
          }

          .definitionSeal {
            margin: auto;
          }

          .definitionSection {
            text-align: center;
          }

          .resultBar {
            align-items: flex-start;
            flex-direction: column;
          }

          .systemMeta {
            align-items: flex-start;
            flex-direction: column;
          }

          .systemMeta strong {
            text-align: left;
          }

          .evidenceGrid,
          .cardActions {
            grid-template-columns: 1fr;
          }

          .operatingSequence,
          .comparisonSection {
            padding: 30px 20px;
          }

          .comparisonActions {
            align-items: stretch;
            flex-direction: column;
          }

          .primaryAction,
          .secondaryAction {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
