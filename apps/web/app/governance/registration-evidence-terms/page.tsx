import Link from "next/link";

export const metadata = {
  title: "Registration & Evidence Terms | TA14 Authority",
  description:
    "Public terms governing AI governance registration, evidence submission, findings, publication, withdrawal, versioning, fees, and institutional recordkeeping within the TA14 AI Governance Exchange.",
};

type SectionProps = {
  number: string;
  title: string;
  children: React.ReactNode;
  accent?: "cyan" | "green" | "violet" | "amber";
};

type PrincipleProps = {
  eyebrow: string;
  title: string;
  text: string;
};

type ProvenanceCardProps = {
  label: string;
  text: string;
  tone?: "cyan" | "green" | "violet" | "amber" | "neutral";
};

const principles: PrincipleProps[] = [
  {
    eyebrow: "Registration boundary",
    title: "Identity is not correctness.",
    text: "Registration establishes an attributable governance identity and baseline. It does not certify the architecture or prove the registered claims.",
  },
  {
    eyebrow: "Evidence boundary",
    title: "Evidence remains bounded.",
    text: "Evidence is admitted, attributed, preserved, and evaluated within scope. It is not silently upgraded into independent proof.",
  },
  {
    eyebrow: "Finding boundary",
    title: "The limitation travels.",
    text: "A material qualification remains inseparable from the finding whose meaning it changes.",
  },
  {
    eyebrow: "Institutional boundary",
    title: "Authority is not independence.",
    text: "TA14 Authority does not claim that institutional position, hashing, signing, storage, or publication creates independence by itself.",
  },
];

const provenanceCards: ProvenanceCardProps[] = [
  {
    label: "REGISTRANT-PRODUCED",
    text: "Produced, supplied, or maintained by the registrant.",
    tone: "cyan",
  },
  {
    label: "TA14-PRODUCED",
    text: "Generated directly through a TA14 Authority process.",
    tone: "green",
  },
  {
    label: "INDEPENDENTLY PRODUCED",
    text: "Originated from a materially independent party for the relevant evidentiary purpose.",
    tone: "violet",
  },
  {
    label: "INDEPENDENTLY REPRODUCED",
    text: "A material behavior or result was reproduced independently under stated conditions.",
    tone: "violet",
  },
  {
    label: "PUBLIC-SOURCE",
    text: "Obtained from an attributable public source.",
    tone: "cyan",
  },
  {
    label: "CROSS-PARTY",
    text: "Depends on records, evidence, or receipts preserved by more than one party.",
    tone: "green",
  },
  {
    label: "NOT INDEPENDENTLY ESTABLISHED",
    text: "Represented in the admitted record, but not independently established.",
    tone: "amber",
  },
  {
    label: "NOT REPORTED",
    text: "Relevant provenance, mechanism, or source was not reported.",
    tone: "amber",
  },
  {
    label: "NOT SUBMITTED",
    text: "Evidence necessary to establish the proposition was not submitted.",
    tone: "amber",
  },
  {
    label: "NOT PRESERVED",
    text: "The relevant contemporaneous record was not preserved.",
    tone: "amber",
  },
  {
    label: "OUTSIDE REVIEW SCOPE",
    text: "The matter was not evaluated within the bounded proceeding.",
    tone: "neutral",
  },
];

const feeRows = [
  ["Initial AI Governance Entity Registration", "$0", "NO FEE"],
  ["Governance Version Registration", "$0", "NO FEE"],
  ["Execution / Evidence Artifact Registration", "$0", "NO FEE"],
  ["Standard Bounded Demonstration", "$0", "NO FEE"],
  [
    "Extended Independent Evidence Review",
    "Written scope required",
    "SEPARATELY SCOPED",
  ],
  [
    "Technical / Production-Readiness Review",
    "Written scope required",
    "SEPARATELY SCOPED",
  ],
  [
    "Architecture / Implementation Advisory",
    "Written scope required",
    "SEPARATELY SCOPED",
  ],
  [
    "Multi-Layer Partner Review",
    "Written scope required",
    "SEPARATELY SCOPED",
  ],
];

function Section({
  number,
  title,
  children,
  accent = "cyan",
}: SectionProps) {
  return (
    <section className={`terms-section terms-section--${accent}`}>
      <div className="section-head">
        <div className="section-number">{number}</div>
        <div>
          <div className="section-kicker">Governed term</div>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="section-body">{children}</div>
    </section>
  );
}

function PrincipleCard({ eyebrow, title, text }: PrincipleProps) {
  return (
    <article className="principle-card">
      <div className="principle-orbit" aria-hidden="true" />
      <div className="principle-eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function ProvenanceCard({
  label,
  text,
  tone = "neutral",
}: ProvenanceCardProps) {
  return (
    <article className={`provenance-card provenance-card--${tone}`}>
      <div className="provenance-dot" />
      <div>
        <div className="provenance-label">{label}</div>
        <p>{text}</p>
      </div>
    </article>
  );
}

export default function RegistrationEvidenceTermsPage() {
  return (
    <>
      <style>{`
        :root {
          --ta-bg: #03060b;
          --ta-panel: rgba(8, 18, 29, 0.78);
          --ta-panel-2: rgba(9, 24, 37, 0.88);
          --ta-line: rgba(121, 222, 255, 0.15);
          --ta-line-strong: rgba(121, 222, 255, 0.30);
          --ta-cyan: #54e8ff;
          --ta-cyan-2: #29a7ff;
          --ta-green: #39f2a1;
          --ta-violet: #9f8cff;
          --ta-amber: #ffc86b;
          --ta-text: #f4f9ff;
          --ta-muted: #93a8bb;
          --ta-muted-2: #667c90;
        }

        .terms-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: var(--ta-text);
          background:
            radial-gradient(circle at 15% 8%, rgba(41, 167, 255, 0.14), transparent 28rem),
            radial-gradient(circle at 88% 18%, rgba(57, 242, 161, 0.10), transparent 25rem),
            radial-gradient(circle at 65% 78%, rgba(159, 140, 255, 0.08), transparent 30rem),
            linear-gradient(180deg, #03060b 0%, #04101a 46%, #03060b 100%);
        }

        .terms-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.18;
          background-image:
            linear-gradient(rgba(84, 232, 255, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(84, 232, 255, 0.055) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, black, transparent 88%);
        }

        .ambient {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }

        .star {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 999px;
          background: #bff7ff;
          box-shadow: 0 0 14px rgba(84, 232, 255, 0.95);
          animation: drift 15s linear infinite;
          opacity: 0.65;
        }

        .star:nth-child(1) { left: 8%; top: 14%; animation-delay: -2s; }
        .star:nth-child(2) { left: 21%; top: 48%; animation-delay: -7s; }
        .star:nth-child(3) { left: 43%; top: 18%; animation-delay: -11s; }
        .star:nth-child(4) { left: 67%; top: 36%; animation-delay: -5s; }
        .star:nth-child(5) { left: 87%; top: 13%; animation-delay: -9s; }
        .star:nth-child(6) { left: 92%; top: 70%; animation-delay: -13s; }
        .star:nth-child(7) { left: 54%; top: 84%; animation-delay: -3s; }
        .star:nth-child(8) { left: 13%; top: 78%; animation-delay: -6s; }

        .orb {
          position: absolute;
          border-radius: 999px;
          border: 1px solid rgba(84, 232, 255, 0.18);
          animation: orbitPulse 8s ease-in-out infinite;
        }

        .orb-one {
          width: 340px;
          height: 340px;
          right: -110px;
          top: 180px;
        }

        .orb-two {
          width: 220px;
          height: 220px;
          left: -90px;
          top: 560px;
          animation-delay: -3s;
          border-color: rgba(57, 242, 161, 0.18);
        }

        .container {
          position: relative;
          z-index: 2;
          width: min(1180px, calc(100% - 34px));
          margin: 0 auto;
          padding: 28px 0 84px;
        }

        .top-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 15px 18px;
          margin-bottom: 28px;
          border: 1px solid rgba(121, 222, 255, 0.13);
          border-radius: 18px;
          background: rgba(4, 12, 20, 0.72);
          backdrop-filter: blur(18px);
          box-shadow:
            0 18px 60px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          color: white;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.02em;
          text-decoration: none;
        }

        .brand-mark {
          position: relative;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          border: 1px solid rgba(84, 232, 255, 0.45);
          background:
            radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), transparent 18%),
            linear-gradient(145deg, rgba(84,232,255,0.22), rgba(57,242,161,0.04));
          box-shadow: 0 0 24px rgba(84, 232, 255, 0.18);
        }

        .brand-mark::before,
        .brand-mark::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 17px;
          height: 1px;
          background: var(--ta-cyan);
          transform-origin: center;
        }

        .brand-mark::before { transform: translate(-50%, -50%) rotate(45deg); }
        .brand-mark::after { transform: translate(-50%, -50%) rotate(-45deg); }

        .nav-links {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .nav-link {
          padding: 9px 12px;
          border-radius: 11px;
          color: #9fb2c4;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: 180ms ease;
        }

        .nav-link:hover {
          color: white;
          background: rgba(84, 232, 255, 0.07);
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: 54px;
          border: 1px solid rgba(84, 232, 255, 0.19);
          border-radius: 34px;
          background:
            linear-gradient(135deg, rgba(9, 25, 40, 0.96), rgba(5, 14, 24, 0.84)),
            radial-gradient(circle at 85% 20%, rgba(84, 232, 255, 0.14), transparent 25rem);
          box-shadow:
            0 30px 120px rgba(0, 0, 0, 0.38),
            0 0 80px rgba(41, 167, 255, 0.04),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .hero::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          right: -145px;
          top: -170px;
          border-radius: 50%;
          border: 1px solid rgba(84, 232, 255, 0.17);
          box-shadow:
            0 0 0 55px rgba(84, 232, 255, 0.018),
            0 0 0 110px rgba(84, 232, 255, 0.012);
          animation: slowRotate 24s linear infinite;
        }

        .hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 8px 12px;
          border: 1px solid rgba(84, 232, 255, 0.19);
          border-radius: 999px;
          color: #a8eefa;
          background: rgba(84, 232, 255, 0.055);
          font-size: 11px;
          font-weight: 850;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--ta-green);
          box-shadow: 0 0 0 5px rgba(57, 242, 161, 0.08), 0 0 18px rgba(57, 242, 161, 0.8);
          animation: pulse 2.1s ease-in-out infinite;
        }

        .instrument-id {
          margin-top: 20px;
          color: #667f93;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .hero h1 {
          position: relative;
          z-index: 2;
          max-width: 820px;
          margin: 20px 0 0;
          font-size: clamp(42px, 7vw, 76px);
          line-height: 0.98;
          letter-spacing: -0.055em;
          background: linear-gradient(96deg, #ffffff 5%, #dffaff 45%, #98f5de 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-lead {
          position: relative;
          z-index: 2;
          max-width: 825px;
          margin: 26px 0 0;
          color: #aabccc;
          font-size: 18px;
          line-height: 1.75;
        }

        .metadata-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 34px;
        }

        .meta-card {
          padding: 16px 17px;
          border: 1px solid rgba(121, 222, 255, 0.11);
          border-radius: 17px;
          background: rgba(2, 8, 14, 0.42);
        }

        .meta-label {
          color: #637a8d;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .meta-value {
          margin-top: 8px;
          color: #e9f6ff;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.45;
        }

        .principles-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin: 22px 0 0;
        }

        .principle-card {
          position: relative;
          overflow: hidden;
          min-height: 215px;
          padding: 24px;
          border: 1px solid rgba(121, 222, 255, 0.12);
          border-radius: 23px;
          background: linear-gradient(145deg, rgba(9, 22, 35, 0.88), rgba(5, 13, 22, 0.72));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.035);
        }

        .principle-card:nth-child(2) { border-color: rgba(57, 242, 161, 0.14); }
        .principle-card:nth-child(3) { border-color: rgba(159, 140, 255, 0.16); }
        .principle-card:nth-child(4) { border-color: rgba(255, 200, 107, 0.14); }

        .principle-orbit {
          position: absolute;
          width: 120px;
          height: 120px;
          right: -54px;
          top: -52px;
          border-radius: 50%;
          border: 1px solid rgba(84, 232, 255, 0.18);
          box-shadow: 0 0 45px rgba(84, 232, 255, 0.04);
        }

        .principle-eyebrow {
          color: #6d8799;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .principle-card h3 {
          margin: 16px 0 10px;
          color: #f4fbff;
          font-size: 20px;
          letter-spacing: -0.025em;
        }

        .principle-card p {
          margin: 0;
          color: #8da3b5;
          font-size: 14px;
          line-height: 1.7;
        }

        .content-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 280px;
          gap: 24px;
          align-items: start;
          margin-top: 24px;
        }

        .sections {
          display: grid;
          gap: 18px;
        }

        .terms-section {
          position: relative;
          overflow: hidden;
          padding: 28px;
          border: 1px solid rgba(121, 222, 255, 0.12);
          border-radius: 25px;
          background: linear-gradient(145deg, rgba(7, 18, 29, 0.88), rgba(4, 12, 20, 0.84));
          box-shadow:
            0 18px 50px rgba(0, 0, 0, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.028);
        }

        .terms-section::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, transparent, var(--ta-cyan), transparent);
          opacity: 0.7;
        }

        .terms-section--green::before { background: linear-gradient(180deg, transparent, var(--ta-green), transparent); }
        .terms-section--violet::before { background: linear-gradient(180deg, transparent, var(--ta-violet), transparent); }
        .terms-section--amber::before { background: linear-gradient(180deg, transparent, var(--ta-amber), transparent); }

        .section-head {
          display: flex;
          align-items: center;
          gap: 16px;
          padding-bottom: 19px;
          margin-bottom: 20px;
          border-bottom: 1px solid rgba(255,255,255,0.055);
        }

        .section-number {
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(84, 232, 255, 0.24);
          border-radius: 13px;
          color: #bff7ff;
          background: rgba(84, 232, 255, 0.055);
          font-size: 12px;
          font-weight: 900;
          box-shadow: inset 0 0 22px rgba(84, 232, 255, 0.04);
        }

        .section-kicker {
          color: #61798c;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .section-head h2 {
          margin: 5px 0 0;
          color: #f5fbff;
          font-size: 24px;
          line-height: 1.2;
          letter-spacing: -0.03em;
        }

        .section-body {
          color: #9cafbf;
          font-size: 15px;
          line-height: 1.8;
        }

        .section-body p {
          margin: 0 0 16px;
        }

        .section-body p:last-child {
          margin-bottom: 0;
        }

        .section-body strong {
          color: #eefaff;
        }

        .terms-list {
          display: grid;
          gap: 9px;
          padding: 0;
          margin: 18px 0;
          list-style: none;
        }

        .terms-list li {
          position: relative;
          padding: 10px 14px 10px 35px;
          border: 1px solid rgba(255,255,255,0.055);
          border-radius: 12px;
          background: rgba(0,0,0,0.16);
          color: #a7bac8;
        }

        .terms-list li::before {
          content: "";
          position: absolute;
          left: 14px;
          top: 17px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--ta-cyan);
          box-shadow: 0 0 11px rgba(84, 232, 255, 0.7);
        }

        .chain {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 17px;
          padding: 18px;
          border: 1px solid rgba(84, 232, 255, 0.12);
          border-radius: 16px;
          background: rgba(84, 232, 255, 0.035);
          color: #d8faff;
          font-size: 13px;
          font-weight: 850;
          letter-spacing: 0.025em;
        }

        .arrow {
          color: #3f6c7a;
        }

        .callout {
          margin-top: 18px;
          padding: 19px 20px;
          border: 1px solid rgba(84, 232, 255, 0.14);
          border-radius: 16px;
          background:
            linear-gradient(90deg, rgba(84,232,255,0.06), rgba(57,242,161,0.025));
          color: #d9edf8;
          font-size: 14px;
          font-weight: 720;
          line-height: 1.65;
        }

        .warning-callout {
          border-color: rgba(255, 200, 107, 0.19);
          background: rgba(255, 200, 107, 0.045);
          color: #f8e4bd;
        }

        .provenance-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 18px;
        }

        .provenance-card {
          display: flex;
          gap: 12px;
          min-height: 112px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.065);
          border-radius: 15px;
          background: rgba(0,0,0,0.17);
        }

        .provenance-dot {
          flex: 0 0 auto;
          width: 8px;
          height: 8px;
          margin-top: 5px;
          border-radius: 999px;
          background: #7890a1;
          box-shadow: 0 0 14px rgba(120,144,161,0.5);
        }

        .provenance-card--cyan .provenance-dot { background: var(--ta-cyan); box-shadow: 0 0 14px rgba(84,232,255,.7); }
        .provenance-card--green .provenance-dot { background: var(--ta-green); box-shadow: 0 0 14px rgba(57,242,161,.7); }
        .provenance-card--violet .provenance-dot { background: var(--ta-violet); box-shadow: 0 0 14px rgba(159,140,255,.7); }
        .provenance-card--amber .provenance-dot { background: var(--ta-amber); box-shadow: 0 0 14px rgba(255,200,107,.7); }

        .provenance-label {
          color: #dff7ff;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.09em;
        }

        .provenance-card p {
          margin: 8px 0 0;
          color: #8298a9;
          font-size: 13px;
          line-height: 1.55;
        }

        .finding {
          margin-top: 18px;
          padding: 21px;
          border: 1px solid rgba(57, 242, 161, 0.19);
          border-radius: 18px;
          background:
            linear-gradient(135deg, rgba(57,242,161,0.065), rgba(84,232,255,0.025));
        }

        .finding-label {
          color: var(--ta-green);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .finding-text {
          margin-top: 11px;
          color: #e7fff6;
          font-size: 16px;
          font-weight: 780;
          line-height: 1.65;
        }

        .fee-table {
          margin-top: 16px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.075);
          border-radius: 17px;
        }

        .fee-row {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(130px, 0.65fr) minmax(135px, 0.65fr);
          gap: 12px;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.055);
          background: rgba(0,0,0,0.11);
        }

        .fee-row:last-child {
          border-bottom: 0;
        }

        .fee-row--head {
          color: #6f8799;
          background: rgba(84,232,255,0.035);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .fee-name {
          color: #aabccb;
          font-size: 13px;
          font-weight: 680;
        }

        .fee-value {
          color: #eefaff;
          font-size: 13px;
          font-weight: 850;
        }

        .fee-state {
          justify-self: start;
          padding: 5px 8px;
          border: 1px solid rgba(57,242,161,0.12);
          border-radius: 999px;
          color: #8ff7c8;
          background: rgba(57,242,161,0.035);
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .sidebar {
          position: sticky;
          top: 20px;
          display: grid;
          gap: 14px;
        }

        .side-panel {
          padding: 20px;
          border: 1px solid rgba(121, 222, 255, 0.11);
          border-radius: 19px;
          background: rgba(5, 15, 24, 0.84);
          backdrop-filter: blur(16px);
        }

        .side-eyebrow {
          color: #5f7b8d;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        .side-panel h3 {
          margin: 10px 0 8px;
          color: #eaf8ff;
          font-size: 17px;
          letter-spacing: -0.02em;
        }

        .side-panel p {
          margin: 0;
          color: #7f96a8;
          font-size: 12px;
          line-height: 1.65;
        }

        .side-links {
          display: grid;
          gap: 7px;
          margin-top: 15px;
        }

        .side-link {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 10px 11px;
          border-radius: 11px;
          color: #9eb2c1;
          background: rgba(255,255,255,0.024);
          font-size: 11px;
          font-weight: 720;
          text-decoration: none;
          transition: 180ms ease;
        }

        .side-link:hover {
          color: white;
          background: rgba(84,232,255,0.06);
          transform: translateX(2px);
        }

        .footer-card {
          position: relative;
          overflow: hidden;
          margin-top: 24px;
          padding: 34px;
          border: 1px solid rgba(57,242,161,0.14);
          border-radius: 27px;
          background:
            radial-gradient(circle at 90% 0%, rgba(57,242,161,0.10), transparent 20rem),
            linear-gradient(135deg, rgba(8,24,32,0.92), rgba(5,13,21,0.88));
        }

        .footer-card h2 {
          margin: 0;
          max-width: 760px;
          color: #f1fbff;
          font-size: 30px;
          letter-spacing: -0.035em;
        }

        .footer-card p {
          max-width: 820px;
          margin: 15px 0 0;
          color: #8da5b5;
          font-size: 15px;
          line-height: 1.75;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 23px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 43px;
          padding: 0 16px;
          border: 1px solid rgba(84,232,255,0.18);
          border-radius: 12px;
          color: #e9fbff;
          background: rgba(84,232,255,0.055);
          font-size: 12px;
          font-weight: 850;
          text-decoration: none;
          transition: 180ms ease;
        }

        .button:hover {
          transform: translateY(-1px);
          border-color: rgba(84,232,255,0.38);
          background: rgba(84,232,255,0.095);
          box-shadow: 0 12px 30px rgba(41,167,255,0.10);
        }

        .button-primary {
          border-color: rgba(57,242,161,0.22);
          color: #eafff6;
          background: linear-gradient(135deg, rgba(57,242,161,0.12), rgba(84,232,255,0.07));
        }

        @keyframes drift {
          0% { transform: translate3d(0, 0, 0) scale(0.8); opacity: 0.25; }
          50% { transform: translate3d(30px, -50px, 0) scale(1.4); opacity: 0.8; }
          100% { transform: translate3d(70px, -110px, 0) scale(0.7); opacity: 0.12; }
        }

        @keyframes orbitPulse {
          0%, 100% { transform: scale(1); opacity: 0.34; }
          50% { transform: scale(1.08); opacity: 0.7; }
        }

        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(0.9); opacity: 0.68; }
          50% { transform: scale(1.18); opacity: 1; }
        }

        @media (max-width: 1050px) {
          .principles-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .content-grid {
            grid-template-columns: 1fr;
          }

          .sidebar {
            position: static;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .container {
            width: min(100% - 22px, 1180px);
            padding-top: 12px;
          }

          .top-nav {
            align-items: flex-start;
            flex-direction: column;
          }

          .nav-links {
            justify-content: flex-start;
          }

          .hero {
            padding: 30px 22px;
            border-radius: 24px;
          }

          .hero h1 {
            font-size: clamp(40px, 13vw, 58px);
          }

          .hero-lead {
            font-size: 16px;
          }

          .metadata-grid,
          .principles-grid,
          .provenance-grid,
          .sidebar {
            grid-template-columns: 1fr;
          }

          .terms-section {
            padding: 22px 18px;
          }

          .section-head {
            align-items: flex-start;
          }

          .fee-row {
            grid-template-columns: 1fr;
            gap: 5px;
          }

          .fee-row--head {
            display: none;
          }

          .footer-card {
            padding: 26px 21px;
          }

          .footer-card h2 {
            font-size: 25px;
          }
        }
      `}</style>

      <main className="terms-page">
        <div className="ambient" aria-hidden="true">
          <span className="star" />
          <span className="star" />
          <span className="star" />
          <span className="star" />
          <span className="star" />
          <span className="star" />
          <span className="star" />
          <span className="star" />
          <span className="orb orb-one" />
          <span className="orb orb-two" />
        </div>

        <div className="container">
          <nav className="top-nav" aria-label="TA14 Authority">
            <Link href="/" className="brand">
              <span className="brand-mark" aria-hidden="true" />
              <span>TA14 Authority</span>
            </Link>

            <div className="nav-links">
              <Link href="/" className="nav-link">
                Exchange
              </Link>
              <Link href="/governance/register" className="nav-link">
                Register governance
              </Link>
              <Link href="/governance/workspace" className="nav-link">
                Governance workspace
              </Link>
              <Link href="/artifacts" className="nav-link">
                Execution artifacts
              </Link>
            </div>
          </nav>

          <header className="hero">
            <div className="hero-kicker">
              <span className="pulse-dot" aria-hidden="true" />
              TA14 Public Governance Instrument
            </div>

            <div className="instrument-id">
              TA14-RET-001 · VERSION 1.0 · EFFECTIVE AUGUST 7, 2026
            </div>

            <h1>Registration &amp; Evidence Terms</h1>

            <p className="hero-lead">
              Public operating terms governing AI governance registration,
              evidence submission, findings, publication, withdrawal,
              versioning, intellectual-property boundaries, fees, and
              institutional recordkeeping inside the TA14 AI Governance
              Exchange.
            </p>

            <div className="metadata-grid">
              <div className="meta-card">
                <div className="meta-label">Status</div>
                <div className="meta-value">
                  Public Governance Instrument
                </div>
              </div>

              <div className="meta-card">
                <div className="meta-label">Instrument</div>
                <div className="meta-value">TA14-RET-001</div>
              </div>

              <div className="meta-card">
                <div className="meta-label">Issued by</div>
                <div className="meta-value">TA14 Authority</div>
              </div>

              <div className="meta-card">
                <div className="meta-label">Applies to</div>
                <div className="meta-value">
                  TA14 AI Governance Exchange
                </div>
              </div>
            </div>
          </header>

          <section className="principles-grid" aria-label="Core boundaries">
            {principles.map((principle) => (
              <PrincipleCard key={principle.eyebrow} {...principle} />
            ))}
          </section>

          <div className="content-grid">
            <div className="sections">
              <Section number="01" title="Purpose">
                <p>
                  These Terms establish the public operating boundary for
                  registration, evidence submission, evidence preservation,
                  governed review, findings, publication, withdrawal,
                  versioning, intellectual-property treatment, and
                  institutional recordkeeping within the TA14 AI Governance
                  Exchange.
                </p>

                <p>
                  They are intended to be understandable by a third party who
                  has not participated in private discussions with TA14
                  Authority or a registrant.
                </p>

                <div className="callout">
                  No private conversation, direct message, meeting, email, or
                  unpublished understanding is required to interpret the core
                  boundaries stated here.
                </div>
              </Section>

              <Section number="02" title="What registration means">
                <p>
                  Governance Entity Registration establishes an attributable
                  institutional record for an AI governance entity.
                </p>

                <ul className="terms-list">
                  <li>Governance name, identity, and category</li>
                  <li>Steward, founder, claimant, or accountable party</li>
                  <li>Version and effective date</li>
                  <li>Jurisdiction and operational scope</li>
                  <li>Bounded claims and explicit non-claims</li>
                  <li>Declared limitations and implementation state</li>
                  <li>Evidence and public-reference relationships</li>
                  <li>Ownership or stewardship declarations</li>
                  <li>Version lineage and subsequent governed activity</li>
                </ul>

                <div className="callout">
                  Registration creates an attributable baseline. It is not
                  itself a substantive finding about the correctness of that
                  baseline.
                </div>
              </Section>

              <Section
                number="03"
                title="What registration does not mean"
                accent="amber"
              >
                <p>
                  Registration does not mean that TA14 Authority has certified,
                  approved, endorsed, or universally validated the registered
                  governance entity.
                </p>

                <ul className="terms-list">
                  <li>No certification or endorsement</li>
                  <li>No automatic architectural validation</li>
                  <li>No verification of every submitted claim</li>
                  <li>No automatic regulatory or legal compliance finding</li>
                  <li>No automatic technical-correctness finding</li>
                  <li>No automatic cybersecurity-adequacy finding</li>
                  <li>No automatic production-readiness finding</li>
                  <li>No adjudication of ownership as a matter of law</li>
                  <li>
                    No automatic determination that a specific execution is
                    admissible
                  </li>
                  <li>No superiority finding over another architecture</li>
                </ul>

                <div className="callout warning-callout">
                  A registration identifier is an institutional identity and
                  chronology mechanism. It is not a quality mark.
                </div>
              </Section>

              <Section
                number="04"
                title="Registration before artifact registration"
                accent="green"
              >
                <p>
                  An execution artifact, evidence artifact, receipt,
                  conformance record, demonstration record, or related governed
                  object may be attributed to an AI governance entity only
                  after the governance entity has an attributable registration.
                </p>

                <div className="chain">
                  <span>Governance Entity Registration</span>
                  <span className="arrow">→</span>
                  <span>Attributable Governance Identity</span>
                  <span className="arrow">→</span>
                  <span>Artifact Registration</span>
                </div>
              </Section>

              <Section
                number="05"
                title="Closed implementations and intellectual property"
                accent="violet"
              >
                <p>
                  A closed implementation may remain closed. Registration does
                  not require disclosure of source code, proprietary models,
                  confidential internals, trade secrets, private datasets,
                  credentials, customer materials, or other non-public
                  implementation details merely because the governance entity
                  is registered.
                </p>

                <p>
                  Registration does not transfer ownership of the
                  registrant&apos;s intellectual property to TA14 Authority.
                </p>

                <div className="callout">
                  A registrant may submit a bounded evidence surface without
                  surrendering the underlying proprietary implementation.
                </div>
              </Section>

              <Section number="06" title="Evidence is admitted, not assumed">
                <ul className="terms-list">
                  <li>
                    A registration statement does not automatically become
                    independently established.
                  </li>
                  <li>
                    A runtime output does not automatically establish the
                    surrounding chronology that produced it.
                  </li>
                  <li>
                    A hash does not automatically prove the original
                    information was truthful when recorded.
                  </li>
                  <li>
                    A preserved record does not automatically establish
                    independent attestation.
                  </li>
                </ul>
              </Section>

              <Section
                number="07"
                title="Evidence provenance"
                accent="violet"
              >
                <p>
                  Material evidence used in a finding should identify where it
                  came from and what kind of independence, if any, has actually
                  been established.
                </p>

                <div className="provenance-grid">
                  {provenanceCards.map((item) => (
                    <ProvenanceCard key={item.label} {...item} />
                  ))}
                </div>
              </Section>

              <Section
                number="08"
                title="Material qualifications travel with findings"
                accent="green"
              >
                <p>
                  A material limitation that changes the meaning of a finding
                  must remain attached to the finding it qualifies.
                </p>

                <div className="finding">
                  <div className="finding-label">
                    Example portable finding
                  </div>
                  <div className="finding-text">
                    SUPPORTED — registrant-produced evidence; independently
                    reproducible under the reviewed test conditions;
                    execution-path coverage not independently established.
                  </div>
                </div>

                <p>
                  The qualification is part of the finding. It is not optional
                  explanatory metadata.
                </p>
              </Section>

              <Section
                number="09"
                title="No retrospective evidence manufacturing"
                accent="amber"
              >
                <p>
                  TA14 Authority does not require a registrant to manufacture
                  evidence after the fact merely to make an evidentiary chain
                  appear complete.
                </p>

                <div className="callout warning-callout">
                  NOT PRESERVED / EVIDENTIARY LIMITATION
                </div>

                <p>
                  A later reconstruction may be considered only when clearly
                  identified as a reconstruction rather than contemporaneous
                  evidence.
                </p>
              </Section>

              <Section
                number="10"
                title="Frozen records and later versions"
                accent="violet"
              >
                <div className="chain">
                  <span>Frozen Version</span>
                  <span className="arrow">→</span>
                  <span>Preserved Finding</span>
                  <span className="arrow">→</span>
                  <span>Later Version</span>
                </div>

                <p>
                  A later version does not automatically inherit an earlier
                  PASS, favorable finding, evidence sufficiency, production
                  readiness, or independent verification.
                </p>
              </Section>

              <Section
                number="11"
                title="Publication and withdrawal"
                accent="cyan"
              >
                <p>
                  Evidence may carry an explicit visibility boundary including
                  PUBLIC, CONTROLLED, PRIVATE, REGISTRY-ONLY, REVIEW-ONLY, or
                  WITHHELD FROM PUBLICATION.
                </p>

                <p>
                  Withdrawal from future voluntary participation does not
                  automatically erase historical institutional events that
                  already occurred.
                </p>

                <div className="callout">
                  Withdrawal from continuing participation is not the same as
                  erasure of historical chronology.
                </div>
              </Section>

              <Section
                number="12"
                title="Corrections and participant responses"
                accent="green"
              >
                <p>
                  A participant may request correction of an objective record
                  error without agreeing with TA14 Authority&apos;s substantive
                  finding.
                </p>

                <div className="chain">
                  <span>TA14 Finding</span>
                  <span className="arrow">→</span>
                  <span>Participant Response</span>
                </div>

                <p>
                  Separate voices remain separately attributable. A
                  participant response does not silently rewrite the original
                  TA14 finding.
                </p>
              </Section>

              <Section number="13" title="Fees" accent="green">
                <p>
                  A participant should be able to determine the financial
                  boundary before committing to a TA14 pathway.
                </p>

                <div className="fee-table">
                  <div className="fee-row fee-row--head">
                    <div>Activity</div>
                    <div>Current fee</div>
                    <div>Fee state</div>
                  </div>

                  {feeRows.map(([name, fee, state]) => (
                    <div className="fee-row" key={name}>
                      <div className="fee-name">{name}</div>
                      <div className="fee-value">{fee}</div>
                      <div className="fee-state">{state}</div>
                    </div>
                  ))}
                </div>

                <div className="callout">
                  Registration does not create an undisclosed obligation to
                  purchase later TA14 services. Payment purchases agreed review
                  work—not a favorable finding.
                </div>
              </Section>

              <Section
                number="14"
                title="What attests TA14 Authority?"
                accent="violet"
              >
                <p>
                  TA14 Authority does not claim that a record becomes
                  independently verified merely because TA14 produced, stored,
                  signed, hashed, published, or preserved it.
                </p>

                <div className="finding">
                  <div className="finding-label">
                    Institutional independence boundary
                  </div>
                  <div className="finding-text">
                    Integrity and independence are separate properties.
                  </div>
                </div>

                <div className="callout">
                  Who independently attests the attester?
                </div>

                <p>
                  TA14 Authority does not claim to have solved that recursion
                  merely by operating the Registry. Where independent
                  verification terminates, that boundary should remain visible.
                </p>
              </Section>

              <Section
                number="15"
                title="TA14 Authority may be wrong"
                accent="amber"
              >
                <p>
                  TA14 Authority does not claim infallibility. A TA14 finding
                  may contain a factual, evidentiary, attribution,
                  interpretation, or methodological error.
                </p>

                <p>
                  Where a material error is identified, a correction may be
                  issued while preserving the relationship between the original
                  and corrected records.
                </p>

                <div className="callout warning-callout">
                  Correction is not silent overwrite.
                </div>
              </Section>

              <Section
                number="16"
                title="Core institutional principles"
                accent="green"
              >
                <div className="provenance-grid">
                  <ProvenanceCard
                    label="REGISTRATION"
                    text="Registration establishes attributable identity, not correctness."
                    tone="cyan"
                  />
                  <ProvenanceCard
                    label="EVIDENCE"
                    text="No admissible evidence. No admissible execution."
                    tone="green"
                  />
                  <ProvenanceCard
                    label="PROVENANCE"
                    text="Distinguish who produced evidence from who evaluated it."
                    tone="violet"
                  />
                  <ProvenanceCard
                    label="LIMITATION"
                    text="A material limitation travels with the finding it limits."
                    tone="amber"
                  />
                  <ProvenanceCard
                    label="VERSION"
                    text="A later implementation does not silently rewrite an earlier frozen record."
                    tone="cyan"
                  />
                  <ProvenanceCard
                    label="INDEPENDENCE"
                    text="Integrity is not independence."
                    tone="green"
                  />
                </div>
              </Section>
            </div>

            <aside className="sidebar">
              <div className="side-panel">
                <div className="side-eyebrow">Instrument identity</div>
                <h3>TA14-RET-001</h3>
                <p>
                  Registration &amp; Evidence Terms, Version 1.0. Effective
                  August 7, 2026.
                </p>
              </div>

              <div className="side-panel">
                <div className="side-eyebrow">Core sequence</div>
                <h3>Identity before artifact.</h3>
                <p>
                  Register the governance entity before attaching execution or
                  evidence artifacts to it.
                </p>
              </div>

              <div className="side-panel">
                <div className="side-eyebrow">Quick routes</div>
                <div className="side-links">
                  <Link href="/governance/register" className="side-link">
                    <span>Register governance</span>
                    <span>→</span>
                  </Link>

                  <Link href="/governance/workspace" className="side-link">
                    <span>Governance workspace</span>
                    <span>→</span>
                  </Link>

                  <Link href="/artifacts" className="side-link">
                    <span>Execution artifacts</span>
                    <span>→</span>
                  </Link>

                  <Link href="/artifacts/verify" className="side-link">
                    <span>Verification center</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              <div className="side-panel">
                <div className="side-eyebrow">Operating rule</div>
                <h3>No hidden upgrade.</h3>
                <p>
                  Registration does not silently become certification. Evidence
                  does not silently become independent proof. A limitation does
                  not disappear when a finding travels.
                </p>
              </div>
            </aside>
          </div>

          <footer className="footer-card">
            <div className="hero-kicker">
              <span className="pulse-dot" aria-hidden="true" />
              Inspectable institutional boundary
            </div>

            <h2>
              TA14 Authority should not ask another governance architecture to
              live under an evidentiary discipline that TA14 Authority is
              unwilling to apply to itself.
            </h2>

            <p>
              The purpose of these Terms is not to make every governance claim
              appear strong. It is to preserve attributable identity, evidence
              provenance, material limitations, version lineage, withdrawal
              boundaries, and the difference between integrity and
              independence.
            </p>

            <div className="actions">
              <Link
                href="/governance/register"
                className="button button-primary"
              >
                Begin governance registration
              </Link>

              <Link href="/" className="button">
                Return to AI Governance Exchange
              </Link>

              <Link href="/artifacts" className="button">
                Inspect execution artifacts
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
