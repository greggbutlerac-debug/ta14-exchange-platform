"use client";

import Link from "next/link";

const certificationTypes = [
  {
    title: "Management System Certification",
    description:
      "Formal certification against a defined management system standard, with a stated scope, audit basis, certification body, and surveillance cycle.",
    examples: ["ISO/IEC 42001", "Integrated management systems", "Surveillance audits"],
  },
  {
    title: "Product or System Certification",
    description:
      "Certification applied to a defined product, service, system, or technical capability under a specific scheme and evidence basis.",
    examples: ["Product scope", "Technical criteria", "Scheme-defined testing"],
  },
  {
    title: "Personnel Certification",
    description:
      "Certification of an individual’s knowledge, competence, or role qualification under a documented program.",
    examples: ["Role competence", "Exam evidence", "Renewal requirements"],
  },
  {
    title: "Organizational Attestation",
    description:
      "A formal declaration or third-party statement regarding selected controls, practices, or representations within a bounded period and scope.",
    examples: ["Control attestation", "Evidence period", "Defined non-claims"],
  },
];

const requiredFields = [
  "Scheme owner",
  "Certification body",
  "Accreditation status",
  "Standard or criteria",
  "Certified scope",
  "Excluded scope",
  "Issue and expiration dates",
  "Surveillance requirements",
  "Evidence package",
  "Non-claims and limitations",
  "Status changes",
  "Revocation or suspension history",
];

export default function CertificationsPage() {
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
            <strong>Certifications</strong>
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
          <p className="eyebrow">CERTIFICATIONS</p>
          <h1>Preserve what was certified—and everything that was not.</h1>
          <p className="lead">
            Certification can provide valuable assurance, but only within a
            specific scheme, scope, evidence basis, date range, and review
            authority. The TA-14 Governance Library separates certification
            status from broader claims about legality, safety, fairness,
            admissibility, runtime control, and verified outcomes.
          </p>

          <div className="heroActions">
            <Link className="primaryButton" href="#types">
              Explore Certification Types
              <span>→</span>
            </Link>
            <Link className="secondaryButton" href="/workspace/routes/new">
              Build Certification Route
            </Link>
          </div>
        </div>

        <div className="heroVisual" aria-hidden="true">
          <div className="seal sealOuter" />
          <div className="seal sealMiddle" />
          <div className="seal sealInner" />
          <div className="core">
            <strong>CR</strong>
            <small>Certified Scope</small>
          </div>
        </div>
      </section>

      <section className="definition shell">
        <div>
          <p className="eyebrow">CERTIFICATION BOUNDARY</p>
          <h2>A certificate is a bounded attestation, not universal proof.</h2>
        </div>
        <p>
          A valid certification should identify the certifying authority,
          scheme, standard or criteria, certified entity, covered activities,
          excluded activities, dates, surveillance obligations, status, and
          evidence basis. Without those fields, the meaning of “certified” can
          become broader than the certification itself.
        </p>
      </section>

      <section className="types shell" id="types">
        <div className="sectionIntro">
          <p className="eyebrow">CERTIFICATION CATEGORIES</p>
          <h2>Different certification types answer different questions.</h2>
          <p>
            The library preserves each certification lane separately so that
            organizational, technical, personnel, and attestation claims do not
            become falsely interchangeable.
          </p>
        </div>

        <div className="typeGrid">
          {certificationTypes.map((item, index) => (
            <article key={item.title}>
              <div className="cardTop">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>Certification lane</small>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="tags">
                {item.examples.map((example) => (
                  <span key={example}>{example}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="fields shell">
        <div className="fieldsCopy">
          <p className="eyebrow">REQUIRED CERTIFICATION RECORD</p>
          <h2>Make the certification independently interpretable.</h2>
          <p>
            A certification record should allow another reviewer to determine
            what the certificate means without relying on marketing language or
            unsupported inference.
          </p>
        </div>

        <div className="fieldGrid">
          {requiredFields.map((field, index) => (
            <div key={field}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{field}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="route shell">
        <div>
          <p className="eyebrow">FROM CERTIFICATE TO GOVERNED USE</p>
          <h2>Certification may support a decision, but it does not replace one.</h2>
          <p>
            TA-14 routes preserve how a certification was interpreted, whether
            it remained current and applicable, what evidence it supported,
            which decision depended on it, and whether the resulting execution
            stayed within the certified scope.
          </p>
        </div>

        <div className="routeChain">
          {[
            "Certificate",
            "Scope",
            "Validity",
            "Applicability",
            "Evidence",
            "Decision",
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
          Build From a Certification
          <span>→</span>
        </Link>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>Certified does not mean admissible for every action.</h2>
        </div>
        <p>
          Certification does not automatically prove current legal authority,
          complete evidence, correct interpretation, valid runtime conditions,
          safe execution, or acceptable outcomes. The certificate remains one
          governed input within a larger execution decision.
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
            radial-gradient(circle at 12% 8%, rgba(80, 220, 169, 0.12), transparent 28%),
            radial-gradient(circle at 88% 22%, rgba(68, 130, 255, 0.13), transparent 27%),
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
            radial-gradient(circle, rgba(80,220,169,.56) 0 1px, transparent 1.4px);
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
          background: #50dca9;
        }

        .orbTwo {
          right: -180px;
          top: 44%;
          background: #4482ff;
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
          color: #03130e;
          background: linear-gradient(135deg, #50dca9, #b8ffe5);
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
          color: #63e5b4;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 930px;
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
          color: #03130e;
          background: linear-gradient(135deg, #50dca9, #b8ffe5);
          box-shadow: 0 14px 38px rgba(80, 220, 169, 0.18);
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

        .seal {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(99, 229, 180, 0.22);
          animation: pulse 4s ease-in-out infinite;
        }

        .sealOuter {
          width: 420px;
          height: 420px;
        }

        .sealMiddle {
          width: 320px;
          height: 320px;
          animation-delay: -1.3s;
        }

        .sealInner {
          width: 240px;
          height: 240px;
          animation-delay: -2.6s;
        }

        .core {
          width: 190px;
          height: 190px;
          border-radius: 999px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border: 1px solid rgba(99, 229, 180, 0.6);
          background:
            radial-gradient(circle, rgba(80, 220, 169, 0.18), rgba(5, 15, 25, 0.93) 62%);
          box-shadow:
            0 0 50px rgba(80, 220, 169, 0.22),
            inset 0 0 34px rgba(68, 130, 255, 0.08);
        }

        .core strong {
          font-size: 52px;
          letter-spacing: -0.04em;
        }

        .core small {
          margin-top: 6px;
          color: #a9f3d6;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          text-align: center;
        }

        .definition,
        .fields,
        .route,
        .boundary {
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(12, 21, 36, 0.9), rgba(7, 13, 24, 0.94));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .definition,
        .boundary {
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .definition h2,
        .sectionIntro h2,
        .fields h2,
        .route h2,
        .boundary h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .definition > p,
        .sectionIntro > p:not(.eyebrow),
        .fields p,
        .route p,
        .boundary > p {
          color: #9fafc2;
          line-height: 1.68;
          margin-top: 0;
        }

        .types {
          padding: 90px 0;
        }

        .sectionIntro {
          max-width: 830px;
          margin-bottom: 34px;
        }

        .typeGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .typeGrid article {
          min-height: 320px;
          display: flex;
          flex-direction: column;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(80, 220, 169, 0.2);
          background:
            radial-gradient(circle at 10% 0%, rgba(80, 220, 169, 0.09), transparent 34%),
            linear-gradient(180deg, rgba(13, 22, 38, 0.86), rgba(7, 13, 24, 0.94));
          transition:
            transform 220ms ease,
            border-color 220ms ease;
        }

        .typeGrid article:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 229, 180, 0.55);
        }

        .cardTop {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: center;
        }

        .cardTop span {
          color: #63e5b4;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .cardTop small {
          color: #8596aa;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .typeGrid h3 {
          margin: 24px 0 10px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .typeGrid p {
          color: #9eafc2;
          line-height: 1.65;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .tags span {
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(99, 229, 180, 0.18);
          background: rgba(80, 220, 169, 0.06);
          color: #d8ffef;
          font-size: 10px;
          font-weight: 800;
        }

        .fields,
        .route {
          padding: 46px;
          margin-top: 24px;
        }

        .fieldsCopy,
        .route > div:first-child {
          max-width: 850px;
        }

        .fieldGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .fieldGrid div {
          min-height: 64px;
          display: flex;
          align-items: center;
          gap: 13px;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(99, 229, 180, 0.15);
          background: rgba(80, 220, 169, 0.035);
        }

        .fieldGrid span {
          color: #63e5b4;
          font-size: 10px;
          font-weight: 900;
        }

        .fieldGrid strong {
          font-size: 13px;
        }

        .routeChain {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin: 28px 0;
        }

        .routeChain > div {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .routeChain span {
          padding: 10px 15px;
          border-radius: 999px;
          border: 1px solid rgba(99, 229, 180, 0.2);
          background: rgba(80, 220, 169, 0.06);
          color: #e2fff4;
          font-size: 13px;
          font-weight: 800;
        }

        .routeChain b {
          color: #63e5b4;
        }

        .boundary {
          margin-top: 24px;
        }

        .boundary h2 {
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

        @keyframes pulse {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.28;
          }
          50% {
            transform: scale(1.04);
            opacity: 0.72;
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
          .boundary {
            grid-template-columns: 1fr;
          }

          .fieldGrid {
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
          .fields,
          .route,
          .boundary {
            padding: 28px 24px;
          }

          .typeGrid,
          .fieldGrid {
            grid-template-columns: 1fr;
          }

          .routeChain b {
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
