"use client";

import {
  appendTA14RouteEvent,
  saveTA14RouteSession,
  type TA14RouteSessionInput,
  type TA14RouteSessionRecord,
} from "@/lib/academy/ta14-24-link-persistence";

export type TA14RouteSaveState =
  | "idle"
  | "saving"
  | "saved"
  | "error";

export interface TA14RouteStateSnapshot {
  sessionId: string | null;
  subjectName: string;
  declaredScope: string;
  currentLinkId: TA14RouteSessionInput["currentLinkId"];
  lastAdmissibleLinkId:
    | TA14RouteSessionInput["lastAdmissibleLinkId"]
    | null;
  firstBrokenLinkId:
    | TA14RouteSessionInput["firstBrokenLinkId"]
    | null;
  decision: TA14RouteSessionInput["decision"];
  reason: string;
  requiredRecovery: string;
  formingConsequence: string;
}

export interface TA14PersistRouteResult {
  session: TA14RouteSessionRecord;
  eventId: string;
}

function compactSnapshot(
  snapshot: TA14RouteStateSnapshot,
): Record<string, unknown> {
  return {
    subjectName: snapshot.subjectName,
    declaredScope: snapshot.declaredScope,
    currentLinkId: snapshot.currentLinkId,
    lastAdmissibleLinkId: snapshot.lastAdmissibleLinkId ?? null,
    firstBrokenLinkId: snapshot.firstBrokenLinkId ?? null,
    decision: snapshot.decision,
    reason: snapshot.reason,
    requiredRecovery: snapshot.requiredRecovery,
    formingConsequence: snapshot.formingConsequence,
  };
}

export async function persistTA14RouteState(
  current: TA14RouteStateSnapshot,
  previous?: TA14RouteStateSnapshot | null,
): Promise<TA14PersistRouteResult> {
  const input: TA14RouteSessionInput = {
    title: "TA-14 24-Link Route State",
    subjectType: "governed_system",
    subjectName:
      current.subjectName.trim() || "Unnamed governed system",
    declaredScope: current.declaredScope.trim() || null,
    currentLinkId: current.currentLinkId,
    lastAdmissibleLinkId: current.lastAdmissibleLinkId ?? null,
    firstBrokenLinkId: current.firstBrokenLinkId ?? null,
    decision: current.decision,
    reason: current.reason.trim() || null,
    requiredRecovery: current.requiredRecovery.trim() || null,
    formingConsequence: current.formingConsequence.trim() || null,
    status: "active",
    routeContext: {
      academyPath: "/academy/24-link-architecture/route-state",
      architecture: "TA-14 24-Link Admissible Execution Architecture",
    },
  };

  const session = await saveTA14RouteSession(
    input,
    current.sessionId ?? undefined,
  );

  const eventId = await appendTA14RouteEvent({
    sessionId: session.id,
    eventType: current.sessionId
      ? "route_state_updated"
      : "route_state_created",
    eventSummary: current.sessionId
      ? "Route State session updated."
      : "Route State session created.",
    previousState: previous ? compactSnapshot(previous) : {},
    resultingState: compactSnapshot({
      ...current,
      sessionId: session.id,
    }),
    eventPayload: {
      decision: current.decision,
      firstBrokenLinkId: current.firstBrokenLinkId ?? null,
      lastAdmissibleLinkId: current.lastAdmissibleLinkId ?? null,
    },
  });

  return {
    session,
    eventId,
  };
}

export async function completeTA14RouteState(
  current: TA14RouteStateSnapshot,
  previous?: TA14RouteStateSnapshot | null,
): Promise<TA14PersistRouteResult> {
  const completedAt = new Date().toISOString();

  const session = await saveTA14RouteSession(
    {
      title: "TA-14 24-Link Route State",
      subjectType: "governed_system",
      subjectName:
        current.subjectName.trim() || "Unnamed governed system",
      declaredScope: current.declaredScope.trim() || null,
      currentLinkId: current.currentLinkId,
      lastAdmissibleLinkId: current.lastAdmissibleLinkId ?? null,
      firstBrokenLinkId: current.firstBrokenLinkId ?? null,
      decision: current.decision,
      reason: current.reason.trim() || null,
      requiredRecovery: current.requiredRecovery.trim() || null,
      formingConsequence: current.formingConsequence.trim() || null,
      status: "completed",
      completedAt,
      routeContext: {
        academyPath: "/academy/24-link-architecture/route-state",
        architecture: "TA-14 24-Link Admissible Execution Architecture",
      },
    },
    current.sessionId ?? undefined,
  );

  const eventId = await appendTA14RouteEvent({
    sessionId: session.id,
    eventType: "route_state_completed",
    eventSummary: "Route State session completed.",
    previousState: previous ? compactSnapshot(previous) : {},
    resultingState: {
      ...compactSnapshot({
        ...current,
        sessionId: session.id,
      }),
      completedAt,
      status: "completed",
    },
    eventPayload: {
      decision: current.decision,
      firstBrokenLinkId: current.firstBrokenLinkId ?? null,
      lastAdmissibleLinkId: current.lastAdmissibleLinkId ?? null,
    },
  });

  return {
    session,
    eventId,
  };
}

export function routeSnapshotFromRecord(
  record: TA14RouteSessionRecord,
): TA14RouteStateSnapshot {
  return {
    sessionId: record.id,
    subjectName: record.subjectName,
    declaredScope: record.declaredScope ?? "",
    currentLinkId: record.currentLinkId,
    lastAdmissibleLinkId: record.lastAdmissibleLinkId,
    firstBrokenLinkId: record.firstBrokenLinkId,
    decision: record.decision,
    reason: record.reason ?? "",
    requiredRecovery: record.requiredRecovery ?? "",
    formingConsequence: record.formingConsequence ?? "",
  };
}

export function routeSnapshotsEqual(
  left: TA14RouteStateSnapshot,
  right: TA14RouteStateSnapshot,
): boolean {
  return JSON.stringify(compactSnapshot(left)) ===
    JSON.stringify(compactSnapshot(right));
}
