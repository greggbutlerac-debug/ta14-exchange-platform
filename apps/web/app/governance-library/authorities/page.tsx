"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type AuthorityRecord = {
  id: string;
  name: string;
  category: string;
  jurisdiction: string;
  role: string;
  domains: string[];
  boundary: string;
  href: string;
};

const authorities: AuthorityRecord[] = [
  {
    id: "us-congress",
    name: "United States Congress",
    category: "Legislative authority",
    jurisdiction: "United States",
    role: "Enacts federal statutes",
    domains: "Clean Air Act; Clean Water Act; Safe Drinking Water Act; RCRA; CERCLA; TSCA; FIFRA; EPCRA; NEPA; AI and data legislation".split("; "),
    boundary: "Congress creates statutory duties and delegates implementation authority. It does not itself perform day-to-day permitting, monitoring, inspection, or enforcement.",
    href: "/governance-library/laws",
  },
  {
    id: "epa",
    name: "U.S. Environmental Protection Agency",
    category: "Federal regulatory authority",
    jurisdiction: "United States",
    role: "Implements and enforces environmental statutes",
    domains: "Air; water; drinking water; waste; chemicals; pesticides; emergency planning; pollution prevention; environmental monitoring".split("; "),
    boundary: "EPA authority depends on the governing statute, delegated program, applicable regulation, jurisdiction, and current record.",
    href: "/governance-library/regulations",
  },
  {
    id: "state-env",
    name: "State Environmental Agencies",
    category: "Delegated and independent regulatory authority",
    jurisdiction: "United States — state and territorial",
    role: "Administer delegated federal programs and state environmental law",
    domains: "Permits; inspections; enforcement; monitoring; remediation; drinking water; air quality; waste; water quality".split("; "),
    boundary: "State authority varies by program, delegation status, state law, permit, and local implementation.",
    href: "/environmental-integrity-governance",
  },
  {
    id: "local",
    name: "Local and Tribal Authorities",
    category: "Local, tribal, and delegated authority",
    jurisdiction: "United States — local and tribal",
    role: "Exercise local, tribal, code, health, building, and environmental powers",
    domains: "Building codes; mechanical codes; public health; land use; local air and water programs; tribal environmental governance".split("; "),
    boundary: "Authority must be resolved to the specific jurisdiction, code adoption, delegation, ordinance, and affected activity.",
    href: "/law-standards-public-policy",
  },
  {
    id: "courts",
    name: "Courts and Administrative Review Bodies",
    category: "Judicial and adjudicative authority",
    jurisdiction: "Multi-jurisdictional",
    role: "Interpret law, review agency action, resolve disputes, and issue binding orders",
    domains: "Judicial review; injunctions; penalties; statutory interpretation; administrative appeals; due process".split("; "),
    boundary: "A judicial decision must be read within its jurisdiction, procedural posture, holding, and current precedential status.",
    href: "/governance-library/laws",
  },
  {
    id: "who",
    name: "World Health Organization",
    category: "International public-health authority and guidance body",
    jurisdiction: "Global",
    role: "Develops health guidance, evidence reviews, and international health recommendations",
    domains: "Air quality; drinking water; occupational and environmental health; public-health guidance".split("; "),
    boundary: "WHO guidance can be highly influential but is not automatically domestic law or self-executing authority.",
    href: "/governance-library/frameworks",
  },
  {
    id: "unep",
    name: "United Nations Environment Programme",
    category: "International environmental institution",
    jurisdiction: "Global",
    role: "Coordinates environmental policy, science, programs, and convention support",
    domains: "Climate; pollution; chemicals; waste; biodiversity; environmental rule of law".split("; "),
    boundary: "UNEP outputs vary from scientific and policy guidance to support for treaty systems; legal force must be identified instrument by instrument.",
    href: "/governance-library/frameworks",
  },
  {
    id: "treaty",
    name: "Multilateral Environmental Agreement Bodies",
    category: "Treaty governance and convention administration",
    jurisdiction: "International",
    role: "Administer treaty obligations, reporting systems, technical bodies, and implementation support",
    domains: "Montreal Protocol; Basel; Stockholm; Minamata; climate and pollution agreements".split("; "),
    boundary: "Treaty obligations generally require ratification, domestic implementation, and jurisdiction-specific analysis.",
    href: "/governance-library/laws",
  },
  {
    id: "eu",
    name: "European Union Institutions",
    category: "Supranational legislative, regulatory, and enforcement authority",
    jurisdiction: "European Union",
    role: "Adopt regulations and directives and oversee Union-level implementation",
    domains: "EU AI Act; environmental directives; chemicals; product safety; data; climate; pollution".split("; "),
    boundary: "The legal effect depends on the instrument, effective date, delegated acts, guidance, member-state implementation, and role of the affected party.",
    href: "/governance-library/laws",
  },
  {
    id: "nist",
    name: "National Institute of Standards and Technology",
    category: "Federal technical and measurement authority",
    jurisdiction: "United States",
    role: "Develops technical standards, measurement science, guidance, and risk-management frameworks",
    domains: "AI RMF; cybersecurity; metrology; testing; reference methods; technical guidance".split("; "),
    boundary: "NIST guidance is not automatically law, but may become controlling through contracts, policy, procurement, regulation, or incorporation.",
    href: "/governance-library/frameworks",
  },
  {
    id: "ansi",
    name: "ANSI",
    category: "National standards coordination and accreditation body",
    jurisdiction: "United States",
    role: "Coordinates voluntary consensus standards and accredits standards-development processes",
    domains: "ANSI-accredited standards; conformity systems; incorporation by reference awareness".split("; "),
    boundary: "ANSI accreditation does not itself make a standard law; enforceability depends on adoption, incorporation, contract, or regulation.",
    href: "/governance-library/standards",
  },
  {
    id: "ashrae",
    name: "ASHRAE",
    category: "Technical standards and professional society authority",
    jurisdiction: "International",
    role: "Develops consensus standards and guidance for buildings, HVAC, refrigeration, ventilation, energy, and indoor environments",
    domains: "Ventilation; indoor air quality; thermal comfort; filtration; refrigeration safety; building energy; maintenance".split("; "),
    boundary: "ASHRAE standards require edition, adoption, project, contract, code, and jurisdiction analysis before they are treated as binding.",
    href: "/governance-library/standards",
  },
  {
    id: "iso",
    name: "International Organization for Standardization",
    category: "International standards organization",
    jurisdiction: "International",
    role: "Develops international voluntary consensus standards",
    domains: "Environmental management; laboratory competence; air quality; AI management; risk; quality; measurement".split("; "),
    boundary: "ISO standards are generally voluntary unless adopted, incorporated, contracted, certified, or required by another authority.",
    href: "/governance-library/standards",
  },
  {
    id: "iec",
    name: "International Electrotechnical Commission",
    category: "International electrotechnical standards organization",
    jurisdiction: "International",
    role: "Develops standards for electrical, electronic, and related technologies",
    domains: "Electrical safety; equipment; sensors; controls; AI and digital systems with ISO joint committees".split("; "),
    boundary: "IEC standards require scope, edition, adoption, and conformity pathway analysis before reliance.",
    href: "/governance-library/standards",
  },
  {
    id: "ieee",
    name: "IEEE Standards Association",
    category: "Technical standards-development organization",
    jurisdiction: "International",
    role: "Develops technical and ethical standards for computing, electrical, communications, and AI systems",
    domains: "AI ethics; system design; data; interoperability; electrical and digital systems".split("; "),
    boundary: "IEEE standards are not self-executing legal authority and must be tied to an adoption or governance basis.",
    href: "/governance-library/standards",
  },
  {
    id: "nfpa",
    name: "National Fire Protection Association",
    category: "Codes and standards organization",
    jurisdiction: "United States and international adoption",
    role: "Develops fire, electrical, life-safety, and related codes and standards",
    domains: "National Electrical Code; fire protection; life safety; hazardous materials".split("; "),
    boundary: "NFPA instruments become enforceable through adoption, incorporation, contract, permit, or another controlling authority.",
    href: "/governance-library/standards",
  },
  {
    id: "icc",
    name: "International Code Council",
    category: "Model code development organization",
    jurisdiction: "International adoption",
    role: "Develops model building, mechanical, plumbing, energy, and related codes",
    domains: "Building code; mechanical code; energy code; plumbing; existing buildings".split("; "),
    boundary: "Model codes are not law until adopted by a jurisdiction, and local amendments and adopted editions control.",
    href: "/governance-library/standards",
  },
  {
    id: "accreditation",
    name: "Accreditation and Certification Bodies",
    category: "Conformity-assessment authority",
    jurisdiction: "Multi-jurisdictional",
    role: "Accredit laboratories, certification bodies, inspection bodies, and conformity programs",
    domains: "ISO/IEC 17025; management-system certification; personnel certification; inspection accreditation".split("; "),
    boundary: "Accreditation and certification support confidence within a defined scope but do not replace legal authority or prove every execution.",
    href: "/governance-library/standards",
  },
  {
    id: "labs",
    name: "Qualified Laboratories and Measurement Bodies",
    category: "Technical evidence authority",
    jurisdiction: "Multi-jurisdictional",
    role: "Generate analytical, calibration, testing, and measurement evidence within a defined scope",
    domains: "Environmental sampling; laboratory analysis; calibration; proficiency testing; method validation".split("; "),
    boundary: "Laboratory competence supports evidence, but admissibility also depends on sampling, custody, method, context, version, and intended proposition.",
    href: "/environmental-integrity-governance",
  },
  {
    id: "building-officials",
    name: "Building Officials and Authorities Having Jurisdiction",
    category: "Code-adoption and enforcement authority",
    jurisdiction: "Local and regional",
    role: "Review plans, issue permits, inspect work, and enforce adopted codes",
    domains: "Building; mechanical; electrical; fire; plumbing; energy; occupancy".split("; "),
    boundary: "The authority having jurisdiction, adopted edition, amendments, permit conditions, and inspection record control the applicable requirement.",
    href: "/law-standards-public-policy",
  },
  {
    id: "contracts",
    name: "Contractual and Organizational Authorities",
    category: "Private and institutional authority",
    jurisdiction: "Multi-jurisdictional",
    role: "Create bounded duties through contracts, policies, procurement, delegation, and internal governance",
    domains: "Vendor requirements; service agreements; procurement; internal approvals; delegated authority; operational policy".split("; "),
    boundary: "Private authority cannot override law and must be current, attributable, within scope, and preserved before consequential action.",
    href: "/workspace/entity-review",
  },
  {
    id: "ta14",
    name: "TA-14 Authority Governance Institution",
    category: "Independent governance architecture and institutional review authority",
    jurisdiction: "Institutional and contractual scope",
    role: "Develops governance architectures, guided review systems, proposed laws and standards, Academy pathways, and bounded findings",
    domains: "AI governance; Environmental Integrity Governance; Academy; law and standards modernization; entity review; execution artifacts".split("; "),
    boundary: "TA-14 does not claim governmental, legislative, regulatory, judicial, certification, or accreditation authority unless separately and explicitly granted. Its findings are bounded to declared scope, evidence, method, and agreement.",
    href: "/foundation",
  },
];

const authorityChain = [
  ["01", "Source", "Identify the institution, office, body, organization, contract, or delegation being relied upon."],
  ["02", "Instrument", "Identify the exact statute, regulation, standard, code, permit, policy, order, or agreement."],
  ["03", "Jurisdiction", "Determine where the authority applies and which person, entity, place, system, or activity it reaches."],
  ["04", "Version", "Preserve the controlling edition, amendment, effective date, adoption, incorporation, and supersession status."],
  ["05", "Scope", "Resolve what the authority permits, requires, restricts, delegates, reviews, certifies, or enforces."],
  ["06", "Evidence", "Identify the records necessary to prove applicability, compliance, conformity, authorization, or violation."],
  ["07", "Determination", "Bind the authority to a bounded ALLOW, HOLD, DENY, or ESCALATE decision before consequence."],
  ["08", "Outcome", "Preserve what happened after the authority was applied and whether the intended result was achieved."],
] as const;

const authorityTypes = ["All authority types", ...Array.from(new Set(authorities.map((item) => item.category)))];
const jurisdictions = ["All jurisdictions", ...Array.from(new Set(authorities.map((item) => item.jurisdiction)))];

const authorityFailureModes = [
  {
    code: "A01",
    title: "Source assumed",
    description:
      "A respected institution is cited without identifying the exact office, instrument, delegation, or authority being relied upon.",
    consequence:
      "The route cannot prove that the institution had power over the specific subject, place, activity, or decision.",
    resolution:
      "Identify the source, instrument, jurisdiction, role, and current authority record before proceeding.",
  },
  {
    code: "A02",
    title: "Guidance treated as law",
    description:
      "A recommendation, guideline, framework, or technical report is presented as though it creates a mandatory legal duty.",
    consequence:
      "The claimed obligation may be overstated, misapplied, or disconnected from the authority that could make it binding.",
    resolution:
      "Preserve whether the instrument is guidance, a voluntary standard, adopted code, regulation, contract, or enacted law.",
  },
  {
    code: "A03",
    title: "Wrong jurisdiction",
    description:
      "An authority is valid in one jurisdiction but applied to a person, facility, system, or transaction outside that reach.",
    consequence:
      "A technically sound rule may still be legally or institutionally inapplicable.",
    resolution:
      "Resolve geography, subject-matter jurisdiction, role, delegation, and any cross-border implementation requirements.",
  },
  {
    code: "A04",
    title: "Version superseded",
    description:
      "A prior edition, expired delegation, repealed rule, old permit, or superseded policy is used after a controlling change.",
    consequence:
      "The route binds consequence to stale authority and may preserve the wrong duty, threshold, or permission.",
    resolution:
      "Confirm amendment history, effective date, adopted edition, revocation status, and supersession before commitment.",
  },
  {
    code: "A05",
    title: "Delegation exceeded",
    description:
      "A person, agency, reviewer, contractor, or automated system acts beyond the authority actually delegated to it.",
    consequence:
      "The action may be unauthorized even when the underlying institution possesses broader authority.",
    resolution:
      "Bind the actor, delegated role, permitted action, limits, duration, and escalation path to the execution record.",
  },
  {
    code: "A06",
    title: "Evidence body overclaimed",
    description:
      "A laboratory, auditor, certification body, or expert opinion is treated as authority to decide matters outside its scope.",
    consequence:
      "Competence to measure, test, inspect, or certify becomes confused with power to authorize or enforce.",
    resolution:
      "Separate evidence authority, conformity authority, legal authority, and execution authority.",
  },
  {
    code: "A07",
    title: "Conflict unresolved",
    description:
      "Two authorities, instruments, jurisdictions, or adopted editions point toward incompatible duties or outcomes.",
    consequence:
      "Execution proceeds without preserving which authority controls or why one source displaced another.",
    resolution:
      "HOLD or ESCALATE until hierarchy, preemption, precedence, interpretation, or qualified review resolves the conflict.",
  },
  {
    code: "A08",
    title: "Outcome detached",
    description:
      "The authority is documented before action, but the resulting execution and outcome are never returned to the record.",
    consequence:
      "The institution cannot determine whether the authority was applied correctly or achieved its intended protection.",
    resolution:
      "Preserve execution correspondence, actual outcome, challenge rights, correction, and future-reliance limits.",
  },
] as const;

const delegationScenarios = [
  {
    number: "01",
    title: "Federal statute to agency program",
    source: "Legislature",
    route: "Statute → delegated agency → implementing regulation → permit or enforcement action",
    question:
      "Did the statute actually delegate the relevant power, and is the agency acting within the current regulatory program?",
  },
  {
    number: "02",
    title: "Model standard to adopted code",
    source: "Standards or code body",
    route: "Published instrument → jurisdictional adoption → local amendment → permit and inspection",
    question:
      "Which edition and amendments were adopted, and which authority having jurisdiction controls the project?",
  },
  {
    number: "03",
    title: "Organization to human operator",
    source: "Contractual or internal authority",
    route: "Policy or agreement → role assignment → bounded permission → execution and review",
    question:
      "Was the operator authorized for this action, system, amount, location, time, and consequence?",
  },
  {
    number: "04",
    title: "Organization to automated system",
    source: "Technical and organizational authority",
    route: "Approved policy → system identity → runtime capability → commit boundary → artifact",
    question:
      "Did the deployed version possess current authority to execute, or only to recommend and route for review?",
  },
  {
    number: "05",
    title: "Laboratory evidence to regulator",
    source: "Qualified evidence body",
    route: "Sampling plan → custody → approved method → laboratory result → regulator determination",
    question:
      "Does the laboratory result support the proposition, and who retains authority to determine compliance or enforcement?",
  },
  {
    number: "06",
    title: "International guidance to domestic policy",
    source: "International institution",
    route: "Guidance or treaty system → national implementation → regulation, policy, or program",
    question:
      "What domestic act transformed the international instrument into an applicable duty or decision criterion?",
  },
] as const;

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).map((part) => part[0]).join("").slice(0, 3).toUpperCase();
}

export default function InstitutionalAuthoritiesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All authority types");
  const [jurisdiction, setJurisdiction] = useState("All jurisdictions");
  const [selectedId, setSelectedId] = useState(authorities[0].id);
  const [activeChain, setActiveChain] = useState(0);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return authorities.filter((item) => {
      const matchesType = type === "All authority types" || item.category === type;
      const matchesJurisdiction = jurisdiction === "All jurisdictions" || item.jurisdiction === jurisdiction;
      const searchable = [item.name, item.category, item.jurisdiction, item.role, item.boundary, ...item.domains].join(" ").toLowerCase();
      const matchesQuery = !normalized || normalized.split(/\s+/).every((token) => searchable.includes(token));
      return matchesType && matchesJurisdiction && matchesQuery;
    });
  }, [jurisdiction, query, type]);

  const selected = authorities.find((item) => item.id === selectedId) ?? filtered[0] ?? authorities[0];
  const metrics = useMemo(() => ({
    authorities: authorities.length,
    categories: new Set(authorities.map((item) => item.category)).size,
    jurisdictions: new Set(authorities.map((item) => item.jurisdiction)).size,
    domains: new Set(authorities.flatMap((item) => item.domains)).size,
  }), []);

  return (
    <main className="page">
      <div className="canvas" aria-hidden="true"><div className="grid"/><div className="glow one"/><div className="glow two"/><div className="route r1"/><div className="route r2"/></div>
      <div className="shell">
        <div className="topbar">
          <Link href="/governance-library">← Governance Library</Link>
          <span className="status"><i/> Institutional authority index active</span>
          <Link className="topAction" href="/law-standards-public-policy">Law, Standards & Public Policy →</Link>
        </div>

        <header className="hero">
          <div className="seal"><span>AUTH</span><small>TA-14</small></div>
          <p className="eyebrow">TA-14 AUTHORITY GOVERNANCE INSTITUTION</p>
          <h1>Governing <em>Authorities</em></h1>
          <p className="lead">Determine who can create the rule, who can adopt it, who can enforce it, who can generate qualified evidence, who can certify or accredit within a bounded scope, and who may authorize consequential action.</p>
          <div className="metrics">
            <article><strong>{metrics.authorities}</strong><span>Authorities indexed</span></article>
            <article><strong>{metrics.categories}</strong><span>Authority classes</span></article>
            <article><strong>{metrics.jurisdictions}</strong><span>Jurisdiction groups</span></article>
            <article><strong>{metrics.domains}</strong><span>Governed domains</span></article>
          </div>
        </header>

        <section className="definition">
          <article><span>AUTHORITY IS NOT PUBLICATION</span><strong>Publishing a standard, framework, report, or recommendation does not automatically create legal force.</strong></article>
          <article><span>AUTHORITY IS NOT REPUTATION</span><strong>Institutional prestige cannot replace jurisdiction, delegation, adoption, contractual scope, or lawful permission.</strong></article>
          <article><span>AUTHORITY MUST BE CURRENT</span><strong>The governing source, version, office, role, scope, and revocation status must survive until commitment.</strong></article>
        </section>

        <section className="workspace">
          <div className="sectionHeading"><div><p className="eyebrow">AUTHORITY CONTROL DESK</p><h2>Find the authority. Preserve its boundary.</h2></div><p>Every authority record separates the institution's real role from assumptions about what it can compel, certify, interpret, enforce, or authorize.</p></div>
          <div className="filters">
            <label>Search authority<input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search EPA, WHO, ASHRAE, courts, codes..." /></label>
            <label>Authority type<select value={type} onChange={(event)=>setType(event.target.value)}>{authorityTypes.map((item)=><option key={item}>{item}</option>)}</select></label>
            <label>Jurisdiction<select value={jurisdiction} onChange={(event)=>setJurisdiction(event.target.value)}>{jurisdictions.map((item)=><option key={item}>{item}</option>)}</select></label>
            <button type="button" onClick={()=>{setQuery("");setType("All authority types");setJurisdiction("All jurisdictions");}}>Clear filters</button>
          </div>

          <div className="authorityGrid">
            <aside className="index">
              <div className="indexHeader"><span>Authority index</span><strong>{filtered.length} records</strong></div>
              <div className="list">{filtered.map((item,index)=><button key={item.id} className={selected.id===item.id?"active":""} onClick={()=>setSelectedId(item.id)}><span>{String(index+1).padStart(2,"0")}</span><div><small>{item.category}</small><strong>{item.name}</strong><em>{item.jurisdiction}</em></div><i>→</i></button>)}</div>
            </aside>

            <article className="record">
              <div className="recordHeader"><div className="recordIdentity"><div className="recordSeal">{initials(selected.name)}</div><div><p>{selected.category}</p><h3>{selected.name}</h3><span>{selected.jurisdiction}</span></div></div><span className="bounded">BOUNDED AUTHORITY</span></div>
              <div className="roleCard"><span>INSTITUTIONAL ROLE</span><strong>{selected.role}</strong></div>
              <div className="recordColumns">
                <section><div className="cardHeading"><span>Governed domains</span><strong>{selected.domains.length}</strong></div><div className="domainList">{selected.domains.map((domain,index)=><div key={domain}><span>{String(index+1).padStart(2,"0")}</span><strong>{domain}</strong></div>)}</div></section>
                <section><div className="cardHeading"><span>Authority questions</span><strong>06</strong></div><ul><li>What instrument grants the authority?</li><li>Which jurisdiction and subject are reached?</li><li>What edition, date, adoption, or delegation controls?</li><li>What can the authority actually require or decide?</li><li>What evidence must exist before reliance?</li><li>Who reviews, challenges, appeals, or supersedes it?</li></ul></section>
              </div>
              <div className="boundary"><div className="boundarySeal">T14</div><div><span>TA-14 AUTHORITY BOUNDARY</span><p>{selected.boundary}</p></div></div>
              <div className="actions"><Link href={selected.href} className="secondary">Open connected institution</Link><Link href="/governance-library/crosswalks" className="secondary">Open authority crosswalk</Link><Link href="/workspace/entity-review" className="primary">Begin governed review →</Link></div>
            </article>
          </div>
        </section>

        <section className="chainSection">
          <div className="sectionHeading"><div><p className="eyebrow">AUTHORITY RESOLUTION CHAIN</p><h2>Authority must survive every transition before consequence.</h2></div><p>Select a stage to inspect the institutional question that must be answered before authority can support execution.</p></div>
          <div className="chain">{authorityChain.map(([number,title,text],index)=><button key={title} className={activeChain===index?"active":""} onClick={()=>setActiveChain(index)}><span>{number}</span><strong>{title}</strong></button>)}</div>
          <article className="chainDetail"><span>STAGE {authorityChain[activeChain][0]}</span><h3>{authorityChain[activeChain][1]}</h3><p>{authorityChain[activeChain][2]}</p></article>
        </section>

        <section className="classes">
          <div className="sectionHeading"><div><p className="eyebrow">AUTHORITY CLASSES</p><h2>Different institutions carry different kinds of power.</h2></div><p>TA-14 does not collapse legislatures, regulators, courts, standards bodies, laboratories, certification bodies, contracts, and independent review institutions into one undifferentiated authority label.</p></div>
          <div className="classGrid">
            {[
              ["LAW", "Legislative authority", "Creates statutes, duties, prohibitions, delegations, remedies, and public powers."],
              ["REG", "Regulatory authority", "Implements statutes through rules, permits, inspections, monitoring, enforcement, and guidance."],
              ["JUD", "Judicial authority", "Interprets law, reviews agency action, resolves disputes, and issues binding orders."],
              ["STD", "Standards authority", "Develops consensus requirements or guidance that may later be adopted or incorporated."],
              ["CODE", "Code authority", "Adopts, amends, permits, inspects, and enforces building, mechanical, electrical, and safety codes."],
              ["EVID", "Evidence authority", "Generates qualified measurements, tests, calibration, analysis, and records within a bounded scope."],
              ["CERT", "Conformity authority", "Accredits or certifies competence, systems, products, personnel, or processes within declared limits."],
              ["ORG", "Organizational authority", "Creates internal or contractual permissions, duties, approvals, and execution boundaries."],
            ].map(([code,title,text])=><article key={code}><span>{code}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="failureSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">AUTHORITY FAILURE MODES</p>
              <h2>Authority fails when influence, competence, or publication is mistaken for permission.</h2>
            </div>
            <p>
              These failure modes show why an authority record must preserve more than an institution name. Each failure creates a specific HOLD, DENY, or ESCALATE condition before consequential execution.
            </p>
          </div>

          <div className="failureGrid">
            {authorityFailureModes.map((failure) => (
              <article key={failure.code}>
                <div className="failureHeader">
                  <span>{failure.code}</span>
                  <strong>{failure.title}</strong>
                </div>
                <div className="failureBody">
                  <div>
                    <small>FAILURE</small>
                    <p>{failure.description}</p>
                  </div>
                  <div>
                    <small>CONSEQUENCE</small>
                    <p>{failure.consequence}</p>
                  </div>
                  <div>
                    <small>TA-14 RESOLUTION</small>
                    <p>{failure.resolution}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="delegationSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">DELEGATION & ADOPTION PATHWAYS</p>
              <h2>The institution name is only the beginning of the authority route.</h2>
            </div>
            <p>
              Authority often moves through legislation, delegation, adoption, permits, contracts, roles, systems, and qualified evidence bodies. Every transfer must preserve who granted what to whom, for which purpose, and under which limits.
            </p>
          </div>

          <div className="delegationGrid">
            {delegationScenarios.map((scenario) => (
              <article key={scenario.number}>
                <div className="delegationNumber">{scenario.number}</div>
                <div className="delegationCopy">
                  <span>{scenario.source}</span>
                  <h3>{scenario.title}</h3>
                  <p className="delegationRoute">{scenario.route}</p>
                  <div className="delegationQuestion">
                    <small>CONTROLLING QUESTION</small>
                    <p>{scenario.question}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="decisionSection">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">AUTHORITY DETERMINATION STATES</p>
              <h2>A source may be important and still fail to authorize the proposed action.</h2>
            </div>
            <p>
              TA-14 resolves authority into a bounded determination. The state applies only to the preserved source, instrument, jurisdiction, version, scope, evidence, actor, and proposed consequence.
            </p>
          </div>

          <div className="decisionGrid">
            <article className="allowState">
              <span>01</span>
              <h3>ALLOW</h3>
              <p>The authority is current, attributable, applicable, within scope, and supported by the required evidence.</p>
              <small>Execution remains limited to the committed action and preserved conditions.</small>
            </article>
            <article className="holdState">
              <span>02</span>
              <h3>HOLD</h3>
              <p>Authority may exist, but delegation, jurisdiction, version, adoption, evidence, or scope remains incomplete.</p>
              <small>No consequence is bound until the missing authority facts are resolved.</small>
            </article>
            <article className="denyState">
              <span>03</span>
              <h3>DENY</h3>
              <p>The cited institution or instrument does not authorize the proposed action within the preserved boundary.</p>
              <small>The denial preserves the failed authority claim and the reason it could not support execution.</small>
            </article>
            <article className="escalateState">
              <span>04</span>
              <h3>ESCALATE</h3>
              <p>Conflict, consequence, ambiguity, preemption, appeal, or specialized interpretation requires another authority.</p>
              <small>The route identifies who must decide next and what additional record must be produced.</small>
            </article>
          </div>
        </section>

        <section className="academy">
          <div className="academySeal"><small>TA-14</small><strong>ACADEMY</strong><span>AUTHORITY RESOLUTION</span></div>
          <div><p className="eyebrow">THE ACADEMY INSIDE AUTHORITY</p><h2>Learn why an important institution may still lack authority over the action in front of you.</h2><p>The Academy teaches participants to distinguish influence from law, guidance from obligation, publication from adoption, accreditation from execution permission, and institutional review from governmental enforcement.</p><div className="academySteps">{["Identify the source", "Inspect the instrument", "Resolve jurisdiction", "Confirm current version", "Bound the authority", "Map evidence duties", "Run a scenario", "Demonstrate readiness"].map((step,index)=><div key={step}><span>{String(index+1).padStart(2,"0")}</span><strong>{step}</strong></div>)}</div><div className="actions left"><Link href="/academy" className="primary">Enter TA-14 Academy →</Link><Link href="/governance-library/crosswalks" className="secondary">Open crosswalks</Link></div></div>
        </section>

        <section className="ta14Boundary">
          <p className="eyebrow gold">TA-14 INSTITUTIONAL AUTHORITY</p><h2>TA-14 must preserve its own limits while reviewing everyone else's.</h2><p>TA-14 may develop architectures, teach methods, guide submissions, conduct bounded reviews, issue institutional findings, preserve execution artifacts, publish proposed laws and standards, and operate registries within its declared systems. TA-14 does not become a legislature, regulator, court, accredited certification body, or governmental enforcement agency merely by performing those functions.</p>
          <div className="boundaryGrid"><article><span>TA-14 MAY</span><strong>Teach, structure, review, document, compare, publish, register, verify, and issue bounded institutional findings.</strong></article><article><span>TA-14 MAY NOT CLAIM</span><strong>Governmental enforcement, legal enactment, judicial judgment, statutory delegation, or accreditation that has not actually been granted.</strong></article><article><span>EVERY RESULT MUST PRESERVE</span><strong>Scope, evidence, method, authority, limitations, determination, review path, and what remains unresolved.</strong></article></div>
        </section>

        <footer><span>TA-14 Authority Governance Institution</span><span>Governing Authorities · TA14Authority.org</span></footer>
      </div>

      <style jsx>{`
:global(*) {
  box-sizing: border-box;
}

:global(html) {
  background: #020811;
  scroll-behavior: smooth;
}

:global(body) {
  margin: 0;
  color: #f5fbff;
  background: #020811;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

:global(a) {
  color: inherit;
}

:global(button),
:global(input),
:global(select) {
  font: inherit;
}

.page {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(circle at 50% -12%, rgba(51, 148, 193, 0.18), transparent 36%),
    linear-gradient(180deg, rgba(2, 8, 17, 0.68), rgba(2, 7, 13, 0.96));
}

.canvas {
  position: fixed;
  inset: 0;
  z-index: -4;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(circle at 8% 22%, rgba(44, 201, 221, 0.08), transparent 28%),
    radial-gradient(circle at 92% 62%, rgba(255, 191, 69, 0.07), transparent 30%),
    linear-gradient(180deg, #020811, #06131f 48%, #02070d);
}

.grid {
  position: absolute;
  inset: 0;
  opacity: 0.16;
  background-image:
    linear-gradient(rgba(112, 222, 239, 0.16) 1px, transparent 1px),
    linear-gradient(90deg, rgba(112, 222, 239, 0.16) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, black, rgba(0, 0, 0, 0.72) 70%, transparent);
}

.glow {
  position: absolute;
  width: 720px;
  height: 720px;
  border-radius: 50%;
  filter: blur(115px);
  opacity: 0.13;
  animation: glowDrift 16s ease-in-out infinite alternate;
}

.glow.one {
  left: -270px;
  top: 18%;
  background: #0b8fc4;
}

.glow.two {
  right: -290px;
  top: 48%;
  background: #d79228;
  animation-delay: -7s;
}

.route {
  position: absolute;
  width: 78vw;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(80, 205, 236, 0.68), rgba(255, 192, 72, 0.54), transparent);
  filter: drop-shadow(0 0 8px rgba(73, 199, 230, 0.42));
}

.route::after {
  content: "";
  position: absolute;
  top: -3px;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #ffe8a2;
  box-shadow: 0 0 18px rgba(255, 211, 98, 0.9);
  animation: authorityPacket 8s linear infinite;
}

.r1 {
  left: -20%;
  top: 27%;
  transform: rotate(-7deg);
}

.r2 {
  right: -22%;
  top: 72%;
  transform: rotate(9deg);
}

.shell {
  width: min(1500px, calc(100% - 38px));
  margin-inline: auto;
  position: relative;
  z-index: 2;
  padding: 22px 0 88px;
}

.topbar {
  min-height: 70px;
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  border: 1px solid rgba(115, 215, 235, 0.16);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(9, 29, 45, 0.9), rgba(4, 15, 25, 0.92));
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28), inset 0 1px rgba(255, 255, 255, 0.035);
  backdrop-filter: blur(18px);
}

.topbar > a {
  min-height: 44px;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: #c9dbe2;
  background: rgba(0, 0, 0, 0.18);
  text-decoration: none;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: transform 0.22s, border-color 0.22s, color 0.22s;
}

.topbar > a:first-child {
  justify-self: start;
}

.topbar > a:hover {
  transform: translateY(-2px);
  border-color: rgba(105, 222, 242, 0.4);
  color: #ffffff;
}

.topbar .topAction {
  justify-self: end;
  color: #03151c;
  border-color: #a9effb;
  background: linear-gradient(135deg, #d9fbff, #72dcec 64%, #36a7c3);
  box-shadow: 0 10px 26px rgba(49, 181, 209, 0.18);
}

.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  color: #849da8;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.status i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #70e8b6;
  box-shadow: 0 0 15px rgba(112, 232, 182, 0.85);
}

.hero {
  max-width: 1160px;
  margin: 0 auto;
  padding: 92px 0 76px;
  text-align: center;
}

.seal {
  width: 116px;
  height: 116px;
  margin: 0 auto 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  position: relative;
  border: 1px solid rgba(255, 202, 93, 0.42);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 202, 93, 0.13), rgba(5, 23, 36, 0.94) 68%);
  box-shadow: 0 0 66px rgba(255, 188, 54, 0.1), inset 0 0 34px rgba(80, 196, 226, 0.07);
}

.seal::before,
.seal::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(105, 216, 238, 0.22);
  animation: sealRotate 18s linear infinite;
}

.seal::before {
  inset: 12px;
}

.seal::after {
  inset: 25px;
  animation-direction: reverse;
  animation-duration: 12s;
}

.seal span {
  position: relative;
  z-index: 1;
  color: #ffe39a;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.seal small {
  position: relative;
  z-index: 1;
  color: #7ea1ae;
  font-size: 8px;
  font-weight: 950;
  letter-spacing: 0.18em;
}

.eyebrow {
  margin: 0;
  color: #6fe5f7;
  font-size: 10px;
  font-weight: 950;
  letter-spacing: 0.23em;
  text-transform: uppercase;
}

.eyebrow.gold {
  color: #efbd5c;
}

.hero h1,
.sectionHeading h2,
.academy h2,
.ta14Boundary h2 {
  font-family: Georgia, "Times New Roman", serif;
  letter-spacing: -0.052em;
  text-wrap: balance;
}

.hero h1 {
  margin: 15px 0 0;
  font-size: clamp(54px, 7vw, 102px);
  line-height: 0.93;
}

.hero h1 em {
  display: block;
  color: #ffd15c;
  font-style: italic;
  font-weight: 500;
  text-shadow: 0 0 35px rgba(255, 202, 76, 0.15);
}

.lead {
  max-width: 990px;
  margin: 28px auto 0;
  color: #b7c9d0;
  font-size: 18px;
  line-height: 1.76;
}

.metrics {
  margin-top: 38px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.metrics article {
  min-height: 112px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(104, 217, 237, 0.12);
  border-radius: 17px;
  background: linear-gradient(145deg, rgba(9, 31, 45, 0.72), rgba(4, 18, 29, 0.82));
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.16);
}

.metrics strong {
  color: #f1cf82;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 32px;
}

.metrics span {
  margin-top: 6px;
  color: #7f97a1;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.definition {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  padding-bottom: 86px;
}

.definition article {
  min-height: 180px;
  padding: 25px;
  border: 1px solid rgba(108, 216, 236, 0.14);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(10, 33, 48, 0.78), rgba(4, 17, 27, 0.88));
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.17);
}

.definition article > span {
  color: #69cfe2;
  font-size: 9px;
  font-weight: 950;
  letter-spacing: 0.14em;
}

.definition article > strong {
  display: block;
  margin-top: 18px;
  color: #e7f2f5;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 22px;
  line-height: 1.42;
}

.workspace,
.chainSection,
.classes,
.academy,
.ta14Boundary {
  padding: 92px 0;
}

.sectionHeading {
  margin-bottom: 34px;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  align-items: end;
  gap: 42px;
}

.sectionHeading h2,
.academy h2,
.ta14Boundary h2 {
  margin: 12px 0 0;
  font-size: clamp(40px, 5vw, 74px);
  line-height: 0.98;
}

.sectionHeading > p,
.academy > div:last-child > p,
.ta14Boundary > p:not(.eyebrow) {
  margin: 0;
  color: #9fb4bc;
  font-size: 15px;
  line-height: 1.75;
}

.filters {
  padding: 19px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px 230px auto;
  align-items: end;
  gap: 12px;
  border: 1px solid rgba(104, 218, 238, 0.15);
  border-radius: 22px;
  background: linear-gradient(145deg, rgba(9, 29, 44, 0.95), rgba(3, 13, 22, 0.98));
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.2);
}

.filters label {
  display: grid;
  gap: 8px;
  color: #78a0ae;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.filters input,
.filters select,
.filters button {
  width: 100%;
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  outline: none;
  color: #edf6f8;
  background: rgba(0, 0, 0, 0.2);
}

.filters input:focus,
.filters select:focus {
  border-color: rgba(105, 221, 241, 0.5);
  box-shadow: 0 0 0 3px rgba(89, 207, 230, 0.08);
}

.filters select option {
  color: #edf6f8;
  background: #071622;
}

.filters button {
  padding-inline: 18px;
  color: #b7c9d0;
  cursor: pointer;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: border-color 0.22s, color 0.22s, transform 0.22s;
}

.filters button:hover {
  transform: translateY(-2px);
  border-color: rgba(105, 221, 241, 0.42);
  color: #ffffff;
}

.authorityGrid {
  margin-top: 17px;
  display: grid;
  grid-template-columns: 410px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.index,
.record {
  border: 1px solid rgba(104, 218, 238, 0.14);
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(9, 29, 44, 0.95), rgba(3, 13, 22, 0.98));
  box-shadow: 0 26px 72px rgba(0, 0, 0, 0.24);
}

.index {
  position: sticky;
  top: 18px;
  padding: 18px;
  max-height: calc(100vh - 36px);
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(104, 218, 238, 0.35) rgba(255, 255, 255, 0.03);
}

.indexHeader {
  padding: 5px 3px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.065);
}

.indexHeader span {
  color: #6bd9ec;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.indexHeader strong {
  color: #efcb80;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 17px;
}

.list {
  margin-top: 14px;
  display: grid;
  gap: 9px;
}

.list > button {
  width: 100%;
  min-height: 78px;
  padding: 13px;
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.065);
  border-radius: 14px;
  color: inherit;
  background: rgba(0, 0, 0, 0.15);
  cursor: pointer;
  text-align: left;
  transition: transform 0.22s, border-color 0.22s, background 0.22s;
}

.list > button:hover,
.list > button.active {
  transform: translateX(5px);
  border-color: rgba(105, 221, 241, 0.34);
  background: linear-gradient(90deg, rgba(89, 207, 230, 0.08), rgba(255, 198, 82, 0.035));
}

.list > button > span {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(105, 221, 241, 0.17);
  border-radius: 11px;
  color: #69d9eb;
  font-size: 8px;
  font-weight: 900;
}

.list button div {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.list button small {
  overflow: hidden;
  color: #6f8994;
  font-size: 7px;
  font-weight: 900;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.list button strong {
  overflow: hidden;
  color: #dce8ec;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list button em {
  overflow: hidden;
  color: #708690;
  font-size: 8px;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list button > i {
  color: #65d7e9;
  font-style: normal;
}

.record {
  padding: 28px;
}

.recordHeader {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.recordIdentity {
  min-width: 0;
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
  border: 1px solid rgba(255, 201, 85, 0.34);
  border-radius: 50%;
  color: #efca79;
  background: radial-gradient(circle, rgba(255, 199, 80, 0.1), rgba(5, 22, 33, 0.8));
  font-family: Georgia, "Times New Roman", serif;
  font-size: 19px;
  font-weight: 800;
  box-shadow: 0 0 32px rgba(255, 188, 48, 0.08);
}

.recordIdentity p {
  margin: 0;
  color: #69dcec;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.recordIdentity h3 {
  margin: 7px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(30px, 3.4vw, 48px);
  line-height: 1;
}

.recordIdentity span {
  display: block;
  margin-top: 8px;
  color: #8299a3;
  font-size: 11px;
}

.bounded {
  flex: 0 0 auto;
  padding: 9px 12px;
  border: 1px solid rgba(112, 230, 184, 0.23);
  border-radius: 999px;
  color: #7be6b5;
  background: rgba(68, 194, 145, 0.055);
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.roleCard {
  margin-top: 24px;
  padding: 20px;
  border: 1px solid rgba(255, 201, 85, 0.18);
  border-radius: 17px;
  background: linear-gradient(90deg, rgba(255, 199, 75, 0.06), rgba(0, 0, 0, 0.12));
}

.roleCard span {
  color: #d9ac4f;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.roleCard strong {
  display: block;
  margin-top: 9px;
  color: #f1f6f7;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 20px;
  line-height: 1.42;
}

.recordColumns {
  margin-top: 15px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.recordColumns > section {
  min-width: 0;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 17px;
  background: rgba(0, 0, 0, 0.13);
}

.cardHeading {
  padding-bottom: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.cardHeading span {
  color: #6ed9ea;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.cardHeading strong {
  color: #edca7d;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 18px;
}

.domainList {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.domainList > div {
  min-height: 58px;
  padding: 11px;
  display: grid;
  grid-template-columns: 29px minmax(0, 1fr);
  align-items: center;
  gap: 9px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.018);
}

.domainList span {
  width: 29px;
  height: 29px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(105, 221, 241, 0.13);
  border-radius: 8px;
  color: #66d2e3;
  font-size: 7px;
}

.domainList strong {
  min-width: 0;
  color: #aebfc6;
  font-size: 9px;
  line-height: 1.35;
}

.recordColumns ul {
  margin: 14px 0 0;
  padding: 0;
  display: grid;
  gap: 10px;
  list-style: none;
}

.recordColumns li {
  padding: 11px 12px 11px 35px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.055);
  border-radius: 11px;
  color: #a5b8bf;
  background: rgba(255, 255, 255, 0.016);
  font-size: 10px;
  line-height: 1.48;
}

.recordColumns li::before {
  content: "?";
  position: absolute;
  left: 10px;
  top: 10px;
  width: 17px;
  height: 17px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: #f1cb7b;
  background: rgba(255, 199, 75, 0.08);
  font-size: 8px;
  font-weight: 900;
}

.boundary {
  margin-top: 15px;
  padding: 20px;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  gap: 17px;
  border: 1px solid rgba(255, 199, 75, 0.2);
  border-radius: 17px;
  background: linear-gradient(145deg, rgba(48, 35, 10, 0.35), rgba(4, 19, 28, 0.72));
}

.boundarySeal {
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 199, 75, 0.3);
  border-radius: 50%;
  color: #efc871;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 15px;
}

.boundary span {
  color: #deb354;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.boundary p {
  margin: 8px 0 0;
  color: #d0dde1;
  font-size: 12px;
  line-height: 1.68;
}

.actions {
  margin-top: 18px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 9px;
}

.actions.left {
  justify-content: flex-start;
}

.actions a {
  min-height: 46px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  text-decoration: none;
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: transform 0.22s, border-color 0.22s;
}

.actions a:hover {
  transform: translateY(-2px);
}

.actions .secondary {
  color: #bfd0d6;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.18);
}

.actions .secondary:hover {
  border-color: rgba(105, 221, 241, 0.35);
}

.actions .primary {
  color: #04171f;
  border: 1px solid #aaf0fb;
  background: linear-gradient(135deg, #dafbff, #76ddea 64%, #35a8c2);
  box-shadow: 0 12px 28px rgba(53, 177, 205, 0.18);
}

.chainSection {
  border-top: 1px solid rgba(105, 221, 241, 0.12);
}

.chain {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  overflow: hidden;
  border: 1px solid rgba(104, 218, 238, 0.16);
  border-radius: 18px;
  background: rgba(4, 18, 28, 0.78);
}

.chain button {
  min-width: 0;
  min-height: 102px;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  color: #8ba1aa;
  background: transparent;
  cursor: pointer;
  transition: color 0.22s, background 0.22s, box-shadow 0.22s;
}

.chain button:last-child {
  border-right: 0;
}

.chain button:hover,
.chain button.active {
  color: #fff0bd;
  background: linear-gradient(180deg, rgba(255, 200, 76, 0.1), rgba(79, 211, 233, 0.06));
  box-shadow: inset 0 -3px #ffd15c;
}

.chain button span {
  color: #65d5e7;
  font-size: 8px;
  font-weight: 900;
}

.chain button strong {
  font-size: 10px;
}

.chainDetail {
  margin-top: 14px;
  padding: 38px;
  display: grid;
  grid-template-columns: 120px minmax(0, 1fr);
  gap: 8px 30px;
  border: 1px solid rgba(104, 218, 238, 0.14);
  border-radius: 21px;
  background: linear-gradient(145deg, rgba(9, 31, 45, 0.88), rgba(3, 15, 24, 0.94));
}

.chainDetail > span {
  grid-row: 1 / 3;
  color: #66d9eb;
  font-size: 9px;
  font-weight: 950;
  letter-spacing: 0.13em;
}

.chainDetail h3 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 46px;
}

.chainDetail p {
  margin: 0;
  color: #b3c4ca;
  font-size: 16px;
  line-height: 1.68;
}

.classes {
  border-top: 1px solid rgba(105, 221, 241, 0.12);
}

.classGrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
}

.classGrid article {
  min-height: 250px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(104, 218, 238, 0.13);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(10, 32, 46, 0.78), rgba(3, 16, 25, 0.9));
}

.classGrid article::after {
  content: "";
  position: absolute;
  right: -50px;
  bottom: -65px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(93, 215, 236, 0.08);
  filter: blur(24px);
}

.classGrid article > span {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 201, 85, 0.24);
  border-radius: 14px;
  color: #efc873;
  background: rgba(255, 199, 75, 0.035);
  font-size: 10px;
  font-weight: 950;
}

.classGrid h3 {
  margin: 28px 0 11px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 24px;
  line-height: 1.15;
}

.classGrid p {
  margin: 0;
  color: #8fa5ae;
  font-size: 12px;
  line-height: 1.66;
}

.academy {
  display: grid;
  grid-template-columns: 420px minmax(0, 1fr);
  align-items: center;
  gap: 62px;
  border-top: 1px solid rgba(105, 221, 241, 0.12);
  border-bottom: 1px solid rgba(105, 221, 241, 0.12);
}

.academy > .academySeal {
  width: 300px;
  height: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px solid rgba(103, 239, 181, 0.58);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(95, 239, 180, 0.16), rgba(4, 25, 28, 0.96) 68%);
  box-shadow: 0 0 76px rgba(71, 221, 166, 0.17);
}

.academy > .academySeal::before,
.academy > .academySeal::after {
  content: "";
  position: absolute;
  border: 1px solid rgba(101, 237, 181, 0.23);
  border-radius: 50%;
  animation: academyOrbit 22s linear infinite;
}

.academy > .academySeal::before {
  width: 390px;
  height: 240px;
}

.academy > .academySeal::after {
  width: 240px;
  height: 390px;
  animation-direction: reverse;
}

.academySeal small {
  color: #72bfa2;
  font-size: 10px;
  font-weight: 950;
  letter-spacing: 0.18em;
}

.academySeal strong {
  color: #baffd8;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 46px;
}

.academySeal span {
  margin-top: 7px;
  color: #67d9a6;
  font-size: 8px;
  font-weight: 950;
  letter-spacing: 0.14em;
}

.academySteps {
  margin-top: 26px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.academySteps > div {
  min-height: 62px;
  padding: 12px;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: center;
  gap: 11px;
  border: 1px solid rgba(102, 235, 181, 0.14);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
}

.academySteps span {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(102, 235, 181, 0.24);
  border-radius: 9px;
  color: #79e7b4;
  font-size: 8px;
}

.academySteps strong {
  color: #bdd1c9;
  font-size: 10px;
}

.ta14Boundary {
  text-align: center;
}

.ta14Boundary > p:not(.eyebrow) {
  max-width: 1020px;
  margin: 24px auto 0;
}

.boundaryGrid {
  max-width: 1160px;
  margin: 34px auto 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 13px;
}

.boundaryGrid article {
  min-height: 190px;
  padding: 24px;
  border: 1px solid rgba(255, 199, 75, 0.16);
  border-radius: 18px;
  background: linear-gradient(145deg, rgba(44, 33, 10, 0.32), rgba(4, 17, 26, 0.88));
  text-align: left;
}

.boundaryGrid span {
  color: #dfb153;
  font-size: 8px;
  font-weight: 950;
  letter-spacing: 0.13em;
}

.boundaryGrid strong {
  display: block;
  margin-top: 16px;
  color: #e4edef;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 19px;
  line-height: 1.48;
}

footer {
  min-height: 84px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  border-top: 1px solid rgba(105, 221, 241, 0.12);
  color: #607d88;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

@keyframes glowDrift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(70px, -35px, 0) scale(1.08);
  }
}

@keyframes authorityPacket {
  from {
    left: 0;
  }
  to {
    left: 100%;
  }
}

@keyframes sealRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes academyOrbit {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.failureSection,
.delegationSection,
.decisionSection {
  padding: 92px 0;
  border-top: 1px solid rgba(105, 221, 241, 0.12);
}

.failureGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.failureGrid > article {
  overflow: hidden;
  border: 1px solid rgba(104, 218, 238, 0.13);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(10, 32, 46, 0.8), rgba(3, 16, 25, 0.93));
  box-shadow: 0 20px 54px rgba(0, 0, 0, 0.19);
}

.failureHeader {
  min-height: 76px;
  padding: 17px 20px;
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.065);
  background: linear-gradient(90deg, rgba(255, 198, 75, 0.055), rgba(80, 207, 231, 0.035));
}

.failureHeader span {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 200, 78, 0.24);
  border-radius: 12px;
  color: #efc877;
  font-size: 9px;
  font-weight: 950;
}

.failureHeader strong {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 23px;
}

.failureBody {
  padding: 18px;
  display: grid;
  gap: 9px;
}

.failureBody > div {
  min-height: 96px;
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.055);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.016);
}

.failureBody small {
  color: #68d8e9;
  font-size: 7px;
  font-weight: 950;
  letter-spacing: 0.12em;
}

.failureBody > div:nth-child(2) small {
  color: #efb95e;
}

.failureBody > div:nth-child(3) small {
  color: #70e6b3;
}

.failureBody p {
  margin: 8px 0 0;
  color: #a8bbc2;
  font-size: 11px;
  line-height: 1.62;
}

.delegationGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.delegationGrid > article {
  min-height: 370px;
  padding: 22px;
  display: grid;
  grid-template-columns: 54px minmax(0, 1fr);
  align-items: start;
  gap: 16px;
  border: 1px solid rgba(104, 218, 238, 0.13);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(9, 31, 45, 0.8), rgba(3, 16, 25, 0.92));
}

.delegationNumber {
  width: 54px;
  height: 54px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 199, 75, 0.24);
  border-radius: 50%;
  color: #efc875;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 16px;
}

.delegationCopy > span {
  color: #67d7e8;
  font-size: 8px;
  font-weight: 950;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.delegationCopy h3 {
  margin: 10px 0 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 25px;
  line-height: 1.12;
}

.delegationRoute {
  margin: 16px 0 0;
  color: #e1c989;
  font-size: 11px;
  font-weight: 800;
  line-height: 1.6;
}

.delegationQuestion {
  margin-top: 20px;
  padding: 15px;
  border-left: 3px solid #ffd15c;
  border-radius: 0 11px 11px 0;
  background: rgba(255, 199, 75, 0.045);
}

.delegationQuestion small {
  color: #d9ac4f;
  font-size: 7px;
  font-weight: 950;
  letter-spacing: 0.12em;
}

.delegationQuestion p {
  margin: 8px 0 0;
  color: #becdd2;
  font-size: 11px;
  line-height: 1.62;
}

.decisionGrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 13px;
}

.decisionGrid article {
  min-height: 300px;
  padding: 25px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(10, 32, 46, 0.8), rgba(3, 16, 25, 0.94));
}

.decisionGrid article::after {
  content: "";
  position: absolute;
  right: -55px;
  bottom: -65px;
  width: 170px;
  height: 170px;
  border-radius: 50%;
  background: var(--stateGlow);
  filter: blur(48px);
  opacity: 0.18;
}

.decisionGrid article > span {
  color: #718c96;
  font-size: 9px;
  font-weight: 950;
}

.decisionGrid h3 {
  margin: 46px 0 14px;
  color: var(--stateColor);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 40px;
}

.decisionGrid p {
  margin: 0;
  color: #abbcc3;
  font-size: 12px;
  line-height: 1.64;
}

.decisionGrid small {
  display: block;
  margin-top: 20px;
  color: #718993;
  font-size: 9px;
  line-height: 1.55;
}

.allowState {
  --stateColor: #70e7b5;
  --stateGlow: #44d89a;
}

.holdState {
  --stateColor: #ffd15c;
  --stateGlow: #ffc23d;
}

.denyState {
  --stateColor: #ff7388;
  --stateGlow: #ff526d;
}

.escalateState {
  --stateColor: #b799ff;
  --stateGlow: #9a76ff;
}

@media (max-width: 1180px) {
  .delegationGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .decisionGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .failureGrid {
    grid-template-columns: 1fr;
  }

  .delegationGrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .decisionGrid {
    grid-template-columns: 1fr;
  }

  .delegationGrid > article {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1180px) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }

  .authorityGrid {
    grid-template-columns: 1fr;
  }

  .index {
    position: static;
    max-height: none;
  }

  .list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .chain {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .chain button:nth-child(4) {
    border-right: 0;
  }

  .classGrid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .academy {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 820px) {
  .shell {
    width: min(100% - 24px, 1500px);
  }

  .topbar {
    grid-template-columns: 1fr 1fr;
  }

  .status {
    display: none;
  }

  .definition,
  .metrics,
  .recordColumns,
  .boundaryGrid {
    grid-template-columns: 1fr;
  }

  .sectionHeading {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .list {
    grid-template-columns: 1fr;
  }

  .domainList {
    grid-template-columns: 1fr;
  }

  .recordHeader {
    flex-direction: column;
  }

  .chainDetail {
    grid-template-columns: 1fr;
  }

  .chainDetail > span {
    grid-row: auto;
  }
}

@media (max-width: 620px) {
  .shell {
    width: min(100% - 20px, 1500px);
  }

  .topbar {
    grid-template-columns: 1fr;
  }

  .topbar > a,
  .topbar .topAction,
  .topbar > a:first-child {
    width: 100%;
    justify-self: stretch;
  }

  .hero {
    padding: 66px 0 58px;
  }

  .hero h1 {
    font-size: 52px;
  }

  .lead {
    font-size: 15px;
  }

  .filters {
    grid-template-columns: 1fr;
  }

  .record {
    padding: 20px;
  }

  .recordIdentity {
    align-items: flex-start;
  }

  .recordSeal {
    width: 60px;
    height: 60px;
    flex-basis: 60px;
    font-size: 15px;
  }

  .boundary {
    grid-template-columns: 1fr;
  }

  .actions,
  .actions.left {
    flex-direction: column;
  }

  .actions a {
    width: 100%;
  }

  .chain {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .chain button:nth-child(even) {
    border-right: 0;
  }

  .classGrid {
    grid-template-columns: 1fr;
  }

  .academy > .academySeal {
    width: 230px;
    height: 230px;
  }

  .academy > .academySeal::before {
    width: 285px;
    height: 185px;
  }

  .academy > .academySeal::after {
    width: 185px;
    height: 285px;
  }

  .academySeal strong {
    font-size: 36px;
  }

  .academySteps {
    grid-template-columns: 1fr;
  }

  footer {
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  :global(*) {
    scroll-behavior: auto !important;
    animation: none !important;
    transition: none !important;
  }
}

      `}</style>
    </main>
  );
}
