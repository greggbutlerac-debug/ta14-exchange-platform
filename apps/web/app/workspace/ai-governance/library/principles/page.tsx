"use client";

import Link from "next/link";

const principles = [
  {
    title: "OECD AI Principles",
    issuer: "Organisation for Economic Co-operation and Development",
    force: "Intergovernmental principles",
    description:
      "High-level principles for trustworthy AI, including inclusive growth, human-centered values, transparency, robustness, safety, accountability, and responsible stewardship.",
    themes: ["Human-centered values", "Transparency", "Robustness", "Accountability"],
    href: "/workspace/ai-governance/library/principles/oecd",
    status: "Foundation module",
  },
  {
    title: "UNESCO Recommendation on the Ethics of Artificial Intelligence",
    issuer: "United Nations Educational, Scientific and Cultural Organization",
    force: "International recommendation",
    description:
      "A rights-based and ethics-focused governance instrument addressing human dignity, fairness, environmental well-being, diversity, oversight, accountability, and public-interest safeguards.",
    themes: ["Human rights", "Ethics", "Environmental well-being", "Public interest"],
    href: "/workspace/ai-governance/library/principles/unesco",
    status: "Foundation module",
  },
  {
    title: "Human Rights Principles",
    issuer: "International, regional, and domestic authorities",
    force: "Rights-based governance source",
    description:
      "A cross-cutting source category connecting AI systems to dignity, privacy, equality, due process, freedom of expression, non-discrimination, remedy, and procedural fairness.",
    themes: ["Dignity", "Privacy", "Equality", "Remedy"],
    href: "/workspace/ai-governance/library/principles/human-rights",
    status: "Catalog module",
  },
  {
    title: "Public-Interest AI Principles",
    issuer: "Governments, institutions, civil society, and sector bodies",
    force: "Policy and advisory principles",
    description:
      "Principles intended to protect public welfare, institutional legitimacy, democratic accountability, accessibility, safety, and responsible deployment.",
    themes: ["Public welfare", "Legitimacy", "Accessibility", "Democratic accountability"],
    href: "/workspace/ai-governance/library/principles/public-interest",
    status: "Catalog module",
  },
];

const boundaries = [
  "A principle may influence law without itself being binding law.",
  "A recommendation may guide institutions without proving implementation.",
  "Ethical language does not automatically establish operational controls.",
  "Alignment claims require evidence, ownership, and preserved review.",
  "Conflicts between principles must remain visible and unresolved when necessary.",
  "TA-14 routes preserve how a principle became a bounded execution condition.",
];

export default function PrinciplesLibraryPage() {
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
            <strong>Principles & Recommendations</strong>
            <small>AI Governance Library</small>
          </span>
        </Link>

        <nav>
          <Link href="/workspace/ai-governance/library">Library</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace">Playground</Link>
          <Link href="/workspace/routes/new">Build Route</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">PRINCIPLES & RECOMMENDATIONS</p>
          <h1>Preserve the difference between values, guidance, and authority.</h1>
          <p className="lead">
            AI governance principles shape laws, standards, organizational
            policies, assurance systems, and public expectations. The library
            explains what each source says, who issued it, what force it carries,
            and how its expectations can be translated into evidence-bound
            TA-14 governance conditions.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="#principles">
              Explore Principles
              <span>→</span>
            </Link>
            <Link
              className="secondaryButton"
              href="/workspace/ai-governance/library/compare"
            >
              Compare Governance Sources
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
            <strong>PR</strong>
            <small>Values to Evidence</small>
          </div>
        </div>
      </section>

      <section className="definition shell">
        <div>
          <p className="eyebrow">WHAT THIS CATEGORY CONTAINS</p>
          <h2>Normative direction without invented legal force.</h2>
        </div>
        <p>
          Principles and recommendations can define values, objectives,
          safeguards, expected conduct, or public-interest boundaries. They may
          influence legislation, standards, contracts, procurement, internal
          policy, or assurance. The library does not mislabel them as binding
          law, certification, or proof of implementation.
        </p>
      </section>

      <section className="principleSection shell" id="principles">
        <div className="sectionIntro">
          <p className="eyebrow">SOURCE CATALOG</p>
          <h2>Begin with globally influential governance principles.</h2>
          <p>
            Each module preserves the source authority, publication history,
            intended audience, normative force, themes, relationships,
            implementation questions, evidence expectations, and TA-14 route
            pathways.
          </p>
        </div>

        <div className="principleGrid">
          {principles.map((principle, index) => (
            <article key={principle.title}>
              <div className="cardTop">
                <span className="number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="status">{principle.status}</span>
              </div>

              <h3>{principle.title}</h3>
              <p className="issuer">{principle.issuer}</p>
              <p className="force">{principle.force}</p>
              <p className="description">{principle.description}</p>

              <div className="tags">
                {principle.themes.map((theme) => (
                  <span key={theme}>{theme}</span>
                ))}
              </div>

              <Link href={principle.href}>
                Open source module
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="translation shell">
        <div className="translationCopy">
          <p className="eyebrow">FROM PRINCIPLE TO GOVERNED CONDITION</p>
          <h2>Values become operational only when their meaning is bounded.</h2>
          <p>
            A principle such as accountability, fairness, transparency, or
            human oversight cannot govern execution until its scope, owner,
            evidence, threshold, decision effect, review path, and outcome
            record are made explicit.
          </p>
        </div>

        <div className="translationChain">
          {[
            "Principle",
            "Interpretation",
            "Requirement",
            "Evidence",
            "Decision",
            "Binding",
            "Execution",
            "Outcome",
          ].map((item, index, items) => (
            <div key={item}>
              <span>{item}</span>
              {index < items.length - 1 && <b>→</b>}
            </div>
          ))}
        </div>

        <Link className="primaryButton" href="/workspace/routes/new">
          Build From a Principle
          <span>→</span>
        </Link>
      </section>

      <section className="boundaries shell">
        <div className="sectionIntro">
          <p className="eyebrow">INTERPRETATION BOUNDARIES</p>
          <h2>Keep aspiration separate from evidence.</h2>
        </div>

        <div className="boundaryGrid">
          {boundaries.map((boundary, index) => (
            <article key={boundary}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{boundary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="finalBoundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>Declaring alignment does not prove governed execution.</h2>
        </div>
        <p>
          A statement that an AI system is ethical, responsible, transparent,
          fair, human-centered, or rights-respecting remains a claim until the
          supporting authority, interpretation, evidence, control, decision,
          execution, and outcome are preserved and reviewable.
        </p>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/workspace/ai-governance/library">
          Return to Governance Library
        </Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          scroll-behavior: smooth;
          background: #040914;
        }

        :global(body) {
          margin: 0;
          background:
            radial-gradient(circle at 12% 8%, rgba(226, 170, 73, 0.13), transparent 28%),
            radial-gradient(circle at 88% 22%, rgba(66, 207, 190, 0.1), transparent 26%),
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
            radial-gradient(circle, rgba(235,186,93,.58) 0 1px, transparent 1.4px);
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
          background: #e2aa49;
        }

        .orbTwo {
          right: -180px;
          top: 44%;
          background: #56dec9;
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
          color: #171004;
          background: linear-gradient(135deg, #e2aa49, #ffe0a0);
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
          color: #e7b45e;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 900px;
          margin: 18px 0 22px;
          font-size: clamp(48px, 7vw, 90px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          max-width: 790px;
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
        .secondaryButton {
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
          color: #171004;
          background: linear-gradient(135deg, #e2aa49, #ffe1a3);
          box-shadow: 0 14px 38px rgba(226, 170, 73, 0.18);
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
          border: 1px solid rgba(231, 180, 94, 0.62);
          background:
            radial-gradient(circle, rgba(226, 170, 73, 0.18), rgba(5, 15, 25, 0.93) 62%);
          box-shadow:
            0 0 50px rgba(226, 170, 73, 0.22),
            inset 0 0 34px rgba(84, 218, 200, 0.08);
        }

        .core strong {
          font-size: 52px;
          letter-spacing: -0.04em;
        }

        .core small {
          margin-top: 6px;
          color: #efc77d;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          text-align: center;
        }

        .orbit {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(231, 180, 94, 0.2);
          animation: rotate 18s linear infinite;
        }

        .orbit span {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #e7b45e;
          box-shadow: 0 0 14px #e7b45e;
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
          background: #72e3d4;
          box-shadow: 0 0 14px #72e3d4;
        }

        .orbitThree {
          width: 420px;
          height: 420px;
          animation-duration: 34s;
        }

        .definition,
        .translation,
        .finalBoundary {
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(12, 21, 36, 0.9), rgba(7, 13, 24, 0.94));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .definition {
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .definition h2,
        .sectionIntro h2,
        .translation h2,
        .finalBoundary h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .definition > p,
        .sectionIntro > p:not(.eyebrow),
        .translation p,
        .finalBoundary > p {
          color: #9fafc2;
          line-height: 1.68;
        }

        .definition > p,
        .sectionIntro > p:not(.eyebrow),
        .translation p,
        .finalBoundary > p {
          margin-top: 0;
        }

        .principleSection,
        .boundaries {
          padding: 90px 0;
        }

        .sectionIntro {
          max-width: 830px;
          margin-bottom: 34px;
        }

        .principleGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .principleGrid article {
          min-height: 390px;
          display: flex;
          flex-direction: column;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(211, 166, 87, 0.2);
          background:
            radial-gradient(circle at 10% 0%, rgba(226, 170, 73, 0.09), transparent 34%),
            linear-gradient(180deg, rgba(13, 22, 38, 0.86), rgba(7, 13, 24, 0.94));
          transition:
            transform 220ms ease,
            border-color 220ms ease;
        }

        .principleGrid article:hover {
          transform: translateY(-5px);
          border-color: rgba(231, 180, 94, 0.55);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
        }

        .number {
          color: #e7b45e;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .status {
          color: #8596aa;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .principleGrid h3 {
          margin: 24px 0 10px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .issuer {
          margin: 0;
          color: #b6c3d1;
          font-size: 13px;
          font-weight: 750;
        }

        .force {
          margin: 7px 0 0;
          color: #e7b45e;
          font-size: 12px;
          font-weight: 850;
        }

        .description {
          color: #9eafc2;
          line-height: 1.65;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 10px 0 24px;
        }

        .tags span {
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(231, 180, 94, 0.18);
          background: rgba(226, 170, 73, 0.06);
          color: #f3ddb5;
          font-size: 10px;
          font-weight: 800;
        }

        .principleGrid a {
          margin-top: auto;
          display: inline-flex;
          align-items: center;
          gap: 20px;
          color: #e7b45e;
          text-decoration: none;
          font-weight: 850;
        }

        .translation {
          padding: 46px;
        }

        .translationCopy {
          max-width: 840px;
        }

        .translationChain {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin: 28px 0;
        }

        .translationChain > div {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .translationChain span {
          padding: 10px 15px;
          border-radius: 999px;
          border: 1px solid rgba(231, 180, 94, 0.2);
          background: rgba(226, 170, 73, 0.06);
          color: #fff1d3;
          font-size: 13px;
          font-weight: 800;
        }

        .translationChain b {
          color: #e7b45e;
        }

        .boundaryGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .boundaryGrid article {
          min-height: 190px;
          padding: 26px;
          border-radius: 20px;
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(13, 22, 38, 0.84), rgba(7, 13, 24, 0.94));
        }

        .boundaryGrid span {
          color: #e7b45e;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.14em;
        }

        .boundaryGrid p {
          color: #a2b2c4;
          line-height: 1.65;
        }

        .finalBoundary {
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .finalBoundary h2 {
          font-size: clamp(28px, 4vw, 44px);
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

        @media (max-width: 920px) {
          nav {
            display: none;
          }

          .hero {
            grid-template-columns: 1fr;
          }

          .heroVisual {
            min-height: 460px;
          }

          .definition,
          .finalBoundary {
            grid-template-columns: 1fr;
          }

          .boundaryGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
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

          .definition,
          .translation,
          .finalBoundary {
            padding: 28px 24px;
          }

          .principleGrid,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          .translationChain b {
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
