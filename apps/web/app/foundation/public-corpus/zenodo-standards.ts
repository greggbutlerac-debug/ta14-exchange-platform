export type ZenodoStandardRecord = {
  id: string;
  shortName: string;
  title: string;
  version: string;
  uploaded: string;
  recordUrl: string;
  doi: string;
  relationship: string;
};

export const TA14_ZENODO_STANDARDS: ZenodoStandardRecord[] = [
  {
    id: 'ta14-las',
    shortName: 'TA14-LAS',
    title: 'TA-14 Living Authority Standard (TA14-LAS) A Constitutional Standard for Living Authority, Protected Consequence, and Outcome Closure',
    version: '1.0.0',
    uploaded: '2026-07-14',
    recordUrl: 'https://zenodo.org/records/21364604',
    doi: '10.5281/zenodo.21364604',
    relationship: 'Constitutional foundation for living authority and the TA-14 standards family.',
  },
  {
    id: 'ta14-cag',
    shortName: 'TA14-CAG',
    title: 'TA-14 Continuous Admissibility Governance (TA14-CAG) A Constitutional Standard for the Continuous Preservation of Living Authority',
    version: '1.0.0',
    uploaded: '2026-07-14',
    recordUrl: 'https://zenodo.org/records/21364756',
    doi: '10.5281/zenodo.21364756',
    relationship: 'Defines continuous preservation and re-establishment of admissible authority over time.',
  },
  {
    id: 'ta14-rap',
    shortName: 'TA14-RAP',
    title: 'TA-14 Runtime Admissibility Protocol (TA14-RAP) Version 1.0.1: A Constitutional Runtime Protocol for Protected Consequence, Interoperability, and Verified Execution',
    version: '1.0.1',
    uploaded: '2026-07-14',
    recordUrl: 'https://zenodo.org/records/21365032',
    doi: '10.5281/zenodo.21365032',
    relationship: 'Defines interoperable runtime exchange, evaluation, reservation, commit, execution, observation, and replay of authority.',
  },
  {
    id: 'ta14-ccs',
    shortName: 'TA14-CCS',
    title: 'TA-14 Consequence Constitution Specification (TA14-CCS) Version 1.0.1: A Constitutional Language and Compiler Specification for Protected Consequence',
    version: '1.0.1',
    uploaded: '2026-07-14',
    recordUrl: 'https://zenodo.org/records/21365796',
    doi: '10.5281/zenodo.21365796',
    relationship: 'Defines deterministic machine-readable constitutional representation for protected consequence.',
  },
  {
    id: 'ta14-por',
    shortName: 'TA14-POR',
    title: 'TA-14 Proof of Restraint Standard (TA14-POR) Version 1.0.1: A Constitutional Standard for Verified Non-Execution, Protected Restraint, and Evidence-Bounded Non-Effect',
    version: '1.0.1',
    uploaded: '2026-07-15',
    recordUrl: 'https://zenodo.org/records/21366358',
    doi: '10.5281/zenodo.21366358',
    relationship: 'Defines bounded and independently verifiable proof of restraint and non-execution.',
  },
  {
    id: 'ta14-rvs',
    shortName: 'TA14-RVS',
    title: 'TA-14 Replay Verification Standard (TA14-RVS) Version 1.0.1: A Constitutional Standard for Independent Route Reconstruction, Deterministic Replay, and Verified Outcome Correspondence',
    version: '1.0.1',
    uploaded: '2026-07-15',
    recordUrl: 'https://zenodo.org/records/21373912',
    doi: '10.5281/zenodo.21373912',
    relationship: 'Defines independent reconstruction, replay, and verification of protected consequence from preserved evidence.',
  },
  {
    id: 'ta14-irrs',
    shortName: 'TA14-IRRS',
    title: 'TA-14 Independent Route Replay Reference Specification (TA14-IRRS) Version 1.0.2: A Reference Implementation Specification for Independent Replay Services, Deterministic Verification, and Public Verifier Operations',
    version: '1.0.2',
    uploaded: '2026-07-15',
    recordUrl: 'https://zenodo.org/records/21375883',
    doi: '10.5281/zenodo.21375883',
    relationship: 'Reference implementation specification for independent replay-verification services.',
  },
  {
    id: 'ta14-avp',
    shortName: 'TA14-AVP',
    title: 'TA-14 Authority Passport Protocol (TA14-AVP) Version 1.0.2: A Constitutional Protocol for Federated Authority Exchange, Local Re-establishment, and Protected Consequence',
    version: '1.0.2',
    uploaded: '2026-07-15',
    recordUrl: 'https://zenodo.org/records/21381796',
    doi: '10.5281/zenodo.21381796',
    relationship: 'Defines bounded federated transport of authority context without transferring execution authority.',
  },
  {
    id: 'ta14-reg',
    shortName: 'TA14-REG',
    title: 'TA-14 Registry and Namespace Governance Standard (TA14-REG) Version 1.0.2: A Constitutional Standard for Canonical Meaning, Namespace Authority, Historical Resolution, and Registry Continuity',
    version: '1.0.2',
    uploaded: '2026-07-15',
    recordUrl: 'https://zenodo.org/records/21384015',
    doi: '10.5281/zenodo.21384015',
    relationship: 'Preserves canonical meaning, identifiers, namespaces, registry history, and semantic continuity.',
  },
  {
    id: 'ta14-conf',
    shortName: 'TA14-CONF',
    title: 'TA-14 Conformance, Assurance, and Certification Standard (TA14-CONF) Version 1.0.2: A Constitutional Standard for Evidence-Bound Conformance, Independent Assurance, Recognition, and Certification',
    version: '1.0.2',
    uploaded: '2026-07-16',
    recordUrl: 'https://zenodo.org/records/21385975',
    doi: '10.5281/zenodo.21385975',
    relationship: 'Defines evidence-bound conformance, independent assurance, certification decisions, lifecycle governance, and public reliance.',
  },
];
