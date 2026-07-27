"use client";

import Link from "next/link";

const categories = [
  {
    title: "Laws & Regulations",
    description:
      "Explore binding legal instruments, enacted duties, prohibited uses, enforcement structures, and jurisdiction-specific AI obligations.",
    examples: ["EU AI Act", "United States", "Canada", "United Kingdom"],
    href: "/workspace/ai-governance/library/laws",
    action: "Explore laws",
  },
  {
    title: "Standards",
    description:
      "Understand management-system, technical, risk, governance, and assurance standards for organizations developing, providing, or using AI.",
    examples: ["ISO/IEC 42001", "ISO/IEC 23894", "ISO/IEC 38507", "IEEE"],
    href: "/workspace/ai-governance/library/standards",
    action: "Explore standards",
  },
  {
    title: "Frameworks",
    description:
      "Review structured systems for managing AI risk, trustworthiness, accountability, transparency, and organizational governance.",
    examples: ["NIST AI RMF", "AI Verify", "Responsible AI", "Risk Frameworks"],
    href: "/workspace/ai-governance/library/frameworks",
    action: "Explore frameworks",
  },
  {
    title: "Principles & Recommendations",
    description:
      "Examine ethical, rights-based, policy, and public-interest principles that influence AI governance worldwide.",
    examples: ["OECD", "UNESCO", "Human Rights", "Public Policy"],
    href: "/workspace/ai-governance/library/principles",
    action: "Explore principles",
  },
  {
    title: "Testing & Assurance",
    description:
      "Connect impact assessments, red teaming, technical evaluation, assurance cases, conformity review, and independent testing to governed evidence.",
    examples: ["Impact Assessments", "Red Teaming", "Conformity Review", "Assurance Cases"],
    href: "/workspace/ai-governance/library/assurance",
    action: "Explore assurance",
  },
  {
    title: "Governance Disciplines",
    description:
      "Explore operational control areas that remain active across design, deployment, runtime execution, change, incident, and outcome.",
    examples: ["Runtime Governance", "Agent Governance", "Evidence Governance", "Human Oversight"],
    href: "/workspace/ai-governance/library/disciplines",
    action: "Explore disciplines",
  },
  {
    title: "Sector Overlays",
    description:
      "Understand how healthcare, finance, buildings, public services, insurance, critical infrastructure, and other sectors modify governance expectations.",
    examples: ["Healthcare", "Finance", "Buildings", "Public Sector"],
    href: "/workspace/ai-governance/library/sectors",
    action: "Explore sectors",
  },
  {
    title: "Organization Policies",
    description:
      "Translate external obligations and internal governance choices into attributable policies, operating boundaries, controls, and reviewable records.",
    examples: ["Acceptable Use", "Procurement", "Model Change", "Incident Response"],
    href: "/workspace/ai-governance/library/policies",
    action: "Explore policies",
  },
];

const tools = [
  {
    title: "Decode an Acronym",
    description:
      "Translate governance acronyms into plain English and see the issuing body, legal force, purpose, and related instruments.",
    href: "/workspace/ai-governance/library/acronyms",
    action: "Open decoder",
  },
  {
    title: "Find What Applies",
    description:
      "Describe the organization, jurisdiction, role, AI system, sector, and use case to identify potentially applicable governance sources.",
    href: "/workspace/ai-governance/library/applicability",
    action: "Start applicability review",
  },
  {
    title: "Compare Frameworks",
    description:
      "Compare requirements, legal force, evidence expectations, lifecycle coverage, and governance boundaries side by side.",
    href: "/workspace/ai-governance/library/compare",
    action: "Compare frameworks",
  },
  {
    title: "Governance Relationship Map",
    description:
      "See how laws, standards, frameworks, principles, controls, evidence, governed records, and TA-14 routes connect.",
    href: "/workspace/ai-governance/library/map",
    action: "Open relationship map",
  },
  {
    title: "Crosswalk Requirements",
    description:
      "Map equivalent, partial, related, conflicting, unmapped, and unreviewed requirements without pretending they are identical.",
    href: "/workspace/ai-governance/library/crosswalks",
    action: "Open crosswalks",
  },
  {
    title: "Build From a Framework",
    description:
      "Select a framework or requirement set and begin compiling it into an evidence-bound TA-14 governance route.",
    href: "/workspace/routes/new",
    action: "Build governance route",
  },
];

const chain = ["Learn", "Determine", "Map", "Build", "Test", "Preserve", "Review", "Verify"];

export default function GovernanceLibraryPage() {
  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="orb orbOne" />
      <div className="orb orbTwo" />

      <header className="topbar shell">
        <Link href="/workspace/ai-governance" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>Governance Library</strong>
            <small>TA-14 AI Governance Exchange</small>
          </span>
        </Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace">Playground</Link>
          <Link href="/workspace/governed-records">Records</Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">AI GOVERNANCE LIBRARY</p>
          <h1>Learn the landscape before governing within it.</h1>
          <p className="lead">
            Explore laws, regulations, standards, frameworks, principles,
            assurance systems, governance disciplines, and sector overlays.
            Understand what each source is, who issued it, when it applies, how
            it relates to other sources, and how it can be transformed into an
            evidence-bound TA-14 execution route.
          </p>
          <div className="heroActions">
            <Link className="primaryButton" href="#categories">
              Explore the Library <span>→</span>
            </Link>
            <Link className="secondaryButton" href="/workspace/ai-governance/library/applicability">
              Find What Applies
            </Link>
          </div>
        </div>
        <div className="heroVisual" aria-hidden="true">
          <div className="orbit orbitOne"><span /></div>
          <div className="orbit orbitTwo"><span /></div>
          <div className="orbit orbitThree"><span /></div>
          <div className="core"><strong>GOV</strong><small>Knowledge Engine</small></div>
        </div>
      </section>

      <section className="journey shell">
        <div>
          <p className="eyebrow">THE GOVERNANCE JOURNEY</p>
          <h2>From understanding to independently verifiable execution.</h2>
        </div>
        <div className="journeyChain">
          {chain.map((item, index) => (
            <div className="journeyStep" key={item}>
              <span>{item}</span>{index < chain.length - 1 && <b>→</b>}
            </div>
          ))}
        </div>
      </section>

      <section className="categories shell" id="categories">
        <div className="sectionIntro">
          <p className="eyebrow">EXPLORE BY GOVERNANCE TYPE</p>
          <h2>Know what kind of authority you are looking at.</h2>
          <p>
            A regulation is not a standard. A standard is not a framework. A
            principle is not a certification. The library keeps each source
            type, authority, version, and boundary visible.
          </p>
        </div>
        <div className="categoryGrid">
          {categories.map((category, index) => (
            <article className="categoryCard" key={category.title}>
              <div className="cardTop">
                <span className="number">{String(index + 1).padStart(2, "0")}</span>
                <span className="status">Library category</span>
              </div>
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <div className="tags" aria-label={`${category.title} examples`}>
                {category.examples.map((example) => <span key={example}>{example}</span>)}
              </div>
              <Link href={category.href}>{category.action}<span>→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="engine shell">
        <div className="sectionIntro">
          <p className="eyebrow">GOVERNANCE FRAMEWORK ENGINE</p>
          <h2>Do more than read a framework.</h2>
          <p>
            Decode terminology, determine applicability, compare instruments,
            map relationships, crosswalk requirements, preserve source
            authority, and compile governance obligations into executable
            TA-14 routes.
          </p>
        </div>
        <div className="toolGrid">
          {tools.map((tool) => (
            <article key={tool.title}>
              <div className="toolIcon" aria-hidden="true"><span /></div>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <Link href={tool.href}>{tool.action}<span>→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="firstModules shell">
        <div className="moduleCopy">
          <p className="eyebrow">INITIAL GOVERNANCE MODULES</p>
          <h2>Begin with the sources organizations encounter most often.</h2>
          <p>
            The first library modules establish a controlled foundation for
            regulations, standards, risk frameworks, public-interest
            principles, testing systems, and runtime governance disciplines.
          </p>
        </div>
        <div className="moduleList">
          {["EU AI Act", "NIST AI RMF", "ISO/IEC 42001", "ISO/IEC 23894", "ISO/IEC 38507", "OECD AI Principles", "UNESCO Recommendation", "AI Verify", "AI Impact Assessments", "Runtime & Agent Governance"].map((module, index) => (
            <div key={module}><span>{String(index + 1).padStart(2, "0")}</span><strong>{module}</strong></div>
          ))}
        </div>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">SOURCE AND INTERPRETATION BOUNDARY</p>
          <h2>The library explains governance. It does not fabricate authority.</h2>
        </div>
        <p>
          Every entry should preserve the issuing body, official source,
          version, publication date, legal force, interpretation status,
          relationships, unresolved questions, and review history. Summaries,
          mappings, and TA-14 implementation routes do not replace legal advice,
          official text, accreditation, conformity assessment, or independent
          certification.
        </p>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">FROM KNOWLEDGE TO EXECUTION</p>
          <h2>Select the source. Build the route. Preserve the proof.</h2>
          <p>
            Start with a law, standard, framework, principle, assurance method,
            or governance discipline and convert it into explicit requirements,
            evidence expectations, decision conditions, bindings, commitments,
            execution boundaries, and outcome records.
          </p>
        </div>
        <Link className="primaryButton" href="/workspace/routes/new">
          Build a Governance Route <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/ai-governance">Return to AI Governance</Link>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; background: #040914; }
        :global(body) {
          margin: 0;
          background: radial-gradient(circle at 12% 8%, rgba(66,207,190,.13), transparent 28%), radial-gradient(circle at 88% 22%, rgba(56,104,180,.13), transparent 26%), linear-gradient(180deg, #040914 0%, #07101f 50%, #050914 100%);
          color: #f7fbff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        main { min-height: 100vh; position: relative; overflow: hidden; isolation: isolate; }
        .shell { width: min(1260px, calc(100% - 36px)); margin-inline: auto; position: relative; z-index: 2; }
        .stars { position: fixed; inset: -12%; pointer-events: none; z-index: -4; opacity: .34; }
        .starsOne { background-image: radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.4px); background-size: 92px 92px; animation: starDrift 34s linear infinite; }
        .starsTwo { background-image: radial-gradient(circle, rgba(99,225,209,.62) 0 1px, transparent 1.4px); background-size: 156px 156px; background-position: 39px 58px; animation: starDrift 48s linear infinite reverse; }
        .orb { position: fixed; width: 470px; height: 470px; border-radius: 999px; filter: blur(120px); opacity: .12; z-index: -3; animation: orbMove 14s ease-in-out infinite alternate; }
        .orbOne { left: -170px; top: -180px; background: #56dec9; }
        .orbTwo { right: -180px; top: 44%; background: #625eff; animation-delay: -6s; }
        .topbar { min-height: 84px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgba(132,154,188,.16); }
        .brand { display: flex; align-items: center; gap: 12px; color: white; text-decoration: none; }
        .brandMark { min-width: 64px; height: 38px; border-radius: 999px; display: grid; place-items: center; color: #03110f; background: linear-gradient(135deg, #57d9c8, #b8fff7); font-size: 13px; font-weight: 900; letter-spacing: .05em; }
        .brand > span:last-child { display: flex; flex-direction: column; }
        .brand small { color: #7e91a6; margin-top: 2px; }
        nav { display: flex; gap: 22px; }
        nav a, footer a { color: #a9b8ca; text-decoration: none; font-size: 14px; }
        .hero { min-height: 650px; display: grid; grid-template-columns: 1.18fr .82fr; gap: 40px; align-items: center; padding: 76px 0; }
        .eyebrow { margin: 0; color: #71dfd0; font-size: 11px; font-weight: 900; letter-spacing: .18em; }
        h1 { max-width: 900px; margin: 18px 0 22px; font-size: clamp(48px, 7vw, 90px); line-height: .98; letter-spacing: -.06em; }
        .lead { max-width: 790px; margin: 0; color: #9fb0c4; font-size: 18px; line-height: 1.68; }
        .heroActions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .primaryButton, .secondaryButton { min-height: 54px; display: inline-flex; align-items: center; justify-content: center; gap: 24px; border-radius: 14px; padding: 0 20px; text-decoration: none; font-weight: 850; }
        .primaryButton { color: #04110f; background: linear-gradient(135deg, #5bd9c9, #b4fff6); box-shadow: 0 14px 38px rgba(70,214,196,.18); }
        .secondaryButton { color: #dce8f4; border: 1px solid rgba(130,162,188,.25); background: rgba(255,255,255,.035); }
        .heroVisual { min-height: 440px; position: relative; display: grid; place-items: center; }
        .core { width: 190px; height: 190px; border-radius: 999px; display: flex; flex-direction: column; justify-content: center; align-items: center; border: 1px solid rgba(102,226,211,.62); background: radial-gradient(circle, rgba(84,218,200,.18), rgba(5,15,25,.93) 62%); box-shadow: 0 0 50px rgba(84,218,200,.22), inset 0 0 34px rgba(84,218,200,.12); }
        .core strong { font-size: 42px; letter-spacing: -.04em; }
        .core small { margin-top: 6px; color: #84dacc; text-transform: uppercase; letter-spacing: .14em; }
        .orbit { position: absolute; border-radius: 999px; border: 1px solid rgba(105,221,208,.2); animation: rotate 18s linear infinite; }
        .orbit span { position: absolute; width: 10px; height: 10px; border-radius: 999px; background: #72e3d4; box-shadow: 0 0 14px #72e3d4; top: 50%; right: -5px; }
        .orbitOne { width: 260px; height: 260px; }
        .orbitTwo { width: 340px; height: 340px; animation-duration: 26s; animation-direction: reverse; }
        .orbitTwo span { background: #78aaff; box-shadow: 0 0 14px #78aaff; }
        .orbitThree { width: 420px; height: 420px; animation-duration: 34s; }
        .orbitThree span { background: #c178ff; box-shadow: 0 0 14px #c178ff; }
        .journey, .firstModules, .boundary, .finalCta { border: 1px solid rgba(131,155,189,.16); background: linear-gradient(180deg, rgba(12,21,36,.9), rgba(7,13,24,.94)); border-radius: 26px; box-shadow: 0 22px 70px rgba(0,0,0,.22); }
        .journey { padding: 44px; }
        .journey h2, .sectionIntro h2, .firstModules h2, .boundary h2, .finalCta h2 { margin: 14px 0 16px; font-size: clamp(32px, 5vw, 56px); line-height: 1.04; letter-spacing: -.045em; }
        .journeyChain { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
        .journeyStep { display: flex; align-items: center; gap: 12px; }
        .journeyStep span { padding: 10px 15px; border-radius: 999px; border: 1px solid rgba(105,224,208,.2); background: rgba(72,195,179,.07); color: #ddfff9; font-size: 13px; font-weight: 800; }
        .journeyStep b { color: #5bd9c8; }
        .categories, .engine { padding: 90px 0; }
        .sectionIntro { max-width: 820px; margin-bottom: 34px; }
        .sectionIntro > p:not(.eyebrow), .firstModules p:not(.eyebrow), .boundary > p, .finalCta p:not(.eyebrow) { color: #9fafc2; line-height: 1.68; }
        .sectionIntro > p:not(.eyebrow) { margin: 0; }
        .categoryGrid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 18px; }
        .categoryCard { min-height: 350px; display: flex; flex-direction: column; padding: 30px; border-radius: 22px; border: 1px solid rgba(130,154,188,.17); background: linear-gradient(180deg, rgba(13,22,38,.86), rgba(7,13,24,.94)); transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease; }
        .categoryCard:hover { transform: translateY(-5px); border-color: rgba(95,221,205,.46); box-shadow: 0 18px 50px rgba(0,0,0,.22); }
        .cardTop { display: flex; align-items: center; justify-content: space-between; gap: 18px; }
        .number { color: #61dccb; font-size: 12px; font-weight: 900; letter-spacing: .16em; }
        .status { color: #7f91a5; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .12em; }
        .categoryCard h3, .toolGrid h3 { margin: 20px 0 12px; font-size: 28px; letter-spacing: -.03em; }
        .categoryCard > p, .toolGrid p { color: #9eafc2; line-height: 1.65; }
        .tags { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0 24px; }
        .tags span { padding: 7px 10px; border-radius: 999px; border: 1px solid rgba(113,224,210,.15); background: rgba(73,189,176,.06); color: #c9f4ee; font-size: 10px; font-weight: 800; }
        .categoryCard a, .toolGrid a { margin-top: auto; display: inline-flex; align-items: center; gap: 20px; color: #7de5d7; text-decoration: none; font-weight: 850; }
        .toolGrid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 18px; }
        .toolGrid article { min-height: 315px; display: flex; flex-direction: column; padding: 28px; border-radius: 22px; border: 1px solid rgba(130,154,188,.17); background: radial-gradient(circle at 20% 0%, rgba(83,214,196,.09), transparent 38%), linear-gradient(180deg, rgba(13,22,38,.86), rgba(7,13,24,.94)); }
        .toolIcon { width: 48px; height: 48px; border-radius: 16px; display: grid; place-items: center; border: 1px solid rgba(112,224,210,.24); background: rgba(76,197,182,.08); }
        .toolIcon span { width: 14px; height: 14px; border-radius: 999px; background: #72e3d4; box-shadow: 0 0 16px rgba(114,227,212,.75); }
        .firstModules { padding: 46px; display: grid; grid-template-columns: .9fr 1.1fr; gap: 42px; align-items: start; }
        .firstModules p:not(.eyebrow) { margin: 0; }
        .moduleList { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
        .moduleList > div { min-height: 58px; display: flex; align-items: center; gap: 13px; padding: 12px 14px; border-radius: 14px; border: 1px solid rgba(131,155,189,.15); background: rgba(255,255,255,.025); }
        .moduleList span { color: #60dac9; font-size: 10px; font-weight: 900; }
        .moduleList strong { font-size: 13px; }
        .boundary { margin-top: 24px; padding: 42px; display: grid; grid-template-columns: .9fr 1.1fr; gap: 36px; align-items: center; }
        .boundary h2 { font-size: clamp(28px, 4vw, 44px); }
        .boundary > p { margin: 0; }
        .finalCta { margin-top: 74px; padding: 54px 46px; display: flex; justify-content: space-between; align-items: center; gap: 30px; }
        .finalCta > div { max-width: 790px; }
        .finalCta h2 { font-size: clamp(36px, 5vw, 58px); }
        footer { min-height: 120px; display: flex; align-items: center; justify-content: space-between; gap: 24px; color: #74869a; font-size: 12px; }
        @keyframes starDrift { from { transform: translate3d(0,0,0); } to { transform: translate3d(90px,140px,0); } }
        @keyframes orbMove { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(55px,35px,0) scale(1.1); } }
        @keyframes rotate { to { transform: rotate(360deg); } }
        @media (max-width: 980px) { nav { display: none; } .hero { grid-template-columns: 1fr; } .heroVisual { min-height: 460px; } .toolGrid { grid-template-columns: repeat(2, minmax(0,1fr)); } .firstModules, .boundary { grid-template-columns: 1fr; } .finalCta { flex-direction: column; align-items: flex-start; } }
        @media (max-width: 680px) { .shell { width: min(100% - 20px, 1260px); } .hero { min-height: auto; padding: 58px 0; } .heroVisual { transform: scale(.78); min-height: 380px; } .journey, .firstModules, .boundary, .finalCta { padding: 28px 24px; } .categoryGrid, .toolGrid, .moduleList { grid-template-columns: 1fr; } .journeyStep b { display: none; } footer { flex-direction: column; justify-content: center; align-items: flex-start; } }
      `}</style>
    </main>
  );
}
