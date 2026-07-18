export const EVALUATION_LANE_STORAGE_KEY =
  "TA14_PENDING_EVALUATION_LANE_V1";

export const EVALUATION_LANE_SCHEMA =
  "TA14_EVALUATION_LANE_SELECTION_V1" as const;

export type EvaluationLaneId =
  | "FREE_SIMULATION"
  | "VERIFIED_TEST";

export type EvaluationLaneSelection = {
  schema: typeof EVALUATION_LANE_SCHEMA;
  laneId: EvaluationLaneId;
  selectedAt: string;
  routeLibraryId?: string;
  routeName?: string;
};

export type EvaluationLaneDefinition = {
  id: EvaluationLaneId;
  name: string;
  priceLabel: string;
  priceCents: number;
  badge: string;
  summary: string;
  producesAuthoritativeRecord: boolean;
  features: readonly string[];
  boundary: string;
};

export const EVALUATION_LANES: readonly EvaluationLaneDefinition[] =
  [
    {
      id: "FREE_SIMULATION",
      name: "Free evaluation",
      priceLabel: "$0",
      priceCents: 0,
      badge: "Unlimited workspace testing",
      summary:
        "Run the route through the TA-14 evaluation logic without purchasing a preserved verification record.",
      producesAuthoritativeRecord: false,
      features: [
        "Deterministic route evaluation",
        "ALLOW / HOLD / DENY / ESCALATE result",
        "Visible requirement failures",
        "Route correction and rerun",
        "No payment required",
      ],
      boundary:
        "This lane is a workspace simulation. It does not create a paid, preserved, independently verifiable execution record.",
    },
    {
      id: "VERIFIED_TEST",
      name: "Verified route test",
      priceLabel: "$9",
      priceCents: 900,
      badge: "Preserved verification lane",
      summary:
        "Submit the completed route for a paid test intended to produce a preserved verification package and public record identifier.",
      producesAuthoritativeRecord: true,
      features: [
        "Everything in the free evaluation lane",
        "Paid test entitlement",
        "Preserved result package",
        "Verification receipt",
        "Public record identifier when issuance succeeds",
      ],
      boundary:
        "Payment alone does not guarantee ALLOW status. The route may still produce HOLD, DENY, or ESCALATE when admissibility requirements are not satisfied.",
    },
  ] as const;

function canUseSessionStorage(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.sessionStorage !== "undefined"
  );
}

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function isEvaluationLaneId(
  value: unknown,
): value is EvaluationLaneId {
  return (
    value === "FREE_SIMULATION" ||
    value === "VERIFIED_TEST"
  );
}

export function getEvaluationLane(
  laneId: EvaluationLaneId,
): EvaluationLaneDefinition {
  const lane = EVALUATION_LANES.find(
    (candidate) => candidate.id === laneId,
  );

  if (!lane) {
    throw new Error(
      `Unknown evaluation lane: ${laneId}`,
    );
  }

  return lane;
}

export function stageEvaluationLane(
  selection: Omit<
    EvaluationLaneSelection,
    "schema" | "selectedAt"
  >,
): EvaluationLaneSelection {
  if (!canUseSessionStorage()) {
    throw new Error(
      "Evaluation lane handoff is unavailable in this environment.",
    );
  }

  const staged: EvaluationLaneSelection = {
    schema: EVALUATION_LANE_SCHEMA,
    laneId: selection.laneId,
    selectedAt: new Date().toISOString(),
    ...(selection.routeLibraryId
      ? {
          routeLibraryId: selection.routeLibraryId,
        }
      : {}),
    ...(selection.routeName
      ? {
          routeName: selection.routeName,
        }
      : {}),
  };

  window.sessionStorage.setItem(
    EVALUATION_LANE_STORAGE_KEY,
    JSON.stringify(staged),
  );

  return staged;
}

export function readEvaluationLane():
  EvaluationLaneSelection | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  const raw = window.sessionStorage.getItem(
    EVALUATION_LANE_STORAGE_KEY,
  );

  if (!raw) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      !isRecord(parsed) ||
      parsed.schema !== EVALUATION_LANE_SCHEMA ||
      !isEvaluationLaneId(parsed.laneId) ||
      typeof parsed.selectedAt !== "string"
    ) {
      return null;
    }

    return {
      schema: EVALUATION_LANE_SCHEMA,
      laneId: parsed.laneId,
      selectedAt: parsed.selectedAt,
      ...(typeof parsed.routeLibraryId === "string"
        ? {
            routeLibraryId: parsed.routeLibraryId,
          }
        : {}),
      ...(typeof parsed.routeName === "string"
        ? {
            routeName: parsed.routeName,
          }
        : {}),
    };
  } catch {
    return null;
  }
}

export function consumeEvaluationLane():
  EvaluationLaneSelection | null {
  const selection = readEvaluationLane();

  if (
    selection &&
    canUseSessionStorage()
  ) {
    window.sessionStorage.removeItem(
      EVALUATION_LANE_STORAGE_KEY,
    );
  }

  return selection;
}

export function clearEvaluationLane(): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(
    EVALUATION_LANE_STORAGE_KEY,
  );
}
