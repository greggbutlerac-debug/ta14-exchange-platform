'use client';

import Link from 'next/link';

const registrySections = [
  {
    number: '01',
    title: 'Founding Declaration',
    description:
      'The formal public declaration establishing the TA-14 Admissible Execution Architecture, its purpose, founder, steward, and institutional intent.',
    href: '/registry/ta-14-admissible-execution-architecture/founding-declaration',
    status: 'LIVE',
  },
  {
    number: '02',
    title: 'Governance Identity',
    description:
      'The canonical identity record for the architecture, including Registry identifier, founder, steward, version, status, and naming rules.',
    href: '/registry/ta-14-admissible-execution-architecture/governance-identity',
    status: 'LIVE',
  },
  {
    number: '03',
    title: 'Claims and Boundaries',
    description:
      'The architecture’s affirmative claims, explicit non-claims, declared limitations, prohibited inferences, and governance boundaries.',
    href: '/registry/ta-14-admissible-execution-architecture/claims-and-boundaries',
    status: 'LIVE',
  },
  {
    number: '04',
    title: 'Chronology',
    description:
      'The preserved public timeline of books, filings, public claims, repositories, demonstrations, platform development, and institutional formation.',
    href: '/registry/ta-14-admissible-execution-architecture/chronology',
    status: 'LIVE',
  },
  {
    number: '05',
    title: 'Publications',
    description:
      'The publication record connecting books, articles, training materials, and public writings to the development of the architecture.',
    href: '/registry/ta-14-admissible-execution-architecture/publications',
    status: 'LIVE',
  },
  {
    number: '06',
    title: 'Supporting Evidence',
    description:
      'The evidence-control record for provenance, attribution, source, date, version, continuity, corroboration, disputes, and limitations.',
    href: '/registry/ta-14-admissible-execution-architecture/evidence',
    status: 'LIVE',
  },
  {
    number: '07',
    title: 'Patent and Filing Records',
    description:
      'The declared patent and filing chronology associated with TA-14, preserved without overstating legal rights, validity, or priority.',
    href: '/registry/ta-14-admissible-execution-architecture/patents',
    status: 'LIVE',
  },
  {
    number: '08',
    title: 'Rights and Stewardship',
    description:
      'The record separating founder attribution, ownership claims, institutional custody, licensing, stewardship authority, and succession.',
    href: '/registry/ta-14-admissible-execution-architecture/rights',
    status: 'LIVE',
  },
  {
    number: '09',
    title: 'Version History',
    description:
      'The preserved amendment and supersession record showing how the architecture changes without erasing prior versions or challenges.',
    href: '/registry/ta-14-admissible-execution-architecture/versions',
    status: 'LIVE',
  },
  {
    number: '10',
    title: 'Challenges and Disputes',
    description:
      'The public route for submitting, preserving, reviewing, and resolving material challenges to claims, evidence, chronology, standing, or scope.',
    href: '/registry/ta-14-admissible-execution-architecture/challenges',
    status: 'NEXT',
  },
];

const quickLinks = [
  {
    label: 'Open TA-14 AI Governance Registry',
    href: '/registry',
  },
  {
    label: 'Open TA-14 AI Governance Exchange',
    href: '/workspace',
  },
  {
    label: 'Open Governed Records',
    href: '/workspace/ai-governance/records',
  },
];

export default function ArchitectureRegistryBridgePage() {
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
        <Link href="/registry" className="brand">
          <span className="brand-mark">TA-14</span>
          <span>
            <strong>AI Governance Registry</strong>
            <small>Architecture Record Bridge</small>
          </span>
        </Link>

        <nav aria-label="Registry bridge navigation">
          <a href="#record">Architecture Record</a>
          <a href="#sections">Registry Sections</a>
          <a href="#access">Exchange Access</a>
        </nav>

        <Link href="/registry" className="top-action">
          Registry Home
        </Link>
      </header>

      <section className="hero" id="record">
        <div className="status-row">
          <span>TA-14-AIGR-0001</span>
          <span>FOUNDING ARCHITECTURE</span>
          <span>PUBLIC</span>
          <span>ACTIVE</span>
        </div>

        <p className="eyebrow">ONE ARCHITECTURE • ONE PUBLIC RECORD • EVERY SECTION CONNECTED</p>

        <h1>
          TA-14 Admissible
          <span>Execution Architecture</span>
        </h1>

        <p className="hero-copy">
          This is the public bridge into the complete founding Registry record.
          Every completed architecture page is connected below so the entire
          record can be opened, reviewed, shared, and challenged online.
        </p>

        <div className="hero-actions">
          <a href="#sections" className="button button-primary">
            Open the Complete Record
            <span aria-hidden="true">↓</span>
          </a>

          <Link href="/registry" className="button button-secondary">
            Return to Registry
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="identity-strip">
          <div>
            <small>Registry Identifier</small>
            <strong>TA-14-AIGR-0001</strong>
          </div>
          <div>
            <small>Architecture Status</small>
            <strong>Active</strong>
          </div>
          <div>
            <small>Visibility</small>
            <strong>Public</strong>
          </div>
          <div>
            <small>Current Version</small>
            <strong>v1.0</strong>
          </div>
        </div>
      </section>

      <section id="sections" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">COMPLETE REGISTRY RECORD</p>
          <h2>Open every part of the architecture from one public page.</h2>
          <p>
            Each section remains separate so identity, claims, chronology,
            evidence, rights, filings, and versions cannot be silently blended
            into one unbounded conclusion.
          </p>
        </div>

        <div className="registry-grid">
          {registrySections.map((section) => (
            <Link key={section.number} href={section.href} className="registry-card">
              <div className="card-topline">
                <span>{section.number}</span>
                <strong className={section.status === 'NEXT' ? 'next' : ''}>
                  {section.status}
                </strong>
              </div>

              <h3>{section.title}</h3>
              <p>{section.description}</p>

              <div className="card-action">
                <span>{section.status === 'NEXT' ? 'Open when completed' : 'Open record'}</span>
                <b aria-hidden="true">→</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="access" className="section shell access-section">
        <div className="access-card">
          <div>
            <p className="eyebrow">TA-14 EXCHANGE ACCESS</p>
            <h2>The Registry preserves the architecture. The Exchange lets people test it.</h2>
            <p>
              Move directly from the public founding record into the TA-14 AI
              Governance Exchange, workspace, and governed-record environment.
            </p>
          </div>

          <div className="access-actions">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="access-link">
                <span>{link.label}</span>
                <b aria-hidden="true">→</b>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell principle-section">
        <div className="principle-card">
          <p className="eyebrow">CANONICAL TA-14 CHAIN</p>
          <h2>
            Reality → Record → Continuity → Admissibility → Binding → Commit →
            Execution → Outcome
          </h2>
          <p>
            The Registry preserves what the architecture claims to be. The
            Exchange demonstrates how governed routes, records, verification,
            and execution boundaries behave in practice.
          </p>
        </div>
      </section>

      <footer className="footer shell">
        <div>
          <strong>TA-14 Admissible Execution Architecture</strong>
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
          max-width: 890px;
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

        .identity-strip {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          max-width: 980px;
          margin: 42px auto 0;
        }

        .identity-strip div {
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(109, 216, 255, 0.16);
          background: rgba(5, 22, 36, 0.74);
          text-align: left;
        }

        .identity-strip small {
          display: block;
          color: #809caf;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .identity-strip strong {
          display: block;
          margin-top: 8px;
          color: #e7f5ff;
          font-family: Georgia, serif;
          font-size: 18px;
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
        .access-card h2,
        .principle-card h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(36px, 5vw, 60px);
          font-weight: 500;
          line-height: 1.05;
          letter-spacing: -0.035em;
        }

        .section-heading > p:last-child,
        .access-card p,
        .principle-card p {
          margin: 20px 0 0;
          color: var(--muted);
          font-size: 15px;
          line-height: 1.8;
        }

        .registry-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .registry-card {
          min-height: 285px;
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
            border-color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .registry-card:hover {
          transform: translateY(-4px);
          border-color: rgba(109, 216, 255, 0.38);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.28);
        }

        .card-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
        }

        .card-topline span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 13px;
        }

        .card-topline strong {
          padding: 6px 9px;
          border-radius: 999px;
          border: 1px solid rgba(109, 216, 255, 0.18);
          background: rgba(10, 44, 69, 0.5);
          color: #8edcff;
          font-size: 8px;
          letter-spacing: 0.08em;
        }

        .card-topline strong.next {
          color: #ffd58b;
          border-color: rgba(242, 191, 109, 0.24);
          background: rgba(96, 59, 19, 0.25);
        }

        .registry-card h3 {
          margin: 40px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
          font-weight: 500;
        }

        .registry-card p {
          margin: 0;
          color: #9fb1c0;
          font-size: 13px;
          line-height: 1.72;
        }

        .card-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: auto;
          padding-top: 28px;
          color: #d9f0ff;
          font-size: 11px;
          font-weight: 900;
        }

        .card-action b {
          font-size: 18px;
        }

        .access-section,
        .principle-section {
          padding-top: 60px;
        }

        .access-card,
        .principle-card {
          padding: 42px;
          border-radius: 28px;
          border: 1px solid rgba(242, 191, 109, 0.22);
          background:
            radial-gradient(
              circle at 10% 0%,
              rgba(189, 119, 32, 0.15),
              transparent 34%
            ),
            linear-gradient(
              145deg,
              rgba(9, 28, 45, 0.96),
              rgba(4, 13, 23, 0.98)
            );
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.3);
        }

        .access-card {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 34px;
          align-items: center;
        }

        .access-actions {
          display: grid;
          gap: 12px;
        }

        .access-link {
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 0 18px;
          border-radius: 15px;
          border: 1px solid rgba(109, 216, 255, 0.18);
          background: linear-gradient(
            180deg,
            rgba(28, 68, 98, 0.72),
            rgba(7, 23, 37, 0.9)
          );
          color: #e6f5ff;
          font-size: 12px;
          font-weight: 900;
          transition: transform 0.2s ease;
        }

        .access-link:hover {
          transform: translateX(4px);
        }

        .principle-card {
          text-align: center;
        }

        .principle-card h2 {
          max-width: 1050px;
          margin: 0 auto;
          color: transparent;
          background: linear-gradient(90deg, #f7fbff, #78dcff, #ffd28a);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .principle-card p {
          max-width: 840px;
          margin-left: auto;
          margin-right: auto;
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

        @media (max-width: 1000px) {
          .topbar nav {
            display: none;
          }

          .identity-strip {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .access-card {
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

          .registry-grid,
          .identity-strip {
            grid-template-columns: 1fr;
          }

          .access-card,
          .principle-card {
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
