import type { CorpusRecord } from './corpus-merged';
import type { CorpusFamilyId } from './corpus-families';
import { getPrimaryFamily, getRelatedFamilies } from './corpus-family-classification';

export type CorpusFamilyStats = {
  familyId: CorpusFamilyId;
  primary: number;
  related: number;
  totalReach: number;
};

export function getCorpusFamilyStats(
  records: CorpusRecord[],
  familyIds: CorpusFamilyId[],
): Record<CorpusFamilyId, CorpusFamilyStats> {
  const initial = Object.fromEntries(
    familyIds.map((familyId) => [
      familyId,
      { familyId, primary: 0, related: 0, totalReach: 0 },
    ]),
  ) as Record<CorpusFamilyId, CorpusFamilyStats>;

  for (const record of records) {
    const primary = getPrimaryFamily(record) as CorpusFamilyId;
    const related = getRelatedFamilies(record) as CorpusFamilyId[];

    if (initial[primary]) {
      initial[primary].primary += 1;
      initial[primary].totalReach += 1;
    }

    for (const familyId of related) {
      if (!initial[familyId]) continue;
      initial[familyId].related += 1;
      initial[familyId].totalReach += 1;
    }
  }

  return initial;
}
