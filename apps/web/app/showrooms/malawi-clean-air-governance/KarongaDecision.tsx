'use client';
import {useState} from 'react';
const options=['ALLOW','HOLD','DENY','ESCALATE'] as const;
export default function KarongaDecision(){
 const [evidence,setEvidence]=useState(false),[authority,setAuthority]=useState(false),[standing,setStanding]=useState(false),[scope,setScope]=useState(false),[choice,setChoice]=useState<string|null>(null);
 const ready=evidence&&authority&&standing&&scope;
 const status=ready?'A bounded ALLOW may be examined; permission is not issued by this demo.':'HOLD: one or more prerequisites are not established. Do not execute.';
 return <section style={{padding:'28px 0',borderTop:'1px solid #244050'}}>
 <p style={{color:'#efc56b',fontWeight:900}}>ILLUSTRATIVE PRACTITIONER PRESSURE TEST</p>
 <h2 style={{fontFamily:'Georgia,serif',fontSize:38}}>The Karonga decision</h2>
 <p style={{lineHeight:1.7}}>Hypothetical scenario: a district team proposes a bounded school air-quality intervention after reported PM2.5 concerns. No actual Malawi measurement, authorization, or government decision is represented.</p>
 <p>For each item, check only what the hypothetical decision record has actually established:</p>
 {[
 ['Admissible evidence','Raw observation, instrument context, provenance, uncertainty and relevance are documented.'],
 ['Applicable authority','The specific local legal or institutional decision power is documented.'],
 ['Established standing','The person or entity making this decision has documented standing.'],
 ['Bounded execution scope','Action, responsible actor, conditions, duration and verification are specified.']
 ].map(([label,detail],i)=>{const checked=[evidence,authority,standing,scope][i];const setter=[setEvidence,setAuthority,setStanding,setScope][i];return <label key={label} style={{display:'flex',gap:12,alignItems:'flex-start',padding:'14px 0',borderBottom:'1px solid #244050',cursor:'pointer'}}><input type="checkbox" checked={checked} onChange={ev=>{setter(ev.target.checked);setChoice(null)}} style={{marginTop:6}}/><span><strong>{label}</strong><br/><span style={{color:'#b3c8d4'}}>{detail}</span></span></label>})}
 <p role="status" style={{marginTop:20,padding:18,border:'1px solid #496477',borderRadius:10,color:'#efc56b'}}>{status}</p>
 <p>Select a disposition for the hypothetical record:</p>
 <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{options.map(option=><button key={option} type="button" onClick={()=>setChoice(option)} style={{cursor:'pointer',border:'1px solid #5b8299',borderRadius:8,padding:'12px 18px',color:'#fff',background:choice===option?'#215b74':'#0b273a'}}>{option}</button>)}</div>
 {choice&&<p role="status" style={{padding:18,background:'#0a2335',borderRadius:10,lineHeight:1.7}}><strong>{choice}</strong> — {choice==='ALLOW'?(ready?'All four demonstration prerequisites were marked established. Any real authorization still requires a competent local actor and preserved decision record.':'Unsupported: ALLOW cannot be justified while prerequisites remain missing.'):choice==='HOLD'?'Pause the proposed action pending the missing evidence, authority, standing, or scope.':choice==='DENY'?'A denial requires an affirmative basis, not merely incomplete information. Preserve the reason and responsible authority.':'Refer unresolved authority, jurisdiction, or high-consequence questions to the competent body; preserve the referral.'}</p>}
 <p style={{fontSize:13,color:'#a9beca'}}>Educational simulation only. This tool does not grant or verify legal permission to act.</p>
 </section>
}