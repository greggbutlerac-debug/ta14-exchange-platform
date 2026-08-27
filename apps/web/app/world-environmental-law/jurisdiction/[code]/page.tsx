import Link from 'next/link';
import { notFound } from 'next/navigation';
import { applicableInstruments, jurisdictionChain, jurisdictions } from '../../../../lib/world-law-catalog';

export default async function JurisdictionLawPage({params}:{params:Promise<{code:string}>}){
  const {code}=await params;
  const decoded=decodeURIComponent(code).toUpperCase();
  const jurisdiction=jurisdictions.find(j=>j.code===decoded);
  if(!jurisdiction) notFound();
  const chain=jurisdictionChain(decoded);
  const laws=applicableInstruments(decoded);

  return <main style={{minHeight:'100vh',background:'#050908',color:'#eef8f2',fontFamily:'Inter,system-ui',paddingBottom:80}}>
    <header style={{maxWidth:1240,margin:'auto',padding:'22px 28px',display:'flex',justifyContent:'space-between',gap:20,borderBottom:'1px solid #1c2c23'}}>
      <Link href="/world-environmental-law" style={{color:'#dfbd64',textDecoration:'none',fontWeight:900}}>← WORLD ENVIRONMENTAL LAW</Link>
      <span style={{fontSize:10,color:'#7f9388',letterSpacing:1.3}}>JURISDICTION INHERITANCE VIEW</span>
    </header>

    <section style={{maxWidth:1180,margin:'auto',padding:'72px 28px 34px'}}>
      <small style={{color:'#dcb85e',fontWeight:800,letterSpacing:2}}>{jurisdiction.layer.replaceAll('_',' ')}</small>
      <h1 style={{fontSize:'clamp(48px,8vw,88px)',lineHeight:.98,letterSpacing:-4,margin:'12px 0 18px'}}>{jurisdiction.name}</h1>
      <p style={{maxWidth:820,color:'#9eb0a6',fontSize:17,lineHeight:1.7}}>This view does not flatten authority. It shows the legal instruments inherited from every jurisdiction above this location, then adds the verified instruments attached at this level.</p>
    </section>

    <section style={{maxWidth:1180,margin:'auto',padding:'0 28px 30px'}}>
      <small style={{color:'#dcb85e',letterSpacing:1.5}}>AUTHORITY CHAIN</small>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10,marginTop:12}}>{chain.map((j,i)=><article key={j.code} style={{border:'1px solid #203229',background:'#08110d',padding:18,borderRadius:12}}><span style={{fontSize:9,color:'#6f887b'}}>{String(i+1).padStart(2,'0')}</span><h3 style={{margin:'7px 0 4px'}}>{j.name}</h3><small style={{color:'#8da096'}}>{j.layer.replaceAll('_',' ')}</small></article>)}</div>
    </section>

    <section style={{maxWidth:1180,margin:'auto',padding:'34px 28px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',gap:20,flexWrap:'wrap'}}><div><small style={{color:'#7be0a7',letterSpacing:1.5}}>APPLICABLE CATALOG</small><h2 style={{fontSize:38,margin:'7px 0'}}>Inherited + local law objects</h2></div><span style={{fontSize:11,color:'#7e9186'}}>{laws.length} governed records</span></div>
      <div style={{display:'grid',gap:12,marginTop:22}}>{laws.length?laws.map(law=><article key={law.slug} style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',gap:20,alignItems:'center',border:'1px solid #23362c',background:'#08110d',padding:22,borderRadius:14}}>
        <div><small style={{color:'#d8b75f'}}>{law.layer.replaceAll('_',' ')} · {law.jurisdiction}</small><h3 style={{fontSize:22,margin:'6px 0 8px'}}>{law.title}</h3><p style={{margin:0,color:'#91a49a',lineHeight:1.55,fontSize:13}}>{law.currentMeaning}</p><p style={{margin:'8px 0 0',fontSize:10,color:'#71877b'}}>STATUS · {law.status}</p></div>
        <Link href={`/world-environmental-law/law/${law.slug}`} style={{whiteSpace:'nowrap',padding:'13px 16px',border:'1px solid #7f6a32',color:'#f0d27d',textDecoration:'none',fontSize:10,fontWeight:900,letterSpacing:.7}}>EXAMINE THIS LAW →</Link>
      </article>):<div style={{border:'1px solid #453b23',padding:22,color:'#c8b77f'}}>No verified law objects are attached to this jurisdiction chain yet.</div>}</div>
    </section>

    <section style={{maxWidth:1180,margin:'20px auto 0',padding:'0 28px'}}>
      <div style={{borderLeft:'3px solid #d8b75f',background:'#111009',padding:20}}><b style={{color:'#efcf77'}}>APPLICABILITY ≠ GEOGRAPHY</b><p style={{marginBottom:0,color:'#a6b4ad',lineHeight:1.65}}>A law appearing in this inherited stack means the instrument belongs to the governing jurisdiction chain. It does not mean every provision automatically applies to every person, property, source, discharge, building, permit or activity. Each detail record preserves its own applicability boundary.</p></div>
    </section>
  </main>
}
