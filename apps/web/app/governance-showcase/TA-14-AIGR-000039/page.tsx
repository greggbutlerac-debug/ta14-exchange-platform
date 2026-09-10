// Canonical public presentation for TA-14 Admissible Computation Architecture v1.1.
// A static route intentionally takes precedence over the generic governance-showcase projection.
import Link from 'next/link';
import ACAShowcase, { metadata } from '../../public/ai-governance/registry/showcase/TA-14-AIGR-000039/page';

export { metadata };

export default function CanonicalACAShowcase(){
  return <>
    <ACAShowcase />
    <Link
      href="/governance-showcase/TA-14-AIGR-000039/continuing-standing"
      style={{position:'fixed',right:18,bottom:18,zIndex:1000,display:'inline-flex',alignItems:'center',minHeight:50,padding:'0 18px',borderRadius:12,background:'linear-gradient(135deg,#f3d27f,#d9a83e)',color:'#07111b',fontFamily:'Inter,ui-sans-serif,system-ui,sans-serif',fontWeight:950,fontSize:13,textDecoration:'none',boxShadow:'0 12px 36px rgba(0,0,0,.38)'}}
    >
      T0 → T1 · CONTINUING STANDING
    </Link>
  </>;
}
