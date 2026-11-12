import type {ReactNode} from 'react';

type DiagramKind = 'tesp' | 'component-drop' | 'airflow' | 'guided-practice' | 'independent-practice';

const diagrams: Record<DiagramKind, {title:string;description:string;labels:string[];note:string}> = {
  tesp: {
    title:'External static pressure — conceptual measurement boundary',
    description:'Schematic, not a drilling or probe-placement instruction. Verify the actual equipment configuration, manufacturer test points and safe access before measuring.',
    labels:['RETURN SIDE','AIR HANDLER / COIL','SUPPLY SIDE'],
    note:'Record signed return and supply static pressures relative to the same reference. Calculate total external static pressure according to manufacturer-defined measurement boundaries.'
  },
  'component-drop': {
    title:'Component pressure drop — two-point comparison',
    description:'Measure on opposite sides of the same component with consistent instrument reference and operating conditions.',
    labels:['UPSTREAM TAP','FILTER / COIL / COMPONENT','DOWNSTREAM TAP'],
    note:'The pressure difference describes the measured component under current conditions. Compare with the applicable manufacturer specification; pressure drop alone does not identify a failed component.'
  },
  'guided-practice': {
    title:'Guided practice — collect, compare, and qualify evidence',
    description:'This browser-based exercise is a teaching simulation, not immersive VR or a verified field record.',
    labels:['OPERATING STATE','PRESSURE / TEMP / RH','SUPPORTED FINDING'],
    note:'Use the guided prompts to establish the system state, collect distinct airflow and moisture observations, then identify what remains unverified. No DDD or intervention authority is issued.'
  },
  'independent-practice': {
    title:'Independent performance exercise — evidence before conclusions',
    description:'Make your own evidence decisions before submitting. Feedback is local and no credential or field record is created.',
    labels:['FIELD CONTEXT','MEASURED EVIDENCE','BOUNDARY DECISION'],
    note:'Distinguish observations from defensible conclusions. Missing evidence calls for further examination, not an unsupported charge or component-replacement decision.'
  },
  airflow: {
    title:'Airflow estimation — area and representative velocity',
    description:'A conceptual duct cross-section and measurement plane, not a substitute for an approved traverse method.',
    labels:['DUCT SECTION','MEASUREMENT PLANE','AIRFLOW DIRECTION'],
    note:'Estimated CFM = representative average velocity (ft/min) × measured area (ft²). Point velocity, turbulence, geometry and traverse quality affect whether that estimate is defensible.'
  }
};

export default function AirEvidenceDiagram({kind}:{kind:DiagramKind}){
  const item=diagrams[kind];
  const isPractice=kind==='guided-practice'||kind==='independent-practice';
  const caption=(children:ReactNode)=><span style={{color:'#cce0e9',fontSize:13,lineHeight:1.6}}>{children}</span>;
  return <figure style={{margin:'0 0 28px',padding:'clamp(14px,3vw,24px)',background:'#06121a',border:'1px solid #173746',borderRadius:16}}>
    <figcaption style={{fontWeight:800,color:'#efc86c',marginBottom:8}}>{item.title}</figcaption>
    <p style={{color:'#b9cbd3',lineHeight:1.7,margin:'0 0 16px'}}>{item.description}</p>
    <svg viewBox="0 0 800 250" role="img" aria-label={item.title} style={{display:'block',width:'100%',height:'auto',background:'#081c27',borderRadius:12}}>
      <defs><marker id={'arrow-'+kind} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="#70dcff"/></marker></defs>
      <rect x="50" y="75" width="700" height="110" rx="10" fill="#0c2b3b" stroke="#7bafd4" strokeWidth="3"/>
      <rect x="320" y="75" width="160" height="110" fill="#284b55" stroke="#efc86c" strokeWidth="3"/>
      <path d="M95 130 H280 M510 130 H700" stroke="#70dcff" strokeWidth="5" markerEnd={'url(#arrow-'+kind+')'}/>
      <path d="M270 66 V34 M530 66 V34" stroke="#efc86c" strokeWidth="3" strokeDasharray="6 5"/>
      <circle cx="270" cy="66" r="7" fill="#efc86c"/><circle cx="530" cy="66" r="7" fill="#efc86c"/>
      <text x="190" y="22" fill="#edf5f8" fontSize="16" textAnchor="middle">{item.labels[0]}</text>
      <text x="400" y="131" fill="#edf5f8" fontSize="15" textAnchor="middle">{item.labels[1]}</text>
      <text x="615" y="22" fill="#edf5f8" fontSize="16" textAnchor="middle">{item.labels[2]}</text>
      <text x="400" y="221" fill="#a9bdc6" fontSize="14" textAnchor="middle">{isPractice?'Conceptual evidence sequence · not to scale':'Conceptual airflow path · not to scale'}</text>
    </svg>
    <p style={{margin:'16px 0 0'}}>{caption(item.note)}</p>
  </figure>;
}
