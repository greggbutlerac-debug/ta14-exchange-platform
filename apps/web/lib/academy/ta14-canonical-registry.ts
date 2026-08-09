import {
  TA14_24_LINKS,
  type TA14LinkId,
} from "@/lib/academy/ta14-24-link-canon";
import { createClient } from "@/lib/supabase/client";

export type TA14CanonicalSourceType =
  | "patent_application"
  | "patent"
  | "book"
  | "article"
  | "publication"
  | "website"
  | "doi"
  | "public_record"
  | "artifact"
  | "review"
  | "other";

export type TA14CanonicalRelationType =
  | "origin"
  | "provenance"
  | "expansion"
  | "definition"
  | "implementation"
  | "evidence"
  | "example"
  | "review"
  | "patent_position"
  | "publication_record"
  | "related";

export interface TA14CanonicalSourceRecord {
  id: string;
  sourceType: TA14CanonicalSourceType;
  title: string;
  sourceIdentifier: string | null;
  sourceUrl: string | null;
  publicationDate: string | null;
  filingDate: string | null;
  priorityDate: string | null;
  jurisdiction: string | null;
  status: string | null;
  versionLabel: string | null;
  publicSummary: string | null;
  provenanceRole: string | null;
  metadata: Record<string, unknown>;
}

export interface TA14CanonicalLinkSourceRecord {
  id: string;
  linkId: TA14LinkId;
  sourceId: string;
  relationType: TA14CanonicalRelationType;
  relationSummary: string | null;
  isPrimaryProvenance: boolean;
  publicVisibility: boolean;
}

export interface TA14LinkProvenanceBundle {
  linkId: TA14LinkId;
  order: number;
  canonicalName: string;
  sources: Array<{
    relation: TA14CanonicalLinkSourceRecord;
    source: TA14CanonicalSourceRecord;
  }>;
}

type SourceRow = {
  id: string;
  source_type: TA14CanonicalSourceType;
  title: string;
  source_identifier: string | null;
  source_url: string | null;
  publication_date: string | null;
  filing_date: string | null;
  priority_date: string | null;
  jurisdiction: string | null;
  status: string | null;
  version_label: string | null;
  public_summary: string | null;
  provenance_role: string | null;
  metadata: Record<string, unknown> | null;
};

type RelationRow = {
  id: string;
  link_id: TA14LinkId;
  source_id: string;
  relation_type: TA14CanonicalRelationType;
  relation_summary: string | null;
  is_primary_provenance: boolean;
  public_visibility: boolean;
};

function mapSource(row: SourceRow): TA14CanonicalSourceRecord {
  return {
    id: row.id,
    sourceType: row.source_type,
    title: row.title,
    sourceIdentifier: row.source_identifier,
    sourceUrl: row.source_url,
    publicationDate: row.publication_date,
    filingDate: row.filing_date,
    priorityDate: row.priority_date,
    jurisdiction: row.jurisdiction,
    status: row.status,
    versionLabel: row.version_label,
    publicSummary: row.public_summary,
    provenanceRole: row.provenance_role,
    metadata: row.metadata ?? {},
  };
}

function mapRelation(
  row: RelationRow,
): TA14CanonicalLinkSourceRecord {
  return {
    id: row.id,
    linkId: row.link_id,
    sourceId: row.source_id,
    relationType: row.relation_type,
    relationSummary: row.relation_summary,
    isPrimaryProvenance: row.is_primary_provenance,
    publicVisibility: row.public_visibility,
  };
}

export async function listTA14CanonicalSources(): Promise<
  TA14CanonicalSourceRecord[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ta14_canonical_sources")
    .select("*")
    .order("publication_date", {
      ascending: true,
      nullsFirst: false,
    })
    .order("filing_date", {
      ascending: true,
      nullsFirst: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as SourceRow[]).map(mapSource);
}

export async function listTA14CanonicalLinkSources(): Promise<
  TA14CanonicalLinkSourceRecord[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("ta14_canonical_link_sources")
    .select("*")
    .eq("public_visibility", true);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as RelationRow[]).map(mapRelation);
}

export async function loadTA14LinkProvenance(
  linkId: TA14LinkId,
): Promise<TA14LinkProvenanceBundle> {
  const canonical = TA14_24_LINKS.find(
    (candidate) => candidate.linkId === linkId,
  );

  if (!canonical) {
    throw new Error(`Unknown TA-14 canonical link: ${linkId}`);
  }

  const supabase = createClient();

  const { data: relationData, error: relationError } = await supabase
    .from("ta14_canonical_link_sources")
    .select("*")
    .eq("link_id", linkId)
    .eq("public_visibility", true);

  if (relationError) {
    throw new Error(relationError.message);
  }

  const relations = ((relationData ?? []) as RelationRow[]).map(
    mapRelation,
  );

  if (relations.length === 0) {
    return {
      linkId,
      order: canonical.order,
      canonicalName: canonical.canonicalName,
      sources: [],
    };
  }

  const sourceIds = relations.map((relation) => relation.sourceId);

  const { data: sourceData, error: sourceError } = await supabase
    .from("ta14_canonical_sources")
    .select("*")
    .in("id", sourceIds);

  if (sourceError) {
    throw new Error(sourceError.message);
  }

  const sources = new Map(
    ((sourceData ?? []) as SourceRow[]).map((row) => {
      const source = mapSource(row);
      return [source.id, source] as const;
    }),
  );

  return {
    linkId,
    order: canonical.order,
    canonicalName: canonical.canonicalName,
    sources: relations.flatMap((relation) => {
      const source = sources.get(relation.sourceId);

      return source
        ? [
            {
              relation,
              source,
            },
          ]
        : [];
    }),
  };
}

export async function loadTA14FullProvenanceMap(): Promise<
  TA14LinkProvenanceBundle[]
> {
  const [sources, relations] = await Promise.all([
    listTA14CanonicalSources(),
    listTA14CanonicalLinkSources(),
  ]);

  const sourceById = new Map(
    sources.map((source) => [source.id, source] as const),
  );

  return TA14_24_LINKS.map((canonical) => ({
    linkId: canonical.linkId,
    order: canonical.order,
    canonicalName: canonical.canonicalName,
    sources: relations
      .filter((relation) => relation.linkId === canonical.linkId)
      .flatMap((relation) => {
        const source = sourceById.get(relation.sourceId);

        return source
          ? [
              {
                relation,
                source,
              },
            ]
          : [];
      }),
  }));
}

export function summarizeTA14Provenance(
  bundles: TA14LinkProvenanceBundle[],
): {
  linksWithSources: number;
  totalRelationships: number;
  primaryProvenanceRelationships: number;
  patentRelationships: number;
  publicationRelationships: number;
} {
  const relationships = bundles.flatMap((bundle) => bundle.sources);

  return {
    linksWithSources: bundles.filter(
      (bundle) => bundle.sources.length > 0,
    ).length,
    totalRelationships: relationships.length,
    primaryProvenanceRelationships: relationships.filter(
      ({ relation }) => relation.isPrimaryProvenance,
    ).length,
    patentRelationships: relationships.filter(
      ({ source }) =>
        source.sourceType === "patent" ||
        source.sourceType === "patent_application",
    ).length,
    publicationRelationships: relationships.filter(
      ({ source }) =>
        source.sourceType === "book" ||
        source.sourceType === "article" ||
        source.sourceType === "publication" ||
        source.sourceType === "doi" ||
        source.sourceType === "website",
    ).length,
  };
}
