import Link from 'next/link';
import type { ReactNode } from 'react';

export default function EnvironmentalIntegrityLayout({children}:{children:ReactNode}){
  return <>
    {children}
    <Link
      href='/environmental-integrity-governance/demonstrations'
      aria-label='Open Environmental Proving Ground'
      style={{
        position:'fixed',right:18,bottom:18,zIndex:95,
        display:'flex',alignItems:'center',gap:12,
        minHeight:64,padding:'10px 16px',border:'1px solid rgba(116,235,182,.62)',
        borderRadius:16,background:'linear-gradient(135deg,rgba(6,45,32,.98),rgba(3,18,14,.98))',
        boxShadow:'0 18px 50px rgba(0,0,0,.42),0 0 32px rgba(83,220,163,.18)',
        color:'#eefbf5',textDecoration:'none',backdropFilter:'blur(18px)'
      }}
    >
      <span style={{width:42,height:42,display:'grid',placeItems:'center',borderRadius:11,background:'linear-gradient(135deg,#b7ffe0,#58dda7)',color:'#04140e',fontWeight:950,fontSize:12}}>EIG</span>
      <span>
        <small style={{display:'block',color:'#79dbae',fontSize:8,fontWeight:900,letterSpacing:'.14em'}}>DOOR 03 · PROVING GROUND</small>
        <strong style={{display:'block',marginTop:3,fontSize:12,letterSpacing:'.04em'}}>RUN GOVERNED DEMONSTRATIONS →</strong>
        <small style={{display:'block',marginTop:3,color:'#92ad9f',fontSize:8}}>Conflicting records · consequence-relative admissibility</small>
      </span>
    </Link>
  </>;
}
