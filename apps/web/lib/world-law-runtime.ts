import { globalR1Instruments } from './world-law-global-r1';
import { globalR2Instruments } from './world-law-global-r2';
import { instruments as baseInstruments, jurisdictions as baseJurisdictions } from './world-law-catalog';
import type { JurisdictionNode, WorldLawInstrument } from './world-law-catalog';

export type { LawLayer, OfficialSource, WorldLawInstrument, JurisdictionNode } from './world-law-catalog';

// R2 jurisdiction admission is runtime-additive so the production-proven R1 catalog
// remains intact. EU member states inherit both GLOBAL and EU layers.
const r2Jurisdictions: JurisdictionNode[] = [
  {code:'DE',name:'Germany',label:'Germany',x:55,y:35,layer:'NATIONAL',parent:'EU'},
  {code:'FR',name:'France',label:'France',x:51,y:37,layer:'NATIONAL',parent:'EU'},
  {code:'NZ',name:'New Zealand',label:'New Zealand',x:91,y:82,layer:'NATIONAL',parent:'GLOBAL'},
];

export const jurisdictions: JurisdictionNode[] = [...baseJurisdictions, ...r2Jurisdictions];

export function jurisdictionChain(code:string){
  const chain:JurisdictionNode[]=[];
  let current=jurisdictions.find(jurisdiction=>jurisdiction.code===code);
  const seen=new Set<string>();
  while(current && !seen.has(current.code)){
    chain.unshift(current);
    seen.add(current.code);
    current=current.parent ? jurisdictions.find(jurisdiction=>jurisdiction.code===current?.parent) : undefined;
  }
  return chain;
}

// Runtime admission is explicit: the production-proven base catalog plus the
// source-controlled multinational sets. Do not infer applicability from geography.
export const instruments: WorldLawInstrument[] = [...baseInstruments, ...globalR1Instruments, ...globalR2Instruments];

export function findInstrument(slug:string){
  return instruments.find(instrument=>instrument.slug===slug);
}

export function applicableInstruments(code:string){
  const admittedCodes=new Set(jurisdictionChain(code).map(jurisdiction=>jurisdiction.code));
  return instruments.filter(instrument=>admittedCodes.has(instrument.jurisdictionCode));
}
