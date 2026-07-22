"use client";

import Link from "next/link";

const capabilities = [
  {
    title: "Build a Governance Route",
    description:
      "Define identity, delegated authority, evidence, tools, payloads, commitments, execution boundaries, and intended outcomes.",
    href: "/workspace/routes/new",
    action: "Build route",
  },
  {
    title: "Test a Consequential Route",
    description:
      "Run a route through the TA-14 governance chain and identify HOLD, DENY, ESCALATE, or ALLOW conditions.",
    href: "/workspace",
    action: "Open playground",
  },
  {
    title: "Preserve the Record",
    description:
      "Create governed records that preserve what was submitted, reviewed, determined, and executed.",
    href: "/workspace/governed-records",
    action: "Open records",
  },
  {
    title: "Submit for Entity Review",
    description:
      "Bring an AI system, organization, architecture, governance program, or operational route into bounded full-chain review.",
    href: "/workspace/entity-review",
    action: "Open review",
  },
];

const chain = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

export default function AIGovernancePage() {
  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="orb orbOne" />
      <div className="orb orbTwo" />

      <header className="topbar shell">
        <Link href="/" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>AI Governance</strong>
            <small>TA-14 AI Governance Exchange</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace">Workspace</Link>
          <Link href="/foundation">Credentials</Link>
          <Link href="/workspace/governed-records">Records</Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">AI GOVERNANCE WORKSPACE</p>
          <h1>Govern the route before the route governs the outcome.</h1>
          <p className="lead">
            Build, test, correct, preserve, and review consequential AI routes
            without collapsing evidence, authority, commitments, execution, and
            outcomes into one unsupported claim.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="/workspace">
              Open AI Governance Playground
              <span>→</span>
            </Link>
            <Link className="secondaryButton" href="/workspace/routes/new">
              Build a New Route
            </Link>
          </div>
        </div>

        <div className="heroVisual" aria-hidden="true">
          <div className="orbit orbitOne">
            <span />
          </div>
          <div className="orbit orbitTwo">
            <span />
          </div>
          <div className="orbit orbitThree">
            <span />
          </div>
          <div className="core">
            <strong>AI</strong>
            <small>Governed Route</small>
          </div>
        </div>
      </section>

      <section className="principle shell">
        <p className="eyebrow">THE GOVERNING PRINCIPLE</p>
        <h2>No admissible evidence. No admissible execution.</h2>
        <p>
          TA-14 preserves each governance layer separately so records,
          interpretations, determinations, commitments, and execution cannot
          silently corrupt one another.
        </p>

        <div className="chain">
          {chain.map((item, index) => (
            <div className="chainStep" key={item}>
              <span>{item}</span>
              {index < chain.length - 1 && <b>→</b>}
            </div>
          ))}
        </div>
      </section>

      <section className="credentialsEntry shell">
        <div className="credentialsSeal" aria-hidden="true">
          <div className="credentialsOrbit credentialsOrbitOne">
            <span />
          </div>
          <div className="credentialsOrbit credentialsOrbitTwo">
            <span />
          </div>
          <div className="credentialsCore">
            <strong>TA-14</strong>
            <small>Credentials</small>
          </div>
        </div>

        <div className="credentialsCopy">
          <p className="eyebrow">TA-14 CREDENTIALS & PUBLIC RECORD</p>
          <h2>Everything we claim. Everything we can show.</h2>
          <p>
            Inspect the institution, founder and stewardship identity,
            architecture, standards, chronology, claims, non-claims,
            publications, repositories, filings, demonstrations, reference
            implementations, and correction routes behind the TA-14 AI
            Governance Exchange.
          </p>

          <div className="credentialsLinks" aria-label="TA-14 credentials record contents">
            {[
              "Institution",
              "Founder & Stewardship",
              "Architecture",
              "Standards",
              "Claims",
              "Non-Claims",
              "Public Timeline",
              "Books",
              "Articles",
              "GitHub",
              "Zenodo",
              "Patents & Filings",
              "Registry Records",
              "Demonstrations",
              "Reference Implementations",
              "Partner Review Network",
              "Exchange Platform",
              "Environmental Integrity Governance",
              "Atmospheric Integrity Records",
              "EU AI Act Work",
              "Challenges & Corrections",
            ].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="credentialsBoundary">
            <strong>Public evidence is not the same as independent certification.</strong>
            <span>
              The credentials record preserves identity, attribution,
              chronology, architecture, publications, technical artifacts,
              claims, boundaries, disputes, and corrections without converting
              them into regulatory approval, legal priority, or proof that
              every implementation performs as claimed.
            </span>
          </div>

          <div className="credentialsActions">
            <Link className="primaryButton" href="/foundation">
              Open TA-14 Credentials & Public Record
              <span>→</span>
            </Link>
            <Link
              className="secondaryButton"
              href="/workspace/ai-governance/registry"
            >
              Browse the Architectural Registry
            </Link>
          </div>
        </div>
      </section>

      <section className="capabilities shell">
        <div className="sectionIntro">
          <p className="eyebrow">BEGIN HERE</p>
          <h2>Choose what you need to do.</h2>
          <p>
            Each route enters through the same chain, but every task preserves
            its own scope and evidence boundary.
          </p>
        </div>

        <div className="capabilityGrid">
          {capabilities.map((item, index) => (
            <article key={item.title}>
              <span className="number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href={item.href}>
                {item.action}
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="euSection shell">
        <div>
          <p className="eyebrow">EU AI ACT</p>
          <h2>Review applicable requirements inside the governance workspace.</h2>
          <p>
            Explore EU AI Act requirements, map them to the relevant TA-14
            governance layers, and preserve the evidence used to support each
            declared compliance approach.
          </p>
        </div>

        <Link className="euButton" href="/workspace/ai-governance/eu-ai-act">
          EU AI Act Requirements
          <span>→</span>
        </Link>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>TA-14 does not turn a governance claim into a certification.</h2>
        </div>
        <p>
          The platform creates attributable records, exposes missing evidence,
          preserves unresolved conditions, and supports bounded review. It does
          not certify that an AI system, organization, architecture, or route is
          legally compliant merely because it has been submitted.
        </p>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">AI GOVERNANCE PLAYGROUND</p>
          <h2>Bring the route. Test the chain.</h2>
          <p>
            Start with a consequential AI route and see exactly where evidence,
            authority, continuity, or commitments are insufficient.
          </p>
        </div>

        <Link className="primaryButton" href="/workspace">
          Enter the Playground
          <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/">Return to the Exchange homepage</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #040914;
        }

        :global(body) {
          margin: 0;
          background:
            radial-gradient(circle at 12% 8%, rgba(66, 207, 190, 0.13), transparent 28%),
            radial-gradient(circle at 88% 22%, rgba(56, 104, 180, 0.13), transparent 26%),
            linear-gradient(180deg, #040914 0%, #07101f 50%, #050914 100%);
          color: #f7fbff;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .shell {
          width: min(1260px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .stars {
          position: fixed;
          inset: -12%;
          pointer-events: none;
          z-index: -4;
          opacity: 0.34;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.4px);
          background-size: 92px 92px;
          animation: starDrift 34s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(99,225,209,.62) 0 1px, transparent 1.4px);
          background-size: 156px 156px;
          background-position: 39px 58px;
          animation: starDrift 48s linear infinite reverse;
        }

        .orb {
          position: fixed;
          width: 470px;
          height: 470px;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.12;
          z-index: -3;
          animation: orbMove 14s ease-in-out infinite alternate;
        }

        .orbOne {
          left: -170px;
          top: -180px;
          background: #56dec9;
        }

        .orbTwo {
          right: -180px;
          top: 44%;
          background: #625eff;
          animation-delay: -6s;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(132, 154, 188, 0.16);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 64px;
          height: 38px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #03110f;
          background: linear-gradient(135deg, #57d9c8, #b8fff7);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          color: #7e91a6;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a,
        footer a {
          color: #a9b8ca;
          text-decoration: none;
          font-size: 14px;
        }

        .hero {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 40px;
          align-items: center;
          padding: 76px 0;
        }

        .eyebrow {
          margin: 0;
          color: #71dfd0;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 850px;
          margin: 18px 0 22px;
          font-size: clamp(48px, 7vw, 92px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          max-width: 760px;
          margin: 0;
          color: #9fb0c4;
          font-size: 18px;
          line-height: 1.68;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton,
        .euButton {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          border-radius: 14px;
          padding: 0 20px;
          text-decoration: none;
          font-weight: 850;
        }

        .primaryButton {
          color: #04110f;
          background: linear-gradient(135deg, #5bd9c9, #b4fff6);
          box-shadow: 0 14px 38px rgba(70, 214, 196, 0.18);
        }

        .secondaryButton {
          color: #dce8f4;
          border: 1px solid rgba(130, 162, 188, 0.25);
          background: rgba(255, 255, 255, 0.035);
        }

        .heroVisual {
          min-height: 440px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .core {
          width: 190px;
          height: 190px;
          border-radius: 999px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid rgba(102, 226, 211, 0.62);
          background:
            radial-gradient(circle, rgba(84, 218, 200, 0.18), rgba(5, 15, 25, 0.93) 62%);
          box-shadow:
            0 0 50px rgba(84, 218, 200, 0.22),
            inset 0 0 34px rgba(84, 218, 200, 0.12);
        }

        .core strong {
          font-size: 52px;
          letter-spacing: -0.04em;
        }

        .core small {
          margin-top: 6px;
          color: #84dacc;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .orbit {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(105, 221, 208, 0.2);
          animation: rotate 18s linear infinite;
        }

        .orbit span {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #72e3d4;
          box-shadow: 0 0 14px #72e3d4;
          top: 50%;
          right: -5px;
        }

        .orbitOne {
          width: 260px;
          height: 260px;
        }

        .orbitTwo {
          width: 340px;
          height: 340px;
          animation-duration: 26s;
          animation-direction: reverse;
        }

        .orbitTwo span {
          background: #78aaff;
          box-shadow: 0 0 14px #78aaff;
        }

        .orbitThree {
          width: 420px;
          height: 420px;
          animation-duration: 34s;
        }

        .orbitThree span {
          background: #c178ff;
          box-shadow: 0 0 14px #c178ff;
        }

        .principle,
        .credentialsEntry,
        .euSection,
        .boundary,
        .finalCta {
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(12, 21, 36, 0.9), rgba(7, 13, 24, 0.94));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .principle {
          padding: 52px;
          text-align: center;
        }

        .credentialsEntry {
          margin-top: 28px;
          padding: 54px;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 54px;
          align-items: center;
          border-color: rgba(203, 160, 81, 0.26);
          background:
            radial-gradient(circle at 12% 20%, rgba(64, 171, 204, 0.2), transparent 34%),
            radial-gradient(circle at 88% 18%, rgba(203, 144, 62, 0.12), transparent 28%),
            linear-gradient(145deg, rgba(14, 29, 47, 0.94), rgba(7, 13, 24, 0.97));
        }

        .credentialsSeal {
          min-height: 300px;
          position: relative;
          display: grid;
          place-items: center;
        }

        .credentialsCore {
          width: 152px;
          height: 152px;
          border-radius: 999px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(237, 194, 109, 0.52);
          background:
            radial-gradient(circle at 36% 28%, rgba(85, 184, 214, 0.32), rgba(7, 20, 33, 0.97) 68%);
          box-shadow:
            0 0 54px rgba(80, 188, 217, 0.18),
            inset 0 0 36px rgba(225, 169, 81, 0.1);
          z-index: 2;
        }

        .credentialsCore strong {
          color: #f2cf89;
          font-size: 26px;
          letter-spacing: 0.05em;
        }

        .credentialsCore small {
          margin-top: 7px;
          color: #91c9d2;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          font-size: 10px;
        }

        .credentialsOrbit {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(104, 214, 207, 0.22);
          animation: rotate 22s linear infinite;
        }

        .credentialsOrbit span {
          position: absolute;
          top: 50%;
          right: -5px;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #6fe1d3;
          box-shadow: 0 0 16px #6fe1d3;
        }

        .credentialsOrbitOne {
          width: 220px;
          height: 220px;
        }

        .credentialsOrbitTwo {
          width: 286px;
          height: 286px;
          border-color: rgba(230, 177, 91, 0.22);
          animation-duration: 31s;
          animation-direction: reverse;
        }

        .credentialsOrbitTwo span {
          background: #e2a854;
          box-shadow: 0 0 16px #e2a854;
        }

        .credentialsCopy h2 {
          margin: 14px 0 16px;
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .credentialsCopy > p:not(.eyebrow) {
          margin: 0;
          max-width: 840px;
          color: #a6b7c9;
          font-size: 16px;
          line-height: 1.72;
        }

        .credentialsLinks {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 26px;
        }

        .credentialsLinks span {
          padding: 8px 11px;
          border-radius: 999px;
          border: 1px solid rgba(113, 224, 210, 0.18);
          background: rgba(73, 189, 176, 0.07);
          color: #c9f4ee;
          font-size: 10px;
          font-weight: 800;
        }

        .credentialsBoundary {
          display: grid;
          gap: 6px;
          margin-top: 24px;
          padding: 18px 20px;
          border-radius: 16px;
          border: 1px solid rgba(224, 173, 91, 0.22);
          background: rgba(95, 58, 20, 0.15);
        }

        .credentialsBoundary strong {
          color: #efd099;
          font-size: 15px;
        }

        .credentialsBoundary span {
          color: #aab9c7;
          font-size: 13px;
          line-height: 1.62;
        }

        .credentialsActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .principle h2,
        .sectionIntro h2,
        .euSection h2,
        .boundary h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .principle > p:not(.eyebrow),
        .sectionIntro > p:not(.eyebrow),
        .euSection p:not(.eyebrow),
        .boundary > p,
        .finalCta p:not(.eyebrow) {
          color: #9fafc2;
          line-height: 1.68;
        }

        .principle > p:not(.eyebrow) {
          max-width: 780px;
          margin: 0 auto;
        }

        .chain {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .chainStep {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chainStep span {
          padding: 10px 15px;
          border-radius: 999px;
          border: 1px solid rgba(105, 224, 208, 0.2);
          background: rgba(72, 195, 179, 0.07);
          color: #ddfff9;
          font-size: 13px;
          font-weight: 800;
        }

        .chainStep b {
          color: #5bd9c8;
        }

        .capabilities {
          padding: 90px 0;
        }

        .sectionIntro {
          max-width: 720px;
          margin-bottom: 34px;
        }

        .sectionIntro > p:not(.eyebrow) {
          margin: 0;
        }

        .capabilityGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .capabilityGrid article {
          min-height: 290px;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(130, 154, 188, 0.17);
          background:
            linear-gradient(180deg, rgba(13, 22, 38, 0.86), rgba(7, 13, 24, 0.94));
          transition:
            transform 220ms ease,
            border-color 220ms ease;
        }

        .capabilityGrid article:hover {
          transform: translateY(-5px);
          border-color: rgba(95, 221, 205, 0.46);
        }

        .number {
          color: #61dccb;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .capabilityGrid h3 {
          margin: 18px 0 12px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .capabilityGrid p {
          color: #9eafc2;
          line-height: 1.65;
          min-height: 82px;
        }

        .capabilityGrid a {
          display: inline-flex;
          gap: 20px;
          color: #7de5d7;
          text-decoration: none;
          font-weight: 850;
        }

        .euSection {
          padding: 38px 42px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
        }

        .euSection > div {
          max-width: 820px;
        }

        .euSection h2 {
          font-size: clamp(28px, 4vw, 42px);
        }

        .euButton {
          flex: 0 0 auto;
          color: #f5fbff;
          border: 1px solid rgba(119, 164, 255, 0.34);
          background: rgba(75, 107, 171, 0.12);
        }

        .boundary {
          margin-top: 22px;
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .boundary h2 {
          font-size: clamp(28px, 4vw, 44px);
        }

        .boundary > p {
          margin: 0;
        }

        .finalCta {
          margin-top: 74px;
          padding: 54px 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .finalCta > div {
          max-width: 760px;
        }

        .finalCta h2 {
          font-size: clamp(36px, 5vw, 58px);
        }

        footer {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #74869a;
          font-size: 12px;
        }

        @keyframes starDrift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(90px, 140px, 0);
          }
        }

        @keyframes orbMove {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(55px, 35px, 0) scale(1.1);
          }
        }

        @keyframes rotate {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 900px) {
          nav {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .heroVisual {
            min-height: 460px;
          }

          .credentialsEntry,
          .euSection,
          .boundary,
          .finalCta {
            grid-template-columns: 1fr;
            flex-direction: column;
            align-items: flex-start;
          }

          .credentialsSeal {
            width: 100%;
            min-height: 280px;
          }
        }

        @media (max-width: 680px) {
          .shell {
            width: min(100% - 20px, 1260px);
          }

          .hero {
            min-height: auto;
            padding: 58px 0;
          }

          .heroVisual {
            transform: scale(0.78);
            min-height: 380px;
          }

          .principle,
          .credentialsEntry,
          .euSection,
          .boundary,
          .finalCta {
            padding: 28px 24px;
          }

          .credentialsEntry {
            gap: 18px;
          }

          .credentialsSeal {
            transform: scale(0.84);
            min-height: 240px;
          }

          .capabilityGrid {
            grid-template-columns: 1fr;
          }

          .chain {
            justify-content: flex-start;
          }

          .chainStep b {
            display: none;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
