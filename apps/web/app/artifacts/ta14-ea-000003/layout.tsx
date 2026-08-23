import type { ReactNode } from 'react';
import ExecutableArtifactProof from '../components/ExecutableArtifactProof';
import FoundingArtifactCopyCorrections from '../components/FoundingArtifactCopyCorrections';

const auditUrl='https://github.com/greggbutlerac-debug/ta14-exchange-platform/blob/main/docs/audits/2026-08-23-artifact-integrity-parity-audit.md';

export default function Layout({children}:{children:ReactNode}){
 return <>
  <FoundingArtifactCopyCorrections artifactId='TA14-EA-000003' sequence={3}/>
  {children}
  <section style={{maxWidth:1180,margin:'28px auto 0',padding:'0 24px'}}>
   <div style={{padding:20,border:'1px solid rgba(242,204,104,.45)',borderRadius:14,background:'rgba(242,204,104,.06)',color:'#eef6ff'}}>
    <div style={{fontSize:12,letterSpacing:1.8,fontWeight:900,color:'#f2cc68'}}>OPEN INTEGRITY CORRESPONDENCE CONDITION</div>
    <p style={{margin:'10px 0 8px',lineHeight:1.7,color:'#c8d6df'}}>The historical public RECORD_HASH, PACKAGE_HASH, and RECEIPT_HASH values on TA14-EA-000003 are also present on TA14-EA-000006 even though the two artifacts describe materially different events. TA-14 has preserved the published values and opened a parity audit rather than manufacturing replacement historical digests.</p>
    <p style={{margin:'0 0 10px',lineHeight:1.7,color:'#aebfca'}}>This condition is unresolved pending recovery or reconstruction of the canonical source/package/receipt objects. The executable proof shown below is a separate current evidence package and does not silently rewrite the historical integrity constants.</p>
    <a href={auditUrl} target='_blank' rel='noreferrer' style={{color:'#7fdfff',fontWeight:800}}>Inspect the preserved integrity parity audit ↗</a>
   </div>
  </section>
  <ExecutableArtifactProof artifactId='TA14-EA-000003'/>
 </>;
}
