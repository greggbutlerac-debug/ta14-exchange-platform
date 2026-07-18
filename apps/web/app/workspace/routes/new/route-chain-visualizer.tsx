"use client";

import type {
  CSSProperties,
  KeyboardEvent,
} from "react";
import type {
  TransferRouteDraft,
  TransferStageKey,
} from "../../../../lib/route-draft-transfer";

export type RouteChainStage = {
  key: TransferStageKey;
  number: string;
  label: string;
};

type RouteChainVisualizerProps = {
  stages: RouteChainStage[];
  draft: TransferRouteDraft | null;
  selectedStage: TransferStageKey;
  onSelectStage: (stage: TransferStageKey) => void;
  variant?: "horizontal" | "vertical";
  ariaLabel?: string;
};

export function RouteChainVisualizer({
  stages,
  draft,
  selectedStage,
  onSelectStage,
  variant = "horizontal",
  ariaLabel = "TA-14 canonical route chain",
}: RouteChainVisualizerProps) {
  function selectAdjacentStage(
    currentIndex: number,
    direction: -1 | 1,
  ) {
    const nextIndex =
      (currentIndex + direction + stages.length) %
      stages.length;

    const nextStage = stages[nextIndex];

    if (nextStage) {
      onSelectStage(nextStage.key);
    }
  }

  function handleStageKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) {
    if (
      event.key === "ArrowRight" ||
      event.key === "ArrowDown"
    ) {
      event.preventDefault();
      selectAdjacentStage(currentIndex, 1);
      return;
    }

    if (
      event.key === "ArrowLeft" ||
      event.key === "ArrowUp"
    ) {
      event.preventDefault();
      selectAdjacentStage(currentIndex, -1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();

      const firstStage = stages[0];

      if (firstStage) {
        onSelectStage(firstStage.key);
      }

      return;
    }

    if (event.key === "End") {
      event.preventDefault();

      const finalStage = stages[stages.length - 1];

      if (finalStage) {
        onSelectStage(finalStage.key);
      }
    }
  }

  if (variant === "vertical") {
    return (
      <div
        role="tablist"
        aria-label={ariaLabel}
        aria-orientation="vertical"
        style={styles.verticalChain}
      >
        {stages.map((stage, index) => {
          const active = selectedStage === stage.key;
          const complete =
            draft?.chain[stage.key] !== "UNKNOWN";

          return (
            <button
              key={stage.key}
              type="button"
              role="tab"
              aria-selected={active}
              aria-controls={`route-stage-${stage.key}`}
              tabIndex={active ? 0 : -1}
              onClick={() => onSelectStage(stage.key)}
              onKeyDown={(event) =>
                handleStageKeyDown(event, index)
              }
              style={{
                ...styles.verticalStage,
                ...(active
                  ? styles.verticalStageActive
                  : {}),
              }}
            >
              <span style={styles.verticalNumber}>
                {stage.number}
              </span>

              <span style={styles.verticalLabel}>
                {stage.label}
              </span>

              <StageState
                hasDraft={Boolean(draft)}
                complete={complete}
              />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      style={styles.horizontalChain}
    >
      {stages.map((stage, index) => {
        const active = selectedStage === stage.key;
        const complete =
          draft?.chain[stage.key] !== "UNKNOWN";

        return (
          <button
            key={stage.key}
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={`route-stage-${stage.key}`}
            tabIndex={active ? 0 : -1}
            onClick={() => onSelectStage(stage.key)}
            onKeyDown={(event) =>
              handleStageKeyDown(event, index)
            }
            style={{
              ...styles.horizontalStage,
              ...(active
                ? styles.horizontalStageActive
                : {}),
            }}
          >
            <span style={styles.horizontalNumber}>
              {stage.number}
            </span>

            <span style={styles.horizontalLabel}>
              {stage.label}
            </span>

            <StageState
              hasDraft={Boolean(draft)}
              complete={complete}
            />
          </button>
        );
      })}
    </div>
  );
}

function StageState({
  hasDraft,
  complete,
}: {
  hasDraft: boolean;
  complete: boolean;
}) {
  if (!hasDraft) {
    return <span aria-hidden="true" />;
  }

  return (
    <span
      aria-label={
        complete
          ? "Stage declaration present"
          : "Stage declaration unresolved"
      }
      title={
        complete
          ? "Declaration present"
          : "Declaration unresolved"
      }
      style={{
        ...styles.stageState,
        ...(complete
          ? styles.stageComplete
          : styles.stageUnknown),
      }}
    >
      {complete ? "✓" : "○"}
    </span>
  );
}

const styles: Record<string, CSSProperties> = {
  horizontalChain: {
    display: "grid",
    gridTemplateColumns:
      "repeat(8, minmax(130px, 1fr))",
    overflowX: "auto",
    borderTop: "1px solid #d9dde4",
    borderBottom: "1px solid #d9dde4",
    background: "#ffffff",
  },
  horizontalStage: {
    display: "grid",
    gridTemplateColumns: "24px 1fr 24px",
    alignItems: "center",
    gap: 8,
    minWidth: 130,
    padding: "15px 18px",
    border: 0,
    borderRight: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#263140",
    fontSize: 13,
    fontWeight: 800,
    textAlign: "left",
    cursor: "pointer",
  },
  horizontalStageActive: {
    background: "#eaf8f2",
    color: "#075f47",
    boxShadow:
      "inset 0 -3px 0 #07805d",
  },
  horizontalNumber: {
    color: "#067a58",
    fontSize: 9,
    fontWeight: 900,
  },
  horizontalLabel: {
    minWidth: 0,
  },
  verticalChain: {
    display: "grid",
    alignContent: "start",
    gap: 7,
    padding: 18,
    border: "1px solid #d9dde4",
    borderRadius: 15,
    background: "#ffffff",
  },
  verticalStage: {
    display: "grid",
    gridTemplateColumns: "34px 1fr 24px",
    alignItems: "center",
    gap: 8,
    width: "100%",
    padding: 12,
    border: "1px solid transparent",
    borderRadius: 10,
    background: "#ffffff",
    color: "#4b5563",
    fontSize: 13,
    fontWeight: 800,
    textAlign: "left",
    cursor: "pointer",
  },
  verticalStageActive: {
    borderColor: "#a9dbc9",
    background: "#eaf8f2",
    color: "#064e3b",
  },
  verticalNumber: {
    color: "#07805d",
    fontSize: 10,
    fontWeight: 900,
  },
  verticalLabel: {
    minWidth: 0,
  },
  stageState: {
    display: "grid",
    placeItems: "center",
    width: 21,
    height: 21,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 900,
  },
  stageComplete: {
    background: "#d1fae5",
    color: "#065f46",
  },
  stageUnknown: {
    background: "#edf0f3",
    color: "#8a93a2",
  },
};
