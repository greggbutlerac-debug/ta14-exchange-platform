import type { JsonValue } from "./types";
import type {
  PreservedRuntimeGovernedRecord,
  PreservedRuntimeRecordStatus,
} from "./runtime-preserved-governed-record";

export type PreservedRecordVerificationSeverity =
  | "ERROR"
  | "WARNING"
  | "INFORMATION";

export interface PreservedRecordVerificationFinding {
  code: string;
  severity: PreservedRecordVerificationSeverity;
  message: string;
  path?: string;
}

export interface PreservedRuntimeRecordVerification {
  recordId: string;
  verifiedAt: string;
  structurallyValid: boolean;
  preservationValid: boolean;
  findings: readonly PreservedRecordVerificationFinding[];
  summary: {
    errors: number;
    warnings: number;
    information: number;
  };
}

const VALID_STATUSES: readonly PreservedRuntimeRecordStatus[] = [
  "PRESERVED",
  "SUPERSEDED",
  "REVOKED",
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function addFinding(
  findings: PreservedRecordVerificationFinding[],
  finding: PreservedRecordVerificationFinding,
): void {
  findings.push(finding);
}

function inspectRequiredString(
  findings: PreservedRecordVerificationFinding[],
  value: unknown,
  path: string,
  label: string,
): void {
  if (!isNonEmptyString(value)) {
    addFinding(findings, {
      code: "MISSING_REQUIRED_VALUE",
      severity: "ERROR",
      message: `${label} is missing or empty.`,
      path,
    });
  }
}

function inspectIsoDate(
  findings: PreservedRecordVerificationFinding[],
  value: unknown,
  path: string,
  label: string,
): void {
  if (
    !isNonEmptyString(value) ||
    Number.isNaN(Date.parse(value))
  ) {
    addFinding(findings, {
      code: "INVALID_DATE",
      severity: "ERROR",
      message: `${label} is not a valid ISO date-time value.`,
      path,
    });
  }
}

function countBySeverity(
  findings: readonly PreservedRecordVerificationFinding[],
  severity: PreservedRecordVerificationSeverity,
): number {
  return findings.filter(
    (finding) => finding.severity === severity,
  ).length;
}

function hasJsonCompatibleMetadata(
  value: Readonly<Record<string, JsonValue>>,
): boolean {
  try {
    JSON.stringify(value);
    return true;
  } catch {
    return false;
  }
}

export function verifyPreservedRuntimeGovernedRecord(
  record: PreservedRuntimeGovernedRecord,
): PreservedRuntimeRecordVerification {
  const findings: PreservedRecordVerificationFinding[] = [];

  inspectRequiredString(
    findings,
    record.schemaVersion,
    "schemaVersion",
    "Schema version",
  );
  inspectRequiredString(
    findings,
    record.recordId,
    "recordId",
    "Record identifier",
  );
  inspectRequiredString(
    findings,
    record.title,
    "title",
    "Record title",
  );
  inspectIsoDate(
    findings,
    record.preservedAt,
    "preservedAt",
    "Preservation timestamp",
  );

  if (!VALID_STATUSES.includes(record.status)) {
    addFinding(findings, {
      code: "INVALID_RECORD_STATUS",
      severity: "ERROR",
      message: `Record status ${String(
        record.status,
      )} is not recognized.`,
      path: "status",
    });
  }

  inspectRequiredString(
    findings,
    record.authority.authorityBasis,
    "authority.authorityBasis",
    "Preservation authority basis",
  );
  inspectRequiredString(
    findings,
    record.authority.declaration,
    "authority.declaration",
    "Preservation authority declaration",
  );

  inspectRequiredString(
    findings,
    record.lineage.sourceCandidateId,
    "lineage.sourceCandidateId",
    "Source candidate identifier",
  );
  inspectRequiredString(
    findings,
    record.lineage.routeDraftId,
    "lineage.routeDraftId",
    "Route-draft identifier",
  );
  inspectRequiredString(
    findings,
    record.lineage.testSessionId,
    "lineage.testSessionId",
    "Test-session identifier",
  );
  inspectRequiredString(
    findings,
    record.lineage.storedRunId,
    "lineage.storedRunId",
    "Stored-run identifier",
  );
  inspectIsoDate(
    findings,
    record.lineage.sourceCandidateCreatedAt,
    "lineage.sourceCandidateCreatedAt",
    "Source candidate creation timestamp",
  );
  inspectIsoDate(
    findings,
    record.lineage.sourceCandidateApprovedAt,
    "lineage.sourceCandidateApprovedAt",
    "Source candidate approval timestamp",
  );

  if (!record.determination) {
    addFinding(findings, {
      code: "MISSING_DETERMINATION",
      severity: "ERROR",
      message:
        "The preserved record does not contain an observed determination.",
      path: "determination",
    });
  }

  if (!record.payload.verificationValid) {
    addFinding(findings, {
      code: "INVALID_SCENARIO_VERIFICATION",
      severity: "ERROR",
      message:
        "The source scenario verification was not valid at preservation.",
      path: "payload.verificationValid",
    });
  }

  if (record.payload.evidenceIds.length === 0) {
    addFinding(findings, {
      code: "NO_EVIDENCE_REFERENCES",
      severity: "WARNING",
      message:
        "The preserved record contains no evidence references.",
      path: "payload.evidenceIds",
    });
  }

  if (record.boundaries.length === 0) {
    addFinding(findings, {
      code: "NO_PRESERVATION_BOUNDARIES",
      severity: "ERROR",
      message:
        "The preserved record contains no explicit preservation boundaries.",
      path: "boundaries",
    });
  }

  if (record.candidateIssues.some((issue) => issue.blocking)) {
    addFinding(findings, {
      code: "BLOCKING_ISSUE_PRESERVED",
      severity: "ERROR",
      message:
        "The record was preserved while one or more blocking candidate issues remained.",
      path: "candidateIssues",
    });
  }

  if (record.status === "SUPERSEDED") {
    addFinding(findings, {
      code: "RECORD_SUPERSEDED",
      severity: "INFORMATION",
      message:
        "This preserved record has been superseded and should not be treated as the current record.",
      path: "status",
    });
  }

  if (record.status === "REVOKED") {
    addFinding(findings, {
      code: "RECORD_REVOKED",
      severity: "WARNING",
      message:
        "This preserved record has been revoked and must not be relied upon as active.",
      path: "status",
    });
  }

  if (
    record.supersedesRecordId &&
    record.supersedesRecordId === record.recordId
  ) {
    addFinding(findings, {
      code: "SELF_SUPERSESSION",
      severity: "ERROR",
      message:
        "A preserved record cannot supersede itself.",
      path: "supersedesRecordId",
    });
  }

  if (!hasJsonCompatibleMetadata(record.metadata)) {
    addFinding(findings, {
      code: "INVALID_METADATA",
      severity: "ERROR",
      message:
        "The preserved record metadata is not JSON compatible.",
      path: "metadata",
    });
  }

  const errors = countBySeverity(findings, "ERROR");
  const warnings = countBySeverity(findings, "WARNING");
  const information = countBySeverity(
    findings,
    "INFORMATION",
  );

  return {
    recordId: record.recordId,
    verifiedAt: new Date().toISOString(),
    structurallyValid: errors === 0,
    preservationValid:
      errors === 0 && record.status === "PRESERVED",
    findings,
    summary: {
      errors,
      warnings,
      information,
    },
  };
}

export function assertPreservedRuntimeRecordValid(
  record: PreservedRuntimeGovernedRecord,
): void {
  const verification =
    verifyPreservedRuntimeGovernedRecord(record);

  if (!verification.preservationValid) {
    throw new Error(
      [
        `Preserved governed record ${record.recordId} is not valid for active reliance.`,
        ...verification.findings
          .filter((finding) => finding.severity === "ERROR")
          .map((finding) => finding.message),
      ].join(" "),
    );
  }
}
