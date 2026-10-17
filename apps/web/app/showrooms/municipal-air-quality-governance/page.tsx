'use client';
import {useState} from 'react';
import Link from 'next/link';
const lessons=[
['01','Existing inputs','Ambient monitors, local sensors, asset identifiers, timestamps, calibration records, location, units and provenance. TA14 does not itself measure pollution.'],
['02','Legal applicability','Identify the jurisdiction, pollutant, regulated entity, applicable standard or permit, and responsible agency. Ambient standards do not automatically create an indoor building obligation.'],
['03','Reality and record','Preserve raw readings separately from modeled exposure, adjusted values, alerts and causal hypotheses. Record each transformation and source.'],
['04','Continuity and admissibility','Evaluate traceability, quality assurance, calibration, representativeness, completeness and fitness for the proposed decision.'],
['05','Authority and standing','Identify actor, capacity, standing basis and authority relationship. A threshold alert cannot grant a controller municipal powers.'],
['06','Binding and commit','Bind a proposed action to the specific asset, location, legal basis, evidence, approver, time window and safety constraints.'],
['07','Execution and safeguards','Allow only bounded authorized commands. Preserve operator override, emergency procedures and stop conditions.'],
['08','Outcome and accountability','Verify actual response, environmental results, residual uncertainty and independently reviewable records. A command log alone is not proof of improved air.']
];
const scenarios=[
{label:'Uncalibrated roadside sensor',facts:'An elevated PM2.5 alert comes from a roadside sensor whose calibration and siting records are unavailable. A citywide traffic restriction is proposed.',decision:'HOLD',reason:'The proposed high-impact action lacks adequate evidence quality and a documented competent decision-maker.',next:'Obtain QA and siting records; corroborate measurements; identify the lawful traffic authority.'},
{label:'Authorized investigation',facts:'A validated monitor records an exceedance; a municipal analyst proposes a bounded inspection under an identified internal delegation.',decision:'ALLOW — BOUNDED',reason:'Only the investigation is permitted in this illustrative scenario, assuming the delegation and current evidence are verified.',next:'Log assignment, inspection scope, evidence package and expiration; reassess before any physical restriction.'},
{label:'AI requests ventilation shutdown',facts:'A predictive model proposes shutting ventilation at a city-operated shelter. The model carries an authorized:true field but no verified delegation.',decision:'ESCALATE',reason:'Self-asserted permission is not established standing. Occupant health and building safety require competent review.',next:'Identify facility operator, applicable safety obligations, responsible authority and safer alternatives.'},
{label:'Outside municipal jurisdiction',facts:'A city dashboard proposes commanding privately operated industrial equipment without a demonstrated statutory, contractual or emergency basis.',decision:'DENY',reason:'The proposed actor has no established authority over the asset in the stated facts.',next:'Refer to the responsible regulator or owner through an appropriate legal process.'}
];
export default function MunicipalAirGovernance(){
 const [selected,setSelected]=useState(0);
 const s=scenarios[selected];
 return <main style={{background:'#071622',color:'#eef7fa',minHeight:'100vh',fontFamily:'Arial,sans-serif'}}>
 <div style={{maxWidth:1120,margin:'auto',padding:'42px 24px 90px'}}>
 <Link href="/showrooms" style={{color:'#80e0df'}}>← All showrooms</Link>
 <p style={{letterSpacing:2,fontSize:12,color:'#91d9d5',marginTop:42}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · INDEPENDENT MUNICIPAL TEACHING DEMONSTRATION</p>
 <h1 style={{fontSize:'clamp(36px,6vw,70px)',lineHeight:1.08,maxWidth:960,margin:'20px 0'}}>The City Can Measure.<br/><span style={{color:'#80e0df'}}>Who Authorizes the Response?</span></h1>
 <p style={{fontSize:20,lineHeight:1.6,maxWidth:780,color:'#c3d4dd'}}>Municipal Air Quality: From Legal Obligation to Authorized Action. A modular governance pathway for cities and asset owners—starting with data they may already possess.</p>
 <div style={{border:'1px solid #436476',padding:20,borderRadius:12,margin:'30px 0',color:'#d0e2e9'}}>CONCEPT ONLY · NO MUNICIPAL ENDORSEMENT · NO FORMAL EXAMINATION OR LEGAL DETERMINATION. All scenarios and dispositions are hypothetical. TA14 does not replace regulatory interpretation, certified monitoring, emergency response or qualified operators.</div>
 <section style={{margin:'48px 0',padding:'28px 24px',border:'1px solid #3d6e7b',borderRadius:18,background:'#0b2330'}}>
 <p style={{letterSpacing:2,fontSize:12,color:'#80e0df'}}>THE OWNER'S BUSINESS CASE</p>
 <h2 style={{fontSize:30}}>Three components. One accountable consequence.</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
 {[
 ['01 · CITY INPUTS','Existing monitors, building systems, inspection records, permits, responsible agencies and documented policies.','What already exists'],
 ['02 · TA14 GOVERNANCE','Evidence provenance and fitness, applicable authority, established standing, bounded approval, execution and outcome records.','What TA14 adds'],
 ['03 · OWNER VALUE','Traceable decisions, visible evidence gaps, clearer responsibilities, more defensible interventions and repeatable accountability.','What can be evaluated']
 ].map(([eyebrow,body,heading])=><div key={eyebrow} style={{background:'#133645',borderRadius:12,padding:20}}><span style={{fontSize:12,color:'#80e0df'}}>{eyebrow}</span><h3>{heading}</h3><p style={{lineHeight:1.65,color:'#d0e0e7'}}>{body}</p></div>)}
 </div>
 <p style={{fontSize:14,color:'#b8d2dc',marginTop:22}}>Commercial hypothesis, not a demonstrated cost saving or legal defense. Any compliance or liability benefit requires jurisdiction-specific legal and operational validation.</p>
 </section>
 <h2>Eight examinations</h2>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(245px,1fr))',gap:14}}>
 {lessons.map(([n,t,d])=><article key={n} style={{padding:22,border:'1px solid #355466',borderRadius:14,background:'#102b3b'}}><b style={{color:'#7ee1db'}}>{n}</b><h3>{t}</h3><p style={{lineHeight:1.6,color:'#c8d9e0'}}>{d}</p></article>)}
 </div>
 <section style={{marginTop:64,padding:'32px 24px',border:'1px solid #3d6e7b',borderRadius:18,background:'#0e2835'}}>
 <p style={{color:'#82e1d9',letterSpacing:2}}>INTERACTIVE · HYPOTHETICAL</p><h2>Examine the proposed consequence</h2>
 <label htmlFor="case">Select a municipal scenario</label><select id="case" value={selected} onChange={e=>setSelected(Number(e.target.value))} style={{display:'block',width:'100%',padding:14,margin:'12px 0 25px',borderRadius:8,color:'#10212c'}}>{scenarios.map((v,i)=><option value={i} key={i}>{v.label}</option>)}</select>
 <p style={{fontSize:18,lineHeight:1.6}}>{s.facts}</p>
 <p style={{fontSize:13,color:'#a9c6d1'}}>ILLUSTRATIVE DISPOSITION — NOT A REAL AUTHORIZATION</p><h3 style={{fontSize:32,color:'#8fe4dc'}}>{s.decision}</h3>
 <p><strong>Why:</strong> {s.reason}</p><p><strong>Next accountable step:</strong> {s.next}</p>
 </section>
 <section style={{marginTop:55}}><h2>Commercial deployment: begin with one bounded route</h2><p style={{lineHeight:1.8,maxWidth:850}}>Inventory existing monitoring and asset records → identify the jurisdiction-specific legal or contractual obligation → verify evidence provenance → establish responsible authority and standing → examine one proposed intervention → preserve execution and outcome records. Integrate with existing city platforms where appropriate; no full technology-stack purchase is assumed.</p>
 <p style={{color:'#c3d4dd'}}>Legal reference families to research for each location include the U.S. Clean Air Act, EPA National Ambient Air Quality Standards, state implementation plans, applicable permits, state/local ordinances, and separately any workplace or indoor-air requirements. Applicability must be established case by case; this page makes no claim that any specific city is noncompliant.</p></section>
 <footer style={{marginTop:60,borderTop:'1px solid #355466',paddingTop:24,color:'#9ebcc9'}}>Reality → Record → Continuity → Admissibility → Binding → Commit → Execution → Outcome<br/>Capability ≠ Authority. No admissible evidence. No admissible execution.</footer>
 </div></main>;
}