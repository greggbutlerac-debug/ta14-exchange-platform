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
] as const;

const WORKFLOW = [
  {
    number: "01",
    title: "Inspect the route",
    body: "Review the complete Reality → Outcome chain.",
  },
  {
    number: "02",
    title: "Identify the defect",
    body: "Find the evidence, authority, continuity, or binding failure.",
  },
  {
    number: "03",
    title: "Repair the route",
    body: "Restore the conditions required for admissible execution.",
  },
  {
    number: "04",
    title: "Transfer and evaluate",
    body: "Open the corrected route in the builder and test its lane.",
  },
] as const;

export default function AcademyLabPage() {
  return (
    <main className="page">
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
            Each lab presents a consequence-bearing AI route with a
            deliberate governance defect. Review the complete chain,
            identify the failure, repair the route, and transfer the
            corrected structure into the live Route Builder.
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
          <blockquote style={{ color: "#10251c", opacity: 1, WebkitTextFillColor: "#10251c" }}>
            No admissible evidence.
            <br />
            No admissible execution.
          </blockquote>

          <div className="classificationGrid">
            {["ALLOW", "HOLD", "DENY", "ESCALATE"].map(
              (classification) => (
                <span
                  data-classification={classification}
                  key={classification}
                >
                  {classification}
                </span>
              ),
            )}
          </div>
        </aside>
      </section>

      <section
        className="chainPanel"
        aria-label="TA-14 execution chain"
      >
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
            Labs progress from evidence sufficiency and continuity
            through runtime revalidation, outcome correspondence, and
            complete route construction.
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

              <Link
                className="launchLink"
                href={`/workspace/lab/${lab.id}`}
              >
                Launch lab →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="workflowSection">
        <div className="sectionHeading workflowHeading">
          <div>
            <p className="eyebrow">Lab workflow</p>
            <h2>Inspect. Repair. Transfer. Evaluate.</h2>
          </div>
        </div>

        <ol className="workflowGrid">
          {WORKFLOW.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <footer>
        <strong>TA-14 Academy Lab</strong>
        <span>Practice before consequence</span>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 85% 10%,
              rgba(26, 142, 105, 0.16),
              transparent 28%
            ),
            linear-gradient(135deg, #061924 0%, #07151a 48%, #05120f 100%);
          color: #f5f7fb;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 28px clamp(24px, 5vw, 76px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .breadcrumb {
          margin: 0 0 6px;
          color: rgba(215, 229, 224, 0.58);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p,
        blockquote {
          margin-top: 0;
        }

        h1 {
          margin-bottom: 0;
          font-size: 22px;
          letter-spacing: -0.03em;
        }

        .topActions,
        .heroActions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          min-height: 44px;
          align-items: center;
          justify-content: center;
          padding: 0 17px;
          border-radius: 11px;
          font-size: 13px;
          font-weight: 850;
          text-decoration: none;
        }

        .primaryButton {
          border: 1px solid #2ac18f;
          background: #21a979;
          color: #04130e;
        }

        .secondaryButton {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.045);
          color: #f2f7f5;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(380px, 0.92fr);
          gap: clamp(34px, 6vw, 84px);
          align-items: stretch;
          padding: 66px clamp(24px, 5vw, 76px) 48px;
        }

        .heroCopy {
          display: flex;
          min-width: 0;
          flex-direction: column;
          justify-content: center;
        }

        .eyebrow {
          margin-bottom: 24px;
          color: #129a73;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .heroCopy h2 {
          max-width: 920px;
          margin-bottom: 28px;
          font-size: clamp(52px, 6.9vw, 98px);
          line-height: 0.98;
          letter-spacing: -0.065em;
        }

        .heroCopy > p:not(.eyebrow) {
          max-width: 840px;
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

        .principlePanel blockquote {
          margin: 0 0 29px;
          color: #10251c;
          font-size: clamp(27px, 3.2vw, 43px);
          font-weight: 900;
          line-height: 1.11;
          letter-spacing: -0.045em;
          text-shadow: none;
        }

        .classificationGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 9px;
          padding-top: 22px;
          border-top: 1px solid rgba(16, 37, 28, 0.14);
        }

        .classificationGrid span,
        .classification {
          display: inline-flex;
          min-height: 38px;
          align-items: center;
          justify-content: center;
          padding: 0 14px;
          border: 1px solid;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        [data-classification="ALLOW"] {
          border-color: #9adfc5;
          background: #e4f7ef;
          color: #087352;
        }

        [data-classification="HOLD"] {
          border-color: #e9cc84;
          background: #fff5d9;
          color: #8a6110;
        }

        [data-classification="DENY"] {
          border-color: #efb4b4;
          background: #fff0f0;
          color: #b03939;
        }

        [data-classification="ESCALATE"] {
          border-color: #cbbbea;
          background: #f1ecff;
          color: #6745ab;
        }

        .chainPanel {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          margin: 0 clamp(24px, 5vw, 76px) 86px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.035);
        }

        .chainStage {
          position: relative;
          min-width: 0;
          padding: 18px 16px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }

        .chainStage:last-child {
          border-right: 0;
        }

        .chainStage span {
          display: block;
          margin-bottom: 9px;
          color: #169c75;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.1em;
        }

        .chainStage strong {
          display: block;
          overflow: hidden;
          font-size: 12px;
          text-overflow: ellipsis;
        }

        .chainStage b {
          position: absolute;
          top: 50%;
          right: -6px;
          z-index: 1;
          transform: translateY(-50%);
          color: #21a979;
          font-size: 13px;
        }

        .labSection,
        .workflowSection {
          padding: 0 clamp(24px, 5vw, 76px) 90px;
        }

        .sectionHeading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 34px;
        }

        .sectionHeading .eyebrow {
          margin-bottom: 13px;
        }

        .sectionHeading h2 {
          max-width: 760px;
          margin-bottom: 0;
          font-size: clamp(34px, 4.6vw, 64px);
          line-height: 1;
          letter-spacing: -0.052em;
        }

        .sectionHeading > p {
          max-width: 470px;
          margin-bottom: 0;
          color: rgba(220, 232, 227, 0.6);
          line-height: 1.65;
        }

        .labGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .labCard {
          display: flex;
          min-height: 500px;
          flex-direction: column;
          padding: 24px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          background:
            linear-gradient(
              155deg,
              rgba(255, 255, 255, 0.07),
              rgba(255, 255, 255, 0.025)
            );
        }

        .cardHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 25px;
        }

        .labNumber {
          color: #169c75;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.11em;
        }

        .classification {
          min-height: 32px;
          font-size: 9px;
        }

        .difficulty {
          margin-bottom: 12px;
          color: rgba(222, 234, 229, 0.48);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .labCard h3 {
          margin-bottom: 14px;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .summary {
          margin-bottom: 25px;
          color: rgba(222, 234, 229, 0.67);
          line-height: 1.62;
        }

        .objective {
          margin-bottom: 22px;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 13px;
          background: rgba(0, 0, 0, 0.15);
        }

        .objective span,
        .focus > span {
          display: block;
          margin-bottom: 8px;
          color: #159772;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .objective p {
          margin-bottom: 0;
          color: rgba(229, 237, 234, 0.75);
          font-size: 13px;
          line-height: 1.55;
        }

        .focus {
          margin-bottom: 24px;
        }

        .focus > div {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .focus b {
          padding: 7px 9px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.07);
          color: rgba(236, 242, 240, 0.76);
          font-size: 10px;
        }

        .launchLink {
          margin-top: auto;
          color: #48d4a5;
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
        }

        .workflowHeading {
          margin-bottom: 30px;
        }

        .workflowGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .workflowGrid li {
          padding: 23px;
          border-top: 1px solid rgba(255, 255, 255, 0.14);
        }

        .workflowGrid li > span {
          display: block;
          margin-bottom: 30px;
          color: #159772;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.12em;
        }

        .workflowGrid h3 {
          margin-bottom: 11px;
          font-size: 20px;
        }

        .workflowGrid p {
          margin-bottom: 0;
          color: rgba(220, 232, 227, 0.6);
          line-height: 1.55;
        }

        footer {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding: 25px clamp(24px, 5vw, 76px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(223, 234, 230, 0.55);
          font-size: 12px;
        }

        footer strong {
          color: #169c75;
        }

        @media (max-width: 1120px) {
          .hero {
            grid-template-columns: 1fr;
          }

          .labGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .chainPanel {
            grid-template-columns: repeat(4, 1fr);
          }

          .chainStage:nth-child(4) {
            border-right: 0;
          }

          .chainStage:nth-child(-n + 4) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
        }

        @media (max-width: 760px) {
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
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }

          .chainStage:nth-child(even) {
            border-right: 0;
          }

          .chainStage:nth-last-child(-n + 2) {
            border-bottom: 0;
          }

          .labSection,
          .workflowSection {
            padding-right: 20px;
            padding-left: 20px;
          }

          .sectionHeading {
            align-items: flex-start;
            flex-direction: column;
          }

          .labGrid,
          .workflowGrid {
            grid-template-columns: 1fr;
          }

          .labCard {
            min-height: 0;
          }

          footer {
            flex-direction: column;
            padding: 24px 20px;
          }
        }
      `}</style>
    </main>
  );
}
