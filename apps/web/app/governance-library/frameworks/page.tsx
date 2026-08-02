"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type FrameworkType =
  | "Regulation"
  | "Risk Framework"
  | "Management System"
  | "Principles"
  | "Standard"
  | "Guidance";

type FrameworkStatus =
  | "Binding"
  | "Voluntary"
  | "Principles-based"
  | "Implementation guidance";

type FrameworkRecord = {
  id: string;
  name: string;
  shortName: string;
  type: FrameworkType;
  status: FrameworkStatus;
  jurisdiction: string;
  organization: string;
  focus: string;
  purpose: string;
  coreAreas: string[];
  evidence: string[];
  relatedRecords: string[];
  ta14Boundary: string;
  href?: string;
  featured?: boolean;
};

const frameworks: FrameworkRecord[] = [
  {
    id: "eu-ai-act",
    name: "European Union Artificial Intelligence Act",
    shortName: "EU AI Act",
    type: "Regulation",
    status: "Binding",
    jurisdiction: "European Union",
    organization: "European Union",
    focus:
      "Risk-based legal governance for AI systems and general-purpose AI models.",
    purpose:
      "Establishes regulated roles, prohibited practices, high-risk requirements, transparency duties, general-purpose AI obligations, market oversight, and enforcement mechanisms.",
    coreAreas: [
      "Risk classification",
      "Provider and deployer duties",
      "High-risk AI systems",
      "General-purpose AI",
      "Transparency",
      "Human oversight",
      "Post-market monitoring",
      "Incident reporting",
    ],
    evidence: [
      "Role determination",
      "System classification record",
      "Risk-management file",
      "Technical documentation",
      "Validation results",
      "Human-oversight record",
      "Monitoring record",
    ],
    relatedRecords: [
      "ISO/IEC 42001",
      "NIST AI RMF",
      "ISO/IEC 23894",
    ],
    ta14Boundary:
      "Regulatory classification and conformity evidence may support admissibility, but execution still requires valid authority, current evidence, continuity, binding, and a preserved outcome record.",
    href: "/governance-library/eu-ai-act",
    featured: true,
  },
  {
    id: "nist-ai-rmf",
    name: "NIST Artificial Intelligence Risk Management Framework 1.0",
    shortName: "NIST AI RMF",
    type: "Risk Framework",
    status: "Voluntary",
    jurisdiction: "United States",
    organization:
      "National Institute of Standards and Technology",
    focus:
      "Trustworthy and responsible management of artificial-intelligence risk.",
    purpose:
      "Provides a flexible framework organized around Govern, Map, Measure, and Manage functions to help organizations identify, assess, prioritize, and respond to AI risks.",
    coreAreas: [
      "Governance",
      "Context mapping",
      "Risk measurement",
      "Risk treatment",
      "Trustworthiness characteristics",
      "Lifecycle management",
      "Stakeholder engagement",
      "Continuous improvement",
    ],
    evidence: [
      "Governance policy",
      "Context map",
      "Risk register",
      "Measurement result",
      "Evaluation record",
      "Treatment decision",
      "Monitoring record",
    ],
    relatedRecords: [
      "NIST AI 600-1",
      "ISO/IEC 42001",
      "ISO/IEC 23894",
    ],
    ta14Boundary:
      "Risk management identifies and treats risk, but TA-14 separately asks whether the evidence and authority required for the exact consequential execution are admissible at runtime.",
    href: "/governance-library/nist-ai-rmf-1-0",
    featured: true,
  },
  {
    id: "iso-42001",
    name:
      "ISO/IEC 42001:2023 Artificial Intelligence Management System",
    shortName: "ISO/IEC 42001",
    type: "Management System",
    status: "Voluntary",
    jurisdiction: "International",
    organization:
      "International Organization for Standardization and International Electrotechnical Commission",
    focus:
      "Organizational management systems for responsible development, provision, and use of AI.",
    purpose:
      "Defines requirements for establishing, implementing, maintaining, and continually improving an artificial intelligence management system.",
    coreAreas: [
      "Organizational context",
      "Leadership",
      "Planning",
      "Support",
      "Operational controls",
      "Performance evaluation",
      "Internal audit",
      "Continual improvement",
    ],
    evidence: [
      "Management-system scope",
      "AI policy",
      "Risk assessment",
      "Control implementation record",
      "Audit result",
      "Management review",
      "Corrective-action record",
    ],
    relatedRecords: [
      "ISO/IEC 23894",
      "NIST AI RMF",
      "EU AI Act",
    ],
    ta14Boundary:
      "A management system can establish organizational discipline, but certification or conformance does not independently authorize every system action or consequential execution.",
    href: "/governance-library/iso-iec-42001-2023",
    featured: true,
  },
  {
    id: "iso-23894",
    name:
      "ISO/IEC 23894:2023 Artificial Intelligence Risk Management",
    shortName: "ISO/IEC 23894",
    type: "Guidance",
    status: "Voluntary",
    jurisdiction: "International",
    organization:
      "International Organization for Standardization and International Electrotechnical Commission",
    focus:
      "Guidance for integrating AI-specific risk management into organizational processes.",
    purpose:
      "Supports organizations in identifying, analyzing, evaluating, treating, monitoring, reviewing, recording, and communicating artificial-intelligence risk.",
    coreAreas: [
      "Risk identification",
      "Risk analysis",
      "Risk evaluation",
      "Risk treatment",
      "Monitoring",
      "Communication",
      "Documentation",
      "Lifecycle integration",
    ],
    evidence: [
      "Risk criteria",
      "Risk register",
      "Risk assessment",
      "Treatment plan",
      "Residual-risk decision",
      "Monitoring record",
      "Review record",
    ],
    relatedRecords: [
      "ISO/IEC 42001",
      "NIST AI RMF",
      "OECD AI Principles",
    ],
    ta14Boundary:
      "A completed risk assessment may support a decision, but it must remain current, attributable, relevant, and bound to the exact execution context.",
  },
  {
    id: "oecd-principles",
    name: "OECD Artificial Intelligence Principles",
    shortName: "OECD AI Principles",
    type: "Principles",
    status: "Principles-based",
    jurisdiction: "International",
    organization:
      "Organisation for Economic Co-operation and Development",
    focus:
      "Human-centered values, transparency, robustness, safety, accountability, and inclusive growth.",
    purpose:
      "Provides intergovernmental principles intended to guide trustworthy AI policy, development, deployment, and institutional governance.",
    coreAreas: [
      "Inclusive growth",
      "Human-centered values",
      "Transparency",
      "Explainability",
      "Robustness",
      "Security",
      "Safety",
      "Accountability",
    ],
    evidence: [
      "Principle adoption record",
      "Policy mapping",
      "Control mapping",
      "Transparency record",
      "Risk assessment",
      "Accountability record",
      "Outcome monitoring",
    ],
    relatedRecords: [
      "UNESCO AI Ethics Recommendation",
      "NIST AI RMF",
      "G7 Hiroshima Process",
    ],
    ta14Boundary:
      "Principles provide direction but do not independently establish legal applicability, system authority, evidence sufficiency, or permission to execute.",
  },
  {
    id: "unesco-ai-ethics",
    name:
      "UNESCO Recommendation on the Ethics of Artificial Intelligence",
    shortName: "UNESCO AI Ethics",
    type: "Principles",
    status: "Principles-based",
    jurisdiction: "International",
    organization:
      "United Nations Educational, Scientific and Cultural Organization",
    focus:
      "Ethical governance of AI grounded in human rights, dignity, fairness, inclusion, and sustainability.",
    purpose:
      "Provides values, principles, and policy-action areas for states and institutions governing artificial intelligence.",
    coreAreas: [
      "Human rights",
      "Human dignity",
      "Fairness",
      "Non-discrimination",
      "Transparency",
      "Environmental responsibility",
      "Human oversight",
      "Ethical impact assessment",
    ],
    evidence: [
      "Ethical impact assessment",
      "Human-rights review",
      "Stakeholder consultation",
      "Fairness evaluation",
      "Environmental assessment",
      "Oversight record",
      "Remediation record",
    ],
    relatedRecords: [
      "OECD AI Principles",
      "NIST AI RMF",
      "EU AI Act",
    ],
    ta14Boundary:
      "Ethical alignment should inform governance, but an ethical claim cannot substitute for attributable evidence, valid authority, and a controlled execution record.",
  },
  {
    id: "ieee-7000",
    name:
      "IEEE 7000 Model Process for Addressing Ethical Concerns During System Design",
    shortName: "IEEE 7000",
    type: "Standard",
    status: "Voluntary",
    jurisdiction: "International",
    organization:
      "Institute of Electrical and Electronics Engineers",
    focus:
      "Embedding stakeholder values and ethical considerations into system design.",
    purpose:
      "Provides a process for identifying stakeholders, eliciting values, translating ethical concerns into system requirements, and preserving traceability.",
    coreAreas: [
      "Stakeholder identification",
      "Value elicitation",
      "Ethical risk",
      "System requirements",
      "Traceability",
      "Design controls",
      "Verification",
      "Lifecycle review",
    ],
    evidence: [
      "Stakeholder record",
      "Value analysis",
      "Ethical-risk record",
      "Requirement trace",
      "Design decision",
      "Verification result",
      "Review record",
    ],
    relatedRecords: [
      "UNESCO AI Ethics",
      "ISO/IEC 42001",
      "NIST AI RMF",
    ],
    ta14Boundary:
      "Ethically informed design requirements strengthen the evidence basis, but runtime execution must still prove that the implemented system and current conditions satisfy those requirements.",
  },
  {
    id: "g7-code",
    name:
      "G7 International Guiding Principles and Code of Conduct for Advanced AI Systems",
    shortName: "G7 Hiroshima Process",
    type: "Guidance",
    status: "Implementation guidance",
    jurisdiction: "International",
    organization: "Group of Seven",
    focus:
      "Responsible development and deployment of advanced artificial-intelligence systems.",
    purpose:
      "Provides guiding principles and a voluntary code addressing risk identification, testing, reporting, security, transparency, content authentication, research, and standards.",
    coreAreas: [
      "Risk identification",
      "Red-team testing",
      "Incident reporting",
      "Cybersecurity",
      "Transparency reporting",
      "Content authentication",
      "Research investment",
      "International standards",
    ],
    evidence: [
      "Risk assessment",
      "Red-team result",
      "Incident record",
      "Security evaluation",
      "Transparency report",
      "Content-authentication record",
      "Supplier assurance",
    ],
    relatedRecords: [
      "OECD AI Principles",
      "NIST AI RMF",
      "EU AI Act",
    ],
    ta14Boundary:
      "Voluntary commitments can support a governance route, but they do not create execution authority or prove that a particular action was admissible.",
  },

  {
    id: "epa-air-quality-system",
    name: "United States Air Quality Governance System",
    shortName: "EPA Air Quality System",
    type: "Regulation",
    status: "Binding",
    jurisdiction: "United States",
    organization: "U.S. Environmental Protection Agency",
    focus: "Implementation of Clean Air Act duties through ambient standards, source controls, monitoring, permitting, enforcement, and state implementation plans.",
    purpose: "Connects statutory air-protection authority to regulatory programs, approved methods, monitoring networks, permits, records, enforcement, and outcome review.",
    coreAreas: ["National Ambient Air Quality Standards", "State implementation plans", "Stationary-source permitting", "Mobile-source controls", "Hazardous air pollutants", "Monitoring and quality assurance", "Enforcement", "Public reporting"],
    evidence: ["Applicable statutory provision", "Regulatory citation", "Monitoring method", "Instrument and calibration record", "Permit or implementation-plan record", "Emission or ambient result", "Enforcement record", "Outcome comparison"],
    relatedRecords: ["Clean Air Act", "40 CFR Parts 50, 53, and 58", "WHO Global Air Quality Guidelines"],
    ta14Boundary: "Regulatory compliance evidence does not by itself prove that a particular building, person, intervention, or claimed protection remained environmentally valid. TA-14 binds the applicable authority to the actual evidence, action, and verified outcome.",
    featured: true,
  },
  {
    id: "epa-water-governance-system",
    name: "United States Water Quality Governance System",
    shortName: "EPA Water Governance",
    type: "Regulation",
    status: "Binding",
    jurisdiction: "United States",
    organization: "U.S. Environmental Protection Agency",
    focus: "Clean Water Act and Safe Drinking Water Act implementation through permits, standards, treatment duties, approved analytical methods, monitoring, reporting, and enforcement.",
    purpose: "Provides the regulatory and evidentiary structure through which discharges, receiving waters, drinking-water systems, treatment, sampling, and public protection are governed.",
    coreAreas: ["NPDES permitting", "Water-quality standards", "Effluent limitations", "Pretreatment", "Drinking-water standards", "Sampling and analytical methods", "Public notification", "Enforcement"],
    evidence: ["Permit or system classification", "Sampling plan", "Chain-of-custody record", "Approved method", "Laboratory result", "Treatment record", "Violation or notification record", "Outcome verification"],
    relatedRecords: ["Clean Water Act", "Safe Drinking Water Act", "EPA analytical methods"],
    ta14Boundary: "A compliant sample or permit record is bounded to its method, place, time, analyte, system, and legal purpose. It cannot be generalized into an unsupported universal safety or restoration claim.",
    featured: true,
  },
  {
    id: "who-air-quality-guidelines",
    name: "WHO Global Air Quality Guidelines",
    shortName: "WHO AQG",
    type: "Guidance",
    status: "Implementation guidance",
    jurisdiction: "International",
    organization: "World Health Organization",
    focus: "Health-based guidance for major air pollutants and interim targets used to inform policy, standards, and public-health protection.",
    purpose: "Provides evidence-informed concentration levels and interim targets that governments and institutions may use when developing air-quality law, policy, standards, and interventions.",
    coreAreas: ["Particulate matter", "Ozone", "Nitrogen dioxide", "Sulfur dioxide", "Carbon monoxide", "Interim targets", "Health evidence", "Policy translation"],
    evidence: ["Guideline edition", "Pollutant and averaging period", "Measurement method", "Population and exposure context", "Comparison record", "Uncertainty statement", "Policy adoption record"],
    relatedRecords: ["Clean Air Act", "Ambient air standards", "Atmospheric Integrity Records"],
    ta14Boundary: "WHO guideline values are not automatically binding law. Their governance effect depends on adoption, jurisdiction, measurement validity, context, and the bounded proposition being evaluated.",
  },
  {
    id: "iso-14001",
    name: "ISO 14001 Environmental Management Systems",
    shortName: "ISO 14001",
    type: "Management System",
    status: "Voluntary",
    jurisdiction: "International",
    organization: "International Organization for Standardization",
    focus: "Organizational environmental management, compliance obligations, operational controls, performance evaluation, and continual improvement.",
    purpose: "Provides a management-system structure for identifying environmental aspects, obligations, risks, controls, objectives, monitoring, audits, and corrective action.",
    coreAreas: ["Environmental aspects", "Compliance obligations", "Objectives", "Operational controls", "Emergency preparedness", "Monitoring", "Internal audit", "Continual improvement"],
    evidence: ["Management-system scope", "Aspect and impact register", "Compliance-obligation register", "Operational-control record", "Monitoring result", "Audit record", "Corrective action", "Management review"],
    relatedRecords: ["ISO 14004", "Environmental regulation", "TA-14 Environmental Integrity Governance"],
    ta14Boundary: "Management-system conformity supports institutional discipline but does not independently prove the validity of a particular environmental measurement, intervention, or claimed outcome.",
  },
  {
    id: "ta14-environmental-integrity-framework",
    name: "TA-14 Environmental Integrity Governance Framework",
    shortName: "TA-14 EIG",
    type: "Risk Framework",
    status: "Voluntary",
    jurisdiction: "Institutional / Proposed",
    organization: "TA-14 Authority Governance Institution",
    focus: "Governed environmental reality from record and continuity through admissibility, intervention, and verified outcome.",
    purpose: "Provides a cross-domain architecture for atmospheric records, PAIR, buildings, HVAC, air, water, land, pollution, environmental entity review, and future reliance.",
    coreAreas: ["Reality declaration", "Environmental record", "Continuity", "Admissibility", "Authority binding", "Committed determination", "Governed intervention", "Outcome verification"],
    evidence: ["Instrument and method record", "Location and activity context", "Continuity package", "Authority and threshold map", "Committed determination", "Intervention record", "Outcome record", "Limitations and non-claims"],
    relatedRecords: ["Atmospheric Integrity Records", "TA-14 Academy", "Law, Standards & Public Policy"],
    ta14Boundary: "This is a TA-14 institutional framework and proposed governance architecture. It does not replace enacted law, official standards, licensed professional judgment, or jurisdiction-specific authority.",
    featured: true,
  },
];

const frameworkTypes: Array<
  "All types" | FrameworkType
> = [
  "All types",
  "Regulation",
  "Risk Framework",
  "Management System",
  "Principles",
  "Standard",
  "Guidance",
];

const frameworkStatuses: Array<
  "All statuses" | FrameworkStatus
> = [
  "All statuses",
  "Binding",
  "Voluntary",
  "Principles-based",
  "Implementation guidance",
];

function statusClass(status: FrameworkStatus) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

export default function FrameworksPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<
    "All types" | FrameworkType
  >("All types");
  const [status, setStatus] = useState<
    "All statuses" | FrameworkStatus
  >("All statuses");
  const [selectedId, setSelectedId] = useState(
    frameworks[0].id,
  );

  const filteredFrameworks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return frameworks.filter((framework) => {
      const typeMatches =
        type === "All types" || framework.type === type;

      const statusMatches =
        status === "All statuses" ||
        framework.status === status;

      const searchable = [
        framework.name,
        framework.shortName,
        framework.type,
        framework.status,
        framework.jurisdiction,
        framework.organization,
        framework.focus,
        framework.purpose,
        framework.ta14Boundary,
        ...framework.coreAreas,
        ...framework.evidence,
        ...framework.relatedRecords,
      ]
        .join(" ")
        .toLowerCase();

      const queryMatches =
        normalizedQuery.length === 0 ||
        normalizedQuery
          .split(/\s+/)
          .every((token) => searchable.includes(token));

      return typeMatches && statusMatches && queryMatches;
    });
  }, [query, status, type]);

  const selectedFramework =
    frameworks.find(
      (framework) => framework.id === selectedId,
    ) ??
    filteredFrameworks[0] ??
    frameworks[0];

  const metrics = useMemo(
    () => ({
      records: frameworks.length,
      types: new Set(
        frameworks.map((framework) => framework.type),
      ).size,
      jurisdictions: new Set(
        frameworks.map(
          (framework) => framework.jurisdiction,
        ),
      ).size,
      evidenceTypes: new Set(
        frameworks.flatMap(
          (framework) => framework.evidence,
        ),
      ).size,
      featured: frameworks.filter(
        (framework) => framework.featured,
      ).length,
    }),
    [],
  );

  function clearFilters() {
    setQuery("");
    setType("All types");
    setStatus("All statuses");
  }

  return (
    <main className="frameworksPage">
      <div className="backgroundGrid" />
      <div className="backgroundGlow glowOne" />
      <div className="backgroundGlow glowTwo" />

      <div className="pageShell">
        <div className="topbar">
          <Link
            href="/governance-library"
            className="topbarLink"
          >
            ← Governance Library
          </Link>

          <div className="topbarStatus">
            <span />
            Framework navigation workspace
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
            <span>GF</span>
            <small>TA-14</small>
          </div>

          <p className="eyebrow">
            TA-14 AUTHORITY GOVERNANCE LIBRARY
          </p>

          <h1>
            Institutional Governance
            <span> Frameworks</span>
          </h1>

          <p className="lead">
            Navigate major regulations, risk frameworks,
            management systems, standards, principles, and
            guidance used across artificial-intelligence
            governance. Each record connects governance purpose
            to evidence expectations, related authorities, and
            TA-14 admissible-execution boundaries.
          </p>

          <div className="heroMetrics">
            <article>
              <span>{metrics.records}</span>
              <small>Framework records</small>
            </article>

            <article>
              <span>{metrics.types}</span>
              <small>Authority types</small>
            </article>

            <article>
              <span>{metrics.jurisdictions}</span>
              <small>Jurisdiction classes</small>
            </article>

            <article>
              <span>{metrics.evidenceTypes}</span>
              <small>Evidence references</small>
            </article>

            <article>
              <span>{metrics.featured}</span>
              <small>Primary anchors</small>
            </article>
          </div>
        </header>

        <section className="frameworkSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                FRAMEWORK CONTROL DESK
              </p>

              <h2>
                Find the framework. Inspect its function.
              </h2>
            </div>

            <p>
              Regulations, standards, management systems,
              principles, and risk frameworks do not perform the
              same function. A defensible route must preserve
              each source’s authority, purpose, scope, and
              evidentiary effect.
            </p>
          </div>

          <div className="filterPanel">
            <label className="searchField">
              Search frameworks
              <input
                type="search"
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search EU AI Act, NIST, ISO, risk, evidence..."
              />
            </label>

            <label>
              Framework type
              <select
                value={type}
                onChange={(event) =>
                  setType(
                    event.target.value as
                      | "All types"
                      | FrameworkType,
                  )
                }
              >
                {frameworkTypes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Authority condition
              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | "All statuses"
                      | FrameworkStatus,
                  )
                }
              >
                {frameworkStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="clearButton"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          </div>

          <div className="workspaceGrid">
            <aside className="frameworkIndex">
              <div className="indexHeading">
                <div>
                  <span>Framework index</span>
                  <strong>
                    {filteredFrameworks.length} records
                  </strong>
                </div>

                <small>
                  Select a framework to inspect its governance
                  purpose and evidence requirements.
                </small>
              </div>

              <div className="frameworkList">
                {filteredFrameworks.map(
                  (framework, index) => (
                    <button
                      key={framework.id}
                      type="button"
                      className={
                        selectedFramework.id ===
                        framework.id
                          ? "frameworkButton active"
                          : "frameworkButton"
                      }
                      onClick={() =>
                        setSelectedId(framework.id)
                      }
                    >
                      <span className="frameworkNumber">
                        {String(index + 1).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <span className="frameworkIdentity">
                        <small>{framework.type}</small>
                        <strong>
                          {framework.shortName}
                        </strong>
                        <em>{framework.jurisdiction}</em>
                      </span>

                      <span
                        className={`statusDot ${statusClass(
                          framework.status,
                        )}`}
                      />
                    </button>
                  ),
                )}

                {filteredFrameworks.length === 0 ? (
                  <div className="emptyIndex">
                    <span>00</span>
                    <strong>No framework matched.</strong>
                    <p>
                      Broaden the search or clear the
                      current filters.
                    </p>
                  </div>
                ) : null}
              </div>
            </aside>

            <section className="frameworkRecord">
              <div className="recordHeader">
                <div className="recordIdentity">
                  <div className="recordSeal">
                    {selectedFramework.shortName
                      .split(/\s+/)
                      .map((word) => word.charAt(0))
                      .join("")
                      .slice(0, 3)}
                  </div>

                  <div>
                    <p>
                      {selectedFramework.organization}
                    </p>

                    <h3>
                      {selectedFramework.shortName}
                    </h3>

                    <span>{selectedFramework.name}</span>
                  </div>
                </div>

                <div
                  className={`statusBadge ${statusClass(
                    selectedFramework.status,
                  )}`}
                >
                  {selectedFramework.status}
                </div>
              </div>

              <div className="authorityStrip">
                <div>
                  <span>Framework type</span>
                  <strong>
                    {selectedFramework.type}
                  </strong>
                </div>

                <div>
                  <span>Jurisdiction</span>
                  <strong>
                    {selectedFramework.jurisdiction}
                  </strong>
                </div>

                <div>
                  <span>Governance effect</span>
                  <strong>
                    {selectedFramework.status}
                  </strong>
                </div>
              </div>

              <article className="summaryCard">
                <span>Primary focus</span>
                <strong>{selectedFramework.focus}</strong>

                <p>{selectedFramework.purpose}</p>
              </article>

              <div className="recordColumns">
                <article className="recordCard">
                  <div className="cardHeading">
                    <span>Core governance areas</span>
                    <strong>
                      {
                        selectedFramework.coreAreas
                          .length
                      }
                    </strong>
                  </div>

                  <div className="numberedList">
                    {selectedFramework.coreAreas.map(
                      (item, index) => (
                        <div key={item}>
                          <span>
                            {String(
                              index + 1,
                            ).padStart(2, "0")}
                          </span>
                          <p>{item}</p>
                        </div>
                      ),
                    )}
                  </div>
                </article>

                <article className="recordCard">
                  <div className="cardHeading">
                    <span>Related records</span>
                    <strong>
                      {
                        selectedFramework
                          .relatedRecords.length
                      }
                    </strong>
                  </div>

                  <div className="relatedList">
                    {selectedFramework.relatedRecords.map(
                      (item) => (
                        <div key={item}>
                          <span>↔</span>
                          <strong>{item}</strong>
                        </div>
                      ),
                    )}
                  </div>
                </article>
              </div>

              <article className="evidenceCard">
                <div className="cardHeading">
                  <span>
                    Evidence commonly associated
                  </span>

                  <strong>
                    {selectedFramework.evidence.length}
                  </strong>
                </div>

                <div className="evidenceGrid">
                  {selectedFramework.evidence.map(
                    (item, index) => (
                      <div key={item}>
                        <span>
                          {String(index + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>
                        <strong>{item}</strong>
                      </div>
                    ),
                  )}
                </div>
              </article>

              <article className="executionCard">
                <div className="executionSeal">
                  T14
                </div>

                <div>
                  <span>
                    TA-14 execution boundary
                  </span>

                  <p>
                    {selectedFramework.ta14Boundary}
                  </p>
                </div>
              </article>

              <div className="recordActions">
                {selectedFramework.href ? (
                  <Link
                    href={selectedFramework.href}
                    className="secondaryAction"
                  >
                    View Framework Record
                  </Link>
                ) : null}

                <Link
                  href="/governance-library/crosswalks"
                  className="secondaryAction"
                >
                  Open Crosswalk
                </Link>

                <Link
                  href="/law-standards-public-policy"
                  className="primaryAction"
                >
                  Enter Governed Pathway →
                </Link>
              </div>
            </section>
          </div>
        </section>

        <section className="functionSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                GOVERNANCE FUNCTION MAP
              </p>

              <h2>
                Different instruments govern different
                questions.
              </h2>
            </div>

            <p>
              The library does not flatten every authority into
              a universal framework. Each instrument must remain
              within its declared function and legal or
              institutional boundary.
            </p>
          </div>

          <div className="functionGrid">
            {[
              {
                code: "01",
                title: "Law",
                text: "Creates binding duties, regulated roles, prohibitions, rights, enforcement, and jurisdictional consequences.",
              },
              {
                code: "02",
                title: "Management System",
                text: "Establishes organizational governance, accountability, operational controls, audit, and improvement disciplines.",
              },
              {
                code: "03",
                title: "Risk Framework",
                text: "Structures risk identification, contextual analysis, measurement, prioritization, treatment, and monitoring.",
              },
              {
                code: "04",
                title: "Standard",
                text: "Defines agreed requirements, processes, terminology, evaluation methods, or technical practices.",
              },
              {
                code: "05",
                title: "Principles",
                text: "Expresses normative values and high-level expectations that require translation into enforceable controls.",
              },
              {
                code: "06",
                title: "Guidance",
                text: "Supports implementation and interpretation without automatically creating an independent legal obligation.",
              },
            ].map((item) => (
              <article key={item.code}>
                <span>{item.code}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sequenceSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">
                FRAMEWORK APPLICATION SEQUENCE
              </p>

              <h2>
                Reference must become evidence-bound
                governance.
              </h2>
            </div>
          </div>

          <div className="sequenceGrid">
            {[
              {
                code: "01",
                title: "Identify",
                text: "Identify the correct authority, version, publisher, jurisdiction, and governance function.",
              },
              {
                code: "02",
                title: "Bound",
                text: "Preserve what the framework governs and what it does not claim to govern.",
              },
              {
                code: "03",
                title: "Map",
                text: "Map the relevant requirements, functions, principles, or controls to the declared use.",
              },
              {
                code: "04",
                title: "Evidence",
                text: "Attach attributable evidence demonstrating whether each mapped condition is supported.",
              },
              {
                code: "05",
                title: "Crosswalk",
                text: "Compare overlapping authorities without collapsing distinct definitions or obligations.",
              },
              {
                code: "06",
                title: "Determine",
                text: "Issue a bounded governance determination supported by the preserved evidence state.",
              },
              {
                code: "07",
                title: "Control",
                text: "Translate the determination into ALLOW, HOLD, DENY, or ESCALATE execution conditions.",
              },
              {
                code: "08",
                title: "Preserve",
                text: "Preserve the source, evidence, decision, execution, outcome, and later revalidation history.",
              },
            ].map((step) => (
              <article key={step.code}>
                <span>{step.code}</span>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="boundarySection">
          <div className="boundarySeal">
            <span>FB</span>
            <small>Framework boundary</small>
          </div>

          <p className="eyebrow gold">
            FRAMEWORK NAVIGATION BOUNDARY
          </p>

          <h2>
            A framework reference is not proof of
            governance.
          </h2>

          <p>
            This workspace organizes selected governance
            instruments and identifies their purpose, scope,
            evidence relationships, and execution implications.
            It does not establish legal applicability,
            certification, conformity, compliance, risk
            acceptance, or authority to execute. The official
            source, current version, governing institution,
            jurisdiction, qualified reviewer, and applicable
            authority remain controlling.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>LIBRARY PROVIDES</span>
              <strong>
                Framework navigation, functional boundaries,
                evidence orientation, and crosswalk entry points
              </strong>
            </article>

            <article>
              <span>LIBRARY DOES NOT PROVIDE</span>
              <strong>
                Universal equivalence, legal advice,
                certification, compliance, or execution
                authority
              </strong>
            </article>

            <article>
              <span>EXECUTION REQUIRES</span>
              <strong>
                Applicable authority, admissible evidence,
                continuity, binding, control, and preserved
                outcome proof
              </strong>
            </article>
          </div>

          <div className="boundaryActions">
            <Link
              href="/governance-library/crosswalks"
              className="secondaryAction"
            >
              Open Crosswalks
            </Link>

            <Link
              href="/governance-library/testing"
              className="secondaryAction"
            >
              Open Testing
            </Link>

            <Link
              href="/law-standards-public-policy"
              className="primaryAction"
            >
              Build TA-14 Route →
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .frameworksPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f5fbff;
          background:
            radial-gradient(
              circle at 50% -8%,
              rgba(37, 145, 192, 0.17),
              transparent 35%
            ),
            radial-gradient(
              circle at 8% 48%,
              rgba(81, 224, 242, 0.06),
              transparent 25%
            ),
            radial-gradient(
              circle at 92% 76%,
              rgba(235, 177, 66, 0.06),
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
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 88%
          );
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
          border: 1px solid
            rgba(255, 255, 255, 0.09);
          border-radius: 19px;
          background: linear-gradient(
            180deg,
            rgba(8, 26, 42, 0.88),
            rgba(4, 15, 26, 0.76)
          );
          box-shadow:
            0 16px 50px rgba(0, 0, 0, 0.28),
            inset 0 1px
              rgba(255, 255, 255, 0.03);
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
          border: 1px solid
            rgba(255, 255, 255, 0.1);
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
          border: 1px solid
            rgba(255, 255, 255, 0.1);
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
          box-shadow: 0 0 15px
            rgba(114, 230, 178, 0.9);
        }

        .hero {
          max-width: 1120px;
          margin: auto;
          padding: 88px 0 72px;
          text-align: center;
        }

        .heroSeal,
        .boundarySeal {
          width: 106px;
          height: 106px;
          margin: 0 auto 27px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid
            rgba(255, 198, 82, 0.37);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 220, 146, 0.16),
              transparent 36%
            ),
            rgba(4, 18, 30, 0.96);
          box-shadow:
            0 0 60px
              rgba(255, 193, 64, 0.09),
            inset 0 0 28px
              rgba(255, 255, 255, 0.03);
        }

        .heroSeal span,
        .boundarySeal span {
          color: #ffe3a0;
          font: 900 30px Georgia, serif;
        }

        .heroSeal small,
        .boundarySeal small {
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
        h2,
        h3 {
          font-family: Georgia, "Times New Roman",
            serif;
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
          max-width: 940px;
          margin: 27px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroMetrics {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(
            5,
            minmax(0, 1fr)
          );
          gap: 12px;
        }

        .heroMetrics article {
          padding: 18px;
          border: 1px solid
            rgba(255, 255, 255, 0.07);
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

        .frameworkSection,
        .functionSection,
        .sequenceSection {
          padding-top: 80px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: end;
          gap: 40px;
        }

        .sectionHeading h2,
        .boundarySection h2 {
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
            minmax(0, 1fr) 220px 220px auto;
          align-items: end;
          gap: 12px;
          border: 1px solid
            rgba(99, 230, 255, 0.12);
          border-radius: 21px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
          box-shadow: 0 24px 60px
            rgba(0, 0, 0, 0.27);
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
          min-height: 47px;
          box-sizing: border-box;
          padding: 0 13px;
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          outline: none;
          color: #e8f2f5;
          background: rgba(0, 0, 0, 0.2);
          font: inherit;
          text-transform: none;
        }

        input:focus,
        select:focus {
          border-color: rgba(
            99,
            230,
            255,
            0.42
          );
          box-shadow: 0 0 0 3px
            rgba(99, 230, 255, 0.06);
        }

        select option {
          color: #e8f2f5;
          background: #071520;
        }

        .clearButton {
          min-height: 47px;
          padding: 0 15px;
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #b5c7cf;
          background: rgba(0, 0, 0, 0.18);
          cursor: pointer;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns:
            390px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .frameworkIndex,
        .frameworkRecord {
          border: 1px solid
            rgba(99, 230, 255, 0.12);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 44, 0.95),
            rgba(3, 13, 22, 0.98)
          );
          box-shadow: 0 24px 60px
            rgba(0, 0, 0, 0.27);
        }

        .frameworkIndex {
          position: sticky;
          top: 20px;
          padding: 18px;
        }

        .indexHeading {
          padding: 4px 3px 16px;
          border-bottom: 1px solid
            rgba(255, 255, 255, 0.06);
        }

        .indexHeading div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .indexHeading span {
          color: #70ddec;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .indexHeading strong {
          color: #edca80;
          font: 700 16px Georgia, serif;
        }

        .indexHeading small {
          display: block;
          margin-top: 8px;
          color: #718995;
          font-size: 9px;
          line-height: 1.5;
        }

        .frameworkList {
          margin-top: 14px;
          display: grid;
          gap: 9px;
        }

        .frameworkButton {
          width: 100%;
          padding: 13px;
          display: grid;
          grid-template-columns:
            40px minmax(0, 1fr) 9px;
          align-items: center;
          gap: 11px;
          border: 1px solid
            rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          text-align: left;
          transition:
            transform 0.2s,
            border-color 0.2s,
            background 0.2s;
        }

        .frameworkButton:hover,
        .frameworkButton.active {
          transform: translateX(3px);
          border-color: rgba(
            99,
            230,
            255,
            0.28
          );
          background: rgba(
            99,
            230,
            255,
            0.05
          );
        }

        .frameworkNumber {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(99, 230, 255, 0.15);
          border-radius: 10px;
          color: #6bd9eb;
          font-size: 8px;
          font-weight: 900;
        }

        .frameworkIdentity {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .frameworkIdentity small {
          color: #728995;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .frameworkIdentity strong {
          overflow: hidden;
          color: #dce8ec;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .frameworkIdentity em {
          overflow: hidden;
          color: #71858f;
          font-size: 8px;
          font-style: normal;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .statusDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #63727a;
        }

        .statusDot.binding {
          background: #72e6b2;
          box-shadow: 0 0 10px
            rgba(114, 230, 178, 0.6);
        }

        .statusDot.voluntary {
          background: #71d7ef;
        }

        .statusDot.principles-based {
          background: #efc76e;
        }

        .statusDot.implementation-guidance {
          background: #b77be2;
        }

        .emptyIndex {
          padding: 35px 18px;
          border: 1px dashed
            rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          text-align: center;
        }

        .emptyIndex span {
          color: #efc875;
          font: 700 22px Georgia, serif;
        }

        .emptyIndex strong {
          display: block;
          margin-top: 10px;
          font-size: 12px;
        }

        .emptyIndex p {
          margin: 8px 0 0;
          color: #748b96;
          font-size: 9px;
          line-height: 1.5;
        }

        .frameworkRecord {
          padding: 26px;
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
          width: 70px;
          height: 70px;
          flex: 0 0 70px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(255, 198, 82, 0.28);
          border-radius: 50%;
          color: #f1cb7c;
          background: rgba(
            255,
            198,
            82,
            0.04
          );
          font: 700 18px Georgia, serif;
        }

        .recordIdentity p {
          margin: 0;
          color: #69dcef;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .recordIdentity h3 {
          margin: 6px 0 0;
          font-size: clamp(29px, 3vw, 43px);
          line-height: 1;
        }

        .recordIdentity span {
          display: block;
          max-width: 710px;
          margin-top: 8px;
          color: #8499a3;
          font-size: 11px;
          line-height: 1.5;
        }

        .statusBadge {
          padding: 9px 12px;
          border: 1px solid
            rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: #9fb1b9;
          background: rgba(0, 0, 0, 0.16);
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .statusBadge.binding {
          color: #89efc2;
          border-color: rgba(
            114,
            230,
            178,
            0.24
          );
          background: rgba(
            114,
            230,
            178,
            0.06
          );
        }

        .statusBadge.voluntary {
          color: #85e7f6;
          border-color: rgba(
            113,
            215,
            239,
            0.24
          );
          background: rgba(
            113,
            215,
            239,
            0.06
          );
        }

        .statusBadge.principles-based {
          color: #f3cf7d;
          border-color: rgba(
            239,
            199,
            110,
            0.25
          );
          background: rgba(
            239,
            199,
            110,
            0.06
          );
        }

        .statusBadge.implementation-guidance {
          color: #d39af0;
          border-color: rgba(
            183,
            123,
            226,
            0.25
          );
          background: rgba(
            183,
            123,
            226,
            0.06
          );
        }

        .authorityStrip {
          margin-top: 23px;
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 10px;
        }

        .authorityStrip div {
          padding: 14px;
          border: 1px solid
            rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .authorityStrip span,
        .summaryCard > span {
          color: #70ddec;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .authorityStrip strong {
          display: block;
          margin-top: 7px;
          color: #d4e1e5;
          font-size: 10px;
        }

        .summaryCard {
          margin-top: 14px;
          padding: 19px;
          border: 1px solid
            rgba(99, 230, 255, 0.1);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.14);
        }

        .summaryCard > strong {
          display: block;
          margin-top: 9px;
          color: #dce8eb;
          font: 700 18px Georgia, serif;
          line-height: 1.4;
        }

        .summaryCard p {
          margin: 11px 0 0;
          color: #9dafb8;
          font-size: 12px;
          line-height: 1.68;
        }

        .recordColumns {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 13px;
        }

        .recordCard,
        .evidenceCard {
          padding: 18px;
          border: 1px solid
            rgba(255, 255, 255, 0.07);
          border-radius: 17px;
          background: rgba(0, 0, 0, 0.14);
        }

        .evidenceCard {
          margin-top: 14px;
        }

        .cardHeading {
          padding-bottom: 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid
            rgba(255, 255, 255, 0.06);
        }

        .cardHeading span {
          color: #78ddeb;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .cardHeading strong {
          color: #edca80;
          font: 700 18px Georgia, serif;
        }

        .numberedList,
        .relatedList {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }

        .numberedList div,
        .relatedList div {
          display: grid;
          grid-template-columns:
            31px minmax(0, 1fr);
          align-items: start;
          gap: 10px;
        }

        .numberedList div > span,
        .relatedList div > span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(99, 230, 255, 0.12);
          border-radius: 9px;
          color: #68d9ea;
          font-size: 7px;
          font-weight: 900;
        }

        .numberedList p {
          margin: 5px 0 0;
          color: #a0b2ba;
          font-size: 10px;
          line-height: 1.55;
        }

        .relatedList strong {
          margin-top: 8px;
          color: #a7bac2;
          font-size: 10px;
        }

        .evidenceGrid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 9px;
        }

        .evidenceGrid div {
          min-height: 75px;
          padding: 12px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          border: 1px solid
            rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.14);
        }

        .evidenceGrid span {
          color: #6fdced;
          font-size: 7px;
          font-weight: 900;
        }

        .evidenceGrid strong {
          color: #aabcc4;
          font-size: 9px;
          line-height: 1.45;
        }

        .executionCard {
          margin-top: 14px;
          padding: 19px;
          display: grid;
          grid-template-columns:
            60px minmax(0, 1fr);
          align-items: center;
          gap: 16px;
          border: 1px solid
            rgba(255, 198, 82, 0.19);
          border-radius: 16px;
          background:
            radial-gradient(
              circle at 0 0,
              rgba(255, 198, 82, 0.07),
              transparent 34%
            ),
            rgba(0, 0, 0, 0.16);
        }

        .executionSeal {
          width: 60px;
          height: 60px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(255, 198, 82, 0.25);
          border-radius: 50%;
          color: #efc875;
          font: 700 15px Georgia, serif;
        }

        .executionCard span {
          color: #e4b95e;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .executionCard p {
          margin: 8px 0 0;
          color: #d3e0e4;
          font-size: 12px;
          line-height: 1.62;
        }

        .recordActions {
          margin-top: 17px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 9px;
        }

        .functionGrid {
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 12px;
        }

        .functionGrid article,
        .sequenceGrid article {
          min-height: 190px;
          padding: 19px;
          border: 1px solid
            rgba(99, 230, 255, 0.1);
          border-radius: 17px;
          background: linear-gradient(
            180deg,
            rgba(10, 30, 45, 0.9),
            rgba(3, 12, 20, 0.96)
          );
        }

        .functionGrid article > span,
        .sequenceGrid article > span {
          width: 37px;
          height: 37px;
          display: grid;
          place-items: center;
          border: 1px solid
            rgba(255, 197, 82, 0.2);
          border-radius: 50%;
          color: #efc66f;
          font-size: 8px;
          font-weight: 900;
        }

        .functionGrid strong,
        .sequenceGrid strong {
          display: block;
          margin-top: 23px;
          color: #e1ecef;
          font: 700 19px Georgia, serif;
        }

        .functionGrid p,
        .sequenceGrid p {
          margin: 11px 0 0;
          color: #8298a2;
          font-size: 10px;
          line-height: 1.58;
        }

        .sequenceGrid {
          display: grid;
          grid-template-columns: repeat(
            4,
            minmax(0, 1fr)
          );
          gap: 11px;
        }

        .boundarySection {
          margin-top: 88px;
          padding: 56px 34px;
          border: 1px solid
            rgba(255, 197, 82, 0.24);
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
            inset 0 1px
              rgba(255, 255, 255, 0.025);
          text-align: center;
        }

        .boundarySeal {
          width: 82px;
          height: 82px;
          margin-bottom: 22px;
        }

        .boundarySeal span {
          font-size: 23px;
        }

        .boundarySeal small {
          font-size: 6px;
        }

        .boundarySection h2 {
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .boundarySection
          > p:not(.eyebrow) {
          max-width: 970px;
          margin: 23px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          max-width: 1080px;
          margin: 31px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .boundaryGrid article {
          padding: 20px;
          border: 1px solid
            rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.17);
        }

        .boundaryGrid span {
          display: block;
          color: #e3b759;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .boundaryGrid strong {
          display: block;
          margin-top: 9px;
          color: #d9e4e8;
          font-size: 12px;
          line-height: 1.45;
        }

        .boundaryActions {
          margin-top: 29px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        @media (max-width: 1180px) {
          .heroMetrics {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .filterPanel {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .workspaceGrid {
            grid-template-columns:
              330px minmax(0, 1fr);
          }

          .evidenceGrid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }
        }

        @media (max-width: 920px) {
          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarStatus {
            display: none;
          }

          .sectionHeading,
          .workspaceGrid {
            grid-template-columns: 1fr;
          }

          .frameworkIndex {
            position: static;
          }

          .frameworkList {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .recordColumns {
            grid-template-columns: 1fr;
          }

          .functionGrid,
          .sequenceGrid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .boundaryGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .pageShell {
            width: calc(100% - 22px);
          }

          .topbar,
          .filterPanel,
          .frameworkList,
          .authorityStrip,
          .evidenceGrid,
          .functionGrid,
          .sequenceGrid {
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
            font-size: clamp(
              45px,
              14vw,
              68px
            );
          }

          .heroMetrics {
            grid-template-columns: 1fr;
          }

          .frameworkIndex,
          .frameworkRecord,
          .boundarySection {
            padding: 21px;
          }

          .recordHeader {
            flex-direction: column;
          }

          .recordIdentity {
            align-items: flex-start;
          }

          .executionCard {
            grid-template-columns: 1fr;
          }

          .recordActions,
          .boundaryActions {
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
