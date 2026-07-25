import type { GovernanceLibraryRecord } from "./types";

/**
 * TA-14 AI Governance Library — Canonical Starter Catalog
 *
 * This file contains the first governed records for the public library.
 * Each record is structured for acronym search, authority filtering,
 * applicability review, evidence mapping, crosswalks, and TA-14 route building.
 *
 * Dates use ISO 8601. Official source URLs should be periodically re-verified.
 */

export const governanceLibraryCatalog: GovernanceLibraryRecord[] = [
  {
    id: "eu-ai-act-2024-1689",
    slug: "eu-ai-act",
    acronym: "EU AI Act",
    aliases: ["AI Act", "Regulation (EU) 2024/1689"],
    fullName:
      "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence",
    shortName: "European Union Artificial Intelligence Act",
    plainLanguagePurpose:
      "Creates binding European Union rules for placing AI systems on the market, putting them into service, and using them, with obligations determined by role and risk classification.",
    description:
      "A binding European Union regulation establishing prohibited AI practices, requirements for high-risk AI systems, transparency duties, general-purpose AI obligations, governance structures, enforcement mechanisms, and operator responsibilities.",
    scopeSummary:
      "Applies to specified providers, deployers, importers, distributors, authorized representatives, product manufacturers, and certain actors outside the European Union when the regulation's territorial conditions are met.",
    categories: ["law", "regulation"],
    authorityLevel: "binding-regulation",
    status: "active",
    geographies: ["european-union"],
    sectors: ["cross-sector", "public sector", "private sector"],
    source: {
      issuingAuthority:
        "European Parliament and Council of the European Union",
      authorityType: "legislature",
      officialTitle:
        "Regulation (EU) 2024/1689 of the European Parliament and of the Council of 13 June 2024 laying down harmonised rules on artificial intelligence",
      officialUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
      publicationDate: "2024-07-12",
      effectiveDate: "2024-08-01",
      version: "2024/1689",
      jurisdiction: "European Union",
      sourceStatus: "active",
      lastVerifiedAt: "2026-07-25",
    },
    actorRoles: [
      "provider",
      "deployer",
      "manufacturer",
      "importer",
      "distributor",
      "authorized-representative",
      "general-purpose-ai-provider",
      "public-authority",
      "regulator",
      "affected-person",
    ],
    lifecycleStages: [
      "concept",
      "design",
      "data",
      "development",
      "training",
      "evaluation",
      "validation",
      "procurement",
      "deployment",
      "operation",
      "monitoring",
      "change-management",
      "incident-response",
      "retirement",
      "post-execution-review",
    ],
    evidenceTypes: [
      "policy",
      "procedure",
      "risk-assessment",
      "impact-assessment",
      "data-record",
      "model-record",
      "technical-documentation",
      "test-result",
      "evaluation-result",
      "validation-result",
      "approval-record",
      "authority-record",
      "training-record",
      "incident-record",
      "monitoring-record",
      "change-record",
      "execution-record",
      "outcome-record",
      "supplier-record",
      "contract",
      "public-notice",
      "human-oversight-record",
      "security-record",
      "privacy-record",
    ],
    requirements: [
      {
        id: "eu-ai-act-classification",
        label: "Role and risk classification",
        summary:
          "Determine the relevant operator role, system classification, prohibited-practice exposure, and applicable obligations before relying on the system.",
        mandatory: true,
        evidenceTypes: [
          "risk-assessment",
          "technical-documentation",
          "authority-record",
        ],
        lifecycleStages: ["concept", "design", "procurement", "deployment"],
        actorRoles: [
          "provider",
          "deployer",
          "importer",
          "distributor",
          "manufacturer",
          "general-purpose-ai-provider",
        ],
        ta14ChainLinks: ["reality", "record", "admissibility"],
      },
      {
        id: "eu-ai-act-documentation",
        label: "Technical and governance documentation",
        summary:
          "Preserve documentation sufficient to support the applicable legal obligations, system characteristics, controls, testing, oversight, and post-market responsibilities.",
        mandatory: true,
        evidenceTypes: [
          "technical-documentation",
          "risk-assessment",
          "test-result",
          "monitoring-record",
          "change-record",
        ],
        lifecycleStages: [
          "development",
          "evaluation",
          "validation",
          "deployment",
          "operation",
          "monitoring",
        ],
        ta14ChainLinks: ["record", "continuity", "binding", "outcome"],
      },
      {
        id: "eu-ai-act-human-oversight",
        label: "Human oversight",
        summary:
          "Establish and preserve the authority, competence, information, and intervention conditions required for meaningful human oversight where applicable.",
        mandatory: true,
        evidenceTypes: [
          "human-oversight-record",
          "authority-record",
          "training-record",
          "procedure",
        ],
        lifecycleStages: ["deployment", "operation", "incident-response"],
        ta14ChainLinks: [
          "admissibility",
          "binding",
          "commit",
          "execution",
          "outcome",
        ],
      },
    ],
    applicabilityQuestions: [
      {
        id: "eu-market-connection",
        prompt:
          "Is the AI system placed on the European Union market, put into service in the European Union, used by an EU-based deployer, or producing output used in the European Union?",
        helpText:
          "A documented territorial-scope review is required; a simple location answer may be insufficient.",
        answerType: "boolean",
        required: true,
      },
      {
        id: "eu-operator-role",
        prompt: "Which EU AI Act operator role or roles apply?",
        answerType: "multi-select",
        required: true,
        options: [
          { value: "provider", label: "Provider" },
          { value: "deployer", label: "Deployer" },
          { value: "importer", label: "Importer" },
          { value: "distributor", label: "Distributor" },
          {
            value: "authorized-representative",
            label: "Authorized representative",
          },
          { value: "manufacturer", label: "Product manufacturer" },
          {
            value: "general-purpose-ai-provider",
            label: "General-purpose AI provider",
          },
          { value: "undetermined", label: "Role not yet determined" },
        ],
      },
      {
        id: "eu-risk-classification",
        prompt: "Has the AI system's regulatory classification been documented?",
        answerType: "single-select",
        required: true,
        options: [
          { value: "prohibited", label: "Potentially prohibited practice" },
          { value: "high-risk", label: "High-risk AI system" },
          { value: "transparency", label: "Transparency obligation" },
          { value: "gpai", label: "General-purpose AI" },
          { value: "other", label: "Other or minimal-risk use" },
          { value: "undetermined", label: "Not yet determined" },
        ],
      },
    ],
    applicabilityRules: [
      {
        id: "eu-territorial-scope-unconfirmed",
        description:
          "Hold the route when territorial connection has not been established.",
        when: [
          {
            questionId: "eu-market-connection",
            operator: "not-equals",
            value: true,
          },
        ],
        result: {
          applicable: "undetermined",
          decision: "HOLD",
          explanation:
            "The route cannot assert applicability or non-applicability until territorial scope is documented.",
          missingEvidence: ["risk-assessment", "authority-record"],
        },
      },
      {
        id: "eu-role-undetermined",
        description:
          "Escalate when the operator role has not been determined.",
        when: [
          {
            questionId: "eu-operator-role",
            operator: "includes",
            value: "undetermined",
          },
        ],
        result: {
          applicable: "conditional",
          decision: "ESCALATE",
          explanation:
            "Role-specific duties cannot be compiled until the operator role is resolved.",
          missingEvidence: ["authority-record", "technical-documentation"],
        },
      },
      {
        id: "eu-classification-undetermined",
        description:
          "Hold execution when system classification remains unresolved.",
        when: [
          {
            questionId: "eu-risk-classification",
            operator: "equals",
            value: "undetermined",
          },
        ],
        result: {
          applicable: "conditional",
          decision: "HOLD",
          explanation:
            "The applicable obligation set cannot be bound to the route until classification is supported.",
          missingEvidence: ["risk-assessment", "technical-documentation"],
        },
      },
    ],
    crosswalks: [
      {
        targetRecordId: "nist-ai-rmf-1-0",
        relationship: "overlaps",
        explanation:
          "Both address AI risk governance, documentation, measurement, oversight, and lifecycle management, but the EU AI Act is binding law while the NIST AI RMF is voluntary.",
        confidence: "strong",
      },
      {
        targetRecordId: "iso-iec-42001-2023",
        relationship: "supports",
        explanation:
          "An AI management system may support organizational governance and documentation used to address EU AI Act obligations, but certification does not itself prove legal compliance.",
        confidence: "strong",
      },
    ],
    ta14RouteActions: [
      {
        chainLink: "reality",
        action:
          "Identify the actual AI system, intended purpose, deployment context, affected actors, market connection, and operator roles.",
        purpose:
          "Prevent a legal conclusion from being made against an undefined or mischaracterized system.",
        requiredEvidence: [
          "technical-documentation",
          "supplier-record",
          "contract",
        ],
        failureDecision: "HOLD",
      },
      {
        chainLink: "admissibility",
        action:
          "Evaluate territorial scope, role, classification, prohibited-practice exposure, and evidence sufficiency before permitting the governed action.",
        purpose:
          "Bind execution permission to the obligation set that actually applies.",
        requiredEvidence: [
          "risk-assessment",
          "authority-record",
          "technical-documentation",
        ],
        failureDecision: "ESCALATE",
      },
      {
        chainLink: "outcome",
        action:
          "Preserve monitoring, incident, change, human-oversight, and post-market evidence after execution.",
        purpose:
          "Demonstrate whether the governed controls remained effective during operation.",
        requiredEvidence: [
          "monitoring-record",
          "incident-record",
          "change-record",
          "outcome-record",
        ],
        failureDecision: "HOLD",
      },
    ],
    keywords: [
      "European Union",
      "AI regulation",
      "high-risk AI",
      "prohibited AI",
      "general-purpose AI",
      "GPAI",
      "provider",
      "deployer",
      "conformity",
      "fundamental rights",
      "human oversight",
      "post-market monitoring",
    ],
    tags: ["binding", "EU", "risk-based", "operator obligations"],
    legalDisclaimer:
      "This library record is an educational governance aid and is not legal advice, certification, or a determination of compliance.",
    limitations: [
      "Applicability depends on facts, role, jurisdiction, system classification, and implementation timelines.",
      "The record does not replace the official regulation, delegated acts, implementing acts, standards, regulatory guidance, or qualified legal review.",
    ],
    createdAt: "2026-07-25",
    updatedAt: "2026-07-25",
    reviewedAt: "2026-07-25",
  },

  {
    id: "nist-ai-rmf-1-0",
    slug: "nist-ai-rmf-1-0",
    acronym: "NIST AI RMF",
    aliases: ["AI RMF", "AI RMF 1.0", "NIST AI 100-1"],
    fullName: "Artificial Intelligence Risk Management Framework 1.0",
    plainLanguagePurpose:
      "Provides a voluntary, flexible structure for organizations to govern, map, measure, and manage risks associated with AI systems.",
    description:
      "A voluntary United States framework intended to help organizations designing, developing, deploying, or using AI systems manage risks and promote trustworthy and responsible AI.",
    scopeSummary:
      "Designed for voluntary use across sectors, organization sizes, use cases, and stages of the AI lifecycle.",
    categories: ["framework", "risk-management"],
    authorityLevel: "official-guidance",
    status: "published",
    geographies: ["united-states", "global"],
    sectors: ["cross-sector"],
    source: {
      issuingAuthority: "National Institute of Standards and Technology",
      authorityType: "government",
      officialTitle:
        "Artificial Intelligence Risk Management Framework (AI RMF 1.0)",
      officialUrl:
        "https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-ai-rmf-10",
      publicationDate: "2023-01-26",
      version: "1.0 / NIST AI 100-1",
      jurisdiction: "United States",
      sourceStatus: "published",
      lastVerifiedAt: "2026-07-25",
    },
    actorRoles: [
      "provider",
      "deployer",
      "developer",
      "operator",
      "owner",
      "reviewer",
      "auditor",
      "executive-leadership",
      "board",
      "risk-owner",
      "system-owner",
      "data-owner",
      "model-owner",
      "affected-person",
    ],
    lifecycleStages: [
      "concept",
      "design",
      "data",
      "development",
      "training",
      "evaluation",
      "validation",
      "procurement",
      "deployment",
      "operation",
      "monitoring",
      "change-management",
      "incident-response",
      "retirement",
      "post-execution-review",
    ],
    evidenceTypes: [
      "policy",
      "procedure",
      "risk-assessment",
      "impact-assessment",
      "data-record",
      "model-record",
      "system-card",
      "technical-documentation",
      "test-result",
      "evaluation-result",
      "validation-result",
      "audit-record",
      "approval-record",
      "authority-record",
      "training-record",
      "incident-record",
      "monitoring-record",
      "change-record",
      "execution-record",
      "outcome-record",
      "supplier-record",
      "human-oversight-record",
      "security-record",
      "privacy-record",
    ],
    requirements: [
      {
        id: "nist-govern",
        label: "GOVERN",
        summary:
          "Establish organizational culture, structures, policies, roles, accountability, and risk-management processes for AI.",
        evidenceTypes: [
          "policy",
          "procedure",
          "authority-record",
          "training-record",
          "audit-record",
        ],
        lifecycleStages: [
          "concept",
          "design",
          "procurement",
          "deployment",
          "operation",
          "monitoring",
        ],
        ta14ChainLinks: [
          "record",
          "continuity",
          "admissibility",
          "binding",
        ],
      },
      {
        id: "nist-map",
        label: "MAP",
        summary:
          "Establish context and identify the system, actors, impacts, benefits, limitations, and risks.",
        evidenceTypes: [
          "risk-assessment",
          "impact-assessment",
          "technical-documentation",
          "supplier-record",
        ],
        lifecycleStages: ["concept", "design", "procurement", "deployment"],
        ta14ChainLinks: ["reality", "record", "admissibility"],
      },
      {
        id: "nist-measure",
        label: "MEASURE",
        summary:
          "Analyze, assess, benchmark, and track AI risks and trustworthiness characteristics using documented methods.",
        evidenceTypes: [
          "test-result",
          "evaluation-result",
          "validation-result",
          "monitoring-record",
        ],
        lifecycleStages: [
          "evaluation",
          "validation",
          "deployment",
          "operation",
          "monitoring",
        ],
        ta14ChainLinks: ["record", "continuity", "admissibility", "outcome"],
      },
      {
        id: "nist-manage",
        label: "MANAGE",
        summary:
          "Prioritize, respond to, monitor, and communicate AI risks based on mapped and measured evidence.",
        evidenceTypes: [
          "approval-record",
          "risk-assessment",
          "incident-record",
          "change-record",
          "monitoring-record",
          "outcome-record",
        ],
        lifecycleStages: [
          "deployment",
          "operation",
          "monitoring",
          "change-management",
          "incident-response",
          "retirement",
        ],
        ta14ChainLinks: [
          "admissibility",
          "binding",
          "commit",
          "execution",
          "outcome",
        ],
      },
    ],
    crosswalks: [
      {
        targetRecordId: "iso-iec-42001-2023",
        relationship: "overlaps",
        explanation:
          "Both provide organization-level structures for governing AI risks, responsibilities, controls, monitoring, and continual improvement.",
        confidence: "strong",
      },
      {
        targetRecordId: "eu-ai-act-2024-1689",
        relationship: "supports",
        explanation:
          "AI RMF practices may support evidence and controls relevant to legal obligations, but use of the framework does not itself establish EU AI Act compliance.",
        confidence: "strong",
      },
    ],
    ta14RouteActions: [
      {
        chainLink: "reality",
        action:
          "Map the system context, intended purpose, actors, affected people, dependencies, benefits, limitations, and risks.",
        purpose:
          "Establish the actual system and operating context before assessing or governing it.",
        requiredEvidence: [
          "technical-documentation",
          "risk-assessment",
          "impact-assessment",
        ],
        failureDecision: "HOLD",
      },
      {
        chainLink: "admissibility",
        action:
          "Evaluate whether measured risk evidence, authority, controls, and residual-risk acceptance support the proposed action.",
        purpose:
          "Convert voluntary risk-management activity into a decision-time execution gate.",
        requiredEvidence: [
          "evaluation-result",
          "validation-result",
          "approval-record",
          "authority-record",
        ],
        failureDecision: "ESCALATE",
      },
      {
        chainLink: "outcome",
        action:
          "Preserve monitoring and outcome evidence and compare actual performance with mapped assumptions and measured expectations.",
        purpose:
          "Determine whether the risk response remained effective after deployment.",
        requiredEvidence: [
          "monitoring-record",
          "incident-record",
          "outcome-record",
        ],
        failureDecision: "HOLD",
      },
    ],
    keywords: [
      "NIST",
      "risk management",
      "trustworthy AI",
      "GOVERN",
      "MAP",
      "MEASURE",
      "MANAGE",
      "AI lifecycle",
      "TEVV",
      "voluntary framework",
    ],
    tags: ["voluntary", "United States", "risk management", "lifecycle"],
    limitations: [
      "AI RMF 1.0 is voluntary and does not create legal compliance by itself.",
      "NIST states that AI RMF 1.0 is being revised; the catalog must preserve version identity rather than silently replacing it.",
    ],
    createdAt: "2026-07-25",
    updatedAt: "2026-07-25",
    reviewedAt: "2026-07-25",
  },

  {
    id: "iso-iec-42001-2023",
    slug: "iso-iec-42001-2023",
    acronym: "ISO/IEC 42001",
    aliases: ["ISO 42001", "AIMS"],
    fullName:
      "ISO/IEC 42001:2023 Information technology — Artificial intelligence — Management system",
    plainLanguagePurpose:
      "Specifies requirements for establishing, implementing, maintaining, and continually improving an artificial intelligence management system.",
    description:
      "An international management-system standard for organizations that provide or use AI products or services. It organizes AI governance through policy, objectives, roles, risk processes, operational controls, performance evaluation, and continual improvement.",
    scopeSummary:
      "Applies to organizations of different sizes and sectors that develop, provide, or use AI systems and choose to establish an AI management system.",
    categories: ["standard", "management-system"],
    authorityLevel: "certifiable-standard",
    status: "published",
    geographies: ["international", "global"],
    sectors: ["cross-sector"],
    source: {
      issuingAuthority:
        "International Organization for Standardization and International Electrotechnical Commission",
      authorityType: "standards-body",
      officialTitle:
        "ISO/IEC 42001:2023 Information technology — Artificial intelligence — Management system",
      officialUrl: "https://www.iso.org/standard/42001",
      publicationDate: "2023-12-18",
      version: "First edition, 2023",
      jurisdiction: "International",
      sourceStatus: "published",
      lastVerifiedAt: "2026-07-25",
    },
    actorRoles: [
      "provider",
      "deployer",
      "developer",
      "operator",
      "owner",
      "reviewer",
      "auditor",
      "assessor",
      "executive-leadership",
      "board",
      "risk-owner",
      "system-owner",
      "data-owner",
      "model-owner",
    ],
    lifecycleStages: [
      "concept",
      "design",
      "data",
      "development",
      "training",
      "evaluation",
      "validation",
      "procurement",
      "deployment",
      "operation",
      "monitoring",
      "change-management",
      "incident-response",
      "retirement",
      "post-execution-review",
    ],
    evidenceTypes: [
      "policy",
      "procedure",
      "risk-assessment",
      "impact-assessment",
      "data-record",
      "model-record",
      "technical-documentation",
      "test-result",
      "evaluation-result",
      "validation-result",
      "audit-record",
      "approval-record",
      "authority-record",
      "training-record",
      "incident-record",
      "monitoring-record",
      "change-record",
      "supplier-record",
      "contract",
      "human-oversight-record",
      "security-record",
      "privacy-record",
      "outcome-record",
    ],
    requirements: [
      {
        id: "iso42001-context",
        label: "Organizational context",
        summary:
          "Determine the organization, interested parties, scope, dependencies, and issues relevant to the AI management system.",
        evidenceTypes: ["policy", "risk-assessment", "supplier-record"],
        lifecycleStages: ["concept", "design", "procurement"],
        ta14ChainLinks: ["reality", "record"],
      },
      {
        id: "iso42001-leadership",
        label: "Leadership and accountability",
        summary:
          "Establish policy, commitment, responsibilities, accountability, and organizational support for the AI management system.",
        evidenceTypes: [
          "policy",
          "authority-record",
          "approval-record",
          "training-record",
        ],
        lifecycleStages: ["concept", "design", "deployment", "operation"],
        ta14ChainLinks: ["record", "continuity", "binding", "commit"],
      },
      {
        id: "iso42001-operation",
        label: "Operational planning and control",
        summary:
          "Plan, implement, control, and preserve the processes needed to address AI risks, impacts, objectives, and system requirements.",
        evidenceTypes: [
          "procedure",
          "risk-assessment",
          "impact-assessment",
          "test-result",
          "change-record",
        ],
        lifecycleStages: [
          "development",
          "evaluation",
          "validation",
          "deployment",
          "operation",
          "change-management",
        ],
        ta14ChainLinks: [
          "continuity",
          "admissibility",
          "binding",
          "execution",
        ],
      },
      {
        id: "iso42001-performance",
        label: "Performance evaluation and improvement",
        summary:
          "Monitor, measure, audit, review, correct, and continually improve the AI management system.",
        evidenceTypes: [
          "monitoring-record",
          "audit-record",
          "incident-record",
          "change-record",
          "outcome-record",
        ],
        lifecycleStages: [
          "operation",
          "monitoring",
          "incident-response",
          "post-execution-review",
        ],
        ta14ChainLinks: ["continuity", "outcome"],
      },
    ],
    crosswalks: [
      {
        targetRecordId: "nist-ai-rmf-1-0",
        relationship: "overlaps",
        explanation:
          "Both provide structured organization-level governance of AI risk, roles, controls, measurement, monitoring, and improvement.",
        confidence: "strong",
      },
      {
        targetRecordId: "eu-ai-act-2024-1689",
        relationship: "supports",
        explanation:
          "The management-system structure may support governance evidence and organizational controls relevant to legal duties, but certification does not establish legal compliance.",
        confidence: "strong",
      },
    ],
    ta14RouteActions: [
      {
        chainLink: "record",
        action:
          "Bind each AI management-system process, responsibility, objective, and control to attributable records.",
        purpose:
          "Prevent the management system from existing only as undocumented practice or generalized policy.",
        requiredEvidence: ["policy", "procedure", "authority-record"],
        failureDecision: "HOLD",
      },
      {
        chainLink: "admissibility",
        action:
          "Evaluate whether the management-system evidence applicable to the proposed action is current, complete, authorized, and sufficient.",
        purpose:
          "Translate organization-level management controls into decision-time execution conditions.",
        requiredEvidence: [
          "risk-assessment",
          "impact-assessment",
          "approval-record",
          "audit-record",
        ],
        failureDecision: "ESCALATE",
      },
      {
        chainLink: "outcome",
        action:
          "Preserve performance, audit, corrective-action, monitoring, and continual-improvement evidence.",
        purpose:
          "Demonstrate whether the management system controlled actual AI operation and outcomes.",
        requiredEvidence: [
          "monitoring-record",
          "audit-record",
          "change-record",
          "outcome-record",
        ],
        failureDecision: "HOLD",
      },
    ],
    keywords: [
      "ISO",
      "IEC",
      "artificial intelligence management system",
      "AIMS",
      "management system",
      "certification",
      "continual improvement",
      "AI policy",
      "AI objectives",
      "internal audit",
    ],
    tags: ["international", "certifiable", "management system", "governance"],
    limitations: [
      "The full standard is licensed material and is not reproduced in this library.",
      "Certification or conformity with ISO/IEC 42001 does not automatically establish compliance with a law, regulation, contract, or sector obligation.",
    ],
    createdAt: "2026-07-25",
    updatedAt: "2026-07-25",
    reviewedAt: "2026-07-25",
  },

  {
    id: "unesco-ai-ethics-recommendation-2021",
    slug: "unesco-ai-ethics-recommendation",
    acronym: "UNESCO AI Ethics Recommendation",
    aliases: [
      "UNESCO Recommendation",
      "Recommendation on the Ethics of Artificial Intelligence",
    ],
    fullName: "UNESCO Recommendation on the Ethics of Artificial Intelligence",
    plainLanguagePurpose:
      "Provides a global, human-rights-centered ethical framework and policy-action structure for the responsible development and use of AI.",
    description:
      "A UNESCO standard-setting recommendation adopted by Member States that establishes values, principles, and policy-action areas addressing human rights, dignity, fairness, transparency, oversight, inclusion, environmental protection, governance, and international cooperation.",
    scopeSummary:
      "Directed primarily to UNESCO Member States while also providing ethical guidance to public, private, academic, civil-society, and other AI actors throughout the AI lifecycle.",
    categories: ["principles", "guidance", "framework"],
    authorityLevel: "official-guidance",
    status: "adopted",
    geographies: ["global", "international"],
    sectors: ["cross-sector", "public policy"],
    source: {
      issuingAuthority:
        "United Nations Educational, Scientific and Cultural Organization",
      authorityType: "intergovernmental-body",
      officialTitle:
        "Recommendation on the Ethics of Artificial Intelligence",
      officialUrl:
        "https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence",
      publicationDate: "2021-11-23",
      version: "Adopted at the 41st session of the General Conference",
      jurisdiction: "International",
      sourceStatus: "adopted",
      lastVerifiedAt: "2026-07-25",
    },
    actorRoles: [
      "public-authority",
      "regulator",
      "provider",
      "deployer",
      "developer",
      "operator",
      "owner",
      "executive-leadership",
      "board",
      "affected-person",
    ],
    lifecycleStages: [
      "concept",
      "design",
      "data",
      "development",
      "training",
      "evaluation",
      "validation",
      "procurement",
      "deployment",
      "operation",
      "monitoring",
      "change-management",
      "incident-response",
      "retirement",
      "post-execution-review",
    ],
    evidenceTypes: [
      "policy",
      "procedure",
      "risk-assessment",
      "impact-assessment",
      "data-record",
      "technical-documentation",
      "evaluation-result",
      "approval-record",
      "authority-record",
      "training-record",
      "incident-record",
      "monitoring-record",
      "public-notice",
      "human-oversight-record",
      "privacy-record",
      "outcome-record",
    ],
    requirements: [
      {
        id: "unesco-human-rights-dignity",
        label: "Human rights and human dignity",
        summary:
          "Govern AI in a manner that respects, protects, and promotes human rights, fundamental freedoms, and human dignity.",
        evidenceTypes: [
          "impact-assessment",
          "risk-assessment",
          "policy",
          "public-notice",
        ],
        lifecycleStages: [
          "concept",
          "design",
          "development",
          "deployment",
          "operation",
        ],
        ta14ChainLinks: ["reality", "admissibility", "binding", "outcome"],
      },
      {
        id: "unesco-transparency-oversight",
        label: "Transparency, explainability, and human oversight",
        summary:
          "Provide context-appropriate transparency and preserve meaningful human authority and oversight.",
        evidenceTypes: [
          "technical-documentation",
          "public-notice",
          "human-oversight-record",
          "authority-record",
        ],
        lifecycleStages: ["design", "deployment", "operation"],
        ta14ChainLinks: [
          "record",
          "admissibility",
          "binding",
          "execution",
        ],
      },
      {
        id: "unesco-environment-social-impact",
        label: "Societal and environmental well-being",
        summary:
          "Evaluate and govern AI impacts on people, communities, society, ecosystems, and environmental sustainability.",
        evidenceTypes: [
          "impact-assessment",
          "risk-assessment",
          "monitoring-record",
          "outcome-record",
        ],
        lifecycleStages: [
          "concept",
          "design",
          "deployment",
          "operation",
          "post-execution-review",
        ],
        ta14ChainLinks: ["reality", "record", "admissibility", "outcome"],
      },
    ],
    crosswalks: [
      {
        targetRecordId: "nist-ai-rmf-1-0",
        relationship: "informs",
        explanation:
          "UNESCO's ethical values and policy areas can inform risk identification, impact analysis, governance objectives, and outcome review under the NIST AI RMF.",
        confidence: "strong",
      },
      {
        targetRecordId: "iso-iec-42001-2023",
        relationship: "informs",
        explanation:
          "The Recommendation's ethical values and policy-action areas may inform organizational objectives, impact assessment, policies, and controls within an AI management system.",
        confidence: "strong",
      },
    ],
    ta14RouteActions: [
      {
        chainLink: "reality",
        action:
          "Identify affected people, communities, rights, environmental conditions, cultural context, and power relationships.",
        purpose:
          "Ensure ethical review begins with actual effects and affected parties rather than abstract principles alone.",
        requiredEvidence: ["impact-assessment", "risk-assessment"],
        failureDecision: "HOLD",
      },
      {
        chainLink: "admissibility",
        action:
          "Evaluate whether the proposed AI action is supported by evidence showing respect for rights, dignity, fairness, oversight, and societal and environmental well-being.",
        purpose:
          "Convert ethical commitments into a pre-execution governance determination.",
        requiredEvidence: [
          "impact-assessment",
          "human-oversight-record",
          "authority-record",
          "public-notice",
        ],
        failureDecision: "ESCALATE",
      },
      {
        chainLink: "outcome",
        action:
          "Preserve evidence of actual human, societal, cultural, and environmental outcomes and compare them with the original ethical assessment.",
        purpose:
          "Determine whether the governed action produced effects consistent with the stated ethical basis.",
        requiredEvidence: [
          "monitoring-record",
          "incident-record",
          "outcome-record",
        ],
        failureDecision: "HOLD",
      },
    ],
    keywords: [
      "UNESCO",
      "AI ethics",
      "human rights",
      "human dignity",
      "fairness",
      "transparency",
      "human oversight",
      "environment",
      "inclusion",
      "policy action",
    ],
    tags: ["global", "ethics", "human rights", "voluntary"],
    limitations: [
      "The Recommendation is a normative instrument and does not by itself create a private certification or prove compliance with national law.",
      "Implementation depends on Member State measures, organizational action, and context-specific evidence.",
    ],
    createdAt: "2026-07-25",
    updatedAt: "2026-07-25",
    reviewedAt: "2026-07-25",
  },
];

export const governanceLibraryRecordById = new Map(
  governanceLibraryCatalog.map((record) => [record.id, record]),
);

export const governanceLibraryRecordBySlug = new Map(
  governanceLibraryCatalog.map((record) => [record.slug, record]),
);

export function getGovernanceLibraryRecord(
  idOrSlug: string,
): GovernanceLibraryRecord | undefined {
  const normalized = idOrSlug.trim().toLowerCase();

  return (
    governanceLibraryRecordById.get(normalized) ??
    governanceLibraryRecordBySlug.get(normalized) ??
    governanceLibraryCatalog.find((record) => {
      const acronymMatch = record.acronym.toLowerCase() === normalized;
      const fullNameMatch = record.fullName.toLowerCase() === normalized;
      const aliasMatch = record.aliases?.some(
        (alias) => alias.toLowerCase() === normalized,
      );

      return acronymMatch || fullNameMatch || aliasMatch;
    })
  );
}
