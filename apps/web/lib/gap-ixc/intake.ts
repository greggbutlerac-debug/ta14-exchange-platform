import type { GapIxcDimension } from "./types";

export type Ta14IntakePathway =
  | "REGISTRATION_ONLY"
  | "EVIDENCE_READY"
  | "GOVERNED_EXAMINATION"
  | "INDEPENDENT_ASSURANCE";

export type IntakeRequirement = {
  id: string;
  label: string;
  requiredFor: Ta14IntakePathway[];
  conditional?: boolean;
  note: string;
};

export const INTAKE_PATHWAYS: Array<{
  id: Ta14IntakePathway;
  label: string;
  description: string;
}> = [
  {
    id: "REGISTRATION_ONLY",
    label: "Register the architecture",
    description: "Create an attributable public or controlled baseline without entering an assurance examination.",
  },
  {
    id: "EVIDENCE_READY",
    label: "Register with supporting evidence",
    description: "Add evidence, repositories, publications, implementation references, and provenance when available.",
  },
  {
    id: "GOVERNED_EXAMINATION",
    label: "Enter a governed examination",
    description: "Freeze a bounded proposition and provide only the evidence and boundaries needed for the applicable GAP-IXC dimensions.",
  },
  {
    id: "INDEPENDENT_ASSURANCE",
    label: "Seek independent assurance",
    description: "Use a frozen packet and separate evaluator when independent production or reproduction standing is sought.",
  },
];

export const INTAKE_REQUIREMENTS: IntakeRequirement[] = [
  { id: "name", label: "Architecture name", requiredFor: ["REGISTRATION_ONLY", "EVIDENCE_READY", "GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], note: "Needed for persistent identity." },
  { id: "version", label: "Version or version label", requiredFor: ["REGISTRATION_ONLY", "EVIDENCE_READY", "GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], note: "Prevents silent version substitution." },
  { id: "claimant", label: "Claimant / submitting organization", requiredFor: ["REGISTRATION_ONLY", "EVIDENCE_READY", "GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], note: "Needed for attribution." },
  { id: "steward", label: "Steward or contact route", requiredFor: ["REGISTRATION_ONLY", "EVIDENCE_READY", "GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], note: "Needed for continuity, correction, and challenge." },
  { id: "description", label: "Concise description and scope", requiredFor: ["REGISTRATION_ONLY", "EVIDENCE_READY", "GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], note: "Enough to understand what is being registered." },
  { id: "claims", label: "Core claims", requiredFor: ["REGISTRATION_ONLY", "EVIDENCE_READY", "GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], note: "Claims remain declarations until separately examined." },
  { id: "nonclaims", label: "Material non-claims / limitations", requiredFor: ["REGISTRATION_ONLY", "EVIDENCE_READY", "GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], conditional: true, note: "Required only when omission would make the registration materially misleading." },
  { id: "authorityAttestation", label: "Submitter authority / attribution attestation", requiredFor: ["REGISTRATION_ONLY", "EVIDENCE_READY", "GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], note: "Does not establish downstream action authority." },
  { id: "evidenceInventory", label: "Supporting evidence inventory", requiredFor: ["EVIDENCE_READY", "GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], conditional: true, note: "Optional at ordinary registration; required only to the extent evidence is relied upon later." },
  { id: "propositionFreeze", label: "Frozen proposition", requiredFor: ["GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], note: "Required only for the claim actually being examined." },
  { id: "applicableDimensions", label: "Applicable GAP-IXC dimensions", requiredFor: ["GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], note: "Do not collect inapplicable dimensions merely for completeness." },
  { id: "executionBoundary", label: "Execution boundary", requiredFor: ["GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], conditional: true, note: "Required only when X or a consequence-bearing execution proposition is in scope." },
  { id: "consequenceBoundary", label: "Consequence boundary / observation window", requiredFor: ["GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], conditional: true, note: "Required only when C is in scope." },
  { id: "revalidation", label: "Relevant revalidation triggers", requiredFor: ["GOVERNED_EXAMINATION", "INDEPENDENT_ASSURANCE"], conditional: true, note: "Only triggers material to the issued determination are required." },
  { id: "independence", label: "Independent evaluator / reproduction boundary", requiredFor: ["INDEPENDENT_ASSURANCE"], note: "Required only when independent standing is sought." },
];

export function requirementsFor(pathway: Ta14IntakePathway) {
  return INTAKE_REQUIREMENTS.filter((item) => item.requiredFor.includes(pathway));
}

export function needsBoundaryForDimensions(dimensions: GapIxcDimension[]) {
  return {
    executionBoundary: dimensions.includes("X") || dimensions.includes("C"),
    consequenceBoundary: dimensions.includes("C"),
  };
}
