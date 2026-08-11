import type { CorpusRecord } from './corpus-merged';

export type ClassifiedCorpusFamilyId =
  | 'CORE'
  | 'EVIDENCE'
  | 'ENVIRONMENT'
  | 'HVACDR'
  | 'AI'
  | 'HUMAN'
  | 'STANDARDS'
  | 'PATENTS'
  | 'PUBLIC';

const includesAny = (text: string, terms: string[]) => terms.some((term) => text.includes(term));

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

const HUMAN = [
  'human intervention',
  'human performance',
  'guided human',
  'human execution',
  'operator',
  'human task',
];

const ENVIRONMENT = [
  'environmental integrity',
  'atmospheric integrity',
  'atmospheric memory',
  'air quality',
  'air pollution',
  'pair',
  'personal atmospheric',
  'environmental exposure',
  'psychrometric',
  'governing air',
];

const HVACDR = [
  'hvac',
  'hvacdr',
  'hvacd/r',
  'refrigerant',
  'airflow',
  'epa 608',
  'commissioning',
  'dehumidification',
  'superheat',
  'subcooling',
  'charging discipline',
  'technician',
];

const AI = [
  'ai governance',
  'eu ai act',
  'artificial intelligence',
  'agentic',
  'agent verification',
  'governed ai',
  'mission control',
  'ai infrastructure',
];

const EVIDENCE = [
  'evidence governance',
  'evidence integrity',
  'admissible evidence',
  'admissible reality',
  'admissible records',
  'admissible continuity',
  'reliance governance',
  'non-occurrence',
  'replay verification',
  'proof of restraint',
  'record formation',
  'continuity architecture',
];

const CORE = [
  'admissible execution architecture',
  'ta-14 admissible execution',
  'admissible before execution',
  'binding governance',
  'commit governance',
  'execution governance architecture',
  'outcome governance architecture',
  'consequence formation governance',
  'admissible memory',
  'admissible egress',
  'authority governance architecture',
  'legitimacy governance architecture',
  'attachment / assent',
  'binding reality',
  'commit reality',
  'execution reality',
  'outcome reality',
];

export function getPrimaryFamily(record: CorpusRecord): ClassifiedCorpusFamilyId {
  if (record.category === 'PATENT') return 'PATENTS';
  if (record.category === 'STANDARD') return 'STANDARDS';

  const text = haystack(record);

  // Strong, domain-specific signals take precedence over general TA-14 vocabulary.
  if (includesAny(text, HUMAN)) return 'HUMAN';
  if (includesAny(text, ENVIRONMENT)) return 'ENVIRONMENT';
  if (includesAny(text, HVACDR)) return 'HVACDR';
  if (includesAny(text, AI)) return 'AI';
  if (includesAny(text, EVIDENCE)) return 'EVIDENCE';
  if (includesAny(text, CORE)) return 'CORE';

  // Institutional implementations and repositories default to the parent architecture
  // unless a more specific domain signal above establishes another primary family.
  if (record.category === 'IMPLEMENTATION' || record.category === 'REPOSITORY' || record.category === 'CHRONOLOGY') {
    return 'CORE';
  }

  // Zenodo deposits are architecture records by default when not captured by a
  // more specific architecture family above.
  if (record.category === 'ZENODO') return 'CORE';

  // Public-facing books, essays, and sites with no stronger architecture signal
  // remain in the public/institutional record family.
  return 'PUBLIC';
}

export function recordMatchesPrimaryFamily(record: CorpusRecord, familyId: ClassifiedCorpusFamilyId) {
  return getPrimaryFamily(record) === familyId;
}

export function getRelatedFamilies(record: CorpusRecord): ClassifiedCorpusFamilyId[] {
  const primary = getPrimaryFamily(record);
  const text = haystack(record);
  const related = new Set<ClassifiedCorpusFamilyId>();

  if (primary !== 'HUMAN' && includesAny(text, HUMAN)) related.add('HUMAN');
  if (primary !== 'ENVIRONMENT' && includesAny(text, ENVIRONMENT)) related.add('ENVIRONMENT');
  if (primary !== 'HVACDR' && includesAny(text, HVACDR)) related.add('HVACDR');
  if (primary !== 'AI' && includesAny(text, AI)) related.add('AI');
  if (primary !== 'EVIDENCE' && includesAny(text, EVIDENCE)) related.add('EVIDENCE');
  if (primary !== 'CORE' && (includesAny(text, CORE) || text.includes('ta-14'))) related.add('CORE');

  if (primary !== 'STANDARDS' && (record.category === 'ZENODO' || text.includes('standard') || text.includes('protocol'))) {
    related.add('STANDARDS');
  }

  if (primary !== 'PUBLIC' && ['ARTICLE', 'BOOK', 'SITE'].includes(record.category)) {
    related.add('PUBLIC');
  }

  return Array.from(related);
}

export function recordMatchesRelatedFamily(record: CorpusRecord, familyId: ClassifiedCorpusFamilyId) {
  return getRelatedFamilies(record).includes(familyId);
}
