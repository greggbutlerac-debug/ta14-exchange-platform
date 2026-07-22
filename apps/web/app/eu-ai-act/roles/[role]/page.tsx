"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

type RolePathway = {
  slug: string;
  code: string;
  title: string;
  legalDefinition: string;
  plainLanguage: string;
  likelyApplies: string[];
  mayNotApply: string[];
  classificationQuestions: string[];
  responsibilities: {
    title: string;
    articles: string;
    description: string;
  }[];
  evidence: string[];
  records: {
    title: string;
    description: string;
  }[];
  requirementLinks: {
    title: string;
    href: string;
    description: string;
  }[];
  boundary: string;
};

const rolePathways: Record<string, RolePathway> = {
  provider: {
    slug: "provider",
    code: "PR",
    title: "Provider",
    legalDefinition:
      "A natural or legal person, public authority, agency, or other body that develops an AI system or general-purpose AI model—or has one developed—and places it on the market or puts the system into service under its own name or trademark.",
    plainLanguage:
      "You are likely acting as the provider when your organisation is the accountable source of the AI system or model presented to the market, supplied to another party, or first put into service under your identity.",
    likelyApplies: [
      "Your name or trademark appears on the AI system or model.",
      "You developed the system internally and put it into service for your own organisation.",
      "You commissioned another party to build the system but place it on the market under your identity.",
      "You substantially modify a high-risk AI system in a way that may transfer provider responsibilities.",
      "You change the intended purpose of an existing system so that it becomes high-risk.",
    ],
    mayNotApply: [
      "You only use a third-party system under the original provider’s instructions.",
      "You distribute the system without rebranding, substantial modification, or changing its intended purpose.",
      "Your activity is purely personal and non-professional.",
      "You provide components without placing the complete AI system or model on the market under your identity.",
    ],
    classificationQuestions: [
      "Whose name or trademark appears on the system, model, documentation, interface, and commercial materials?",
      "Who defined the intended purpose and operating conditions?",
      "Was the system developed internally, commissioned, acquired, adapted, or substantially modified?",
      "Who controls release, versioning, technical documentation, and corrective action?",
      "Is the system prohibited, high-risk, transparency-scoped, general-purpose, or outside those categories?",
      "Is the system being placed on the Union market, put into service, or producing effects within the Union?",
    ],
    responsibilities: [
      {
        title: "Determine classification and applicability",
        articles: "Articles 5–7; Annexes I and III",
        description:
          "Determine whether the system is prohibited, high-risk, transparency-scoped, subject to product-safety integration, or outside a claimed category, and preserve the basis for that determination.",
      },
      {
        title: "High-risk provider controls",
        articles: "Articles 9–17",
        description:
          "Where applicable, establish risk management, data governance, technical documentation, logging, transparency, human oversight, accuracy, robustness, cybersecurity, and quality-management controls.",
      },
      {
        title: "Conformity and market obligations",
        articles: "Articles 16, 43, 47–49",
        description:
          "Complete the applicable conformity route, declaration, registration, corrective-action, and cooperation duties before and after placing a high-risk system on the market or putting it into service.",
      },
      {
        title: "Transparency obligations",
        articles: "Article 50",
        description:
          "Where applicable, design direct-interaction disclosure and machine-readable marking or detectability measures for generated or manipulated content.",
      },
      {
        title: "Post-market monitoring and incidents",
        articles: "Articles 72–73",
        description:
          "Maintain continuing monitoring, collect performance information, preserve material changes, and report serious incidents where required.",
      },
    ],
    evidence: [
      "System identity, version, owner, and intended-purpose declaration",
      "Role and operator classification record",
      "Risk-classification and applicability analysis",
      "Risk-management file and mitigation history",
      "Data provenance and governance records",
      "Technical documentation and architecture records",
      "Validation, testing, accuracy, robustness, and cybersecurity evidence",
      "Human-oversight design and authority assignments",
      "Instructions for use and transparency implementation evidence",
      "Conformity assessment, declaration, registration, and corrective-action records",
      "Post-market monitoring plan, logs, incidents, and outcome records",
    ],
    records: [
      {
        title: "Provider Applicability Record",
        description:
          "Preserves why the organisation is treated as provider, which system or model is covered, and which provider obligations are included, excluded, conditional, or unresolved.",
      },
      {
        title: "Technical Documentation Record",
        description:
          "Binds intended purpose, architecture, versions, datasets, tests, limitations, operating conditions, and change history.",
      },
      {
        title: "Risk and Control Record",
        description:
          "Preserves identified risks, controls, residual risks, review findings, corrective actions, and lifecycle updates.",
      },
      {
        title: "Transparency Implementation Record",
        description:
          "Preserves disclosure, marking, detectability, notices, exceptions, technical limitations, and deployment state.",
      },
    ],
    requirementLinks: [
      {
        title: "Risk Classification",
        href: "/eu-ai-act/requirements/risk-classification",
        description: "Determine the claimed regulatory category and unresolved classification questions.",
      },
      {
        title: "High-Risk AI Systems",
        href: "/eu-ai-act/requirements/high-risk",
        description: "Map lifecycle duties for systems classified as high-risk.",
      },
      {
        title: "Article 50 Transparency",
        href: "/eu-ai-act/requirements/article-50",
        description: "Map provider disclosure, marking, and detectability obligations.",
      },
      {
        title: "Technical Documentation",
        href: "/eu-ai-act/requirements/technical-documentation",
        description: "Build the evidence package supporting system identity, design, testing, and limits.",
      },
    ],
    boundary:
      "Provider status can arise from branding, commissioning, own-use deployment, substantial modification, or changes to intended purpose. Contract labels alone do not settle the legal role.",
  },

  deployer: {
    slug: "deployer",
    code: "DE",
    title: "Deployer",
    legalDefinition:
      "A natural or legal person, public authority, agency, or other body using an AI system under its authority, except where the system is used in the course of a personal non-professional activity.",
    plainLanguage:
      "You are likely acting as a deployer when your organisation selects, configures, operates, or relies on an AI system in a professional or organisational context.",
    likelyApplies: [
      "Your organisation uses an AI system in operations, employment, services, decisions, communications, or public functions.",
      "You determine the local operating context, users, affected persons, and deployment conditions.",
      "You assign people to oversee or act on the system’s output.",
      "You publish or use AI-generated content in a professional capacity.",
      "You control whether and how the system is used in a consequential route.",
    ],
    mayNotApply: [
      "The activity is purely personal and non-professional.",
      "You only manufacture or distribute the system without using it under your authority.",
      "You are merely an affected person or end recipient without operational control.",
      "You provide infrastructure but do not determine the AI system’s use.",
    ],
    classificationQuestions: [
      "Which organisation controls the deployment, operating context, users, and affected-person pathway?",
      "Is the system used for a high-risk use case or a transparency-scoped activity?",
      "Are outputs used to support or make consequential decisions?",
      "Who is assigned to human oversight, intervention, suspension, and escalation?",
      "Are input data relevant and sufficiently representative for the local purpose?",
      "Are logs available, retained, protected, and connected to decisions and outcomes?",
      "Does the deployment require a fundamental-rights impact assessment or data-protection impact assessment?",
    ],
    responsibilities: [
      {
        title: "Use according to instructions",
        articles: "Article 26",
        description:
          "Use high-risk systems according to the provider’s instructions, assign competent human oversight, monitor operation, and preserve relevant logs under the deployer’s control.",
      },
      {
        title: "Local operating context",
        articles: "Article 26",
        description:
          "Ensure input data is relevant and sufficiently representative in light of the intended purpose and the deployment context, and address risks arising from actual use.",
      },
      {
        title: "Fundamental-rights impact assessment",
        articles: "Article 27",
        description:
          "Where the obligation applies, complete and preserve an assessment before deploying the high-risk system.",
      },
      {
        title: "Affected-person information",
        articles: "Articles 26 and 50",
        description:
          "Where applicable, inform workers, affected persons, or the public about the system’s use, emotion-recognition or biometric categorisation, deepfakes, and certain public-interest text.",
      },
      {
        title: "Monitoring, suspension, and incident response",
        articles: "Articles 26 and 73",
        description:
          "Monitor operation, suspend use where risk is indicated, notify relevant parties, and preserve incident chronology and corrective action.",
      },
    ],
    evidence: [
      "Deployment identity, location, use case, owner, and operating-context record",
      "Provider instructions and deployer acceptance record",
      "Human-oversight assignments, competence, and intervention authority",
      "Input-data relevance and local suitability analysis",
      "Logs, decisions, interventions, overrides, and outcome history",
      "Worker, affected-person, or public notices",
      "Fundamental-rights and data-protection impact records where applicable",
      "Monitoring findings, complaints, incidents, suspension, and corrective action",
      "Deepfake, public-interest text, biometric, or emotion-recognition disclosure evidence",
    ],
    records: [
      {
        title: "Deployment Context Record",
        description:
          "Preserves the actual use case, environment, affected persons, local controls, provider instructions, and declared limits.",
      },
      {
        title: "Human Oversight Record",
        description:
          "Preserves assigned people, competence, authority, interventions, overrides, escalations, and unresolved conditions.",
      },
      {
        title: "Fundamental Rights Impact Record",
        description:
          "Preserves affected-person context, risks, safeguards, consultation, determinations, and retained limitations.",
      },
      {
        title: "Deployer Transparency Record",
        description:
          "Preserves notices, disclosures, publication context, editorial control, exceptions, and evidence of implementation.",
      },
    ],
    requirementLinks: [
      {
        title: "High-Risk AI Systems",
        href: "/eu-ai-act/requirements/high-risk",
        description: "Map deployer duties for high-risk systems.",
      },
      {
        title: "Fundamental Rights Impact Assessment",
        href: "/eu-ai-act/requirements/fria",
        description: "Determine whether an Article 27 assessment is required and preserve the route.",
      },
      {
        title: "Article 50 Transparency",
        href: "/eu-ai-act/requirements/article-50",
        description: "Map deployer disclosure obligations for applicable systems and content.",
      },
      {
        title: "Human Oversight",
        href: "/eu-ai-act/requirements/human-oversight",
        description: "Define accountable oversight, intervention, and escalation authority.",
      },
    ],
    boundary:
      "A deployer may become a provider if it rebrands a high-risk system, substantially modifies it, or changes its intended purpose so that provider responsibilities are triggered.",
  },

  importer: {
    slug: "importer",
    code: "IM",
    title: "Importer",
    legalDefinition:
      "A natural or legal person located or established in the Union that places on the market an AI system bearing the name or trademark of a person established in a third country.",
    plainLanguage:
      "You are likely acting as an importer when you are the Union-established operator introducing a third-country provider’s AI system onto the Union market.",
    likelyApplies: [
      "You are established in the Union.",
      "The AI system bears the name or trademark of a provider outside the Union.",
      "You are responsible for first placing that system on the Union market.",
      "You act as the commercial or regulatory entry point for the imported system.",
    ],
    mayNotApply: [
      "The provider is already established in the Union and places the system on the market directly.",
      "You only distribute a system already placed on the Union market by another operator.",
      "You are the authorised representative but do not place the system on the market.",
      "You use the system internally without acting as the Union-market importer.",
    ],
    classificationQuestions: [
      "Who is the third-country provider and where is it established?",
      "Who first places the system on the Union market?",
      "Whose name or trademark appears on the system?",
      "Is the system high-risk, transparency-scoped, or subject to another operator obligation?",
      "Has the provider completed the required conformity assessment, technical documentation, declaration, marking, and registration?",
      "Is an authorised representative required and properly appointed?",
      "Are importer identity and contact details displayed as required?",
    ],
    responsibilities: [
      {
        title: "Pre-market verification",
        articles: "Article 23",
        description:
          "Before placing a high-risk AI system on the market, verify that the provider completed the required conformity assessment, technical documentation, declaration, marking, and authorised-representative arrangements.",
      },
      {
        title: "Do not place non-conforming systems",
        articles: "Article 23",
        description:
          "Do not place the system on the market where there is reason to consider it non-conforming, falsified, or accompanied by incomplete documentation.",
      },
      {
        title: "Identity, storage, and transport",
        articles: "Article 23",
        description:
          "Preserve importer identification and ensure storage or transport conditions do not jeopardise conformity while the system remains under importer responsibility.",
      },
      {
        title: "Corrective action and cooperation",
        articles: "Article 23",
        description:
          "Take corrective action, withdraw or recall where appropriate, notify relevant operators and authorities, and cooperate with competent authorities.",
      },
    ],
    evidence: [
      "Third-country provider identity and establishment evidence",
      "Importer identity and Union establishment record",
      "Product and system identity, version, and intended purpose",
      "Conformity-assessment verification record",
      "Technical documentation availability check",
      "EU declaration of conformity and required marking evidence",
      "Authorised-representative mandate verification",
      "Registration verification where applicable",
      "Storage, transport, complaint, corrective-action, withdrawal, and recall records",
      "Communications with provider, representative, distributors, and authorities",
    ],
    records: [
      {
        title: "Importer Verification Record",
        description:
          "Preserves each pre-market verification step, evidence reviewed, gaps found, and the decision to place, hold, or refuse the system.",
      },
      {
        title: "Operator Identity Record",
        description:
          "Binds provider, importer, authorised representative, system, version, trademark, and contact information.",
      },
      {
        title: "Corrective Action Record",
        description:
          "Preserves complaints, risk signals, notifications, withdrawal, recall, remediation, and resulting status.",
      },
    ],
    requirementLinks: [
      {
        title: "Risk Classification",
        href: "/eu-ai-act/requirements/risk-classification",
        description: "Determine whether the imported system is within a high-risk or transparency pathway.",
      },
      {
        title: "Conformity Assessment",
        href: "/eu-ai-act/requirements/conformity-assessment",
        description: "Verify the claimed assessment route and supporting package.",
      },
      {
        title: "Technical Documentation",
        href: "/eu-ai-act/requirements/technical-documentation",
        description: "Inspect the evidence package the provider must make available.",
      },
      {
        title: "Incident Reporting",
        href: "/eu-ai-act/requirements/incident-reporting",
        description: "Preserve risk signals, notifications, and corrective actions.",
      },
    ],
    boundary:
      "Importer duties do not replace provider duties. The importer must verify the required provider-side package and must not place a system on the market merely because commercial documentation exists.",
  },

  distributor: {
    slug: "distributor",
    code: "DI",
    title: "Distributor",
    legalDefinition:
      "A natural or legal person in the supply chain, other than the provider or importer, that makes an AI system available on the Union market.",
    plainLanguage:
      "You are likely acting as a distributor when you supply or make available an AI system that another operator has already placed on the Union market.",
    likelyApplies: [
      "You are part of the Union supply chain.",
      "You make an AI system available to customers or downstream operators.",
      "You are not the original provider or importer.",
      "You control storage, handling, supply, or commercial availability before delivery.",
    ],
    mayNotApply: [
      "You are the provider placing the system on the market under your own identity.",
      "You are the Union-established importer first placing a third-country system on the market.",
      "You only deploy the system internally and do not make it available on the market.",
      "You provide general infrastructure without supplying the AI system.",
    ],
    classificationQuestions: [
      "Who is the provider and, where relevant, the importer?",
      "Has the system already been lawfully placed on the Union market?",
      "Is required marking, documentation, and operator identification present?",
      "Do you have reason to believe the system is non-conforming or presents a risk?",
      "Could storage, transport, updates, or configuration under your control affect conformity?",
      "Have you rebranded, substantially modified, or changed the intended purpose of the system?",
    ],
    responsibilities: [
      {
        title: "Pre-supply verification",
        articles: "Article 24",
        description:
          "Before making a high-risk AI system available, verify required marking, documentation, provider and importer obligations, and apparent conformity.",
      },
      {
        title: "Hold non-conforming systems",
        articles: "Article 24",
        description:
          "Do not make the system available where there is reason to consider it non-conforming until conformity is restored.",
      },
      {
        title: "Storage and transport integrity",
        articles: "Article 24",
        description:
          "Ensure conditions under distributor responsibility do not jeopardise conformity.",
      },
      {
        title: "Corrective action and cooperation",
        articles: "Article 24",
        description:
          "Notify relevant operators, support corrective action, withdraw or recall where appropriate, and cooperate with competent authorities.",
      },
    ],
    evidence: [
      "Provider and importer identity records",
      "System identity, version, marking, and documentation check",
      "Pre-supply conformity verification",
      "Storage, transport, handling, and update records",
      "Complaints, risk signals, and non-conformity notices",
      "Withdrawal, recall, corrective action, and authority cooperation records",
      "Rebranding, modification, and intended-purpose change analysis",
    ],
    records: [
      {
        title: "Distributor Verification Record",
        description:
          "Preserves the checks completed before making the system available and any unresolved conformity concerns.",
      },
      {
        title: "Supply Chain Continuity Record",
        description:
          "Binds provider, importer, distributor, system version, custody, storage, transport, delivery, and change history.",
      },
      {
        title: "Non-Conformity and Corrective Action Record",
        description:
          "Preserves the reason for HOLD, notifications, remediation, withdrawal, recall, and final status.",
      },
    ],
    requirementLinks: [
      {
        title: "Conformity Assessment",
        href: "/eu-ai-act/requirements/conformity-assessment",
        description: "Inspect the assessment and documentation signals the distributor must verify.",
      },
      {
        title: "Technical Documentation",
        href: "/eu-ai-act/requirements/technical-documentation",
        description: "Understand which evidence should accompany the system.",
      },
      {
        title: "Incident Reporting",
        href: "/eu-ai-act/requirements/incident-reporting",
        description: "Preserve risk communication, corrective action, withdrawal, and recall.",
      },
      {
        title: "Recordkeeping and Logs",
        href: "/eu-ai-act/requirements/recordkeeping",
        description: "Preserve supply-chain identity, chronology, and operator actions.",
      },
    ],
    boundary:
      "A distributor can become a provider for a high-risk system if it applies its own name or trademark, makes a substantial modification, or changes the intended purpose in a way covered by Article 25.",
  },

  "product-manufacturer": {
    slug: "product-manufacturer",
    code: "PM",
    title: "Product Manufacturer",
    legalDefinition:
      "A manufacturer placing an AI system on the market or putting it into service together with its product and under its own name or trademark, where the AI system is a safety component of the product or the product itself falls within relevant Union harmonisation legislation.",
    plainLanguage:
      "You are likely in this pathway when an AI system is built into, controls, or materially supports a regulated product placed on the market under your identity.",
    likelyApplies: [
      "The AI system is a safety component of a regulated product.",
      "The product is placed on the market or put into service under your name or trademark.",
      "The AI system and product are assessed and supplied together.",
      "Failure or malfunction of the AI system could endanger health, safety, or protected interests.",
    ],
    mayNotApply: [
      "The AI system is unrelated to the regulated product’s safety or conformity route.",
      "You only use an independent AI tool internally.",
      "Another operator places the complete system and product on the market under its identity.",
      "The product is outside the relevant harmonisation legislation and the AI system is not otherwise high-risk.",
    ],
    classificationQuestions: [
      "Is the AI system a safety component of the product or itself the regulated product?",
      "Which Union harmonisation legislation governs the product?",
      "Whose name or trademark appears on the product and AI system?",
      "Is third-party conformity assessment required for the product?",
      "How is the AI system integrated into product risk management, testing, documentation, and post-market monitoring?",
      "Who controls software, model, firmware, and safety-related updates?",
    ],
    responsibilities: [
      {
        title: "Integrated high-risk provider responsibility",
        articles: "Articles 6 and 25; Annex I",
        description:
          "Where the conditions apply, the product manufacturer is treated as provider of the high-risk AI system and must satisfy the associated provider obligations.",
      },
      {
        title: "Integrated conformity assessment",
        articles: "Article 43",
        description:
          "Integrate AI Act requirements into the product’s applicable conformity-assessment procedure rather than treating the AI layer as detached.",
      },
      {
        title: "Product and AI technical documentation",
        articles: "Articles 11 and 43",
        description:
          "Bind product identity, AI architecture, safety function, intended purpose, tests, limitations, versions, and changes.",
      },
      {
        title: "Post-market and incident continuity",
        articles: "Articles 72–73",
        description:
          "Connect product monitoring, AI performance, safety incidents, updates, corrective action, and outcome evidence.",
      },
    ],
    evidence: [
      "Product identity, applicable legislation, and manufacturer role record",
      "AI safety-component and high-risk classification analysis",
      "Integrated risk-management and hazard analysis",
      "Product and AI technical documentation",
      "Validation, verification, safety, robustness, and cybersecurity testing",
      "Conformity assessment, declaration, registration, and marking evidence",
      "Software, model, firmware, and configuration change records",
      "Post-market surveillance, incidents, corrective actions, and outcomes",
    ],
    records: [
      {
        title: "Product–AI Applicability Record",
        description:
          "Preserves why the AI system is or is not a safety component and how Article 6 and Annex I are applied.",
      },
      {
        title: "Integrated Conformity Record",
        description:
          "Binds the product assessment route to the AI system’s requirements, evidence, reviewers, findings, and final standing.",
      },
      {
        title: "Safety Change Record",
        description:
          "Preserves model, software, firmware, configuration, intended-purpose, and safety-impact changes without erasing prior states.",
      },
    ],
    requirementLinks: [
      {
        title: "High-Risk AI Systems",
        href: "/eu-ai-act/requirements/high-risk",
        description: "Map lifecycle duties for the integrated high-risk AI system.",
      },
      {
        title: "Conformity Assessment",
        href: "/eu-ai-act/requirements/conformity-assessment",
        description: "Preserve the integrated product and AI assessment route.",
      },
      {
        title: "Technical Documentation",
        href: "/eu-ai-act/requirements/technical-documentation",
        description: "Bind product, AI, safety, test, version, and limitation evidence.",
      },
      {
        title: "Post-Market Monitoring",
        href: "/eu-ai-act/requirements/post-market-monitoring",
        description: "Connect product performance, AI behavior, changes, and outcomes.",
      },
    ],
    boundary:
      "Product-manufacturer responsibility depends on the product legislation, the AI system’s function, branding, intended purpose, and conformity route. The product and AI layers should not be assessed as unrelated systems where their safety functions are connected.",
  },

  "authorised-representative": {
    slug: "authorised-representative",
    code: "AR",
    title: "Authorised Representative",
    legalDefinition:
      "A natural or legal person located or established in the Union that has received and accepted a written mandate from a provider of an AI system or general-purpose AI model to perform specified obligations and procedures on the provider’s behalf.",
    plainLanguage:
      "You are likely acting as an authorised representative when a non-Union provider has formally appointed your Union-established organisation through a written mandate.",
    likelyApplies: [
      "You are located or established in the Union.",
      "A provider has issued and you have accepted a written mandate.",
      "The mandate identifies the system or model and tasks you perform.",
      "You hold documentation or act as a contact point for authorities on the provider’s behalf.",
    ],
    mayNotApply: [
      "You provide informal consulting without a written mandate.",
      "You distribute or import the system but are not appointed as representative.",
      "You act only as legal counsel without accepting the statutory representative role.",
      "The provider is established in the Union and no representative appointment is required for the relevant pathway.",
    ],
    classificationQuestions: [
      "Who is the provider and where is it established?",
      "Does the written mandate identify the covered system or GPAI model and the exact tasks?",
      "Does the mandate provide the authority and access needed to perform those tasks?",
      "Which documentation must be retained and supplied to authorities?",
      "Are there unresolved provider non-conformities or failures to cooperate?",
      "Does the role concern a high-risk AI system, a GPAI model, or both?",
    ],
    responsibilities: [
      {
        title: "Maintain the written mandate",
        articles: "Articles 22 and 54",
        description:
          "Retain and provide the mandate, ensure its scope is clear, and act only within the tasks and authority it confers.",
      },
      {
        title: "Verify required provider documentation",
        articles: "Article 22",
        description:
          "For high-risk systems, verify that the declaration, technical documentation, and applicable conformity procedure have been completed as specified.",
      },
      {
        title: "Documentation and authority cooperation",
        articles: "Articles 22 and 54",
        description:
          "Keep required documents available, provide information to competent authorities, and cooperate with authority actions.",
      },
      {
        title: "Provider non-compliance escalation",
        articles: "Articles 22 and 54",
        description:
          "Where the provider acts contrary to its obligations, preserve the issue, require correction, and terminate or escalate the mandate where legally required.",
      },
    ],
    evidence: [
      "Signed and accepted written mandate",
      "Provider identity, establishment, and contact details",
      "Covered AI systems or GPAI models and versions",
      "Mandated tasks, authority, duration, and termination conditions",
      "Technical documentation and declaration availability checks",
      "Conformity-assessment and registration verification where applicable",
      "Authority requests, responses, cooperation, and chronology",
      "Provider non-conformity, correction, escalation, and mandate-status records",
    ],
    records: [
      {
        title: "Representative Mandate Record",
        description:
          "Preserves the provider, representative, covered systems or models, assigned tasks, authority, dates, and termination conditions.",
      },
      {
        title: "Documentation Availability Record",
        description:
          "Preserves which required documents are held, verified, missing, stale, or requested.",
      },
      {
        title: "Authority Cooperation Record",
        description:
          "Preserves information requests, responses, evidence supplied, objections, corrective actions, and unresolved matters.",
      },
    ],
    requirementLinks: [
      {
        title: "Conformity Assessment",
        href: "/eu-ai-act/requirements/conformity-assessment",
        description: "Verify the provider’s claimed assessment route and resulting evidence.",
      },
      {
        title: "Technical Documentation",
        href: "/eu-ai-act/requirements/technical-documentation",
        description: "Preserve document availability, versions, gaps, and authority access.",
      },
      {
        title: "General-Purpose AI",
        href: "/eu-ai-act/requirements/gpai",
        description: "Map representative duties for non-Union GPAI providers where applicable.",
      },
      {
        title: "Incident Reporting",
        href: "/eu-ai-act/requirements/incident-reporting",
        description: "Preserve authority contact, provider correction, and escalation continuity.",
      },
    ],
    boundary:
      "The representative does not replace the provider or silently absorb every provider obligation. The written mandate must define the tasks, authority, documentation access, and escalation route.",
  },

  "gpai-provider": {
    slug: "gpai-provider",
    code: "GP",
    title: "GPAI Provider",
    legalDefinition:
      "A provider that develops and places a general-purpose AI model on the market, including where the model may be integrated into a variety of downstream systems or applications.",
    plainLanguage:
      "You are likely in this pathway when your organisation develops or releases a model with general capability that can perform a wide range of distinct tasks and can be integrated into downstream systems.",
    likelyApplies: [
      "You develop or place a general-purpose AI model on the Union market.",
      "The model is capable of performing a wide range of distinct tasks.",
      "The model is provided for integration into downstream systems or applications.",
      "You make a significant modification to a GPAI model and may become provider of the modified model.",
      "The model may meet the criteria for systemic risk.",
    ],
    mayNotApply: [
      "You only deploy a third-party GPAI model without placing the model on the market.",
      "You create a narrow model that does not have general capability.",
      "You make only a minor downstream adaptation that does not transfer provider status.",
      "You provide an AI system built on a GPAI model but do not provide the underlying model.",
    ],
    classificationQuestions: [
      "Does the model display significant generality and perform a wide range of distinct tasks?",
      "Is the model placed on the Union market or supplied for downstream integration?",
      "Who controls the model release, weights, documentation, licence, and updates?",
      "Was an existing model significantly modified?",
      "Does the model meet or approach systemic-risk criteria?",
      "Is the model released under a free and open-source licence, and which obligations or exceptions remain applicable?",
      "What information must be supplied to downstream providers?",
    ],
    responsibilities: [
      {
        title: "Technical documentation",
        articles: "Article 53; Annex XI",
        description:
          "Prepare and maintain model documentation covering training, testing, evaluation, capabilities, limitations, and other required information.",
      },
      {
        title: "Downstream information",
        articles: "Article 53; Annex XII",
        description:
          "Provide information and documentation enabling downstream AI-system providers to understand capabilities, limitations, and integration requirements.",
      },
      {
        title: "Copyright and training-content transparency",
        articles: "Article 53",
        description:
          "Maintain a policy to comply with Union copyright law and publish a sufficiently detailed summary of training content using the applicable template.",
      },
      {
        title: "Systemic-risk duties where applicable",
        articles: "Articles 51–55",
        description:
          "For GPAI models with systemic risk, perform model evaluations, assess and mitigate systemic risk, document and report serious incidents, and ensure adequate cybersecurity.",
      },
      {
        title: "Authorised representative where required",
        articles: "Article 54",
        description:
          "A provider established outside the Union may need to appoint a Union-established authorised representative before placing the model on the market.",
      },
    ],
    evidence: [
      "Model identity, version, provider, release, and licensing record",
      "GPAI applicability and significant-modification determination",
      "Training, testing, evaluation, capability, and limitation documentation",
      "Downstream technical-information package",
      "Copyright-compliance policy and implementation evidence",
      "Public training-content summary and source version",
      "Systemic-risk classification and notification records where applicable",
      "Adversarial testing, model evaluation, risk mitigation, and cybersecurity evidence",
      "Serious-incident chronology and reporting records",
      "Authorised-representative mandate where applicable",
    ],
    records: [
      {
        title: "GPAI Applicability Record",
        description:
          "Preserves why the model is treated as general-purpose, who the provider is, and whether systemic-risk duties may apply.",
      },
      {
        title: "Model Documentation Record",
        description:
          "Binds model identity, training, testing, evaluations, capabilities, limitations, versions, licences, and changes.",
      },
      {
        title: "Downstream Information Record",
        description:
          "Preserves the technical information supplied to downstream providers and any identified integration limitations.",
      },
      {
        title: "Systemic Risk Record",
        description:
          "Preserves evaluations, adversarial testing, systemic-risk analysis, mitigations, incidents, cybersecurity, and continuing review.",
      },
    ],
    requirementLinks: [
      {
        title: "General-Purpose AI",
        href: "/eu-ai-act/requirements/gpai",
        description: "Open the dedicated GPAI and systemic-risk governance pathway.",
      },
      {
        title: "Technical Documentation",
        href: "/eu-ai-act/requirements/technical-documentation",
        description: "Preserve model documentation and downstream information packages.",
      },
      {
        title: "Incident Reporting",
        href: "/eu-ai-act/requirements/incident-reporting",
        description: "Govern serious-incident chronology, notification, and correction.",
      },
      {
        title: "Post-Market Monitoring",
        href: "/eu-ai-act/requirements/post-market-monitoring",
        description: "Preserve continuing model performance, material changes, and risk validity.",
      },
    ],
    boundary:
      "GPAI-provider classification depends on the model, release, control, modifications, market pathway, and applicable exceptions. A downstream system provider and the underlying model provider can carry different duties at the same time.",
  },
};

const aliases: Record<string, string> = {
  "product-manufacturer": "product-manufacturer",
  "product_manufacturer": "product-manufacturer",
  manufacturer: "product-manufacturer",
  "authorised-representative": "authorised-representative",
  "authorized-representative": "authorised-representative",
  representative: "authorised-representative",
  "gpai-provider": "gpai-provider",
  gpai: "gpai-provider",
  provider: "provider",
  deployer: "deployer",
  importer: "importer",
  distributor: "distributor",
};

export default function EuAiActRolePathwayPage() {
  const params = useParams<{ role: string }>();
  const rawRole = Array.isArray(params?.role) ? params.role[0] : params?.role;
  const normalizedRole = rawRole?.toLowerCase() ?? "";
  const key = aliases[normalizedRole] ?? normalizedRole;
  const pathway = rolePathways[key];

  if (!pathway) {
    return (
      <main className="missingRole">
        <section>
          <span>TA-14 EU AI ACT</span>
          <h1>Role pathway not found.</h1>
          <p>
            The requested role does not match an available EU AI Act operator
            pathway.
          </p>
          <Link href="/eu-ai-act">Return to the EU AI Act workspace</Link>
        </section>

        <style jsx>{`
          :global(*) {
            box-sizing: border-box;
          }

          :global(body) {
            margin: 0;
            background: #030914;
            color: #f4f9ff;
            font-family:
              Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
              "Segoe UI", sans-serif;
          }

          .missingRole {
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            background:
              radial-gradient(circle at 50% 20%, rgba(47, 142, 209, 0.15), transparent 35%),
              #030914;
          }

          section {
            width: min(720px, 100%);
            padding: 42px;
            border: 1px solid rgba(109, 210, 245, 0.24);
            border-radius: 24px;
            background: rgba(8, 21, 32, 0.92);
            text-align: center;
          }

          span {
            color: #6dd2f5;
            font-size: 11px;
            font-weight: 950;
            letter-spacing: 0.18em;
          }

          h1 {
            margin: 16px 0 12px;
            font-size: clamp(42px, 8vw, 72px);
            letter-spacing: -0.05em;
          }

          p {
            color: #9fb3c0;
            line-height: 1.65;
          }

          a {
            min-height: 50px;
            margin-top: 18px;
            padding: 0 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            color: #06131d;
            background: linear-gradient(135deg, #67caf6, #d8f7ff);
            text-decoration: none;
            font-weight: 900;
          }
        `}</style>
      </main>
    );
  }

  return (
    <main>
      <div className="cosmos" aria-hidden="true">
        <div className="stars starsOne" />
        <div className="stars starsTwo" />
        <div className="line lineOne" />
        <div className="line lineTwo" />
        <div className="orbit orbitOne">
          <i />
        </div>
        <div className="orbit orbitTwo">
          <i />
        </div>
      </div>

      <header className="topbar shell">
        <Link href="/eu-ai-act" className="brand">
          <span className="brandMark">TA-14</span>
          <span>
            <strong>EU AI Act Role Pathway</strong>
            <small>No admissible evidence. No admissible execution.</small>
          </span>
        </Link>

        <nav>
          <Link href="/">Exchange</Link>
          <Link href="/workspace">Workspace</Link>
          <Link className="active" href="/eu-ai-act">
            EU AI Act
          </Link>
          <Link href="/workspace/governed-records">Records</Link>
          <Link href="/workspace/entity-review">Entity Review</Link>
        </nav>

        <Link className="headerButton" href="/eu-ai-act/classify">
          Guided Classification
          <span>→</span>
        </Link>
      </header>

      <div className="breadcrumbs shell">
        <Link href="/eu-ai-act">EU AI Act</Link>
        <span>/</span>
        <span>Roles</span>
        <span>/</span>
        <strong>{pathway.title}</strong>
      </div>

      <section className="hero shell">
        <div className="heroCopy">
          <p className="eyebrow">EU AI ACT ROLE PATHWAY</p>
          <div className="roleHeading">
            <span>{pathway.code}</span>
            <h1>{pathway.title}</h1>
          </div>
          <p className="lead">{pathway.plainLanguage}</p>

          <div className="heroActions">
            <Link
              className="primaryButton"
              href={`/workspace/routes/new?framework=eu-ai-act&role=${pathway.slug}`}
            >
              Build This Role Route
              <span>→</span>
            </Link>
            <Link
              className="secondaryButton"
              href={`/workspace/governed-records/builder?framework=eu-ai-act&role=${pathway.slug}`}
            >
              Create Supporting Record
            </Link>
            <Link
              className="secondaryButton"
              href={`/workspace/entity-review/eu-ai-act?role=${pathway.slug}`}
            >
              Request Role Review
            </Link>
          </div>
        </div>

        <aside className="definitionCard">
          <span className="cardLabel">REGULATORY ROLE DEFINITION</span>
          <p>{pathway.legalDefinition}</p>
          <div>
            <span>Role status</span>
            <strong>Must be established from facts</strong>
          </div>
        </aside>
      </section>

      <section className="boundaryNotice shell">
        <div>
          <span>TA-14 BOUNDARY</span>
          <strong>Role labels do not establish the role by themselves.</strong>
        </div>
        <p>{pathway.boundary}</p>
      </section>

      <section className="twoColumn shell">
        <article className="appliesCard">
          <div className="sectionTitle">
            <span>LIKELY APPLIES WHEN</span>
            <h2>Signals supporting this role</h2>
          </div>
          <ul>
            {pathway.likelyApplies.map((item) => (
              <li key={item}>
                <span>✓</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="notApplyCard">
          <div className="sectionTitle">
            <span>MAY NOT APPLY WHEN</span>
            <h2>Signals pointing elsewhere</h2>
          </div>
          <ul>
            {pathway.mayNotApply.map((item) => (
              <li key={item}>
                <span>—</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="questions shell">
        <div className="sectionIntro">
          <p className="eyebrow">CLASSIFICATION QUESTIONS</p>
          <h2>Establish the role from the operating facts.</h2>
          <p>
            Preserve each answer as declared, evidenced, unresolved, or outside
            present authority. Do not force uncertainty into a confident role
            classification.
          </p>
        </div>

        <div className="questionGrid">
          {pathway.classificationQuestions.map((question, index) => (
            <article key={question}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{question}</p>
            </article>
          ))}
        </div>

        <Link className="wideButton" href="/eu-ai-act/classify">
          I Need Guided Role and System Classification
          <span>→</span>
        </Link>
      </section>

      <section className="responsibilities shell">
        <div className="sectionIntro">
          <p className="eyebrow">PRIMARY RESPONSIBILITY MAP</p>
          <h2>Open the obligations attached to the role.</h2>
          <p>
            These are governance starting points. Applicability may depend on
            system category, risk classification, intended purpose, operator
            conduct, exceptions, and implementation dates.
          </p>
        </div>

        <div className="responsibilityGrid">
          {pathway.responsibilities.map((item, index) => (
            <article key={item.title}>
              <div className="responsibilityTop">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{item.articles}</strong>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="evidence shell">
        <div className="evidenceHeader">
          <div>
            <p className="eyebrow">EVIDENCE TO PRESERVE</p>
            <h2>The role needs an evidence package—not a dropdown selection.</h2>
          </div>
          <Link
            className="primaryButton"
            href={`/workspace/governed-records/builder?framework=eu-ai-act&role=${pathway.slug}`}
          >
            Open Record Builder
            <span>→</span>
          </Link>
        </div>

        <div className="evidenceGrid">
          {pathway.evidence.map((item, index) => (
            <article key={item}>
              <span>EV-{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="records shell">
        <div className="sectionIntro">
          <p className="eyebrow">ROLE-SPECIFIC GOVERNED RECORDS</p>
          <h2>Turn material claims into attributable records.</h2>
        </div>

        <div className="recordGrid">
          {pathway.records.map((record, index) => (
            <article key={record.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{record.title}</h3>
              <p>{record.description}</p>
              <Link
                href={`/workspace/governed-records/builder?framework=eu-ai-act&role=${pathway.slug}&record=${encodeURIComponent(
                  record.title,
                )}`}
              >
                Create This Record
                <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="requirements shell">
        <div className="sectionIntro">
          <p className="eyebrow">CONNECTED REQUIREMENT PATHWAYS</p>
          <h2>Continue into the requirements most likely to matter.</h2>
        </div>

        <div className="requirementGrid">
          {pathway.requirementLinks.map((item) => (
            <Link href={item.href} key={item.title}>
              <span>OPEN PATHWAY</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div>
                Explore Requirement
                <b>→</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="workflow shell">
        <div>
          <p className="eyebrow">GOVERNED ROLE WORKFLOW</p>
          <h2>Role → Applicability → Evidence → Review → Record</h2>
        </div>

        <div className="workflowSteps">
          {[
            ["01", "Declare", "State the claimed role and operating facts."],
            ["02", "Classify", "Resolve system, risk, operator, and exception questions."],
            ["03", "Map", "Connect applicable obligations to evidence expectations."],
            ["04", "Preserve", "Bind documents, versions, owners, chronology, and gaps."],
            ["05", "Review", "Challenge the role, evidence, authority, and exclusions."],
            ["06", "Record", "Preserve the bounded determination without erasing uncertainty."],
          ].map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="legalBoundary shell">
        <div>
          <p className="eyebrow">LEGAL AND GOVERNANCE BOUNDARY</p>
          <h2>This pathway structures role analysis. It does not certify the role.</h2>
        </div>
        <p>
          Final legal interpretation, conformity assessment, regulator
          acceptance, professional advice, and enforcement remain outside this
          page unless separately established by a competent person or authority.
          The controlling Regulation, applicable guidance, facts, contracts,
          system design, and conduct must be reviewed together.
        </p>
      </section>

      <section className="finalCta shell">
        <div>
          <p className="eyebrow">BUILD THE ROLE RECORD</p>
          <h2>Preserve why this role applies—and what remains unresolved.</h2>
          <p>
            Start a governed route, create the supporting records, or send the
            complete role package into independent review.
          </p>
        </div>

        <div className="finalActions">
          <Link
            className="primaryButton"
            href={`/workspace/routes/new?framework=eu-ai-act&role=${pathway.slug}`}
          >
            Build Role Route
            <span>→</span>
          </Link>
          <Link
            className="secondaryButton"
            href={`/workspace/entity-review/eu-ai-act?role=${pathway.slug}`}
          >
            Open Entity Review
          </Link>
        </div>
      </section>

      <footer className="shell">
        <div>
          <strong>TA-14 Authority Governance Institution</strong>
          <span>No admissible evidence. No admissible execution.</span>
        </div>
        <Link href="/eu-ai-act">Return to EU AI Act Workspace</Link>
      </footer>

      <style jsx>{`
        :global(*) {
          box-sizing: border-box;
        }

        :global(html) {
          background: #030914;
          scroll-behavior: smooth;
        }

        :global(body) {
          margin: 0;
          color: #f4f9ff;
          background:
            radial-gradient(circle at 10% 5%, rgba(43, 137, 207, 0.14), transparent 28%),
            radial-gradient(circle at 88% 24%, rgba(219, 160, 37, 0.08), transparent 26%),
            linear-gradient(180deg, #030914 0%, #071522 52%, #030914 100%);
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        main {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .shell {
          width: min(1260px, calc(100% - 36px));
          margin-inline: auto;
          position: relative;
          z-index: 2;
        }

        .cosmos {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: -4;
        }

        .stars {
          position: absolute;
          inset: -15%;
        }

        .starsOne {
          background-image:
            radial-gradient(circle, rgba(255,255,255,.75) 0 1px, transparent 1.5px);
          background-size: 104px 104px;
          animation: starsMove 42s linear infinite;
        }

        .starsTwo {
          background-image:
            radial-gradient(circle, rgba(80,190,255,.65) 0 1px, transparent 1.5px);
          background-size: 166px 166px;
          background-position: 43px 61px;
          animation: starsMoveReverse 56s linear infinite;
        }

        .line {
          position: absolute;
          width: 70vw;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(80, 184, 239, .45), transparent);
        }

        .lineOne {
          left: -20%;
          top: 27%;
          transform: rotate(12deg);
          animation: lineMove 18s linear infinite;
        }

        .lineTwo {
          right: -25%;
          top: 68%;
          transform: rotate(-10deg);
          animation: lineMoveReverse 23s linear infinite;
        }

        .orbit {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 999px;
          border: 1px solid rgba(88, 185, 231, .17);
          animation: orbit 20s linear infinite;
        }

        .orbit i {
          position: absolute;
          right: -7px;
          top: 50%;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: #69ccfa;
          box-shadow: 0 0 18px #69ccfa;
        }

        .orbitOne {
          right: 3%;
          top: 10%;
        }

        .orbitTwo {
          left: 2%;
          bottom: 8%;
          width: 190px;
          height: 190px;
          border-color: rgba(255, 188, 59, .18);
          animation-direction: reverse;
          animation-duration: 16s;
        }

        .orbitTwo i {
          background: #ffc653;
          box-shadow: 0 0 18px #ffc653;
        }

        .topbar {
          min-height: 82px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 24px;
          border-bottom: 1px solid rgba(105, 159, 188, .16);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          text-decoration: none;
        }

        .brandMark {
          min-width: 66px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          color: #07121b;
          background: linear-gradient(135deg, #6bcdfa, #d9f7ff);
          font-size: 13px;
          font-weight: 950;
        }

        .brand > span:last-child {
          display: flex;
          flex-direction: column;
        }

        .brand small {
          margin-top: 3px;
          color: #7e9baa;
          font-size: 11px;
        }

        nav {
          display: flex;
          justify-content: center;
          gap: 22px;
        }

        nav a {
          color: #a8bcc7;
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
        }

        nav a.active {
          color: #f7d687;
        }

        .headerButton {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          gap: 16px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 193, 71, .36);
          color: #ffd783;
          background: rgba(116, 74, 5, .12);
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .breadcrumbs {
          min-height: 62px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #718d9d;
          font-size: 12px;
        }

        .breadcrumbs a {
          color: #75cfee;
          text-decoration: none;
        }

        .breadcrumbs strong {
          color: #dbe8ef;
        }

        .hero {
          min-height: 490px;
          display: grid;
          grid-template-columns: 1.2fr .8fr;
          gap: 48px;
          align-items: center;
          padding: 50px 0 66px;
        }

        .eyebrow,
        .cardLabel {
          margin: 0;
          color: #6dd2f5;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: .18em;
        }

        .roleHeading {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 15px;
        }

        .roleHeading > span {
          min-width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          border-radius: 20px;
          border: 1px solid rgba(255, 193, 74, .42);
          color: #ffd678;
          background:
            radial-gradient(circle, rgba(255, 190, 61, .12), rgba(52, 31, 3, .45));
          box-shadow: 0 0 26px rgba(255, 177, 38, .12);
          font-size: 27px;
          font-weight: 950;
        }

        h1 {
          margin: 0;
          font-size: clamp(58px, 8vw, 104px);
          line-height: .92;
          letter-spacing: -.065em;
        }

        .lead {
          max-width: 820px;
          margin: 22px 0 0;
          color: #a7bac6;
          font-size: 18px;
          line-height: 1.7;
        }

        .heroActions,
        .finalActions {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 28px;
        }

        .primaryButton,
        .secondaryButton,
        .wideButton {
          min-height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 0 18px;
          border-radius: 13px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
        }

        .primaryButton {
          color: #06131d;
          background: linear-gradient(135deg, #67caf6, #d8f7ff);
          box-shadow: 0 14px 36px rgba(73, 181, 229, .17);
        }

        .secondaryButton,
        .wideButton {
          color: #e5f3fa;
          border: 1px solid rgba(100, 184, 222, .23);
          background: rgba(24, 66, 88, .14);
        }

        .definitionCard {
          padding: 32px;
          border-radius: 24px;
          border: 1px solid rgba(255, 193, 72, .28);
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 183, 40, .09), transparent 38%),
            linear-gradient(180deg, rgba(19, 25, 27, .95), rgba(7, 13, 18, .97));
          box-shadow: 0 25px 70px rgba(0,0,0,.28);
        }

        .definitionCard p {
          margin: 16px 0 24px;
          color: #d6c8ad;
          font-size: 16px;
          line-height: 1.68;
        }

        .definitionCard > div {
          padding: 17px;
          border-radius: 14px;
          border: 1px solid rgba(255, 193, 72, .17);
          background: rgba(129, 79, 5, .06);
        }

        .definitionCard > div span,
        .definitionCard > div strong {
          display: block;
        }

        .definitionCard > div span {
          color: #a89064;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .definitionCard > div strong {
          margin-top: 7px;
          color: #ffe1a0;
        }

        .boundaryNotice,
        .appliesCard,
        .notApplyCard,
        .questions,
        .responsibilities,
        .evidence,
        .records,
        .requirements,
        .workflow,
        .legalBoundary,
        .finalCta {
          border: 1px solid rgba(111, 163, 190, .15);
          background:
            linear-gradient(180deg, rgba(10, 24, 35, .92), rgba(5, 12, 19, .96));
          border-radius: 24px;
          box-shadow: 0 22px 65px rgba(0,0,0,.22);
        }

        .boundaryNotice {
          padding: 24px 30px;
          display: grid;
          grid-template-columns: .78fr 1.22fr;
          gap: 32px;
          align-items: center;
          border-color: rgba(255, 188, 61, .21);
        }

        .boundaryNotice div span {
          display: block;
          color: #ffc554;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .boundaryNotice div strong {
          display: block;
          margin-top: 8px;
          font-size: 20px;
        }

        .boundaryNotice p {
          margin: 0;
          color: #b9aa8e;
          line-height: 1.62;
        }

        .twoColumn {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 20px;
        }

        .appliesCard,
        .notApplyCard {
          padding: 34px;
        }

        .appliesCard {
          border-color: rgba(84, 214, 159, .2);
        }

        .notApplyCard {
          border-color: rgba(255, 178, 91, .18);
        }

        .sectionTitle > span {
          color: #6dd2f5;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .notApplyCard .sectionTitle > span {
          color: #ffb768;
        }

        .sectionTitle h2,
        .sectionIntro h2,
        .evidenceHeader h2,
        .workflow h2,
        .legalBoundary h2,
        .finalCta h2 {
          margin: 11px 0 0;
          font-size: clamp(30px, 4.3vw, 50px);
          line-height: 1.03;
          letter-spacing: -.045em;
        }

        .appliesCard ul,
        .notApplyCard ul {
          display: grid;
          gap: 12px;
          margin: 25px 0 0;
          padding: 0;
          list-style: none;
        }

        .appliesCard li,
        .notApplyCard li {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 12px;
          align-items: start;
          padding: 14px;
          border-radius: 13px;
          background: rgba(255,255,255,.018);
        }

        .appliesCard li > span,
        .notApplyCard li > span {
          width: 26px;
          height: 26px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          font-weight: 950;
        }

        .appliesCard li > span {
          color: #77e4b9;
          background: rgba(61, 180, 127, .1);
        }

        .notApplyCard li > span {
          color: #ffc17d;
          background: rgba(190, 102, 29, .1);
        }

        .appliesCard li p,
        .notApplyCard li p {
          margin: 2px 0 0;
          color: #c5d3dc;
          line-height: 1.5;
        }

        .questions,
        .responsibilities,
        .evidence,
        .records,
        .requirements,
        .workflow,
        .legalBoundary {
          margin-top: 20px;
          padding: 40px;
        }

        .sectionIntro {
          max-width: 900px;
        }

        .sectionIntro > p:not(.eyebrow),
        .evidenceHeader p,
        .legalBoundary > p,
        .finalCta p:not(.eyebrow) {
          color: #9fb3c0;
          line-height: 1.68;
        }

        .questionGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 27px;
        }

        .questionGrid article {
          min-height: 112px;
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(94, 183, 222, .15);
          background: rgba(37, 104, 135, .045);
        }

        .questionGrid span,
        .responsibilityTop > span,
        .recordGrid > article > span {
          color: #69d0f4;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .questionGrid p {
          margin: 12px 0 0;
          color: #d2dee5;
          line-height: 1.52;
        }

        .wideButton {
          width: 100%;
          margin-top: 16px;
          border-color: rgba(255, 193, 72, .25);
          color: #ffd982;
          background: rgba(107, 68, 6, .08);
        }

        .responsibilityGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .responsibilityGrid article {
          min-height: 230px;
          padding: 22px;
          border-radius: 17px;
          border: 1px solid rgba(100, 176, 211, .15);
          background: rgba(37, 95, 122, .045);
        }

        .responsibilityTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .responsibilityTop strong {
          color: #ffd57d;
          font-size: 11px;
        }

        .responsibilityGrid h3 {
          margin: 18px 0 10px;
          font-size: 23px;
        }

        .responsibilityGrid p {
          margin: 0;
          color: #a7bac6;
          line-height: 1.6;
        }

        .evidenceHeader {
          display: flex;
          justify-content: space-between;
          gap: 28px;
          align-items: end;
        }

        .evidenceHeader > div {
          max-width: 810px;
        }

        .evidenceGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 28px;
        }

        .evidenceGrid article {
          min-height: 128px;
          padding: 18px;
          border-radius: 15px;
          border: 1px solid rgba(255, 190, 69, .15);
          background: rgba(125, 78, 6, .045);
        }

        .evidenceGrid span {
          color: #ffc954;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .13em;
        }

        .evidenceGrid p {
          margin: 13px 0 0;
          color: #d6cbb6;
          line-height: 1.52;
        }

        .recordGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 27px;
        }

        .recordGrid article {
          padding: 23px;
          border-radius: 17px;
          border: 1px solid rgba(101, 181, 216, .15);
          background: rgba(32, 91, 118, .045);
        }

        .recordGrid h3 {
          margin: 14px 0 9px;
          font-size: 23px;
        }

        .recordGrid p {
          min-height: 76px;
          margin: 0;
          color: #a5b7c2;
          line-height: 1.57;
        }

        .recordGrid a {
          min-height: 42px;
          margin-top: 18px;
          padding: 0 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 10px;
          border: 1px solid rgba(100, 190, 229, .21);
          color: #82d5f5;
          background: rgba(41, 117, 149, .06);
          text-decoration: none;
          font-size: 12px;
          font-weight: 900;
        }

        .requirementGrid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 27px;
        }

        .requirementGrid > a {
          min-height: 260px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          border-radius: 17px;
          border: 1px solid rgba(255, 189, 66, .17);
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 182, 38, .06), transparent 34%),
            rgba(12, 19, 22, .86);
          color: inherit;
          text-decoration: none;
          transition: transform 180ms ease, border-color 180ms ease;
        }

        .requirementGrid > a:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 194, 74, .5);
        }

        .requirementGrid > a > span {
          color: #ffc955;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: .15em;
        }

        .requirementGrid h3 {
          margin: 16px 0 10px;
          font-size: 22px;
        }

        .requirementGrid p {
          margin: 0;
          color: #a8b8c1;
          line-height: 1.55;
        }

        .requirementGrid > a > div {
          margin-top: auto;
          padding-top: 18px;
          display: flex;
          justify-content: space-between;
          color: #ffd270;
          font-size: 12px;
          font-weight: 900;
        }

        .workflow {
          display: grid;
          grid-template-columns: .72fr 1.28fr;
          gap: 34px;
          align-items: start;
        }

        .workflowSteps {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .workflowSteps article {
          padding: 18px;
          border-radius: 15px;
          border: 1px solid rgba(102, 178, 211, .14);
          background: rgba(36, 94, 119, .04);
        }

        .workflowSteps span {
          color: #69cef2;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: .14em;
        }

        .workflowSteps strong {
          display: block;
          margin-top: 10px;
        }

        .workflowSteps p {
          margin: 7px 0 0;
          color: #9fb0bb;
          font-size: 12px;
          line-height: 1.5;
        }

        .legalBoundary {
          display: grid;
          grid-template-columns: .9fr 1.1fr;
          gap: 34px;
          align-items: center;
          border-color: rgba(255, 190, 68, .18);
        }

        .legalBoundary > p {
          margin: 0;
        }

        .finalCta {
          margin-top: 70px;
          padding: 48px 42px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
          border-color: rgba(101, 190, 227, .21);
        }

        .finalCta > div:first-child {
          max-width: 720px;
        }

        .finalActions {
          justify-content: flex-end;
          margin-top: 0;
        }

        footer {
          min-height: 120px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          color: #718894;
          font-size: 12px;
        }

        footer > div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        footer strong {
          color: #a6bac5;
        }

        footer a {
          color: #78d1f2;
          text-decoration: none;
          font-weight: 850;
        }

        @keyframes starsMove {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(110px,145px,0); }
        }

        @keyframes starsMoveReverse {
          from { transform: translate3d(0,0,0); }
          to { transform: translate3d(-120px,100px,0); }
        }

        @keyframes lineMove {
          from { transform: translateX(-35vw) rotate(12deg); opacity: 0; }
          18% { opacity: .5; }
          82% { opacity: .3; }
          to { transform: translateX(105vw) rotate(12deg); opacity: 0; }
        }

        @keyframes lineMoveReverse {
          from { transform: translateX(35vw) rotate(-10deg); opacity: 0; }
          18% { opacity: .45; }
          82% { opacity: .28; }
          to { transform: translateX(-105vw) rotate(-10deg); opacity: 0; }
        }

        @keyframes orbit {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1060px) {
          nav {
            display: none;
          }

          .topbar {
            grid-template-columns: 1fr auto;
          }

          .hero,
          .workflow,
          .legalBoundary {
            grid-template-columns: 1fr;
          }

          .requirementGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .shell {
            width: min(100% - 20px, 1260px);
          }

          .brand small,
          .headerButton span {
            display: none;
          }

          .hero {
            min-height: auto;
            padding: 42px 0 56px;
          }

          .roleHeading {
            align-items: flex-start;
            flex-direction: column;
          }

          .definitionCard,
          .boundaryNotice,
          .questions,
          .responsibilities,
          .evidence,
          .records,
          .requirements,
          .workflow,
          .legalBoundary,
          .finalCta {
            padding: 28px 22px;
          }

          .boundaryNotice,
          .twoColumn,
          .questionGrid,
          .responsibilityGrid,
          .recordGrid,
          .workflowSteps {
            grid-template-columns: 1fr;
          }

          .evidenceHeader,
          .finalCta {
            flex-direction: column;
            align-items: flex-start;
          }

          .evidenceGrid,
          .requirementGrid {
            grid-template-columns: 1fr;
          }

          .recordGrid p {
            min-height: auto;
          }

          footer {
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
          }
        }
      `}</style>
    </main>
  );
}
