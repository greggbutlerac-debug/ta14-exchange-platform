import Link from 'next/link';

export { dynamic } from '../../../../workspace/ai-governance/registry/showcase/page';

export const metadata = {
  title: 'TA-14 Governance Showcase | AI Governance Exchange',
  description:
    'Explore independent governance architectures, founding demonstrations, governed artifacts, evidence, and public chronology in the TA-14 AI Governance Exchange.',
};

export default async function PublicGovernanceShowcasePage() {
  const { default: WorkspaceShowcase } = await import('../../../../workspace/ai-governance/registry/showcase/page');
  return (
    <>
      <div style={{position:'relative',zIndex:20,background:'#020812',borderBottom:'1px solid rgba(226,177,79,.18)',padding:'10px 20px',color:'#a9bfd2',fontSize:12,textAlign:'center'}}>
        Public Governance Showcase · <Link href="/registry" style={{color:'#efc66f',fontWeight:800,textDecoration:'none'}}>Authoritative Public Registry</Link>
      </div>
      <WorkspaceShowcase />
    </>
  );
}
