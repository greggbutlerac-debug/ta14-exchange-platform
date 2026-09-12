import Link from 'next/link';

export type CommercialEngine = {
  eyebrow:string; title:string; promise:string; audience:string; price:string;
  problem:string; deliverables:string[]; proof:string[]; seoTerms:string[];
  ctaLabel:string; ctaHref:string; secondaryLabel:string; secondaryHref:string;
};

export function CommercialEnginePage({engine}:{engine:CommercialEngine}){
  const schema={
    '@context':'https://schema.org','@type':'Service',name:engine.title,
    provider:{'@type':'Organization',name:'TA-14 Authority',url:'https://www.ta14exchange.com'},
    description:engine.promise,audience:engine.audience,offers:{'@type':'Offer',description:engine.price,url:`https://www.ta14exchange.com${engine.secondaryHref}`}
  };
  return <main style={{minHeight:'100vh',background:'radial-gradient(circle at 15% 0,#12283b 0,#06101a 34%,#02070d 76%)',color:'#eef8ff',fontFamily:'Inter,Arial,sans-serif'}}>
    <script type='application/ld+json' dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />
    <section style={{maxWidth:1120,margin:'0 auto',padding:'84px 24px 96px'}}>
      <Link href='/commercial' style={{color:'#69eec0',textDecoration:'none',fontWeight:900}}>← TA-14 COMMERCIAL ENGINES</Link>
      <div style={{marginTop:28,padding:'34px',border:'1px solid rgba(92,229,255,.3)',borderRadius:24,background:'rgba(5,20,31,.86)',boxShadow:'0 24px 80px rgba(0,0,0,.32)'}}>
        <small style={{color:'#64f0bd',fontWeight:950,letterSpacing:'.15em'}}>{engine.eyebrow}</small>
        <h1 style={{maxWidth:900,margin:'12px 0',fontSize:'clamp(2.5rem,6vw,5rem)',lineHeight:.94,letterSpacing:'-.055em'}}>{engine.title}</h1>
        <p style={{maxWidth:900,color:'#a8bdca',fontSize:'1.12rem',lineHeight:1.7}}>{engine.promise}</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,marginTop:24}}>
          <div style={{padding:18,border:'1px solid rgba(255,255,255,.1)',borderRadius:16}}><small style={{color:'#718999'}}>BUYER</small><strong style={{display:'block',marginTop:6}}>{engine.audience}</strong></div>
          <div style={{padding:18,border:'1px solid rgba(255,209,92,.24)',borderRadius:16}}><small style={{color:'#f0c95f'}}>COMMERCIAL ENTRY</small><strong style={{display:'block',marginTop:6}}>{engine.price}</strong></div>
        </div>
        <div style={{display:'flex',flexWrap:'wrap',gap:12,marginTop:26}}>
          <a href={engine.ctaHref} style={{padding:'14px 20px',borderRadius:12,background:'#5fe9b6',color:'#03110c',fontWeight:950,textDecoration:'none'}}>{engine.ctaLabel}</a>
          <Link href={engine.secondaryHref} style={{padding:'14px 20px',borderRadius:12,border:'1px solid rgba(92,229,255,.4)',color:'#dffaff',fontWeight:900,textDecoration:'none'}}>{engine.secondaryLabel}</Link>
        </div>
      </div>

      <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:18,marginTop:24}}>
        <article style={{padding:28,border:'1px solid rgba(255,255,255,.1)',borderRadius:20,background:'rgba(5,14,22,.76)'}}><small style={{color:'#ff9c8a',fontWeight:900}}>THE PAIN</small><h2>What the buyer cannot prove today.</h2><p style={{color:'#9fb2bf',lineHeight:1.7}}>{engine.problem}</p></article>
        <article style={{padding:28,border:'1px solid rgba(95,233,182,.2)',borderRadius:20,background:'rgba(5,20,17,.72)'}}><small style={{color:'#65efbc',fontWeight:900}}>THE PAID DELIVERABLE</small><h2>What TA-14 returns.</h2>{engine.deliverables.map(x=><p key={x} style={{color:'#a9c8bb',lineHeight:1.55}}>• {x}</p>)}</article>
      </section>

      <section style={{marginTop:24,padding:28,border:'1px solid rgba(99,184,255,.2)',borderRadius:20,background:'rgba(5,16,27,.72)'}}><small style={{color:'#7bc4ff',fontWeight:900}}>WHY THIS IS DIFFERENT</small><h2>Not advice. A bounded evidence-and-authority review.</h2>{engine.proof.map(x=><p key={x} style={{color:'#a8bac8',lineHeight:1.6}}>→ {x}</p>)}</section>
      <section style={{marginTop:24,padding:24,borderTop:'1px solid rgba(255,255,255,.1)'}}><small style={{color:'#718999'}}>SEO DISCOVERY</small><p style={{color:'#8fa5b3'}}>{engine.seoTerms.join(' · ')}</p></section>
    </section>
  </main>;
}
