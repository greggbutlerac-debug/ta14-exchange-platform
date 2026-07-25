export type GovernanceLibraryFilters = {
  query: string;
  category?: string;
  jurisdiction?: string;
  recordType?: string;
};

import {
  governanceLibraryRecords,
} from "./index";

export function filterGovernanceRecords(
  filters: GovernanceLibraryFilters
) {
  const q = filters.query.trim().toLowerCase();

  return governanceLibraryRecords.filter((record) => {
    if (
      filters.category &&
      !record.categories.includes(filters.category)
    ) {
      return false;
    }

    if (
      filters.jurisdiction &&
      record.jurisdiction !== filters.jurisdiction
    ) {
      return false;
    }

    if (
      filters.recordType &&
      record.recordType !== filters.recordType
    ) {
      return false;
    }

    if (!q) return true;

    const haystack = [
      record.title,
      record.shortTitle,
      record.summary,
      record.whyItMatters,
      ...record.categories,
      ...record.keyTopics,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function getAllCategories() {
  return [...new Set(
    governanceLibraryRecords.flatMap(r => r.categories)
  )].sort();
}

export function getAllJurisdictions() {
  return [...new Set(
    governanceLibraryRecords.map(r => r.jurisdiction)
  )].sort();
}

export function getAllRecordTypes() {
  return [...new Set(
    governanceLibraryRecords.map(r => r.recordType)
  )].sort();
}
