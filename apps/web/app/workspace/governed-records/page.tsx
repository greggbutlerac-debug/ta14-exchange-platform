"use client";

import Link from "next/link";

const actions = [
  {
    title: "Create a Governed Record",
    description:
      "Start a new attributable record with declared scope, evidence, limitations, ownership, version, and preservation state.",
    href: "/workspace/governed-records/builder",
    action: "Open builder",
  },
  {
    title: "Interpret an Existing Record",
    description:
      "Bring an existing record and receive a bounded interpretation that preserves what the evidence proves and what remains inadmissible.",
    href: "/workspace/governed-records/interpreter",
    action: "Open interpreter",
  },
  {
    title: "Review Continuity",
    description:
      "Examine whether evidence remains connected across time, custody, version, source, and declared scope.",
    href: "/workspace/governed-records/continuity-review",
    action: "Open continuity review",
  },
  {
    title: "Review Execution Readiness",
    description:
      "Determine whether the governed record chain is sufficient to support a consequential execution route.",
    href: "/workspace/governed-records/execution-readiness",
    action: "Open readiness review",
  },
];

const recordChain = [
  "Governed Record",
  "Interpretation",
  "Continuity Review",
  "Evidence Review",
  "Authority Review",
  "Admissibility Review",
  "Execution Readiness",
  "Execution Record",
  "Outcome Verification",
];

export default function GovernedRecordsPage() {
  return (
    <main>
      <div className="stars starsOne" />
      <div className="stars starsTwo" />
      <div className="glow glowOne" />
      <div className="glow glowTwo" />

      <header className="topbar shell">
        <Link href="/" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>Governed Records</strong>
            <small>TA-14 AI Governance Exchange</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Home</Link>
          <Link href="/workspace/ai-governance">AI Governance</Link>
          <Link href="/workspace/environmental-records">
            Environmental Records
          </Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
        </nav>
      </header>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">GOVERNED RECORDS WORKSPACE</p>
          <h1>Preserve the record before anyone interprets the claim.</h1>
          <p className="lead">
            Create, upload, interpret, review, and preserve records without
            allowing evidence, diagnosis, optimization, execution, or outcome
            claims to collapse into one another.
          </p>

          <div className="heroActions">
            <Link
              className="primaryButton"
              href="/workspace/governed-records/builder"
            >
              Create a Governed Record
              <span>→</span>
            </Link>
            <Link
              className="secondaryButton"
              href="/workspace/governed-records/interpreter"
            >
              Interpret a Record
            </Link>
          </div>
        </div>

        <div className="recordVisual" aria-hidden="true">
          <div className="recordCard cardBack">
            <span>Version 01</span>
          </div>
          <div className="recordCard cardMiddle">
            <span>Evidence Bound</span>
          </div>
          <div className="recordCard cardFront">
            <div className="recordSeal">GR</div>
            <strong>Governed Record</strong>
            <small>Attributable · Bounded · Preserved</small>
            <div className="recordLines">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        </div>
      </section>

      <section className="separation shell">
        <p className="eyebrow">INTENTIONAL SEPARATION</p>
        <h2>The record is not the interpretation, diagnosis, or optimization.</h2>
        <p>
          TA-14 keeps each layer separate because admissibility depends on
          preserving what actually happened, what was later interpreted, what
          was determined, and what was eventually executed.
        </p>

        <div className="separationGrid">
          <article>
            <span>01</span>
            <h3>Record</h3>
            <p>What was observed, submitted, measured, declared, or preserved.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Interpretation</h3>
            <p>What the record can support within declared evidence boundaries.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Determination</h3>
            <p>What a bounded reviewer or rule system concludes from admissible evidence.</p>
          </article>
          <article>
            <span>04</span>
            <h3>Execution</h3>
            <p>What was authorized, committed, performed, and preserved afterward.</p>
          </article>
        </div>
      </section>

      <section className="actions shell">
        <div className="sectionIntro">
          <p className="eyebrow">BEGIN HERE</p>
          <h2>Choose the record task you need.</h2>
          <p>
            Each page creates a distinct governed artifact and preserves its own
            boundaries, history, and review state.
          </p>
        </div>

        <div className="actionGrid">
          {actions.map((item, index) => (
            <article key={item.title}>
              <span className="number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href={item.href}>
                {item.action}
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="chainSection shell">
        <div>
          <p className="eyebrow">COMPLETE RECORD LIFECYCLE</p>
          <h2>A governed record can remain traceable through execution and outcome.</h2>
          <p>
            The record lifecycle does not end when a file is uploaded. It can
            continue through interpretation, continuity, admissibility,
            execution readiness, execution, and outcome verification.
          </p>
        </div>

        <div className="chain">
          {recordChain.map((item, index) => (
            <div className="chainItem" key={item}>
              <span>{item}</span>
              {index < recordChain.length - 1 && <b>↓</b>}
            </div>
          ))}
        </div>
      </section>

      <section className="euSection shell">
        <div>
          <p className="eyebrow">EU AI ACT</p>
          <h2>Preserve records that support applicable EU AI Act governance work.</h2>
          <p>
            Review relevant requirements, identify the records needed to
            support each obligation, and preserve the evidence, limitations,
            versions, and review history associated with the declared approach.
          </p>
        </div>

        <Link
          className="euButton"
          href="/workspace/governed-records/eu-ai-act"
        >
          EU AI Act Record Requirements
          <span>→</span>
        </Link>
      </section>

      <section className="boundary shell">
        <div>
          <p className="eyebrow">BOUNDARY</p>
          <h2>A preserved record does not automatically prove compliance or correctness.</h2>
        </div>
        <p>
          Governed Records preserve attributable evidence and review history.
          They do not certify that a system, organization, route, or outcome is
          valid merely because a record exists.
        </p>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">CREATE THE RECORD</p>
          <h2>Start with what can be preserved.</h2>
          <p>
            Build the record first, then allow each later interpretation,
            review, determination, and execution layer to remain separately
            attributable.
          </p>
        </div>

        <Link
          className="primaryButton"
          href="/workspace/governed-records/builder"
        >
          Open Governed Record Builder
          <span>→</span>
        </Link>
      </section>

      <footer className="shell">
        <span>TA-14 Authority Governance Institution</span>
        <Link href="/">Return to the four doors</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #040914;
        }

        :global(body) {
          margin: 0;
          color: #f7fbff;
          background:
            radial-gradient(circle at 10% 8%, rgba(44, 118, 230, 0.13), transparent 28%),
            radial-gradient(circle at 90% 26%, rgba(47, 188, 255, 0.12), transparent 26%),
            linear-gradient(180deg, #040914 0%, #07101f 50%, #050914 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .shell {
          width: min(1260px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .stars {
          position: fixed;
          inset: -12%;
          pointer-events: none;
          z-index: -4;
          opacity: 0.34;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.4px);
          background-size: 92px 92px;
          animation: starDrift 34s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(78,173,255,.62) 0 1px, transparent 1.4px);
          background-size: 156px 156px;
          background-position: 39px 58px;
          animation: starDrift 48s linear infinite reverse;
        }

        .glow {
          position: fixed;
          width: 470px;
          height: 470px;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.12;
          z-index: -3;
          animation: glowMove 14s ease-in-out infinite alternate;
        }

        .glowOne {
          left: -170px;
          top: -180px;
          background: #368dff;
        }

        .glowTwo {
          right: -180px;
          top: 44%;
          background: #38c8ff;
          animation-delay: -6s;
        }

        .topbar {
          min-height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border-bottom: 1px solid rgba(132, 154, 188, 0.16);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 64px;
          height: 38px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          color: #04111d;
          background: linear-gradient(135deg, #58a9ff, #b9e9ff);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.05em;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          color: #7e91a6;
          margin-top: 2px;
        }

        nav {
          display: flex;
          gap: 22px;
        }

        nav a,
        footer a {
          color: #a9b8ca;
          text-decoration: none;
          font-size: 14px;
        }

        .hero {
          min-height: 650px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 50px;
          align-items: center;
          padding: 76px 0;
        }

        .eyebrow {
          margin: 0;
          color: #63b5ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
        }

        h1 {
          max-width: 850px;
          margin: 18px 0 22px;
          font-size: clamp(48px, 7vw, 90px);
          line-height: 0.98;
          letter-spacing: -0.06em;
        }

        .lead {
          max-width: 760px;
          margin: 0;
          color: #9fb0c4;
          font-size: 18px;
          line-height: 1.68;
        }

        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .primaryButton,
        .secondaryButton,
        .euButton {
          min-height: 54px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          border-radius: 14px;
          padding: 0 20px;
          text-decoration: none;
          font-weight: 850;
        }

        .primaryButton {
          color: #04111d;
          background: linear-gradient(135deg, #5caeff, #c3edff);
          box-shadow: 0 14px 38px rgba(71, 160, 255, 0.18);
        }

        .secondaryButton {
          color: #dce8f4;
          border: 1px solid rgba(130, 162, 188, 0.25);
          background: rgba(255, 255, 255, 0.035);
        }

        .recordVisual {
          min-height: 450px;
          position: relative;
          display: grid;
          place-items: center;
          perspective: 1100px;
        }

        .recordCard {
          width: 290px;
          height: 380px;
          border-radius: 28px;
          position: absolute;
          border: 1px solid rgba(100, 177, 255, 0.35);
          background:
            linear-gradient(180deg, rgba(20, 38, 68, 0.94), rgba(6, 14, 28, 0.98));
          box-shadow:
            0 30px 70px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .cardBack {
          transform: translate(-72px, -30px) rotateY(10deg) rotateZ(-6deg);
          opacity: 0.48;
          padding: 22px;
        }

        .cardMiddle {
          transform: translate(58px, -12px) rotateY(-10deg) rotateZ(5deg);
          opacity: 0.7;
          padding: 22px;
        }

        .cardFront {
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 30px;
          animation: floatCard 4s ease-in-out infinite alternate;
        }

        .recordSeal {
          width: 98px;
          height: 98px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 2px solid #bde8ff;
          background: rgba(24, 77, 127, 0.28);
          box-shadow:
            0 0 28px rgba(76, 168, 255, 0.3),
            inset 0 0 22px rgba(76, 168, 255, 0.18);
          color: #dff5ff;
          font-size: 28px;
          font-weight: 900;
        }

        .cardFront strong {
          margin-top: 24px;
          font-size: 24px;
        }

        .cardFront small {
          color: #79bdf5;
          margin-top: 6px;
        }

        .recordLines {
          width: 100%;
          display: grid;
          gap: 10px;
          margin-top: 28px;
        }

        .recordLines i {
          height: 7px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(94, 176, 255, 0.5),
            rgba(94, 176, 255, 0.08)
          );
        }

        .recordLines i:nth-child(2) {
          width: 82%;
        }

        .recordLines i:nth-child(3) {
          width: 68%;
        }

        .recordLines i:nth-child(4) {
          width: 88%;
        }

        .separation,
        .chainSection,
        .euSection,
        .boundary,
        .finalCta {
          border: 1px solid rgba(131, 155, 189, 0.16);
          background:
            linear-gradient(180deg, rgba(12, 21, 36, 0.9), rgba(7, 13, 24, 0.94));
          border-radius: 26px;
          box-shadow: 0 22px 70px rgba(0, 0, 0, 0.22);
        }

        .separation {
          padding: 52px;
          text-align: center;
        }

        .separation h2,
        .sectionIntro h2,
        .chainSection h2,
        .euSection h2,
        .boundary h2,
        .finalCta h2 {
          margin: 14px 0 16px;
          font-size: clamp(32px, 5vw, 56px);
          line-height: 1.04;
          letter-spacing: -0.045em;
        }

        .separation > p:not(.eyebrow),
        .sectionIntro > p:not(.eyebrow),
        .chainSection p:not(.eyebrow),
        .euSection p:not(.eyebrow),
        .boundary > p,
        .finalCta p:not(.eyebrow) {
          color: #9fafc2;
          line-height: 1.68;
        }

        .separation > p:not(.eyebrow) {
          max-width: 790px;
          margin: 0 auto;
        }

        .separationGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 34px;
        }

        .separationGrid article {
          padding: 24px 20px;
          border-radius: 18px;
          border: 1px solid rgba(93, 173, 255, 0.16);
          background: rgba(61, 137, 218, 0.05);
          text-align: left;
        }

        .separationGrid span,
        .number {
          color: #63b5ff;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
        }

        .separationGrid h3 {
          margin: 16px 0 10px;
          font-size: 23px;
        }

        .separationGrid p {
          color: #9fafc2;
          line-height: 1.58;
          margin: 0;
        }

        .actions {
          padding: 90px 0;
        }

        .sectionIntro {
          max-width: 720px;
          margin-bottom: 34px;
        }

        .sectionIntro > p:not(.eyebrow) {
          margin: 0;
        }

        .actionGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .actionGrid article {
          min-height: 290px;
          padding: 30px;
          border-radius: 22px;
          border: 1px solid rgba(130, 154, 188, 0.17);
          background:
            linear-gradient(180deg, rgba(13, 22, 38, 0.86), rgba(7, 13, 24, 0.94));
          transition:
            transform 220ms ease,
            border-color 220ms ease;
        }

        .actionGrid article:hover {
          transform: translateY(-5px);
          border-color: rgba(82, 167, 255, 0.46);
        }

        .actionGrid h3 {
          margin: 18px 0 12px;
          font-size: 28px;
          letter-spacing: -0.03em;
        }

        .actionGrid p {
          color: #9eafc2;
          line-height: 1.65;
          min-height: 82px;
        }

        .actionGrid a {
          display: inline-flex;
          gap: 20px;
          color: #72baff;
          text-decoration: none;
          font-weight: 850;
        }

        .chainSection {
          padding: 42px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: start;
        }

        .chainSection h2 {
          font-size: clamp(30px, 4.5vw, 50px);
        }

        .chain {
          display: grid;
          gap: 8px;
        }

        .chainItem {
          display: grid;
          place-items: center;
          gap: 7px;
        }

        .chainItem span {
          width: 100%;
          padding: 12px 16px;
          border-radius: 13px;
          border: 1px solid rgba(87, 167, 255, 0.19);
          background: rgba(69, 139, 216, 0.06);
          color: #dcedff;
          text-align: center;
          font-size: 13px;
          font-weight: 800;
        }

        .chainItem b {
          color: #57aaff;
        }

        .euSection {
          margin-top: 22px;
          padding: 38px 42px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
        }

        .euSection > div {
          max-width: 820px;
        }

        .euSection h2 {
          font-size: clamp(28px, 4vw, 42px);
        }

        .euButton {
          flex: 0 0 auto;
          color: #f5fbff;
          border: 1px solid rgba(119, 164, 255, 0.34);
          background: rgba(75, 107, 171, 0.12);
        }

        .boundary {
          margin-top: 22px;
          padding: 42px;
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          gap: 36px;
          align-items: center;
        }

        .boundary h2 {
          font-size: clamp(28px, 4vw, 44px);
        }

        .boundary > p {
          margin: 0;
        }

        .finalCta {
          margin-top: 74px;
          padding: 54px 46px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .finalCta > div {
          max-width: 760px;
        }

        .finalCta h2 {
          font-size: clamp(36px, 5vw, 58px);
        }

        footer {
          min-height: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          color: #74869a;
          font-size: 12px;
        }

        @keyframes starDrift {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(90px, 140px, 0);
          }
        }

        @keyframes glowMove {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }
          to {
            transform: translate3d(55px, 35px, 0) scale(1.1);
          }
        }

        @keyframes floatCard {
          from {
            transform: translateY(-7px);
          }
          to {
            transform: translateY(8px);
          }
        }

        @media (max-width: 900px) {
          nav {
            display: none;
          }

          .hero,
          .chainSection,
          .boundary {
            grid-template-columns: 1fr;
          }

          .separationGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .euSection,
          .finalCta {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 680px) {
          .shell {
            width: min(100% - 20px, 1260px);
          }

          .hero {
            min-height: auto;
            padding: 58px 0;
          }

          .recordVisual {
            min-height: 440px;
            transform: scale(0.84);
          }

          .separation,
          .chainSection,
          .euSection,
          .boundary,
          .finalCta {
            padding: 28px 24px;
          }

          .separationGrid,
          .actionGrid {
            grid-template-columns: 1fr;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
