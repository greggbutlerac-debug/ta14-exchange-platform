'use client';

import Link from 'next/link';

type GatewayCard = {
  number: string;
  title: string;
  description: string;
  href: string;
  status?: string;
};

const recordCards: GatewayCard[] = [
  {
    number: '01',
    title: 'Founding Declaration',
    description:
      'Identity, establishment claim, founder attribution, institutional stewardship, submission authority, and the permanent Registry boundary.',
    href: '/registry/ta-14-admissible-execution-architecture/founding-declaration',
    status: 'Founding record',
  },
  {
    number: '02',
    title: 'Governance Identity',
    description:
      'The official name, short name, version, effective date, claimed establishment date, governance category, visibility, and Registry identifier.',
    href: '/registry/ta-14-admissible-execution-architecture/governance-identity',
    status: 'Identity',
  },
  {
    number: '03',
    title: 'Claims and Non-Claims',
    description:
      'Affirmative architectural claims remain visibly separated from limitations, prohibited inferences, and matters the Registry does not establish.',
    href: '/registry/ta-14-admissible-execution-architecture/claims-and-boundaries',
    status: 'Bounded claims',
  },
  {
    number: '04',
    title: 'Canonical Architecture',
    description:
      'Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome, with route states and separation controls.',
    href: '/foundation/architectures',
    status: 'Architecture',
  },
  {
    number: '05',
    title: 'Public Chronology',
    description:
      'Dated publications, declarations, filings, repositories, platform development, corrections, supersessions, and source-binding work.',
    href: '/foundation/chronology',
    status: 'Chronology',
  },
  {
    number: '06',
    title: 'Canonical Concepts',
    description:
      'Admissibility, continuity, governed records, diagnostic determination, binding, execution, and other defined TA-14 concepts.',
    href: '/foundation/concepts',
    status: 'Foundation',
  },
  {
    number: '07',
    title: 'Publications and Articles',
    description:
      'Books, articles, reports, papers, presentations, institutional declarations, and the exact claims each publication can support.',
    href: '/foundation/publications',
    status: 'Publication record',
  },
  {
    number: '08',
    title: 'Software and Repositories',
    description:
      'The TA-14 AI Governance Exchange repository, implementation history, verified builds, demonstrations, route systems, and software boundaries.',
    href: 'https://github.com/greggbutlerac-debug/ta14-exchange-platform',
    status: 'Public repository',
  },
  {
    number: '09',
    title: 'Patent and Invention Records',
    description:
      'Applications, filing dates, provisional and non-provisional status, declared lineage, related architectures, and explicit evidentiary limits.',
    href: '/registry/ta-14-admissible-execution-architecture/patents',
    status: 'IP record',
  },
  {
    number: '10',
    title: 'Environmental and Operational Architectures',
    description:
      'Environmental integrity governance, atmospheric records, HVAC diagnostic governance, refrigerant governance, BAS/BMS, and governed interpretation.',
    href: '/registry/ta-14-admissible-execution-architecture/environmental-architectures',
    status: 'Domain architectures',
  },
  {
    number: '11',
    title: 'Institutional Ecosystem',
    description:
      'The Foundation, Exchange, Registry, Academy, Partner Review Network, governed-record systems, and the TA-14 Authority Governance Institution.',
    href: '/registry/ta-14-admissible-execution-architecture/ecosystem',
    status: 'Institutional map',
  },
  {
    number: '12',
    title: 'Evidence and Downloads',
    description:
      'Registry manifest, evidence inventory, publication index, patent index, chronology, hashes, version history, and future preserved artifacts.',
    href: '/registry/ta-14-admissible-execution-architecture/evidence',
    status: 'Evidence package',
  },
  {
    number: '13',
    title: 'Rights and Attribution',
    description:
      'Ownership assertions, stewardship, permitted use, reserved rights, contribution boundaries, and known attribution conflicts.',
    href: '/registry/ta-14-admissible-execution-architecture/rights-and-attribution',
    status: 'Rights',
  },
  {
    number: '14',
    title: 'Challenges, Corrections, and Review',
    description:
      'Submit a chronology challenge, attribution dispute, correction request, competing claim, or bounded governed-review request.',
    href: '/registry/ta-14-admissible-execution-architecture/challenges',
    status: 'Public accountability',
  },
];

const chain = [
  'Reality',
  'Record',
  'Continuity',
  'Admissibility',
  'Binding',
  'Commit',
  'Execution',
  'Outcome',
];

const architecturePrinciples = [
  {
    title: 'Record before diagnosis',
    text:
      'The record preserves what was observed, received, measured, submitted, or declared. It does not silently become a determination.',
  },
  {
    title: 'Determination before optimization',
    text:
      'A diagnostic or governance determination must remain distinguishable from recommendations, preferences, sales logic, and intervention design.',
  },
  {
    title: 'Authority before execution',
    text:
      'A route cannot become consequence-bearing merely because information exists. Applicable authority, binding, and commitment must be visible.',
  },
  {
    title: 'Outcome after execution',
    text:
      'Execution must be followed by an attributable outcome record so performance can be compared with the original state and declared objective.',
  },
];

const routeStates = [
  {
    name: 'ALLOW',
    text:
      'The declared evidence, continuity, authority, and route conditions are sufficient for the bounded use being evaluated.',
  },
  {
    name: 'HOLD',
    text:
      'The route remains incomplete, unresolved, stale, contradictory, or insufficient and must not silently proceed.',
  },
  {
    name: 'DENY',
    text:
      'A material prohibition, failed requirement, invalid authority, or disqualifying condition prevents the declared execution.',
  },
  {
    name: 'ESCALATE',
    text:
      'The route requires competent human, institutional, legal, regulatory, technical, or domain-specific review.',
  },
];

const ecosystemLinks = [
  ['TA-14 Foundation', '/foundation'],
  ['TA-14 AI Governance Exchange', '/'],
  ['TA-14 AI Governance Registry', '/registry'],
  ['TA-14 Academy', '/academy'],
  ['Partner Review Network', '/partners'],
  ['Governed Records', '/workspace/records'],
];

export default function Ta14AdmissibleExecutionArchitecturePage() {
  return (
    <main className="page">
      <div className="background" aria-hidden="true">
        <div className="stars stars-one" />
        <div className="stars stars-two" />
        <div className="glow glow-one" />
        <div className="glow glow-two" />
        <div className="glow glow-three" />
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
      </div>

      <header className="topbar">
        <Link href="/registry" className="brand">
          <span className="brand-seal">TA-14</span>
          <span>
            <strong>Admissible Execution Architecture</strong>
            <small>Permanent Registry Founding Record</small>
          </span>
        </Link>

        <nav aria-label="Architecture page navigation">
          <a href="#record">Founding Record</a>
          <a href="#architecture">Architecture</a>
          <a href="#gateway">Record Gateway</a>
          <a href="#boundary">Boundary</a>
        </nav>

        <Link href="/registry" className="top-action">
          Return to Registry
        </Link>
      </header>

      <section className="hero">
        <div className="hero-badge-row">
          <span>TA-14-AIGR-0001</span>
          <span>ACTIVE</span>
          <span>VERSION 1.0</span>
          <span>PUBLIC</span>
        </div>

        <p className="eyebrow">PERMANENT SYSTEM-SEEDED FOUNDING ARCHITECTURE</p>

        <h1>
          TA-14 Admissible
          <span>Execution Architecture</span>
        </h1>

        <p className="hero-copy">
          The parent governance architecture underlying the TA-14 Foundation,
          AI Governance Exchange, AI Governance Registry, Academy, Partner
          Review Network, governed-record systems, and domain-specific
          environmental and operational architectures.
        </p>

        <div className="hero-actions">
          <a href="#gateway" className="button button-primary">
            Open the Complete Record Gateway
            <span aria-hidden="true">↓</span>
          </a>
          <Link href="/foundation" className="button button-secondary">
            Open the TA-14 Foundation
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/registry" className="button button-secondary">
            Return to the Registry
            <span aria-hidden="true">←</span>
          </Link>
        </div>

        <div className="hero-notice">
          <strong>Permanent inclusion is not self-certification.</strong>
          <p>
            This system-seeded record preserves the identity, chronology,
            claims, boundaries, publications, implementations, and evidence
            associated with the architecture underlying the Registry. Its
            presence does not establish legal compliance, regulatory approval,
            ownership priority, technical effectiveness, certification,
            endorsement, or fitness for a particular use.
          </p>
        </div>
      </section>

      <section id="record" className="section shell">
        <div className="section-heading">
          <p className="eyebrow">FOUNDING RECORD</p>
          <h2>The Registry begins by preserving the architecture that created it.</h2>
          <p>
            TA-14 does not bypass the Registry boundary. Its founding record is
            permanently visible so the public can inspect what it calls itself,
            who claims it, what it claims, what it does not claim, and which
            records support its chronology.
          </p>
        </div>

        <div className="identity-grid">
          <article>
            <span>Registry identifier</span>
            <strong>TA-14-AIGR-0001</strong>
            <p>Permanent founding architecture record.</p>
          </article>

          <article>
            <span>Governance name</span>
            <strong>TA-14 Admissible Execution Architecture</strong>
            <p>The full public governance name.</p>
          </article>

          <article>
            <span>Short name</span>
            <strong>TA-14</strong>
            <p>Transparent Air TA-14 institutional architecture.</p>
          </article>

          <article>
            <span>Current version</span>
            <strong>1.0</strong>
            <p>Effective July 22, 2026.</p>
          </article>

          <article>
            <span>Claimed establishment date</span>
            <strong>May 1, 2025</strong>
            <p>Subject to chronology evidence, correction, and challenge.</p>
          </article>

          <article>
            <span>Founder and steward</span>
            <strong>Greggory Don Butler</strong>
            <p>Acting through the TA-14 Authority Governance Institution.</p>
          </article>

          <article>
            <span>Record class</span>
            <strong>Founding Architecture Record</strong>
            <p>System-seeded, public, versioned, and challengeable.</p>
          </article>

          <article>
            <span>Requested pathway</span>
            <strong>Record-only registration</strong>
            <p>Registration remains separate from certification or endorsement.</p>
          </article>
        </div>
      </section>

      <section id="architecture" className="section shell architecture-section">
        <div className="section-heading">
          <p className="eyebrow">CANONICAL ARCHITECTURE</p>
          <h2>The route from reality to consequence must remain inspectable.</h2>
          <p>
            TA-14 requires consequence-bearing execution to remain connected to
            the evidence, continuity, authority, binding, commitment, and
            outcome records that support it.
          </p>
        </div>

        <div className="chain" aria-label="TA-14 canonical chain">
          {chain.map((item, index) => (
            <div className="chain-item" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item}</strong>
              {index < chain.length - 1 && <b aria-hidden="true">→</b>}
            </div>
          ))}
        </div>

        <div className="principle-grid">
          {architecturePrinciples.map((principle, index) => (
            <article key={principle.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>

        <div className="state-grid">
          {routeStates.map((state) => (
            <article key={state.name}>
              <strong>{state.name}</strong>
              <p>{state.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="gateway" className="section shell gateway-section">
        <div className="section-heading">
          <p className="eyebrow">COMPLETE RECORD GATEWAY</p>
          <h2>Every major TA-14 record class has its own permanent route.</h2>
          <p>
            This gateway is the public front door to the complete founding
            architecture. Each card opens the relevant record, archive,
            publication surface, repository, evidence package, or accountability
            route.
          </p>
        </div>

        <div className="gateway-grid">
          {recordCards.map((card) => {
            const isExternal = card.href.startsWith('http');

            return (
              <article className="gateway-card" key={card.number}>
                <div className="gateway-topline">
                  <span>{card.number}</span>
                  {card.status && <small>{card.status}</small>}
                </div>

                <h3>{card.title}</h3>
                <p>{card.description}</p>

                {isExternal ? (
                  <a href={card.href} target="_blank" rel="noreferrer">
                    Open record
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <Link href={card.href}>
                    Open record
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="section shell ecosystem-section">
        <div className="section-heading">
          <p className="eyebrow">TA-14 INSTITUTIONAL ECOSYSTEM</p>
          <h2>One parent architecture, multiple bounded institutional surfaces.</h2>
          <p>
            Each surface has a different role. None should be allowed to
            impersonate another.
          </p>
        </div>

        <div className="ecosystem-links">
          {ecosystemLinks.map(([label, href]) => (
            <Link href={href} key={label}>
              <span>{label}</span>
              <b aria-hidden="true">→</b>
            </Link>
          ))}
        </div>
      </section>

      <section id="boundary" className="section shell boundary-section">
        <div className="boundary-card">
          <p className="eyebrow">REGISTRY BOUNDARY</p>
          <h2>What this permanent record does—and does not—establish.</h2>

          <div className="boundary-columns">
            <div>
              <h3>This record preserves</h3>
              <ul>
                <li>The declared identity of the architecture.</li>
                <li>The claimant, founder, steward, and institution.</li>
                <li>The claimed chronology and associated public records.</li>
                <li>The architecture’s affirmative claims and explicit non-claims.</li>
                <li>Version history, corrections, disputes, and supersessions.</li>
                <li>Publications, repositories, filings, and evidence relationships.</li>
              </ul>
            </div>

            <div>
              <h3>This record does not establish</h3>
              <ul>
                <li>Legal compliance or regulatory approval.</li>
                <li>Technical efficacy or production readiness.</li>
                <li>Ownership priority or exclusive intellectual-property rights.</li>
                <li>Certification, accreditation, endorsement, or standards conformity.</li>
                <li>The truth of every claim or authenticity of every source.</li>
                <li>Fitness for any particular organization, domain, or use.</li>
              </ul>
            </div>
          </div>

          <div className="boundary-actions">
            <Link
              href="/registry/ta-14-admissible-execution-architecture/challenges"
              className="button button-primary"
            >
              Submit a Challenge or Correction
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              href="/registry/ta-14-admissible-execution-architecture/evidence"
              className="button button-secondary"
            >
              Review the Evidence Package
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <footer className="footer shell">
        <div className="footer-seal">
          <span>TA-14</span>
          <small>AUTHORITY</small>
        </div>

        <div>
          <p className="eyebrow">OFFICE OF THE FOUNDER</p>
          <h2>TA-14 Authority Governance Institution</h2>
          <p>
            Steward of the TA-14 Foundation, AI Governance Exchange, AI
            Governance Registry, and the Public Canon of Admissible Execution.
          </p>

          <div className="footer-meta">
            <span>Greggory Don Butler</span>
            <a href="mailto:TA-14AdmissibleExecution@gmail.com">
              TA-14AdmissibleExecution@gmail.com
            </a>
            <a href="tel:+13863377215">+1 (386) 337-7215</a>
          </div>

          <strong className="motto">
            No admissible evidence. No admissible execution.
          </strong>
        </div>
      </footer>

      <style jsx global>{`
        :root {
          color-scheme: dark;
          --bg: #030813;
          --panel: rgba(7, 20, 35, 0.88);
          --panel-strong: rgba(8, 22, 38, 0.96);
          --text: #f2f7ff;
          --muted: #a6b6c8;
          --line: rgba(128, 190, 239, 0.18);
          --blue: #69d5ff;
          --blue-strong: #2c96ef;
          --gold: #f1bd68;
          --green: #6ee3b1;
          --red: #ff8e8e;
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
            radial-gradient(circle at 50% 0%, rgba(34, 108, 176, 0.22), transparent 31%),
            linear-gradient(180deg, #020711 0%, #06121f 50%, #020811 100%);
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
          opacity: 0.65;
          background-repeat: repeat;
        }

        .stars-one {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.82) 0 1px,
            transparent 1.4px
          );
          background-size: 93px 93px;
          animation: drift 48s linear infinite;
        }

        .stars-two {
          background-image: radial-gradient(
            circle,
            rgba(105, 213, 255, 0.84) 0 1px,
            transparent 1.6px
          );
          background-size: 151px 151px;
          animation: drift 70s linear infinite reverse;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.22;
        }

        .glow-one {
          width: 520px;
          height: 520px;
          top: 4%;
          left: -220px;
          background: #2b8bd4;
        }

        .glow-two {
          width: 620px;
          height: 620px;
          top: 38%;
          right: -330px;
          background: #ba7a24;
        }

        .glow-three {
          width: 520px;
          height: 520px;
          bottom: 8%;
          left: 18%;
          background: #176d8d;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(241, 189, 104, 0.15);
          border-radius: 50%;
        }

        .orbit-one {
          width: 620px;
          height: 170px;
          top: 5%;
          left: -180px;
          transform: rotate(-16deg);
        }

        .orbit-two {
          width: 720px;
          height: 220px;
          top: 10%;
          right: -260px;
          transform: rotate(17deg);
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
          min-width: 310px;
        }

        .brand-seal {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          border: 1px solid rgba(241, 189, 104, 0.48);
          background: linear-gradient(
            145deg,
            rgba(139, 86, 28, 0.35),
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
          color: #92a9bc;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.09em;
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
          color: #b4c8d8;
          font-size: 12px;
          font-weight: 800;
          transition: 0.2s ease;
        }

        .topbar nav a:hover {
          color: white;
          background: rgba(105, 213, 255, 0.08);
          transform: translateY(-1px);
        }

        .top-action {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border-radius: 13px;
          border: 1px solid rgba(137, 205, 255, 0.28);
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
          width: min(1280px, calc(100% - 40px));
          margin: 0 auto;
          padding: 120px 0 95px;
          text-align: center;
        }

        .hero-badge-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 8px;
          margin-bottom: 28px;
        }

        .hero-badge-row span {
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

        .hero-badge-row span:first-child,
        .hero-badge-row span:nth-child(3) {
          color: #ffdb98;
          border-color: rgba(241, 189, 104, 0.3);
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
          font-size: clamp(56px, 8.5vw, 112px);
          font-weight: 500;
          line-height: 0.93;
          letter-spacing: -0.055em;
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
          max-width: 940px;
          margin: 34px auto 0;
          color: #c0cfdb;
          font-size: clamp(18px, 2.2vw, 25px);
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
          max-width: 1030px;
          margin: 36px auto 0;
          padding: 22px 24px;
          text-align: left;
          border-radius: 18px;
          border: 1px solid rgba(241, 189, 104, 0.26);
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
        .boundary-card h2,
        .footer h2 {
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

        .identity-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
        }

        .identity-grid article {
          min-height: 190px;
          padding: 24px;
          border: 1px solid var(--line);
          border-radius: 19px;
          background: linear-gradient(
            155deg,
            rgba(12, 35, 54, 0.88),
            rgba(4, 15, 26, 0.92)
          );
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        }

        .identity-grid span {
          color: var(--gold);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .identity-grid strong {
          display: block;
          margin-top: 34px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 21px;
          font-weight: 500;
          line-height: 1.2;
        }

        .identity-grid p {
          margin: 11px 0 0;
          color: #99adbd;
          font-size: 12px;
          line-height: 1.6;
        }

        .architecture-section {
          padding-top: 60px;
        }

        .chain {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 8px;
          padding: 24px;
          border-radius: 22px;
          border: 1px solid rgba(241, 189, 104, 0.2);
          background: linear-gradient(
            90deg,
            rgba(84, 50, 15, 0.22),
            rgba(5, 23, 38, 0.86)
          );
        }

        .chain-item {
          position: relative;
          min-height: 98px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 8px;
          padding: 14px 10px;
          border-radius: 15px;
          border: 1px solid rgba(128, 193, 240, 0.16);
          background: rgba(4, 18, 30, 0.86);
        }

        .chain-item span {
          color: var(--gold);
          font-size: 9px;
          font-weight: 900;
        }

        .chain-item strong {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 15px;
          font-weight: 500;
        }

        .chain-item b {
          position: absolute;
          right: -8px;
          color: var(--gold);
          z-index: 2;
        }

        .principle-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 24px;
        }

        .principle-grid article {
          min-height: 250px;
          padding: 26px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: linear-gradient(
            155deg,
            rgba(11, 33, 51, 0.86),
            rgba(4, 15, 26, 0.92)
          );
        }

        .principle-grid span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .principle-grid h3 {
          margin: 42px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 23px;
          font-weight: 500;
        }

        .principle-grid p {
          margin: 0;
          color: #9fb1c0;
          font-size: 13px;
          line-height: 1.68;
        }

        .state-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .state-grid article {
          padding: 20px;
          border-radius: 18px;
          border: 1px solid var(--line);
          background: rgba(5, 19, 32, 0.82);
        }

        .state-grid strong {
          color: var(--blue);
          font-size: 11px;
          letter-spacing: 0.14em;
        }

        .state-grid p {
          margin: 12px 0 0;
          color: #a8b8c6;
          font-size: 12px;
          line-height: 1.62;
        }

        .gateway-section {
          padding-top: 60px;
        }

        .gateway-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .gateway-card {
          min-height: 290px;
          display: flex;
          flex-direction: column;
          padding: 25px;
          border-radius: 21px;
          border: 1px solid rgba(128, 192, 239, 0.17);
          background:
            radial-gradient(
              circle at 88% 0%,
              rgba(44, 150, 239, 0.12),
              transparent 34%
            ),
            linear-gradient(
              155deg,
              rgba(11, 32, 50, 0.9),
              rgba(4, 14, 24, 0.94)
            );
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          transition:
            transform 0.22s ease,
            border-color 0.22s ease;
        }

        .gateway-card:hover {
          transform: translateY(-5px);
          border-color: rgba(241, 189, 104, 0.32);
        }

        .gateway-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .gateway-topline > span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 12px;
        }

        .gateway-topline small {
          padding: 6px 9px;
          border-radius: 999px;
          border: 1px solid rgba(115, 194, 247, 0.18);
          color: #8fb8d3;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .gateway-card h3 {
          margin: 38px 0 12px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 25px;
          font-weight: 500;
          line-height: 1.15;
        }

        .gateway-card p {
          margin: 0;
          color: #9fb0bf;
          font-size: 13px;
          line-height: 1.68;
        }

        .gateway-card > a {
          margin-top: auto;
          padding-top: 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #cdeeff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .gateway-card > a span {
          color: var(--gold);
          font-size: 18px;
        }

        .ecosystem-section {
          padding-top: 60px;
        }

        .ecosystem-links {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .ecosystem-links a {
          min-height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 20px;
          border-radius: 17px;
          border: 1px solid var(--line);
          background: rgba(5, 20, 33, 0.84);
          font-family: Georgia, "Times New Roman", serif;
          font-size: 18px;
        }

        .ecosystem-links b {
          color: var(--gold);
        }

        .boundary-section {
          padding-top: 60px;
        }

        .boundary-card {
          padding: 42px;
          border-radius: 28px;
          border: 1px solid rgba(241, 189, 104, 0.25);
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

        .boundary-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 34px;
        }

        .boundary-columns > div {
          padding: 26px;
          border-radius: 20px;
          border: 1px solid var(--line);
          background: rgba(5, 20, 33, 0.78);
        }

        .boundary-columns > div:last-child {
          border-color: rgba(255, 142, 142, 0.16);
          background: rgba(47, 20, 23, 0.34);
        }

        .boundary-columns h3 {
          margin: 0 0 17px;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 22px;
          font-weight: 500;
        }

        .boundary-columns ul {
          margin: 0;
          padding-left: 20px;
          color: #aebecb;
        }

        .boundary-columns li {
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
          display: grid;
          grid-template-columns: 170px 1fr;
          gap: 46px;
          margin-top: 20px;
          margin-bottom: 38px;
          padding: 50px;
          border: 1px solid rgba(128, 190, 239, 0.16);
          border-radius: 30px;
          background: linear-gradient(
            155deg,
            rgba(10, 30, 47, 0.94),
            rgba(3, 12, 21, 0.98)
          );
        }

        .footer-seal {
          width: 150px;
          height: 150px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(241, 189, 104, 0.42);
          background: radial-gradient(
            circle,
            rgba(44, 129, 186, 0.25),
            rgba(5, 19, 32, 0.94)
          );
          box-shadow: inset 0 0 0 8px rgba(255, 255, 255, 0.02);
        }

        .footer-seal span {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 28px;
          font-weight: 900;
        }

        .footer-seal small {
          margin-top: -42px;
          color: #87a9c1;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.22em;
        }

        .footer h2 {
          font-size: clamp(31px, 4vw, 50px);
        }

        .footer > div:last-child > p:not(.eyebrow) {
          max-width: 860px;
          color: #aebdca;
          line-height: 1.7;
        }

        .footer-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 18px;
          margin-top: 26px;
          padding-top: 22px;
          border-top: 1px solid var(--line);
          color: #a6bac9;
          font-size: 12px;
        }

        .motto {
          display: block;
          margin-top: 24px;
          color: #f2d198;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 24px;
          font-style: italic;
          font-weight: 500;
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

          .identity-grid,
          .principle-grid,
          .state-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .chain {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .gateway-grid {
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
            width: min(100% - 28px, 1280px);
            padding: 80px 0 72px;
          }

          .shell {
            width: min(100% - 28px, 1200px);
          }

          .section {
            padding: 78px 0;
          }

          .identity-grid,
          .principle-grid,
          .state-grid,
          .gateway-grid,
          .ecosystem-links,
          .boundary-columns {
            grid-template-columns: 1fr;
          }

          .chain {
            grid-template-columns: 1fr;
          }

          .chain-item {
            min-height: 76px;
          }

          .chain-item b {
            right: 50%;
            bottom: -15px;
            transform: rotate(90deg);
          }

          .boundary-card {
            padding: 30px 22px;
          }

          .footer {
            grid-template-columns: 1fr;
            padding: 34px 24px;
          }

          .footer-seal {
            width: 130px;
            height: 130px;
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
