import {
  governanceLibraryCatalog,
  governanceLibraryRecordById,
  governanceLibraryRecordBySlug,
} from "./catalog";
import type {
  GovernanceLibraryFilter,
  GovernanceLibraryRecord,
  GovernanceLibrarySearchResult,
  GovernanceLibraryStats,
} from "./types";

const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s/-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value: string): string[] =>
  normalize(value)
    .split(/[\s/-]+/)
    .filter((token) => token.length > 1);

const includesAll = <T>(source: T[], required?: T[]): boolean =>
  !required?.length || required.every((value) => source.includes(value));

const includesAny = <T>(source: T[], requested?: T[]): boolean =>
  !requested?.length || requested.some((value) => source.includes(value));

const recordMatchesFilters = (
  record: GovernanceLibraryRecord,
  filter: GovernanceLibraryFilter,
): boolean => {
  if (!includesAny(record.categories, filter.categories)) return false;

  if (
    filter.authorityLevels?.length &&
    !filter.authorityLevels.includes(record.authorityLevel)
  ) {
    return false;
  }

  if (filter.statuses?.length && !filter.statuses.includes(record.status)) {
    return false;
  }

  if (!includesAny(record.geographies, filter.geographies)) return false;
  if (!includesAny(record.actorRoles, filter.actorRoles)) return false;
  if (!includesAny(record.lifecycleStages, filter.lifecycleStages)) return false;
  if (!includesAny(record.evidenceTypes, filter.evidenceTypes)) return false;

  if (
    filter.ta14ChainLinks?.length &&
    !filter.ta14ChainLinks.some((chainLink) =>
      record.ta14RouteActions?.some(
        (routeAction) => routeAction.chainLink === chainLink,
      ),
    )
  ) {
    return false;
  }

  if (!includesAll(record.tags, filter.tags)) return false;

  return true;
};

type SearchField =
  | "acronym"
  | "alias"
  | "fullName"
  | "purpose"
  | "description"
  | "authority"
  | "keyword"
  | "tag"
  | "requirement";

type WeightedField = {
  field: SearchField;
  value: string;
  exactWeight: number;
  phraseWeight: number;
  tokenWeight: number;
};

const getWeightedFields = (
  record: GovernanceLibraryRecord,
): WeightedField[] => {
  const fields: WeightedField[] = [
    {
      field: "acronym",
      value: record.acronym,
      exactWeight: 100,
      phraseWeight: 70,
      tokenWeight: 18,
    },
    {
      field: "fullName",
      value: record.fullName,
      exactWeight: 90,
      phraseWeight: 58,
      tokenWeight: 14,
    },
    {
      field: "purpose",
      value: record.plainLanguagePurpose,
      exactWeight: 46,
      phraseWeight: 34,
      tokenWeight: 8,
    },
    {
      field: "description",
      value: record.description,
      exactWeight: 34,
      phraseWeight: 26,
      tokenWeight: 6,
    },
    {
      field: "authority",
      value: record.source.issuingAuthority,
      exactWeight: 44,
      phraseWeight: 30,
      tokenWeight: 8,
    },
  ];

  for (const alias of record.aliases ?? []) {
    fields.push({
      field: "alias",
      value: alias,
      exactWeight: 94,
      phraseWeight: 64,
      tokenWeight: 16,
    });
  }

  for (const keyword of record.keywords) {
    fields.push({
      field: "keyword",
      value: keyword,
      exactWeight: 54,
      phraseWeight: 38,
      tokenWeight: 10,
    });
  }

  for (const tag of record.tags) {
    fields.push({
      field: "tag",
      value: tag,
      exactWeight: 48,
      phraseWeight: 32,
      tokenWeight: 8,
    });
  }

  for (const requirement of record.requirements ?? []) {
    fields.push({
      field: "requirement",
      value: `${requirement.label} ${requirement.summary}`,
      exactWeight: 36,
      phraseWeight: 28,
      tokenWeight: 7,
    });
  }

  return fields;
};

const scoreRecord = (
  record: GovernanceLibraryRecord,
  query: string,
): GovernanceLibrarySearchResult | null => {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return {
      record,
      score: 0,
      matchedFields: [],
    };
  }

  const queryTokens = tokenize(normalizedQuery);
  let score = 0;
  const matchedFields = new Set<SearchField>();

  for (const field of getWeightedFields(record)) {
    const normalizedField = normalize(field.value);

    if (!normalizedField) continue;

    if (normalizedField === normalizedQuery) {
      score += field.exactWeight;
      matchedFields.add(field.field);
      continue;
    }

    if (normalizedField.includes(normalizedQuery)) {
      score += field.phraseWeight;
      matchedFields.add(field.field);
    }

    const fieldTokens = new Set(tokenize(normalizedField));
    const tokenMatches = queryTokens.filter((token) => fieldTokens.has(token));

    if (tokenMatches.length > 0) {
      score += tokenMatches.length * field.tokenWeight;
      matchedFields.add(field.field);
    }

    if (
      queryTokens.length > 1 &&
      tokenMatches.length === queryTokens.length
    ) {
      score += Math.round(field.phraseWeight / 2);
    }
  }

  if (score === 0) return null;

  return {
    record,
    score,
    matchedFields: Array.from(matchedFields),
  };
};

export function searchGovernanceLibrary(
  filter: GovernanceLibraryFilter = {},
): GovernanceLibrarySearchResult[] {
  const query = filter.query?.trim() ?? "";

  return governanceLibraryCatalog
    .filter((record) => recordMatchesFilters(record, filter))
    .map((record) => scoreRecord(record, query))
    .filter(
      (
        result,
      ): result is GovernanceLibrarySearchResult => result !== null,
    )
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;

      return a.record.acronym.localeCompare(b.record.acronym);
    });
}

export function listGovernanceLibraryRecords(
  filter: Omit<GovernanceLibraryFilter, "query"> = {},
): GovernanceLibraryRecord[] {
  return governanceLibraryCatalog
    .filter((record) => recordMatchesFilters(record, filter))
    .sort((a, b) => a.acronym.localeCompare(b.acronym));
}

export function getGovernanceLibraryRecordById(
  id: string,
): GovernanceLibraryRecord | undefined {
  return governanceLibraryRecordById.get(id.trim().toLowerCase());
}

export function getGovernanceLibraryRecordBySlug(
  slug: string,
): GovernanceLibraryRecord | undefined {
  return governanceLibraryRecordBySlug.get(slug.trim().toLowerCase());
}

export function getGovernanceLibrarySuggestions(
  query: string,
  limit = 8,
): GovernanceLibraryRecord[] {
  return searchGovernanceLibrary({ query })
    .slice(0, Math.max(0, limit))
    .map((result) => result.record);
}

export function getGovernanceLibraryStats(): GovernanceLibraryStats {
  const stats: GovernanceLibraryStats = {
    totalRecords: governanceLibraryCatalog.length,
    byCategory: {},
    byAuthorityLevel: {},
    byStatus: {},
  };

  for (const record of governanceLibraryCatalog) {
    for (const category of record.categories) {
      stats.byCategory[category] = (stats.byCategory[category] ?? 0) + 1;
    }

    stats.byAuthorityLevel[record.authorityLevel] =
      (stats.byAuthorityLevel[record.authorityLevel] ?? 0) + 1;

    stats.byStatus[record.status] =
      (stats.byStatus[record.status] ?? 0) + 1;

    if (
      !stats.lastUpdatedAt ||
      record.updatedAt > stats.lastUpdatedAt
    ) {
      stats.lastUpdatedAt = record.updatedAt;
    }
  }

  return stats;
}

export function getRelatedGovernanceRecords(
  recordId: string,
): Array<{
  record: GovernanceLibraryRecord;
  relationship: string;
  explanation: string;
  confidence: string;
}> {
  const sourceRecord = getGovernanceLibraryRecordById(recordId);

  if (!sourceRecord?.crosswalks?.length) return [];

  return sourceRecord.crosswalks
    .map((crosswalk) => {
      const record = getGovernanceLibraryRecordById(
        crosswalk.targetRecordId,
      );

      if (!record) return null;

      return {
        record,
        relationship: crosswalk.relationship,
        explanation: crosswalk.explanation,
        confidence: crosswalk.confidence,
      };
    })
    .filter(
      (
        item,
      ): item is {
        record: GovernanceLibraryRecord;
        relationship: string;
        explanation: string;
        confidence: string;
      } => item !== null,
    );
}
