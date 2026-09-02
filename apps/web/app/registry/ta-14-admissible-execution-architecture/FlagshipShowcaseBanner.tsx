'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const showcasePath = '/registry/ta-14-admissible-execution-architecture/showcase/cross-architecture-revalidation';

export default function FlagshipShowcaseBanner() {
  const pathname = usePathname();
  if (pathname === showcasePath || pathname.startsWith(`${showcasePath}/`)) return null;

  return (
    <div style={{position:'relative',zIndex:50,borderBottom:'1px solid rgba(109,216,255,.18)',background:'linear-gradient(90deg,rgba(4,16,29,.98),rgba(7,31,49,.98),rgba(4,16,29,.98))',color:'#eef8ff'}}>
      <div style={{width:'min(1200px,calc(100% - 40px))',margin:'0 auto',minHeight:68,display:'flex',alignItems:'center',justifyContent:'space-between',gap:18,padding:'10px 0',flexWrap:'wrap'}}>
        <div><div style={{fontSize:9,fontWeight:900,letterSpacing:'.18em',color:'#f2bf6d'}}>FLAGSHIP FOUNDING SHOWCASE</div><div style={{marginTop:4,fontSize:13,fontWeight:800}}>ONUMA / RE1 → Changed-Context Revalidation → U.S. 19/794,767 → PAE</div></div>
        <Link href={showcasePath} style={{display:'inline-flex',alignItems:'center',gap:9,minHeight:40,padding:'0 15px',borderRadius:12,border:'1px solid rgba(109,216,255,.35)',background:'rgba(20,83,116,.35)',color:'#bcecff',fontSize:11,fontWeight:900,textDecoration:'none',letterSpacing:'.035em'}}>OPEN FOUNDING SHOWCASE <span aria-hidden="true">→</span></Link>
      </div>
    </div>
  );
}
