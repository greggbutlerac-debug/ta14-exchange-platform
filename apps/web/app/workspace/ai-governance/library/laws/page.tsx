"use client";

import Link from "next/link";

const jurisdictions = [
  {
    title: "European Union",
    subtitle: "EU AI Act",
    description:
      "Explore risk classifications, prohibited practices, provider and deployer duties, transparency requirements, governance obligations, conformity pathways, and evidence expectations.",
    href: "/workspace/ai-governance/eu-ai-act",
    action: "Open EU AI Act",
    status: "Available",
  },
  {
    title: "United States",
    subtitle: "Federal and state governance",
    description:
      "Track executive, agency, sector, procurement, civil-rights, consumer-protection, and state-level AI governance sources without collapsing them into one national rule.",
    href: "/workspace/ai-governance/library/laws/united-states",
    action: "Explore United States",
    status: "Module planned",
  },
  {
    title: "Canada",
    subtitle: "Federal and provincial governance",
    description:
      "Review Canadian legislation, policy instruments, privacy obligations, automated-decision requirements, and evolving AI accountability structures.",
    href: "/workspace/ai-governance/library/laws/canada",
    action: "Explore Canada",
    status: "Module planned",
  },
  {
    title: "United Kingdom",
    subtitle: "Principles-led regulatory approach",
    description:
      "Examine regulator-led AI governance, sector obligations, safety expectations, assurance activity, and the relationship between guidance and enforceable duties.",
    href: "/workspace/ai-governance/library/laws/united-kingdom",
    action: "Explore United Kingdom",
    status: "Module planned",
  },
  {
    title: "Other Jurisdictions",
    subtitle: "Global legal map",
    description:
      "Navigate country and regional AI laws while preserving jurisdiction, effective date, legal force, regulated role, sector, and version boundaries.",
    href: "/workspace/ai-governance/library/laws/global",
    action: "Open global map",
    status: "Module planned",
  },
];

const legalQuestions = [
  "What jurisdiction governs the activity?",
  "What role does the organization occupy?",
  "What AI system or use is regulated?",
  "What duties are binding, conditional, or prohibited?",
  "What evidence demonstrates support for each duty?",
  "What remains unresolved or requires legal review?",
];

export default function LawsAndRegulationsPage() {
  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="orb orbOne" />
      <div className="orb orbTwo" />

      <header className="topbar shell">
        <Link href="/workspace/ai-governance/library" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>Laws &amp; Regulations</strong>
            <small>AI Governance Library</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace/ai-governance/library">Library</Link>
          <Link href="/workspace">Playground</Link>
          <Link href="/workspace/governed-records">Records</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div>
          <p className="eyebrow">LAWS &amp; REGULATIONS</p>
          <h1>Know what is binding before claiming what is compliant.</h1>
          <p className="lead">
            Explore AI governance laws by jurisdiction, regulated role, system
            type, risk condition, sector, effective date, and legal force. Each
            module should preserve the official source, version, applicability
            boundary, evidence expectations, unresolved questions, and review
            history.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="#jurisdictions">
              Explore jurisdictions
              <span>→</span>
            </Link>
            <Link
              className="secondaryButton"
              href="/workspace/ai-governance/library/applicability"
            >
              Find what applies
            </Link>
          </div>
        </div>

        <div className="legalVisual" aria-hidden="true">
          <div className="ring ringOne" />
          <div className="ring ringTwo" />
          <div className="legalCore">
            <strong>LAW</strong>
            <small>Source authority</small>
          </div>
        </div>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">LEGAL-FORCE BOUNDARY</p>
          <h2>Not every governance source carries the same authority.</h2>
        </div>
        <p>
          The library keeps enacted law, regulation, official guidance,
          regulator interpretation, policy, standard, framework, and internal
          control separate. A useful mapping never converts a voluntary source
          into a legal obligation or treats a summary as the official text.
        </p>
      </section>

      <section className="jurisdictions shell" id="jurisdictions">
        <div className="sectionIntro">
          <p className="eyebrow">JURISDICTION MODULES</p>
          <h2>Enter through the authority that governs the route.</h2>
          <p>
            Each jurisdiction module should show who is regulated, what is
            regulated, when duties apply, how obligations change by role, and
            what evidence supports a bounded determination.
          </p>
        </div>

        <div className="jurisdictionGrid">
          {jurisdictions.map((item, index) => (
            <article key={item.title}>
              <div className="cardTop">
                <span className="number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="status">{item.status}</span>
              </div>
              <p className="subtitle">{item.subtitle}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.status === "Available" ? (
                <Link href={item.href}>
                  {item.action}
                  <span>→</span>
                </Link>
              ) : (
                <button
                  type="button"
                  className="plannedButton"
                  disabled
                  aria-disabled="true"
                  title="This jurisdiction module is currently under development."
                >
                  Coming Soon
                  <span>→</span>
                </button>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="questions shell">
        <div className="questionCopy">
          <p className="eyebrow">APPLICABILITY QUESTIONS</p>
          <h2>Legal review begins with the right questions.</h2>
          <p>
            A jurisdiction name alone is not enough. Applicability depends on
            the actor, system, activity, geography, sector, timing, and legal
            condition attached to the route.
          </p>
        </div>

        <div className="questionList">
          {legalQuestions.map((question, index) => (
            <div key={question}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{question}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="method shell">
        <div>
          <p className="eyebrow">TA-14 LEGAL IMPLEMENTATION METHOD</p>
          <h2>From official text to a governed execution route.</h2>
        </div>

        <div className="methodGrid">
          {[
            ["01", "Source", "Preserve the official instrument, issuing body, version, language, publication date, and effective date."],
            ["02", "Applicability", "Determine jurisdiction, regulated role, system scope, exclusions, thresholds, and unresolved conditions."],
            ["03", "Requirement", "Separate each obligation, prohibition, exception, timing condition, and required actor."],
            ["04", "Evidence", "Identify what records, authority, continuity, controls, and outcomes would support the requirement."],
            ["05", "Route", "Compile the requirement into TA-14 bindings, commitments, execution boundaries, and decisions."],
            ["06", "Verification", "Preserve the result so another reviewer can inspect, challenge, replay, or correct it."],
          ].map(([number, title, description]) => (
            <article key={title}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">FIRST REGULATION MODULE</p>
          <h2>Open the EU AI Act governance workspace.</h2>
          <p>
            Review requirements, map relevant TA-14 governance layers, preserve
            supporting evidence, and keep unsupported compliance claims from
            becoming execution permission.
          </p>
        </div>
        <Link className="primaryButton" href="/workspace/ai-governance/eu-ai-act">
          EU AI Act Requirements
          <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/ai-governance/library">
          Return to Governance Library
        </Link>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(html) { scroll-behavior: smooth; background: #040914; }
        :global(body) {
          margin: 0;
          background:
            radial-gradient(circle at 12% 8%, rgba(66, 207, 190, 0.13), transparent 28%),
            radial-gradient(circle at 88% 22%, rgba(56, 104, 180, 0.13), transparent 26%),
            linear-gradient(180deg, #040914 0%, #07101f 50%, #050914 100%);
          color: #f7fbff;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        main { min-height: 100vh; position: relative; overflow: hidden; isolation: isolate; }
        .shell { width: min(1260px, calc(100% - 36px)); margin-inline: auto; position: relative; z-index: 2; }
        .stars { position: fixed; inset: -12%; pointer-events: none; z-index: -4; opacity: 0.34; }
        .starsOne { background-image: radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.4px); background-size: 92px 92px; animation: starDrift 34s linear infinite; }
        .starsTwo { background-image: radial-gradient(circle, rgba(99,225,209,.62) 0 1px, transparent 1.4px); background-size: 156px 156px; background-position: 39px 58px; animation: starDrift 48s linear infinite reverse; }
        .orb { position: fixed; width: 470px; height: 470px; border-radius: 999px; filter: blur(120px); opacity: 0.12; z-index: -3; animation: orbMove 14s ease-in-out infinite alternate; }
        .orbOne { left: -170px; top: -180px; background: #56dec9; }
        .orbTwo { right: -180px; top: 44%; background: #625eff; animation-delay: -6s; }
        .topbar { min-height: 84px; display: flex; align-items: center; justify-content: space-between; gap: 24px; border-bottom: 1px solid rgba(132,154,188,.16); }
        .brand { display: flex; align-items: center; gap: 12px; color: white; text-decoration: none; }
        .brandMark { min-width: 64px; height: 38px; border-radius: 999px; display: grid; place-items: center; color: #03110f; background: linear-gradient(135deg,#57d9c8,#b8fff7); font-size: 13px; font-weight: 900; letter-spacing: .05em; }
        .brand > span:last-child { display: flex; flex-direction: column; }
        .brand small { color: #7e91a6; margin-top: 2px; }
        nav { display: flex; gap: 22px; }
        nav a, footer a { color: #a9b8ca; text-decoration: none; font-size: 14px; }
        .hero { min-height: 610px; display: grid; grid-template-columns: 1.2fr .8fr; gap: 40px; align-items: center; padding: 72px 0; }
        .eyebrow { margin: 0; color: #71dfd0; font-size: 11px; font-weight: 900; letter-spacing: .18em; }
        h1 { max-width: 900px; margin: 18px 0 22px; font-size: clamp(48px,7vw,88px); line-height: .98; letter-spacing: -.06em; }
        .lead { max-width: 790px; margin: 0; color: #9fb0c4; font-size: 18px; line-height: 1.68; }
        .heroActions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
        .primaryButton, .secondaryButton { min-height: 54px; display: inline-flex; align-items: center; justify-content: center; gap: 24px; border-radius: 14px; padding: 0 20px; text-decoration: none; font-weight: 850; }
        .primaryButton { color: #04110f; background: linear-gradient(135deg,#5bd9c9,#b4fff6); box-shadow: 0 14px 38px rgba(70,214,196,.18); }
        .secondaryButton { color: #dce8f4; border: 1px solid rgba(130,162,188,.25); background: rgba(255,255,255,.035); }
        .legalVisual { min-height: 410px; display: grid; place-items: center; position: relative; }
        .legalCore { width: 190px; height: 190px; border-radius: 999px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid rgba(226,181,91,.55); background: radial-gradient(circle,rgba(226,181,91,.18),rgba(5,15,25,.94) 64%); box-shadow: 0 0 55px rgba(226,181,91,.2), inset 0 0 34px rgba(84,218,200,.1); }
        .legalCore strong { color: #f0ce87; font-size: 42px; letter-spacing: .04em; }
        .legalCore small { margin-top: 7px; color: #8edbd0; text-transform: uppercase; letter-spacing: .14em; }
        .ring { position: absolute; border-radius: 999px; border: 1px solid rgba(105,221,208,.2); animation: rotate 20s linear infinite; }
        .ringOne { width: 285px; height: 285px; }
        .ringTwo { width: 390px; height: 390px; border-color: rgba(226,181,91,.22); animation-duration: 31s; animation-direction: reverse; }
        .boundary, .questions, .finalCta { border: 1px solid rgba(131,155,189,.16); background: linear-gradient(180deg,rgba(12,21,36,.9),rgba(7,13,24,.94)); border-radius: 26px; box-shadow: 0 22px 70px rgba(0,0,0,.22); }
        .boundary { padding: 42px; display: grid; grid-template-columns: .9fr 1.1fr; gap: 36px; align-items: center; }
        .boundary h2, .sectionIntro h2, .questions h2, .method h2, .finalCta h2 { margin: 14px 0 16px; font-size: clamp(32px,5vw,56px); line-height: 1.04; letter-spacing: -.045em; }
        .boundary > p, .sectionIntro > p:not(.eyebrow), .questionCopy > p:not(.eyebrow), .finalCta p:not(.eyebrow) { color: #9fafc2; line-height: 1.68; }
        .boundary > p, .sectionIntro > p:not(.eyebrow), .questionCopy > p:not(.eyebrow) { margin: 0; }
        .jurisdictions, .method { padding: 90px 0; }
        .sectionIntro { max-width: 820px; margin-bottom: 34px; }
        .jurisdictionGrid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 18px; }
        .jurisdictionGrid article { min-height: 330px; display: flex; flex-direction: column; padding: 30px; border-radius: 22px; border: 1px solid rgba(130,154,188,.17); background: linear-gradient(180deg,rgba(13,22,38,.86),rgba(7,13,24,.94)); transition: transform 220ms ease,border-color 220ms ease; }
        .jurisdictionGrid article:hover { transform: translateY(-5px); border-color: rgba(95,221,205,.46); }
        .cardTop { display: flex; justify-content: space-between; gap: 16px; align-items: center; }
        .number { color: #61dccb; font-size: 12px; font-weight: 900; letter-spacing: .16em; }
        .plannedButton {
        display:inline-flex;
        align-items:center;
        gap:.45rem;
        padding:.8rem 1rem;
        border-radius:999px;
        border:1px solid rgba(255,255,255,.14);
        background:rgba(255,255,255,.05);
        color:rgba(255,255,255,.65);
        cursor:not-allowed;
      }

      .status { padding: 6px 9px; border-radius: 999px; border: 1px solid rgba(113,224,210,.16); color: #9fcfc8; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .1em; }
        .subtitle { margin: 24px 0 0; color: #e1bd75 !important; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: .13em; }
        .jurisdictionGrid h3 { margin: 10px 0 12px; font-size: 30px; letter-spacing: -.03em; }
        .jurisdictionGrid article > p:not(.subtitle) { color: #9eafc2; line-height: 1.65; }
        .jurisdictionGrid a { margin-top: auto; display: inline-flex; gap: 20px; color: #7de5d7; text-decoration: none; font-weight: 850; }
        .questions { padding: 46px; display: grid; grid-template-columns: .9fr 1.1fr; gap: 42px; align-items: start; }
        .questionList { display: grid; gap: 10px; }
        .questionList > div { min-height: 62px; display: flex; align-items: center; gap: 15px; padding: 14px 16px; border-radius: 14px; border: 1px solid rgba(131,155,189,.15); background: rgba(255,255,255,.025); }
        .questionList span { color: #60dac9; font-size: 10px; font-weight: 900; }
        .questionList strong { font-size: 14px; line-height: 1.45; }
        .methodGrid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 18px; margin-top: 34px; }
        .methodGrid article { min-height: 260px; padding: 28px; border-radius: 22px; border: 1px solid rgba(130,154,188,.17); background: radial-gradient(circle at 20% 0%,rgba(83,214,196,.08),transparent 38%),linear-gradient(180deg,rgba(13,22,38,.86),rgba(7,13,24,.94)); }
        .methodGrid span { color: #60dac9; font-size: 11px; font-weight: 900; letter-spacing: .14em; }
        .methodGrid h3 { margin: 18px 0 12px; font-size: 26px; }
        .methodGrid p { color: #9eafc2; line-height: 1.65; }
        .finalCta { margin-top: 20px; padding: 54px 46px; display: flex; justify-content: space-between; align-items: center; gap: 30px; }
        .finalCta > div { max-width: 780px; }
        .finalCta h2 { font-size: clamp(36px,5vw,58px); }
        footer { min-height: 120px; display: flex; align-items: center; justify-content: space-between; gap: 24px; color: #74869a; font-size: 12px; }
        @keyframes starDrift { from { transform: translate3d(0,0,0); } to { transform: translate3d(90px,140px,0); } }
        @keyframes orbMove { from { transform: translate3d(0,0,0) scale(1); } to { transform: translate3d(55px,35px,0) scale(1.1); } }
        @keyframes rotate { to { transform: rotate(360deg); } }
        @media (max-width: 980px) { nav { display: none; } .hero { grid-template-columns: 1fr; } .legalVisual { min-height: 440px; } .boundary, .questions { grid-template-columns: 1fr; } .methodGrid { grid-template-columns: repeat(2,minmax(0,1fr)); } .finalCta { flex-direction: column; align-items: flex-start; } }
        @media (max-width: 680px) { .shell { width: min(100% - 20px,1260px); } .hero { min-height: auto; padding: 58px 0; } .legalVisual { transform: scale(.8); min-height: 350px; } .boundary, .questions, .finalCta { padding: 28px 24px; } .jurisdictionGrid, .methodGrid { grid-template-columns: 1fr; } footer { flex-direction: column; justify-content: center; align-items: flex-start; } }
      `}</style>
    </main>
  );
}
