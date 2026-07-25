export type GovernanceLibraryRecord = {
  slug: string;
  title: string;
  shortTitle: string;
  recordType:
    | "law"
    | "regulation"
    | "standard"
    | "framework"
    | "principle"
    | "guidance"
    | "architecture";
  jurisdiction: string;
  publisher: string;
  status: "active" | "adopted" | "published" | "voluntary" | "foundational";
  categories: string[];
  summary: string;
  whyItMatters: string;
  keyTopics: string[];
  relatedSlugs: string[];
  officialUrl?: string;
};

export const foundationalGovernanceRecords: GovernanceLibraryRecord[] = [
  {
    slug: "eu-ai-act",
    title: "European Union Artificial Intelligence Act",
    shortTitle: "EU AI Act",
    recordType: "law",
    jurisdiction: "European Union",
    publisher: "European Union",
    status: "adopted",
    categories: ["laws", "regulations", "risk-management", "lifecycle"],
    summary:
      "A risk-based legal framework governing the development, placement on the market, deployment, and use of artificial intelligence systems in the European Union.",
    whyItMatters:
      "It establishes binding obligations for prohibited practices, high-risk systems, transparency, general-purpose AI, governance, documentation, monitoring, and enforcement.",
    keyTopics: [
      "risk classification",
      "high-risk AI",
      "general-purpose AI",
      "transparency",
      "human oversight",
      "conformity assessment",
    ],
    relatedSlugs: [
      "iso-iec-42001",
      "nist-ai-rmf",
      "oecd-ai-principles",
      "ta14-admissible-execution",
    ],
    officialUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj",
  },
  {
    slug: "nist-ai-rmf",
    title: "NIST Artificial Intelligence Risk Management Framework",
    shortTitle: "NIST AI RMF",
    recordType: "framework",
    jurisdiction: "United States",
    publisher: "National Institute of Standards and Technology",
    status: "voluntary",
    categories: ["frameworks", "risk-management", "lifecycle", "assurance"],
    summary:
      "A voluntary framework for managing risks associated with artificial intelligence across organizational and system lifecycles.",
    whyItMatters:
      "Its Govern, Map, Measure, and Manage functions provide a widely used structure for trustworthy and responsible AI risk management.",
    keyTopics: [
      "governance",
      "risk mapping",
      "measurement",
      "risk treatment",
      "trustworthiness",
      "lifecycle management",
    ],
    relatedSlugs: [
      "nist-ai-600-1",
      "iso-iec-42001",
      "iso-iec-23894",
      "oecd-ai-principles",
    ],
    officialUrl: "https://www.nist.gov/itl/ai-risk-management-framework",
  },
  {
    slug: "nist-ai-600-1",
    title: "Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile",
    shortTitle: "NIST AI 600-1",
    recordType: "guidance",
    jurisdiction: "United States",
    publisher: "National Institute of Standards and Technology",
    status: "published",
    categories: ["guidance", "risk-management", "testing", "generative-ai"],
    summary:
      "A companion profile to the NIST AI RMF addressing risks and actions specific to generative artificial intelligence.",
    whyItMatters:
      "It translates the AI RMF into practical considerations for generative models, content risks, misuse, evaluation, monitoring, and governance.",
    keyTopics: [
      "generative AI",
      "confabulation",
      "content provenance",
      "misuse",
      "evaluation",
      "incident disclosure",
    ],
    relatedSlugs: ["nist-ai-rmf", "owasp-top-10-llm", "mitre-atlas"],
    officialUrl: "https://doi.org/10.6028/NIST.AI.600-1",
  },
  {
    slug: "iso-iec-42001",
    title: "ISO/IEC 42001 Artificial Intelligence Management System",
    shortTitle: "ISO/IEC 42001",
    recordType: "standard",
    jurisdiction: "International",
    publisher: "ISO and IEC",
    status: "published",
    categories: ["standards", "management-systems", "assurance", "lifecycle"],
    summary:
      "An international management system standard specifying requirements for establishing, implementing, maintaining, and continually improving an AI management system.",
    whyItMatters:
      "It provides an auditable organizational structure for AI policy, objectives, controls, risk management, responsibilities, and continual improvement.",
    keyTopics: [
      "AI management system",
      "policy",
      "leadership",
      "risk treatment",
      "controls",
      "continual improvement",
    ],
    relatedSlugs: [
      "iso-iec-23894",
      "iso-iec-22989",
      "nist-ai-rmf",
      "eu-ai-act",
    ],
    officialUrl: "https://www.iso.org/standard/81230.html",
  },
  {
    slug: "iso-iec-23894",
    title: "ISO/IEC 23894 Artificial Intelligence Risk Management",
    shortTitle: "ISO/IEC 23894",
    recordType: "standard",
    jurisdiction: "International",
    publisher: "ISO and IEC",
    status: "published",
    categories: ["standards", "risk-management", "lifecycle"],
    summary:
      "International guidance for organizations seeking to identify, assess, treat, monitor, and communicate risks related to artificial intelligence.",
    whyItMatters:
      "It provides AI-specific risk management guidance that can support broader enterprise risk and management system practices.",
    keyTopics: [
      "risk identification",
      "risk analysis",
      "risk treatment",
      "monitoring",
      "communication",
      "lifecycle risk",
    ],
    relatedSlugs: ["iso-iec-42001", "nist-ai-rmf", "iso-31000"],
    officialUrl: "https://www.iso.org/standard/77304.html",
  },
  {
    slug: "iso-iec-22989",
    title: "ISO/IEC 22989 Artificial Intelligence Concepts and Terminology",
    shortTitle: "ISO/IEC 22989",
    recordType: "standard",
    jurisdiction: "International",
    publisher: "ISO and IEC",
    status: "published",
    categories: ["standards", "dictionary", "foundations"],
    summary:
      "An international standard establishing concepts and terminology used across artificial intelligence systems and related standards.",
    whyItMatters:
      "Shared terminology reduces ambiguity and supports consistent interpretation across governance, technical, legal, and assurance activities.",
    keyTopics: [
      "AI terminology",
      "concepts",
      "machine learning",
      "AI systems",
      "stakeholders",
      "standardization",
    ],
    relatedSlugs: ["iso-iec-42001", "iso-iec-23053", "oecd-ai-principles"],
    officialUrl: "https://www.iso.org/standard/74296.html",
  },
  {
    slug: "iso-iec-23053",
    title: "ISO/IEC 23053 Framework for Artificial Intelligence Systems Using Machine Learning",
    shortTitle: "ISO/IEC 23053",
    recordType: "standard",
    jurisdiction: "International",
    publisher: "ISO and IEC",
    status: "published",
    categories: ["standards", "frameworks", "lifecycle", "technical-governance"],
    summary:
      "A framework describing machine-learning-based AI systems and their components, functions, and relationships.",
    whyItMatters:
      "It helps governance and technical teams reason consistently about system components, lifecycle functions, and accountability boundaries.",
    keyTopics: [
      "machine learning",
      "system architecture",
      "components",
      "data",
      "models",
      "lifecycle",
    ],
    relatedSlugs: ["iso-iec-22989", "iso-iec-42001", "nist-ai-rmf"],
    officialUrl: "https://www.iso.org/standard/74438.html",
  },
  {
    slug: "iso-iec-38507",
    title: "ISO/IEC 38507 Governance Implications of the Use of Artificial Intelligence by Organizations",
    shortTitle: "ISO/IEC 38507",
    recordType: "standard",
    jurisdiction: "International",
    publisher: "ISO and IEC",
    status: "published",
    categories: ["standards", "governance", "roles", "leadership"],
    summary:
      "Guidance for governing bodies on the organizational implications of using artificial intelligence.",
    whyItMatters:
      "It places AI accountability at the governing-body level and connects organizational purpose, oversight, risk, and responsible use.",
    keyTopics: [
      "governing body",
      "accountability",
      "organizational oversight",
      "responsible use",
      "strategy",
      "risk",
    ],
    relatedSlugs: ["iso-iec-42001", "oecd-ai-principles", "nist-ai-rmf"],
    officialUrl: "https://www.iso.org/standard/56641.html",
  },
  {
    slug: "iso-31000",
    title: "ISO 31000 Risk Management Guidelines",
    shortTitle: "ISO 31000",
    recordType: "standard",
    jurisdiction: "International",
    publisher: "International Organization for Standardization",
    status: "published",
    categories: ["standards", "risk-management", "enterprise-governance"],
    summary:
      "General principles, framework, and process guidance for managing risk across organizations.",
    whyItMatters:
      "It provides the enterprise risk foundation into which AI-specific risk practices can be integrated.",
    keyTopics: [
      "risk principles",
      "risk framework",
      "risk process",
      "leadership",
      "integration",
      "continual improvement",
    ],
    relatedSlugs: ["iso-iec-23894", "iso-iec-42001", "coso-erm"],
    officialUrl: "https://www.iso.org/iso-31000-risk-management.html",
  },
  {
    slug: "oecd-ai-principles",
    title: "OECD Principles on Artificial Intelligence",
    shortTitle: "OECD AI Principles",
    recordType: "principle",
    jurisdiction: "International",
    publisher: "Organisation for Economic Co-operation and Development",
    status: "adopted",
    categories: ["principles", "policy", "responsible-ai"],
    summary:
      "International principles promoting innovative and trustworthy artificial intelligence that respects human rights and democratic values.",
    whyItMatters:
      "They influence national AI strategies, international policy, risk frameworks, and governance expectations worldwide.",
    keyTopics: [
      "inclusive growth",
      "human rights",
      "transparency",
      "robustness",
      "security",
      "accountability",
    ],
    relatedSlugs: ["unesco-ai-ethics", "nist-ai-rmf", "eu-ai-act"],
    officialUrl: "https://oecd.ai/en/ai-principles",
  },
  {
    slug: "unesco-ai-ethics",
    title: "UNESCO Recommendation on the Ethics of Artificial Intelligence",
    shortTitle: "UNESCO AI Ethics Recommendation",
    recordType: "principle",
    jurisdiction: "International",
    publisher: "UNESCO",
    status: "adopted",
    categories: ["principles", "ethics", "human-rights", "policy"],
    summary:
      "A global normative instrument addressing the ethical development and use of artificial intelligence.",
    whyItMatters:
      "It connects AI governance with human dignity, rights, fairness, environmental concerns, cultural diversity, and public accountability.",
    keyTopics: [
      "human dignity",
      "fairness",
      "privacy",
      "environment",
      "cultural diversity",
      "ethical impact assessment",
    ],
    relatedSlugs: ["oecd-ai-principles", "un-guiding-principles-business-human-rights"],
    officialUrl: "https://www.unesco.org/en/artificial-intelligence/recommendation-ethics",
  },
  {
    slug: "white-house-ai-bill-of-rights",
    title: "Blueprint for an AI Bill of Rights",
    shortTitle: "AI Bill of Rights",
    recordType: "guidance",
    jurisdiction: "United States",
    publisher: "White House Office of Science and Technology Policy",
    status: "published",
    categories: ["guidance", "civil-rights", "principles", "public-policy"],
    summary:
      "A nonbinding framework describing protections for people affected by automated systems.",
    whyItMatters:
      "It organizes governance expectations around safety, discrimination, privacy, notice, explanation, and human alternatives.",
    keyTopics: [
      "safe systems",
      "algorithmic discrimination",
      "data privacy",
      "notice",
      "explanation",
      "human alternatives",
    ],
    relatedSlugs: ["nist-ai-rmf", "oecd-ai-principles", "ftc-ai-guidance"],
    officialUrl: "https://www.whitehouse.gov/ostp/ai-bill-of-rights/",
  },
  {
    slug: "omb-m-24-10",
    title: "OMB Memorandum M-24-10: Advancing Governance, Innovation, and Risk Management for Agency Use of Artificial Intelligence",
    shortTitle: "OMB M-24-10",
    recordType: "guidance",
    jurisdiction: "United States",
    publisher: "Office of Management and Budget",
    status: "published",
    categories: ["government", "guidance", "risk-management", "public-sector"],
    summary:
      "Federal agency guidance establishing governance, innovation, inventory, and risk-management expectations for agency use of artificial intelligence.",
    whyItMatters:
      "It sets operational governance requirements for U.S. federal agencies, including leadership, inventories, impact controls, testing, and public transparency.",
    keyTopics: [
      "federal agencies",
      "chief AI officer",
      "AI inventory",
      "rights-impacting AI",
      "safety-impacting AI",
      "minimum practices",
    ],
    relatedSlugs: ["nist-ai-rmf", "white-house-ai-bill-of-rights"],
    officialUrl: "https://www.whitehouse.gov/wp-content/uploads/2024/03/M-24-10-Advancing-Governance-Innovation-and-Risk-Management-for-Agency-Use-of-Artificial-Intelligence.pdf",
  },
  {
    slug: "ftc-ai-guidance",
    title: "Federal Trade Commission Artificial Intelligence Guidance",
    shortTitle: "FTC AI Guidance",
    recordType: "guidance",
    jurisdiction: "United States",
    publisher: "Federal Trade Commission",
    status: "published",
    categories: ["guidance", "consumer-protection", "marketing", "fairness"],
    summary:
      "A body of consumer-protection guidance and enforcement messaging addressing deceptive, unfair, discriminatory, and unsupported AI practices.",
    whyItMatters:
      "It demonstrates how existing consumer-protection law can apply to AI claims, automated decisions, data practices, and foreseeable harms.",
    keyTopics: [
      "deception",
      "unfairness",
      "substantiation",
      "bias",
      "consumer harm",
      "AI marketing claims",
    ],
    relatedSlugs: ["white-house-ai-bill-of-rights", "nist-ai-rmf"],
    officialUrl: "https://www.ftc.gov/business-guidance/blog/2023/02/keep-your-ai-claims-check",
  },
  {
    slug: "canada-aida",
    title: "Artificial Intelligence and Data Act",
    shortTitle: "Canada AIDA",
    recordType: "law",
    jurisdiction: "Canada",
    publisher: "Parliament of Canada",
    status: "published",
    categories: ["laws", "regulations", "risk-management", "international"],
    summary:
      "A proposed Canadian legislative framework intended to regulate high-impact artificial intelligence systems.",
    whyItMatters:
      "It reflects Canada's developing approach to accountability, risk mitigation, monitoring, transparency, and enforcement for high-impact AI.",
    keyTopics: [
      "high-impact systems",
      "risk mitigation",
      "monitoring",
      "transparency",
      "recordkeeping",
      "enforcement",
    ],
    relatedSlugs: ["eu-ai-act", "nist-ai-rmf", "oecd-ai-principles"],
    officialUrl: "https://www.parl.ca/legisinfo/en/bill/44-1/c-27",
  },
  {
    slug: "colorado-ai-act",
    title: "Colorado Artificial Intelligence Act",
    shortTitle: "Colorado AI Act",
    recordType: "law",
    jurisdiction: "Colorado, United States",
    publisher: "Colorado General Assembly",
    status: "adopted",
    categories: ["laws", "state-law", "high-risk-ai", "consumer-protection"],
    summary:
      "A state law governing developers and deployers of high-risk artificial intelligence systems used in consequential decisions.",
    whyItMatters:
      "It establishes duties related to reasonable care, risk management, impact assessments, notices, disclosures, and algorithmic discrimination.",
    keyTopics: [
      "high-risk AI",
      "consequential decisions",
      "algorithmic discrimination",
      "impact assessment",
      "consumer notice",
      "developer duties",
    ],
    relatedSlugs: ["eu-ai-act", "nist-ai-rmf", "nyc-local-law-144"],
    officialUrl: "https://leg.colorado.gov/bills/sb24-205",
  },
  {
    slug: "nyc-local-law-144",
    title: "New York City Local Law 144 on Automated Employment Decision Tools",
    shortTitle: "NYC Local Law 144",
    recordType: "law",
    jurisdiction: "New York City, United States",
    publisher: "New York City",
    status: "active",
    categories: ["laws", "employment", "audit", "automated-decisions"],
    summary:
      "A local law regulating certain automated employment decision tools used in hiring and promotion decisions.",
    whyItMatters:
      "It requires bias audits and candidate or employee notices before covered tools are used.",
    keyTopics: [
      "employment AI",
      "bias audit",
      "candidate notice",
      "promotion",
      "hiring",
      "automated decision tools",
    ],
    relatedSlugs: ["colorado-ai-act", "white-house-ai-bill-of-rights"],
    officialUrl: "https://www.nyc.gov/site/dca/about/automated-employment-decision-tools.page",
  },
  {
    slug: "gdpr-automated-decision-making",
    title: "General Data Protection Regulation and Automated Decision-Making",
    shortTitle: "GDPR Automated Decisions",
    recordType: "law",
    jurisdiction: "European Union",
    publisher: "European Union",
    status: "active",
    categories: ["laws", "privacy", "data-governance", "automated-decisions"],
    summary:
      "European data-protection requirements governing personal data processing, profiling, transparency, and certain solely automated decisions.",
    whyItMatters:
      "AI systems processing personal data must address lawful basis, purpose limitation, data rights, safeguards, and decision transparency.",
    keyTopics: [
      "personal data",
      "profiling",
      "automated decisions",
      "lawful basis",
      "data subject rights",
      "transparency",
    ],
    relatedSlugs: ["eu-ai-act", "oecd-ai-principles"],
    officialUrl: "https://eur-lex.europa.eu/eli/reg/2016/679/oj",
  },
  {
    slug: "owasp-top-10-llm",
    title: "OWASP Top 10 for Large Language Model Applications",
    shortTitle: "OWASP Top 10 for LLMs",
    recordType: "guidance",
    jurisdiction: "International",
    publisher: "OWASP Foundation",
    status: "published",
    categories: ["security", "testing", "generative-ai", "guidance"],
    summary:
      "A community-developed list of significant security risks affecting applications built with large language models.",
    whyItMatters:
      "It provides practical threat categories that governance, development, testing, and assurance teams can use when evaluating LLM applications.",
    keyTopics: [
      "prompt injection",
      "sensitive information disclosure",
      "supply chain",
      "data poisoning",
      "excessive agency",
      "insecure output handling",
    ],
    relatedSlugs: ["nist-ai-600-1", "mitre-atlas", "nist-ai-rmf"],
    officialUrl: "https://genai.owasp.org/llm-top-10/",
  },
  {
    slug: "mitre-atlas",
    title: "MITRE ATLAS",
    shortTitle: "MITRE ATLAS",
    recordType: "framework",
    jurisdiction: "International",
    publisher: "MITRE",
    status: "published",
    categories: ["security", "threat-modeling", "testing", "frameworks"],
    summary:
      "A knowledge base of adversary tactics and techniques targeting machine-learning and AI systems.",
    whyItMatters:
      "It supports threat modeling, red teaming, security testing, control design, and incident analysis for AI-enabled systems.",
    keyTopics: [
      "adversarial machine learning",
      "threat tactics",
      "attack techniques",
      "red teaming",
      "security controls",
      "incident analysis",
    ],
    relatedSlugs: ["owasp-top-10-llm", "nist-ai-rmf", "nist-ai-600-1"],
    officialUrl: "https://atlas.mitre.org/",
  },
  {
    slug: "coso-erm",
    title: "COSO Enterprise Risk Management Framework",
    shortTitle: "COSO ERM",
    recordType: "framework",
    jurisdiction: "International",
    publisher: "Committee of Sponsoring Organizations of the Treadway Commission",
    status: "published",
    categories: ["frameworks", "enterprise-governance", "risk-management"],
    summary:
      "An enterprise risk management framework integrating risk with strategy and organizational performance.",
    whyItMatters:
      "It helps organizations connect AI risk to enterprise objectives, governance, performance, review, and reporting.",
    keyTopics: [
      "strategy",
      "performance",
      "governance",
      "risk appetite",
      "review",
      "reporting",
    ],
    relatedSlugs: ["iso-31000", "nist-ai-rmf", "iso-iec-42001"],
    officialUrl: "https://www.coso.org/erm-framework",
  },
  {
    slug: "un-guiding-principles-business-human-rights",
    title: "United Nations Guiding Principles on Business and Human Rights",
    shortTitle: "UNGPs",
    recordType: "principle",
    jurisdiction: "International",
    publisher: "United Nations",
    status: "adopted",
    categories: ["principles", "human-rights", "due-diligence", "governance"],
    summary:
      "A global framework defining state duties and corporate responsibilities regarding business-related human-rights impacts.",
    whyItMatters:
      "AI governance programs can use human-rights due diligence to identify affected groups, prevent harm, and provide remedy.",
    keyTopics: [
      "human rights",
      "due diligence",
      "impact assessment",
      "remedy",
      "corporate responsibility",
      "affected stakeholders",
    ],
    relatedSlugs: ["unesco-ai-ethics", "oecd-ai-principles", "eu-ai-act"],
    officialUrl: "https://www.ohchr.org/sites/default/files/documents/publications/guidingprinciplesbusinesshr_en.pdf",
  },
  {
    slug: "ieee-7000",
    title: "IEEE 7000 Model Process for Addressing Ethical Concerns During System Design",
    shortTitle: "IEEE 7000",
    recordType: "standard",
    jurisdiction: "International",
    publisher: "IEEE Standards Association",
    status: "published",
    categories: ["standards", "ethics", "design", "lifecycle"],
    summary:
      "A standard process for identifying and addressing ethical values and concerns during system and software design.",
    whyItMatters:
      "It operationalizes value-based design by connecting stakeholder concerns to system requirements and lifecycle decisions.",
    keyTopics: [
      "ethical values",
      "stakeholders",
      "system design",
      "requirements",
      "value-based engineering",
      "lifecycle",
    ],
    relatedSlugs: ["unesco-ai-ethics", "iso-iec-42001", "nist-ai-rmf"],
    officialUrl: "https://standards.ieee.org/ieee/7000/6781/",
  },
  {
    slug: "ta14-admissible-execution",
    title: "TA-14 Admissible Execution Architecture",
    shortTitle: "TA-14 Admissible Execution",
    recordType: "architecture",
    jurisdiction: "Architecture",
    publisher: "TA-14 Authority",
    status: "foundational",
    categories: [
      "architecture",
      "runtime-governance",
      "execution-control",
      "evidence",
    ],
    summary:
      "An evidence-bound governance architecture that determines whether a proposed action is admissible before execution and preserves the resulting outcome evidence.",
    whyItMatters:
      "It extends governance beyond policy, documentation, and approval by applying a pre-execution gate with ALLOW, HOLD, DENY, and ESCALATE outcomes.",
    keyTopics: [
      "admissibility",
      "evidence before intervention",
      "runtime governance",
      "execution control",
      "continuity",
      "outcome evidence",
    ],
    relatedSlugs: [
      "nist-ai-rmf",
      "iso-iec-42001",
      "eu-ai-act",
      "ta14-reality-record-continuity-chain",
    ],
  },
  {
    slug: "ta14-reality-record-continuity-chain",
    title: "TA-14 Reality-to-Outcome Governance Chain",
    shortTitle: "TA-14 Governance Chain",
    recordType: "architecture",
    jurisdiction: "Architecture",
    publisher: "TA-14 Authority",
    status: "foundational",
    categories: [
      "architecture",
      "evidence",
      "continuity",
      "runtime-governance",
    ],
    summary:
      "A governance chain expressed as Reality, Record, Continuity, Admissibility, Binding, Commit, Execution, and Outcome.",
    whyItMatters:
      "It defines the sequence required to move from observed reality to controlled execution while preserving authority, evidence, and outcome accountability.",
    keyTopics: [
      "reality",
      "record",
      "continuity",
      "admissibility",
      "binding",
      "execution outcome",
    ],
    relatedSlugs: ["ta14-admissible-execution", "nist-ai-rmf", "iso-iec-42001"],
  },
];

export default foundationalGovernanceRecords;
