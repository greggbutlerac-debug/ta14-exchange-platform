import type { CorpusRecord } from './corpus';

const standard = (id: string, title: string, record: string, doi: string): CorpusRecord => ({
  id: `standard-${id}`,
  category: 'STANDARD',
  title,
  year: 2026,
  author: 'Greggory Don Butler',
  platform: 'Zenodo',
  status: 'PUBLISHED',
  identifier: doi,
  href: `https://zenodo.org/records/${record}`,
  relationship: 'Published member of the TA-14 standards family, preserved through a persistent Zenodo record and DOI.',
  tags: ['TA-14 standards family', 'standard', id.toUpperCase()],
});

export const TA14_STANDARDS_CORPUS: CorpusRecord[] = [
  standard('las','TA-14 Living Authority Standard (TA14-LAS) A Constitutional Standard for Living Authority, Protected Consequence, and Outcome Closure','21364604','10.5281/zenodo.21364604'),
  standard('cag','TA-14 Continuous Admissibility Governance (TA14-CAG) A Constitutional Standard for the Continuous Preservation of Living Authority','21364756','10.5281/zenodo.21364756'),
  standard('rap','TA-14 Runtime Admissibility Protocol (TA14-RAP) Version 1.0.1: A Constitutional Runtime Protocol for Protected Consequence, Interoperability, and Verified Execution','21365032','10.5281/zenodo.21365032'),
  standard('ccs','TA-14 Consequence Constitution Specification (TA14-CCS) Version 1.0.1: A Constitutional Language and Compiler Specification for Protected Consequence','21365796','10.5281/zenodo.21365796'),
  standard('por','TA-14 Proof of Restraint Standard (TA14-POR) Version 1.0.1: A Constitutional Standard for Verified Non-Execution, Protected Restraint, and Evidence-Bounded Non-Effect','21366358','10.5281/zenodo.21366358'),
  standard('rvs','TA-14 Replay Verification Standard (TA14-RVS) Version 1.0.1: A Constitutional Standard for Independent Route Reconstruction, Deterministic Replay, and Verified Outcome Correspondence','21373912','10.5281/zenodo.21373912'),
  standard('irrs','TA-14 Independent Route Replay Reference Specification (TA14-IRRS) Version 1.0.2: A Reference Implementation Specification for Independent Replay Services, Deterministic Verification, and Public Verifier Operations','21375883','10.5281/zenodo.21375883'),
  standard('avp','TA-14 Authority Passport Protocol (TA14-AVP) Version 1.0.2: A Constitutional Protocol for Federated Authority Exchange, Local Re-establishment, and Protected Consequence','21381796','10.5281/zenodo.21381796'),
  standard('reg','TA-14 Registry and Namespace Governance Standard (TA14-REG) Version 1.0.2: A Constitutional Standard for Canonical Meaning, Namespace Authority, Historical Resolution, and Registry Continuity','21384015','10.5281/zenodo.21384015'),
  standard('conf','TA-14 Conformance, Assurance, and Certification Standard (TA14-CONF) Version 1.0.2: A Constitutional Standard for Evidence-Bound Conformance, Independent Assurance, Recognition, and Certification','21385975','10.5281/zenodo.21385975'),
];
