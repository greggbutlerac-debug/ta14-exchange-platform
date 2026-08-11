import { createClient } from "../supabase/server";

export type GovernedArtifactPublicRecord = {
  artifact_identifier: string;
  artifact_series_identifier: string;
  case_identifier: string | null;
  governance_registry_identifier: string;
  governance_name: string;
  governance_version: string | null;
  governance_version_verification_status: string;
  artifact_type: string;
  title: string;
  current_record_version: string;
  finding_class: string | null;
  technical_review_status: string | null;
  correction_status: string | null;
  administrative_verification_status: string | null;
  disclosure_state: string;
  public_summary: string;
  claims_boundary: string;
  public_finding_language: string | null;
  limitations: string[];
  evidence_object_identifiers: string[];
  source_filename: string | null;
  source_media_type: string | null;
  source_size_bytes: number | null;
  source_sha256: string | null;
  file_publication_authorized: boolean;
  public_file_url: string | null;
  public_record_href: string | null;
  registered_at: string;
  closed_at: string | null;
  metadata: Record<string, unknown>;
};

export async function listPublishedGovernedArtifacts(): Promise<GovernedArtifactPublicRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ta14_governed_artifacts_public_v1")
    .select("*")
    .order("registered_at", { ascending: false });

  if (error) {
    console.error("Unable to load governed artifact registry", error);
    return [];
  }

  return (data ?? []) as GovernedArtifactPublicRecord[];
}

export async function getPublishedGovernedArtifact(
  artifactIdentifier: string,
): Promise<GovernedArtifactPublicRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ta14_governed_artifacts_public_v1")
    .select("*")
    .eq("artifact_identifier", artifactIdentifier)
    .maybeSingle();

  if (error) {
    console.error(`Unable to load governed artifact ${artifactIdentifier}`, error);
    return null;
  }

  return (data as GovernedArtifactPublicRecord | null) ?? null;
}
