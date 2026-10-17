import type { Metadata } from 'next';
import Link from 'next/link';
import InteractiveMission from './InteractiveMission';

export const metadata: Metadata = {
  title: 'Semantic Bridge × Execution Governance | ONUMA Session Record | TA14 Exchange',
  description: 'Source-linked October 16, 2026 ONUMA Back from Tokyo session reference: Semantic Bridge, TA14 recognition, and the boundary between connected intelligence and authorized consequence.',
};

const recording='https://sites.google.com/onuma.com/btblibrary/Past-Events/32_10-16-26-Back-from-Tokyo';
const clip='https://www.youtube.com/watch?v=WVrJ9Urpw2Q&t=2988s';
const re1='/greenbuild/onuma-re1';
const smartCity='/showrooms/smart-city-admissible-governance';
const panel:React.CSSProperties={background:'linear-gradient(145deg,#0e263b,#091b2d)',border:'1px solid #28516a',borderRadius:20,padding:'clamp(22px,4vw,38px)'};
const muted:React.CSSProperties={color:'#bfd2e2',lineHeight:1.8};
const eyebrow:React.CSSProperties={fontSize:12,fontWeight:800,letterSpacing:2,color:'#f3c97d'};
const nodes=[
 {k:'01',title:'Represented knowledge',desc:'IFC · IFCx · BIM · semantic relationships'},
 {k:'02',title:'Operational context',desc:'Assets · work orders · observations · graph connections'},
 {k:'03',title:'Proposed consequence',desc:'AI recommendation · operator request · physical action'},
 {k:'04',title:'TA14 authority boundary',desc:'Admissible Evidence · Applicable Authority · Established Standing'},
 {k:'05',title:'Bounded disposition',desc:'ALLOW · HOLD · DENY · ESCALATE'},
 {k:'06',title:'Accountable outcome',desc:'Local commit · authorized execution · verified result'}
];
export default function OnumaSemanticBridgeRecord(){
 return <main style={{minHeight:'100vh',background:'#061321',color:'#edf7ff',fontFamily:'Arial,Helvetica,sans-serif'}}>
 <div style={{maxWidth:1120,margin:'auto',padding:'26px 20px 100px'}}>
 <nav style={{display:'flex',gap:20,flexWrap:'wrap',fontSize:14}}>
 <Link href="/showrooms" style={{color:'#87e5ed'}}>← All showrooms</Link>
 <Link href="/showrooms/interoperability-systems" style={{color:'#87e5ed'}}>Interoperability &amp; systems</Link>
 <Link href={re1} style={{color:'#87e5ed'}}>ONUMA × TA14 RE1 →</Link>
 </nav>
 <header style={{padding:'72px 0 38px'}}>
 <p style={eyebrow}>TA14 AUTHORITY GOVERNANCE INSTITUTION · SOURCE-LINKED SESSION RECORD · OCTOBER 16, 2026</p>
 <h1 style={{fontSize:'clamp(38px,6.2vw,76px)',lineHeight:1.06,letterSpacing:-2,margin:'22px 0'}}>The Graph Can Know.<br/><span style={{color:'#73e5df'}}>Who Authorizes the Action?</span></h1>
 <p style={{fontSize:'clamp(18px,2.5vw,23px)',lineHeight:1.6,color:'#c9dce9',maxWidth:890}}>ONUMA's Semantic Bridge graph-of-graphs meets the TA14 execution boundary. An October 16 session reference connecting interoperable building knowledge with accountable physical consequence.</p>
 <div style={{display:'flex',flexWrap:'wrap',gap:10,marginTop:26}}>
 <span style={{border:'1px solid #46758a',borderRadius:99,padding:'9px 14px',fontSize:12,color:'#bce8ef'}}>ORIGINAL SESSION LINKED</span>
 <span style={{border:'1px solid #46758a',borderRadius:99,padding:'9px 14px',fontSize:12,color:'#bce8ef'}}>RECOGNITION REPORTED</span>
 <span style={{border:'1px solid #46758a',borderRadius:99,padding:'9px 14px',fontSize:12,color:'#bce8ef'}}>TECHNICAL INTERPRETATION · NOT ENDORSEMENT</span>
 </div>
 </header>
 <section style={{...panel,borderColor:'#578a91',marginBottom:26}}>
 <p style={eyebrow}>01 · PRIMARY SOURCE</p>
 <h2 style={{fontSize:'clamp(26px,3.4vw,39px)',margin:'12px 0'}}>ONUMA: Back from Tokyo</h2>
 <p style={muted}>October 16, 2026 · Kimon Onuma, FAIA · buildingSMART, IFCx, semantic buildings, and connected operational intelligence.</p>
 <p style={muted}>Kimon publicly told Greggory Don Butler on LinkedIn: <em>“Thanks for the entry you made today! I highlighted it in the session, recording here.”</em> The external recording—not this interpretation—is the controlling source for the session's content.</p>
 <a href={recording} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',marginTop:12,padding:'16px 22px',background:'#78e8d7',color:'#05202c',borderRadius:11,fontWeight:800,textDecoration:'none'}}>OPEN THE ORIGINAL SESSION ↗</a>
 </section>
 <section style={{...panel,marginBottom:26}}>
 <p style={eyebrow}>02 · RECOGNITION RECORD</p>
 <h2 style={{fontSize:32,margin:'12px 0'}}>A contribution surfaced inside the graph</h2>
 <p style={muted}>According to Greggory Don Butler's account of the Asset Leadership Network discussion, Kimon navigated the Semantic Bridge graph-of-graphs, searched for Butler and TA14, and described their work and progress. Butler reports that Michael Bordenaro then praised his work; his reading of the 49:48–50:35 segment appears below.</p>
 <div style={{background:'#0b2131',border:'1px solid #3b7184',borderRadius:14,padding:22,marginTop:16}}>
 <p style={{...eyebrow,color:'#8ce7e0'}}>PARTICIPANT-TRANSCRIBED RECORD · 49:48–50:35</p>
 <p style={muted}>In Butler's reading of the session, Michael Bordenaro says: <em>“Gregory is doing amazing things.”</em> Kimon Onuma identifies TA14 in the Semantic Bridge graph and describes Butler's same-morning contribution on authority, governance, and the owner's perspective. Onuma connects that entry to the overheating-floor building example and asks whether the proposed action can be trusted. He also mentions Butler's involvement in a presentation Butler heard as “Bopping Your BIM.”</p>
 <p style={{fontSize:13,color:'#a9c0ce',lineHeight:1.7}}>Butler supplied this reading from the recording. It has not been independently transcribed; exact phrasing, speaker attribution, and the presentation title remain subject to audio verification. This does not establish ONUMA or ALN endorsement or adoption.</p>
 </div>
 <a href={clip} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',marginTop:16,padding:'14px 20px',background:'#78e8d7',color:'#05202c',borderRadius:11,fontWeight:800,textDecoration:'none'}}>WATCH THE RECOGNITION SEGMENT · 49:48 ↗</a>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(245px,1fr))',gap:15,marginTop:22}}>
 <div style={{background:'#0a1b2b',border:'1px solid #31566c',borderRadius:13,padding:20}}><p style={{...eyebrow,color:'#8ce7e0'}}>DOCUMENTED ACKNOWLEDGMENT</p><p style={muted}>Kimon's public LinkedIn response confirms that he highlighted Butler's contribution during the session.</p></div>
 <div style={{background:'#0a1b2b',border:'1px solid #31566c',borderRadius:13,padding:20}}><p style={{...eyebrow,color:'#8ce7e0'}}>PARTICIPANT ACCOUNT</p><p style={muted}>Butler identifies 49:48–50:35 as the relevant recording segment and has supplied his reading of it. The timestamp is now documented; the precise dialogue still awaits independent audio verification.</p></div>
 </div>
 <p style={{fontSize:13,color:'#9fbacb',lineHeight:1.7,marginTop:20}}>No formal endorsement, institutional partnership, independent technical validation, or adoption is asserted. The time-linked source is provided above. This record can be further updated with an independently checked transcript and precise quotation.</p>
 </section>
 <InteractiveMission/>
 <section style={{...panel,marginBottom:26}}>
 <p style={eyebrow}>03 · VISUAL FIELD GUIDE · ORIGINAL TA14 ILLUSTRATIONS</p>
 <h2 style={{fontSize:32,margin:'12px 0'}}>See the connection, then examine the boundary</h2>
 <p style={muted}>These diagrams are original explanatory graphics, not ONUMA screenshots, verified session frames, or representations of an implemented ONUMA–TA14 integration. The source links below let readers inspect ONUMA's work directly.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(285px,1fr))',gap:16,marginTop:22}}>
 <div style={{background:'#061828',border:'1px solid #315c71',borderRadius:16,padding:20}}>
 <p style={{...eyebrow,color:'#85e4e6'}}>A · SEMANTIC RELATIONSHIPS</p>
 <svg viewBox="0 0 440 250" role="img" aria-label="Conceptual semantic graph linking building, space, HVAC, asset and work order" style={{width:'100%',height:'auto',display:'block'}}>
 <defs><linearGradient id="semanticBg" x1="0" x2="1"><stop stopColor="#092638"/><stop offset="1" stopColor="#061421"/></linearGradient></defs>
 <rect width="440" height="250" rx="12" fill="url(#semanticBg)"/>
 {[[220,124,95,55],[220,124,345,52],[220,124,360,175],[220,124,95,190],[220,124,220,225],[95,55,95,190],[345,52,360,175]].map((l,i)=><line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#2bbfd2" strokeWidth="2" opacity=".68"/>)}
 {[[220,124,'BUILDING'],[95,55,'SPACE'],[345,52,'HVAC'],[360,175,'ASSET'],[95,190,'WORK ORDER'],[220,225,'RECORD']].map((n,i)=><g key={i}><circle cx={n[0]} cy={n[1]} r={i===0?43:37} fill={i===0?'#254e54':'#0b3148'} stroke={i===0?'#e9c16d':'#58d6e8'} strokeWidth="2"/><text x={n[0]} y={Number(n[1])+4} textAnchor="middle" fontSize={i===0?13:10} fontWeight="700" fill="#eefaff">{n[2]}</text></g>)}
 </svg>
 <p style={{...muted,fontSize:14}}>Relationships help locate and contextualize information. A connected node is not proof of the present physical condition.</p>
 <a href={recording} target="_blank" rel="noopener noreferrer" style={{color:'#85e9e9',fontWeight:800,fontSize:13}}>VIEW ONUMA'S ORIGINAL SESSION ↗</a>
 </div>
 <div style={{background:'#061828',border:'1px solid #315c71',borderRadius:16,padding:20}}>
 <p style={{...eyebrow,color:'#85e4e6'}}>B · REPRESENTATION TO CONSEQUENCE</p>
 <svg viewBox="0 0 440 250" role="img" aria-label="Conceptual building asset and work-order model stopped at an evidence and authority gate" style={{width:'100%',height:'auto',display:'block'}}>
 <rect width="440" height="250" rx="12" fill="#081e2d"/>
 <g stroke="#54c5d7" fill="none" strokeWidth="2"><path d="M35 92L122 46L207 92V191H35Z"/><path d="M122 46V191M35 92H207M35 143H207M75 72V191M165 72V191"/><path d="M55 111h45v24H55zM138 111h48v24h-48zM55 157h45v23H55zM138 157h48v23h-48z"/></g>
 <path d="M215 125h40" stroke="#5ce5de" strokeWidth="3"/><path d="M246 118l10 7-10 7" stroke="#5ce5de" fill="none" strokeWidth="3"/>
 <rect x="264" y="65" width="155" height="123" rx="12" fill="#29251b" stroke="#f0c574" strokeWidth="2"/>
 <text x="341" y="92" textAnchor="middle" fontSize="14" fill="#f0c574" fontWeight="700">AUTHORITY GATE</text>
 <text x="341" y="116" textAnchor="middle" fontSize="12" fill="#f3f5f6">Evidence?</text>
 <text x="341" y="139" textAnchor="middle" fontSize="12" fill="#f3f5f6">Authority?</text>
 <text x="341" y="162" textAnchor="middle" fontSize="12" fill="#f3f5f6">Standing?</text>
 <text x="121" y="218" textAnchor="middle" fontSize="13" fill="#c4e9ef">REPRESENTED BUILDING</text>
 <text x="341" y="218" textAnchor="middle" fontSize="13" fill="#f0c574">ALLOW / HOLD</text>
 </svg>
 <p style={{...muted,fontSize:14}}>An asset relationship or work order can justify investigation without authorizing electrical, mechanical, or other physical intervention.</p>
 <Link href={re1} style={{color:'#85e9e9',fontWeight:800,fontSize:13}}>OPEN THE RE1 FIELD CASE →</Link>
 </div>
 </div>
 </section>
 <section style={{...panel,marginBottom:26}}>
 <p style={eyebrow}>04 · CONCEPTUAL ARCHITECTURE · NOT A DEPLOYMENT DIAGRAM</p>
 <h2 style={{fontSize:32,margin:'12px 0 8px'}}>From connected knowledge to governed consequence</h2>
 <p style={muted}>The following is a TA14 teaching interpretation of complementary functions. It does not claim that ONUMA implemented, approved, or adopted this architecture.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:14,marginTop:24}}>
 {nodes.map((n,i)=><div key={n.k} style={{border:i===3?'2px solid #f0c574':'1px solid #31576c',background:i===3?'#2b2a28':'#0a1c2d',borderRadius:14,padding:20,minHeight:133}}>
 <span style={{fontSize:12,color:i===3?'#f0c574':'#79dfe1',fontWeight:900}}>{n.k} / {i<3?'INTELLIGENCE':i===3?'AUTHORITY CHECK':'CONSEQUENCE'}</span>
 <h3 style={{fontSize:20,margin:'12px 0 8px'}}>{n.title}</h3><p style={{color:'#b9d0df',fontSize:14,lineHeight:1.55,margin:0}}>{n.desc}</p></div>)}
 </div>
 <p style={{fontSize:19,fontWeight:800,marginTop:26,color:'#8de9e2'}}>Represented is not observed. Inferred is not authorized. Capability is not authority.</p>
 </section>
 <section style={{...panel,marginBottom:26}}>
 <p style={eyebrow}>05 · EXAMINE THE BOUNDARY</p>
 <h2 style={{fontSize:32,margin:'12px 0'}}>The RE1 work-order example</h2>
 <p style={muted}>The existing ONUMA × TA14 RE1 examination illustrates the difference between finding a represented operational relationship and establishing sufficient evidence and authority for physical electrical intervention. Bounded investigation is supported; unsupported physical work remains on HOLD.</p>
 <p style={{fontSize:20,lineHeight:1.6,fontWeight:800}}>Does this proposed consequence have sufficient Admissible Evidence, Applicable Authority, and Established Standing to become reality NOW?</p>
 <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:20}}>
 <Link href={re1} style={{padding:'14px 18px',borderRadius:10,background:'#79e3d5',color:'#06202d',fontWeight:800,textDecoration:'none'}}>EXPLORE ONUMA × TA14 RE1 →</Link>
 <Link href={smartCity} style={{padding:'14px 18px',borderRadius:10,border:'1px solid #659fa9',color:'#b8eff0',fontWeight:800,textDecoration:'none'}}>SMART CITY GOVERNANCE →</Link>
 </div>
 </section>
 <footer style={{borderTop:'1px solid #31566c',paddingTop:26,fontSize:13,lineHeight:1.8,color:'#a9c0ce'}}>TA14 Authority Governance Institution · External event reference and independent technical interpretation. The original recording is owned and hosted by its publisher. No reproduced session media, simulated endorsements, or unverified verbatim quotations are presented here.</footer>
 </div></main>;
}
