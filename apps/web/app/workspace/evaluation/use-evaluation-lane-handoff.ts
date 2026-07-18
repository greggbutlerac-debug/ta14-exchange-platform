"use client";

import { useEffect, useMemo, useState } from "react";
import {
  clearEvaluationLane,
  readEvaluationLane,
  type EvaluationLaneId,
  type EvaluationLaneSelection,
} from "../../../lib/evaluation-lanes";

export type EvaluationLaneHandoffState = {
  hydrated: boolean;
  selection: EvaluationLaneSelection | null;
  laneId: EvaluationLaneId;
  routeLibraryId?: string;
  routeName?: string;
  clear: () => void;
};

export function useEvaluationLaneHandoff(
  fallbackLaneId: EvaluationLaneId = "FREE_SIMULATION",
): EvaluationLaneHandoffState {
  const [hydrated, setHydrated] = useState(false);
  const [selection, setSelection] =
    useState<EvaluationLaneSelection | null>(null);

  useEffect(() => {
    setSelection(readEvaluationLane());
    setHydrated(true);
  }, []);

  return useMemo(
    () => ({
      hydrated,
      selection,
      laneId: selection?.laneId ?? fallbackLaneId,
      ...(selection?.routeLibraryId
        ? { routeLibraryId: selection.routeLibraryId }
        : {}),
      ...(selection?.routeName
        ? { routeName: selection.routeName }
        : {}),
      clear: () => {
        clearEvaluationLane();
        setSelection(null);
      },
    }),
    [fallbackLaneId, hydrated, selection],
  );
}
