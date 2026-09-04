export type RegistryStepRequirement = {
  number: string;
  title: string;
  short: string;
  purpose: string;
  blockingRequiredFields: string[];
  optionalFields: string[];
  note?: string;
};

export const TA14_REGISTRY_14_STEP_POLICY: RegistryStepRequirement[] = [
  {
    number: "01",
    title: "Governance Identity",
    short: "Identity",
    purpose: "Identify the governance architecture and version being registered.",
    blockingRequiredFields: ["governanceName", "currentVersion"],
    optionalFields: ["shortName", "effectiveVersionDate", "establishmentDate", "governanceCategory"],
  },
  {
    number: "02",
    title: "Founder & Authority",
    short: "Authority",
    purpose: "Attribute the submission to a real claimant or authorized submitter.",
    blockingRequiredFields: ["claimantName", "authorityRole", "authorityConfirmed"],
    optionalFields: ["claimantType", "authorityEvidence"],
    note: "Detailed authority evidence is optional at ordinary registration unless needed to resolve attribution or a dispute.",
  },
  {
    number: "03",
    title: "Stewardship",
    short: "Stewardship",
    purpose: "Identify a responsible steward or route for continuity, correction, and challenge.",
    blockingRequiredFields: ["stewardName", "contactEmail"],
    optionalFields: ["organization", "website", "publicEvidenceRoute", "contactVisibility", "publicContact"],
  },
  {
    number: "04",
    title: "Governance Description",
    short: "Description",
    purpose: "Explain what the architecture is in plain language.",
    blockingRequiredFields: ["plainDescription"],
    optionalFields: [],
  },
  {
    number: "05",
    title: "Claims",
    short: "Claims",
    purpose: "State the core claims the registrant chooses to place on the record.",
    blockingRequiredFields: ["claims"],
    optionalFields: [],
    note: "Registry claims remain declarations unless separately examined or assured.",
  },
  {
    number: "06",
    title: "Non-Claims",
    short: "Non-Claims",
    purpose: "Allow the registrant to bound what the architecture does not claim.",
    blockingRequiredFields: [],
    optionalFields: ["nonClaims", "limitations"],
    note: "Optional unless omission would make the registration materially misleading; TA-14 may request clarification before publication in that limited circumstance.",
  },
  {
    number: "07",
    title: "Scope & Jurisdiction",
    short: "Scope",
    purpose: "Provide context for where or how the architecture is intended to apply.",
    blockingRequiredFields: [],
    optionalFields: ["jurisdiction", "regulatoryScope"],
    note: "Jurisdiction and regulatory scope are optional for architectures that do not make jurisdiction-specific or regulatory claims.",
  },
  {
    number: "08",
    title: "Evidence Package",
    short: "Evidence",
    purpose: "Allow supporting evidence to be preserved when the registrant wants to provide it.",
    blockingRequiredFields: [],
    optionalFields: ["evidenceFiles", "evidenceCategory", "evidenceRelationship", "provenanceStatus"],
    note: "No evidence upload is required for record-only registration. Evidence becomes required only when a later examination or assurance proposition relies upon it.",
  },
  {
    number: "09",
    title: "Publications",
    short: "Publications",
    purpose: "Preserve publications or dated public disclosures when available.",
    blockingRequiredFields: [],
    optionalFields: ["publications"],
  },
  {
    number: "10",
    title: "Repositories & Deposits",
    short: "Repositories",
    purpose: "Preserve repository, release, deposit, or archival references when available.",
    blockingRequiredFields: [],
    optionalFields: ["repositories", "zenodoRecords"],
  },
  {
    number: "11",
    title: "Patents & Rights",
    short: "Rights",
    purpose: "Allow intellectual-property and rights information to be disclosed when relevant.",
    blockingRequiredFields: [],
    optionalFields: ["patentRecords", "ownershipDeclaration", "license"],
  },
  {
    number: "12",
    title: "Review Pathway",
    short: "Review",
    purpose: "Allow the registrant to opt into additional review pathways without making review a registration prerequisite.",
    blockingRequiredFields: [],
    optionalFields: ["reviewPathway", "allowReviewRequests", "allowCollaboration", "allowDisputeNotices", "disputes"],
    note: "Choosing no additional review pathway does not block registration.",
  },
  {
    number: "13",
    title: "Declarations",
    short: "Declarations",
    purpose: "Confirm accuracy, attribution, and the registrant's responsibility for the submitted record.",
    blockingRequiredFields: ["accuracyConfirmed", "boundaryConfirmed"],
    optionalFields: [],
    note: "These declarations do not certify the truth of every underlying claim; they confirm the registrant's attributable submission and declared boundaries.",
  },
  {
    number: "14",
    title: "Preview & Receipt",
    short: "Preview",
    purpose: "Review the completed record and issue the registration receipt.",
    blockingRequiredFields: ["termsAccepted"],
    optionalFields: [],
  },
];

if (TA14_REGISTRY_14_STEP_POLICY.length !== 14) {
  throw new Error("TA-14 Registry policy must contain exactly 14 steps.");
}

export const TA14_REGISTRY_REQUIRED_FIELD_IDS = Array.from(
  new Set(TA14_REGISTRY_14_STEP_POLICY.flatMap((step) => step.blockingRequiredFields)),
);

export function isOptionalRegistryField(fieldId: string) {
  return !TA14_REGISTRY_REQUIRED_FIELD_IDS.includes(fieldId);
}
