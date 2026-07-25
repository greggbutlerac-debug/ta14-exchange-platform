import { governanceLibraryRecords } from "./index";

export type GovernanceLibraryStatistics = {
  totalRecords: number;
  totalCategories: number;
  totalJurisdictions: number;
  totalRecordTypes: number;
};

export function getGovernanceLibraryStatistics(): GovernanceLibraryStatistics {
  const categories = new Set<string>();
  const jurisdictions = new Set<string>();
  const recordTypes = new Set<string>();

  for (const record of governanceLibraryRecords) {
    record.categories.forEach((category: string) => categories.add(category));
    jurisdictions.add(record.jurisdiction);
    recordTypes.add(record.recordType);
  }

  return {
    totalRecords: governanceLibraryRecords.length,
    totalCategories: categories.size,
    totalJurisdictions: jurisdictions.size,
    totalRecordTypes: recordTypes.size,
  };
}

export function getCategoryCounts() {
  const counts = new Map<string, number>();

  for (const record of governanceLibraryRecords) {
    for (const category of record.categories) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      count,
    }));
}

export function getJurisdictionCounts() {
  const counts = new Map<string, number>();

  for (const record of governanceLibraryRecords) {
    counts.set(
      record.jurisdiction,
      (counts.get(record.jurisdiction) ?? 0) + 1
    );
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([jurisdiction, count]) => ({
      jurisdiction,
      count,
    }));
}
