'use client';
import {useState} from 'react';

type Choice = 'current'|'stale';
type Permission = 'valid'|'revoked';
type Restriction = 'active'|'clear';
type Standing = 'established'|'unresolved';
const events=[
 ['T0 14:00:00','Corridor permission issued','Issuer, scope and revocation conditions recorded'],
 ['T1 14:00:06','Edge attestation arrives','Claim verified within its own stated scope'],
 ['T2 14:00:11','Pedestrian enters crossing','Local restriction becomes active'],
 ['T3 14:00:12','Vehicle proposes movement','Current authority is re-examined'],
 ['T4 14:00:12','Governance HOLD','Insufficient basis for the proposed consequence'],
 ['T5 14:00:13','Local controller maintains safe behavior','Controller log is not proof of physical outcome'],
 ['T6 14:00:20','Conditions clear','New evaluation required before a future ALLOW']
] as const;
const label={display:'block',fontWeight:800,fontSize:12,color:'#a9ddec',marginBottom:8} as const;
const control={width:'100%',padding:'12px 14px',borderRadius:10,color:'#f0f9ff',background:'#102b39',border:'1px solid #376477',fontSize:15} as const;

export default function AuthorityLab(){
 const [att,setAtt]=useState<Choice>('current');
 const [permission,setPermission]=useState<Permission>('valid');
 const [restriction,setRestriction]=useState<Restriction>('active');
 const [standing,setStanding]=useState<Standing>('established');
 const [step,setStep]=useState(4);
 const status = permission==='revoked'?'DENY':restriction==='active'?'HOLD':att==='stale'?'HOLD':standing==='unresolved'?'ESCALATE':'ALLOW';
 const reason = permission==='revoked'?'An explicitly revoked corridor permission cannot support this movement.':restriction==='active'?'A current local restriction blocks reliance on earlier corridor permission.':att==='stale'?'Attestation freshness is insufficient for this hypothetical claim.':standing==='unresolved'?'The requester\'s standing needs examination by competent authority.':'All specified illustrative governance conditions are satisfied for this bounded proposal; independent safety constraints still apply.';
 const now='14:00:12';
 const copy='HYPOTHETICAL DECISION RECEIPT\\nProposal: VEH-017 at CROSSING-C4, '+now+'\\nAttestation: '+att+'\\nCorridor permission: '+permission+'\\nLocal restriction: '+restriction+'\\nRequester standing: '+standing+'\\nDisposition: '+status+'\\nReason: '+reason+'\\nPhysical execution: NOT DETERMINED by this receipt.\\nObserved outcome: NOT ESTABLISHED; independent observation required.';
 return <section id="authority-lab" style={{borderTop:'1px solid #375767',padding:'54px 0'}}>
  <p style={{fontSize:12,letterSpacing:2,color:'#6de5ea',fontWeight:900}}>INTERACTIVE PRESSURE TEST · EDUCATIONAL ONLY</p>
  <h2 style={{fontFamily:'Georgia,serif',fontSize:'clamp(30px,4vw,52px)',margin:'12px 0'}}>Can the vehicle proceed NOW?</h2>
  <p style={{lineHeight:1.7,color:'#b5cad5',fontSize:17,maxWidth:950}}>Change the hypothetical conditions. This transparent teaching rule demonstrates the separation between an attested claim, a corridor permission, local authority, and vehicle safety. It does not assess Jeffrey DeCoux's implementation or issue a real TA14 disposition.</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(245px,1fr))',gap:16,margin:'26px 0'}}>
   <label style={label}>Edge attestation<select aria-label="Edge attestation" value={att} onChange={e=>setAtt(e.target.value as Choice)} style={control}><option value="current">Current for stated claim</option><option value="stale">Stale</option></select></label>
   <label style={label}>Corridor permission<select aria-label="Corridor permission" value={permission} onChange={e=>setPermission(e.target.value as Permission)} style={control}><option value="valid">Valid in time window</option><option value="revoked">Revoked</option></select></label>
   <label style={label}>Local crossing restriction<select aria-label="Local crossing restriction" value={restriction} onChange={e=>setRestriction(e.target.value as Restriction)} style={control}><option value="active">Active</option><option value="clear">Clear</option></select></label>
   <label style={label}>Requester standing<select aria-label="Requester standing" value={standing} onChange={e=>setStanding(e.target.value as Standing)} style={control}><option value="established">Established for proposal</option><option value="unresolved">Unresolved</option></select></label>
  </div>
  <div aria-live="polite" style={{border:'1px solid #497185',background:'#0b202e',borderRadius:16,padding:24}}>
   <p style={{fontSize:12,letterSpacing:2,color:'#acd5e4',margin:0}}>ILLUSTRATIVE GOVERNANCE DISPOSITION</p>
   <h3 style={{fontSize:46,margin:'8px 0',color:status==='ALLOW'?'#7ee8d2':status==='DENY'?'#ff9a91':'#ffd58a'}}>{status}</h3>
   <p style={{fontSize:16,lineHeight:1.65}}>{reason}</p>
   <p style={{fontSize:13,color:'#a3bcca'}}>Decision priority in this teaching model: revoked permission → DENY; active restriction → HOLD; stale attestation → HOLD; unresolved standing → ESCALATE; otherwise → bounded illustrative ALLOW. Real systems require a complete applicable rule set and independent safety control.</p>
   <button onClick={()=>{setAtt('current');setPermission('valid');setRestriction('active');setStanding('established');setStep(4)}} style={{...control,width:'auto',cursor:'pointer',fontWeight:800}}>RESET SCENARIO</button>
  </div>
  <h3 style={{fontFamily:'Georgia,serif',fontSize:32,marginTop:48}}>The decision is not the physical outcome.</h3>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12}}>
   {['01 EDGE CLAIM','02 CORRIDOR CONTEXT','03 AFA FEDERATION','04 EABA LOCAL BOUNDARY','05 LOCAL CONTROLLER','06 OBSERVED OUTCOME'].map((x,i)=><div key={x} style={{border:'1px solid #2b4c5c',background:i===3?'#173c43':'#091c29',borderRadius:12,padding:16}}><b style={{fontSize:13,color:i===3?'#a0ffdb':'#b5dbe8'}}>{x}</b><p style={{fontSize:13,lineHeight:1.5,color:'#adbdc8'}}>{['Attested claim within defined trust scheme','Route permission and expiry metadata','Context crosses; execution authority does not','Current admissibility, authority and standing','Independent vehicle and crossing safety','Separate observations of what happened'][i]}</p></div>)}
  </div>
  <h3 style={{fontFamily:'Georgia,serif',fontSize:32,marginTop:48}}>T0–T6: The changing-condition sequence</h3>
  <div style={{display:'flex',gap:7,flexWrap:'wrap',margin:'20px 0'}}>{events.map((e,i)=><button key={e[0]} onClick={()=>setStep(i)} aria-pressed={step===i} style={{...control,width:'auto',cursor:'pointer',background:step===i?'#79e8d2':'#102b39',color:step===i?'#06212a':'#eff9ff',fontWeight:800}}>T{i}</button>)}</div>
  <div aria-live="polite" style={{border:'1px solid #325469',borderRadius:14,padding:23,background:'#0b202e'}}><b style={{color:'#79e8d2'}}>{events[step][0]}</b><h4 style={{fontSize:24,margin:'10px 0'}}>{events[step][1]}</h4><p style={{color:'#b6c8d3'}}>{events[step][2]}</p></div>
  <h3 style={{fontFamily:'Georgia,serif',fontSize:32,marginTop:48}}>Sample decision receipt</h3>
  <pre style={{whiteSpace:'pre-wrap',overflowWrap:'anywhere',fontSize:13,lineHeight:1.8,color:'#c4e5eb',padding:22,background:'#061620',border:'1px solid #355264',borderRadius:14}}>{copy.replaceAll('\\n','\n')}</pre>
  <button onClick={()=>navigator.clipboard?.writeText(copy.replaceAll('\\n','\n'))} style={{...control,width:'auto',cursor:'pointer'}}>COPY HYPOTHETICAL RECEIPT</button>
  <p style={{fontSize:13,color:'#aec5cf',lineHeight:1.7}}>This receipt records a proposal and educational evaluation, not actual controller enforcement or independent observation. Governance HOLD is not a braking command. Governance ALLOW never overrides functional-safety controls.</p>
 </section>;
}
