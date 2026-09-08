import Link from 'next/link';
import type {ReactNode} from 'react';

export default function RegistryLayout({children}:{children:ReactNode}){
  return <>
    {children}
    <section className="aca-registry-feature" aria-label="Admissible Computation Architecture">
      <div className="aca-registry-inner">
        <div className="aca-registry-copy">
          <p>FEATURED LIVE ARCHITECTURE · TA-14-AIGR-000039</p>
          <h2>Admissible Computation Architecture <em>ACA</em></h2>
          <h3>Before computation becomes consequence.</h3>
          <span>Move from the registered architecture to an operating admissibility gateway, then test the proposition in a falsifiable pilot environment. The pilot is designed to preserve negative results rather than assume computational or environmental savings.</span>
        </div>
        <div className="aca-registry-actions">
          <Link className="primary" href="/ai-governance/admissible-computation/search">TRY THE ACA ENGINE →</Link>
          <Link href="/ai-governance/admissible-computation/pilot-lab">OPEN PILOT LAB →</Link>
          <Link href="/ai-governance/admissible-computation/pilot-kit">VIEW PILOT PROTOCOL →</Link>
          <Link href="/registry/TA-14-AIGR-000039">OPEN REGISTRY RECORD →</Link>
        </div>
      </div>
      <style>{`.aca-registry-feature{background:radial-gradient(circle at 85% 20%,rgba(99,216,255,.12),transparent 28rem),linear-gradient(135deg,#06111d,#02070d);color:#eef6ff;border-top:1px solid rgba(244,186,84,.32);border-bottom:1px solid rgba(99,216,255,.16);padding:64px 24px 72px;font-family:Inter,system-ui,sans-serif}.aca-registry-inner{max-width:1320px;margin:auto;display:grid;grid-template-columns:1.25fr .75fr;gap:70px;align-items:center}.aca-registry-copy p{margin:0 0 14px;color:#f4ba54;font-size:9px;font-weight:800;letter-spacing:.22em}.aca-registry-copy h2{font:400 clamp(34px,4vw,54px)/1.05 Georgia,serif;margin:0 0 12px}.aca-registry-copy h2 em{font-style:normal;color:#63d8ff}.aca-registry-copy h3{font:400 20px Georgia,serif;color:#a9c9df;margin:0 0 20px}.aca-registry-copy span{display:block;max-width:760px;color:#8fa5b8;font-size:13px;line-height:1.75}.aca-registry-actions{display:grid;gap:10px}.aca-registry-actions a{display:block;padding:15px 17px;border:1px solid rgba(99,216,255,.25);background:rgba(9,26,43,.72);color:#dcecf6;text-decoration:none;font-size:9px;font-weight:800;letter-spacing:.12em}.aca-registry-actions a.primary{background:linear-gradient(135deg,#e8ad45,#ffd77d);border:0;color:#08111a}.aca-registry-actions a:hover{transform:translateX(3px)}@media(max-width:850px){.aca-registry-inner{grid-template-columns:1fr;gap:34px}}`}</style>
    </section>
  </>;
}
