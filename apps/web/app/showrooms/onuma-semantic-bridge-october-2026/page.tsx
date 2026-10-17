import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Semantic Bridge × Execution Governance | ONUMA Session Record | TA14 Exchange',
  description: 'Source-linked October 16, 2026 ONUMA Back from Tokyo session reference: Semantic Bridge, TA14 recognition, and the boundary between connected intelligence and authorized consequence.',
};

const recording='https://sites.google.com/onuma.com/btblibrary/Past-Events/32_10-16-26-Back-from-Tokyo';
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
 <p style={muted}>According to Greggory Don Butler's account of the Asset Leadership Network discussion, Kimon navigated the Semantic Bridge graph-of-graphs, searched for Butler and TA14, and described their work and progress. Butler reports that Michael Bordenaro then expressed strong appreciation for TA14's work.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(245px,1fr))',gap:15,marginTop:22}}>
 <div style={{background:'#0a1b2b',border:'1px solid #31566c',borderRadius:13,padding:20}}><p style={{...eyebrow,color:'#8ce7e0'}}>DOCUMENTED ACKNOWLEDGMENT</p><p style={muted}>Kimon's public LinkedIn response confirms that he highlighted Butler's contribution during the session.</p></div>
 <div style={{background:'#0a1b2b',border:'1px solid #31566c',borderRadius:13,padding:20}}><p style={{...eyebrow,color:'#8ce7e0'}}>PARTICIPANT ACCOUNT</p><p style={muted}>The graph demonstration and Michael Bordenaro's positive remarks are reported by Butler; exact wording and recording timestamps remain unverified here.</p></div>
 </div>
 <p style={{fontSize:13,color:'#9fbacb',lineHeight:1.7,marginTop:20}}>No formal endorsement, institutional partnership, independent technical validation, or adoption is asserted. This record can be updated with a verified recording timestamp and exact quotation.</p>
 </section>
 <section style={{...panel,marginBottom:26}}>
 <p style={eyebrow}>03 · CONCEPTUAL ARCHITECTURE · NOT A DEPLOYMENT DIAGRAM</p>
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
 <p style={eyebrow}>04 · EXAMINE THE BOUNDARY</p>
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
