'use client';
import {useState} from 'react';

const narration=[
 'Welcome to Lesson 3.10, Relative Humidity, Dew Point and Context. We will connect measured temperature and relative humidity to a bounded estimate of dew point while preserving the distinction between observation and calculation.',
 'Relative humidity is a ratio describing the water-vapor condition relative to saturation at the same temperature. It is not the percentage of air made of water.',
 'Dew point is the temperature at which air would reach saturation if cooled without changing its water-vapor content at essentially constant pressure. Higher dew point generally means more water vapor is present at a comparable pressure.',
 'A room can have the same relative humidity at two different temperatures but different dew points and different moisture contents. That is why relative humidity alone is insufficient for a moisture-removal comparison.',
 'An air conditioner can deliver colder air at higher relative humidity while still removing water vapor. Evaluate entering and leaving conditions with temperature, relative humidity, pressure assumptions and a suitable psychrometric method.',
 'In this lesson the calculator uses a common Magnus-type approximation for dew point. It is an instructional estimate, not an instrument reading or a certified psychrometric analysis.',
 'First convert Fahrenheit to Celsius. Then use the temperature and relative humidity in the approximation, and convert the estimated dew point back to Fahrenheit. Keep the measured inputs separate from the computed output.',
 'The approximation has limits. It assumes ordinary moist-air conditions and a valid temperature and relative humidity measurement. Do not apply it blindly to extreme temperatures, condensation on sensors or unknown measurement conditions.',
 'Imagine a return-air sample at seventy-eight degrees Fahrenheit and sixty percent relative humidity, and a supply-air sample at fifty-eight degrees Fahrenheit and ninety percent relative humidity. The supply relative humidity is higher, but the supply dew point can be lower.',
 'That comparison illustrates why the two relative humidity percentages cannot independently prove whether moisture was added or removed. A properly supported humidity-ratio comparison is more direct for quantifying moisture removal.',
 'Dew point also helps explain condensation risk: a surface below the surrounding air dew point may accumulate moisture. Actual condensation depends on surface conditions, exposure and time.',
 'Record the sensor type, calibration or verification status, measurement point, time, operating state, stabilization and uncertainty. An unverified dew-point estimate is not a basis for a repair determination.',
 'The technician gathers authentic observations. The Analyzer issues the DDD only after the complete fourteen-step baseline is recorded and frozen. Neither a dew-point estimate nor a humidity complaint authorizes refrigerant entry.',
 'The purpose is not to generate an impressive number. It is to establish exactly what the evidence can support and what remains unknown.'
];
const principles=[
 ['RH IS TEMPERATURE-DEPENDENT','The same RH at different temperatures need not mean the same moisture content.'],
 ['DEW POINT IS DERIVED','The displayed dew point is calculated from entered temperature and RH, not directly measured by this exercise.'],
 ['PAIR THE INPUTS','Temperature and RH must represent the same air sample, place, time and operating state.'],
 ['COMPARE WITH CAUTION','A higher leaving-air RH does not prove higher leaving-air moisture content.'],
 ['SURFACE CONDENSATION','Surfaces below ambient-air dew point can be at risk of condensation; other conditions still matter.'],
 ['PRESERVE UNCERTAINTY','Document sensors, verification, location, state, limits and whether a comparison is only illustrative.']
] as const;
const questions=[
 {q:'What does relative humidity describe?',o:['The percentage of air that is liquid water','Water-vapor condition relative to saturation at the same temperature','The exact water mass per pound of dry air'],a:1,why:'RH is a relative saturation measure, not a direct humidity-ratio measurement.'},
 {q:'A computed dew point from temperature and RH is:',o:['A derived estimate dependent on input validity and model assumptions','A direct measurement by the calculator','Proof of latent capacity'],a:0,why:'The formula estimates dew point from measured or hypothetical inputs.'},
 {q:'Supply air has higher RH than return air. Which conclusion is justified?',o:['Supply air must contain more water vapor','The coil added water','RH alone cannot establish the direction of moisture-content change'],a:2,why:'Air temperature affects saturation and RH.'},
 {q:'When might a surface collect condensation?',o:['Whenever the surface is warmer than the air','When the surface is below the surrounding air dew point, given suitable conditions','Whenever RH is exactly 50%'],a:1,why:'Cooling air at a surface below its dew point can lead to condensation.'},
 {q:'Which evidence supports a defensible return/supply moisture comparison?',o:['Paired temperature and RH readings with verified locations, instruments and operating state','Two RH values with no temperatures','A thermostat RH reading alone'],a:0,why:'The paired conditions and their provenance must be established before interpretation.'}
];
const panel={padding:24,border:'1px solid #173746',borderRadius:16,background:'#06121a'} as const;
const field={padding:12,background:'#02070c',border:'1px solid #285b78',color:'#edf5f8',borderRadius:8,width:'100%'} as const;
function dewPointF(tempF:number,rh:number){
 const t=(tempF-32)*5/9;
 const a=17.625,b=243.04;
 const gamma=Math.log(rh/100)+(a*t)/(b+t);
 return ((b*gamma)/(a-gamma))*9/5+32;
}
export default function Lesson310(){
 const [returnT,setReturnT]=useState('78'),[returnRH,setReturnRH]=useState('60');
 const [supplyT,setSupplyT]=useState('58'),[supplyRH,setSupplyRH]=useState('90');
 const [notes,setNotes]=useState(''),[answers,setAnswers]=useState<Record<number,number>>({}),[submitted,setSubmitted]=useState(false);
 const inputs=[returnT,returnRH,supplyT,supplyRH],v=inputs.map(Number);
 const valid=inputs.every(x=>x.trim()!=='')&&v.every(Number.isFinite)&&v[1]>0&&v[1]<=100&&v[3]>0&&v[3]<=100&&v[0]>=-40&&v[0]<=140&&v[2]>=-40&&v[2]<=140;
 const score=questions.reduce((n,q,i)=>n+(answers[i]===q.a?1:0),0);
 return <div style={{display:'grid',gap:24,marginBottom:30}}>
 <section style={panel}><b style={{color:'#efc86c'}}>LEARNING OBJECTIVE</b><p style={{color:'#d6e7ed',lineHeight:1.8}}>Explain the relationship among dry-bulb temperature, relative humidity and dew point; compare paired hypothetical conditions without treating a derived estimate as a measured moisture-removal rate.</p></section>
 <section style={panel}><b style={{color:'#efc86c'}}>SAMANTHA · FULL TEXT READ-ALONG</b><p style={{color:'#a9bdc6',fontSize:13}}>Written narration for review. Recorded audio and synchronized playback are not integrated.</p>{narration.map((p,i)=><p key={i} style={{color:'#d6e7ed',fontSize:17,lineHeight:1.9,margin:'20px 0'}}>{p}</p>)}</section>
 <section style={panel}><b style={{color:'#efc86c'}}>SIX PSYCHROMETRIC INTERPRETATION PRINCIPLES</b>{principles.map((x,i)=><details key={i} style={{padding:'15px 0',borderBottom:'1px solid #173746'}}><summary style={{cursor:'pointer',fontWeight:800,color:'#70dcff'}}>{i+1}. {x[0]}</summary><p style={{color:'#d6e7ed',lineHeight:1.8}}>{x[1]}</p></details>)}</section>
 <section style={panel}><b style={{color:'#efc86c'}}>GUIDED DEW-POINT ESTIMATION · TWO AIR SAMPLES</b><p style={{color:'#a9bdc6',lineHeight:1.8}}>Illustrative Magnus approximation. Enter temperature and RH for each hypothetical sample. Valid input range for this training exercise: −40 to 140°F and RH greater than 0% through 100%. The estimates are not validated field measurements.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}><label style={{color:'#d6e7ed'}}>Return dry bulb (°F)<input type="number" step="0.1" style={field} value={returnT} onChange={e=>setReturnT(e.target.value)}/></label><label style={{color:'#d6e7ed'}}>Return RH (%)<input type="number" min="0.1" max="100" step="0.1" style={field} value={returnRH} onChange={e=>setReturnRH(e.target.value)}/></label><label style={{color:'#d6e7ed'}}>Supply dry bulb (°F)<input type="number" step="0.1" style={field} value={supplyT} onChange={e=>setSupplyT(e.target.value)}/></label><label style={{color:'#d6e7ed'}}>Supply RH (%)<input type="number" min="0.1" max="100" step="0.1" style={field} value={supplyRH} onChange={e=>setSupplyRH(e.target.value)}/></label></div><p aria-live="polite" style={{color:'#70dcff',fontSize:20,fontWeight:900,lineHeight:1.7}}>{valid?'Estimated return dew point: '+dewPointF(v[0],v[1]).toFixed(1)+'°F · Estimated supply dew point: '+dewPointF(v[2],v[3]).toFixed(1)+'°F':'Enter valid temperatures and RH values within the exercise limits'}</p><p style={{color:'#efc86c',lineHeight:1.7}}>Interpretation boundary: these derived dew points do not quantify latent BTU/h, water removal or equipment adequacy. A humidity-ratio comparison requires additional assumptions and a validated psychrometric method.</p><label style={{display:'grid',gap:8,color:'#d6e7ed'}}>Record observations, assumptions and unresolved evidence<textarea rows={5} style={field} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Measurement locations, instrument status, state, time, pressure assumptions, moisture-content comparison limits..."/></label><p style={{color:'#a9bdc6',fontSize:13}}>Inputs and notes are local practice only, not saved field evidence. Do not enter identifying customer data.</p></section>
 <section style={panel}><b style={{color:'#efc86c'}}>INDEPENDENT REVIEW · FIVE QUESTIONS</b>{questions.map((q,i)=><fieldset key={i} style={{border:0,borderTop:'1px solid #173746',padding:'20px 0'}}><legend style={{fontWeight:800,paddingTop:10}}>{i+1}. {q.q}</legend>{q.o.map((o,j)=><label key={j} style={{display:'flex',gap:12,padding:'9px 0',color:'#d6e7ed'}}><input type="radio" name={'m03-310-'+i} checked={answers[i]===j} disabled={submitted} onChange={()=>setAnswers(a=>({...a,[i]:j}))}/>{o}</label>)}{submitted&&<p style={{color:answers[i]===q.a?'#8fe0bf':'#efc86c'}}>{answers[i]===q.a?'SUPPORTED':'REVIEW REQUIRED'} — {q.why}</p>}</fieldset>)}{submitted?<><p style={{fontWeight:800}}>Practice score: {score} / {questions.length}</p><button onClick={()=>{setAnswers({});setSubmitted(false)}} style={{padding:12,cursor:'pointer'}}>RETRY</button></>:<button disabled={Object.keys(answers).length!==questions.length} onClick={()=>setSubmitted(true)} style={{padding:'12px 18px',borderRadius:10,background:'#7BAFD4',color:'#001426',fontWeight:900,cursor:'pointer',opacity:Object.keys(answers).length===questions.length?1:.5}}>CHECK ANSWERS</button>}<p style={{color:'#a9bdc6',fontSize:13}}>Practice only. No persisted grade, credential, DDD or intervention authorization.</p></section>
 <section style={panel}><b style={{color:'#70dcff'}}>HANDOFF → LESSON 3.11</b><p style={{color:'#a9bdc6',lineHeight:1.8}}>Next, examine sensible versus latent performance using bounded evidence and an air-conditioning case.</p></section>
 </div>;
}
