import Link from "next/link";

const ecosystem = [
  {
    title: "Foundation",
    description:
      "Explains and preserves the public canon, institutional history, publications, patents, evidence, and architecture relationships.",
    href: "/foundation",
    label: "You are here",
  },
  {
    title: "AI Governance Exchange",
    description:
      "Builds, tests, verifies, replays, and demonstrates governed execution routes.",
    href: "/workspace/ai-governance",
    label: "Open Exchange",
  },
  {
    title: "AI Governance Registry",
    description:
      "Creates permanent, attributable governance records supported by declared evidence.",
    href: "/workspace/ai-governance/registry",
    label: "Open Registry",
  },
  {
    title: "Academy",
    description:
      "Teaches admissible execution architecture, governed records, and domain-specific applications.",
    href: "/academy",
    label: "Explore Academy",
  },
  {
    title: "Partner Review Network",
    description:
      "Provides independent, bounded review without architectural assimilation.",
    href: "/partner-review-network",
    label: "Explore Network",
  },
  {
    title: "Authority",
    description:
      "Stewards constitutional doctrine, formal interpretation, standards, and institutional continuity.",
    href: "/foundation/about-ta14",
    label: "About the Authority",
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

export default function FoundationPage() {
  return (
    <main className="foundation-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 28 }).map((_, index) => (
          <span key={index} className={`star star-${(index % 7) + 1}`} />
        ))}
      </div>

      <header className="topbar">
        <Link href="/" className="brand" aria-label="TA-14 home">
          <span className="brand-mark">TA-14</span>
          <span className="brand-copy">
            <strong>Foundation</strong>
            <small>Public Canon of Admissible Execution</small>
          </span>
        </Link>

        <nav className="topnav" aria-label="Foundation navigation">
          <Link href="/foundation/concepts">Concepts</Link>
          <Link href="/foundation/architectures">Architectures</Link>
          <Link href="/foundation/publications">Publications</Link>
          <Link href="/foundation/timeline">Timeline</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="seal-wrap" aria-hidden="true">
          <div className="seal">
            <div className="seal-ring">
              <span>TA-14</span>
              <small>AUTHORITY</small>
            </div>
          </div>
        </div>

        <p className="eyebrow">TA-14 Authority Governance Institution</p>
        <h1>
          The permanent public memory
          <span>of admissible execution.</span>
        </h1>
        <p className="hero-copy">
          The TA-14 Foundation explains the architecture, preserves its history,
          connects its publications, patents, evidence, and institutions, and
          provides the public canon from which the operational Exchange,
          Registry, Academy, and Partner Review Network are understood.
        </p>

        <div className="hero-actions">
          <Link href="/foundation/concepts" className="button button-primary">
            Explore the Public Canon
          </Link>
          <Link
            href="/workspace/ai-governance/registry"
            className="button button-secondary"
          >
            Open the Registry
          </Link>
        </div>

        <div className="boundary-card">
          <strong>Foundational boundary</strong>
          <p>
            The Foundation explains and preserves governance. It does not
            execute routes, issue runtime decisions, certify systems, or expose
            private workspace records.
          </p>
        </div>
      </section>

      <section className="principles section-shell">
        <div className="section-heading">
          <p className="eyebrow">Constitutional principles</p>
          <h2>Evidence begins the architecture. The chain preserves it.</h2>
        </div>

        <div className="principle-grid">
          <article className="principle-card">
            <span>First principle</span>
            <blockquote>
              No admissible evidence.
              <br />
              No admissible execution.
            </blockquote>
            <p>
              Without admissible evidence there can be no admissible
              determination, authority, binding, or consequence-bearing action.
            </p>
          </article>

          <article className="principle-card">
            <span>Operational principle</span>
            <blockquote>
              No admissible chain.
              <br />
              No admissible execution.
            </blockquote>
            <p>
              Evidence alone is insufficient. Identity, continuity, authority,
              binding, commitment, execution, and outcome must remain intact.
            </p>
          </article>
        </div>
      </section>

      <section className="chain-section section-shell">
        <div className="section-heading centered">
          <p className="eyebrow">The Chain of Eight</p>
          <h2>The domains may change. The governing chain does not.</h2>
        </div>

        <div className="chain" aria-label="TA-14 Chain of Eight">
          {chain.map((item, index) => (
            <div className="chain-item" key={item}>
              <span className="chain-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{item}</strong>
              {index < chain.length - 1 ? (
                <span className="chain-arrow" aria-hidden="true">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="ecosystem-section section-shell">
        <div className="section-heading">
          <p className="eyebrow">The TA-14 ecosystem</p>
          <h2>One institution. Distinct responsibilities.</h2>
          <p>
            Each system retains its own boundary while remaining connected to
            the same constitutional architecture.
          </p>
        </div>

        <div className="ecosystem-grid">
          {ecosystem.map((item) => (
            <article className="ecosystem-card" key={item.title}>
              <div>
                <span className="ecosystem-dot" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <Link href={item.href}>{item.label} →</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="orientation section-shell">
        <div>
          <p className="eyebrow">Start with the idea</p>
          <h2>Explore TA-14 through concepts, not disconnected files.</h2>
          <p>
            Begin with Admissibility, Continuity, Authority, Governed Records,
            Runtime Governance, Environmental Integrity, or another canonical
            concept. Each page will connect definitions, publications,
            architectures, evidence, patents, and operational destinations.
          </p>
        </div>
        <Link href="/foundation/concepts" className="button button-primary">
          Enter the Concept Explorer
        </Link>
      </section>

      <footer className="institutional-footer">
        <div className="footer-seal" aria-hidden="true">
          <span>TA-14</span>
          <small>AUTHORITY</small>
        </div>

        <div className="footer-main">
          <p className="eyebrow">Office of the Founder</p>
          <h2>TA-14 Authority Governance Institution</h2>
          <p className="steward-line">
            Steward of the TA-14 Foundation and Public Canon
          </p>

          <div className="contact-grid">
            <address>
              <strong>Institutional Address</strong>
              <span>140 Island Way, #144</span>
              <span>Clearwater Beach, Florida 33767</span>
              <span>United States</span>
            </address>

            <div>
              <strong>Founder</strong>
              <span>Greggory Don Butler</span>
            </div>

            <div>
              <strong>General Inquiries</strong>
              <a href="mailto:TA-14AdmissibleExecution@gmail.com">
                TA-14AdmissibleExecution@gmail.com
              </a>
              <a href="tel:+13863377215">+1 (386) 337-7215</a>
            </div>
          </div>

          <div className="footer-principles">
            <span>Evidence First.</span>
            <span>Truth Locked.</span>
            <span>Action Separated.</span>
          </div>

          <p className="footer-motto">
            No admissible evidence. No admissible execution.
          </p>
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            color-scheme: dark;
          }

          * {
            box-sizing: border-box;
          }

          html {
            scroll-behavior: smooth;
          }

          body {
            margin: 0;
            background: #05070c;
          }

          .foundation-page {
            position: relative;
            min-height: 100vh;
            overflow: hidden;
            color: #f7f8fb;
            background:
              radial-gradient(circle at 50% 0%, rgba(72, 116, 255, 0.14), transparent 34%),
              linear-gradient(180deg, #060912 0%, #090d18 42%, #05070c 100%);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }

          .foundation-page::before {
            content: "";
            position: fixed;
            inset: 0;
            pointer-events: none;
            opacity: 0.34;
            background-image:
              linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px);
            background-size: 64px 64px;
            mask-image: linear-gradient(to bottom, black, transparent 85%);
          }

          .ambient {
            position: absolute;
            border-radius: 999px;
            filter: blur(90px);
            opacity: 0.32;
            pointer-events: none;
          }

          .ambient-one {
            width: 520px;
            height: 520px;
            top: 260px;
            left: -230px;
            background: rgba(79, 130, 255, 0.25);
            animation: driftOne 15s ease-in-out infinite alternate;
          }

          .ambient-two {
            width: 620px;
            height: 620px;
            top: 940px;
            right: -320px;
            background: rgba(167, 104, 255, 0.2);
            animation: driftTwo 18s ease-in-out infinite alternate;
          }

          .stars {
            position: absolute;
            inset: 0;
            pointer-events: none;
          }

          .star {
            position: absolute;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: white;
            box-shadow: 0 0 12px rgba(144, 187, 255, 0.9);
            opacity: 0.5;
            animation: twinkle 4s ease-in-out infinite;
          }

          .star-1 { top: 8%; left: 8%; animation-delay: .2s; }
          .star-2 { top: 14%; left: 74%; animation-delay: 1.1s; }
          .star-3 { top: 23%; left: 88%; animation-delay: 2.4s; }
          .star-4 { top: 34%; left: 13%; animation-delay: .8s; }
          .star-5 { top: 48%; left: 65%; animation-delay: 1.8s; }
          .star-6 { top: 63%; left: 23%; animation-delay: 2.8s; }
          .star-7 { top: 82%; left: 84%; animation-delay: 3.2s; }

          .topbar {
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto;
            padding: 24px 0;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }

          .brand {
            display: inline-flex;
            align-items: center;
            gap: 14px;
            color: inherit;
            text-decoration: none;
          }

          .brand-mark {
            display: grid;
            place-items: center;
            width: 58px;
            height: 58px;
            border: 1px solid rgba(170, 199, 255, 0.45);
            border-radius: 50%;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: .08em;
            background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.17), rgba(34,53,94,.62));
            box-shadow: inset 0 0 0 5px rgba(255,255,255,.025), 0 0 28px rgba(83,132,255,.15);
          }

          .brand-copy {
            display: grid;
            gap: 3px;
          }

          .brand-copy strong {
            font-size: 16px;
            letter-spacing: .04em;
          }

          .brand-copy small {
            color: #9aa7bd;
            font-size: 12px;
          }

          .topnav {
            display: flex;
            align-items: center;
            gap: 24px;
          }

          .topnav a {
            color: #aeb9cc;
            font-size: 14px;
            text-decoration: none;
            transition: color .2s ease;
          }

          .topnav a:hover {
            color: #ffffff;
          }

          .hero {
            position: relative;
            z-index: 2;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: min(980px, calc(100% - 40px));
            margin: 0 auto;
            padding: 110px 0 90px;
            text-align: center;
          }

          .seal-wrap {
            position: relative;
            width: 146px;
            height: 146px;
            margin-bottom: 30px;
          }

          .seal-wrap::before,
          .seal-wrap::after {
            content: "";
            position: absolute;
            inset: -22px;
            border: 1px solid rgba(120, 165, 255, 0.16);
            border-radius: 50%;
            animation: orbit 14s linear infinite;
          }

          .seal-wrap::after {
            inset: -38px;
            border-style: dashed;
            animation-duration: 24s;
            animation-direction: reverse;
          }

          .seal {
            position: absolute;
            inset: 0;
            display: grid;
            place-items: center;
            border: 1px solid rgba(172, 201, 255, 0.5);
            border-radius: 50%;
            background:
              radial-gradient(circle at 34% 28%, rgba(255,255,255,.18), transparent 26%),
              linear-gradient(145deg, rgba(55,79,130,.95), rgba(14,22,40,.98));
            box-shadow:
              inset 0 0 0 8px rgba(255,255,255,.025),
              inset 0 0 40px rgba(72,116,255,.18),
              0 0 55px rgba(75,124,255,.18);
          }

          .seal-ring {
            display: grid;
            place-items: center;
            width: 112px;
            height: 112px;
            border: 1px solid rgba(255,255,255,.18);
            border-radius: 50%;
          }

          .seal-ring span {
            font-size: 29px;
            font-weight: 850;
            letter-spacing: -.04em;
          }

          .seal-ring small {
            margin-top: -23px;
            color: #aebee0;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .34em;
          }

          .eyebrow {
            margin: 0 0 14px;
            color: #8faefc;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: .18em;
            text-transform: uppercase;
          }

          .hero h1 {
            max-width: 860px;
            margin: 0;
            font-size: clamp(48px, 7vw, 86px);
            line-height: .98;
            letter-spacing: -.055em;
          }

          .hero h1 span {
            display: block;
            color: #9eb7ef;
          }

          .hero-copy {
            max-width: 780px;
            margin: 30px auto 0;
            color: #b7c1d2;
            font-size: clamp(17px, 2vw, 21px);
            line-height: 1.75;
          }

          .hero-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 14px;
            margin-top: 34px;
          }

          .button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 50px;
            padding: 0 22px;
            border-radius: 999px;
            font-size: 14px;
            font-weight: 750;
            text-decoration: none;
            transition: transform .2s ease, border-color .2s ease, background .2s ease;
          }

          .button:hover {
            transform: translateY(-2px);
          }

          .button-primary {
            color: #07101f;
            background: linear-gradient(135deg, #f9fbff, #abc6ff);
            box-shadow: 0 12px 36px rgba(93,139,255,.23);
          }

          .button-secondary {
            color: #e8eefc;
            border: 1px solid rgba(159,188,255,.28);
            background: rgba(255,255,255,.035);
          }

          .boundary-card {
            max-width: 760px;
            margin-top: 52px;
            padding: 20px 24px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 20px;
            background: rgba(9,14,26,.62);
            backdrop-filter: blur(18px);
            text-align: left;
          }

          .boundary-card strong {
            display: block;
            margin-bottom: 7px;
            color: #f0f4ff;
            font-size: 13px;
            letter-spacing: .08em;
            text-transform: uppercase;
          }

          .boundary-card p {
            margin: 0;
            color: #9faabd;
            line-height: 1.65;
          }

          .section-shell {
            position: relative;
            z-index: 2;
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto;
            padding: 84px 0;
          }

          .section-heading {
            max-width: 760px;
            margin-bottom: 36px;
          }

          .section-heading.centered {
            margin-right: auto;
            margin-left: auto;
            text-align: center;
          }

          .section-heading h2,
          .orientation h2,
          .footer-main h2 {
            margin: 0;
            font-size: clamp(34px, 5vw, 58px);
            line-height: 1.03;
            letter-spacing: -.045em;
          }

          .section-heading > p:last-child,
          .orientation > div > p:last-child {
            color: #aeb8ca;
            line-height: 1.75;
          }

          .principle-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
          }

          .principle-card,
          .ecosystem-card {
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255,255,255,.08);
            background: linear-gradient(180deg, rgba(17,24,42,.78), rgba(8,12,22,.82));
            box-shadow: inset 0 1px 0 rgba(255,255,255,.03);
          }

          .principle-card {
            min-height: 330px;
            padding: 34px;
            border-radius: 28px;
          }

          .principle-card::after,
          .ecosystem-card::after {
            content: "";
            position: absolute;
            width: 180px;
            height: 180px;
            right: -90px;
            bottom: -90px;
            border-radius: 50%;
            background: rgba(73,117,255,.11);
            filter: blur(6px);
          }

          .principle-card > span {
            color: #86a6f4;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: .14em;
            text-transform: uppercase;
          }

          blockquote {
            margin: 36px 0 28px;
            font-size: clamp(29px, 4vw, 46px);
            font-weight: 780;
            line-height: 1.04;
            letter-spacing: -.04em;
          }

          .principle-card p {
            max-width: 520px;
            margin: 0;
            color: #a8b2c5;
            line-height: 1.7;
          }

          .chain-section {
            padding-top: 62px;
          }

          .chain {
            display: grid;
            grid-template-columns: repeat(8, minmax(0, 1fr));
            gap: 10px;
            margin-top: 42px;
          }

          .chain-item {
            position: relative;
            display: grid;
            align-content: center;
            min-height: 138px;
            padding: 18px 16px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 18px;
            background: rgba(12,18,32,.72);
          }

          .chain-index {
            color: #6f85b6;
            font-size: 11px;
            font-weight: 800;
          }

          .chain-item strong {
            margin-top: 10px;
            font-size: 15px;
          }

          .chain-arrow {
            position: absolute;
            top: 50%;
            right: -12px;
            z-index: 3;
            color: #6e8edf;
            transform: translateY(-50%);
          }

          .ecosystem-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }

          .ecosystem-card {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 260px;
            padding: 28px;
            border-radius: 24px;
          }

          .ecosystem-dot {
            display: block;
            width: 10px;
            height: 10px;
            margin-bottom: 28px;
            border-radius: 50%;
            background: #9cb9ff;
            box-shadow: 0 0 22px rgba(111,153,255,.8);
          }

          .ecosystem-card h3 {
            margin: 0 0 12px;
            font-size: 23px;
            letter-spacing: -.025em;
          }

          .ecosystem-card p {
            margin: 0;
            color: #9faabd;
            line-height: 1.65;
          }

          .ecosystem-card a {
            position: relative;
            z-index: 2;
            margin-top: 28px;
            color: #b7cbff;
            font-size: 14px;
            font-weight: 750;
            text-decoration: none;
          }

          .orientation {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 42px;
            margin-bottom: 72px;
            padding: 52px;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 32px;
            background:
              linear-gradient(135deg, rgba(54,82,144,.16), transparent 42%),
              rgba(11,16,29,.82);
          }

          .orientation > div {
            max-width: 760px;
          }

          .institutional-footer {
            position: relative;
            z-index: 2;
            display: grid;
            grid-template-columns: 190px 1fr;
            gap: 52px;
            width: min(1180px, calc(100% - 40px));
            margin: 0 auto 40px;
            padding: 58px;
            border: 1px solid rgba(177,200,255,.14);
            border-radius: 34px;
            background:
              radial-gradient(circle at 12% 22%, rgba(76,117,224,.13), transparent 31%),
              linear-gradient(180deg, rgba(13,19,34,.96), rgba(7,10,18,.98));
            box-shadow: 0 30px 100px rgba(0,0,0,.28);
          }

          .footer-seal {
            display: grid;
            place-items: center;
            align-self: start;
            width: 160px;
            height: 160px;
            border: 1px solid rgba(171,197,255,.38);
            border-radius: 50%;
            background: radial-gradient(circle, rgba(73,112,199,.22), rgba(7,12,23,.9));
            box-shadow: inset 0 0 0 9px rgba(255,255,255,.025);
          }

          .footer-seal span {
            font-size: 31px;
            font-weight: 850;
            letter-spacing: -.045em;
          }

          .footer-seal small {
            margin-top: -48px;
            color: #90a7da;
            font-size: 9px;
            font-weight: 800;
            letter-spacing: .32em;
          }

          .footer-main h2 {
            font-size: clamp(32px, 4vw, 52px);
          }

          .steward-line {
            margin: 13px 0 34px;
            color: #aab5c8;
            font-size: 17px;
          }

          .contact-grid {
            display: grid;
            grid-template-columns: 1.2fr .8fr 1.25fr;
            gap: 30px;
            padding: 28px 0;
            border-top: 1px solid rgba(255,255,255,.08);
            border-bottom: 1px solid rgba(255,255,255,.08);
          }

          .contact-grid address,
          .contact-grid > div {
            display: grid;
            align-content: start;
            gap: 6px;
            font-style: normal;
          }

          .contact-grid strong {
            margin-bottom: 4px;
            color: #eef3ff;
            font-size: 12px;
            letter-spacing: .1em;
            text-transform: uppercase;
          }

          .contact-grid span,
          .contact-grid a {
            color: #a8b3c7;
            line-height: 1.5;
            text-decoration: none;
            overflow-wrap: anywhere;
          }

          .contact-grid a:hover {
            color: #dce7ff;
          }

          .footer-principles {
            display: flex;
            flex-wrap: wrap;
            gap: 18px;
            margin-top: 28px;
            color: #8fa7dc;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: .09em;
            text-transform: uppercase;
          }

          .footer-motto {
            margin: 20px 0 0;
            color: #f1f5ff;
            font-size: clamp(20px, 3vw, 29px);
            font-weight: 780;
            letter-spacing: -.025em;
          }

          @keyframes orbit {
            to { transform: rotate(360deg); }
          }

          @keyframes twinkle {
            0%, 100% { opacity: .18; transform: scale(.8); }
            50% { opacity: .85; transform: scale(1.35); }
          }

          @keyframes driftOne {
            to { transform: translate(80px, 110px); }
          }

          @keyframes driftTwo {
            to { transform: translate(-90px, -70px); }
          }

          @media (max-width: 980px) {
            .topnav {
              display: none;
            }

            .chain {
              grid-template-columns: repeat(4, minmax(0, 1fr));
            }

            .chain-arrow {
              display: none;
            }

            .ecosystem-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .institutional-footer {
              grid-template-columns: 1fr;
            }

            .footer-seal {
              width: 132px;
              height: 132px;
            }

            .contact-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 720px) {
            .topbar {
              width: min(100% - 28px, 1180px);
            }

            .hero,
            .section-shell,
            .institutional-footer {
              width: min(100% - 28px, 1180px);
            }

            .hero {
              padding-top: 82px;
            }

            .hero h1 {
              font-size: clamp(44px, 13vw, 64px);
            }

            .principle-grid,
            .ecosystem-grid {
              grid-template-columns: 1fr;
            }

            .chain {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .orientation {
              align-items: stretch;
              flex-direction: column;
              padding: 32px;
            }

            .institutional-footer {
              padding: 34px 26px;
            }

            .footer-principles {
              display: grid;
              gap: 8px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              scroll-behavior: auto !important;
              animation-duration: .01ms !important;
              animation-iteration-count: 1 !important;
            }
          }
        `,
        }}
      />
    </main>
  );
}
