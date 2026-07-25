import {
  foundationalGovernanceRecords,
} from "./records-foundational";
import {
  extendedGovernanceRecords,
} from "./records-batch-2";
import type { GovernanceLibraryRecord } from "./records-foundational";

export const governanceLibraryRecords: GovernanceLibraryRecord[] = [
  ...foundationalGovernanceRecords,
  ...extendedGovernanceRecords,
];

export function getRecordBySlug(slug: string) {
  return governanceLibraryRecords.find((r) => r.slug === slug);
}

export function getRecordsByCategory(category: string) {
  return governanceLibraryRecords.filter((r) =>
    r.categories.includes(category)
  );
}

export function searchGovernanceRecords(query: string) {
  const q = query.trim().toLowerCase();

  if (!q) return governanceLibraryRecords;

  return governanceLibraryRecords.filter((r) => {
    return (
      r.title.toLowerCase().includes(q) ||
      r.shortTitle.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      r.whyItMatters.toLowerCase().includes(q) ||
      r.categories.some((c) => c.toLowerCase().includes(q)) ||
      r.keyTopics.some((k) => k.toLowerCase().includes(q))
    );
  });
}

export function getRelatedRecords(record: GovernanceLibraryRecord) {
  return record.relatedSlugs
    .map((slug) => getRecordBySlug(slug))
    .filter(Boolean) as GovernanceLibraryRecord[];
}
