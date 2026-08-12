import Link from 'next/link';
import type { ReactNode } from 'react';

export default function EUAIActWorldLayout({children}:{children:ReactNode}){
  return <>
    <div style={{position:'relative',zIndex:1000,display:'flex',justifyContent:'center',alignItems:'center',gap:16,flexWrap:'wrap',padding:'10px 18px',background:'linear-gradient(90deg,#071a36,#0b315d,#071a36)',borderBottom:'1px solid rgba(106,213,255,.45)',color:'#eaf8ff',fontFamily:'Inter,system-ui,sans-serif',fontSize:12,letterSpacing:1}}>
      <strong style={{color:'#7ee6ff'}}>GOVERNED WORLD 05 · EU AI ACT</strong>
      <span style={{color:'#b7cce0'}}>Evidence · Readiness · Governance · Lifecycle · Revalidation</span>
      <Link href="/eu-ai-act/start" style={{padding:'7px 12px',border:'1px solid #7ee6ff',borderRadius:999,textDecoration:'none',fontWeight:900,color:'#071a36',background:'#7ee6ff'}}>CHECK MY POSITION — FREE →</Link>
      <Link href="/eu-ai-act/commercial" style={{padding:'7px 12px',border:'1px solid #7ee6ff',borderRadius:999,textDecoration:'none',fontWeight:900,color:'#7ee6ff'}}>ACCESS & PRICING →</Link>
    </div>
    {children}
  </>
}
