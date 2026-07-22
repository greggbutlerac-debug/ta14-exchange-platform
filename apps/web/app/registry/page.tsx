'use client';

import Link from 'next/link';

const registryEntries = [
  {
    label: 'Founding Architecture Record',
    title: 'TA-14 Admissible Execution Architecture',
    description:
      'Open the complete public founding record, including identity, claims, chronology, publications, evidence, filings, rights, stewardship, versions, and challenges.',
    href: '/registry/ta-14-admissible-execution-architecture',
    status: 'PUBLIC RECORD',
    primary: true,
  },
  {
    label: 'Registry Purpose',
    title: 'What the TA-14 AI Governance Registry Preserves',
    description:
      'See how the Registry creates dated, attributable, searchable records of governance architectures without certifying, validating, or endorsing them.',
    href: '/registry/about',
    status: 'REGISTRY GUIDE',
  },
  {
    label: 'Register an Architecture',
    title: 'Create a Governance Architecture Record',
    description:
      'Prepare a bounded Registry record containing identity, claims, non-claims, evidence, publications, ownership declarations, and version history.',
    href: '/registry/register',
    status: 'REGISTRATION',
  },
  {
    label: 'Browse Records',
    title: 'Discover Registered Governance Architectures',
    description:
      'Browse public architecture records by name, category, steward, domain, status, chronology, evidence, and declared scope.',
    href: '/registry/records',
    status: 'DISCOVERY',
  },
];

export default function RegistryHomePage() {
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
        <Link href="/" className="brand">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>AI Governance Registry</strong>
            <small>Public Architecture Records</small>
          </span>
        </Link>

        <nav aria-label="Registry navigation">
          <a href="#founding-record">Founding Record</a>
          <a href="#registry-access">Registry Access</a>
          <Link href="/workspace">Exchange Workspace</Link>
        </nav>

        <Link href="/workspace" className="top-action">
          Open Exchange
        </Link>
      </header>

      <section className="hero">
        <div className="status-row">
          <span>TA-14 AI GOVERNANCE REGISTRY</span>
          <span>PUBLIC</span>
          <span>ATTRIBUTABLE</span>
          <span>CHALLENGEABLE</span>
        </div>

        <p className="eyebrow">
          IDENTITY • CHRONOLOGY • CLAIMS • EVIDENCE • STEWARDSHIP
        </p>

        <h1>
          Governance architectures need
          <span>a public record.</span>
        </h1>

        <p className="hero-copy">
          The TA-14 AI Governance Registry preserves what an architecture calls
          itself, who claims it, when it was established, what it claims to
          govern, what evidence supports it, and where its boundaries remain.
        </p>

        <div className="hero-actions">
          <Link
            href="/registry/ta-14-admissible-execution-architecture"
            className="button button-primary"
          >
            Open the TA-14 Founding Architecture Record
            <span aria-hidden="true">→</span>
          </Link>

          <a href="#registry-access" className="button button-secondary">
            Explore the Registry
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section id="founding-record" className="section shell">
        <div className="featured-record">
          <div className="featured-copy">
            <div className="featured-topline">
              <span>FOUNDING REGISTRY RECORD</span>
              <strong>TA-14-AIGR-0001</strong>
            </div>

            <p className="eyebrow">NOW AVAILABLE ONLINE</p>

            <h2>TA-14 Admissible Execution Architecture</h2>

            <p>
              This is the first complete founding architecture record in the
              Registry. It connects every completed section through one public
              bridge so the entire record can be opened, reviewed, shared, and
              challenged online.
            </p>

            <div className="record-details">
              <div>
                <small>Status</small>
                <strong>Active</strong>
              </div>
              <div>
                <small>Visibility</small>
                <strong>Public</strong>
              </div>
              <div>
                <small>Version</small>
                <strong>v1.0</strong>
              </div>
              <div>
                <small>Record</small>
                <strong>Founding</strong>
              </div>
            </div>

            <Link
              href="/registry/ta-14-admissible-execution-architecture"
              className="featured-action"
            >
              <span>Enter the Complete Architecture Record</span>
              <b aria-hidden="true">→</b>
            </Link>
          </div>

          <div className="record-map">
            <span>Founding Declaration</span>
            <span>Governance Identity</span>
            <span>Claims and Boundaries</span>
            <span>Chronology</span>
            <span>Publications</span>
            <span>Supporting Evidence</span>
            <span>Patent Records</span>
            <span>Rights and Stewardship</span>
            <span>Version History</span>
            <span>Challenges and Disputes</span>
          </div>
        </div>
      </section>

      <section id="registry-access" className="section shell access-section">
        <div className="section-heading">
          <p className="eyebrow">REGISTRY ACCESS</p>
          <h2>Enter the Registry through the route that matches what you need.</h2>
          <p>
            The founding record is live now. Additional registration,
            discovery, and Registry guidance routes can be connected as those
            pages are completed.
          </p>
        </div>

        <div className="registry-grid">
          {registryEntries.map((entry) => (
            <Link
              key={entry.title}
              href={entry.href}
              className={`registry-card ${entry.primary ? 'primary-card' : ''}`}
            >
              <div className="card-topline">
                <span>{entry.label}</span>
                <strong>{entry.status}</strong>
              </div>

              <h3>{entry.title}</h3>
              <p>{entry.description}</p>

              <div className="card-action">
                <span>Open</span>
                <b aria-hidden="true">→</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section shell boundary-section">
        <div className="boundary-card">
          <p className="eyebrow">REGISTRY BOUNDARY</p>
          <h2>A Registry record preserves a claim. It does not automatically validate it.</h2>

          <div className="boundary-grid">
            <div>
              <h3>The Registry preserves</h3>
              <ul>
                <li>Governance identity and claimed establishment date.</li>
                <li>Founder, author, organization, and steward attribution.</li>
                <li>Claims, non-claims, limitations, and declared scope.</li>
                <li>Evidence, publications, filings, and version history.</li>
                <li>Challenges, corrections, disputes, and withdrawals.</li>
              </ul>
            </div>

            <div>
              <h3>The Registry does not automatically provide</h3>
              <ul>
                <li>Certification, accreditation, or regulatory approval.</li>
                <li>Legal priority, ownership, validity, or enforceability.</li>
                <li>Technical validation or independent performance proof.</li>
                <li>Endorsement by TA-14 or any Registry participant.</li>
                <li>Permission to exceed the architecture’s declared boundaries.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>TA-14 AI Governance Registry</strong>
          <span>Public records for identifiable governance architectures.</span>
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
          opacity: 0.7;
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
          width: 560px;
          height: 560px;
          top: 0;
          left: -220px;
          background: #2a8bd3;
        }

        .glow-two {
          width: 660px;
          height: 660px;
          top: 35%;
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
          top: 5%;
          left: -180px;
          transform: rotate(-17deg);
        }

        .orbit-two {
          width: 720px;
          height: 210px;
          top: 8%;
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
          padding: 118px 0 88px;
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

        .status-row span:first-child {
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
          font-size: clamp(58px, 9vw, 116px);
          font-weight: 500;
          line-height: 0.92;
          letter-spacing: -0.058em;
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
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 21px;
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

        .shell {
          width: min(1200px, calc(100% - 40px));
          margin: 0 auto;
        }

        .section {
          padding: 100px 0;
        }

        .featured-record {
          display: grid;
          grid-template-columns: 1.12fr 0.88fr;
          gap: 20px;
          padding: 24px;
          border-radius: 30px;
          border: 1px solid rgba(242, 191, 109, 0.26);
          background:
            radial-gradient(
              circle at 8% 0%,
              rgba(189, 119, 32, 0.16),
              transparent 32%
            ),
            linear-gradient(
              145deg,
              rgba(9, 28, 45, 0.96),
              rgba(4, 13, 23, 0.98)
            );
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.32);
        }

        .featured-copy {
          padding: 24px;
        }

        .featured-topline {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 42px;
        }

        .featured-topline span,
        .featured-topline strong {
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(109, 216, 255, 0.18);
          background: rgba(8, 39, 62, 0.5);
          color: #a6ddfb;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .featured-topline strong {
          color: #ffda97;
          border-color: rgba(242, 191, 109, 0.26);
          background: rgba(92, 55, 18, 0.24);
        }

        .featured-copy h2,
        .section-heading h2,
        .boundary-card h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(38px, 5vw, 64px);
          font-weight: 500;
          line-height: 1.03;
          letter-spacing: -0.04em;
        }

        .featured-copy > p:not(.eyebrow),
        .section-heading > p:last-child {
          margin: 20px 0 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.8;
        }

        .record-details {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
          margin-top: 28px;
        }

        .record-details div {
          padding: 15px;
          border-radius: 14px;
          border: 1px solid rgba(109, 216, 255, 0.15);
          background: rgba(5, 22, 36, 0.68);
        }

        .record-details small {
          display: block;
          color: #809caf;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .record-details strong {
          display: block;
          margin-top: 7px;
          font-family: Georgia, serif;
          font-size: 17px;
        }

        .featured-action {
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 24px;
          padding: 0 18px;
          border-radius: 15px;
          border: 1px solid rgba(209, 243, 255, 0.88);
          background: linear-gradient(
            135deg,
            #c7f2ff,
            #68ceff 55%,
            #369cec
          );
          color: #03111d;
          font-size: 12px;
          font-weight: 900;
          transition: transform 0.22s ease;
        }

        .featured-action:hover {
          transform: translateY(-2px);
        }

        .record-map {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          padding: 18px;
          border-radius: 22px;
          border: 1px solid rgba(109, 216, 255, 0.15);
          background: rgba(3, 16, 28, 0.72);
        }

        .record-map span {
          min-height: 72px;
          display: flex;
          align-items: center;
          padding: 15px;
          border-radius: 14px;
          border: 1px solid rgba(109, 216, 255, 0.14);
          background: linear-gradient(
            145deg,
            rgba(12, 39, 60, 0.8),
            rgba(5, 20, 33, 0.92)
          );
          color: #c5d7e4;
          font-size: 11px;
          font-weight: 800;
          line-height: 1.4;
        }

        .access-section,
        .boundary-section {
          padding-top: 60px;
        }

        .section-heading {
          max-width: 900px;
          margin-bottom: 44px;
        }

        .registry-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .registry-card {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          padding: 26px;
          border-radius: 22px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.9),
            rgba(4, 15, 26, 0.94)
          );
          transition:
            transform 0.22s ease,
            border-color 0.22s ease;
        }

        .registry-card:hover {
          transform: translateY(-4px);
          border-color: rgba(109, 216, 255, 0.36);
        }

        .primary-card {
          border-color: rgba(242, 191, 109, 0.3);
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(168, 104, 27, 0.14),
              transparent 38%
            ),
            linear-gradient(
              155deg,
              rgba(12, 35, 54, 0.92),
              rgba(4, 15, 26, 0.96)
            );
        }

        .card-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .card-topline span {
          color: var(--gold);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .card-topline strong {
          padding: 6px 8px;
          border-radius: 999px;
          border: 1px solid rgba(109, 216, 255, 0.18);
          background: rgba(10, 44, 69, 0.5);
          color: #8edcff;
          font-size: 8px;
          letter-spacing: 0.08em;
        }

        .registry-card h3 {
          margin: 38px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 29px;
          font-weight: 500;
        }

        .registry-card p {
          margin: 0;
          color: #9fb1c0;
          font-size: 13px;
          line-height: 1.7;
        }

        .card-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 28px;
          color: #d8f1ff;
          font-size: 11px;
          font-weight: 900;
        }

        .boundary-card {
          padding: 42px;
          border-radius: 28px;
          border: 1px solid rgba(242, 191, 109, 0.23);
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
        }

        .boundary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 32px;
        }

        .boundary-grid > div {
          padding: 24px;
          border-radius: 18px;
          border: 1px solid var(--line);
          background: rgba(5, 20, 33, 0.75);
        }

        .boundary-grid h3 {
          margin: 0 0 16px;
          font-family: Georgia, serif;
          font-size: 22px;
          font-weight: 500;
        }

        .boundary-grid ul {
          margin: 0;
          padding-left: 20px;
          color: #aebdca;
        }

        .boundary-grid li {
          margin: 10px 0;
          font-size: 13px;
          line-height: 1.6;
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

        @media (max-width: 1050px) {
          .topbar nav {
            display: none;
          }

          .featured-record {
            grid-template-columns: 1fr;
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
            padding: 80px 0 70px;
          }

          .shell {
            width: min(100% - 28px, 1200px);
          }

          .section {
            padding: 76px 0;
          }

          .featured-record {
            padding: 14px;
          }

          .featured-copy {
            padding: 18px 8px;
          }

          .record-details,
          .record-map,
          .registry-grid,
          .boundary-grid {
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
