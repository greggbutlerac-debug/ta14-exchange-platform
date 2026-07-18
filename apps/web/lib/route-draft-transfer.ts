export const ROUTE_DRAFT_STORAGE_KEY =
  "ta14.exchange.pending-route-draft";

export type TransferStageKey =
  | "reality"
  | "record"
  | "continuity"
  | "admissibility"
  | "binding"
  | "commit"
  | "execution"
  | "outcome";

export type TransferRouteDraft = {
  schema: "TA14_ROUTE_DRAFT_V1";
  routeId: string;
  status: "DRAFT" | "HOLD" | "READY_FOR_TEST";
  metadata: {
    name: string;
    domain: string;
    owner: string;
    version: number;
  };
  chain: Record<TransferStageKey, string>;
  readiness: {
    completedStages: number;
    totalStages: number;
    missingStages: string[];
    nextAction: string;
  };
  governingPrinciple: string;
};

export function savePendingRouteDraft(
  draft: TransferRouteDraft,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    ROUTE_DRAFT_STORAGE_KEY,
    JSON.stringify(draft),
  );
}

export function readPendingRouteDraft(): TransferRouteDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = window.sessionStorage.getItem(
    ROUTE_DRAFT_STORAGE_KEY,
  );

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<TransferRouteDraft>;

    if (
      parsed.schema !== "TA14_ROUTE_DRAFT_V1" ||
      typeof parsed.routeId !== "string" ||
      !parsed.metadata ||
      typeof parsed.metadata.name !== "string" ||
      typeof parsed.metadata.domain !== "string" ||
      typeof parsed.metadata.owner !== "string" ||
      !parsed.chain
    ) {
      return null;
    }

    const stageKeys: TransferStageKey[] = [
      "reality",
      "record",
      "continuity",
      "admissibility",
      "binding",
      "commit",
      "execution",
      "outcome",
    ];

    const hasCompleteChain = stageKeys.every(
      (key) => typeof parsed.chain?.[key] === "string",
    );

    if (!hasCompleteChain) {
      return null;
    }

    return parsed as TransferRouteDraft;
  } catch {
    return null;
  }
}

export function clearPendingRouteDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(
    ROUTE_DRAFT_STORAGE_KEY,
  );
}
