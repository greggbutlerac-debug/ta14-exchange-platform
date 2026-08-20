import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'TA-14-AIGR-000025 | Validation Standing Assurance',
  description: 'Permanent TA-14 AI Governance Registry record for Validation Standing Assurance (VSA) v1.0.',
};

export default function VsaPermanentRegistryRecord() {
  const facts = [
    ['Status','Registered'],['Visibility','Public'],['Registry identifier','TA-14-AIGR-000025'],['Version','1.0'],
    ['Steward','Taiwo Yusuf'],['Organization','TEAM 22'],['Established','August 18, 2026'],['Registered','August 20, 2026'],
  ];
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 15% 0%,rgba(28,83,139,.24),transparent 30%),radial-gradient(circle at 90% 8%,rgba(213,167,75,.13),transparent 26%),linear-gradient(180deg,#020813,#06111e 48%,#020710)',color:'#f3f6f9',padding:'64px 20px'}}>
    <div style={{width:'min(1040px,100%)',margin:'0 auto'}}>
      <Link href="/workspace/ai-governance/registry/profiles/validation-standing-assurance" style={{color:'#a9bfd2',textDecoration:'none'}}>← Governance Showcase</Link>
      <div style={{marginTop:38,border:'1px solid rgba(213,167,75,.28)',borderRadius:28,background:'linear-gradient(135deg,rgba(8,26,45,.92),rgba(4,15,27,.98))',padding:'clamp(28px,6vw,58px)',boxShadow:'0 28px 90px rgba(0,0,0,.3)'}}>
        <div style={{color:'#d7aa51',fontSize:12,fontWeight:800,letterSpacing:'.15em',textTransform:'uppercase'}}>TA-14 AI Governance Registry · Permanent Public Record</div>
        <h1 style={{margin:'18px 0 12px',fontSize:'clamp(42px,7vw,76px)',lineHeight:.98,letterSpacing:'-.045em'}}>Validation Standing Assurance</h1>
        <p style={{margin:'0 0 30px',color:'#e1b85f',fontSize:22,lineHeight:1.5}}>VSA v1.0 · TA-14-AIGR-000025</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:14,marginBottom:34}}>{facts.map(([label,value])=><div key={label} style={{border:'1px solid rgba(111,153,192,.16)',borderRadius:16,padding:18,background:'rgba(255,255,255,.02)'}}><div style={{color:'#70899f',fontSize:10,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:7}}>{label}</div><div style={{color:'#edf2f6',fontSize:17,fontWeight:700}}>{value}</div></div>)}</div>
        <section style={{borderTop:'1px solid rgba(255,255,255,.07)',paddingTop:28}}><h2 style={{margin:'0 0 14px',fontSize:28}}>Permanent registration identity</h2><p style={{margin:0,color:'#b4c5d5',fontSize:17,lineHeight:1.8}}>TA-14-AIGR-000025 permanently preserves the attributable VSA v1.0 governance baseline submitted by Taiwo Yusuf. VSA addresses whether the present basis for relying on a previously validated regulated system remains supportable after material changes to evidence, configuration, dependencies, intended use, procedures, authority, or operating conditions.</p></section>
        <section style={{marginTop:30}}><h2 style={{fontSize:28}}>Registered governance proposition</h2><p style={{color:'#b4c5d5',fontSize:17,lineHeight:1.8}}>Historical validation does not by itself establish present validation standing. VSA separates historical validation, current supportability, and downstream action authority. Where qualifying current evidence cannot re-establish supportability, the architecture preserves uncertainty and supports reassessment or a NO_BIND-equivalent hold rather than silently inheriting the earlier state.</p></section>
        <section style={{marginTop:30,border:'1px solid rgba(213,167,75,.22)',borderRadius:18,padding:22,background:'rgba(30,23,9,.42)'}}><div style={{color:'#d7aa51',fontSize:11,fontWeight:800,letterSpacing:'.14em',textTransform:'uppercase',marginBottom:9}}>Registration Boundary</div><p style={{margin:0,color:'#c3d0dc',fontSize:15,lineHeight:1.75}}>Registration preserves identity, chronology, declared claims, boundaries, and the submitted evidence baseline. It is not certification, endorsement, independent validation, regulatory conformity, legal sufficiency, safety assurance, proof of production effectiveness, or proof of non-bypass execution control.</p></section>
        <div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:32}}><Link href="/workspace/ai-governance/registry/profiles/validation-standing-assurance" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:800,background:'linear-gradient(135deg,#d7ab52,#9e6e20)',color:'#06101c'}}>Open Governance Showcase →</Link><Link href="/workspace/ai-governance/registry/directory" style={{display:'inline-flex',alignItems:'center',minHeight:48,padding:'0 18px',borderRadius:12,textDecoration:'none',fontWeight:800,border:'1px solid rgba(130,169,204,.28)',color:'#c9dbe9'}}>Browse Public Registry</Link></div>
      </div>
    </div>
  </main>;
}
