import type {
  ActorReference,
  ISODateTimeString,
  JsonValue,
  RecordId,
  RecordVisibility,
} from "./types";
import type {
  GovernedRecordCandidate,
  RuntimeGovernedRecordPayload,
} from "./runtime-governed-record-candidate";

/**
 * TA-14 Runtime Governance Playground
 * Preserved governed-record contract
 *
 * This module converts an approved governed-record candidate into a distinct,
 * immutable preservation object. Preservation does not prove real-world
 * execution, regulatory compliance, certification, or the truth of every
 * attached evidence item. It preserves exactly what was reviewed, approved,
 * bounded, and recorded at the time of preservation.
 */

export const PRESERVED_RUNTIME_RECORD_SCHEMA_VERSION = "1.0.0";

export type PreservedRuntimeRecordStatus =
  | "PRESERVED"
  | "SUPERSEDED"
  | "REVOKED";

export interface PreservedRuntimeRecordLineage {
  sourceCandidateId: string;
  sourceCandidateSchemaVersion: string;
  sourceCandidateCreatedAt: ISODateTimeString;
  sourceCandidateApprovedAt: ISODateTimeString;
  routeDraftId: string;
  testSessionId: string;
  storedRunId: string;
}

export interface PreservedRuntimeRecordAuthority {
  preservedBy: ActorReference;
  authorityBasis: string;
  authorityEvidenceIds: readonly string[];
  declaration: string;
}

export interface PreservedRuntimeRecordBoundary {
  statement: string;
  category:
    | "TEST_ONLY"
    | "EVIDENCE_LIMITATION"
    | "EXECUTION_LIMITATION"
    | "COMPLIANCE_LIMITATION"
    | "PRESERVATION_LIMITATION"
    | "OTHER";
}

export interface PreservedRuntimeGovernedRecord {
  readonly schemaVersion: string;
  readonly recordId: RecordId;
  readonly recordClass: GovernedRecordCandidate["recordClass"];
  readonly title: string;
  readonly status: PreservedRuntimeRecordStatus;
  readonly visibility: RecordVisibility;
  readonly preservedAt: ISODateTimeString;
  readonly preservedBy: ActorReference;
  readonly authority: PreservedRuntimeRecordAuthority;
  readonly lineage: PreservedRuntimeRecordLineage;
  readonly determination:
    RuntimeGovernedRecordPayload["observedDetermination"];
  readonly payload: RuntimeGovernedRecordPayload;
  readonly candidateIssues:
    GovernedRecordCandidate["issues"];
  readonly boundaries:
    readonly PreservedRuntimeRecordBoundary[];
  readonly preservationNote?: string;
  readonly supersedesRecordId?: RecordId;
  readonly metadata: Readonly<Record<string, JsonValue>>;
}

export interface PreserveGovernedRecordCandidateInput {
  candidate: GovernedRecordCandidate;
  preservedBy: ActorReference;
  authorityBasis: string;
  authorityEvidenceIds?: readonly string[];
  authorityDeclaration?: string;
  preservationNote?: string;
  visibility?: RecordVisibility;
  supersedesRecordId?: RecordId;
  metadata?: Readonly<Record<string, JsonValue>>;
}

function createRecordId(): RecordId {
  if (
    typeof globalThis.crypto !== "undefined" &&
    "randomUUID" in globalThis.crypto
  ) {
    return `ta14-runtime-record-${globalThis.crypto.randomUUID()}`;
  }

  return `ta14-runtime-record-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function cloneJsonValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function deepFreeze<T>(value: T): T {
  if (
    value === null ||
    typeof value !== "object" ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  Object.freeze(value);

  for (const child of Object.values(
    value as Record<string, unknown>,
  )) {
    deepFreeze(child);
  }

  return value;
}

function defaultBoundaries(
  candidate: GovernedRecordCandidate,
): readonly PreservedRuntimeRecordBoundary[] {
  const boundaries: PreservedRuntimeRecordBoundary[] = [
    {
      category: "TEST_ONLY",
      statement:
        "This record preserves a governance-playground test result and does not establish verified real-world execution.",
    },
    {
      category: "EVIDENCE_LIMITATION",
      statement:
        "Attached evidence references remain bounded to their preserved status, provenance, scope, and unresolved limitations.",
    },
    {
      category: "EXECUTION_LIMITATION",
      statement:
        "Preservation does not authorize, initiate, or prove consequential execution.",
    },
    {
      category: "COMPLIANCE_LIMITATION",
      statement:
        "Preservation does not constitute certification, legal approval, regulatory compliance, or independent assurance.",
    },
    {
      category: "PRESERVATION_LIMITATION",
      statement:
        "The record proves what was preserved at the stated time; it does not prove that later conditions remained unchanged.",
    },
  ];

  for (const limitation of candidate.payload.limitations) {
    boundaries.push({
      category: "OTHER",
      statement: limitation,
    });
  }

  return boundaries;
}

export function assertCandidateCanBePreserved(
  candidate: GovernedRecordCandidate,
): void {
  if (candidate.status !== "APPROVED_FOR_PRESERVATION") {
    throw new Error(
      "Only a governed-record candidate approved for preservation can become a preserved record.",
    );
  }

  const blockingIssues = candidate.issues.filter(
    (issue) => issue.blocking,
  );

  if (blockingIssues.length > 0) {
    throw new Error(
      "A governed-record candidate with blocking issues cannot become a preserved record.",
    );
  }

  if (!candidate.payload.verificationValid) {
    throw new Error(
      "A governed-record candidate with an invalid scenario verification cannot become a preserved record.",
    );
  }
}

export function preserveGovernedRecordCandidate(
  input: PreserveGovernedRecordCandidateInput,
): PreservedRuntimeGovernedRecord {
  assertCandidateCanBePreserved(input.candidate);

  const preservedAt = new Date().toISOString();
  const candidate = cloneJsonValue(input.candidate);

  const record: PreservedRuntimeGovernedRecord = {
    schemaVersion: PRESERVED_RUNTIME_RECORD_SCHEMA_VERSION,
    recordId: createRecordId(),
    recordClass: candidate.recordClass,
    title: candidate.title,
    status: "PRESERVED",
    visibility: input.visibility ?? candidate.visibility,
    preservedAt,
    preservedBy: cloneJsonValue(input.preservedBy),
    authority: {
      preservedBy: cloneJsonValue(input.preservedBy),
      authorityBasis: input.authorityBasis.trim(),
      authorityEvidenceIds: [
        ...new Set(input.authorityEvidenceIds ?? []),
      ],
      declaration:
        input.authorityDeclaration?.trim() ||
        "The named actor declares authority to preserve this bounded record candidate as a TA-14 governed record.",
    },
    lineage: {
      sourceCandidateId: candidate.candidateId,
      sourceCandidateSchemaVersion: candidate.schemaVersion,
      sourceCandidateCreatedAt: candidate.createdAt,
      sourceCandidateApprovedAt: candidate.updatedAt,
      routeDraftId: candidate.routeDraftId,
      testSessionId: candidate.testSessionId,
      storedRunId: candidate.storedRunId,
    },
    determination: candidate.payload.observedDetermination,
    payload: cloneJsonValue(candidate.payload),
    candidateIssues: cloneJsonValue(candidate.issues),
    boundaries: defaultBoundaries(candidate),
    preservationNote: input.preservationNote?.trim() || undefined,
    supersedesRecordId: input.supersedesRecordId,
    metadata: cloneJsonValue(input.metadata ?? {}),
  };

  return deepFreeze(record);
}

export function exportPreservedRuntimeGovernedRecord(
  record: PreservedRuntimeGovernedRecord,
): string {
  return JSON.stringify(record, null, 2);
}
