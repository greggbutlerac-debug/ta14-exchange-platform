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

      <style jsx>{``}</style>
    </main>
  );
}
