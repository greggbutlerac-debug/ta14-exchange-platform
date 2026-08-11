import { TA14_PUBLIC_CORPUS, type CorpusRecord } from './corpus-merged';
import {
  AUTOMATEDBUILDINGS_CORPUS_RECORDS,
  MEDIUM_CORPUS_RECORDS,
  PATENT_CORPUS_RECORDS,
  ZENODO_ARCHITECTURE_RECORDS,
} from './corpus-supplement';
import { TA14_ZENODO_STANDARDS } from './zenodo-standards';

export type IntegritySeverity = 'PASS' | 'INFO' | 'WARN' | 'FAIL';

export type IntegrityFinding = {
  id: string;
  severity: IntegritySeverity;
  title: string;
  detail: string;
  recordIds?: string[];
};

export type IntegritySourceCoverage = {
  source: string;
  expected: number;
  represented: number;
  missing: number;
  status: IntegritySeverity;
};

function normUrl(value?: string) {
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

function normIdentifier(value?: string) {
  return (value ?? '')
    .trim()
    .toLowerCase()
    .replace(/^doi:\s*/, '')
    .replace(/^https?:\/\/(dx\.)?doi\.org\//, '')
    .replace(/\s+/g, ' ');
}

function normTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ');
}

function sourceIdentity(record: CorpusRecord) {
  if (record.category === 'ARTICLE' && record.href) return `article:url:${normUrl(record.href)}`;
  if ((record.category === 'PATENT' || record.category === 'ZENODO' || record.category === 'BOOK') && record.identifier) return `${record.category.toLowerCase()}:identifier:${normIdentifier(record.identifier)}`;
  if (record.href) return `${record.category.toLowerCase()}:url:${normUrl(record.href)}`;
  return `${record.category.toLowerCase()}:title:${normTitle(record.title)}:${record.year}`;
}

function coverage(source: string, sourceRecords: CorpusRecord[]): IntegritySourceCoverage {
  const corpusIdentities = new Set(TA14_PUBLIC_CORPUS.map(sourceIdentity));
  const represented = sourceRecords.filter((record) => corpusIdentities.has(sourceIdentity(record))).length;
  const missing = sourceRecords.length - represented;
  return {
    source,
    expected: sourceRecords.length,
    represented,
    missing,
    status: missing === 0 ? 'PASS' : represented === 0 ? 'FAIL' : 'WARN',
  };
}

const standardsAsZenodo: CorpusRecord[] = TA14_ZENODO_STANDARDS.map((record) => ({
  id: `integrity-zenodo-standard-${record.id}`,
  category: 'ZENODO',
  title: record.title,
  date: record.uploaded,
  year: Number(record.uploaded.slice(0, 4)),
  author: 'Greggory Don Butler',
  platform: 'Zenodo',
  status: 'PUBLIC_RECORD',
  identifier: record.doi,
  href: record.recordUrl,
}));

const standardsAsProtocols: CorpusRecord[] = TA14_ZENODO_STANDARDS.map((record) => ({
  id: `integrity-standard-${record.id}`,
  category: 'STANDARD',
  title: record.title,
  date: record.uploaded,
  year: Number(record.uploaded.slice(0, 4)),
  author: 'Greggory Don Butler',
  platform: 'TA-14 / Zenodo',
  status: 'PUBLISHED',
  identifier: record.doi,
  href: record.recordUrl,
}));

export const SOURCE_COVERAGE: IntegritySourceCoverage[] = [
  coverage('Medium', MEDIUM_CORPUS_RECORDS),
  coverage('AutomatedBuildings.com', AUTOMATEDBUILDINGS_CORPUS_RECORDS),
  coverage('Patent filings', PATENT_CORPUS_RECORDS),
  coverage('Zenodo architecture deposits', ZENODO_ARCHITECTURE_RECORDS),
  coverage('Zenodo standards deposits', standardsAsZenodo),
  coverage('TA-14 standards & protocols', standardsAsProtocols),
];

function duplicateFindings() {
  const groups = new Map<string, CorpusRecord[]>();
  for (const record of TA14_PUBLIC_CORPUS) {
    const identity = sourceIdentity(record);
    const group = groups.get(identity) ?? [];
    group.push(record);
    groups.set(identity, group);
  }

  return [...groups.entries()]
    .filter(([, records]) => records.length > 1)
    .map(([identity, records]) => ({
      id: `duplicate-${identity}`,
      severity: 'FAIL' as IntegritySeverity,
      title: 'Duplicate public record identity',
      detail: `${records.length} records resolve to the same canonical publication identity: ${records.map((record) => record.title).join(' / ')}`,
      recordIds: records.map((record) => record.id),
    }));
}

function requiredFieldFindings() {
  const findings: IntegrityFinding[] = [];
  for (const record of TA14_PUBLIC_CORPUS) {
    const missing: string[] = [];
    if (!record.title?.trim()) missing.push('title');
    if (!record.year) missing.push('year');
    if (!record.status) missing.push('status');

    if (record.category === 'ARTICLE' && !record.href) missing.push('public URL');
    if (record.category === 'BOOK' && !record.identifier) missing.push('ASIN/identifier');
    if (record.category === 'PATENT' && !record.identifier) missing.push('application identifier');
    if (record.category === 'ZENODO' && !record.identifier && !record.href) missing.push('DOI or Zenodo URL');
    if (record.category === 'STANDARD' && !record.identifier) missing.push('standard DOI/identifier');
    if ((record.category === 'REPOSITORY' || record.category === 'SITE' || record.category === 'IMPLEMENTATION') && !record.href) missing.push('public URL');

    if (missing.length) {
      findings.push({
        id: `missing-${record.id}`,
        severity: missing.some((field) => ['title', 'year', 'status', 'application identifier'].includes(field)) ? 'FAIL' : 'WARN',
        title: `${record.title || record.id}: incomplete record`,
        detail: `Missing ${missing.join(', ')}.`,
        recordIds: [record.id],
      });
    }
  }
  return findings;
}

function suspiciousStateFindings() {
  const findings: IntegrityFinding[] = [];
  for (const record of TA14_PUBLIC_CORPUS) {
    if (record.category === 'ARTICLE' && record.status === 'PUBLISHED' && !record.href) {
      findings.push({ id: `published-article-no-url-${record.id}`, severity: 'WARN', title: 'Published article has no public URL', detail: record.title, recordIds: [record.id] });
    }
    if (record.category === 'PATENT' && record.status !== 'FILED' && record.status !== 'PUBLIC_RECORD') {
      findings.push({ id: `patent-state-${record.id}`, severity: 'WARN', title: 'Patent record uses an unexpected status', detail: `${record.title} is marked ${record.status}.`, recordIds: [record.id] });
    }
    if (record.category === 'ZENODO' && record.platform?.toLowerCase() !== 'zenodo') {
      findings.push({ id: `zenodo-platform-${record.id}`, severity: 'INFO', title: 'Zenodo category has non-Zenodo platform label', detail: `${record.title}: ${record.platform ?? 'no platform'}.`, recordIds: [record.id] });
    }
  }
  return findings;
}

const sourceCoverageFindings: IntegrityFinding[] = SOURCE_COVERAGE.filter((item) => item.missing > 0).map((item) => ({
  id: `coverage-${item.source}`,
  severity: item.status,
  title: `${item.source} source coverage incomplete`,
  detail: `${item.represented} of ${item.expected} source records are represented in the merged public corpus; ${item.missing} remain unresolved.`,
}));

export const INTEGRITY_FINDINGS: IntegrityFinding[] = [
  ...duplicateFindings(),
  ...sourceCoverageFindings,
  ...requiredFieldFindings(),
  ...suspiciousStateFindings(),
];

export const INTEGRITY_COUNTS = INTEGRITY_FINDINGS.reduce(
  (acc, finding) => {
    acc[finding.severity] += 1;
    return acc;
  },
  { PASS: 0, INFO: 0, WARN: 0, FAIL: 0 } as Record<IntegritySeverity, number>,
);

export const CORPUS_HEALTH_SCORE = Math.max(
  0,
  Math.round(
    100 -
      INTEGRITY_COUNTS.FAIL * 8 -
      INTEGRITY_COUNTS.WARN * 3 -
      INTEGRITY_COUNTS.INFO * 0.5,
  ),
);

export const CORPUS_HEALTH_STATE: IntegritySeverity =
  INTEGRITY_COUNTS.FAIL > 0 ? 'FAIL' : INTEGRITY_COUNTS.WARN > 0 ? 'WARN' : 'PASS';
