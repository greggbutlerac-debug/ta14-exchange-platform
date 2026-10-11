type DiagramProps={number:string;title:string;copy:string};
const stages=['REALITY','RECORD','CONTINUITY','ADMISSIBILITY','BINDING','COMMIT','EXECUTION','OUTCOME'];
const lessons:Record<string,{heading:string;detail:string}[]>={
'00':[
{heading:'OBSERVE REALITY',detail:'Air, people, place and conditions'},
{heading:'PRESERVE EVIDENCE',detail:'Source-linked atmospheric records'},
{heading:'ESTABLISH AUTHORITY',detail:'Local jurisdiction and standing'},
{heading:'VERIFY CONSEQUENCE',detail:'Bounded action and new reality'}],
'01':[
{heading:'START WITH AIR',detail:'People and conditions exist first'},
{heading:'LOCATE THE SETTING',detail:'Community, exposure and sources'},
{heading:'SEPARATE CLAIMS',detail:'Observed vs reported vs inferred'},
{heading:'FRAME THE QUESTION',detail:'What should a sensor establish?'}],
'02':[
{heading:'IDENTIFY THE SENSOR',detail:'Instrument, site and timestamp'},
{heading:'CHECK ITS CONTEXT',detail:'Calibration, limits, uncertainty'},
{heading:'PRESERVE RAW DATA',detail:'Keep the original observation'},
{heading:'TEST RELEVANCE',detail:'Does it support this decision?'}],
'03':[
{heading:'LINK PROVENANCE',detail:'Source, instrument, time, context'},
{heading:'MAINTAIN CONTINUITY',detail:'Track transfer and transformations'},
{heading:'SEPARATE VALUES',detail:'Raw and adjusted stay distinct'},
{heading:'ENABLE RECONSTRUCTION',detail:'Document method and uncertainty'}],
'04':[
{heading:'DECLARE PURPOSE',detail:'Evidence for which proposition?'},
{heading:'SEPARATE INFERENCE',detail:'A reading is not a conclusion'},
{heading:'CHECK LIMITS',detail:'Uncertainty and counterevidence'},
{heading:'DO NOT AUTHORIZE',detail:'Inference cannot grant permission'}],
'05':[
{heading:'NAME THE ACTION',detail:'Exact consequence and jurisdiction'},
{heading:'IDENTIFY THE RULE',detail:'Applicable law or delegation'},
{heading:'ESTABLISH STANDING',detail:'Who has decision rights locally?'},
{heading:'HOLD WITHOUT PROOF',detail:'Capability is not authority'}],
'06':[
{heading:'STATE THE PROPOSAL',detail:'Hypothetical Karonga school action'},
{heading:'EXAMINE EVIDENCE',detail:'Fit for this specific decision?'},
{heading:'VERIFY LOCAL RIGHTS',detail:'Competent actor and jurisdiction'},
{heading:'DISPOSE OR REFER',detail:'HOLD or ESCALATE if unresolved'}],
'07':[
{heading:'ALLOW',detail:'Evidence + authority + bounded scope'},
{heading:'HOLD',detail:'A prerequisite is unestablished'},
{heading:'DENY',detail:'Document affirmative refusal basis'},
{heading:'ESCALATE',detail:'Refer to a competent authority'}],
'08':[
{heading:'OBSERVE OUTCOME',detail:'Do not presume the action worked'},
{heading:'COMPARE TO BASELINE',detail:'Preserve methods and uncertainty'},
{heading:'REVALIDATE AUTHORITY',detail:'Changed conditions may require HOLD'},
{heading:'RETURN TO REALITY',detail:'Outcome begins the next cycle'}]
};
export default function TeachingDiagram({number,title,copy}:DiagramProps){
 const index=Math.max(0,Math.min(7,Number(number)-1));
 const items=lessons[number]||lessons['00'];
 const gate=number==='00'?'GOVERNED CONSEQUENCE':stages[index];
 return <figure style={{margin:0,border:'1px solid #31536a',borderRadius:16,overflow:'hidden',background:'#061927'}}>
 <svg viewBox="0 0 1100 720" role="img" aria-labelledby={'diagram-title-'+number+' diagram-desc-'+number} style={{display:'block',width:'100%',height:'auto'}}>
 <title id={'diagram-title-'+number}>{title}: four numbered teaching sections</title>
 <desc id={'diagram-desc-'+number}>{items.map((item,i)=>(i+1)+'. '+item.heading+'. '+item.detail).join(' ')}</desc>
 <defs><linearGradient id={'bg'+number} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#08263c"/><stop offset="1" stopColor="#041019"/></linearGradient></defs>
 <rect width="1100" height="720" fill={'url(#bg'+number+')'}/>
 <text x="55" y="61" fill="#efc56b" fontSize="18" fontWeight="bold" letterSpacing="3">TA14 · MALAWI 2026 · INDEPENDENT TEACHING VISUAL</text>
 <text x="55" y="124" fill="#f5f9fc" fontSize={title.length>31?31:39} fontWeight="bold">{title.toUpperCase()}</text>
 <line x1="55" x2="1045" y1="158" y2="158" stroke="#46718b" strokeWidth="2"/>
 {items.map((item,i)=>{const x=55+(i%2)*505,y=185+Math.floor(i/2)*203;return <g key={item.heading}>
 <rect x={x} y={y} width="475" height="178" rx="16" fill="#0c2e43" stroke="#54788c" strokeWidth="2"/>
 <circle cx={x+49} cy={y+49} r="28" fill="#efc56b"/>
 <text x={x+49} y={y+57} textAnchor="middle" fill="#071927" fontSize="23" fontWeight="bold">{i+1}</text>
 <text x={x+92} y={y+56} fill="#f8fbfe" fontSize="22" fontWeight="bold">{item.heading}</text>
 <text x={x+25} y={y+115} fill="#c6e2ee" fontSize="19">{item.detail}</text>
 <text x={x+25} y={y+151} fill="#8dc4d7" fontSize="15">EVIDENCE BEFORE CONSEQUENCE</text>
 </g>})}
 <rect x="55" y="612" width="990" height="64" rx="12" fill="#16475c" stroke="#efc56b" strokeWidth="2"/>
 <text x="80" y="651" fill="#ffe3a0" fontSize="21" fontWeight="bold">TA14 GATE: {gate}</text>
 <text x="55" y="704" fill="#aac5d3" fontSize="14">HYPOTHETICAL · NO MALAWI FIELD RECORD · NO LOCAL AUTHORIZATION OR ENDORSEMENT IMPLIED</text>
 </svg>
 <figcaption style={{padding:'16px 22px',color:'#c4d5df',lineHeight:1.65}}>Four numbered teaching sections accompany Samantha's narration. <strong style={{color:'#eac47a'}}>Governance gate: {gate}.</strong> {copy}</figcaption>
 </figure>;
}
