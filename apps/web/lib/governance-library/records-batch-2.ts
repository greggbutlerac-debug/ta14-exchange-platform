import { GovernanceLibraryRecord } from "./records-foundational";

export const extendedGovernanceRecords: GovernanceLibraryRecord[] = [
  {
    slug: "ai-incident-response",
    title: "AI Incident Response",
    shortTitle: "AI Incident Response",
    recordType: "guidance",
    jurisdiction: "International",
    publisher: "TA-14 AI Governance Library",
    status: "published",
    categories: ["assurance", "incident-management", "operations"],
    summary:
      "Practices for identifying, triaging, containing, investigating, documenting, and resolving AI incidents.",
    whyItMatters:
      "Well-defined incident response preserves evidence, reduces harm, and supports organizational accountability.",
    keyTopics: [
      "incident response",
      "containment",
      "forensics",
      "corrective action",
      "lessons learned",
      "evidence preservation",
    ],
    relatedSlugs: [
      "ta14-admissible-execution",
      "mitre-atlas",
      "nist-ai-rmf",
    ],
  },
  {
    slug: "model-governance",
    title: "Model Governance",
    shortTitle: "Model Governance",
    recordType: "guidance",
    jurisdiction: "International",
    publisher: "TA-14 AI Governance Library",
    status: "published",
    categories: ["lifecycle", "models", "risk-management"],
    summary:
      "Governance practices covering model approval, versioning, validation, monitoring, retirement, and accountability.",
    whyItMatters:
      "Models evolve over time and require continual oversight to remain trustworthy and fit for purpose.",
    keyTopics: [
      "validation",
      "version control",
      "monitoring",
      "drift",
      "approval",
      "retirement",
    ],
    relatedSlugs: [
      "iso-iec-42001",
      "nist-ai-rmf",
      "ta14-reality-record-continuity-chain",
    ],
  },
  {
    slug: "runtime-governance",
    title: "Runtime AI Governance",
    shortTitle: "Runtime Governance",
    recordType: "architecture",
    jurisdiction: "Architecture",
    publisher: "TA-14 AI Governance Library",
    status: "foundational",
    categories: ["runtime-governance", "execution-control"],
    summary:
      "Governance applied while AI systems are executing rather than only before deployment.",
    whyItMatters:
      "Execution-time governance enables admissibility checks, intervention, and outcome preservation.",
    keyTopics: [
      "runtime controls",
      "execution",
      "monitoring",
      "intervention",
      "admissibility",
      "evidence",
    ],
    relatedSlugs: [
      "ta14-admissible-execution",
      "ai-incident-response",
      "model-governance",
    ],
  },
];

export default extendedGovernanceRecords;
