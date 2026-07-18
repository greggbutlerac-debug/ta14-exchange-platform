import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ACADEMY_LABS,
  getAcademyLab,
  getAcademyLabIds,
} from "../../../lib/academy-labs";

type AcademyLabExercisePageProps = {
  params: Promise<{
    labId: string;
  }>;
};

export function generateStaticParams() {
  return getAcademyLabIds().map((labId) => ({ labId }));
}

export async function generateMetadata({
  params,
}: AcademyLabExercisePageProps) {
  const { labId } = await params;
  const lab = getAcademyLab(labId);

  if (!lab) {
    return {
      title: "Academy Lab | TA-14 Exchange Platform",
    };
  }

  return {
    title: `${lab.title} | TA-14 Academy Lab`,
    description: lab.summary,
  };
}

export default async function AcademyLabExercisePage({
  params,
}: AcademyLabExercisePageProps) {
  const { labId } = await params;
  const lab = getAcademyLab(labId);

  if (!lab) {
    notFound();
  }

  const currentIndex = ACADEMY_LABS.findIndex(
    (candidate) => candidate.id === lab.id,
  );

  const previousLab =
    currentIndex > 0 ? ACADEMY_LABS[currentIndex - 1] : undefined;

  const nextLab =
    currentIndex < ACADEMY_LABS.length - 1
      ? ACADEMY_LABS[currentIndex + 1]
      : undefined;

  return (
    <main className="exercisePage">
      <header className="topbar">
        <div>
          <p className="breadcrumb">
            Workspace / Academy Lab / {lab.number}
          </p>
          <h1>{lab.title}</h1>
        </div>

        <div className="topActions">
          <Link className="secondaryButton" href="/workspace/lab">
            All labs
          </Link>

          <Link className="primaryButton" href="/workspace/build">
            Open Route Builder
          </Link>
        </div>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <div className="heroMeta">
            <span>{lab.difficulty}</span>
            <span>{lab.estimatedMinutes} minutes</span>
            <span
              className="classification"
              data-classification={lab.classification}
            >
              {lab.classification}
            </span>
          </div>

          <p className="eyebrow">Governance exercise</p>
          <h2>{lab.summary}</h2>

          <div className="scenario">
            <span>Scenario</span>
            <p>{lab.scenario}</p>
          </div>
        </div>

        <aside className="questionCard">
          <p>Governing question</p>
          <blockquote>{lab.governingQuestion}</blockquote>

          <div className="objective">
            <span>Objective</span>
            <p>{lab.objective}</p>
          </div>
        </aside>
      </section>

      <section className="routeSection">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Route inspection</p>
            <h2>Review every stage before choosing a repair.</h2>
          </div>

          <p>
            A route can only produce legitimate consequence when each stage
            remains supportable, continuous, and bound to valid authority.
          </p>
        </div>

        <div className="routeGrid">
          {lab.route.map((stage, index) => (
            <article className="stageCard" key={stage.stage}>
              <div className="stageHeader">
                <span className="stageNumber">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="stageStatus" data-status={stage.status}>
                  {stage.status}
                </span>
              </div>

              <h3>{stage.stage}</h3>
              <p className="evidence">{stage.evidence}</p>

              <div className="stageQuestion">
                <span>Review question</span>
                <p>{stage.question}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="repairSection">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Repair decision</p>
            <h2>Choose the action that restores route legitimacy.</h2>
          </div>

          <p>
            The correct answer is the option that repairs the chain without
            hiding, bypassing, or retroactively rewriting the defect.
          </p>
        </div>

        <div className="repairGrid">
          {lab.repairOptions.map((option, index) => (
            <details className="repairCard" key={option.id}>
              <summary>
                <div className="choiceNumber">
                  {String.fromCharCode(65 + index)}
                </div>

                <div className="choiceCopy">
                  <h3>{option.label}</h3>
                  <p>{option.description}</p>
                </div>

                <span className="reveal">Reveal answer</span>
              </summary>

              <div
                className="answer"
                data-correct={option.correct ? "true" : "false"}
              >
                <strong>
                  {option.correct ? "Correct repair" : "Not admissible"}
                </strong>
                <p>{option.explanation}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section
        className="outcomePanel"
        data-classification={lab.classification}
      >
        <div>
          <p className="eyebrow">Lab determination</p>
          <h2>{lab.classification}</h2>
          <p>{lab.completionMessage}</p>
        </div>

        <div className="outcomeActions">
          <Link className="primaryButton" href="/workspace/build">
            Transfer lesson to builder
          </Link>

          <Link
            className="secondaryButton"
            href="/workspace/evaluation/lanes"
          >
            Review evaluation lanes
          </Link>
        </div>
      </section>

      <nav className="labNavigation" aria-label="Academy lab sequence">
        <div>
          {previousLab ? (
            <Link href={`/workspace/lab/${previousLab.id}`}>
              <span>Previous lab</span>
              <strong>
                ← {previousLab.number} {previousLab.title}
              </strong>
            </Link>
          ) : (
            <Link href="/workspace/lab">
              <span>Academy Lab</span>
              <strong>← Return to lab catalog</strong>
            </Link>
          )}
        </div>

        <div className="nextLink">
          {nextLab ? (
            <Link href={`/workspace/lab/${nextLab.id}`}>
              <span>Next lab</span>
              <strong>
                {nextLab.number} {nextLab.title} →
              </strong>
            </Link>
          ) : (
            <Link href="/workspace/build">
              <span>Capstone complete</span>
              <strong>Open Route Builder →</strong>
            </Link>
          )}
        </div>
      </nav>

      <footer className="pageFooter">
        <span>TA-14 Academy Lab</span>
        <span>
          {lab.number} / {String(ACADEMY_LABS.length).padStart(2, "0")}
        </span>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background:
            radial-gradient(
              circle at 86% 5%,
              rgba(15, 124, 91, 0.08),
              transparent 29%
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

        .exercisePage {
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
        .outcomeActions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
        }

        .primaryButton,
        .secondaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 0 17px;
          border-radius: 11px;
          font-size: 12px;
          font-weight: 900;
        }

        .primaryButton {
          border: 1px solid #123c2e;
          background: #123c2e;
          color: white;
        }

        .secondaryButton {
          border: 1px solid #cad7d1;
          background: rgba(255, 255, 255, 0.86);
          color: #24463a;
        }

        .hero {
          display: grid;
          grid-template-columns:
            minmax(0, 1.15fr)
            minmax(340px, 0.85fr);
          gap: 26px;
          max-width: 1380px;
          margin: 0 auto;
          padding: 68px 32px 70px;
        }

        .heroMeta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 25px;
        }

        .heroMeta > span {
          display: inline-flex;
          align-items: center;
          min-height: 31px;
          padding: 0 10px;
          border: 1px solid #d8e1dc;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
          color: #65736b;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.07em;
          text-transform: uppercase;
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
          margin-bottom: 25px;
          font-size: clamp(40px, 5.5vw, 72px);
          line-height: 1;
          letter-spacing: -0.062em;
        }

        .scenario {
          max-width: 820px;
          padding: 18px 20px;
          border-left: 3px solid #0e7d5c;
          background: rgba(255, 255, 255, 0.8);
        }

        .scenario span,
        .objective span,
        .stageQuestion span {
          display: block;
          margin-bottom: 7px;
          color: #7c8982;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .scenario p,
        .objective p,
        .stageQuestion p {
          margin-bottom: 0;
          color: #3e584c;
          line-height: 1.62;
        }

        .questionCard {
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

        .questionCard > p {
          margin-bottom: 19px;
          color: #0e7d5c;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        blockquote {
          margin: 0 0 27px;
          font-size: clamp(25px, 3vw, 40px);
          font-weight: 900;
          line-height: 1.12;
          letter-spacing: -0.045em;
        }

        .objective {
          padding-top: 21px;
          border-top: 1px solid #d1ded7;
        }

        .routeSection,
        .repairSection {
          max-width: 1380px;
          margin: 0 auto;
          padding: 0 32px 96px;
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: 1fr minmax(290px, 0.6fr);
          gap: 28px;
          align-items: end;
          margin-bottom: 31px;
        }

        .sectionHeading h2 {
          margin-bottom: 0;
          font-size: clamp(33px, 4vw, 54px);
          line-height: 1.03;
          letter-spacing: -0.052em;
        }

        .sectionHeading > p {
          margin-bottom: 3px;
          color: #6b7871;
          line-height: 1.65;
        }

        .routeGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .stageCard {
          min-height: 100%;
          padding: 21px;
          border: 1px solid #dbe4df;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.94);
        }

        .stageHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 21px;
        }

        .stageNumber {
          color: #9aa7a0;
          font-size: 10px;
          font-weight: 950;
        }

        .stageStatus {
          padding: 6px 8px;
          border: 1px solid #d8e1dc;
          border-radius: 999px;
          background: #f3f6f4;
          color: #65736b;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.07em;
        }

        .stageStatus[data-status="PASS"] {
          border-color: #abd9c5;
          background: #e8f8f0;
          color: #08714f;
        }

        .stageStatus[data-status="FAIL"] {
          border-color: #e7bcbc;
          background: #fff0f0;
          color: #a53a3a;
        }

        .stageStatus[data-status="UNRESOLVED"] {
          border-color: #e2d4aa;
          background: #fff7df;
          color: #886312;
        }

        .stageCard h3 {
          margin-bottom: 10px;
          font-size: 22px;
          letter-spacing: -0.035em;
        }

        .evidence {
          min-height: 76px;
          margin-bottom: 19px;
          color: #6d7973;
          font-size: 12px;
          line-height: 1.58;
        }

        .stageQuestion {
          padding-top: 16px;
          border-top: 1px solid #e3eae6;
        }

        .stageQuestion p {
          font-size: 11px;
        }

        .repairGrid {
          display: grid;
          gap: 13px;
        }

        .repairCard {
          border: 1px solid #dbe4df;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.95);
          overflow: hidden;
        }

        summary {
          display: grid;
          grid-template-columns: 46px minmax(0, 1fr) auto;
          gap: 16px;
          align-items: center;
          padding: 22px;
          cursor: pointer;
          list-style: none;
        }

        summary::-webkit-details-marker {
          display: none;
        }

        .choiceNumber {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #edf4f0;
          color: #0e7d5c;
          font-size: 13px;
          font-weight: 950;
        }

        .choiceCopy h3 {
          margin-bottom: 5px;
          font-size: 19px;
          letter-spacing: -0.025em;
        }

        .choiceCopy p {
          margin-bottom: 0;
          color: #6f7b75;
          font-size: 12px;
          line-height: 1.55;
        }

        .reveal {
          color: #0e7d5c;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .answer {
          padding: 20px 22px 22px 84px;
          border-top: 1px solid #e1e8e4;
        }

        .answer[data-correct="true"] {
          background: #edf9f3;
        }

        .answer[data-correct="false"] {
          background: #fff4f4;
        }

        .answer strong {
          display: block;
          margin-bottom: 7px;
          font-size: 12px;
          text-transform: uppercase;
        }

        .answer[data-correct="true"] strong {
          color: #08714f;
        }

        .answer[data-correct="false"] strong {
          color: #a53a3a;
        }

        .answer p {
          margin-bottom: 0;
          color: #4e6157;
          line-height: 1.6;
        }

        .outcomePanel {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 34px;
          align-items: end;
          max-width: 1316px;
          margin: 0 auto 50px;
          padding: 38px;
          border: 1px solid #d3e0d9;
          border-radius: 24px;
          background: #163e31;
          color: white;
        }

        .outcomePanel .eyebrow {
          color: #8fe0be;
        }

        .outcomePanel h2 {
          margin-bottom: 9px;
          font-size: clamp(38px, 5vw, 64px);
          letter-spacing: -0.055em;
        }

        .outcomePanel p:not(.eyebrow) {
          max-width: 780px;
          margin-bottom: 0;
          color: #c2d4cc;
          line-height: 1.65;
        }

        .outcomePanel .primaryButton {
          border-color: white;
          background: white;
          color: #163e31;
        }

        .outcomePanel .secondaryButton {
          border-color: rgba(255, 255, 255, 0.28);
          background: transparent;
          color: white;
        }

        .labNavigation {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          max-width: 1316px;
          margin: 0 auto 72px;
          border: 1px solid #dbe4df;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.9);
          overflow: hidden;
        }

        .labNavigation > div {
          padding: 23px;
        }

        .labNavigation > div + div {
          border-left: 1px solid #dbe4df;
        }

        .labNavigation span {
          display: block;
          margin-bottom: 7px;
          color: #849089;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .labNavigation strong {
          font-size: 13px;
        }

        .nextLink {
          text-align: right;
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

        .classification[data-classification="ALLOW"] {
          border-color: #abd9c5;
          background: #e8f8f0;
          color: #08714f;
        }

        .classification[data-classification="HOLD"] {
          border-color: #e2d4aa;
          background: #fff7df;
          color: #886312;
        }

        .classification[data-classification="DENY"] {
          border-color: #e7bcbc;
          background: #fff0f0;
          color: #a53a3a;
        }

        .classification[data-classification="ESCALATE"] {
          border-color: #cfc5e8;
          background: #f5f1ff;
          color: #694da2;
        }

        @media (max-width: 1050px) {
          .routeGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 850px) {
          .hero,
          .sectionHeading,
          .outcomePanel {
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

          .hero,
          .routeSection,
          .repairSection {
            padding-right: 20px;
            padding-left: 20px;
          }

          .hero {
            padding-top: 48px;
          }

          .routeGrid {
            grid-template-columns: 1fr;
          }

          .evidence {
            min-height: 0;
          }

          summary {
            grid-template-columns: 42px 1fr;
          }

          .reveal {
            grid-column: 2;
          }

          .answer {
            padding-left: 22px;
          }

          .outcomePanel,
          .labNavigation {
            margin-right: 20px;
            margin-left: 20px;
          }

          .labNavigation {
            grid-template-columns: 1fr;
          }

          .labNavigation > div + div {
            border-top: 1px solid #dbe4df;
            border-left: 0;
          }

          .nextLink {
            text-align: left;
          }

          .pageFooter {
            padding: 24px 20px 30px;
          }
        }
      `}</style>
    </main>
  );
}
