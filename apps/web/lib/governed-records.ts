export const governedRecordKinds = [
  "PRESERVED_SUBMISSION",
  "VERIFIED_SOURCE",
  "CONTINUITY",
  "ADMISSIBILITY_ASSESSMENT",
  "GOVERNED_EVIDENCE",
  "GOVERNED_EXECUTION",
  "DEFICIENCY",
  "INADMISSIBLE_DETERMINATION",
] as const;

export type GovernedRecordKind = (typeof governedRecordKinds)[number];

export const governedRecordStatuses = [
  "DRAFT",
  "ASSESSING",
  "COMPLETE",
  "SUPERSEDED",
  "REVOKED",
] as const;

export type GovernedRecordStatus = (typeof governedRecordStatuses)[number];

export const governanceDimensions = [
  "identity",
  "provenance",
  "integrity",
  "continuity",
  "authority",
  "correspondence",
  "outcome",
] as const;

export type GovernanceDimension = (typeof governanceDimensions)[number];

export const governanceFindings = [
  "ESTABLISHED",
  "PARTIALLY_ESTABLISHED",
  "NOT_ESTABLISHED",
  "NOT_APPLICABLE",
  "UNKNOWN",
] as const;

export type GovernanceFinding = (typeof governanceFindings)[number];

export type GovernedRecordSource = {
  sourceId: string;
  label: string;
  mediaType: string;
  fileName?: string;
  sourceUri?: string;
  receivedAt: string;
  sha256?: string;
  sizeBytes?: number;
};

export type GovernanceAssessment = {
  dimension: GovernanceDimension;
  finding: GovernanceFinding;
  summary: string;
  supportingSourceIds: string[];
  missingRequirements: string[];
};

export type GovernedRecordDetermination = {
  kind: GovernedRecordKind;
  title: string;
  summary: string;
  admissibilityEstablished: boolean;
  highestDefensibleStatus: string;
  limitations: string[];
  nextRequirements: string[];
};

export type GovernedRecord = {
  schema: "TA14_GOVERNED_RECORD_V1";
  recordId: string;
  status: GovernedRecordStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  subject: {
    title: string;
    description: string;
    domain: string;
  };
  sources: GovernedRecordSource[];
  assessments: GovernanceAssessment[];
  determination: GovernedRecordDetermination;
  supersedesRecordId?: string;
  governingPrinciple: "No admissible evidence. No admissible execution.";
};

export type GovernedRecordIntakeDraft = {
  schema: "TA14_GOVERNED_RECORD_INTAKE_V1";
  intakeId: string;
  createdAt: string;
  submittedBy: string;
  subject: {
    title: string;
    description: string;
    domain: string;
  };
  declaredPurpose: string;
  sources: GovernedRecordSource[];
};

export function createGovernedRecordId(now = new Date()): string {
  const timestamp = now
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(0, 14);

  const entropy =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 10)
      : Math.random().toString(36).slice(2, 12);

  return `gr:${timestamp}:${entropy}`;
}

export function createGovernedRecordIntakeDraft(
  input: Omit<
    GovernedRecordIntakeDraft,
    "schema" | "intakeId" | "createdAt"
  >,
): GovernedRecordIntakeDraft {
  const createdAt = new Date().toISOString();

  return {
    schema: "TA14_GOVERNED_RECORD_INTAKE_V1",
    intakeId: createGovernedRecordId(),
    createdAt,
    submittedBy: input.submittedBy.trim() || "UNKNOWN",
    subject: {
      title: input.subject.title.trim() || "Untitled submission",
      description: input.subject.description.trim(),
      domain: input.subject.domain.trim() || "UNKNOWN",
    },
    declaredPurpose: input.declaredPurpose.trim(),
    sources: input.sources,
  };
}

export function createUnknownAssessments(): GovernanceAssessment[] {
  return governanceDimensions.map((dimension) => ({
    dimension,
    finding: "UNKNOWN",
    summary: "This governance dimension has not yet been assessed.",
    supportingSourceIds: [],
    missingRequirements: [],
  }));
}

export function isGovernedRecordKind(
  value: string,
): value is GovernedRecordKind {
  return governedRecordKinds.includes(value as GovernedRecordKind);
}

export function validateGovernedRecordIntake(
  value: unknown,
): GovernedRecordIntakeDraft {
  if (!value || typeof value !== "object") {
    throw new Error("The intake submission is not a valid object.");
  }

  const candidate = value as Partial<GovernedRecordIntakeDraft>;

  if (candidate.schema !== "TA14_GOVERNED_RECORD_INTAKE_V1") {
    throw new Error(
      "Unsupported intake schema. Expected TA14_GOVERNED_RECORD_INTAKE_V1.",
    );
  }

  if (
    typeof candidate.intakeId !== "string" ||
    typeof candidate.createdAt !== "string" ||
    typeof candidate.submittedBy !== "string"
  ) {
    throw new Error("The intake identity fields are missing or invalid.");
  }

  if (!candidate.subject || typeof candidate.subject !== "object") {
    throw new Error("The intake subject is missing.");
  }

  if (
    typeof candidate.subject.title !== "string" ||
    typeof candidate.subject.description !== "string" ||
    typeof candidate.subject.domain !== "string"
  ) {
    throw new Error("The intake subject fields must be text values.");
  }

  if (typeof candidate.declaredPurpose !== "string") {
    throw new Error("The declared purpose must be a text value.");
  }

  if (!Array.isArray(candidate.sources)) {
    throw new Error("The intake sources must be an array.");
  }

  for (const source of candidate.sources) {
    if (
      !source ||
      typeof source !== "object" ||
      typeof source.sourceId !== "string" ||
      typeof source.label !== "string" ||
      typeof source.mediaType !== "string" ||
      typeof source.receivedAt !== "string"
    ) {
      throw new Error("One or more intake sources are invalid.");
    }
  }

  return candidate as GovernedRecordIntakeDraft;
}
