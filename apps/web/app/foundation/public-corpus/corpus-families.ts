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