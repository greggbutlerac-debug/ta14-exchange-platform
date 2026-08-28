import { globalR1Instruments } from './world-law-global-r1';
import { instruments as baseInstruments, jurisdictions, jurisdictionChain } from './world-law-catalog';
import type { WorldLawInstrument } from './world-law-catalog';

export type { LawLayer, OfficialSource, WorldLawInstrument, JurisdictionNode } from './world-law-catalog';
export { jurisdictions, jurisdictionChain };

// Runtime admission is explicit: the production-proven base catalog plus the
// source-controlled R1 multinational set. Do not infer applicability from geography.
export const instruments: WorldLawInstrument[] = [...baseInstruments, ...globalR1Instruments];

export function findInstrument(slug:string){
  return instruments.find(instrument=>instrument.slug===slug);
}

export function applicableInstruments(code:string){
  const admittedCodes=new Set(jurisdictionChain(code).map(jurisdiction=>jurisdiction.code));
  return instruments.filter(instrument=>admittedCodes.has(instrument.jurisdictionCode));
}
