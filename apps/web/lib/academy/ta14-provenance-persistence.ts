import { createClient } from "@/lib/supabase/client";
import {
  normalizeTA14ProvenanceText,
  validateTA14ProvenanceSubmission,
  type TA14ProvenanceSubmissionDraft,
} from "@/lib/academy/ta14-provenance-types";

export interface TA14SavedProvenanceSource {
  id: string;
  sourceType: string;
  title: string;
  sourceIdentifier: string | null;
  sourceUrl: string | null;
}

export interface TA14SavedProvenanceRelationship {
  id: string;
  linkId: string;
  relationType: string;
  relationSummary: string | null;
  isPrimaryProvenance: boolean;
  publicVisibility: boolean;
}

type SourceRow = {
  id: string;
  source_type: string;
  title: string;
  source_identifier: string | null;
  source_url: string | null;
};

type RelationRow = {
  id: string;
  link_id: string;
  relation_type: string;
  relation_summary: string | null;
  is_primary_provenance: boolean;
  public_visibility: boolean;
};

function mapSource(row: SourceRow): TA14SavedProvenanceSource {
  return {
    id: row.id,
    sourceType: row.source_type,
    title: row.title,
    sourceIdentifier: row.source_identifier,
    sourceUrl: row.source_url,
  };
}

function mapRelationship(
  row: RelationRow,
): TA14SavedProvenanceRelationship {
  return {
    id: row.id,
    linkId: row.link_id,
    relationType: row.relation_type,
    relationSummary: row.relation_summary,
    isPrimaryProvenance: row.is_primary_provenance,
    publicVisibility: row.public_visibility,
  };
}

export async function persistTA14ProvenanceSubmission(
  draft: TA14ProvenanceSubmissionDraft,
): Promise<{
  source: TA14SavedProvenanceSource;
  relationships: TA14SavedProvenanceRelationship[];
}> {
  const errors = validateTA14ProvenanceSubmission(draft);

  if (errors.length > 0) {
    throw new Error(errors.join(" "));
  }

  const supabase = createClient();

  const sourcePayload = {
    source_type: draft.source.sourceType,
    title: draft.source.title.trim(),
    source_identifier: normalizeTA14ProvenanceText(
      draft.source.sourceIdentifier,
    ),
    source_url: normalizeTA14ProvenanceText(draft.source.sourceUrl),
    publication_date: normalizeTA14ProvenanceText(
      draft.source.publicationDate,
    ),
    filing_date: normalizeTA14ProvenanceText(draft.source.filingDate),
    priority_date: normalizeTA14ProvenanceText(
      draft.source.priorityDate,
    ),
    jurisdiction: normalizeTA14ProvenanceText(
      draft.source.jurisdiction,
    ),
    status: normalizeTA14ProvenanceText(draft.source.status),
    version_label: normalizeTA14ProvenanceText(
      draft.source.versionLabel,
    ),
    public_summary: normalizeTA14ProvenanceText(
      draft.source.publicSummary,
    ),
    provenance_role: normalizeTA14ProvenanceText(
      draft.source.provenanceRole,
    ),
    metadata: {
      intake: "ta14_provenance_intake",
      submittedAt: new Date().toISOString(),
    },
  };

  let sourceRow: SourceRow;

  if (sourcePayload.source_identifier) {
    const { data, error } = await supabase
      .from("ta14_canonical_sources")
      .upsert(sourcePayload, {
        onConflict: "source_type,source_identifier",
      })
      .select("id,source_type,title,source_identifier,source_url")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    sourceRow = data as SourceRow;
  } else {
    const { data, error } = await supabase
      .from("ta14_canonical_sources")
      .insert(sourcePayload)
      .select("id,source_type,title,source_identifier,source_url")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    sourceRow = data as SourceRow;
  }

  const relationRows: RelationRow[] = [];

  for (const relationship of draft.relationships) {
    const { data, error } = await supabase
      .from("ta14_canonical_link_sources")
      .upsert(
        {
          link_id: relationship.linkId,
          source_id: sourceRow.id,
          relation_type: relationship.relationType,
          relation_summary:
            normalizeTA14ProvenanceText(
              relationship.relationSummary,
            ),
          is_primary_provenance:
            relationship.isPrimaryProvenance,
          public_visibility: relationship.publicVisibility,
        },
        {
          onConflict: "link_id,source_id,relation_type",
        },
      )
      .select(
        "id,link_id,relation_type,relation_summary,is_primary_provenance,public_visibility",
      )
      .single();

    if (error) {
      throw new Error(error.message);
    }

    relationRows.push(data as RelationRow);
  }

  return {
    source: mapSource(sourceRow),
    relationships: relationRows.map(mapRelationship),
  };
}

export async function removeTA14ProvenanceRelationship(
  relationshipId: string,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("ta14_canonical_link_sources")
    .delete()
    .eq("id", relationshipId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function removeTA14ProvenanceSource(
  sourceId: string,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("ta14_canonical_sources")
    .delete()
    .eq("id", sourceId);

  if (error) {
    throw new Error(error.message);
  }
}
