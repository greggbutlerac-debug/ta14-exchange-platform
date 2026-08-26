'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const commercialPaths = [
  '/eu-ai-act',
  '/governance-showcase',
  '/workspace/entity-review',
  '/workspace/ai-governance/registry/showcase',
  '/workspace/ai-governance/artifacts/governed',
  '/workspace/ai-governance/demonstrations',
  '/workspace/ai-governance/reviews',
];

function signal(pagePath:string,targetHref:string,targetText:string){
  void fetch('/api/seo-intelligence/collect',{method:'POST',headers:{'content-type':'application/json'},credentials:'same-origin',keepalive:true,body:JSON.stringify({eventType:'click',pagePath,pageTitle:document.title,referrer:document.referrer,targetHref,targetText})}).catch(()=>{});
}

export function CommercialTrialConversion(){
  const pathname=usePathname();
  const [visible,setVisible]=useState(false);
  const eligible=useMemo(()=>commercialPaths.some(p=>pathname===p||pathname.startsWith(`${p}/`)),[pathname]);
  useEffect(()=>{
    if(!eligible||pathname==='/start-free'||pathname.startsWith('/trial-')){setVisible(false);return;}
    const timer=window.setTimeout(()=>setVisible(true),18000);
    return()=>window.clearTimeout(timer);
  },[eligible,pathname]);
  if(!eligible||!visible)return null;
  const href=`/start-free?source=contextual-conversion&from=${encodeURIComponent(pathname)}`;
  return <aside aria-label="60-day TA-14 trial" style={{position:'fixed',left:'max(16px,calc((100vw - 1280px)/2))',bottom:18,zIndex:45,width:'min(430px,calc(100vw - 32px))',padding:18,border:'1px solid rgba(107,224,255,.48)',borderRadius:16,background:'linear-gradient(145deg,rgba(3,15,25,.98),rgba(6,31,44,.98))',boxShadow:'0 24px 70px rgba(0,0,0,.48)',color:'#eaf8ff',fontFamily:'Inter,system-ui,sans-serif'}}>
    <button aria-label="Dismiss trial offer" onClick={()=>setVisible(false)} style={{position:'absolute',right:10,top:8,border:0,background:'transparent',color:'#7893a4',cursor:'pointer',fontSize:18}}>×</button>
    <div style={{fontSize:9,fontWeight:950,letterSpacing:'.16em',color:'#68ddff'}}>KEEP THIS WORK GOING</div>
    <strong style={{display:'block',margin:'8px 26px 5px 0',fontFamily:'Georgia,serif',fontSize:22,lineHeight:1.15}}>Continue in your own TA-14 workspace.</strong>
    <p style={{margin:'0 0 13px',fontSize:11,lineHeight:1.55,color:'#9db5c4'}}>Preserve the work, bring a real AI system, and continue governing evidence and consequence. 60 days free. No credit card. No contract.</p>
    <Link href={href} onClick={()=>signal(pathname,href,'Contextual 60-day trial CTA')} style={{display:'block',padding:'13px 15px',textAlign:'center',textDecoration:'none',background:'#86e9ff',color:'#021018',fontSize:10,fontWeight:1000,letterSpacing:'.08em'}}>START MY 60 DAYS FREE →</Link>
    <small style={{display:'block',marginTop:9,textAlign:'center',color:'#688596',fontSize:9}}>Then $19 / $49 / $99 monthly only if you choose to continue.</small>
  </aside>;
}
