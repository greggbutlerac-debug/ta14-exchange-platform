"use client";

import EvaluationLaneLaunchButton from "./evaluation-lane-launch-button";

type EvaluationDecision =
  | "ALLOW"
  | "HOLD"
  | "DENY"
  | "ESCALATE"
  | "NOT_EVALUATED";

type EvaluationLaneEntryPanelProps = {
  routeLibraryId?: string;
  routeName?: string;
  decision?: EvaluationDecision;
  completedChecks?: number;
  totalChecks?: number;
  blockingIssues?: number;
};

const DECISION_COPY: Record<
  EvaluationDecision,
  {
    label: string;
    summary: string;
    tone: "positive" | "warning" | "negative" | "neutral";
  }
> = {
  ALLOW: {
    label: "ALLOW",
    summary:
      "The current workspace evaluation found no blocking admissibility failure.",
    tone: "positive",
  },
  HOLD: {
    label: "HOLD",
    summary:
      "The route requires additional evidence, correction, or continuity before execution.",
    tone: "warning",
  },
  DENY: {
    label: "DENY",
    summary:
      "The current route does not satisfy the requirements for admissible execution.",
    tone: "negative",
  },
  ESCALATE: {
    label: "ESCALATE",
    summary:
      "The route requires human or higher-authority review before consequence-bearing execution.",
    tone: "warning",
  },
  NOT_EVALUATED: {
    label: "Not evaluated",
    summary:
      "Run the route evaluation before selecting how the result should be treated.",
    tone: "neutral",
  },
};

export default function EvaluationLaneEntryPanel({
  routeLibraryId,
  routeName,
  decision = "NOT_EVALUATED",
  completedChecks = 0,
  totalChecks = 0,
  blockingIssues = 0,
}: EvaluationLaneEntryPanelProps) {
  const decisionCopy = DECISION_COPY[decision];
  const hasEvaluation = decision !== "NOT_EVALUATED";
  const safeCompletedChecks = Math.max(0, completedChecks);
  const safeTotalChecks = Math.max(
    safeCompletedChecks,
    totalChecks,
  );
  const safeBlockingIssues = Math.max(0, blockingIssues);

  return (
    <section className="entryPanel">
      <div className="resultColumn">
        <p className="eyebrow">Evaluation status</p>

        <div
          className="decisionBadge"
          data-tone={decisionCopy.tone}
        >
          {decisionCopy.label}
        </div>

        <h2>
          {hasEvaluation
            ? "Choose what should happen to this result."
            : "Evaluate the route before entering a result lane."}
        </h2>

        <p className="summary">
          {decisionCopy.summary}
        </p>

        <div className="metrics" aria-label="Evaluation metrics">
          <div>
            <span>Checks completed</span>
            <strong>
              {safeCompletedChecks}
              {safeTotalChecks > 0
                ? ` / ${safeTotalChecks}`
                : ""}
            </strong>
          </div>

          <div>
            <span>Blocking issues</span>
            <strong>{safeBlockingIssues}</strong>
          </div>

          <div>
            <span>Route</span>
            <strong title={routeName || "Current route"}>
              {routeName || "Current route"}
            </strong>
          </div>
        </div>
      </div>

      <div className="actionColumn">
        <div>
          <p className="actionLabel">
            Result treatment
          </p>

          <h3>
            Free workspace evaluation or $9 verified test
          </h3>

          <p>
            The free lane keeps the result inside the workspace.
            The verified lane prepares the result for payment,
            preservation, receipt issuance, and a public record
            identifier when issuance succeeds.
          </p>
        </div>

        <EvaluationLaneLaunchButton
          routeLibraryId={routeLibraryId}
          routeName={routeName}
        >
          Choose evaluation lane →
        </EvaluationLaneLaunchButton>

        <p className="boundary">
          Selecting the paid lane does not override the decision and
          does not guarantee ALLOW. HOLD, DENY, and ESCALATE remain
          valid preserved outcomes.
        </p>
      </div>

      <style jsx>{`
        .entryPanel {
          display: grid;
          grid-template-columns:
            minmax(0, 1.2fr)
            minmax(320px, 0.8fr);
          gap: 18px;
        }

        .resultColumn,
        .actionColumn {
          border: 1px solid #dce5e0;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 58px rgba(23, 65, 48, 0.06);
        }

        .resultColumn {
          padding: 28px;
        }

        .actionColumn {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 22px;
          padding: 28px;
          background:
            linear-gradient(
              145deg,
              rgba(247, 252, 249, 0.98),
              rgba(237, 247, 242, 0.98)
            );
        }

        .eyebrow,
        .actionLabel {
          margin: 0 0 10px;
          color: #0f7c5c;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .decisionBadge {
          display: inline-flex;
          margin-bottom: 18px;
          padding: 8px 12px;
          border: 1px solid #d8e1dc;
          border-radius: 999px;
          background: #f2f5f3;
          color: #65736c;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 0.08em;
        }

        .decisionBadge[data-tone="positive"] {
          border-color: #b6dfce;
          background: #e8f8f0;
          color: #08724f;
        }

        .decisionBadge[data-tone="warning"] {
          border-color: #ead6a4;
          background: #fff8e7;
          color: #8a6516;
        }

        .decisionBadge[data-tone="negative"] {
          border-color: #ecc4c4;
          background: #fff0f0;
          color: #9a3131;
        }

        h2,
        h3,
        p {
          margin-top: 0;
        }

        h2 {
          max-width: 760px;
          margin-bottom: 11px;
          color: #173128;
          font-size: 30px;
          line-height: 1.08;
          letter-spacing: -0.045em;
        }

        h3 {
          margin-bottom: 10px;
          color: #173128;
          font-size: 23px;
          line-height: 1.15;
          letter-spacing: -0.035em;
        }

        .summary,
        .actionColumn > div > p:last-child {
          margin-bottom: 0;
          color: #68766f;
          line-height: 1.65;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 24px;
        }

        .metrics > div {
          min-width: 0;
          padding: 14px;
          border: 1px solid #e0e7e3;
          border-radius: 13px;
          background: #f8faf9;
        }

        .metrics span {
          display: block;
          margin-bottom: 6px;
          color: #7c8882;
          font-size: 9px;
          font-weight: 850;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .metrics strong {
          display: block;
          overflow: hidden;
          color: #233d32;
          font-size: 14px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .boundary {
          margin-bottom: 0;
          padding-top: 16px;
          border-top: 1px solid #d7e3dd;
          color: #718078;
          font-size: 11px;
          line-height: 1.55;
        }

        @media (max-width: 900px) {
          .entryPanel {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 620px) {
          .resultColumn,
          .actionColumn {
            padding: 22px;
          }

          .metrics {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
