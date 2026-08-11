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

function normalizeUrl(value?: string) {
  if (!value) return '';
  try {
    const url = new URL(value);
    url.hash = '';
    url.search = '';
    const path = url.pathname.replace(/\/+$/, '') || '/';
    return `${url.hostname.toLowerCase()}${path.toLowerCase()}`;
  } catch {
    return value.trim().replace(/\/+$/, '').toLowerCase();
  }
}

function normalizeIdentifier(value?: string) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^doi:\s*/, '')
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
    .replace(/\s+/g, ' ');
}

function normalizeTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ');
}

function publicationIdentity(record: CorpusRecord) {
  // Standards intentionally appear once as a standard and once as their Zenodo DOI deposit.
  const categoryNamespace = record.category === 'STANDARD' ? 'STANDARD' : record.category;

  if (record.category === 'ARTICLE' && record.href) {
    return `ARTICLE:url:${normalizeUrl(record.href)}`;
  }

  if ((record.category === 'PATENT' || record.category === 'ZENODO') && record.identifier) {
    return `${record.category}:identifier:${normalizeIdentifier(record.identifier)}`;
  }

  if (record.category === 'ZENODO' && record.href) {
    return `ZENODO:url:${normalizeUrl(record.href)}`;
  }

  if (record.category === 'BOOK' && record.identifier) {
    return `BOOK:identifier:${normalizeIdentifier(record.identifier)}`;
  }

  if ((record.category === 'REPOSITORY' || record.category === 'SITE' || record.category === 'IMPLEMENTATION') && record.href) {
    return `${record.category}:url:${normalizeUrl(record.href)}`;
  }

  return `${categoryNamespace}:fallback:${normalizeTitle(record.title)}:${record.year}`;
}

const recordsByIdentity = new Map<string, CorpusRecord>();

for (const record of mergedCandidates) {
  const identity = publicationIdentity(record);
  const existing = recordsByIdentity.get(identity);

  if (!existing) {
    recordsByIdentity.set(identity, record);
    continue;
  }

  // Prefer the richer record when the same publication exists in both the base ledger and a supplement.
  const existingScore = Number(Boolean(existing.identifier)) + Number(Boolean(existing.href)) + Number(Boolean(existing.description)) + Number(Boolean(existing.relationship)) + (existing.tags?.length ?? 0);
  const incomingScore = Number(Boolean(record.identifier)) + Number(Boolean(record.href)) + Number(Boolean(record.description)) + Number(Boolean(record.relationship)) + (record.tags?.length ?? 0);

  if (incomingScore > existingScore) {
    recordsByIdentity.set(identity, record);
  }
}

export const TA14_PUBLIC_CORPUS: CorpusRecord[] = Array.from(recordsByIdentity.values());

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
