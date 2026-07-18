import type { CSSProperties } from "react";

export type EvaluationDecision =
  | "ALLOW"
  | "HOLD"
  | "DENY"
  | "ESCALATE"
  | "PENDING";

export type ChainStageState =
  | "COMPLETE"
  | "UNRESOLVED"
  | "BLOCKED"
  | "NOT_EVALUATED";

export type EvaluationRequirement = {
  category:
    | "Evidence"
    | "Authority"
    | "Identity"
    | "Policy"
    | "Execution"
    | "Outcome";
  label: string;
  state: "SATISFIED" | "UNKNOWN" | "UNSATISFIED";
  explanation: string;
};

export type EvaluationConsoleSummaryProps = {
  routeTitle: string;
  routeDomain: string;
  routeIdentity?: string;
  decision: EvaluationDecision;
  adapterName: string;
  evaluatedAt?: string;
  fingerprint?: string;
  chainStages: Array<{
    number: string;
    label: string;
    state: ChainStageState;
  }>;
  requirements?: EvaluationRequirement[];
  limitations?: string[];
};

const lifecycleStages = [
  "Route Construction",
  "Evidence Intake",
  "Admissibility Decision",
  "Finality & Certificates",
  "Reliance",
  "Closure & Audit",
  "Remediation & Retest",
  "Restoration",
  "Reauthorization",
  "Activation & Outcome",
];

const decisionTheme: Record<
  EvaluationDecision,
  {
    background: string;
    border: string;
    color: string;
  }
> = {
  ALLOW: {
    background: "#ecfdf5",
    border: "#a7f3d0",
    color: "#065f46",
  },
  HOLD: {
    background: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
  },
  DENY: {
    background: "#fef2f2",
    border: "#fecaca",
    color: "#991b1b",
  },
  ESCALATE: {
    background: "#f5f3ff",
    border: "#ddd6fe",
    color: "#5b21b6",
  },
  PENDING: {
    background: "#f8fafc",
    border: "#cbd5e1",
    color: "#334155",
  },
};

const chainTheme: Record<
  ChainStageState,
  {
    symbol: string;
    label: string;
    background: string;
    border: string;
    color: string;
  }
> = {
  COMPLETE: {
    symbol: "✓",
    label: "Complete",
    background: "#ecfdf5",
    border: "#a7f3d0",
    color: "#065f46",
  },
  UNRESOLVED: {
    symbol: "?",
    label: "Unresolved",
    background: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
  },
  BLOCKED: {
    symbol: "×",
    label: "Blocked",
    background: "#fef2f2",
    border: "#fecaca",
    color: "#991b1b",
  },
  NOT_EVALUATED: {
    symbol: "○",
    label: "Not evaluated",
    background: "#f8fafc",
    border: "#cbd5e1",
    color: "#475569",
  },
};

const requirementTheme: Record<
  EvaluationRequirement["state"],
  {
    background: string;
    border: string;
    color: string;
  }
> = {
  SATISFIED: {
    background: "#ecfdf5",
    border: "#a7f3d0",
    color: "#065f46",
  },
  UNKNOWN: {
    background: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
  },
  UNSATISFIED: {
    background: "#fef2f2",
    border: "#fecaca",
    color: "#991b1b",
  },
};

function formatTimestamp(value?: string): string {
  if (!value) {
    return "Not yet issued";
  }

  const timestamp = new Date(value);

  if (Number.isNaN(timestamp.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
}

function activeLifecycleIndex(decision: EvaluationDecision): number {
  return decision === "PENDING" ? 1 : 2;
}

export function EvaluationConsoleSummary({
  routeTitle,
  routeDomain,
  routeIdentity,
  decision,
  adapterName,
  evaluatedAt,
  fingerprint,
  chainStages,
  requirements = [],
  limitations = [],
}: EvaluationConsoleSummaryProps) {
  const theme = decisionTheme[decision];
  const lifecycleIndex = activeLifecycleIndex(decision);

  const unresolvedRequirements = requirements.filter(
    (requirement) => requirement.state !== "SATISFIED",
  );

  const groupedRequirements = unresolvedRequirements.reduce<
    Record<string, EvaluationRequirement[]>
  >((groups, requirement) => {
    const current = groups[requirement.category] ?? [];

    return {
      ...groups,
      [requirement.category]: [...current, requirement],
    };
  }, {});

  return (
    <section style={styles.console}>
      <div style={styles.headingRow}>
        <div>
          <div style={styles.eyebrow}>EVALUATION CONSOLE</div>
          <h2 style={styles.title}>Governance route under review</h2>
          <p style={styles.introduction}>
            This console identifies the route, evaluation lane, current
            decision, unresolved requirements, and exact boundary of the
            evaluation performed.
          </p>
        </div>

        <div
          style={{
            ...styles.decisionBadge,
            background: theme.background,
            borderColor: theme.border,
            color: theme.color,
          }}
        >
          <span style={styles.decisionLabel}>CURRENT DECISION</span>
          <strong style={styles.decisionValue}>{decision}</strong>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <SummaryCard label="Route" value={routeTitle} />
        <SummaryCard label="Domain" value={routeDomain} />
        <SummaryCard
          label="Route identity"
          value={routeIdentity ?? "Not yet issued"}
          monospace={Boolean(routeIdentity)}
        />
        <SummaryCard label="Evaluation adapter" value={adapterName} />
        <SummaryCard
          label="Evaluated"
          value={formatTimestamp(evaluatedAt)}
        />
        <SummaryCard
          label="Deterministic fingerprint"
          value={fingerprint ?? "Not yet issued"}
          monospace={Boolean(fingerprint)}
        />
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeading}>
          <div>
            <div style={styles.sectionEyebrow}>OPERATIONAL LIFECYCLE</div>
            <h3 style={styles.sectionTitle}>
              Current position in the route lifecycle
            </h3>
          </div>

          <span style={styles.stageCounter}>
            Stage {lifecycleIndex + 1} of {lifecycleStages.length}
          </span>
        </div>

        <div style={styles.lifecycleGrid}>
          {lifecycleStages.map((stage, index) => {
            const completed = index < lifecycleIndex;
            const active = index === lifecycleIndex;

            return (
              <div
                key={stage}
                style={{
                  ...styles.lifecycleStage,
                  ...(completed ? styles.lifecycleStageComplete : {}),
                  ...(active ? styles.lifecycleStageActive : {}),
                }}
              >
                <span style={styles.lifecycleNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span style={styles.lifecycleName}>{stage}</span>
                <span style={styles.lifecycleState}>
                  {completed ? "COMPLETE" : active ? "CURRENT" : "PENDING"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeading}>
          <div>
            <div style={styles.sectionEyebrow}>CANONICAL CHAIN</div>
            <h3 style={styles.sectionTitle}>
              Reality-to-outcome route condition
            </h3>
          </div>

          <span style={styles.chainBoundary}>
            Declaration does not equal proof
          </span>
        </div>

        <div style={styles.chainGrid}>
          {chainStages.map((stage) => {
            const stageTheme = chainTheme[stage.state];

            return (
              <div
                key={`${stage.number}-${stage.label}`}
                style={{
                  ...styles.chainStage,
                  background: stageTheme.background,
                  borderColor: stageTheme.border,
                  color: stageTheme.color,
                }}
              >
                <div style={styles.chainStageTop}>
                  <span style={styles.chainNumber}>{stage.number}</span>
                  <span style={styles.chainSymbol}>{stageTheme.symbol}</span>
                </div>

                <strong style={styles.chainLabel}>{stage.label}</strong>
                <span style={styles.chainState}>{stageTheme.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.twoColumnGrid}>
        <div style={styles.boundaryPanel}>
          <div style={styles.sectionEyebrow}>EVALUATION BOUNDARY</div>
          <h3 style={styles.sectionTitle}>What this decision establishes</h3>

          <p style={styles.bodyText}>
            The decision applies only to this bounded route, its submitted
            declarations, available evidence, current authority basis,
            selected adapter, and evaluation time.
          </p>

          <div style={styles.boundaryList}>
            <BoundaryRow
              label="Evaluated"
              value={`${routeDomain} route through ${adapterName}`}
            />
            <BoundaryRow
              label="Decision scope"
              value="Current route version and currently available proof"
            />
            <BoundaryRow
              label="Not established"
              value="Independent truth, legal approval, production custody, execution, or outcome unless explicitly proven"
            />
          </div>
        </div>

        <div style={styles.rationalePanel}>
          <div style={styles.sectionEyebrow}>DECISION RATIONALE</div>
          <h3 style={styles.sectionTitle}>
            {unresolvedRequirements.length === 0
              ? "No unresolved requirements reported"
              : `${unresolvedRequirements.length} unresolved requirement${
                  unresolvedRequirements.length === 1 ? "" : "s"
                }`}
          </h3>

          {Object.keys(groupedRequirements).length === 0 ? (
            <p style={styles.bodyText}>
              The connected evaluator did not report any unresolved
              requirements for this bounded evaluation.
            </p>
          ) : (
            <div style={styles.requirementGroups}>
              {Object.entries(groupedRequirements).map(
                ([category, categoryRequirements]) => (
                  <div key={category} style={styles.requirementGroup}>
                    <div style={styles.requirementCategory}>{category}</div>

                    {categoryRequirements.map((requirement) => {
                      const requirementStyle =
                        requirementTheme[requirement.state];

                      return (
                        <div
                          key={`${category}-${requirement.label}`}
                          style={styles.requirement}
                        >
                          <div style={styles.requirementHeading}>
                            <strong style={styles.requirementLabel}>
                              {requirement.label}
                            </strong>

                            <span
                              style={{
                                ...styles.requirementState,
                                background: requirementStyle.background,
                                borderColor: requirementStyle.border,
                                color: requirementStyle.color,
                              }}
                            >
                              {requirement.state}
                            </span>
                          </div>

                          <p style={styles.requirementExplanation}>
                            {requirement.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>

      {limitations.length > 0 ? (
        <div style={styles.limitationsPanel}>
          <div>
            <div style={styles.sectionEyebrow}>CURRENT LIMITATIONS</div>
            <h3 style={styles.sectionTitle}>
              Conditions outside this evaluation
            </h3>
          </div>

          <div style={styles.limitationsGrid}>
            {limitations.map((limitation) => (
              <div key={limitation} style={styles.limitation}>
                <span style={styles.limitationMarker}>!</span>
                <span>{limitation}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div style={styles.principle}>
        <span style={styles.principleLabel}>GOVERNING PRINCIPLE</span>
        <strong style={styles.principleText}>
          NO ADMISSIBLE EVIDENCE. NO ADMISSIBLE EXECUTION.
        </strong>
      </div>
    </section>
  );
}

function SummaryCard({
  label,
  value,
  monospace = false,
}: {
  label: string;
  value: string;
  monospace?: boolean;
}) {
  return (
    <div style={styles.summaryCard}>
      <span style={styles.summaryLabel}>{label}</span>
      <strong
        style={{
          ...styles.summaryValue,
          ...(monospace ? styles.monospace : {}),
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function BoundaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div style={styles.boundaryRow}>
      <span style={styles.boundaryLabel}>{label}</span>
      <span style={styles.boundaryValue}>{value}</span>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  console: {
    display: "grid",
    gap: 24,
    padding: 28,
    border: "1px solid #dbe3ec",
    borderRadius: 24,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
  },
  headingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 24,
    flexWrap: "wrap",
  },
  eyebrow: {
    marginBottom: 8,
    color: "#2563eb",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.14em",
  },
  title: {
    margin: 0,
    color: "#0f172a",
    fontSize: 30,
    lineHeight: 1.12,
    letterSpacing: "-0.03em",
  },
  introduction: {
    maxWidth: 760,
    margin: "12px 0 0",
    color: "#475569",
    fontSize: 15,
    lineHeight: 1.7,
  },
  decisionBadge: {
    minWidth: 170,
    padding: "15px 18px",
    border: "1px solid",
    borderRadius: 16,
    textAlign: "right",
  },
  decisionLabel: {
    display: "block",
    marginBottom: 5,
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.12em",
  },
  decisionValue: {
    fontSize: 24,
    letterSpacing: "-0.02em",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 12,
  },
  summaryCard: {
    minWidth: 0,
    padding: 16,
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    background: "#ffffff",
  },
  summaryLabel: {
    display: "block",
    marginBottom: 7,
    color: "#64748b",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  summaryValue: {
    display: "block",
    overflowWrap: "anywhere",
    color: "#0f172a",
    fontSize: 14,
    lineHeight: 1.45,
  },
  monospace: {
    fontFamily:
      '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: 12,
  },
  section: {
    paddingTop: 24,
    borderTop: "1px solid #e2e8f0",
  },
  sectionHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 16,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  sectionEyebrow: {
    marginBottom: 6,
    color: "#64748b",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.12em",
  },
  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: 19,
    lineHeight: 1.3,
  },
  stageCounter: {
    color: "#475569",
    fontSize: 12,
    fontWeight: 700,
  },
  lifecycleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
    gap: 8,
  },
  lifecycleStage: {
    display: "grid",
    alignContent: "space-between",
    minHeight: 112,
    padding: 13,
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    background: "#f8fafc",
  },
  lifecycleStageComplete: {
    borderColor: "#bfdbfe",
    background: "#eff6ff",
  },
  lifecycleStageActive: {
    borderColor: "#2563eb",
    background: "#dbeafe",
    boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.08)",
  },
  lifecycleNumber: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: 800,
  },
  lifecycleName: {
    margin: "9px 0",
    color: "#0f172a",
    fontSize: 12,
    fontWeight: 750,
    lineHeight: 1.35,
  },
  lifecycleState: {
    color: "#64748b",
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.08em",
  },
  chainBoundary: {
    color: "#92400e",
    fontSize: 11,
    fontWeight: 700,
  },
  chainGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(115px, 1fr))",
    gap: 10,
  },
  chainStage: {
    minHeight: 112,
    padding: 14,
    border: "1px solid",
    borderRadius: 15,
  },
  chainStageTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 17,
  },
  chainNumber: {
    fontSize: 10,
    fontWeight: 800,
    opacity: 0.7,
  },
  chainSymbol: {
    display: "grid",
    width: 24,
    height: 24,
    placeItems: "center",
    border: "1px solid currentColor",
    borderRadius: "50%",
    fontSize: 13,
    fontWeight: 800,
  },
  chainLabel: {
    display: "block",
    fontSize: 13,
  },
  chainState: {
    display: "block",
    marginTop: 5,
    fontSize: 10,
    fontWeight: 700,
    opacity: 0.8,
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 16,
  },
  boundaryPanel: {
    padding: 20,
    border: "1px solid #dbeafe",
    borderRadius: 18,
    background: "#f8fbff",
  },
  rationalePanel: {
    padding: 20,
    border: "1px solid #e2e8f0",
    borderRadius: 18,
    background: "#ffffff",
  },
  bodyText: {
    margin: "12px 0 0",
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.65,
  },
  boundaryList: {
    display: "grid",
    gap: 10,
    marginTop: 17,
  },
  boundaryRow: {
    display: "grid",
    gap: 4,
    paddingTop: 10,
    borderTop: "1px solid #dbeafe",
  },
  boundaryLabel: {
    color: "#2563eb",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  boundaryValue: {
    color: "#334155",
    fontSize: 13,
    lineHeight: 1.5,
  },
  requirementGroups: {
    display: "grid",
    gap: 16,
    marginTop: 16,
  },
  requirementGroup: {
    display: "grid",
    gap: 8,
  },
  requirementCategory: {
    color: "#64748b",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  requirement: {
    padding: 13,
    border: "1px solid #e2e8f0",
    borderRadius: 13,
    background: "#f8fafc",
  },
  requirementHeading: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  requirementLabel: {
    color: "#0f172a",
    fontSize: 13,
  },
  requirementState: {
    padding: "4px 7px",
    border: "1px solid",
    borderRadius: 999,
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: "0.05em",
  },
  requirementExplanation: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: 12,
    lineHeight: 1.5,
  },
  limitationsPanel: {
    display: "grid",
    gap: 16,
    padding: 20,
    border: "1px solid #fed7aa",
    borderRadius: 18,
    background: "#fffaf5",
  },
  limitationsGrid: {
    display: "grid",
    gap: 8,
  },
  limitation: {
    display: "flex",
    gap: 9,
    alignItems: "flex-start",
    color: "#7c2d12",
    fontSize: 13,
    lineHeight: 1.5,
  },
  limitationMarker: {
    display: "grid",
    flex: "0 0 auto",
    width: 19,
    height: 19,
    placeItems: "center",
    border: "1px solid #fdba74",
    borderRadius: "50%",
    fontSize: 10,
    fontWeight: 900,
  },
  principle: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "center",
    padding: "18px 20px",
    borderRadius: 16,
    background: "#0f172a",
    color: "#ffffff",
    flexWrap: "wrap",
  },
  principleLabel: {
    color: "#93c5fd",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: "0.12em",
  },
  principleText: {
    fontSize: 14,
    letterSpacing: "0.02em",
  },
};
