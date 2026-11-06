'use client';
import {useState} from 'react';

const narration=[
 'Welcome to Lesson 3.07, Temperature as Evidence. Temperature is one of the most familiar measurements in HVAC, and one of the easiest to interpret beyond what it actually proves.',
 'Start with the question: what temperature, at what location, at what time, under what operating condition, and from what instrument?',
 'A thermostat display is one source. A calibrated probe in the return air stream is another. A surface thermometer on a pipe or coil measures something different. These readings must not be treated as interchangeable.',
 'When we compare return and supply air temperatures, we must establish valid airside measurement points and a sufficiently stable operating state. A number recorded at a supply grille may be influenced by duct conditions and room air mixing.',
 'A temperature difference, sometimes called delta T, is calculated from two defined temperatures. In cooling mode, a common airside comparison is return dry-bulb temperature minus supply dry-bulb temperature.',
 'For example, if a properly documented return air measurement is seventy-seven degrees Fahrenheit and supply air is fifty-eight, the observed difference is nineteen degrees Fahrenheit.',
 'That nineteen-degree difference does not independently establish rated capacity. To estimate sensible heat transfer, we also need defensible airflow and the applicable air-property assumptions.',
 'Moisture matters too. A system can reduce dry-bulb temperature while the occupied space remains uncomfortably humid. Relative humidity depends on temperature and does not, by itself, tell us how much moisture the system has removed.',
 'Temperature probes need an appropriate measurement range, suitable placement, time to stabilize, and an understood verification or calibration status. An instrument reading without a known location or state is weak evidence.',
 'If the return and supply readings were taken at different times or different blower states, do not automatically combine them into a single performance claim. Preserve the individual readings and their limitations.',
 'Do not alter controls or move probes in ways that erase the original operating condition before documenting it. The technician gathers authentic evidence and explains what it supports.',
 'The HVAC Analyzer issues the formal DDD after the complete fourteen-step baseline is recorded and frozen. Neither a single temperature nor a delta T alone authorizes a repair or refrigerant-system entry.',
 'Your goal is to preserve temperature as attributable evidence, distinguish measurement from inference, and prepare for Lesson 3.08, where we examine sensible heat transfer.'
];
const concepts=[
 ['LOCATION','Identify return, supply, room, surface or another specific measurement point. Do not substitute one for another.'],
 ['INSTRUMENT','Record instrument type, suitability, verification status, probe placement and stabilization.'],
 ['OPERATING STATE','Document mode, blower condition, time and relevant control state for each measurement.'],
 ['SIGNED DIFFERENCE','For the defined cooling airside comparison, return dry-bulb minus supply dry-bulb gives a temperature difference.'],
 ['PERFORMANCE LIMIT','Delta T alone does not establish CFM, rated sensible capacity, moisture removal or the cause of a complaint.'],
 ['RECORD CONTINUITY','Preserve original readings, locations, time, units, instrument and limitations before interpretation.']
] as const;
const questions=[
 {q:'A thermostat shows 74°F. What does that establish?',o:['The entire building is uniformly 74°F','The displayed reading at that source; independent room and air-stream conditions remain to be established','The system is operating at rated capacity'],a:1,why:'A thermostat display does not represent every location or establish equipment performance.'},
 {q:'Return air is 77°F and supply air is 58°F at valid points in the same cooling state. What is the observed difference?',o:['19°F','135°F','−19°F for the defined return-minus-supply comparison'],a:0,why:'77 − 58 = 19°F for the stated cooling comparison.'},
 {q:'A 19°F delta T proves:',o:['The system has rated cooling capacity','The refrigerant charge is correct','Only the stated temperature difference; airflow and other evidence are needed for capacity'],a:2,why:'Temperature difference alone cannot establish total or sensible capacity.'},
 {q:'Which temperature record is most independently reviewable?',o:['“Supply feels cold”','“2:15 PM; cooling mode; return 77°F and supply 58°F dry bulb at identified points; probe and state documented”','“Cooling looks good”'],a:1,why:'Attribution requires time, state, points, instruments and units.'},
 {q:'If two temperatures were collected at different blower states, the technician should:',o:['Document the difference in state and avoid claiming one controlled delta T without validation','Average them and report the result','Treat the higher number as the return value regardless of location'],a:0,why:'The readings must be compatible in operating state and measurement context.'}
];
const panel={padding:24,border:'1px solid #173746',borderRadius:16,background:'#06121a'} as const;
const field={padding:12,background:'#02070c',border:'1px solid #285b78',color:'#edf5f8',borderRadius:8,width:'100%'} as const;
export default function Lesson307(){
 const [returnTemp,setReturnTemp]=useState('77'),[supplyTemp,setSupplyTemp]=useState('58'),[context,setContext]=useState('');
 const [answers,setAnswers]=useState<Record<number,number>>({}),[submitted,setSubmitted]=useState(false);
 const a=Number(returnTemp),b=Number(supplyTemp);
 const valid=returnTemp.trim()!==''&&supplyTemp.trim()!==''&&Number.isFinite(a)&&Number.isFinite(b);
 const score=questions.reduce((n,q,i)=>n+(answers[i]===q.a?1:0),0);
 return <div style={{display:'grid',gap:24,marginBottom:30}}>
 <section style={panel}><b style={{color:'#efc86c'}}>LEARNING OBJECTIVE</b><p style={{color:'#d6e7ed',lineHeight:1.8}}>Preserve dry-bulb temperature measurements with location, instrument and operating-state context; calculate a defined temperature difference without mistaking it for a complete performance determination.</p></section>
 <section style={panel}><b style={{color:'#efc86c'}}>SAMANTHA · FULL TEXT READ-ALONG</b><p style={{color:'#a9bdc6',fontSize:13}}>Written narration staged for review. Recorded audio and synchronized playback are not integrated.</p>{narration.map((p,i)=><p key={i} style={{color:'#d6e7ed',fontSize:17,lineHeight:1.9,margin:'20px 0'}}>{p}</p>)}</section>
 <section style={panel}><b style={{color:'#efc86c'}}>SIX TEMPERATURE EVIDENCE PRINCIPLES</b>{concepts.map((x,i)=><details key={i} style={{padding:'15px 0',borderBottom:'1px solid #173746'}}><summary style={{cursor:'pointer',fontWeight:800,color:'#70dcff'}}>{i+1}. {x[0]}</summary><p style={{color:'#d6e7ed',lineHeight:1.8}}>{x[1]}</p></details>)}</section>
 <section style={panel}><b style={{color:'#efc86c'}}>GUIDED COOLING DELTA T · SIMULATION</b><p style={{color:'#a9bdc6',lineHeight:1.8}}>Enter hypothetical return and supply dry-bulb temperatures in °F. The calculator demonstrates subtraction only; it does not verify probes, locations, stable operation or rated performance.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}><label style={{color:'#d6e7ed'}}>Return dry bulb (°F)<input type="number" step="0.1" style={field} value={returnTemp} onChange={e=>setReturnTemp(e.target.value)}/></label><label style={{color:'#d6e7ed'}}>Supply dry bulb (°F)<input type="number" step="0.1" style={field} value={supplyTemp} onChange={e=>setSupplyTemp(e.target.value)}/></label></div><p aria-live="polite" style={{fontSize:24,color:'#70dcff',fontWeight:900}}>{valid?'Return minus supply: '+(a-b).toFixed(1)+'°F':'Enter two valid temperatures'}</p><label style={{display:'grid',gap:8,color:'#d6e7ed'}}>What must be documented before interpreting this difference?<textarea rows={4} style={field} value={context} onChange={e=>setContext(e.target.value)} placeholder="Exact probe points, instrument verification, operating state, time, airflow evidence, limitations..."/></label><p style={{color:'#a9bdc6',fontSize:13}}>Local training inputs only. No measurement, grade or customer record is saved.</p></section>
 <section style={panel}><b style={{color:'#efc86c'}}>INDEPENDENT REVIEW · FIVE QUESTIONS</b>{questions.map((q,i)=><fieldset key={i} style={{border:0,borderTop:'1px solid #173746',padding:'20px 0'}}><legend style={{fontWeight:800,paddingTop:10}}>{i+1}. {q.q}</legend>{q.o.map((o,j)=><label key={j} style={{display:'flex',gap:12,padding:'9px 0',color:'#d6e7ed'}}><input type="radio" name={'m03-307-'+i} checked={answers[i]===j} disabled={submitted} onChange={()=>setAnswers(v=>({...v,[i]:j}))}/>{o}</label>)}{submitted&&<p style={{color:answers[i]===q.a?'#8fe0bf':'#efc86c'}}>{answers[i]===q.a?'SUPPORTED':'REVIEW REQUIRED'} — {q.why}</p>}</fieldset>)}{submitted?<><p style={{fontWeight:800}}>Practice score: {score} / {questions.length}</p><button onClick={()=>{setAnswers({});setSubmitted(false)}} style={{padding:12,cursor:'pointer'}}>RETRY</button></>:<button disabled={Object.keys(answers).length!==questions.length} onClick={()=>setSubmitted(true)} style={{padding:'12px 18px',borderRadius:10,background:'#7BAFD4',color:'#001426',fontWeight:900,cursor:'pointer',opacity:Object.keys(answers).length===questions.length?1:.5}}>CHECK ANSWERS</button>}<p style={{color:'#a9bdc6',fontSize:13}}>Practice feedback only. No credential, DDD or intervention authorization is issued.</p></section>
 <section style={panel}><b style={{color:'#70dcff'}}>HANDOFF → LESSON 3.08</b><p style={{color:'#a9bdc6',lineHeight:1.8}}>Next, connect verified airflow and temperature difference to an approximate sensible heat-transfer calculation while keeping moisture performance separate.</p></section>
 </div>;
}
