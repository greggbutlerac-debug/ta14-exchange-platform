'use client';
import {useState} from 'react';

type Scenario={key:string;label:string;icon:string;example:string;consequence:string;checkpoints:[string,string,string];next:string};
const scenarios:Scenario[]=[
 {key:'building',label:'Building systems',icon:'▣',example:'A building-management system recommends changing an HVAC setting after an overheating report.',consequence:'Change a physical system setpoint or dispatch an intervention.',checkpoints:['What source recorded the condition, when, and under what operating context?','Which owner, operator, policy or agreement governs the proposed change?','Which identified person or organization may authorize or carry out this action?'],next:'Describe the affected equipment or space and the proposed action. No measurements or private records are needed yet.'},
 {key:'ai',label:'AI or automation',icon:'◇',example:'An AI agent recommends an operational action after connecting information from multiple sources.',consequence:'Permit an automated recommendation to change a live system or workflow.',checkpoints:['Which observations are source records, and which statements were inferred by AI?','What execution rules and limits apply to this action now?','Who is accountable and has standing to approve the specific consequence?'],next:'Name the proposed automation and what real-world change it would produce.'},
 {key:'payment',label:'Construction or payment',icon:'▤',example:'A project team is being asked to approve a draw or release payment before all supporting records are settled.',consequence:'Approve or release a specific construction payment.',checkpoints:['What work, evidence and approvals are documented for this particular draw?','Which contract terms and authorization limits govern release?','Who can validly approve and commit this payment at this stage?'],next:'Describe the decision, amount only if appropriate, and which approvals are outstanding.'},
 {key:'assets',label:'Assets and portfolios',icon:'▦',example:'A portfolio dashboard identifies an asset problem and recommends a maintenance or capital decision.',consequence:'Authorize maintenance, replacement or a portfolio-level action.',checkpoints:['Is the asset identity, reported condition and underlying record sufficiently reliable?','Which asset owner, contract, budget and approval rules govern the decision?','Does the specific decision-maker have the capacity and standing for this asset?'],next:'Describe the asset class and one decision that is currently blocked.'},
 {key:'other',label:'Something else',icon:'?',example:'You have a proposed decision and cannot yet establish what would make it safe and accountable to proceed.',consequence:'A real-world decision with consequences for people, assets, funds or systems.',checkpoints:['What was observed, what was inferred and what is documented?','What law, policy, agreement or delegation might govern the consequence?','Which actor has the right to decide or execute in this context?'],next:'Tell us the outcome you want and the main obstacle preventing a decision.'}
];
const ink='#071522',mint='#9ce3d5';
export default function DecisionGuide(){
 const [choice,setChoice]=useState('building');
 const [stage,setStage]=useState(0);
 const [notes,setNotes]=useState('');
 const s=scenarios.find(v=>v.key===choice)||scenarios[0];
 const mail='mailto:ta14admissibleexecution@gmail.com?subject='+encodeURIComponent('TA14 Open Door — written fit inquiry ('+s.label+')')+'&body='+encodeURIComponent(['Hello TA14,','', 'I would like an introductory written discussion.','Area: '+s.label,'Proposed consequence: '+s.consequence,'My obstacle / context: '+(notes.trim()||'[Please describe briefly]'),'','Please advise whether a small, bounded examination could be useful.','I understand this is not a formal disposition, registration, payment, or approval.'].join('\n'));
 const btn=(on:boolean)=>({cursor:'pointer',textAlign:'left' as const,background:on?'#174b50':'#102a3a',color:'#f5fcff',border:on?'2px solid #9ce3d5':'1px solid #466777',borderRadius:12,padding:'15px 13px',fontWeight:700,fontSize:15});
 return <section id="decision-guide" aria-labelledby="decision-guide-title" style={{scrollMarginTop:24,background:'linear-gradient(145deg,#102e3c,#081e2c)',border:'1px solid #548187',borderRadius:20,padding:'clamp(22px,4vw,38px)',marginTop:38}}>
 <p style={{color:mint,fontSize:12,letterSpacing:2,fontWeight:800}}>START HERE · TWO-MINUTE INTRODUCTORY GUIDE</p>
 <h2 id="decision-guide-title" style={{fontSize:'clamp(27px,4vw,40px)',margin:'12px 0'}}>Bring us your decision. Identify what is missing.</h2>
 <p style={{color:'#ccdde4',lineHeight:1.75,fontSize:17}}>Explore a typical problem, see the questions TA14 would ask, and prepare a written inquiry. No registration, payment, account, or records are required to start a conversation. This guide does not make a formal governance finding.</p>
 <div role="tablist" aria-label="Explore the decision guide" style={{display:'flex',gap:8,flexWrap:'wrap',margin:'24px 0'}}>
 {['Choose your problem','See the authority boundary','Prepare your inquiry'].map((label,i)=><button role="tab" aria-selected={stage===i} aria-controls="guide-stage" key={i} type="button" onClick={()=>setStage(i)} style={{borderRadius:30,padding:'11px 16px',fontWeight:800,cursor:'pointer',border:'1px solid #608b91',background:stage===i?mint:'#132d39',color:stage===i?ink:'#e5f4f7'}}>{i+1}. {label}</button>)}
 </div>
 <div id="guide-stage" role="tabpanel">
 {stage===0&&<>
 <h3 style={{fontSize:23,margin:'14px 0'}}>Which problem sounds closest to yours?</h3>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))',gap:10}}>{scenarios.map(x=><button type="button" aria-pressed={choice===x.key} key={x.key} onClick={()=>setChoice(x.key)} style={btn(choice===x.key)}><span style={{color:mint,fontSize:20,marginRight:8}}>{x.icon}</span>{x.label}</button>)}</div>
 <p style={{color:'#d4e6eb',lineHeight:1.7,background:'#0a2634',padding:18,borderRadius:10,marginTop:18}}><strong>Example:</strong> {s.example}</p>
 </>}
 {stage===1&&<>
 <h3 style={{fontSize:24,margin:'12px 0'}}>A proposed consequence must cross three distinct checks.</h3>
 <p style={{color:'#d7e8ee',lineHeight:1.7}}><strong>Proposed consequence:</strong> {s.consequence}</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(205px,1fr))',gap:12}}>
 {(['Admissible Evidence','Applicable Authority','Established Standing'] as const).map((name,i)=><article key={name} style={{background:'#0b2838',border:'1px solid #3e6b7b',borderRadius:13,padding:18}}><p style={{color:mint,fontSize:12,fontWeight:900,letterSpacing:1.2}}>CHECK 0{i+1}</p><h4 style={{fontSize:19,margin:'8px 0 12px'}}>{name}</h4><p style={{color:'#c8dce6',lineHeight:1.7}}>{s.checkpoints[i]}</p><span style={{color:'#e8c78d',fontSize:12,fontWeight:800}}>NOT EXAMINED · NO DISPOSITION</span></article>)}
 </div>
 <p style={{lineHeight:1.7,color:'#f1d6a9',marginTop:19}}>Observing a problem is not permission to change it. These questions explain the boundary; answering them here does not establish evidence, authority, or standing.</p>
 </>}
 {stage===2&&<>
 <h3 style={{fontSize:23,margin:'12px 0'}}>Start with a short description.</h3>
 <p style={{color:'#ccdde5',lineHeight:1.7}}>{s.next} Do not include confidential records or personal information in this initial inquiry.</p>
 <label htmlFor="door-guide-notes" style={{fontWeight:700}}>What is preventing the decision? (optional)</label>
 <textarea id="door-guide-notes" value={notes} onChange={e=>setNotes(e.target.value)} maxLength={800} rows={4} placeholder="A brief description is enough to start" style={{display:'block',boxSizing:'border-box',width:'100%',padding:14,border:'1px solid #7199a1',borderRadius:9,background:'#f9fdff',color:'#092331',marginTop:10,font:'inherit'}}/>
 <a href={mail} style={{display:'inline-block',padding:'14px 20px',borderRadius:10,background:mint,color:ink,fontWeight:900,textDecoration:'none',marginTop:16}}>Prepare a written inquiry →</a>
 <p style={{fontSize:13,color:'#a9c6d1',lineHeight:1.6}}>Opens your email application. Nothing is transmitted by the page. You review and send the email yourself. No obligation to register or purchase.</p>
 </>}
 </div>
 <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginTop:22}}>
 <button type="button" disabled={stage===0} onClick={()=>setStage(v=>Math.max(0,v-1))} style={{background:'#173746',color:'#f2fbff',border:'1px solid #678b98',borderRadius:9,padding:'12px 18px',cursor:'pointer',opacity:stage===0?.45:1}}>← Previous</button>
 {stage<2&&<button type="button" onClick={()=>setStage(v=>Math.min(2,v+1))} style={{background:mint,color:ink,border:0,borderRadius:9,padding:'12px 20px',cursor:'pointer',fontWeight:900}}>Continue →</button>}
 </div>
 </section>;
}
