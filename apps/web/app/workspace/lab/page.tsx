import Link from "next/link";

export const metadata = {
  title: "Academy Lab | TA-14 Exchange Platform",
  description:
    "Practice AI governance route construction, diagnose admissibility failures, and transfer corrected routes into the TA-14 Route Builder.",
};

const LABS = [
  {
    id: "missing-evidence",
    number: "01",
    title: "Missing Evidence",
    classification: "HOLD",
    difficulty: "Foundation",
    summary:
      "A route reaches admissibility without enough evidence to support the proposed action.",
    objective:
      "Identify the missing record, restore evidentiary sufficiency, and determine whether execution can proceed.",
    focus: ["Reality", "Record", "Admissibility"],
  },
  {
    id: "broken-continuity",
    number: "02",
    title: "Broken Continuity",
    classification: "DENY",
    difficulty: "Intermediate",
    summary:
      "Evidence exists, but the route cannot prove that the record remained intact across the decision chain.",
    objective:
      "Locate the continuity break, determine whether it can be repaired, and prevent unsupported execution.",
    focus: ["Record", "Continuity", "Binding"],
  },
  {
    id: "invalid-authority",
    number: "03",
    title: "Invalid Authority",
    classification: "ESCALATE",
    difficulty: "Intermediate",
    summary:
      "The requested action appears valid, but the actor or system lacks sufficient authority to commit it.",
    objective:
      "Separate policy approval from execution legitimacy and route the action to the proper authority.",
    focus: ["Admissibility", "Binding", "Commit"],
  },
  {
    id: "changed-reality",
    number: "04",
    title: "Reality Changed",
    classification: "HOLD",
    difficulty: "Advanced",
    summary:
      "A route was admissible when approved, but the governing reality changed before execution.",
    objective:
      "Revalidate the route at runtime and determine whether prior approval remains legitimate.",
    focus: ["Reality", "Admissibility", "Execution"],
  },
  {
    id: "outcome-mismatch",
    number: "05",
    title: "Outcome Mismatch",
    classification: "DENY",
    difficulty: "Advanced",
    summary:
      "The recorded outcome does not correspond to the committed action or preserved execution evidence.",
    objective:
      "Compare commit, execution, and outcome records and identify the point where correspondence failed.",
    focus: ["Commit", "Execution", "Outcome"],
  },
  {
    id: "complete-route",
    number: "06",
    title: "Build a Complete Route",
    classification: "ALLOW",
    difficulty: "Capstone",
    summary:
      "Construct a complete consequence-bearing AI route from reality through independently reviewable outcome.",
    objective:
      "Create a route that remains admissible, bound, committed, executable, and replay-verifiable.",
    focus: ["Complete TA-14 Chain"],
  },
] as const;

const CHAIN = [
  "Reality",
  "Record",
  "Continuity",
  "Admissibility",
  "Binding",
  "Commit",
  "Execution",
  "Outcome",
];

export default function AcademyLabPage() {
  return (
    <main className="labPage">
      <header className="topbar">
        <div>
          <p className="breadcrumb">Workspace / Academy Lab</p>
          <h1>Academy Lab</h1>
        </div>

        <div className="topActions">
          <Link className="secondaryButton" href="/workspace">
            Back to Workspace
          </Link>

          <Link className="primaryButton" href="/workspace/build">
            Open Route Builder
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Guided AI governance practice</p>

          <h2>
            Learn admissible execution by finding what makes a route fail.
          </h2>

          <p>
            Each lab presents a consequence-bearing AI route with a deliberate
            governance defect. Review the complete chain, identify the failure,
            repair the route, and transfer the corrected structure into the
            live Route Builder.
          </p>

          <div className="heroActions">
            <a className="primaryButton" href="#labs">
              Choose a lab
            </a>

            <Link
              className="secondaryButton"
              href="/workspace/evaluation/lanes"
            >
              Review evaluation lanes
            </Link>
          </div>
        </div>

        <aside className="principlePanel">
          <p>Governing principle</p>
          <blockquote>
            No admissible evidence.
            <br />
            No admissible execution.
          </blockquote>

          <div className="classificationGrid">
            {["ALLOW", "HOLD", "DENY", "ESCALATE"].map((classification) => (
              <span
                data-classification={classification}
                key={classification}
              >
                {classification}
              </span>
            ))}
          </div>
        </aside>
      </section>

      <section className="chainPanel" aria-label="TA-14 execution chain">
        {CHAIN.map((stage, index) => (
          <div className="chainStage" key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage}</strong>
            {index < CHAIN.length - 1 ? (
              <b aria-hidden="true">→</b>
            ) : null}
          </div>
        ))}
      </section>

      <section className="labSection" id="labs">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Available exercises</p>
            <h2>Choose the failure you want to learn from.</h2>
          </div>

          <p>
            Labs progress from evidence sufficiency and continuity through
            runtime revalidation, outcome correspondence, and complete route
            construction.
          </p>
        </div>

        <div className="labGrid">
          {LABS.map((lab) => (
            <article className="labCard" key={lab.id}>
              <div className="cardHeader">
                <span className="labNumber">{lab.number}</span>

                <span
                  className="classification"
                  data-classification={lab.classification}
                >
                  {lab.classification}
                </span>
              </div>

              <div className="difficulty">{lab.difficulty}</div>

              <h3>{lab.title}</h3>
              <p className="summary">{lab.summary}</p>

              <div className="objective">
                <span>Lab objective</span>
                <p>{lab.objective}</p>
              </div>

              <div className="focus">
                <span>Chain focus</span>

                <div>
                  {lab.focus.map((item) => (
                    <b key={item}>{item}</b>
                  ))}
                </div>
              </div>

              <footer>
                <Link
                  className="launchButton"
                  href={`/workspace/lab/${lab.id}`}
                >
                  Launch lab
                  <span aria-hidden="true">→</span>
                </Link>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="workflowPanel">
        <div>
          <p className="eyebrow">Lab workflow</p>
          <h2>Inspect. Repair. Transfer. Evaluate.</h2>
        </div>

        <ol>
          <li>
            <span>01</span>
            <div>
              <strong>Inspect the route</strong>
              <p>Review the complete Reality → Outcome chain.</p>
            </div>
          </li>

          <li>
            <span>02</span>
            <div>
              <strong>Identify the defect</strong>
              <p>Find the evidence, authority, continuity, or binding failure.</p>
            </div>
          </li>

          <li>
            <span>03</span>
            <div>
              <strong>Repair the route</strong>
              <p>Restore the conditions required for admissible execution.</p>
            </div>
          </li>

          <li>
            <span>04</span>
            <div>
              <strong>Transfer and evaluate</strong>
              <p>Open the corrected route in the builder and test its lane.</p>
            </div>
          </li>
        </ol>
      </section>

      <footer className="pageFooter">
        <span>TA-14 Academy Lab</span>
        <span>Practice before consequence</span>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background:
            radial-gradient(
              circle at 12% 5%,
              rgba(15, 124, 91, 0.09),
              transparent 30%
            ),
            #f5f7f6;
          color: #173128;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .labPage {
          min-height: 100vh;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          max-width: 1380px;
          margin: 0 auto;
          padding: 28px 32px;
          border-bottom: 1px solid #dce5e0;
        }

        .breadcrumb {
          margin: 0 0 6px;
          color: #79867f;
          font-size: 10px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .topbar h1 {
          margin: 0;
          font-size: 20px;
          letter-spacing: -0.03em;
        }

        .topActions,
        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        .primaryButton,
        .secondaryButton,
        .launchButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 46px;
          padding: 0 17px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 900;
          transition:
            transform 150ms ease,
            box-shadow 150ms ease;
        }

        .primaryButton {
          border: 1px solid #123c2e;
          background: #123c2e;
          color: white;
        }

        .secondaryButton {
          border: 1px solid #cad7d1;
          background: rgba(255, 255, 255, 0.85);
          color: #24463a;
        }

        .primaryButton:hover,
        .secondaryButton:hover,
        .launchButton:hover {
          transform: translateY(-1px);
          box-shadow: 0 13px 32px rgba(23, 66, 50, 0.12);
        }

        .hero {
          display: grid;
          grid-template-columns:
            minmax(0, 1.15fr)
            minmax(350px, 0.85fr);
          gap: 26px;
          max-width: 1380px;
          margin: 0 auto;
          padding: 72px 32px 44px;
        }

        .heroCopy {
          align-self: center;
          max-width: 820px;
        }

        .eyebrow {
          margin: 0 0 13px;
          color: #0e7d5c;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h2,
        h3,
        p {
          margin-top: 0;
        }

        .hero h2 {
          margin-bottom: 22px;
          font-size: clamp(42px, 6vw, 78px);
          line-height: 0.99;
          letter-spacing: -0.065em;
        }

        .heroCopy > p:not(.eyebrow) {
          max-width: 750px;
          margin-bottom: 29px;
          color: #68766f;
          font-size: 18px;
          line-height: 1.7;
        }

        .principlePanel {
          padding: 32px;
          border: 1px solid #d4e1da;
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.98),
              rgba(229, 244, 236, 0.96)
            );
          box-shadow: 0 28px 76px rgba(27, 72, 55, 0.08);
        }

        .principlePanel > p {
          margin-bottom: 19px;
          color: #0e7d5c;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        blockquote {
          margin: 0 0 29px;
          font-size: clamp(27px, 3.2vw, 43px);
          font-weight: 900;
          line-height: 1.11;
          letter-spacing: -0.045em;
        }

        .classificationGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
          padding-top: 22px;
          border-top: 1px solid #d2dfd8;
        }

        .classificationGrid span,
        .classification {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 35px;
          padding: 0 10px;
          border: 1px solid #d8e1dc;
          border-radius: 999px;
          background: #f3f6f4;
          color: #637169;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        [data-classification="ALLOW"] {
          border-color: #abd9c5 !important;
          background: #e8f8f0 !important;
          color: #08714f !important;
        }

        [data-classification="HOLD"] {
          border-color: #e2d4aa !important;
          background: #fff7df !important;
          color: #886312 !important;
        }

        [data-classification="DENY"] {
          border-color: #e7bcbc !important;
          background: #fff0f0 !important;
          color: #a53a3a !important;
        }

        [data-classification="ESCALATE"] {
          border-color: #cfc5e8 !important;
          background: #f5f1ff !important;
          color: #694da2 !important;
        }

        .chainPanel {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          max-width: 1316px;
          margin: 0 auto 94px;
          border: 1px solid #dbe4df;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.84);
          overflow: hidden;
        }

        .chainStage {
          position: relative;
          min-width: 0;
          padding: 20px 15px;
          border-right: 1px solid #dfe7e2;
        }

        .chainStage:last-child {
          border-right: 0;
        }

        .chainStage span {
          display: block;
          margin-bottom: 6px;
          color: #0e7d5c;
          font-size: 9px;
          font-weight: 950;
        }

        .chainStage strong {
          display: block;
          overflow: hidden;
          font-size: 11px;
          text-overflow: ellipsis;
        }

        .chainStage b {
          position: absolute;
          top: 50%;
          right: -5px;
          z-index: 1;
          color: #0e7d5c;
          font-size: 12px;
          transform: translateY(-50%);
        }

        .labSection {
          max-width: 1380px;
          margin: 0 auto;
          padding: 0 32px 100px;
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: 1fr minmax(290px, 0.6fr);
          gap: 28px;
          align-items: end;
          margin-bottom: 34px;
        }

        .sectionHeading h2,
        .workflowPanel h2 {
          margin-bottom: 0;
          font-size: clamp(34px, 4.5vw, 58px);
          line-height: 1.03;
          letter-spacing: -0.055em;
        }

        .sectionHeading > p {
          margin-bottom: 3px;
          color: #6b7871;
          line-height: 1.65;
        }

        .labGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .labCard {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          padding: 25px;
          border: 1px solid #dbe4df;
          border-radius: 21px;
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 17px 52px rgba(25, 66, 51, 0.05);
        }

        .cardHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .labNumber {
          color: #99a69f;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.07em;
        }

        .classification {
          min-height: 30px;
          font-size: 8px;
        }

        .difficulty {
          margin-bottom: 8px;
          color: #0e7d5c;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .labCard h3 {
          margin-bottom: 11px;
          font-size: 27px;
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .summary {
          margin-bottom: 21px;
          color: #6b7771;
          line-height: 1.62;
        }

        .objective {
          padding: 15px 16px;
          border-left: 3px solid #0e7d5c;
          background: #f4f9f6;
        }

        .objective span,
        .focus > span {
          display: block;
          margin-bottom: 6px;
          color: #7d8983;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .objective p {
          margin-bottom: 0;
          color: #3d574b;
          font-size: 12px;
          line-height: 1.5;
        }

        .focus {
          flex: 1;
          margin-top: 23px;
        }

        .focus > div {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .focus b {
          padding: 7px 9px;
          border: 1px solid #dbe4df;
          border-radius: 999px;
          background: #f7f9f8;
          color: #50645a;
          font-size: 9px;
        }

        .labCard footer {
          margin-top: 25px;
          padding-top: 18px;
          border-top: 1px solid #e2e9e5;
        }

        .launchButton {
          justify-content: space-between;
          width: 100%;
          border: 1px solid #cad8d1;
          background: white;
          color: #1f4738;
        }

        .workflowPanel {
          display: grid;
          grid-template-columns: minmax(280px, 0.8fr) 1.2fr;
          gap: 40px;
          max-width: 1316px;
          margin: 0 auto 72px;
          padding: 40px;
          border-radius: 24px;
          background: #163e31;
          color: white;
        }

        .workflowPanel .eyebrow {
          color: #8fe0be;
        }

        .workflowPanel ol {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .workflowPanel li {
          display: grid;
          grid-template-columns: 34px 1fr;
          gap: 11px;
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.045);
        }

        .workflowPanel li > span {
          color: #8fe0be;
          font-size: 10px;
          font-weight: 950;
        }

        .workflowPanel li strong {
          display: block;
          margin-bottom: 5px;
          font-size: 13px;
        }

        .workflowPanel li p {
          margin-bottom: 0;
          color: #c1d3cb;
          font-size: 11px;
          line-height: 1.5;
        }

        .pageFooter {
          display: flex;
          justify-content: space-between;
          max-width: 1380px;
          margin: 0 auto;
          padding: 25px 32px 34px;
          border-top: 1px solid #dbe4df;
          color: #85918a;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        @media (max-width: 1050px) {
          .labGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .chainPanel {
            grid-template-columns: repeat(4, 1fr);
            margin-right: 32px;
            margin-left: 32px;
          }

          .chainStage:nth-child(4) {
            border-right: 0;
          }

          .chainStage:nth-child(-n + 4) {
            border-bottom: 1px solid #dfe7e2;
          }
        }

        @media (max-width: 850px) {
          .hero,
          .sectionHeading,
          .workflowPanel {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .topbar {
            align-items: flex-start;
            padding: 20px;
          }

          .topActions {
            display: none;
          }

          .hero {
            padding: 48px 20px 34px;
          }

          .principlePanel {
            padding: 25px;
          }

          .chainPanel {
            grid-template-columns: repeat(2, 1fr);
            margin: 0 20px 70px;
          }

          .chainStage,
          .chainStage:nth-child(4) {
            border-right: 1px solid #dfe7e2;
            border-bottom: 1px solid #dfe7e2;
          }

          .chainStage:nth-child(even) {
            border-right: 0;
          }

          .chainStage:nth-last-child(-n + 2) {
            border-bottom: 0;
          }

          .chainStage b {
            display: none;
          }

          .labSection {
            padding: 0 20px 74px;
          }

          .labGrid {
            grid-template-columns: 1fr;
          }

          .workflowPanel {
            margin: 0 20px 52px;
            padding: 28px;
          }

          .workflowPanel ol {
            grid-template-columns: 1fr;
          }

          .pageFooter {
            padding: 24px 20px 30px;
          }
        }
      `}</style>
    </main>
  );
}
