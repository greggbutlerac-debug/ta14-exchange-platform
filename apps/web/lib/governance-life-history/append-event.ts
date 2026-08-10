import type { SupabaseClient } from '@supabase/supabase-js';

export type GovernanceLifeHistoryEventType =
  | 'registration'
  | 'version'
  | 'artifact'
  | 'finding'
  | 'gap_opened'
  | 'gap_closed'
  | 'participant_review'
  | 'participant_response'
  | 'evidence_challenge'
  | 'factual_correction'
  | 'technical_comment'
  | 'demonstration'
  | 'examination'
  | 'external_publication';

export type GovernanceLifeHistoryPublicationState =
  | 'draft'
  | 'controlled'
  | 'published'
  | 'withdrawn';

export type AppendGovernanceLifeHistoryEventInput = {
  registryIdentifier: string;
  eventKey: string;
  eventType: GovernanceLifeHistoryEventType;
  eventDate: string;
  title: string;
  summary?: string | null;
  governanceVersion?: string | null;
  artifactIdentifier?: string | null;
  demonstrationIdentifier?: string | null;
  relatedRecordHref?: string | null;
  evidenceState?: string | null;
  publicationState?: GovernanceLifeHistoryPublicationState;
  metadata?: Record<string, unknown>;
};

export async function appendGovernanceLifeHistoryEvent(
  supabase: SupabaseClient,
  input: AppendGovernanceLifeHistoryEventInput,
) {
  const { data, error } = await supabase.rpc(
    'ta14_append_governance_life_history_event',
    {
      p_registry_identifier: input.registryIdentifier,
      p_event_key: input.eventKey,
      p_event_type: input.eventType,
      p_event_date: input.eventDate,
      p_title: input.title,
      p_summary: input.summary ?? null,
      p_governance_version: input.governanceVersion ?? null,
      p_artifact_identifier: input.artifactIdentifier ?? null,
      p_demonstration_identifier: input.demonstrationIdentifier ?? null,
      p_related_record_href: input.relatedRecordHref ?? null,
      p_evidence_state: input.evidenceState ?? null,
      p_publication_state: input.publicationState ?? 'published',
      p_metadata: input.metadata ?? {},
    },
  );

  if (error) {
    throw new Error(`Unable to append governance life-history event: ${error.message}`);
  }

  return data;
}

export function artifactPublicationLifeHistoryEvent(input: {
  registryIdentifier: string;
  artifactIdentifier: string;
  artifactTitle: string;
  architectureVersion: string;
  publishedAt: string;
  publicHref: string;
  evidenceState?: string;
  metadata?: Record<string, unknown>;
}): AppendGovernanceLifeHistoryEventInput {
  return {
    registryIdentifier: input.registryIdentifier,
    eventKey: `artifact:${input.artifactIdentifier}:published`,
    eventType: 'artifact',
    eventDate: input.publishedAt,
    title: input.artifactTitle,
    summary: 'A governed artifact entered the public institutional record beneath this permanent governance identity.',
    governanceVersion: input.architectureVersion,
    artifactIdentifier: input.artifactIdentifier,
    relatedRecordHref: input.publicHref,
    evidenceState: input.evidenceState ?? 'artifact_published',
    publicationState: 'published',
    metadata: {
      source: 'artifact_registry_publication',
      ...input.metadata,
    },
  };
}
