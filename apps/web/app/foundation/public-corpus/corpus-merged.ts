import {
  CORPUS_CATEGORY_LABELS,
  TA14_PUBLIC_CORPUS as BASE_CORPUS,
  type CorpusCategory,
  type CorpusRecord,
} from './corpus';
import {
  AUTOMATEDBUILDINGS_CORPUS_RECORDS,
  MEDIUM_CORPUS_RECORDS,
  PATENT_CORPUS_RECORDS,
  ZENODO_ARCHITECTURE_RECORDS,
} from './corpus-supplement';
import { TA14_ZENODO_STANDARDS } from './zenodo-standards';

export { CORPUS_CATEGORY_LABELS };
export type { CorpusCategory, CorpusRecord };

const standardZenodoRecords: CorpusRecord[] = TA14_ZENODO_STANDARDS.map((record) => ({
  id: `zenodo-standard-${record.id}`,
  category: 'ZENODO',
  title: record.title,
  date: record.uploaded,
  year: Number(record.uploaded.slice(0, 4)),
  author: 'Greggory Don Butler',
  platform: 'Zenodo',
  status: 'PUBLIC_RECORD',
  identifier: record.doi,
  href: record.recordUrl,
  relationship: record.relationship,
  sourceClass: 'Zenodo DOI deposit',
  tags: ['Zenodo', 'DOI', 'TA-14', record.shortName, `v${record.version}`],
}));

const standardProtocolRecords: CorpusRecord[] = TA14_ZENODO_STANDARDS.map((record) => ({
  id: `standard-${record.id}`,
  category: 'STANDARD',
  title: record.title,
  date: record.uploaded,
  year: Number(record.uploaded.slice(0, 4)),
  author: 'Greggory Don Butler',
  platform: 'TA-14 / Zenodo',
  status: 'PUBLISHED',
  identifier: record.doi,
  href: record.recordUrl,
  relationship: record.relationship,
  sourceClass: 'TA-14 standard or protocol',
  tags: ['TA-14 standard', record.shortName, `v${record.version}`],
}));

const mergedCandidates: CorpusRecord[] = [
  ...BASE_CORPUS,
  ...MEDIUM_CORPUS_RECORDS,
  ...AUTOMATEDBUILDINGS_CORPUS_RECORDS,
  ...PATENT_CORPUS_RECORDS,
  ...ZENODO_ARCHITECTURE_RECORDS,
  ...standardZenodoRecords,
  ...standardProtocolRecords,
];

const seen = new Set<string>();
export const TA14_PUBLIC_CORPUS: CorpusRecord[] = mergedCandidates.filter((record) => {
  if (seen.has(record.id)) return false;
  seen.add(record.id);
  return true;
});

export const CORPUS_TOTAL = TA14_PUBLIC_CORPUS.length;

export const CORPUS_COUNTS = TA14_PUBLIC_CORPUS.reduce<Record<CorpusCategory, number>>(
  (counts, record) => {
    counts[record.category] += 1;
    return counts;
  },
  {
    BOOK: 0,
    ARTICLE: 0,
    ZENODO: 0,
    PATENT: 0,
    STANDARD: 0,
    REPOSITORY: 0,
    SITE: 0,
    IMPLEMENTATION: 0,
    CHRONOLOGY: 0,
  },
);
