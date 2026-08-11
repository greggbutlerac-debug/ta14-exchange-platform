import type { CorpusRecord } from './corpus-merged';

export type CorpusFamilyId =
  | 'CORE'
  | 'EVIDENCE'
  | 'ENVIRONMENT'
  | 'HVACDR'
  | 'AI'
  | 'HUMAN'
  | 'STANDARDS'
  | 'PATENTS'
  | 'PUBLIC';

export type CorpusFamily = {
  id: CorpusFamilyId;
  code: string;
  title: string;
  description: string;
  keywords: string[];
};

export const CORPUS_FAMILIES: CorpusFamily[] = [
  {
    id: 'CORE',
    code: '01',
    title: 'TA-14 Core Architecture',
    description: 'The parent admissible-execution architecture, chronology, consequence governance, binding, commit, execution, outcome, memory, egress, and institutional lineage.',
    keywords: ['ta-14', 'admissible execution', 'binding', 'commit governance', 'execution governance', 'outcome governance', 'memory architecture', 'egress', 'consequence formation'],
  },
  {
    id: 'EVIDENCE',
    code: '02',
    title: 'Evidence, Reality & Reliance',
    description: 'Reality, record formation, evidence governance, admissibility, continuity, reliance, replay, non-occurrence, and proof boundaries.',
    keywords: ['evidence', 'reality', 'record', 'continuity', 'reliance', 'admissibility', 'non-occurrence', 'replay', 'proof'],
  },
  {
    id: 'ENVIRONMENT',
    code: '03',
    title: 'Environmental & Atmospheric Integrity',
    description: 'Environmental Integrity Governance, Atmospheric Integrity Records, PAIR, atmospheric memory, air pollution, buildings, exposure, and environmental evidence.',
    keywords: ['environmental', 'atmospheric', 'air ', 'air quality', 'pair', 'pollution', 'exposure', 'building', 'psychrometric'],
  },
  {
    id: 'HVACDR',
    code: '04',
    title: 'HVACDR Technical Lineage',
    description: 'The field-origin technical body of work: diagnostics, baselines, refrigerant governance, airflow, electricity, commissioning, psychrometrics, and post-intervention proof.',
    keywords: ['hvac', 'hvacdr', 'refrigerant', 'airflow', 'electricity', 'commissioning', 'technician', 'epa 608', 'charging', 'dehumidification'],
  },
  {
    id: 'AI',
    code: '05',
    title: 'AI Governance & Execution',
    description: 'AI governance, agents, consequential automation, EU AI Act analysis, execution control, mission control, agent verification, and governed physical action.',
    keywords: ['ai governance', 'agent', 'eu ai act', 'automation', 'execution control', 'mission control', 'artificial intelligence'],
  },
  {
    id: 'HUMAN',
    code: '06',
    title: 'Human Intervention & Performance',
    description: 'Governed human intervention, Human Performance Stack, guided task execution, protected consequence, and evidence-captured human action.',
    keywords: ['human intervention', 'human performance', 'guided human', 'operator', 'human execution'],
  },
  {
    id: 'STANDARDS',
    code: '07',
    title: 'Standards & Constitutional Protocols',
    description: 'LAS, CAG, RAP, CCS, POR, RVS, IRRS, AVP, REG, CONF, standards-family governance, and interoperable constitutional specifications.',
    keywords: ['ta14-las', 'ta14-cag', 'ta14-rap', 'ta14-ccs', 'ta14-por', 'ta14-rvs', 'ta14-irrs', 'ta14-avp', 'ta14-reg', 'ta14-conf', 'standard', 'protocol', 'conformance'],
  },
  {
    id: 'PATENTS',
    code: '08',
    title: 'Patent & Invention Lineage',
    description: 'Filed invention families covering proof-before-action diagnostics, environmental evidence, authority separation, AIR/PAIR, human execution, admissible state, and execution control.',
    keywords: ['patent', 'us 63/', 'us 64/', 'us 19/', 'filing', 'invention'],
  },
  {
    id: 'PUBLIC',
    code: '09',
    title: 'Public Commentary & Institutional Record',
    description: 'Medium, AutomatedBuildings.com, books, launch records, public explanations, civic publications, repositories, sites, and dated institutional milestones.',
    keywords: ['medium', 'automatedbuildings.com', 'public record', 'public article', 'launch', 'america at 250'],
  },
];

function haystack(record: CorpusRecord) {
  return [
    record.title,
    record.category,
    record.author,
    record.platform,
    record.identifier,
    record.description,
    record.relationship,
    record.sourceClass,
    ...(record.tags || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export function recordMatchesFamily(record: CorpusRecord, familyId: CorpusFamilyId) {
  if (familyId === 'PATENTS') return record.category === 'PATENT';
  if (familyId === 'STANDARDS') return record.category === 'STANDARD' || haystack(record).includes('ta14-');
  if (familyId === 'PUBLIC') return ['ARTICLE', 'BOOK', 'REPOSITORY', 'SITE', 'CHRONOLOGY'].includes(record.category);

  const family = CORPUS_FAMILIES.find((item) => item.id === familyId);
  if (!family) return false;
  const text = haystack(record);
  return family.keywords.some((keyword) => text.includes(keyword));
}

export const TA14_LINEAGE = [
  {
    date: '2025-05-01',
    era: 'FIELD ORIGIN',
    title: 'Evidence before intervention becomes public doctrine',
    detail: 'Transparent Air’s S.O.P. publicly anchors sequence, original-state record, baseline, threshold, declared diagnostic determination, intervention, and post-intervention proof.',
    family: 'HVACDR' as CorpusFamilyId,
  },
  {
    date: '2025–2026',
    era: 'GENERALIZATION',
    title: 'Proof-before-action expands beyond HVACDR',
    detail: 'The work separates reality, records, evidence, continuity, admissibility, authority, binding, commit, execution, and outcome as distinct governance conditions.',
    family: 'CORE' as CorpusFamilyId,
  },
  {
    date: '2026',
    era: 'ARCHITECTURE',
    title: 'TA-14 becomes a parent admissible-execution architecture',
    detail: 'Books, articles, Zenodo monographs, GitHub doctrine, and architecture families make the full route inspectable across multiple domains.',
    family: 'CORE' as CorpusFamilyId,
  },
  {
    date: '2026',
    era: 'ENVIRONMENT',
    title: 'Environmental reality becomes a governed evidence domain',
    detail: 'Environmental Integrity Governance, AIR, PAIR, atmospheric memory, refrigerant governance, and building evidence form a connected applied architecture.',
    family: 'ENVIRONMENT' as CorpusFamilyId,
  },
  {
    date: '2026',
    era: 'PROTECTION',
    title: 'The architecture develops a multi-family patent record',
    detail: 'Filed inventions move from diagnostics and refrigerant control into evidence integrity, authority separation, environmental chronology, guided human execution, admissible-state continuity, and execution control.',
    family: 'PATENTS' as CorpusFamilyId,
  },
  {
    date: '2026',
    era: 'STANDARDIZATION',
    title: 'TA-14 develops constitutional standards and protocols',
    detail: 'LAS, CAG, RAP, CCS, POR, RVS, IRRS, AVP, REG, CONF and the Standards Family Framework begin expressing the architecture as interoperable institutional specifications.',
    family: 'STANDARDS' as CorpusFamilyId,
  },
  {
    date: '2026',
    era: 'INSTITUTION',
    title: 'The TA-14 AI Governance Exchange turns doctrine into public infrastructure',
    detail: 'Governance registration, artifacts, reviews, verification, Academy pathways, public corpus, lineage, and governed progression move the work from publication into institutional operation.',
    family: 'AI' as CorpusFamilyId,
  },
];
