import Link from "next/link";

import {
  TA14_24_LINKS,
  TA14_CHAIN_OF_EIGHT,
} from "@/lib/academy/ta14-24-link-canon";

export const metadata = {
  title: "24-Link Academy | TA-14 Academy",
  description:
    "Learn, test, map, replay, and apply the full TA-14 24-Link Admissible Execution Architecture.",
};

const labs = [
  {
    href: "/academy/24-link-architecture",
    title: "24-Link Explorer",
    eyebrow: "Learn",
    code: "01",
    body: "Enter the canonical architecture and study every link in sequence.",
    signal: "Canonical doctrine",
  },
  {
    href: "/academy/24-link-architecture/route-state",
    title: "Route State Lab",
    eyebrow: "Locate",
    code: "02",
    body: "Identify current state, last admissible state, first broken link, recovery, and forming consequence.",
    signal: "State diagnosis",
  },
  {
    href: "/academy/24-link-architecture/simulator",
    title: "Chain Failure Simulator",
    eyebrow: "Pressure",
    code: "03",
    body: "Diagnose evidence decay, authority drift, runtime change, refusal, outcome divergence, and memory conflict.",
    signal: "Pressure testing",
  },
  {
    href: "/academy/24-link-architecture/passport",
    title: "Chain Passport",
    eyebrow: "Master",
    code: "04",
    body: "Progress from recognition through evidence mapping, diagnosis, application, replay, and mastery.",
    signal: "Competency pathway",
  },
  {
    href: "/academy/24-link-architecture/build-a-chain",
    title: "Build-a-Chain Lab",
    eyebrow: "Apply",
    code: "05",
    body: "Map a real system or architecture against all 24 links and its actual evidence.",
    signal: "Applied architecture",
  },
  {
    href: "/academy/24-link-architecture/health",
    title: "Architecture Health Overlay",
    eyebrow: "Evaluate",
    code: "06",
    body: "Project bounded evidence states across the full chain without collapsing them into a single score.",
    signal: "Evidence health",
  },
  {
    href: "/academy/24-link-architecture/views",
    title: "Architecture Navigator",
    eyebrow: "Navigate",
    code: "07",
    body: "Switch among chain, dependency, evidence, failure, Academy, and chronology views.",
    signal: "Multi-view navigation",
  },
  {
    href: "/academy/24-link-architecture/recursion",
    title: "Recursion Lab",
    eyebrow: "Continue",
    code: "08",
    body: "Govern Outcome Reality through Future Chain so execution never becomes the end of the architecture.",
    signal: "Recursive governance",
  },
] as const;

export default function TA1424LinkAcademyHubPage() {
  return (
    <main className="hub">
      <style>{`
        .hub {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .86);
          --panel-2: rgba(10, 26, 40, .76);
          --line: rgba(129, 176, 210, .14);
          --line-strong: rgba(84, 232, 255, .26);
          --cyan: #54e8ff;
          --cyan-soft: #c4f8ff;
          --green: #45eaa6;
          --green-soft: #c9f7df;
          --amber: #f1c769;
          --amber-soft: #ffe8a7;
          --indigo: #a8b2ff;
          --rose: #ff94aa;
          --text: #eff8ff;
          --muted: #93a8ba;
          --dim: #647b8f;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 9% 0%, rgba(84,232,255,.11), transparent 24%),
            radial-gradient(circle at 91% 5%, rgba(168,178,255,.10), transparent 26%),
            linear-gradient(180deg, #020711 0%, #030a13 55%, #020711 100%);
        }

        .hub * { box-sizing: border-box; }

        .hub-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .hub-hero {
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .hub-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: linear-gradient(to bottom, #000, transparent 90%);
          opacity: .38;
        }

        .hub-topline {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding-top: 20px;
        }

        .hub-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 34px;
          padding: 0 12px;
          border: 1px solid rgba(84,232,255,.18);
          border-radius: 999px;
          background: rgba(84,232,255,.045);
          color: var(--cyan-soft);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .hub-back {
          color: var(--cyan-soft);
          font-size: .72rem;
          font-weight: 900;
          text-decoration: none;
        }

        .hub-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(430px, .92fr);
          gap: 64px;
          align-items: center;
          padding: 72px 0 84px;
        }

        .hub-kicker {
          color: var(--cyan);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .20em;
          text-transform: uppercase;
        }

        .hub-title {
          max-width: 980px;
          margin: 14px 0 0;
          font-size: clamp(3.2rem, 6vw, 6.4rem);
          line-height: .95;
          letter-spacing: -.06em;
        }

        .hub-title span {
          display: block;
          color: var(--cyan-soft);
        }

        .hub-lead {
          max-width: 900px;
          margin: 26px 0 0;
          color: #c8d8e4;
          font-size: clamp(1rem, 1.35vw, 1.18rem);
          line-height: 1.8;
        }

        .hub-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .hub-primary,
        .hub-secondary {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 16px;
          border-radius: 12px;
          text-decoration: none;
          font-size: .68rem;
          font-weight: 950;
          transition: 160ms ease;
        }

        .hub-primary {
          border: 1px solid rgba(84,232,255,.30);
          background: rgba(84,232,255,.09);
          color: var(--cyan-soft);
        }

        .hub-secondary {
          border: 1px solid var(--line);
          background: rgba(255,255,255,.025);
          color: #dceaf4;
        }

        .hub-primary:hover,
        .hub-secondary:hover {
          transform: translateY(-2px);
        }

        .hub-primary:hover {
          border-color: rgba(84,232,255,.45);
          background: rgba(84,232,255,.13);
        }

        .hub-secondary:hover {
          border-color: rgba(168,178,255,.28);
          background: rgba(168,178,255,.05);
        }

        .hub-orbit {
          position: relative;
          width: min(520px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .hub-ring {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(129,176,210,.10);
          border-radius: 50%;
        }

        .hub-ring.r1 { width: 96%; height: 96%; }
        .hub-ring.r2 { width: 76%; height: 76%; border-color: rgba(84,232,255,.12); }
        .hub-ring.r3 { width: 56%; height: 56%; border-color: rgba(168,178,255,.13); }
        .hub-ring.r4 { width: 36%; height: 36%; border-color: rgba(69,234,166,.12); }

        .hub-axis-h,
        .hub-axis-v {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .hub-axis-h {
          width: 88%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(84,232,255,.15), transparent);
        }

        .hub-axis-v {
          width: 1px;
          height: 88%;
          background: linear-gradient(180deg, transparent, rgba(168,178,255,.14), transparent);
        }

        .hub-core {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 182px;
          height: 182px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(84,232,255,.25);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(84,232,255,.12), transparent 44%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 90px rgba(84,232,255,.10);
          text-align: center;
        }

        .hub-core small {
          display: block;
          color: var(--cyan);
          font-size: .58rem;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .hub-core strong {
          display: block;
          margin-top: 5px;
          font-size: 3.5rem;
          line-height: 1;
          letter-spacing: -.06em;
        }

        .hub-core span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
        }

        .hub-node {
          position: absolute;
          min-width: 118px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 34px rgba(0,0,0,.24);
        }

        .hub-node b {
          display: block;
          color: var(--cyan);
          font-size: .55rem;
          letter-spacing: .12em;
        }

        .hub-node span {
          display: block;
          margin-top: 4px;
          color: #d7e5ef;
          font-size: .66rem;
          font-weight: 850;
        }

        .hub-node.n1 { left: 0; top: 18%; }
        .hub-node.n2 { right: 0; top: 24%; }
        .hub-node.n3 { right: 5%; bottom: 18%; }
        .hub-node.n4 { left: 0; bottom: 18%; }
        .hub-node.n5 { left: 50%; top: 0; transform: translateX(-50%); }

        .hub-metrics {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.76);
        }

        .hub-metric-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }

        .hub-metric {
          min-height: 96px;
          padding: 20px;
          border-right: 1px solid var(--line);
        }

        .hub-metric:last-child { border-right: 0; }

        .hub-metric strong {
          display: block;
          font-size: 2rem;
          line-height: 1;
          letter-spacing: -.04em;
        }

        .hub-metric span {
          display: block;
          margin-top: 8px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .10em;
          text-transform: uppercase;
        }

        .hub-provenance {
          padding: 66px 0 24px;
        }

        .hub-provenance-card {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
          gap: 34px;
          padding: 30px;
          border: 1px solid rgba(241,199,105,.20);
          border-radius: 24px;
          background:
            radial-gradient(circle at 100% 0%, rgba(241,199,105,.08), transparent 40%),
            rgba(241,199,105,.025);
        }

        .hub-provenance-card::after {
          content: "";
          position: absolute;
          inset: auto -100px -140px auto;
          width: 320px;
          height: 320px;
          border: 1px solid rgba(241,199,105,.08);
          border-radius: 50%;
        }

        .hub-provenance-kicker {
          color: var(--amber);
          font-size: .60rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .hub-provenance h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.3vw, 3.4rem);
          line-height: 1.04;
          letter-spacing: -.045em;
        }

        .hub-provenance p {
          margin: 18px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.75;
        }

        .hub-eight {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          align-content: start;
        }

        .hub-eight-item {
          min-height: 92px;
          display: grid;
          align-content: space-between;
          padding: 13px;
          border: 1px solid rgba(241,199,105,.14);
          border-radius: 14px;
          background: rgba(0,0,0,.10);
        }

        .hub-eight-item small {
          color: var(--amber);
          font-size: .50rem;
          font-weight: 950;
          letter-spacing: .10em;
        }

        .hub-eight-item strong {
          font-size: .72rem;
          line-height: 1.35;
        }

        .hub-section {
          padding: 72px 0 90px;
        }

        .hub-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.66);
        }

        .hub-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 28px;
        }

        .hub-eyebrow {
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .hub-h2 {
          margin: 9px 0 0;
          font-size: clamp(2rem, 3.4vw, 3.7rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .hub-section-copy {
          max-width: 620px;
          margin: 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .hub-lab-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .hub-lab {
          min-height: 272px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 15px;
          padding: 19px;
          border: 1px solid var(--line);
          border-radius: 19px;
          background: rgba(255,255,255,.024);
          color: var(--text);
          text-decoration: none;
          transition: 170ms ease;
        }

        .hub-lab::before {
          content: "";
          position: absolute;
          inset: 0 0 auto 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(84,232,255,.50), transparent);
          opacity: 0;
          transition: 170ms ease;
        }

        .hub-lab:hover {
          transform: translateY(-4px);
          border-color: rgba(84,232,255,.26);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.08), transparent 44%),
            rgba(84,232,255,.035);
        }

        .hub-lab:hover::before { opacity: 1; }

        .hub-lab-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .hub-lab-code {
          color: var(--cyan);
          font-size: .57rem;
          font-weight: 950;
          letter-spacing: .12em;
        }

        .hub-lab-index {
          color: rgba(255,255,255,.09);
          font-size: 3rem;
          line-height: .9;
          font-weight: 950;
        }

        .hub-lab-label {
          color: var(--cyan);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .hub-lab h3 {
          margin: 0;
          font-size: 1.2rem;
          line-height: 1.18;
          letter-spacing: -.02em;
        }

        .hub-lab p {
          margin: 0;
          color: var(--muted);
          font-size: .70rem;
          line-height: 1.65;
        }

        .hub-lab-signal {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--line);
          color: var(--green-soft);
          font-size: .57rem;
          font-weight: 900;
        }

        .hub-route-wrap {
          border: 1px solid var(--line);
          border-radius: 24px;
          background: rgba(255,255,255,.022);
          overflow: hidden;
        }

        .hub-route-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          padding: 22px 24px 20px;
          border-bottom: 1px solid var(--line);
          background:
            radial-gradient(circle at 100% 0%, rgba(69,234,166,.06), transparent 42%),
            rgba(255,255,255,.01);
        }

        .hub-route-head strong {
          font-size: .84rem;
        }

        .hub-route-head span {
          color: var(--dim);
          font-size: .60rem;
        }

        .hub-route-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 10px;
          padding: 18px;
        }

        .hub-route-link {
          min-height: 128px;
          display: grid;
          align-content: space-between;
          gap: 14px;
          padding: 14px;
          border: 1px solid var(--line);
          border-radius: 15px;
          background: rgba(0,0,0,.10);
          color: var(--text);
          text-decoration: none;
          transition: 160ms ease;
        }

        .hub-route-link:hover {
          transform: translateY(-2px);
          border-color: rgba(69,234,166,.25);
          background: rgba(69,234,166,.035);
        }

        .hub-route-number {
          color: var(--green);
          font-size: .60rem;
          font-weight: 950;
        }

        .hub-route-name {
          font-size: .72rem;
          font-weight: 850;
          line-height: 1.35;
        }

        .hub-route-track {
          width: 34px;
          height: 1px;
          background: rgba(255,255,255,.10);
          transition: width 160ms ease, background 160ms ease;
        }

        .hub-route-link:hover .hub-route-track {
          width: 100%;
          background: rgba(69,234,166,.30);
        }

        .hub-stage-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .hub-stage {
          min-height: 240px;
          padding: 22px;
          border: 1px solid var(--line);
          border-radius: 19px;
          background: rgba(255,255,255,.024);
        }

        .hub-stage small {
          color: var(--indigo);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .hub-stage h3 {
          margin: 10px 0 0;
          font-size: 1.55rem;
          letter-spacing: -.03em;
        }

        .hub-stage p {
          margin: 13px 0 0;
          color: var(--muted);
          font-size: .72rem;
          line-height: 1.7;
        }

        .hub-stage-rule {
          margin-top: 22px;
          padding-top: 14px;
          border-top: 1px solid var(--line);
          color: #dceaf4;
          font-size: .60rem;
          font-weight: 850;
          line-height: 1.5;
        }

        .hub-close {
          padding: 78px 0 98px;
          text-align: center;
        }

        .hub-close h2 {
          max-width: 900px;
          margin: 10px auto 0;
          font-size: clamp(2.3rem, 4.2vw, 4.6rem);
          line-height: 1;
          letter-spacing: -.05em;
        }

        .hub-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .hub-close-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-top: 26px;
        }

        @media (max-width: 1180px) {
          .hub-hero-grid { grid-template-columns: 1fr; }
          .hub-orbit { max-width: 510px; }
          .hub-lab-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .hub-route-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .hub-provenance-card { grid-template-columns: 1fr; }
        }

        @media (max-width: 820px) {
          .hub-shell { width: min(100% - 28px, 1460px); }
          .hub-topline,
          .hub-section-head,
          .hub-route-head { display: grid; align-items: start; }
          .hub-title { font-size: clamp(2.8rem, 13vw, 4.8rem); }
          .hub-metric-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .hub-metric { border-bottom: 1px solid var(--line); }
          .hub-metric:nth-child(2n) { border-right: 0; }
          .hub-route-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .hub-stage-grid { grid-template-columns: 1fr; }
          .hub-eight { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 560px) {
          .hub-lab-grid,
          .hub-route-grid { grid-template-columns: 1fr; }
          .hub-node { display: none; }
          .hub-actions,
          .hub-close-actions { display: grid; }
        }
      `}</style>

      <section className="hub-hero">
        <div className="hub-shell hub-topline">
          <Link href="/academy" className="hub-back">
            ← Back to Academy
          </Link>

          <span className="hub-badge">
            Flagship Architecture Program
          </span>
        </div>

        <div className="hub-shell hub-hero-grid">
          <div>
            <div className="hub-kicker">
              TA-14 Academy · 24-Link Program
            </div>

            <h1 className="hub-title">
              Learn the 24 links.
              <span>Pressure them. Prove them. Apply them.</span>
            </h1>

            <p className="hub-lead">
              The TA-14 24-Link Academy is an integrated learning and
              application environment for admissible execution. The
              architecture is taught as a governed route with evidence burdens,
              transition conditions, failure states, refusal pathways,
              outcomes, memory, and recursion.
            </p>

            <div className="hub-actions">
              <Link
                href="/academy/24-link-architecture"
                className="hub-primary"
              >
                Enter the 24-Link Explorer →
              </Link>

              <Link
                href="/academy/24-link-architecture/simulator"
                className="hub-secondary"
              >
                Enter the Failure Simulator
              </Link>
            </div>
          </div>

          <div className="hub-orbit" aria-label="TA-14 24-link Academy motif">
            <div className="hub-ring r1" />
            <div className="hub-ring r2" />
            <div className="hub-ring r3" />
            <div className="hub-ring r4" />
            <div className="hub-axis-h" />
            <div className="hub-axis-v" />

            <div className="hub-core">
              <div>
                <small>TA-14 ACADEMY</small>
                <strong>24</strong>
                <span>canonical governed links</span>
              </div>
            </div>

            <div className="hub-node n1">
              <b>LEARN</b>
              <span>Canonical doctrine</span>
            </div>
            <div className="hub-node n2">
              <b>TEST</b>
              <span>Pressure the route</span>
            </div>
            <div className="hub-node n3">
              <b>MAP</b>
              <span>Apply evidence</span>
            </div>
            <div className="hub-node n4">
              <b>PROVE</b>
              <span>Demonstrate mastery</span>
            </div>
            <div className="hub-node n5">
              <b>RECURSE</b>
              <span>Govern future chain</span>
            </div>
          </div>
        </div>
      </section>

      <section className="hub-metrics">
        <div className="hub-shell hub-metric-grid">
          <Metric value="24" label="Canonical links" />
          <Metric value="8" label="Academy experiences" />
          <Metric value="8" label="Original parent anchors" />
          <Metric value="6" label="Pressure scenarios" />
          <Metric value="1" label="Governed architecture route" />
        </div>
      </section>

      <section className="hub-provenance">
        <div className="hub-shell">
          <div className="hub-provenance-card">
            <div>
              <div className="hub-provenance-kicker">
                Provenance preserved
              </div>

              <h2>
                The Chain of Eight was already created and publicly published
                May 1, 2025.
              </h2>

              <p>
                The 24-link architecture represents the subsequent
                deeper-resolution expansion and maturation of that
                already-existing parent route. The Academy must never imply
                that the original eight anchors were developed later.
              </p>
            </div>

            <div className="hub-eight">
              {TA14_CHAIN_OF_EIGHT.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="hub-eight-item"
                >
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hub-section">
        <div className="hub-shell">
          <div className="hub-section-head">
            <div>
              <div className="hub-eyebrow">
                Academy engine
              </div>
              <h2 className="hub-h2">
                Eight ways to work with one canonical architecture.
              </h2>
            </div>

            <p className="hub-section-copy">
              The Academy is not one static lesson. Each experience reveals a
              different governance surface: doctrine, state, pressure,
              mastery, applied mapping, health, navigation, and recursion.
            </p>
          </div>

          <div className="hub-lab-grid">
            {labs.map((lab, index) => (
              <Link
                key={lab.href}
                href={lab.href}
                className="hub-lab"
              >
                <div className="hub-lab-top">
                  <span className="hub-lab-code">
                    {lab.code}
                  </span>
                  <span className="hub-lab-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="hub-lab-label">
                  {lab.eyebrow}
                </div>

                <h3>{lab.title}</h3>
                <p>{lab.body}</p>

                <div className="hub-lab-signal">
                  {lab.signal} · Enter experience →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hub-section alt">
        <div className="hub-shell">
          <div className="hub-section-head">
            <div>
              <div
                className="hub-eyebrow"
                style={{ color: "var(--green)" }}
              >
                Canonical route
              </div>
              <h2 className="hub-h2">
                Twenty-four governed states. One continuous architecture.
              </h2>
            </div>

            <p className="hub-section-copy">
              Enter any link directly, or move sequentially through the
              architecture to study its governing question, evidence burden,
              failure conditions, transition rule, refusal boundary, and
              provenance.
            </p>
          </div>

          <div className="hub-route-wrap">
            <div className="hub-route-head">
              <strong>
                TA-14 Admissible Execution Architecture
              </strong>
              <span>
                Reality through Future Chain · 24 canonical links
              </span>
            </div>

            <div className="hub-route-grid">
              {TA14_24_LINKS.map((item) => (
                <Link
                  key={item.linkId}
                  href={`/academy/24-link-architecture/${String(
                    item.order,
                  ).padStart(2, "0")}-${item.slug}`}
                  className="hub-route-link"
                >
                  <span className="hub-route-number">
                    {String(item.order).padStart(2, "0")}
                  </span>

                  <div>
                    <div className="hub-route-name">
                      {item.canonicalName}
                    </div>
                    <div className="hub-route-track" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hub-section">
        <div className="hub-shell">
          <div className="hub-section-head">
            <div>
              <div
                className="hub-eyebrow"
                style={{ color: "var(--indigo)" }}
              >
                Learning progression
              </div>
              <h2 className="hub-h2">
                Understand. Diagnose. Demonstrate.
              </h2>
            </div>

            <p className="hub-section-copy">
              The Academy moves beyond recognition toward evidence-backed
              capability. Learners must understand the route, diagnose failure,
              and demonstrate the ability to preserve admissibility under
              pressure.
            </p>
          </div>

          <div className="hub-stage-grid">
            <Stage
              code="01"
              title="Learn"
              body="Understand what each link governs, why it exists, what evidence it requires, and what must become true before progression."
              rule="Capability begins with accurate recognition of the architecture and its transition burdens."
            />

            <Stage
              code="02"
              title="Diagnose"
              body="Find the last admissible state, first broken link, failure mode, forming consequence, and correct hold, refusal, narrowing, or escalation response."
              rule="Diagnosis is judged by route preservation, not by forcing execution."
            />

            <Stage
              code="03"
              title="Demonstrate"
              body="Map real evidence, replay routes, complete simulations, and build competency records that can later support governed credentials."
              rule="Demonstration must produce attributable evidence of capability, not seat-time completion."
            />
          </div>
        </div>
      </section>

      <section className="hub-close">
        <div className="hub-shell">
          <div className="hub-eyebrow">
            Enter the architecture
          </div>

          <h2>
            One architecture.
            <br />
            Multiple governed ways to master it.
          </h2>

          <p>
            Start with the Explorer for the canonical route, move into the
            Pressure Lab to test failure handling, then use the applied labs to
            map evidence, diagnose route state, and demonstrate governed
            competence.
          </p>

          <div className="hub-close-actions">
            <Link
              href="/academy/24-link-architecture"
              className="hub-primary"
            >
              Open 24-Link Explorer →
            </Link>

            <Link
              href="/academy/24-link-architecture/passport"
              className="hub-secondary"
            >
              Open Chain Passport
            </Link>

            <Link
              href="/academy/24-link-architecture/provenance"
              className="hub-secondary"
            >
              Trace Provenance
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="hub-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Stage({
  code,
  title,
  body,
  rule,
}: {
  code: string;
  title: string;
  body: string;
  rule: string;
}) {
  return (
    <article className="hub-stage">
      <small>{code} · Capability stage</small>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="hub-stage-rule">{rule}</div>
    </article>
  );
}
