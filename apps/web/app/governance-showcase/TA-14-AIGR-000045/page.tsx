import Link from 'next/link';

export const metadata={
  title:'ExecutionProof™ · TA-14-AIGR-000045 | TA-14 Exchange',
  description:'Public registration identity for ExecutionProof™. Underlying governance materials remain private / record-only.'
};

export default function Page(){
  return <main style={{minHeight:'100vh',background:'#02070c',color:'#edf5f8',fontFamily:'Arial,sans-serif',padding:'0 20px'}}>
    <div style={{maxWidth:1040,margin:'auto'}}>
      <nav style={{padding:'28px 0',borderBottom:'1px solid #18303b'}}>
        <Link href="/showrooms/registered-governance" style={{color:'#70dcff',textDecoration:'none',fontWeight:900}}>← REGISTERED GOVERNANCE</Link>
      </nav>
      <header style={{padding:'92px 0 48px'}}>
        <p style={{color:'#70dcff',fontSize:11,fontWeight:900,letterSpacing:2}}>PUBLIC REGISTRATION IDENTITY · PRIVATE / RECORD-ONLY</p>
        <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(48px,8vw,88px)',lineHeight:.96,margin:'18px 0 22px'}}>ExecutionProof™</h1>
        <p style={{color:'#9fb4be',fontSize:20,lineHeight:1.7,margin:0}}>Derek Hone · Remnant Fieldworks Inc.</p>
      </header>
      <section style={{border:'1px solid #173746',borderRadius:20,background:'#06121a',padding:'clamp(26px,5vw,48px)',marginBottom:28}}>
        <p style={{color:'#efc86c',fontWeight:900,letterSpacing:1.4,fontSize:12,marginTop:0}}>TA-14-AIGR-000045</p>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:34,margin:'12px 0 18px'}}>Registered Governance</h2>
        <p style={{color:'#b8c8cf',fontSize:17,lineHeight:1.75,maxWidth:800}}>The governance identity is public. Underlying governance materials, claims, evidence, artifacts, examinations, demonstrations, and supporting records remain private unless separately authorized for disclosure.</p>
      </section>
      <section style={{border:'1px solid #382f1a',borderRadius:20,padding:'28px 32px',marginBottom:80}}>
        <p style={{color:'#efc86c',fontSize:11,fontWeight:900,letterSpacing:1.5,marginTop:0}}>DISCLOSURE BOUNDARY</p>
        <p style={{color:'#8fa6b0',lineHeight:1.7,marginBottom:0}}>This public showroom establishes registration identity only. It does not publish, summarize, characterize, infer, or disclose the private governance record.</p>
      </section>
      <footer style={{padding:'40px 0 60px',borderTop:'1px solid #142832',color:'#647d88',fontSize:10}}>IDENTITY MAY BE PUBLIC WHILE THE GOVERNANCE RECORD REMAINS PRIVATE</footer>
    </div>
  </main>
}