import Link from "next/link";

import {
  TA14_24_LINKS,
  TA14_CHAIN_OF_EIGHT,
} from "@/lib/academy/ta14-24-link-canon";

export const metadata = {
  title: "24-Link Architecture Explorer | TA-14 Academy",
  description:
    "Explore the TA-14 24-Link Admissible Execution Architecture as a governed route from Admissible Reality through Future Chain.",
};

const regions = [
  {
    id: "reality-evidence",
    number: "01",
    title: "Reality & Evidence",
    range: [1, 6] as const,
    signal: "ESTABLISH",
    question:
      "What is real, what was recorded, and what evidence may legitimately support truth?",
    description:
      "Establish the observable state, preserve it as a record, protect continuity, govern the evidence, and determine the strongest bounded truth the evidence can support.",
  },
  {
    id: "reliance-authority",
    number: "02",
    title: "Reliance, Authority & Consequence",
    range: [7, 12] as const,
    signal: "AUTHORIZE",
    question:
      "May the evidence be relied upon, by whom, and with what consequence already beginning to form?",
    description:
      "Determine whether evidence may be relied upon, whether authority exists and is legitimate, and how consequence begins to form, attach, and approach binding.",
  },
  {
    id: "binding-execution",
    number: "03",
    title: "Binding, Commit & Execution",
    range: [13, 19] as const,
    signal: "CONTROL",
    question:
      "Has the route become binding, may it cross commit, and should consequence-bearing execution occur at all?",
    description:
      "Govern binding, commitment, live execution reality, admissible non-occurrence, prevented consequence, and the exact execution boundary.",
  },
  {
    id: "outcome-recursion",
    number: "04",
    title: "Outcome, Recursion & Memory",
    range: [20, 24] as const,
    signal: "RECUR",
    question:
      "What happened, what is true now, what must survive in memory, and what may begin next?",
    description:
      "Observe outcome reality, determine the governed outcome, establish the new reality, preserve memory, and govern entry into a future chain.",
  },
] as const;

const labs = [
  {
    href: "/academy/24-link-architecture/route-state",
    code: "RS",
    title: "Route State Lab",
    text: "Locate current state, last admissible state, first broken link, recovery, and forming consequence.",
  },
  {
    href: "/academy/24-link-architecture/simulator",
    code: "FS",
    title: "Failure Simulator",
    text: "Pressure evidence, authority, continuity, runtime conditions, refusal, outcome, and memory.",
  },
  {
    href: "/academy/24-link-architecture/build-a-chain",
    code: "BC",
    title: "Build-a-Chain",
    text: "Map a real architecture or workflow against all 24 links and its actual evidence.",
  },
  {
    href: "/academy/24-link-architecture/passport",
    code: "CP",
    title: "Chain Passport",
    text: "Progress from recognition through evidence mapping, diagnosis, replay, and mastery.",
  },
  {
    href: "/academy/24-link-architecture/health",
    code: "AH",
    title: "Architecture Health",
    text: "Project bounded evidence states without collapsing them into a single score.",
  },
  {
    href: "/academy/24-link-architecture/views",
    code: "NV",
    title: "Architecture Navigator",
    text: "Switch among chain, dependency, evidence, failure, Academy, and chronology views.",
  },
  {
    href: "/academy/24-link-architecture/recursion",
    code: "RC",
    title: "Recursion Lab",
    text: "Carry Outcome Reality through New Reality, Memory, and Future Chain.",
  },
  {
    href: "/academy/24-link-architecture/provenance",
    code: "PV",
    title: "Provenance Map",
    text: "Trace chronology, publications, artifacts, reviews, and governed sources.",
  },
] as const;

function getRegionLinks(start: number, end: number) {
  return TA14_24_LINKS.filter(
    (item) => item.order >= start && item.order <= end,
  );
}

export default function TA1424LinkExplorerPage() {
  return (
    <main className="ta14x">
      <style>{`
        .ta14x {
          --bg: #020711;
          --panel: rgba(8, 20, 32, .84);
          --panel-2: rgba(10, 26, 40, .78);
          --line: rgba(125, 180, 214, .14);
          --line-strong: rgba(84, 232, 255, .28);
          --cyan: #54e8ff;
          --cyan-soft: #bff7ff;
          --green: #39f2a1;
          --indigo: #9aa8ff;
          --gold: #f2c456;
          --rose: #ff8ba5;
          --text: #eef8ff;
          --muted: #8ca3b7;
          --dim: #61788c;
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--text);
          background:
            radial-gradient(circle at 8% 0%, rgba(84,232,255,.10), transparent 24%),
            radial-gradient(circle at 94% 7%, rgba(125,105,255,.08), transparent 24%),
            linear-gradient(180deg, #020711 0%, #030a12 46%, #020711 100%);
        }

        .ta14x * { box-sizing: border-box; }
        .ta14x a { color: inherit; }
        .ta14x-shell {
          width: min(1460px, calc(100% - 48px));
          margin: 0 auto;
        }

        .ta14x-hero {
          position: relative;
          min-height: 720px;
          display: grid;
          align-items: center;
          border-bottom: 1px solid var(--line);
          overflow: hidden;
        }

        .ta14x-hero::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: linear-gradient(to bottom, #000, transparent 86%);
          opacity: .4;
        }

        .ta14x-hero-grid {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(420px, .95fr);
          gap: 72px;
          align-items: center;
          padding: 82px 0;
        }

        .ta14x-kicker-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }

        .ta14x-pill {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 0 12px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255,255,255,.028);
          color: var(--muted);
          font-size: .64rem;
          font-weight: 900;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .ta14x-pill.cyan {
          color: var(--cyan-soft);
          border-color: rgba(84,232,255,.24);
          background: rgba(84,232,255,.06);
        }

        .ta14x-title {
          max-width: 880px;
          margin: 0;
          font-size: clamp(3.4rem, 6vw, 6.8rem);
          line-height: .94;
          letter-spacing: -.06em;
          font-weight: 900;
        }

        .ta14x-title span {
          display: block;
          margin-top: 10px;
          color: var(--cyan-soft);
          text-shadow: 0 0 45px rgba(84,232,255,.12);
        }

        .ta14x-lead {
          max-width: 820px;
          margin: 28px 0 0;
          color: #c7d7e4;
          font-size: clamp(1rem, 1.45vw, 1.2rem);
          line-height: 1.8;
        }

        .ta14x-sublead {
          max-width: 760px;
          margin: 14px 0 0;
          color: var(--muted);
          font-size: .88rem;
          line-height: 1.75;
        }

        .ta14x-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .ta14x-button {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 17px;
          border: 1px solid var(--line);
          border-radius: 13px;
          text-decoration: none;
          font-size: .78rem;
          font-weight: 900;
          transition: 160ms ease;
        }

        .ta14x-button:hover,
        .ta14x-button:focus-visible {
          transform: translateY(-2px);
          outline: none;
        }

        .ta14x-button.primary {
          color: #031015;
          border-color: transparent;
          background: linear-gradient(105deg, #54e8ff, #39f2a1);
          box-shadow: 0 18px 42px rgba(57,242,161,.14);
        }

        .ta14x-button.secondary {
          color: #dffaff;
          border-color: rgba(84,232,255,.23);
          background: rgba(84,232,255,.06);
        }

        .ta14x-button.indigo {
          color: #e6e9ff;
          border-color: rgba(154,168,255,.20);
          background: rgba(154,168,255,.055);
        }

        .ta14x-orbit {
          position: relative;
          width: min(520px, 100%);
          aspect-ratio: 1;
          margin: 0 auto;
        }

        .ta14x-ring,
        .ta14x-axis {
          position: absolute;
          inset: 50% auto auto 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .ta14x-ring {
          border: 1px solid rgba(125,180,214,.11);
          border-radius: 50%;
        }

        .ta14x-ring.r1 { width: 96%; height: 96%; }
        .ta14x-ring.r2 { width: 76%; height: 76%; border-color: rgba(84,232,255,.12); }
        .ta14x-ring.r3 { width: 56%; height: 56%; border-color: rgba(154,168,255,.13); }
        .ta14x-ring.r4 { width: 35%; height: 35%; border-color: rgba(57,242,161,.13); }

        .ta14x-axis.h {
          width: 90%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(84,232,255,.16), transparent);
        }

        .ta14x-axis.v {
          width: 1px;
          height: 90%;
          background: linear-gradient(180deg, transparent, rgba(154,168,255,.16), transparent);
        }

        .ta14x-core {
          position: absolute;
          inset: 50% auto auto 50%;
          width: 164px;
          height: 164px;
          transform: translate(-50%, -50%);
          display: grid;
          place-items: center;
          border: 1px solid rgba(84,232,255,.28);
          border-radius: 50%;
          background:
            radial-gradient(circle at 30% 25%, rgba(84,232,255,.12), transparent 42%),
            rgba(5,16,27,.95);
          box-shadow: 0 0 80px rgba(84,232,255,.11), inset 0 1px 0 rgba(255,255,255,.05);
          text-align: center;
        }

        .ta14x-core small {
          display: block;
          color: var(--cyan);
          font-size: .62rem;
          font-weight: 950;
          letter-spacing: .22em;
        }

        .ta14x-core strong {
          display: block;
          margin-top: 3px;
          font-size: 3.6rem;
          line-height: 1;
          letter-spacing: -.07em;
        }

        .ta14x-core span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: .68rem;
        }

        .ta14x-node {
          position: absolute;
          min-width: 92px;
          padding: 10px 12px;
          border: 1px solid var(--line);
          border-radius: 13px;
          background: rgba(5,16,27,.92);
          box-shadow: 0 12px 38px rgba(0,0,0,.25);
          backdrop-filter: blur(14px);
        }

        .ta14x-node b {
          display: block;
          color: var(--cyan);
          font-size: .58rem;
          letter-spacing: .14em;
        }

        .ta14x-node span {
          display: block;
          margin-top: 4px;
          color: #d8e6f0;
          font-size: .68rem;
          font-weight: 850;
        }

        .ta14x-node.n1 { left: 2%; top: 18%; }
        .ta14x-node.n2 { right: 0; top: 25%; }
        .ta14x-node.n3 { right: 5%; bottom: 17%; }
        .ta14x-node.n4 { left: 0; bottom: 19%; }
        .ta14x-node.n5 { left: 50%; top: 0; transform: translateX(-50%); }

        .ta14x-stats {
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.78);
        }

        .ta14x-stats-grid {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
        }

        .ta14x-stat {
          min-height: 86px;
          padding: 18px 20px;
          border-right: 1px solid var(--line);
        }

        .ta14x-stat:last-child { border-right: 0; }

        .ta14x-stat strong {
          display: block;
          font-size: 1.75rem;
          letter-spacing: -.04em;
        }

        .ta14x-stat span {
          display: block;
          margin-top: 5px;
          color: var(--dim);
          font-size: .58rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .ta14x-section {
          padding: 88px 0;
        }

        .ta14x-section.alt {
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
          background: rgba(4,12,20,.68);
        }

        .ta14x-section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 32px;
          margin-bottom: 42px;
        }

        .ta14x-eyebrow {
          color: var(--green);
          font-size: .64rem;
          font-weight: 950;
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .ta14x-h2 {
          max-width: 820px;
          margin: 10px 0 0;
          font-size: clamp(2.1rem, 4vw, 4rem);
          line-height: 1;
          letter-spacing: -.045em;
        }

        .ta14x-section-copy {
          max-width: 590px;
          margin: 0;
          color: var(--muted);
          font-size: .83rem;
          line-height: 1.75;
        }

        .ta14x-spine-wrap {
          overflow-x: auto;
          padding: 16px 0 20px;
        }

        .ta14x-spine {
          position: relative;
          min-width: 1350px;
          display: grid;
          grid-template-columns: repeat(24, minmax(0, 1fr));
          gap: 10px;
          padding-top: 16px;
        }

        .ta14x-spine::before {
          content: "";
          position: absolute;
          left: 28px;
          right: 28px;
          top: 35px;
          height: 1px;
          background: linear-gradient(90deg, rgba(84,232,255,.12), rgba(57,242,161,.40), rgba(154,168,255,.12));
        }

        .ta14x-spine-link {
          position: relative;
          z-index: 1;
          display: grid;
          justify-items: center;
          gap: 12px;
          color: var(--text);
          text-decoration: none;
        }

        .ta14x-spine-dot {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 50%;
          color: var(--cyan-soft);
          background: #06111d;
          box-shadow: 0 0 0 6px #030a12;
          font-size: .61rem;
          font-weight: 950;
          transition: 160ms ease;
        }

        .ta14x-spine-name {
          max-width: 76px;
          color: var(--dim);
          text-align: center;
          font-size: .57rem;
          font-weight: 800;
          line-height: 1.35;
          transition: 160ms ease;
        }

        .ta14x-spine-link:hover .ta14x-spine-dot {
          transform: scale(1.12);
          border-color: rgba(84,232,255,.48);
          background: rgba(84,232,255,.10);
        }

        .ta14x-spine-link:hover .ta14x-spine-name { color: #dceaf3; }

        .ta14x-region-jump {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 32px;
        }

        .ta14x-region-jump a {
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: rgba(255,255,255,.02);
          text-decoration: none;
          transition: 160ms ease;
        }

        .ta14x-region-jump a:hover {
          transform: translateY(-2px);
          border-color: var(--line-strong);
          background: rgba(84,232,255,.045);
        }

        .ta14x-region-jump small {
          display: block;
          color: var(--cyan);
          font-size: .56rem;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .ta14x-region-jump strong {
          display: block;
          margin-top: 8px;
          font-size: .86rem;
        }

        .ta14x-region-jump span {
          display: block;
          margin-top: 8px;
          color: var(--muted);
          font-size: .67rem;
          line-height: 1.5;
        }

        .ta14x-region {
          scroll-margin-top: 90px;
          display: grid;
          grid-template-columns: minmax(260px, .72fr) minmax(0, 1.28fr);
          gap: 34px;
          padding: 70px 0;
          border-top: 1px solid var(--line);
        }

        .ta14x-region:first-child { border-top: 0; }

        .ta14x-region-side {
          align-self: start;
          position: sticky;
          top: 26px;
        }

        .ta14x-region-mark {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ta14x-region-number {
          width: 45px;
          height: 45px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(84,232,255,.22);
          border-radius: 50%;
          color: var(--cyan-soft);
          background: rgba(84,232,255,.055);
          font-size: .72rem;
          font-weight: 950;
        }

        .ta14x-region-mark small {
          display: block;
          color: var(--dim);
          font-size: .57rem;
          font-weight: 900;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .ta14x-region-mark b {
          display: block;
          margin-top: 3px;
          color: var(--green);
          font-size: .59rem;
          letter-spacing: .14em;
        }

        .ta14x-region-title {
          margin: 20px 0 0;
          font-size: 2rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .ta14x-region-desc {
          margin: 15px 0 0;
          color: var(--muted);
          font-size: .81rem;
          line-height: 1.72;
        }

        .ta14x-question {
          margin-top: 18px;
          padding: 15px 16px;
          border: 1px solid var(--line);
          border-radius: 14px;
          background: rgba(255,255,255,.02);
        }

        .ta14x-question small {
          display: block;
          color: var(--dim);
          font-size: .55rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .ta14x-question p {
          margin: 7px 0 0;
          color: #dae8f1;
          font-size: .76rem;
          line-height: 1.55;
        }

        .ta14x-link-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .ta14x-card {
          min-height: 290px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          padding: 22px;
          border: 1px solid var(--line);
          border-radius: 21px;
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.05), transparent 35%),
            rgba(255,255,255,.026);
          text-decoration: none;
          transition: 180ms ease;
        }

        .ta14x-card:hover {
          transform: translateY(-3px);
          border-color: rgba(84,232,255,.28);
          background:
            radial-gradient(circle at 100% 0%, rgba(84,232,255,.09), transparent 36%),
            rgba(255,255,255,.04);
          box-shadow: 0 24px 60px rgba(0,0,0,.18);
        }

        .ta14x-card-top {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 14px;
        }

        .ta14x-card-kicker {
          color: var(--cyan);
          font-size: .57rem;
          font-weight: 950;
          letter-spacing: .14em;
          text-transform: uppercase;
        }

        .ta14x-anchor {
          padding: 5px 8px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--dim);
          font-size: .52rem;
          font-weight: 850;
        }

        .ta14x-card h3 {
          margin: 13px 0 0;
          font-size: 1.15rem;
          line-height: 1.2;
          letter-spacing: -.02em;
        }

        .ta14x-card-desc {
          margin: 14px 0 0;
          color: var(--muted);
          font-size: .76rem;
          line-height: 1.7;
        }

        .ta14x-card-bottom {
          margin-top: auto;
          padding-top: 18px;
          border-top: 1px solid var(--line);
        }

        .ta14x-card-bottom small {
          display: block;
          color: var(--dim);
          font-size: .53rem;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .ta14x-card-bottom p {
          margin: 7px 0 0;
          color: #c8d7e2;
          font-size: .69rem;
          line-height: 1.5;
        }

        .ta14x-card-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 16px;
          color: var(--cyan);
          font-size: .65rem;
          font-weight: 900;
        }

        .ta14x-labs-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .ta14x-lab {
          min-height: 180px;
          display: flex;
          gap: 15px;
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 18px;
          background: rgba(255,255,255,.024);
          text-decoration: none;
          transition: 160ms ease;
        }

        .ta14x-lab:hover {
          transform: translateY(-2px);
          border-color: rgba(84,232,255,.24);
          background: rgba(84,232,255,.04);
        }

        .ta14x-lab-code {
          width: 38px;
          height: 38px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border: 1px solid rgba(84,232,255,.16);
          border-radius: 11px;
          color: var(--cyan-soft);
          background: rgba(84,232,255,.05);
          font-size: .57rem;
          font-weight: 950;
        }

        .ta14x-lab h3 {
          margin: 1px 0 0;
          font-size: .85rem;
        }

        .ta14x-lab p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: .67rem;
          line-height: 1.55;
        }

        .ta14x-provenance {
          display: grid;
          grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
          gap: 34px;
          padding: 32px;
          border: 1px solid rgba(154,168,255,.16);
          border-radius: 26px;
          background:
            radial-gradient(circle at 100% 0%, rgba(154,168,255,.09), transparent 35%),
            rgba(255,255,255,.025);
        }

        .ta14x-provenance h2 {
          margin: 10px 0 0;
          font-size: 2.2rem;
          line-height: 1.02;
          letter-spacing: -.04em;
        }

        .ta14x-provenance p {
          margin: 16px 0 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .ta14x-provenance-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .ta14x-evidence-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .ta14x-evidence {
          padding: 17px;
          border: 1px solid var(--line);
          border-radius: 16px;
          background: rgba(0,0,0,.12);
        }

        .ta14x-evidence b {
          color: var(--indigo);
          font-size: .57rem;
          letter-spacing: .14em;
        }

        .ta14x-evidence strong {
          display: block;
          margin-top: 8px;
          font-size: .82rem;
        }

        .ta14x-evidence span {
          display: block;
          margin-top: 7px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.5;
        }

        .ta14x-origin {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
          gap: 20px;
        }

        .ta14x-origin-main,
        .ta14x-origin-side {
          padding: 28px;
          border: 1px solid var(--line);
          border-radius: 23px;
        }

        .ta14x-origin-main {
          border-color: rgba(242,196,86,.18);
          background: rgba(242,196,86,.035);
        }

        .ta14x-origin-side { background: rgba(255,255,255,.022); }

        .ta14x-origin-main h2 {
          max-width: 850px;
          margin: 10px 0 0;
          font-size: 2rem;
          line-height: 1.08;
          letter-spacing: -.035em;
        }

        .ta14x-chain8 {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
          margin-top: 23px;
        }

        .ta14x-chain8 span {
          padding: 8px 10px;
          border: 1px solid rgba(242,196,86,.14);
          border-radius: 999px;
          color: #fff1c7;
          background: rgba(0,0,0,.12);
          font-size: .64rem;
          font-weight: 850;
        }

        .ta14x-chain8 i {
          color: rgba(242,196,86,.46);
          font-style: normal;
          font-size: .65rem;
        }

        .ta14x-origin-main p,
        .ta14x-origin-side p {
          color: var(--muted);
          font-size: .72rem;
          line-height: 1.65;
        }

        .ta14x-origin-point {
          display: grid;
          grid-template-columns: 36px 1fr;
          gap: 12px;
          padding: 14px 0;
          border-top: 1px solid var(--line);
        }

        .ta14x-origin-point:first-of-type { margin-top: 12px; }

        .ta14x-origin-point b {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(84,232,255,.16);
          border-radius: 50%;
          color: var(--cyan-soft);
          font-size: .55rem;
        }

        .ta14x-origin-point strong {
          display: block;
          font-size: .75rem;
        }

        .ta14x-origin-point span {
          display: block;
          margin-top: 5px;
          color: var(--muted);
          font-size: .64rem;
          line-height: 1.5;
        }

        .ta14x-close {
          padding: 88px 0 110px;
          text-align: center;
        }

        .ta14x-close h2 {
          max-width: 900px;
          margin: 10px auto 0;
          font-size: clamp(2.4rem, 4.5vw, 4.8rem);
          line-height: .98;
          letter-spacing: -.05em;
        }

        .ta14x-close h2 span {
          display: block;
          color: #6f8799;
        }

        .ta14x-close p {
          max-width: 760px;
          margin: 18px auto 0;
          color: var(--muted);
          font-size: .78rem;
          line-height: 1.7;
        }

        .ta14x-close-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        @media (max-width: 1180px) {
          .ta14x-hero-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .ta14x-orbit { max-width: 500px; }
          .ta14x-stats-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
          .ta14x-stat:nth-child(3) { border-right: 0; }
          .ta14x-stat:nth-child(-n+3) { border-bottom: 1px solid var(--line); }
          .ta14x-region { grid-template-columns: 1fr; }
          .ta14x-region-side { position: static; }
          .ta14x-labs-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 800px) {
          .ta14x-shell { width: min(100% - 28px, 1460px); }
          .ta14x-hero { min-height: 0; }
          .ta14x-hero-grid { padding: 58px 0 64px; }
          .ta14x-title { font-size: clamp(2.8rem, 14vw, 4.7rem); }
          .ta14x-orbit { width: 100%; max-width: 430px; }
          .ta14x-section { padding: 64px 0; }
          .ta14x-section-head { display: grid; }
          .ta14x-region-jump { grid-template-columns: 1fr 1fr; }
          .ta14x-link-grid,
          .ta14x-evidence-grid,
          .ta14x-provenance,
          .ta14x-origin { grid-template-columns: 1fr; }
          .ta14x-labs-grid { grid-template-columns: 1fr; }
          .ta14x-card { min-height: 250px; }
        }

        @media (max-width: 560px) {
          .ta14x-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .ta14x-stat { border-bottom: 1px solid var(--line); }
          .ta14x-stat:nth-child(2n) { border-right: 0; }
          .ta14x-region-jump { grid-template-columns: 1fr; }
          .ta14x-node { display: none; }
          .ta14x-orbit { aspect-ratio: .9; }
          .ta14x-actions,
          .ta14x-provenance-actions,
          .ta14x-close-actions { display: grid; }
          .ta14x-button { width: 100%; }
        }
      `}</style>

      <section className="ta14x-hero">
        <div className="ta14x-shell ta14x-hero-grid">
          <div>
            <div className="ta14x-kicker-row">
              <span className="ta14x-pill cyan">TA-14 Academy</span>
              <span className="ta14x-pill">Canon Explorer</span>
            </div>

            <h1 className="ta14x-title">
              The architecture of
              <span>admissible execution.</span>
            </h1>

            <p className="ta14x-lead">
              Twenty-four linked states govern the route from reality and
              evidence through authority, consequence, binding, commit,
              execution, outcome, memory, and the next chain.
            </p>

            <p className="ta14x-sublead">
              TA-14 treats the architecture as a consequence-bearing route,
              not a vocabulary list. Every link has an evidence burden,
              failure condition, transition rule, and downstream effect.
            </p>

            <div className="ta14x-actions">
              <a href="#architecture-spine" className="ta14x-button primary">
                Enter the architecture ↓
              </a>
              <Link
                href="/academy/24-link-architecture/route-state"
                className="ta14x-button secondary"
              >
                Open Route State →
              </Link>
              <Link
                href="/academy/24-link-architecture/provenance"
                className="ta14x-button indigo"
              >
                Trace Provenance →
              </Link>
            </div>
          </div>

          <div className="ta14x-orbit" aria-label="TA-14 24-link architecture motif">
            <div className="ta14x-ring r1" />
            <div className="ta14x-ring r2" />
            <div className="ta14x-ring r3" />
            <div className="ta14x-ring r4" />
            <div className="ta14x-axis h" />
            <div className="ta14x-axis v" />

            <div className="ta14x-core">
              <div>
                <small>TA-14</small>
                <strong>24</strong>
                <span>linked states</span>
              </div>
            </div>

            <div className="ta14x-node n1"><b>01</b><span>Reality</span></div>
            <div className="ta14x-node n2"><b>06</b><span>Truth</span></div>
            <div className="ta14x-node n3"><b>15</b><span>Commit</span></div>
            <div className="ta14x-node n4"><b>19</b><span>Execution</span></div>
            <div className="ta14x-node n5"><b>24</b><span>Future Chain</span></div>
          </div>
        </div>
      </section>

      <section className="ta14x-stats">
        <div className="ta14x-shell ta14x-stats-grid">
          <Stat value="24" label="Canonical links" />
          <Stat value="8" label="Foundational anchors" />
          <Stat value="4" label="Architecture regions" />
          <Stat value="8" label="Applied labs & views" />
          <Stat value="1" label="Governed route" />
          <Stat value="∞" label="Recursive future chains" />
        </div>
      </section>

      <section id="architecture-spine" className="ta14x-section alt">
        <div className="ta14x-shell">
          <div className="ta14x-section-head">
            <div>
              <div className="ta14x-eyebrow">Canonical architecture spine</div>
              <h2 className="ta14x-h2">Follow the route before you enter the detail.</h2>
            </div>
            <p className="ta14x-section-copy">
              Evidence and authority accumulate, consequences form, boundaries
              attach, execution either becomes admissible or is correctly
              prevented, and outcome creates a new reality that the future
              chain must inherit.
            </p>
          </div>

          <div className="ta14x-spine-wrap">
            <div className="ta14x-spine">
              {TA14_24_LINKS.map((item) => (
                <Link
                  key={item.linkId}
                  href={`/academy/24-link-architecture/${String(item.order).padStart(2, "0")}-${item.slug}`}
                  className="ta14x-spine-link"
                >
                  <span className="ta14x-spine-dot">
                    {String(item.order).padStart(2, "0")}
                  </span>
                  <span className="ta14x-spine-name">{item.canonicalName}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="ta14x-region-jump">
            {regions.map((region) => (
              <a key={region.id} href={`#${region.id}`}>
                <small>Region {region.number} · {region.range[0]}–{region.range[1]}</small>
                <strong>{region.title}</strong>
                <span>{region.question}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="ta14x-section">
        <div className="ta14x-shell">
          {regions.map((region) => {
            const links = getRegionLinks(region.range[0], region.range[1]);

            return (
              <section key={region.id} id={region.id} className="ta14x-region">
                <div className="ta14x-region-side">
                  <div className="ta14x-region-mark">
                    <span className="ta14x-region-number">{region.number}</span>
                    <div>
                      <small>Links {region.range[0]}–{region.range[1]}</small>
                      <b>{region.signal}</b>
                    </div>
                  </div>

                  <h2 className="ta14x-region-title">{region.title}</h2>
                  <p className="ta14x-region-desc">{region.description}</p>

                  <div className="ta14x-question">
                    <small>Region question</small>
                    <p>{region.question}</p>
                  </div>
                </div>

                <div className="ta14x-link-grid">
                  {links.map((item) => (
                    <Link
                      key={item.linkId}
                      href={`/academy/24-link-architecture/${String(item.order).padStart(2, "0")}-${item.slug}`}
                      className="ta14x-card"
                    >
                      <div className="ta14x-card-top">
                        <div>
                          <div className="ta14x-card-kicker">
                            Link {String(item.order).padStart(2, "0")}
                          </div>
                          <h3>{item.canonicalName}</h3>
                        </div>
                        <span className="ta14x-anchor">{item.parentAnchor}</span>
                      </div>

                      <p className="ta14x-card-desc">{item.definition}</p>

                      <div className="ta14x-card-bottom">
                        <small>Governing question</small>
                        <p>{item.governingQuestion}</p>
                        <div className="ta14x-card-action">
                          <span>Enter canonical link</span>
                          <span>→</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="ta14x-section alt">
        <div className="ta14x-shell">
          <div className="ta14x-section-head">
            <div>
              <div className="ta14x-eyebrow" style={{ color: "var(--rose)" }}>
                Applied Academy
              </div>
              <h2 className="ta14x-h2">Don&apos;t just read the chain. Pressure it.</h2>
            </div>
            <p className="ta14x-section-copy">
              Use the live Academy environments to locate degradation,
              challenge assumptions, map evidence, preserve refusal, and prove
              whether progression remains admissible before consequence attaches.
            </p>
          </div>

          <div className="ta14x-labs-grid">
            {labs.map((lab) => (
              <Link key={lab.href} href={lab.href} className="ta14x-lab">
                <span className="ta14x-lab-code">{lab.code}</span>
                <div>
                  <h3>{lab.title}</h3>
                  <p>{lab.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="ta14x-section">
        <div className="ta14x-shell">
          <div className="ta14x-provenance">
            <div>
              <div className="ta14x-eyebrow" style={{ color: "var(--indigo)" }}>
                Provenance layer
              </div>
              <h2>Architecture should be traceable.</h2>
              <p>
                The Explorer does not ask learners to accept the 24 links as
                an unsupported diagram. The provenance system connects the
                architecture to chronology, publications, patent position,
                implementation artifacts, and bounded review records.
              </p>

              <div className="ta14x-provenance-actions">
                <Link
                  href="/academy/24-link-architecture/provenance"
                  className="ta14x-button indigo"
                >
                  Open Provenance Map
                </Link>
                <Link
                  href="/academy/24-link-architecture/provenance/patents"
                  className="ta14x-button secondary"
                >
                  Patent Portfolio
                </Link>
                <Link
                  href="/academy/24-link-architecture/provenance/patents/families"
                  className="ta14x-button"
                >
                  Eight Patent Families
                </Link>
              </div>
            </div>

            <div className="ta14x-evidence-grid">
              <Evidence code="CH" title="Chronology" text="Public dates and source records establish when architecture entered the public record." />
              <Evidence code="PP" title="Patent Position" text="Applications are mapped through bounded relationships without turning architecture mapping into claim construction." />
              <Evidence code="AR" title="Artifacts" text="Implementations and demonstrations show what has actually been built, recorded, or evidenced." />
              <Evidence code="RV" title="Reviews" text="Review records preserve scope, evidence basis, findings, challenges, and correction boundaries." />
            </div>
          </div>
        </div>
      </section>

      <section className="ta14x-section alt">
        <div className="ta14x-shell">
          <div className="ta14x-origin">
            <div className="ta14x-origin-main">
              <div className="ta14x-eyebrow" style={{ color: "var(--gold)" }}>
                Provenance preserved
              </div>
              <h2>
                The foundational Chain of Eight was already created and
                publicly published May 1, 2025.
              </h2>

              <div className="ta14x-chain8">
                {TA14_CHAIN_OF_EIGHT.map((name, index) => (
                  <span key={name}>
                    {name}
                    {index < TA14_CHAIN_OF_EIGHT.length - 1 ? <i> →</i> : null}
                  </span>
                ))}
              </div>

              <p>
                The 24-link architecture is the subsequent deeper-resolution
                expansion and maturation of that already-existing parent
                route. The expansion increases architectural resolution; it
                does not move the public origin date of the foundational eight
                anchors.
              </p>
            </div>

            <div className="ta14x-origin-side">
              <div className="ta14x-eyebrow">Read the expansion correctly</div>
              <OriginPoint number="01" title="Parent route remains intact" text="Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, and Outcome remain the foundational route." />
              <OriginPoint number="02" title="Resolution increased" text="Later work decomposed evidence, authority, consequence, runtime, non-occurrence, outcome, memory, and recursion into explicit governed states." />
              <OriginPoint number="03" title="Chronology stays visible" text="The Academy distinguishes origin, expansion, patent position, implementation evidence, and bounded review findings." />
            </div>
          </div>
        </div>
      </section>

      <section className="ta14x-close">
        <div className="ta14x-shell">
          <div className="ta14x-eyebrow">Academy objective</div>
          <h2>
            Learn where execution becomes supportable —
            <span>and where the route must stop.</span>
          </h2>
          <p>
            TA-14 Academy is designed to move a learner from recognition to
            governed judgment: what is true, what is supported, what is
            allowed, what is forming, what should execute, what should not
            occur, and what the resulting reality requires next.
          </p>

          <div className="ta14x-close-actions">
            <Link href="/academy/24-link-architecture/route-state" className="ta14x-button primary">
              Start with Route State
            </Link>
            <Link href="/academy/24-link-architecture/simulator" className="ta14x-button secondary">
              Pressure the Chain
            </Link>
            <Link href="/academy/24-link-architecture/provenance" className="ta14x-button indigo">
              Trace the Record
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="ta14x-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

function Evidence({
  code,
  title,
  text,
}: {
  code: string;
  title: string;
  text: string;
}) {
  return (
    <article className="ta14x-evidence">
      <b>{code}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </article>
  );
}

function OriginPoint({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="ta14x-origin-point">
      <b>{number}</b>
      <div>
        <strong>{title}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}
