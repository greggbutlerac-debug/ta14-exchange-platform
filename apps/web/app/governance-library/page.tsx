"use client";

import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";

type NavItem = {
  label: string;
  href: string;
};

type Department = {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  detail: string;
  href: string;
  accent: string;
  force: string;
  companion: string;
};

type AuthorityCard = {
  code: string;
  title: string;
  jurisdiction: string;
  classification: string;
  summary: string;
  publisher: string;
  href: string;
  accent: string;
};

type Gateway = {
  code: string;
  title: string;
  description: string;
  accent: string;
  links: NavItem[];
};

const authorityFlow = [
  { code: "01", title: "Source", detail: "Official instrument and issuing authority" },
  { code: "02", title: "Force", detail: "Binding, normative, advisory, or educational" },
  { code: "03", title: "Applicability", detail: "Jurisdiction, role, sector, timing, and scope" },
  { code: "04", title: "Requirement", detail: "Duty, prohibition, exception, or condition" },
  { code: "05", title: "Evidence", detail: "Records capable of supporting the requirement" },
  { code: "06", title: "Route", detail: "Bindings, commitments, and execution boundaries" },
  { code: "07", title: "Decision", detail: "ALLOW, HOLD, DENY, or ESCALATE" },
  { code: "08", title: "Outcome", detail: "Preserved execution and reviewable result" },
];

const departments: Department[] = [
  {
    code: "LAW",
    title: "Current & Proposed Law",
    subtitle: "Binding and model authority",
    description:
      "Inspect enacted statutes, international instruments, model laws, and clearly labeled TA-14 legislative upgrades without confusing proposals with current law.",
    detail:
      "AI law · environmental law · public policy · proposed modernization · jurisdictional boundaries",
    href: "/governance-library/laws",
    accent: "#f2bf62",
    force: "Binding / proposed",
    companion: "Law & Standards Academy",
  },
  {
    code: "REG",
    title: "Regulations & Implementation",
    subtitle: "Operational legal duties",
    description:
      "Follow how statutes become enforceable through agency rules, permits, methods, reporting, inspection, implementation programs, and enforcement records.",
    detail:
      "Agency rules · 40 CFR pathways · implementation methods · regulated duties · enforcement",
    href: "/governance-library/regulations",
    accent: "#63e6ff",
    force: "Binding implementation",
    companion: "Applicability Engine",
  },
  {
    code: "STD",
    title: "Standards, Codes & Methods",
    subtitle: "Normative and technical systems",
    description:
      "Distinguish voluntary standards, accredited standards, model codes, incorporated editions, technical methods, and TA-14 modernization pathways.",
    detail:
      "ISO · ANSI · ASHRAE · IEEE · EPA methods · building codes · technical governance",
    href: "/governance-library/standards",
    accent: "#72e6b2",
    force: "Normative / adopted",
    companion: "Crosswalk Engine",
  },
  {
    code: "AC",
    title: "Law & Standards Academy",
    subtitle: "Institutional interpretation",
    description:
      "Learn what each instrument is, what it requires, what it leaves out, why the gap matters, and how governed implementation can be demonstrated.",
    detail:
      "Existing instrument → gap → consequence → upgrade → practical difference",
    href: "/academy",
    accent: "#c99cff",
    force: "Educational interpretation",
    companion: "Credentials & assessment",
  },
];

const environmentalAuthorities: AuthorityCard[] = [
  {
    code: "CAA",
    title: "Clean Air Act",
    jurisdiction: "United States",
    classification: "Binding law",
    summary:
      "Air pollution control, national ambient standards, hazardous pollutants, mobile sources, and stationary-source obligations.",
    publisher: "United States Congress / EPA",
    href: "/governance-library/laws",
    accent: "#63e6ff",
  },
  {
    code: "CWA",
    title: "Clean Water Act",
    jurisdiction: "United States",
    classification: "Binding law",
    summary:
      "Discharge controls, water-quality programs, permits, monitoring, enforcement, and restoration pathways.",
    publisher: "United States Congress / EPA",
    href: "/governance-library/laws",
    accent: "#67bfff",
  },
  {
    code: "SDWA",
    title: "Safe Drinking Water Act",
    jurisdiction: "United States",
    classification: "Binding law",
    summary:
      "Public drinking-water protection, contaminant standards, monitoring, reporting, and underground injection control.",
    publisher: "United States Congress / EPA",
    href: "/governance-library/laws",
    accent: "#74e2b4",
  },
  {
    code: "RCRA",
    title: "Resource Conservation and Recovery Act",
    jurisdiction: "United States",
    classification: "Binding law",
    summary:
      "Solid and hazardous waste governance from generation through treatment, storage, transportation, and disposal.",
    publisher: "United States Congress / EPA",
    href: "/governance-library/laws",
    accent: "#f2bf62",
  },
  {
    code: "CERCLA",
    title: "CERCLA / Superfund",
    jurisdiction: "United States",
    classification: "Binding law",
    summary:
      "Hazardous-release response, contaminated-site cleanup, liability, cost recovery, and long-term remediation.",
    publisher: "United States Congress / EPA",
    href: "/governance-library/laws",
    accent: "#ff9b73",
  },
  {
    code: "MP",
    title: "Montreal Protocol",
    jurisdiction: "International",
    classification: "International instrument",
    summary:
      "Global controls on ozone-depleting substances, phase-down commitments, reporting, and national implementation duties.",
    publisher: "United Nations Environment Programme",
    href: "/governance-library/laws",
    accent: "#c99cff",
  },
];

const aiAuthorities: AuthorityCard[] = [
  {
    code: "EU",
    title: "EU AI Act",
    jurisdiction: "European Union",
    classification: "Binding regulation",
    summary:
      "Risk classification, prohibited practices, provider and deployer duties, transparency, governance, and conformity pathways.",
    publisher: "European Union",
    href: "/workspace/ai-governance/eu-ai-act",
    accent: "#63e6ff",
  },
  {
    code: "42001",
    title: "ISO/IEC 42001",
    jurisdiction: "International",
    classification: "Management-system standard",
    summary:
      "Organizational requirements for establishing, implementing, maintaining, and continually improving an AI management system.",
    publisher: "ISO / IEC",
    href: "/governance-library/standards",
    accent: "#72e6b2",
  },
  {
    code: "RMF",
    title: "NIST AI Risk Management Framework",
    jurisdiction: "United States",
    classification: "Voluntary framework",
    summary:
      "A structured approach to governing, mapping, measuring, and managing AI risks across organizational activity.",
    publisher: "National Institute of Standards and Technology",
    href: "/governance-library/frameworks",
    accent: "#f2bf62",
  },
  {
    code: "OECD",
    title: "OECD AI Principles",
    jurisdiction: "International",
    classification: "Intergovernmental principles",
    summary:
      "Values-based principles and policy recommendations for trustworthy AI, accountability, transparency, and human-centered outcomes.",
    publisher: "OECD",
    href: "/governance-library/principles",
    accent: "#c99cff",
  },
  {
    code: "IEEE",
    title: "IEEE AI Governance Sources",
    jurisdiction: "International",
    classification: "Technical and ethical standards",
    summary:
      "Technical, ethical, transparency, impact, and assurance sources supporting responsible design and implementation.",
    publisher: "IEEE Standards Association",
    href: "/governance-library/standards",
    accent: "#67bfff",
  },
  {
    code: "TA14",
    title: "TA-14 Admissible Execution Architecture",
    jurisdiction: "Institutional architecture",
    classification: "Governance system",
    summary:
      "A governed chain connecting reality, evidence, authority, commitment, execution, and preserved outcome.",
    publisher: "TA-14 Authority",
    href: "/workspace/ai-governance",
    accent: "#ffcf71",
  },
];

const crosswalks = [
  {
    left: "EU AI Act",
    right: "ISO/IEC 42001",
    purpose: "Compare legal obligations with management-system controls and evidence expectations.",
    href: "/governance-library/compare",
  },
  {
    left: "ISO/IEC 42001",
    right: "NIST AI RMF",
    purpose: "Examine governance, risk, measurement, organizational, and lifecycle alignment.",
    href: "/governance-library/crosswalks",
  },
  {
    left: "Clean Air Act",
    right: "EPA Implementation",
    purpose: "Trace statutory authority into rules, permits, methods, monitoring, and enforcement.",
    href: "/governance-library/regulations",
  },
  {
    left: "Current Authority",
    right: "TA-14 Modernization",
    purpose: "Preserve the distinction between what exists and what TA-14 proposes to improve.",
    href: "/governance-library/coverage",
  },
];

const gateways: Gateway[] = [
  {
    code: "01",
    title: "Learn",
    description:
      "Understand the authority landscape before making compliance, governance, or execution claims.",
    accent: "#63e6ff",
    links: [
      { label: "Laws", href: "/governance-library/laws" },
      { label: "Regulations", href: "/governance-library/regulations" },
      { label: "Standards", href: "/governance-library/standards" },
      { label: "Frameworks", href: "/governance-library/frameworks" },
      { label: "Principles", href: "/governance-library/principles" },
      { label: "Academy", href: "/academy" },
    ],
  },
  {
    code: "02",
    title: "Determine",
    description:
      "Identify which authorities, jurisdictions, roles, sectors, lifecycle stages, and risk conditions apply.",
    accent: "#72e6b2",
    links: [
      { label: "Applicability Engine", href: "/governance-library/applicability" },
      { label: "Jurisdictions", href: "/governance-library/jurisdiction" },
      { label: "Governance Roles", href: "/governance-library/roles" },
      { label: "Sector Governance", href: "/governance-library/sector-governance" },
      { label: "Risk Management", href: "/governance-library/risk-management" },
      { label: "Lifecycle Governance", href: "/governance-library/lifecycle" },
    ],
  },
  {
    code: "03",
    title: "Build",
    description:
      "Translate applicable requirements into mappings, evidence expectations, governed records, and execution routes.",
    accent: "#f2bf62",
    links: [
      { label: "Crosswalk Engine", href: "/governance-library/crosswalks" },
      { label: "Compare Sources", href: "/governance-library/compare" },
      { label: "Coverage Analysis", href: "/governance-library/coverage" },
      { label: "Governed Records", href: "/governance-library/governed-records" },
      { label: "Route Builder", href: "/workspace/routes/new" },
    ],
  },
  {
    code: "04",
    title: "Verify",
    description:
      "Test claims, preserve source identity, examine assurance boundaries, and maintain reviewable evidence over time.",
    accent: "#c99cff",
    links: [
      { label: "Testing", href: "/governance-library/testing" },
      { label: "Assurance", href: "/governance-library/assurance" },
      { label: "References", href: "/governance-library/references" },
      { label: "Authorities", href: "/governance-library/authorities" },
      { label: "Timeline", href: "/governance-library/timeline" },
      { label: "Source Index", href: "/governance-library/sources" },
    ],
  },
];

const collections = [
  ["AI", "AI Governance", "Laws, standards, risk, assurance, roles, transparency, evidence, and execution."],
  ["ENV", "Environmental Integrity", "Air, water, chemicals, waste, buildings, measurement, and public-health authority."],
  ["BLD", "Buildings & Infrastructure", "Codes, HVAC, facility systems, controls, safety, operations, and evidence continuity."],
  ["HLT", "Healthcare", "Clinical governance, privacy, safety, decision support, accountability, and consequential use."],
  ["FIN", "Financial Systems", "Risk, consumer protection, model governance, authorization, execution, and record integrity."],
  ["PUB", "Public Services", "Procurement, civil rights, automated decisions, public authority, due process, and oversight."],
] as const;

const intelligenceLinks: NavItem[] = [
  { label: "Library Dashboard", href: "/governance-library/dashboard" },
  { label: "AI Governance Dictionary", href: "/governance-library/dictionary" },
  { label: "Governance Glossary", href: "/governance-library/glossary" },
  { label: "Relationship Map", href: "/governance-library/relationships" },
  { label: "Topic Map", href: "/governance-library/topic-map" },
  { label: "Publisher Matrix", href: "/governance-library/publisher-matrix" },
  { label: "Authority Timeline", href: "/governance-library/timeline" },
  { label: "Source Intelligence", href: "/governance-library/sources" },
];

const journey = ["Learn", "Determine", "Map", "Build", "Test", "Review", "Verify", "Export"];

export default function GovernanceLibraryPage() {
  const [query, setQuery] = useState("");
  const [activeDomain, setActiveDomain] = useState<"ai" | "environmental">("ai");

  const visibleAuthorities = useMemo(() => {
    const base = activeDomain === "ai" ? aiAuthorities : environmentalAuthorities;
    const normalized = query.trim().toLowerCase();
    if (!normalized) return base;
    return base.filter((item) =>
      [item.code, item.title, item.jurisdiction, item.classification, item.summary, item.publisher]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [activeDomain, query]);

  return (
    <main className="libraryPage">
      <div className="ambient ambientOne" />
      <div className="ambient ambientTwo" />
      <div className="gridOverlay" />

      <section className="shell">
        <nav className="topbar" aria-label="Governance Library utility navigation">
          <Link href="/" className="button quiet">
            ← TA14Authority.org
          </Link>
          <div className="topbarCenter">
            <span className="statusDot" />
            Institutional governance intelligence
          </div>
          <Link href="/law-standards-public-policy" className="button primary">
            Institutional Home →
          </Link>
        </nav>

        <header className="hero">
          <div className="heroContent">
            <div className="heroMark" aria-hidden="true">
              <div className="heroOrbit orbitOne" />
              <div className="heroOrbit orbitTwo" />
              <div className="seal">
                <span>GL</span>
                <small>TA-14</small>
              </div>
            </div>

            <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE LIBRARY</p>
            <h1>
              Decode authority.
              <span> Govern with evidence.</span>
            </h1>
            <p className="lead">
              The institutional intelligence system for understanding law, regulation, standards,
              frameworks, principles, technical methods, governance systems, and their relationship
              to admissible execution. Every source remains connected to its issuer, force, version,
              applicability boundary, evidence expectations, Academy explanation, and TA-14 route.
            </p>

            <div className="heroActions">
              <Link href="/governance-library/applicability" className="button primary">
                Find What Applies →
              </Link>
              <Link href="/governance-library/compare" className="button secondaryButton">
                Compare Authorities →
              </Link>
              <Link href="/workspace/routes/new" className="button goldButton">
                Build a TA-14 Route →
              </Link>
              <Link href="/academy" className="button quiet">
                Enter the Academy →
              </Link>
            </div>
          </div>

          <aside className="commandDeck" aria-label="Library command deck">
            <div className="commandHeader">
              <div>
                <span>Institutional command deck</span>
                <strong>Authority intelligence</strong>
              </div>
              <b>LIVE</b>
            </div>

            <div className="commandMetrics">
              <article>
                <span>Scope</span>
                <strong>Global</strong>
                <small>Multi-jurisdiction source landscape</small>
              </article>
              <article>
                <span>Authority systems</span>
                <strong>4</strong>
                <small>Law, regulation, standards, interpretation</small>
              </article>
              <article>
                <span>Execution path</span>
                <strong>TA-14</strong>
                <small>Evidence to governed outcome</small>
              </article>
              <article>
                <span>Source state</span>
                <strong>Versioned</strong>
                <small>Issuer, dates, force, and review history</small>
              </article>
            </div>

            <div className="commandRoute">
              <span>PRIMARY WORKFLOW</span>
              <strong>Learn → Determine → Build → Verify</strong>
            </div>
          </aside>
        </header>

        <section className="authorityMap sectionFrame">
          <div className="sectionHeading compactHeading">
            <div>
              <p className="eyebrow gold">AUTHORITY RELATIONSHIP MAP</p>
              <h2>See how authority becomes governed action.</h2>
            </div>
            <p>
              The Library does not stop at source discovery. It preserves the route from official
              authority through applicability, evidence, decision, execution, and outcome.
            </p>
          </div>

          <div className="flowRail">
            {authorityFlow.map((step, index) => (
              <article className="flowNode" key={step.title}>
                <div className="flowCode">{step.code}</div>
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
                {index < authorityFlow.length - 1 ? <i aria-hidden="true">→</i> : null}
              </article>
            ))}
          </div>
        </section>

        <section className="departmentSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow gold">INSTITUTIONAL AUTHORITY SYSTEMS</p>
              <h2>One Library. Four distinct forms of institutional authority.</h2>
            </div>
            <p>
              Law, regulation, standards, and Academy interpretation remain connected without being
              collapsed. Each department preserves its own force, issuer, adoption pathway,
              applicability, evidence burden, and limitations.
            </p>
          </div>

          <div className="departmentGrid">
            {departments.map((department) => (
              <Link
                href={department.href}
                className="departmentCard"
                key={department.code}
                style={{ "--departmentAccent": department.accent } as CSSProperties}
              >
                <div className="departmentTop">
                  <span className="departmentCode">{department.code}</span>
                  <small>{department.subtitle}</small>
                </div>
                <h3>{department.title}</h3>
                <p>{department.description}</p>
                <div className="departmentMeta">
                  <span>
                    <small>Force</small>
                    <strong>{department.force}</strong>
                  </span>
                  <span>
                    <small>Connected system</small>
                    <strong>{department.companion}</strong>
                  </span>
                </div>
                <div className="departmentDetail">{department.detail}</div>
                <div className="cardAction">
                  <strong>Enter department</strong>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="authorityExplorer sectionFrame">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">FEATURED AUTHORITY COLLECTIONS</p>
              <h2>AI governance and environmental authority in one institutional landscape.</h2>
            </div>
            <p>
              Explore sources without losing the boundary between binding law, voluntary standards,
              frameworks, principles, institutional architecture, and educational interpretation.
            </p>
          </div>

          <div className="explorerToolbar">
            <div className="domainTabs" role="tablist" aria-label="Authority domain">
              <button
                type="button"
                className={activeDomain === "ai" ? "active" : ""}
                onClick={() => setActiveDomain("ai")}
              >
                AI Governance
              </button>
              <button
                type="button"
                className={activeDomain === "environmental" ? "active" : ""}
                onClick={() => setActiveDomain("environmental")}
              >
                Environmental Integrity
              </button>
            </div>

            <label className="searchBox">
              <span>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this authority collection"
              />
            </label>
          </div>

          <div className="authorityGrid">
            {visibleAuthorities.map((authority, index) => (
              <Link
                href={authority.href}
                className="authorityCard"
                key={authority.title}
                style={{ "--authorityAccent": authority.accent } as CSSProperties}
              >
                <div className="authorityTop">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{authority.code}</b>
                  <small>{authority.classification}</small>
                </div>
                <div className="authorityJurisdiction">{authority.jurisdiction}</div>
                <h3>{authority.title}</h3>
                <p>{authority.summary}</p>
                <div className="authorityPublisher">
                  <small>Issuer / publisher</small>
                  <strong>{authority.publisher}</strong>
                </div>
                <div className="cardAction">
                  <strong>Inspect authority</strong>
                  <span>↗</span>
                </div>
              </Link>
            ))}
          </div>

          {visibleAuthorities.length === 0 ? (
            <div className="emptyState">
              <span>NO MATCHING AUTHORITY</span>
              <strong>Try a broader title, issuer, jurisdiction, or source class.</strong>
            </div>
          ) : null}
        </section>

        <section className="comparisonSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow gold">FEATURED CROSSWALKS</p>
              <h2>Compare authority without pretending different sources are equivalent.</h2>
            </div>
            <p>
              Crosswalks expose overlap, gaps, evidence expectations, and implementation boundaries.
              They do not convert a voluntary source into a legal obligation or a summary into an
              official instrument.
            </p>
          </div>

          <div className="crosswalkGrid">
            {crosswalks.map((crosswalk, index) => (
              <Link href={crosswalk.href} className="crosswalkCard" key={crosswalk.left + crosswalk.right}>
                <span className="crosswalkNumber">{String(index + 1).padStart(2, "0")}</span>
                <div className="crosswalkPair">
                  <strong>{crosswalk.left}</strong>
                  <i>↔</i>
                  <strong>{crosswalk.right}</strong>
                </div>
                <p>{crosswalk.purpose}</p>
                <div className="cardAction">
                  <strong>Open comparison</strong>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="applicabilityPanel sectionFrame">
          <div className="applicabilityCopy">
            <p className="eyebrow gold">APPLICABILITY ENGINE</p>
            <h2>A jurisdiction name is never enough.</h2>
            <p>
              Applicability depends on the actor, system, activity, geography, sector, lifecycle
              stage, timing, risk condition, and legal trigger attached to the proposed action.
            </p>
            <Link href="/governance-library/applicability" className="button goldButton">
              Find What Applies →
            </Link>
          </div>

          <div className="applicabilityQuestions">
            {[
              ["01", "Where?", "Jurisdiction and geographic reach"],
              ["02", "Who?", "Provider, deployer, operator, reviewer, or authority"],
              ["03", "What?", "System, capability, activity, or consequential use"],
              ["04", "When?", "Effective date, lifecycle stage, and triggering event"],
              ["05", "Which sector?", "Healthcare, finance, buildings, public service, or another domain"],
              ["06", "What evidence?", "Records that support or fail to support each requirement"],
            ].map(([code, title, detail]) => (
              <article key={code}>
                <span>{code}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="journeyPanel">
          <div className="journeyIntro">
            <p className="eyebrow gold">GOVERNANCE JOURNEY</p>
            <h2>Move from understanding to preserved proof.</h2>
          </div>
          <div className="journey">
            {journey.map((label, index) => (
              <div className="journeyStep" key={label}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{label}</strong>
                {index < journey.length - 1 ? <i aria-hidden="true">→</i> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="gatewaySection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">INSTITUTIONAL GATEWAYS</p>
              <h2>Four ways into the governance operating system.</h2>
            </div>
            <p>
              Enter through the work you need to perform: understand authority, determine
              applicability, build controlled execution, or verify what can be proved.
            </p>
          </div>

          <div className="gatewayGrid">
            {gateways.map((gateway) => (
              <article
                className="gatewayCard"
                key={gateway.title}
                style={{ "--accent": gateway.accent } as CSSProperties}
              >
                <div className="gatewayGlow" />
                <div className="gatewayHeader">
                  <span className="gatewayCode">{gateway.code}</span>
                  <span className="gatewayStatus">Institutional gateway</span>
                </div>
                <h3>{gateway.title}</h3>
                <p className="gatewayDescription">{gateway.description}</p>
                <div className="gatewayLinks">
                  {gateway.links.map((link) => (
                    <Link href={link.href} className="gatewayLink" key={link.href}>
                      <span>{link.label}</span>
                      <i aria-hidden="true">→</i>
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="collectionsSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow gold">INSTITUTIONAL COLLECTIONS</p>
              <h2>Browse by domain, not only by source type.</h2>
            </div>
            <p>
              Consequential governance rarely belongs to one instrument class. Collections bring
              together the laws, standards, frameworks, roles, evidence, and routes relevant to a
              real operational domain.
            </p>
          </div>

          <div className="collectionGrid">
            {collections.map(([code, title, description]) => (
              <Link href="/governance-library/topics" className="collectionCard" key={code}>
                <span>{code}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <strong>Explore collection →</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="intelligenceSection sectionFrame">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">LIBRARY INTELLIGENCE</p>
              <h2>Navigate the source landscape from every angle.</h2>
            </div>
            <p>
              Search definitions, inspect relationships, follow publishers, compare source classes,
              trace versions, and understand how governance records connect across the institution.
            </p>
          </div>

          <div className="intelligenceGrid">
            {intelligenceLinks.map((link, index) => (
              <Link href={link.href} className="intelligenceCard" key={link.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{link.label}</strong>
                <i aria-hidden="true">→</i>
              </Link>
            ))}
          </div>
        </section>

        <section className="boundary">
          <div className="boundaryHalo" />
          <div className="boundarySeal">
            <span>SB</span>
            <small>Source boundary</small>
          </div>
          <p className="eyebrow gold">SOURCE AND INTERPRETATION BOUNDARY</p>
          <h2>The Library explains governance. It does not fabricate authority.</h2>
          <p>
            Every entry should preserve the issuing body, official source, version, dates, legal or
            normative force, interpretation status, relationships, unresolved questions, and review
            history. TA-14 summaries, Academy lessons, crosswalks, and execution routes do not replace
            official source materials, legal advice, accreditation, conformity assessment, or
            independent certification.
          </p>

          <div className="boundaryGrid">
            <article>
              <span>PROVES</span>
              <strong>Source identity, interpreted scope, and preserved relationships</strong>
            </article>
            <article>
              <span>DOES NOT PROVE</span>
              <strong>Certification, legal advice, accreditation, or conformity</strong>
            </article>
            <article>
              <span>REQUIRES</span>
              <strong>Review, evidence, authority, applicability, and version control</strong>
            </article>
          </div>
        </section>

        <section className="finalCta">
          <p className="eyebrow">READY TO GOVERN?</p>
          <h2>Understand authority. Determine applicability. Build governed execution. Preserve proof.</h2>
          <p>
            The Library is the beginning of the route—not the end. Move from source intelligence to
            evidence-backed governance and inspectable execution.
          </p>
          <div className="finalActions">
            <Link href="/governance-library/applicability" className="button primary">
              Find What Applies →
            </Link>
            <Link href="/governance-library/compare" className="button secondaryButton">
              Compare Authorities →
            </Link>
            <Link href="/workspace/routes/new" className="button goldButton">
              Build a Route →
            </Link>
            <Link href="/academy" className="button quiet">
              Enter the Academy →
            </Link>
          </div>
          <div className="doctrine">
            <span>◆</span>
            <strong>No admissible evidence. No admissible execution.</strong>
          </div>
        </section>
      </section>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        .libraryPage {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: #f7fbff;
          background:
            radial-gradient(circle at 50% -10%, rgba(31, 120, 169, 0.2), transparent 35%),
            radial-gradient(circle at 8% 34%, rgba(65, 203, 227, 0.08), transparent 24%),
            radial-gradient(circle at 88% 66%, rgba(239, 185, 89, 0.075), transparent 27%),
            linear-gradient(180deg, #04101b 0%, #020913 48%, #01060c 100%);
        }

        .ambient,
        .gridOverlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
        }

        .ambientOne {
          background: radial-gradient(circle at 20% 10%, rgba(99, 230, 255, 0.08), transparent 24%);
          animation: driftOne 14s ease-in-out infinite alternate;
        }

        .ambientTwo {
          background: radial-gradient(circle at 78% 34%, rgba(255, 197, 82, 0.06), transparent 23%);
          animation: driftTwo 17s ease-in-out infinite alternate;
        }

        .gridOverlay {
          opacity: 0.16;
          background-image:
            linear-gradient(rgba(255, 255, 255, 0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.018) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        .shell {
          position: relative;
          z-index: 2;
          width: min(1480px, calc(100% - 40px));
          margin: auto;
          padding: 24px 0 96px;
        }

        .topbar {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(8, 26, 42, 0.88), rgba(4, 15, 26, 0.76));
          box-shadow: 0 16px 50px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(18px);
        }

        .topbarCenter {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #8fa9b6;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .statusDot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #72e6b2;
          box-shadow: 0 0 16px rgba(114, 230, 178, 0.9);
        }

        .button {
          min-height: 46px;
          padding: 0 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          transition: transform 0.22s, border-color 0.22s, box-shadow 0.22s, filter 0.22s;
        }

        .button:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }

        .quiet {
          justify-self: start;
          color: #c4d5de;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.18);
        }

        .primary {
          justify-self: end;
          color: #041a23;
          border: 1px solid #aaf2ff;
          background: linear-gradient(135deg, #d9fbff, #76deef 64%, #38aeca);
          box-shadow: 0 10px 30px rgba(76, 204, 226, 0.18);
        }

        .secondaryButton {
          color: #dffbff;
          border: 1px solid rgba(104, 224, 245, 0.34);
          background: linear-gradient(135deg, rgba(34, 123, 151, 0.35), rgba(7, 31, 45, 0.8));
        }

        .goldButton {
          color: #241704;
          border: 1px solid #ffe09a;
          background: linear-gradient(135deg, #fff0bd, #eeb84b);
          box-shadow: 0 10px 30px rgba(238, 184, 75, 0.16);
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(340px, 0.65fr);
          align-items: center;
          gap: 52px;
          padding: 86px 18px 68px;
        }

        .heroContent {
          min-width: 0;
        }

        .heroMark {
          position: relative;
          width: 126px;
          height: 126px;
          margin-bottom: 28px;
          display: grid;
          place-items: center;
        }

        .heroOrbit {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(99, 230, 255, 0.18);
          border-radius: 50%;
        }

        .orbitOne {
          transform: rotate(18deg) scaleX(1.16);
          animation: rotateOne 16s linear infinite;
        }

        .orbitTwo {
          transform: rotate(-32deg) scaleY(1.12);
          border-color: rgba(255, 199, 82, 0.14);
          animation: rotateTwo 22s linear infinite reverse;
        }

        .seal {
          position: relative;
          z-index: 2;
          width: 94px;
          height: 94px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 199, 82, 0.44);
          border-radius: 50%;
          color: #ffe5a0;
          background: radial-gradient(circle, rgba(255, 193, 64, 0.12), rgba(4, 18, 30, 0.95) 68%);
          box-shadow: 0 0 60px rgba(255, 193, 64, 0.11), inset 0 0 30px rgba(255, 255, 255, 0.03);
        }

        .seal span {
          font: 900 30px Georgia, serif;
        }

        .seal small {
          color: #8da6b2;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.2em;
        }

        .eyebrow {
          margin: 0;
          color: #6fe8ff;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }

        .eyebrow.gold {
          color: #efbd59;
        }

        h1,
        h2,
        h3 {
          font-family: Georgia, "Times New Roman", serif;
        }

        .hero h1 {
          max-width: 980px;
          margin: 15px 0 0;
          font-size: clamp(58px, 6.6vw, 104px);
          line-height: 0.92;
          letter-spacing: -0.058em;
          text-wrap: balance;
        }

        .hero h1 span {
          display: block;
          color: #9fb4bf;
          font-style: italic;
          font-weight: 500;
        }

        .lead {
          max-width: 920px;
          margin: 28px 0 0;
          color: #afc1ca;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroActions {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .heroActions .button {
          justify-self: auto;
        }

        .commandDeck {
          padding: 22px;
          border: 1px solid rgba(99, 230, 255, 0.2);
          border-radius: 28px;
          background:
            radial-gradient(circle at 100% 0, rgba(99, 230, 255, 0.09), transparent 35%),
            linear-gradient(145deg, rgba(9, 30, 47, 0.96), rgba(3, 13, 23, 0.98));
          box-shadow: 0 28px 72px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }

        .commandHeader {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 14px;
          padding-bottom: 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .commandHeader span,
        .commandHeader strong {
          display: block;
        }

        .commandHeader span {
          color: #6fe8ff;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .commandHeader strong {
          margin-top: 6px;
          font: 700 24px Georgia, serif;
        }

        .commandHeader b {
          padding: 7px 9px;
          border: 1px solid rgba(114, 230, 178, 0.3);
          border-radius: 999px;
          color: #72e6b2;
          background: rgba(114, 230, 178, 0.08);
          font-size: 8px;
          letter-spacing: 0.12em;
        }

        .commandMetrics {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 16px;
        }

        .commandMetrics article {
          min-height: 116px;
          padding: 15px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: rgba(0, 0, 0, 0.18);
        }

        .commandMetrics span,
        .commandMetrics strong,
        .commandMetrics small {
          display: block;
        }

        .commandMetrics span {
          color: #718994;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .commandMetrics strong {
          margin-top: 8px;
          color: #f0d28f;
          font: 700 25px Georgia, serif;
        }

        .commandMetrics small {
          margin-top: 7px;
          color: #8298a3;
          font-size: 10px;
          line-height: 1.45;
        }

        .commandRoute {
          margin-top: 12px;
          padding: 16px;
          border: 1px solid rgba(242, 191, 98, 0.18);
          border-radius: 15px;
          background: rgba(242, 191, 98, 0.055);
        }

        .commandRoute span,
        .commandRoute strong {
          display: block;
        }

        .commandRoute span {
          color: #a68b56;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .commandRoute strong {
          margin-top: 7px;
          color: #f7deb0;
          font-size: 12px;
        }

        .sectionFrame {
          padding: 34px;
          border: 1px solid rgba(255, 255, 255, 0.085);
          border-radius: 30px;
          background: linear-gradient(145deg, rgba(9, 29, 45, 0.82), rgba(3, 12, 21, 0.92));
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.025);
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
          align-items: end;
          gap: 42px;
          margin-bottom: 34px;
        }

        .compactHeading {
          margin-bottom: 24px;
        }

        .sectionHeading h2,
        .boundary h2,
        .finalCta h2,
        .applicabilityCopy h2 {
          margin: 12px 0 0;
          font-size: clamp(40px, 4.6vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.048em;
        }

        .sectionHeading > p,
        .applicabilityCopy > p:not(.eyebrow) {
          margin: 0;
          color: #98adb7;
          font-size: 15px;
          line-height: 1.75;
        }

        .flowRail {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 10px;
        }

        .flowNode {
          position: relative;
          min-height: 172px;
          padding: 16px;
          border: 1px solid rgba(99, 230, 255, 0.12);
          border-radius: 17px;
          background: rgba(1, 9, 16, 0.43);
        }

        .flowCode {
          color: #6fe8ff;
          font-size: 9px;
          font-weight: 900;
        }

        .flowNode strong {
          display: block;
          margin-top: 18px;
          color: #edfafe;
          font-size: 12px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .flowNode p {
          margin: 10px 0 0;
          color: #8299a4;
          font-size: 11px;
          line-height: 1.55;
        }

        .flowNode i {
          position: absolute;
          z-index: 3;
          top: 74px;
          right: -10px;
          color: #f2bf62;
          font-style: normal;
        }

        .departmentSection,
        .comparisonSection,
        .gatewaySection,
        .collectionsSection {
          padding-top: 88px;
        }

        .departmentGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .departmentCard {
          --departmentAccent: #63e6ff;
          position: relative;
          min-height: 430px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          color: inherit;
          text-decoration: none;
          border: 1px solid color-mix(in srgb, var(--departmentAccent) 30%, rgba(255, 255, 255, 0.05));
          border-radius: 28px;
          background:
            radial-gradient(circle at 100% 0, color-mix(in srgb, var(--departmentAccent) 12%, transparent), transparent 35%),
            linear-gradient(145deg, rgba(10, 29, 46, 0.96), rgba(4, 13, 23, 0.99));
          box-shadow: 0 24px 58px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.025);
          transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
        }

        .departmentCard:hover {
          transform: translateY(-7px);
          border-color: var(--departmentAccent);
          box-shadow: 0 32px 76px rgba(0, 0, 0, 0.38), 0 0 36px color-mix(in srgb, var(--departmentAccent) 10%, transparent);
        }

        .departmentTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .departmentCode {
          width: 66px;
          height: 66px;
          display: grid;
          place-items: center;
          border: 1px solid var(--departmentAccent);
          border-radius: 18px;
          color: var(--departmentAccent);
          background: rgba(0, 0, 0, 0.2);
          font-size: 14px;
          font-weight: 950;
        }

        .departmentTop small {
          color: #738b97;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .departmentCard h3 {
          margin: 26px 0 0;
          font-size: clamp(34px, 3vw, 48px);
          line-height: 1;
        }

        .departmentCard > p {
          margin: 16px 0 0;
          color: #9db1bb;
          font-size: 15px;
          line-height: 1.7;
        }

        .departmentMeta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 24px;
        }

        .departmentMeta span {
          padding: 13px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.17);
        }

        .departmentMeta small,
        .departmentMeta strong {
          display: block;
        }

        .departmentMeta small {
          color: #6f8792;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .departmentMeta strong {
          margin-top: 6px;
          color: #dbe8ec;
          font-size: 11px;
        }

        .departmentDetail {
          flex: 1;
          margin-top: 18px;
          color: #7f96a1;
          font-size: 11px;
          line-height: 1.6;
        }

        .cardAction {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          color: #8fefff;
          font-size: 11px;
          letter-spacing: 0.04em;
        }

        .cardAction span {
          font-size: 18px;
        }

        .authorityExplorer {
          margin-top: 88px;
        }

        .explorerToolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 22px;
        }

        .domainTabs {
          display: flex;
          gap: 8px;
          padding: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.18);
        }

        .domainTabs button {
          min-height: 42px;
          padding: 0 16px;
          border: 1px solid transparent;
          border-radius: 10px;
          color: #8ea4ae;
          background: transparent;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .domainTabs button.active {
          color: #041a23;
          border-color: #aaf2ff;
          background: linear-gradient(135deg, #d9fbff, #76deef);
        }

        .searchBox {
          width: min(420px, 100%);
          min-height: 52px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(99, 230, 255, 0.17);
          border-radius: 14px;
          background: rgba(0, 0, 0, 0.2);
        }

        .searchBox span {
          color: #6fe8ff;
          font-size: 18px;
        }

        .searchBox input {
          width: 100%;
          border: 0;
          outline: 0;
          color: #ecfaff;
          background: transparent;
          font: inherit;
          font-size: 12px;
        }

        .searchBox input::placeholder {
          color: #627a86;
        }

        .authorityGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .authorityCard {
          --authorityAccent: #63e6ff;
          min-height: 390px;
          padding: 22px;
          display: flex;
          flex-direction: column;
          color: inherit;
          text-decoration: none;
          border: 1px solid color-mix(in srgb, var(--authorityAccent) 25%, rgba(255, 255, 255, 0.04));
          border-radius: 23px;
          background:
            radial-gradient(circle at 100% 0, color-mix(in srgb, var(--authorityAccent) 10%, transparent), transparent 35%),
            linear-gradient(145deg, rgba(10, 30, 46, 0.94), rgba(3, 12, 21, 0.98));
          transition: transform 0.24s, border-color 0.24s, box-shadow 0.24s;
        }

        .authorityCard:hover {
          transform: translateY(-6px);
          border-color: var(--authorityAccent);
          box-shadow: 0 28px 62px rgba(0, 0, 0, 0.34);
        }

        .authorityTop {
          display: grid;
          grid-template-columns: auto auto 1fr;
          align-items: center;
          gap: 10px;
        }

        .authorityTop span {
          color: #6e8792;
          font-size: 8px;
          font-weight: 900;
        }

        .authorityTop b {
          min-width: 48px;
          min-height: 42px;
          padding: 0 9px;
          display: grid;
          place-items: center;
          border: 1px solid var(--authorityAccent);
          border-radius: 11px;
          color: var(--authorityAccent);
          font-size: 10px;
        }

        .authorityTop small {
          justify-self: end;
          color: #718893;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .authorityJurisdiction {
          margin-top: 24px;
          color: var(--authorityAccent);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.11em;
          text-transform: uppercase;
        }

        .authorityCard h3 {
          margin: 9px 0 0;
          font-size: 29px;
          line-height: 1.04;
        }

        .authorityCard > p {
          flex: 1;
          margin: 14px 0 0;
          color: #96abb5;
          font-size: 13px;
          line-height: 1.68;
        }

        .authorityPublisher {
          margin-top: 17px;
          padding: 13px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.16);
        }

        .authorityPublisher small,
        .authorityPublisher strong {
          display: block;
        }

        .authorityPublisher small {
          color: #69808b;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .authorityPublisher strong {
          margin-top: 6px;
          color: #d6e5ea;
          font-size: 10px;
          line-height: 1.45;
        }

        .emptyState {
          padding: 34px;
          border: 1px dashed rgba(99, 230, 255, 0.25);
          border-radius: 20px;
          text-align: center;
        }

        .emptyState span,
        .emptyState strong {
          display: block;
        }

        .emptyState span {
          color: #6fe8ff;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.13em;
        }

        .emptyState strong {
          margin-top: 10px;
          color: #a8bbc4;
          font-size: 13px;
        }

        .crosswalkGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .crosswalkCard {
          min-height: 270px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          color: inherit;
          text-decoration: none;
          border: 1px solid rgba(242, 191, 98, 0.18);
          border-radius: 24px;
          background:
            radial-gradient(circle at 50% 0, rgba(242, 191, 98, 0.08), transparent 38%),
            linear-gradient(145deg, rgba(13, 29, 42, 0.94), rgba(4, 13, 22, 0.99));
          transition: transform 0.24s, border-color 0.24s;
        }

        .crosswalkCard:hover {
          transform: translateY(-5px);
          border-color: rgba(242, 191, 98, 0.5);
        }

        .crosswalkNumber {
          color: #ad915e;
          font-size: 9px;
          font-weight: 900;
        }

        .crosswalkPair {
          margin-top: 28px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
        }

        .crosswalkPair strong {
          font: 700 24px/1.08 Georgia, serif;
        }

        .crosswalkPair i {
          color: #f2bf62;
          font-style: normal;
          font-size: 24px;
        }

        .crosswalkCard > p {
          flex: 1;
          margin: 20px 0 0;
          color: #97aab3;
          font-size: 13px;
          line-height: 1.65;
        }

        .applicabilityPanel {
          margin-top: 88px;
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: 36px;
          align-items: center;
          border-color: rgba(242, 191, 98, 0.18);
          background:
            radial-gradient(circle at 0 0, rgba(242, 191, 98, 0.1), transparent 35%),
            linear-gradient(145deg, rgba(11, 29, 44, 0.95), rgba(3, 12, 21, 0.99));
        }

        .applicabilityCopy > p:not(.eyebrow) {
          margin-top: 18px;
        }

        .applicabilityCopy .button {
          margin-top: 24px;
        }

        .applicabilityQuestions {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .applicabilityQuestions article {
          min-height: 116px;
          padding: 16px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 13px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 15px;
          background: rgba(0, 0, 0, 0.18);
        }

        .applicabilityQuestions article > span {
          width: 35px;
          height: 35px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(242, 191, 98, 0.32);
          border-radius: 10px;
          color: #f2bf62;
          font-size: 8px;
          font-weight: 900;
        }

        .applicabilityQuestions strong {
          color: #eef8fb;
          font-size: 12px;
        }

        .applicabilityQuestions p {
          margin: 6px 0 0;
          color: #8197a1;
          font-size: 10px;
          line-height: 1.5;
        }

        .journeyPanel {
          margin-top: 88px;
          padding: 32px;
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          gap: 34px;
          align-items: center;
          border: 1px solid rgba(255, 197, 82, 0.18);
          border-radius: 28px;
          background:
            radial-gradient(circle at 0 0, rgba(255, 193, 64, 0.09), transparent 30%),
            linear-gradient(145deg, rgba(11, 30, 46, 0.9), rgba(4, 14, 24, 0.95));
          box-shadow: 0 26px 70px rgba(0, 0, 0, 0.27);
        }

        .journeyIntro h2 {
          margin: 10px 0 0;
          font-size: clamp(32px, 3.8vw, 54px);
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .journey {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .journeyStep {
          position: relative;
          min-height: 88px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 1px solid rgba(99, 230, 255, 0.11);
          border-radius: 15px;
          background: rgba(1, 9, 16, 0.36);
        }

        .journeyStep span {
          color: #708792;
          font-size: 9px;
          font-weight: 900;
        }

        .journeyStep strong {
          margin-top: 7px;
          color: #d8f7fb;
          font-size: 11px;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .journeyStep i {
          position: absolute;
          right: -9px;
          top: 36px;
          z-index: 3;
          color: #e5b956;
          font-style: normal;
        }

        .gatewayGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .gatewayCard {
          --accent: #63e6ff;
          position: relative;
          min-height: 470px;
          padding: 28px;
          overflow: hidden;
          border: 1px solid color-mix(in srgb, var(--accent) 30%, rgba(255, 255, 255, 0.05));
          border-radius: 28px;
          background: linear-gradient(145deg, rgba(10, 29, 46, 0.96), rgba(4, 13, 23, 0.99));
          box-shadow: 0 24px 58px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.025);
        }

        .gatewayGlow {
          position: absolute;
          inset: -120px -80px auto auto;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: color-mix(in srgb, var(--accent) 13%, transparent);
          filter: blur(18px);
        }

        .gatewayHeader {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .gatewayCode {
          width: 62px;
          height: 62px;
          display: grid;
          place-items: center;
          border: 1px solid var(--accent);
          border-radius: 17px;
          color: var(--accent);
          background: rgba(0, 0, 0, 0.22);
          font-size: 15px;
          font-weight: 950;
        }

        .gatewayStatus {
          color: #728a96;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .gatewayCard h3 {
          position: relative;
          z-index: 2;
          margin: 27px 0 0;
          color: #fff;
          font-size: 48px;
          line-height: 1;
        }

        .gatewayDescription {
          position: relative;
          z-index: 2;
          margin: 16px 0 24px;
          color: #9bb0ba;
          font-size: 15px;
          line-height: 1.7;
        }

        .gatewayLinks {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 9px;
        }

        .gatewayLink {
          min-height: 52px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 12px;
          color: #d6e6eb;
          background: rgba(0, 0, 0, 0.18);
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          transition: transform 0.22s, border-color 0.22s, background 0.22s;
        }

        .gatewayLink i {
          color: var(--accent);
          font-style: normal;
        }

        .gatewayLink:hover {
          transform: translateY(-2px);
          border-color: var(--accent);
          background: color-mix(in srgb, var(--accent) 8%, rgba(0, 0, 0, 0.22));
        }

        .collectionGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .collectionCard {
          min-height: 260px;
          padding: 23px;
          display: flex;
          flex-direction: column;
          color: inherit;
          text-decoration: none;
          border: 1px solid rgba(99, 230, 255, 0.13);
          border-radius: 23px;
          background:
            radial-gradient(circle at 100% 0, rgba(99, 230, 255, 0.07), transparent 35%),
            linear-gradient(145deg, rgba(10, 31, 47, 0.95), rgba(4, 14, 24, 0.98));
          transition: transform 0.24s, border-color 0.24s;
        }

        .collectionCard:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 230, 255, 0.45);
        }

        .collectionCard > span {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(99, 230, 255, 0.32);
          border-radius: 13px;
          color: #6fe8ff;
          font-size: 9px;
          font-weight: 900;
        }

        .collectionCard h3 {
          margin: 23px 0 0;
          font-size: 28px;
          line-height: 1.05;
        }

        .collectionCard p {
          flex: 1;
          margin: 14px 0 0;
          color: #96abb5;
          font-size: 13px;
          line-height: 1.65;
        }

        .collectionCard strong {
          margin-top: 18px;
          color: #8fefff;
          font-size: 11px;
        }

        .intelligenceSection {
          margin-top: 88px;
        }

        .intelligenceGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .intelligenceCard {
          min-height: 96px;
          padding: 18px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 13px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 17px;
          color: #dce9ed;
          background: linear-gradient(145deg, rgba(10, 29, 44, 0.86), rgba(3, 12, 21, 0.94));
          text-decoration: none;
          transition: transform 0.22s, border-color 0.22s, background 0.22s;
        }

        .intelligenceCard span {
          color: #6edff2;
          font-size: 9px;
          font-weight: 900;
        }

        .intelligenceCard strong {
          font-size: 12px;
        }

        .intelligenceCard i {
          color: #e9bd61;
          font-style: normal;
          font-size: 18px;
        }

        .intelligenceCard:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 230, 255, 0.34);
          background: linear-gradient(145deg, rgba(15, 43, 62, 0.94), rgba(4, 15, 25, 0.98));
        }

        .boundary {
          position: relative;
          margin-top: 88px;
          padding: 58px 36px;
          overflow: hidden;
          border: 1px solid rgba(255, 197, 82, 0.24);
          border-radius: 32px;
          background:
            radial-gradient(circle at 50% 0, rgba(255, 185, 44, 0.12), transparent 42%),
            linear-gradient(180deg, rgba(8, 20, 33, 0.97), rgba(3, 10, 18, 0.99));
          box-shadow: 0 28px 78px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.025);
          text-align: center;
        }

        .boundaryHalo {
          position: absolute;
          inset: -260px auto auto 50%;
          width: 520px;
          height: 520px;
          transform: translateX(-50%);
          border: 1px solid rgba(255, 197, 82, 0.08);
          border-radius: 50%;
        }

        .boundarySeal {
          position: relative;
          z-index: 2;
          width: 82px;
          height: 82px;
          margin: 0 auto 22px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 197, 82, 0.32);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.18);
        }

        .boundarySeal span {
          color: #f2ca75;
          font: 700 23px Georgia, serif;
        }

        .boundarySeal small {
          color: #788b94;
          font-size: 6px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .boundary h2 {
          position: relative;
          z-index: 2;
          max-width: 1040px;
          margin: 14px auto 0;
        }

        .boundary > p:not(.eyebrow) {
          position: relative;
          z-index: 2;
          max-width: 980px;
          margin: 24px auto 0;
          color: #a4b4bc;
          font-size: 15px;
          line-height: 1.78;
        }

        .boundaryGrid {
          position: relative;
          z-index: 2;
          max-width: 1080px;
          margin: 32px auto 0;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .boundaryGrid article {
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.07);
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

        .finalCta {
          margin-top: 88px;
          padding: 70px 36px;
          text-align: center;
          border: 1px solid rgba(99, 230, 255, 0.19);
          border-radius: 32px;
          background:
            radial-gradient(circle at 50% 0, rgba(99, 230, 255, 0.12), transparent 42%),
            linear-gradient(145deg, rgba(9, 29, 45, 0.94), rgba(2, 10, 18, 0.99));
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
        }

        .finalCta h2 {
          max-width: 1100px;
          margin: 15px auto 0;
        }

        .finalCta > p:not(.eyebrow) {
          max-width: 850px;
          margin: 22px auto 0;
          color: #9fb2bb;
          font-size: 15px;
          line-height: 1.75;
        }

        .finalActions {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .finalActions .button {
          justify-self: auto;
        }

        .doctrine {
          margin: 36px auto 0;
          padding-top: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          color: #f0d18e;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .doctrine span {
          color: #63e6ff;
        }

        @keyframes rotateOne {
          from { transform: rotate(18deg) scaleX(1.16); }
          to { transform: rotate(378deg) scaleX(1.16); }
        }

        @keyframes rotateTwo {
          from { transform: rotate(-32deg) scaleY(1.12); }
          to { transform: rotate(328deg) scaleY(1.12); }
        }

        @keyframes driftOne {
          from { transform: translate3d(-1%, -1%, 0); }
          to { transform: translate3d(2%, 1%, 0); }
        }

        @keyframes driftTwo {
          from { transform: translate3d(1%, 0, 0); }
          to { transform: translate3d(-2%, 2%, 0); }
        }

        @media (max-width: 1220px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .commandDeck {
            max-width: 820px;
          }

          .flowRail {
            grid-template-columns: repeat(4, 1fr);
          }

          .flowNode:nth-child(4) i,
          .flowNode:nth-child(8) i {
            display: none;
          }

          .authorityGrid,
          .collectionGrid {
            grid-template-columns: repeat(2, 1fr);
          }

          .intelligenceGrid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 980px) {
          .sectionHeading,
          .applicabilityPanel,
          .journeyPanel {
            grid-template-columns: 1fr;
          }

          .departmentGrid,
          .gatewayGrid,
          .crosswalkGrid {
            grid-template-columns: 1fr;
          }

          .explorerToolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .searchBox {
            width: 100%;
          }

          .topbar {
            grid-template-columns: 1fr 1fr;
          }

          .topbarCenter {
            display: none;
          }

          .boundaryGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 720px) {
          .shell {
            width: calc(100% - 22px);
          }

          .topbar {
            grid-template-columns: 1fr;
          }

          .quiet,
          .primary {
            justify-self: stretch;
          }

          .button {
            width: 100%;
          }

          .hero {
            padding: 62px 0;
          }

          .hero h1 {
            font-size: clamp(48px, 14vw, 70px);
          }

          .commandMetrics,
          .departmentMeta,
          .applicabilityQuestions,
          .gatewayLinks,
          .authorityGrid,
          .collectionGrid,
          .intelligenceGrid,
          .journey {
            grid-template-columns: 1fr;
          }

          .flowRail {
            grid-template-columns: repeat(2, 1fr);
          }

          .flowNode:nth-child(even) i {
            display: none;
          }

          .journeyStep i {
            display: none;
          }

          .sectionFrame,
          .journeyPanel,
          .boundary,
          .finalCta {
            padding: 34px 20px;
          }

          .domainTabs {
            display: grid;
            grid-template-columns: 1fr;
          }

          .crosswalkPair {
            grid-template-columns: 1fr;
          }

          .crosswalkPair i {
            transform: rotate(90deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}
