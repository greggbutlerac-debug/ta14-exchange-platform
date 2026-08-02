"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Division = {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  accent: string;
  glow: string;
  contents: string[];
  academy: string;
};

type Instrument = {
  name: string;
  domain: string;
  authority: string;
  status: string;
  route: string;
};

const divisions: Division[] = [
  {
    id: "law",
    code: "LAW",
    title: "Current Law",
    subtitle: "Preserve enacted authority as it actually exists",
    description:
      "Inspect statutes, acts, treaties, regulations, legal authorities, applicability, duties, evidence requirements, enforcement mechanisms, and unresolved gaps without confusing current law with a TA-14 proposal.",
    href: "/governance-library/laws",
    accent: "#f5c86b",
    glow: "rgba(245, 200, 107, .42)",
    contents: [
      "Clean Air Act and air-pollution law",
      "Clean Water Act and water-protection law",
      "Safe Drinking Water Act",
      "RCRA, CERCLA, TSCA, FIFRA, and EPCRA",
      "AI, data, product-safety, and consequential-system law",
      "International environmental agreements and implementation",
    ],
    academy: "Current Law Academy",
  },
  {
    id: "proposed",
    code: "PROP",
    title: "TA-14 Proposed Law",
    subtitle: "Expose the gap and publish the governed upgrade",
    description:
      "Study clearly labeled TA-14 model acts, legislative upgrades, proposed duties, evidence requirements, authority pathways, enforcement structures, execution controls, and outcome protections.",
    href: "/governance-library/laws",
    accent: "#ff9f68",
    glow: "rgba(255, 159, 104, .42)",
    contents: [
      "Proposed Clean Air and Atmospheric Integrity Act",
      "Proposed Water Integrity and Outcome Act",
      "Proposed Admissible Environmental Execution Act",
      "Model AI execution and evidence legislation",
      "Modernized inspection, enforcement, and public-record duties",
      "Public consultation, challenge, correction, and version history",
    ],
    academy: "Proposed Law Academy",
  },
  {
    id: "regulations",
    code: "REG",
    title: "Regulations & Implementation",
    subtitle: "Translate statutory authority into operational requirements",
    description:
      "Navigate agency rules, implementation programs, permits, monitoring requirements, regulatory methods, reporting duties, enforcement pathways, and the relationship between law and technical execution.",
    href: "/governance-library/regulations",
    accent: "#69c8ff",
    glow: "rgba(105, 200, 255, .42)",
    contents: [
      "EPA air, water, waste, chemical, and pollution programs",
      "Title 40 CFR implementation pathways",
      "Monitoring, reporting, permitting, and record duties",
      "Refrigerant, methane, greenhouse-gas, and transition programs",
      "AI, privacy, product-safety, and sector regulation",
      "Applicability, version, jurisdiction, and enforcement mapping",
    ],
    academy: "Regulatory Implementation Academy",
  },
  {
    id: "standards",
    code: "STD",
    title: "Standards, Codes & Technical Modernization",
    subtitle: "Distinguish voluntary guidance from adopted authority",
    description:
      "Inspect ASHRAE, ANSI-accredited, ISO, IEEE, building, mechanical, environmental, measurement, laboratory, and AI governance standards together with their actual adoption and enforceability status.",
    href: "/governance-library/standards",
    accent: "#7de7c0",
    glow: "rgba(125, 231, 192, .42)",
    contents: [
      "ASHRAE ventilation, filtration, comfort, energy, and health standards",
      "ANSI-accredited and ISO management and technical standards",
      "Building, mechanical, electrical, and environmental codes",
      "EPA methods, laboratory competence, and measurement integrity",
      "AI governance, lifecycle, risk, and execution standards",
      "TA-14 proposed evidence, HVAC, atmospheric, and execution standards",
    ],
    academy: "Standards Academy",
  },
];

const featuredInstruments: Instrument[] = [
  {
    name: "Clean Air Act",
    domain: "Air & Atmospheric Protection",
    authority: "United States federal statute",
    status: "Current law",
    route: "/governance-library/laws",
  },
  {
    name: "Clean Water Act",
    domain: "Water & Discharge Governance",
    authority: "United States federal statute",
    status: "Current law",
    route: "/governance-library/laws",
  },
  {
    name: "Safe Drinking Water Act",
    domain: "Drinking Water Protection",
    authority: "United States federal statute",
    status: "Current law",
    route: "/governance-library/laws",
  },
  {
    name: "RCRA",
    domain: "Waste & Hazardous Materials",
    authority: "United States federal statute",
    status: "Current law",
    route: "/governance-library/laws",
  },
  {
    name: "CERCLA / Superfund",
    domain: "Contamination & Remediation",
    authority: "United States federal statute",
    status: "Current law",
    route: "/governance-library/laws",
  },
  {
    name: "TSCA",
    domain: "Chemical Governance",
    authority: "United States federal statute",
    status: "Current law",
    route: "/governance-library/laws",
  },
  {
    name: "Montreal Protocol",
    domain: "Atmospheric & Ozone Protection",
    authority: "Multilateral environmental agreement",
    status: "International instrument",
    route: "/governance-library/laws",
  },
  {
    name: "WHO Global Air Quality Guidelines",
    domain: "Public Health Guidance",
    authority: "World Health Organization guidance",
    status: "Non-binding guidance",
    route: "/governance-library/laws",
  },
  {
    name: "ASHRAE Standard 62.1",
    domain: "Ventilation & Indoor Air Quality",
    authority: "Consensus standard",
    status: "Published standard",
    route: "/governance-library/standards",
  },
  {
    name: "ISO/IEC 42001",
    domain: "AI Management Systems",
    authority: "International standard",
    status: "Published standard",
    route: "/governance-library/standards",
  },
  {
    name: "EU AI Act",
    domain: "AI & Consequential Systems",
    authority: "European Union regulation",
    status: "Current law",
    route: "/governance-library/laws",
  },
  {
    name: "TA-14 Proposed Atmospheric Integrity Act",
    domain: "Atmospheric Evidence & Outcome",
    authority: "TA-14 model legislation",
    status: "Proposed law",
    route: "/governance-library/laws",
  },
];

const comparisonSteps = [
  ["01", "Identify", "Preserve the official instrument, issuer, jurisdiction, edition, status, and controlling source."],
  ["02", "Teach", "Explain what the current instrument requires, why it was created, and where it applies."],
  ["03", "Expose the gap", "Identify missing evidence, weak authority, obsolete assumptions, enforcement failures, and outcome blindness."],
  ["04", "Explain consequence", "Show what people, institutions, environments, and systems risk when the gap remains open."],
  ["05", "Propose the upgrade", "Publish clearly labeled TA-14 model language, technical controls, evidence duties, and review mechanisms."],
  ["06", "Compare", "Show what changes in authority, records, execution, enforcement, public protection, and verified outcomes."],
  ["07", "Challenge", "Invite review, objection, correction, revision, and preserved version history."],
  ["08", "Prepare for adoption", "Provide implementation maps, standards crosswalks, training, and readiness pathways."],
] as const;

const academyTracks = [
  ["LAW", "Current Law Academy", "Learn what enacted acts, statutes, regulations, and international instruments require and where their authority ends."],
  ["PROP", "Proposed Law Academy", "Inspect the gap, study TA-14 model language, compare old and upgraded versions, and test the proposal in scenarios."],
  ["REG", "Regulatory Implementation Academy", "Learn how agencies translate authority into rules, permits, monitoring, reporting, enforcement, and evidence duties."],
  ["STD", "Standards Academy", "Understand standards, guidelines, codes, incorporation by reference, contractual adoption, and technical modernization."],
  ["AIR", "Air & Atmospheric Law Academy", "Study air-pollution law, atmospheric evidence, public-health guidance, building protection, and proposed upgrades."],
  ["WTR", "Water Law Academy", "Study drinking water, discharges, sampling, treatment, contamination, remediation, and outcome verification."],
] as const;

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function LawStandardsPublicPolicyPage() {
  const [selectedId, setSelectedId] = useState(divisions[0].id);
  const [query, setQuery] = useState("");
  const selected = useMemo(
    () => divisions.find((division) => division.id === selectedId) ?? divisions[0],
    [selectedId],
  );

  const filteredInstruments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return featuredInstruments;
    return featuredInstruments.filter((instrument) =>
      [instrument.name, instrument.domain, instrument.authority, instrument.status]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  return (
    <main>
      <div className="policyCanvas" aria-hidden="true">
        <div className="glow glowOne" />
        <div className="glow glowTwo" />
        <div className="grid" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
        <div className="sealField" />
      </div>

      <header className="institutionBar shell">
        <Link href="/" className="identity">
          <span className="identitySeal">TA</span>
          <span>
            <strong>TA-14 Authority Governance Institution</strong>
            <small>Law, Standards & Public Policy</small>
          </span>
        </Link>
        <nav aria-label="Law, standards, and public policy navigation">
          <Link href="/">Institution Home</Link>
          <Link href="/academy">TA-14 Academy</Link>
          <Link href="/governance-library/laws">Current & Proposed Law</Link>
          <Link href="/governance-library/standards">Standards</Link>
          <Link className="navPrimary" href="/governance-library/regulations">Regulations</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">TA-14 LAW, STANDARDS & PUBLIC POLICY</p>
          <h1>
            Preserve what governs now.
            <em> Build what should govern next.</em>
          </h1>
          <p className="heroLead">
            This institutional division preserves current law, regulations, standards, codes, public-health guidance, and international instruments as they actually exist—then teaches their gaps and publishes clearly labeled TA-14 proposals for stronger evidence, authority, execution, enforcement, and outcomes.
          </p>
          <div className="heroActions">
            <Link className="button primary" href="#division-hall">Enter the Division <span>↓</span></Link>
            <Link className="button gold" href="/governance-library/laws">Open Current & Proposed Law <Arrow /></Link>
            <Link className="button secondary" href="/governance-library/standards">Open Standards & Codes <Arrow /></Link>
            <Link className="button secondary" href="/academy">Enter Law & Standards Academy <Arrow /></Link>
          </div>
          <div className="statusRule">
            <span>INSTITUTIONAL DISTINCTION</span>
            <strong>Current law is not proposed law. A standard is not automatically law. Guidance is not binding authority.</strong>
          </div>
        </div>

        <div className="heroMonument" aria-label="Law, standards, and public policy institutional model">
          <div className="monumentHalo" />
          <div className="monumentArch">
            <span className="monumentCode">LSP</span>
            <strong>Law · Standards · Public Policy</strong>
            <small>CURRENT AUTHORITY · IDENTIFIED GAP · PROPOSED UPGRADE</small>
          </div>
          <div className="monumentOrbit orbitA"><i>LAW</i></div>
          <div className="monumentOrbit orbitB"><i>REGULATION</i></div>
          <div className="monumentOrbit orbitC"><i>STANDARDS</i></div>
          <div className="monumentOrbit orbitD"><i>ACADEMY</i></div>
          <div className="monumentMetrics">
            <article><strong>04</strong><span>governed pathways</span></article>
            <article><strong>08</strong><span>comparison stages</span></article>
            <article><strong>01</strong><span>preserved authority chain</span></article>
          </div>
        </div>
      </section>

      <section className="definitionBand shell">
        <article>
          <span>WHAT EXISTS</span>
          <strong>Preserve the controlling instrument and its real status</strong>
          <p>Statute, regulation, treaty, standard, code, guidance, policy, contractual requirement, adopted edition, and jurisdiction.</p>
        </article>
        <article>
          <span>WHAT IS MISSING</span>
          <strong>Expose the primitive or incomplete layer</strong>
          <p>Missing records, unclear authority, weak enforcement, obsolete assumptions, poor execution controls, and unverified outcomes.</p>
        </article>
        <article>
          <span>WHAT TA-14 ADDS</span>
          <strong>Publish an inspectable, challengeable upgrade</strong>
          <p>Model language, evidence duties, authority maps, implementation pathways, Academy instruction, and preserved revisions.</p>
        </article>
      </section>

      <section className="divisionSection shell" id="division-hall">
        <div className="sectionHeading centered">
          <p className="eyebrow">THE FOUR INTERNAL PATHWAYS</p>
          <h2>One institutional door. Four distinct authorities behind it.</h2>
          <p>Law, proposed law, implementing regulation, and technical standards remain separate. The division cross-links them without flattening their authority or legal status.</p>
        </div>

        <div className="divisionLayout">
          <div className="divisionRail" role="tablist" aria-label="Law, standards, and public policy pathways">
            {divisions.map((division) => (
              <button
                type="button"
                role="tab"
                aria-selected={selected.id === division.id}
                key={division.id}
                onClick={() => setSelectedId(division.id)}
                className={selected.id === division.id ? "active" : ""}
                style={{ "--accent": division.accent, "--glow": division.glow } as CSSProperties}
              >
                <span>{division.code}</span>
                <div>
                  <strong>{division.title}</strong>
                  <small>{division.subtitle}</small>
                </div>
                <i>→</i>
              </button>
            ))}
          </div>

          <article
            className="divisionDetail"
            style={{ "--accent": selected.accent, "--glow": selected.glow } as CSSProperties}
          >
            <div className="detailSeal">
              <div className="detailHalo" />
              <div className="detailCore">
                <span>{selected.code}</span>
                <small>INSTITUTIONAL PATHWAY</small>
              </div>
              <i className="detailRing one" />
              <i className="detailRing two" />
            </div>
            <div className="detailCopy">
              <p className="detailKicker">{selected.subtitle}</p>
              <h3>{selected.title}</h3>
              <p>{selected.description}</p>
              <div className="contentsPanel">
                <span>WHAT THIS PATHWAY CONTAINS</span>
                <ul>
                  {selected.contents.map((item) => <li key={item}><i>✦</i>{item}</li>)}
                </ul>
              </div>
              <div className="academyBridge">
                <span>ACADEMY PATHWAY</span>
                <strong>{selected.academy}</strong>
                <p>Learn the instrument, inspect the gap, compare the proposed upgrade, run scenarios, and understand what changes in practice.</p>
              </div>
              <div className="detailActions">
                <Link className="button primary" href={selected.href}>Enter {selected.title} <Arrow /></Link>
                <Link className="button secondary" href="/academy">Open Academy Pathway <Arrow /></Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="instrumentSection shell">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">FEATURED AUTHORITY LIBRARY</p>
            <h2>Begin with the laws and standards that shape public protection.</h2>
          </div>
          <p>The complete law, regulations, and standards workspaces contain the governed records. This institutional index shows how major instruments enter the division.</p>
        </div>

        <label className="searchField">
          <span>Search featured instruments</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Clean Air Act, WHO, ASHRAE, AI Act..."
          />
        </label>

        <div className="instrumentGrid">
          {filteredInstruments.map((instrument, index) => (
            <Link href={instrument.route} key={instrument.name}>
              <span className="instrumentNumber">{String(index + 1).padStart(2, "0")}</span>
              <small>{instrument.status}</small>
              <h3>{instrument.name}</h3>
              <p>{instrument.domain}</p>
              <strong>{instrument.authority}</strong>
              <b>Open governed record <Arrow /></b>
            </Link>
          ))}
        </div>
      </section>

      <section className="comparisonSection shell">
        <div className="sectionHeading centered">
          <p className="eyebrow">THE TA-14 MODERNIZATION METHOD</p>
          <h2>Teach the existing instrument. Expose the gap. Propose the governed upgrade.</h2>
          <p>The Academy does not merely say that an act or standard is outdated. It shows precisely what it governs, what it leaves out, why the omission matters, and what the upgraded version would change.</p>
        </div>
        <div className="comparisonGrid">
          {comparisonSteps.map(([code, title, text]) => (
            <article key={code}>
              <span>{code}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="authorityChain shell">
        <div className="sectionHeading">
          <p className="eyebrow">THE AUTHORITY-TO-OUTCOME CHAIN</p>
          <h2>No citation should silently become permission to execute.</h2>
          <p>TA-14 preserves how an authority becomes applicable, how technical requirements become evidence duties, and how a determination is bound before consequence is allowed.</p>
        </div>
        <div className="chainTrack">
          {["Instrument", "Jurisdiction", "Applicability", "Requirement", "Evidence", "Authority", "Determination", "Execution", "Outcome"].map((item, index, array) => (
            <div key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
              {index < array.length - 1 ? <i>→</i> : null}
            </div>
          ))}
        </div>
        <div className="chainNotes">
          <article>
            <span>THE LEGAL QUESTION</span>
            <strong>What authority applies, to whom, where, when, and under which version?</strong>
          </article>
          <article>
            <span>THE EVIDENCE QUESTION</span>
            <strong>What record proves that the applicable requirement was satisfied or violated?</strong>
          </article>
          <article>
            <span>THE EXECUTION QUESTION</span>
            <strong>What consequence may be bound, by whom, and what outcome must return to the record?</strong>
          </article>
        </div>
      </section>

      <section className="academySection shell">
        <div className="academyVisual" aria-hidden="true">
          <div className="academySeal">
            <small>TA-14</small>
            <strong>ACADEMY</strong>
            <span>LAW · STANDARDS · PUBLIC POLICY</span>
          </div>
          <i className="academyOrbit one" />
          <i className="academyOrbit two" />
          <i className="academyOrbit three" />
        </div>
        <div className="academyCopy">
          <p className="eyebrow">THE ACADEMY INSIDE THE DIVISION</p>
          <h2>Understand the old act, inspect what it leaves out, and see what the upgraded version brings to the table.</h2>
          <p>Each Academy pathway teaches the current instrument, its original purpose, its actual authority, its evidence and enforcement limits, the TA-14 proposed improvement, and the practical difference between the existing and upgraded versions.</p>
          <div className="academyGrid">
            {academyTracks.map(([code, title, text]) => (
              <Link href="/academy" key={title}>
                <span>{code}</span>
                <div><strong>{title}</strong><p>{text}</p></div>
                <b>↗</b>
              </Link>
            ))}
          </div>
          <div className="heroActions leftActions">
            <Link className="button academyButton" href="/academy">Enter Law & Standards Academy <Arrow /></Link>
            <Link className="button secondary" href="/academy/simulation-center">Open Simulation Center <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="crossDivision shell">
        <div>
          <p className="eyebrow">CONNECTED INSTITUTIONAL WORLDS</p>
          <h2>Law and standards must remain connected to the reality they are supposed to govern.</h2>
          <p>Environmental Integrity Governance supplies environmental records, measurements, interventions, and outcomes. The AI Governance Exchange supplies governed AI routes, artifacts, entity reviews, and execution evidence. This division translates those realities into law, regulation, standards, policy, and proposed upgrades.</p>
        </div>
        <div className="crossGrid">
          <Link href="/environmental-integrity-governance">
            <span>EIG</span>
            <strong>Environmental Integrity Governance</strong>
            <p>Air, water, land, buildings, HVAC, pollution, records, intervention, and verified environmental outcomes.</p>
            <b>Enter division <Arrow /></b>
          </Link>
          <Link href="/workspace/ai-governance">
            <span>AI</span>
            <strong>TA-14 AI Governance Exchange</strong>
            <p>Consequential AI, authority, evidence, entity review, execution artifacts, registries, and verified outcomes.</p>
            <b>Enter Exchange <Arrow /></b>
          </Link>
        </div>
      </section>

      <section className="closingSection shell">
        <div className="closingGlow" aria-hidden="true" />
        <p className="eyebrow">TA-14 LAW, STANDARDS & PUBLIC POLICY</p>
        <h2>Preserve authority. Teach the gap. Publish the upgrade. Govern the outcome.</h2>
        <p>Enter the current law, proposed law, regulations, standards, or Academy pathway that matches the instrument you need to inspect, compare, modernize, or implement.</p>
        <div className="heroActions">
          <Link className="button gold" href="/governance-library/laws">Current & Proposed Law <Arrow /></Link>
          <Link className="button primary" href="/governance-library/regulations">Regulations & Implementation <Arrow /></Link>
          <Link className="button secondary" href="/governance-library/standards">Standards & Codes <Arrow /></Link>
          <Link className="button academyButton" href="/academy">TA-14 Academy <Arrow /></Link>
        </div>
        <strong className="finalRule">Current authority must be preserved. Proposed authority must be clearly labeled.</strong>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <span>Law, Standards & Public Policy · TA14Authority.org</span>
      </footer>

      <style jsx>{`
        :global(*){box-sizing:border-box}
        :global(html){scroll-behavior:smooth;background:#070b12}
        :global(body){margin:0;background:#070b12;color:#f8fbff;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        :global(a){color:inherit}
        main{min-height:100vh;position:relative;overflow:hidden;isolation:isolate;background:linear-gradient(180deg,rgba(7,11,18,.78),rgba(9,10,14,.96))}
        .shell{width:min(1480px,calc(100% - 36px));margin-inline:auto;position:relative;z-index:2}
        .policyCanvas{position:fixed;inset:0;z-index:-3;overflow:hidden;pointer-events:none;background:radial-gradient(circle at 50% -12%,rgba(162,107,32,.17),transparent 34%),linear-gradient(180deg,#080c14,#101018 48%,#07090d)}
        .glow{position:absolute;border-radius:50%;filter:blur(110px);opacity:.15;animation:drift 18s ease-in-out infinite alternate}
        .glowOne{width:760px;height:760px;left:-280px;top:18%;background:#217cc1}
        .glowTwo{width:780px;height:780px;right:-300px;top:44%;background:#c08327;animation-delay:-8s}
        .grid{position:absolute;inset:0;opacity:.1;background-image:linear-gradient(rgba(242,198,105,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(242,198,105,.3) 1px,transparent 1px);background-size:86px 86px;mask-image:linear-gradient(to bottom,transparent 3%,black 30%,black 82%,transparent)}
        .route{position:absolute;width:75vw;height:1px;background:linear-gradient(90deg,transparent,rgba(91,194,255,.55),rgba(246,198,98,.65),transparent);filter:drop-shadow(0 0 8px rgba(245,200,107,.4))}
        .route::after{content:"";position:absolute;top:-3px;left:10%;width:7px;height:7px;border-radius:50%;background:#fff0b0;box-shadow:0 0 18px #f5c86b;animation:packet 8s linear infinite}
        .routeOne{top:25%;left:-15%;transform:rotate(-8deg)}
        .routeTwo{top:70%;right:-20%;transform:rotate(9deg)}
        .sealField{position:absolute;inset:0;background:radial-gradient(circle at 20% 40%,rgba(255,255,255,.04) 0 1px,transparent 1.5px);background-size:130px 130px;opacity:.3}
        .institutionBar{min-height:88px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid rgba(245,200,107,.15)}
        .identity{display:flex;align-items:center;gap:13px;text-decoration:none}
        .identitySeal{width:46px;height:46px;display:grid;place-items:center;border-radius:50%;border:1px solid rgba(245,200,107,.55);background:radial-gradient(circle,rgba(245,200,107,.15),rgba(12,18,28,.95));color:#ffe3a0;font-family:Georgia,serif;font-weight:900;box-shadow:0 0 25px rgba(245,200,107,.12)}
        .identity strong,.identity small{display:block}.identity strong{font-family:Georgia,serif;font-size:16px}.identity small{margin-top:3px;color:#c3a866;font-size:10px;font-weight:900;letter-spacing:.15em;text-transform:uppercase}
        nav{display:flex;align-items:center;gap:7px;flex-wrap:wrap;justify-content:flex-end}nav a{padding:10px 12px;border-radius:10px;color:#b8b5ad;text-decoration:none;font-size:11px;font-weight:800}nav a:hover{color:white;background:rgba(255,255,255,.04)}nav .navPrimary{color:#211600;background:linear-gradient(135deg,#fff0b6,#edbd52)}
        .hero{min-height:760px;padding:90px 0 78px;display:grid;grid-template-columns:minmax(0,1.1fr) minmax(430px,.9fr);gap:70px;align-items:center}
        .eyebrow{margin:0;color:#f0c66b;font-size:11px;font-weight:950;letter-spacing:.23em;text-transform:uppercase}
        .hero h1,.sectionHeading h2,.academyCopy h2,.crossDivision h2,.closingSection h2{margin:14px 0 20px;font-family:Georgia,"Times New Roman",serif;font-size:clamp(48px,6vw,92px);line-height:.96;letter-spacing:-.055em;text-wrap:balance}
        .hero h1 em{display:block;color:#76d8ff;font-style:italic;text-shadow:0 0 35px rgba(118,216,255,.14)}
        .heroLead{max-width:860px;margin:0;color:#c7c9cc;font-size:18px;line-height:1.72}
        .heroActions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.leftActions{justify-content:flex-start}
        .button{min-height:52px;padding:0 22px;display:inline-flex;align-items:center;justify-content:center;gap:13px;border:1px solid transparent;border-radius:14px;text-decoration:none;font-size:13px;font-weight:950;transition:.25s;position:relative;overflow:hidden}.button:hover{transform:translateY(-4px)}
        .button.primary{color:#04131a;background:linear-gradient(135deg,#d4f7ff,#72d8ef 64%,#2e9ebc);border-color:#9deaff;box-shadow:0 16px 34px rgba(65,177,210,.18)}
        .button.gold{color:#211600;background:linear-gradient(135deg,#fff0b1,#edbc4d 65%,#a96b0c);border-color:#f5d77c}
        .button.secondary{color:#f4f1e9;border-color:rgba(245,200,107,.22);background:linear-gradient(180deg,rgba(45,38,24,.9),rgba(17,18,24,.94));box-shadow:inset 0 1px rgba(255,255,255,.04)}
        .button.academyButton{color:#071612;background:linear-gradient(135deg,#d4ffec,#64e9ae 65%,#24966a);border-color:#9df1c8}
        .statusRule{margin-top:30px;padding:17px 20px;border-left:3px solid #f5c86b;background:linear-gradient(90deg,rgba(245,200,107,.08),transparent);border-radius:0 12px 12px 0}.statusRule span{display:block;color:#9d895d;font-size:9px;font-weight:950;letter-spacing:.16em}.statusRule strong{display:block;margin-top:7px;font-family:Georgia,serif;font-size:18px;color:#fff0bd}
        .heroMonument{height:570px;position:relative;display:grid;place-items:center}.monumentHalo{position:absolute;width:490px;height:490px;border-radius:50%;background:radial-gradient(circle,rgba(245,200,107,.19),transparent 68%);filter:blur(22px);animation:breathe 4s ease-in-out infinite alternate}.monumentArch{width:270px;height:300px;position:relative;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:2px solid rgba(245,200,107,.62);border-radius:145px 145px 24px 24px;background:radial-gradient(circle at 50% 38%,rgba(245,200,107,.13),rgba(12,17,25,.96) 64%);box-shadow:0 0 70px rgba(245,200,107,.18),inset 0 0 40px rgba(118,216,255,.06)}
        .monumentCode{font-family:Georgia,serif;font-size:66px;color:#ffe39a;font-weight:900}.monumentArch strong{font-family:Georgia,serif;font-size:22px;max-width:210px}.monumentArch small{max-width:185px;margin-top:9px;color:#8abecf;font-size:8px;font-weight:950;letter-spacing:.14em}
        .monumentOrbit{position:absolute;left:50%;top:50%;border:1px solid rgba(245,200,107,.26);border-radius:50%;transform:translate(-50%,-50%);animation:orbitSpin 24s linear infinite}.monumentOrbit i{position:absolute;left:50%;top:-11px;padding:5px 9px;border-radius:999px;background:#18191f;border:1px solid rgba(245,200,107,.3);color:#fff1c4;font-size:8px;font-style:normal;font-weight:950;letter-spacing:.08em}.orbitA{width:350px;height:350px}.orbitB{width:420px;height:250px;transform:translate(-50%,-50%) rotate(31deg);animation-direction:reverse;animation-duration:19s}.orbitC{width:470px;height:470px;animation-duration:31s}.orbitD{width:520px;height:310px;transform:translate(-50%,-50%) rotate(-34deg);animation-direction:reverse;animation-duration:27s}
        .monumentMetrics{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:min(100%,540px);display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.monumentMetrics article{padding:13px 10px;border:1px solid rgba(245,200,107,.14);border-radius:11px;background:rgba(15,17,23,.84);text-align:center}.monumentMetrics strong{display:block;color:#fff0bd;font-family:Georgia,serif;font-size:24px}.monumentMetrics span{display:block;margin-top:4px;color:#8f8d88;font-size:8px;font-weight:900;text-transform:uppercase}
        .definitionBand{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;padding:0 0 82px}.definitionBand article{padding:25px;border:1px solid rgba(245,200,107,.14);border-radius:20px;background:linear-gradient(145deg,rgba(34,30,23,.82),rgba(13,17,24,.9));box-shadow:0 18px 42px rgba(0,0,0,.18)}.definitionBand span{color:#c1a35d;font-size:9px;font-weight:950;letter-spacing:.16em}.definitionBand strong{display:block;margin:13px 0 9px;font-family:Georgia,serif;font-size:21px}.definitionBand p{margin:0;color:#a6a7aa;font-size:13px;line-height:1.6}
        .divisionSection,.instrumentSection,.comparisonSection,.authorityChain,.academySection,.crossDivision,.closingSection{padding:92px 0}.sectionHeading{max-width:1080px}.sectionHeading.centered{text-align:center;margin-inline:auto}.sectionHeading h2,.academyCopy h2,.crossDivision h2,.closingSection h2{font-size:clamp(40px,4.9vw,72px)}.sectionHeading>p:last-child,.academyCopy>p,.crossDivision>div>p,.closingSection>p{color:#b6b7ba;font-size:16px;line-height:1.72}
        .divisionLayout{display:grid;grid-template-columns:410px 1fr;gap:20px;margin-top:45px}.divisionRail{display:flex;flex-direction:column;gap:9px}.divisionRail button{width:100%;padding:18px;display:grid;grid-template-columns:58px 1fr 20px;gap:13px;align-items:center;border:1px solid rgba(255,255,255,.07);border-radius:15px;color:#ece9e1;background:linear-gradient(145deg,rgba(35,31,24,.8),rgba(14,17,23,.92));text-align:left;cursor:pointer;transition:.25s}.divisionRail button:hover,.divisionRail button.active{transform:translateX(6px);border-color:var(--accent);box-shadow:0 10px 30px var(--glow),inset 0 0 28px rgba(255,255,255,.025)}.divisionRail button>span{width:56px;height:56px;display:grid;place-items:center;border-radius:12px;border:1px solid var(--accent);color:var(--accent);background:rgba(11,15,22,.75);font-weight:950}.divisionRail strong,.divisionRail small{display:block}.divisionRail strong{font-size:13px}.divisionRail small{margin-top:5px;color:#94928c;font-size:10px;line-height:1.35}.divisionRail i{color:var(--accent);font-style:normal}
        .divisionDetail{min-height:680px;padding:40px;display:grid;grid-template-columns:300px 1fr;gap:40px;align-items:center;border:1px solid color-mix(in srgb,var(--accent) 34%,transparent);border-radius:28px;background:radial-gradient(circle at 12% 42%,var(--glow),transparent 34%),linear-gradient(145deg,rgba(31,29,25,.9),rgba(10,14,20,.97));box-shadow:0 30px 75px rgba(0,0,0,.28),inset 0 1px rgba(255,255,255,.04)}
        .detailSeal{height:420px;position:relative;display:grid;place-items:center}.detailHalo{position:absolute;width:275px;height:275px;border-radius:50%;background:radial-gradient(circle,var(--glow),transparent 70%);filter:blur(18px);animation:breathe 3.5s ease-in-out infinite alternate}.detailCore{width:180px;height:180px;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:50%;border:2px solid var(--accent);background:radial-gradient(circle,rgba(255,255,255,.08),rgba(12,16,22,.96));box-shadow:0 0 55px var(--glow)}.detailCore span{color:var(--accent);font-family:Georgia,serif;font-size:44px;font-weight:900}.detailCore small{margin-top:7px;color:#c7c5bf;font-size:8px;font-weight:950;letter-spacing:.12em}.detailRing{position:absolute;border-radius:50%;border:1px solid color-mix(in srgb,var(--accent) 55%,transparent);animation:orbitSpin 15s linear infinite}.detailRing.one{width:250px;height:370px}.detailRing.two{width:340px;height:220px;transform:rotate(37deg);animation-direction:reverse}
        .detailKicker{margin:0;color:var(--accent);font-size:10px;font-weight:950;letter-spacing:.15em;text-transform:uppercase}.detailCopy h3{margin:12px 0 14px;font-family:Georgia,serif;font-size:48px;line-height:1}.detailCopy>p{color:#c0c0c1;font-size:16px;line-height:1.65}.contentsPanel{margin-top:25px;padding:19px;border:1px solid color-mix(in srgb,var(--accent) 22%,transparent);border-radius:16px;background:rgba(255,255,255,.022)}.contentsPanel>span,.academyBridge>span{color:var(--accent);font-size:8px;font-weight:950;letter-spacing:.14em}.contentsPanel ul{list-style:none;padding:0;margin:12px 0 0;display:grid;grid-template-columns:1fr 1fr;gap:10px 18px}.contentsPanel li{display:flex;gap:9px;color:#aaa9a6;font-size:11px;line-height:1.45}.contentsPanel li i{color:var(--accent);font-style:normal}.academyBridge{margin-top:18px;padding:18px;border-left:3px solid var(--accent);background:linear-gradient(90deg,var(--glow),transparent);border-radius:0 14px 14px 0}.academyBridge strong{display:block;margin-top:7px;font-family:Georgia,serif;font-size:19px}.academyBridge p{margin:6px 0 0;color:#9e9d99;font-size:11px;line-height:1.5}.detailActions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
        .instrumentSection .sectionHeading{display:grid;grid-template-columns:1.15fr .85fr;gap:40px;align-items:end;max-width:none}.instrumentSection .sectionHeading>p{margin:0}.searchField{margin-top:28px;display:grid;gap:8px}.searchField span{color:#b89b57;font-size:9px;font-weight:950;letter-spacing:.12em;text-transform:uppercase}.searchField input{width:100%;min-height:54px;padding:0 17px;border:1px solid rgba(245,200,107,.18);border-radius:14px;outline:none;color:white;background:rgba(13,17,23,.86);font:inherit}.instrumentGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-top:18px}.instrumentGrid a{min-height:255px;padding:21px;display:flex;flex-direction:column;border:1px solid rgba(245,200,107,.13);border-radius:18px;background:linear-gradient(145deg,rgba(34,30,23,.78),rgba(11,15,21,.94));text-decoration:none;transition:.25s}.instrumentGrid a:hover{transform:translateY(-5px);border-color:rgba(118,216,255,.45);box-shadow:0 20px 45px rgba(0,0,0,.25)}.instrumentNumber{color:#756b56;font-size:9px}.instrumentGrid small{margin-top:18px;color:#6fc9ea;font-size:8px;font-weight:950;letter-spacing:.11em;text-transform:uppercase}.instrumentGrid h3{margin:9px 0 7px;font-family:Georgia,serif;font-size:24px;line-height:1.1}.instrumentGrid p{margin:0;color:#b09d6d;font-size:10px;font-weight:900;text-transform:uppercase}.instrumentGrid strong{margin-top:10px;color:#9e9fa2;font-size:11px;line-height:1.45}.instrumentGrid b{margin-top:auto;padding-top:18px;color:#83d9f3;font-size:10px}
        .comparisonGrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:42px}.comparisonGrid article{min-height:220px;padding:22px;border:1px solid rgba(245,200,107,.13);border-radius:18px;background:linear-gradient(145deg,rgba(35,30,21,.75),rgba(12,16,22,.94))}.comparisonGrid span{width:42px;height:42px;display:grid;place-items:center;border:1px solid rgba(245,200,107,.24);border-radius:50%;color:#f3c86b;font-size:9px}.comparisonGrid strong{display:block;margin-top:24px;font-family:Georgia,serif;font-size:21px}.comparisonGrid p{margin:10px 0 0;color:#9f9fa1;font-size:11px;line-height:1.6}
        .chainTrack{display:grid;grid-template-columns:repeat(9,1fr);margin-top:38px;border:1px solid rgba(118,216,255,.15);border-radius:17px;overflow:hidden}.chainTrack div{min-width:0;padding:20px 7px;position:relative;text-align:center;border-right:1px solid rgba(255,255,255,.06);background:rgba(11,17,24,.82)}.chainTrack div:last-child{border-right:0}.chainTrack span,.chainTrack strong{display:block}.chainTrack span{color:#677580;font-size:8px}.chainTrack strong{margin-top:7px;font-size:9px}.chainTrack i{position:absolute;right:-6px;top:50%;z-index:2;color:#f5c86b;font-style:normal}.chainNotes{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-top:15px}.chainNotes article{padding:22px;border:1px solid rgba(245,200,107,.12);border-radius:16px;background:rgba(255,255,255,.02)}.chainNotes span{color:#bd9e58;font-size:8px;font-weight:950;letter-spacing:.12em}.chainNotes strong{display:block;margin-top:9px;font-family:Georgia,serif;font-size:18px;line-height:1.35}
        .academySection{display:grid;grid-template-columns:.8fr 1.2fr;gap:58px;align-items:center;border-top:1px solid rgba(245,200,107,.13);border-bottom:1px solid rgba(245,200,107,.13)}.academyVisual{height:520px;position:relative;display:grid;place-items:center}.academySeal{width:255px;height:255px;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:50%;border:2px solid #66e9ae;background:radial-gradient(circle,rgba(102,233,174,.16),rgba(11,24,22,.96));box-shadow:0 0 70px rgba(102,233,174,.18)}.academySeal small{color:#7daf9a;font-weight:950;letter-spacing:.16em}.academySeal strong{font-family:Georgia,serif;font-size:42px;color:#c6ffe2}.academySeal span{margin-top:8px;color:#71dcb3;font-size:8px;font-weight:950;letter-spacing:.14em}.academyOrbit{position:absolute;border:1px solid rgba(102,233,174,.27);border-radius:50%;animation:orbitSpin 23s linear infinite}.academyOrbit.one{width:340px;height:450px}.academyOrbit.two{width:470px;height:280px;transform:rotate(35deg);animation-direction:reverse}.academyOrbit.three{width:510px;height:510px;border-color:rgba(245,200,107,.14);animation-duration:36s}.academyGrid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:24px}.academyGrid a{padding:14px;display:grid;grid-template-columns:50px 1fr 16px;gap:12px;align-items:center;border:1px solid rgba(102,233,174,.14);border-radius:13px;background:rgba(255,255,255,.025);text-decoration:none;transition:.25s}.academyGrid a:hover{transform:translateY(-3px);border-color:#66e9ae}.academyGrid a>span{width:48px;height:48px;display:grid;place-items:center;border-radius:10px;border:1px solid #66e9ae;color:#8ef0c3;font-size:10px;font-weight:950}.academyGrid strong{font-size:11px}.academyGrid p{margin:5px 0 0;color:#8e9692;font-size:9px;line-height:1.4}.academyGrid b{color:#66e9ae}
        .crossDivision{display:grid;grid-template-columns:.95fr 1.05fr;gap:44px;align-items:center}.crossGrid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.crossGrid a{min-height:280px;padding:25px;display:flex;flex-direction:column;border:1px solid rgba(118,216,255,.15);border-radius:20px;background:linear-gradient(145deg,rgba(24,32,38,.84),rgba(11,15,21,.95));text-decoration:none;transition:.25s}.crossGrid a:hover{transform:translateY(-5px);border-color:#79d9f5}.crossGrid span{width:54px;height:54px;display:grid;place-items:center;border-radius:14px;border:1px solid #79d9f5;color:#8adff6;font-weight:950}.crossGrid strong{display:block;margin-top:22px;font-family:Georgia,serif;font-size:24px}.crossGrid p{color:#9ea3a6;font-size:12px;line-height:1.6}.crossGrid b{margin-top:auto;color:#80dbf4;font-size:10px}
        .closingSection{text-align:center;padding-bottom:82px}.closingGlow{position:absolute;left:50%;top:30px;width:860px;height:360px;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(245,200,107,.14),transparent 68%);filter:blur(22px);pointer-events:none}.closingSection>p{max-width:880px;margin-inline:auto}.finalRule{display:block;margin-top:30px;color:#ffe39a;font-family:Georgia,serif;font-size:21px}
        footer{min-height:82px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-top:1px solid rgba(245,200,107,.13);color:#74716a;font-size:10px;font-weight:800;letter-spacing:.08em}
        @keyframes drift{to{transform:translate3d(65px,-35px,0) scale(1.08)}}@keyframes packet{from{left:0}to{left:100%}}@keyframes breathe{to{transform:scale(1.08);opacity:.8}}@keyframes orbitSpin{to{transform:translate(-50%,-50%) rotate(360deg)}}
        @media(max-width:1180px){.hero{grid-template-columns:1fr;min-height:auto}.heroMonument{height:570px}.divisionLayout{grid-template-columns:1fr}.divisionRail{display:grid;grid-template-columns:1fr 1fr}.divisionDetail{grid-template-columns:270px 1fr}.instrumentGrid{grid-template-columns:repeat(3,1fr)}.comparisonGrid{grid-template-columns:repeat(2,1fr)}.chainTrack{grid-template-columns:repeat(3,1fr)}.academySection,.crossDivision{grid-template-columns:1fr}.academyVisual{height:440px}}
        @media(max-width:760px){.shell{width:min(100% - 22px,1480px)}.institutionBar{padding:14px 0;align-items:flex-start}.identity strong{font-size:13px}.identity small{font-size:8px}nav{display:none}.hero{padding:64px 0}.hero h1{font-size:48px}.heroLead{font-size:15px}.heroMonument{height:440px;transform:scale(.78);margin:-40px 0}.definitionBand{grid-template-columns:1fr}.divisionRail{grid-template-columns:1fr}.divisionDetail{min-height:auto;padding:24px;grid-template-columns:1fr}.detailSeal{height:300px}.contentsPanel ul{grid-template-columns:1fr}.instrumentSection .sectionHeading{grid-template-columns:1fr}.instrumentGrid{grid-template-columns:1fr}.comparisonGrid{grid-template-columns:1fr}.chainTrack{grid-template-columns:1fr 1fr}.chainNotes{grid-template-columns:1fr}.academyGrid{grid-template-columns:1fr}.crossGrid{grid-template-columns:1fr}.crossDivision h2,.closingSection h2,.sectionHeading h2,.academyCopy h2{font-size:40px}.heroActions .button{width:100%}.monumentMetrics{grid-template-columns:1fr}.monumentMetrics article:nth-child(n+2){display:none}footer{flex-direction:column;justify-content:center;text-align:center}}
        @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}
      `}</style>
    </main>
  );
}
