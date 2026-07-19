import { createClient } from "./supabase/client";

export const ROUTE_ARTIFACT_TYPES = [
  "EVIDENCE",
  "AUTHORITY",
  "COMMIT",
  "EXECUTION",
  "OUTCOME",
  "ATTACHMENT",
  "WITNESS",
  "SIGNATURE",
  "RECEIPT",
  "VIDEO",
  "SENSOR",
  "AI_OUTPUT",
  "HUMAN_APPROVAL",
] as const;

export type RouteArtifactType =
  (typeof ROUTE_ARTIFACT_TYPES)[number];

export const CANONICAL_ROUTE_STAGES = [
  "REALITY",
  "RECORD",
  "CONTINUITY",
  "ADMISSIBILITY",
  "BINDING",
  "COMMIT",
  "EXECUTION",
  "OUTCOME",
] as const;

export type CanonicalRouteStage =
  (typeof CANONICAL_ROUTE_STAGES)[number];

export type RouteArtifactJson = Record<string, unknown>;

export type RouteArtifact = {
  id: string;
  routeRecordId: string;
  userId: string;
  routeId: string;
  artifactType: RouteArtifactType;
  canonicalStage: CanonicalRouteStage;
  requirementKey: string | null;
  title: string;
  description: string | null;
  artifactJson: RouteArtifactJson;
  sha256: string | null;
  originalFilename: string | null;
  storagePath: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateRouteArtifactInput = {
  routeRecordId: string;
  routeId: string;
  artifactType: RouteArtifactType;
  canonicalStage: CanonicalRouteStage;
  requirementKey?: string | null;
  title: string;
  description?: string | null;
  artifactJson?: RouteArtifactJson;
  sha256?: string | null;
  originalFilename?: string | null;
  storagePath?: string | null;
  mimeType?: string | null;
  sizeBytes?: number | null;
};

export type UpdateRouteArtifactInput = Partial<
  Pick<
    CreateRouteArtifactInput,
    | "artifactType"
    | "canonicalStage"
    | "requirementKey"
    | "title"
    | "description"
    | "artifactJson"
    | "sha256"
    | "originalFilename"
    | "storagePath"
    | "mimeType"
    | "sizeBytes"
  >
>;

export type RouteArtifactFilters = {
  artifactType?: RouteArtifactType;
  canonicalStage?: CanonicalRouteStage;
  requirementKey?: string;
};

type ExchangeRouteArtifactRow = {
  id: string;
  route_record_id: string;
  user_id: string;
  route_id: string;
  artifact_type: RouteArtifactType;
  canonical_stage: CanonicalRouteStage;
  requirement_key: string | null;
  title: string;
  description: string | null;
  artifact_json: RouteArtifactJson;
  sha256: string | null;
  original_filename: string | null;
  storage_path: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  created_at: string;
  updated_at: string;
};

type ExchangeRouteOwnershipRow = {
  id: string;
  user_id: string;
  route_id: string;
};

const ARTIFACT_SELECT =
  "id,route_record_id,user_id,route_id,artifact_type,canonical_stage,requirement_key,title,description,artifact_json,sha256,original_filename,storage_path,mime_type,size_bytes,created_at,updated_at" as const;

function mapRowToRouteArtifact(
  row: ExchangeRouteArtifactRow,
): RouteArtifact {
  return {
    id: row.id,
    routeRecordId: row.route_record_id,
    userId: row.user_id,
    routeId: row.route_id,
    artifactType: row.artifact_type,
    canonicalStage: row.canonical_stage,
    requirementKey: row.requirement_key,
    title: row.title,
    description: row.description,
    artifactJson: row.artifact_json ?? {},
    sha256: row.sha256,
    originalFilename: row.original_filename,
    storagePath: row.storage_path,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getAuthenticatedUserId(): Promise<string> {
  const supabase = createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error(
      "You must be signed in to manage route artifacts.",
    );
  }

  return user.id;
}

function normalizeOptionalText(
  value: string | null | undefined,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizeRequiredText(
  value: string,
  fieldName: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalized;
}

function normalizeSha256(
  value: string | null | undefined,
): string | null {
  const normalized = normalizeOptionalText(value);

  if (!normalized) {
    return null;
  }

  const lowercase = normalized.toLowerCase();

  if (!/^[a-f0-9]{64}$/.test(lowercase)) {
    throw new Error(
      "SHA-256 must contain exactly 64 hexadecimal characters.",
    );
  }

  return lowercase;
}

function validateArtifactType(
  value: RouteArtifactType,
): RouteArtifactType {
  if (
    !ROUTE_ARTIFACT_TYPES.includes(
      value as RouteArtifactType,
    )
  ) {
    throw new Error(`Unsupported artifact type: ${value}`);
  }

  return value;
}

function validateCanonicalStage(
  value: CanonicalRouteStage,
): CanonicalRouteStage {
  if (
    !CANONICAL_ROUTE_STAGES.includes(
      value as CanonicalRouteStage,
    )
  ) {
    throw new Error(`Unsupported canonical stage: ${value}`);
  }

  return value;
}

function validateSizeBytes(
  value: number | null | undefined,
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(
      "Artifact size must be a non-negative whole number.",
    );
  }

  return value;
}

async function verifyOwnedRoute(
  routeRecordId: string,
  routeId: string,
  userId: string,
): Promise<ExchangeRouteOwnershipRow> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("exchange_routes")
    .select("id,user_id,route_id")
    .eq("id", routeRecordId)
    .eq("user_id", userId)
    .eq("route_id", routeId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(
      "The authenticated route could not be found or does not belong to this account.",
    );
  }

  return data as ExchangeRouteOwnershipRow;
}

export async function listSupabaseRouteArtifacts(
  routeRecordId: string,
  filters: RouteArtifactFilters = {},
): Promise<RouteArtifact[]> {
  const supabase = createClient();
  await getAuthenticatedUserId();

  let query = supabase
    .from("exchange_route_artifacts")
    .select(ARTIFACT_SELECT)
    .eq("route_record_id", routeRecordId)
    .order("created_at", { ascending: false });

  if (filters.artifactType) {
    query = query.eq(
      "artifact_type",
      validateArtifactType(filters.artifactType),
    );
  }

  if (filters.canonicalStage) {
    query = query.eq(
      "canonical_stage",
      validateCanonicalStage(filters.canonicalStage),
    );
  }

  if (filters.requirementKey) {
    query = query.eq(
      "requirement_key",
      normalizeRequiredText(
        filters.requirementKey,
        "Requirement key",
      ),
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (
    (data ?? []) as ExchangeRouteArtifactRow[]
  ).map(mapRowToRouteArtifact);
}

export async function getSupabaseRouteArtifact(
  id: string,
): Promise<RouteArtifact | null> {
  const supabase = createClient();
  await getAuthenticatedUserId();

  const { data, error } = await supabase
    .from("exchange_route_artifacts")
    .select(ARTIFACT_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data
    ? mapRowToRouteArtifact(
        data as ExchangeRouteArtifactRow,
      )
    : null;
}

export async function createSupabaseRouteArtifact(
  input: CreateRouteArtifactInput,
): Promise<RouteArtifact> {
  const supabase = createClient();
  const userId = await getAuthenticatedUserId();

  const routeRecordId = normalizeRequiredText(
    input.routeRecordId,
    "Route record ID",
  );

  const routeId = normalizeRequiredText(
    input.routeId,
    "Route ID",
  );

  await verifyOwnedRoute(
    routeRecordId,
    routeId,
    userId,
  );

  const payload = {
    route_record_id: routeRecordId,
    user_id: userId,
    route_id: routeId,
    artifact_type: validateArtifactType(
      input.artifactType,
    ),
    canonical_stage: validateCanonicalStage(
      input.canonicalStage,
    ),
    requirement_key: normalizeOptionalText(
      input.requirementKey,
    ),
    title: normalizeRequiredText(
      input.title,
      "Artifact title",
    ),
    description: normalizeOptionalText(
      input.description,
    ),
    artifact_json: input.artifactJson ?? {},
    sha256: normalizeSha256(input.sha256),
    original_filename: normalizeOptionalText(
      input.originalFilename,
    ),
    storage_path: normalizeOptionalText(
      input.storagePath,
    ),
    mime_type: normalizeOptionalText(
      input.mimeType,
    ),
    size_bytes: validateSizeBytes(input.sizeBytes),
  };

  const { data, error } = await supabase
    .from("exchange_route_artifacts")
    .insert(payload)
    .select(ARTIFACT_SELECT)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapRowToRouteArtifact(
    data as ExchangeRouteArtifactRow,
  );
}

export async function updateSupabaseRouteArtifact(
  id: string,
  input: UpdateRouteArtifactInput,
): Promise<RouteArtifact> {
  const supabase = createClient();
  await getAuthenticatedUserId();

  const payload: Record<string, unknown> = {};

  if (input.artifactType !== undefined) {
    payload.artifact_type = validateArtifactType(
      input.artifactType,
    );
  }

  if (input.canonicalStage !== undefined) {
    payload.canonical_stage =
      validateCanonicalStage(input.canonicalStage);
  }

  if (input.requirementKey !== undefined) {
    payload.requirement_key = normalizeOptionalText(
      input.requirementKey,
    );
  }

  if (input.title !== undefined) {
    payload.title = normalizeRequiredText(
      input.title,
      "Artifact title",
    );
  }

  if (input.description !== undefined) {
    payload.description = normalizeOptionalText(
      input.description,
    );
  }

  if (input.artifactJson !== undefined) {
    payload.artifact_json = input.artifactJson;
  }

  if (input.sha256 !== undefined) {
    payload.sha256 = normalizeSha256(input.sha256);
  }

  if (input.originalFilename !== undefined) {
    payload.original_filename = normalizeOptionalText(
      input.originalFilename,
    );
  }

  if (input.storagePath !== undefined) {
    payload.storage_path = normalizeOptionalText(
      input.storagePath,
    );
  }

  if (input.mimeType !== undefined) {
    payload.mime_type = normalizeOptionalText(
      input.mimeType,
    );
  }

  if (input.sizeBytes !== undefined) {
    payload.size_bytes = validateSizeBytes(
      input.sizeBytes,
    );
  }

  if (Object.keys(payload).length === 0) {
    const existing =
      await getSupabaseRouteArtifact(id);

    if (!existing) {
      throw new Error("Route artifact not found.");
    }

    return existing;
  }

  const { data, error } = await supabase
    .from("exchange_route_artifacts")
    .update(payload)
    .eq("id", id)
    .select(ARTIFACT_SELECT)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error(
      "Route artifact not found or access was denied.",
    );
  }

  return mapRowToRouteArtifact(
    data as ExchangeRouteArtifactRow,
  );
}

export async function deleteSupabaseRouteArtifact(
  id: string,
): Promise<boolean> {
  const supabase = createClient();
  await getAuthenticatedUserId();

  const { error, count } = await supabase
    .from("exchange_route_artifacts")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  return (count ?? 0) > 0;
}

export async function deleteAllSupabaseRouteArtifacts(
  routeRecordId: string,
): Promise<number> {
  const supabase = createClient();
  await getAuthenticatedUserId();

  const { error, count } = await supabase
    .from("exchange_route_artifacts")
    .delete({ count: "exact" })
    .eq("route_record_id", routeRecordId);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function countSupabaseRouteArtifacts(
  routeRecordId: string,
): Promise<number> {
  const supabase = createClient();
  await getAuthenticatedUserId();

  const { count, error } = await supabase
    .from("exchange_route_artifacts")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("route_record_id", routeRecordId);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function listArtifactsByCanonicalStage(
  routeRecordId: string,
  canonicalStage: CanonicalRouteStage,
): Promise<RouteArtifact[]> {
  return listSupabaseRouteArtifacts(
    routeRecordId,
    {
      canonicalStage,
    },
  );
}

export async function listArtifactsByRequirement(
  routeRecordId: string,
  requirementKey: string,
): Promise<RouteArtifact[]> {
  return listSupabaseRouteArtifacts(
    routeRecordId,
    {
      requirementKey,
    },
  );
}
