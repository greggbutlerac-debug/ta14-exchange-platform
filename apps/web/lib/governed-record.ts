export type GovernedRecordClass =
  | 'AIR'
  | 'PAIR'
  | 'BUILDING'
  | 'ENVIRONMENTAL'
  | 'HVAC'
  | 'LABORATORY'
  | 'HEALTHCARE'
  | 'WATER'
  | 'LAND'
  | 'SOIL'
  | 'FINANCIAL'
  | 'AI_ROUTE'
  | 'CUSTOM';

export type GovernedRecordDecision =
  | 'ALLOW'
  | 'HOLD'
  | 'DENY'
  | 'ESCALATE';

export interface GovernedRecordReference {
  id: string;
  label: string;
  recordClass: GovernedRecordClass;
  subject: string;
  period: string;
  decision: GovernedRecordDecision;
  summary: string;
}

export interface GovernedInterpreterModule {
  id: string;
  name: string;
  version: string;
  ruleset: string;
}

export interface GovernedInterpretationBoundary {
  supported: string[];
  possible: string[];
  unsupported: string[];
  missingEvidence: string[];
  nextSteps: string[];
}

export interface GovernedInterpretationResult {
  record: GovernedRecordReference;
  module: GovernedInterpreterModule;
  boundary: GovernedInterpretationBoundary;
}
