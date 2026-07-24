import type {
  EvidenceId,
  EvidenceReference,
  EvidenceStatus,
  EvidenceVisibility,
  GateId,
  ISODateTimeString,
  JsonValue,
} from "./types";

/**
 * TA-14 Runtime Governance Playground
 * Browser-local evidence attachment model
 *
 * An attachment is only a referenced evidence candidate. Creating or
 * attaching one does not establish authenticity, continuity, sufficiency,
 * admissibility, or proof of execution.
 */

export const RUNTIME_EVIDENCE_STORAGE_PREFIX =
  "ta14:runtime-execution:evidence";

export const RUNTIME_EVIDENCE_SCHEMA_VERSION = "1.0.0";

export type EvidenceRelationship =
  | "SUPPORTING"
  | "CONFLICTING"
  | "CONTEXT_ONLY";

export type EvidenceSourceType =
  | "FILE"
  | "URL"
  | "TEXT"
  | "SYSTEM_RECORD"
  | "EXTERNAL_RECORD";

export interface RuntimeEvidenceAttachment {
  schemaVersion: string;
  attachmentId: string;
  evidenceId: EvidenceId;
  laneId: string;
  routeDraftId?: string;
  testSessionId?: string;
  gateId?: GateId;
  relationship: EvidenceRelationship;
  sourceType: EvidenceSourceType;
  title: string;
  description?: string;
  fileName?: string;
  mediaType?: string;
  sourceUrl?: string;
  contentText?: string;
  contentHash?: string;
  status: EvidenceStatus;
  visibility: EvidenceVisibility;
  capturedAt?: ISODateTimeString;
  attachedAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
  metadata: Readonly<Record<string, JsonValue>>;
}

export interface CreateRuntimeEvidenceAttachmentInput {
  laneId: string;
  routeDraftId?: string;
  testSessionId?: string;
  gateId?: GateId;
  relationship: EvidenceRelationship;
  sourceType: EvidenceSourceType;
  title: string;
  description?: string;
  fileName?: string;
  mediaType?: string;
  sourceUrl?: string;
  contentText?: string;
  contentHash?: string;
  status?: EvidenceStatus;
  visibility?: EvidenceVisibility;
  capturedAt?: ISODateTimeString;
  metadata?: Readonly<Record<string, JsonValue>>;
}

export interface RuntimeEvidenceSummary {
  attachmentId: string;
  evidenceId: EvidenceId;
  laneId: string;
  routeDraftId?: string;
  testSessionId?: string;
  gateId?: GateId;
  relationship: EvidenceRelationship;
  sourceType: EvidenceSourceType;
  title: string;
  status: EvidenceStatus;
  visibility: EvidenceVisibility;
  attachedAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function createId(prefix: string): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    "randomUUID" in globalThis.crypto
  ) {
    return `${prefix}-${globalThis.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function storageKey(
  laneId: string,
  attachmentId: string,
): string {
  return `${RUNTIME_EVIDENCE_STORAGE_PREFIX}:${laneId}:${attachmentId}`;
}

function lanePrefix(laneId: string): string {
  return `${RUNTIME_EVIDENCE_STORAGE_PREFIX}:${laneId}:`;
}

function isRuntimeEvidenceAttachment(
  value: unknown,
): value is RuntimeEvidenceAttachment {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate =
    value as Partial<RuntimeEvidenceAttachment>;

  return (
    candidate.schemaVersion ===
      RUNTIME_EVIDENCE_SCHEMA_VERSION &&
    typeof candidate.attachmentId === "string" &&
    typeof candidate.evidenceId === "string" &&
    typeof candidate.laneId === "string" &&
    typeof candidate.relationship === "string" &&
    typeof candidate.sourceType === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.status === "string" &&
    typeof candidate.visibility === "string" &&
    typeof candidate.attachedAt === "string" &&
    typeof candidate.updatedAt === "string" &&
    !!candidate.metadata &&
    typeof candidate.metadata === "object"
  );
}

export function createRuntimeEvidenceAttachment(
  input: CreateRuntimeEvidenceAttachmentInput,
): RuntimeEvidenceAttachment {
  const timestamp = new Date().toISOString();

  return {
    schemaVersion: RUNTIME_EVIDENCE_SCHEMA_VERSION,
    attachmentId: createId("attachment"),
    evidenceId: createId("evidence"),
    laneId: input.laneId,
    routeDraftId: input.routeDraftId,
    testSessionId: input.testSessionId,
    gateId: input.gateId,
    relationship: input.relationship,
    sourceType: input.sourceType,
    title: input.title,
    description: input.description,
    fileName: input.fileName,
    mediaType: input.mediaType,
    sourceUrl: input.sourceUrl,
    contentText: input.contentText,
    contentHash: input.contentHash,
    status: input.status ?? "UPLOADED",
    visibility: input.visibility ?? "OWNER_ONLY",
    capturedAt: input.capturedAt,
    attachedAt: timestamp,
    updatedAt: timestamp,
    metadata: input.metadata ?? {},
  };
}

export function saveRuntimeEvidenceAttachment(
  attachment: RuntimeEvidenceAttachment,
): RuntimeEvidenceAttachment {
  const updatedAttachment: RuntimeEvidenceAttachment = {
    ...attachment,
    schemaVersion: RUNTIME_EVIDENCE_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  };

  if (isBrowser()) {
    window.localStorage.setItem(
      storageKey(
        updatedAttachment.laneId,
        updatedAttachment.attachmentId,
      ),
      JSON.stringify(updatedAttachment),
    );
  }

  return updatedAttachment;
}

export function loadRuntimeEvidenceAttachment(
  laneId: string,
  attachmentId: string,
): RuntimeEvidenceAttachment | undefined {
  if (!isBrowser()) {
    return undefined;
  }

  const raw = window.localStorage.getItem(
    storageKey(laneId, attachmentId),
  );

  if (!raw) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    return isRuntimeEvidenceAttachment(parsed)
      ? parsed
      : undefined;
  } catch {
    return undefined;
  }
}

export function listRuntimeEvidenceAttachments(
  laneId: string,
  filters: {
    routeDraftId?: string;
    testSessionId?: string;
    gateId?: GateId;
    relationship?: EvidenceRelationship;
  } = {},
): RuntimeEvidenceSummary[] {
  if (!isBrowser()) {
    return [];
  }

  const prefix = lanePrefix(laneId);
  const summaries: RuntimeEvidenceSummary[] = [];

  for (
    let index = 0;
    index < window.localStorage.length;
    index += 1
  ) {
    const key = window.localStorage.key(index);

    if (!key || !key.startsWith(prefix)) {
      continue;
    }

    const raw = window.localStorage.getItem(key);

    if (!raw) {
      continue;
    }

    try {
      const parsed: unknown = JSON.parse(raw);

      if (!isRuntimeEvidenceAttachment(parsed)) {
        continue;
      }

      if (
        filters.routeDraftId &&
        parsed.routeDraftId !== filters.routeDraftId
      ) {
        continue;
      }

      if (
        filters.testSessionId &&
        parsed.testSessionId !== filters.testSessionId
      ) {
        continue;
      }

      if (
        filters.gateId &&
        parsed.gateId !== filters.gateId
      ) {
        continue;
      }

      if (
        filters.relationship &&
        parsed.relationship !== filters.relationship
      ) {
        continue;
      }

      summaries.push({
        attachmentId: parsed.attachmentId,
        evidenceId: parsed.evidenceId,
        laneId: parsed.laneId,
        routeDraftId: parsed.routeDraftId,
        testSessionId: parsed.testSessionId,
        gateId: parsed.gateId,
        relationship: parsed.relationship,
        sourceType: parsed.sourceType,
        title: parsed.title,
        status: parsed.status,
        visibility: parsed.visibility,
        attachedAt: parsed.attachedAt,
        updatedAt: parsed.updatedAt,
      });
    } catch {
      continue;
    }
  }

  return summaries.sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt),
  );
}

export function deleteRuntimeEvidenceAttachment(
  laneId: string,
  attachmentId: string,
): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(
    storageKey(laneId, attachmentId),
  );
}

export function clearRuntimeEvidenceAttachments(
  laneId: string,
): number {
  if (!isBrowser()) {
    return 0;
  }

  const prefix = lanePrefix(laneId);
  const keys: string[] = [];

  for (
    let index = 0;
    index < window.localStorage.length;
    index += 1
  ) {
    const key = window.localStorage.key(index);

    if (key?.startsWith(prefix)) {
      keys.push(key);
    }
  }

  for (const key of keys) {
    window.localStorage.removeItem(key);
  }

  return keys.length;
}

export function toEvidenceReference(
  attachment: RuntimeEvidenceAttachment,
): EvidenceReference {
  return {
    evidenceId: attachment.evidenceId,
    routeId:
      attachment.routeDraftId ?? "UNBOUND_RUNTIME_ROUTE",
    title: attachment.title,
    description: attachment.description,
    evidenceType: attachment.sourceType,
    status: attachment.status,
    visibility: attachment.visibility,
    sourceUri: attachment.sourceUrl,
    storagePath: attachment.fileName,
    contentHash: attachment.contentHash,
    mediaType: attachment.mediaType,
    collectedAt: attachment.capturedAt,
    metadata: {
      ...attachment.metadata,
      attachmentId: attachment.attachmentId,
      relationship: attachment.relationship,
      testSessionId: attachment.testSessionId ?? null,
      gateId: attachment.gateId ?? null,
      contentText: attachment.contentText ?? null,
    },
    audit: {
      createdAt: attachment.attachedAt,
      createdBy: "TA14_RUNTIME_PLAYGROUND",
      updatedAt: attachment.updatedAt,
      updatedBy: "TA14_RUNTIME_PLAYGROUND",
    },
  };
}

export function exportRuntimeEvidenceAttachment(
  attachment: RuntimeEvidenceAttachment,
): string {
  return JSON.stringify(attachment, null, 2);
}
