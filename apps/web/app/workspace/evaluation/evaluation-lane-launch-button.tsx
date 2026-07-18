"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  stageEvaluationLane,
  type EvaluationLaneId,
} from "../../../lib/evaluation-lanes";

type EvaluationLaneLaunchButtonProps = {
  laneId?: EvaluationLaneId;
  routeLibraryId?: string;
  routeName?: string;
  href?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function EvaluationLaneLaunchButton({
  laneId = "FREE_SIMULATION",
  routeLibraryId,
  routeName,
  href = "/workspace/evaluation/lanes",
  className,
  children,
}: EvaluationLaneLaunchButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openLaneSelection() {
    setBusy(true);
    setError(null);

    try {
      stageEvaluationLane({
        laneId,
        ...(routeLibraryId ? { routeLibraryId } : {}),
        ...(routeName ? { routeName } : {}),
      });

      router.push(href);
    } catch (caughtError) {
      setBusy(false);
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The evaluation lane could not be opened.",
      );
    }
  }

  return (
    <div className="launchControl">
      <button
        type="button"
        className={className}
        onClick={openLaneSelection}
        disabled={busy}
      >
        {busy
          ? "Opening evaluation lanes…"
          : children ?? "Choose evaluation lane →"}
      </button>

      {error ? (
        <span className="errorMessage" role="alert">
          {error}
        </span>
      ) : null}

      <style jsx>{`
        .launchControl {
          display: inline-grid;
          gap: 7px;
        }

        button {
          padding: 12px 16px;
          border: 1px solid #123c2e;
          border-radius: 11px;
          background: #123c2e;
          color: white;
          font: inherit;
          font-weight: 900;
          cursor: pointer;
          transition:
            transform 150ms ease,
            opacity 150ms ease,
            box-shadow 150ms ease;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 26px rgba(18, 60, 46, 0.16);
        }

        button:disabled {
          cursor: wait;
          opacity: 0.65;
        }

        .errorMessage {
          max-width: 360px;
          color: #9b3131;
          font-size: 11px;
          font-weight: 750;
          line-height: 1.45;
        }
      `}</style>
    </div>
  );
}
