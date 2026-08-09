"use client";

import {
  listTA14SimulationAttempts,
  saveTA14SimulationAttempt,
  type TA14SimulationAttemptInput,
  type TA14SimulationAttemptRecord,
  type TA14SimulationResultState,
} from "@/lib/academy/ta14-24-link-persistence";
import type {
  TA14LinkId,
  TA14RouteDecision,
} from "@/lib/academy/ta14-24-link-canon";

export interface TA14SimulatorAssessment {
  scenarioId: string;
  scenarioVersion?: string;
  selectedFirstBrokenLinkId?: TA14LinkId | null;
  selectedLastAdmissibleLinkId?: TA14LinkId | null;
  selectedDecision?: TA14RouteDecision | null;
  expectedFirstBrokenLinkId?: TA14LinkId | null;
  expectedLastAdmissibleLinkId?: TA14LinkId | null;
  expectedDecision?: TA14RouteDecision | null;
  attemptPayload?: Record<string, unknown>;
}

export interface TA14SimulatorEvaluation {
  score: number;
  resultState: TA14SimulationResultState;
  firstBrokenLinkCorrect: boolean | null;
  lastAdmissibleLinkCorrect: boolean | null;
  decisionCorrect: boolean | null;
}

function compareOptional<T>(
  selected: T | null | undefined,
  expected: T | null | undefined,
): boolean | null {
  if (expected == null) {
    return null;
  }

  return selected === expected;
}

export function evaluateTA14Simulation(
  assessment: TA14SimulatorAssessment,
): TA14SimulatorEvaluation {
  const checks = [
    compareOptional(
      assessment.selectedFirstBrokenLinkId,
      assessment.expectedFirstBrokenLinkId,
    ),
    compareOptional(
      assessment.selectedLastAdmissibleLinkId,
      assessment.expectedLastAdmissibleLinkId,
    ),
    compareOptional(
      assessment.selectedDecision,
      assessment.expectedDecision,
    ),
  ];

  const scoredChecks = checks.filter(
    (value): value is boolean => value !== null,
  );

  const correct = scoredChecks.filter(Boolean).length;

  const score =
    scoredChecks.length === 0
      ? 0
      : Math.round((correct / scoredChecks.length) * 100);

  let resultState: TA14SimulationResultState = "reassess";

  if (scoredChecks.length === 0) {
    resultState = "submitted";
  } else if (score === 100) {
    resultState = "route_preserved";
  }

  return {
    score,
    resultState,
    firstBrokenLinkCorrect: checks[0],
    lastAdmissibleLinkCorrect: checks[1],
    decisionCorrect: checks[2],
  };
}

export async function persistTA14SimulationAssessment(
  assessment: TA14SimulatorAssessment,
): Promise<{
  attempt: TA14SimulationAttemptRecord;
  evaluation: TA14SimulatorEvaluation;
}> {
  const evaluation = evaluateTA14Simulation(assessment);

  const input: TA14SimulationAttemptInput = {
    scenarioId: assessment.scenarioId,
    scenarioVersion: assessment.scenarioVersion ?? "v1",
    selectedFirstBrokenLinkId:
      assessment.selectedFirstBrokenLinkId ?? null,
    selectedLastAdmissibleLinkId:
      assessment.selectedLastAdmissibleLinkId ?? null,
    selectedDecision: assessment.selectedDecision ?? null,
    expectedFirstBrokenLinkId:
      assessment.expectedFirstBrokenLinkId ?? null,
    expectedLastAdmissibleLinkId:
      assessment.expectedLastAdmissibleLinkId ?? null,
    expectedDecision: assessment.expectedDecision ?? null,
    routePreservationScore: evaluation.score,
    resultState: evaluation.resultState,
    attemptPayload: {
      ...(assessment.attemptPayload ?? {}),
      evaluation: {
        firstBrokenLinkCorrect:
          evaluation.firstBrokenLinkCorrect,
        lastAdmissibleLinkCorrect:
          evaluation.lastAdmissibleLinkCorrect,
        decisionCorrect: evaluation.decisionCorrect,
      },
    },
  };

  const attempt = await saveTA14SimulationAttempt(input);

  return {
    attempt,
    evaluation,
  };
}

export async function loadTA14SimulationHistory(
  limit = 25,
): Promise<TA14SimulationAttemptRecord[]> {
  return listTA14SimulationAttempts(limit);
}

export function summarizeTA14SimulationHistory(
  attempts: TA14SimulationAttemptRecord[],
): {
  attempts: number;
  routePreserved: number;
  reassess: number;
  averageScore: number;
  bestScore: number;
} {
  if (attempts.length === 0) {
    return {
      attempts: 0,
      routePreserved: 0,
      reassess: 0,
      averageScore: 0,
      bestScore: 0,
    };
  }

  const total = attempts.reduce(
    (sum, attempt) => sum + attempt.routePreservationScore,
    0,
  );

  return {
    attempts: attempts.length,
    routePreserved: attempts.filter(
      (attempt) => attempt.resultState === "route_preserved",
    ).length,
    reassess: attempts.filter(
      (attempt) => attempt.resultState === "reassess",
    ).length,
    averageScore: Math.round(total / attempts.length),
    bestScore: Math.max(
      ...attempts.map((attempt) => attempt.routePreservationScore),
    ),
  };
}
