"use client";

import {
  type CSSProperties,
  useMemo,
} from "react";
import {
  evaluateAiGovernanceRoute,
  type AiGovernanceDecision,
  type AiGovernanceRequirementStatus,
} from "../../../../lib/ai-governance-route-adapter";
import type { TransferRouteDraft } from "../../../../lib/route-draft-transfer";

type AiGovernanceEvaluationPanelProps = {
  draft: TransferRouteDraft;
};

const decisionStyles: Record<
  AiGovernanceDecision,
  CSSProperties
> = {
  ALLOW: {
    background: "#d1fae5",
    color: "#065f46",
    borderColor: "#6ee7b7",
  },
  HOLD: {
    background: "#fef3c7",
    color: "#92400e",
    borderColor: "#fcd34d",
  },
  DENY: {
    background: "#fee2e2",
    color: "#991b1b",
    borderColor: "#fca5a5",
  },
  ESCALATE: {
    background: "#ede9fe",
    color: "#5b21b6",
    borderColor: "#c4b5fd",
  },
};

const requirementStyles: Record<
  AiGovernanceRequirementStatus,
  {
    badge: CSSProperties;
    card: CSSProperties;
    marker: string;
  }
> = {
  SATISFIED: {
    badge: {
      background: "#d1fae5",
      color: "#065f46",
    },
    card: {
      borderColor: "#a7f3d0",
      background: "#f5fffb",
    },
    marker: "✓",
  },
  UNKNOWN: {
    badge: {
      background: "#fef3c7",
      color: "#92400e",
    },
    card: {
      borderColor: "#fde68a",
      background: "#fffdf5",
    },
    marker: "?",
  },
  UNSATISFIED: {
    badge: {
      background: "#fee2e2",
      color: "#991b1b",
    },
    card: {
      borderColor: "#fecaca",
      background: "#fff8f8",
    },
    marker: "×",
  },
};

export function AiGovernanceEvaluationPanel({
  draft,
}: AiGovernanceEvaluationPanelProps) {
  const evaluation = useMemo(
    () => evaluateAiGovernanceRoute(draft),
    [draft],
  );

  const decisionStyle =
    decisionStyles[evaluation.decision];

  return (
    <section style={styles.panel}>
      <div style={styles.panelHeader}>
        <div>
          <span style={styles.eyebrow}>
            LIVE DOMAIN-ADAPTER EVALUATION
          </span>

          <h2 style={styles.title}>
            AI Governance admissibility review
          </h2>

          <p style={styles.intro}>
            The transferred route has been evaluated through
            the registered AI Governance adapter. This
            evaluation preserves the route&apos;s domain and
            does not submit it to the vendor-payment API.
          </p>
        </div>

        <div
          style={{
            ...styles.decisionCard,
            ...decisionStyle,
          }}
        >
          <span style={styles.decisionLabel}>
            ADAPTER DECISION
          </span>

          <strong style={styles.decisionValue}>
            {evaluation.decision}
          </strong>

          <span style={styles.decisionAction}>
            {formatNextAction(evaluation.nextAction)}
          </span>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <SummaryCard
          label="Satisfied"
          value={evaluation.satisfiedRequirements}
          detail="Requirements currently established"
        />

        <SummaryCard
          label="Unknown"
          value={evaluation.unresolvedRequirements}
          detail="Required facts not yet supplied"
        />

        <SummaryCard
          label="Failed"
          value={evaluation.failedRequirements}
          detail="Requirements determined unsatisfied"
        />

        <SummaryCard
          label="Requirements"
          value={evaluation.requirements.length}
          detail="AI Governance adapter checks"
        />
      </div>

      <div style={styles.truthBoundary}>
        <div style={styles.truthBoundaryMarker}>!</div>

        <div>
          <strong style={styles.truthBoundaryTitle}>
            Declared route content is not evidence.
          </strong>

          <p style={styles.truthBoundaryText}>
            The existence of all eight declared stages does
            not establish that evidence objects, authority
            proofs, commit artifacts, execution receipts, or
            outcome correspondence have been supplied or
            verified. Unknown is not satisfied.
          </p>
        </div>
      </div>

      <section style={styles.requirementsSection}>
        <div style={styles.sectionHeading}>
          <div>
            <span style={styles.sectionLabel}>
              ADAPTER REQUIREMENTS
            </span>

            <h3 style={styles.sectionTitle}>
              Requirement-by-requirement result
            </h3>
          </div>

          <span style={styles.requirementCount}>
            {evaluation.requirements.length} CHECKS
          </span>
        </div>

        <div style={styles.requirementGrid}>
          {evaluation.requirements.map((requirement) => {
            const statusStyle =
              requirementStyles[requirement.status];

            return (
              <article
                key={requirement.requirementId}
                style={{
                  ...styles.requirementCard,
                  ...statusStyle.card,
                }}
              >
                <div style={styles.requirementHeader}>
                  <div style={styles.requirementIdentity}>
                    <span
                      style={{
                        ...styles.requirementMarker,
                        ...statusStyle.badge,
                      }}
                    >
                      {statusStyle.marker}
                    </span>

                    <div>
                      <span style={styles.requirementId}>
                        {requirement.requirementId}
                      </span>

                      <h4 style={styles.requirementTitle}>
                        {requirement.label}
                      </h4>
                    </div>
                  </div>

                  <span
                    style={{
                      ...styles.statusBadge,
                      ...statusStyle.badge,
                    }}
                  >
                    {requirement.status}
                  </span>
                </div>

                <p style={styles.requirementReason}>
                  {requirement.reason}
                </p>

                <div style={styles.relatedStages}>
                  <span style={styles.relatedStagesLabel}>
                    RELATED CANONICAL STAGES
                  </span>

                  <div style={styles.stageTags}>
                    {requirement.relatedStages.map(
                      (stage) => (
                        <span
                          key={stage}
                          style={styles.stageTag}
                        >
                          {formatStage(stage)}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section style={styles.receiptSection}>
        <div style={styles.sectionHeading}>
          <div>
            <span style={styles.sectionLabel}>
              EVALUATION IDENTITY
            </span>

            <h3 style={styles.sectionTitle}>
              Deterministic adapter result
            </h3>
          </div>

          <span style={styles.adapterBadge}>
            {evaluation.adapter}
          </span>
        </div>

        <div style={styles.receiptGrid}>
          <ReceiptField
            label="Route ID"
            value={evaluation.routeId}
            code
          />

          <ReceiptField
            label="Domain"
            value={evaluation.domain}
          />

          <ReceiptField
            label="Evaluated"
            value={evaluation.evaluatedAt}
          />

          <ReceiptField
            label="Decision"
            value={evaluation.decision}
          />

          <ReceiptField
            label="Deterministic fingerprint"
            value={evaluation.deterministicFingerprint}
            code
            wide
          />
        </div>
      </section>

      <section style={styles.limitationsSection}>
        <span style={styles.sectionLabel}>
          CURRENT LIMITATIONS
        </span>

        <h3 style={styles.sectionTitle}>
          What this adapter has not proven
        </h3>

        <div style={styles.limitationsList}>
          {evaluation.limitations.map(
            (limitation, index) => (
              <div
                key={`${index}-${limitation}`}
                style={styles.limitationItem}
              >
                <span style={styles.limitationNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{limitation}</span>
              </div>
            ),
          )}
        </div>
      </section>

      <footer style={styles.principleCard}>
        <span style={styles.principleLabel}>
          TA-14 GOVERNING PRINCIPLE
        </span>

        <strong style={styles.principle}>
          {evaluation.governingPrinciple}
        </strong>
      </footer>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <article style={styles.summaryCard}>
      <span style={styles.summaryLabel}>{label}</span>

      <strong style={styles.summaryValue}>
        {value}
      </strong>

      <span style={styles.summaryDetail}>
        {detail}
      </span>
    </article>
  );
}

function ReceiptField({
  label,
  value,
  code = false,
  wide = false,
}: {
  label: string;
  value: string;
  code?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      style={{
        ...styles.receiptField,
        ...(wide ? styles.receiptFieldWide : {}),
      }}
    >
      <span style={styles.receiptLabel}>
        {label}
      </span>

      {code ? (
        <code style={styles.receiptCode}>
          {value}
        </code>
      ) : (
        <strong style={styles.receiptValue}>
          {value}
        </strong>
      )}
    </div>
  );
}

function formatStage(stage: string): string {
  return stage
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1).toLowerCase(),
    )
    .join(" ");
}

function formatNextAction(value: string): string {
  return value
    .split("_")
    .map((part) => part.toLowerCase())
    .join(" ")
    .replace(
      /^./,
      (character) => character.toUpperCase(),
    );
}

const styles: Record<string, CSSProperties> = {
  panel: {
    display: "grid",
    gap: 24,
    minWidth: 0,
  },
  panelHeader: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
    gap: 24,
    alignItems: "stretch",
    padding: "clamp(24px, 4vw, 42px)",
    border: "1px solid #d9dde4",
    borderRadius: 18,
    background: "#ffffff",
    boxShadow:
      "0 18px 55px rgba(15,23,42,0.06)",
  },
  eyebrow: {
    color: "#067a58",
    fontSize: 11,
    fontWeight: 900,
    letterSpacing: "0.16em",
  },
  title: {
    maxWidth: 780,
    margin: "12px 0",
    color: "#111827",
    fontSize: "clamp(30px, 4vw, 48px)",
    lineHeight: 1.05,
    letterSpacing: "-0.045em",
  },
  intro: {
    maxWidth: 780,
    marginBottom: 0,
    color: "#667085",
    fontSize: 15,
    lineHeight: 1.7,
  },
  decisionCard: {
    display: "grid",
    alignContent: "center",
    minHeight: 190,
    padding: 28,
    border: "1px solid",
    borderRadius: 16,
  },
  decisionLabel: {
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.15em",
  },
  decisionValue: {
    display: "block",
    margin: "15px 0 10px",
    fontSize: "clamp(38px, 6vw, 62px)",
    lineHeight: 1,
    letterSpacing: "-0.055em",
  },
  decisionAction: {
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.5,
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",
    gap: 14,
  },
  summaryCard: {
    display: "grid",
    gap: 8,
    minWidth: 0,
    padding: 22,
    border: "1px solid #d9dde4",
    borderRadius: 14,
    background: "#ffffff",
  },
  summaryLabel: {
    color: "#697386",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  summaryValue: {
    color: "#111827",
    fontSize: 36,
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },
  summaryDetail: {
    color: "#7b8491",
    fontSize: 12,
    lineHeight: 1.5,
  },
  truthBoundary: {
    display: "grid",
    gridTemplateColumns: "42px minmax(0, 1fr)",
    gap: 16,
    alignItems: "start",
    padding: 22,
    border: "1px solid #f2d18a",
    borderRadius: 14,
    background: "#fffbeb",
    color: "#78350f",
  },
  truthBoundaryMarker: {
    display: "grid",
    placeItems: "center",
    width: 42,
    height: 42,
    borderRadius: 999,
    background: "#fef3c7",
    color: "#92400e",
    fontSize: 20,
    fontWeight: 900,
  },
  truthBoundaryTitle: {
    display: "block",
    fontSize: 15,
    fontWeight: 900,
  },
  truthBoundaryText: {
    margin: "8px 0 0",
    fontSize: 13,
    lineHeight: 1.7,
  },
  requirementsSection: {
    padding: "clamp(24px, 4vw, 38px)",
    border: "1px solid #d9dde4",
    borderRadius: 18,
    background: "#ffffff",
  },
  sectionHeading: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 24,
  },
  sectionLabel: {
    color: "#697386",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },
  sectionTitle: {
    margin: "8px 0 0",
    color: "#111827",
    fontSize: "clamp(25px, 3vw, 36px)",
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
  },
  requirementCount: {
    padding: "7px 10px",
    borderRadius: 999,
    background: "#eef2f7",
    color: "#475569",
    fontSize: 10,
    fontWeight: 900,
  },
  requirementGrid: {
    display: "grid",
    gap: 14,
  },
  requirementCard: {
    minWidth: 0,
    padding: 20,
    border: "1px solid",
    borderRadius: 14,
  },
  requirementHeader: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  requirementIdentity: {
    display: "flex",
    minWidth: 0,
    flex: "1 1 280px",
    alignItems: "flex-start",
    gap: 13,
  },
  requirementMarker: {
    display: "grid",
    flex: "0 0 auto",
    placeItems: "center",
    width: 32,
    height: 32,
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 900,
  },
  requirementId: {
    display: "block",
    color: "#7b8491",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.09em",
    overflowWrap: "anywhere",
  },
  requirementTitle: {
    margin: "5px 0 0",
    color: "#111827",
    fontSize: 17,
    lineHeight: 1.35,
  },
  statusBadge: {
    padding: "7px 10px",
    borderRadius: 999,
    fontSize: 9,
    fontWeight: 900,
  },
  requirementReason: {
    margin: "18px 0",
    color: "#566171",
    fontSize: 13,
    lineHeight: 1.7,
  },
  relatedStages: {
    display: "grid",
    gap: 9,
    paddingTop: 15,
    borderTop: "1px solid rgba(148,163,184,0.25)",
  },
  relatedStagesLabel: {
    color: "#7b8491",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.1em",
  },
  stageTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 7,
  },
  stageTag: {
    padding: "6px 9px",
    border: "1px solid #d9dde4",
    borderRadius: 999,
    background: "#ffffff",
    color: "#475569",
    fontSize: 10,
    fontWeight: 800,
  },
  receiptSection: {
    padding: "clamp(24px, 4vw, 38px)",
    border: "1px solid #d9dde4",
    borderRadius: 18,
    background: "#ffffff",
  },
  adapterBadge: {
    maxWidth: "100%",
    padding: "7px 10px",
    borderRadius: 999,
    background: "#d1fae5",
    color: "#065f46",
    fontSize: 9,
    fontWeight: 900,
    overflowWrap: "anywhere",
  },
  receiptGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
    gap: 12,
  },
  receiptField: {
    display: "grid",
    gap: 8,
    minWidth: 0,
    padding: 17,
    border: "1px solid #e2e5ea",
    borderRadius: 11,
    background: "#f8fafc",
  },
  receiptFieldWide: {
    gridColumn: "1 / -1",
  },
  receiptLabel: {
    color: "#697386",
    fontSize: 9,
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  receiptValue: {
    color: "#111827",
    fontSize: 13,
    overflowWrap: "anywhere",
  },
  receiptCode: {
    color: "#067a58",
    fontSize: 12,
    fontWeight: 800,
    overflowWrap: "anywhere",
    whiteSpace: "normal",
  },
  limitationsSection: {
    padding: "clamp(24px, 4vw, 38px)",
    border: "1px solid #d9dde4",
    borderRadius: 18,
    background: "#ffffff",
  },
  limitationsList: {
    display: "grid",
    gap: 10,
    marginTop: 22,
  },
  limitationItem: {
    display: "grid",
    gridTemplateColumns: "34px minmax(0, 1fr)",
    gap: 12,
    alignItems: "start",
    padding: 15,
    border: "1px solid #e2e5ea",
    borderRadius: 10,
    background: "#f8fafc",
    color: "#566171",
    fontSize: 13,
    lineHeight: 1.65,
  },
  limitationNumber: {
    color: "#067a58",
    fontSize: 10,
    fontWeight: 900,
  },
  principleCard: {
    display: "grid",
    gap: 14,
    padding: "clamp(24px, 4vw, 38px)",
    borderRadius: 18,
    background: "#0b1020",
    color: "#ffffff",
  },
  principleLabel: {
    color: "#9aa8b9",
    fontSize: 10,
    fontWeight: 900,
    letterSpacing: "0.14em",
  },
  principle: {
    color: "#69f0c1",
    fontSize: "clamp(22px, 3vw, 34px)",
    lineHeight: 1.25,
    letterSpacing: "-0.025em",
  },
};
