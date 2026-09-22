'use client';

import Link from 'next/link';

const rightsCategories = [
  {
    number: '01',
    title: 'Founder Attribution',
    description:
      'Preserves the identity of the declared founder and the public record connecting that person to the architecture’s establishment, terminology, chronology, and institutional development.',
    status: 'DECLARED',
  },
  {
    number: '02',
    title: 'Architecture Stewardship',
    description:
      'Preserves who is authorized to maintain the official Registry record, submit amendments, correct errors, publish updates, and represent the current canonical architecture.',
    status: 'ACTIVE',
  },
  {
    number: '03',
    title: 'Name and Terminology',
    description:
      'Preserves the declared canonical name, abbreviations, defined terms, chains, sequences, and architecture-specific language used by TA-14.',
    status: 'ACTIVE',
  },
  {
    number: '04',
    title: 'Publications and Authorship',
    description:
      'Preserves authorship, publication sequence, edition history, and the relationship between books, articles, training materials, and the architecture.',
    status: 'ATTRIBUTED',
  },
  {
    number: '05',
    title: 'Software and Platform Assets',
    description:
      'Preserves declared rights and stewardship over source code, interface designs, schemas, route logic, records, demonstrations, and Registry implementation assets.',
    status: 'DECLARED',
  },
  {
    number: '06',
    title: 'Patent and Filing Interests',
    description:
      'Preserves the declared relationship between TA-14, its founder, and associated patent or filing records without converting the Registry into a legal determination.',
    status: 'DOCUMENTED',
  },
  {
    number: '07',
    title: 'Licensing and Permissions',
    description:
      'Preserves any declared permission to use, reproduce, adapt, test, teach, integrate, or redistribute identified architecture materials.',
    status: 'CONTROLLED',
  },
  {
    number: '08',
    title: 'Successor Stewardship',
    description:
      'Preserves the conditions under which stewardship may be transferred, delegated, inherited, suspended, or disputed without erasing the founding record.',
    status: 'RESTRICTED',
  },
];

const stewardshipPowers = [
  {
    title: 'Maintain the canonical record',
    text:
      'The steward may update current versions, contact information, active links, status fields, and supporting evidence while preserving prior versions.',
  },
  {
    title: 'Submit amendments',
    text:
      'The steward may propose amendments to claims, non-claims, scope, terminology, publications, chronology, evidence, and operational status.',
  },
  {
    title: 'Correct the record',
    text:
      'The steward may correct factual or clerical errors, but corrections must remain dated, attributable, and reviewable.',
  },
  {
    title: 'Respond to challenges',
    text:
      'The steward may answer disputes, submit evidence, request clarification, accept corrections, reject claims, or propose remedies.',
  },
  {
    title: 'Declare supersession',
    text:
      'The steward may designate a newer version as controlling while preserving the superseded version and its historical status.',
  },
  {
    title: 'Withdraw reliance',
    text:
      'The steward may withdraw a claim, artifact, publication, or version from current reliance without deleting its existence from the record.',
  },
];

const rightsBoundaries = [
  'Registration does not create ownership that did not otherwise exist.',
  'Founder attribution does not automatically establish exclusive legal ownership.',
  'Stewardship does not erase contributors, collaborators, reviewers, or prior authors.',
  'Institutional custody does not transfer interpretive control away from the registered architecture.',
  'Publication does not automatically waive copyright, trademark, patent, confidentiality, or contractual rights.',
  'Open access does not automatically mean unrestricted reuse, modification, or commercial exploitation.',
  'A license applies only within its stated scope, term, territory, version, and conditions.',
  'A successor steward may maintain the record but may not silently rewrite its founding chronology.',
];

const transferConditions = [
  {
    state: 'DELEGATED',
    description:
      'Specific stewardship functions are assigned to another person or institution while the original stewardship record remains visible.',
  },
  {
    state: 'TRANSFERRED',
    description:
      'Primary stewardship authority is formally moved to another named party under preserved terms and evidence.',
  },
  {
    state: 'SUSPENDED',
    description:
      'Stewardship authority is temporarily limited because of incapacity, unresolved dispute, conflict, or procedural hold.',
  },
  {
    state: 'DISPUTED',
    description:
      'Two or more parties claim standing to represent, control, inherit, or maintain the architecture record.',
  },
  {
    state: 'VACANT',
    description:
      'No active steward is presently recognized, but the Registry record remains preserved and challengeable.',
  },
  {
    state: 'SUCCESSOR CONFIRMED',
    description:
      'A successor steward has been documented through the declared succession process and supporting evidence.',
  },
];

export default function RightsPage() {
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
            <strong>Rights & Stewardship</strong>
            <small>TA-14-AIGR-0001</small>
          </span>
        </Link>

        <nav aria-label="Rights and stewardship navigation">
          <a href="#rights">Rights Record</a>
          <a href="#powers">Steward Powers</a>
          <a href="#transfer">Transfer</a>
          <a href="#boundary">Boundary</a>
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
          <span>RIGHTS RECORD</span>
          <span>FOUNDER ATTRIBUTED</span>
          <span>STEWARD CONTROLLED</span>
        </div>

        <p className="eyebrow">ATTRIBUTION • CUSTODY • AUTHORITY • LICENSE • SUCCESSION</p>

        <h1>
          Rights and Stewardship of the
          <span>TA-14 Admissible Execution Architecture</span>
        </h1>

        <p className="hero-copy">
          This record distinguishes founder attribution, legal ownership,
          institutional custody, operational stewardship, licensing, and
          succession so that none is silently treated as equivalent to another.
        </p>

        <div className="hero-actions">
          <a href="#rights" className="button button-primary">
            Open the Rights Record
            <span aria-hidden="true">↓</span>
          </a>

          <Link
            href="/registry/ta-14-admissible-execution-architecture/patents"
            className="button button-secondary"
          >
            Patent and Filing Records
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="hero-notice">
          <strong>Preservation is not ownership, and custody is not interpretive authority.</strong>
          <p>
            The Registry preserves who claims rights and who maintains the
            record without making silent legal conclusions about ownership,
            enforceability, succession, or exclusive control.
          </p>
        </div>
      </section>

      <section id="rights" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">DECLARED RIGHTS AND STEWARDSHIP RECORD</p>
          <h2>The architecture must show who founded it, who maintains it, and what each role actually controls.</h2>
          <p>
            These categories separate personal attribution, institutional
            stewardship, intellectual-property interests, licensing, platform
            custody, and future succession.
          </p>
        </div>

        <div className="rights-grid">
          {rightsCategories.map((item) => (
            <article key={item.number}>
              <div className="rights-topline">
                <span>{item.number}</span>
                <strong>{item.status}</strong>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="powers" className="section shell powers-section">
        <div className="section-heading">
          <p className="eyebrow">DECLARED STEWARDSHIP POWERS</p>
          <h2>Stewardship authorizes maintenance of the record, not unrestricted rewriting of history.</h2>
          <p>
            Every stewardship action should remain attributable, versioned,
            reviewable, and reversible where appropriate.
          </p>
        </div>

        <div className="powers-grid">
          {stewardshipPowers.map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="transfer" className="section shell transfer-section">
        <div className="section-heading">
          <p className="eyebrow">SUCCESSION AND TRANSFER STATES</p>
          <h2>A governance architecture must remain identifiable even when its steward changes.</h2>
          <p>
            The founding record, prior versions, and historical attribution
            remain preserved through every transfer condition.
          </p>
        </div>

        <div className="transfer-grid">
          {transferConditions.map((item) => (
            <article key={item.state}>
              <strong>{item.state}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="boundary" className="section shell boundary-section">
        <div className="boundary-card">
          <p className="eyebrow">RIGHTS AND STEWARDSHIP BOUNDARY</p>
          <h2>The Registry preserves claims of authority without silently granting them.</h2>

          <div className="boundary-layout">
            <div>
              <h3>The Registry can preserve</h3>
              <ul>
                <li>The declared founder, steward, successor, applicant, author, contributor, or rights holder.</li>
                <li>The evidence offered to support attribution, custody, ownership, licensing, or succession.</li>
                <li>The scope and limits of declared permissions, restrictions, and stewardship powers.</li>
                <li>Changes in stewardship, institutional custody, licensing, and version control.</li>
                <li>Challenges to authorship, ownership, standing, attribution, or succession.</li>
              </ul>
            </div>

            <div className="boundary-negative">
              <h3>The Registry must not silently infer</h3>
              <ul>
                {rightsBoundaries.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="boundary-actions">
            <Link
              href="/registry/ta-14-admissible-execution-architecture/versions"
              className="button button-primary"
            >
              Open Version History
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/registry/ta-14-admissible-execution-architecture/challenges"
              className="button button-secondary"
            >
              Challenge Rights or Standing
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>TA-14 Rights and Stewardship</strong>
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
          max-width: 920px;
          margin-bottom: 46px;
        }

        .section-heading h2,
        .boundary-card h2 {
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

        .rights-grid,
        .powers-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .rights-grid article,
        .powers-grid article {
          min-height: 250px;
          padding: 24px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.9),
            rgba(4, 15, 26, 0.94)
          );
        }

        .rights-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }

        .rights-topline span,
        .powers-grid span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .rights-topline strong {
          padding: 6px 8px;
          border-radius: 999px;
          border: 1px solid rgba(109, 216, 255, 0.18);
          background: rgba(10, 44, 69, 0.5);
          color: #8edcff;
          font-size: 8px;
          letter-spacing: 0.08em;
        }

        .rights-grid h3,
        .powers-grid h3 {
          margin: 42px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          font-weight: 500;
        }

        .rights-grid p,
        .powers-grid p {
          margin: 0;
          color: #9fb1c0;
          font-size: 13px;
          line-height: 1.7;
        }

        .powers-section,
        .transfer-section,
        .boundary-section {
          padding-top: 60px;
        }

        .transfer-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .transfer-grid article {
          padding: 24px;
          border-radius: 18px;
          border: 1px solid rgba(109, 216, 255, 0.18);
          background: linear-gradient(
            145deg,
            rgba(10, 32, 50, 0.86),
            rgba(4, 14, 24, 0.94)
          );
        }

        .transfer-grid strong {
          color: #ffd58b;
          font-size: 10px;
          letter-spacing: 0.12em;
        }

        .transfer-grid p {
          margin: 12px 0 0;
          color: #a8b8c6;
          font-size: 13px;
          line-height: 1.68;
        }

        .boundary-card {
          padding: 42px;
          border-radius: 28px;
          border: 1px solid rgba(242, 191, 109, 0.25);
          background:
            radial-gradient(
              circle at 12% 0%,
              rgba(189, 119, 32, 0.15),
              transparent 34%
            ),
            linear-gradient(
              145deg,
              rgba(9, 28, 45, 0.96),
              rgba(4, 13, 23, 0.98)
            );
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.32);
        }

        .boundary-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 34px;
        }

        .boundary-layout > div {
          padding: 26px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: rgba(5, 20, 33, 0.78);
        }

        .boundary-layout .boundary-negative {
          border-color: rgba(255, 147, 147, 0.17);
          background: rgba(47, 20, 23, 0.34);
        }

        .boundary-layout h3 {
          margin: 0 0 17px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 500;
        }

        .boundary-layout ul {
          margin: 0;
          padding-left: 20px;
          color: #aebdca;
        }

        .boundary-layout li {
          margin: 10px 0;
          font-size: 13px;
          line-height: 1.6;
        }

        .boundary-actions {
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

          .rights-grid,
          .powers-grid {
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

          .rights-grid,
          .powers-grid,
          .transfer-grid,
          .boundary-layout {
            grid-template-columns: 1fr;
          }

          .boundary-card {
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
