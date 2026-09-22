'use client';

import Link from 'next/link';

const affirmativeClaims = [
  {
    number: '01',
    title: 'Evidence must remain attributable',
    text:
      'TA-14 claims that consequence-bearing governance requires evidence that can be traced to its source, context, timing, scope, and declared limitations.',
  },
  {
    number: '02',
    title: 'Continuity is a governing condition',
    text:
      'TA-14 claims that records can lose admissibility when custody, identity, timing, sequence, calibration, authority, or state continuity is materially broken.',
  },
  {
    number: '03',
    title: 'Record and determination are separate',
    text:
      'TA-14 claims that an observation, upload, measurement, model output, or allegation must not silently become a governed determination.',
  },
  {
    number: '04',
    title: 'Determination and optimization are separate',
    text:
      'TA-14 claims that diagnosis, governance findings, recommended interventions, commercial preferences, and optimization logic must remain distinguishable.',
  },
  {
    number: '05',
    title: 'Authority must be visible before execution',
    text:
      'TA-14 claims that evidence alone does not authorize action and that applicable authority, binding conditions, commitment, and route status must be inspectable.',
  },
  {
    number: '06',
    title: 'Execution requires an attributable route',
    text:
      'TA-14 claims that consequence-bearing execution should be connected to the records, determinations, authority, binding, and commitments that support it.',
  },
  {
    number: '07',
    title: 'Outcome belongs in the governance record',
    text:
      'TA-14 claims that execution is incomplete without an attributable outcome record capable of comparison against the original condition and declared objective.',
  },
  {
    number: '08',
    title: 'Governance must survive scrutiny',
    text:
      'TA-14 claims that a governance system should expose its boundaries, unresolved conditions, exceptions, disputes, and reasons for allowing, holding, denying, or escalating a route.',
  },
];

const nonClaims = [
  'TA-14 does not claim that every record is true merely because it was preserved.',
  'TA-14 does not claim that registration equals certification, validation, or endorsement.',
  'TA-14 does not claim that a route status replaces competent human or institutional authority.',
  'TA-14 does not claim that software alone can establish legal, medical, engineering, regulatory, or scientific sufficiency.',
  'TA-14 does not claim exclusive ownership of every concept, phrase, method, or component referenced by the architecture.',
  'TA-14 does not claim universal applicability across all domains, jurisdictions, or operational environments.',
  'TA-14 does not claim that every implementation bearing the TA-14 name faithfully executes the parent architecture.',
  'TA-14 does not claim that preservation of chronology resolves priority disputes or competing historical claims.',
];

const limitations = [
  {
    title: 'Evidence quality limitation',
    text:
      'The architecture cannot create reliable evidence from unreliable, incomplete, manipulated, stale, or context-free source material.',
  },
  {
    title: 'Authority limitation',
    text:
      'The architecture does not manufacture legal, regulatory, professional, contractual, institutional, or operational authority where none exists.',
  },
  {
    title: 'Implementation limitation',
    text:
      'A software demonstration, workflow, or user interface may represent only part of the architecture and may contain defects, omissions, or unconnected evaluators.',
  },
  {
    title: 'Domain limitation',
    text:
      'Each domain requires its own competent standards, evidence rules, thresholds, authorities, and consequence boundaries.',
  },
  {
    title: 'Jurisdiction limitation',
    text:
      'Requirements, obligations, admissibility rules, and authority structures may differ across jurisdictions and may change over time.',
  },
  {
    title: 'Human-review limitation',
    text:
      'Some routes cannot be responsibly resolved without qualified human, institutional, legal, regulatory, scientific, or technical review.',
  },
];

const prohibitedInferences = [
  {
    title: 'Preserved does not mean verified',
    text:
      'A preserved record proves that a record was submitted or maintained under declared conditions, not that every statement within it is correct.',
  },
  {
    title: 'Registered does not mean approved',
    text:
      'A Registry identifier establishes a dated, attributable registration event, not approval by TA-14, a regulator, or an independent standards body.',
  },
  {
    title: 'Mapped does not mean compliant',
    text:
      'A standards or regulatory mapping may identify relationships and gaps without proving complete legal or technical conformity.',
  },
  {
    title: 'Demonstrated does not mean production-ready',
    text:
      'A public playground or demonstration can show architecture behavior without proving security, scale, resilience, or fitness for operational deployment.',
  },
  {
    title: 'Founder claim does not settle priority',
    text:
      'Founder attribution is a preserved declaration that remains subject to documentary evidence, challenge, correction, and competing claims.',
  },
  {
    title: 'ALLOW does not erase responsibility',
    text:
      'A bounded ALLOW state does not transfer or eliminate the duties of operators, professionals, institutions, regulators, or affected parties.',
  },
];

export default function ClaimsAndBoundariesPage() {
  return (
    <main className="page">
      <div className="background" aria-hidden="true">
        <div className="stars stars-one" />
        <div className="stars stars-two" />
        <div className="glow glow-one" />
        <div className="glow glow-two" />
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
      </div>

      <header className="topbar">
        <Link
          href="/registry/ta-14-admissible-execution-architecture"
          className="brand"
        >
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>Claims and Boundaries</strong>
            <small>TA-14-AIGR-0001</small>
          </span>
        </Link>

        <nav aria-label="Claims and boundaries navigation">
          <a href="#claims">Claims</a>
          <a href="#nonclaims">Non-Claims</a>
          <a href="#limitations">Limitations</a>
          <a href="#inferences">Prohibited Inferences</a>
        </nav>

        <Link
          href="/registry/ta-14-admissible-execution-architecture"
          className="top-action"
        >
          Return to Founding Record
        </Link>
      </header>

      <section className="hero">
        <div className="status-row">
          <span>TA-14-AIGR-0001</span>
          <span>CLAIMS RECORD</span>
          <span>BOUNDED</span>
          <span>PUBLIC</span>
        </div>

        <p className="eyebrow">AFFIRMATIVE CLAIMS • NON-CLAIMS • LIMITATIONS</p>

        <h1>
          Claims and Boundaries of the
          <span>TA-14 Admissible Execution Architecture</span>
        </h1>

        <p className="hero-copy">
          This record states what TA-14 affirmatively claims, what it expressly
          does not claim, the conditions that limit its use, and the inferences
          that must not be drawn from registration, preservation, mapping, or
          demonstration.
        </p>

        <div className="hero-actions">
          <a href="#claims" className="button button-primary">
            Read the Claims Record
            <span aria-hidden="true">↓</span>
          </a>

          <Link
            href="/registry/ta-14-admissible-execution-architecture/governance-identity"
            className="button button-secondary"
          >
            Governance Identity
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="hero-notice">
          <strong>A governance claim is not self-proving.</strong>
          <p>
            Every claim remains subject to evidence, scope, interpretation,
            challenge, correction, implementation fidelity, and the authority
            of the domain in which it is used.
          </p>
        </div>
      </section>

      <section id="claims" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">AFFIRMATIVE ARCHITECTURAL CLAIMS</p>
          <h2>TA-14 claims a governed route from reality to attributable outcome.</h2>
          <p>
            These are architecture-level claims. They describe the discipline
            TA-14 says consequence-bearing systems should preserve.
          </p>
        </div>

        <div className="claims-grid">
          {affirmativeClaims.map((claim) => (
            <article key={claim.number}>
              <span>{claim.number}</span>
              <h3>{claim.title}</h3>
              <p>{claim.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="nonclaims" className="section shell nonclaims-section">
        <div className="section-heading">
          <p className="eyebrow">EXPLICIT NON-CLAIMS</p>
          <h2>The architecture must say what cannot be inferred from its existence.</h2>
          <p>
            Non-claims protect users, reviewers, institutions, and the Registry
            from turning a bounded architecture into a universal or
            self-authorizing assertion.
          </p>
        </div>

        <div className="nonclaims-card">
          <ol>
            {nonClaims.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="limitations" className="section shell limitations-section">
        <div className="section-heading">
          <p className="eyebrow">DECLARED LIMITATIONS</p>
          <h2>TA-14 cannot exceed the quality, authority, competence, or scope of its route.</h2>
          <p>
            These limitations remain active even when a system is technically
            functional or a route has produced a result.
          </p>
        </div>

        <div className="limitations-grid">
          {limitations.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="inferences" className="section shell inferences-section">
        <div className="section-heading">
          <p className="eyebrow">PROHIBITED INFERENCES</p>
          <h2>These shortcuts would misstate what the record actually proves.</h2>
          <p>
            The Registry and Foundation preserve distinctions that must remain
            visible whenever TA-14 records are cited, implemented, reviewed, or
            challenged.
          </p>
        </div>

        <div className="inferences-grid">
          {prohibitedInferences.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell final-boundary-section">
        <div className="final-boundary-card">
          <p className="eyebrow">CONTROLLING BOUNDARY</p>
          <h2>No admissible evidence. No admissible execution.</h2>
          <p>
            This motto does not mean that evidence alone is sufficient. It
            means that execution cannot be treated as admissible without an
            attributable evidence route—and that evidence must still pass the
            applicable continuity, authority, binding, competence, scope, and
            outcome conditions.
          </p>

          <div className="final-actions">
            <Link
              href="/foundation/architectures"
              className="button button-primary"
            >
              Open the Canonical Architecture
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/registry/ta-14-admissible-execution-architecture/challenges"
              className="button button-secondary"
            >
              Challenge a Claim or Boundary
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>TA-14 Claims and Boundaries</strong>
          <span>Permanent Registry record TA-14-AIGR-0001.</span>
        </div>

        <p>No admissible evidence. No admissible execution.</p>
      </footer>

      <style jsx global>{`
        :root {
          color-scheme: dark;
          --bg: #020813;
          --text: #f2f7ff;
          --muted: #a8b7c6;
          --line: rgba(129, 192, 239, 0.18);
          --blue: #6dd8ff;
          --gold: #f2bf6d;
          --red: #ff9393;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 0%, rgba(38, 112, 178, 0.22), transparent 32%),
            linear-gradient(180deg, #020711 0%, #06121f 52%, #020811 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .background {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }

        .stars {
          position: absolute;
          inset: -20%;
          opacity: 0.68;
          background-repeat: repeat;
        }

        .stars-one {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.82) 0 1px,
            transparent 1.4px
          );
          background-size: 91px 91px;
          animation: drift 48s linear infinite;
        }

        .stars-two {
          background-image: radial-gradient(
            circle,
            rgba(109, 216, 255, 0.8) 0 1px,
            transparent 1.7px
          );
          background-size: 149px 149px;
          animation: drift 72s linear infinite reverse;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.2;
        }

        .glow-one {
          width: 540px;
          height: 540px;
          top: 2%;
          left: -220px;
          background: #2a8bd3;
        }

        .glow-two {
          width: 640px;
          height: 640px;
          top: 40%;
          right: -340px;
          background: #b87822;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(242, 191, 109, 0.15);
          border-radius: 50%;
        }

        .orbit-one {
          width: 620px;
          height: 180px;
          top: 6%;
          left: -180px;
          transform: rotate(-17deg);
        }

        .orbit-two {
          width: 720px;
          height: 210px;
          top: 9%;
          right: -260px;
          transform: rotate(16deg);
        }

        .topbar,
        .hero,
        .section,
        .footer {
          position: relative;
          z-index: 2;
        }

        .topbar {
          width: min(1480px, calc(100% - 40px));
          min-height: 76px;
          margin: 18px auto 0;
          padding: 12px 14px 12px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border: 1px solid rgba(139, 201, 247, 0.18);
          border-radius: 20px;
          background: rgba(2, 10, 19, 0.74);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 70px rgba(0, 0, 0, 0.32);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 280px;
        }

        .brand-mark {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          border: 1px solid rgba(242, 191, 109, 0.46);
          background: linear-gradient(
            145deg,
            rgba(138, 86, 29, 0.34),
            rgba(29, 100, 153, 0.22)
          );
          color: var(--gold);
          font-size: 13px;
          font-weight: 900;
        }

        .brand > span:last-child {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 17px;
        }

        .brand small {
          color: #91a9bc;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .topbar nav {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .topbar nav a {
          padding: 10px 12px;
          border-radius: 11px;
          color: #b5c8d8;
          font-size: 12px;
          font-weight: 800;
          transition: 0.2s ease;
        }

        .topbar nav a:hover {
          color: white;
          background: rgba(109, 216, 255, 0.08);
          transform: translateY(-1px);
        }

        .top-action {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border-radius: 13px;
          border: 1px solid rgba(137, 205, 255, 0.27);
          background: linear-gradient(
            180deg,
            rgba(34, 79, 112, 0.76),
            rgba(8, 27, 43, 0.88)
          );
          color: #e6f4ff;
          font-size: 11px;
          font-weight: 900;
        }

        .hero {
          width: min(1240px, calc(100% - 40px));
          margin: 0 auto;
          padding: 118px 0 92px;
          text-align: center;
        }

        .status-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        .status-row span {
          min-height: 31px;
          display: inline-flex;
          align-items: center;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(137, 205, 255, 0.2);
          background: rgba(7, 28, 45, 0.72);
          color: #a9c9df;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .status-row span:first-child,
        .status-row span:nth-child(2) {
          color: #ffdb98;
          border-color: rgba(242, 191, 109, 0.3);
          background: rgba(100, 62, 20, 0.2);
        }

        .eyebrow {
          margin: 0 0 16px;
          color: var(--gold);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .hero h1 {
          max-width: 1120px;
          margin: 0 auto;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(52px, 8vw, 105px);
          font-weight: 500;
          line-height: 0.95;
          letter-spacing: -0.052em;
        }

        .hero h1 span {
          display: block;
          margin-top: 12px;
          color: transparent;
          background: linear-gradient(
            100deg,
            #f9fcff 0%,
            #7bdcff 45%,
            #ffd48b 84%
          );
          -webkit-background-clip: text;
          background-clip: text;
          font-style: italic;
        }

        .hero-copy {
          max-width: 900px;
          margin: 34px auto 0;
          color: #c0cfdb;
          font-size: clamp(17px, 2vw, 23px);
          line-height: 1.72;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 34px;
        }

        .button {
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 20px;
          border-radius: 14px;
          border: 1px solid transparent;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.045em;
          transition: transform 0.22s ease;
        }

        .button:hover {
          transform: translateY(-2px);
        }

        .button-primary {
          color: #03111d;
          border-color: rgba(209, 243, 255, 0.9);
          background: linear-gradient(
            135deg,
            #c7f2ff,
            #68ceff 55%,
            #369cec
          );
          box-shadow: 0 14px 34px rgba(53, 170, 247, 0.22);
        }

        .button-secondary {
          color: #e4f2ff;
          border-color: rgba(139, 204, 249, 0.24);
          background: linear-gradient(
            180deg,
            rgba(36, 78, 109, 0.7),
            rgba(7, 24, 39, 0.88)
          );
        }

        .hero-notice {
          max-width: 1020px;
          margin: 36px auto 0;
          padding: 22px 24px;
          text-align: left;
          border-radius: 18px;
          border: 1px solid rgba(242, 191, 109, 0.26);
          background: linear-gradient(
            90deg,
            rgba(98, 59, 18, 0.25),
            rgba(8, 25, 40, 0.8)
          );
        }

        .hero-notice strong {
          display: block;
          color: #ffe0a5;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 19px;
        }

        .hero-notice p {
          margin: 8px 0 0;
          color: #bdc9d4;
          font-size: 13px;
          line-height: 1.7;
        }

        .shell {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
        }

        .section {
          padding: 100px 0;
        }

        .section-heading {
          max-width: 900px;
          margin-bottom: 46px;
        }

        .section-heading h2,
        .final-boundary-card h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.035em;
        }

        .section-heading > p:last-child {
          margin: 20px 0 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.8;
        }

        .claims-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .claims-grid article,
        .limitations-grid article,
        .inferences-grid article {
          min-height: 260px;
          padding: 25px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.88),
            rgba(4, 15, 26, 0.92)
          );
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .claims-grid span,
        .limitations-grid span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .claims-grid h3,
        .limitations-grid h3,
        .inferences-grid h3 {
          margin: 42px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          font-weight: 500;
          line-height: 1.18;
        }

        .claims-grid p,
        .limitations-grid p,
        .inferences-grid p {
          margin: 0;
          color: #9fb1c0;
          font-size: 13px;
          line-height: 1.68;
        }

        .nonclaims-section,
        .limitations-section,
        .inferences-section,
        .final-boundary-section {
          padding-top: 60px;
        }

        .nonclaims-card {
          padding: 34px;
          border-radius: 24px;
          border: 1px solid rgba(255, 147, 147, 0.18);
          background:
            radial-gradient(
              circle at 90% 0%,
              rgba(255, 147, 147, 0.09),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              rgba(44, 20, 25, 0.54),
              rgba(6, 17, 29, 0.94)
            );
        }

        .nonclaims-card ol {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .nonclaims-card li {
          min-height: 112px;
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 14px;
          align-items: start;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(255, 147, 147, 0.13);
          background: rgba(18, 13, 20, 0.62);
        }

        .nonclaims-card li span {
          color: var(--red);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .nonclaims-card li p {
          margin: 0;
          color: #b9c4ce;
          font-size: 13px;
          line-height: 1.65;
        }

        .limitations-grid,
        .inferences-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .limitations-grid article,
        .inferences-grid article {
          min-height: 245px;
        }

        .inferences-grid article {
          border-color: rgba(242, 191, 109, 0.18);
          background:
            radial-gradient(
              circle at 100% 0%,
              rgba(242, 191, 109, 0.1),
              transparent 32%
            ),
            linear-gradient(
              155deg,
              rgba(12, 35, 54, 0.88),
              rgba(4, 15, 26, 0.92)
            );
        }

        .inferences-grid h3 {
          margin-top: 10px;
        }

        .final-boundary-card {
          padding: 44px;
          border-radius: 28px;
          border: 1px solid rgba(242, 191, 109, 0.25);
          background:
            radial-gradient(
              circle at 12% 0%,
              rgba(189, 119, 32, 0.16),
              transparent 34%
            ),
            linear-gradient(
              145deg,
              rgba(9, 28, 45, 0.96),
              rgba(4, 13, 23, 0.98)
            );
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.32);
        }

        .final-boundary-card > p:not(.eyebrow) {
          max-width: 920px;
          margin: 22px 0 0;
          color: #aebdca;
          font-size: 15px;
          line-height: 1.8;
        }

        .final-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          padding: 45px 0 60px;
          border-top: 1px solid var(--line);
          color: #8599aa;
        }

        .footer div {
          display: grid;
          gap: 5px;
        }

        .footer strong {
          color: #d7e7f3;
          font-family: Georgia, serif;
          font-size: 16px;
        }

        .footer span,
        .footer p {
          margin: 0;
          font-size: 12px;
        }

        .footer p {
          color: var(--gold);
          font-family: Georgia, serif;
          font-style: italic;
        }

        @keyframes drift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(120px, 90px, 0);
          }
        }

        @media (max-width: 1100px) {
          .topbar nav {
            display: none;
          }

          .claims-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .limitations-grid,
          .inferences-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .topbar {
            width: min(100% - 22px, 1480px);
          }

          .brand {
            min-width: 0;
          }

          .brand small,
          .top-action {
            display: none;
          }

          .hero {
            width: min(100% - 28px, 1240px);
            padding: 80px 0 72px;
          }

          .shell {
            width: min(100% - 28px, 1200px);
          }

          .section {
            padding: 78px 0;
          }

          .claims-grid,
          .limitations-grid,
          .inferences-grid,
          .nonclaims-card ol {
            grid-template-columns: 1fr;
          }

          .nonclaims-card,
          .final-boundary-card {
            padding: 30px 22px;
          }

          .footer {
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}
