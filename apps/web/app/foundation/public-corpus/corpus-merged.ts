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

const standardZen