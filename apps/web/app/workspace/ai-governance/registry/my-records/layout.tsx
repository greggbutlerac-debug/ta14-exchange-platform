import Link from 'next/link';
import type { ReactNode } from 'react';

export default function MyRegistryRecordsLayout({ children }: { children: ReactNode }) {
  return <>
    <div style={{background:'#0b192f',borderBottom:'1px solid rgba(127,228,196,.25)',padding:'12px 20px',color:'#eef4ff',fontFamily:'Inter,system-ui,sans-serif'}}>
      <div style={{width:'min(1180px,100%)',margin:'0 auto',display:'flex',gap:16,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap'}}>
        <div>
          <strong style={{display:'block',fontSize:13,letterSpacing:'.08em',color:'#7fe4c4'}}>REGISTERED PARTICIPANT CONTINUATION</strong>
          <span style={{fontSize:13,color:'#aebdd4'}}>Already registered? Reopen your account-scoped Registry workspace to review the separate, voluntary TA-14 workspace continuation.</span>
        </div>
        <Link href="/workspace/ai-governance/registry/continuation" style={{display:'inline-flex',padding:'10px 14px',borderRadius:11,background:'#ffd27f',color:'#171005',fontWeight:900,textDecoration:'none',whiteSpace:'nowrap'}}>Open Registered Continuation →</Link>
      </div>
    </div>
    {children}
  </>;
}
