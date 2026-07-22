"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

const foundationDomains = [
  {
    code: "01",
    title: "Foundational Architectural Registry",
    text: "The canonical public record for TA-14 architecture, chronology, stewardship, claims, boundaries, standards, publications, repositories, and implementations.",
    href: "/workspace/ai-governance/registry",
  },
  {
    code: "02",
    title: "Architecture Family",
    text: "The connected architectural systems governing admissibility, evidence, records, continuity, binding, commitment, execution, and outcomes.",
    href: "/architecture",
  },
  {
    code: "03",
    title: "Standards Family",
    text: "The named standards, methods, chains, thresholds, classifications, and implementation disciplines associated with TA-14.",
    href: "/workspace/ai-governance/registry#standards",
  },
  {
    code: "04",
    title: "Public Chronology",
    text: "A preserved timeline of declarations, publications, releases, architecture records, reference implementations, and institutional development.",
    href: "/workspace/ai-governance/registry#timeline",
  },
  {
    code: "05",
    title: "Books and Articles",
    text: "Public works that document the development, explanation, scope, and application of the TA-14 architecture.",
    href: "/workspace/ai-governance/registry#publications",
  },
  {
    code: "06",
    title: "Zenodo and Public Records",
    text: "Dated public deposits and research records supporting attribution, chronology, and inspectable provenance.",
    href: "/workspace/ai-governance/registry#publications",
  },
  {
    code: "07",
    title: "GitHub Repositories",
    text: "Public code, platform implementations, demonstrations, and technical artifacts connected to the Foundation.",
    href: "/workspace/ai-governance/registry#implementations",
  },
  {
    code: "08",
    title: "Reference Implementations",
    text: "Operational examples showing how the architecture is translated into governed records, routes, verification, and execution controls.",
    href: "/workspace/ai-governance/registry#implementations",
  },
  {
    code: "09",
    title: "TA-14 AI Governance Exchange",
    text: "The public platform where governance routes can be built, tested, preserved, reviewed, and verified.",
    href: "/workspace",
  },
  {
    code: "10",
    title: "AI Governance Registry",
    text: "The public registration system for dated, attributable, searchable governance architecture records.",
    href: "/registry",
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
    <main className="page">
      <div className="cosmos" aria-hidden="true">
        <div className="stars starsOne" />
        <div className="stars starsTwo" />
        <div className="glow glowBlue" />
        <div className="glow glowGold" />
        <div className="route routeOne" />
        <div className="route routeTwo" />
      </div>

      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>TA-14 Foundation</strong>
            <small>Architecture • Standards • Public Record</small>
          </span>
        </Link>

        <nav aria-label="Foundation navigation">
          <a href="#foundation-record">Foundation Record</a>
          <a href="#foundation-map">Foundation Map</a>
          <a href="#boundary">Boundary</a>
          <Link href="/registry">Registry</Link>
        </nav>

        <Link className="topAction" href="/workspace">
          Open Exchange
        </Link>
      </header>

      <section className="hero shell">
        <div className="seal" aria-hidden="true">
          <span>TA-14</span>
          <strong>FOUNDATION</strong>
          <i />
          <i />
          <i />
        </div>

        <p className="eyebrow">THE PARENT PUBLIC RECORD</p>

        <h1>
          The architecture should have a home
          <em> before it has an implementation.</em>
        </h1>

        <p className="heroLead">
          The TA-14 Foundation is the public institutional record connecting
          the architecture family, standards family, chronology, books,
          articles, Zenodo records, GitHub repositories, reference
          implementations, the TA-14 AI Governance Exchange, and the AI
          Governance Registry.
        </p>

        <div className="heroActions">
          <a className="button gold" href="#foundation-map">
            Explore the Foundation <span>↓</span>
          </a>
          <Link className="button primary" href="/workspace/ai-governance/registry">
            Open the Architectural Registry <span>↗</span>
          </Link>
          <Link className="button glass" href="/registry">
            Open the AI Governance Registry <span>↗</span>
          </Link>
        </div>
      </section>

      <section id="foundation-record" className="recordSection shell">
        <div className="recordCopy">
          <span className="status">FOUNDATIONAL PUBLIC RECORD ACTIVE</span>
          <p className="eyebrow">FOUNDATION IDENTITY</p>
          <h2>TA-14 Foundation</h2>
          <p>
            The Foundation preserves the identity, provenance, chronology,
            relationships, publications, implementations, and institutional
            lineage of the TA-14 architecture. It exists so the architecture
            can be inspected as a connected public record rather than
            encountered only through isolated pages, claims, or products.
          </p>

          <div className="identityGrid">
            <div>
              <small>Foundation identifier</small>
              <strong>TA-14-FOUNDATION-000001</strong>
            </div>
            <div>
              <small>Record type</small>
              <strong>Foundational Architectural Record</strong>
            </div>
            <div>
              <small>Visibility</small>
              <strong>Public</strong>
            </div>
            <div>
              <small>Status</small>
              <strong>Active</strong>
            </div>
          </div>
        </div>

        <div className="chainPanel">
          <p className="eyebrow">THE TA-14 GOVERNING CHAIN</p>
          <div className="chain">
            {chain.map((item, index) => (
              <div key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item}</strong>
                {index < chain.length - 1 && <i>→</i>}
              </div>
            ))}
          </div>
          <p>
            Each link remains distinguishable so evidence, authority,
            determination, execution, and outcome cannot silently collapse into
            one another.
          </p>
        </div>
      </section>

      <section id="foundation-map" className="mapSection shell">
        <div className="sectionHeading">
          <p className="eyebrow">FOUNDATION MAP</p>
          <h2>Every major TA-14 public record in one institutional entrance.</h2>
          <p>
            These are not interchangeable pages. Each preserves a different
            part of the Foundation and links back to the larger architectural
            record.
          </p>
        </div>

        <div className="foundationGrid">
          {foundationDomains.map((item, index) => (
            <Link
              href={item.href}
              className="foundationCard"
              key={item.title}
              style={{ "--delay": `${index * 0.04}s` } as CSSProperties}
            >
              <span>{item.code}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div>
                Open record <b>→</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="boundary" className="boundarySection shell">
        <div>
          <p className="eyebrow">FOUNDATION BOUNDARY</p>
          <h2>A public foundation is not a certification authority.</h2>
          <p>
            The TA-14 Foundation documents architecture, identity, provenance,
            chronology, relationships, publications, implementations, claims,
            and declared boundaries. It does not automatically provide legal
            priority, regulatory approval, accreditation, certification,
            independent validation, or proof that any implementation performs
            as claimed.
          </p>
        </div>

        <div className="boundaryGrid">
          <article>
            <strong>The Foundation preserves</strong>
            <p>
              Architecture, chronology, stewardship, public evidence,
              publications, repositories, versions, relationships, and
              declared scope.
            </p>
          </article>
          <article>
            <strong>The Registry preserves</strong>
            <p>
              Individual dated and attributable governance records, including
              claims, non-claims, evidence, status, and version history.
            </p>
          </article>
          <article>
            <strong>Verification must still establish</strong>
            <p>
              Whether a specific implementation, route, execution, or outcome
              remains supported by admissible evidence.
            </p>
          </article>
        </div>
      </section>

      <section className="closing shell">
        <p className="eyebrow">TA-14 FOUNDATION</p>
        <h2>Start with the public record. Then inspect the architecture.</h2>
        <div className="heroActions">
          <Link className="button gold" href="/workspace/ai-governance/registry">
            Open Architectural Registry <span>↗</span>
          </Link>
          <Link className="button primary" href="/workspace">
            Enter the Exchange <span>↗</span>
          </Link>
        </div>
        <strong>No admissible evidence. No admissible execution.</strong>
      </section>

      <footer className="shell">
        <span>TA-14 Foundation</span>
        <span>Architecture • Standards • Chronology • Public Record</span>
      </footer>

      <style jsx global>{`
        :root {
          color-scheme: dark;
          --bg: #020711;
          --text: #f5f9ff;
          --muted: #a9bac6;
          --blue: #72dff0;
          --gold: #f1c36d;
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: var(--bg);
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(circle at 50% 0%, rgba(31, 104, 164, 0.2), transparent 34%),
            linear-gradient(180deg, #020711, #07121e 55%, #020711);
        }

        .shell {
          width: min(1320px, calc(100% - 40px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .cosmos {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -2;
        }

        .stars {
          position: absolute;
          inset: -15%;
        }

        .starsOne {
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8) 0 1px,
            transparent 1.4px
          );
          background-size: 96px 96px;
          animation: drift 50s linear infinite;
        }

        .starsTwo {
          background-image: radial-gradient(
            circle,
            rgba(102, 214, 241, 0.72) 0 1px,
            transparent 1.5px
          );
          background-size: 161px 161px;
          animation: drift 68s linear infinite reverse;
        }

        .glow {
          position: absolute;
          width: 680px;
          height: 680px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.15;
        }

        .glowBlue {
          left: -300px;
          top: 12%;
          background: #087ed2;
        }

        .glowGold {
          right: -340px;
          top: 40%;
          background: #c78220;
        }

        .route {
          position: absolute;
          width: 85vw;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(111, 218, 239, 0.5),
            rgba(242, 191, 109, 0.45),
            transparent
          );
        }

        .routeOne {
          top: 28%;
          left: -20%;
          transform: rotate(-8deg);
          animation: routeMove 18s linear infinite;
        }

        .routeTwo {
          top: 70%;
          right: -25%;
          transform: rotate(10deg);
          animation: routeMove 24s linear infinite reverse;
        }

        .topbar {
          width: min(1480px, calc(100% - 36px));
          min-height: 76px;
          margin: 18px auto 0;
          padding: 12px 14px 12px 18px;
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border: 1px solid rgba(123, 208, 232, 0.18);
          border-radius: 20px;
          background: rgba(2, 10, 19, 0.74);
          backdrop-filter: blur(18px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .brandMark {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(242, 191, 109, 0.44);
          color: var(--gold);
          background: rgba(117, 72, 13, 0.18);
          font-size: 12px;
          font-weight: 950;
        }

        .brand > span:last-child {
          display: grid;
          gap: 3px;
        }

        .brand strong {
          font-family: Georgia, serif;
          font-size: 17px;
        }

        .brand small {
          color: #8fa7b7;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .topbar nav {
          display: flex;
          gap: 7px;
        }

        .topbar nav a {
          padding: 10px 12px;
          border-radius: 11px;
          color: #b6c8d4;
          font-size: 11px;
          font-weight: 850;
        }

        .topbar nav a:hover {
          color: white;
          background: rgba(109, 216, 255, 0.08);
        }

        .topAction {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          padding: 0 17px;
          border-radius: 13px;
          border: 1px solid rgba(137, 205, 255, 0.27);
          background: linear-gradient(
            180deg,
            rgba(34, 79, 112, 0.76),
            rgba(8, 27, 43, 0.88)
          );
          font-size: 11px;
          font-weight: 900;
        }

        .hero {
          padding: 100px 0 105px;
          text-align: center;
        }

        .seal {
          width: 190px;
          height: 190px;
          margin: 0 auto 30px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid rgba(242, 191, 109, 0.56);
          background: radial-gradient(
            circle,
            rgba(83, 200, 224, 0.18),
            rgba(6, 21, 34, 0.95) 62%
          );
          box-shadow:
            0 0 70px rgba(74, 195, 225, 0.18),
            inset 0 0 35px rgba(255, 192, 66, 0.08);
        }

        .seal span {
          color: var(--blue);
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.2em;
        }

        .seal strong {
          margin-top: 8px;
          color: #ffe3a2;
          font-family: Georgia, serif;
          font-size: 23px;
          letter-spacing: 0.05em;
        }

        .seal i {
          position: absolute;
          inset: 15px;
          border-radius: 50%;
          border: 1px solid rgba(111, 218, 239, 0.24);
          animation: spin 15s linear infinite;
        }

        .seal i:nth-of-type(2) {
          inset: 32px;
          border-color: rgba(242, 191, 109, 0.25);
          animation-direction: reverse;
          animation-duration: 11s;
        }

        .seal i:nth-of-type(3) {
          inset: -22px;
          border-color: rgba(197, 126, 255, 0.18);
          animation-duration: 22s;
        }

        .eyebrow {
          margin: 0;
          color: var(--gold);
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.22em;
        }

        .hero h1,
        .recordCopy h2,
        .sectionHeading h2,
        .boundarySection h2,
        .closing h2 {
          font-family: Georgia, "Times New Roman", serif;
          letter-spacing: -0.048em;
          text-wrap: balance;
        }

        .hero h1 {
          max-width: 1120px;
          margin: 18px auto 22px;
          font-size: clamp(52px, 7.2vw, 100px);
          line-height: 0.95;
          font-weight: 500;
        }

        .hero h1 em {
          color: #ffc95c;
          font-style: italic;
        }

        .heroLead {
          max-width: 960px;
          margin: 0 auto;
          color: #c0d0da;
          font-size: 18px;
          line-height: 1.75;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 32px;
        }

        .button {
          min-height: 52px;
          padding: 0 21px;
          display: inline-flex;
          align-items: center;
          gap: 13px;
          border-radius: 14px;
          border: 1px solid transparent;
          font-size: 12px;
          font-weight: 950;
          transition: transform 0.22s ease;
        }

        .button:hover {
          transform: translateY(-3px);
        }

        .button.primary {
          color: #031019;
          border-color: #a8effa;
          background: linear-gradient(135deg, #c7f5ff, #68d2ec 62%, #339fc1);
        }

        .button.gold {
          color: #281600;
          border-color: #f6d487;
          background: linear-gradient(135deg, #fff0b0, #efbd58 62%, #b66e12);
        }

        .button.glass {
          color: #e8f8ff;
          border-color: rgba(124, 215, 236, 0.28);
          background: linear-gradient(
            180deg,
            rgba(18, 49, 68, 0.9),
            rgba(7, 24, 38, 0.92)
          );
        }

        .recordSection {
          display: grid;
          grid-template-columns: 1.08fr 0.92fr;
          gap: 24px;
          padding: 90px 0;
        }

        .recordCopy,
        .chainPanel {
          padding: 38px;
          border-radius: 28px;
          border: 1px solid rgba(112, 210, 234, 0.17);
          background: linear-gradient(
            145deg,
            rgba(12, 35, 51, 0.92),
            rgba(5, 16, 28, 0.97)
          );
        }

        .status {
          display: inline-flex;
          min-height: 31px;
          align-items: center;
          padding: 0 11px;
          margin-bottom: 24px;
          border-radius: 999px;
          border: 1px solid rgba(242, 191, 109, 0.3);
          color: #ffdf9c;
          background: rgba(104, 62, 10, 0.16);
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .recordCopy h2,
        .sectionHeading h2,
        .boundarySection h2,
        .closing h2 {
          margin: 12px 0 16px;
          font-size: clamp(40px, 5vw, 68px);
          line-height: 1;
          font-weight: 500;
        }

        .recordCopy > p:last-of-type,
        .sectionHeading > p:last-child,
        .boundarySection > div:first-child > p:last-child {
          color: var(--muted);
          line-height: 1.75;
        }

        .identityGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 28px;
        }

        .identityGrid div {
          padding: 15px;
          border-radius: 14px;
          border: 1px solid rgba(109, 216, 255, 0.14);
          background: rgba(4, 20, 33, 0.72);
        }

        .identityGrid small {
          display: block;
          color: #8099aa;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .identityGrid strong {
          display: block;
          margin-top: 7px;
          font-family: Georgia, serif;
          font-size: 16px;
        }

        .chain {
          display: grid;
          gap: 9px;
          margin-top: 24px;
        }

        .chain > div {
          min-height: 48px;
          display: grid;
          grid-template-columns: 42px 1fr 24px;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid rgba(242, 191, 109, 0.16);
          background: rgba(71, 45, 9, 0.11);
        }

        .chain span {
          color: var(--blue);
          font-size: 9px;
          font-weight: 950;
        }

        .chain strong {
          font-family: Georgia, serif;
          font-size: 16px;
        }

        .chain i {
          color: var(--gold);
          font-style: normal;
        }

        .chainPanel > p:last-child {
          color: #9fb0bb;
          font-size: 12px;
          line-height: 1.65;
        }

        .mapSection {
          padding: 100px 0;
        }

        .sectionHeading {
          max-width: 950px;
        }

        .foundationGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 40px;
        }

        .foundationCard {
          min-height: 255px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          border-radius: 22px;
          border: 1px solid rgba(109, 216, 255, 0.16);
          background:
            radial-gradient(circle at 100% 0%, rgba(109, 216, 255, 0.08), transparent 38%),
            linear-gradient(155deg, rgba(12, 35, 54, 0.92), rgba(4, 15, 26, 0.97));
          transition:
            transform 0.24s ease,
            border-color 0.24s ease;
          animation: rise 0.6s ease both;
          animation-delay: var(--delay);
        }

        .foundationCard:hover {
          transform: translateY(-6px);
          border-color: rgba(242, 191, 109, 0.44);
        }

        .foundationCard > span {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          border: 1px solid rgba(109, 216, 255, 0.28);
          color: var(--blue);
          font-size: 9px;
          font-weight: 950;
        }

        .foundationCard h3 {
          margin: 24px 0 10px;
          font-family: Georgia, serif;
          font-size: 28px;
          font-weight: 500;
        }

        .foundationCard p {
          margin: 0;
          color: #9fb1bc;
          font-size: 13px;
          line-height: 1.68;
        }

        .foundationCard div {
          display: flex;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 24px;
          color: #ddf4ff;
          font-size: 11px;
          font-weight: 900;
        }

        .boundarySection {
          padding: 70px 42px;
          border-radius: 30px;
          border: 1px solid rgba(242, 191, 109, 0.22);
          background:
            radial-gradient(circle at 0 0, rgba(183, 112, 26, 0.14), transparent 35%),
            linear-gradient(145deg, rgba(11, 28, 43, 0.95), rgba(4, 13, 23, 0.98));
        }

        .boundarySection > div:first-child {
          max-width: 930px;
        }

        .boundaryGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 34px;
        }

        .boundaryGrid article {
          padding: 22px;
          border-radius: 17px;
          border: 1px solid rgba(109, 216, 255, 0.14);
          background: rgba(5, 20, 33, 0.73);
        }

        .boundaryGrid strong {
          font-family: Georgia, serif;
          font-size: 20px;
        }

        .boundaryGrid p {
          color: #9fb0bc;
          font-size: 12px;
          line-height: 1.65;
        }

        .closing {
          margin-top: 110px;
          padding: 78px 32px;
          text-align: center;
          border-radius: 30px;
          border: 1px solid rgba(242, 191, 109, 0.22);
          background:
            radial-gradient(circle at 50% 0%, rgba(242, 191, 109, 0.12), transparent 40%),
            linear-gradient(145deg, rgba(24, 25, 29, 0.94), rgba(5, 15, 25, 0.98));
        }

        .closing > strong {
          display: block;
          margin-top: 30px;
          color: #f4dfa7;
          font-family: Georgia, serif;
        }

        footer {
          min-height: 100px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #768c9b;
          font-size: 11px;
        }

        @keyframes drift {
          to {
            transform: translate3d(120px, 90px, 0);
          }
        }

        @keyframes routeMove {
          from {
            translate: -30vw 0;
            opacity: 0;
          }
          20% {
            opacity: 0.5;
          }
          80% {
            opacity: 0.35;
          }
          to {
            translate: 120vw 0;
            opacity: 0;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1050px) {
          .topbar nav {
            display: none;
          }

          .recordSection {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 760px) {
          .shell {
            width: min(100% - 24px, 1320px);
          }

          .topbar {
            width: min(100% - 22px, 1480px);
          }

          .brand small,
          .topAction {
            display: none;
          }

          .hero {
            padding: 76px 0 82px;
          }

          .heroLead {
            font-size: 16px;
          }

          .heroActions .button {
            width: 100%;
            justify-content: center;
          }

          .recordCopy,
          .chainPanel,
          .boundarySection {
            padding: 28px 20px;
          }

          .foundationGrid,
          .identityGrid,
          .boundaryGrid {
            grid-template-columns: 1fr;
          }

          footer {
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            gap: 6px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
}
