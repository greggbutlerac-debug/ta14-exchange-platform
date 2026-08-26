import Link from 'next/link';

export default function EnvironmentalDemonstrationsPage(){
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 50% 0%,#12372d 0,#071511 38%,#030807 78%)',color:'#edf9f4',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <nav style={{padding:'18px clamp(20px,5vw,72px)',borderBottom:'1px solid rgba(120,240,190,.18)'}}><Link href='/environmental-integrity-governance' style={{color:'#83f0bd',textDecoration:'none',fontWeight:900}}>← ENVIRONMENTAL INTEGRITY GOVERNANCE</Link></nav>
    <section style={{maxWidth:1180,margin:'0 auto',padding:'80px 24px'}}>
      <p style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.18em',fontSize:12}}>DOOR 03 · ENVIRONMENTAL PROVING GROUND</p>
      <h1 style={{fontFamily:'Georgia,serif',fontSize:'clamp(44px,7vw,78px)',lineHeight:1,margin:'14px 0 20px'}}>Governance should be demonstrated, not merely described.</h1>
      <p style={{maxWidth:850,color:'#b8d0c5',fontSize:18,lineHeight:1.7}}>Run bounded environmental cases against preserved evidence, declared non-claims, proposition-specific admissibility, changed conditions, and the commit boundary.</p>
      <Link href='/environmental-integrity-governance/demonstrations/conflicting-environmental-record' style={{display:'block',marginTop:42,padding:30,border:'1px solid rgba(120,240,190,.3)',borderRadius:18,background:'rgba(7,28,21,.8)',color:'#edf9f4',textDecoration:'none'}}>
        <small style={{color:'#71e5ad',fontWeight:900,letterSpacing:'.14em'}}>EIG DEMONSTRATION 001 · R1</small>
        <h2 style={{fontFamily:'Georgia,serif',fontSize:38,margin:'10px 0'}}>The Conflicting Environmental Record</h2>
        <p style={{color:'#b8d0c5',lineHeight:1.65}}>Two environmental measurements. Different contexts. One governed question: may the proposed consequence cross the boundary?</p>
        <strong style={{display:'inline-block',marginTop:12,color:'#83f0bd'}}>RUN THE DEMONSTRATION →</strong>
      </Link>
    </section>
  </main>;
}
