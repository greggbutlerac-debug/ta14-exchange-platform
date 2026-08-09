"use client";

import {
  getOrCreateTA14Passport,
  listTA14PassportLinks,
  saveTA14PassportLink,
  type TA14MasteryStage,
  type TA14PassportLinkRecord,
  type TA14PassportRecord,
} from "@/lib/academy/ta14-24-link-persistence";
import {
  TA14_24_LINKS,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";

export interface TA14PassportState {
  passport: TA14PassportRecord;
  stages: Record<TA14LinkId, TA14MasteryStage>;
  records: Partial<Record<TA14LinkId, TA14PassportLinkRecord>>;
}

export interface TA14PassportProgress {
  progressed: number;
  mastered: number;
  total: number;
  completionPercent: number;
}

function emptyStages(): Record<TA14LinkId, TA14MasteryStage> {
  return Object.fromEntries(
    TA14_24_LINKS.map((link) => [
      link.linkId,
      "NOT STARTED" as TA14MasteryStage,
    ]),
  ) as Record<TA14LinkId, TA14MasteryStage>;
}

export async function loadTA14Passport(
  passportKey = "primary",
): Promise<TA14PassportState> {
  const passport = await getOrCreateTA14Passport(passportKey);
  const links = await listTA14PassportLinks(passport.id);

  const stages = emptyStages();
  const records: Partial<
    Record<TA14LinkId, TA14PassportLinkRecord>
  > = {};

  for (const record of links) {
    stages[record.linkId] = record.masteryStage;
    records[record.linkId] = record;
  }

  return {
    passport,
    stages,
    records,
  };
}

export async function persistTA14PassportStage({
  passportId,
  linkId,
  masteryStage,
  evidenceSummary,
  evidenceReferences,
  assessmentNotes,
}: {
  passportId: string;
  linkId: TA14LinkId;
  masteryStage: TA14MasteryStage;
  evidenceSummary?: string | null;
  evidenceReferences?: string[];
  assessmentNotes?: string | null;
}): Promise<TA14PassportLinkRecord> {
  return saveTA14PassportLink({
    passportId,
    linkId,
    masteryStage,
    evidenceSummary: evidenceSummary ?? null,
    evidenceReferences: evidenceReferences ?? [],
    assessmentNotes: assessmentNotes ?? null,
    demonstratedAt:
      masteryStage === "NOT STARTED"
        ? null
        : new Date().toISOString(),
  });
}

export function calculateTA14PassportProgress(
  stages: Record<TA14LinkId, TA14MasteryStage>,
): TA14PassportProgress {
  const total = TA14_24_LINKS.length;

  const progressed = TA14_24_LINKS.filter(
    (link) => stages[link.linkId] !== "NOT STARTED",
  ).length;

  const mastered = TA14_24_LINKS.filter(
    (link) => stages[link.linkId] === "MASTERED",
  ).length;

  return {
    progressed,
    mastered,
    total,
    completionPercent:
      total === 0 ? 0 : Math.round((mastered / total) * 100),
  };
}

export function mergeTA14PassportRecord(
  state: TA14PassportState,
  record: TA14PassportLinkRecord,
): TA14PassportState {
  return {
    ...state,
    stages: {
      ...state.stages,
      [record.linkId]: record.masteryStage,
    },
    records: {
      ...state.records,
      [record.linkId]: record,
    },
  };
}

export function hasTA14PassportMastery(
  stages: Record<TA14LinkId, TA14MasteryStage>,
): boolean {
  return TA14_24_LINKS.every(
    (link) => stages[link.linkId] === "MASTERED",
  );
}
