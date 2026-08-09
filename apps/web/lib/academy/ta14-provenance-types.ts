import type { TA14LinkId } from "@/lib/academy/ta14-24-link-canon";

export const TA14_PROVENANCE_SOURCE_TYPES = [
  "patent_application",
  "patent",
  "book",
  "article",
  "publication",
  "website",
  "doi",
  "public_record",
  "artifact",
  "review",
  "other",
] as const;

export type TA14ProvenanceSourceType =
  (typeof TA14_PROVENANCE_SOURCE_TYPES)[number];

export const TA14_PROVENANCE_RELATION_TYPES = [
  "origin",
  "provenance",
  "expansion",
  "definition",
  "implementation",
  "evidence",
  "example",
  "review",
  "patent_position",
  "publication_record",
  "related",
] as const;

export type TA14ProvenanceRelationType =
  (typeof TA14_PROVENANCE_RELATION_TYPES)[number];

export interface TA14ProvenanceSourceDraft {
  sourceType: TA14ProvenanceSourceType;
  title: string;
  sourceIdentifier: string;
  sourceUrl: string;
  publicationDate: string;
  filingDate: string;
  priorityDate: string;
  jurisdiction: string;
  status: string;
  versionLabel: string;
  publicSummary: string;
  provenanceRole: string;
}

export interface TA14ProvenanceLinkDraft {
  linkId: TA14LinkId;
  relationType: TA14ProvenanceRelationType;
  relationSummary: string;
  isPrimaryProvenance: boolean;
  publicVisibility: boolean;
}

export interface TA14ProvenanceSubmissionDraft {
  source: TA14ProvenanceSourceDraft;
  relationships: TA14ProvenanceLinkDraft[];
}

export function createEmptyTA14ProvenanceSourceDraft(): TA14ProvenanceSourceDraft {
  return {
    sourceType: "publication",
    title: "",
    sourceIdentifier: "",
    sourceUrl: "",
    publicationDate: "",
    filingDate: "",
    priorityDate: "",
    jurisdiction: "",
    status: "",
    versionLabel: "",
    publicSummary: "",
    provenanceRole: "",
  };
}

export function createTA14ProvenanceRelationship(
  linkId: TA14LinkId,
): TA14ProvenanceLinkDraft {
  return {
    linkId,
    relationType: "related",
    relationSummary: "",
    isPrimaryProvenance: false,
    publicVisibility: true,
  };
}

export function normalizeTA14ProvenanceText(
  value: string,
): string | null {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

export function validateTA14ProvenanceSubmission(
  draft: TA14ProvenanceSubmissionDraft,
): string[] {
  const errors: string[] = [];

  if (!draft.source.title.trim()) {
    errors.push("Source title is required.");
  }

  if (draft.relationships.length === 0) {
    errors.push("At least one TA-14 link relationship is required.");
  }

  const uniqueLinks = new Set<TA14LinkId>();

  for (const relationship of draft.relationships) {
    if (uniqueLinks.has(relationship.linkId)) {
      errors.push(
        `Link ${relationship.linkId} appears more than once in this source mapping.`,
      );
    }

    uniqueLinks.add(relationship.linkId);

    if (!relationship.relationSummary.trim()) {
      errors.push(
        `A bounded relationship summary is required for ${relationship.linkId}.`,
      );
    }
  }

  if (
    draft.source.sourceType === "patent" ||
    draft.source.sourceType === "patent_application"
  ) {
    if (!draft.source.sourceIdentifier.trim()) {
      errors.push(
        "Patent and patent-application records require an application, publication, or patent identifier.",
      );
    }

    if (!draft.source.jurisdiction.trim()) {
      errors.push(
        "Patent and patent-application records require a jurisdiction.",
      );
    }
  }

  return errors;
}

export function provenanceSourceTypeLabel(
  type: TA14ProvenanceSourceType,
): string {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function provenanceRelationTypeLabel(
  type: TA14ProvenanceRelationType,
): string {
  return type
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
