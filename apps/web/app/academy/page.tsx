import Link from "next/link";
import {
  ACADEMY_PROGRAMS,
  type AcademyModuleStatus,
} from "../../lib/academy-catalog";

export const metadata = {
  title: "TA-14 Academy | AI Governance and Route Creation",
  description:
    "Learn admissible execution, AI governance route creation, evidence integrity, runtime governance, and independent verification through the TA-14 Academy.",
};

const STATUS_LABELS: Record<AcademyModuleStatus, string> = {
  AVAILABLE: "Available",
  IN_DEVELOPMENT: "In development",
  PLANNED: "Planned",
};

export default function AcademyPage() {
  const availableCount = ACADEMY_PROGRAMS.filter(
    (program) => program.status === "AVAILABLE",
  ).length;

  const moduleCount = ACADEMY_PROGRAMS.reduce(
    (total, program) => total + program.modules.length,
    0,
  );

  return (
    <main className="academyPage">
      <header className="siteHeader">
        <Link className="brand" href="/">
          <span className="brandMark">TA-14</span>
          <span>Exchange Platform</span>
        </Link>

        <nav aria-label="Academy navigation">
          <Link href="/workspace">Workspace</Link>
          <Link href="/workspace/routes">Routes</Link>
          <Link href="/workspace/evaluation/lanes">Evaluation</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">TA-14 Academy</p>

          <h1>
            Learn how to build, govern, and verify
            consequence-bearing AI routes.
          </h1>

          <p className="heroSummary">
            The TA-14 Academy teaches admissible execution from first
            principles through route creation, evidence integrity,
            continuity, runtime governance, and independent replay
            verification.
          </p>

          <div className="heroActions">
            <a className="primaryAction" href="#programs">
              Explore programs
            </a>

            <Link className="secondaryAction" href="/workspace/build">
              Open Route Builder
            </Link>
          </div>
        </div>

        <aside className="principleCard">
          <p>Governing principle</p>
          <blockquote>
            No admissible evidence.
            <br />
            No admissible execution.
          </blockquote>

          <div className="chain" aria-label="TA-14 execution chain">
            {[
              "Reality",
              "Record",
              "Continuity",
              "Admissibility",
              "Binding",
              "Commit",
              "Execution",
              "Outcome",
            ].map((stage, index) => (
              <span key={stage}>
                {stage}
                {index < 7 ? <b aria-hidden="true">→</b> : null}
              </span>
            ))}
          </div>
        </aside>
      </section>

      <section className="stats" aria-label="Academy catalog summary">
        <div>
          <strong>{ACADEMY_PROGRAMS.length}</strong>
          <span>Governance programs</span>
        </div>

        <div>
          <strong>{moduleCount}</strong>
          <span>Learning modules</span>
        </div>

        <div>
          <strong>{availableCount}</strong>
          <span>Available now</span>
        </div>
      </section>

      <section className="programSection" id="programs">
        <div className="sectionHeading">
          <div>
            <p className="eyebrow">Learning pathways</p>
            <h2>Build capability across the complete route.</h2>
          </div>

          <p>
            Each program connects directly to the architecture used by
            the TA-14 Exchange Platform and Route Builder.
          </p>
        </div>

        <div className="programGrid">
          {ACADEMY_PROGRAMS.map((program, programIndex) => (
            <article className="programCard" key={program.id}>
              <div className="programHeader">
                <span className="programNumber">
                  {String(programIndex + 1).padStart(2, "0")}
                </span>

                <span
                  className="status"
                  data-status={program.status}
                >
                  {STATUS_LABELS[program.status]}
                </span>
              </div>

              <div>
                <p className="shortTitle">{program.shortTitle}</p>
                <h3>{program.title}</h3>
                <p className="programSummary">{program.summary}</p>
              </div>

              <div className="principle">
                <span>Program principle</span>
                <strong>{program.governingPrinciple}</strong>
              </div>

              <div className="moduleList">
                <p>Modules</p>

                <ol>
                  {program.modules.map((module) => (
                    <li key={module.id}>
                      <span>
                        {String(module.sequence).padStart(2, "0")}
                      </span>

                      <div>
                        <strong>{module.title}</strong>
                        <p>{module.summary}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <footer className="programFooter">
                <span>{program.modules.length} modules</span>
                <span>{program.delivery.length} learning formats</span>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="routeCallout">
        <div>
          <p className="eyebrow">Learn by building</p>
          <h2>
            Move from lesson to route without leaving the platform.
          </h2>
          <p>
            Academy programs are designed to prepare users to construct,
            test, revise, and verify governance routes in the live TA-14
            workspace.
          </p>
        </div>

        <div className="calloutActions">
          <Link className="primaryAction" href="/workspace/build">
            Build a route
          </Link>

          <Link
            className="secondaryAction"
            href="/workspace/evaluation/lanes"
          >
            Review evaluation lanes
          </Link>
        </div>
      </section>

      <footer className="pageFooter">
        <span>TA-14 Academy</span>
        <span>Admissible Execution Education</span>
      </footer>

      <style>{`
        :root {
          color-scheme: light;
        }

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
              circle at 12% 6%,
              rgba(18, 124, 92, 0.09),
              transparent 30%
            ),
            #f6f8f7;
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

        .academyPage {
          min-height: 100vh;
        }

        .siteHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          max-width: 1380px;
          margin: 0 auto;
          padding: 24px 32px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 850;
        }

        .brandMark {
          display: inline-grid;
          place-items: center;
          min-width: 56px;
          min-height: 32px;
          border-radius: 9px;
          background: #123c2e;
          color: white;
          font-size: 12px;
          letter-spacing: 0.04em;
        }

        nav {
          display: flex;
          align-items: center;
          gap: 22px;
          color: #66746e;
          font-size: 12px;
          font-weight: 750;
        }

        nav a:hover {
          color: #123c2e;
        }

        .hero {
          display: grid;
          grid-template-columns:
            minmax(0, 1.15fr)
            minmax(360px, 0.85fr);
          gap: 28px;
          max-width: 1380px;
          margin: 0 auto;
          padding: 72px 32px 46px;
        }

        .heroCopy {
          align-self: center;
          max-width: 790px;
        }

        .eyebrow {
          margin: 0 0 14px;
          color: #0e7d5c;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 0.17em;
          text-transform: uppercase;
        }

        h1,
        h2,
        h3,
        p {
          margin-top: 0;
        }

        h1 {
          margin-bottom: 22px;
          font-size: clamp(42px, 6.2vw, 82px);
          line-height: 0.98;
          letter-spacing: -0.066em;
        }

        .heroSummary {
          max-width: 710px;
          margin-bottom: 30px;
          color: #64736c;
          font-size: 18px;
          line-height: 1.7;
        }

        .heroActions,
        .calloutActions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .primaryAction,
        .secondaryAction {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 0 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 900;
          transition:
            transform 150ms ease,
            box-shadow 150ms ease;
        }

        .primaryAction {
          border: 1px solid #123c2e;
          background: #123c2e;
          color: white;
        }

        .secondaryAction {
          border: 1px solid #cad7d1;
          background: rgba(255, 255, 255, 0.82);
          color: #23463a;
        }

        .primaryAction:hover,
        .secondaryAction:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 34px rgba(24, 69, 52, 0.12);
        }

        .principleCard {
          align-self: stretch;
          padding: 34px;
          border: 1px solid #d5e1db;
          border-radius: 26px;
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.98),
              rgba(231, 245, 238, 0.96)
            );
          box-shadow: 0 30px 80px rgba(26, 74, 56, 0.09);
        }

        .principleCard > p {
          margin-bottom: 22px;
          color: #0e7d5c;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        blockquote {
          margin: 0 0 30px;
          color: #173128;
          font-size: clamp(27px, 3vw, 42px);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.045em;
        }

        .chain {
          display: flex;
          flex-wrap: wrap;
          gap: 8px 5px;
          padding-top: 22px;
          border-top: 1px solid #d1dfd8;
        }

        .chain span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #52645b;
          font-size: 11px;
          font-weight: 850;
        }

        .chain b {
          color: #0e7d5c;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          max-width: 1316px;
          margin: 0 auto 92px;
          border: 1px solid #dbe4df;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.82);
          overflow: hidden;
        }

        .stats div {
          padding: 24px 28px;
        }

        .stats div + div {
          border-left: 1px solid #dbe4df;
        }

        .stats strong {
          display: block;
          margin-bottom: 5px;
          font-size: 28px;
          letter-spacing: -0.04em;
        }

        .stats span {
          color: #748078;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .programSection {
          max-width: 1380px;
          margin: 0 auto;
          padding: 0 32px 100px;
        }

        .sectionHeading {
          display: grid;
          grid-template-columns: 1fr minmax(300px, 0.6fr);
          gap: 28px;
          align-items: end;
          margin-bottom: 34px;
        }

        .sectionHeading h2,
        .routeCallout h2 {
          margin-bottom: 0;
          font-size: clamp(34px, 4vw, 56px);
          line-height: 1.03;
          letter-spacing: -0.055em;
        }

        .sectionHeading > p {
          margin-bottom: 4px;
          color: #69776f;
          line-height: 1.65;
        }

        .programGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .programCard {
          display: flex;
          flex-direction: column;
          min-height: 100%;
          padding: 28px;
          border: 1px solid #dbe4df;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 18px 55px rgba(25, 66, 51, 0.055);
        }

        .programHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
        }

        .programNumber {
          color: #9ca9a2;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        .status {
          padding: 7px 10px;
          border: 1px solid #dce4df;
          border-radius: 999px;
          background: #f3f6f4;
          color: #6f7c75;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .status[data-status="AVAILABLE"] {
          border-color: #b8dfce;
          background: #eaf8f1;
          color: #08724f;
        }

        .status[data-status="IN_DEVELOPMENT"] {
          border-color: #e4d7b5;
          background: #fff8e8;
          color: #8b6517;
        }

        .shortTitle {
          margin-bottom: 8px;
          color: #0e7d5c;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .programCard h3 {
          margin-bottom: 12px;
          font-size: 27px;
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .programSummary {
          margin-bottom: 22px;
          color: #6b7771;
          line-height: 1.63;
        }

        .principle {
          padding: 15px 16px;
          border-left: 3px solid #0e7d5c;
          background: #f4f9f6;
        }

        .principle span {
          display: block;
          margin-bottom: 6px;
          color: #78857e;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.09em;
          text-transform: uppercase;
        }

        .principle strong {
          color: #27483b;
          font-size: 13px;
          line-height: 1.48;
        }

        .moduleList {
          flex: 1;
          margin-top: 28px;
        }

        .moduleList > p {
          margin-bottom: 12px;
          color: #7c8982;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        ol {
          display: grid;
          gap: 0;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        li {
          display: grid;
          grid-template-columns: 32px 1fr;
          gap: 11px;
          padding: 14px 0;
          border-top: 1px solid #e5ebe7;
        }

        li > span {
          padding-top: 2px;
          color: #0e7d5c;
          font-size: 10px;
          font-weight: 900;
        }

        li strong {
          display: block;
          margin-bottom: 4px;
          color: #294339;
          font-size: 13px;
        }

        li p {
          margin-bottom: 0;
          color: #7a857f;
          font-size: 11px;
          line-height: 1.5;
        }

        .programFooter {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-top: 14px;
          padding-top: 17px;
          border-top: 1px solid #dfe7e2;
          color: #89938e;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .routeCallout {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 34px;
          align-items: end;
          max-width: 1316px;
          margin: 0 auto 74px;
          padding: 42px;
          border-radius: 24px;
          background: #163e31;
          color: white;
        }

        .routeCallout .eyebrow {
          color: #8fe0be;
        }

        .routeCallout h2 {
          max-width: 840px;
          margin-bottom: 16px;
        }

        .routeCallout p:not(.eyebrow) {
          max-width: 720px;
          margin-bottom: 0;
          color: #c4d6ce;
          line-height: 1.65;
        }

        .routeCallout .primaryAction {
          border-color: white;
          background: white;
          color: #163e31;
        }

        .routeCallout .secondaryAction {
          border-color: rgba(255, 255, 255, 0.28);
          background: transparent;
          color: white;
        }

        .calloutActions {
          justify-content: flex-end;
        }

        .pageFooter {
          display: flex;
          justify-content: space-between;
          max-width: 1380px;
          margin: 0 auto;
          padding: 26px 32px 34px;
          border-top: 1px solid #dbe4df;
          color: #849089;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        @media (max-width: 980px) {
          .hero,
          .sectionHeading,
          .routeCallout {
            grid-template-columns: 1fr;
          }

          .programGrid {
            grid-template-columns: 1fr;
          }

          .calloutActions {
            justify-content: flex-start;
          }
        }

        @media (max-width: 700px) {
          .siteHeader {
            align-items: flex-start;
            padding: 20px;
          }

          nav {
            display: none;
          }

          .hero {
            padding: 48px 20px 34px;
          }

          .principleCard {
            padding: 25px;
          }

          .stats {
            grid-template-columns: 1fr;
            margin: 0 20px 70px;
          }

          .stats div + div {
            border-top: 1px solid #dbe4df;
            border-left: 0;
          }

          .programSection {
            padding: 0 20px 74px;
          }

          .programCard {
            padding: 22px;
          }

          .programFooter {
            flex-direction: column;
          }

          .routeCallout {
            margin: 0 20px 54px;
            padding: 28px;
          }

          .pageFooter {
            padding: 24px 20px 30px;
          }
        }
      `}</style>
    </main>
  );
}
