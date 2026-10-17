import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ONUMA Semantic Bridge · October 16, 2026 | TA14 Exchange',
  description: 'Source-linked record of the ONUMA Back from Tokyo session and reported discussion of Greggory Don Butler and TA14 in a Semantic Bridge graph-of-graphs demonstration.',
};

const source = 'https://sites.google.com/onuma.com/btblibrary/Past-Events/32_10-16-26-Back-from-Tokyo';
const re1 = '/greenbuild/onuma-re1';
const smartCity = '/showrooms/smart-city-admissible-governance';

export default function OnumaSemanticBridgeRecord() {
  return <main style={{minHeight:'100vh',background:'#061321',color:'#eaf3ff',fontFamily:'Arial,sans-serif'}}>
    <div style={{maxWidth:1050,margin:'auto',padding:'30px 22px 100px'}}>
      <nav style={{display:'flex',gap:20,flexWrap:'wrap',fontSize:14}}>
        <Link href="/showrooms" style={{color:'#7bd6e8'}}>← All showrooms</Link>
        <Link href={re1} style={{color:'#7bd6e8'}}>ONUMA × TA14 RE1 examination →</Link>
      </nav>
      <header style={{padding:'70px 0 30px'}}>
        <p style={{color:'#e7be70',letterSpacing:2,fontSize:12,fontWeight:800}}>TA14 AUTHORITY GOVERNANCE INSTITUTION · EXTERNAL SESSION REFERENCE · OCTOBER 16, 2026</p>
        <h1 style={{fontSize:'clamp(35px,6vw,64px)',lineHeight:1.08,margin:'18px 0'}}>When Semantic Building Intelligence Meets <span style={{color:'#6be1df'}}>Execution Governance</span></h1>
        <p style={{fontSize:21,lineHeight:1.6,color:'#c4d8e7',maxWidth:900}}>ONUMA's “Back from Tokyo” discussion, the Semantic Bridge graph-of-graphs, and the place of TA14's authority boundary in connected building intelligence.</p>
      </header>
      <section style={{border:'1px solid #365c70',borderRadius:18,padding:28,background:'#0c2333',marginBottom:24}}>
        <p style={{fontSize:12,fontWeight:800,color:'#e7be70',letterSpacing:1.5}}>ORIGINAL EXTERNAL RECORD</p>
        <h2 style={{fontSize:27,margin:'8px 0'}}>ONUMA · Back from Tokyo — October 16, 2026</h2>
        <p style={{lineHeight:1.7,color:'#c8d8e5'}}>Kimon Onuma publicly replied to Greggory Don Butler that he had highlighted Butler's contribution during the session and linked the recording. The original event page is the controlling source for what was actually said and shown.</p>
        <a href={source} target="_blank" rel="noopener noreferrer" style={{display:'inline-block',padding:'15px 22px',borderRadius:10,background:'#71e3d4',color:'#061321',fontWeight:800,textDecoration:'none'}}>WATCH THE ORIGINAL SESSION ↗</a>
      </section>
      <section style={{padding:'22px 0'}}>
        <h2 style={{fontSize:30}}>What was reported</h2>
        <p style={{lineHeight:1.8,color:'#c8d8e5'}}>Greggory Don Butler reports that during an Asset Leadership Network discussion, Kimon Onuma navigated the Semantic Bridge graph-of-graphs, searched for Butler and TA14, and discussed the institution's work and progress. Butler also reports that Michael Bordinaro responded positively about TA14's work.</p>
        <p style={{lineHeight:1.8,color:'#c8d8e5'}}>These details are recorded here as the participant's account, not as an independently transcribed or timestamp-verified quotation. This page does not claim formal ONUMA or Asset Leadership Network endorsement, partnership, certification, or technical validation.</p>
      </section>
      <section style={{borderTop:'1px solid #25475b',padding:'24px 0'}}>
        <h2 style={{fontSize:30}}>Why this technical connection matters</h2>
        <p style={{lineHeight:1.8,color:'#c8d8e5'}}>IFC, IFCx, semantic graphs, digital twins, and operational intelligence help connect and interpret information about buildings. TA14 examines a different boundary: whether a proposed consequence has sufficient <strong>Admissible Evidence, Applicable Authority, and Established Standing</strong> to become reality NOW.</p>
        <p style={{lineHeight:1.8,color:'#c8d8e5'}}>A graph relationship can inform a decision without itself authorizing a physical intervention. The execution boundary remains local, bounded, and subject to evidence and standing.</p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:20}}>
          <Link href={re1} style={{border:'1px solid #5e9ba8',padding:'14px 18px',borderRadius:9,color:'#a7ebf1'}}>EXAMINE ONUMA × TA14 RE1 →</Link>
          <Link href={smartCity} style={{border:'1px solid #5e9ba8',padding:'14px 18px',borderRadius:9,color:'#a7ebf1'}}>EXPLORE SMART CITY GOVERNANCE →</Link>
        </div>
      </section>
      <footer style={{marginTop:35,paddingTop:24,borderTop:'1px solid #25475b',color:'#a8c0ce',fontSize:13,lineHeight:1.7}}>Source-linked institutional reference, not a registered governance finding. External recording belongs to its original publisher. TA14 does not reproduce or alter the recording. Any exact quotation or timestamp requires review against the original session.</footer>
    </div>
  </main>;
}
