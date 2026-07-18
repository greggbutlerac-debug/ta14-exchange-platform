import Link from "next/link";
import EvaluationLaneSelector from "../evaluation-lane-selector";

export const metadata = {
  title: "Choose Evaluation Lane | TA-14 Exchange Platform",
  description:
    "Choose between a free workspace evaluation and a paid preserved verification test for the current TA-14 route.",
};

export default function EvaluationLanePage() {
  return (
    <main className="pageShell">
      <header className="topBar">
        <div>
          <p className="brand">TA-14 Exchange Platform</p>
          <p className="breadcrumb">
            Workspace <span>›</span> Evaluation <span>›</span>{" "}
            Choose lane
          </p>
        </div>

        <nav aria-label="Evaluation navigation">
          <Link href="/workspace/routes">My Routes</Link>
          <Link href="/workspace/build">Route Builder</Link>
          <Link href="/workspace/evaluation">Route Review</Link>
        </nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">Evaluation transfer point</p>
          <h1>Choose what this test should produce.</h1>
          <p>
            The route has reached the point where evaluation intent
            must be declared. Run it freely inside the workspace, or
            enter the paid lane for a preserved verification process.
          </p>
        </div>

        <div className="principle">
          <span>Governing principle</span>
          <strong>
            No admissible evidence. No admissible execution.
          </strong>
        </div>
      </section>

      <section className="chainPanel" aria-label="TA-14 route chain">
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
          <div className="chainStage" key={stage}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{stage}</strong>
          </div>
        ))}
      </section>

      <section className="selectorWrap">
        <EvaluationLaneSelector />
      </section>

      <section className="boundaryPanel">
        <div>
          <p className="boundaryLabel">
            Evaluation boundary
          </p>
          <h2>Lane selection does not change the route.</h2>
        </div>

        <p>
          The selected lane determines how the evaluation result is
          treated after testing. It does not rewrite route evidence,
          bypass admissibility requirements, or convert an invalid
          route into an allowable one.
        </p>
      </section>

      <footer>
        <p>
          TA-14 distinguishes workspace convenience from preserved
          governance evidence.
        </p>
        <Link href="/workspace/routes">
          Return to My Routes →
        </Link>
      </footer>

      <style>{`
        :root {
          color-scheme: light;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background:
            radial-gradient(
              circle at top right,
              rgba(31, 143, 103, 0.09),
              transparent 34%
            ),
            linear-gradient(180deg, #f7faf8 0%, #eef4f0 100%);
          color: #183128;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .pageShell {
          min-height: 100vh;
          padding: 24px;
        }

        .topBar,
        .hero,
        .chainPanel,
        .selectorWrap,
        .boundaryPanel,
        footer {
          width: min(1480px, 100%);
          margin-left: auto;
          margin-right: auto;
        }

        .topBar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 18px 20px;
          border: 1px solid rgba(206, 219, 212, 0.9);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.86);
          backdrop-filter: blur(18px);
        }

        .brand {
          margin: 0 0 5px;
          color: #16382c;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: -0.01em;
        }

        .breadcrumb {
          margin: 0;
          color: #77847e;
          font-size: 12px;
        }

        .breadcrumb span {
          margin: 0 5px;
          color: #a2ada7;
        }

        nav {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        nav a {
          padding: 9px 11px;
          border-radius: 9px;
          color: #4d6258;
          font-size: 12px;
          font-weight: 800;
        }

        nav a:hover {
          background: #edf5f1;
          color: #0b7152;
        }

        .hero {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(280px, 0.5fr);
          gap: 22px;
          margin-top: 22px;
        }

        .heroCopy,
        .principle {
          border: 1px solid #dce5e0;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 22px 65px rgba(27, 66, 50, 0.06);
        }

        .heroCopy {
          padding: 38px;
        }

        .eyebrow,
        .boundaryLabel {
          margin: 0 0 10px;
          color: #0f7c5c;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        h1,
        h2,
        p {
          margin-top: 0;
        }

        h1 {
          max-width: 850px;
          margin-bottom: 14px;
          color: #142f25;
          font-size: clamp(38px, 6vw, 72px);
          line-height: 0.98;
          letter-spacing: -0.065em;
        }

        .heroCopy > p:last-child {
          max-width: 820px;
          margin-bottom: 0;
          color: #64736c;
          font-size: 17px;
          line-height: 1.7;
        }

        .principle {
          display: flex;
          min-height: 100%;
          flex-direction: column;
          justify-content: flex-end;
          padding: 28px;
          background:
            linear-gradient(
              150deg,
              rgba(18, 60, 46, 0.98),
              rgba(14, 104, 75, 0.95)
            );
          color: white;
        }

        .principle span {
          margin-bottom: 12px;
          color: #b9dfcf;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .principle strong {
          font-size: 25px;
          line-height: 1.22;
          letter-spacing: -0.035em;
        }

        .chainPanel {
          display: grid;
          grid-template-columns: repeat(8, minmax(0, 1fr));
          gap: 8px;
          margin-top: 18px;
          padding: 14px;
          border: 1px solid #dce5e0;
          border-radius: 17px;
          background: rgba(255, 255, 255, 0.92);
        }

        .chainStage {
          min-width: 0;
          padding: 13px 10px;
          border-radius: 11px;
          background: #f3f8f5;
        }

        .chainStage span {
          display: block;
          margin-bottom: 5px;
          color: #2c9470;
          font-size: 10px;
          font-weight: 900;
        }

        .chainStage strong {
          display: block;
          overflow: hidden;
          color: #294338;
          font-size: 12px;
          text-overflow: ellipsis;
        }

        .selectorWrap {
          margin-top: 18px;
        }

        .boundaryPanel {
          display: grid;
          grid-template-columns: minmax(260px, 0.7fr) minmax(0, 1.3fr);
          gap: 26px;
          margin-top: 18px;
          padding: 26px;
          border: 1px solid #dce5e0;
          border-radius: 19px;
          background: rgba(255, 255, 255, 0.9);
        }

        .boundaryPanel h2 {
          margin-bottom: 0;
          font-size: 25px;
          letter-spacing: -0.04em;
        }

        .boundaryPanel > p {
          align-self: center;
          margin-bottom: 0;
          color: #66766e;
          line-height: 1.7;
        }

        footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 24px 4px 6px;
          color: #6f7d76;
          font-size: 12px;
        }

        footer p {
          margin-bottom: 0;
        }

        footer a {
          color: #0f7254;
          font-weight: 900;
        }

        @media (max-width: 980px) {
          .hero,
          .boundaryPanel {
            grid-template-columns: 1fr;
          }

          .chainPanel {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .pageShell {
            padding: 12px;
          }

          .topBar,
          footer {
            align-items: stretch;
            flex-direction: column;
          }

          nav {
            display: grid;
            grid-template-columns: 1fr;
          }

          .heroCopy {
            padding: 27px;
          }

          .principle {
            min-height: 220px;
          }

          .chainPanel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
      `}</style>
    </main>
  );
}
