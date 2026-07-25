/**
 * TA-14 AI Governance Library and Framework Engine
 * Canonical type system for governed library records.
 *
 * This file intentionally contains no UI code, framework content, or database
 * calls. It defines the stable record structure used by the catalog, search,
 * filters, crosswalks, applicability routes, and future evidence packages.
 */

export type GovernanceLibraryCategory =
  | "law"
  | "regulation"
  | "standard"
  | "framework"
  | "principles"
  | "guidance"
  | "assurance"
  | "testing"
  | "risk-management"
  | "management-system"
  | "organizational-policy"
  | "sector-overlay"
  | "technical-control"
  | "governance-discipline"
  | "assessment"
  | "documentation"
  | "other";

export type GovernanceAuthorityLevel =
  | "binding-law"
  | "binding-regulation"
  | "contractual"
  | "certifiable-standard"
  | "voluntary-standard"
  | "official-guidance"
  | "industry-guidance"
  | "organizational-control"
  | "informational";

export type GovernanceRecordStatus =
  | "active"
  | "adopted"
  | "published"
  | "draft"
  | "proposed"
  | "superseded"
  | "withdrawn"
  | "archived"
  | "unknown";

export type GovernanceGeography =
  | "global"
  | "international"
  | "european-union"
  | "united-states"
  | "united-kingdom"
  | "canada"
  | "australia"
  | "singapore"
  | "china"
  | "japan"
  | "india"
  | "regional"
  | "national"
  | "sector-specific"
  | "organization-specific";

export type GovernanceActorRole =
  | "provider"
  | "deployer"
  | "developer"
  | "manufacturer"
  | "importer"
  | "distributor"
  | "authorized-representative"
  | "operator"
  | "owner"
  | "controller"
  | "processor"
  | "reviewer"
  | "auditor"
  | "assessor"
  | "regulator"
  | "public-authority"
  | "procurement"
  | "executive-leadership"
  | "board"
  | "risk-owner"
  | "system-owner"
  | "data-owner"
  | "model-owner"
  | "affected-person"
  | "general-purpose-ai-provider"
  | "other";

export type GovernanceLifecycleStage =
  | "concept"
  | "design"
  | "data"
  | "development"
  | "training"
  | "evaluation"
  | "validation"
  | "procurement"
  | "deployment"
  | "operation"
  | "monitoring"
  | "change-management"
  | "incident-response"
  | "retirement"
  | "post-execution-review";

export type GovernanceEvidenceType =
  | "policy"
  | "procedure"
  | "risk-assessment"
  | "impact-assessment"
  | "data-record"
  | "model-record"
  | "system-card"
  | "technical-documentation"
  | "test-result"
  | "evaluation-result"
  | "validation-result"
  | "audit-record"
  | "approval-record"
  | "authority-record"
  | "training-record"
  | "incident-record"
  | "monitoring-record"
  | "change-record"
  | "execution-record"
  | "outcome-record"
  | "supplier-record"
  | "contract"
  | "public-notice"
  | "human-oversight-record"
  | "security-record"
  | "privacy-record"
  | "other";

export type Ta14ChainLink =
  | "reality"
  | "record"
  | "continuity"
  | "admissibility"
  | "binding"
  | "commit"
  | "execution"
  | "outcome";

export type Ta14Decision =
  | "ALLOW"
  | "HOLD"
  | "DENY"
  | "ESCALATE"
  | "NOT_REVIEWED";

export type SourceAuthorityRecord = {
  issuingAuthority: string;
  authorityType:
    | "legislature"
    | "regulator"
    | "standards-body"
    | "government"
    | "intergovernmental-body"
    | "industry-body"
    | "nonprofit"
    | "academic"
    | "organization"
    | "other";
  officialTitle: string;
  officialUrl?: string;
  publicationDate?: string;
  effectiveDate?: string;
  version?: string;
  jurisdiction?: string;
  sourceStatus: GovernanceRecordStatus;
  lastVerifiedAt?: string;
};

export type GovernanceRequirementReference = {
  id: string;
  label: string;
  citation?: string;
  summary: string;
  mandatory?: boolean;
  evidenceTypes?: GovernanceEvidenceType[];
  lifecycleStages?: GovernanceLifecycleStage[];
  actorRoles?: GovernanceActorRole[];
  ta14ChainLinks?: Ta14ChainLink[];
};

export type GovernanceCrosswalk = {
  targetRecordId: string;
  relationship:
    | "implements"
    | "supports"
    | "overlaps"
    | "references"
    | "depends-on"
    | "conflicts-with"
    | "supersedes"
    | "superseded-by"
    | "maps-to"
    | "informs";
  explanation: string;
  confidence: "confirmed" | "strong" | "partial" | "unverified";
  sourceReferences?: string[];
};

export type ApplicabilityQuestion = {
  id: string;
  prompt: string;
  helpText?: string;
  answerType: "boolean" | "single-select" | "multi-select" | "text";
  options?: Array<{
    value: string;
    label: string;
    explanation?: string;
  }>;
  required: boolean;
};

export type ApplicabilityRule = {
  id: string;
  description: string;
  when: Array<{
    questionId: string;
    operator:
      | "equals"
      | "not-equals"
      | "includes"
      | "not-includes"
      | "exists"
      | "not-exists";
    value?: string | boolean | string[];
  }>;
  result: {
    applicable: boolean | "conditional" | "undetermined";
    decision: Ta14Decision;
    explanation: string;
    requirementIds?: string[];
    missingEvidence?: GovernanceEvidenceType[];
  };
};

export type Ta14RouteAction = {
  chainLink: Ta14ChainLink;
  action: string;
  purpose: string;
  requiredEvidence?: GovernanceEvidenceType[];
  failureDecision?: Exclude<Ta14Decision, "NOT_REVIEWED">;
};

export type GovernanceLibraryRecord = {
  id: string;
  slug: string;

  acronym: string;
  aliases?: string[];
  fullName: string;
  shortName?: string;

  plainLanguagePurpose: string;
  description: string;
  scopeSummary: string;

  categories: GovernanceLibraryCategory[];
  authorityLevel: GovernanceAuthorityLevel;
  status: GovernanceRecordStatus;
  geographies: GovernanceGeography[];
  sectors?: string[];

  source: SourceAuthorityRecord;

  actorRoles: GovernanceActorRole[];
  lifecycleStages: GovernanceLifecycleStage[];
  evidenceTypes: GovernanceEvidenceType[];

  requirements?: GovernanceRequirementReference[];
  applicabilityQuestions?: ApplicabilityQuestion[];
  applicabilityRules?: ApplicabilityRule[];
  crosswalks?: GovernanceCrosswalk[];
  ta14RouteActions?: Ta14RouteAction[];

  keywords: string[];
  tags: string[];

  legalDisclaimer?: string;
  limitations?: string[];
  supersedesRecordIds?: string[];
  supersededByRecordIds?: string[];

  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
};

export type GovernanceLibraryFilter = {
  query?: string;
  categories?: GovernanceLibraryCategory[];
  authorityLevels?: GovernanceAuthorityLevel[];
  statuses?: GovernanceRecordStatus[];
  geographies?: GovernanceGeography[];
  actorRoles?: GovernanceActorRole[];
  lifecycleStages?: GovernanceLifecycleStage[];
  evidenceTypes?: GovernanceEvidenceType[];
  ta14ChainLinks?: Ta14ChainLink[];
  tags?: string[];
};

export type GovernanceLibrarySearchResult = {
  record: GovernanceLibraryRecord;
  score: number;
  matchedFields: Array<
    | "acronym"
    | "alias"
    | "fullName"
    | "purpose"
    | "description"
    | "authority"
    | "keyword"
    | "tag"
    | "requirement"
  >;
};

export type GovernanceApplicabilityAnswer = {
  questionId: string;
  value: string | boolean | string[];
};

export type GovernanceApplicabilityResult = {
  recordId: string;
  applicable: boolean | "conditional" | "undetermined";
  decision: Ta14Decision;
  explanation: string;
  applicableRequirementIds: string[];
  missingEvidence: GovernanceEvidenceType[];
  routeActions: Ta14RouteAction[];
  evaluatedAt: string;
};

export type GovernanceLibraryStats = {
  totalRecords: number;
  byCategory: Partial<Record<GovernanceLibraryCategory, number>>;
  byAuthorityLevel: Partial<Record<GovernanceAuthorityLevel, number>>;
  byStatus: Partial<Record<GovernanceRecordStatus, number>>;
  lastUpdatedAt?: string;
};
