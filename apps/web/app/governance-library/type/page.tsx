"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AuthorityClass =
  | "Binding authority"
  | "Adopted authority"
  | "Voluntary authority"
  | "Advisory authority"
  | "Institutional proposal";

type TypeRecord = {
  id: string;
  code: string;
  title: string;
  plural: string;
  domain: "Law" | "Regulation" | "Standards" | "Frameworks" | "Evidence" | "Institutional";
  authorityClass: AuthorityClass;
  description: string;
  purpose: string;
  controllingQuestion: string;
  examples: string[];
  evidence: string[];
  boundaries: string[];
  academy: string[];
  href: string;
  accent: string;
  glow: string;
};

const recordTypes: TypeRecord[] = [
  {
    id: "statute",
    code: "LAW",
    title: "Statute or Act",
    plural: "Statutes and Acts",
    domain: "Law",
    authorityClass: "Binding authority",
    description:
      "A law enacted by a legislature and signed, adopted, or otherwise brought into legal force through the governing constitutional process.",
    purpose:
      "Creates legal duties, prohibitions, powers, programs, rights, enforcement authorities, and institutional responsibilities.",
    controllingQuestion:
      "Which enacted text applies, in which jurisdiction, to which subject, activity, period, and consequence?",
    examples: [
      "Clean Air Act",
      "Clean Water Act",
      "Safe Drinking Water Act",
      "Resource Conservation and Recovery Act",
      "Comprehensive Environmental Response, Compensation, and Liability Act",
      "EU Artificial Intelligence Act",
    ],
    evidence: [
      "Official enacted text",
      "Amendment and effective-date record",
      "Jurisdiction and applicability analysis",
      "Responsible authority",
      "Obligation and prohibition map",
      "Enforcement and remedy pathway",
    ],
    boundaries: [
      "A statute does not automatically answer every technical implementation question.",
      "Applicability may depend on definitions, thresholds, exemptions, and later regulations.",
      "A TA-14 proposal must never be presented as enacted law.",
    ],
    academy: [
      "What the act was designed to solve",
      "What the current act leaves out",
      "Why the gap matters in practice",
      "How TA-14 proposes to modernize it",
    ],
    href: "/governance-library/laws",
    accent: "#f0bd61",
    glow: "rgba(240, 189, 97, .32)",
  },
  {
    id: "regulation",
    code: "REG",
    title: "Regulation or Rule",
    plural: "Regulations and Rules",
    domain: "Regulation",
    authorityClass: "Binding authority",
    description:
      "A binding rule issued by an authorized administrative or regulatory body under delegated legal authority.",
    purpose:
      "Translates statutory authority into operational requirements, thresholds, methods, permits, reporting duties, restrictions, and enforcement procedures.",
    controllingQuestion:
      "Did the issuing body possess authority, and does the current rule apply to this facility, system, action, record, or regulated party?",
    examples: [
      "40 CFR environmental regulations",
      "National Ambient Air Quality Standards implementation rules",
      "Safe Drinking Water Act implementing regulations",
      "Hazardous-waste management rules",
      "AI transparency and implementation rules",
    ],
    evidence: [
      "Official regulatory text",
      "Delegating statute",
      "Federal or official register history",
      "Codified version",
      "Applicability and exemption record",
      "Inspection, reporting, and enforcement requirements",
    ],
    boundaries: [
      "A regulation must be tied to its actual delegating authority.",
      "Guidance issued by an agency is not automatically a binding regulation.",
      "The latest published rule may have transition dates or delayed applicability.",
    ],
    academy: [
      "How statutes become regulations",
      "How rules create evidence duties",
      "Where implementation gaps appear",
      "How proposed upgrades change enforcement and outcomes",
    ],
    href: "/governance-library/regulations",
    accent: "#ff916f",
    glow: "rgba(255, 145, 111, .3)",
  },
  {
    id: "standard",
    code: "STD",
    title: "Standard",
    plural: "Standards",
    domain: "Standards",
    authorityClass: "Voluntary authority",
    description:
      "A consensus, technical, management, measurement, design, testing, or performance instrument issued by a standards-development organization.",
    purpose:
      "Creates repeatable requirements, specifications, methods, terminology, control expectations, or conformity criteria.",
    controllingQuestion:
      "What edition applies, and did the standard become mandatory through law, code adoption, regulation, contract, permit, policy, or certification?",
    examples: [
      "ASHRAE Standard 62.1",
      "ASHRAE Standard 55",
      "ASHRAE Standard 170",
      "ISO/IEC 42001",
      "ISO 14001",
      "ANSI-accredited standards",
    ],
    evidence: [
      "Official title and publisher",
      "Edition and publication date",
      "Scope and exclusions",
      "Adoption or incorporation record",
      "Control and testing evidence",
      "Conformity or inspection record",
    ],
    boundaries: [
      "A voluntary standard is not automatically law.",
      "An adopted edition may differ from the newest edition.",
      "Referencing a standard does not prove implementation or conformity.",
    ],
    academy: [
      "Who issued the standard",
      "What its real authority is",
      "What it requires and leaves out",
      "What a TA-14 upgraded standard would add",
    ],
    href: "/governance-library/standards",
    accent: "#6fe8ff",
    glow: "rgba(111, 232, 255, .3)",
  },
  {
    id: "code",
    code: "CODE",
    title: "Code or Model Code",
    plural: "Codes and Model Codes",
    domain: "Standards",
    authorityClass: "Adopted authority",
    description:
      "A coordinated technical rule system for buildings, mechanical systems, electrical systems, fire protection, public safety, or other regulated activities.",
    purpose:
      "Provides enforceable technical requirements when adopted by a competent jurisdiction or incorporated into another binding authority.",
    controllingQuestion:
      "Which jurisdiction adopted which edition, with what amendments, for which occupancy, building, system, or project?",
    examples: [
      "International Building Code",
      "International Mechanical Code",
      "National Electrical Code",
      "Fire and life-safety codes",
      "State and local building codes",
    ],
    evidence: [
      "Adoption ordinance or regulation",
      "Applicable edition",
      "Local amendments",
      "Permit and inspection record",
      "Authority-having-jurisdiction determination",
      "Correction and approval history",
    ],
    boundaries: [
      "A model code is not enforceable until adopted.",
      "Local amendments may materially change requirements.",
      "Code compliance does not necessarily prove environmental outcome integrity.",
    ],
    academy: [
      "Model code versus adopted code",
      "Authority having jurisdiction",
      "Edition and amendment resolution",
      "TA-14 evidence and outcome upgrades",
    ],
    href: "/governance-library/standards",
    accent: "#ffd15c",
    glow: "rgba(255, 209, 92, .28)",
  },
  {
    id: "framework",
    code: "FW",
    title: "Governance Framework",
    plural: "Governance Frameworks",
    domain: "Frameworks",
    authorityClass: "Advisory authority",
    description:
      "A structured body of functions, outcomes, practices, categories, or governance activities used to organize institutional action.",
    purpose:
      "Helps organizations structure governance, risk, oversight, implementation, monitoring, and improvement.",
    controllingQuestion:
      "Has the framework been adopted, mapped to accountable controls, and connected to evidence and execution?",
    examples: [
      "NIST AI Risk Management Framework",
      "Environmental management frameworks",
      "TA-14 Environmental Integrity Governance Framework",
      "Institutional governance models",
    ],
    evidence: [
      "Adoption decision",
      "Function and category mapping",
      "Control ownership",
      "Implementation evidence",
      "Monitoring and review record",
      "Execution-boundary mapping",
    ],
    boundaries: [
      "A framework is not self-executing authority.",
      "A maturity score does not prove a specific action was admissible.",
      "Framework adoption must be distinguished from operational implementation.",
    ],
    academy: [
      "Framework structure",
      "Control and evidence mapping",
      "Implementation failure modes",
      "Transition from framework to governed execution",
    ],
    href: "/governance-library/frameworks",
    accent: "#b497ff",
    glow: "rgba(180, 151, 255, .3)",
  },
  {
    id: "guidance",
    code: "GUIDE",
    title: "Guidance or Recommendation",
    plural: "Guidance and Recommendations",
    domain: "Frameworks",
    authorityClass: "Advisory authority",
    description:
      "Non-binding explanatory, scientific, technical, policy, health, or implementation material issued to support better decisions.",
    purpose:
      "Provides evidence-informed direction, recommended levels, interpretation, implementation approaches, or good practices.",
    controllingQuestion:
      "Is the guidance advisory, incorporated into another authority, or being used only as supporting evidence?",
    examples: [
      "WHO Global Air Quality Guidelines",
      "EPA technical guidance",
      "Agency implementation guidance",
      "International policy recommendations",
      "Scientific consensus recommendations",
    ],
    evidence: [
      "Issuing organization",
      "Scientific or technical basis",
      "Version and date",
      "Declared status",
      "Adoption or reliance pathway",
      "Limitations and uncertainty",
    ],
    boundaries: [
      "Guidance must not be represented as enacted law.",
      "Recommended levels may differ from legally enforceable thresholds.",
      "Scientific authority and legal authority must remain distinct.",
    ],
    academy: [
      "Guidance versus binding law",
      "Scientific basis and limitations",
      "How guidance influences policy",
      "When TA-14 proposes conversion into enforceable duties",
    ],
    href: "/governance-library/recommendations",
    accent: "#65dcb4",
    glow: "rgba(101, 220, 180, .28)",
  },
  {
    id: "principle",
    code: "PRIN",
    title: "Principle or Declaration",
    plural: "Principles and Declarations",
    domain: "Frameworks",
    authorityClass: "Advisory authority",
    description:
      "A statement of values, expectations, public commitments, ethical direction, or institutional doctrine.",
    purpose:
      "Defines the normative direction that policies, controls, standards, and governance systems are expected to serve.",
    controllingQuestion:
      "What operational duties, evidence, authority, and consequences were created from the principle?",
    examples: [
      "OECD AI Principles",
      "Environmental protection principles",
      "Precautionary principle",
      "Polluter-pays principle",
      "TA-14 governing principles",
    ],
    evidence: [
      "Official declaration",
      "Adoption record",
      "Policy translation",
      "Control mapping",
      "Evidence requirement",
      "Outcome review",
    ],
    boundaries: [
      "A principle does not by itself create a technical control.",
      "Values must be translated into accountable duties.",
      "Broad ethical language cannot substitute for bounded findings.",
    ],
    academy: [
      "Principle origin",
      "Operational translation",
      "Evidence and accountability gaps",
      "TA-14 conversion into governed routes",
    ],
    href: "/governance-library/principles",
    accent: "#df91ff",
    glow: "rgba(223, 145, 255, .28)",
  },
  {
    id: "method",
    code: "MTHD",
    title: "Method or Test Procedure",
    plural: "Methods and Test Procedures",
    domain: "Evidence",
    authorityClass: "Adopted authority",
    description:
      "A prescribed process for sampling, measurement, analysis, calibration, testing, validation, or technical determination.",
    purpose:
      "Makes evidence repeatable, attributable, comparable, and suitable for a declared use.",
    controllingQuestion:
      "Was the correct method used by a competent party with valid instruments, controls, custody, and versioning?",
    examples: [
      "EPA analytical methods",
      "SW-846 methods",
      "Air-monitoring methods",
      "Water-sampling procedures",
      "HVAC testing and balancing procedures",
    ],
    evidence: [
      "Method identifier and edition",
      "Sampling plan",
      "Instrument and calibration record",
      "Quality-control results",
      "Chain of custody",
      "Laboratory and analyst competence",
    ],
    boundaries: [
      "A method result supports only the proposition within its validated scope.",
      "A valid measurement does not automatically establish legal compliance or causation.",
      "Method deviations must be preserved, not hidden.",
    ],
    academy: [
      "Method selection",
      "Calibration and quality control",
      "Custody and continuity",
      "Admissibility and interpretation boundaries",
    ],
    href: "/governance-library/testing",
    accent: "#62afff",
    glow: "rgba(98, 175, 255, .3)",
  },
  {
    id: "management-system",
    code: "MS",
    title: "Management System",
    plural: "Management Systems",
    domain: "Institutional",
    authorityClass: "Voluntary authority",
    description:
      "An organizational system of policy, leadership, planning, controls, audit, review, corrective action, and continual improvement.",
    purpose:
      "Creates repeatable institutional responsibility and oversight across a defined scope.",
    controllingQuestion:
      "Does the declared management system actually govern the specific system, activity, evidence, and outcome at issue?",
    examples: [
      "ISO/IEC 42001 AI management system",
      "ISO 14001 environmental management system",
      "Quality and laboratory management systems",
      "TA-14 institutional governance systems",
    ],
    evidence: [
      "Scope statement",
      "Policy and objectives",
      "Roles and responsibilities",
      "Risk and control records",
      "Audit and review",
      "Corrective action and improvement",
    ],
    boundaries: [
      "Management-system conformity does not prove every individual execution was valid.",
      "Certification scope must be inspected carefully.",
      "Organizational controls must connect to runtime evidence.",
    ],
    academy: [
      "Management-system architecture",
      "Scope and control ownership",
      "Audit and corrective action",
      "Connection to admissible execution",
    ],
    href: "/governance-library/management-systems",
    accent: "#7be2a8",
    glow: "rgba(123, 226, 168, .28)",
  },
  {
    id: "governed-record",
    code: "REC",
    title: "Governed Record",
    plural: "Governed Records",
    domain: "Evidence",
    authorityClass: "Institutional proposal",
    description:
      "A structured record that preserves identity, chronology, evidence, authority, interpretation, limitations, determination, action, and outcome.",
    purpose:
      "Transforms raw data or documentation into an attributable and reviewable institutional record.",
    controllingQuestion:
      "Can the record support the exact proposition, decision, or future reliance being claimed?",
    examples: [
      "Atmospheric Integrity Record",
      "Personal Atmospheric Integrity Record",
      "Environmental Integrity Record",
      "Governed AI execution record",
      "Building and HVAC evidence records",
    ],
    evidence: [
      "Identity and stewardship",
      "Time, place, and subject",
      "Evidence and method",
      "Continuity and integrity",
      "Authority and determination",
      "Outcome and correction history",
    ],
    boundaries: [
      "A record must state what it proves and what it does not prove.",
      "Correction must preserve prior history.",
      "Confidential evidence requires bounded disclosure controls.",
    ],
    academy: [
      "Record architecture",
      "Continuity and admissibility",
      "Interpretation and non-claims",
      "Future reliance and correction",
    ],
    href: "/governance-library/governed-records",
    accent: "#6fe8ff",
    glow: "rgba(111, 232, 255, .26)",
  },
  {
    id: "execution-artifact",
    code: "EA",
    title: "Execution Artifact",
    plural: "Execution Artifacts",
    domain: "Evidence",
    authorityClass: "Institutional proposal",
    description:
      "A bounded, inspectable proof package preserving the route from proposed consequence through evidence, authority, determination, execution effect, and outcome.",
    purpose:
      "Demonstrates what governance actually did at the execution boundary rather than merely describing intended policy.",
    controllingQuestion:
      "What action was proposed, what authority and evidence were admitted, what determination was committed, and what outcome occurred?",
    examples: [
      "ALLOW execution artifact",
      "HOLD execution artifact",
      "DENY execution artifact",
      "ESCALATE execution artifact",
      "Environmental intervention artifact",
    ],
    evidence: [
      "Proposed action",
      "Governing route",
      "Admitted evidence",
      "Authority and continuity",
      "Committed determination",
      "Technical effect and outcome",
    ],
    boundaries: [
      "An artifact proves only its bounded claim.",
      "Artifact registration requires prior governance-entity registration.",
      "A successful artifact does not certify an entire organization or platform.",
    ],
    academy: [
      "Execution-artifact anatomy",
      "Determination states",
      "Verification and integrity",
      "Bounded claim and non-claim construction",
    ],
    href: "/artifacts",
    accent: "#ffcf68",
    glow: "rgba(255, 207, 104, .3)",
  },
  {
    id: "proposal",
    code: "PROP",
    title: "TA-14 Proposal",
    plural: "TA-14 Proposals",
    domain: "Institutional",
    authorityClass: "Institutional proposal",
    description:
      "A clearly labeled proposed law, standard, code provision, framework, method, or governance architecture published for inspection, challenge, refinement, and possible adoption.",
    purpose:
      "Shows how TA-14 would modernize an existing instrument or fill a governance gap without falsely presenting the proposal as current binding authority.",
    controllingQuestion:
      "What existing gap does the proposal address, what changes would it create, and what authority would be required to adopt it?",
    examples: [
      "TA-14 Proposed Clean Air and Atmospheric Integrity Act",
      "TA-14 Proposed Water Integrity and Outcome Act",
      "TA-14 Atmospheric Integrity Record Standard",
      "TA-14 Admissible Execution Standard",
    ],
    evidence: [
      "Existing instrument",
      "Gap analysis",
      "Evidence of consequence",
      "Proposed language or architecture",
      "Adoption pathway",
      "Revision and challenge history",
    ],
    boundaries: [
      "A proposal is not enacted law or an adopted standard.",
      "TA-14 must preserve criticism, revision, and supersession.",
      "The proposal must state the authority required for implementation.",
    ],
    academy: [
      "Current instrument",
      "Primitive or incomplete elements",
      "TA-14 proposed upgrade",
      "Practical differences and expected outcomes",
    ],
    href: "/governance-library/laws",
    accent: "#ff9f68",
    glow: "rgba(255, 159, 104, .3)",
  },
];

const authorityClasses: Array<"All authority classes" | AuthorityClass> = [
  "All authority classes",
  "Binding authority",
  "Adopted authority",
  "Voluntary authority",
  "Advisory authority",
  "Institutional proposal",
];

const domains = [
  "All domains",
  "Law",
  "Regulation",
  "Standards",
  "Frameworks",
  "Evidence",
  "Institutional",
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function GovernanceRecordTypesPage() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState<(typeof domains)[number]>("All domains");
  const [authorityClass, setAuthorityClass] = useState<
    "All authority classes" | AuthorityClass
  >("All authority classes");
  const [selectedId, setSelectedId] = useState(recordTypes[0].id);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return recordTypes.filter((record) => {
      const domainMatches = domain === "All domains" || record.domain === domain;
      const authorityMatches =
        authorityClass === "All authority classes" ||
        record.authorityClass === authorityClass;
      const searchable = [
        record.title,
        record.plural,
        record.domain,
        record.authorityClass,
        record.description,
        record.purpose,
        record.controllingQuestion,
        ...record.examples,
        ...record.evidence,
        ...record.boundaries,
        ...record.academy,
      ]
        .join(" ")
        .toLowerCase();
      const queryMatches =
        normalized.length === 0 ||
        normalized
          .split(/\s+/)
          .every((token) => searchable.includes(token));

      return domainMatches && authorityMatches && queryMatches;
    });
  }, [authorityClass, domain, query]);

  const selected =
    recordTypes.find((record) => record.id === selectedId) ??
    filtered[0] ??
    recordTypes[0];

  const metrics = useMemo(
    () => ({
      types: recordTypes.length,
      domains: new Set(recordTypes.map((record) => record.domain)).size,
      authorityClasses: new Set(
        recordTypes.map((record) => record.authorityClass),
      ).size,
      evidenceElements: new Set(
        recordTypes.flatMap((record) => record.evidence),
      ).size,
    }),
    [],
  );

  function clearFilters() {
    setQuery("");
    setDomain("All domains");
    setAuthorityClass("All authority classes");
  }

  return (
    <main className="typesPage">
      <div className="background" aria-hidden="true">
        <div className="grid" />
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
      </div>

      <div className="shell">
        <header className="topbar">
          <Link href="/governance-library" className="backLink">
            ← Governance Library
          </Link>
          <div className="status">
            <span /> Institutional classification system
          </div>
          <Link href="/governance-library/category" className="topAction">
            Open Category System →
          </Link>
        </header>

        <section className="hero">
          <div className="heroSeal">
            <span>TYPE</span>
            <small>TA-14</small>
          </div>
          <p className="eyebrow">TA-14 INSTITUTIONAL GOVERNANCE LIBRARY</p>
          <h1>
            Governance Record
            <em> Types</em>
          </h1>
          <p className="lead">
            Laws, regulations, standards, codes, frameworks, guidance, methods,
            records, artifacts, and proposals do not carry the same authority.
            This system preserves what each instrument is, what it can do, how
            it becomes applicable, what evidence it requires, and where its
            authority stops.
          </p>

          <div className="heroMetrics">
            <article>
              <strong>{metrics.types}</strong>
              <span>Institutional types</span>
            </article>
            <article>
              <strong>{metrics.domains}</strong>
              <span>Governance domains</span>
            </article>
            <article>
              <strong>{metrics.authorityClasses}</strong>
              <span>Authority classes</span>
            </article>
            <article>
              <strong>{metrics.evidenceElements}</strong>
              <span>Evidence elements</span>
            </article>
          </div>
        </section>

        <section className="classificationRule">
          <div>
            <p className="eyebrow">THE CLASSIFICATION RULE</p>
            <h2>Do not treat every governance instrument as law.</h2>
          </div>
          <p>
            Correct classification comes before applicability, authority,
            evidence, compliance, or execution. A recommendation is not a
            regulation. A model code is not an adopted code. A framework is not
            a permit. A proposal is not enacted law. TA-14 preserves these
            differences before any route is allowed to bind consequence.
          </p>
        </section>

        <section className="workspace">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TYPE RESOLUTION WORKSPACE</p>
              <h2>Identify the instrument before relying on it.</h2>
            </div>
            <p>
              Search by title, authority, evidence, domain, or example. Select a
              type to inspect its purpose, governing question, expected evidence,
              boundaries, and Academy pathway.
            </p>
          </div>

          <div className="filters">
            <label>
              Search record types
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search law, ASHRAE, guidance, method, artifact..."
              />
            </label>
            <label>
              Domain
              <select
                value={domain}
                onChange={(event) =>
                  setDomain(event.target.value as (typeof domains)[number])
                }
              >
                {domains.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Authority class
              <select
                value={authorityClass}
                onChange={(event) =>
                  setAuthorityClass(
                    event.target.value as
                      | "All authority classes"
                      | AuthorityClass,
                  )
                }
              >
                {authorityClasses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <button type="button" onClick={clearFilters}>
              Clear filters
            </button>
          </div>

          <div className="workspaceGrid">
            <aside className="typeIndex">
              <div className="indexHeader">
                <span>Record-type index</span>
                <strong>{filtered.length} visible</strong>
              </div>
              <div className="typeList">
                {filtered.map((record, index) => (
                  <button
                    type="button"
                    key={record.id}
                    className={selected.id === record.id ? "active" : ""}
                    onClick={() => setSelectedId(record.id)}
                    style={
                      {
                        "--accent": record.accent,
                        "--glow": record.glow,
                      } as React.CSSProperties
                    }
                  >
                    <span className="number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="identity">
                      <small>{record.domain}</small>
                      <strong>{record.title}</strong>
                      <em>{record.authorityClass}</em>
                    </span>
                    <i>{record.code}</i>
                  </button>
                ))}

                {filtered.length === 0 ? (
                  <div className="emptyState">
                    <strong>No record type matched.</strong>
                    <p>Broaden the search or clear the current filters.</p>
                  </div>
                ) : null}
              </div>
            </aside>

            <article
              className="typeDetail"
              style={
                {
                  "--accent": selected.accent,
                  "--glow": selected.glow,
                } as React.CSSProperties
              }
            >
              <div className="detailHeader">
                <div className="detailSeal">{selected.code}</div>
                <div>
                  <p>{selected.domain}</p>
                  <h3>{selected.title}</h3>
                  <span>{selected.authorityClass}</span>
                </div>
              </div>

              <div className="authorityStrip">
                <div>
                  <span>Record family</span>
                  <strong>{selected.plural}</strong>
                </div>
                <div>
                  <span>Authority class</span>
                  <strong>{selected.authorityClass}</strong>
                </div>
                <div>
                  <span>Institutional domain</span>
                  <strong>{selected.domain}</strong>
                </div>
              </div>

              <article className="summaryCard">
                <span>Definition</span>
                <strong>{selected.description}</strong>
                <p>{selected.purpose}</p>
              </article>

              <article className="questionCard">
                <span>Controlling institutional question</span>
                <p>{selected.controllingQuestion}</p>
              </article>

              <div className="detailColumns">
                <article className="detailCard">
                  <div className="cardHeading">
                    <span>Representative examples</span>
                    <strong>{selected.examples.length}</strong>
                  </div>
                  <div className="itemList">
                    {selected.examples.map((item, index) => (
                      <div key={item}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="detailCard">
                  <div className="cardHeading">
                    <span>Evidence required</span>
                    <strong>{selected.evidence.length}</strong>
                  </div>
                  <div className="itemList">
                    {selected.evidence.map((item, index) => (
                      <div key={item}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <p>{item}</p>
                      </div>
                    ))}
                  </div>
                </article>
              </div>

              <article className="boundaryCard">
                <div className="cardHeading">
                  <span>Classification boundaries</span>
                  <strong>{selected.boundaries.length}</strong>
                </div>
                <div className="boundaryList">
                  {selected.boundaries.map((item) => (
                    <div key={item}>
                      <span>!</span>
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="academyCard">
                <div>
                  <span>TA-14 Academy pathway</span>
                  <h4>Learn why this instrument type matters.</h4>
                  <p>
                    The Academy explains the source, authority, adoption path,
                    evidence expectations, limitations, and practical
                    consequences of relying on this type.
                  </p>
                </div>
                <div className="academySteps">
                  {selected.academy.map((item, index) => (
                    <div key={item}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <strong>{item}</strong>
                    </div>
                  ))}
                </div>
              </article>

              <div className="actions">
                <Link href={selected.href} className="primaryAction">
                  Open {selected.plural} →
                </Link>
                <Link
                  href={`/governance-library/type/${slugify(selected.title)}`}
                  className="secondaryAction"
                >
                  View Type Records
                </Link>
                <Link
                  href="/governance-library/applicability"
                  className="secondaryAction"
                >
                  Resolve Applicability
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section className="authorityMatrix">
          <div className="sectionHeading centered">
            <div>
              <p className="eyebrow">AUTHORITY CLASS MATRIX</p>
              <h2>One library. Five different kinds of authority.</h2>
            </div>
            <p>
              The same instrument can move between classes when adopted,
              incorporated, contracted, or superseded. TA-14 preserves the path
              that changed its authority rather than assuming its effect.
            </p>
          </div>

          <div className="matrixGrid">
            {[
              [
                "01",
                "Binding authority",
                "Enacted statutes and valid regulations within their jurisdiction and scope.",
              ],
              [
                "02",
                "Adopted authority",
                "Standards, codes, methods, or requirements made enforceable through adoption or incorporation.",
              ],
              [
                "03",
                "Voluntary authority",
                "Consensus standards and management systems used voluntarily, contractually, or for certification.",
              ],
              [
                "04",
                "Advisory authority",
                "Guidance, frameworks, principles, recommendations, and scientific advice.",
              ],
              [
                "05",
                "Institutional proposal",
                "Clearly labeled TA-14 proposals, architectures, records, and model upgrades awaiting adoption or reliance.",
              ],
            ].map(([number, title, text]) => (
              <article key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="resolutionSequence">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TYPE RESOLUTION SEQUENCE</p>
              <h2>Classify before you apply.</h2>
            </div>
            <p>
              A record type is resolved through source, status, jurisdiction,
              adoption, version, scope, evidence, and execution effect.
            </p>
          </div>

          <div className="sequenceGrid">
            {[
              ["01", "Source", "Identify the official issuing or adopting body."],
              ["02", "Instrument", "Determine the actual record type."],
              ["03", "Status", "Confirm enacted, published, proposed, repealed, or superseded status."],
              ["04", "Authority", "Determine whether authority is binding, adopted, voluntary, advisory, or proposed."],
              ["05", "Version", "Preserve the controlling edition and date."],
              ["06", "Scope", "Resolve subjects, activities, locations, thresholds, and exclusions."],
              ["07", "Evidence", "Identify the records needed to support reliance."],
              ["08", "Execution", "Bind only the effect the instrument can actually support."],
            ].map(([number, title, text]) => (
              <article key={title}>
                <span>{number}</span>
                <strong>{title}</strong>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="failureSection">
          <div className="sectionHeading centered">
            <div>
              <p className="eyebrow">CLASSIFICATION FAILURE MODES</p>
              <h2>Most authority errors begin before applicability is tested.</h2>
            </div>
            <p>
              These failures cause organizations to overstate compliance,
              misunderstand duties, cite the wrong edition, or execute without
              valid authority.
            </p>
          </div>

          <div className="failureGrid">
            {[
              ["LAW AS GUIDANCE", "Treating a binding statute as optional advice."],
              ["GUIDANCE AS LAW", "Presenting a recommendation as an enforceable obligation."],
              ["MODEL AS ADOPTED", "Assuming a model code is legally operative without adoption."],
              ["LATEST AS CONTROLLING", "Using the newest edition when another edition was incorporated."],
              ["FRAMEWORK AS CONTROL", "Claiming framework adoption proves operational execution."],
              ["METHOD AS CONCLUSION", "Treating a valid measurement method as proof of a broader legal or causal conclusion."],
              ["CERTIFICATION AS AUTHORITY", "Assuming certification grants permission for a specific action."],
              ["PROPOSAL AS CURRENT LAW", "Presenting a TA-14 proposal as enacted or already binding."],
            ].map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="academySection">
          <div className="academySeal">
            <small>TA-14</small>
            <strong>ACADEMY</strong>
            <span>TYPE LITERACY</span>
          </div>
          <div className="academyCopy">
            <p className="eyebrow">GOVERNANCE RECORD TYPE ACADEMY</p>
            <h2>Learn what the instrument is before asking what it requires.</h2>
            <p>
              The Academy teaches the difference between enacted law,
              regulation, adopted code, voluntary standard, framework,
              guidance, method, governed record, execution artifact, and TA-14
              proposal. Learners inspect examples, resolve authority, test
              applicability, and practice the complete classification route.
            </p>
            <div className="academyGrid">
              {[
                ["01", "Identify", "Recognize the instrument from its source, title, status, and publication."],
                ["02", "Distinguish", "Separate binding authority from voluntary and advisory instruments."],
                ["03", "Trace", "Follow adoption, delegation, incorporation, and contractual pathways."],
                ["04", "Apply", "Resolve jurisdiction, version, scope, thresholds, and exclusions."],
                ["05", "Evidence", "Build the records required to support the intended reliance."],
                ["06", "Bound", "State what the instrument can prove, require, permit, or prohibit."],
              ].map(([number, title, text]) => (
                <article key={title}>
                  <span>{number}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="academyActions">
              <Link href="/academy" className="academyAction">
                Enter TA-14 Academy →
              </Link>
              <Link
                href="/governance-library/authorities"
                className="secondaryAction"
              >
                Resolve Authority
              </Link>
            </div>
          </div>
        </section>

        <section className="closing">
          <p className="eyebrow">TA-14 GOVERNANCE RECORD TYPES</p>
          <h2>Correct type. Correct authority. Correct evidence. Bounded reliance.</h2>
          <p>
            The institution does not flatten every public instrument into a
            generic governance document. It preserves what each record is,
            where its authority comes from, how it becomes applicable, what it
            requires, and where its effect ends.
          </p>
          <div className="closingActions">
            <Link href="/governance-library" className="primaryAction">
              Return to Governance Library →
            </Link>
            <Link
              href="/governance-library/applicability"
              className="secondaryAction"
            >
              Open Applicability
            </Link>
            <Link
              href="/law-standards-public-policy"
              className="secondaryAction"
            >
              Enter Law, Standards & Public Policy
            </Link>
          </div>
        </section>

        <footer>
          <span>TA-14 Authority Governance Institution</span>
          <span>Governance Record Types · TA14Authority.org</span>
        </footer>
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
          background: #020812;
          color: #f7fbff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        :global(a) {
          color: inherit;
        }

        .typesPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background: linear-gradient(
            180deg,
            rgba(3, 12, 24, 0.7),
            rgba(2, 8, 18, 0.96)
          );
        }

        .background {
          position: fixed;
          inset: 0;
          z-index: -2;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 50% -8%,
              rgba(44, 149, 207, 0.18),
              transparent 34%
            ),
            linear-gradient(180deg, #020812, #06111d 48%, #020711);
        }

        .grid {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image:
            linear-gradient(rgba(105, 222, 241, 0.22) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(105, 222, 241, 0.22) 1px,
              transparent 1px
            );
          background-size: 66px 66px;
          mask-image: linear-gradient(
            to bottom,
            transparent,
            black 16%,
            black 80%,
            transparent
          );
        }

        .glow {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          filter: blur(110px);
          opacity: 0.15;
          animation: drift 16s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -260px;
          top: 20%;
          background: #0876d1;
        }

        .glowTwo {
          right: -280px;
          top: 55%;
          background: #bd6d23;
          animation-delay: -7s;
        }

        .route {
          position: absolute;
          width: 78vw;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(99, 224, 245, 0.55),
            rgba(255, 198, 82, 0.42),
            transparent
          );
        }

        .route::after {
          content: "";
          position: absolute;
          left: 0;
          top: -3px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #fff2b5;
          box-shadow: 0 0 18px #ffe178;
          animation: packet 8s linear infinite;
        }

        .routeOne {
          top: 25%;
          left: -15%;
          transform: rotate(-8deg);
        }

        .routeTwo {
          top: 70%;
          right: -18%;
          transform: rotate(9deg);
        }

        .shell {
          width: min(1500px, calc(100% - 40px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
          padding: 22px 0 80px;
        }

        .topbar {
          min-height: 72px;
          padding: 12px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          background: linear-gradient(
            180deg,
            rgba(8, 28, 44, 0.88),
            rgba(4, 14, 25, 0.8)
          );
          backdrop-filter: blur(18px);
          box-shadow: 0 16px 44px rgba(0, 0, 0, 0.24);
        }

        .backLink,
        .topAction,
        .primaryAction,
        .secondaryAction,
        .academyAction {
          min-height: 46px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 11px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: transform 0.22s, border-color 0.22s;
        }

        .backLink,
        .secondaryAction {
          justify-self: start;
          color: #c6d8df;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .topAction,
        .primaryAction {
          justify-self: end;
          color: #03151e;
          border: 1px solid #b9f3ff;
          background: linear-gradient(135deg, #d8fbff, #75ddef 62%, #36abc6);
        }

        .academyAction {
          color: #03160f;
          border: 1px solid #9df2c4;
          background: linear-gradient(135deg, #d1ffe5, #69e7a9 64%, #2da46f);
        }

        .backLink:hover,
        .topAction:hover,
        .primaryAction:hover,
        .secondaryAction:hover,
        .academyAction:hover {
          transform: translateY(-3px);
        }

        .status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #839ca7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .status span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #72e9b1;
          box-shadow: 0 0 14px rgba(114, 233, 177, 0.85);
        }

        .hero {
          max-width: 1180px;
          margin-inline: auto;
          padding: 90px 0 76px;
          text-align: center;
        }

        .heroSeal {
          width: 112px;
          height: 112px;
          margin: 0 auto 26px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border-radius: 50%;
          border: 1px solid rgba(255, 206, 105, 0.42);
          background: radial-gradient(
            circle,
            rgba(255, 201, 83, 0.13),
            rgba(4, 20, 33, 0.94) 67%
          );
          box-shadow: 0 0 58px rgba(255, 194, 64, 0.1);
        }

        .heroSeal span {
          color: #ffe29a;
          font: 900 24px Georgia, serif;
        }

        .heroSeal small {
          color: #728c98;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.17em;
        }

        .eyebrow {
          margin: 0;
          color: #6fe6f8;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .hero h1,
        .sectionHeading h2,
        .classificationRule h2,
        .academyCopy h2,
        .closing h2 {
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }

        .hero h1 {
          margin: 14px 0 0;
          font-size: clamp(54px, 7vw, 98px);
          line-height: 0.94;
        }

        .hero h1 em {
          display: block;
          color: #f1c66f;
          font-style: italic;
          font-weight: 500;
        }

        .lead {
          max-width: 980px;
          margin: 26px auto 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroMetrics {
          margin-top: 38px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .heroMetrics article {
          padding: 19px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(7, 24, 37, 0.64);
        }

        .heroMetrics strong {
          display: block;
          color: #f0d087;
          font: 700 30px Georgia, serif;
        }

        .heroMetrics span {
          display: block;
          margin-top: 5px;
          color: #78909b;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .classificationRule {
          padding: 32px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: end;
          border: 1px solid rgba(255, 200, 88, 0.22);
          border-radius: 25px;
          background: linear-gradient(
            145deg,
            rgba(46, 34, 11, 0.36),
            rgba(5, 22, 33, 0.92)
          );
        }

        .classificationRule h2 {
          margin: 11px 0 0;
          font-size: clamp(38px, 4.3vw, 62px);
          line-height: 0.98;
        }

        .classificationRule > p {
          margin: 0;
          color: #abbcc4;
          font-size: 15px;
          line-height: 1.75;
        }

        .workspace,
        .authorityMatrix,
        .resolutionSequence,
        .failureSection,
        .academySection,
        .closing {
          padding-top: 90px;
        }

        .sectionHeading {
          margin-bottom: 31px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 38px;
          align-items: end;
        }

        .sectionHeading.centered {
          max-width: 1080px;
          margin-inline: auto;
          text-align: center;
          grid-template-columns: 1fr;
        }

        .sectionHeading h2 {
          margin: 10px 0 0;
          font-size: clamp(40px, 4.7vw, 70px);
          line-height: 0.99;
        }

        .sectionHeading > p {
          margin: 0;
          color: #95aab4;
          font-size: 15px;
          line-height: 1.72;
        }

        .filters {
          padding: 18px;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 220px 240px auto;
          gap: 12px;
          align-items: end;
          border: 1px solid rgba(103, 225, 245, 0.13);
          border-radius: 20px;
          background: linear-gradient(
            145deg,
            rgba(8, 29, 44, 0.94),
            rgba(3, 13, 22, 0.98)
          );
        }

        .filters label {
          display: grid;
          gap: 8px;
          color: #7899a6;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .filters input,
        .filters select,
        .filters button {
          min-height: 48px;
          padding: 0 13px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 11px;
          color: #e9f3f6;
          background: rgba(0, 0, 0, 0.2);
          font: inherit;
        }

        .filters select option {
          background: #071520;
        }

        .filters button {
          cursor: pointer;
          color: #b9c9cf;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .workspaceGrid {
          margin-top: 17px;
          display: grid;
          grid-template-columns: 390px minmax(0, 1fr);
          gap: 17px;
          align-items: start;
        }

        .typeIndex,
        .typeDetail {
          border: 1px solid rgba(103, 225, 245, 0.13);
          border-radius: 24px;
          background: linear-gradient(
            145deg,
            rgba(8, 28, 43, 0.95),
            rgba(3, 13, 22, 0.98)
          );
        }

        .typeIndex {
          position: sticky;
          top: 20px;
          padding: 18px;
        }

        .indexHeader {
          padding: 3px 3px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .indexHeader span {
          color: #6fdaeb;
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .indexHeader strong {
          color: #efc875;
          font: 700 16px Georgia, serif;
        }

        .typeList {
          margin-top: 14px;
          display: grid;
          gap: 9px;
        }

        .typeList button {
          width: 100%;
          padding: 13px;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr) 48px;
          gap: 11px;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          color: inherit;
          background: rgba(0, 0, 0, 0.15);
          cursor: pointer;
          text-align: left;
          transition: 0.22s;
        }

        .typeList button:hover,
        .typeList button.active {
          transform: translateX(4px);
          border-color: var(--accent);
          background: color-mix(in srgb, var(--accent) 7%, transparent);
          box-shadow: 0 10px 24px var(--glow);
        }

        .number {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(103, 225, 245, 0.14);
          border-radius: 10px;
          color: #6ddced;
          font-size: 8px;
          font-weight: 900;
        }

        .identity {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .identity small {
          color: #6e8792;
          font-size: 7px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .identity strong {
          color: #dbe8ec;
          font-size: 11px;
        }

        .identity em {
          color: #71858f;
          font-size: 8px;
          font-style: normal;
        }

        .typeList button > i {
          color: var(--accent);
          font-size: 8px;
          font-style: normal;
          font-weight: 950;
          text-align: right;
        }

        .emptyState {
          padding: 34px 18px;
          text-align: center;
        }

        .emptyState p {
          color: #748a94;
          font-size: 10px;
        }

        .typeDetail {
          padding: 27px;
          box-shadow: 0 28px 72px rgba(0, 0, 0, 0.26);
        }

        .detailHeader {
          display: flex;
          align-items: center;
          gap: 17px;
        }

        .detailSeal {
          width: 78px;
          height: 78px;
          flex: 0 0 78px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid var(--accent);
          color: var(--accent);
          background: rgba(0, 0, 0, 0.2);
          box-shadow: 0 0 34px var(--glow);
          font: 700 16px Georgia, serif;
        }

        .detailHeader p {
          margin: 0;
          color: var(--accent);
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .detailHeader h3 {
          margin: 6px 0 0;
          font: 700 clamp(32px, 3.4vw, 48px) Georgia, serif;
          letter-spacing: -0.04em;
        }

        .detailHeader span {
          display: block;
          margin-top: 7px;
          color: #879da6;
          font-size: 10px;
        }

        .authorityStrip {
          margin-top: 22px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .authorityStrip div,
        .summaryCard,
        .detailCard,
        .boundaryCard {
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.14);
        }

        .authorityStrip span,
        .summaryCard > span,
        .questionCard > span,
        .academyCard > div > span {
          color: var(--accent);
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .authorityStrip strong {
          display: block;
          margin-top: 7px;
          font-size: 10px;
        }

        .summaryCard {
          margin-top: 14px;
        }

        .summaryCard > strong {
          display: block;
          margin-top: 10px;
          font: 700 18px Georgia, serif;
          line-height: 1.42;
        }

        .summaryCard p {
          margin: 10px 0 0;
          color: #9dafb8;
          font-size: 12px;
          line-height: 1.67;
        }

        .questionCard {
          margin-top: 14px;
          padding: 19px;
          border-left: 3px solid var(--accent);
          border-radius: 0 15px 15px 0;
          background: linear-gradient(90deg, var(--glow), transparent);
        }

        .questionCard p {
          margin: 9px 0 0;
          color: #e1ebee;
          font: 700 18px Georgia, serif;
          line-height: 1.48;
        }

        .detailColumns {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 13px;
        }

        .cardHeading {
          padding-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .cardHeading span {
          color: var(--accent);
          font-size: 8px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .cardHeading strong {
          color: #efc978;
          font: 700 18px Georgia, serif;
        }

        .itemList,
        .boundaryList {
          margin-top: 13px;
          display: grid;
          gap: 9px;
        }

        .itemList div,
        .boundaryList div {
          display: grid;
          grid-template-columns: 31px 1fr;
          gap: 10px;
          align-items: start;
        }

        .itemList span,
        .boundaryList span {
          width: 31px;
          height: 31px;
          display: grid;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
          border-radius: 9px;
          color: var(--accent);
          font-size: 7px;
          font-weight: 900;
        }

        .itemList p,
        .boundaryList p {
          margin: 5px 0 0;
          color: #a3b5bc;
          font-size: 10px;
          line-height: 1.48;
        }

        .boundaryCard {
          margin-top: 14px;
          border-color: rgba(255, 190, 76, 0.16);
        }

        .boundaryList span {
          border-color: rgba(255, 190, 76, 0.25);
          color: #f0c66e;
        }

        .academyCard {
          margin-top: 14px;
          padding: 22px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          border: 1px solid rgba(103, 233, 172, 0.18);
          border-radius: 18px;
          background: linear-gradient(
            145deg,
            rgba(19, 61, 46, 0.35),
            rgba(4, 21, 28, 0.92)
          );
        }

        .academyCard h4 {
          margin: 9px 0 0;
          font: 700 24px Georgia, serif;
        }

        .academyCard p {
          color: #98b1aa;
          font-size: 11px;
          line-height: 1.58;
        }

        .academySteps {
          display: grid;
          gap: 8px;
        }

        .academySteps div {
          padding: 11px;
          display: grid;
          grid-template-columns: 30px 1fr;
          gap: 9px;
          align-items: center;
          border: 1px solid rgba(103, 233, 172, 0.12);
          border-radius: 11px;
          background: rgba(0, 0, 0, 0.15);
        }

        .academySteps span {
          color: #6fe0ac;
          font-size: 8px;
        }

        .academySteps strong {
          font-size: 10px;
        }

        .actions,
        .academyActions,
        .closingActions {
          margin-top: 17px;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 9px;
        }

        .matrixGrid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 11px;
        }

        .matrixGrid article {
          min-height: 235px;
          padding: 21px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: linear-gradient(
            145deg,
            rgba(9, 29, 43, 0.78),
            rgba(3, 14, 22, 0.9)
          );
        }

        .matrixGrid article > span {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(255, 201, 91, 0.22);
          color: #edc672;
          font-size: 8px;
        }

        .matrixGrid h3 {
          margin: 28px 0 10px;
          font: 700 22px Georgia, serif;
        }

        .matrixGrid p {
          margin: 0;
          color: #8298a2;
          font-size: 11px;
          line-height: 1.6;
        }

        .sequenceGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 11px;
        }

        .sequenceGrid article {
          min-height: 190px;
          padding: 19px;
          border: 1px solid rgba(103, 225, 245, 0.1);
          border-radius: 17px;
          background: rgba(9, 29, 43, 0.68);
        }

        .sequenceGrid article > span {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(255, 201, 91, 0.2);
          color: #edc672;
          font-size: 8px;
        }

        .sequenceGrid strong {
          display: block;
          margin-top: 23px;
          font: 700 20px Georgia, serif;
        }

        .sequenceGrid p {
          margin: 10px 0 0;
          color: #8197a0;
          font-size: 10px;
          line-height: 1.58;
        }

        .failureGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 11px;
        }

        .failureGrid article {
          min-height: 205px;
          padding: 20px;
          border: 1px solid rgba(255, 112, 133, 0.12);
          border-radius: 17px;
          background: linear-gradient(
            145deg,
            rgba(54, 18, 27, 0.32),
            rgba(4, 17, 25, 0.92)
          );
        }

        .failureGrid span {
          color: #ff899a;
          font-size: 9px;
          font-weight: 900;
        }

        .failureGrid h3 {
          margin: 27px 0 10px;
          color: #ff9baa;
          font: 700 19px Georgia, serif;
        }

        .failureGrid p {
          margin: 0;
          color: #8f9fa5;
          font-size: 10px;
          line-height: 1.58;
        }

        .academySection {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 48px;
          align-items: center;
          border-top: 1px solid rgba(103, 233, 172, 0.14);
          border-bottom: 1px solid rgba(103, 233, 172, 0.14);
          padding-bottom: 90px;
        }

        .academySeal {
          width: 300px;
          height: 300px;
          margin-inline: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid #68ebb0;
          background: radial-gradient(
            circle,
            rgba(105, 236, 177, 0.16),
            rgba(3, 24, 28, 0.95)
          );
          box-shadow: 0 0 70px rgba(74, 221, 165, 0.18);
        }

        .academySeal small {
          color: #70aa95;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .academySeal strong {
          color: #baffd8;
          font: 700 46px Georgia, serif;
        }

        .academySeal span {
          margin-top: 8px;
          color: #65dba8;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.15em;
        }

        .academyCopy h2 {
          margin: 12px 0 17px;
          font-size: clamp(40px, 4.7vw, 70px);
          line-height: 0.99;
        }

        .academyCopy > p:not(.eyebrow) {
          color: #a6bbb5;
          font-size: 15px;
          line-height: 1.72;
        }

        .academyGrid {
          margin-top: 22px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .academyGrid article {
          padding: 14px;
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 11px;
          border: 1px solid rgba(103, 233, 172, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
        }

        .academyGrid article > span {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          border: 1px solid rgba(103, 233, 172, 0.24);
          color: #6fe0ac;
          font-size: 8px;
        }

        .academyGrid strong {
          font-size: 11px;
        }

        .academyGrid p {
          margin: 5px 0 0;
          color: #78918a;
          font-size: 9px;
          line-height: 1.45;
        }

        .academyActions {
          justify-content: flex-start;
        }

        .closing {
          text-align: center;
        }

        .closing h2 {
          max-width: 1120px;
          margin: 13px auto 18px;
          font-size: clamp(42px, 5.4vw, 78px);
          line-height: 0.97;
        }

        .closing > p:not(.eyebrow) {
          max-width: 880px;
          margin-inline: auto;
          color: #9fb2ba;
          font-size: 16px;
          line-height: 1.72;
        }

        .closingActions {
          justify-content: center;
          margin-top: 28px;
        }

        footer {
          min-height: 82px;
          margin-top: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-top: 1px solid rgba(103, 225, 245, 0.12);
          color: #5f7984;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        @keyframes drift {
          to {
            transform: translate3d(60px, -35px, 0) scale(1.07);
          }
        }

        @keyframes packet {
          to {
            left: 100%;
          }
        }

        @media (max-width: 1120px) {
          .filters,
          .workspaceGrid,
          .classificationRule,
          .sectionHeading,
          .academySection {
            grid-template-columns: 1fr;
          }

          .typeIndex {
            position: static;
          }

          .matrixGrid {
            grid-template-columns: repeat(3, 1fr);
          }

          .failureGrid,
          .sequenceGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 760px) {
          .shell {
            width: calc(100% - 22px);
          }

          .topbar,
          .heroMetrics,
          .authorityStrip,
          .detailColumns,
          .academyCard,
          .academyGrid,
          .matrixGrid,
          .failureGrid,
          .sequenceGrid {
            grid-template-columns: 1fr;
          }

          .status {
            display: none;
          }

          .hero {
            padding: 64px 0;
          }

          .hero h1 {
            font-size: 52px;
          }

          .lead {
            font-size: 15px;
          }

          .typeDetail {
            padding: 19px;
          }

          .detailHeader {
            align-items: flex-start;
          }

          .actions,
          .academyActions,
          .closingActions {
            flex-direction: column;
          }

          .primaryAction,
          .secondaryAction,
          .academyAction {
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
